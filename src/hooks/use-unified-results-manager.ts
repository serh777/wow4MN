'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { dashboardOrchestrator } from '@/services/dashboard-orchestrator';
import { ToolResult } from '@/components/results/dynamic-results-renderer';
import { useAnalysisNotifications } from '@/components/notifications/use-analysis-notifications';

export interface UnifiedResultsState {
  results: Map<string, ToolResult>;
  isLoading: boolean;
  error: string | null;
  progress: number;
  completedTools: Set<string>;
  failedTools: Set<string>;
  currentTool: string | null;
  requestId: string | null;
  lastUpdated: Date | null;
  cache: Map<string, { data: ToolResult; timestamp: number }>;
}

export interface UseUnifiedResultsOptions {
  onComplete?: (results: ToolResult[]) => void;
  onError?: (error: string) => void;
  onProgress?: (progress: number, currentTool: string) => void;
  autoRefresh?: boolean;
  refreshInterval?: number;
  cacheTimeout?: number; // en milisegundos
  maxRetries?: number;
  retryDelay?: number;
}

export interface AnalysisConfig {
  address: string;
  selectedTools: string[];
  options?: {
    timeframe?: string;
    includeAdvanced?: boolean;
    priority?: 'speed' | 'accuracy' | 'comprehensive';
    batchSize?: number;
    parallelExecution?: boolean;
  };
}

const DEFAULT_OPTIONS: Required<UseUnifiedResultsOptions> = {
  onComplete: () => {},
  onError: () => {},
  onProgress: () => {},
  autoRefresh: false,
  refreshInterval: 5000,
  cacheTimeout: 300000, // 5 minutos
  maxRetries: 3,
  retryDelay: 2000
};

