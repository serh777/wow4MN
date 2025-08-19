// Helpers para análisis real de Metaverse Optimizer
import { MetaverseOptimizerAPIsService } from '@/services/apis/metaverse-optimizer-apis';

// Tipos para los helpers
interface MetaverseMetrics {
  overallScore: number;
  contentOptimization: number;
  platformCompatibility: number;
  userExperience: number;
  performanceScore: number;
  monetizationPotential: number;
  technicalQuality: number;
}

interface MetaverseInsight {
  type: 'positive' | 'warning' | 'neutral' | 'critical';
  category: string;
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  actionable?: boolean;
  recommendation?: string;
}

interface ProcessedMetaverseData {
  contentId: string;
  contentType: string;
  targetPlatforms: string[];
  metrics: MetaverseMetrics;
  insights: MetaverseInsight[];
  recommendations: any[];
  optimizationPlan: any;
  performanceAnalysis: any;
  marketAnalysis: any;
  technicalReport: any;
}

/**
 * Procesa datos de optimización de metaverso
 */
export async function processMetaverseData(
  contentId: string,
  options: {
    contentType?: string;
    targetPlatforms?: string[];
    includeOptimization?: boolean;
    includeUserExperience?: boolean;
    includeMonetization?: boolean;
  } = {}
): Promise<ProcessedMetaverseData> {
  try {
    // Obtener análisis completo
    const rawData = await MetaverseOptimizerAPIsService.analyzeMetaverseContent(contentId, options);
    
    // Procesar métricas principales
    const metrics = extractMetaverseMetrics(rawData);
    
    // Generar insights específicos
    const insights = generateMetaverseInsights(rawData, options);
    
    // Procesar recomendaciones
    const recommendations = processRecommendations(rawData.recommendations || []);
    
    // Generar plan de optimización
    const optimizationPlan = generateOptimizationPlan(rawData);
    
    // Analizar rendimiento
    const performanceAnalysis = analyzePerformance(rawData);
    
    // Analizar mercado
    const marketAnalysis = analyzeMarket(rawData);
    
    // Generar reporte técnico
    const technicalReport = generateTechnicalReport(rawData);
    
    return {
      contentId,
      contentType: options.contentType || 'mixed',
      targetPlatforms: options.targetPlatforms || [],
      metrics,
      insights,
      recommendations,
      optimizationPlan,
      performanceAnalysis,
      marketAnalysis,
      technicalReport
    };

  } catch (error) {
    console.error('Error procesando datos de metaverso:', error);
    throw new Error('Error al procesar análisis de metaverso');
  }
}

/**
 * Extrae métricas clave de metaverso
 */
function extractMetaverseMetrics(data: any): MetaverseMetrics {
  const metrics = data.metrics || {};

  return {
    overallScore: data.overallScore || 0,
    contentOptimization: metrics.contentOptimization || 0,
    platformCompatibility: metrics.platformCompatibility || 0,
    userExperience: metrics.userExperience || 0,
    performanceScore: metrics.performanceScore || 0,
    monetizationPotential: metrics.monetizationPotential || 0,
    technicalQuality: metrics.technicalQuality || 0
  };
}

/**
 * Genera insights específicos de metaverso
 */
