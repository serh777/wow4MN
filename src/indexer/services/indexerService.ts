import { DatabaseService } from '@/services/database-service';
import { Database } from '@/lib/database.types';
import { ethers } from 'ethers';
import { getProvider } from '../../utils/web3/provider';
import { config } from '../config';
import { JobStatus } from '../types';

const databaseService = new DatabaseService();

export class IndexerService {
  private provider: ethers.Provider;
  
  constructor() {
    this.provider = getProvider();
  }
  
  /**
   * Crea un nuevo trabajo de indexación
   * @param indexerId ID del indexador
   * @param params Parámetros adicionales para el trabajo
   */
  async createIndexerJob(indexerId: string, params: any = {}) {
    return await databaseService.createIndexerJob({
      indexer_id: indexerId,
      status: 'pending' as JobStatus,
    });
  }
  
  /**
   * Inicia la ejecución de un trabajo de indexación
   * @param jobId ID del trabajo a ejecutar
   */
  async startIndexerJob(jobId: string) {
    // Actualizar el estado del trabajo
    const job = await databaseService.updateIndexerJob(jobId, {
      status: 'running' as JobStatus,
      started_at: new Date().toISOString(),
    });
    
    try {
      // Obtener la configuración del indexador
      const configs = await databaseService.getIndexerConfigs(job.indexer_id);
      
      // Convertir la configuración a un objeto más fácil de usar
      const configMap = configs.reduce((acc: Record<string, string>, config: {key: string, value: string}) => {
        acc[config.key] = config.value;
        return acc;
      }, {} as Record<string, string>);
      
      // Obtener el último bloque procesado
      const lastBlock = configMap.lastProcessedBlock 
        ? parseInt(configMap.lastProcessedBlock) 
        : config.startBlock;
      
      // Obtener el bloque actual
      const currentBlock = await this.provider.getBlockNumber();
      
      // Procesar bloques
      if (lastBlock < currentBlock) {
        console.log(`Procesando bloques desde ${lastBlock} hasta ${currentBlock}`);
        
        // Procesar en lotes para evitar sobrecarga
        const batchSize = parseInt(configMap.batchSize || '10');
        let processedBlocks = 0;
        
        for (let blockNum = lastBlock + 1; blockNum <= currentBlock; blockNum += batchSize) {
          const endBlock = Math.min(blockNum + batchSize - 1, currentBlock);
          
          try {
            // Procesar lote de bloques
            await this.processBlockRange(blockNum, endBlock);
            processedBlocks += (endBlock - blockNum + 1);
            
            // Actualizar progreso
            await databaseService.upsertIndexerConfig({
              indexer_id: job.indexer_id,
              key: 'lastProcessedBlock',
              value: endBlock.toString(),
            });
            
            console.log(`Procesados bloques ${blockNum}-${endBlock} (${processedBlocks}/${currentBlock - lastBlock} total)`);
          } catch (error) {
            console.error(`Error procesando bloques ${blockNum}-${endBlock}:`, error);
            throw error;
          }
        }
      }
      
      // Completar el trabajo exitosamente
      await databaseService.updateIndexerJob(jobId, {
        status: 'completed' as JobStatus,
        completed_at: new Date().toISOString(),
        result: { blocksProcessed: currentBlock - lastBlock },
      });
      
      // Actualizar el estado del indexador
      await databaseService.updateIndexer(job.indexer_id, {
        status: 'active',
        last_run: new Date().toISOString(),
      });
      
      return { success: true };
    } catch (error) {
      console.error('Error en el trabajo de indexación:', error);
      
      // Marcar el trabajo como fallido
      await databaseService.updateIndexerJob(jobId, {
        status: 'failed' as JobStatus,
        completed_at: new Date().toISOString(),
        error: error instanceof Error ? error.message : String(error),
      });
      
      // Actualizar el estado del indexador
      await databaseService.updateIndexer(job.indexer_id, {
        status: 'error',
        last_run: new Date().toISOString(),
      });
      
      return { success: false, error };
    }
  }
  
