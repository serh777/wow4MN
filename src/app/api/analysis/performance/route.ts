import { NextRequest, NextResponse } from 'next/server';
import { DatabaseService } from '@/services/database-service';
import { Database } from '@/lib/database.types';
import { z } from 'zod';

const databaseService = new DatabaseService();



// Schema de validación para crear análisis de rendimiento
const createPerformanceAnalysisSchema = z.object({
  userId: z.string().min(1, 'User ID es requerido'),
  projectName: z.string().min(1, 'Nombre del proyecto es requerido'),
  projectUrl: z.string().url('URL del proyecto debe ser válida'),
  loadTime: z.number().min(0),
  pageSize: z.number().min(0),
  requests: z.number().int().min(0),
  performanceScore: z.number().min(0).max(100),
  seoScore: z.number().min(0).max(100),
  accessibilityScore: z.number().min(0).max(100),
  bestPracticesScore: z.number().min(0).max(100),
  firstContentfulPaint: z.number().min(0).optional(),
  largestContentfulPaint: z.number().min(0).optional(),
  firstInputDelay: z.number().min(0).optional(),
  cumulativeLayoutShift: z.number().min(0).optional(),
  timeToInteractive: z.number().min(0).optional(),
  speedIndex: z.number().min(0).optional(),
  mobileScore: z.number().min(0).max(100).optional(),
  desktopScore: z.number().min(0).max(100).optional(),
  issues: z.array(z.string()).optional(),
  recommendations: z.array(z.string()).optional(),
  metadata: z.record(z.any()).optional()
});

// Schema para actualizar análisis
const updatePerformanceAnalysisSchema = createPerformanceAnalysisSchema.partial().extend({
  id: z.string().min(1, 'ID es requerido')
});