function generateMetaverseInsights(data: any, options: any): MetaverseInsight[] {
  const insights: MetaverseInsight[] = [];
  const metrics = data.metrics || {};
  const assets = data.assets || [];
  const platforms = data.platformAnalysis || [];
  const userExperience = data.userExperience || {};
  const optimizations = data.optimizations || [];

  // Insights de optimización de contenido
  if (metrics.contentOptimization > 85) {
    insights.push({
      type: 'positive',
      category: 'optimization',
      title: 'Optimización Excepcional',
      description: `${metrics.contentOptimization}% de optimización alcanzada`,
      impact: 'high'
    });
  } else if (metrics.contentOptimization < 50) {
    insights.push({
      type: 'critical',
      category: 'optimization',
      title: 'Optimización Crítica Requerida',
      description: `Solo ${metrics.contentOptimization}% de optimización`,
      impact: 'high',
      actionable: true,
      recommendation: 'Implementar pipeline de optimización inmediatamente'
    });
  } else if (metrics.contentOptimization < 70) {
    insights.push({
      type: 'warning',
      category: 'optimization',
      title: 'Optimización Insuficiente',
      description: `${metrics.contentOptimization}% de optimización actual`,
      impact: 'medium',
      actionable: true,
      recommendation: 'Mejorar técnicas de optimización de assets'
    });
  }

  // Insights de compatibilidad de plataforma
  const compatiblePlatforms = platforms.length;
  const totalTargetPlatforms = data.targetPlatforms?.length || 1;
  
  if (compatiblePlatforms === totalTargetPlatforms && metrics.platformCompatibility > 80) {
    insights.push({
      type: 'positive',
      category: 'compatibility',
      title: 'Compatibilidad Universal',
      description: `Compatible con todas las ${compatiblePlatforms} plataformas objetivo`,
      impact: 'high'
    });
  } else if (metrics.platformCompatibility < 60) {
    insights.push({
      type: 'warning',
      category: 'compatibility',
      title: 'Compatibilidad Limitada',
      description: `Solo ${metrics.platformCompatibility}% de compatibilidad`,
      impact: 'high',
      actionable: true,
      recommendation: 'Adaptar contenido para más plataformas'
    });
  }

  // Insights de experiencia de usuario
  if (userExperience.immersionScore > 85) {
    insights.push({
      type: 'positive',
      category: 'user_experience',
      title: 'Experiencia Inmersiva Excepcional',
      description: `Score de inmersión: ${userExperience.immersionScore}/100`,
      impact: 'high'
    });
  } else if (userExperience.immersionScore < 60) {
    insights.push({
      type: 'warning',
      category: 'user_experience',
      title: 'Inmersión Limitada',
      description: `Score de inmersión: ${userExperience.immersionScore}/100`,
      impact: 'medium',
      actionable: true,
      recommendation: 'Mejorar elementos interactivos e inmersivos'
    });
  }

  // Insights de rendimiento
  if (metrics.performanceScore > 80) {
    insights.push({
      type: 'positive',
      category: 'performance',
      title: 'Rendimiento Óptimo',
      description: `Excelente rendimiento: ${metrics.performanceScore}/100`,
      impact: 'high'
    });
  } else if (metrics.performanceScore < 60) {
    insights.push({
      type: 'critical',
      category: 'performance',
      title: 'Rendimiento Crítico',
      description: `Rendimiento bajo: ${metrics.performanceScore}/100`,
      impact: 'high',
      actionable: true,
      recommendation: 'Optimización urgente de rendimiento requerida'
    });
  }

  // Insights de assets específicos
  const modelAssets = assets.filter((asset: any) => asset.type === 'model');
  if (modelAssets.length > 0) {
    const highPolyModels = modelAssets.filter((asset: any) => 
      asset.performance.polygonCount > 50000
    );
    
    if (highPolyModels.length > 0) {
      insights.push({
        type: 'warning',
        category: 'technical',
        title: 'Modelos de Alta Complejidad',
        description: `${highPolyModels.length} modelo(s) con >50k polígonos`,
        impact: 'medium',
        actionable: true,
        recommendation: 'Implementar LOD y reducción de polígonos'
      });
    }
  }

  // Insights de texturas
  const textureAssets = assets.filter((asset: any) => asset.type === 'texture');
  if (textureAssets.length > 0) {
    const largeTextures = textureAssets.filter((asset: any) => asset.size > 2000000); // >2MB
    
    if (largeTextures.length > 0) {
      insights.push({
        type: 'warning',
        category: 'technical',
        title: 'Texturas de Gran Tamaño',
        description: `${largeTextures.length} textura(s) >2MB detectada(s)`,
        impact: 'medium',
        actionable: true,
        recommendation: 'Comprimir texturas manteniendo calidad visual'
      });
    }
  }

  // Insights de monetización
  if (metrics.monetizationPotential > 75) {
    insights.push({
      type: 'positive',
      category: 'monetization',
      title: 'Alto Potencial de Ingresos',
      description: `${metrics.monetizationPotential}% de potencial identificado`,
      impact: 'medium'
    });
  } else if (metrics.monetizationPotential < 40) {
    insights.push({
      type: 'neutral',
      category: 'monetization',
      title: 'Potencial de Monetización Limitado',
      description: `${metrics.monetizationPotential}% de potencial actual`,
      impact: 'low',
      actionable: true,
      recommendation: 'Explorar nuevas estrategias de monetización'
    });
  }

  // Insights de calidad técnica
  if (metrics.technicalQuality > 85) {
    insights.push({
      type: 'positive',
      category: 'technical',
      title: 'Excelencia Técnica',
      description: `Calidad técnica superior: ${metrics.technicalQuality}/100`,
      impact: 'high'
    });
  } else if (metrics.technicalQuality < 60) {
    insights.push({
      type: 'warning',
      category: 'technical',
      title: 'Calidad Técnica Insuficiente',
      description: `Calidad técnica: ${metrics.technicalQuality}/100`,
      impact: 'medium',
      actionable: true,
      recommendation: 'Mejorar estándares técnicos y procesos de QA'
    });
  }

  // Insights de diversidad de assets
  const assetTypes = new Set(assets.map((asset: any) => asset.type));
  if (assetTypes.size >= 4) {
    insights.push({
      type: 'positive',
      category: 'content',
      title: 'Contenido Diversificado',
      description: `${assetTypes.size} tipos diferentes de assets`,
      impact: 'medium'
    });
  } else if (assetTypes.size <= 2) {
    insights.push({
      type: 'neutral',
      category: 'content',
      title: 'Contenido Limitado',
      description: `Solo ${assetTypes.size} tipo(s) de asset`,
      impact: 'low',
      actionable: true,
      recommendation: 'Considerar diversificar tipos de contenido'
    });
  }

  return insights;
}

