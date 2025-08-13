import { NextRequest, NextResponse } from 'next/server';
import { DatabaseService } from '@/services/database-service';
import { Database } from '@/lib/database.types';
import { z } from 'zod';

const databaseService = new DatabaseService();



// Schema de validación para crear análisis de competencia
const createCompetitionAnalysisSchema = z.object({
  userId: z.string().min(1, 'User ID es requerido'),
  projectName: z.string().min(1, 'Nombre del proyecto es requerido'),
  projectUrl: z.string().url('URL del proyecto debe ser válida'),
  competitors: z.array(z.string().url()).min(1, 'Al menos un competidor es requerido'),
  marketPosition: z.number().min(1).max(100),
  competitiveAdvantage: z.number().min(0).max(100),
  threatLevel: z.number().min(0).max(100),
  opportunityScore: z.number().min(0).max(100),
  overallScore: z.number().min(0).max(100),
  trafficComparison: z.record(z.number()).optional(),
  keywordOverlap: z.record(z.number()).optional(),
  backlinksComparison: z.record(z.number()).optional(),
  socialMediaPresence: z.record(z.number()).optional(),
  contentGaps: z.array(z.string()).optional(),
  strengthsWeaknesses: z.record(z.array(z.string())).optional(),
  recommendations: z.array(z.string()).optional(),
  metadata: z.record(z.any()).optional()
});

// Schema para actualizar análisis
const updateCompetitionAnalysisSchema = createCompetitionAnalysisSchema.partial().extend({
  id: z.string().min(1, 'ID es requerido')
});