// GET - Obtener análisis de rendimiento
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const id = searchParams.get('id');
    const projectUrl = searchParams.get('projectUrl');
    const minScore = searchParams.get('minScore'); // Filtrar por score mínimo
    const maxScore = searchParams.get('maxScore'); // Filtrar por score máximo
    const limit = searchParams.get('limit');
    const offset = searchParams.get('offset');

    if (id) {
      // Obtener análisis específico por ID
      const analysis = await databaseService.getPerformanceAnalysisById(id);
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
    if (minScore) {
      filters.performanceScore = {
        gte: parseFloat(minScore)
      };
    }
    if (maxScore) {
      filters.performanceScore = {
        ...filters.performanceScore,
        lte: parseFloat(maxScore)
      };
    }

    // Obtener análisis por usuario
    const analyses = await databaseService.getPerformanceAnalysisByUser(userId);

    // Calcular estadísticas agregadas
    const stats = {
      totalAnalyses: analyses.length,
      averagePerformanceScore: analyses.length > 0 
        ? analyses.reduce((sum, a) => sum + (a.overall_score || 0), 0) / analyses.length
        : 0,
      averageLoadTime: analyses.length > 0 
        ? analyses.reduce((sum, a) => {
            const pageSpeedData = a.page_speed as any;
            return sum + (pageSpeedData?.loadTime?.desktop || 0);
          }, 0) / analyses.length
        : 0,
      sitesNeedingImprovement: analyses.filter((a) => (a.overall_score || 0) < 70).length,
      topPerformingSites: analyses
        .sort((a, b) => (b.overall_score || 0) - (a.overall_score || 0))
        .slice(0, 5)
        .map((a) => {
          const pageSpeedData = a.page_speed as any;
          return {
            projectName: a.project_name,
            projectUrl: a.project_url,
            performanceScore: a.overall_score,
            loadTime: pageSpeedData?.loadTime?.desktop || 0
          };
        })
    };

    return NextResponse.json({ 
      success: true, 
      data: analyses,
      stats
    });

  } catch (error) {
    console.error('Error al obtener análisis de rendimiento:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// POST - Crear nuevo análisis de rendimiento
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validar entrada
    const validatedData = createPerformanceAnalysisSchema.parse(body);

    // Calcular score promedio
    const averageScore = (
      validatedData.performanceScore +
      validatedData.seoScore +
      validatedData.accessibilityScore +
      validatedData.bestPracticesScore +
      (validatedData.mobileScore || validatedData.performanceScore) +
      (validatedData.desktopScore || validatedData.performanceScore)
    ) / 6;

    // Transformar datos para coincidir con el esquema de la base de datos
    const analysisData: Database['public']['Tables']['performance_analysis']['Insert'] = {
      user_id: validatedData.userId,
      project_name: validatedData.projectName,
      project_url: validatedData.projectUrl,
      page_speed: {
        loadTime: {
          desktop: validatedData.loadTime,
          mobile: validatedData.loadTime
        },
        metrics: {
          requests: validatedData.requests,
          pageSize: validatedData.pageSize
        }
      },
      lighthouse_scores: {
        performance: validatedData.performanceScore,
        seo: validatedData.seoScore,
        accessibility: validatedData.accessibilityScore,
        bestPractices: validatedData.bestPracticesScore
      },
      core_web_vitals: {
        LCP: 0,
        FID: 0,
        CLS: 0
      },
      mobile_performance: {
        responsiveness: validatedData.mobileScore || validatedData.performanceScore,
        usability: 0,
        score: validatedData.mobileScore || validatedData.performanceScore
      },
      recommendations: {
        images: 0,
        css: 0,
        js: 0,
        security: {
          https: false,
          certificates: false,
          vulnerabilities: []
        },
        suggestions: []
      },
      overall_score: Math.round(averageScore),
      status: 'completed'
    };

    // Crear análisis
    const analysis = await databaseService.createPerformanceAnalysis(analysisData);

    // Determinar nivel de rendimiento
    let performanceLevel = 'POOR';
    if (validatedData.performanceScore >= 90) performanceLevel = 'EXCELLENT';
    else if (validatedData.performanceScore >= 70) performanceLevel = 'GOOD';
    else if (validatedData.performanceScore >= 50) performanceLevel = 'FAIR';

    // Registrar acción
    await databaseService.createToolActionHistory({
      user_id: validatedData.userId,
      tool_id: 'PERFORMANCE_ANALYSIS',
      tool_name: 'Análisis de Rendimiento',
      action: 'analysis_completed',
      description: 'Análisis de rendimiento completado',
      resource_id: analysis.id,
      network: null,
      tx_hash: null,
      metadata: {
        analysisId: analysis.id,
        performanceScore: analysisData.overall_score,
        performanceLevel,
        needsImprovement: (analysisData.overall_score || 0) < 70
      }
    });

    // Actualizar resumen
    await databaseService.createOrUpdateAnalysisSummary(validatedData.userId, {
      user_id: validatedData.userId,
      project_name: validatedData.projectName,
      project_url: validatedData.projectUrl,
      tools_used: ['PERFORMANCE_ANALYSIS'],
      average_score: averageScore,
      total_analyses: 1,
      last_analysis: new Date().toISOString(),
      status: 'active',
      improvements: null
    });

    return NextResponse.json({
      success: true,
      data: analysis,
      message: 'Análisis de rendimiento creado exitosamente'
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

    console.error('Error al crear análisis de rendimiento:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// PUT - Actualizar análisis de rendimiento
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validar entrada
    const validatedData = updatePerformanceAnalysisSchema.parse(body);
    const { id, ...updateData } = validatedData;

    // Verificar que el análisis existe
    const existingAnalysis = await databaseService.getPerformanceAnalysisById(id);
    if (!existingAnalysis) {
      return NextResponse.json(
        { error: 'Análisis no encontrado' },
        { status: 404 }
      );
    }

    // Actualizar análisis
    const updatedAnalysis = await databaseService.updatePerformanceAnalysis(id, updateData);

    return NextResponse.json({
      success: true,
      data: updatedAnalysis,
      message: 'Análisis de rendimiento actualizado exitosamente'
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

    console.error('Error al actualizar análisis de rendimiento:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar análisis de rendimiento
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
    const existingAnalysis = await databaseService.getPerformanceAnalysisById(id);
    if (!existingAnalysis) {
      return NextResponse.json(
        { error: 'Análisis no encontrado' },
        { status: 404 }
      );
    }

    // Eliminar análisis
    await databaseService.deletePerformanceAnalysis(id);

    return NextResponse.json({
      success: true,
      message: 'Análisis de rendimiento eliminado exitosamente'
    });

  } catch (error) {
    console.error('Error al eliminar análisis de rendimiento:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}