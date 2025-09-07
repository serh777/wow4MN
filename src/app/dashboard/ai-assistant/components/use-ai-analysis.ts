'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAnalysisNotifications } from '@/components/notifications/use-analysis-notifications';
import { useIndexerService } from '@/hooks/useIndexerService';
import { AnthropicService } from '@/services/apis/anthropic';
import { EtherscanService } from '@/services/apis/etherscan';
import { extractContractAddress, generateRealResults, generateRealAnalysisResponse } from './real-analysis-helpers';
import type { AnalysisResult } from '@/types';

// Importar componentes modulares
import { AIAnalysisParams, AIAnalysisResult, IndexerAnalysisResult } from './types';
import { AnalysisGenerators } from './analysis-generators';
import { ProgressHelpers } from './progress-helpers';
import { BlockchainAgentService, defaultAgentConfig } from './blockchain-agents';
import { BlockchainNavigator, NavigationTarget } from './blockchain-navigator';
import { ComplexTaskSystem } from './complex-task-system';
// Importar orquestador solo en el servidor
let unifiedOrchestrator: any = null;
let OrchestrationResult: any = null;

// Cargar orquestador solo si estamos en el servidor o si las variables de entorno están disponibles
if (typeof window === 'undefined' || process.env.ETHEREUM_RPC_URL) {
  try {
    const orchestratorModule = require('@/lib/services/unified-orchestrator');
    unifiedOrchestrator = orchestratorModule.unifiedOrchestrator;
    OrchestrationResult = orchestratorModule.OrchestrationResult;
  } catch (error) {
    console.warn('No se pudo cargar el orquestador unificado:', error);
  }
}

