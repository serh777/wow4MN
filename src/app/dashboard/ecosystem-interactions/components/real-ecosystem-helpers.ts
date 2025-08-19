// Helpers para análisis real de Ecosystem Interactions
import { EcosystemInteractionsAPIsService } from '@/services/apis/ecosystem-interactions-apis';

// Tipos para los helpers
interface EcosystemMetrics {
  totalNetworks: number;
  totalProtocols: number;
  crossChainVolume: string;
  interactionFrequency: number;
  diversityScore: number;
  activityScore: number;
  riskScore: number;
  overallScore: number;
}

interface EcosystemInsight {
  type: 'positive' | 'warning' | 'neutral' | 'critical';
  category: string;
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  actionable?: boolean;
  recommendation?: string;
}

interface ProcessedEcosystemData {
  address: string;
  networks: string[];
  metrics: EcosystemMetrics;
  insights: EcosystemInsight[];
  recommendations: any[];
  networkAnalysis: any;
  protocolAnalysis: any;
  crossChainAnalysis: any;
  riskAssessment: any;
  opportunityMatrix: any;
  trendAnalysis: any;
}

/**
 * Procesa datos de interacciones del ecosistema
 */
export async function processEcosystemData(
  address: string,
  options: {
    includeNetworks?: string[];
    includeProtocols?: boolean;
    includeCrossChain?: boolean;
    includeRiskAnalysis?: boolean;
    timeframe?: 'week' | 'month' | 'quarter' | 'year';
  } = {}
): Promise<ProcessedEcosystemData> {
  try {
    // Obtener análisis completo
    const rawData = await EcosystemInteractionsAPIsService.analyzeEcosystemInteractions(address, options);
    
    // Procesar métricas principales
    const metrics = extractEcosystemMetrics(rawData);
    
    // Generar insights específicos
    const insights = generateEcosystemInsights(rawData, options);
    
    // Procesar recomendaciones
    const recommendations = processRecommendations(rawData.recommendations || []);
    
    // Analizar redes
    const networkAnalysis = analyzeNetworkDistribution(rawData);
    
    // Analizar protocolos
    const protocolAnalysis = analyzeProtocolUsage(rawData);
    
    // Analizar cross-chain
    const crossChainAnalysis = analyzeCrossChainActivity(rawData);
    
    // Evaluar riesgos
    const riskAssessment = assessEcosystemRisks(rawData);
    
    // Matriz de oportunidades
    const opportunityMatrix = generateOpportunityMatrix(rawData);
    
    // Análisis de tendencias
    const trendAnalysis = analyzeTrends(rawData);
    
    return {
      address,
      networks: options.includeNetworks || [],
      metrics,
      insights,
      recommendations,
      networkAnalysis,
      protocolAnalysis,
      crossChainAnalysis,
      riskAssessment,
      opportunityMatrix,
      trendAnalysis
    };

  } catch (error) {
    console.error('Error procesando datos del ecosistema:', error);
    throw new Error('Error al procesar análisis del ecosistema');
  }
}

/**
 * Extrae métricas clave del ecosistema
 */
function extractEcosystemMetrics(data: any): EcosystemMetrics {
  const metrics = data.metrics || {};

  return {
    totalNetworks: metrics.totalNetworks || 0,
    totalProtocols: metrics.totalProtocols || 0,
    crossChainVolume: metrics.crossChainVolume || '0',
    interactionFrequency: metrics.interactionFrequency || 0,
    diversityScore: metrics.diversityScore || 0,
    activityScore: metrics.activityScore || 0,
    riskScore: metrics.riskScore || 0,
    overallScore: metrics.overallScore || 0
  };
}

/**
 * Genera insights específicos del ecosistema
 */
