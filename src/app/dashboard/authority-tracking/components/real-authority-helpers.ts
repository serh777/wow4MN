// Helpers para análisis real de Authority Tracking
import { AuthorityTrackingAPIsService } from '@/services/apis/authority-tracking-apis';

// Tipos para los helpers
interface AuthorityMetrics {
  governanceScore: number;
  socialScore: number;
  technicalScore: number;
  overallScore: number;
  participationRate: number;
  networkInfluence: number;
}

interface AuthorityInsight {
  type: 'positive' | 'warning' | 'neutral';
  category: string;
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  actionable?: boolean;
  recommendation?: string;
}

interface ProcessedAuthorityData {
  identifier: string;
  metrics: AuthorityMetrics;
  insights: AuthorityInsight[];
  recommendations: any[];
  riskFactors: any[];
  competitorComparison?: any;
  historicalTrends: any[];
}

/**
 * Procesa datos de autoridad descentralizada
 */
export async function processAuthorityData(
  identifier: string,
  options: {
    analysisType?: string;
    timeframe?: string;
    includeGovernance?: boolean;
    includeReputation?: boolean;
    includeInfluence?: boolean;
  } = {}
): Promise<ProcessedAuthorityData> {
  try {
    // Obtener análisis completo
    const rawData = await AuthorityTrackingAPIsService.analyzeDecentralizedAuthority(identifier);
    
    // Procesar métricas principales
    const metrics = extractAuthorityMetrics(rawData);
    
    // Generar insights específicos
    const insights = generateAuthorityInsights(rawData, options);
    
    // Procesar recomendaciones
    const recommendations = processRecommendations(rawData.recommendations || []);
    
    // Identificar factores de riesgo
    const riskFactors = identifyRiskFactors(rawData);
    
    // Generar tendencias históricas
    const historicalTrends = processHistoricalTrends(rawData.authorityEvolution || []);
    
    return {
      identifier,
      metrics,
      insights,
      recommendations,
      riskFactors,
      historicalTrends
    };

  } catch (error) {
    console.error('Error procesando datos de autoridad:', error);
    throw new Error('Error al procesar análisis de autoridad');
  }
}

/**
 * Extrae métricas clave de autoridad
 */
function extractAuthorityMetrics(data: any): AuthorityMetrics {
  const governance = data.governanceMetrics || {};
  const social = data.socialReputationMetrics || {};
  const technical = data.technicalInfluenceMetrics || {};

  return {
    governanceScore: calculateGovernanceScore(governance),
    socialScore: social.socialScore || 0,
    technicalScore: technical.technicalScore || 0,
    overallScore: data.overallAuthorityScore || 0,
    participationRate: governance.participationRate || 0,
    networkInfluence: social.networkInfluence || 0
  };
}

/**
 * Calcula score de gobernanza normalizado
 */
function calculateGovernanceScore(governance: any): number {
  const {
    participationRate = 0,
    successRate = 0,
    votingPower = 0,
    proposalsCreated = 0
  } = governance;

  // Normalizar componentes (0-100)
  const normalizedParticipation = Math.min(participationRate, 100);
  const normalizedSuccess = Math.min(successRate, 100);
  const normalizedPower = Math.min((votingPower / 10000) * 100, 100); // Asumiendo 10k como máximo
  const normalizedProposals = Math.min(proposalsCreated * 5, 100); // 20 propuestas = 100 puntos

  // Pesos para cada componente
  const weights = {
    participation: 0.4,
    success: 0.3,
    power: 0.2,
    proposals: 0.1
  };

  return Math.round(
    normalizedParticipation * weights.participation +
    normalizedSuccess * weights.success +
    normalizedPower * weights.power +
    normalizedProposals * weights.proposals
  );
}

/**
 * Genera insights específicos de autoridad
 */
