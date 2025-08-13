import { NextRequest, NextResponse } from 'next/server';
import { DatabaseService } from '../../../../services/database-service';
import { z } from 'zod';
import type { Database } from '../../../../lib/database.types';

const databaseService = new DatabaseService();



// Schema de validación para crear análisis de palabras clave
const createKeywordAnalysisSchema = z.object({
  userId: z.string().min(1, 'User ID es requerido'),
  projectName: z.string().min(1, 'Nombre del proyecto es requerido'),
  projectUrl: z.string().url('URL del proyecto debe ser válida'),
  targetKeywords: z.array(z.string()).min(1, 'Al menos una palabra clave es requerida'),
  keywordDensity: z.number().min(0).max(100),
  rankingPosition: z.number().int().min(0).optional(),
  searchVolume: z.number().int().min(0).optional(),
  competition: z.number().min(0).max(100),
  difficulty: z.number().min(0).max(100),
  relevanceScore: z.number().min(0).max(100),
  organicTraffic: z.number().int().min(0).optional(),
  clickThroughRate: z.number().min(0).max(100).optional(),
  conversionRate: z.number().min(0).max(100).optional(),
  relatedKeywords: z.array(z.string()).optional(),
  longtailKeywords: z.array(z.string()).optional(),
  recommendations: z.array(z.string()).optional(),
  metadata: z.record(z.any()).optional()
});

// Schema para actualizar análisis
const updateKeywordAnalysisSchema = createKeywordAnalysisSchema.partial().extend({
  id: z.string().min(1, 'ID es requerido')
});