function generateEcosystemInsights(data: any, options: any): EcosystemInsight[] {
  const insights: EcosystemInsight[] = [];
  const metrics = data.metrics || {};
  const crossChainInteractions = data.crossChainInteractions || [];
  const protocolInteractions = data.protocolInteractions || [];
  const networkDistribution = data.networkDistribution || {};

  // Insights de diversificación de redes
  const activeNetworks = Object.keys(networkDistribution).filter(
    network => networkDistribution[network] > 0
  );

  if (activeNetworks.length >= 4) {
    insights.push({
      type: 'positive',
      category: 'diversification',
      title: 'Excelente Diversificación Multi-Red',
      description: `Activo en ${activeNetworks.length} redes blockchain`,
      impact: 'high'
    });
  } else if (activeNetworks.length <= 1) {
    insights.push({
      type: 'critical',
      category: 'diversification',
      title: 'Concentración Crítica en Una Red',
      description: `Solo activo en ${activeNetworks.length} red(es)`,
      impact: 'high',
      actionable: true,
      recommendation: 'Diversificar inmediatamente a Layer 2 y sidechains'
    });
  }

  // Insights de actividad cross-chain
  if (crossChainInteractions.length > 20) {
    insights.push({
      type: 'positive',
      category: 'cross_chain',
      title: 'Usuario Cross-Chain Avanzado',
      description: `${crossChainInteractions.length} interacciones entre redes`,
      impact: 'high'
    });
  } else if (crossChainInteractions.length === 0) {
    insights.push({
      type: 'neutral',
      category: 'cross_chain',
      title: 'Sin Actividad Cross-Chain',
      description: 'No se detectaron bridges o transferencias entre redes',
      impact: 'medium',
      actionable: true,
      recommendation: 'Explorar bridges para optimización de costos y arbitraje'
    });
  }

  // Insights de riesgo
  if (metrics.riskScore > 75) {
    insights.push({
      type: 'critical',
      category: 'risk',
      title: 'Riesgo Crítico Detectado',
      description: `Score de riesgo: ${metrics.riskScore}/100`,
      impact: 'high',
      actionable: true,
      recommendation: 'Implementar estrategias de mitigación de riesgo inmediatamente'
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
    urgency: calculateUrgency(rec)
  }));
}

/**
 * Calcula impacto de recomendación
 */
function calculateRecommendationImpact(recommendation: any): 'high' | 'medium' | 'low' {
  const category = recommendation.category?.toLowerCase() || '';
  
  if (category.includes('risk') || category.includes('diversification')) {
    return 'high';
  }
  
  return 'medium';
}

/**
 * Evalúa factibilidad de implementación
 */
function assessFeasibility(recommendation: any): 'easy' | 'medium' | 'hard' {
  const actionItems = recommendation.actionItems || [];
  
  if (actionItems.length > 5) return 'hard';
  if (actionItems.length > 2) return 'medium';
  
  return 'easy';
}

/**
 * Calcula urgencia
 */
function calculateUrgency(recommendation: any): 'high' | 'medium' | 'low' {
  const priority = recommendation.priority || 'low';
  
  if (priority === 'high') return 'high';
  if (priority === 'medium') return 'medium';
  
  return 'low';
}

/**
 * Analiza distribución de redes
 */
function analyzeNetworkDistribution(data: any): any {
  const networkDistribution = data.networkDistribution || {};
  const networks = Object.keys(networkDistribution);
  
  const values = Object.values(networkDistribution) as number[];
  const totalActivity = values.reduce((sum, val) => sum + val, 0);
  
  const maxActivity = Math.max(...values, 0);
  const dominantNetwork = networks.find(network => 
    networkDistribution[network] === maxActivity
  );
  
  return {
    totalNetworks: networks.length,
    activeNetworks: networks.filter(network => networkDistribution[network] > 0).length,
    dominantNetwork,
    dominantShare: maxActivity,
    distribution: networkDistribution
  };
}

/**
 * Analiza uso de protocolos
 */
function analyzeProtocolUsage(data: any): any {
  const protocolInteractions = data.protocolInteractions || [];
  
  const totalProtocols = new Set(protocolInteractions.map(int => int.protocol)).size;
  const totalInteractions = protocolInteractions.length;
  
  return {
    totalProtocols,
    totalInteractions,
    sophisticationScore: calculateProtocolSophistication(protocolInteractions)
  };
}

/**
 * Calcula score de sofisticación de protocolos
 */
