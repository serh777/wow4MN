import { DatabaseService } from '@/services/database-service';
import { Database } from '@/lib/database.types';
import { IndexerService } from './services/indexerService';
import { config } from './config';
import { EventEmitter } from 'events';

const databaseService = new DatabaseService();

/**
 * Clase principal del indexador que coordina todos los componentes
 */
export class Indexer {
  private service: IndexerService;
  
  constructor() {
    this.service = new IndexerService();
  }
  
  /**
   * Inicia un trabajo de indexación para un indexador específico
   * @param indexerId ID del indexador a ejecutar
   */
  async startIndexer(indexerId: string) {
    try {
      // Verificar si el indexador existe
      const indexers = await databaseService.getIndexers('');
      const indexer = indexers.find(i => i.id === indexerId);
      
      if (!indexer) {
        throw new Error(`Indexador con ID ${indexerId} no encontrado`);
      }
      
      // Crear un nuevo trabajo de indexación
      const job = await this.service.createIndexerJob(indexerId);
      
      // Iniciar el trabajo
      return this.service.startIndexerJob(job.id);
    } catch (error) {
      console.error('Error al iniciar el indexador:', error);
      throw error;
    }
  }
  
  /**
   * Crea un nuevo indexador en la base de datos
   * @param userId ID del usuario propietario
   * @param name Nombre del indexador
   * @param description Descripción opcional
   */
  async createIndexer(userId: string, name: string, description?: string) {
    try {
      // Crear un nuevo indexador
      const indexer = await databaseService.createIndexer({
        name,
        description,
        user_id: userId,
        status: 'inactive'
      });
      
      // Configuración inicial
      await databaseService.upsertIndexerConfig({
        indexer_id: indexer.id,
        key: 'startBlock',
        value: config.startBlock.toString()
      });
      
      return indexer;
    } catch (error) {
      console.error('Error al crear el indexador:', error);
      throw error;
    }
  }
}

// Función para obtener el indexer de forma lazy
let _indexer: Indexer | null = null;

export function getIndexer(): Indexer | null {
  if (typeof window !== 'undefined') {
    return null; // No disponible en el cliente
  }
  
  if (!_indexer) {
    try {
      _indexer = new Indexer();
    } catch (error) {
      console.warn('No se pudo inicializar el indexer:', error);
      return null;
    }
  }
  
  return _indexer;
}

// Solo exportar la función getIndexer para evitar inicialización automática
// export const indexer = getIndexer(); // Comentado para evitar inicialización en el cliente


// Clase base para todos los indexadores
class BaseIndexer extends EventEmitter {
  protected name: string;
  protected status: 'active' | 'inactive' | 'error' | 'pending';
  protected network: string;
  protected dataTypes: string[];
  
  constructor(name: string, network: string, dataTypes: string[]) {
    super();
    this.name = name;
    this.status = 'inactive';
    this.network = network;
    this.dataTypes = dataTypes;
  }
  
  async start(): Promise<void> {
    try {
      this.status = 'active';
      this.emit('statusChange', { indexer: this.name, status: this.status });
      console.log(`Indexador "${this.name}" iniciado en la red ${this.network}`);
      
      // Aquí iría la lógica real de indexación
      await this.processBlocks();
      
    } catch (error) {
      this.status = 'error';
      this.emit('statusChange', { indexer: this.name, status: this.status, error });
      console.error(`Error en el indexador "${this.name}":`, error);
    }
  }
  
  async stop(): Promise<void> {
    this.status = 'inactive';
    this.emit('statusChange', { indexer: this.name, status: this.status });
    console.log(`Indexador "${this.name}" detenido`);
  }
  
  protected async processBlocks(): Promise<void> {
    // Implementación simulada
    console.log(`Procesando datos (${this.dataTypes.join(', ')}) en la red ${this.network}...`);
    
    // Simulamos procesamiento
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log('Procesamiento completado');
  }
  
  getStatus(): string {
    return this.status;
  }
}

// Implementación específica para Ethereum
class EthereumIndexer extends BaseIndexer {
  constructor(name: string, dataTypes: string[]) {
    super(name, 'ethereum', dataTypes);
  }
  
  protected async processBlocks(): Promise<void> {
    console.log('Conectando a la red Ethereum...');
    await super.processBlocks();
    console.log('Datos de Ethereum procesados correctamente');
  }
}

// Función principal para ejecutar un indexador de prueba
async function main() {
  console.log('Iniciando sistema de indexación...');
  
  const indexer = new EthereumIndexer('Indexador de Prueba', ['blocks', 'transactions']);
  
  indexer.on('statusChange', (data) => {
    console.log(`Cambio de estado en ${data.indexer}: ${data.status}`);
  });
  
  await indexer.start();
  
  // Simulamos una ejecución de 5 segundos
  await new Promise(resolve => setTimeout(resolve, 5000));
  
  await indexer.stop();
  
  console.log('Sistema de indexación finalizado');
}

// Ejecutar la función principal
main().catch(error => {
  console.error('Error en el sistema de indexación:', error);
  process.exit(1);
});