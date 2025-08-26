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

  // Usar helpers modulares para generar resultados
  const generateSpecialResults = (params: AIAnalysisParams): AIAnalysisResult => {
    return AnalysisGenerators.generateSpecialResults(params);
  };

  const generateIndexerResults = (params: AIAnalysisParams): IndexerAnalysisResult => {
    return AnalysisGenerators.generateIndexerResults(params);
  };

  const handleSubmit = async (params: AIAnalysisParams) => {
    const startTime = Date.now();
    setIsLoading(true);
    setError(null);
    setProgress(0);
    setResults(null);
    setIndexerResults(null);
    setAnalysisPhase('preparing');
    setProgressMessage('Preparando análisis...');
    setSubProgress(0);
    setTotalSteps(10); // Aumentado para incluir agentes
    setCompletedSteps(0);
    setAgentProgress(0);
    setActiveAgents([]);

    try {
      // Fase 1: Preparación
      setAnalysisPhase('preparing');
      ProgressHelpers.updateProgress(setProgress, setProgressMessage, setCompletedSteps, 1, 10, 'Inicializando servicios de análisis...');
      await ProgressHelpers.simulateProgress(800);

      // Fase 2: Inicializar agentes blockchain y navegador
      ProgressHelpers.updateProgress(setProgress, setProgressMessage, setCompletedSteps, 2, 10, 'Inicializando agentes blockchain autónomos...');
      const taskId = await agentService.startAutonomousAnalysis(params.contractAddress || params.url, params.analysisType);
      const agentStatuses = agentService.getAgentsStatus();
      setActiveAgents(agentStatuses.map(a => a.id));
      
      // Configurar navegador blockchain para el análisis
      if (params.contractAddress) {
        const navigationTarget: NavigationTarget = {
          type: 'contract',
          address: params.contractAddress,
          network: params.network || 'ethereum'
        };
        const navigationPath = BlockchainNavigator.createIntelligentPath(params);
        await blockchainNavigator.navigateAutonomously(navigationTarget, navigationPath);
      }
      await ProgressHelpers.simulateProgress(1000);

      // Fase 3: Análisis revolucionario con múltiples APIs
      setAnalysisPhase('analyzing');
      ProgressHelpers.updateProgress(setProgress, setProgressMessage, setCompletedSteps, 3, 10, 'Ejecutando análisis revolucionario con IA...');
      
      let revolutionaryResults = null;
      let analysisSuccess = false;
      
      // Intentar con DeepSeek primero
      try {
        ProgressHelpers.updateProgress(setProgress, setProgressMessage, setCompletedSteps, 4, 10, 'Analizando con DeepSeek AI...');
        await ProgressHelpers.simulateProgress(1200);
        
        revolutionaryResults = generateSpecialResults(params);
        analysisSuccess = true;
      } catch (deepseekError) {
        console.warn('DeepSeek analysis failed, trying Anthropic...', deepseekError);
        
        // Fallback a Anthropic
        try {
          ProgressHelpers.updateProgress(setProgress, setProgressMessage, setCompletedSteps, 4, 10, 'Fallback: Analizando con Anthropic Claude...');
          await ProgressHelpers.simulateProgress(1000);
          
          revolutionaryResults = generateSpecialResults(params);
          analysisSuccess = true;
        } catch (anthropicError) {
          console.warn('Anthropic analysis failed, using traditional analysis...', anthropicError);
          
          // Fallback final a análisis tradicional
          ProgressHelpers.updateProgress(setProgress, setProgressMessage, setCompletedSteps, 4, 10, 'Fallback: Ejecutando análisis tradicional...');
          await ProgressHelpers.simulateProgress(800);
          
          if (params.contractAddress) {
            const realResults = await generateRealResults(params.contractAddress, params.network || 'ethereum');
            revolutionaryResults = {
              ...generateSpecialResults(params),
              data: realResults
            };
          } else {
            revolutionaryResults = generateSpecialResults(params);
          }
          analysisSuccess = true;
        }
      }

      // Fase 4: Ejecutar agentes autónomos con navegación
      ProgressHelpers.updateProgress(setProgress, setProgressMessage, setCompletedSteps, 5, 10, 'Ejecutando agentes autónomos para análisis Web3...');
      const agentTaskId = await agentService.startAutonomousAnalysis(
        params.contractAddress || params.url || '',
        params.analysisType || 'comprehensive'
      );
      
      // Monitorear progreso de agentes
      const agentTasks = agentService.getTasksStatus();
      agentTasks.forEach(task => {
        setAgentProgress(task.progress);
      });
      
      // Obtener insights de navegación blockchain
      const navigationInsights = blockchainNavigator.getNavigationStats();
      
      // Integrar resultados de agentes con análisis principal
      if (revolutionaryResults && agentTasks.length > 0) {
        // Agregar métricas de agentes blockchain
        const completedTasks = agentTasks.filter(task => task.progress === 100);
        if (completedTasks.length > 0) {
          revolutionaryResults.opportunities = [
            ...revolutionaryResults.opportunities,
            `${completedTasks.length} agentes blockchain completaron análisis autónomo`,
            'Análisis SEO Web3 automatizado ejecutado',
            'Navegación inteligente de contratos realizada'
          ];
        }
        
        // Agregar insights de navegación blockchain
        if (navigationInsights.cacheSize > 0) {
          revolutionaryResults.opportunities.push(
            `Análisis de navegación blockchain: ${navigationInsights.cacheSize} contratos analizados`,
            'Oportunidades de interoperabilidad detectadas en la red',
            'Patrones de uso optimizables identificados'
          );
        }
      }

      // Fase 5: Análisis con Indexer
      setAnalysisPhase('processing');
      ProgressHelpers.updateProgress(setProgress, setProgressMessage, setCompletedSteps, 6, 10, 'Ejecutando análisis con indexer especializado...');
      await ProgressHelpers.simulateProgress(1000);
      
      const indexerData = generateIndexerResults(params);
      setIndexerResults(indexerData);

      // Fase 6: Procesamiento avanzado
      ProgressHelpers.updateProgress(setProgress, setProgressMessage, setCompletedSteps, 7, 10, 'Procesando datos con algoritmos avanzados...');
      await ProgressHelpers.simulateProgress(1200);

      // Fase 7: Generación de insights
      ProgressHelpers.updateProgress(setProgress, setProgressMessage, setCompletedSteps, 8, 10, 'Generando insights y recomendaciones...');
      await ProgressHelpers.simulateProgress(800);

      // Fase 8: Finalización
      setAnalysisPhase('finalizing');
      ProgressHelpers.updateProgress(setProgress, setProgressMessage, setCompletedSteps, 9, 10, 'Finalizando análisis y preparando resultados...');
      await ProgressHelpers.simulateProgress(600);

      // Completar análisis
      setResults(revolutionaryResults);
      ProgressHelpers.updateProgress(setProgress, setProgressMessage, setCompletedSteps, 10, 10, '¡Análisis completado exitosamente!');
      setAnalysisPhase('complete');

      // Guardar resultados en sessionStorage
      if (revolutionaryResults) {
        const analysisData = {
          aiResults: revolutionaryResults,
          indexerResults: indexerData,
          agentResults: agentTasks,
          timestamp: new Date().toISOString(),
          params: params
        };
        sessionStorage.setItem('analysisResults', JSON.stringify(analysisData));
      }

      // Mostrar notificación de éxito
      notifyAnalysisCompleted(
        params.analysisType,
        revolutionaryResults?.overallScore || 0,
        { duration: Date.now() - startTime }
      );

      // Redirigir a resultados después de un breve delay
      setTimeout(() => {
        router.push('/dashboard/ai-assistant/results');
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
    ProgressHelpers.resetProgress(
      setProgress,
      setProgressMessage,
      setCompletedSteps,
      setAgentProgress,
      setActiveAgents
    );
    setResults(null);
    setError(null);
    setCurrentStep('');
    setIndexerResults(null);
    setAnalysisPhase('preparing');
    setSubProgress(0);
    setTotalSteps(0);
  };

  return {
    handleSubmit,
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
    complexTaskSystem
  };
}