function calculateProtocolSophistication(interactions: any[]): number {
  const sophisticationWeights = {
    'Uniswap': 10, 'Aave': 20, 'Compound': 20, 'MakerDAO': 25,
    'Curve': 15, 'Yearn': 25, 'Synthetix': 30
  };
  
  let score = 0;
  const uniqueProtocols = new Set();
  
  interactions.forEach(interaction => {
    uniqueProtocols.add(interaction.protocol);
    score += sophisticationWeights[interaction.protocol] || 5;
  });
  
  score += uniqueProtocols.size * 5;
  
  return Math.min(100, score);
}

/**
 * Analiza actividad cross-chain
 */
function analyzeCrossChainActivity(data: any): any {
  const crossChainInteractions = data.crossChainInteractions || [];
  
  if (crossChainInteractions.length === 0) {
    return {
      totalInteractions: 0,
      totalVolume: '$0',
      avgTransactionValue: '$0'
    };
  }
  
  const totalVolume = crossChainInteractions.reduce((sum, int) => 
    sum + parseFloat(int.value || '0'), 0
  );
  
  const avgTransactionValue = totalVolume / crossChainInteractions.length;
  
  return {
    totalInteractions: crossChainInteractions.length,
    totalVolume: `$${totalVolume.toLocaleString()}`,
    avgTransactionValue: `$${avgTransactionValue.toLocaleString()}`
  };
}

/**
 * Evalúa riesgos del ecosistema
 */
function assessEcosystemRisks(data: any): any {
  const metrics = data.metrics || {};
  const riskFactors = data.riskFactors || [];
  
  const overallRisk = metrics.riskScore || 0;
  
  return {
    overallRisk,
    riskLevel: overallRisk > 70 ? 'high' : overallRisk > 40 ? 'medium' : 'low',
    riskFactors
  };
}

/**
 * Genera matriz de oportunidades
 */
function generateOpportunityMatrix(data: any): any {
  const opportunities = data.opportunities || [];
  
  return {
    totalOpportunities: opportunities.length,
    highPotentialCount: opportunities.filter(opp => opp.potential === 'high').length
  };
}

/**
 * Analiza tendencias
 */
function analyzeTrends(data: any): any {
  const crossChainInteractions = data.crossChainInteractions || [];
  
  if (crossChainInteractions.length === 0) {
    return {
      volumeTrend: 'stable',
      activityTrend: 'stable'
    };
  }
  
  return {
    volumeTrend: 'increasing',
    activityTrend: 'stable'
  };
}

/**
 * Formatea métricas para visualización
 */
export function formatEcosystemMetrics(metrics: EcosystemMetrics): any {
  return {
    overallScore: {
      value: metrics.overallScore,
      label: `${metrics.overallScore}/100`,
      color: getScoreColor(metrics.overallScore),
      description: getScoreDescription(metrics.overallScore)
    },
    diversityScore: {
      value: metrics.diversityScore,
      label: `${metrics.diversityScore}/100`,
      color: getScoreColor(metrics.diversityScore)
    },
    activityScore: {
      value: metrics.activityScore,
      label: `${metrics.activityScore}/100`,
      color: getScoreColor(metrics.activityScore)
    },
    riskScore: {
      value: metrics.riskScore,
      label: `${metrics.riskScore}/100`,
      color: getRiskScoreColor(metrics.riskScore)
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
 * Obtiene color para score de riesgo (invertido)
 */
function getRiskScoreColor(score: number): string {
  if (score >= 70) return 'text-red-600';
  if (score >= 40) return 'text-yellow-600';
  return 'text-green-600';
}

/**
 * Obtiene descripción según puntuación
 */
function getScoreDescription(score: number): string {
  if (score >= 90) return 'Ecosistema Excepcional';
  if (score >= 80) return 'Ecosistema Muy Bueno';
  if (score >= 70) return 'Ecosistema Bueno';
  if (score >= 60) return 'Ecosistema Moderado';
  if (score >= 40) return 'Ecosistema Básico';
  return 'Ecosistema Limitado';
}

