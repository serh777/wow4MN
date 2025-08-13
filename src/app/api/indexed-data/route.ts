import { DatabaseService } from '@/services/database-service';
import { Database } from '@/lib/database.types';
import { NextRequest, NextResponse } from 'next/server';

// Configuración para exportación estática


const databaseService = new DatabaseService();

// GET - Consultar datos indexados
export async function GET(request: NextRequest) {
  try {
    // Usar valores por defecto para exportación estática
    const network = 'ethereum';
    const address = null;
    const fromBlock = null;
    const toBlock = null;
    const fromTimestamp = null;
    const toTimestamp = null;
    const dataTypes = ['blocks'];
    const page = 1;
    const limit = 50;
    const offset = (page - 1) * limit;

    let results: any = {
      data: [],
      pagination: {
        total: 0,
        page,
        limit,
      },
    };

    // Usar el servicio de base de datos ya inicializado
    
    // Construir filtros base
    const timeFilter: any = {};
    if (fromTimestamp) {
      timeFilter.gte = new Date(fromTimestamp);
    }
    if (toTimestamp) {
      timeFilter.lte = new Date(toTimestamp);
    }

    // Consultar según el tipo de datos solicitado
    if (dataTypes.includes('blocks')) {
      const blockFilter: any = {
        ...(Object.keys(timeFilter).length > 0 && { timestamp: timeFilter }),
      };

      // Sin filtros de bloque para exportación estática

      const [blocks, totalBlocks] = await Promise.all([
        databaseService.getBlocks({
          limit,
          offset,
          ...blockFilter
        }),
        databaseService.countBlocks(blockFilter),
      ]);

      results.data = blocks.map(block => ({
        ...block,
        block_number: block.block_number.toString(),
      }));
      results.pagination.total = totalBlocks;
    }

    if (dataTypes.includes('transactions')) {
      const txFilter: any = {};

      // Sin filtros adicionales para exportación estática

      const [transactions, totalTx] = await Promise.all([
        databaseService.getTransactions({
          limit,
          offset,
          ...txFilter
        }),
        databaseService.countTransactions(txFilter),
      ]);

      results.data = transactions.map(tx => ({
        ...tx,
        gas_used: tx.gas_used.toString(),
      }));
      results.pagination.total = totalTx;
    }

    if (dataTypes.includes('events')) {
      const eventFilter: any = {};

      // Sin filtros adicionales para exportación estática

      const [events, totalEvents] = await Promise.all([
        databaseService.getEvents({
          limit,
          offset,
          ...eventFilter
        }),
        databaseService.countEvents(eventFilter),
      ]);

      results.data = events.map(event => ({
        ...event,
        log_index: event.log_index.toString(),
      }));
      results.pagination.total = totalEvents;
    }

    return NextResponse.json({
      success: true,
      ...results,
      loading: false,
      error: null,
    });
  } catch (error) {
    console.error('Error al consultar datos indexados:', error);
    return NextResponse.json(
      {
        success: false,
        data: [],
        loading: false,
        error: 'Error interno del servidor',
        pagination: {
          total: 0,
          page: 1,
          limit: 50,
        },
      },
      { status: 500 }
    );
  }
}