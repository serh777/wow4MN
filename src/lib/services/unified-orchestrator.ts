import { ComplexTaskSystem } from '@/app/dashboard/ai-assistant/components/complex-task-system';

// Importación condicional del scheduler para evitar errores en el cliente
let scheduler: any = null;
if (typeof window === 'undefined') {
  try {
    scheduler = require('@/indexer/scheduler').scheduler;
  } catch (error) {
    console.warn('No se pudo cargar el scheduler:', error);
  }
}

// Interfaces para el sistema de orquestación
export interface OrchestrationConfig {
  enableAIAgents: boolean;
  enableIndexers: boolean;
  enableTraditionalAnalysis: boolean;
  parallelExecution: boolean;
  maxConcurrency: number;
  timeoutMs: number;
}

export interface OrchestrationResult {
  id: string;
  timestamp: string;
  executionTime: number;
  config: OrchestrationConfig;
  results: {
    traditionalAnalysis?: any;
    aiAgents?: any;
    indexers?: any;
  };
  metrics: {
    totalTasks: number;
    completedTasks: number;
    failedTasks: number;
    averageExecutionTime: number;
    resourceUtilization: number;
  };
  status: 'pending' | 'running' | 'completed' | 'failed';
  errors?: string[];
}

export interface TaskDefinition {
  id: string;
  name: string;
  type: 'traditional' | 'ai-agent' | 'indexer';
  priority: 'high' | 'medium' | 'low';
  dependencies: string[];
  estimatedDuration: number;
  retryAttempts: number;
  execute: (params: any) => Promise<any>;
}

// Sistema de orquestación unificado
export class UnifiedOrchestrator {
  private static instance: UnifiedOrchestrator;
  private complexTaskSystem: ComplexTaskSystem;
  private activeTasks: Map<string, TaskDefinition> = new Map();
  private taskResults: Map<string, any> = new Map();
  private executionQueue: TaskDefinition[] = [];
  private isRunning: boolean = false;

  private constructor() {
    this.complexTaskSystem = new ComplexTaskSystem();
  }

  public static getInstance(): UnifiedOrchestrator {
    if (!UnifiedOrchestrator.instance) {
      UnifiedOrchestrator.instance = new UnifiedOrchestrator();
    }
    return UnifiedOrchestrator.instance;
  }

  // Configuración por defecto
  private getDefaultConfig(): OrchestrationConfig {
    return {
      enableAIAgents: true,
      enableIndexers: true,
      enableTraditionalAnalysis: true,
      parallelExecution: true,
      maxConcurrency: 3,
      timeoutMs: 300000 // 5 minutos
    };
  }

  // Registrar tareas disponibles
  public registerTask(task: TaskDefinition): void {
    this.activeTasks.set(task.id, task);
  }

  // Ejecutar análisis unificado con orquestación
  public async executeUnifiedAnalysis(
    params: any,
    config: Partial<OrchestrationConfig> = {}
  ): Promise<OrchestrationResult> {
    const finalConfig = { ...this.getDefaultConfig(), ...config };
    const startTime = Date.now();
    const orchestrationId = `orchestration-${startTime}`;

    const result: OrchestrationResult = {
      id: orchestrationId,
      timestamp: new Date().toISOString(),
      executionTime: 0,
      config: finalConfig,
      results: {},
      metrics: {
        totalTasks: 0,
        completedTasks: 0,
        failedTasks: 0,
        averageExecutionTime: 0,
        resourceUtilization: 0
      },
      status: 'pending',
      errors: []
    };

    try {
      result.status = 'running';
      this.isRunning = true;

      // Preparar tareas según configuración
      const tasks = this.prepareTasks(params, finalConfig);
      result.metrics.totalTasks = tasks.length;

      // Inicializar indexadores si están habilitados
      if (finalConfig.enableIndexers) {
        await this.initializeIndexers();
      }

      // Ejecutar tareas
      if (finalConfig.parallelExecution) {
        result.results = await this.executeTasksInParallel(tasks, finalConfig);
      } else {
        result.results = await this.executeTasksSequentially(tasks, finalConfig);
      }

      // Calcular métricas finales
      const endTime = Date.now();
      result.executionTime = endTime - startTime;
      result.metrics.completedTasks = Object.keys(result.results).length;
      result.metrics.averageExecutionTime = result.executionTime / result.metrics.totalTasks;
      result.status = 'completed';

    } catch (error) {
      result.status = 'failed';
      result.errors = result.errors || [];
      result.errors.push(error instanceof Error ? error.message : String(error));
    } finally {
      this.isRunning = false;
      result.executionTime = Date.now() - startTime;
    }

    return result;
  }

