// Funciones de cálculo para análisis de Ecosystem Interactions

/**
 * Calcula el índice de diversidad de redes usando entropía de Shannon
 */
export function calculateNetworkDiversityIndex(networkDistribution: any): number {
  const networks = Object.keys(networkDistribution);
  if (networks.length <= 1) return 0;
  
  const total = Object.values(networkDistribution).reduce((sum: number, count: any) => sum + count, 0);
  if (total === 0) return 0;
  
  let diversity = 0;
  networks.forEach(network => {
    const proportion = (networkDistribution[network] as number) / (total as number);
    if (proportion > 0) {
      diversity -= proportion * Math.log2(proportion);
    }
  });
  
  return Math.min(diversity / Math.log2(networks.length), 1) * 100;
}

/**
 * Calcula el índice de diversidad de protocolos
 */
export function calculateProtocolDiversityIndex(protocolInteractions: any[]): number {
  if (protocolInteractions.length === 0) return 0;
  
  const protocolCounts: { [key: string]: number } = {};
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
}

/**
 * Calcula el promedio de transacciones por red
 */
export function calculateAvgTransactionsPerNetwork(networkDistribution: any): number {
  const values = Object.values(networkDistribution) as number[];
  if (values.length === 0) return 0;
  
  const total = values.reduce((sum, val) => sum + val, 0);
  return Math.round(total / values.length);
}

/**
 * Calcula la frecuencia de interacciones cross-chain
 */
export function calculateCrossChainFrequency(crossChainInteractions: any[]): number {
  if (crossChainInteractions.length === 0) return 0;
  
  // Calcular interacciones por día en los últimos 30 días
  const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
  const recentInteractions = crossChainInteractions.filter(
    interaction => interaction.timestamp > thirtyDaysAgo
  );
  
  return Math.round(recentInteractions.length / 30 * 10) / 10; // Promedio por día
}

/**
 * Calcula el valor total del ecosistema
 */
export function calculateTotalEcosystemValue(data: any): string {
  let totalValue = 0;
  
  // Sumar valor de interacciones cross-chain
  if (data.crossChainInteractions) {
    totalValue += data.crossChainInteractions.reduce((sum: number, interaction: any) =>
      sum + parseFloat(interaction.value || '0'), 0
    );
  }
  
  // Sumar valor de interacciones con protocolos
  if (data.protocolInteractions) {
    totalValue += data.protocolInteractions.reduce((sum: number, interaction: any) =>
      sum + parseFloat(interaction.totalValue || '0'), 0
    );
  }
  
  return totalValue.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });
}

/**
 * Calcula el valor promedio de transacción
 */
export function calculateAvgTransactionValue(crossChainInteractions: any[]): string {
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
}

/**
 * Calcula el score de sofisticación DeFi
 */
export function calculateDefiSophistication(protocolInteractions: any[]): number {
  if (protocolInteractions.length === 0) return 0;
  
  const sophisticatedProtocols = [
    'Uniswap', 'Compound', 'Aave', 'MakerDAO', 'Curve',
    'Yearn', 'Convex', 'Balancer', 'Synthetix', 'SushiSwap'
  ];
  
  const sophisticatedCount = protocolInteractions.filter(interaction =>
    sophisticatedProtocols.some(protocol =>
      interaction.protocol?.includes(protocol)
    )
  ).length;
  
  return Math.round((sophisticatedCount / protocolInteractions.length) * 100);
}

/**
 * Calcula el nivel de experiencia cross-chain
 */
export function calculateCrossChainExpertise(crossChainInteractions: any[]): number {
  if (crossChainInteractions.length === 0) return 0;
  
  let expertiseScore = 0;
  
  // Puntos por número de redes diferentes
  const uniqueNetworks = new Set(crossChainInteractions.map(int => int.targetNetwork));
  expertiseScore += uniqueNetworks.size * 15; // 15 puntos por red
  
  // Puntos por tipos de bridge diferentes
  const bridgeTypes = new Set(crossChainInteractions.map(int => int.bridgeType).filter(Boolean));
  expertiseScore += bridgeTypes.size * 10; // 10 puntos por tipo de bridge
  expertiseScore += Math.min(crossChainInteractions.length * 2, 40); // 2 puntos por interacción, máximo 40
  
  return Math.min(100, expertiseScore);
}

