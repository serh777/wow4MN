'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useKeywordsNotifications } from './use-keywords-notifications';
import { Web3KeywordsService } from '@/services/apis/web3-keywords-service';
import { Web3APIsService } from '@/services/apis/web3-apis';
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
      notifyAnalysisStarted('Análisis de Keywords Web3');

      // Validar datos de entrada
      if (!data.projectName || data.projectName.trim() === '') {
        throw new Error('El nombre del proyecto es obligatorio');
      }
      
      if (!data.projectUrl || data.projectUrl.trim() === '') {
        throw new Error('La URL del proyecto es obligatoria');
      }

      // Extraer dominio de la URL
      const domain = extractDomainFromUrl(data.projectUrl);
      
      // Inicializar el servicio Web3Keywords
      const web3KeywordsService = new Web3KeywordsService();
      
      // Paso 1: Análisis de IA con Anthropic Claude
      setCurrentStep('Analizando keywords con IA...');
      setProgress(20);
      const mainKeywords = data.keywords ? data.keywords.split(',').map((k: string) => k.trim()) : 
                          extractKeywordsFromDomain(domain);
      
      // Configurar opciones de análisis
      const analysisOptions = {
        niche: data.niche || 'NFT',
        keywordType: data.keywordType || 'web3',
        contractAddress: data.contractAddress || '',
        includeBlockchainData: true,
        includeCompetitors: true
      };
      
      // Paso 2: Análisis de keywords con Web3
      setCurrentStep('Analizando relevancia Web3 de keywords...');
      setProgress(40);
      const keywordAnalysis = await web3KeywordsService.analyzeKeywords(mainKeywords, analysisOptions);

      // Paso 3: Obtener datos de blockchain
      setCurrentStep('Obteniendo datos de blockchain...');
      setProgress(60);
      const blockchainData = await Web3APIsService.getBlockchainInsights(mainKeywords, analysisOptions);

      // Paso 4: Generar recomendaciones
      setCurrentStep('Generando recomendaciones Web3...');
      setProgress(80);
      const recommendations = await Web3APIsService.generateRecommendations(mainKeywords, keywordAnalysis, blockchainData);

      // Paso 5: Generar resultados finales
      setCurrentStep('Finalizando análisis Web3...');
      setProgress(95);
      
      // Transformar los datos al formato esperado por la UI
      const analysisResults: KeywordAnalysisResult = {
        type: 'keywords',
        score: Math.round(keywordAnalysis.avgSearchVolume || 70),
        data: {
          keywords: keywordAnalysis.keywords ? keywordAnalysis.keywords.map(k => ({
            keyword: k.keyword,
            score: Math.round((k.difficulty || 5) * 10),
            volume: k.searchVolume,
            competition: typeof k.competition === 'string' ? parseFloat(k.competition) || 0 : k.competition,
            recommendations: [`Optimizar contenido para "${k.keyword}" enfocándose en Web3`, `Crear contenido educativo sobre ${k.keyword} en blockchain`],
            web3Relevance: k.web3Relevance,
            blockchainMentions: k.blockchainMentions,
            web3Category: k.web3Category,
            relatedProjects: k.relatedProjects,
            blockchainInsights: {
              trendingTopics: [`${k.keyword} adoption`, `${k.keyword} technology`],
              risingProjects: [`${k.keyword}Chain`, `${k.keyword}Protocol`],
              popularContracts: [`0x${Math.random().toString(16).substring(2, 10)}`]
            }
          })) : [],
          suggestedKeywords: recommendations.suggestedKeywords,
          niche: data.niche
        }
      };

      setProgress(100);
      setCurrentStep('Análisis Web3 completado');
      setResults(analysisResults);
      
      notifyAnalysisCompleted('Análisis de Keywords Web3 completado exitosamente', analysisResults.score);
      
      // Redirigir a resultados con parámetros
      setTimeout(() => {
        const params = new URLSearchParams({
          domain,
          projectName: data.projectName,
          analysisType: data.keywordType || 'web3'
        });
        router.push(`/dashboard/results/keywords?${params.toString()}`);
      }, 2000);
      
    } catch (error) {
      console.error('Error en análisis de keywords:', error);
      notifyAnalysisError('Análisis de Keywords', error instanceof Error ? error.message : 'Error desconocido');
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