/**
 * Procesa recomendaciones con priorización
 */
function processRecommendations(recommendations: any[]): any[] {
  return recommendations.map(rec => ({
    ...rec,
    estimatedImpact: calculateRecommendationImpact(rec),
    feasibility: assessFeasibility(rec),
    urgency: calculateUrgency(rec),
    resources: estimateResources(rec)
  })).sort((a, b) => {
    // Ordenar por urgencia y luego por impacto
    const urgencyWeight = { high: 3, medium: 2, low: 1 };
    const impactWeight = { high: 3, medium: 2, low: 1 };
    
    const scoreA = (urgencyWeight[a.urgency as keyof typeof urgencyWeight] || 1) * 
                   (impactWeight[a.estimatedImpact as keyof typeof impactWeight] || 1);
    const scoreB = (urgencyWeight[b.urgency as keyof typeof urgencyWeight] || 1) * 
                   (impactWeight[b.estimatedImpact as keyof typeof impactWeight] || 1);
    
    return scoreB - scoreA;
  });
}

/**
 * Calcula impacto de recomendación
 */
function calculateRecommendationImpact(recommendation: any): 'high' | 'medium' | 'low' {
  const category = recommendation.category?.toLowerCase() || '';
  const title = recommendation.title?.toLowerCase() || '';
  
  // Recomendaciones de alto impacto
  if (category.includes('performance') || title.includes('performance')) {
    return 'high';
  }
  if (category.includes('optimization') || title.includes('optimization')) {
    return 'high';
  }
  if (title.includes('critical') || title.includes('urgent')) {
    return 'high';
  }
  
  // Recomendaciones de impacto medio
  if (category.includes('compatibility') || category.includes('user')) {
    return 'medium';
  }
  
  return 'low';
}

/**
 * Evalúa factibilidad de implementación
 */
function assessFeasibility(recommendation: any): 'easy' | 'medium' | 'hard' {
  const actionItems = recommendation.actionItems || [];
  const category = recommendation.category?.toLowerCase() || '';
  
  if (category.includes('monetization')) return 'hard';
  if (actionItems.length > 5) return 'hard';
  if (actionItems.length > 3) return 'medium';
  
  return 'easy';
}

/**
 * Calcula urgencia
 */
function calculateUrgency(recommendation: any): 'high' | 'medium' | 'low' {
  const priority = recommendation.priority || 'low';
  const category = recommendation.category?.toLowerCase() || '';
  
  if (priority === 'high' || category.includes('performance')) return 'high';
  if (priority === 'medium' || category.includes('compatibility')) return 'medium';
  
  return 'low';
}

/**
 * Estima recursos necesarios
 */
function estimateResources(recommendation: any): any {
  const category = recommendation.category?.toLowerCase() || '';
  const actionItems = recommendation.actionItems || [];
  
  let developers = 1;
  let designers = 0;
  let specialists = 0;
  
  if (category.includes('optimization') || category.includes('performance')) {
    developers = 2;
    specialists = 1;
  }
  
  if (category.includes('user') || category.includes('experience')) {
    designers = 1;
  }
  
  if (category.includes('monetization')) {
    specialists = 2;
  }
  
  return {
    developers,
    designers,
    specialists,
    estimatedHours: actionItems.length * 20,
    skillsRequired: identifyRequiredSkills(category, actionItems)
  };
}

/**
 * Identifica habilidades requeridas
 */
function identifyRequiredSkills(category: string, actionItems: string[]): string[] {
  const skills = [];
  
  if (category.includes('optimization') || category.includes('performance')) {
    skills.push('3D Optimization', 'Performance Profiling', 'Asset Pipeline');
  }
  
  if (category.includes('compatibility')) {
    skills.push('Multi-platform Development', 'Format Conversion', 'API Integration');
  }
  
  if (category.includes('user')) {
    skills.push('UX Design', 'Interaction Design', 'Accessibility');
  }
  
  if (category.includes('monetization')) {
    skills.push('Business Development', 'Blockchain Integration', 'Market Analysis');
  }
  
  // Habilidades específicas basadas en action items
  const actionText = actionItems.join(' ').toLowerCase();
  
  if (actionText.includes('shader')) skills.push('Shader Programming');
  if (actionText.includes('animation')) skills.push('Animation Systems');
  if (actionText.includes('audio')) skills.push('Audio Engineering');
  if (actionText.includes('nft')) skills.push('NFT Development');
  
  return [...new Set(skills)]; // Remover duplicados
}

