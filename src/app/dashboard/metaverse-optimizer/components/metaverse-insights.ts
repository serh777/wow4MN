// Funciones de análisis e insights para Metaverse Optimizer

// Función para validar ID de contenido
export const validateContentId = (contentId: string): { isValid: boolean; error?: string } => {
  if (!contentId || contentId.trim() === '') {
    return { isValid: false, error: 'ID de contenido no puede estar vacío' };
  }
  
  if (contentId.length < 3) {
    return { isValid: false, error: 'ID de contenido debe tener al menos 3 caracteres' };
  }
  
  if (!/^[a-zA-Z0-9_-]+$/.test(contentId)) {
    return { isValid: false, error: 'ID de contenido contiene caracteres inválidos' };
  }
  
  return { isValid: true };
};

// Función para generar insights específicos
export const generateMetaverseInsights = (data: any, options: any) => {
  const insights = [];
  const metrics = data.metrics || {};
  const assets = data.assets || [];
  const optimizations = data.optimizations || [];
  const userExperience = data.userExperience || {};

  // Insights de optimización de contenido
  if (metrics.contentOptimization > 80) {
    insights.push({
      type: 'positive',
      category: 'optimization',
      title: 'Excelente Optimización de Contenido',
      description: `${metrics.contentOptimization}% de optimización alcanzada`,
      impact: 'high'
    });
  } else if (metrics.contentOptimization < 50) {
    insights.push({
      type: 'warning',
      category: 'optimization',
      title: 'Optimización Insuficiente',
      description: `Solo ${metrics.contentOptimization}% de optimización`,
      impact: 'high',
      actionable: true,
      recommendation: 'Implementar pipeline de optimización automática'
    });
  }

  // Insights de compatibilidad de plataforma
  if (metrics.platformCompatibility > 85) {
    insights.push({
      type: 'positive',
      category: 'compatibility',
      title: 'Alta Compatibilidad Multi-Plataforma',
      description: `${metrics.platformCompatibility}% de compatibilidad`,
      impact: 'high'
    });
  } else if (metrics.platformCompatibility < 60) {
    insights.push({
      type: 'warning',
      category: 'compatibility',
      title: 'Compatibilidad Limitada',
      description: `Solo ${metrics.platformCompatibility}% de compatibilidad`,
      impact: 'medium',
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
      recommendation: 'Mejorar interactividad y elementos inmersivos'
    });
  }

  // Insights de rendimiento
  if (metrics.performanceScore > 80) {
    insights.push({
      type: 'positive',
      category: 'performance',
      title: 'Rendimiento Óptimo',
      description: `Score de rendimiento: ${metrics.performanceScore}/100`,
      impact: 'high'
    });
  } else if (metrics.performanceScore < 60) {
    insights.push({
      type: 'warning',
      category: 'performance',
      title: 'Rendimiento Subóptimo',
      description: `Score de rendimiento: ${metrics.performanceScore}/100`,
      impact: 'high',
      actionable: true,
      recommendation: 'Optimizar assets y reducir complejidad'
    });
  }

  // Insights de monetización
  if (metrics.monetizationPotential > 75) {
    insights.push({
      type: 'positive',
      category: 'monetization',
      title: 'Alto Potencial de Monetización',
      description: `${metrics.monetizationPotential}% de potencial identificado`,
      impact: 'medium'
    });
  }

  // Insights de assets
  const modelAssets = assets.filter((asset: any) => asset.type === 'model');
  if (modelAssets.length > 0) {
    const avgPolygons = modelAssets.reduce((sum: number, asset: any) => 
      sum + (asset.performance.polygonCount || 0), 0) / modelAssets.length;
    
    if (avgPolygons > 50000) {
      insights.push({
        type: 'warning',
        category: 'technical',
        title: 'Alto Conteo de Polígonos',
        description: `Promedio: ${Math.round(avgPolygons).toLocaleString()} polígonos`,
        impact: 'medium',
        actionable: true,
        recommendation: 'Implementar LOD (Level of Detail) y decimation'
      });
    }
  }

  return insights;
};

