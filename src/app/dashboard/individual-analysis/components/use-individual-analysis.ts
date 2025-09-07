'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAnalysisNotifications } from '@/components/notifications/use-analysis-notifications';

interface IndividualAnalysisParams {
  url: string;
  analysisType: string;
  includePerformance: boolean;
  includeSecurity: boolean;
  includeSEO: boolean;
  includeAccessibility: boolean;
  includeUsability: boolean;
  selectedTools: string[];
  customParameters: string;
  reportFormat: string;
}

export function useIndividualAnalysis() {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);
  const [analysisType, setAnalysisType] = useState('');
  const [specialResults, setSpecialResults] = useState<any>(null);
  const [indexerResults, setIndexerResults] = useState<any>(null);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [indexerProgress, setIndexerProgress] = useState(0);
  const [currentAnalysisStep, setCurrentAnalysisStep] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [toolResults, setToolResults] = useState<Record<string, any>>({});
  
  const router = useRouter();
  const { notifyAnalysisStarted, notifyAnalysisCompleted, notifyAnalysisError } = useAnalysisNotifications();

  const handleSubmit = async (params: IndividualAnalysisParams) => {
    setLoading(true);
    setError(null);
    setAnalysisType(params.analysisType);
    setCurrentAnalysisStep('Iniciando análisis personalizado...');
    setAnalysisProgress(0);

    const analysisId = notifyAnalysisStarted('individual-analysis', {
      url: params.url,
      analysisType: params.analysisType,
      selectedTools: params.selectedTools
    });
    setToolResults({});

    try {
      const totalSteps = params.selectedTools.length + 2; // +2 para inicio y finalización
      let currentStep = 0;

      // Paso inicial
      setCurrentAnalysisStep('Preparando herramientas de análisis...');
      setAnalysisProgress((++currentStep / totalSteps) * 100);
      await new Promise(resolve => setTimeout(resolve, 1000));

      const results: Record<string, any> = {};

      // Ejecutar cada herramienta seleccionada
      for (const tool of params.selectedTools) {
        setCurrentAnalysisStep(`Ejecutando ${tool}...`);
        setAnalysisProgress((++currentStep / totalSteps) * 100);
        
        // Simular análisis de cada herramienta
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Generar resultados simulados para cada herramienta
        switch (tool) {
          case 'lighthouse':
            results[tool] = {
              performance: Math.floor(Math.random() * 30) + 70,
              accessibility: Math.floor(Math.random() * 20) + 80,
              bestPractices: Math.floor(Math.random() * 25) + 75,
              seo: Math.floor(Math.random() * 20) + 80,
              metrics: {
                fcp: Math.random() * 2 + 1,
                lcp: Math.random() * 3 + 2,
                cls: Math.random() * 0.1,
                fid: Math.random() * 50 + 50
              }
            };
            break;
          case 'pagespeed':
            results[tool] = {
              mobile: {
                score: Math.floor(Math.random() * 30) + 60,
                fcp: Math.random() * 3 + 2,
                lcp: Math.random() * 4 + 3
              },
              desktop: {
                score: Math.floor(Math.random() * 20) + 80,
                fcp: Math.random() * 2 + 1,
                lcp: Math.random() * 3 + 2
              }
            };
            break;
          case 'gtmetrix':
            results[tool] = {
              grade: ['A', 'B', 'C'][Math.floor(Math.random() * 3)],
              performance: Math.floor(Math.random() * 30) + 70,
              structure: Math.floor(Math.random() * 25) + 75,
              loadTime: Math.random() * 3 + 2,
              pageSize: Math.floor(Math.random() * 2000) + 1000
            };
            break;
          case 'webpagetest':
            results[tool] = {
              firstView: {
                loadTime: Math.random() * 4 + 3,
                firstByte: Math.random() * 1 + 0.5,
                startRender: Math.random() * 2 + 1
              },
              repeatView: {
                loadTime: Math.random() * 2 + 1,
                firstByte: Math.random() * 0.5 + 0.3,
                startRender: Math.random() * 1 + 0.5
              }
            };
            break;
          case 'securityheaders':
            results[tool] = {
              grade: ['A', 'B', 'C', 'D'][Math.floor(Math.random() * 4)],
              score: Math.floor(Math.random() * 40) + 60,
              headers: {
                hsts: Math.random() > 0.5,
                csp: Math.random() > 0.3,
                xframe: Math.random() > 0.7,
                xcontent: Math.random() > 0.8
              }
            };
            break;
          case 'ssllabs':
            results[tool] = {
              grade: ['A+', 'A', 'B', 'C'][Math.floor(Math.random() * 4)],
              score: Math.floor(Math.random() * 30) + 70,
              protocol: 'TLS 1.3',
              cipher: 'ECDHE-RSA-AES256-GCM-SHA384'
            };
            break;
          default:
            results[tool] = {
              status: 'completed',
              score: Math.floor(Math.random() * 40) + 60
            };
        }
        
        setToolResults(prev => ({ ...prev, [tool]: results[tool] }));
      }

      // Paso final
      setCurrentAnalysisStep('Generando reporte final...');
      setAnalysisProgress(100);
      await new Promise(resolve => setTimeout(resolve, 1000));

      const mockResults = {
        url: params.url,
        analysisType: params.analysisType,
        reportFormat: params.reportFormat,
        timestamp: new Date().toISOString(),
        toolResults: results,
        selectedTools: params.selectedTools,
        customParameters: params.customParameters,
        overallScore: Math.floor(Object.values(results).reduce((acc: number, result: any) => {
          const score = result.score || result.performance || result.mobile?.score || 75;
          return acc + score;
        }, 0) / params.selectedTools.length),
        summary: {
          totalTests: params.selectedTools.length,
          passedTests: Math.floor(params.selectedTools.length * 0.8),
          warnings: Math.floor(params.selectedTools.length * 0.3),
          errors: Math.floor(params.selectedTools.length * 0.1)
        },
        recommendations: [
          'Optimizar imágenes para mejorar el tiempo de carga',
          'Implementar caché del navegador',
          'Minificar CSS y JavaScript',
          'Configurar compresión GZIP'
        ]
      };

      setResponse(mockResults);
      setSpecialResults(mockResults);
      
      notifyAnalysisCompleted('individual-analysis', undefined, {
         url: params.url,
         analysisType: params.analysisType,
         selectedTools: params.selectedTools
       });

      // Redirigir a resultados
      const searchParams = new URLSearchParams({
        type: params.analysisType,
        url: params.url,
        tools: params.selectedTools.join(',')
      });
      
      router.push(`/dashboard/results/individual-analysis?${searchParams.toString()}`);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      
      notifyAnalysisError('individual-analysis', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const resetAnalysis = () => {
    setLoading(false);
    setResponse(null);
    setAnalysisType('');
    setSpecialResults(null);
    setIndexerResults(null);
    setAnalysisProgress(0);
    setIndexerProgress(0);
    setCurrentAnalysisStep('');
    setError(null);
    setToolResults({});
  };

  return {
    loading,
    response,
    analysisType,
    specialResults,
    indexerResults,
    analysisProgress,
    indexerProgress,
    currentAnalysisStep,
    error,
    toolResults,
    handleSubmit,
    resetAnalysis
  };
}