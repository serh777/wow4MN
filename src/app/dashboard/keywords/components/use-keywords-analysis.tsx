'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useKeywordsNotifications } from './use-keywords-notifications';
import { GoogleAPIsService } from '@/services/apis/google-apis';
import { 
  extractDomainFromUrl, 
  extractKeywordsFromDomain, 
  generateDefaultCompetitors,
  generateKeywordAnalysisResults 
} from './real-keywords-helpers';
import type { KeywordAnalysisData, KeywordAnalysisResult, KeywordData } from '../types';

export function useKeywordsAnalysis() {
  const [loading, setLoading] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [currentStep, setCurrentStep] = React.useState('');
  const [results, setResults] = React.useState<KeywordAnalysisResult | null>(null);
  const router = useRouter();
  const { notifyAnalysisStarted, notifyAnalysisCompleted, notifyAnalysisError } = useKeywordsNotifications();

  const handleSubmit = async (data: any) => {
    setLoading(true);
    setResults(null);
    setProgress(0);
    setCurrentStep('Iniciando análisis...');
    
    try {
      notifyAnalysisStarted('Análisis de Keywords');

      // Validar datos de entrada
      if (!data.projectName || data.projectName.trim() === '') {
        throw new Error('El nombre del proyecto es obligatorio');
      }
      
      if (!data.projectUrl || data.projectUrl.trim() === '') {
        throw new Error('La URL del proyecto es obligatoria');
      }

      // Extraer dominio de la URL
      const domain = extractDomainFromUrl(data.projectUrl);
      
      // Paso 1: Obtener datos de Search Console
      setCurrentStep('Obteniendo datos de Google Search Console...');
      setProgress(20);
      const searchConsoleData = await GoogleAPIsService.getSearchConsoleData(
        domain, 
        '2024-01-01', 
        '2024-12-31'
      );

      // Paso 2: Obtener datos de Analytics
      setCurrentStep('Analizando tráfico con Google Analytics...');
      setProgress(40);
      const analyticsData = await GoogleAPIsService.getAnalyticsData(
        domain,
        '2024-01-01',
        '2024-12-31'
      );

      // Paso 3: Análisis de keywords
      setCurrentStep('Analizando keywords principales...');
      setProgress(60);
      const mainKeywords = data.keywords ? data.keywords.split(',').map((k: string) => k.trim()) : 
                          extractKeywordsFromDomain(domain);
      
      const keywordAnalysis = await GoogleAPIsService.getKeywordAnalysis(mainKeywords, domain);

      // Paso 4: Análisis de competencia
      setCurrentStep('Analizando competencia...');
      setProgress(80);
      const competitors = data.competitors ? data.competitors.split(',').map((c: string) => c.trim()) :
                         generateDefaultCompetitors(domain);
      
      const competitorAnalysis = await GoogleAPIsService.getCompetitorAnalysis(domain, competitors);

      // Paso 5: Generar resultados finales
      setCurrentStep('Generando recomendaciones...');
      setProgress(95);
      
      const analysisResults = generateKeywordAnalysisResults(
        data,
        searchConsoleData,
        analyticsData,
        keywordAnalysis,
        competitorAnalysis
      );

      setProgress(100);
      setCurrentStep('Análisis completado');
      setResults(analysisResults);
      
      notifyAnalysisCompleted('Análisis de Keywords completado exitosamente');
      
      // Redirigir a resultados con parámetros
      setTimeout(() => {
        const params = new URLSearchParams({
          domain,
          projectName: data.projectName,
          analysisType: data.analysisType || 'comprehensive'
        });
        router.push(`/dashboard/keywords/analysis-results?${params.toString()}`);
      }, 2000);
      
    } catch (error) {
      console.error('Error en análisis de keywords:', error);
      notifyAnalysisError(error instanceof Error ? error.message : 'Error desconocido');
      setCurrentStep('Error en el análisis');
      setLoading(false);
    }
  };

  return {
    loading,
    progress,
    currentStep,
    results,
    handleSubmit
  };
}