export function useUnifiedResultsManager(options: UseUnifiedResultsOptions = {}) {
  const mergedOptions = useMemo(() => ({ ...DEFAULT_OPTIONS, ...options }), [options]);
  const { notifyAnalysisStarted, notifyAnalysisCompleted, notifyAnalysisError } = useAnalysisNotifications();
  
  const [state, setState] = useState<UnifiedResultsState>({
    results: new Map(),
    isLoading: false,
    error: null,
    progress: 0,
    completedTools: new Set(),
    failedTools: new Set(),
    currentTool: null,
    requestId: null,
    lastUpdated: null,
    cache: new Map()
  });

  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const retryCountRef = useRef<Map<string, number>>(new Map());

  // Función para limpiar intervalos
  const clearIntervals = useCallback(() => {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  // Función para verificar cache
  const getCachedResult = useCallback((toolId: string, address: string): ToolResult | null => {
    const cacheKey = `${toolId}-${address}`;
    const cached = state.cache.get(cacheKey);
    
    if (cached && (Date.now() - cached.timestamp) < mergedOptions.cacheTimeout) {
      return cached.data;
    }
    
    return null;
  }, [state.cache, mergedOptions.cacheTimeout]);

  // Función para guardar en cache
  const setCachedResult = useCallback((toolId: string, address: string, result: ToolResult) => {
    const cacheKey = `${toolId}-${address}`;
    setState(prev => ({
      ...prev,
      cache: new Map(prev.cache.set(cacheKey, {
        data: result,
        timestamp: Date.now()
      }))
    }));
  }, []);

  // Función para limpiar cache expirado
  const cleanExpiredCache = useCallback(() => {
    const now = Date.now();
    setState(prev => {
      const newCache = new Map();
      prev.cache.forEach((value, key) => {
        if ((now - value.timestamp) < mergedOptions.cacheTimeout) {
          newCache.set(key, value);
        }
      });
      return { ...prev, cache: newCache };
    });
  }, [mergedOptions.cacheTimeout]);

  // Función para inicializar resultados con cache
  const initializeResults = useCallback((config: AnalysisConfig) => {
    const initialResults = new Map<string, ToolResult>();
    
    config.selectedTools.forEach(toolId => {
      // Verificar cache primero
      const cachedResult = getCachedResult(toolId, config.address);
      
      if (cachedResult) {
        initialResults.set(toolId, cachedResult);
      } else {
        initialResults.set(toolId, {
          toolId,
          toolName: getToolName(toolId),
          status: 'pending',
          data: null,
          timestamp: new Date().toISOString()
        });
      }
    });
    
    return initialResults;
  }, [getCachedResult]);

  // Función para monitorear el progreso del análisis
  const monitorAnalysisProgress = useCallback((requestId: string, config: AnalysisConfig) => {
    const analysisStatus = dashboardOrchestrator.getAnalysisStatus(requestId);
    
    if (!analysisStatus) return;

    // Calcular progreso general
    const overallProgress = analysisStatus.progress.reduce((sum, p) => sum + p.progress, 0) / analysisStatus.progress.length;
    const currentTool = analysisStatus.progress.find(p => p.status === 'running')?.toolName || null;
    
    // Actualizar resultados
    const updatedResults = new Map(state.results);
    const newCompletedTools = new Set(state.completedTools);
    const newFailedTools = new Set(state.failedTools);
    
    analysisStatus.results.forEach(result => {
      const transformedResult = transformAnalysisResult(result.toolId, result);
      updatedResults.set(result.toolId, transformedResult);
      
      if (result.status === 'success') {
        newCompletedTools.add(result.toolId);
        newFailedTools.delete(result.toolId);
        // Guardar en cache
        setCachedResult(result.toolId, config.address, transformedResult);
      } else if (result.status === 'error') {
        newFailedTools.add(result.toolId);
        newCompletedTools.delete(result.toolId);
      }
    });
    
    setState(prev => ({
      ...prev,
      results: updatedResults,
      progress: overallProgress,
      currentTool,
      completedTools: newCompletedTools,
      failedTools: newFailedTools,
      lastUpdated: new Date()
    }));
    
    mergedOptions.onProgress(overallProgress, currentTool || '');
    
    // Verificar si el análisis está completo
    if (analysisStatus.status === 'completed' || analysisStatus.status === 'error') {
      clearIntervals();
      
      setState(prev => ({
        ...prev,
        isLoading: false,
        progress: 100,
        currentTool: null
      }));
      
      if (analysisStatus.status === 'completed') {
        mergedOptions.onComplete(Array.from(updatedResults.values()));
        notifyAnalysisCompleted('Análisis completado exitosamente');
      } else {
        const errorMessage = 'Error en el análisis';
        mergedOptions.onError(errorMessage);
        notifyAnalysisError('Análisis Unificado', errorMessage);
      }
    }
  }, [state.results, state.completedTools, state.failedTools, setCachedResult, mergedOptions, clearIntervals, notifyAnalysisCompleted, notifyAnalysisError]);

  // Función principal para iniciar análisis
  const startAnalysis = useCallback(async (config: AnalysisConfig) => {
    clearIntervals();
    cleanExpiredCache();
    
    const initialResults = initializeResults(config);
    const cachedCount = Array.from(initialResults.values())
      .filter(r => r.status === 'completed').length;
    
    setState(prev => ({
      ...prev,
      results: initialResults,
      isLoading: true,
      error: null,
      progress: cachedCount > 0 ? (cachedCount / config.selectedTools.length) * 100 : 0,
      completedTools: new Set(Array.from(initialResults.entries())
        .filter(([_, result]) => result.status === 'completed')
        .map(([toolId]) => toolId)),
      failedTools: new Set(),
      currentTool: null,
      requestId: null,
      lastUpdated: new Date()
    }));

    // Filtrar herramientas que necesitan análisis (no están en cache)
    const toolsToAnalyze = config.selectedTools.filter(toolId => {
      const result = initialResults.get(toolId);
      return result?.status !== 'completed';
    });

    if (toolsToAnalyze.length === 0) {
      // Todos los resultados están en cache
      setState(prev => ({ ...prev, isLoading: false, progress: 100 }));
      mergedOptions.onComplete(Array.from(initialResults.values()));
      notifyAnalysisCompleted('Análisis completado (desde cache)');
      return;
    }

    notifyAnalysisStarted(`Iniciando análisis de ${toolsToAnalyze.length} herramientas`);

    try {
      // Iniciar análisis con el orchestrator
      const requestId = await dashboardOrchestrator.startAnalysis({
        address: config.address,
        tools: toolsToAnalyze,
        isCompleteAudit: false,
        options: config.options
      });

      setState(prev => ({ ...prev, requestId }));

      // Configurar monitoreo del progreso
      pollIntervalRef.current = setInterval(() => {
        monitorAnalysisProgress(requestId, config);
      }, 1000);

      // Timeout de seguridad
      timeoutRef.current = setTimeout(() => {
        clearIntervals();
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: 'Timeout del análisis - algunos resultados pueden estar incompletos'
        }));
        mergedOptions.onError('Timeout del análisis');
      }, 300000); // 5 minutos

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
        currentTool: null
      }));
      mergedOptions.onError(errorMessage);
      notifyAnalysisError('Análisis Unificado', errorMessage);
    }
  }, [clearIntervals, cleanExpiredCache, initializeResults, mergedOptions, notifyAnalysisStarted, notifyAnalysisCompleted, notifyAnalysisError, monitorAnalysisProgress]);



  // Función para reintentar herramienta fallida con backoff exponencial
  const retryTool = useCallback(async (toolId: string, config: AnalysisConfig) => {
    const currentRetries = retryCountRef.current.get(toolId) || 0;
    
    if (currentRetries >= mergedOptions.maxRetries) {
      notifyAnalysisError('Análisis Unificado', `Máximo de reintentos alcanzado para ${getToolName(toolId)}`);
      return;
    }
    
    retryCountRef.current.set(toolId, currentRetries + 1);
    
    // Backoff exponencial
    const delay = mergedOptions.retryDelay * Math.pow(2, currentRetries);
    
    setState(prev => ({
      ...prev,
      failedTools: new Set([...prev.failedTools].filter(id => id !== toolId)),
      results: new Map(prev.results.set(toolId, {
        ...prev.results.get(toolId)!,
        status: 'pending'
      }))
    }));

    setTimeout(async () => {
      try {
        const requestId = await dashboardOrchestrator.startAnalysis({
          address: config.address,
          tools: [toolId],
          isCompleteAudit: false,
          options: config.options
        });
        
        // Monitorear solo esta herramienta
        const retryInterval = setInterval(() => {
          const analysisStatus = dashboardOrchestrator.getAnalysisStatus(requestId);
          
          if (analysisStatus && (analysisStatus.status === 'completed' || analysisStatus.status === 'error')) {
            clearInterval(retryInterval);
            
            if (analysisStatus.status === 'completed' && analysisStatus.results.length > 0) {
              const result = analysisStatus.results[0];
              const transformedResult = transformAnalysisResult(toolId, result);
              
              setState(prev => ({
                ...prev,
                results: new Map(prev.results.set(toolId, transformedResult)),
                completedTools: new Set([...prev.completedTools, toolId])
              }));
              
              setCachedResult(toolId, config.address, transformedResult);
              retryCountRef.current.delete(toolId);
            } else {
              throw new Error('Error al reintentar la herramienta');
            }
          }
        }, 1000);
        
        setTimeout(() => clearInterval(retryInterval), 120000);
      } catch (error) {
        setState(prev => ({
          ...prev,
          failedTools: new Set([...prev.failedTools, toolId]),
          results: new Map(prev.results.set(toolId, {
            ...prev.results.get(toolId)!,
            status: 'error',
            data: { error }
          }))
        }));
      }
    }, delay);
  }, [mergedOptions.maxRetries, mergedOptions.retryDelay, setCachedResult, notifyAnalysisError]);

  // Función para limpiar resultados
  const clearResults = useCallback(() => {
    clearIntervals();
    retryCountRef.current.clear();
    setState({
      results: new Map(),
      isLoading: false,
      error: null,
      progress: 0,
      completedTools: new Set(),
      failedTools: new Set(),
      currentTool: null,
      requestId: null,
      lastUpdated: null,
      cache: new Map()
    });
  }, [clearIntervals]);

  // Función para obtener resultado específico
  const getToolResult = useCallback((toolId: string): ToolResult | null => {
    return state.results.get(toolId) || null;
  }, [state.results]);

  // Función para verificar si análisis está completo
  const isAnalysisComplete = useCallback((): boolean => {
    if (state.results.size === 0) return false;
    return Array.from(state.results.values()).every(r => r.status === 'completed' || r.status === 'error');
  }, [state.results]);

  // Función para obtener estadísticas
  const getStats = useCallback(() => {
    const total = state.results.size;
    const completed = state.completedTools.size;
    const failed = state.failedTools.size;
    const pending = total - completed - failed;
    
    return {
      total,
      completed,
      failed,
      pending,
      successRate: total > 0 ? (completed / total) * 100 : 0,
      cacheHitRate: state.cache.size > 0 ? (Array.from(state.results.values())
        .filter(r => r.status === 'completed').length / state.cache.size) * 100 : 0
    };
  }, [state]);

  // Función para exportar resultados
  const exportResults = useCallback((format: 'json' | 'csv' = 'json') => {
    const results = Array.from(state.results.values());
    
    if (format === 'json') {
      return JSON.stringify({
        timestamp: new Date().toISOString(),
        results,
        stats: getStats()
      }, null, 2);
    }
    
    // CSV format
    const headers = ['toolId', 'toolName', 'status', 'score', 'timestamp'];
    const rows = results.map(r => [
      r.toolId,
      r.toolName,
      r.status,
      r.score || 0,
      r.timestamp
    ]);
    
    return [headers, ...rows].map(row => row.join(',')).join('\n');
  }, [state.results, getStats]);

  // Cleanup al desmontar
  useEffect(() => {
    return () => {
      clearIntervals();
    };
  }, [clearIntervals]);

  // Auto-refresh si está habilitado
  useEffect(() => {
    if (!mergedOptions.autoRefresh || !state.isLoading) return;

    const interval = setInterval(() => {
      cleanExpiredCache();
    }, mergedOptions.refreshInterval);

    return () => clearInterval(interval);
  }, [mergedOptions.autoRefresh, mergedOptions.refreshInterval, state.isLoading, cleanExpiredCache]);

  return {
    // Estado
    results: Array.from(state.results.values()),
    resultsMap: state.results,
    isLoading: state.isLoading,
    error: state.error,
    progress: state.progress,
    completedTools: Array.from(state.completedTools),
    failedTools: Array.from(state.failedTools),
    currentTool: state.currentTool,
    lastUpdated: state.lastUpdated,
    
    // Acciones
    startAnalysis,
    clearResults,
    retryTool,
    getToolResult,
    exportResults,
    
    // Utilidades
    isAnalysisComplete: isAnalysisComplete(),
    stats: getStats(),
    cacheSize: state.cache.size
  };
}

