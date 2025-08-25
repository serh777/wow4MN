// Funciones de análisis de tendencias para Metaverse Optimizer

// Función para analizar tendencias del metaverso
export const analyzeMetaverseTrends = (data: any) => {
  const metrics = data.metrics || {};
  const assets = data.assets || [];
  const userExperience = data.userExperience || {};
  const platformAnalysis = data.platformAnalysis || [];

  return {
    // Tendencias de adopción
    adoptionTrend: calculateAdoptionTrend(platformAnalysis),
    
    // Tendencias tecnológicas
    technologyTrends: identifyTechnologyTrends(assets),
    
    // Tendencias de usuario
    userBehaviorTrends: analyzeUserBehaviorTrends(userExperience),
    
    // Tendencias de mercado
    marketTrends: identifyMarketTrends(data.marketOpportunities || []),
    
    // Predicciones futuras
    futurePredictions: generateFuturePredictions(data),
    
    // Score de tendencia general
    trendScore: calculateOverallTrendScore(data)
  };
};

// Función para calcular tendencia de adopción
export const calculateAdoptionTrend = (platforms: any[]): string => {
  const totalEngagement = platforms.reduce((sum, p) => sum + (p.engagement || 0), 0);
  const avgEngagement = platforms.length > 0 ? totalEngagement / platforms.length : 0;
  
  if (avgEngagement > 75) return 'rapid-growth';
  if (avgEngagement > 50) return 'steady-growth';
  if (avgEngagement > 25) return 'slow-growth';
  return 'emerging';
};

// Función para identificar tendencias tecnológicas
export const identifyTechnologyTrends = (assets: any[]): string[] => {
  const trends = [];
  
  const hasAI = assets.some(asset => asset.features?.includes('ai'));
  const hasBlockchain = assets.some(asset => asset.features?.includes('blockchain'));
  const hasWebXR = assets.some(asset => asset.platform === 'webxr');
  const hasVR = assets.some(asset => asset.platform === 'vr');
  const hasAR = assets.some(asset => asset.platform === 'ar');
  
  if (hasAI) trends.push('AI Integration');
  if (hasBlockchain) trends.push('Blockchain/NFT');
  if (hasWebXR) trends.push('WebXR Adoption');
  if (hasVR) trends.push('VR Immersion');
  if (hasAR) trends.push('AR Integration');
  
  return trends.length > 0 ? trends : ['Standard 3D Content'];
};

// Función para analizar tendencias de comportamiento de usuario
export const analyzeUserBehaviorTrends = (userExperience: any): any => {
  return {
    engagementPattern: userExperience.engagementTime > 300 ? 'high-engagement' : 'casual-use',
    interactionPreference: userExperience.interactivityLevel > 70 ? 'interactive' : 'passive',
    devicePreference: userExperience.preferredDevice || 'desktop',
    sessionDuration: userExperience.avgSessionDuration || 'medium'
  };
};

// Función para identificar tendencias de mercado
export const identifyMarketTrends = (opportunities: any[]): string[] => {
  const trends = [];
  
  const hasEducation = opportunities.some(opp => opp.sector === 'education');
  const hasGaming = opportunities.some(opp => opp.sector === 'gaming');
  const hasEnterprise = opportunities.some(opp => opp.sector === 'enterprise');
  const hasSocial = opportunities.some(opp => opp.sector === 'social');
  
  if (hasEducation) trends.push('Educational Metaverse');
  if (hasGaming) trends.push('Gaming Worlds');
  if (hasEnterprise) trends.push('Enterprise Solutions');
  if (hasSocial) trends.push('Social Experiences');
  
  return trends.length > 0 ? trends : ['General Purpose'];
};

// Función para generar predicciones futuras
export const generateFuturePredictions = (data: any): any => {
  const metrics = data.metrics || {};
  const currentScore = metrics.overallScore || 0;
  
  return {
    sixMonthProjection: Math.min(100, currentScore + 15),
    yearProjection: Math.min(100, currentScore + 30),
    emergingTechnologies: ['WebGPU', 'AI Avatars', 'Haptic Feedback'],
    marketGrowthPrediction: 'exponential',
    recommendedInvestments: ['Performance Optimization', 'Cross-Platform Support', 'User Experience']
  };
};

// Función para calcular score general de tendencias
export const calculateOverallTrendScore = (data: any): number => {
  const metrics = data.metrics || {};
  const platformCount = (data.platformAnalysis || []).length;
  const optimizationLevel = metrics.contentOptimization || 0;
  const userScore = (data.userExperience?.immersionScore || 0);
  
  // Calcular score basado en múltiples factores
  const platformScore = Math.min(100, platformCount * 20); // Max 5 plataformas
  const trendScore = (platformScore * 0.3 + optimizationLevel * 0.4 + userScore * 0.3);
  
  return Math.round(trendScore);
};