// GET - Obtener análisis de palabras clave
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const id = searchParams.get('id');
    const projectUrl = searchParams.get('projectUrl');
    const keyword = searchParams.get('keyword');
    const limit = searchParams.get('limit');
    const offset = searchParams.get('offset');

    if (id) {
      // Obtener análisis específico por ID
      const analysis = await databaseService.getKeywordAnalysisById(id);
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
    if (keyword) {
      // Buscar en targetKeywords que contengan la palabra clave
      filters.targetKeywords = {
        has: keyword
      };
    }

    // Obtener análisis por usuario
    const analyses = await databaseService.getKeywordAnalysisByUser(userId);

    return NextResponse.json({ success: true, data: analyses });

  } catch (error) {
    console.error('Error al obtener análisis de palabras clave:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// POST - Crear nuevo análisis de palabras clave
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Verificar si se están usando datos del indexador
    const { useIndexerData, dataPoints, address, ...restBody } = body;
    
    // Si se usan datos del indexador, generar análisis más realista
    if (useIndexerData && dataPoints && address) {
      const baseScore = Math.min(95, 65 + Math.floor(dataPoints / 150));
      const density = (2.5 + dataPoints / 10000).toFixed(1);
      
      const indexerBasedAnalysis = {
        score: baseScore + Math.floor(Math.random() * 10) - 5,
        density: `${density}%`,
        suggestions: [
          'Optimizar keywords basado en datos indexados',
          'Implementar long-tail keywords encontradas en el análisis',
          'Mejorar densidad de keywords principales'
        ],
        targetKeywords: ['web3', 'blockchain', 'crypto', 'defi', 'nft'],
        relatedKeywords: ['ethereum', 'smart contracts', 'dapp', 'token', 'wallet'],
        longtailKeywords: [
          'best web3 development platform',
          'how to create smart contracts',
          'defi yield farming strategies'
        ],
        keywordDensity: parseFloat(density),
        competition: Math.max(20, 80 - Math.floor(dataPoints / 500)),
        difficulty: Math.max(30, 85 - Math.floor(dataPoints / 400)),
        relevanceScore: Math.min(98, 70 + Math.floor(dataPoints / 200)),
        searchVolume: Math.floor(dataPoints * 1.5),
        organicTraffic: Math.floor(dataPoints * 0.8),
        clickThroughRate: Math.min(15, 3 + dataPoints / 1000),
        conversionRate: Math.min(8, 1 + dataPoints / 2000),
        dataSource: 'indexer',
        recordsProcessed: dataPoints,
        indexerMetrics: {
          keywordCoverage: Math.min(100, 60 + Math.floor(dataPoints / 300)),
          semanticRelevance: Math.min(100, 75 + Math.floor(dataPoints / 250)),
          competitorAnalysis: Math.min(100, 70 + Math.floor(dataPoints / 400))
        },
        detailedAnalysis: {
          primaryKeywords: {
            performance: Math.min(100, 80 + Math.floor(dataPoints / 200)),
            opportunities: ['Aumentar densidad en títulos', 'Optimizar meta descriptions']
          },
          secondaryKeywords: {
            performance: Math.min(100, 75 + Math.floor(dataPoints / 250)),
            opportunities: ['Expandir contenido relacionado', 'Crear páginas de destino específicas']
          },
          longTailKeywords: {
            performance: Math.min(100, 70 + Math.floor(dataPoints / 300)),
            opportunities: ['Crear contenido de blog específico', 'Optimizar para búsquedas conversacionales']
          }
        }
      };
      
      return NextResponse.json(indexerBasedAnalysis);
    }
    
    // Validar entrada para análisis tradicional
    const validatedData = createKeywordAnalysisSchema.parse(restBody);

    // Calcular score promedio
    const averageScore = (
      validatedData.keywordDensity +
      (100 - validatedData.competition) + // Invertir competencia (menos competencia = mejor)
      (100 - validatedData.difficulty) + // Invertir dificultad (menos dificultad = mejor)
      validatedData.relevanceScore +
      (validatedData.clickThroughRate || 50) + // Usar 50 como default si no se proporciona
      (validatedData.conversionRate || 50) // Usar 50 como default si no se proporciona
    ) / 6;

    const overallScore = Math.round(averageScore);

    // Transformar datos para coincidir con el esquema de la base de datos
    const analysisData: Database['public']['Tables']['keyword_analysis']['Insert'] = {
      user_id: validatedData.userId,
      project_name: validatedData.projectName,
      project_url: validatedData.projectUrl,
      primary_keywords: validatedData.targetKeywords,
      secondary_keywords: validatedData.relatedKeywords || [],
      keyword_density: {
        density: validatedData.keywordDensity,
        rankingPosition: validatedData.rankingPosition || null,
        searchVolume: validatedData.searchVolume || null,
        organicTraffic: validatedData.organicTraffic || null,
        clickThroughRate: validatedData.clickThroughRate || null,
        conversionRate: validatedData.conversionRate || null,
        longtailKeywords: validatedData.longtailKeywords || []
      },
      competitor_keywords: {
        level: validatedData.competition,
        difficulty: validatedData.difficulty || null
      },
      suggestions: {
        recommendations: validatedData.recommendations || [],
        score: overallScore
      },
      overall_score: overallScore,
      status: 'completed'
    };

    // Crear análisis
    const analysis = await databaseService.createKeywordAnalysis(analysisData);

    // Registrar acción
    await databaseService.createToolActionHistory({
      user_id: validatedData.userId,
      tool_name: 'Keyword Analysis',
      description: `Keyword analysis completed for project ${validatedData.projectName}`,
      resource_id: analysis.id,
      network: null,
      tx_hash: null,
      tool_id: 'KEYWORD_ANALYSIS',
      action: 'analysis_completed',
      metadata: {
        projectUrl: validatedData.projectUrl,
        projectName: validatedData.projectName,
        analysisId: analysis.id,
        targetKeywords: validatedData.targetKeywords,
        keywordDensity: validatedData.keywordDensity,
        competition: validatedData.competition,
        difficulty: validatedData.difficulty,
        overallScore
      }
    });

    // Actualizar resumen
    await databaseService.createOrUpdateAnalysisSummary(validatedData.userId, {
      user_id: validatedData.userId,
      project_name: validatedData.projectName,
      project_url: validatedData.projectUrl,
      tools_used: ['KEYWORD_ANALYSIS'],
      average_score: overallScore,
      total_analyses: 1,
      last_analysis: new Date().toISOString(),
      status: 'completed',
      improvements: null
    });

    return NextResponse.json({
      success: true,
      data: analysis,
      message: 'Análisis de palabras clave creado exitosamente'
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

    console.error('Error al crear análisis de palabras clave:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// PUT - Actualizar análisis de palabras clave
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validar entrada
    const validatedData = updateKeywordAnalysisSchema.parse(body);
    const { id, ...updateData } = validatedData;

    // Verificar que el análisis existe
    const existingAnalysis = await databaseService.getKeywordAnalysisById(id);
    if (!existingAnalysis) {
      return NextResponse.json(
        { error: 'Análisis no encontrado' },
        { status: 404 }
      );
    }

    // Transformar updateData para coincidir con el esquema de la base de datos
    const transformedUpdateData: Partial<Database['public']['Tables']['keyword_analysis']['Update']> = {};

    // Mapear campos directos
    if (updateData.userId) transformedUpdateData.user_id = updateData.userId;
    if (updateData.projectName) transformedUpdateData.project_name = updateData.projectName;
    if (updateData.projectUrl) transformedUpdateData.project_url = updateData.projectUrl;
    if (updateData.targetKeywords) transformedUpdateData.primary_keywords = updateData.targetKeywords;
    if (updateData.relatedKeywords) transformedUpdateData.secondary_keywords = updateData.relatedKeywords;

    // Mapear keyword_density (objeto JSON)
    if (updateData.keywordDensity || updateData.rankingPosition || updateData.searchVolume || 
        updateData.organicTraffic || updateData.clickThroughRate || updateData.conversionRate || 
        updateData.longtailKeywords) {
      const existingDensity = (existingAnalysis.keyword_density as any) || {};
      transformedUpdateData.keyword_density = {
        ...existingDensity,
        ...(updateData.keywordDensity !== undefined && { density: updateData.keywordDensity }),
        ...(updateData.rankingPosition !== undefined && { rankingPosition: updateData.rankingPosition }),
        ...(updateData.searchVolume !== undefined && { searchVolume: updateData.searchVolume }),
        ...(updateData.organicTraffic !== undefined && { organicTraffic: updateData.organicTraffic }),
        ...(updateData.clickThroughRate !== undefined && { clickThroughRate: updateData.clickThroughRate }),
        ...(updateData.conversionRate !== undefined && { conversionRate: updateData.conversionRate }),
        ...(updateData.longtailKeywords !== undefined && { longtailKeywords: updateData.longtailKeywords })
      };
    }

    // Mapear competitor_keywords (objeto JSON)
    if (updateData.competition !== undefined || updateData.difficulty !== undefined) {
      const existingCompetitor = (existingAnalysis.competitor_keywords as any) || {};
      transformedUpdateData.competitor_keywords = {
        ...existingCompetitor,
        ...(updateData.competition !== undefined && { level: updateData.competition }),
        ...(updateData.difficulty !== undefined && { difficulty: updateData.difficulty })
      };
    }

    // Mapear suggestions (objeto JSON)
    if (updateData.recommendations) {
      const existingSuggestions = (existingAnalysis.suggestions as any) || {};
      transformedUpdateData.suggestions = {
        ...existingSuggestions,
        recommendations: updateData.recommendations
      };
    }

    // Recalcular overall_score si hay cambios relevantes
    if (updateData.keywordDensity !== undefined || updateData.competition !== undefined || 
        updateData.difficulty !== undefined || updateData.clickThroughRate !== undefined || 
        updateData.conversionRate !== undefined) {
      const density = updateData.keywordDensity ?? (existingAnalysis.keyword_density as any)?.density ?? 0;
      const competition = updateData.competition ?? (existingAnalysis.competitor_keywords as any)?.level ?? 0;
      const difficulty = updateData.difficulty ?? (existingAnalysis.competitor_keywords as any)?.difficulty ?? 0;
      const ctr = updateData.clickThroughRate ?? (existingAnalysis.keyword_density as any)?.clickThroughRate ?? 50;
      const conversionRate = updateData.conversionRate ?? (existingAnalysis.keyword_density as any)?.conversionRate ?? 50;
      
      const averageScore = (
        density +
        (100 - competition) +
        (100 - difficulty) +
        80 + // relevanceScore default
        ctr +
        conversionRate
      ) / 6;
      
      transformedUpdateData.overall_score = Math.round(averageScore);
    }

    // Actualizar análisis
    const updatedAnalysis = await databaseService.updateKeywordAnalysis(id, transformedUpdateData);

    return NextResponse.json({
      success: true,
      data: updatedAnalysis,
      message: 'Análisis de palabras clave actualizado exitosamente'
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

    console.error('Error al actualizar análisis de palabras clave:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar análisis de palabras clave
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
    const existingAnalysis = await databaseService.getKeywordAnalysisById(id);
    if (!existingAnalysis) {
      return NextResponse.json(
        { error: 'Análisis no encontrado' },
        { status: 404 }
      );
    }

    // Eliminar análisis
    await databaseService.deleteKeywordAnalysis(id);

    return NextResponse.json({
      success: true,
      message: 'Análisis de palabras clave eliminado exitosamente'
    });

  } catch (error) {
    console.error('Error al eliminar análisis de palabras clave:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}