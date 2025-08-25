// Funciones de cálculo de métricas para Metaverse Optimizer

// Función para calcular eficiencia de assets
export const calculateAssetEfficiency = (assets: any[]): number => {
  if (assets.length === 0) return 0;
  
  const totalOptimization = assets.reduce((sum, asset) => sum + asset.optimizationLevel, 0);
  return Math.round(totalOptimization / assets.length);
};

// Función para calcular ganancia de optimización
export const calculateOptimizationGain = (optimizations: any[]): number => {
  if (optimizations.length === 0) return 0;
  
  const totalGain = optimizations.reduce((sum, opt) => sum + opt.performanceGain, 0);
  return Math.round(totalGain / optimizations.length);
};

// Función para calcular cobertura de plataforma
export const calculatePlatformCoverage = (platforms: any[]): number => {
  const totalPlatforms = 5; // Número total de plataformas principales
  return Math.min(100, Math.round((platforms.length / totalPlatforms) * 100));
};

// Función para calcular compatibilidad de formato
export const calculateFormatCompatibility = (assets: any[]): number => {
  if (assets.length === 0) return 0;
  
  const standardFormats = ['GLTF', 'GLB', 'FBX'];
  const compatibleAssets = assets.filter(asset => 
    standardFormats.includes(asset.format)
  );
  
  return Math.round((compatibleAssets.length / assets.length) * 100);
};

// Función para calcular tiempo de carga
export const calculateLoadTime = (assets: any[]): number => {
  const totalSize = assets.reduce((sum, asset) => sum + asset.size, 0);
  // Estimar tiempo de carga basado en tamaño (asumiendo 10MB/s)
  return Math.round(totalSize / (10 * 1024 * 1024) * 1000); // en milisegundos
};

// Función para calcular uso de memoria
export const calculateMemoryUsage = (assets: any[]): number => {
  return assets.reduce((sum, asset) => sum + asset.performance.memoryUsage, 0);
};

// Función para calcular índice de inmersión
export const calculateImmersionIndex = (userExperience: any): number => {
  const immersion = userExperience.immersionScore || 0;
  const interactivity = userExperience.interactivityLevel || 0;
  const performance = userExperience.performanceRating || 0;
  
  return Math.round((immersion * 0.4 + interactivity * 0.3 + performance * 0.3));
};

// Función para calcular potencial de mercado
export const calculateMarketPotential = (opportunities: any[]): number => {
  if (opportunities.length === 0) return 0;
  
  const highPotential = opportunities.filter(opp => opp.potential === 'high').length;
  const mediumPotential = opportunities.filter(opp => opp.potential === 'medium').length;
  
  return Math.min(100, (highPotential * 30 + mediumPotential * 15));
};

// Función para calcular proyección de ingresos
export const calculateRevenueProjection = (opportunities: any[]): string => {
  const revenueRanges = opportunities.map(opp => {
    const match = opp.estimatedRevenue?.match(/\$(\d+,?\d*)/g);
    if (match && match.length >= 2) {
      const min = parseInt(match[0].replace(/[$,]/g, ''));
      const max = parseInt(match[1].replace(/[$,]/g, ''));
      return { min, max };
    }
    return { min: 1000, max: 10000 };
  });
  
  const totalMin = revenueRanges.reduce((sum, range) => sum + range.min, 0);
  const totalMax = revenueRanges.reduce((sum, range) => sum + range.max, 0);
  
  return `$${totalMin.toLocaleString()} - $${totalMax.toLocaleString()}`;
};

// Función para calcular calidad de contenido
export const calculateContentQuality = (assets: any[]): number => {
  if (assets.length === 0) return 0;
  
  let qualityScore = 0;
  let factors = 0;
  
  // Factor: Optimización promedio
  const avgOptimization = assets.reduce((sum, asset) => sum + asset.optimizationLevel, 0) / assets.length;
  qualityScore += avgOptimization * 0.3;
  factors += 0.3;
  
  // Factor: Diversidad de assets
  const assetTypes = new Set(assets.map(asset => asset.type));
  const diversityScore = Math.min(100, (assetTypes.size / 6) * 100); // 6 tipos máximos
  qualityScore += diversityScore * 0.2;
  factors += 0.2;
  
  // Factor: Compatibilidad de formatos
  const formatCompatibility = calculateFormatCompatibility(assets);
  qualityScore += formatCompatibility * 0.3;
  factors += 0.3;
  
  // Factor: Rendimiento promedio
  const avgRenderTime = assets.reduce((sum, asset) => sum + asset.performance.renderTime, 0) / assets.length;
  const performanceScore = Math.max(0, 100 - avgRenderTime); // Menor tiempo = mejor score
  qualityScore += performanceScore * 0.2;
  factors += 0.2;
  
  return Math.round(qualityScore);
};

