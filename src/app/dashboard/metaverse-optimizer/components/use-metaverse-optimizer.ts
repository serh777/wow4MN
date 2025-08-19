// Hook para análisis real de Metaverse Optimizer
'use client';

import { useState, useEffect } from 'react';
import { MetaverseOptimizerAPIsService } from '@/services/apis/metaverse-optimizer-apis';

interface MetaverseOptimizerState {
  isLoading: boolean;
  data: any | null;
  error: string | null;
}

export function useMetaverseOptimizer(contentId: string, options: {
  contentType?: string;
  targetPlatforms?: string[];
  includeOptimization?: boolean;
  includeUserExperience?: boolean;
  includeMonetization?: boolean;
} = {}) {
  const [state, setState] = useState<MetaverseOptimizerState>({
    isLoading: false,
    data: null,
    error: null
  });

  const analyzeMetaverseContent = async () => {
    if (!contentId) {
      setState(prev => ({ ...prev, error: 'ID de contenido requerido' }));
      return;
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // Validar formato del contentId
      const isValidId = validateContentId(contentId);
      if (!isValidId.isValid) {
        throw new Error(isValidId.error);
      }

      // Realizar análisis completo de metaverso
      const metaverseResult = await MetaverseOptimizerAPIsService.analyzeMetaverseContent(
        contentId,
        options
      );
      
      // Procesar datos adicionales
      const processedData = await processMetaverseData(metaverseResult, options);
      
      setState({
        isLoading: false,
        data: processedData,
        error: null
      });

    } catch (error) {
      console.error('Error en análisis de metaverso:', error);
      setState({
        isLoading: false,
        data: null,
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  };

  // Función para procesar datos de metaverso
  const processMetaverseData = async (rawData: any, options: any) => {
    const {
      includeOptimization = true,
      includeUserExperience = true,
      includeMonetization = true
    } = options;

    // Filtrar datos según las opciones seleccionadas
    let processedData = { ...rawData };

    // Agregar métricas calculadas
    processedData.calculatedMetrics = calculateDerivedMetrics(processedData);
    
    // Agregar insights específicos
    processedData.insights = generateMetaverseInsights(processedData, options);

    // Agregar análisis de competencia si está disponible
    if (processedData.targetPlatforms?.length > 0) {
      processedData.competitorAnalysis = analyzeCompetition(processedData);
    }

    // Agregar recomendaciones de optimización
    processedData.optimizationRecommendations = generateOptimizationRecommendations(processedData);

    // Agregar proyecciones de rendimiento
    processedData.performanceProjections = calculatePerformanceProjections(processedData);

    return processedData;
  };

  // Función para calcular métricas derivadas
  const calculateDerivedMetrics = (data: any) => {
    const metrics = data.metrics || {};
    const assets = data.assets || [];
    const optimizations = data.optimizations || [];

    return {
      // Métricas de eficiencia
      assetEfficiency: calculateAssetEfficiency(assets),
      optimizationGain: calculateOptimizationGain(optimizations),
      
      // Métricas de compatibilidad
      platformCoverage: calculatePlatformCoverage(data.platformAnalysis || []),
      formatCompatibility: calculateFormatCompatibility(assets),
      
      // Métricas de rendimiento
      loadTimeEstimate: calculateLoadTime(assets),
      memoryFootprint: calculateMemoryUsage(assets),
      
      // Métricas de experiencia
      immersionIndex: calculateImmersionIndex(data.userExperience || {}),
      accessibilityScore: data.userExperience?.accessibilityScore || 0,
      
      // Métricas de mercado
      marketPotential: calculateMarketPotential(data.marketOpportunities || []),
      revenueProjection: calculateRevenueProjection(data.marketOpportunities || []),
      
      // Métricas de calidad
      technicalScore: metrics.technicalQuality || 0,
      contentQuality: calculateContentQuality(assets)
    };
  };

  // Función para calcular eficiencia de assets
  const calculateAssetEfficiency = (assets: any[]): number => {
    if (assets.length === 0) return 0;
    
    const totalOptimization = assets.reduce((sum, asset) => sum + asset.optimizationLevel, 0);
    return Math.round(totalOptimization / assets.length);
  };

  // Función para calcular ganancia de optimización
  const calculateOptimizationGain = (optimizations: any[]): number => {
    if (optimizations.length === 0) return 0;
    
    const totalGain = optimizations.reduce((sum, opt) => sum + opt.performanceGain, 0);
    return Math.round(totalGain / optimizations.length);
  };

  // Función para calcular cobertura de plataforma
  const calculatePlatformCoverage = (platforms: any[]): number => {
    const totalPlatforms = 5; // Número total de plataformas principales
    return Math.min(100, Math.round((platforms.length / totalPlatforms) * 100));
  };

  // Función para calcular compatibilidad de formato
  const calculateFormatCompatibility = (assets: any[]): number => {
    if (assets.length === 0) return 0;
    
    const standardFormats = ['GLTF', 'GLB', 'FBX'];
    const compatibleAssets = assets.filter(asset => 
      standardFormats.includes(asset.format)
    );
    
    return Math.round((compatibleAssets.length / assets.length) * 100);
  };

  // Función para calcular tiempo de carga
  const calculateLoadTime = (assets: any[]): number => {
    const totalSize = assets.reduce((sum, asset) => sum + asset.size, 0);
    // Estimar tiempo de carga basado en tamaño (asumiendo 10MB/s)
    return Math.round(totalSize / (10 * 1024 * 1024) * 1000); // en milisegundos
  };

  // Función para calcular uso de memoria
  const calculateMemoryUsage = (assets: any[]): number => {
    return assets.reduce((sum, asset) => sum + asset.performance.memoryUsage, 0);
  };

  // Función para calcular índice de inmersión
  const calculateImmersionIndex = (userExperience: any): number => {
    const immersion = userExperience.immersionScore || 0;
    const interactivity = userExperience.interactivityLevel || 0;
    const performance = userExperience.performanceRating || 0;
    
    return Math.round((immersion * 0.4 + interactivity * 0.3 + performance * 0.3));
  };

  // Función para calcular potencial de mercado
  const calculateMarketPotential = (opportunities: any[]): number => {
    if (opportunities.length === 0) return 0;
    
    const highPotential = opportunities.filter(opp => opp.potential === 'high').length;
    const mediumPotential = opportunities.filter(opp => opp.potential === 'medium').length;
    
    return Math.min(100, (highPotential * 30 + mediumPotential * 15));
  };

  // Función para calcular proyección de ingresos
  const calculateRevenueProjection = (opportunities: any[]): string => {
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
  const calculateContentQuality = (assets: any[]): number => {
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
    const formatCompatibility = this.calculateFormatCompatibility(assets);
    qualityScore += formatCompatibility * 0.3;
    factors += 0.3;
    
    // Factor: Rendimiento promedio
    const avgRenderTime = assets.reduce((sum, asset) => sum + asset.performance.renderTime, 0) / assets.length;
    const performanceScore = Math.max(0, 100 - avgRenderTime); // Menor tiempo = mejor score
    qualityScore += performanceScore * 0.2;
    factors += 0.2;
    
    return Math.round(qualityScore);
  };

  // Función para generar insights específicos
  const generateMetaverseInsights = (data: any, options: any) => {
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

  // Función para analizar competencia
  const analyzeCompetition = (data: any) => {
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
  const calculateCompetitivePosition = (metrics: any): string => {
    const overallScore = metrics.overallScore || 0;
    
    if (overallScore >= 85) return 'leader';
    if (overallScore >= 70) return 'strong';
    if (overallScore >= 55) return 'competitive';
    return 'emerging';
  };

  // Función para generar comparación de benchmark
  const generateBenchmarkComparison = (platforms: any[], userExperience: any) => {
    const avgEngagement = platforms.reduce((sum, p) => sum + p.engagement, 0) / platforms.length;
    const userRetention = userExperience.userRetention || 0;
    
    return {
      engagementVsBenchmark: userRetention > avgEngagement ? 'above' : 'below',
      performanceVsBenchmark: userExperience.performanceRating > 75 ? 'above' : 'below',
      qualityVsBenchmark: 'average' // Simplificado para el ejemplo
    };
  };

  // Función para identificar oportunidades de diferenciación
  const identifyDifferentiationOpportunities = (data: any): string[] => {
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
  const identifyMarketGaps = (platforms: any[]): string[] => {
    const gaps = [];
    
    const hasVR = platforms.some(p => p.type === 'vr');
    const hasAR = platforms.some(p => p.type === 'ar');
    const hasWeb3D = platforms.some(p => p.type === 'web3d');
    
    if (!hasVR) gaps.push('Realidad Virtual');
    if (!hasAR) gaps.push('Realidad Aumentada');
    if (!hasWeb3D) gaps.push('Web 3D');
    
    return gaps.length > 0 ? gaps : ['Cobertura completa de plataformas'];
  };

  // Función para generar recomendaciones de optimización
  const generateOptimizationRecommendations = (data: any) => {
    const recommendations = [];
    const metrics = data.metrics || {};
    const assets = data.assets || [];

    // Recomendaciones basadas en métricas
    if (metrics.contentOptimization < 70) {
      recommendations.push({
        category: 'Content Optimization',
        priority: 'high',
        title: 'Implementar Pipeline de Optimización',
        actions: [
          'Configurar compresión automática de texturas',
          'Implementar LOD (Level of Detail) automático',
          'Establecer estándares de calidad por plataforma'
        ]
      });
    }

    if (metrics.performanceScore < 70) {
      recommendations.push({
        category: 'Performance',
        priority: 'high',
        title: 'Optimizar Rendimiento',
        actions: [
          'Reducir conteo de polígonos en modelos complejos',
          'Implementar occlusion culling',
          'Optimizar shaders y materiales'
        ]
      });
    }

    if (metrics.platformCompatibility < 80) {
      recommendations.push({
        category: 'Compatibility',
        priority: 'medium',
        title: 'Mejorar Compatibilidad',
        actions: [
          'Crear versiones específicas por plataforma',
          'Implementar detección de capacidades',
          'Usar formatos estándar (GLTF/GLB)'
        ]
      });
    }

    return recommendations;
  };

  // Función para calcular proyecciones de rendimiento
  const calculatePerformanceProjections = (data: any) => {
    const currentScore = data.overallScore || 0;
    const optimizations = data.optimizations || [];
    
    const potentialGain = optimizations.reduce((sum, opt) => sum + opt.performanceGain, 0) / optimizations.length || 0;
    
    return {
      currentScore,
      projectedScore: Math.min(100, currentScore + potentialGain),
      improvementPotential: potentialGain,
      timeToOptimize: estimateOptimizationTime(optimizations),
      costEstimate: estimateOptimizationCost(optimizations)
    };
  };

  // Función para estimar tiempo de optimización
  const estimateOptimizationTime = (optimizations: any[]): string => {
    const complexOptimizations = optimizations.filter(opt => opt.performanceGain > 30).length;
    const simpleOptimizations = optimizations.length - complexOptimizations;
    
    const weeks = Math.ceil(complexOptimizations * 2 + simpleOptimizations * 0.5);
    return `${weeks} semana${weeks !== 1 ? 's' : ''}`;
  };

  // Función para estimar costo de optimización
  const estimateOptimizationCost = (optimizations: any[]): string => {
    const totalOptimizations = optimizations.length;
    const baseCost = totalOptimizations * 500; // $500 por optimización
    const maxCost = baseCost * 2;
    
    return `$${baseCost.toLocaleString()} - $${maxCost.toLocaleString()}`;
  };

  // Auto-ejecutar análisis cuando cambie el contentId
  useEffect(() => {
    if (contentId) {
      analyzeMetaverseContent();
    }
  }, [contentId]);

  return {
    ...state,
    analyzeMetaverseContent,
    refetch: analyzeMetaverseContent
  };
}

// Función auxiliar para validar ID de contenido
function validateContentId(contentId: string): { isValid: boolean; error?: string } {
  if (!contentId || contentId.trim().length === 0) {
    return { isValid: false, error: 'ID de contenido requerido' };
  }

  const trimmed = contentId.trim();

  // Validar URL
  try {
    new URL(trimmed);
    return { isValid: true };
  } catch {
    // No es URL válida
  }

  // Validar ID alfanumérico
  if (/^[a-zA-Z0-9\-_]{3,}$/.test(trimmed)) {
    return { isValid: true };
  }

  // Validar hash
  if (/^[a-fA-F0-9]{32,}$/.test(trimmed)) {
    return { isValid: true };
  }

  return { 
    isValid: false, 
    error: 'Formato inválido. Use URL, ID alfanumérico o hash' 
  };
}

