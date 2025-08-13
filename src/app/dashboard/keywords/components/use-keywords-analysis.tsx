'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useKeywordsNotifications } from './use-keywords-notifications';
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

      // Simular progreso paso a paso
      const steps = [
        { step: 'Validando datos de entrada...', duration: 800 },
        { step: 'Conectando con APIs de análisis...', duration: 1200 },
        { step: 'Extrayendo keywords principales...', duration: 1500 },
        { step: 'Analizando competencia...', duration: 1000 },
        { step: 'Calculando métricas SEO...', duration: 1200 },
        { step: 'Generando recomendaciones...', duration: 800 },
        { step: 'Finalizando análisis...', duration: 500 }
      ];

      for (let i = 0; i < steps.length; i++) {
        setCurrentStep(steps[i].step);
        setProgress(((i + 1) / steps.length) * 100);
        await new Promise(resolve => setTimeout(resolve, steps[i].duration));
      }
      
      // Validar datos de entrada
      if (!data.projectName || data.projectName.trim() === '') {
        throw new Error('El nombre del proyecto es obligatorio');
      }
      
      if (!data.projectUrl || data.projectUrl.trim() === '') {
        throw new Error('La URL del proyecto es obligatoria');
      }
      
      // Generar datos simulados de análisis de keywords
      const keywordsData: KeywordData[] = [
        {
          keyword: 'blockchain',
          score: 85,
          volume: 12500,
          competition: 75,
          recommendations: [
            'Incluir en títulos y metadatos',
            'Crear contenido educativo sobre blockchain',
            'Usar en URLs principales'
          ]
        },
        {
          keyword: 'web3',
          score: 92,
          volume: 8700,
          competition: 65,
          recommendations: [
            'Destacar en la página principal',
            'Crear guías de introducción a Web3',
            'Usar en títulos de secciones principales'
          ]
        },
        {
          keyword: 'defi',
          score: 78,
          volume: 6300,
          competition: 80,
          recommendations: [
            'Crear sección específica sobre DeFi',
            'Explicar casos de uso',
            'Comparar con finanzas tradicionales'
          ]
        },
        {
          keyword: 'smart contracts',
          score: 65,
          volume: 4200,
          competition: 60,
          recommendations: [
            'Explicar en términos sencillos',
            'Mostrar ejemplos prácticos',
            'Destacar ventajas de seguridad'
          ]
        }
      ];
      
      const analysisData: KeywordAnalysisData = {
        keywords: keywordsData,
        suggestedKeywords: [
          'crypto wallet', 'NFT marketplace', 'token economy',
          'decentralized apps', 'blockchain security', 'web3 development',
          'ethereum', 'solana', 'tokenomics', 'dao governance'
        ],
        niche: 'Web3 & Blockchain'
      };
      
      const analysisResult = {
        type: 'keywords' as const,
        data: JSON.parse(JSON.stringify(analysisData)),
        score: Math.floor(keywordsData.reduce((acc, kw) => acc + kw.score, 0) / keywordsData.length)
      };

      setResults(analysisResult);

      // Crear resultados detallados para la página de análisis
      const detailedResults = {
        totalKeywords: keywordsData.length + analysisData.suggestedKeywords.length,
        avgSearchVolume: Math.floor(keywordsData.reduce((acc, kw) => acc + kw.volume, 0) / keywordsData.length),
        avgDifficulty: Math.floor(keywordsData.reduce((acc, kw) => acc + kw.competition, 0) / keywordsData.length),
        avgCpc: 1.85,
        topKeywords: JSON.parse(JSON.stringify(keywordsData)),
        competitorKeywords: JSON.parse(JSON.stringify(keywordsData.slice(0, 2))),
        longTailKeywords: analysisData.suggestedKeywords.slice(0, 5).map(keyword => ({
          keyword,
          searchVolume: Math.floor(Math.random() * 5000) + 100,
          difficulty: Math.floor(Math.random() * 50) + 10,
          cpc: Math.random() * 3 + 0.5,
          competition: 'low',
          trend: Array.from({ length: 12 }, () => Math.floor(Math.random() * 100)),
          intent: ['informational', 'commercial', 'transactional'][Math.floor(Math.random() * 3)],
          position: Math.floor(Math.random() * 30) + 1,
          clicks: Math.floor(Math.random() * 500),
          impressions: Math.floor(Math.random() * 5000) + 500,
          ctr: Math.random() * 8 + 1
        })),
        seasonalTrends: [
          { month: 'Ene', volume: 1200 },
          { month: 'Feb', volume: 1350 },
          { month: 'Mar', volume: 1800 },
          { month: 'Abr', volume: 2200 },
          { month: 'May', volume: 2800 },
          { month: 'Jun', volume: 3200 },
          { month: 'Jul', volume: 2900 },
          { month: 'Ago', volume: 2600 },
          { month: 'Sep', volume: 2400 },
          { month: 'Oct', volume: 2100 },
          { month: 'Nov', volume: 1900 },
          { month: 'Dic', volume: 1600 }
        ],
        intentDistribution: [
          { intent: 'Informacional', count: 45, color: '#8884d8' },
          { intent: 'Comercial', count: 35, color: '#82ca9d' },
          { intent: 'Transaccional', count: 15, color: '#ffc658' },
          { intent: 'Navegacional', count: 5, color: '#ff7300' }
        ],
        opportunityScore: analysisResult.score,
        recommendations: [
          'Enfócate en keywords de cola larga con menor competencia',
          'Optimiza para búsquedas de intención comercial',
          'Aprovecha las tendencias estacionales identificadas',
          'Considera expandir a keywords de nicho relacionados',
          'Mejora el CTR en keywords con alta impresión pero bajo clic'
        ],
        performanceMetrics: {
          totalImpressions: 125000,
          totalClicks: 8500,
          avgCtr: 6.8,
          avgPosition: 12.3
        }
      };

      // Guardar resultados detallados en sessionStorage de forma segura
      try {
        sessionStorage.setItem('keywordsAnalysisResults', JSON.stringify(detailedResults));
        
        // Guardar configuración del análisis por separado
        const analysisConfig = {
          projectName: data.projectName,
          projectUrl: data.projectUrl,
          niche: data.niche,
          keywordType: data.keywordType,
          keywords: data.keywords,
          contractAddress: data.contractAddress,
          competitorUrls: data.competitorUrls,
          timestamp: new Date().toISOString()
        };
        
        sessionStorage.setItem('keywordsAnalysisConfig', JSON.stringify(analysisConfig));
      } catch (storageError) {
        console.error('Error saving to sessionStorage:', storageError);
        // Continue with the analysis even if storage fails
      }

      setCurrentStep('¡Análisis completado!');
      setProgress(100);
      
      notifyAnalysisCompleted('Análisis de Keywords', analysisResult.score);

      // Redirigir a la página de resultados después de mostrar completado
      setTimeout(() => {
        router.push('/dashboard/keywords/analysis-results');
      }, 1500);
    } catch (error) {
      console.error('Error en análisis de keywords:');
      if (error instanceof Error) {
        console.error('Message:', error.message);
        console.error('Name:', error.name);
        if (error.stack) {
          console.error('Stack:', error.stack);
        }
      } else {
        console.error('Unknown error:', String(error));
      }
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      setCurrentStep('Error en el análisis');
      notifyAnalysisError('Análisis de Keywords', errorMessage);
    } finally {
      setLoading(false);
      setProgress(0);
      setCurrentStep('');
    }
  };

  return { loading, progress, currentStep, results, handleSubmit };
}