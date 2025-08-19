// Hook para análisis real de Ecosystem Interactions
'use client';

import { useState, useEffect } from 'react';
import { EcosystemInteractionsAPIsService } from '@/services/apis/ecosystem-interactions-apis';

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

  const analyzeEcosystemInteractions = async () => {
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
  };

  // Función para procesar datos del ecosistema
  const processEcosystemData = async (rawData: any, options: any) => {
    const {
      includeNetworks = ['ethereum', 'polygon', 'bsc', 'arbitrum', 'optimism'],
      includeProtocols = true,
      includeCrossChain = true,
      includeRiskAnalysis = true,
      timeframe = 'month'
    } = options;

    // Filtrar datos según las opciones seleccionadas
    let processedData = { ...rawData };

    // Agregar métricas calculadas
    processedData.calculatedMetrics = calculateDerivedMetrics(processedData);
    
    // Agregar insights específicos
    processedData.insights = generateEcosystemInsights(processedData, options);

    // Agregar análisis de tendencias si está disponible
    if (processedData.crossChainInteractions?.length > 0) {
      processedData.trendAnalysis = analyzeTrends(processedData.crossChainInteractions);
    }

    // Agregar recomendaciones de optimización
    processedData.optimizationRecommendations = generateOptimizationRecommendations(processedData);

    // Agregar análisis de oportunidades
    processedData.opportunityAnalysis = analyzeOpportunities(processedData);

    return processedData;
  };

  // Función para calcular métricas derivadas
  const calculateDerivedMetrics = (data: any) => {
    const metrics = data.metrics || {};
    const crossChainInteractions = data.crossChainInteractions || [];
    const protocolInteractions = data.protocolInteractions || [];
    const networkDistribution = data.networkDistribution || {};

    return {
      // Métricas de diversificación
      networkDiversityIndex: calculateNetworkDiversityIndex(networkDistribution),
      protocolDiversityIndex: calculateProtocolDiversityIndex(protocolInteractions),
      
      // Métricas de actividad
      avgTransactionsPerNetwork: calculateAvgTransactionsPerNetwork(networkDistribution),
      crossChainFrequency: calculateCrossChainFrequency(crossChainInteractions),
      
      // Métricas de valor
      totalEcosystemValue: calculateTotalEcosystemValue(data),
      avgTransactionValue: calculateAvgTransactionValue(crossChainInteractions),
      
      // Métricas de sofisticación
      defiSophisticationScore: calculateDefiSophistication(protocolInteractions),
      crossChainExpertiseLevel: calculateCrossChainExpertise(crossChainInteractions),
      
      // Métricas de tiempo
      ecosystemAge: calculateEcosystemAge(data),
      activityConsistency: calculateActivityConsistency(protocolInteractions),
      
      // Métricas de riesgo
      concentrationRisk: calculateConcentrationRisk(networkDistribution, data.protocolDistribution),
      liquidityRisk: calculateLiquidityRisk(protocolInteractions)
    };
  };

  // Función para calcular índice de diversidad de redes
  const calculateNetworkDiversityIndex = (networkDistribution: any): number => {
    const values = Object.values(networkDistribution) as number[];
    if (values.length === 0) return 0;
    
    const total = values.reduce((sum, val) => sum + val, 0);
    if (total === 0) return 0;
    
    // Calcular índice de Shannon
    const shannon = values.reduce((sum, val) => {
      if (val === 0) return sum;
      const p = val / total;
      return sum - (p * Math.log2(p));
    }, 0);
    
    // Normalizar a 0-100
    const maxShannon = Math.log2(values.length);
    return maxShannon > 0 ? Math.round((shannon / maxShannon) * 100) : 0;
  };

  // Función para calcular índice de diversidad de protocolos
  const calculateProtocolDiversityIndex = (protocolInteractions: any[]): number => {
    if (protocolInteractions.length === 0) return 0;
    
    const protocolCounts = {};
    protocolInteractions.forEach(interaction => {
      protocolCounts[interaction.protocol] = (protocolCounts[interaction.protocol] || 0) + 1;
    });
    
    const values = Object.values(protocolCounts) as number[];
    const total = values.reduce((sum, val) => sum + val, 0);
    
    const shannon = values.reduce((sum, val) => {
      const p = val / total;
      return sum - (p * Math.log2(p));
    }, 0);
    
    const maxShannon = Math.log2(values.length);
    return maxShannon > 0 ? Math.round((shannon / maxShannon) * 100) : 0;
  };

  // Función para calcular promedio de transacciones por red
  const calculateAvgTransactionsPerNetwork = (networkDistribution: any): number => {
    const values = Object.values(networkDistribution) as number[];
    if (values.length === 0) return 0;
    
    const total = values.reduce((sum, val) => sum + val, 0);
    return Math.round(total / values.length);
  };

  // Función para calcular frecuencia cross-chain
  const calculateCrossChainFrequency = (crossChainInteractions: any[]): number => {
    if (crossChainInteractions.length === 0) return 0;
    
    // Calcular interacciones por día en los últimos 30 días
    const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
    const recentInteractions = crossChainInteractions.filter(
      interaction => interaction.timestamp > thirtyDaysAgo
    );
    
    return Math.round(recentInteractions.length / 30 * 10) / 10; // Promedio por día
  };

  // Función para calcular valor total del ecosistema
  const calculateTotalEcosystemValue = (data: any): string => {
    let totalValue = 0;
    
    // Sumar valor de interacciones cross-chain
    if (data.crossChainInteractions) {
      totalValue += data.crossChainInteractions.reduce((sum, interaction) => 
        sum + parseFloat(interaction.value || '0'), 0
      );
    }
    
    // Sumar valor de interacciones con protocolos
    if (data.protocolInteractions) {
      totalValue += data.protocolInteractions.reduce((sum, interaction) => 
        sum + parseFloat(interaction.totalValue || '0'), 0
      );
    }
    
    return totalValue.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
  };

  // Función para calcular valor promedio de transacción
  const calculateAvgTransactionValue = (crossChainInteractions: any[]): string => {
    if (crossChainInteractions.length === 0) return '$0';
    
    const totalValue = crossChainInteractions.reduce((sum, interaction) => 
      sum + parseFloat(interaction.value || '0'), 0
    );
    
    const avgValue = totalValue / crossChainInteractions.length;
    
    return avgValue.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
  };

  // Función para calcular score de sofisticación DeFi
  const calculateDefiSophistication = (protocolInteractions: any[]): number => {
    if (protocolInteractions.length === 0) return 0;
    
    let sophisticationScore = 0;
    const protocolWeights = {
      'Uniswap': 10, 'SushiSwap': 10, 'Balancer': 15,
      'Aave': 20, 'Compound': 20, 'MakerDAO': 25,
      'Curve': 15, 'Yearn': 25, 'Synthetix': 30,
      'Chainlink': 10
    };
    
    const uniqueProtocols = new Set();
    protocolInteractions.forEach(interaction => {
      uniqueProtocols.add(interaction.protocol);
      sophisticationScore += protocolWeights[interaction.protocol] || 5;
    });
    
    // Bonus por diversidad
    sophisticationScore += uniqueProtocols.size * 5;
    
    return Math.min(100, sophisticationScore);
  };

  // Función para calcular nivel de expertise cross-chain
  const calculateCrossChainExpertise = (crossChainInteractions: any[]): number => {
    if (crossChainInteractions.length === 0) return 0;
    
    const uniqueNetworks = new Set();
    const bridgeTypes = new Set();
    
    crossChainInteractions.forEach(interaction => {
      uniqueNetworks.add(interaction.fromNetwork);
      uniqueNetworks.add(interaction.toNetwork);
      bridgeTypes.add(interaction.type);
    });
    
    let expertiseScore = 0;
    expertiseScore += uniqueNetworks.size * 15; // 15 puntos por red
    expertiseScore += bridgeTypes.size * 10; // 10 puntos por tipo de bridge
    expertiseScore += Math.min(crossChainInteractions.length * 2, 40); // 2 puntos por interacción, máximo 40
    
    return Math.min(100, expertiseScore);
  };

  // Función para calcular edad del ecosistema
  const calculateEcosystemAge = (data: any): string => {
    const interactions = [
      ...(data.crossChainInteractions || []),
      ...(data.protocolInteractions || [])
    ];
    
    if (interactions.length === 0) return 'N/A';
    
    const timestamps = interactions.map(interaction => 
      interaction.timestamp || interaction.lastInteraction
    ).filter(Boolean);
    
    if (timestamps.length === 0) return 'N/A';
    
    const oldestTimestamp = Math.min(...timestamps);
    const ageInDays = Math.floor((Date.now() - oldestTimestamp) / (24 * 60 * 60 * 1000));
    
    if (ageInDays < 30) return `${ageInDays} días`;
    if (ageInDays < 365) return `${Math.floor(ageInDays / 30)} meses`;
    return `${Math.floor(ageInDays / 365)} años`;
  };

  // Función para calcular consistencia de actividad
  const calculateActivityConsistency = (protocolInteractions: any[]): number => {
    if (protocolInteractions.length === 0) return 0;
    
    const now = Date.now();
    const thirtyDaysAgo = now - (30 * 24 * 60 * 60 * 1000);
    const sixtyDaysAgo = now - (60 * 24 * 60 * 60 * 1000);
    const ninetyDaysAgo = now - (90 * 24 * 60 * 60 * 1000);
    
    const recent = protocolInteractions.filter(int => int.lastInteraction > thirtyDaysAgo).length;
    const medium = protocolInteractions.filter(int => 
      int.lastInteraction > sixtyDaysAgo && int.lastInteraction <= thirtyDaysAgo
    ).length;
    const older = protocolInteractions.filter(int => 
      int.lastInteraction > ninetyDaysAgo && int.lastInteraction <= sixtyDaysAgo
    ).length;
    
    // Calcular consistencia basada en distribución temporal
    const total = recent + medium + older;
    if (total === 0) return 0;
    
    const variance = Math.pow(recent - total/3, 2) + Math.pow(medium - total/3, 2) + Math.pow(older - total/3, 2);
    const consistency = Math.max(0, 100 - (variance / total * 10));
    
    return Math.round(consistency);
  };

  // Función para calcular riesgo de concentración
  const calculateConcentrationRisk = (networkDistribution: any, protocolDistribution: any): number => {
    let riskScore = 0;
    
    // Riesgo por concentración de redes
    const networkValues = Object.values(networkDistribution) as number[];
    const maxNetworkShare = Math.max(...networkValues, 0);
    if (maxNetworkShare > 70) riskScore += 30;
    else if (maxNetworkShare > 50) riskScore += 15;
    
    // Riesgo por concentración de protocolos
    const protocolValues = Object.values(protocolDistribution || {}) as number[];
    const maxProtocolShare = Math.max(...protocolValues, 0);
    if (maxProtocolShare > 60) riskScore += 25;
    else if (maxProtocolShare > 40) riskScore += 10;
    
    // Riesgo por falta de diversificación
    if (networkValues.length < 3) riskScore += 20;
    if (protocolValues.length < 5) riskScore += 15;
    
    return Math.min(100, riskScore);
  };

  // Función para calcular riesgo de liquidez
  const calculateLiquidityRisk = (protocolInteractions: any[]): number => {
    if (protocolInteractions.length === 0) return 100;
    
    let riskScore = 0;
    
    // Analizar tipos de protocolos
    const protocolTypes = {
      highLiquidity: ['Uniswap', 'SushiSwap', 'Curve', 'Balancer'],
      mediumLiquidity: ['Aave', 'Compound', 'MakerDAO'],
      lowLiquidity: ['Yearn', 'Synthetix']
    };
    
    let highLiquidityCount = 0;
    let totalInteractions = protocolInteractions.length;
    
    protocolInteractions.forEach(interaction => {
      if (protocolTypes.highLiquidity.includes(interaction.protocol)) {
        highLiquidityCount++;
      }
    });
    
    const highLiquidityRatio = highLiquidityCount / totalInteractions;
    
    if (highLiquidityRatio < 0.3) riskScore += 40;
    else if (highLiquidityRatio < 0.5) riskScore += 20;
    
    // Riesgo por concentración en un solo protocolo
    const protocolCounts = {};
    protocolInteractions.forEach(interaction => {
      protocolCounts[interaction.protocol] = (protocolCounts[interaction.protocol] || 0) + 1;
    });
    
    const maxProtocolCount = Math.max(...Object.values(protocolCounts) as number[]);
    const concentrationRatio = maxProtocolCount / totalInteractions;
    
    if (concentrationRatio > 0.7) riskScore += 30;
    else if (concentrationRatio > 0.5) riskScore += 15;
    
    return Math.min(100, riskScore);
  };

  // Función para generar insights específicos del ecosistema
  const generateEcosystemInsights = (data: any, options: any) => {
    const insights = [];
    const metrics = data.metrics || {};
    const calculatedMetrics = data.calculatedMetrics || {};
    const crossChainInteractions = data.crossChainInteractions || [];
    const protocolInteractions = data.protocolInteractions || [];

    // Insights de diversificación
    if (calculatedMetrics.networkDiversityIndex > 80) {
      insights.push({
        type: 'positive',
        category: 'diversification',
        title: 'Excelente Diversificación de Redes',
        description: `Índice de diversidad: ${calculatedMetrics.networkDiversityIndex}/100`,
        impact: 'high'
      });
    } else if (calculatedMetrics.networkDiversityIndex < 40) {
      insights.push({
        type: 'warning',
        category: 'diversification',
        title: 'Diversificación Limitada',
        description: `Índice de diversidad: ${calculatedMetrics.networkDiversityIndex}/100`,
        impact: 'high',
        actionable: true,
        recommendation: 'Expandir actividad a más redes blockchain'
      });
    }

    // Insights de sofisticación DeFi
    if (calculatedMetrics.defiSophisticationScore > 75) {
      insights.push({
        type: 'positive',
        category: 'sophistication',
        title: 'Usuario DeFi Avanzado',
        description: `Score de sofisticación: ${calculatedMetrics.defiSophisticationScore}/100`,
        impact: 'medium'
      });
    } else if (calculatedMetrics.defiSophisticationScore < 30) {
      insights.push({
        type: 'neutral',
        category: 'sophistication',
        title: 'Oportunidad de Crecimiento DeFi',
        description: `Score de sofisticación: ${calculatedMetrics.defiSophisticationScore}/100`,
        impact: 'low',
        actionable: true,
        recommendation: 'Explorar protocolos DeFi más avanzados'
      });
    }

    // Insights de actividad cross-chain
    if (calculatedMetrics.crossChainExpertiseLevel > 70) {
      insights.push({
        type: 'positive',
        category: 'cross_chain',
        title: 'Experto en Cross-Chain',
        description: `Nivel de expertise: ${calculatedMetrics.crossChainExpertiseLevel}/100`,
        impact: 'high'
      });
    } else if (crossChainInteractions.length === 0) {
      insights.push({
        type: 'neutral',
        category: 'cross_chain',
        title: 'Sin Actividad Cross-Chain',
        description: 'No se detectaron interacciones entre redes',
        impact: 'medium',
        actionable: true,
        recommendation: 'Considerar bridges para optimizar costos'
      });
    }

    // Insights de riesgo
    if (calculatedMetrics.concentrationRisk > 60) {
      insights.push({
        type: 'warning',
        category: 'risk',
        title: 'Alto Riesgo de Concentración',
        description: `Riesgo de concentración: ${calculatedMetrics.concentrationRisk}/100`,
        impact: 'high',
        actionable: true,
        recommendation: 'Diversificar posiciones entre más protocolos y redes'
      });
    } else if (calculatedMetrics.concentrationRisk < 30) {
      insights.push({
        type: 'positive',
        category: 'risk',
        title: 'Riesgo de Concentración Bajo',
        description: `Riesgo bien distribuido: ${calculatedMetrics.concentrationRisk}/100`,
        impact: 'medium'
      });
    }

    // Insights de valor
    const totalValue = parseFloat(calculatedMetrics.totalEcosystemValue?.replace(/[$,]/g, '') || '0');
    if (totalValue > 100000) {
      insights.push({
        type: 'positive',
        category: 'value',
        title: 'Alto Volumen de Transacciones',
        description: `Valor total del ecosistema: ${calculatedMetrics.totalEcosystemValue}`,
        impact: 'high'
      });
    } else if (totalValue < 1000) {
      insights.push({
        type: 'neutral',
        category: 'value',
        title: 'Volumen de Transacciones Bajo',
        description: `Valor total del ecosistema: ${calculatedMetrics.totalEcosystemValue}`,
        impact: 'low',
        actionable: true,
        recommendation: 'Considerar aumentar actividad DeFi'
      });
    }

    return insights;
  };

  // Función para analizar tendencias
  const analyzeTrends = (crossChainInteractions: any[]) => {
    if (crossChainInteractions.length === 0) return null;

    // Analizar tendencias temporales
    const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
    const sixtyDaysAgo = Date.now() - (60 * 24 * 60 * 60 * 1000);

    const recentInteractions = crossChainInteractions.filter(int => int.timestamp > thirtyDaysAgo);
    const previousInteractions = crossChainInteractions.filter(int => 
      int.timestamp > sixtyDaysAgo && int.timestamp <= thirtyDaysAgo
    );

    const recentVolume = recentInteractions.reduce((sum, int) => sum + parseFloat(int.value), 0);
    const previousVolume = previousInteractions.reduce((sum, int) => sum + parseFloat(int.value), 0);

    const volumeChange = previousVolume > 0 
      ? ((recentVolume - previousVolume) / previousVolume) * 100
      : 0;

    const frequencyChange = previousInteractions.length > 0
      ? ((recentInteractions.length - previousInteractions.length) / previousInteractions.length) * 100
      : 0;

    return {
      volumeChange: Math.round(volumeChange),
      frequencyChange: Math.round(frequencyChange),
      trend: volumeChange > 10 ? 'increasing' : volumeChange < -10 ? 'decreasing' : 'stable',
      recentActivity: recentInteractions.length,
      previousActivity: previousInteractions.length
    };
  };

  // Función para generar recomendaciones de optimización
  const generateOptimizationRecommendations = (data: any) => {
    const recommendations = [];
    const metrics = data.metrics || {};
    const calculatedMetrics = data.calculatedMetrics || {};

    if (metrics.totalNetworks < 3) {
      recommendations.push({
        category: 'Network Expansion',
        priority: 'high',
        title: 'Expandir a Más Redes',
        description: 'Diversificar en Layer 2 y sidechains para reducir costos',
        estimatedImpact: 'high',
        timeframe: '1-2 semanas'
      });
    }

    if (calculatedMetrics.defiSophisticationScore < 50) {
      recommendations.push({
        category: 'DeFi Growth',
        priority: 'medium',
        title: 'Explorar Protocolos DeFi Avanzados',
        description: 'Considerar yield farming y estrategias de lending',
        estimatedImpact: 'medium',
        timeframe: '2-4 semanas'
      });
    }

    if (data.crossChainInteractions?.length === 0) {
      recommendations.push({
        category: 'Cross-Chain',
        priority: 'medium',
        title: 'Implementar Estrategias Cross-Chain',
        description: 'Usar bridges para arbitraje y optimización de costos',
        estimatedImpact: 'medium',
        timeframe: '1-3 semanas'
      });
    }

    return recommendations;
  };

  // Función para analizar oportunidades
  const analyzeOpportunities = (data: any) => {
    const opportunities = [];
    const metrics = data.metrics || {};
    const networkDistribution = data.networkDistribution || {};

    // Oportunidades basadas en redes no utilizadas
    const allNetworks = ['ethereum', 'polygon', 'bsc', 'arbitrum', 'optimism'];
    const unusedNetworks = allNetworks.filter(network => 
      !networkDistribution[network] || networkDistribution[network] === 0
    );

    if (unusedNetworks.length > 0) {
      opportunities.push({
        type: 'network_expansion',
        title: 'Expansión a Nuevas Redes',
        description: `Oportunidades en: ${unusedNetworks.join(', ')}`,
        potential: 'high',
        effort: 'medium'
      });
    }

    // Oportunidades de arbitraje
    if (data.crossChainInteractions?.length > 5) {
      opportunities.push({
        type: 'arbitrage',
        title: 'Oportunidades de Arbitraje',
        description: 'Aprovechar diferencias de precio entre redes',
        potential: 'medium',
        effort: 'high'
      });
    }

    // Oportunidades de yield farming
    const hasYieldFarming = data.protocolInteractions?.some(
      (int: any) => ['Yearn', 'Curve', 'Convex'].includes(int.protocol)
    );

    if (!hasYieldFarming) {
      opportunities.push({
        type: 'yield_farming',
        title: 'Yield Farming',
        description: 'Explorar oportunidades de farming en protocolos establecidos',
        potential: 'medium',
        effort: 'medium'
      });
    }

    return opportunities;
  };

  // Auto-ejecutar análisis cuando cambie la dirección
  useEffect(() => {
    if (address) {
      analyzeEcosystemInteractions();
    }
  }, [address]);

  return {
    ...state,
    analyzeEcosystemInteractions,
    refetch: analyzeEcosystemInteractions
  };
}

// Función auxiliar para validar dirección
function validateAddress(address: string): { isValid: boolean; error?: string } {
  if (!address || address.trim().length === 0) {
    return { isValid: false, error: 'Dirección requerida' };
  }

  const trimmed = address.trim();

  // Validar dirección Ethereum (0x + 40 caracteres hex)
  if (/^0x[a-fA-F0-9]{40}$/.test(trimmed)) {
    return { isValid: true };
  }

  // Validar ENS domain
  if (/^[a-zA-Z0-9\-]+\.eth$/.test(trimmed)) {
    return { isValid: true };
  }

  return { 
    isValid: false, 
    error: 'Formato inválido. Use dirección Ethereum (0x...) o dominio ENS (.eth)' 
  };
}

