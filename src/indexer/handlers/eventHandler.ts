import { DatabaseService } from '@/services/database-service';
import { Database } from '@/lib/database.types';
import { ProcessedEvent, EventHandler } from '../types';

const databaseService = new DatabaseService();

/**
 * Manejador base para eventos procesados
 */
export abstract class BaseEventHandler implements EventHandler {
  /**
   * Determina si este manejador puede procesar el evento
   * @param event Evento procesado
   */
  abstract canHandle(event: ProcessedEvent): boolean;
  
  /**
   * Procesa el evento
   * @param event Evento procesado
   */
  abstract handle(event: ProcessedEvent): Promise<void>;
}

/**
 * Manejador de ejemplo para eventos de transferencia de tokens
 */
export class TransferEventHandler extends BaseEventHandler {
  canHandle(event: ProcessedEvent): boolean {
    return event.eventName === 'Transfer';
  }
  
  async handle(event: ProcessedEvent): Promise<void> {
    if (!event.args) return;
    
    // Ejemplo: guardar la transferencia en la base de datos
    console.log(`Procesando transferencia: ${event.args.from} -> ${event.args.to}, valor: ${event.args.value}`);
    
    // Usar el servicio de base de datos ya inicializado
    // Por ejemplo:
    /*
    await databaseService.createTokenTransfer({
      tokenAddress: event.address,
      from: event.args.from,
      to: event.args.to,
      value: event.args.value.toString(),
      transactionHash: event.transactionHash,
      blockNumber: event.blockNumber,
    });
    */
  }
}

// Registro de manejadores disponibles
export const eventHandlers: EventHandler[] = [
  new TransferEventHandler(),
  // Añadir más manejadores aquí
];