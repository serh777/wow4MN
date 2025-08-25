// Types for AI Assistant analysis results

export interface AnalysisResults {
  id: string;
  timestamp: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  currentStep?: string;
  analysisType?: string;
  url?: string;
  overallScore: {
    score: number;
    status: 'excellent' | 'good' | 'fair' | 'poor';
    insights: string[];
    recommendations: string[];
  };
  web3SeoMetrics: {
    onChainPresence: number;
    smartContractOptimization: number;
    decentralizedContent: number;
    communityEngagement: number;
    tokenomicsHealth: number;
    trends: {
      period: string;
      changes: Record<string, number>;
    };
  };
  overviewMetrics: {
    totalAnalyzed: number;
    issuesFound: number;
    opportunitiesIdentified: number;
    completionRate: number;
    lastUpdated: string;
  };
  smartContractMetrics: {
    contractsAnalyzed: number;
    vulnerabilities: {
      critical: number;
      high: number;
      medium: number;
      low: number;
    };
    securityScore: number;
    gasOptimization: {
      current: number;
      potential: number;
      savings: number;
    };
    codeQuality: {
      score: number;
      issues: string[];
      suggestions: string[];
    };
    recommendations: string[];
  };
  opportunities: Array<{
    id: string;
    title: string;
    description: string;
    impact: 'high' | 'medium' | 'low';
    effort: 'high' | 'medium' | 'low';
    category: string;
  }>;
  diagnostics: Array<{
    id: string;
    title: string;
    description: string;
    status: 'passed' | 'failed' | 'warning' | 'info';
    category: string;
    recommendation?: string;
  }>;
  error?: {
    message: string;
    code?: string;
    details?: any;
  };
  predictions?: {
    marketTrend: string;
    growthPotential: number;
    riskFactors: string[];
    recommendations: string[];
  };
  anomalies?: {
    detected: Array<{
      type: string;
      severity: 'low' | 'medium' | 'high' | 'critical';
      description: string;
      timestamp: string;
      affectedMetrics: string[];
    }>;
    summary: {
      total: number;
      bySeverity: Record<string, number>;
    };
  };
  marketOpportunities?: {
    gaps: string[];
    potential: string[];
    strategy: string[];
    trends: {
      industry: string;
      growth: number;
      keywords: string[];
    };
  };
}

export interface AnalysisConfig {
  includeSmartContracts: boolean;
  includeSeoMetrics: boolean;
  includeOpportunities: boolean;
  includeDiagnostics: boolean;
  timeframe: '24h' | '7d' | '30d' | '90d';
  depth: 'basic' | 'standard' | 'comprehensive';
}

export interface AnalysisRequest {
  url?: string;
  contractAddress?: string;
  projectId?: string;
  config: AnalysisConfig;
}

export interface ChartData {
  name: string;
  value: number;
  change?: number;
  trend?: 'up' | 'down' | 'stable';
}

export interface MetricCard {
  title: string;
  value: string | number;
  change?: number;
  trend?: 'up' | 'down' | 'stable';
  description?: string;
  icon?: string;
}

export interface RecommendationItem {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  category: string;
  estimatedImpact: string;
  implementationTime: string;
}

export interface DiagnosticResult {
  category: string;
  tests: Array<{
    name: string;
    status: 'passed' | 'failed' | 'warning' | 'skipped';
    message: string;
    details?: any;
  }>;
}

export interface TrendData {
  period: string;
  metrics: Record<string, number>;
  comparison: {
    previousPeriod: Record<string, number>;
    changes: Record<string, number>;
  };
}