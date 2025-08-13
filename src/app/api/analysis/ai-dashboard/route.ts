import { DatabaseService } from '@/services/database-service';
import { Database } from '@/lib/database.types';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const databaseService = new DatabaseService();



// Schema de validación para crear dashboard de IA
const createAIAssistantDashboardSchema = z.object({
  userId: z.string().min(1, 'User ID es requerido'),
  projectName: z.string().min(1, 'Nombre del proyecto es requerido'),
  projectUrl: z.string().url('URL del proyecto debe ser válida'),
  modelAccuracy: z.number().min(0).max(100),
  responseTime: z.number().min(0),
  userSatisfaction: z.number().min(0).max(100),
  taskCompletion: z.number().min(0).max(100),
  efficiency: z.number().min(0).max(100),
  reliability: z.number().min(0).max(100),
  scalability: z.number().min(0).max(100),
  patterns: z.array(z.string()).optional(),
  recommendations: z.array(z.string()).optional(),
  predictions: z.array(z.string()).optional()
});

// Schema para actualizar dashboard
const updateAIAssistantDashboardSchema = createAIAssistantDashboardSchema.partial().extend({
  id: z.string().min(1, 'ID es requerido')
});

// GET - Obtener dashboards de IA
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const id = searchParams.get('id');

    if (id) {
      // Obtener análisis específico por ID
      const analysis = await databaseService.getAIAssistantDashboardById(id);
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

    // Obtener análisis por usuario
    const analyses = await databaseService.getAIAssistantDashboardByUser(userId);

    // Calcular estadísticas
    const totalAnalyses = analyses.length;
    const averageScore = totalAnalyses > 0 
      ? analyses.reduce((sum, analysis) => sum + (analysis.overall_score || 0), 0) / totalAnalyses 
      : 0;

    const stats = {
      totalAnalyses,
      averageScore,
      recentAnalyses: analyses.slice(0, 10)
    };

    return NextResponse.json({ 
      success: true, 
      data: analyses,
      stats
    });

  } catch (error) {
    console.error('Error al obtener dashboards de IA:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// POST - Crear nuevo dashboard de IA
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validar entrada
    const validatedData = createAIAssistantDashboardSchema.parse(body);

    // Calcular score promedio basado en métricas de IA
    const overallScore = (
      validatedData.modelAccuracy +
      validatedData.userSatisfaction +
      validatedData.taskCompletion +
      validatedData.efficiency +
      validatedData.reliability +
      validatedData.scalability
    ) / 6;

    // Transformar datos para coincidir con el esquema de la base de datos
    const analysisData: Database['public']['Tables']['ai_assistant_dashboard']['Insert'] = {
      user_id: validatedData.userId,
      project_name: validatedData.projectName,
      project_url: validatedData.projectUrl,
      ai_insights: {
        modelAccuracy: validatedData.modelAccuracy,
        responseTime: validatedData.responseTime,
        userSatisfaction: validatedData.userSatisfaction,
        taskCompletion: validatedData.taskCompletion,
        patterns: validatedData.patterns || [],
        predictions: validatedData.predictions || []
      },
      recommendations: validatedData.recommendations || [],
      action_items: [],
      priority_tasks: {
        efficiency: validatedData.efficiency,
        reliability: validatedData.reliability,
        scalability: validatedData.scalability
      },
      progress_tracking: {
        overallScore: overallScore
      },
      overall_score: Math.round(overallScore),
      status: 'completed'
    };

    // Crear análisis
    const analysis = await databaseService.createAIAssistantDashboard(analysisData);



    // Registrar acción
    await databaseService.createToolActionHistory({
      user_id: validatedData.userId,
      tool_name: 'AI Assistant Dashboard',
      description: `AI dashboard analysis completed for project ${validatedData.projectName}`,
      resource_id: analysis.id,
      network: null,
      tx_hash: null,
      tool_id: 'AI_ASSISTANT_DASHBOARD',
      action: 'analysis_completed',
      metadata: {
        projectUrl: validatedData.projectUrl,
        projectName: validatedData.projectName,
        analysisId: analysis.id,
        overallScore
      }
    });

    // Actualizar resumen
    await databaseService.createOrUpdateAnalysisSummary(validatedData.userId, {
      user_id: validatedData.userId,
      project_name: validatedData.projectName,
      project_url: validatedData.projectUrl,
      tools_used: ['AI_DASHBOARD'],
      average_score: overallScore,
      total_analyses: 1,
      last_analysis: new Date().toISOString(),
      status: 'completed',
      improvements: null
    });

    return NextResponse.json({
      success: true,
      data: analysis,
      message: 'Análisis de IA creado exitosamente'
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

    console.error('Error al crear dashboard de IA:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// PUT - Actualizar dashboard de IA
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validar entrada
    const validatedData = updateAIAssistantDashboardSchema.parse(body);
    const { id, ...updateData } = validatedData;

    // Verificar que el dashboard existe
    const existingDashboard = await databaseService.getAIAssistantDashboardById(id);
    if (!existingDashboard) {
      return NextResponse.json(
        { error: 'Dashboard no encontrado' },
        { status: 404 }
      );
    }

    // Actualizar dashboard
    const updatedDashboard = await databaseService.updateAIAssistantDashboard(id, updateData);

    return NextResponse.json({
      success: true,
      data: updatedDashboard,
      message: 'Dashboard de IA actualizado exitosamente'
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

    console.error('Error al actualizar dashboard de IA:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar dashboard de IA
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

    // Verificar que el dashboard existe
    const existingDashboard = await databaseService.getAIAssistantDashboardById(id);
    if (!existingDashboard) {
      return NextResponse.json(
        { error: 'Dashboard no encontrado' },
        { status: 404 }
      );
    }

    // Eliminar dashboard
    await databaseService.deleteAIAssistantDashboard(id);

    return NextResponse.json({
      success: true,
      message: 'Dashboard de IA eliminado exitosamente'
    });

  } catch (error) {
    console.error('Error al eliminar dashboard de IA:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}