import { NextRequest, NextResponse } from 'next/server';
import { unifiedAnalysisService } from '@/services/unified-analysis-service';

export async function POST(request: NextRequest) {
  try {
    const { tools, address } = await request.json();
    
    if (!tools || !Array.isArray(tools) || tools.length === 0) {
      return NextResponse.json(
        { error: 'Se requiere al menos una herramienta' },
        { status: 400 }
      );
    }
    
    if (!address || typeof address !== 'string') {
      return NextResponse.json(
        { error: 'Se requiere una dirección válida' },
        { status: 400 }
      );
    }
    
    // Ejecutar análisis para todas las herramientas en paralelo
    const analysisPromises = tools.map(toolId => 
      unifiedAnalysisService.executeToolAnalysis(toolId, address)
    );
    
    const results = await Promise.all(analysisPromises);
    
    // Calcular puntuación general
    const successfulResults = results.filter(r => r.status === 'success');
    const overallScore = successfulResults.length > 0 
      ? Math.round(successfulResults.reduce((sum, r) => sum + (r.score || 0), 0) / successfulResults.length)
      : 0;
    
    return NextResponse.json({
      success: true,
      results,
      overallScore,
      summary: {
        totalTools: results.length,
        successfulTools: successfulResults.length,
        failedTools: results.length - successfulResults.length,
        avgExecutionTime: results.reduce((sum, r) => sum + r.executionTime, 0) / results.length
      }
    });
    
  } catch (error) {
    console.error('Error en análisis unificado:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const tools = searchParams.get('tools')?.split(',') || [];
  const address = searchParams.get('address') || '';
  
  if (tools.length === 0 || !address) {
    return NextResponse.json(
      { error: 'Parámetros tools y address son requeridos' },
      { status: 400 }
    );
  }
  
  try {
    // Ejecutar análisis para todas las herramientas en paralelo
    const analysisPromises = tools.map(toolId => 
      unifiedAnalysisService.executeToolAnalysis(toolId, address)
    );
    
    const results = await Promise.all(analysisPromises);
    
    // Calcular puntuación general
    const successfulResults = results.filter(r => r.status === 'success');
    const overallScore = successfulResults.length > 0 
      ? Math.round(successfulResults.reduce((sum, r) => sum + (r.score || 0), 0) / successfulResults.length)
      : 0;
    
    return NextResponse.json({
      success: true,
      results,
      overallScore,
      summary: {
        totalTools: results.length,
        successfulTools: successfulResults.length,
        failedTools: results.length - successfulResults.length,
        avgExecutionTime: results.reduce((sum, r) => sum + r.executionTime, 0) / results.length
      }
    });
    
  } catch (error) {
    console.error('Error en análisis unificado:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}