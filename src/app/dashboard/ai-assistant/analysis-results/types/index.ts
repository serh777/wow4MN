export interface AnalysisResults {
  overallScore: number;
  analysisType: 'comprehensive' | 'predictive' | 'anomaly' | 'opportunity';
  url: string;
  riskLevel: 'low' | 'medium' | 'high';
  indexerStatus: {
    connected: boolean;
    dataSource: string;
    lastUpdate: string;
  };
  web3Seo: {
    metaTags: number;
    structuredData: number;
    semanticMarkup: number;
    web3Compatibility: number;
  };
  smartContractSeo: {
    contractVerification: boolean;
    abiDocumentation: number;
    gasOptimization: number;
    securityAudit: number;
  };
  dappPerformance: {
    loadTime: number;
    web3Integration: number;
    userExperience: number;
    mobileOptimization: number;
  };
  blockchainMetrics: {
    transactionVolume: number;
    activeUsers: number;
    networkHealth: number;
    multiChainSupport: number;
  };
  opportunities: Opportunity[];
  diagnostics: Diagnostic[];
  predictions?: {
    marketTrend: string;
    growthPotential: number;
    riskFactors: string[];
    recommendations: string[];
  };
  anomalies?: {
    detected: string[];
    severity: string;
    recommendations: string[];
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

export interface Opportunity {
  title: string;
  description: string;
  solution: string;
  implementation: string;
  estimatedImpact: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: 'web3-seo' | 'smart-contract' | 'dapp-performance' | 'user-experience';
}

export interface Diagnostic {
  title: string;
  description: string;
  solution: string;
  codeExample?: string;
  severity: 'critical' | 'warning' | 'info';
  category: 'web3-seo' | 'smart-contract' | 'dapp-performance' | 'security';
}