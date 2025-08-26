// Historical Analysis APIs Service
import { AnthropicService } from './anthropic';
import { EtherscanService } from './etherscan';
import { AlchemyService } from './alchemy';

export interface HistoricalAnalysisOptions {
  timeRange?: '7d' | '30d' | '90d' | '1y' | 'all';
  includeTrafficData?: boolean;
  includeRankingHistory?: boolean;
  includeBlockchainData?: boolean;
  includePerformanceMetrics?: boolean;
  granularity?: 'daily' | 'weekly' | 'monthly';
}

export interface TimeSeriesData {
  date: string;
  value: number;
  change?: number;
  changePercent?: number;
}

export interface HistoricalMetric {
  name: string;
  current: number;
  previous: number;
  change: number;
  changePercent: number;
  trend: 'up' | 'down' | 'stable';
  data: TimeSeriesData[];
}

export interface HistoricalAnalysisResult {
  domain: string;
  analysisDate: string;
  timeRange: string;
  trafficMetrics: {
    organicTraffic: HistoricalMetric;
    paidTraffic: HistoricalMetric;
    directTraffic: HistoricalMetric;
    referralTraffic: HistoricalMetric;
    socialTraffic: HistoricalMetric;
  };
  rankingMetrics: {
    organicKeywords: HistoricalMetric;
    averagePosition: HistoricalMetric;
    topKeywords: HistoricalMetric;
    visibilityScore: HistoricalMetric;
  };
  performanceMetrics: {
    pageSpeed: HistoricalMetric;
    coreWebVitals: HistoricalMetric;
    uptimePercentage: HistoricalMetric;
    errorRate: HistoricalMetric;
  };
  blockchainMetrics?: {
    transactionVolume: HistoricalMetric;
    activeAddresses: HistoricalMetric;
    gasUsage: HistoricalMetric;
    contractInteractions: HistoricalMetric;
  };
  insights: Array<{
    type: 'positive' | 'negative' | 'neutral';
    category: 'traffic' | 'ranking' | 'performance' | 'blockchain';
    title: string;
    description: string;
    impact: 'high' | 'medium' | 'low';
    timeframe: string;
  }>;
  trends: Array<{
    metric: string;
    direction: 'increasing' | 'decreasing' | 'stable' | 'volatile';
    strength: 'strong' | 'moderate' | 'weak';
    duration: string;
    prediction: string;
  }>;
  recommendations: string[];
  score: number;
}

export class HistoricalAPIsService {
  private static anthropicService = new AnthropicService();
  private static etherscanService = new EtherscanService();
  private static alchemyService = new AlchemyService();

  // Método de instancia para compatibilidad con orchestrator
  async analyzeHistorical(domain: string, options: any = {}): Promise<any> {
    return HistoricalAPIsService.analyzeHistoricalData(domain, options);
  }

