'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAnalysisNotifications } from '@/components/notifications/use-analysis-notifications';

interface MetadataAnalysisParams {
  url: string;
  analysisType: string;
  includeOpenGraph: boolean;
  includeTwitterCards: boolean;
  includeStructuredData: boolean;
  includeMetaTags: boolean;
  selectedIndexer: string;
}

export function useMetadataAnalysis() {
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

  const handleSubmit = async (params: MetadataAnalysisParams) => {
    setLoading(true);
    setError(null);
    setAnalysisType(params.analysisType);
    setCurrentAnalysisStep('Iniciando análisis de metadatos...');
    setAnalysisProgress(0);

    const analysisId = notifyAnalysisStarted('metadata', {
      url: params.url,
      analysisType: params.analysisType
    });

    try {
      // Simular progreso del análisis
      const steps = [
        'Extrayendo metadatos básicos...',
        'Analizando Open Graph...',
        'Verificando Twitter Cards...',
        'Procesando datos estructurados...',
        'Validando meta tags...',
        'Generando reporte...'
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
        timestamp: new Date().toISOString(),
        metaTags: {
          title: 'Título de la página',
          description: 'Descripción meta de la página',
          keywords: 'palabra1, palabra2, palabra3',
          robots: 'index, follow'
        },
        openGraph: params.includeOpenGraph ? {
          title: 'Título Open Graph',
          description: 'Descripción Open Graph',
          image: 'https://ejemplo.com/imagen.jpg',
          type: 'website'
        } : null,
        twitterCards: params.includeTwitterCards ? {
          card: 'summary_large_image',
          title: 'Título Twitter',
          description: 'Descripción Twitter',
          image: 'https://ejemplo.com/imagen.jpg'
        } : null,
        structuredData: params.includeStructuredData ? {
          schemas: ['Organization', 'WebSite', 'BreadcrumbList'],
          valid: true,
          errors: []
        } : null,
        score: Math.floor(Math.random() * 40) + 60,
        recommendations: [
          'Optimizar la longitud del título',
          'Añadir más palabras clave relevantes',
          'Mejorar la descripción meta'
        ]
      };

      setResponse(mockResults);
      setSpecialResults(mockResults);
      
      notifyAnalysisCompleted('metadata', undefined, {
        url: params.url,
        analysisType: params.analysisType
      });

      // Redirigir a resultados
      const searchParams = new URLSearchParams({
        type: params.analysisType,
        url: params.url
      });
      
      router.push(`/dashboard/results/metadata?${searchParams.toString()}`);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      
      notifyAnalysisError('metadata', errorMessage);
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