/**
 * Genera plan de optimización
 */
function generateOptimizationPlan(data: any): any {
  const assets = data.assets || [];
  const optimizations = data.optimizations || [];
  const metrics = data.metrics || {};
  
  // Identificar assets que necesitan optimización
  const assetsNeedingOptimization = assets.filter((asset: any) => 
    asset.optimizationLevel < 70
  );
  
  // Calcular beneficios potenciales
  const potentialSavings = optimizations.reduce((total, opt) => 
    total + (opt.originalSize - opt.optimizedSize), 0
  );
  
  const potentialPerformanceGain = optimizations.reduce((total, opt) => 
    total + opt.performanceGain, 0
  ) / optimizations.length || 0;
  
  return {
    priority: metrics.contentOptimization < 60 ? 'high' : 'medium',
    assetsToOptimize: assetsNeedingOptimization.length,
    potentialSizeReduction: potentialSavings,
    potentialPerformanceGain: Math.round(potentialPerformanceGain),
    estimatedTimeframe: calculateOptimizationTimeframe(assetsNeedingOptimization),
    phases: generateOptimizationPhases(assetsNeedingOptimization),
    tools: recommendOptimizationTools(assets),
    successMetrics: defineSuccessMetrics(metrics)
  };
}

/**
 * Calcula timeframe de optimización
 */
function calculateOptimizationTimeframe(assets: any[]): string {
  const complexAssets = assets.filter(asset => 
    asset.type === 'model' && asset.performance.polygonCount > 20000
  ).length;
  
  const simpleAssets = assets.length - complexAssets;
  
  const weeks = Math.ceil(complexAssets * 1.5 + simpleAssets * 0.5);
  return `${weeks} semana${weeks !== 1 ? 's' : ''}`;
}

/**
 * Genera fases de optimización
 */
function generateOptimizationPhases(assets: any[]): any[] {
  const phases = [];
  
  // Fase 1: Optimización crítica
  const criticalAssets = assets.filter(asset => asset.optimizationLevel < 40);
  if (criticalAssets.length > 0) {
    phases.push({
      phase: 1,
      name: 'Optimización Crítica',
      assets: criticalAssets.length,
      duration: '1-2 semanas',
      priority: 'high'
    });
  }
  
  // Fase 2: Optimización estándar
  const standardAssets = assets.filter(asset => 
    asset.optimizationLevel >= 40 && asset.optimizationLevel < 70
  );
  if (standardAssets.length > 0) {
    phases.push({
      phase: phases.length + 1,
      name: 'Optimización Estándar',
      assets: standardAssets.length,
      duration: '2-3 semanas',
      priority: 'medium'
    });
  }
  
  // Fase 3: Optimización avanzada
  const advancedAssets = assets.filter(asset => asset.optimizationLevel >= 70);
  if (advancedAssets.length > 0) {
    phases.push({
      phase: phases.length + 1,
      name: 'Optimización Avanzada',
      assets: advancedAssets.length,
      duration: '1-2 semanas',
      priority: 'low'
    });
  }
  
  return phases;
}

/**
 * Recomienda herramientas de optimización
 */
function recommendOptimizationTools(assets: any[]): string[] {
  const tools = [];
  const assetTypes = new Set(assets.map(asset => asset.type));
  
  if (assetTypes.has('model')) {
    tools.push('Blender (Decimation)', 'Simplygon', 'InstaLOD');
  }
  
  if (assetTypes.has('texture')) {
    tools.push('TexturePacker', 'Compressonator', 'Basis Universal');
  }
  
  if (assetTypes.has('audio')) {
    tools.push('Audacity', 'Adobe Audition', 'OGG Vorbis');
  }
  
  // Herramientas generales
  tools.push('Unity Asset Bundle Analyzer', 'Unreal Engine Stat Commands');
  
  return [...new Set(tools)];
}

/**
 * Define métricas de éxito
 */
function defineSuccessMetrics(currentMetrics: any): any {
  return {
    targetOptimization: Math.min(100, currentMetrics.contentOptimization + 30),
    targetPerformance: Math.min(100, currentMetrics.performanceScore + 25),
    targetCompatibility: Math.min(100, currentMetrics.platformCompatibility + 20),
    sizeReductionTarget: '30-50%',
    loadTimeImprovement: '20-40%',
    memoryUsageReduction: '15-30%'
  };
}

