export interface HistoricalMetrics {
  seo: Array<{ date: string; value: number }>;
  performance: Array<{ date: string; value: number }>;
  accessibility: Array<{ date: string; value: number }>;
  bestPractices: Array<{ date: string; value: number }>;
}

export interface HistoricalTrend {
  metric: string;
  trend: 'up' | 'down' | 'neutral';
  change: string;
  description: string;
}

export interface HistoricalData {
  projectName: string;
  url: string;
  score: number;
  metrics: HistoricalMetrics;
  trends: HistoricalTrend[];
  recommendations: string[];
}