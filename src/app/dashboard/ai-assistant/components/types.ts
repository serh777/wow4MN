// Tipos específicos para el análisis de IA Web3

export interface AIAnalysisParams {
  url: string;
  analysisType: string;
  network?: string;
  contractAddress?: string;
  includeMetadata: boolean;
  includeEvents: boolean;
  includeTransactions: boolean;
  selectedIndexer: string;
  prompt?: string;
  includeGasOptimization?: boolean;
  includeSecurityAudit?: boolean;
  includeSeoAnalysis?: boolean;
}

export interface AIAnalysisResult {
  id: string;
  type: string;
  timestamp: Date;
  data: any;
  overallScore: number;
  riskLevel: string;
  opportunities: string[];
  predictions: {
    trafficGrowth: number;
    conversionImprovement: number;
    timeframe: string;
    confidence: number;
  };
  vulnerabilities: Array<{
    severity: string;
    description: string;
    recommendation: string;
  }>;
  blockchainMetrics: {
    gasOptimization: number;
    smartContractEfficiency: number;
    web3Integration: number;
  };
  competitorAnalysis: {
    position: number;
    gaps: string[];
    opportunities: string[];
  };
  recommendations: Array<{
    action: string;
    priority: string;
    impact: string;
    effort: string;
    roi: string;
  }>;
  aiInsights: {
    sentiment: number;
    contentQuality: number;
    userExperience: number;
    technicalDebt: number;
  };
  marketTrends: {
    industry: string;
    trendScore: number;
    emergingKeywords: string[];
  };
}

export interface IndexerAnalysisResult {
  overallScore: number;
  web3Seo: number;
  smartContractSeo: number;
  dappPerformance: number;
  blockchainMetrics: number;
  opportunities: string[];
  diagnostics: string[];
}

// Tipos para agentes IA blockchain
export interface BlockchainAgent {
  id: string;
  name: string;
  type: 'seo' | 'security' | 'performance' | 'analytics';
  status: 'idle' | 'working' | 'completed' | 'error';
  capabilities: string[];
  currentTask?: AgentTask;
}

export interface AgentTask {
  id: string;
  type: 'contract_analysis' | 'seo_audit' | 'security_scan' | 'performance_check';
  target: string; // Contract address or URL
  parameters: Record<string, any>;
  progress: number;
  results?: any;
  startTime: Date;
  endTime?: Date;
  error?: string;
}

export interface Web3SEOMetrics {
  contractDiscoverability: number;
  metadataCompleteness: number;
  eventIndexability: number;
  crossChainCompatibility: number;
  gasEfficiency: number;
  documentationQuality: number;
}

export interface AutonomousAnalysisConfig {
  enabledAgents: string[];
  analysisDepth: 'basic' | 'comprehensive' | 'deep';
  realTimeMonitoring: boolean;
  alertThresholds: {
    security: number;
    performance: number;
    seo: number;
  };
  scheduledScans: {
    frequency: 'hourly' | 'daily' | 'weekly';
    targets: string[];
  };
}