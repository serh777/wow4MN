'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAnalysisNotifications } from '@/components/notifications/use-analysis-notifications';
import { NFTTrackingAPIsService } from '@/services/apis/nft-tracking-apis';
import type { AnalysisResult } from '@/types';

// Tipos específicos para el análisis de NFT Tracking
export interface NFTTrackingParams {
  nftAddress?: string;
  tokenId?: string;
  collectionAddress: string;
  trackingType: 'comprehensive' | 'price' | 'rarity' | 'history';
  blockchain: string;
  includePrice: boolean;
  includeRarity: boolean;
  includeHistory: boolean;
  includeMarketplace: boolean;
  timeframe: string;
}

export interface NFTTrackingResult extends AnalysisResult {
  nftData: {
    tokenInfo: {
      name: string;
      description: string;
      image: string;
      tokenId: string;
      contractAddress: string;
      blockchain: string;
      standard: string;
    };
    collectionInfo: {
      name: string;
      symbol: string;
      totalSupply: number;
      floorPrice: number;
      volume24h: number;
      owners: number;
      verified: boolean;
    };
    priceData: {
      currentPrice: number;
      currency: string;
      priceHistory: Array<{
        date: string;
        price: number;
        marketplace: string;
      }>;
      priceChange24h: number;
      priceChange7d: number;
      priceChange30d: number;
    };
    rarityData: {
      rank: number;
      score: number;
      totalSupply: number;
      traits: Array<{
        trait_type: string;
        value: string;
        rarity: number;
        count: number;
      }>;
    };
    marketplaceData: {
      listings: Array<{
        marketplace: string;
        price: number;
        currency: string;
        seller: string;
        expiration: string;
      }>;
      lastSales: Array<{
        date: string;
        price: number;
        currency: string;
        buyer: string;
        seller: string;
        marketplace: string;
      }>;
    };
    ownershipHistory: Array<{
      date: string;
      from: string;
      to: string;
      price?: number;
      transactionHash: string;
    }>;
  };
  insights: {
    priceInsights: string[];
    rarityInsights: string[];
    marketInsights: string[];
    investmentInsights: string[];
  };
  recommendations: {
    buyRecommendation: {
      score: number;
      reasons: string[];
    };
    sellRecommendation: {
      score: number;
      reasons: string[];
    };
    holdRecommendation: {
      score: number;
      reasons: string[];
    };
  };
  alerts: Array<{
    type: 'price' | 'listing' | 'sale' | 'rarity';
    message: string;
    severity: 'low' | 'medium' | 'high';
    timestamp: string;
  }>;
}

