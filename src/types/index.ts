// Analysis Types
export interface AnalysisData {
  type: string;
  data: any;
  score: number;
}

// Web3 Types
export interface WalletData {
  address: string;
  chainId: number;
  connected: boolean;
}

// Service Response Types
export interface BacklinksAnalysis {
  url: string;
  score: number;
  totalBacklinks: number;
  qualityDistribution: {
    high: number;
    medium: number;
    low: number;
  };
  platformDistribution: Array<{
    name: string;
    count: number;
    quality: string;
  }>;
}

// Component Props Types
export interface ToolProps {
  title: string;
  description: string;
  icon: string;
}

// Notification Types
export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  duration?: number;
  read?: boolean;
  actionUrl?: string;
  timestamp: Date;
}

// Analysis Service Types
export interface AnalysisResult {
  id?: string;
  type: string;
  data: any;
  score: number;
  userId?: string;
  createdAt?: string;
}