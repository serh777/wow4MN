'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAnalysisNotifications } from '@/components/notifications/use-analysis-notifications';

export interface FormData {
  projectName: string;
  projectUrl: string;
  competitors: string;
  niche: string;
  analysisType: string;
}

export interface CompetitionResults {
  projectName: string;
  url: string;
  score: number;
  competitors: Array<{
    name: string;
    url: string;
    score: number;
    strengths: string[];
    weaknesses: string[];
  }>;
  metrics: {
    visibility: number;
    content: number;
    technical: number;
    social: number;
    onchain: number;
  };
  recommendations: string[];
  opportunityGaps: string[];
}

export interface AnalysisProgress {
  currentStep: string;
  message: string;
  percentage: number;
}

export function useCompetitionAnalysis() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<CompetitionResults | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<AnalysisProgress>({
    currentStep: '',
    message: '',
    percentage: 0
  });
  
  const { notifyAnalysisStarted, notifyAnalysisCompleted, notifyAnalysisError } = useAnalysisNotifications();

  const simulateAnalysisSteps = async () => {
    const steps = [
      { step: 'Analizando proyecto principal', message: 'Evaluando métricas del sitio web...', duration: 1500 },
      { step: 'Identificando competidores', message: 'Buscando competidores en el nicho...', duration: 2000 },
      { step: 'Analizando competencia', message: 'Evaluando fortalezas y debilidades...', duration: 2500 },
      { step: 'Calculando métricas', message: 'Procesando datos de visibilidad y contenido...', duration: 1800 },
      { step: 'Generando recomendaciones', message: 'Creando estrategias de mejora...', duration: 1200 },
      { step: 'Finalizando análisis', message: 'Preparando informe final...', duration: 1000 }
    ];

    for (let i = 0; i < steps.length; i++) {
      const { step, message, duration } = steps[i];
      const percentage = Math.round(((i + 1) / steps.length) * 100);
      
      setProgress({
        currentStep: step,
        message,
        percentage
      });
      
      await new Promise(resolve => setTimeout(resolve, duration));
    }
  };

  const generateMockResults = (formData: FormData): CompetitionResults => {
    const competitorNames = [
      'Competidor Alpha', 'Competidor Beta', 'Competidor Gamma',
      'Competidor Delta', 'Competidor Epsilon'
    ];
    
    const strengthsPool = [
      'UX/UI', 'Contenido', 'SEO', 'Backlinks', 'Social Media',
      'Tecnología', 'Innovación', 'Comunidad', 'Marketing', 'Partnerships'
    ];
    
    const weaknessesPool = [
      'SEO', 'Backlinks', 'UX', 'Social', 'Contenido',
      'Tecnología', 'Marketing', 'Comunidad', 'Documentación', 'Soporte'
    ];
    
    const recommendationsPool = [
      'Mejorar la optimización SEO para términos blockchain',
      'Aumentar presencia en redes sociales Web3',
      'Crear más contenido técnico de calidad',
      'Optimizar la experiencia de usuario móvil',
      'Implementar más integraciones con exploradores de bloques',
      'Mejorar la documentación técnica del proyecto',
      'Desarrollar partnerships estratégicos',
      'Aumentar la participación en la comunidad',
      'Implementar programa de referidos',
      'Mejorar la velocidad de carga del sitio'
    ];
    
    const opportunityGapsPool = [
      'Contenido educativo sobre Web3',
      'Herramientas de análisis on-chain',
      'Integración con wallets populares',
      'Plataforma de staking',
      'NFT marketplace',
      'Cross-chain bridges',
      'DeFi yield farming',
      'DAO governance tools'
    ];

    const competitors = Array.from({ length: 3 }, (_, i) => {
      const score = Math.floor(Math.random() * 30) + 60;
      const strengths = strengthsPool
        .sort(() => 0.5 - Math.random())
        .slice(0, 2);
      const weaknesses = weaknessesPool
        .filter(w => !strengths.includes(w))
        .sort(() => 0.5 - Math.random())
        .slice(0, 2);
      
      return {
        name: competitorNames[i],
        url: `https://competidor${i + 1}.com`,
        score,
        strengths,
        weaknesses
      };
    });

    return {
      projectName: formData.projectName || 'Proyecto Web3',
      url: formData.projectUrl,
      score: Math.floor(Math.random() * 30) + 60,
      competitors,
      metrics: {
        visibility: Math.floor(Math.random() * 30) + 60,
        content: Math.floor(Math.random() * 25) + 65,
        technical: Math.floor(Math.random() * 20) + 70,
        social: Math.floor(Math.random() * 35) + 55,
        onchain: Math.floor(Math.random() * 40) + 50
      },
      recommendations: recommendationsPool
        .sort(() => 0.5 - Math.random())
        .slice(0, 6),
      opportunityGaps: opportunityGapsPool
        .sort(() => 0.5 - Math.random())
        .slice(0, 3)
    };
  };

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true);
    setError(null);
    setResults(null);
    
    notifyAnalysisStarted('Análisis de Competencia');

    try {
      // Validar datos de entrada
      if (!formData.projectUrl || formData.projectUrl.trim() === '') {
        throw new Error('La URL del proyecto es obligatoria');
      }

      // Simular proceso de análisis
      await simulateAnalysisSteps();
      
      // Generar resultados simulados
      const competitionResults = generateMockResults(formData);
      
      setResults(competitionResults);
      notifyAnalysisCompleted('Análisis de Competencia', competitionResults.score);
      
      // Guardar resultados en sessionStorage
      sessionStorage.setItem('competitionAnalysisResults', JSON.stringify({
        overallScore: competitionResults.score,
        analysisType: formData.analysisType || 'comprehensive',
        url: formData.projectUrl,
        riskLevel: competitionResults.score >= 80 ? 'low' : competitionResults.score >= 60 ? 'medium' : 'high',
        indexerStatus: {
          connected: true,
          dataSource: 'Competition Analytics Index',
          lastUpdate: new Date().toLocaleString()
        },
        competitionMetrics: {
          marketShare: Math.floor(Math.random() * 30) + 10,
          competitorCount: competitionResults.competitors.length,
          positionRanking: Math.floor(Math.random() * 10) + 1,
          visibilityScore: competitionResults.metrics.visibility
        },
        competitorAnalysis: {
          topCompetitors: competitionResults.competitors.map(comp => ({
            name: comp.name,
            domain: comp.url,
            marketShare: Math.floor(Math.random() * 20) + 15,
            strengths: comp.strengths,
            weaknesses: comp.weaknesses
          })),
          marketGaps: competitionResults.opportunityGaps,
          threats: [
            'Nuevos competidores emergentes',
            'Cambios en algoritmos de búsqueda',
            'Evolución de preferencias del usuario'
          ]
        },
        performanceComparison: {
          trafficComparison: competitionResults.metrics.visibility,
          contentQuality: competitionResults.metrics.content,
          userEngagement: competitionResults.metrics.social,
          technicalPerformance: competitionResults.metrics.technical
        },
        marketOpportunities: {
          score: Math.floor(Math.random() * 30) + 70,
          segments: [
            {
              name: 'Mercado Móvil',
              potential: 'Alto',
              difficulty: 'Medio',
              description: 'Oportunidad de capturar audiencia móvil con mejor optimización'
            },
            {
              name: 'Contenido de Video',
              potential: 'Medio',
              difficulty: 'Alto',
              description: 'Expansión hacia contenido multimedia para mayor engagement'
            }
          ]
        },
        opportunities: [
          {
            title: 'Optimización de Contenido',
            description: 'Mejorar la calidad y relevancia del contenido para superar a competidores',
            solution: 'Desarrollar estrategia de contenido basada en gaps del mercado',
            implementation: 'Análisis de keywords, creación de contenido especializado, optimización SEO',
            estimatedImpact: '+40% tráfico orgánico',
            difficulty: 'medium',
            category: 'content'
          },
          {
            title: 'Mejora de Experiencia de Usuario',
            description: 'Optimizar UX para superar las debilidades de competidores',
            solution: 'Rediseño de interfaz y mejora de velocidad de carga',
            implementation: 'Auditoría UX, optimización técnica, testing A/B',
            estimatedImpact: '+25% conversión',
            difficulty: 'hard',
            category: 'ux'
          }
        ],
        diagnostics: [
          {
            issue: 'Posición Competitiva Débil',
            severity: 'medium',
            description: 'La posición en el mercado está por debajo del potencial',
            recommendation: 'Implementar estrategias diferenciadas para destacar frente a competidores'
          },
          {
            issue: 'Gaps en Contenido',
            severity: 'high',
            description: 'Existen oportunidades de contenido no aprovechadas',
            recommendation: 'Desarrollar contenido especializado en áreas no cubiertas por competidores'
          }
        ]
      }));
      
      // Redireccionar después de 2 segundos
      setTimeout(() => {
        router.push(`/dashboard/results/competition?type=${encodeURIComponent(formData.analysisType || 'comprehensive')}&url=${encodeURIComponent(formData.projectUrl)}`);
      }, 2000);
      
    } catch (error) {
      console.error('Error en análisis de competencia:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      setError(errorMessage);
      notifyAnalysisError('Análisis de Competencia', errorMessage);
    } finally {
      setIsLoading(false);
      setProgress({ currentStep: '', message: '', percentage: 0 });
    }
  };

  const resetAnalysis = () => {
    setResults(null);
    setError(null);
    setProgress({ currentStep: '', message: '', percentage: 0 });
  };

  return {
    isLoading,
    results,
    error,
    progress,
    handleSubmit,
    resetAnalysis
  };
}