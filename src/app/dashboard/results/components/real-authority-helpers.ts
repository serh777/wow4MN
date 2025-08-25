'use client';

// Utility functions for authority tracking analysis

export interface AuthorityMetrics {
  domainAuthority: number;
  pageAuthority: number;
  trustFlow: number;
  citationFlow: number;
  backlinks: number;
  referringDomains: number;
  organicKeywords: number;
  organicTraffic: number;
}

export interface ProcessedAuthorityData {
  identifier: string;
  metrics: AuthorityMetrics;
  score: number;
  rank: number;
  trends: {
    scoreChange: number;
    rankChange: number;
    period: string;
  };
  competitors: Array<{
    domain: string;
    score: number;
    rank: number;
  }>;
  recommendations: string[];
}

/**
 * Validates if the provided identifier is valid for authority analysis
 */
export function validateIdentifier(identifier: string): { isValid: boolean; error?: string } {
  if (!identifier || identifier.trim().length === 0) {
    return { isValid: false, error: 'Identifier is required' };
  }

  // Check if it's a valid domain format
  const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?\.[a-zA-Z]{2,}$/;
  const urlRegex = /^https?:\/\/(www\.)?[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?\.[a-zA-Z]{2,}(\/.*)*/;
  
  if (!domainRegex.test(identifier) && !urlRegex.test(identifier)) {
    return { isValid: false, error: 'Please provide a valid domain or URL' };
  }

  return { isValid: true };
}

/**
 * Processes raw authority data and calculates derived metrics
 */
export function processAuthorityData(rawData: any): ProcessedAuthorityData {
  const metrics: AuthorityMetrics = {
    domainAuthority: rawData.domainAuthority || 0,
    pageAuthority: rawData.pageAuthority || 0,
    trustFlow: rawData.trustFlow || 0,
    citationFlow: rawData.citationFlow || 0,
    backlinks: rawData.backlinks || 0,
    referringDomains: rawData.referringDomains || 0,
    organicKeywords: rawData.organicKeywords || 0,
    organicTraffic: rawData.organicTraffic || 0
  };

  // Calculate overall authority score
  const score = calculateAuthorityScore(metrics);
  
  // Generate recommendations based on metrics
  const recommendations = generateRecommendations(metrics);

  return {
    identifier: rawData.identifier || '',
    metrics,
    score,
    rank: rawData.rank || 0,
    trends: rawData.trends || { scoreChange: 0, rankChange: 0, period: '30d' },
    competitors: rawData.competitors || [],
    recommendations
  };
}

/**
 * Calculates a composite authority score based on various metrics
 */
function calculateAuthorityScore(metrics: AuthorityMetrics): number {
  const weights = {
    domainAuthority: 0.25,
    pageAuthority: 0.20,
    trustFlow: 0.15,
    citationFlow: 0.15,
    backlinks: 0.10,
    referringDomains: 0.10,
    organicKeywords: 0.03,
    organicTraffic: 0.02
  };

  let score = 0;
  score += (metrics.domainAuthority / 100) * weights.domainAuthority * 100;
  score += (metrics.pageAuthority / 100) * weights.pageAuthority * 100;
  score += (metrics.trustFlow / 100) * weights.trustFlow * 100;
  score += (metrics.citationFlow / 100) * weights.citationFlow * 100;
  score += Math.min(metrics.backlinks / 10000, 1) * weights.backlinks * 100;
  score += Math.min(metrics.referringDomains / 1000, 1) * weights.referringDomains * 100;
  score += Math.min(metrics.organicKeywords / 10000, 1) * weights.organicKeywords * 100;
  score += Math.min(metrics.organicTraffic / 100000, 1) * weights.organicTraffic * 100;

  return Math.round(score);
}

/**
 * Generates recommendations based on authority metrics
 */
function generateRecommendations(metrics: AuthorityMetrics): string[] {
  const recommendations: string[] = [];

  if (metrics.domainAuthority < 30) {
    recommendations.push('Focus on building high-quality backlinks to improve domain authority');
  }

  if (metrics.trustFlow < metrics.citationFlow) {
    recommendations.push('Improve link quality - focus on trustworthy, relevant sources');
  }

  if (metrics.referringDomains < 50) {
    recommendations.push('Diversify your backlink profile by acquiring links from more domains');
  }

  if (metrics.organicKeywords < 100) {
    recommendations.push('Expand content strategy to target more relevant keywords');
  }

  if (metrics.backlinks < 100) {
    recommendations.push('Implement a comprehensive link building strategy');
  }

  if (recommendations.length === 0) {
    recommendations.push('Maintain current SEO efforts and monitor competitor activities');
  }

  return recommendations;
}

/**
 * Formats authority metrics for display
 */
export function formatAuthorityMetrics(metrics: AuthorityMetrics) {
  return {
    domainAuthority: `${metrics.domainAuthority}/100`,
    pageAuthority: `${metrics.pageAuthority}/100`,
    trustFlow: `${metrics.trustFlow}/100`,
    citationFlow: `${metrics.citationFlow}/100`,
    backlinks: formatNumber(metrics.backlinks),
    referringDomains: formatNumber(metrics.referringDomains),
    organicKeywords: formatNumber(metrics.organicKeywords),
    organicTraffic: formatNumber(metrics.organicTraffic)
  };
}

/**
 * Formats numbers with appropriate suffixes (K, M, B)
 */
function formatNumber(num: number): string {
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(1) + 'B';
  }
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

/**
 * Determines the trend direction and color
 */
export function getTrendInfo(change: number) {
  if (change > 0) {
    return { direction: 'up', color: 'text-green-600', icon: '↗' };
  } else if (change < 0) {
    return { direction: 'down', color: 'text-red-600', icon: '↘' };
  } else {
    return { direction: 'neutral', color: 'text-gray-600', icon: '→' };
  }
}