  static async analyzeHistoricalData(
    domain: string, 
    options: HistoricalAnalysisOptions = {}
  ): Promise<HistoricalAnalysisResult> {
    try {
      // Simular análisis histórico
      await this.delay(1800 + Math.random() * 2200);

      const timeRange = options.timeRange || '30d';
      const dataPoints = this.getDataPointsForRange(timeRange);
      
      const trafficMetrics = this.generateTrafficMetrics(dataPoints);
      const rankingMetrics = this.generateRankingMetrics(dataPoints);
      const performanceMetrics = this.generatePerformanceMetrics(dataPoints);
      const blockchainMetrics = options.includeBlockchainData 
        ? this.generateBlockchainMetrics(dataPoints) 
        : undefined;
      
      const insights = this.generateInsights(trafficMetrics, rankingMetrics, performanceMetrics, blockchainMetrics);
      const trends = this.analyzeTrends(trafficMetrics, rankingMetrics, performanceMetrics, blockchainMetrics);
      const recommendations = this.generateHistoricalRecommendations(insights, trends);
      const score = this.calculateHistoricalScore(trafficMetrics, rankingMetrics, performanceMetrics);

      return {
        domain,
        analysisDate: new Date().toISOString(),
        timeRange,
        trafficMetrics,
        rankingMetrics,
        performanceMetrics,
        blockchainMetrics,
        insights,
        trends,
        recommendations,
        score
      };
    } catch (error) {
      console.error('Error en análisis histórico:', error);
      throw new Error(`Error analizando datos históricos: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  private static getDataPointsForRange(timeRange: string): number {
    switch (timeRange) {
      case '7d': return 7;
      case '30d': return 30;
      case '90d': return 90;
      case '1y': return 365;
      case 'all': return 730; // 2 años
      default: return 30;
    }
  }

  private static generateTimeSeriesData(dataPoints: number, baseValue: number, volatility: number = 0.1): TimeSeriesData[] {
    const data: TimeSeriesData[] = [];
    let currentValue = baseValue;
    
    for (let i = dataPoints - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      // Simular variación natural
      const change = (Math.random() - 0.5) * 2 * volatility * baseValue;
      currentValue = Math.max(0, currentValue + change);
      
      const previousValue = i === dataPoints - 1 ? currentValue : data[data.length - 1]?.value || currentValue;
      const changeValue = currentValue - previousValue;
      const changePercent = previousValue !== 0 ? (changeValue / previousValue) * 100 : 0;
      
      data.push({
        date: date.toISOString().split('T')[0],
        value: Math.floor(currentValue),
        change: Math.floor(changeValue),
        changePercent: Math.floor(changePercent * 100) / 100
      });
    }
    
    return data;
  }

  private static createHistoricalMetric(name: string, baseValue: number, dataPoints: number, volatility: number = 0.1): HistoricalMetric {
    const data = this.generateTimeSeriesData(dataPoints, baseValue, volatility);
    const current = data[data.length - 1]?.value || baseValue;
    const previous = data[data.length - 2]?.value || baseValue;
    const change = current - previous;
    const changePercent = previous !== 0 ? (change / previous) * 100 : 0;
    
    let trend: 'up' | 'down' | 'stable' = 'stable';
    if (Math.abs(changePercent) > 5) {
      trend = changePercent > 0 ? 'up' : 'down';
    }
    
    return {
      name,
      current,
      previous,
      change,
      changePercent: Math.floor(changePercent * 100) / 100,
      trend,
      data
    };
  }

  private static generateTrafficMetrics(dataPoints: number) {
    return {
      organicTraffic: this.createHistoricalMetric('Tráfico Orgánico', 15000, dataPoints, 0.15),
      paidTraffic: this.createHistoricalMetric('Tráfico Pagado', 5000, dataPoints, 0.25),
      directTraffic: this.createHistoricalMetric('Tráfico Directo', 8000, dataPoints, 0.1),
      referralTraffic: this.createHistoricalMetric('Tráfico de Referencias', 3000, dataPoints, 0.2),
      socialTraffic: this.createHistoricalMetric('Tráfico Social', 2000, dataPoints, 0.3)
    };
  }

  private static generateRankingMetrics(dataPoints: number) {
    return {
      organicKeywords: this.createHistoricalMetric('Keywords Orgánicas', 1200, dataPoints, 0.08),
      averagePosition: this.createHistoricalMetric('Posición Promedio', 15, dataPoints, 0.12),
      topKeywords: this.createHistoricalMetric('Keywords Top 10', 85, dataPoints, 0.15),
      visibilityScore: this.createHistoricalMetric('Puntuación de Visibilidad', 75, dataPoints, 0.1)
    };
  }

  private static generatePerformanceMetrics(dataPoints: number) {
    return {
      pageSpeed: this.createHistoricalMetric('Velocidad de Página', 85, dataPoints, 0.05),
      coreWebVitals: this.createHistoricalMetric('Core Web Vitals', 78, dataPoints, 0.08),
      uptimePercentage: this.createHistoricalMetric('Tiempo de Actividad', 99.5, dataPoints, 0.01),
      errorRate: this.createHistoricalMetric('Tasa de Errores', 0.5, dataPoints, 0.3)
    };
  }

  private static generateBlockchainMetrics(dataPoints: number) {
    return {
      transactionVolume: this.createHistoricalMetric('Volumen de Transacciones', 50000, dataPoints, 0.2),
      activeAddresses: this.createHistoricalMetric('Direcciones Activas', 2500, dataPoints, 0.15),
      gasUsage: this.createHistoricalMetric('Uso de Gas', 150000, dataPoints, 0.25),
      contractInteractions: this.createHistoricalMetric('Interacciones de Contrato', 1200, dataPoints, 0.18)
    };
  }

  private static generateInsights(
    trafficMetrics: any,
    rankingMetrics: any,
    performanceMetrics: any,
    blockchainMetrics?: any
  ) {
    const insights = [];
    
    // Insights de tráfico
    if (trafficMetrics.organicTraffic.changePercent > 10) {
      insights.push({
        type: 'positive' as const,
        category: 'traffic' as const,
        title: 'Crecimiento significativo en tráfico orgánico',
        description: `El tráfico orgánico ha aumentado un ${trafficMetrics.organicTraffic.changePercent}% en el período analizado`,
        impact: 'high' as const,
        timeframe: 'Últimos 30 días'
      });
    } else if (trafficMetrics.organicTraffic.changePercent < -10) {
      insights.push({
        type: 'negative' as const,
        category: 'traffic' as const,
        title: 'Declive en tráfico orgánico',
        description: `El tráfico orgánico ha disminuido un ${Math.abs(trafficMetrics.organicTraffic.changePercent)}% en el período analizado`,
        impact: 'high' as const,
        timeframe: 'Últimos 30 días'
      });
    }
    
    // Insights de ranking
    if (rankingMetrics.organicKeywords.changePercent > 5) {
      insights.push({
        type: 'positive' as const,
        category: 'ranking' as const,
        title: 'Expansión del perfil de keywords',
        description: `Se han ganado ${rankingMetrics.organicKeywords.change} nuevas keywords orgánicas`,
        impact: 'medium' as const,
        timeframe: 'Período analizado'
      });
    }
    
    if (rankingMetrics.averagePosition.changePercent < -5) {
      insights.push({
        type: 'positive' as const,
        category: 'ranking' as const,
        title: 'Mejora en posiciones promedio',
        description: 'Las posiciones promedio han mejorado significativamente',
        impact: 'medium' as const,
        timeframe: 'Período analizado'
      });
    }
    
    // Insights de rendimiento
    if (performanceMetrics.pageSpeed.changePercent > 5) {
      insights.push({
        type: 'positive' as const,
        category: 'performance' as const,
        title: 'Mejora en velocidad de página',
        description: `La velocidad de página ha mejorado un ${performanceMetrics.pageSpeed.changePercent}%`,
        impact: 'medium' as const,
        timeframe: 'Período analizado'
      });
    }
    
    if (performanceMetrics.errorRate.changePercent > 20) {
      insights.push({
        type: 'negative' as const,
        category: 'performance' as const,
        title: 'Aumento en tasa de errores',
        description: 'Se ha detectado un incremento significativo en la tasa de errores',
        impact: 'high' as const,
        timeframe: 'Período reciente'
      });
    }
    
    // Insights de blockchain (si están disponibles)
    if (blockchainMetrics) {
      if (blockchainMetrics.transactionVolume.changePercent > 15) {
        insights.push({
          type: 'positive' as const,
          category: 'blockchain' as const,
          title: 'Incremento en actividad blockchain',
          description: `El volumen de transacciones ha aumentado un ${blockchainMetrics.transactionVolume.changePercent}%`,
          impact: 'high' as const,
          timeframe: 'Período analizado'
        });
      }
    }
    
    return insights;
  }

  private static analyzeTrends(
    trafficMetrics: any,
    rankingMetrics: any,
    performanceMetrics: any,
    blockchainMetrics?: any
  ) {
    const trends = [];
    
    // Analizar tendencias de tráfico
    const organicTrend = this.calculateTrendDirection(trafficMetrics.organicTraffic.data);
    trends.push({
      metric: 'Tráfico Orgánico',
      direction: organicTrend.direction,
      strength: organicTrend.strength,
      duration: 'Últimos 30 días',
      prediction: organicTrend.direction === 'increasing' 
        ? 'Continuará creciendo si se mantienen las estrategias actuales'
        : 'Requiere optimización para revertir la tendencia'
    });
    
    // Analizar tendencias de keywords
    const keywordTrend = this.calculateTrendDirection(rankingMetrics.organicKeywords.data);
    trends.push({
      metric: 'Keywords Orgánicas',
      direction: keywordTrend.direction,
      strength: keywordTrend.strength,
      duration: 'Período analizado',
      prediction: keywordTrend.direction === 'increasing'
        ? 'Expansión continua del perfil de keywords'
        : 'Necesario revisar estrategia de contenido'
    });
    
    // Analizar tendencias de rendimiento
    const performanceTrend = this.calculateTrendDirection(performanceMetrics.pageSpeed.data);
    trends.push({
      metric: 'Rendimiento del Sitio',
      direction: performanceTrend.direction,
      strength: performanceTrend.strength,
      duration: 'Período analizado',
      prediction: performanceTrend.direction === 'decreasing'
        ? 'Requiere optimización técnica urgente'
        : 'Mantener las mejores prácticas actuales'
    });
    
    return trends;
  }

  private static calculateTrendDirection(data: TimeSeriesData[]) {
    if (data.length < 3) {
      return { direction: 'stable' as const, strength: 'weak' as const };
    }
    
    const recentData = data.slice(-7); // Últimos 7 puntos
    const changes = recentData.map(d => d.changePercent || 0);
    const avgChange = changes.reduce((sum, change) => sum + change, 0) / changes.length;
    
    let direction: 'increasing' | 'decreasing' | 'stable' | 'volatile';
    let strength: 'strong' | 'moderate' | 'weak';
    
    const volatility = this.calculateVolatility(changes);
    
    if (volatility > 15) {
      direction = 'volatile';
      strength = 'strong';
    } else if (Math.abs(avgChange) < 2) {
      direction = 'stable';
      strength = 'weak';
    } else {
      direction = avgChange > 0 ? 'increasing' : 'decreasing';
      strength = Math.abs(avgChange) > 5 ? 'strong' : Math.abs(avgChange) > 2 ? 'moderate' : 'weak';
    }
    
    return { direction, strength };
  }

  private static calculateVolatility(changes: number[]): number {
    const mean = changes.reduce((sum, change) => sum + change, 0) / changes.length;
    const variance = changes.reduce((sum, change) => sum + Math.pow(change - mean, 2), 0) / changes.length;
    return Math.sqrt(variance);
  }

  private static generateHistoricalRecommendations(insights: any[], trends: any[]): string[] {
    const recommendations = [];
    
    // Recomendaciones basadas en insights negativos
    const negativeInsights = insights.filter(insight => insight.type === 'negative');
    if (negativeInsights.length > 0) {
      recommendations.push('Abordar inmediatamente los problemas identificados en el análisis');
    }
    
    // Recomendaciones basadas en tendencias
    const decreasingTrends = trends.filter(trend => trend.direction === 'decreasing');
    if (decreasingTrends.length > 0) {
      recommendations.push('Revisar y ajustar estrategias para revertir tendencias negativas');
    }
    
    const volatileTrends = trends.filter(trend => trend.direction === 'volatile');
    if (volatileTrends.length > 0) {
      recommendations.push('Implementar estrategias para estabilizar métricas volátiles');
    }
    
    // Recomendaciones generales
    recommendations.push(
      'Continuar monitoreando métricas clave regularmente',
      'Establecer alertas para cambios significativos',
      'Documentar y analizar factores que influyen en las tendencias',
      'Implementar pruebas A/B para optimizar rendimiento',
      'Crear informes periódicos para stakeholders',
      'Comparar rendimiento con competidores del sector'
    );
    
    return recommendations.slice(0, 8);
  }

  private static calculateHistoricalScore(
    trafficMetrics: any,
    rankingMetrics: any,
    performanceMetrics: any
  ): number {
    let score = 0;
    
    // Puntuación basada en tendencias de tráfico
    const trafficTrend = trafficMetrics.organicTraffic.changePercent;
    if (trafficTrend > 10) score += 25;
    else if (trafficTrend > 0) score += 15;
    else if (trafficTrend > -10) score += 5;
    
    // Puntuación basada en keywords
    const keywordTrend = rankingMetrics.organicKeywords.changePercent;
    if (keywordTrend > 5) score += 20;
    else if (keywordTrend > 0) score += 10;
    
    // Puntuación basada en rendimiento
    const performanceTrend = performanceMetrics.pageSpeed.changePercent;
    if (performanceTrend > 5) score += 20;
    else if (performanceTrend > 0) score += 10;
    
    // Puntuación base
    score += 35;
    
    return Math.max(Math.min(Math.floor(score), 100), 0);
  }

  private static delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export default HistoricalAPIsService;