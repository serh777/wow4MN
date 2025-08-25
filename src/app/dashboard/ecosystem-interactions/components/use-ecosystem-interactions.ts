// Hook para análisis real de Ecosystem Interactions
'use client';

import { useState, useEffect, useCallback } from 'react';
import { EcosystemInteractionsAPIsService } from '../../../../services/apis/ecosystem-interactions-apis';
import { calculateDerivedMetrics } from './ecosystem-calculations';
import { 
  generateEcosystemInsights, 
  analyzeTrends, 
  generateOptimizationRecommendations, 
  analyzeOpportunities,
  validateAddress 
} from './ecosystem-insights';

interface EcosystemInteractionsState {
  isLoading: boolean;
  data: any | null;
  error: string | null;
}

export function useEcosystemInteractions(address: string, options: {
  includeNetworks?: string[];
  includeProtocols?: boolean;
  includeCrossChain?: boolean;
  includeRiskAnalysis?: boolean;
  timeframe?: 'week' | 'month' | 'quarter' | 'year';
} = {}) {
  const [state, setState] = useState<EcosystemInteractionsState>({
    isLoading: false,
    data: null,
    error: null
  });

  // Función principal para procesar datos del ecosistema
  const processEcosystemData = useCallback(async (data: any, options: any) => {
    const { crossChainInteractions = [], protocolInteractions = [], networkDistribution = {} } = data;
    
    // Calcular métricas derivadas usando las funciones helper
    const calculatedMetrics = calculateDerivedMetrics({
      crossChainInteractions,
      protocolInteractions,
      networkDistribution,
      ...data
    });
    
    // Generar insights usando las funciones helper
    const insights = generateEcosystemInsights({
      ...data,
      calculatedMetrics
    }, options);
    
    // Analizar tendencias
    const trends = analyzeTrends(crossChainInteractions);
    
    // Generar recomendaciones
    const recommendations = generateOptimizationRecommendations({
      ...data,
      calculatedMetrics
    });
    
    // Analizar oportunidades
    const opportunities = analyzeOpportunities({
      ...data,
      metrics: calculatedMetrics,
      networkDistribution
    });
    
    return {
      ...data,
      calculatedMetrics,
      insights,
      trends,
      recommendations,
      opportunities
    };
  }, []);

  const analyzeEcosystemInteractions = useCallback(async () => {
    if (!address) {
      setState(prev => ({ ...prev, error: 'Dirección requerida' }));
      return;
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // Validar formato de la dirección
      const isValidAddress = validateAddress(address);
      if (!isValidAddress.isValid) {
        throw new Error(isValidAddress.error);
      }

      // Realizar análisis completo de interacciones del ecosistema
      const ecosystemResult = await EcosystemInteractionsAPIsService.analyzeEcosystemInteractions(
        address,
        options
      );
      
      // Procesar datos adicionales
      const processedData = await processEcosystemData(ecosystemResult, options);
      
      setState({
        isLoading: false,
        data: processedData,
        error: null
      });

    } catch (error) {
      console.error('Error en análisis de ecosistema:', error);
      setState({
        isLoading: false,
        data: null,
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }, [address, options, processEcosystemData]);

  // Auto-ejecutar análisis cuando cambie la dirección
  useEffect(() => {
    if (address && address.trim().length > 0) {
      analyzeEcosystemInteractions();
    }
  }, [address, analyzeEcosystemInteractions]);

  return {
    ...state,
    analyzeEcosystemInteractions,
    refetch: analyzeEcosystemInteractions
  };
}

