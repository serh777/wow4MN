import { DatabaseService } from '@/services/database-service';
import { Database } from '@/lib/database.types';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const databaseService = new DatabaseService();



// Schema de validación
const dashboardQuerySchema = z.object({
  userId: z.string().min(1, 'User ID es requerido')
});

// GET - Obtener datos del dashboard del usuario
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID es requerido' },
        { status: 400 }
      );
    }

    // Validar entrada
    dashboardQuerySchema.parse({ userId });

    // Obtener datos del dashboard
    const dashboardData = await databaseService.getUserDashboardData(userId);

    // Calcular estadísticas adicionales
    const stats = {
      totalProjects: dashboardData.summaries.length,
      totalAnalyses: dashboardData.summaries.reduce((sum, summary) => sum + (summary.total_analyses || 0), 0),
      averageScore: dashboardData.summaries.length > 0 
        ? dashboardData.summaries.reduce((sum, summary) => sum + (summary.average_score || 0), 0) / dashboardData.summaries.length
        : 0,
      totalPayments: dashboardData.payments.length,
      totalSpent: dashboardData.payments
        .filter((payment) => payment.status === 'confirmed')
        .reduce((sum: number, payment) => {
          // Convertir de wei a unidades del token (asumiendo 18 decimales)
          const amount = parseFloat(payment.amount.toString()) / Math.pow(10, 18);
          return sum + amount;
        }, 0),
      recentActivity: dashboardData.recentActions.slice(0, 5),
      toolsUsage: calculateToolsUsage(dashboardData.summaries),
      monthlyAnalyses: calculateMonthlyAnalyses(dashboardData.recentActions),
      topProjects: getTopProjects(dashboardData.summaries)
    };

    return NextResponse.json({
      success: true,
      data: {
        ...dashboardData,
        stats
      }
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Parámetros inválidos',
          details: error.errors
        },
        { status: 400 }
      );
    }

    console.error('Error al obtener datos del dashboard:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// Función auxiliar para calcular uso de herramientas
function calculateToolsUsage(summaries: any[]) {
  const toolsCount: Record<string, number> = {};
  
  summaries.forEach((summary) => {
    const tools = summary.tools_used as string[];
    if (Array.isArray(tools)) {
      tools.forEach((tool: string) => {
        toolsCount[tool] = (toolsCount[tool] || 0) + 1;
      });
    }
  });

  // Convertir a array y ordenar por uso
  return Object.entries(toolsCount)
    .map(([tool, count]) => ({ tool, count }))
    .sort((a, b) => b.count - a.count);
}

// Función auxiliar para calcular análisis mensuales
function calculateMonthlyAnalyses(actions: any[]) {
  const monthlyData: Record<string, number> = {};
  
  actions
    .filter((action) => action.action === 'analysis_completed')
    .forEach((action) => {
      const month = new Date(action.created_at).toISOString().slice(0, 7); // YYYY-MM
      monthlyData[month] = (monthlyData[month] || 0) + 1;
    });

  // Obtener últimos 6 meses
  const months = [];
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthKey = date.toISOString().slice(0, 7);
    months.push({
      month: monthKey,
      count: monthlyData[monthKey] || 0
    });
  }

  return months;
}

// Función auxiliar para obtener proyectos principales
function getTopProjects(summaries: any[]) {
  return summaries
    .sort((a, b) => (b.average_score || 0) - (a.average_score || 0))
    .slice(0, 5)
    .map((summary) => ({
      name: summary.project_name,
      url: summary.project_url,
      score: summary.average_score,
      totalAnalyses: summary.total_analyses,
      lastAnalysis: summary.last_analysis
    }));
}

// POST - Crear o actualizar configuraciones del dashboard
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, settings } = body;

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID es requerido' },
        { status: 400 }
      );
    }

    // Actualizar configuraciones del usuario
    const updatedSettings = await databaseService.createOrUpdateUserSettings(userId, settings);

    return NextResponse.json({
      success: true,
      data: updatedSettings,
      message: 'Configuraciones actualizadas exitosamente'
    });

  } catch (error) {
    console.error('Error al actualizar configuraciones:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}