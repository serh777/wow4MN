import { ethers } from 'ethers';
import { ProcessedEvent } from '../types';

/**
 * Clase base para parsear eventos de la blockchain
 */
export class EventParser {
  private abiMap: Map<string, ethers.Interface> = new Map();
  
  /**
   * Registra un ABI para una dirección de contrato específica
   * @param address Dirección del contrato
   * @param abi ABI del contrato
   */
  registerAbi(address: string, abi: any) {
    const iface = new ethers.Interface(abi);
    this.abiMap.set(address.toLowerCase(), iface);
  }
  
  /**
   * Parsea un log de evento usando el ABI registrado
   * @param log Log del evento a parsear
   */
  parseEvent(log: any): ProcessedEvent | null {
    try {
      const address = log.address.toLowerCase();
      const iface = this.abiMap.get(address);
      
      if (!iface) {
        // No tenemos ABI para este contrato
        return {
          address: log.address,
          eventName: 'Unknown',
          blockNumber: log.blockNumber,
          transactionHash: log.transactionHash,
          logIndex: log.logIndex,
          topics: log.topics,
          data: log.data
        };
      }
      
      // Intentar decodificar el evento
      const eventFragment = iface.getEvent(log.topics[0]);
      if (!eventFragment) {
        return null;
      }
      
      const eventName = eventFragment.name;
      const decodedData = iface.decodeEventLog(eventName, log.data, log.topics);
      
      return {
        address: log.address,
        eventName,
        blockNumber: log.blockNumber,
        transactionHash: log.transactionHash,
        logIndex: log.logIndex,
        topics: log.topics,
        data: log.data,
        args: decodedData
      };
    } catch (error) {
      console.error('Error al parsear evento:', error);
      return null;
    }
  }
}

// Exportar una instancia por defecto
export const eventParser = new EventParser();