// Función para generar recomendaciones de optimización
export const generateOptimizationRecommendations = (data: any) => {
  const recommendations = [];
  const metrics = data.metrics || {};
  const assets = data.assets || [];
  const userExperience = data.userExperience || {};
  const platformAnalysis = data.platformAnalysis || [];

  // Recomendaciones de rendimiento
  if (metrics.performanceScore < 70) {
    recommendations.push({
      category: 'performance',
      priority: 'high',
      title: 'Optimizar Rendimiento General',
      description: 'El score de rendimiento está por debajo del umbral recomendado',
      actions: [
        'Reducir conteo de polígonos en modelos 3D',
        'Implementar técnicas de LOD (Level of Detail)',
        'Optimizar texturas y materiales',
        'Usar compresión de assets'
      ],
      estimatedImpact: 'Mejora del 20-30% en rendimiento',
      timeframe: '2-4 semanas'
    });
  }

  // Recomendaciones de compatibilidad
  if (metrics.platformCompatibility < 75) {
    recommendations.push({
      category: 'compatibility',
      priority: 'medium',
      title: 'Mejorar Compatibilidad Multi-Plataforma',
      description: 'Expandir soporte para más plataformas de metaverso',
      actions: [
        'Adaptar assets para WebXR',
        'Optimizar para dispositivos móviles',
        'Implementar fallbacks para plataformas legacy',
        'Probar en diferentes navegadores'
      ],
      estimatedImpact: 'Aumento del 40-50% en alcance de audiencia',
      timeframe: '3-6 semanas'
    });
  }

  // Recomendaciones de experiencia de usuario
  if (userExperience.immersionScore < 70) {
    recommendations.push({
      category: 'user_experience',
      priority: 'high',
      title: 'Mejorar Experiencia Inmersiva',
      description: 'La experiencia de inmersión necesita mejoras significativas',
      actions: [
        'Agregar más elementos interactivos',
        'Implementar audio espacial',
        'Mejorar la navegación y controles',
        'Añadir feedback háptico donde sea posible'
      ],
      estimatedImpact: 'Incremento del 25-35% en engagement',
      timeframe: '4-8 semanas'
    });
  }

  // Recomendaciones de monetización
  if (metrics.monetizationPotential < 60) {
    recommendations.push({
      category: 'monetization',
      priority: 'medium',
      title: 'Explorar Oportunidades de Monetización',
      description: 'Identificar y desarrollar nuevas fuentes de ingresos',
      actions: [
        'Implementar sistema de NFTs',
        'Crear experiencias premium',
        'Desarrollar marketplace interno',
        'Ofrecer personalización pagada'
      ],
      estimatedImpact: 'Potencial de ingresos adicionales del 15-25%',
      timeframe: '6-12 semanas'
    });
  }

  // Recomendaciones técnicas específicas
  const largeAssets = assets.filter((asset: any) => asset.size > 50 * 1024 * 1024); // 50MB
  if (largeAssets.length > 0) {
    recommendations.push({
      category: 'technical',
      priority: 'high',
      title: 'Optimizar Assets Grandes',
      description: `${largeAssets.length} assets exceden el tamaño recomendado`,
      actions: [
        'Comprimir texturas sin pérdida de calidad',
        'Implementar carga progresiva',
        'Usar formatos más eficientes (WebP, AVIF)',
        'Dividir assets grandes en chunks'
      ],
      estimatedImpact: 'Reducción del 30-50% en tiempo de carga',
      timeframe: '1-3 semanas'
    });
  }

  return recommendations;
};

// Función para analizar competencia
export const analyzeCompetition = (data: any) => {
  const platforms = data.platformAnalysis || [];
  const userExperience = data.userExperience || {};
  
  return {
    competitivePosition: calculateCompetitivePosition(data.metrics),
    benchmarkComparison: generateBenchmarkComparison(platforms, userExperience),
    differentiationOpportunities: identifyDifferentiationOpportunities(data),
    marketGaps: identifyMarketGaps(platforms)
  };
};

// Función para calcular posición competitiva
export const calculateCompetitivePosition = (metrics: any): string => {
  const overallScore = metrics.overallScore || 0;
  
  if (overallScore >= 85) return 'leader';
  if (overallScore >= 70) return 'strong';
  if (overallScore >= 55) return 'competitive';
  return 'emerging';
};

// Función para generar comparación de benchmark
export const generateBenchmarkComparison = (platforms: any[], userExperience: any) => {
  const avgEngagement = platforms.reduce((sum, p) => sum + p.engagement, 0) / platforms.length;
  const userRetention = userExperience.userRetention || 0;
  
  return {
    engagementVsBenchmark: userRetention > avgEngagement ? 'above' : 'below',
    performanceVsBenchmark: userExperience.performanceRating > 75 ? 'above' : 'below',
    qualityVsBenchmark: 'average' // Simplificado para el ejemplo
  };
};

// Función para identificar oportunidades de diferenciación
export const identifyDifferentiationOpportunities = (data: any): string[] => {
  const opportunities = [];
  const metrics = data.metrics || {};
  
  if (metrics.technicalQuality > 80) {
    opportunities.push('Posicionarse como líder en calidad técnica');
  }
  
  if (metrics.userExperience > 80) {
    opportunities.push('Enfocarse en experiencia de usuario superior');
  }
  
  if (metrics.platformCompatibility > 80) {
    opportunities.push('Destacar compatibilidad multi-plataforma');
  }
  
  return opportunities.length > 0 ? opportunities : ['Mejorar métricas generales para diferenciación'];
};

// Función para identificar gaps de mercado
export const identifyMarketGaps = (platforms: any[]): string[] => {
  const gaps = [];
  
  const hasVR = platforms.some(p => p.type === 'vr');
  const hasAR = platforms.some(p => p.type === 'ar');
  const hasWeb = platforms.some(p => p.type === 'web');
  const hasMobile = platforms.some(p => p.type === 'mobile');
  
  if (!hasVR) gaps.push('Realidad Virtual');
  if (!hasAR) gaps.push('Realidad Aumentada');
  if (!hasWeb) gaps.push('Experiencias Web');
  if (!hasMobile) gaps.push('Dispositivos Móviles');
  
  return gaps.length > 0 ? gaps : ['Cobertura completa de plataformas'];
};