// Funciones de utilidad
function getToolName(toolId: string): string {
  const toolNames: Record<string, string> = {
    'ai-assistant': 'IA Analysis',
    'blockchain': 'Blockchain Analysis',
    'nft-tracking': 'NFT Tracking',
    'keywords': 'Keywords Analysis',
    'backlinks': 'Backlinks Analysis',
    'performance': 'Performance Analysis',
    'security': 'Security Audit',
    'social-web3': 'Social Web3',
    'authority-tracking': 'Authority Tracking',
    'content-authenticity': 'Content Authenticity',
    'metaverse-optimizer': 'Metaverse Optimizer',
    'ecosystem-interactions': 'Ecosystem Interactions',
    'content': 'Content Analysis',
    'links': 'Links Analysis',
    'metadata': 'Metadata Analysis',
    'wallet': 'Wallet Analysis',
    'competition': 'Competition Analysis',
    'smart-contract': 'Smart Contract Analysis',
    'historical': 'Historical Analysis'
  };
  
  return toolNames[toolId] || toolId.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
}

function transformAnalysisResult(toolId: string, analysisResult: any): ToolResult {
  const baseResult: ToolResult = {
    toolId,
    toolName: getToolName(toolId),
    status: analysisResult.status === 'success' ? 'completed' : 'error',
    data: analysisResult.data || analysisResult,
    timestamp: new Date().toISOString()
  };

  // Extraer datos específicos según el tipo de herramienta
  const commonFields = {
    insights: analysisResult.insights || [],
    recommendations: analysisResult.recommendations || [],
    score: analysisResult.score || analysisResult.overallScore || 0
  };

  return {
    ...baseResult,
    ...commonFields,
    metrics: analysisResult.metrics || {}
  };
}