// GET - Obtener análisis de competencia
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const id = searchParams.get('id');
    const projectUrl = searchParams.get('projectUrl');
    const competitor = searchParams.get('competitor');
    const minScore = searchParams.get('minScore');
    const maxScore = searchParams.get('maxScore');
    const limit = searchParams.get('limit');
    const offset = searchParams.get('offset');

    if (id) {
      // Obtener análisis específico por ID
      const analysis = await databaseService.getCompetitionAnalysisById(id);
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
    if (projectUrl) filters.projectUrl = projectUrl;
    if (competitor) {
      filters.competitors = {
        has: competitor
      };
    }
    if (minScore) {
      filters.overallScore = {
        gte: parseFloat(minScore)
      };
    }
    if (maxScore) {
      filters.overallScore = {
        ...filters.overallScore,
        lte: parseFloat(maxScore)
      };
    }

    // Obtener análisis por usuario
    const analyses = await databaseService.getCompetitionAnalysisByUser(userId);

    // Calcular estadísticas agregadas
    const allCompetitors = new Set();
    analyses.forEach((analysis: any) => {
      if (analysis.competitors && Array.isArray(analysis.competitors)) {
        analysis.competitors.forEach((comp: any) => {
          if (typeof comp === 'string') {
            allCompetitors.add(comp);
          }
        });
      }
    });

    const stats = {
      totalAnalyses: analyses.length,
      uniqueCompetitors: allCompetitors.size,
      averageMarketPosition: analyses.length > 0 
        ? analyses.reduce((sum, a) => {
            const marketPosition = a.market_position as any;
            return sum + (marketPosition?.position || 0);
          }, 0) / analyses.length
        : 0,
      averageCompetitiveAdvantage: analyses.length > 0 
        ? analyses.reduce((sum, a) => {
            const strengths = a.strengths as any;
            return sum + (strengths?.score || 0);
          }, 0) / analyses.length
        : 0,
      averageThreatLevel: analyses.length > 0 
        ? analyses.reduce((sum, a) => {
            const weaknesses = a.weaknesses as any;
            return sum + (weaknesses?.level || 0);
          }, 0) / analyses.length
        : 0,
      averageOpportunityScore: analyses.length > 0 
        ? analyses.reduce((sum, a) => {
            const opportunities = a.opportunities as any;
            return sum + (opportunities?.score || 0);
          }, 0) / analyses.length
        : 0,
      topCompetitors: Array.from(allCompetitors).slice(0, 10),
      strongPositions: analyses.filter(a => {
        const marketPosition = a.market_position as any;
        return (marketPosition?.position || 0) >= 70;
      }).length,
      highThreats: analyses.filter(a => {
        const weaknesses = a.weaknesses as any;
        return (weaknesses?.level || 0) >= 70;
      }).length,
      highOpportunities: analyses.filter(a => {
        const opportunities = a.opportunities as any;
        return (opportunities?.score || 0) >= 70;
      }).length
    };

    return NextResponse.json({ 
      success: true, 
      data: analyses,
      stats
    });

  } catch (error) {
    console.error('Error al obtener análisis de competencia:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// POST - Crear nuevo análisis de competencia
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validar entrada
    const validatedData = createCompetitionAnalysisSchema.parse(body);

    // Transformar datos para coincidir con el esquema de la base de datos
    const analysisData: Database['public']['Tables']['competition_analysis']['Insert'] = {
      user_id: validatedData.userId,
      project_name: validatedData.projectName,
      project_url: validatedData.projectUrl,
      competitors: validatedData.competitors,
      market_position: {
        position: validatedData.marketPosition,
        trafficComparison: validatedData.trafficComparison || {},
        backlinksComparison: validatedData.backlinksComparison || {}
      },
      strengths: {
        score: validatedData.competitiveAdvantage,
        keywordOverlap: validatedData.keywordOverlap || {},
        socialMediaPresence: validatedData.socialMediaPresence || {},
        advantages: validatedData.strengthsWeaknesses?.strengths || []
      },
      weaknesses: {
        contentGaps: validatedData.contentGaps || [],
        weaknesses: validatedData.strengthsWeaknesses?.weaknesses || []
      },
      opportunities: {
        score: validatedData.opportunityScore,
        recommendations: validatedData.recommendations || []
      },
      overall_score: validatedData.overallScore,
      status: 'completed'
    };

    // Crear análisis
    const analysis = await databaseService.createCompetitionAnalysis(analysisData);

    // Calcular score promedio
    const averageScore = (
      validatedData.marketPosition +
      validatedData.competitiveAdvantage +
      (100 - validatedData.threatLevel) + // Invertir threat level (menos amenaza = mejor)
      validatedData.opportunityScore +
      validatedData.overallScore
    ) / 5;

    // Determinar nivel competitivo
    let competitiveLevel = 'WEAK';
    if (validatedData.overallScore >= 80) competitiveLevel = 'DOMINANT';
    else if (validatedData.overallScore >= 60) competitiveLevel = 'STRONG';
    else if (validatedData.overallScore >= 40) competitiveLevel = 'MODERATE';

    // Registrar acción
    await databaseService.createToolActionHistory({
      user_id: validatedData.userId,
      tool_name: 'Competition Analysis',
      description: `Competition analysis completed for project ${validatedData.projectName}`,
      resource_id: analysis.id,
      network: null,
      tx_hash: null,
      tool_id: 'COMPETITION_ANALYSIS',
      action: 'analysis_completed',
      metadata: {
        projectUrl: validatedData.projectUrl,
        projectName: validatedData.projectName,
        analysisId: analysis.id,
        competitorsCount: validatedData.competitors.length,
        marketPosition: validatedData.marketPosition,
        threatLevel: validatedData.threatLevel,
        opportunityScore: validatedData.opportunityScore,
        competitiveLevel
      }
    });

    // Actualizar resumen
    await databaseService.createOrUpdateAnalysisSummary(validatedData.userId, {
      user_id: validatedData.userId,
      project_name: validatedData.projectName,
      project_url: validatedData.projectUrl,
      tools_used: ['COMPETITION_ANALYSIS'],
      average_score: validatedData.overallScore,
      total_analyses: 1,
      last_analysis: new Date().toISOString(),
      status: 'completed',
      improvements: null
    });

    return NextResponse.json({
      success: true,
      data: analysis,
      message: 'Análisis de competencia creado exitosamente'
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

    console.error('Error al crear análisis de competencia:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// PUT - Actualizar análisis de competencia
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validar entrada
    const validatedData = updateCompetitionAnalysisSchema.parse(body);
    const { id, ...updateData } = validatedData;

    // Verificar que el análisis existe
    const existingAnalysis = await databaseService.getCompetitionAnalysisById(id);
    if (!existingAnalysis) {
      return NextResponse.json(
        { error: 'Análisis no encontrado' },
        { status: 404 }
      );
    }

    // Actualizar análisis
    const updatedAnalysis = await databaseService.updateCompetitionAnalysis(id, updateData);

    return NextResponse.json({
      success: true,
      data: updatedAnalysis,
      message: 'Análisis de competencia actualizado exitosamente'
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

    console.error('Error al actualizar análisis de competencia:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar análisis de competencia
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
    const existingAnalysis = await databaseService.getCompetitionAnalysisById(id);
    if (!existingAnalysis) {
      return NextResponse.json(
        { error: 'Análisis no encontrado' },
        { status: 404 }
      );
    }

    // Eliminar análisis
    await databaseService.deleteCompetitionAnalysis(id);

    return NextResponse.json({
      success: true,
      message: 'Análisis de competencia eliminado exitosamente'
    });

  } catch (error) {
    console.error('Error al eliminar análisis de competencia:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}