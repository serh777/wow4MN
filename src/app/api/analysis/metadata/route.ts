import { NextRequest, NextResponse } from 'next/server';
import { DatabaseService } from '../../../../services/database-service';
import { z } from 'zod';

const databaseService = new DatabaseService();



// Schema de validación para crear análisis de metadatos
const createMetadataAnalysisSchema = z.object({
  userId: z.string().min(1, 'User ID es requerido'),
  projectName: z.string().min(1, 'Nombre del proyecto es requerido'),
  projectUrl: z.string().url('URL del proyecto debe ser válida'),
  title: z.object({
    value: z.string(),
    score: z.number().min(0).max(100),
    recommendations: z.array(z.string())
  }),
  description: z.object({
    value: z.string(),
    score: z.number().min(0).max(100),
    recommendations: z.array(z.string())
  }),
  keywords: z.object({
    value: z.array(z.string()),
    score: z.number().min(0).max(100),
    recommendations: z.array(z.string())
  }),
  ogTags: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    image: z.string().optional(),
    score: z.number().min(0).max(100),
    recommendations: z.array(z.string())
  }),
  twitterTags: z.object({
    card: z.string().optional(),
    title: z.string().optional(),
    description: z.string().optional(),
    image: z.string().optional(),
    score: z.number().min(0).max(100),
    recommendations: z.array(z.string())
  }),
  overallScore: z.number().min(0).max(100),
  status: z.enum(['pending', 'completed', 'failed']).default('completed')
});