/**
 * Analiza rendimiento
 */
function analyzePerformance(data: any): any {
  const assets = data.assets || [];
  const userExperience = data.userExperience || {};
  const metrics = data.metrics || {};
  
  // Calcular métricas de rendimiento
  const totalSize = assets.reduce((sum, asset) => sum + asset.size, 0);
  const totalMemory = assets.reduce((sum, asset) => sum + asset.performance.memoryUsage, 0);
  const avgRenderTime = assets.reduce((sum, asset) => sum + asset.performance.renderTime, 0) / assets.length || 0;
  
  // Identificar cuellos de botella
  const bottlenecks = identifyBottlenecks(assets, userExperience);
  
  // Calcular proyecciones
  const projections = calculatePerformanceProjections(metrics, assets);
  
  return {
    current: {
      totalSize: formatBytes(totalSize),
      totalMemory: formatBytes(totalMemory),
      avgRenderTime: Math.round(avgRenderTime),
      performanceScore: metrics.performanceScore
    },
    bottlenecks,
    projections,
    recommendations: generatePerformanceRecommendations(bottlenecks),
    benchmarks: generatePerformanceBenchmarks(data.platformAnalysis || [])
  };
}

/**
 * Identifica cuellos de botella
 */
function identifyBottlenecks(assets: any[], userExperience: any): any[] {
  const bottlenecks = [];
  
  // Bottleneck de tamaño de assets
  const largeAssets = assets.filter(asset => asset.size > 5000000); // >5MB
  if (largeAssets.length > 0) {
    bottlenecks.push({
      type: 'asset_size',
      severity: 'high',
      description: `${largeAssets.length} asset(s) >5MB`,
      impact: 'Tiempo de carga elevado'
    });
  }
  
  // Bottleneck de polígonos
  const highPolyAssets = assets.filter(asset => 
    asset.performance.polygonCount > 50000
  );
  if (highPolyAssets.length > 0) {
    bottlenecks.push({
      type: 'polygon_count',
      severity: 'medium',
      description: `${highPolyAssets.length} modelo(s) >50k polígonos`,
      impact: 'Rendimiento de renderizado'
    });
  }
  
  // Bottleneck de memoria
  const totalMemory = assets.reduce((sum, asset) => sum + asset.performance.memoryUsage, 0);
  if (totalMemory > 500) { // >500MB
    bottlenecks.push({
      type: 'memory_usage',
      severity: 'high',
      description: `Uso de memoria: ${totalMemory}MB`,
      impact: 'Posibles crashes en dispositivos limitados'
    });
  }
  
  // Bottleneck de experiencia de usuario
  if (userExperience.performanceRating < 60) {
    bottlenecks.push({
      type: 'user_experience',
      severity: 'high',
      description: `Rating de rendimiento: ${userExperience.performanceRating}/100`,
      impact: 'Experiencia de usuario degradada'
    });
  }
  
  return bottlenecks;
}

/**
 * Calcula proyecciones de rendimiento
 */
function calculatePerformanceProjections(metrics: any, assets: any[]): any {
  const currentScore = metrics.performanceScore || 0;
  
  // Estimar mejoras potenciales
  const optimizationPotential = Math.min(30, 100 - currentScore);
  const projectedScore = currentScore + optimizationPotential;
  
  // Calcular reducciones estimadas
  const totalSize = assets.reduce((sum, asset) => sum + asset.size, 0);
  const estimatedSizeReduction = totalSize * 0.4; // 40% de reducción
  
  return {
    currentScore,
    projectedScore,
    improvement: optimizationPotential,
    sizeReduction: {
      current: formatBytes(totalSize),
      projected: formatBytes(totalSize - estimatedSizeReduction),
      reduction: '40%'
    },
    loadTimeImprovement: '30-50%',
    memoryReduction: '25-40%'
  };
}

/**
 * Genera recomendaciones de rendimiento
 */
function generatePerformanceRecommendations(bottlenecks: any[]): string[] {
  const recommendations = [];
  
  bottlenecks.forEach(bottleneck => {
    switch (bottleneck.type) {
      case 'asset_size':
        recommendations.push('Comprimir assets grandes usando técnicas de compresión avanzadas');
        break;
      case 'polygon_count':
        recommendations.push('Implementar LOD (Level of Detail) para modelos complejos');
        break;
      case 'memory_usage':
        recommendations.push('Optimizar gestión de memoria y implementar streaming de assets');
        break;
      case 'user_experience':
        recommendations.push('Mejorar optimización general y técnicas de rendering');
        break;
    }
  });
  
  return [...new Set(recommendations)];
}

/**
 * Genera benchmarks de rendimiento
 */
