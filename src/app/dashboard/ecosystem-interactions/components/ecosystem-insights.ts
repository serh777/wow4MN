// Funciones de análisis e insights para Ecosystem Interactions

/**
 * Genera insights del ecosistema basado en métricas calculadas
 */
export function generateEcosystemInsights(data: any, options: any) {
  const insights = [];
  const calculatedMetrics = data.calculatedMetrics || {};
  const crossChainInteractions = data.crossChainInteractions || [];
  const protocolInteractions = data.protocolInteractions || [];
  const networkDistribution = data.networkDistribution || {};

  // Insights de diversificación de redes
  if (calculatedMetrics.networkDiversityIndex > 70) {
    insights.push({
      type: 'positive',
      category: 'diversification',
      title: 'Excelente Diversificación de Redes',
      description: `Índice de diversidad: ${calculatedMetrics.networkDiversityIndex}/100`,
      impact: 'high'
    });
  } else if (calculatedMetrics.networkDiversityIndex < 30) {
    insights.push({
      type: 'warning',
      category: 'diversification',
      title: 'Baja Diversificación de Redes',
      description: `Índice de diversidad: ${calculatedMetrics.networkDiversityIndex}/100`,
      impact: 'medium',
      actionable: true,
      recommendation: 'Considerar expandir a más redes blockchain'
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
}

/**
 * Analiza tendencias temporales de las interacciones cross-chain
 */
export function analyzeTrends(crossChainInteractions: any[]) {
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
}

/**
 * Genera recomendaciones de optimización basadas en el análisis
 */
export function generateOptimizationRecommendations(data: any) {
  const recommendations = [];
  const metrics = data.calculatedMetrics || {};
  const crossChainInteractions = data.crossChainInteractions || [];
  const protocolInteractions = data.protocolInteractions || [];
  const networkDistribution = data.networkDistribution || {};

  // Recomendaciones de diversificación
  if (metrics.networkDiversityIndex < 50) {
    recommendations.push({
      type: 'diversification',
      priority: 'high',
      title: 'Mejorar Diversificación de Redes',
      description: 'Expandir actividad a más redes blockchain para reducir riesgo',
      actions: [
        'Explorar oportunidades en Arbitrum y Optimism',
        'Considerar Polygon para transacciones de menor valor',
        'Evaluar BSC para yield farming'
      ],
      expectedImpact: 'Reducción del riesgo de concentración en 20-30%'
    });
  }

  // Recomendaciones de eficiencia de costos
  if (crossChainInteractions.length > 0) {
    const avgGasCost = crossChainInteractions.reduce((sum: number, int: any) => 
      sum + parseFloat(int.gasCost || '0'), 0
    ) / crossChainInteractions.length;

    if (avgGasCost > 50) {
      recommendations.push({
        type: 'cost_optimization',
        priority: 'medium',
        title: 'Optimizar Costos de Gas',
        description: 'Reducir costos de transacciones cross-chain',
        actions: [
          'Usar bridges más eficientes como Hop Protocol',
          'Agrupar transacciones cuando sea posible',
          'Considerar Layer 2 para operaciones frecuentes'
        ],
        expectedImpact: `Ahorro potencial de $${Math.round(avgGasCost * 0.3)} por transacción`
      });
    }
  }

  // Recomendaciones de yield optimization
  const hasYieldFarming = protocolInteractions.some(
    (int: any) => ['Yearn', 'Curve', 'Convex'].some(protocol => 
      int.protocol?.includes(protocol)
    )
  );

  if (!hasYieldFarming && protocolInteractions.length > 0) {
    recommendations.push({
      type: 'yield_optimization',
      priority: 'medium',
      title: 'Explorar Yield Farming',
      description: 'Maximizar rendimientos a través de protocolos de farming',
      actions: [
        'Evaluar pools de Curve Finance',
        'Considerar estrategias de Yearn Finance',
        'Explorar oportunidades en Convex Finance'
      ],
      expectedImpact: 'Rendimiento adicional del 5-15% APY'
    });
  }

  // Recomendaciones de seguridad
  if (metrics.concentrationRisk > 70) {
    recommendations.push({
      type: 'security',
      priority: 'high',
      title: 'Reducir Riesgo de Concentración',
      description: 'Distribuir posiciones para mejorar seguridad',
      actions: [
        'Diversificar entre al menos 3-5 protocolos diferentes',
        'Limitar exposición máxima por protocolo al 25%',
        'Implementar estrategia de rebalanceo mensual'
      ],
      expectedImpact: 'Reducción significativa del riesgo de pérdida total'
    });
  }

  return recommendations;
}

/**
 * Analiza oportunidades de crecimiento y optimización
 */
export function analyzeOpportunities(data: any) {
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
}

/**
 * Función auxiliar para validar dirección
 */
export function validateAddress(address: string): { isValid: boolean; error?: string } {
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