// Función para calcular score de rendimiento
export const calculatePerformanceScore = (metrics: any): number => {
  const loadTime = metrics.loadTime || 0;
  const frameRate = metrics.frameRate || 60;
  const memoryUsage = metrics.memoryUsage || 0;
  
  // Calcular score basado en métricas de rendimiento
  const loadTimeScore = Math.max(0, 100 - (loadTime / 10)); // 10ms = 90 puntos
  const frameRateScore = Math.min(100, (frameRate / 60) * 100);
  const memoryScore = Math.max(0, 100 - (memoryUsage / 1024)); // 1GB = 0 puntos
  
  return Math.round((loadTimeScore * 0.4 + frameRateScore * 0.4 + memoryScore * 0.2));
};

// Función para calcular tiempo promedio de carga
export const calculateAverageLoadingTime = (assets: any[]): number => {
  if (assets.length === 0) return 0;
  
  const totalLoadTime = assets.reduce((sum, asset) => sum + (asset.loadTime || 0), 0);
  return Math.round(totalLoadTime / assets.length);
};

// Función para calcular satisfacción del usuario
export const calculateUserSatisfaction = (feedback: any[]): number => {
  if (feedback.length === 0) return 0;
  
  const totalRating = feedback.reduce((sum, fb) => sum + (fb.rating || 0), 0);
  return Math.round((totalRating / feedback.length) * 20); // Convertir de 5 estrellas a 100
};

// Función para calcular tasa de interacción
export const calculateInteractionRate = (interactions: any[]): number => {
  if (interactions.length === 0) return 0;
  
  const totalInteractions = interactions.reduce((sum, int) => sum + (int.count || 0), 0);
  const totalSessions = interactions.reduce((sum, int) => sum + (int.sessions || 1), 0);
  
  return Math.round((totalInteractions / totalSessions) * 100);
};

// Función para calcular ingresos por usuario
export const calculateRevenuePerUser = (revenue: number, activeUsers: number): number => {
  if (activeUsers === 0) return 0;
  return Math.round(revenue / activeUsers);
};

// Función para calcular tasa de conversión
export const calculateConversionRate = (conversions: number, visitors: number): number => {
  if (visitors === 0) return 0;
  return Math.round((conversions / visitors) * 100);
};

// Función principal para calcular métricas derivadas
export const calculateDerivedMetrics = (data: any) => {
  const metrics = data.metrics || {};
  const assets = data.assets || [];
  const optimizations = data.optimizations || [];

  return {
    // Métricas de eficiencia
    assetEfficiency: calculateAssetEfficiency(assets),
    optimizationGain: calculateOptimizationGain(optimizations),
    platformCoverage: calculatePlatformCoverage(data.platforms || []),
    
    // Métricas de rendimiento
    performanceScore: calculatePerformanceScore(metrics),
    loadingTime: calculateAverageLoadingTime(assets),
    
    // Métricas de experiencia
    userSatisfaction: calculateUserSatisfaction(data.userFeedback || []),
    interactionRate: calculateInteractionRate(data.interactions || []),
    
    // Métricas de monetización
    revenuePerUser: calculateRevenuePerUser(data.revenue || 0, data.activeUsers || 1),
    conversionRate: calculateConversionRate(data.conversions || 0, data.visitors || 1),
    
    // Métricas de mercado
    marketPotential: calculateMarketPotential(data.marketOpportunities || []),
    revenueProjection: calculateRevenueProjection(data.marketOpportunities || []),
    
    // Métricas de calidad
    technicalScore: metrics.technicalQuality || 0,
    contentQuality: calculateContentQuality(assets)
  };
};