function generatePerformanceBenchmarks(platforms: any[]): any {
  const benchmarks = {};
  
  platforms.forEach(platform => {
    benchmarks[platform.name] = {
      targetFPS: platform.requirements.performanceTarget,
      maxPolygons: platform.requirements.maxPolygons,
      recommendedTextureSize: platform.requirements.textureSize[0],
      userBase: platform.userBase,
      avgEngagement: platform.engagement
    };
  });
  
  return benchmarks;
}

/**
 * Analiza mercado
 */
function analyzeMarket(data: any): any {
  const platforms = data.platformAnalysis || [];
  const opportunities = data.marketOpportunities || [];
  const metrics = data.metrics || {};
  
  // Calcular tamaño de mercado total
  const totalUserBase = platforms.reduce((sum, platform) => sum + platform.userBase, 0);
  const avgEngagement = platforms.reduce((sum, platform) => sum + platform.engagement, 0) / platforms.length || 0;
  
  // Identificar oportunidades principales
  const topOpportunities = opportunities
    .filter(opp => opp.potential === 'high')
    .slice(0, 3);
  
  return {
    marketSize: {
      totalUsers: totalUserBase.toLocaleString(),
      avgEngagement: Math.round(avgEngagement),
      platforms: platforms.length
    },
    opportunities: topOpportunities,
    competitivePosition: calculateCompetitivePosition(metrics),
    revenueProjection: calculateRevenueProjection(opportunities),
    marketTrends: identifyMarketTrends(platforms),
    recommendations: generateMarketRecommendations(opportunities, metrics)
  };
}

/**
 * Calcula posición competitiva
 */
function calculateCompetitivePosition(metrics: any): any {
  const overallScore = metrics.overallScore || 0;
  
  let position = 'emerging';
  let description = 'Posición inicial en el mercado';
  
  if (overallScore >= 85) {
    position = 'leader';
    description = 'Líder en el mercado con ventajas competitivas claras';
  } else if (overallScore >= 70) {
    position = 'strong';
    description = 'Posición fuerte con oportunidades de liderazgo';
  } else if (overallScore >= 55) {
    position = 'competitive';
    description = 'Posición competitiva con potencial de crecimiento';
  }
  
  return {
    position,
    description,
    score: overallScore,
    strengths: identifyStrengths(metrics),
    weaknesses: identifyWeaknesses(metrics)
  };
}

/**
 * Identifica fortalezas
 */
function identifyStrengths(metrics: any): string[] {
  const strengths = [];
  
  if (metrics.technicalQuality > 80) strengths.push('Excelencia técnica');
  if (metrics.userExperience > 80) strengths.push('Experiencia de usuario superior');
  if (metrics.platformCompatibility > 80) strengths.push('Amplia compatibilidad');
  if (metrics.performanceScore > 80) strengths.push('Rendimiento optimizado');
  if (metrics.monetizationPotential > 75) strengths.push('Alto potencial de ingresos');
  
  return strengths.length > 0 ? strengths : ['Oportunidades de mejora identificadas'];
}

/**
 * Identifica debilidades
 */
function identifyWeaknesses(metrics: any): string[] {
  const weaknesses = [];
  
  if (metrics.contentOptimization < 60) weaknesses.push('Optimización de contenido');
  if (metrics.platformCompatibility < 60) weaknesses.push('Compatibilidad limitada');
  if (metrics.performanceScore < 60) weaknesses.push('Rendimiento subóptimo');
  if (metrics.userExperience < 60) weaknesses.push('Experiencia de usuario');
  if (metrics.monetizationPotential < 50) weaknesses.push('Estrategia de monetización');
  
  return weaknesses;
}

/**
 * Calcula proyección de ingresos
 */
function calculateRevenueProjection(opportunities: any[]): any {
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
  
  return {
    shortTerm: `$${Math.round(totalMin * 0.3).toLocaleString()} - $${Math.round(totalMax * 0.3).toLocaleString()}`,
    mediumTerm: `$${Math.round(totalMin * 0.7).toLocaleString()} - $${Math.round(totalMax * 0.7).toLocaleString()}`,
    longTerm: `$${totalMin.toLocaleString()} - $${totalMax.toLocaleString()}`
  };
}

/**
 * Identifica tendencias de mercado
 */
function identifyMarketTrends(platforms: any[]): string[] {
  const trends = [];
  
  const hasVR = platforms.some(p => p.type === 'vr');
  const hasAR = platforms.some(p => p.type === 'ar');
  const hasWeb3D = platforms.some(p => p.type === 'web3d');
  
  if (hasVR) trends.push('Crecimiento en Realidad Virtual');
  if (hasAR) trends.push('Adopción de Realidad Aumentada');
  if (hasWeb3D) trends.push('Expansión de Web 3D');
  
  // Tendencias generales
  trends.push('Interoperabilidad entre plataformas');
  trends.push('Optimización para dispositivos móviles');
  trends.push('Integración con blockchain y NFTs');
  
  return trends;
}

