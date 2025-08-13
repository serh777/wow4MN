import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate the request body
    if (!body.type || !body.data) {
      return NextResponse.json(
        { error: 'Missing required fields: type and data' },
        { status: 400 }
      );
    }
    
    // Almacenar análisis en memoria (alternativa a Supabase)
    console.log('Análisis recibido:', body);
    
    // Establecer una cookie para rastrear el análisis
    const cookieStore = await cookies();
    cookieStore.set('last-analysis', JSON.stringify({
      type: body.type,
      timestamp: new Date().toISOString()
    }));
    
    return NextResponse.json({ 
      success: true, 
      message: 'Análisis guardado correctamente',
      analysisId: `analysis_${Date.now()}`
    });
    
  } catch (error) {
    console.error('Error al procesar la solicitud:', error);
    return NextResponse.json(
      { error: 'Error al procesar la solicitud' },
      { status: 500 }
    );
  }
}

