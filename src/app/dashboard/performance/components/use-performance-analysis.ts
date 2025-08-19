'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAnalysisNotifications } from '@/components/notifications/use-analysis-notifications';
import { PerformanceAPIsService } from '@/services/apis/performance-apis';
import { EtherscanService } from '@/services/apis/etherscan';
import { extractDomainFromUrl } from '@/app/dashboard/keywords/components/real-keywords-helpers';
import { generateWebPerformanceResults, generateContractPerformanceResults } from './real-performance-helpers';
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
    notifyAnalysisStarted('Análisis de Rendimiento');
    
    try {
      if (!data.contractAddress || data.contractAddress.trim() === '') {
        throw new Error('La dirección del contrato es obligatoria');
      }

      // Determinar si es una URL o dirección de contrato
      const isUrl = data.contractAddress.startsWith('http');
      let performanceData;

      if (isUrl) {
        // Análisis de rendimiento web
        const url = data.contractAddress;
        const domain = extractDomainFromUrl(url);
        
        // Obtener datos de rendimiento web
        const [pageSpeedData, webVitalsData, historyData, resourceData] = await Promise.all([
          PerformanceAPIsService.getPageSpeedAnalysis(url, 'mobile'),
          PerformanceAPIsService.getWebVitalsAnalysis(url),
          PerformanceAPIsService.getPerformanceHistory(url, 30),
          PerformanceAPIsService.getResourceAnalysis(url)
        ]);

        // Análisis de competidores si se proporcionan
        let competitorData = null;
        if (data.competitors && data.competitors.trim()) {
          const competitors = data.competitors.split(',').map((c: string) => c.trim());
          competitorData = await PerformanceAPIsService.getCompetitorPerformanceComparison(url, competitors);
        }

        performanceData = generateWebPerformanceResults(
          url,
          pageSpeedData,
          webVitalsData,
          historyData,
          resourceData,
          competitorData
        );
      } else {
        // Análisis de rendimiento de contrato blockchain
        const contractAddress = data.contractAddress;
        
        // Obtener información del contrato desde Etherscan
        const contractInfo = await EtherscanService.getContractInfo(contractAddress);
        const transactionHistory = await EtherscanService.getTransactionHistory(contractAddress, 100);
        
        performanceData = generateContractPerformanceResults(
          contractAddress,
          contractInfo,
          transactionHistory,
          data.blockchain || 'ethereum'
        );
      }

      setResults(performanceData);
      
      // Guardar en sessionStorage para la página de resultados
      sessionStorage.setItem('performanceAnalysisResults', JSON.stringify(performanceData));
      
      notifyAnalysisCompleted('Análisis de Rendimiento');
      
      // Redirigir a resultados después de 3 segundos
      setTimeout(() => {
        const params = new URLSearchParams({
          type: isUrl ? 'web' : 'contract',
          target: isUrl ? extractDomainFromUrl(data.contractAddress) : data.contractAddress,
          blockchain: data.blockchain || 'ethereum'
        });
        router.push(`/dashboard/performance/analysis-results?${params.toString()}`);
      }, 3000);
      
    } catch (error) {
      console.error('Error en análisis de rendimiento:', error);
      notifyAnalysisError('Error en el análisis de rendimiento');
      setResults(null);
    } finally {
      setLoading(false);
    }
  };
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