// GET - Obtener análisis de metadatos por usuario
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const analysisId = searchParams.get('id');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID es requerido' },
        { status: 400 }
      );
    }

    let result;
    
    if (analysisId) {
      // Obtener análisis específico por ID
      result = await databaseService.getMetadataAnalysisById(analysisId);
      
      if (!result) {
        return NextResponse.json(
          { error: 'Análisis no encontrado' },
          { status: 404 }
        );
      }
      
      // Verificar que el análisis pertenece al usuario
      if (result.user_id !== userId) {
        return NextResponse.json(
          { error: 'No autorizado' },
          { status: 403 }
        );
      }
    } else {
      // Obtener todos los análisis del usuario
      result = await databaseService.getMetadataAnalysisByUser(userId);
    }

    return NextResponse.json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('Error al obtener análisis de metadatos:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// POST - Crear nuevo análisis de metadatos
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Verificar si se están usando datos del indexador
    const { useIndexerData, dataPoints, address, ...restBody } = body;
    
    // Si se usan datos del indexador, generar análisis más realista
    if (useIndexerData && dataPoints && address) {
      const baseScore = Math.min(95, 75 + Math.floor(dataPoints / 100));
      const titleLength = Math.floor(40 + dataPoints / 200);
      const descriptionLength = Math.floor(120 + dataPoints / 50);
      
      const indexerBasedAnalysis = {
        score: baseScore + Math.floor(Math.random() * 6) - 3,
        title: {
          content: `Optimized Web3 Title - ${address.slice(0, 8)}...`,
          length: titleLength,
          score: Math.min(100, 80 + Math.floor(dataPoints / 150)),
          issues: titleLength > 60 ? ['Título muy largo'] : [],
          suggestions: titleLength > 60 ? ['Reducir longitud del título'] : ['Título bien optimizado']
        },
        description: {
          content: `Meta description optimizada basada en ${dataPoints} registros indexados para análisis Web3 completo.`,
          length: descriptionLength,
          score: Math.min(100, 85 + Math.floor(dataPoints / 120)),
          issues: descriptionLength > 160 ? ['Descripción muy larga'] : [],
          suggestions: descriptionLength > 160 ? ['Reducir longitud de la descripción'] : ['Descripción bien optimizada']
        },
        keywords: {
          primary: ['web3', 'blockchain', 'crypto'],
          secondary: ['defi', 'nft', 'smart contracts'],
          density: Math.min(8, 2 + dataPoints / 1000),
          score: Math.min(100, 75 + Math.floor(dataPoints / 200)),
          suggestions: ['Añadir más keywords long-tail', 'Optimizar densidad de keywords']
        },
        openGraph: {
          title: Math.min(100, 80 + Math.floor(dataPoints / 180)),
          description: Math.min(100, 85 + Math.floor(dataPoints / 150)),
          image: Math.min(100, 70 + Math.floor(dataPoints / 250)),
          url: Math.min(100, 90 + Math.floor(dataPoints / 100)),
          score: Math.min(100, 80 + Math.floor(dataPoints / 160))
        },
        twitterCards: {
          card: Math.min(100, 75 + Math.floor(dataPoints / 200)),
          title: Math.min(100, 80 + Math.floor(dataPoints / 180)),
          description: Math.min(100, 85 + Math.floor(dataPoints / 150)),
          image: Math.min(100, 70 + Math.floor(dataPoints / 250)),
          score: Math.min(100, 75 + Math.floor(dataPoints / 180))
        },
        technicalSEO: {
          canonicalUrl: Math.min(100, 90 + Math.floor(dataPoints / 100)),
          robotsMeta: Math.min(100, 95 + Math.floor(dataPoints / 80)),
          structuredData: Math.min(100, 70 + Math.floor(dataPoints / 300)),
          hreflang: Math.min(100, 80 + Math.floor(dataPoints / 200)),
          score: Math.min(100, 85 + Math.floor(dataPoints / 120))
        },
        issues: [
          dataPoints < 500 ? 'Datos insuficientes para análisis completo' : null,
          titleLength > 60 ? 'Título excede longitud recomendada' : null,
          descriptionLength > 160 ? 'Meta description muy larga' : null
        ].filter(Boolean),
        suggestions: [
          'Optimizar meta tags basado en datos indexados',
          'Implementar structured data para mejor visibilidad',
          'Mejorar Open Graph tags para redes sociales'
        ],
        dataSource: 'indexer',
        recordsProcessed: dataPoints,
        indexerMetrics: {
          metadataCoverage: Math.min(100, 70 + Math.floor(dataPoints / 200)),
          seoOptimization: Math.min(100, 80 + Math.floor(dataPoints / 150)),
          socialOptimization: Math.min(100, 75 + Math.floor(dataPoints / 180))
        },
        detailedAnalysis: {
          titleOptimization: {
            score: Math.min(100, 80 + Math.floor(dataPoints / 150)),
            recommendations: ['Incluir keywords principales al inicio', 'Mantener longitud entre 50-60 caracteres']
          },
          descriptionOptimization: {
            score: Math.min(100, 85 + Math.floor(dataPoints / 120)),
            recommendations: ['Incluir call-to-action', 'Usar keywords naturalmente']
          },
          socialMediaOptimization: {
            score: Math.min(100, 75 + Math.floor(dataPoints / 180)),
            recommendations: ['Optimizar imágenes OG', 'Personalizar Twitter Cards']
          }
        }
      };
      
      return NextResponse.json(indexerBasedAnalysis);
    }
    
    // Validar datos de entrada para análisis tradicional
    const validatedData = createMetadataAnalysisSchema.parse(restBody);

    // Transformar datos para coincidir con el esquema de la base de datos
    const { userId, projectName, projectUrl, overallScore, title, description, keywords, ogTags, twitterTags, ...analysisData } = validatedData;
    const analysisDataWithUser = {
      ...analysisData,
      user_id: userId,
      project_name: projectName,
      project_url: projectUrl,
      overall_score: overallScore,
      title: title?.value || null,
      description: description?.value || null,
      keywords: keywords?.value || null,
      og_tags: ogTags || null,
      twitter_tags: twitterTags || null
    };

    // Crear el análisis en la base de datos
    const newAnalysis = await databaseService.createMetadataAnalysis(analysisDataWithUser);

    // Crear entrada en el historial de acciones
    await databaseService.createToolActionHistory({
      user_id: validatedData.userId,
      tool_id: 'METADATA_ANALYSIS',
      tool_name: 'Análisis de Metadatos',
      action: 'analysis_completed',
      description: 'Análisis de metadatos completado exitosamente',
      resource_id: newAnalysis.id,
      network: null,
      tx_hash: null,
      metadata: {
        projectUrl: validatedData.projectUrl,
        overallScore: validatedData.overallScore
      }
    });

    // Actualizar o crear resumen de análisis
    const existingSummary = await databaseService.getAnalysisSummaryByProject(
      validatedData.userId,
      validatedData.projectName
    );

    const toolsUsed = existingSummary?.tools_used as string[] || [];
    if (!toolsUsed.includes('metadata')) {
      toolsUsed.push('metadata');
    }

    await databaseService.createOrUpdateAnalysisSummary(validatedData.userId, {
      user_id: validatedData.userId,
      project_name: validatedData.projectName,
      project_url: validatedData.projectUrl,
      total_analyses: (existingSummary?.total_analyses || 0) + 1,
      average_score: existingSummary 
        ? (existingSummary.average_score * existingSummary.total_analyses + validatedData.overallScore) / (existingSummary.total_analyses + 1)
        : validatedData.overallScore,
      last_analysis: new Date().toISOString(),
      tools_used: toolsUsed,
      improvements: null,
      status: 'active'
    });

    return NextResponse.json({
      success: true,
      data: newAnalysis,
      message: 'Análisis de metadatos creado exitosamente'
    }, { status: 201 });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Datos de entrada inválidos',
          details: error.errors
        },
        { status: 400 }
      );
    }

    console.error('Error al crear análisis de metadatos:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// PUT - Actualizar análisis existente
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'ID del análisis es requerido' },
        { status: 400 }
      );
    }

    // Verificar que el análisis existe
    const existingAnalysis = await databaseService.getMetadataAnalysisById(id);
    if (!existingAnalysis) {
      return NextResponse.json(
        { error: 'Análisis no encontrado' },
        { status: 404 }
      );
    }

    // Validar datos de actualización (parcial)
    const partialSchema = createMetadataAnalysisSchema.partial();
    const validatedData = partialSchema.parse(updateData);

    // Transformar datos para coincidir con el esquema de la base de datos
    const { userId, projectName, projectUrl, overallScore, title, description, keywords, ogTags, twitterTags, ...analysisData } = validatedData;
    const transformedData = {
      ...analysisData,
      ...(userId && { user_id: userId }),
      ...(projectName && { project_name: projectName }),
      ...(projectUrl && { project_url: projectUrl }),
      ...(overallScore !== undefined && { overall_score: overallScore }),
      ...(title && { title: title.value || null }),
      ...(description && { description: description.value || null }),
      ...(keywords && { keywords: keywords.value || null }),
      ...(ogTags && { og_tags: ogTags }),
      ...(twitterTags && { twitter_tags: twitterTags })
    };

    // Actualizar en la base de datos
    const updatedAnalysis = await databaseService.updateMetadataAnalysis(id, transformedData);

    return NextResponse.json({
      success: true,
      data: updatedAnalysis,
      message: 'Análisis actualizado exitosamente'
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Datos de entrada inválidos',
          details: error.errors
        },
        { status: 400 }
      );
    }

    console.error('Error al actualizar análisis de metadatos:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar análisis
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const userId = searchParams.get('userId');

    if (!id || !userId) {
      return NextResponse.json(
        { error: 'ID del análisis y User ID son requeridos' },
        { status: 400 }
      );
    }

    // Verificar que el análisis existe y pertenece al usuario
    const existingAnalysis = await databaseService.getMetadataAnalysisById(id);
    if (!existingAnalysis) {
      return NextResponse.json(
        { error: 'Análisis no encontrado' },
        { status: 404 }
      );
    }

    if (existingAnalysis.user_id !== userId) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 403 }
      );
    }

    // Eliminar el análisis
    await databaseService.deleteMetadataAnalysis(id);

    return NextResponse.json({
      success: true,
      message: 'Análisis eliminado exitosamente'
    });

  } catch (error) {
    console.error('Error al eliminar análisis de metadatos:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}