import { ethers } from 'ethers';
import { getProvider } from '../../utils/web3/provider';
import { parseEvent } from '../../utils/web3/parseEvent';
import { config } from '../config';
import { DatabaseService } from '@/services/database-service';
import { Database } from '@/lib/database.types';

const databaseService = new DatabaseService();

async function syncBlocks(fromBlock: number, toBlock: number) {
  const provider = getProvider();
  
  console.log(`Sincronizando bloques desde ${fromBlock} hasta ${toBlock}`);
  
  for (let blockNumber = fromBlock; blockNumber <= toBlock; blockNumber++) {
    try {
      // Obtener información del bloque con todas las transacciones
      const block = await provider.getBlock(blockNumber, true);
      
      if (!block) {
        console.error(`No se pudo obtener el bloque ${blockNumber}`);
        continue;
      }
      
      // Crear el bloque en la base de datos
      const blockData = {
        block_number: block.number,
        block_hash: block.hash || '',
        timestamp: new Date(Number(block.timestamp) * 1000).toISOString(),
      };
      
      const dbBlock = await databaseService.createBlock(blockData);
      
      // Procesar cada transacción del bloque
      for (const txHash of block.transactions) {
        // Obtener la transacción completa
        const tx = await provider.getTransaction(txHash);
        if (!tx) continue;
        
        // Obtener el recibo de la transacción para más detalles
        const receipt = await provider.getTransactionReceipt(txHash);
        
        // Crear la transacción en la base de datos
        const txData = {
          tx_hash: tx.hash,
          block_id: dbBlock.id,
          from_address: tx.from,
          to_address: tx.to || null,
          value: tx.value.toString(),
          gas_used: Number(receipt?.gasUsed?.toString() || "0"),
          gas_price: tx.gasPrice?.toString() || "0",
          input: tx.data,
          status: receipt?.status || 0,
        };
        
        const dbTx = await databaseService.createTransaction(txData);
        
        // Procesar eventos (logs) de la transacción
        if (receipt && receipt.logs) {
          for (const log of receipt.logs) {
            // Intentar decodificar el nombre del evento si es posible
            let eventName = "Unknown";
            
            // Intentar obtener el ABI del contrato si está disponible
            const contractAbi = getContractAbi(log.address);
            if (contractAbi) {
              const parsedEvent = parseEvent(log, contractAbi);
              if (parsedEvent) {
                eventName = parsedEvent.name;
              }
            }
            
            // Crear el evento en la base de datos
            const eventData = {
              id: `${txHash}-${log.index}`,
              transaction_id: dbTx.id,
              address: log.address,
              event_name: eventName,
              topics: [...log.topics],
              data: log.data,
              log_index: log.index,
            };
            
            await databaseService.createEvent(eventData);
          }
        }
      }
      
      console.log(`Bloque ${blockNumber} sincronizado correctamente`);
    } catch (error) {
      console.error(`Error al sincronizar el bloque ${blockNumber}:`, error);
    }
  }
}

async function main() {
  try {
    const provider = getProvider();
    const latestBlock = await provider.getBlockNumber();
    
    // Obtener el último bloque indexado
    const blocks = await databaseService.getBlocks({ limit: 1, offset: 0 });
    const lastIndexedBlock = blocks.length > 0 ? blocks[0] : null;
    
    const fromBlock = lastIndexedBlock 
      ? Number(lastIndexedBlock.block_number) + 1 
      : config.startBlock;
    
    if (fromBlock <= latestBlock) {
      await syncBlocks(fromBlock, latestBlock);
    } else {
      console.log('No hay nuevos bloques para sincronizar');
    }
  } catch (error) {
    console.error('Error en el proceso de sincronización:', error);
  } finally {
    // No necesitamos desconectar con Supabase
    console.log('Sincronización completada');
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

export { syncBlocks };


// Add a function to get contract ABIs
function getContractAbi(address: string): ethers.InterfaceAbi | null {
  // Implement logic to retrieve ABI for known contract addresses
  // For example, you could have a mapping of addresses to ABIs
  // or load them from a file/database
  
  // For now, return null as a placeholder
  return null;
}