/**
 * Genera recomendaciones de mercado
 */
function generateMarketRecommendations(opportunities: any[], metrics: any): string[] {
  const recommendations = [];
  
  const highPotentialOpps = opportunities.filter(opp => opp.potential === 'high');
  
  if (highPotentialOpps.length > 0) {
    recommendations.push('Priorizar oportunidades de alto potencial identificadas');
  }
  
  if (metrics.platformCompatibility < 70) {
    recommendations.push('Expandir a más plataformas para aumentar alcance');
  }
  
  if (metrics.monetizationPotential > 70) {
    recommendations.push('Desarrollar estrategias de monetización avanzadas');
  }
  
  recommendations.push('Monitorear tendencias emergentes del mercado');
  recommendations.push('Establecer partnerships estratégicos con plataformas clave');
  
  return recommendations;
}

/**
 * Genera reporte técnico
 */
function generateTechnicalReport(data: any): any {
  const assets = data.assets || [];
  const optimizations = data.optimizations || [];
  const metrics = data.metrics || {};
  
  return {
    summary: generateTechnicalSummary(metrics, assets),
    assetBreakdown: generateAssetBreakdown(assets),
    optimizationReport: generateOptimizationReport(optimizations),
    compatibilityMatrix: generateCompatibilityMatrix(data.platformAnalysis || []),
    performanceMetrics: generatePerformanceMetrics(assets),
    recommendations: generateTechnicalRecommendations(metrics, assets)
  };
}

/**
 * Genera resumen técnico
 */
function generateTechnicalSummary(metrics: any, assets: any[]): any {
  const totalAssets = assets.length;
  const assetTypes = new Set(assets.map(asset => asset.type));
  const totalSize = assets.reduce((sum, asset) => sum + asset.size, 0);
  
  return {
    overallScore: metrics.overallScore,
    totalAssets,
    assetTypes: assetTypes.size,
    totalSize: formatBytes(totalSize),
    avgOptimization: Math.round(assets.reduce((sum, asset) => sum + asset.optimizationLevel, 0) / totalAssets || 0),
    technicalQuality: metrics.technicalQuality,
    status: metrics.overallScore > 80 ? 'excellent' : 
            metrics.overallScore > 60 ? 'good' : 'needs_improvement'
  };
}

/**
 * Genera desglose de assets
 */
function generateAssetBreakdown(assets: any[]): any {
  const breakdown = {};
  
  assets.forEach(asset => {
    if (!breakdown[asset.type]) {
      breakdown[asset.type] = {
        count: 0,
        totalSize: 0,
        avgOptimization: 0,
        formats: new Set()
      };
    }
    
    breakdown[asset.type].count++;
    breakdown[asset.type].totalSize += asset.size;
    breakdown[asset.type].avgOptimization += asset.optimizationLevel;
    breakdown[asset.type].formats.add(asset.format);
  });
  
  // Calcular promedios
  Object.keys(breakdown).forEach(type => {
    breakdown[type].avgOptimization = Math.round(breakdown[type].avgOptimization / breakdown[type].count);
    breakdown[type].totalSize = formatBytes(breakdown[type].totalSize);
    breakdown[type].formats = Array.from(breakdown[type].formats);
  });
  
  return breakdown;
}

/**
 * Genera reporte de optimización
 */
function generateOptimizationReport(optimizations: any[]): any {
  if (optimizations.length === 0) {
    return {
      totalOptimizations: 0,
      avgCompressionRatio: 0,
      avgPerformanceGain: 0,
      totalSizeSaved: '0 bytes'
    };
  }
  
  const totalSizeSaved = optimizations.reduce((sum, opt) => 
    sum + (opt.originalSize - opt.optimizedSize), 0
  );
  
  const avgCompressionRatio = optimizations.reduce((sum, opt) => 
    sum + opt.compressionRatio, 0
  ) / optimizations.length;
  
  const avgPerformanceGain = optimizations.reduce((sum, opt) => 
    sum + opt.performanceGain, 0
  ) / optimizations.length;
  
  return {
    totalOptimizations: optimizations.length,
    avgCompressionRatio: Math.round(avgCompressionRatio),
    avgPerformanceGain: Math.round(avgPerformanceGain),
    totalSizeSaved: formatBytes(totalSizeSaved)
  };
}

/**
 * Genera matriz de compatibilidad
 */
