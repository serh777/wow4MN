export interface ContentAnalysisResults {
  overallScore: number;
  analysisType: 'comprehensive' | 'seo' | 'readability' | 'engagement';
  url: string;
  contentQuality: 'excellent' | 'good' | 'fair' | 'poor';
  indexerStatus: {
    connected: boolean;
    dataSource: string;
    lastUpdate: string;
  };
  contentMetrics: {
    readabilityScore: number;
    keywordDensity: number;
    contentLength: number;
    headingStructure: number;
  };
  seoOptimization: {
    titleOptimization: number;
    metaDescription: number;
    headingTags: number;
    internalLinks: number;
  };
  engagementMetrics: {
    socialShares: number;
    timeOnPage: number;
    bounceRate: number;
    userInteraction: number;
  };
  technicalSeo: {
    pageSpeed: number;
    mobileOptimization: number;
    structuredData: number;
    accessibility: number;
  };
  opportunities: ContentOpportunity[];
  diagnostics: ContentDiagnostic[];
  contentStrategy?: {
    recommendations: string[];
    targetKeywords: string[];
    contentGaps: string[];
    competitorAnalysis: string[];
  };
  readabilityAnalysis?: {
    fleschScore: number;
    averageSentenceLength: number;
    complexWords: number;
    suggestions: string[];
  };
  engagementStrategy?: {
    improvements: string[];
    callToActions: string[];
    userJourney: string[];
    conversionOptimization: string[];
  };
}

export interface ContentOpportunity {
  title: string;
  description: string;
  solution: string;
  implementation: string;
  estimatedImpact: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: 'seo' | 'readability' | 'engagement' | 'technical';
}

export interface ContentDiagnostic {
  title: string;
  description: string;
  solution: string;
  codeExample?: string;
  severity: 'critical' | 'warning' | 'info';
  category: 'seo' | 'readability' | 'engagement' | 'technical';
}