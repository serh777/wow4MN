'use client';

import { useState, useEffect, useCallback } from 'react';
import { dashboardOrchestrator } from '@/services/dashboard-orchestrator';
import { ToolResult } from '@/components/results/dynamic-results-renderer';

export interface DynamicResultsState {
  results: ToolResult[];
  isLoading: boolean;
  error: string | null;
  progress: number;
  completedTools: string[];
  failedTools: string[];
  currentTool: string | null;
}

export interface UseDynamicResultsOptions {
  onComplete?: (results: ToolResult[]) => void;
  onError?: (error: string) => void;
  onProgress?: (progress: number, currentTool: string) => void;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

export function useDynamicResults(options: UseDynamicResultsOptions = {}) {
  const [state, setState] = useState<DynamicResultsState>({
    results: [],
    isLoading: false,
    error: null,
    progress: 0,
    completedTools: [],
    failedTools: [],
    currentTool: null
  });

  const orchestrator = dashboardOrchestrator;

  // Función para iniciar análisis
  const startAnalysis = useCallback(async (
    address: string,
    selectedTools: string[]
  ) => {
    setState(prev => ({
      ...prev,
      isLoading: true,
      error: null,
      progress: 0,
      results: [],
      completedTools: [],
      failedTools: [],
      currentTool: null
    }));

    try {
      // Inicializar resultados con estado pendiente
      const initialResults: ToolResult[] = selectedTools.map(toolId => ({
        toolId,
        toolName: getToolName(toolId),
        status: 'pending',
        data: null,
        timestamp: new Date().toISOString()
      }));

      setState(prev => ({
        ...prev,
        results: initialResults
      }));

      // Ejecutar análisis con el orchestrator
      const requestId = await orchestrator.startAnalysis({
        address,
        tools: selectedTools,
        isCompleteAudit: false,
        options: {
          timeframe: '30d',
          includeAdvanced: true,
          priority: 'comprehensive'
        }
      });

      // Monitorear el progreso del análisis
      const pollInterval = setInterval(() => {
        const analysisStatus = orchestrator.getAnalysisStatus(requestId);
        
        if (analysisStatus) {
          // Actualizar progreso
          const overallProgress = analysisStatus.progress.reduce((sum, p) => sum + p.progress, 0) / analysisStatus.progress.length;
          const currentTool = analysisStatus.progress.find(p => p.status === 'running')?.toolName || null;
          
          setState(prev => ({
            ...prev,
            progress: overallProgress,
            currentTool,
            results: analysisStatus.results.map(r => transformAnalysisResult(r.toolId, r))
          }));
          
          // Si el análisis está completo
          if (analysisStatus.status === 'completed' || analysisStatus.status === 'error') {
            clearInterval(pollInterval);
            
            setState(prev => ({
              ...prev,
              isLoading: false,
              progress: 100,
              currentTool: null,
              error: analysisStatus.status === 'error' ? 'Error en el análisis' : null
            }));
            
            if (analysisStatus.status === 'completed') {
              options.onComplete?.(analysisStatus.results.map(r => transformAnalysisResult(r.toolId, r)));
            } else {
              options.onError?.('Error en el análisis');
            }
          }
        }
      }, 1000); // Verificar cada segundo
      
      // Limpiar el intervalo después de 5 minutos máximo
      setTimeout(() => {
        clearInterval(pollInterval);
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: 'Timeout del análisis'
        }));
      }, 300000);

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
        currentTool: null
      }));
      options.onError?.(errorMessage);
    }
  }, [options, orchestrator]);

  // Función para limpiar resultados
  const clearResults = useCallback(() => {
    setState({
      results: [],
      isLoading: false,
      error: null,
      progress: 0,
      completedTools: [],
      failedTools: [],
      currentTool: null
    });
  }, []);

  // Función para reintentar herramienta fallida
  const retryTool = useCallback(async (
    toolId: string,
    address: string
  ) => {
    setState(prev => ({
      ...prev,
      failedTools: prev.failedTools.filter(id => id !== toolId),
      results: prev.results.map(r => 
        r.toolId === toolId 
          ? { ...r, status: 'pending' as const }
          : r
      )
    }));

    try {
      // Usar startAnalysis con una sola herramienta
      const requestId = await orchestrator.startAnalysis({
        address,
        tools: [toolId],
        isCompleteAudit: false,
        options: {
          timeframe: '30d',
          includeAdvanced: true,
          priority: 'comprehensive'
        }
      });
      
      // Monitorear el progreso de la herramienta específica
      const pollInterval = setInterval(() => {
        const analysisStatus = orchestrator.getAnalysisStatus(requestId);
        
        if (analysisStatus && (analysisStatus.status === 'completed' || analysisStatus.status === 'error')) {
          clearInterval(pollInterval);
          
          if (analysisStatus.status === 'completed' && analysisStatus.results.length > 0) {
            const result = analysisStatus.results[0];
            const transformedResult = transformAnalysisResult(toolId, result);
            
            setState(prev => ({
              ...prev,
              results: prev.results.map(r => 
                r.toolId === toolId ? transformedResult : r
              ),
              completedTools: [...prev.completedTools, toolId]
            }));
          } else {
            throw new Error('Error al reintentar la herramienta');
          }
        }
      }, 1000);
      
      // Timeout después de 2 minutos
      setTimeout(() => {
        clearInterval(pollInterval);
      }, 120000);
    } catch (error) {
      setState(prev => ({
        ...prev,
        failedTools: [...prev.failedTools, toolId],
        results: prev.results.map(r => 
          r.toolId === toolId 
            ? { ...r, status: 'error' as const, data: { error } }
            : r
        )
      }));
    }
  }, [orchestrator]);

  // Función para obtener resultado específico
  const getToolResult = useCallback((toolId: string): ToolResult | null => {
    return state.results.find(r => r.toolId === toolId) || null;
  }, [state.results]);

  // Función para verificar si análisis está completo
  const isAnalysisComplete = useCallback((): boolean => {
    if (state.results.length === 0) return false;
    return state.results.every(r => r.status === 'completed' || r.status === 'error');
  }, [state.results]);

  // Función para obtener estadísticas
  const getStats = useCallback(() => {
    const total = state.results.length;
    const completed = state.completedTools.length;
    const failed = state.failedTools.length;
    const pending = total - completed - failed;
    
    return {
      total,
      completed,
      failed,
      pending,
      successRate: total > 0 ? (completed / total) * 100 : 0
    };
  }, [state]);

  // Auto-refresh si está habilitado
  useEffect(() => {
    if (!options.autoRefresh || !state.isLoading) return;

    const interval = setInterval(() => {
      // Aquí podrías implementar lógica de auto-refresh
      // Por ejemplo, verificar el estado de herramientas en progreso
    }, options.refreshInterval || 5000);

    return () => clearInterval(interval);
  }, [options.autoRefresh, options.refreshInterval, state.isLoading, options]);

  return {
    ...state,
    startAnalysis,
    clearResults,
    retryTool,
    getToolResult,
    isAnalysisComplete: isAnalysisComplete(),
    stats: getStats()
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
    'wallet': 'Wallet Analysis'
  };
  
  return toolNames[toolId] || toolId.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
}

