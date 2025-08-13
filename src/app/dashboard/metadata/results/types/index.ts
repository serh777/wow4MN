// Tipos para el análisis de metadatos

export interface MetadataAnalysisResult {
  id: string;
  url: string;
  contractAddress: string;
  network: string;
  timestamp: string;
  overallScore: number;
  previousScore?: number;
  category: string;
  description: string;
  
  // Métricas principales
  overviewMetrics: OverviewMetrics;
  metadataMetrics: MetadataMetricsData;
  web3SeoMetrics: Web3SeoMetrics;
  
  // Análisis detallado
  opportunities: Opportunity[];
  diagnostics: DiagnosticItem[];
  
  // Estado del análisis
  status: 'loading' | 'completed' | 'error';
  error?: string;
}

export interface OverviewMetrics {
  totalElements: number;
  completionRate: number;
  qualityScore: number;
  standardCompliance: number;
  lastUpdated: string;
  contractAddress: string;
  network: string;
}

export interface MetadataMetric {
  name: string;
  value: number;
  maxValue: number;
  status: 'excellent' | 'good' | 'warning' | 'error';
  description: string;
}

export interface MetadataMetricsData {
  contractMetrics: MetadataMetric[];
  tokenMetrics: MetadataMetric[];
  nftMetrics: MetadataMetric[];
}

export interface Web3SeoMetrics {
  metaTitle: {
    score: number;
    length: number;
    hasKeywords: boolean;
    suggestion: string;
  };
  metaDescription: {
    score: number;
    length: number;
    hasKeywords: boolean;
    suggestion: string;
  };
  structuredData: {
    score: number;
    hasSchema: boolean;
    schemaTypes: string[];
    suggestion: string;
  };
  openGraph: {
    score: number;
    hasImage: boolean;
    hasTitle: boolean;
    hasDescription: boolean;
    suggestion: string;
  };
  twitterCard: {
    score: number;
    hasCard: boolean;
    hasImage: boolean;
    suggestion: string;
  };
  canonicalUrl: {
    score: number;
    hasCanonical: boolean;
    isValid: boolean;
    suggestion: string;
  };
  web3Specific: {
    score: number;
    hasContractInfo: boolean;
    hasNetworkInfo: boolean;
    hasTokenomics: boolean;
    suggestion: string;
  };
}

export interface Opportunity {
  id: string;
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  effort: 'high' | 'medium' | 'low';
  category: 'metadata' | 'structure' | 'seo' | 'performance';
  recommendation: string;
  codeExample?: string;
  estimatedImprovement: number;
}

export interface DiagnosticItem {
  id: string;
  title: string;
  description: string;
  severity: 'error' | 'warning' | 'info' | 'success';
  category: 'metadata' | 'structure' | 'compliance' | 'performance';
  location?: string;
  suggestion?: string;
  codeSnippet?: string;
  affectedElements: number;
}

// Tipos para el estado de la aplicación
export interface MetadataAnalysisState {
  isLoading: boolean;
  result: MetadataAnalysisResult | null;
  error: string | null;
}

// Tipos para la configuración del análisis
export interface MetadataAnalysisConfig {
  url: string;
  contractAddress?: string;
  network?: string;
  includeTokenAnalysis?: boolean;
  includeNftAnalysis?: boolean;
  includeSeoAnalysis?: boolean;
  includePerformanceAnalysis?: boolean;
}

// Tipos para los parámetros de URL
export interface MetadataResultsParams {
  url: string;
  score?: string;
  contractAddress?: string;
  network?: string;
}

// Tipos para los componentes
export interface LoadingStateProps {
  url: string;
  onBackToHome: () => void;
}

export interface ErrorStateProps {
  error: string;
  onRetry: () => void;
  onBackToHome: () => void;
}

export interface OverallScoreCardProps {
  score: number;
  previousScore?: number;
  category: string;
  description: string;
}

export interface MetadataMetricsProps {
  contractMetrics: MetadataMetric[];
  tokenMetrics: MetadataMetric[];
  nftMetrics: MetadataMetric[];
}

export interface OverviewMetricsProps extends OverviewMetrics {}

export interface OpportunitiesSectionProps {
  opportunities: Opportunity[];
}

export interface DiagnosticsSectionProps {
  diagnostics: DiagnosticItem[];
}

// Tipos para utilidades
export interface MetadataValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  suggestions: string[];
}

export interface ContractMetadata {
  name?: string;
  symbol?: string;
  description?: string;
  image?: string;
  externalUrl?: string;
  attributes?: Array<{
    trait_type: string;
    value: string | number;
  }>;
  properties?: Record<string, any>;
}

export interface TokenMetadata extends ContractMetadata {
  tokenId?: string;
  tokenUri?: string;
  animationUrl?: string;
  backgroundColor?: string;
}

export interface NftCollection {
  address: string;
  name: string;
  symbol: string;
  totalSupply: number;
  metadata: ContractMetadata;
  tokens: TokenMetadata[];
}

// Constantes de tipos
export const ANALYSIS_CATEGORIES = {
  METADATA: 'metadata',
  STRUCTURE: 'structure',
  SEO: 'seo',
  PERFORMANCE: 'performance',
  COMPLIANCE: 'compliance'
} as const;

export const SEVERITY_LEVELS = {
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
  SUCCESS: 'success'
} as const;

export const IMPACT_LEVELS = {
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low'
} as const;

export const EFFORT_LEVELS = {
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low'
} as const;

export const METRIC_STATUS = {
  EXCELLENT: 'excellent',
  GOOD: 'good',
  WARNING: 'warning',
  ERROR: 'error'
} as const;

// Tipos derivados
export type AnalysisCategory = typeof ANALYSIS_CATEGORIES[keyof typeof ANALYSIS_CATEGORIES];
export type SeverityLevel = typeof SEVERITY_LEVELS[keyof typeof SEVERITY_LEVELS];
export type ImpactLevel = typeof IMPACT_LEVELS[keyof typeof IMPACT_LEVELS];
export type EffortLevel = typeof EFFORT_LEVELS[keyof typeof EFFORT_LEVELS];
export type MetricStatus = typeof METRIC_STATUS[keyof typeof METRIC_STATUS];