function generateAuthorityInsights(data: any, options: any): AuthorityInsight[] {
  const insights: AuthorityInsight[] = [];
  const governance = data.governanceMetrics || {};
  const social = data.socialReputationMetrics || {};
  const technical = data.technicalInfluenceMetrics || {};
  const protocols = data.protocolParticipation || [];

  // Insights de gobernanza
  if (options.includeGovernance !== false) {
    if (governance.participationRate > 80) {
      insights.push({
        type: 'positive',
        category: 'governance',
        title: 'Participación Excepcional',
        description: `${governance.participationRate}% de participación en votaciones`,
        impact: 'high',
        actionable: false
      });
    } else if (governance.participationRate < 30) {
      insights.push({
        type: 'warning',
        category: 'governance',
        title: 'Baja Participación',
        description: `Solo ${governance.participationRate}% de participación en gobernanza`,
        impact: 'medium',
        actionable: true,
        recommendation: 'Incrementar participación en votaciones para mejorar autoridad'
      });
    }

    if (governance.proposalsCreated > 10) {
      insights.push({
        type: 'positive',
        category: 'governance',
        title: 'Liderazgo en Propuestas',
        description: `${governance.proposalsCreated} propuestas creadas`,
        impact: 'high'
      });
    }
  }

  // Insights de reputación social
  if (options.includeReputation !== false) {
    if (social.trustScore > 90) {
      insights.push({
        type: 'positive',
        category: 'reputation',
        title: 'Alta Confianza Comunitaria',
        description: `Score de confianza: ${social.trustScore}/100`,
        impact: 'high'
      });
    }

    if (social.followers > 10000) {
      insights.push({
        type: 'positive',
        category: 'reputation',
        title: 'Amplio Alcance Social',
        description: `${social.followers.toLocaleString()} seguidores`,
        impact: 'medium'
      });
    } else if (social.followers < 500) {
      insights.push({
        type: 'warning',
        category: 'reputation',
        title: 'Presencia Social Limitada',
        description: `Solo ${social.followers} seguidores`,
        impact: 'low',
        actionable: true,
        recommendation: 'Aumentar presencia en redes sociales Web3'
      });
    }
  }

  // Insights de influencia técnica
  if (options.includeInfluence !== false) {
    if (technical.githubContributions > 1000) {
      insights.push({
        type: 'positive',
        category: 'technical',
        title: 'Alto Impacto Técnico',
        description: `${technical.githubContributions} contribuciones en GitHub`,
        impact: 'high'
      });
    }

    if (technical.securityAudits > 3) {
      insights.push({
        type: 'positive',
        category: 'technical',
        title: 'Experiencia en Seguridad',
        description: `${technical.securityAudits} auditorías de seguridad`,
        impact: 'high'
      });
    }
  }

  // Insights de diversificación
  const protocolCount = protocols.length;
  if (protocolCount > 7) {
    insights.push({
      type: 'positive',
      category: 'diversification',
      title: 'Excelente Diversificación',
      description: `Participación en ${protocolCount} protocolos`,
      impact: 'medium'
    });
  } else if (protocolCount < 3) {
    insights.push({
      type: 'warning',
      category: 'diversification',
      title: 'Baja Diversificación',
      description: `Solo ${protocolCount} protocolos activos`,
      impact: 'low',
      actionable: true,
      recommendation: 'Diversificar participación en más protocolos DeFi'
    });
  }

  // Insights de red
  const network = data.networkAnalysis || {};
  if (network.networkCentrality > 0.6) {
    insights.push({
      type: 'positive',
      category: 'network',
      title: 'Posición Central en Red',
      description: `Centralidad de red: ${(network.networkCentrality * 100).toFixed(1)}%`,
      impact: 'high'
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
    timeToImplement: estimateImplementationTime(rec),
    difficulty: assessImplementationDifficulty(rec)
  })).sort((a, b) => {
    // Ordenar por prioridad e impacto
    const priorityWeight = { high: 3, medium: 2, low: 1 };
    const impactWeight = { high: 3, medium: 2, low: 1 };
    
    const scoreA = (priorityWeight[a.priority as keyof typeof priorityWeight] || 1) * 
                   (impactWeight[a.estimatedImpact as keyof typeof impactWeight] || 1);
    const scoreB = (priorityWeight[b.priority as keyof typeof priorityWeight] || 1) * 
                   (impactWeight[b.estimatedImpact as keyof typeof impactWeight] || 1);
    
    return scoreB - scoreA;
  });
}

