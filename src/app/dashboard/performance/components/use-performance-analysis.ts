'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAnalysisNotifications } from '@/components/notifications/use-analysis-notifications';
import type { AnalysisResult } from '@/types';

export function usePerformanceAnalysis() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<AnalysisResult | null>(null);
  const router = useRouter();
  const { notifyAnalysisStarted, notifyAnalysisCompleted, notifyAnalysisError } = useAnalysisNotifications();

  const generateHistoricalData = (days: number, min: number, max: number) => {
    const data = [];
    let lastValue = min + Math.random() * (max - min);
    
    for (let i = 0; i < days; i++) {
      const change = lastValue * (Math.random() * 0.3 - 0.15);
      lastValue = Math.max(min, Math.min(max, lastValue + change));
      
      data.push({
        date: new Date(Date.now() - (days - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        value: lastValue
      });
    }
    
    return data;
  };

  const handleSubmit = async (data: any) => {
    setLoading(true);
    notifyAnalysisStarted('Monitoreo de Rendimiento');
    
    try {
      if (!data.contractAddress || data.contractAddress.trim() === '') {
        throw new Error('La dirección del contrato es obligatoria');
      }

      const performanceData = {
        contractAddress: data.contractAddress,
        blockchain: data.blockchain || 'ethereum',
        metrics: {
          gasEfficiency: Math.floor(Math.random() * 30) + 60,
          responseTime: Math.floor(Math.random() * 25) + 65,
          costEfficiency: Math.floor(Math.random() * 20) + 70,
          contractEfficiency: Math.floor(Math.random() * 35) + 55
        },
        historicalData: {
          gasUsage: generateHistoricalData(30, 40000, 120000),
          transactionCount: generateHistoricalData(30, 50, 200),
          confirmationTime: generateHistoricalData(30, 20, 80),
          costPerTransaction: generateHistoricalData(30, 0.003, 0.02)
        },
        issues: [
          {
            type: 'gas',
            severity: 'high',
            description: 'Alto consumo de gas en función transferBatch',
            recommendation: 'Optimizar el bucle en transferBatch para reducir operaciones redundantes'
          },
          {
            type: 'time',
            severity: 'medium',
            description: 'Tiempos de confirmación variables',
            recommendation: 'Considerar ajustes dinámicos de gas según la congestión'
          }
        ],
        optimizations: [
          {
            title: 'Optimización de bucles',
            description: 'Reducir operaciones dentro de bucles',
            impact: 'Alto',
            difficulty: 'Media',
            gasSavings: '30-40%'
          },
          {
            title: 'Batch processing',
            description: 'Agrupar múltiples operaciones',
            impact: 'Alto',
            difficulty: 'Baja',
            gasSavings: '40-60%'
          }
        ],
        networkComparison: {
          gasUsed: {
            project: 85000,
            network: 100000,
            difference: '-15%'
          },
          confirmationTime: {
            project: 45,
            network: 50,
            difference: '-10%'
          }
        }
      };

      const score = Math.floor(
        Object.values(performanceData.metrics).reduce((a, b) => a + b, 0) / 
        Object.values(performanceData.metrics).length
      );

      const analysisResults = {
        type: 'performance',
        data: performanceData,
        score
      };

      setResults(analysisResults);
      
      // Save comprehensive results to sessionStorage
      const detailedResults = {
        ...performanceData,
        score,
        timestamp: new Date().toISOString()
      };
      sessionStorage.setItem('performanceAnalysisResults', JSON.stringify(detailedResults));
      
      notifyAnalysisCompleted('Monitoreo de Rendimiento', score);
      
      // Redirect to results page after 3 seconds
      setTimeout(() => {
        router.push('/dashboard/performance/analysis-results');
      }, 3000);
    } catch (error) {
      console.error('Error en análisis de rendimiento:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      notifyAnalysisError('Monitoreo de Rendimiento', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    results,
    handleSubmit
  };
}