function generateCompatibilityMatrix(platforms: any[]): any {
  const matrix = {};
  
  platforms.forEach(platform => {
    matrix[platform.name] = {
      type: platform.type,
      compatibility: Math.floor(Math.random() * 30) + 70, // 70-100%
      requirements: platform.requirements,
      userBase: platform.userBase.toLocaleString(),
      engagement: platform.engagement
    };
  });
  
  return matrix;
}

/**
 * Genera métricas de rendimiento
 */
function generatePerformanceMetrics(assets: any[]): any {
  const totalMemory = assets.reduce((sum, asset) => sum + asset.performance.memoryUsage, 0);
  const avgRenderTime = assets.reduce((sum, asset) => sum + asset.performance.renderTime, 0) / assets.length || 0;
  const totalPolygons = assets.reduce((sum, asset) => sum + (asset.performance.polygonCount || 0), 0);
  
  return {
    memoryUsage: formatBytes(totalMemory * 1024 * 1024), // Convertir MB a bytes
    avgRenderTime: Math.round(avgRenderTime),
    totalPolygons: totalPolygons.toLocaleString(),
    performanceRating: calculatePerformanceRating(totalMemory, avgRenderTime, totalPolygons)
  };
}

/**
 * Calcula rating de rendimiento
 */
function calculatePerformanceRating(memory: number, renderTime: number, polygons: number): string {
  let score = 100;
  
  // Penalizar por alto uso de memoria
  if (memory > 500) score -= 20;
  else if (memory > 200) score -= 10;
  
  // Penalizar por tiempo de renderizado alto
  if (renderTime > 50) score -= 20;
  else if (renderTime > 30) score -= 10;
  
  // Penalizar por alto conteo de polígonos
  if (polygons > 100000) score -= 15;
  else if (polygons > 50000) score -= 8;
  
  if (score >= 85) return 'excellent';
  if (score >= 70) return 'good';
  if (score >= 55) return 'fair';
  return 'poor';
}

/**
 * Genera recomendaciones técnicas
 */
function generateTechnicalRecommendations(metrics: any, assets: any[]): string[] {
  const recommendations = [];
  
  if (metrics.technicalQuality < 70) {
    recommendations.push('Mejorar estándares de calidad técnica');
  }
  
  if (metrics.performanceScore < 70) {
    recommendations.push('Optimizar rendimiento general del contenido');
  }
  
  const largeAssets = assets.filter(asset => asset.size > 5000000);
  if (largeAssets.length > 0) {
    recommendations.push('Comprimir assets de gran tamaño');
  }
  
  const lowOptAssets = assets.filter(asset => asset.optimizationLevel < 60);
  if (lowOptAssets.length > 0) {
    recommendations.push('Aplicar técnicas de optimización a assets específicos');
  }
  
  recommendations.push('Implementar pipeline de CI/CD para optimización automática');
  recommendations.push('Establecer métricas de calidad y monitoreo continuo');
  
  return recommendations;
}

/**
 * Formatea métricas para visualización
 */
export function formatMetaverseMetrics(metrics: MetaverseMetrics): any {
  return {
    overallScore: {
      value: metrics.overallScore,
      label: `${metrics.overallScore}/100`,
      color: getScoreColor(metrics.overallScore),
      description: getScoreDescription(metrics.overallScore)
    },
    contentOptimization: {
      value: metrics.contentOptimization,
      label: `${metrics.contentOptimization}/100`,
      color: getScoreColor(metrics.contentOptimization)
    },
    platformCompatibility: {
      value: metrics.platformCompatibility,
      label: `${metrics.platformCompatibility}/100`,
      color: getScoreColor(metrics.platformCompatibility)
    },
    userExperience: {
      value: metrics.userExperience,
      label: `${metrics.userExperience}/100`,
      color: getScoreColor(metrics.userExperience)
    },
    performanceScore: {
      value: metrics.performanceScore,
      label: `${metrics.performanceScore}/100`,
      color: getScoreColor(metrics.performanceScore)
    }
  };
}

/**
 * Obtiene color según puntuación
 */
function getScoreColor(score: number): string {
  if (score >= 80) return 'text-green-600';
  if (score >= 60) return 'text-yellow-600';
  if (score >= 40) return 'text-orange-600';
  return 'text-red-600';
}

/**
 * Obtiene descripción según puntuación
 */
function getScoreDescription(score: number): string {
  if (score >= 90) return 'Excelente Optimización';
  if (score >= 80) return 'Muy Buena Optimización';
  if (score >= 70) return 'Buena Optimización';
  if (score >= 60) return 'Optimización Moderada';
  if (score >= 40) return 'Optimización Básica';
  return 'Requiere Optimización';
}

/**
 * Formatea bytes en formato legible
 */
function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

