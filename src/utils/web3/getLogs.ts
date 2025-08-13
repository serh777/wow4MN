import { ethers, Log, Filter } from 'ethers';
import { getProvider } from './provider';

/**
 * Obtiene logs de eventos de la blockchain
 * @param options Opciones para filtrar los logs
 * @returns Array de logs encontrados
 */
export async function getLogs(options: {
  address?: string | string[];
  topics?: (string | string[] | null)[];
  fromBlock?: number | string;
  toBlock?: number | string;
  blockHash?: string;
}): Promise<Log[]> {
  const provider = getProvider();
  
  try {
    // Crear el filtro para los logs
    const filter: Filter = {
      address: Array.isArray(options.address) ? options.address[0] : options.address,
      topics: options.topics,
      fromBlock: options.fromBlock,
      toBlock: options.toBlock,
    };
    
    // Si se proporciona blockHash, usarlo en lugar de fromBlock/toBlock
    if (options.blockHash) {
      // Usar una aserción de tipo para evitar el error de TypeScript
      (filter as any).blockHash = options.blockHash;
      // Cuando se usa blockHash, no se deben usar fromBlock/toBlock
      delete filter.fromBlock;
      delete filter.toBlock;
    }
    
    // Obtener los logs
    const logs = await provider.getLogs(filter);
    return logs;
  } catch (error) {
    console.error('Error al obtener logs:', error);
    
    // Si el rango es muy grande, podemos dividirlo
    if (
      error instanceof Error && 
      error.message.includes('query returned more than') &&
      typeof options.fromBlock === 'number' && 
      typeof options.toBlock === 'number'
    ) {
      const midBlock = Math.floor((options.fromBlock + options.toBlock) / 2);
      
      // Dividir la consulta en dos partes
      const firstHalf = await getLogs({
        ...options,
        fromBlock: options.fromBlock,
        toBlock: midBlock,
      });
      
      const secondHalf = await getLogs({
        ...options,
        fromBlock: midBlock + 1,
        toBlock: options.toBlock,
      });
      
      return [...firstHalf, ...secondHalf];
    }
    
    throw error;
  }
}