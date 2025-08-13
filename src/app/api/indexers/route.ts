import { DatabaseService } from '@/services/database-service';
import { Database } from '@/lib/database.types';
import { NextRequest, NextResponse } from 'next/server';

const databaseService = new DatabaseService();

// GET - Obtener todos los indexadores del usuario
export async function GET(request: NextRequest) {
  try {
    // TODO: Implementar autenticación real
    // const session = await getServerSession();
    // if (!session?.user?.id) {
    //   return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    // }
    
    // Por ahora usamos un userId de prueba
    const userId = 'test-user-id';
    
    const indexers = await databaseService.getIndexers(userId);

    // Transformar los datos para el frontend
    const transformedIndexers = await Promise.all(indexers.map(async (indexer) => {
      const configs = await databaseService.getIndexerConfigs(indexer.id);
      return {
        id: indexer.id,
        name: indexer.name,
        description: indexer.description,
        status: indexer.status,
        network: configs.find(c => c.key === 'network')?.value || 'ethereum',
        dataType: configs.find(c => c.key === 'dataTypes')?.value?.split(',') || ['blocks'],
        lastRun: indexer.last_run,
        createdAt: indexer.created_at,
      };
    }));

    return NextResponse.json({ indexers: transformedIndexers });
  } catch (error) {
    console.error('Error al obtener indexadores:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// POST - Crear un nuevo indexador
export async function POST(request: NextRequest) {
  try {
    // TODO: Implementar autenticación real
    const userId = 'test-user-id';
    
    const body = await request.json();
    const { name, description, network, dataType, filters } = body;

    // Validar datos requeridos
    if (!name || !network || !dataType) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos: name, network, dataType' },
        { status: 400 }
      );
    }

    // Crear el indexador
    const indexer = await databaseService.createIndexer({
      name,
      description,
      user_id: userId,
      status: 'inactive',
    });
    
    // Crear configuraciones del indexador
    await databaseService.upsertIndexerConfig({
      indexer_id: indexer.id,
      key: 'network',
      value: network,
    });
    
    await databaseService.upsertIndexerConfig({
      indexer_id: indexer.id,
      key: 'dataTypes',
      value: Array.isArray(dataType) ? dataType.join(',') : dataType,
    });
    
    if (filters) {
      await databaseService.upsertIndexerConfig({
        indexer_id: indexer.id,
        key: 'filters',
        value: JSON.stringify(filters),
      });
    }

    // Retornar el indexador creado con formato del frontend
    const response = {
      id: indexer.id,
      name: indexer.name,
      description: indexer.description,
      status: indexer.status,
      network,
      dataType: Array.isArray(dataType) ? dataType : [dataType],
      createdAt: indexer.created_at,
    };

    return NextResponse.json({ indexer: response }, { status: 201 });
  } catch (error) {
    console.error('Error al crear indexador:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar indexador
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const indexerId = searchParams.get('id');

    if (!indexerId) {
      return NextResponse.json(
        { error: 'ID del indexador requerido' },
        { status: 400 }
      );
    }

    // Eliminar el indexador
    const success = await databaseService.deleteIndexer(indexerId);

    if (!success) {
      return NextResponse.json(
        { error: 'Indexador no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error al eliminar indexador:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}