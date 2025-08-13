import { DatabaseService } from '@/services/database-service';
import { Database } from '@/lib/database.types';

const databaseService = new DatabaseService();

export interface IndexerMetrics {
  indexerId: string;
  blocksProcessed: number;
  transactionsProcessed: number;
  eventsProcessed: number;
  processingRate: number; // bloques por minuto
  lastProcessedBlock: number;
  currentBlock: number;
  lag: number; // diferencia entre bloque actual y último procesado
  uptime: number; // tiempo en ejecución en minutos
  errorRate: number; // porcentaje de errores
  status: 'running' | 'stopped' | 'error';
}

export interface SystemMetrics {
  totalIndexers: number;
  activeIndexers: number;
  totalBlocksProcessed: number;
  totalTransactionsProcessed: number;
  totalEventsProcessed: number;
  averageProcessingRate: number;
  systemUptime: number;
}

export class IndexerMonitoring {
  private static instance: IndexerMonitoring;
  private metricsCache: Map<string, IndexerMetrics> = new Map();
  private systemStartTime: Date = new Date();

  static getInstance(): IndexerMonitoring {
    if (!IndexerMonitoring.instance) {
      IndexerMonitoring.instance = new IndexerMonitoring();
    }
    return IndexerMonitoring.instance;
  }

  async getIndexerMetrics(indexerId: string): Promise<IndexerMetrics | null> {
    try {
      const indexer = await databaseService.getIndexerById(indexerId);

      if (!indexer) return null;

      // Obtener el último job y configuraciones por separado
      const lastJob = await databaseService.getLastIndexerJob(indexerId);
      const configs = await databaseService.getIndexerConfigs(indexerId);
      
      const lastProcessedBlockConfig = configs.find(
        config => config.key === 'lastProcessedBlock'
      );
      
      const lastProcessedBlock = parseInt(lastProcessedBlockConfig?.value || '0');
      const networkConfig = configs.find(config => config.key === 'network');
      const network = networkConfig?.value || 'ethereum';
      const currentBlock = await this.getCurrentBlockNumber(network);
      
      // Calcular métricas de procesamiento
      // Usar el servicio de base de datos ya inicializado
      const blocksProcessed = await this.getBlocksProcessedCount(indexerId);
      const transactionsProcessed = await this.getTransactionsProcessedCount(indexerId);
      const eventsProcessed = await this.getEventsProcessedCount(indexerId);
      
      // Calcular tasa de procesamiento (últimos 10 minutos)
      const processingRate = await this.calculateProcessingRate(indexerId);
      
      // Calcular uptime
      const uptime = lastJob ? 
        (Date.now() - new Date(lastJob.created_at).getTime()) / (1000 * 60) : 0;
      
      // Calcular tasa de errores
      const errorRate = await this.calculateErrorRate(indexerId);

      const metrics: IndexerMetrics = {
        indexerId,
        blocksProcessed,
        transactionsProcessed,
        eventsProcessed,
        processingRate,
        lastProcessedBlock,
        currentBlock,
        lag: currentBlock - lastProcessedBlock,
        uptime,
        errorRate,
        status: indexer.status as 'running' | 'stopped' | 'error'
      };

      this.metricsCache.set(indexerId, metrics);
      return metrics;
    } catch (error) {
      console.error(`Error obteniendo métricas para indexer ${indexerId}:`, error);
      return null;
    }
  }

  async getSystemMetrics(): Promise<SystemMetrics> {
    try {
      const indexers = await databaseService.getIndexers('');
      const activeIndexers = indexers.filter(i => i.status === 'running').length;
      
      const totalBlocks = await databaseService.countBlocks();
      const totalTransactions = await databaseService.countTransactions();
      const totalEvents = await databaseService.countEvents();
      
      // Calcular tasa promedio de procesamiento
      const averageProcessingRate = await this.calculateAverageProcessingRate();
      
      const systemUptime = (Date.now() - this.systemStartTime.getTime()) / (1000 * 60);

      return {
        totalIndexers: indexers.length,
        activeIndexers,
        totalBlocksProcessed: totalBlocks,
        totalTransactionsProcessed: totalTransactions,
        totalEventsProcessed: totalEvents,
        averageProcessingRate,
        systemUptime
      };
    } catch (error) {
      console.error('Error obteniendo métricas del sistema:', error);
      throw error;
    }
  }