  /**
   * Obtiene el estado actual de un indexador
   * @param indexerId ID del indexador
   */
  async getIndexerStatus(indexerId: string) {
    const indexer = await databaseService.getIndexerById(indexerId);
    const jobs = await databaseService.getIndexerJobs(indexerId, 5);
    const configs = await databaseService.getIndexerConfigs(indexerId);
    
    return {
      ...indexer,
      jobs,
      configs
    };
  }

  private async processBlockRange(startBlock: number, endBlock: number): Promise<void> {
    const provider = new ethers.JsonRpcProvider(process.env.INFURA_PROJECT_ID ? 
      `https://mainnet.infura.io/v3/${process.env.INFURA_PROJECT_ID}` : 
      'https://eth.llamarpc.com'
    );

    for (let blockNumber = startBlock; blockNumber <= endBlock; blockNumber++) {
      try {
        // Obtener datos del bloque
        const block = await provider.getBlock(blockNumber, true);
        if (!block || !block.hash) continue;

        // Guardar bloque en la base de datos
        const blockData = {
          block_hash: block.hash,
          block_number: block.number,
          timestamp: new Date(block.timestamp * 1000).toISOString(),
        };
        
        await databaseService.createBlock(blockData);

        // Procesar transacciones del bloque
        for (const txHash of block.transactions) {
          await this.processTransaction(txHash as string, block.number);
        }

      } catch (error) {
        console.error(`Error procesando bloque ${blockNumber}:`, error);
        throw error;
      }
    }
  }

  private async processTransaction(txHash: string, blockNumber: number): Promise<void> {
    const provider = new ethers.JsonRpcProvider(process.env.INFURA_PROJECT_ID ? 
      `https://mainnet.infura.io/v3/${process.env.INFURA_PROJECT_ID}` : 
      'https://eth.llamarpc.com'
    );

    try {
      const tx = await provider.getTransaction(txHash);
      const receipt = await provider.getTransactionReceipt(txHash);
      
      if (!tx || !receipt) return;

      // Obtener el bloque para la relación
      const blocks = await databaseService.getBlocks({ blockNumber });
      const blockRecord = blocks.length > 0 ? blocks[0] : null;
      
      if (!blockRecord) return;

      // Guardar transacción
      const txData = {
        tx_hash: tx.hash,
        block_id: blockRecord.id,
        from_address: tx.from,
        to_address: tx.to || '',
        value: tx.value.toString(),
        gas_price: tx.gasPrice?.toString() || '0',
        gas_used: Number(receipt.gasUsed.toString()),
        status: receipt.status || 0,
        input: tx.data,
      };
      
      await databaseService.createTransaction(txData);

      // Procesar eventos/logs de la transacción
      for (const log of receipt.logs) {
        await this.processEvent(log, tx.hash, blockNumber);
      }

    } catch (error) {
      console.error(`Error procesando transacción ${txHash}:`, error);
      // No lanzar error para evitar que falle todo el lote
    }
  }

  private async processEvent(log: any, txHash: string, blockNumber: number): Promise<void> {
    try {
      // Obtener la transacción para la relación
      const transactions = await databaseService.getTransactions({ txHash });
      const transaction = transactions.length > 0 ? transactions[0] : null;
      
      if (!transaction) return;

      const eventData = {
        id: `${txHash}-${log.index}`,
        transaction_id: transaction.id,
        address: log.address,
        event_name: 'Unknown',
        topics: log.topics,
        data: log.data,
        log_index: log.index,
      };
      
      await databaseService.createEvent(eventData);
    } catch (error) {
      // Ignorar errores de duplicados
      if (!(error instanceof Error && error.message?.includes('Unique constraint'))) {
        console.error(`Error procesando evento:`, error);
      }
    }
  }
}