/**
 * Scheduler para indexadores - versión simplificada
 */

// Clase que no hace nada (para cliente)
class NoOpScheduler {
  start() {}
  stop() {}
}

// Clase principal del scheduler
export class IndexerScheduler {
  private impl: any = null;
  private isInitialized = false;

  private async initialize() {
    if (this.isInitialized) return;
    
    // Solo en el servidor
    if (typeof window !== 'undefined') {
      this.impl = new NoOpScheduler();
      this.isInitialized = true;
      return;
    }

    // En el servidor, crear implementación lazy
    this.impl = {
      intervalId: null,
      dependencies: null,
      
      async loadDependencies() {
        if (this.dependencies) return this.dependencies;
        
        try {
          const [dbModule, configModule, supabaseModule, indexerModule] = await Promise.all([
            import('@/services/database-service'),
            import('./config'),
            import('@/lib/supabase-client'),
            import('./indexer')
          ]);
          
          this.dependencies = {
            databaseService: new dbModule.DatabaseService(),
            getIndexer: indexerModule.getIndexer
          };
          
          return this.dependencies;
        } catch (error) {
          console.warn('No se pudieron cargar las dependencias del servidor:', error);
          return null;
        }
      },
      
      async start(intervalMs = 300000) {
        if (this.intervalId) {
          console.log('El planificador ya está ejecutándose');
          return;
        }
        
        const deps = await this.loadDependencies();
        if (!deps) {
          console.warn('No se pudieron cargar las dependencias del scheduler');
          return;
        }
        
        console.log(`Iniciando planificador de indexación cada ${intervalMs}ms`);
        
        const runCycle = async () => {
          try {
            const indexer = deps.getIndexer();
            if (!indexer) return;
            
            const activeIndexers = await deps.databaseService.getActiveIndexers();
            
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
        };
        
        // Ejecutar inmediatamente
        runCycle();
        
        // Programar ejecuciones periódicas
        this.intervalId = setInterval(runCycle, intervalMs);
      },
      
      stop() {
        if (this.intervalId) {
          clearInterval(this.intervalId);
          this.intervalId = null;
          console.log('Planificador de indexación detenido');
        }
      }
    };
    
    this.isInitialized = true;
  }

  async start(intervalMs?: number) {
    await this.initialize();
    if (this.impl && typeof this.impl.start === 'function') {
      this.impl.start(intervalMs);
    }
  }

  async stop() {
    await this.initialize();
    if (this.impl && typeof this.impl.stop === 'function') {
      this.impl.stop();
    }
  }
}

// Exportar instancia
export const scheduler = new IndexerScheduler();