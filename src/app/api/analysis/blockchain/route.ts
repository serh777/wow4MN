import { DatabaseService } from '@/services/database-service';
import { Database } from '@/lib/database.types';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const databaseService = new DatabaseService();



// Schema de validación para crear análisis de blockchain
const createBlockchainAnalysisSchema = z.object({
  userId: z.string().min(1, 'User ID es requerido'),
  projectName: z.string().min(1, 'Nombre del proyecto es requerido'),
  projectUrl: z.string().url('URL del proyecto debe ser válida'),
  network: z.string().min(1, 'Network es requerido'),
  contractAddress: z.string().min(1, 'Dirección del contrato es requerida'),
  tokenStandard: z.string().optional(),
  totalSupply: z.string().optional(),
  circulatingSupply: z.string().optional(),
  holders: z.number().int().min(0).optional(),
  volume24h: z.string().optional(),
  marketCap: z.string().optional(),
  contractSecurity: z.number().min(0).max(100),
  auditStatus: z.enum(['AUDITED', 'UNAUDITED', 'PENDING']),
  riskFactors: z.array(z.string()).optional(),
  recommendations: z.array(z.string()).optional(),
  metadata: z.record(z.any()).optional()
});

// Schema para actualizar análisis
const updateBlockchainAnalysisSchema = createBlockchainAnalysisSchema.partial().extend({
  id: z.string().min(1, 'ID es requerido')
});

// GET - Obtener análisis de blockchain
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const id = searchParams.get('id');
    const contractAddress = searchParams.get('contractAddress');
    const chainId = searchParams.get('chainId');
    const limit = searchParams.get('limit');
    const offset = searchParams.get('offset');

    if (id) {
      // Obtener análisis específico por ID
      const analysis = await databaseService.getBlockchainAnalysisById(id);
      if (!analysis) {
        return NextResponse.json(
          { error: 'Análisis no encontrado' },
          { status: 404 }
        );
      }
      return NextResponse.json({ success: true, data: analysis });
    }

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID es requerido' },
        { status: 400 }
      );
    }

    // Construir filtros
    const filters: any = {};
    if (contractAddress) filters.contractAddress = contractAddress;
    if (chainId) filters.chainId = parseInt(chainId);

    // Obtener análisis por usuario
    const analyses = await databaseService.getBlockchainAnalysisByUser(userId);

    return NextResponse.json({ success: true, data: analyses });

  } catch (error) {
    console.error('Error al obtener análisis de blockchain:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// POST - Crear nuevo análisis de blockchain
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validar entrada
    const validatedData = createBlockchainAnalysisSchema.parse(body);

    // Calcular score promedio
    const overallScore = validatedData.contractSecurity;

    // Transformar datos para coincidir con el esquema de la base de datos
    const analysisData: Database['public']['Tables']['blockchain_analysis']['Insert'] = {
      user_id: validatedData.userId,
      project_name: validatedData.projectName,
      project_url: validatedData.projectUrl,
      network: validatedData.network,
      contract_address: validatedData.contractAddress,
      token_metrics: {
        totalSupply: validatedData.totalSupply,
        circulatingSupply: validatedData.circulatingSupply,
        marketCap: validatedData.marketCap,
        volume24h: validatedData.volume24h
      },
      security_analysis: {
        contractSecurity: validatedData.contractSecurity,
        auditStatus: validatedData.auditStatus,
        riskFactors: validatedData.riskFactors || []
      },
      liquidity_analysis: {},
      holder_analysis: {
        holders: validatedData.holders
      },
      transaction_analysis: {},
      overall_score: Math.round(overallScore),
      status: 'completed'
    };

    // Crear análisis
    const analysis = await databaseService.createBlockchainAnalysis(analysisData);

    // Registrar acción
    await databaseService.createToolActionHistory({
      user_id: validatedData.userId,
      tool_name: 'Blockchain Analysis',
      description: `Blockchain analysis completed for project ${validatedData.projectName}`,
      resource_id: analysis.id,
      network: validatedData.network,
      tx_hash: null,
      tool_id: 'BLOCKCHAIN_ANALYSIS',
      action: 'analysis_completed',
      metadata: {
        projectUrl: validatedData.projectUrl,
        projectName: validatedData.projectName,
        analysisId: analysis.id,
        network: validatedData.network,
        contractAddress: validatedData.contractAddress,
        overallScore
      }
    });

    // Actualizar resumen
    await databaseService.createOrUpdateAnalysisSummary(validatedData.userId, {
      user_id: validatedData.userId,
      project_name: validatedData.projectName,
      project_url: validatedData.projectUrl,
      tools_used: ['BLOCKCHAIN_ANALYSIS'],
      average_score: overallScore,
      total_analyses: 1,
      last_analysis: new Date().toISOString(),
      status: 'completed',
      improvements: null
    });

    return NextResponse.json({
      success: true,
      data: analysis,
      message: 'Análisis de blockchain creado exitosamente'
    }, { status: 201 });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Datos inválidos',
          details: error.errors
        },
        { status: 400 }
      );
    }

    console.error('Error al crear análisis de blockchain:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// PUT - Actualizar análisis de blockchain
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validar entrada
    const validatedData = updateBlockchainAnalysisSchema.parse(body);
    const { id, ...updateData } = validatedData;

    // Verificar que el análisis existe
    const existingAnalysis = await databaseService.getBlockchainAnalysisById(id);
    if (!existingAnalysis) {
      return NextResponse.json(
        { error: 'Análisis no encontrado' },
        { status: 404 }
      );
    }

    // Actualizar análisis
    const updatedAnalysis = await databaseService.updateBlockchainAnalysis(id, updateData);

    return NextResponse.json({
      success: true,
      data: updatedAnalysis,
      message: 'Análisis de blockchain actualizado exitosamente'
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Datos inválidos',
          details: error.errors
        },
        { status: 400 }
      );
    }

    console.error('Error al actualizar análisis de blockchain:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar análisis de blockchain
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'ID es requerido' },
        { status: 400 }
      );
    }

    // Verificar que el análisis existe
    const existingAnalysis = await databaseService.getBlockchainAnalysisById(id);
    if (!existingAnalysis) {
      return NextResponse.json(
        { error: 'Análisis no encontrado' },
        { status: 404 }
      );
    }

    // Eliminar análisis
    await databaseService.deleteBlockchainAnalysis(id);

    return NextResponse.json({
      success: true,
      message: 'Análisis de blockchain eliminado exitosamente'
    });

  } catch (error) {
    console.error('Error al eliminar análisis de blockchain:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}