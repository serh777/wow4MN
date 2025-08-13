'use client';

import { useState, useCallback, useEffect } from 'react';
import { useIndexerService } from './useIndexerService';
import { useAnalysisNotifications } from '@/components/notifications/use-analysis-notifications';

// Tipos para la orquestación del indexador
export interface IndexerRequirement {
  tool: string;
  network: string;
  dataTypes: string[];
  priority: 'high' | 'medium' | 'low';
  estimatedTime?: number; // en segundos
}

export interface DataAvailability {
  activeIndexers: string[];
  progress: Record<string, number>;
  dataReady: boolean;
  details: ToolDataAvailability[];
  totalDataPoints: number;
  lastUpdate?: Date;
}

export interface ToolDataAvailability {
  tool: string;
  hasData: boolean;
  dataCount: number;
  lastUpdate?: Date;
  needsIndexer?: boolean;
  estimatedIndexingTime?: number;
}

export interface IndexerState {
  required: IndexerRequirement[];
  active: string[];
  progress: Record<string, number>;
  dataReady: boolean;
  isActivating: boolean;
  error: string | null;
}

/**
 * Hook para orquestar la integración del indexador con las herramientas del dashboard
 * Gestiona la activación automática de indexadores y la verificación de disponibilidad de datos
 */
export function useIndexerOrchestrator() {
  const { indexers, createIndexer, queryIndexedData, loading } = useIndexerService();
  const { notifyAnalysisStarted, notifyAnalysisCompleted, notifyAnalysisError } = useAnalysisNotifications();
  
  const [orchestratorState, setOrchestratorState] = useState<{
    activatingIndexers: string[];
    progressTracking: Record<string, number>;
  }>({
    activatingIndexers: [],
    progressTracking: {}
  });

  /**
   * Obtiene los indexadores requeridos para un conjunto de herramientas
   */
  const getRequiredIndexers = useCallback(async (tools: string[]): Promise<IndexerRequirement[]> => {
    const requirements: IndexerRequirement[] = [];
    
    for (const tool of tools) {
      switch (tool) {
        case 'onchain':
        case 'blockchain':
          requirements.push({
            tool,
            network: 'ethereum',
            dataTypes: ['blocks', 'transactions', 'logs'],
            priority: 'high',
            estimatedTime: 120 // 2 minutos
          });
          break;
          
        case 'wallet':
          requirements.push({
            tool,
            network: 'ethereum',
            dataTypes: ['transactions', 'balances'],
            priority: 'high',
            estimatedTime: 90 // 1.5 minutos
          });
          break;
          
        case 'social':
          requirements.push({
            tool,
            network: 'ethereum',
            dataTypes: ['events', 'logs', 'social_activity'],
            priority: 'medium',
            estimatedTime: 180 // 3 minutos
          });
          break;
          
        case 'security':
          requirements.push({
            tool,
            network: 'ethereum',
            dataTypes: ['transactions', 'contracts', 'security_events'],
            priority: 'high',
            estimatedTime: 150 // 2.5 minutos
          });
          break;
          
        case 'performance':
          requirements.push({
            tool,
            network: 'ethereum',
            dataTypes: ['blocks', 'transactions', 'gas_data'],
            priority: 'medium',
            estimatedTime: 100 // 1.7 minutos
          });
          break;
          
        case 'backlinks':
        case 'links':
          requirements.push({
            tool,
            network: 'ethereum',
            dataTypes: ['external_links', 'web_data'],
            priority: 'low',
            estimatedTime: 60 // 1 minuto
          });
          break;
          
        case 'metadata':
        case 'content':
        case 'keywords':
          requirements.push({
            tool,
            network: 'ethereum',
            dataTypes: ['metadata', 'content_analysis'],
            priority: 'low',
            estimatedTime: 45 // 45 segundos
          });
          break;
          
  
          requirements.push({
            tool,
            network: 'ethereum',
            dataTypes: ['ai_analysis', 'ml_data', 'predictions'],
            priority: 'medium',
            estimatedTime: 200 // 3.3 minutos
          });
          break;
          
        default:
          // Herramienta genérica
          requirements.push({
            tool,
            network: 'ethereum',
            dataTypes: ['general'],
            priority: 'low',
            estimatedTime: 60
          });
      }
    }
    
    return requirements;
  }, []);

  /**
   * Verifica la disponibilidad de datos para las herramientas seleccionadas
   */
  const checkDataAvailability = useCallback(async (
    address: string, 
    tools: string[]
  ): Promise<DataAvailability> => {
    if (!address || tools.length === 0) {
      return {
        activeIndexers: [],
        progress: {},
        dataReady: false,
        details: [],
        totalDataPoints: 0
      };
    }
    
    try {
      const required = await getRequiredIndexers(tools);
      
      // Simular datos para demo - verificar disponibilidad de datos para cada herramienta
      const dataAvailability = await Promise.all(
        required.map(async (req): Promise<ToolDataAvailability> => {
          // Simular que siempre hay indexadores activos para demo
          const hasActiveIndexer = true;
          
          if (hasActiveIndexer) {
            try {
              // Simular datos indexados para esta dirección
              const simulatedDataCount = Math.floor(Math.random() * 5000) + 1000;
              
              return {
                tool: req.tool,
                hasData: true,
                dataCount: simulatedDataCount,
                lastUpdate: new Date()
              };
            } catch (error) {
              console.error(`Error consultando datos para ${req.tool}:`, error);
              return {
                tool: req.tool,
                hasData: false,
                dataCount: 0,
                needsIndexer: true,
                estimatedIndexingTime: req.estimatedTime
              };
            }
          }
          
          return {
            tool: req.tool,
            hasData: false,
            dataCount: 0,
            needsIndexer: true,
            estimatedIndexingTime: req.estimatedTime
          };
        })
      );
      
      const totalDataPoints = dataAvailability.reduce((sum, da) => sum + da.dataCount, 0);
      const dataReady = dataAvailability.every(da => da.hasData);
      const lastUpdate = dataAvailability
        .filter(da => da.lastUpdate)
        .sort((a, b) => b.lastUpdate!.getTime() - a.lastUpdate!.getTime())[0]?.lastUpdate;
      
      return {
        activeIndexers: ['demo-indexer-1', 'demo-indexer-2'],
        progress: orchestratorState.progressTracking,
        dataReady,
        details: dataAvailability,
        totalDataPoints,
        lastUpdate
      };
      
    } catch (error) {
      console.error('Error verificando disponibilidad de datos:', error);
      return {
        activeIndexers: [],
        progress: {},
        dataReady: false,
        details: [],
        totalDataPoints: 0
      };
    }
  }, [getRequiredIndexers, orchestratorState.progressTracking]);

  /**
   * Activa los indexadores necesarios para las herramientas seleccionadas
   */
  const activateIndexersForAnalysis = useCallback(async (
    tools: string[], 
    address: string
  ): Promise<void> => {
    if (!address || tools.length === 0) {
      throw new Error('Dirección y herramientas son requeridas');
    }
    
    try {
      notifyAnalysisStarted('Activación de Indexadores');
      
      const required = await getRequiredIndexers(tools);
      const activeIndexers = indexers.filter(i => i.status === 'active');
      
      // Identificar indexadores faltantes
      const missingIndexers = required.filter(req => 
        !activeIndexers.some(indexer => 
          indexer.network === req.network && 
          req.dataTypes.every(dt => indexer.dataType.includes(dt))
        )
      );
      
      if (missingIndexers.length === 0) {
        // Solo notificar si no hay indexadores faltantes
        notifyAnalysisCompleted('Activación de Indexadores', 100);
        return;
      }
      
      // Crear y activar indexadores faltantes
      const creationPromises = missingIndexers.map(async (req, index) => {
        const indexerName = `${req.tool}-indexer-${Date.now()}-${index}`;
        
        setOrchestratorState(prev => ({
          ...prev,
          activatingIndexers: [...prev.activatingIndexers, indexerName]
        }));
        
        try {
          const newIndexer = await createIndexer({
            name: indexerName,
            description: `Indexador automático para ${req.tool} en ${req.network}`,
            network: req.network,
            dataType: req.dataTypes,
            filters: JSON.stringify({ address, tools: [req.tool] })
          });
          
          // Simular progreso de activación
          const progressInterval = setInterval(() => {
            setOrchestratorState(prev => {
              const currentProgress = prev.progressTracking[newIndexer.id] || 0;
              const newProgress = Math.min(currentProgress + 10, 100);
              
              if (newProgress >= 100) {
                clearInterval(progressInterval);
              }
              
              return {
                ...prev,
                progressTracking: {
                  ...prev.progressTracking,
                  [newIndexer.id]: newProgress
                }
              };
            });
          }, req.estimatedTime ? (req.estimatedTime * 1000) / 10 : 1000);
          
          return newIndexer;
        } catch (error) {
          console.error(`Error creando indexador para ${req.tool}:`, error);
          throw error;
        } finally {
          setOrchestratorState(prev => ({
            ...prev,
            activatingIndexers: prev.activatingIndexers.filter(name => name !== indexerName)
          }));
        }
      });
      
      await Promise.all(creationPromises);
      
      // Solo notificar después de crear indexadores si había indexadores faltantes
      notifyAnalysisCompleted('Activación de Indexadores', 100);
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      notifyAnalysisError('Activación de Indexadores', errorMessage);
      throw error;
    }
  }, [indexers, createIndexer, getRequiredIndexers, notifyAnalysisStarted, notifyAnalysisCompleted, notifyAnalysisError]);

  /**
   * Obtiene el progreso de indexación para indexadores específicos
   */
  const getIndexingProgress = useCallback((indexerIds: string[]) => {
    return indexerIds.map(id => ({
      indexerId: id,
      progress: orchestratorState.progressTracking[id] || 0,
      isActive: orchestratorState.activatingIndexers.includes(id)
    }));
  }, [orchestratorState]);

  /**
   * Obtiene tipos de datos requeridos para una herramienta específica
   */
  const getDataTypesForTool = useCallback((tool: string): string[] => {
    switch (tool) {
      case 'onchain':
      case 'blockchain':
        return ['blocks', 'transactions', 'logs'];
      case 'wallet':
        return ['transactions', 'balances'];
      case 'social':
        return ['events', 'logs', 'social_activity'];
      case 'security':
        return ['transactions', 'contracts', 'security_events'];
      case 'performance':
        return ['blocks', 'transactions', 'gas_data'];
      case 'backlinks':
      case 'links':
        return ['external_links', 'web_data'];
      case 'metadata':
      case 'content':
      case 'keywords':
        return ['metadata', 'content_analysis'];

        return ['ai_analysis', 'ml_data', 'predictions'];
      default:
        return ['general'];
    }
  }, []);

  /**
   * Estima el tiempo total de indexación para un conjunto de herramientas
   */
  const estimateIndexingTime = useCallback(async (tools: string[]): Promise<number> => {
    const requirements = await getRequiredIndexers(tools);
    return requirements.reduce((total, req) => total + (req.estimatedTime || 60), 0);
  }, [getRequiredIndexers]);

  return {
    // Funciones principales
    getRequiredIndexers,
    checkDataAvailability,
    activateIndexersForAnalysis,
    getIndexingProgress,
    
    // Funciones auxiliares
    getDataTypesForTool,
    estimateIndexingTime,
    
    // Estado
    isActivating: orchestratorState.activatingIndexers.length > 0,
    activatingIndexers: orchestratorState.activatingIndexers,
    progressTracking: orchestratorState.progressTracking,
    loading
  };
}

/**
 * Hook simplificado para componentes que solo necesitan verificar estado
 */
export function useIndexerStatus(tools: string[], address: string) {
  const { checkDataAvailability } = useIndexerOrchestrator();
  const [availability, setAvailability] = useState<DataAvailability | null>(null);
  const [loading, setLoading] = useState(false);
  
  const checkStatus = useCallback(async () => {
    if (!address || tools.length === 0) {
      setAvailability(null);
      return;
    }
    
    setLoading(true);
    try {
      const result = await checkDataAvailability(address, tools);
      setAvailability(result);
    } catch (error) {
      console.error('Error verificando estado del indexador:', error);
      setAvailability(null);
    } finally {
      setLoading(false);
    }
  }, [address, tools, checkDataAvailability]);
  
  // Verificar estado automáticamente cuando cambien las herramientas o dirección
  useEffect(() => {
    checkStatus();
  }, [checkStatus]);
  
  return {
    availability,
    loading,
    checkStatus,
    isDataReady: availability?.dataReady || false,
    totalDataPoints: availability?.totalDataPoints || 0
  };
}