function transformAnalysisResult(toolId: string, analysisResult: any): ToolResult {
  // Transformar resultado del orchestrator al formato ToolResult
  const baseResult: ToolResult = {
    toolId,
    toolName: getToolName(toolId),
    status: 'completed',
    data: analysisResult,
    timestamp: new Date().toISOString()
  };

  // Extraer datos específicos según el tipo de herramienta
  switch (toolId) {
    case 'ai-assistant':
      return {
        ...baseResult,
        insights: analysisResult.insights || [],
        recommendations: analysisResult.recommendations || [],
        score: analysisResult.overallScore || 0,
        metrics: {
          complexity: analysisResult.complexity || 0,
          riskLevel: analysisResult.riskLevel || 'Low',
          confidence: analysisResult.confidence || 0
        }
      };

    case 'blockchain':
      return {
        ...baseResult,
        score: analysisResult.healthScore || 0,
        metrics: {
          transactions: analysisResult.transactionCount || 0,
          balance: analysisResult.balance || 0,
          contracts: analysisResult.contractCount || 0,
          activity: analysisResult.activityScore || 0
        },
        insights: analysisResult.insights || [],
        recommendations: analysisResult.recommendations || []
      };

    case 'nft-tracking':
      return {
        ...baseResult,
        score: analysisResult.portfolioScore || 0,
        metrics: {
          collections: analysisResult.collectionsCount || 0,
          totalValue: analysisResult.totalValue || 0,
          rareItems: analysisResult.rareItemsCount || 0,
          floorPrice: analysisResult.avgFloorPrice || 0
        },
        insights: analysisResult.insights || [],
        recommendations: analysisResult.recommendations || []
      };

    case 'performance':
      return {
        ...baseResult,
        score: analysisResult.performanceScore || 0,
        metrics: {
          loadTime: analysisResult.loadTime || 0,
          gasEfficiency: analysisResult.gasEfficiency || 0,
          optimization: analysisResult.optimizationLevel || 0,
          mobileScore: analysisResult.mobileScore || 0
        },
        insights: analysisResult.insights || [],
        recommendations: analysisResult.recommendations || []
      };

    case 'security':
      return {
        ...baseResult,
        score: analysisResult.securityScore || 0,
        metrics: {
          vulnerabilities: analysisResult.vulnerabilityCount || 0,
          riskLevel: analysisResult.riskLevel || 'Low',
          auditScore: analysisResult.auditScore || 0,
          compliance: analysisResult.complianceScore || 0
        },
        insights: analysisResult.insights || [],
        recommendations: analysisResult.recommendations || []
      };

    case 'content':
      return {
        ...baseResult,
        score: analysisResult.contentScore || 0,
        metrics: {
          quality: analysisResult.qualityScore || 0,
          uniqueness: analysisResult.uniquenessScore || 0,
          readability: analysisResult.readabilityScore || 0,
          engagement: analysisResult.engagementScore || 0
        },
        insights: analysisResult.insights || [],
        recommendations: analysisResult.recommendations || []
      };

    case 'links':
      return {
        ...baseResult,
        score: analysisResult.linkScore || 0,
        metrics: {
          internalLinks: analysisResult.internalLinksCount || 0,
          externalLinks: analysisResult.externalLinksCount || 0,
          brokenLinks: analysisResult.brokenLinksCount || 0,
          linkQuality: analysisResult.linkQualityScore || 0
        },
        insights: analysisResult.insights || [],
        recommendations: analysisResult.recommendations || []
      };

    case 'metadata':
      return {
        ...baseResult,
        score: analysisResult.metadataScore || 0,
        metrics: {
          completeness: analysisResult.completenessScore || 0,
          accuracy: analysisResult.accuracyScore || 0,
          optimization: analysisResult.optimizationScore || 0,
          structure: analysisResult.structureScore || 0
        },
        insights: analysisResult.insights || [],
        recommendations: analysisResult.recommendations || []
      };

    case 'wallet':
      return {
        ...baseResult,
        score: analysisResult.walletScore || 0,
        metrics: {
          balance: analysisResult.balance || 0,
          transactions: analysisResult.transactionCount || 0,
          tokens: analysisResult.tokenCount || 0,
          activity: analysisResult.activityScore || 0
        },
        insights: analysisResult.insights || [],
        recommendations: analysisResult.recommendations || []
      };

    default:
      return {
        ...baseResult,
        score: analysisResult.score || 0,
        metrics: analysisResult.metrics || {},
        insights: analysisResult.insights || [],
        recommendations: analysisResult.recommendations || []
      };
  }
}