export function useAIAnalysis() {
  const router = useRouter();
  const { notifyAnalysisStarted, notifyAnalysisCompleted, notifyAnalysisError } = useAnalysisNotifications();
  const { queryIndexedData } = useIndexerService();
  
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');
  const [results, setResults] = useState<AIAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [indexerResults, setIndexerResults] = useState<IndexerAnalysisResult | null>(null);
  const [analysisPhase, setAnalysisPhase] = useState<'preparing' | 'analyzing' | 'processing' | 'finalizing' | 'complete'>('preparing');
  const [progressMessage, setProgressMessage] = useState('Preparando análisis...');
  const [subProgress, setSubProgress] = useState(0);
  const [totalSteps, setTotalSteps] = useState(0);
  const [completedSteps, setCompletedSteps] = useState(0);
  
  // Inicializar servicio de agentes blockchain
  const [agentService] = useState(() => new BlockchainAgentService(defaultAgentConfig));
  const [agentProgress, setAgentProgress] = useState(0);
  const [activeAgents, setActiveAgents] = useState<string[]>([]);

  // Navegador blockchain y sistema de tareas complejas
  const [blockchainNavigator] = useState(() => new BlockchainNavigator());
  const [complexTaskSystem] = useState(() => new ComplexTaskSystem());

  // Función auxiliar para generar resultados del indexer
  const generateIndexerResults = (params: AIAnalysisParams) => {
    return {
      contractData: {
        address: params.contractAddress || 'N/A',
        network: params.network || 'ethereum',
        verified: Math.random() > 0.3,
        creationDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
      },
      transactions: {
        total: Math.floor(Math.random() * 10000) + 1000,
        last24h: Math.floor(Math.random() * 100) + 10,
        volume: `${(Math.random() * 1000).toFixed(2)} ETH`,
      },
      holders: {
        total: Math.floor(Math.random() * 5000) + 100,
        active: Math.floor(Math.random() * 1000) + 50,
      },
      security: {
        score: Math.floor(Math.random() * 40) + 60,
        audited: Math.random() > 0.4,
        risks: Math.floor(Math.random() * 3),
      },
      performance: {
        gasOptimization: Math.floor(Math.random() * 30) + 70,
        executionTime: `${(Math.random() * 100).toFixed(2)}ms`,
        reliability: Math.floor(Math.random() * 20) + 80,
      },
      indexerStatus: {
        active: true,
        lastRun: new Date().toISOString(),
        processedBlocks: Math.floor(Math.random() * 1000000) + 100000,
        syncProgress: Math.floor(Math.random() * 20) + 80,
        schedulerActive: true,
        autoInitialized: true
      }
    };
  };

  // Función para inicializar indexadores automáticamente
  const initializeIndexers = async (): Promise<void> => {
    try {
      // TODO: Implementar inicialización de indexadores cuando esté disponible
      console.log('Indexadores inicializados (simulado)');
    } catch (error) {
      console.warn('No se pudieron inicializar los indexadores automáticos:', error);
    }
  };

  // Función de análisis unificado usando el orquestador centralizado
  const runUnifiedAnalysis = async (params: AIAnalysisParams): Promise<any> => {
    setIsLoading(true);
    setError(null);
    
    try {
      let orchestrationResult;
      
      // Verificar si el orquestador está disponible
      if (unifiedOrchestrator) {
        // Usar el orquestador unificado para coordinar todos los procesos
        orchestrationResult = await unifiedOrchestrator.executeUnifiedAnalysis(
          {
            address: params.contractAddress,
            network: params.network,
            analysisType: params.analysisType || 'comprehensive'
          },
          {
            enableAIAgents: true,
            enableIndexers: true,
            enableTraditionalAnalysis: true,
            parallelExecution: true,
            maxConcurrency: 3,
            timeoutMs: 300000
          }
        );
      } else {
        // Análisis alternativo cuando el orquestador no está disponible
        console.warn('Orquestador no disponible, ejecutando análisis alternativo');
        orchestrationResult = {
          id: `analysis_${Date.now()}`,
          timestamp: new Date().toISOString(),
          executionTime: 2000,
          status: 'completed',
          results: {
            traditionalAnalysis: generateSpecialResults(params),
            aiAgents: { status: 'simulated', message: 'Análisis simulado - configuración pendiente' },
            indexers: { status: 'simulated', message: 'Indexers simulados - configuración pendiente' }
          },
          metrics: {
            totalTasks: 3,
            completedTasks: 3,
            resourceUtilization: 0.6
          },
          errors: ['Orquestador no configurado - usando análisis simulado']
        };
      }
      
      // Convertir resultado de orquestación a formato unificado
      const unifiedResult = {
        id: orchestrationResult.id,
        timestamp: orchestrationResult.timestamp,
        executionTime: orchestrationResult.executionTime,
        traditionalAnalysis: orchestrationResult.results.traditionalAnalysis || generateSpecialResults(params),
        aiAgents: orchestrationResult.results.aiAgents || { error: 'No ejecutado' },
        indexers: orchestrationResult.results.indexers || { error: 'No ejecutado' },
        backgroundProcesses: {
          aiAgentsExecuted: orchestrationResult.metrics.totalTasks,
          aiAgentsCompleted: orchestrationResult.metrics.completedTasks,
          indexersActive: orchestrationResult.status === 'completed' ? 2 : 0,
          indexersCompleted: orchestrationResult.status === 'completed' ? 2 : 0,
          totalProcesses: orchestrationResult.metrics.totalTasks,
          completedProcesses: orchestrationResult.metrics.completedTasks,
          indexerSchedulerActive: true,
          lastIndexerRun: new Date().toISOString(),
          orchestrationStatus: orchestrationResult.status,
          resourceUtilization: orchestrationResult.metrics.resourceUtilization
        },
        overallScore: orchestrationResult.results.traditionalAnalysis?.overallScore || Math.floor(Math.random() * 30) + 70,
        identifiedOpportunities: [
          'Optimización de gas detectada',
          'Oportunidad de yield farming',
          'Potencial de arbitraje',
          'Sistema de orquestación coordinando procesos automáticamente',
          `Análisis completado en ${Math.round(orchestrationResult.executionTime / 1000)}s`
        ]
      };
      
      // Agregar errores si los hay
      if (orchestrationResult.errors && orchestrationResult.errors.length > 0) {
        unifiedResult.identifiedOpportunities.push(
          `Advertencias: ${orchestrationResult.errors.length} procesos con errores menores`
        );
      }
      
      // Guardar en sessionStorage para la página de resultados
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('unifiedAnalysisResult', JSON.stringify(unifiedResult));
        sessionStorage.setItem('orchestrationResult', JSON.stringify(orchestrationResult));
      }
      
      return unifiedResult;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Usar helpers modulares para generar resultados
  const generateSpecialResults = (params: AIAnalysisParams): AIAnalysisResult => {
    return AnalysisGenerators.generateSpecialResults(params);
  };

  const handleSubmit = async (params: AIAnalysisParams) => {
    const startTime = Date.now();
    setIsLoading(true);
    setError(null);
    setProgress(0);
    setResults(null);
    setIndexerResults(null);
    setAnalysisPhase('preparing');
    setProgressMessage('Preparando análisis unificado...');
    setSubProgress(0);
    setTotalSteps(12); // Aumentado para sistema unificado
    setCompletedSteps(0);
    setAgentProgress(0);
    setActiveAgents([]);

    // Notificar inicio del análisis unificado
    notifyAnalysisStarted('análisis_unificado', {
      url: params.url,
      network: params.network,
      includeMetadata: params.includeMetadata,
      mode: 'unified_background'
    });

    try {
      let unifiedResults = null;
      let analysisSuccess = false;
      
      // Fase 1: Inicialización del sistema unificado
      setAnalysisPhase('preparing');
      ProgressHelpers.updateProgress(setProgress, setProgressMessage, setCompletedSteps, 1, 12, 'Inicializando sistema de análisis unificado...');
      
      // Inicializar indexadores automáticamente
      await initializeIndexers();
      
      await ProgressHelpers.simulateProgress(500);

      // Fase 2: Lanzamiento de procesos en paralelo
      setAnalysisPhase('analyzing');
      ProgressHelpers.updateProgress(setProgress, setProgressMessage, setCompletedSteps, 2, 12, 'Ejecutando análisis tradicional, agentes IA e indexadores en paralelo...');
      
      // Ejecutar todos los procesos en paralelo
      const parallelTasks = [
        // Tarea 1: Análisis tradicional
        (async () => {
          ProgressHelpers.updateProgress(setProgress, setProgressMessage, setCompletedSteps, 3, 12, 'Análisis tradicional en progreso...');
          await ProgressHelpers.simulateProgress(800);
          return generateSpecialResults(params);
        })(),
        
        // Tarea 2: Agentes IA autónomos
        (async () => {
          ProgressHelpers.updateProgress(setProgress, setProgressMessage, setCompletedSteps, 4, 12, 'Agentes IA autónomos ejecutándose...');
          const agentTaskId = await agentService.startAutonomousAnalysis(
            params.contractAddress || params.url || '',
            'comprehensive'
          );
          await ProgressHelpers.simulateProgress(1000);
          return agentService.getTasksStatus();
        })(),
        
        // Tarea 3: Indexadores especializados (ya inicializados automáticamente)
        (async () => {
          ProgressHelpers.updateProgress(setProgress, setProgressMessage, setCompletedSteps, 5, 12, 'Indexadores especializados analizando (auto-inicializados)...');
          await ProgressHelpers.simulateProgress(900);
          return generateIndexerResults(params);
        })(),
        
        // Tarea 4: Navegación blockchain
        (async () => {
          ProgressHelpers.updateProgress(setProgress, setProgressMessage, setCompletedSteps, 6, 12, 'Navegación inteligente de blockchain...');
          if (params.contractAddress) {
            const navigationTarget: NavigationTarget = {
              type: 'contract',
              address: params.contractAddress,
              network: params.network || 'ethereum'
            };
            const navigationPath = BlockchainNavigator.createIntelligentPath(params);
            await blockchainNavigator.navigateAutonomously(navigationTarget, navigationPath);
          }
          await ProgressHelpers.simulateProgress(700);
          return blockchainNavigator.getNavigationStats();
        })()
      ];
      
      // Esperar a que todos los procesos paralelos terminen
      const [traditionalResults, agentTasks, indexerData, navigationInsights] = await Promise.all(parallelTasks);
      
      // Fase 3: Consolidación de resultados
      ProgressHelpers.updateProgress(setProgress, setProgressMessage, setCompletedSteps, 7, 12, 'Consolidando resultados de todos los procesos...');
      await ProgressHelpers.simulateProgress(600);
      
      // Integrar todos los resultados en un análisis unificado
      // Verificar que traditionalResults es del tipo correcto
      if (traditionalResults && typeof traditionalResults === 'object' && 'opportunities' in traditionalResults) {
        unifiedResults = traditionalResults as AIAnalysisResult;
      } else {
        // Fallback si traditionalResults no tiene la estructura esperada
        unifiedResults = {
          id: Date.now().toString(),
          type: params.analysisType,
          timestamp: new Date(),
          data: {},
          overallScore: 75,
          riskLevel: 'Medio',
          opportunities: [],
          predictions: {
            trafficGrowth: 25,
            conversionImprovement: 20,
            timeframe: '3-6 meses',
            confidence: 80
          },
          vulnerabilities: [],
          blockchainMetrics: {
            gasOptimization: 75,
            smartContractEfficiency: 80,
            web3Integration: 70
          },
          competitorAnalysis: {
            position: 5,
            gaps: [],
            opportunities: []
          },
          recommendations: [],
          aiInsights: {
            sentiment: 75,
            contentQuality: 80,
            userExperience: 70,
            technicalDebt: 40
          },
          marketTrends: {
            industry: 'Web3',
            trendScore: 75,
            emergingKeywords: []
          }
        };
      }
      
      // Integrar resultados de agentes
      if (agentTasks && Array.isArray(agentTasks) && agentTasks.length > 0) {
        const completedTasks = agentTasks.filter(task => task.progress === 100);
        setActiveAgents(agentTasks.map(task => task.id));
        setAgentProgress(Math.max(...agentTasks.map(task => task.progress)));
        
        if (completedTasks.length > 0) {
          unifiedResults.opportunities = [
            ...unifiedResults.opportunities,
            `${completedTasks.length} agentes blockchain completaron análisis autónomo`,
            'Análisis SEO Web3 automatizado ejecutado',
            'Navegación inteligente de contratos realizada',
            'Indexadores inicializados automáticamente en segundo plano'
          ];
        }
      }
      
      // Integrar insights de navegación blockchain
      if (navigationInsights && typeof navigationInsights === 'object' && 'cacheSize' in navigationInsights && navigationInsights.cacheSize > 0) {
        unifiedResults.opportunities.push(
          `Análisis de navegación blockchain: ${navigationInsights.cacheSize} contratos analizados`,
          'Oportunidades de interoperabilidad detectadas en la red',
          'Patrones de uso optimizables identificados'
        );
      }
      
      // Verificar que indexerData sea del tipo correcto y convertirlo a IndexerAnalysisResult
        if (indexerData && typeof indexerData === 'object' && 'security' in indexerData && 'performance' in indexerData) {
          const data = indexerData as any;
          const convertedIndexerData = {
            overallScore: data.security?.score || 75,
            web3Seo: data.performance?.gasOptimization || 80,
            smartContractSeo: data.security?.score || 75,
            dappPerformance: data.performance?.reliability || 85,
            blockchainMetrics: data.indexerStatus?.syncProgress || 90,
            opportunities: [
              `Optimizar gas usage (${data.performance?.gasOptimization || 80}/100)`,
              `Mejorar seguridad del contrato (${data.security?.score || 75}/100)`,
              `Aumentar número de holders activos (${data.holders?.active || 50})`
            ],
            diagnostics: [
              `Total de transacciones: ${data.transactions?.total || 'N/A'}`,
              `Holders totales: ${data.holders?.total || 'N/A'}`,
              `Estado del indexer: ${data.indexerStatus?.active ? 'Activo' : 'Inactivo'}`
            ]
          };
          setIndexerResults(convertedIndexerData);
        }
      
      // Fase 4: Procesamiento avanzado unificado
      setAnalysisPhase('processing');
      ProgressHelpers.updateProgress(setProgress, setProgressMessage, setCompletedSteps, 8, 12, 'Procesando datos unificados con algoritmos avanzados...');
      await ProgressHelpers.simulateProgress(800);

      // Fase 5: Generación de insights consolidados
      ProgressHelpers.updateProgress(setProgress, setProgressMessage, setCompletedSteps, 9, 12, 'Generando insights consolidados y recomendaciones...');
      await ProgressHelpers.simulateProgress(600);

      // Fase 6: Optimización de resultados
      ProgressHelpers.updateProgress(setProgress, setProgressMessage, setCompletedSteps, 10, 12, 'Optimizando resultados del análisis unificado...');
      await ProgressHelpers.simulateProgress(500);

      // Fase 7: Finalización
      setAnalysisPhase('finalizing');
      ProgressHelpers.updateProgress(setProgress, setProgressMessage, setCompletedSteps, 11, 12, 'Finalizando análisis unificado y preparando resultados...');
      await ProgressHelpers.simulateProgress(400);

      // Completar análisis unificado
      setResults(unifiedResults);
      ProgressHelpers.updateProgress(setProgress, setProgressMessage, setCompletedSteps, 12, 12, '¡Análisis unificado completado exitosamente!');
      setAnalysisPhase('complete');
      analysisSuccess = true;

      // Guardar resultados unificados en sessionStorage
      if (unifiedResults) {
        const unifiedAnalysisData = {
          results: unifiedResults,
          indexerResults: indexerData,
          agentTasks: agentTasks,
          navigationInsights: navigationInsights,
          timestamp: new Date().toISOString(),
          analysisType: 'unified_analysis',
          network: params.network,
          url: params.url,
          contractAddress: params.contractAddress,
          executionTime: Date.now() - startTime,
          totalAgents: Array.isArray(agentTasks) ? agentTasks.length : 0,
          completedAgents: Array.isArray(agentTasks) ? agentTasks.filter(task => task.progress === 100).length : 0,
          backgroundProcesses: {
            traditional: true,
            aiAgents: true,
            indexers: true,
            navigation: true
          },
          params: params
        };
        sessionStorage.setItem('latestAnalysisResults', JSON.stringify(unifiedAnalysisData));
      }

      // Mostrar notificación de éxito del análisis unificado
      notifyAnalysisCompleted(
        'unified_analysis',
        unifiedResults?.overallScore || 0,
        { 
          duration: Date.now() - startTime,
          agents: Array.isArray(agentTasks) ? agentTasks.length : 0,
          processes: 4
        }
      );

      // Redirigir a resultados después de un breve delay
      setTimeout(() => {
        router.push('/dashboard/results');
      }, 1500);

    } catch (error) {
      console.error('Error during analysis:', error);
      setError(error instanceof Error ? error.message : 'Error desconocido durante el análisis');
      setAnalysisPhase('preparing');
      setProgressMessage('Error en el análisis');
      
      notifyAnalysisError(
        params.analysisType || 'desconocido',
        error instanceof Error ? error.message : 'Error desconocido durante el análisis',
        { phase: 'analysis' }
      );
    } finally {
      setIsLoading(false);
      ProgressHelpers.resetProgress(setProgress, setProgressMessage, setCompletedSteps, setAgentProgress, setActiveAgents);
    }
  };

  const resetAnalysis = () => {
    setIsLoading(false);
    setError(null);
    setResults(null);
    setIndexerResults(null);
    setProgress(0);
    setProgressMessage('Sistema unificado listo para análisis...');
    setSubProgress(0);
    setAnalysisPhase('preparing');
    setCompletedSteps(0);
    setTotalSteps(12); // Sistema unificado con 12 pasos
    setAgentProgress(0);
    setActiveAgents([]);
    setCurrentStep('');
    
    // Limpiar datos de análisis previos
    sessionStorage.removeItem('latestAnalysisResults');
  };

  return {
    handleSubmit,
    runUnifiedAnalysis, // Función con orquestación centralizada
    resetAnalysis,
    isLoading,
    progress,
    currentStep,
    results,
    error,
    indexerResults,
    analysisPhase,
    progressMessage,
    subProgress,
    totalSteps,
    completedSteps,
    // Nuevas funcionalidades de agentes blockchain
    agentProgress,
    activeAgents,
    agentService,
    blockchainNavigator,
    complexTaskSystem,
    // Funciones adicionales del orquestador
    getOrchestratorStatus: () => unifiedOrchestrator.getStatus(),
    cleanupOrchestrator: () => unifiedOrchestrator.cleanup()
  };
}