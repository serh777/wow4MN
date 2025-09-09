/**
 * Hook personalizado para el orquestador de análisis
 * Optimizado para Supabase/Netlify con SSE y tiempo real
 * Basado en análisis externo de mejoras para implementación
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { analysisOrchestrator } from '../services/analysis-orchestrator';
import type {
  UnifiedAnalysisRequest,
  UnifiedAnalysisResult,
  AnalysisProgress,
  AnalysisType,
  UnifiedRecommendation
} from '../services/analysis-orchestrator';
import { createClient } from '@supabase/supabase-js';
import { toast } from 'sonner';

// Tipos para el hook
export interface UseAnalysisOrchestratorOptions {
  autoRefresh?: boolean;
  refreshInterval?: number;
  enableRealtime?: boolean;
  enableNotifications?: boolean;
  maxRetries?: number;
  userId?: string;
}

export interface AnalysisState {
  isAnalyzing: boolean;
  currentAnalysisId: string | null;
  progress: AnalysisProgress | null;
  result: UnifiedAnalysisResult | null;
  error: string | null;
  history: UnifiedAnalysisResult[];
  isLoadingHistory: boolean;
}

export interface AnalysisActions {
  startAnalysis: (request: UnifiedAnalysisRequest) => Promise<string | null>;
  cancelAnalysis: () => Promise<boolean>;
  refreshProgress: () => Promise<void>;
  loadHistory: (limit?: number) => Promise<void>;
  clearError: () => void;
  clearResult: () => void;
  compareAnalyses: (id1: string, id2: string) => Promise<any>;
  exportResult: (format: 'json' | 'csv' | 'pdf') => Promise<void>;
  retryAnalysis: () => Promise<void>;
}

export interface UseAnalysisOrchestratorReturn {
  state: AnalysisState;
  actions: AnalysisActions;
  utils: {
    getAnalysisById: (id: string) => UnifiedAnalysisResult | null;
    getRecommendationsByCategory: (category: string) => UnifiedRecommendation[];
    calculateOverallScore: () => number;
    getAnalysisStatus: () => 'idle' | 'analyzing' | 'completed' | 'error';
    formatProcessingTime: (ms: number) => string;
    getProgressPercentage: () => number;
  };
}

/**
 * Hook principal para el orquestador de análisis
 */