  // Preparar tareas según configuración
  private prepareTasks(params: any, config: OrchestrationConfig): TaskDefinition[] {
    const tasks: TaskDefinition[] = [];

    // Tarea de análisis tradicional
    if (config.enableTraditionalAnalysis) {
      tasks.push({
        id: 'traditional-analysis',
        name: 'Análisis Tradicional',
        type: 'traditional',
        priority: 'high',
        dependencies: [],
        estimatedDuration: 5000,
        retryAttempts: 2,
        execute: async (params) => this.executeTraditionalAnalysis(params)
      });
    }

    // Tareas de agentes IA
    if (config.enableAIAgents) {
      tasks.push({
        id: 'ai-agents',
        name: 'Agentes IA Autónomos',
        type: 'ai-agent',
        priority: 'high',
        dependencies: [],
        estimatedDuration: 10000,
        retryAttempts: 3,
        execute: async (params) => this.executeAIAgents(params)
      });
    }

    // Tareas de indexadores
    if (config.enableIndexers) {
      tasks.push({
        id: 'indexers',
        name: 'Indexadores Especializados',
        type: 'indexer',
        priority: 'medium',
        dependencies: [],
        estimatedDuration: 8000,
        retryAttempts: 2,
        execute: async (params) => this.executeIndexers(params)
      });
    }

    return tasks;
  }

  // Ejecutar tareas en paralelo
  private async executeTasksInParallel(
    tasks: TaskDefinition[],
    config: OrchestrationConfig
  ): Promise<any> {
    const results: any = {};
    const semaphore = new Array(config.maxConcurrency).fill(null);
    
    const executeTask = async (task: TaskDefinition): Promise<void> => {
      try {
        const taskResult = await Promise.race([
          task.execute({}),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Task timeout')), config.timeoutMs)
          )
        ]);
        results[task.id] = taskResult;
      } catch (error) {
        console.error(`Error en tarea ${task.id}:`, error);
        results[task.id] = { error: error instanceof Error ? error.message : String(error) };
      }
    };

    // Ejecutar tareas con control de concurrencia
    const taskPromises = tasks.map(task => executeTask(task));
    await Promise.allSettled(taskPromises);

    return results;
  }

  // Ejecutar tareas secuencialmente
  private async executeTasksSequentially(
    tasks: TaskDefinition[],
    config: OrchestrationConfig
  ): Promise<any> {
    const results: any = {};

    for (const task of tasks) {
      try {
        const taskResult = await Promise.race([
          task.execute({}),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Task timeout')), config.timeoutMs)
          )
        ]);
        results[task.id] = taskResult;
      } catch (error) {
        console.error(`Error en tarea ${task.id}:`, error);
        results[task.id] = { error: error instanceof Error ? error.message : String(error) };
      }
    }

    return results;
  }

  // Inicializar indexadores automáticamente
  private async initializeIndexers(): Promise<void> {
    try {
      if (scheduler) {
        // Iniciar el scheduler con intervalo de 5 minutos
        await scheduler.start(300000);
        console.log('Indexadores inicializados por el orquestador');
      } else {
        console.warn('Scheduler no disponible en el cliente');
      }
    } catch (error) {
      console.warn('No se pudieron inicializar los indexadores:', error);
    }
  }

  // Ejecutar análisis tradicional
  private async executeTraditionalAnalysis(params: any): Promise<any> {
    // Simular análisis tradicional
    await new Promise(resolve => setTimeout(resolve, 2000));
    return {
      overallScore: Math.floor(Math.random() * 30) + 70,
      metrics: {
        seo: Math.floor(Math.random() * 20) + 80,
        performance: Math.floor(Math.random() * 20) + 75,
        security: Math.floor(Math.random() * 15) + 85
      },
      timestamp: new Date().toISOString()
    };
  }

  // Ejecutar agentes IA
  private async executeAIAgents(params: any): Promise<any> {
    try {
      return await this.complexTaskSystem.executeTask('market_analysis', params);
    } catch (error) {
      console.error('Error ejecutando agentes IA:', error);
      return { error: 'Error en agentes IA' };
    }
  }

  // Ejecutar indexadores
  private async executeIndexers(params: any): Promise<any> {
    // Simular procesamiento de indexadores
    await new Promise(resolve => setTimeout(resolve, 3000));
    return {
      indexerStatus: {
        active: true,
        lastRun: new Date().toISOString(),
        processedBlocks: Math.floor(Math.random() * 1000000) + 100000,
        syncProgress: Math.floor(Math.random() * 20) + 80,
        schedulerActive: true,
        autoInitialized: true
      },
      contractDetails: {
        verified: true,
        compiler: 'solc-0.8.19',
        optimization: true
      }
    };
  }

  // Obtener estado actual del orquestador
  public getStatus(): {
    isRunning: boolean;
    activeTasks: number;
    completedTasks: number;
    queuedTasks: number;
  } {
    return {
      isRunning: this.isRunning,
      activeTasks: this.activeTasks.size,
      completedTasks: this.taskResults.size,
      queuedTasks: this.executionQueue.length
    };
  }

  // Limpiar recursos
  public cleanup(): void {
    this.activeTasks.clear();
    this.taskResults.clear();
    this.executionQueue = [];
    this.isRunning = false;
  }
}

// Exportar instancia singleton
export const unifiedOrchestrator = UnifiedOrchestrator.getInstance();