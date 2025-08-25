'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useAnalysisNotifications } from '@/components/notifications/use-analysis-notifications';
import type { HistoricalData } from '../types';

// Función auxiliar para generar datos de series temporales
function generateTimeSeriesData(days: number, min: number, max: number) {
  const data = [];
  const today = new Date();
  
  for (let i = days; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    data.push({
      date: date.toISOString().split('T')[0],
      value: Math.floor(Math.random() * (max - min + 1)) + min
    });
  }
  
  return data;
}

export function useHistoricalAnalysis() {
  const [loading, setLoading] = React.useState(false);
  const [results, setResults] = React.useState<{ type: string; data: HistoricalData; score: number } | null>(null);
  const { notifyAnalysisStarted, notifyAnalysisCompleted, notifyAnalysisError } = useAnalysisNotifications();
  const router = useRouter();
  
  const handleSubmit = async (data: any) => {
    setLoading(true);
    notifyAnalysisStarted('Análisis Histórico');
    
    try {
      // Validar datos de entrada
      if (!data.projectName || data.projectName.trim() === '') {
        throw new Error('El nombre del proyecto es obligatorio');
      }
      
      if (!data.projectUrl || data.projectUrl.trim() === '') {
        throw new Error('La URL del proyecto es obligatoria');
      }
      
      // Generar datos simulados de análisis histórico
      const historicalData: HistoricalData = {
        projectName: data.projectName,
        url: data.projectUrl,
        score: Math.floor(Math.random() * 30) + 60,
        metrics: {
          seo: generateTimeSeriesData(30, 50, 100),
          performance: generateTimeSeriesData(30, 40, 90),
          accessibility: generateTimeSeriesData(30, 60, 95),
          bestPractices: generateTimeSeriesData(30, 55, 85)
        },
        trends: [
          {
            metric: 'SEO',
            trend: 'up',
            change: '+15%',
            description: 'Mejora constante en optimización'
          },
          {
            metric: 'Performance',
            trend: 'neutral',
            change: '0%',
            description: 'Rendimiento estable'
          },
          {
            metric: 'Accessibility',
            trend: 'up',
            change: '+8%',
            description: 'Mejoras en accesibilidad'
          },
          {
            metric: 'Best Practices',
            trend: 'down',
            change: '-3%',
            description: 'Ligero descenso en prácticas recomendadas'
          }
        ],
        recommendations: [
          'Optimizar metadatos para mejor visibilidad',
          'Mejorar tiempos de carga en mobile',
          'Implementar más características de accesibilidad',
          'Actualizar contenido regularmente'
        ]
      };
      
      // Crear resultados detallados para sessionStorage
      const detailedResults = {
        overallScore: historicalData.score,
        analysisType: 'historical',
        url: data.projectUrl,
        riskLevel: historicalData.score > 80 ? 'low' : historicalData.score > 60 ? 'medium' : 'high',
        indexerStatus: 'active',
        historicalMetrics: {
          totalDataPoints: historicalData.metrics.seo.length,
          timeRange: '30 days',
          averagePerformance: Math.floor(Math.random() * 30) + 70,
          volatilityIndex: Math.floor(Math.random() * 50) + 25,
          trendDirection: 'up',
          seasonalPatterns: ['Q4 Peak', 'Summer Dip', 'Holiday Surge']
        },
        performanceAnalysis: {
          bestPeriod: 'Q3 2023',
          worstPeriod: 'Q1 2023',
          consistencyScore: Math.floor(Math.random() * 30) + 70,
          growthRate: Math.floor(Math.random() * 20) + 5,
          correlationFactors: ['Market Trends', 'Seasonal Demand', 'Economic Indicators']
        },
        timeSeriesData: [
          { period: 'Jan 2023', value: 85, trend: 'up', significance: 0.8 },
          { period: 'Feb 2023', value: 78, trend: 'down', significance: 0.6 },
          { period: 'Mar 2023', value: 92, trend: 'up', significance: 0.9 },
          { period: 'Apr 2023', value: 88, trend: 'stable', significance: 0.7 }
        ],
        forecasting: {
          nextPeriodPrediction: Math.floor(Math.random() * 20) + 80,
          confidenceLevel: Math.floor(Math.random() * 20) + 75,
          forecastRange: 'Next 6 months',
          keyFactors: ['Historical Trends', 'Market Conditions', 'Seasonal Patterns']
        },
        opportunities: historicalData.recommendations,
        diagnostics: {
          dataQuality: Math.floor(Math.random() * 20) + 80,
          completeness: Math.floor(Math.random() * 15) + 85,
          accuracy: Math.floor(Math.random() * 25) + 75,
          reliability: Math.floor(Math.random() * 20) + 80
        }
      };

      // Guardar en sessionStorage
      sessionStorage.setItem('historicalAnalysisResults', JSON.stringify(detailedResults));

      setResults({
        type: 'historical',
        data: historicalData,
        score: historicalData.score
      });

      notifyAnalysisCompleted('Análisis Histórico', historicalData.score);
      
      // Redireccionar después de 2 segundos
      setTimeout(() => {
        router.push(`/dashboard/results/historical?url=${encodeURIComponent(data.projectUrl)}&type=historical`);
      }, 2000);
    } catch (error) {
      console.error('Error en análisis histórico:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      notifyAnalysisError('Análisis Histórico', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { loading, results, handleSubmit };
}