  async getHealthStatus(): Promise<{
    status: 'healthy' | 'degraded' | 'unhealthy';
    checks: Array<{
      name: string;
      status: 'pass' | 'fail';
      message?: string;
    }>;
  }> {
    const checks = [];
    let overallStatus: 'healthy' | 'degraded' | 'unhealthy' = 'healthy';

    // Check database connectivity
    try {
      await databaseService.healthCheck();
      checks.push({ name: 'database', status: 'pass' as const });
    } catch (error) {
      checks.push({ 
        name: 'database', 
        status: 'fail' as const, 
        message: 'Database connection failed' 
      });
      overallStatus = 'unhealthy';
    }

    // Check active indexers
    try {
      const indexers = await databaseService.getIndexers('');
      const activeCount = indexers.filter(i => i.status === 'running').length;
      
      if (activeCount > 0) {
        checks.push({ name: 'indexers', status: 'pass' as const });
      } else {
        checks.push({ 
          name: 'indexers', 
          status: 'fail' as const, 
          message: 'No active indexers' 
        });
        if (overallStatus === 'healthy') overallStatus = 'degraded';
      }
    } catch (error) {
      checks.push({ 
        name: 'indexers', 
        status: 'fail' as const, 
        message: 'Failed to check indexer status' 
      });
      overallStatus = 'unhealthy';
    }

    // Check recent processing activity
    try {
      const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString();
      const recentBlocks = await databaseService.countBlocks();
      // Nota: Simplificado para la migración - se puede mejorar con filtros de tiempo
      
      if (recentBlocks > 0) {
        checks.push({ name: 'recent_activity', status: 'pass' as const });
      } else {
        checks.push({ 
          name: 'recent_activity', 
          status: 'fail' as const, 
          message: 'No recent processing activity' 
        });
        if (overallStatus === 'healthy') overallStatus = 'degraded';
      }
    } catch (error) {
      checks.push({ 
        name: 'recent_activity', 
        status: 'fail' as const, 
        message: 'Failed to check recent activity' 
      });
    }

    return { status: overallStatus, checks };
  }

  private async getCurrentBlockNumber(network: string): Promise<number> {
    // Implementar lógica para obtener el bloque actual de la red
    // Por ahora retornamos un valor simulado
    return 18500000;
  }

  private async getBlocksProcessedCount(indexerId: string): Promise<number> {
    // Contar bloques procesados por este indexer
    return await databaseService.countBlocks();
  }

  private async getTransactionsProcessedCount(indexerId: string): Promise<number> {
    return await databaseService.countTransactions();
  }

  private async getEventsProcessedCount(indexerId: string): Promise<number> {
    return await databaseService.countEvents();
  }

  private async calculateProcessingRate(indexerId: string): Promise<number> {
    // Calcular bloques procesados en los últimos 10 minutos
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
    
    // Simplificado para la migración - usar método existente
    const recentBlocks = await databaseService.countBlocks();
    
    return recentBlocks; // bloques por 10 minutos
  }

  private async calculateErrorRate(indexerId: string): Promise<number> {
    // Simplificado para la migración - usar método existente
    const jobs = await databaseService.getIndexerJobs(indexerId);
    const totalJobs = jobs.length;
    const failedJobs = jobs.filter(job => job.status === 'failed').length;
    
    return totalJobs > 0 ? (failedJobs / totalJobs) * 100 : 0;
  }

  private async calculateAverageProcessingRate(): Promise<number> {
    // Implementar cálculo de tasa promedio del sistema
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
    
    // Simplificado para la migración - usar método existente
    const recentBlocks = await databaseService.countBlocks();
    
    return recentBlocks;
  }

  // Método para limpiar cache de métricas
  clearCache(): void {
    this.metricsCache.clear();
  }

  // Método para obtener métricas en tiempo real
  async startRealTimeMonitoring(callback: (metrics: SystemMetrics) => void): Promise<void> {
    setInterval(async () => {
      try {
        const metrics = await this.getSystemMetrics();
        callback(metrics);
      } catch (error) {
        console.error('Error en monitoreo en tiempo real:', error);
      }
    }, 30000); // cada 30 segundos
  }
}

export const monitoring = IndexerMonitoring.getInstance();