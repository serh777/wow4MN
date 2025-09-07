'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAnalysisNotifications } from '@/components/notifications/use-analysis-notifications';

interface ContentAnalysisParams {
  url: string;
  analysisType: string;
  contentType: string;
  targetAudience: string;
  includeReadability: boolean;
  includeSEO: boolean;
  includeEngagement: boolean;
  selectedIndexer: string;
  keywords: string;
}

export function useContentAnalysis() {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);
  const [analysisType, setAnalysisType] = useState('');
  const [specialResults, setSpecialResults] = useState<any>(null);
  const [indexerResults, setIndexerResults] = useState<any>(null);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [indexerProgress, setIndexerProgress] = useState(0);
  const [currentAnalysisStep, setCurrentAnalysisStep] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  const router = useRouter();
  const { notifyAnalysisStarted, notifyAnalysisCompleted, notifyAnalysisError } = useAnalysisNotifications();

  const handleSubmit = async (params: ContentAnalysisParams) => {
    setLoading(true);
    setError(null);
    setAnalysisType(params.analysisType);
    setCurrentAnalysisStep('Iniciando análisis de contenido...');
    setAnalysisProgress(0);

    const analysisId = notifyAnalysisStarted('content', {
      url: params.url,
      analysisType: params.analysisType
    });

    try {
      // Simular progreso del análisis
      const steps = [
        'Extrayendo contenido...',
        'Analizando legibilidad...',
        'Evaluando SEO...',
        'Midiendo engagement...',
        'Procesando métricas...',
        'Generando recomendaciones...'
      ];

      for (let i = 0; i < steps.length; i++) {
        setCurrentAnalysisStep(steps[i]);
        setAnalysisProgress(((i + 1) / steps.length) * 100);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      // Generar resultados simulados
      const mockResults = {
        url: params.url,
        analysisType: params.analysisType,
        contentType: params.contentType,
        targetAudience: params.targetAudience,
        timestamp: new Date().toISOString(),
        readability: params.includeReadability ? {
          fleschScore: Math.floor(Math.random() * 40) + 40,
          gradeLevel: Math.floor(Math.random() * 8) + 6,
          avgWordsPerSentence: Math.floor(Math.random() * 10) + 15,
          avgSyllablesPerWord: Math.random() * 0.5 + 1.3,
          readingTime: Math.floor(Math.random() * 5) + 2
        } : null,
        seo: params.includeSEO ? {
          titleLength: Math.floor(Math.random() * 20) + 40,
          metaDescriptionLength: Math.floor(Math.random() * 50) + 120,
          headingStructure: {
            h1: Math.floor(Math.random() * 2) + 1,
            h2: Math.floor(Math.random() * 5) + 2,
            h3: Math.floor(Math.random() * 8) + 3
          },
          keywordDensity: Math.random() * 2 + 1,
          internalLinks: Math.floor(Math.random() * 10) + 5,
          externalLinks: Math.floor(Math.random() * 5) + 2
        } : null,
        engagement: params.includeEngagement ? {
          imageCount: Math.floor(Math.random() * 8) + 2,
          videoCount: Math.floor(Math.random() * 3),
          interactiveElements: Math.floor(Math.random() * 5) + 1,
          socialSharing: true,
          callToActions: Math.floor(Math.random() * 3) + 1
        } : null,
        overallScore: Math.floor(Math.random() * 30) + 70,
        recommendations: [
          'Mejorar la estructura de encabezados',
          'Reducir la longitud de las oraciones',
          'Añadir más elementos visuales',
          'Optimizar la densidad de palabras clave'
        ],
        keywords: params.keywords ? params.keywords.split(',').map(k => k.trim()) : []
      };

      setResponse(mockResults);
      setSpecialResults(mockResults);
      
      notifyAnalysisCompleted('content', undefined, {
        url: params.url,
        analysisType: params.analysisType
      });

      // Redirigir a resultados
      const searchParams = new URLSearchParams({
        type: params.analysisType,
        url: params.url
      });
      
      router.push(`/dashboard/results/content?${searchParams.toString()}`);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      
      notifyAnalysisError('content', errorMessage);
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
    handleSubmit,
    resetAnalysis
  };
}