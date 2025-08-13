export interface KeywordData {
  keyword: string;
  score: number;
  volume: number;
  competition: number;
  recommendations: string[];
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