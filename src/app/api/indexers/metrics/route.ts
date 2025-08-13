import { NextRequest, NextResponse } from 'next/server';
import { monitoring } from '@/indexer/monitoring';

// Configuración para exportación estática


export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const indexerId = searchParams.get('indexerId');
    const type = searchParams.get('type') || 'system';

    if (type === 'indexer' && indexerId) {
      // Obtener métricas de un indexer específico
      const metrics = await monitoring.getIndexerMetrics(indexerId);
      
      if (!metrics) {
        return NextResponse.json(
          { error: 'Indexer no encontrado' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: metrics
      });
    } else if (type === 'system') {
      // Obtener métricas del sistema
      const systemMetrics = await monitoring.getSystemMetrics();
      
      return NextResponse.json({
        success: true,
        data: systemMetrics
      });
    } else if (type === 'health') {
      // Obtener estado de salud del sistema
      const healthStatus = await monitoring.getHealthStatus();
      
      return NextResponse.json({
        success: true,
        data: healthStatus
      });
    } else {
      return NextResponse.json(
        { error: 'Tipo de métrica no válido. Use: system, indexer, health' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error obteniendo métricas:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error interno del servidor',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    );
  }
}

// Endpoint para limpiar cache de métricas
export async function DELETE() {
  try {
    monitoring.clearCache();
    
    return NextResponse.json({
      success: true,
      message: 'Cache de métricas limpiado'
    });
  } catch (error) {
    console.error('Error limpiando cache:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error limpiando cache',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    );
  }
}