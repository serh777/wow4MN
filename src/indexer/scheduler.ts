import { DatabaseService } from '@/services/database-service';
import { Database } from '@/lib/database.types';
import { indexer } from './indexer';
import { config } from './config';
import { supabase } from '@/lib/supabase-client';

const databaseService = new DatabaseService();

/**
 * Planificador de tareas para el indexador
 */
export class IndexerScheduler {
  private intervalId: NodeJS.Timeout | null = null;
  
  /**
   * Inicia el planificador para ejecutar indexadores periódicamente
   * @param intervalMs Intervalo en milisegundos entre ejecuciones
   */
  start(intervalMs: number = 60000) {
    if (this.intervalId) {
      this.stop();
    }
    
    console.log(`Iniciando planificador de indexación con intervalo de ${intervalMs}ms`);
    
    this.intervalId = setInterval(async () => {
      await this.runPendingIndexers();
    }, intervalMs);
  }
  
  /**
   * Detiene el planificador
   */
  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      console.log('Planificador de indexación detenido');
    }
  }
  
  /**
   * Ejecuta todos los indexadores pendientes
   */
  async runPendingIndexers() {
    try {
      // Buscar indexadores activos que no se hayan ejecutado recientemente
      const oneHourAgo = new Date(Date.now() - 3600000).toISOString();
      const { data: activeIndexers, error } = await supabase
        .from('indexers')
        .select('*')
        .eq('status', 'active')
        .or(`last_run.is.null,last_run.lt.${oneHourAgo}`);
      
      if (error) {
        console.error('Error al buscar indexadores activos:', error);
        return;
      }
      
      console.log(`Encontrados ${activeIndexers.length} indexadores pendientes de ejecución`);
      
      // Ejecutar cada indexador
      for (const indexerData of activeIndexers) {
        try {
          console.log(`Iniciando indexador: ${indexerData.name} (${indexerData.id})`);
          await indexer.startIndexer(indexerData.id);
        } catch (error) {
          console.error(`Error al ejecutar indexador ${indexerData.id}:`, error);
        }
      }
    } catch (error) {
      console.error('Error en el planificador de indexación:', error);
    }
  }
}

// Exportar una instancia por defecto
export const scheduler = new IndexerScheduler();