/**
 * Calcula impacto estimado de recomendación
 */
function calculateRecommendationImpact(recommendation: any): 'high' | 'medium' | 'low' {
  const category = recommendation.category?.toLowerCase() || '';
  const title = recommendation.title?.toLowerCase() || '';
  
  // Recomendaciones de alto impacto
  if (category.includes('governance') && title.includes('participación')) {
    return 'high';
  }
  if (category.includes('technical') && title.includes('contribuciones')) {
    return 'high';
  }
  
  // Recomendaciones de impacto medio
  if (category.includes('reputation') || category.includes('social')) {
    return 'medium';
  }
  
  return 'low';
}

/**
 * Estima tiempo de implementación
 */
function estimateImplementationTime(recommendation: any): string {
  const actionItems = recommendation.actionItems || [];
  const complexity = actionItems.length;
  
  if (complexity <= 2) return '1-2 semanas';
  if (complexity <= 4) return '1-2 meses';
  return '3-6 meses';
}

/**
 * Evalúa dificultad de implementación
 */
function assessImplementationDifficulty(recommendation: any): 'easy' | 'medium' | 'hard' {
  const category = recommendation.category?.toLowerCase() || '';
  
  if (category.includes('governance')) return 'medium';
  if (category.includes('technical')) return 'hard';
  if (category.includes('social')) return 'easy';
  
  return 'medium';
}

/**
 * Identifica factores de riesgo
 */
function identifyRiskFactors(data: any): any[] {
  const risks: any[] = [];
  const governance = data.governanceMetrics || {};
  const social = data.socialReputationMetrics || {};
  const protocols = data.protocolParticipation || [];

  // Riesgo de concentración
  if (protocols.length < 3) {
    risks.push({
      type: 'concentration',
      severity: 'medium',
      title: 'Concentración en Pocos Protocolos',
      description: 'Dependencia excesiva de pocos protocolos puede limitar influencia',
      mitigation: 'Diversificar participación en más ecosistemas'
    });
  }

  // Riesgo de baja participación
  if (governance.participationRate < 25) {
    risks.push({
      type: 'participation',
      severity: 'high',
      title: 'Baja Participación en Gobernanza',
      description: 'Participación insuficiente puede afectar credibilidad',
      mitigation: 'Incrementar participación activa en votaciones'
    });
  }

  // Riesgo de reputación
  if (social.trustScore < 60) {
    risks.push({
      type: 'reputation',
      severity: 'medium',
      title: 'Score de Confianza Bajo',
      description: 'Baja confianza comunitaria puede limitar oportunidades',
      mitigation: 'Mejorar transparencia y participación comunitaria'
    });
  }

  return risks;
}

/**
 * Procesa tendencias históricas
 */
function processHistoricalTrends(evolution: any[]): any[] {
  if (evolution.length < 3) return [];

  const trends = [];
  
  // Tendencia de autoridad general
  const overallTrend = calculateTrend(evolution.map(e => e.overallScore));
  trends.push({
    metric: 'Autoridad General',
    trend: overallTrend.direction,
    change: overallTrend.change,
    significance: overallTrend.significance
  });

  // Tendencia de gobernanza
  const governanceTrend = calculateTrend(evolution.map(e => e.governanceScore));
  trends.push({
    metric: 'Gobernanza',
    trend: governanceTrend.direction,
    change: governanceTrend.change,
    significance: governanceTrend.significance
  });

  // Tendencia social
  const socialTrend = calculateTrend(evolution.map(e => e.socialScore));
  trends.push({
    metric: 'Reputación Social',
    trend: socialTrend.direction,
    change: socialTrend.change,
    significance: socialTrend.significance
  });

  // Tendencia técnica
  const technicalTrend = calculateTrend(evolution.map(e => e.technicalScore));
  trends.push({
    metric: 'Influencia Técnica',
    trend: technicalTrend.direction,
    change: technicalTrend.change,
    significance: technicalTrend.significance
  });

  return trends;
}