export function useAnalysisOrchestrator(
  options: UseAnalysisOrchestratorOptions = {}
): UseAnalysisOrchestratorReturn {
  const {
    autoRefresh = true,
    refreshInterval = 2000,
    enableRealtime = true,
    enableNotifications = true,
    maxRetries = 3,
    userId
  } = options;

  // Estado del análisis
  const [state, setState] = useState<AnalysisState>({
    isAnalyzing: false,
    currentAnalysisId: null,
    progress: null,
    result: null,
    error: null,
    history: [],
    isLoadingHistory: false
  });

  // Referencias para cleanup
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const supabaseRef = useRef<any>(null);
  const retryCountRef = useRef(0);
  const lastRequestRef = useRef<UnifiedAnalysisRequest | null>(null);

  // Inicializar Supabase para realtime
  useEffect(() => {
    if (enableRealtime) {
      supabaseRef.current = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );
    }
  }, [enableRealtime]);

  // Limpiar intervalos al desmontar
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  /**
   * Iniciar polling de progreso
   */
  const startProgressPolling = useCallback((analysisId: string): void => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(async () => {
      try {
        const progress = analysisOrchestrator.getAnalysisProgress(analysisId);
        
        setState(prev => ({
          ...prev,
          progress
        }));

        // Si está completo o falló, detener polling
        if (progress?.status === 'completed' || progress?.status === 'failed') {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }

          // Obtener resultado final si está completo
          if (progress.status === 'completed') {
            const result = await analysisOrchestrator.getAnalysisResult(analysisId);
            
            setState(prev => ({
              ...prev,
              isAnalyzing: false,
              result
            }));

            if (enableNotifications && result) {
              toast.success('Análisis completado correctamente');
            }
          } else {
            setState(prev => ({
              ...prev,
              isAnalyzing: false,
              error: 'El análisis falló'
            }));

            if (enableNotifications) {
              toast.error('El análisis falló');
            }
          }
        }
      } catch (error) {
        console.error('Error en polling de progreso:', error);
      }
    }, refreshInterval);
  }, [refreshInterval, enableNotifications]);

  /**
   * Configurar suscripción realtime
   */
  const setupRealtimeSubscription = useCallback((analysisId: string): void => {
    if (!supabaseRef.current) {
      return;
    }

    const subscription = supabaseRef.current
      .channel(`analysis-${analysisId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'unified_analysis_results',
          filter: `id=eq.${analysisId}`
        },
        (payload: any) => {
          const updatedResult = payload.new as UnifiedAnalysisResult;
          
          setState(prev => ({
            ...prev,
            result: updatedResult,
            isAnalyzing: updatedResult.status === 'processing'
          }));

          if (updatedResult.status === 'completed' && enableNotifications) {
            toast.success('Análisis completado (tiempo real)');
          }
        }
      )
      .subscribe();

    // Cleanup subscription cuando el análisis termine
    const cleanup = () => {
      subscription.unsubscribe();
    };

    // Guardar cleanup para uso posterior
    (subscription as any).cleanup = cleanup;
  }, [enableNotifications]);

  /**
   * Iniciar análisis
   */
  const startAnalysis = useCallback(async (request: UnifiedAnalysisRequest): Promise<string | null> => {
    try {
      setState(prev => ({
        ...prev,
        isAnalyzing: true,
        error: null,
        result: null,
        progress: null
      }));

      // Guardar request para retry
      lastRequestRef.current = request;
      retryCountRef.current = 0;

      // Agregar userId si está disponible
      const requestWithUser = {
        ...request,
        userId: userId || request.userId
      };

      const analysisId = await analysisOrchestrator.executeAnalysis(requestWithUser);
      
      setState(prev => ({
        ...prev,
        currentAnalysisId: analysisId
      }));

      // Iniciar polling de progreso
      if (autoRefresh) {
        startProgressPolling(analysisId);
      }

      // Configurar realtime si está habilitado
      if (enableRealtime && supabaseRef.current) {
        setupRealtimeSubscription(analysisId);
      }

      if (enableNotifications) {
        toast.success('Análisis iniciado correctamente');
      }

      return analysisId;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      
      setState(prev => ({
        ...prev,
        isAnalyzing: false,
        error: errorMessage
      }));

      if (enableNotifications) {
        toast.error(`Error iniciando análisis: ${errorMessage}`);
      }

      return null;
    }
  }, [userId, autoRefresh, enableRealtime, enableNotifications, startProgressPolling, setupRealtimeSubscription]);



  /**
   * Cancelar análisis
   */
  const cancelAnalysis = useCallback(async (): Promise<boolean> => {
    if (!state.currentAnalysisId) {
      return false;
    }

    try {
      const success = await analysisOrchestrator.cancelAnalysis(state.currentAnalysisId);
      
      if (success) {
        setState(prev => ({
          ...prev,
          isAnalyzing: false,
          currentAnalysisId: null,
          progress: null
        }));

        // Limpiar polling
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }

        if (enableNotifications) {
          toast.info('Análisis cancelado');
        }
      }

      return success;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error cancelando análisis';
      
      setState(prev => ({
        ...prev,
        error: errorMessage
      }));

      if (enableNotifications) {
        toast.error(errorMessage);
      }

      return false;
    }
  }, [state.currentAnalysisId, enableNotifications]);

  /**
   * Refrescar progreso
   */
  const refreshProgress = useCallback(async (): Promise<void> => {
    if (!state.currentAnalysisId) {
      return;
    }

    try {
      const progress = analysisOrchestrator.getAnalysisProgress(state.currentAnalysisId);
      
      setState(prev => ({
        ...prev,
        progress
      }));

      // Si el análisis está completo, obtener resultado
      if (progress?.status === 'completed') {
        const result = await analysisOrchestrator.getAnalysisResult(state.currentAnalysisId);
        
        setState(prev => ({
          ...prev,
          isAnalyzing: false,
          result,
          progress
        }));

        // Limpiar polling
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }

        if (enableNotifications && result) {
          toast.success('Análisis completado correctamente');
        }
      } else if (progress?.status === 'failed') {
        setState(prev => ({
          ...prev,
          isAnalyzing: false,
          error: 'El análisis falló',
          progress
        }));

        // Limpiar polling
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }

        if (enableNotifications) {
          toast.error('El análisis falló');
        }
      }
    } catch (error) {
      console.error('Error refrescando progreso:', error);
    }
  }, [state.currentAnalysisId, enableNotifications]);

  /**
   * Cargar historial
   */
  const loadHistory = useCallback(async (limit: number = 20): Promise<void> => {
    try {
      setState(prev => ({
        ...prev,
        isLoadingHistory: true
      }));

      const history = await analysisOrchestrator.getAnalysisHistory(userId, limit);
      
      setState(prev => ({
        ...prev,
        history,
        isLoadingHistory: false
      }));
    } catch (error) {
      console.error('Error cargando historial:', error);
      
      setState(prev => ({
        ...prev,
        isLoadingHistory: false,
        error: 'Error cargando historial'
      }));
    }
  }, [userId]);

  /**
   * Comparar análisis
   */
  const compareAnalyses = useCallback(async (id1: string, id2: string): Promise<any> => {
    try {
      const comparison = await analysisOrchestrator.compareAnalyses(id1, id2);
      
      if (enableNotifications) {
        toast.success('Comparación generada correctamente');
      }
      
      return comparison;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error comparando análisis';
      
      setState(prev => ({
        ...prev,
        error: errorMessage
      }));

      if (enableNotifications) {
        toast.error(errorMessage);
      }
      
      throw error;
    }
  }, [enableNotifications]);

  /**
   * Exportar resultado
   */
  const exportResult = useCallback(async (format: 'json' | 'csv' | 'pdf'): Promise<void> => {
    if (!state.result) {
      throw new Error('No hay resultado para exportar');
    }

    try {
      let content: string;
      let filename: string;
      let mimeType: string;

      switch (format) {
        case 'json':
          content = JSON.stringify(state.result, null, 2);
          filename = `analysis-${state.result.id}.json`;
          mimeType = 'application/json';
          break;
        
        case 'csv':
          content = convertToCSV(state.result);
          filename = `analysis-${state.result.id}.csv`;
          mimeType = 'text/csv';
          break;
        
        case 'pdf':
          // Para PDF, necesitaríamos una librería como jsPDF
          throw new Error('Exportación PDF no implementada aún');
        
        default:
          throw new Error(`Formato no soportado: ${format}`);
      }

      // Crear y descargar archivo
      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      if (enableNotifications) {
        toast.success(`Resultado exportado como ${format.toUpperCase()}`);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error exportando resultado';
      
      setState(prev => ({
        ...prev,
        error: errorMessage
      }));

      if (enableNotifications) {
        toast.error(errorMessage);
      }
    }
  }, [state.result, enableNotifications]);

  /**
   * Reintentar análisis
   */
  const retryAnalysis = useCallback(async (): Promise<void> => {
    if (!lastRequestRef.current || retryCountRef.current >= maxRetries) {
      throw new Error('No se puede reintentar el análisis');
    }

    retryCountRef.current++;
    
    if (enableNotifications) {
      toast.info(`Reintentando análisis (${retryCountRef.current}/${maxRetries})`);
    }

    await startAnalysis(lastRequestRef.current);
  }, [maxRetries, enableNotifications, startAnalysis]);

  /**
   * Limpiar error
   */
  const clearError = useCallback((): void => {
    setState(prev => ({
      ...prev,
      error: null
    }));
  }, []);

  /**
   * Limpiar resultado
   */
  const clearResult = useCallback((): void => {
    setState(prev => ({
      ...prev,
      result: null,
      progress: null,
      currentAnalysisId: null,
      isAnalyzing: false
    }));
  }, []);

  // Utilidades
  const utils = {
    getAnalysisById: useCallback((id: string): UnifiedAnalysisResult | null => {
      return state.history.find(analysis => analysis.id === id) || null;
    }, [state.history]),

    getRecommendationsByCategory: useCallback((category: string): UnifiedRecommendation[] => {
      if (!state.result?.recommendations) {
        return [];
      }
      
      return state.result.recommendations.filter(rec => rec.category === category);
    }, [state.result]),

    calculateOverallScore: useCallback((): number => {
      return state.result?.score.overall || 0;
    }, [state.result]),

    getAnalysisStatus: useCallback((): 'idle' | 'analyzing' | 'completed' | 'error' => {
      if (state.error) return 'error';
      if (state.isAnalyzing) return 'analyzing';
      if (state.result) return 'completed';
      return 'idle';
    }, [state.error, state.isAnalyzing, state.result]),

    formatProcessingTime: useCallback((ms: number): string => {
      const seconds = Math.floor(ms / 1000);
      const minutes = Math.floor(seconds / 60);
      const hours = Math.floor(minutes / 60);

      if (hours > 0) {
        return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
      } else if (minutes > 0) {
        return `${minutes}m ${seconds % 60}s`;
      } else {
        return `${seconds}s`;
      }
    }, []),

    getProgressPercentage: useCallback((): number => {
      return state.progress?.progress || 0;
    }, [state.progress])
  };

  // Cargar historial al montar
  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  return {
    state,
    actions: {
      startAnalysis,
      cancelAnalysis,
      refreshProgress,
      loadHistory,
      clearError,
      clearResult,
      compareAnalyses,
      exportResult,
      retryAnalysis
    },
    utils
  };
}

/**
 * Hook simplificado para análisis rápido
 */
export function useQuickAnalysis(url?: string) {
  const orchestrator = useAnalysisOrchestrator({
    autoRefresh: true,
    enableNotifications: true
  });

  const runQuickAnalysis = useCallback(async (targetUrl?: string) => {
    const analysisUrl = targetUrl || url;
    
    if (!analysisUrl) {
      throw new Error('URL requerida para análisis');
    }

    return await orchestrator.actions.startAnalysis({
      url: analysisUrl,
      analysisTypes: ['performance', 'metadata', 'content'],
      priority: 'medium',
      options: {
        depth: 'basic',
        includePerformance: true,
        includeMetadata: true,
        includeContent: true
      }
    });
  }, [url, orchestrator.actions]);

  const runComprehensiveAnalysis = useCallback(async (targetUrl?: string) => {
    const analysisUrl = targetUrl || url;
    
    if (!analysisUrl) {
      throw new Error('URL requerida para análisis');
    }

    return await orchestrator.actions.startAnalysis({
      url: analysisUrl,
      analysisTypes: ['comprehensive'],
      priority: 'high',
      options: {
        depth: 'comprehensive',
        includeAI: true,
        includePerformance: true,
        includeMetadata: true,
        includeContent: true,
        includeBacklinks: true,
        includeKeywords: true,
        includeLinks: true
      }
    });
  }, [url, orchestrator.actions]);

  return {
    ...orchestrator,
    runQuickAnalysis,
    runComprehensiveAnalysis
  };
}

/**
 * Función auxiliar para convertir resultado a CSV
 */
function convertToCSV(result: UnifiedAnalysisResult): string {
  const headers = [
    'ID',
    'URL',
    'Timestamp',
    'Status',
    'Overall Score',
    'SEO Score',
    'Performance Score',
    'Security Score',
    'Content Score',
    'Technical Score',
    'Processing Time (ms)',
    'Recommendations Count'
  ];

  const row = [
    result.id,
    result.url,
    result.timestamp,
    result.status,
    result.score.overall,
    result.score.seo,
    result.score.performance,
    result.score.security,
    result.score.content,
    result.score.technical,
    result.processingTime,
    result.recommendations.length
  ];

  return [headers.join(','), row.join(',')].join('\n');
}

export default useAnalysisOrchestrator;