// Función para analizar evolución temporal
export const analyzeTemporalEvolution = (historicalData: any[]): any => {
  if (historicalData.length < 2) {
    return {
      trend: 'insufficient-data',
      growthRate: 0,
      volatility: 0,
      prediction: 'stable'
    };
  }

  const scores = historicalData.map(d => d.overallScore || 0);
  const growthRate = calculateGrowthRate(scores);
  const volatility = calculateVolatility(scores);
  
  return {
    trend: growthRate > 5 ? 'upward' : growthRate < -5 ? 'downward' : 'stable',
    growthRate: Math.round(growthRate * 100) / 100,
    volatility: Math.round(volatility * 100) / 100,
    prediction: predictFutureTrend(growthRate, volatility)
  };
};

// Función para calcular tasa de crecimiento
export const calculateGrowthRate = (values: number[]): number => {
  if (values.length < 2) return 0;
  
  const first = values[0];
  const last = values[values.length - 1];
  const periods = values.length - 1;
  
  if (first === 0) return 0;
  
  return Math.pow(last / first, 1 / periods) - 1;
};

// Función para calcular volatilidad
export const calculateVolatility = (values: number[]): number => {
  if (values.length < 2) return 0;
  
  const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
  const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
  
  return Math.sqrt(variance);
};

// Función para predecir tendencia futura
export const predictFutureTrend = (growthRate: number, volatility: number): string => {
  if (volatility > 20) return 'unpredictable';
  if (growthRate > 10) return 'strong-growth';
  if (growthRate > 5) return 'moderate-growth';
  if (growthRate > -5) return 'stable';
  return 'decline';
};

// Función para identificar patrones estacionales
export const identifySeasonalPatterns = (timeSeriesData: any[]): any => {
  if (timeSeriesData.length < 12) {
    return {
      hasSeasonality: false,
      pattern: 'insufficient-data',
      peakMonths: [],
      lowMonths: []
    };
  }

  const monthlyAverages = calculateMonthlyAverages(timeSeriesData);
  const seasonalityScore = calculateSeasonalityScore(monthlyAverages);
  
  return {
    hasSeasonality: seasonalityScore > 0.3,
    pattern: identifySeasonalPattern(monthlyAverages),
    peakMonths: findPeakMonths(monthlyAverages),
    lowMonths: findLowMonths(monthlyAverages),
    seasonalityScore: Math.round(seasonalityScore * 100) / 100
  };
};

// Función para calcular promedios mensuales
export const calculateMonthlyAverages = (data: any[]): number[] => {
  const monthlyData: number[][] = Array(12).fill(0).map(() => []);
  
  data.forEach(item => {
    const month = new Date(item.date).getMonth();
    monthlyData[month].push(Number(item.value) || 0);
  });
  
  return monthlyData.map(monthData => {
    if (monthData.length === 0) return 0;
    return monthData.reduce((sum: number, val: number) => sum + val, 0) / monthData.length;
  });
};

// Función para calcular score de estacionalidad
export const calculateSeasonalityScore = (monthlyAverages: number[]): number => {
  const mean = monthlyAverages.reduce((sum, val) => sum + val, 0) / monthlyAverages.length;
  const variance = monthlyAverages.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / monthlyAverages.length;
  
  if (mean === 0) return 0;
  
  return Math.sqrt(variance) / mean;
};

// Función para identificar patrón estacional
export const identifySeasonalPattern = (monthlyAverages: number[]): string => {
  const q1 = (monthlyAverages[0] + monthlyAverages[1] + monthlyAverages[2]) / 3;
  const q2 = (monthlyAverages[3] + monthlyAverages[4] + monthlyAverages[5]) / 3;
  const q3 = (monthlyAverages[6] + monthlyAverages[7] + monthlyAverages[8]) / 3;
  const q4 = (monthlyAverages[9] + monthlyAverages[10] + monthlyAverages[11]) / 3;
  
  const quarters = [q1, q2, q3, q4];
  const maxQuarter = Math.max(...quarters);
  const maxIndex = quarters.indexOf(maxQuarter);
  
  const patterns = ['winter-peak', 'spring-peak', 'summer-peak', 'autumn-peak'];
  return patterns[maxIndex];
};

// Función para encontrar meses pico
export const findPeakMonths = (monthlyAverages: number[]): string[] => {
  const mean = monthlyAverages.reduce((sum, val) => sum + val, 0) / monthlyAverages.length;
  const threshold = mean * 1.2; // 20% por encima del promedio
  
  const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  
  return monthlyAverages
    .map((avg, index) => avg > threshold ? months[index] : null)
    .filter(month => month !== null) as string[];
};

// Función para encontrar meses bajos
export const findLowMonths = (monthlyAverages: number[]): string[] => {
  const mean = monthlyAverages.reduce((sum, val) => sum + val, 0) / monthlyAverages.length;
  const threshold = mean * 0.8; // 20% por debajo del promedio
  
  const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  
  return monthlyAverages
    .map((avg, index) => avg < threshold ? months[index] : null)
    .filter(month => month !== null) as string[];
};