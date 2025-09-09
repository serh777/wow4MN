export interface KeywordData {
  keyword: string;
  score: number;
  volume: number;
  competition: number;
  recommendations: string[];
  // Campos Web3
  web3Relevance?: number;
  blockchainMentions?: number;
  web3Category?: string;
  relatedProjects?: string[];
  blockchainInsights?: {
    trendingTopics: string[];
    risingProjects: string[];
    popularContracts: string[];
  };
}

export interface KeywordAnalysisData {
  keywords: KeywordData[];
  suggestedKeywords: string[];
  niche: string;
}

export interface KeywordAnalysisResult {
  type: 'keywords';
  data: KeywordAnalysisData;
  score: number;
}