export function useNFTTrackingAnalysis() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<NFTTrackingResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { notifyAnalysisStarted, notifyAnalysisCompleted, notifyAnalysisError } = useAnalysisNotifications();

  const analyzeNFT = async (params: NFTTrackingParams) => {
    if (!params.collectionAddress) {
      setError('La dirección de la colección es requerida');
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setAnalysisResult(null);

    // Notificar inicio del análisis
    notifyAnalysisStarted('NFT Tracking', { 
      address: params.nftAddress || params.collectionAddress,
      tokenId: params.tokenId,
      blockchain: params.blockchain
    });

    try {
      // Realizar análisis real usando el servicio de APIs
      const result = await NFTTrackingAPIsService.analyzeNFT({
        nftAddress: params.nftAddress,
        tokenId: params.tokenId,
        collectionAddress: params.collectionAddress,
        blockchain: params.blockchain,
        includePrice: params.includePrice,
        includeRarity: params.includeRarity,
        includeHistory: params.includeHistory,
        includeMarketplace: params.includeMarketplace,
        timeframe: params.timeframe
      });

      const analysisResult: NFTTrackingResult = {
        id: Date.now().toString(),
        type: 'nft-tracking',
        createdAt: new Date().toISOString(),
        data: result,
        score: calculateOverallScore(result),
        nftData: result,
        insights: generateInsights(result),
        recommendations: generateRecommendations(result),
        alerts: generateAlerts(result)
      };

      setAnalysisResult(analysisResult);
      
      // Notificar finalización exitosa
      notifyAnalysisCompleted('NFT Tracking', calculateOverallScore(result));
      
      // Redirigir automáticamente a la página de resultados después de 2 segundos
      setTimeout(() => {
        const queryParams = new URLSearchParams({
          address: params.collectionAddress,
          tokenId: params.tokenId || '',
          blockchain: params.blockchain,
          trackingType: params.trackingType
        });
        router.push(`/dashboard/results/nft-tracking?${queryParams.toString()}`);
      }, 2000);
    } catch (err) {
      const errorMessage = 'Error al analizar el NFT. Por favor, inténtalo de nuevo.';
      setError(errorMessage);
      
      // Notificar error en el análisis
      notifyAnalysisError('NFT Tracking', errorMessage);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return {
    isAnalyzing,
    analysisResult,
    error,
    analyzeNFT
  };
}

// Funciones auxiliares
function calculateOverallScore(data: any): number {
  let score = 50; // Base score
  
  // Factores que aumentan el score
  if (data.collectionInfo?.verified) score += 15;
  if (data.rarityData?.rank <= 100) score += 20;
  if (data.priceData?.priceChange30d > 0) score += 10;
  if (data.collectionInfo?.volume24h > 10) score += 10;
  
  // Factores que disminuyen el score
  if (data.priceData?.priceChange7d < -20) score -= 15;
  if (data.collectionInfo?.floorPrice < 0.01) score -= 10;
  
  return Math.max(0, Math.min(100, score));
}

function calculateRiskLevel(data: any): 'Bajo' | 'Medio' | 'Alto' {
  const score = calculateOverallScore(data);
  if (score >= 70) return 'Bajo';
  if (score >= 40) return 'Medio';
  return 'Alto';
}

function generateInsights(data: any): NFTTrackingResult['insights'] {
  const insights = {
    priceInsights: [],
    rarityInsights: [],
    marketInsights: [],
    investmentInsights: []
  } as NFTTrackingResult['insights'];

  // Price insights
  if (data.priceData?.priceChange24h > 10) {
    insights.priceInsights.push('El precio ha aumentado significativamente en las últimas 24 horas');
  }
  if (data.priceData?.priceChange7d < -15) {
    insights.priceInsights.push('El precio ha experimentado una caída notable en la última semana');
  }

  // Rarity insights
  if (data.rarityData?.rank <= 50) {
    insights.rarityInsights.push('Este NFT está entre los más raros de la colección');
  }
  if (data.rarityData?.score > 80) {
    insights.rarityInsights.push('Puntuación de rareza muy alta, lo que puede aumentar su valor');
  }

  // Market insights
  if (data.collectionInfo?.volume24h > 50) {
    insights.marketInsights.push('La colección tiene un volumen de trading alto');
  }
  if (data.marketplaceData?.listings?.length > 10) {
    insights.marketInsights.push('Hay múltiples listados activos para esta colección');
  }

  // Investment insights
  if (data.collectionInfo?.verified && data.rarityData?.rank <= 100) {
    insights.investmentInsights.push('Combinación favorable: colección verificada y NFT raro');
  }

  return insights;
}

function generateRecommendations(data: any): NFTTrackingResult['recommendations'] {
  const overallScore = calculateOverallScore(data);
  
  return {
    buyRecommendation: {
      score: overallScore >= 70 ? 80 : overallScore >= 50 ? 60 : 30,
      reasons: overallScore >= 70 ? [
        'NFT con alta puntuación de rareza',
        'Colección verificada con buen volumen',
        'Tendencia de precio positiva'
      ] : [
        'Considerar esperar mejores condiciones de mercado',
        'Evaluar más datos históricos'
      ]
    },
    sellRecommendation: {
      score: overallScore <= 30 ? 80 : overallScore <= 50 ? 60 : 20,
      reasons: overallScore <= 30 ? [
        'Tendencia de precio negativa',
        'Bajo volumen de trading',
        'Riesgo alto identificado'
      ] : [
        'Mantener posición actual',
        'Monitorear tendencias del mercado'
      ]
    },
    holdRecommendation: {
      score: overallScore >= 40 && overallScore <= 70 ? 80 : 50,
      reasons: [
        'Posición estable en el mercado',
        'Potencial de crecimiento a largo plazo',
        'Colección con fundamentos sólidos'
      ]
    }
  };
}

function generateAlerts(data: any): NFTTrackingResult['alerts'] {
  const alerts: NFTTrackingResult['alerts'] = [];

  // Price alerts
  if (data.priceData?.priceChange24h > 20) {
    alerts.push({
      type: 'price',
      message: 'Aumento significativo de precio en 24h',
      severity: 'high',
      timestamp: new Date().toISOString()
    });
  }

  // Listing alerts
  if (data.marketplaceData?.listings?.length > 20) {
    alerts.push({
      type: 'listing',
      message: 'Alto número de listados activos',
      severity: 'medium',
      timestamp: new Date().toISOString()
    });
  }

  // Rarity alerts
  if (data.rarityData?.rank <= 10) {
    alerts.push({
      type: 'rarity',
      message: 'NFT extremadamente raro detectado',
      severity: 'high',
      timestamp: new Date().toISOString()
    });
  }

  return alerts;
}