/**
 * Calcula tendencia de una serie de datos
 */
function calculateTrend(values: number[]): {
  direction: 'up' | 'down' | 'stable';
  change: number;
  significance: 'high' | 'medium' | 'low';
} {
  if (values.length < 2) {
    return { direction: 'stable', change: 0, significance: 'low' };
  }

  const first = values[0];
  const last = values[values.length - 1];
  const change = ((last - first) / first) * 100;

  let direction: 'up' | 'down' | 'stable';
  let significance: 'high' | 'medium' | 'low';

  if (Math.abs(change) < 5) {
    direction = 'stable';
    significance = 'low';
  } else if (change > 0) {
    direction = 'up';
    significance = change > 20 ? 'high' : 'medium';
  } else {
    direction = 'down';
    significance = Math.abs(change) > 20 ? 'high' : 'medium';
  }

  return { direction, change: Math.round(change), significance };
}

/**
 * Valida dirección o identificador
 */
export function validateIdentifier(identifier: string): {
  isValid: boolean;
  type: 'address' | 'ens' | 'project' | 'unknown';
  error?: string;
} {
  if (!identifier || identifier.trim().length === 0) {
    return { isValid: false, type: 'unknown', error: 'Identificador requerido' };
  }

  const trimmed = identifier.trim();

  // Validar dirección Ethereum
  if (/^0x[a-fA-F0-9]{40}$/.test(trimmed)) {
    return { isValid: true, type: 'address' };
  }

  // Validar ENS
  if (trimmed.endsWith('.eth')) {
    return { isValid: true, type: 'ens' };
  }

  // Validar nombre de proyecto (alfanumérico con guiones)
  if (/^[a-zA-Z0-9\-\s]+$/.test(trimmed) && trimmed.length >= 2) {
    return { isValid: true, type: 'project' };
  }

  return { 
    isValid: false, 
    type: 'unknown', 
    error: 'Formato inválido. Use dirección 0x..., ENS .eth, o nombre de proyecto' 
  };
}

/**
 * Formatea métricas para visualización
 */
export function formatAuthorityMetrics(metrics: AuthorityMetrics): any {
  return {
    overallScore: {
      value: metrics.overallScore,
      label: `${metrics.overallScore}/100`,
      color: getScoreColor(metrics.overallScore),
      description: getScoreDescription(metrics.overallScore)
    },
    governanceScore: {
      value: metrics.governanceScore,
      label: `${metrics.governanceScore}/100`,
      color: getScoreColor(metrics.governanceScore)
    },
    socialScore: {
      value: metrics.socialScore,
      label: `${metrics.socialScore}/100`,
      color: getScoreColor(metrics.socialScore)
    },
    technicalScore: {
      value: metrics.technicalScore,
      label: `${metrics.technicalScore}/100`,
      color: getScoreColor(metrics.technicalScore)
    },
    participationRate: {
      value: metrics.participationRate,
      label: `${metrics.participationRate}%`,
      color: getScoreColor(metrics.participationRate)
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
  if (score >= 90) return 'Autoridad Excepcional';
  if (score >= 80) return 'Alta Autoridad';
  if (score >= 70) return 'Buena Autoridad';
  if (score >= 60) return 'Autoridad Moderada';
  if (score >= 40) return 'Autoridad Básica';
  return 'Autoridad Limitada';
}