/**
 * Calcula la edad del ecosistema
 */
export function calculateEcosystemAge(data: any): string {
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
}

/**
 * Calcula la consistencia de actividad
 */
export function calculateActivityConsistency(protocolInteractions: any[]): number {
  if (protocolInteractions.length === 0) return 0;
  
  const now = Date.now();
  const thirtyDaysAgo = now - (30 * 24 * 60 * 60 * 1000);
  const sixtyDaysAgo = now - (60 * 24 * 60 * 60 * 1000);
  const ninetyDaysAgo = now - (90 * 24 * 60 * 60 * 1000);
  
  const recentActivity = protocolInteractions.filter(int => 
    (int.timestamp || int.lastInteraction) > thirtyDaysAgo
  ).length;
  
  const mediumActivity = protocolInteractions.filter(int => {
    const timestamp = int.timestamp || int.lastInteraction;
    return timestamp > sixtyDaysAgo && timestamp <= thirtyDaysAgo;
  }).length;
  
  const oldActivity = protocolInteractions.filter(int => {
    const timestamp = int.timestamp || int.lastInteraction;
    return timestamp > ninetyDaysAgo && timestamp <= sixtyDaysAgo;
  }).length;
  
  // Calcular consistencia basada en la variación de actividad
  const activities = [recentActivity, mediumActivity, oldActivity];
  const avgActivity = activities.reduce((sum, val) => sum + val, 0) / activities.length;
  
  if (avgActivity === 0) return 0;
  
  const variance = activities.reduce((sum, val) => sum + Math.pow(val - avgActivity, 2), 0) / activities.length;
  const stdDev = Math.sqrt(variance);
  const coefficientOfVariation = stdDev / avgActivity;
  
  // Convertir a score de consistencia (menor variación = mayor consistencia)
  return Math.max(0, Math.round((1 - coefficientOfVariation) * 100));
}

/**
 * Calcula el riesgo de concentración usando índice Herfindahl-Hirschman
 */
export function calculateConcentrationRisk(networkDistribution: any): number {
  const values = Object.values(networkDistribution) as number[];
  if (values.length === 0) return 100;
  
  const total = values.reduce((sum, value) => sum + value, 0);
  if (total === 0) return 100;
  
  // Calcular índice Herfindahl-Hirschman normalizado
  const hhi = values.reduce((sum, value) => {
    const share = value / total;
    return sum + (share * share);
  }, 0);
  
  // Convertir HHI a score de riesgo (0-100)
  return Math.round(hhi * 100);
}

/**
 * Calcula el riesgo de liquidez basado en tipos de protocolos
 */
export function calculateLiquidityRisk(data: any): number {
  // Análisis simplificado basado en tipos de protocolos
  const protocolInteractions = data.protocolInteractions || [];
  
  if (protocolInteractions.length === 0) return 50; // Riesgo medio por defecto
  
  let liquidityScore = 0;
  let totalInteractions = protocolInteractions.length;
  
  protocolInteractions.forEach((interaction: any) => {
    const protocol = interaction.protocol?.toLowerCase() || '';
    
    // Protocolos con alta liquidez
    if (protocol.includes('uniswap') || protocol.includes('curve') || protocol.includes('balancer')) {
      liquidityScore += 20;
    }
    // Protocolos con liquidez media
    else if (protocol.includes('compound') || protocol.includes('aave')) {
      liquidityScore += 15;
    }
    // Protocolos con liquidez baja
    else if (protocol.includes('yearn') || protocol.includes('convex')) {
      liquidityScore += 10;
    }
    // Otros protocolos
    else {
      liquidityScore += 12;
    }
  });
  
  const avgLiquidityScore = liquidityScore / totalInteractions;
  
  // Convertir a riesgo (score alto = riesgo bajo)
  return Math.max(0, Math.min(100, Math.round(100 - avgLiquidityScore * 5)));
}

/**
 * Calcula todas las métricas derivadas
 */
export function calculateDerivedMetrics(data: any) {
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
    concentrationRisk: calculateConcentrationRisk(networkDistribution),
    liquidityRisk: calculateLiquidityRisk(data)
  };
}