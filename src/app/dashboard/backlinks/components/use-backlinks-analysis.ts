'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface FormData {
  websiteUrl: string;
  projectName: string;
  targetKeywords: string;
  competitors: string;
  analysisDepth: string;
  includeCompetitorAnalysis: boolean;
  includeToxicLinks: boolean;
  includeAnchorAnalysis: boolean;
}

interface BacklinksResults {
  score: number;
  totalBacklinks: number;
  qualityDistribution: {
    high: number;
    medium: number;
    low: number;
  };
  domainAuthority: {
    score: number;
    recommendations: string[];
  };
  anchorText: {
    score: number;
    distribution: {
      branded: number;
      exact: number;
      partial: number;
      generic: number;
    };
    recommendations: string[];
  };
  linkVelocity: {
    score: number;
    monthlyGrowth: number[];
    recommendations: string[];
  };
  toxicLinks: {
    score: number;
    count: number;
    severity: {
      high: number;
      medium: number;
      low: number;
    };
    recommendations: string[];
  };
  competitorAnalysis?: {
    score: number;
    competitors: Array<{
      domain: string;
      backlinks: number;
      domainAuthority: number;
      commonBacklinks: number;
    }>;
    opportunities: string[];
    recommendations: string[];
  };
  topBacklinks: Array<{
    domain: string;
    url: string;
    domainAuthority: number;
    anchorText: string;
    linkType: 'dofollow' | 'nofollow';
    firstSeen: string;
  }>;
  insights: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  };
}

interface AnalysisProgress {
  step: string;
  progress: number;
  message: string;
}

export function useBacklinksAnalysis() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<BacklinksResults | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [analysisProgress, setAnalysisProgress] = useState<AnalysisProgress>({
    step: '',
    progress: 0,
    message: ''
  });

  const simulateAnalysisSteps = useCallback(async (data: FormData) => {
    const steps = [
      { step: 'crawling', message: 'Rastreando backlinks del sitio web...', duration: 2000 },
      { step: 'quality', message: 'Evaluando calidad de enlaces...', duration: 1500 },
      { step: 'authority', message: 'Analizando autoridad de dominios...', duration: 1800 },
      { step: 'anchor', message: 'Procesando texto de anclaje...', duration: 1200 },
      { step: 'toxic', message: 'Detectando enlaces tóxicos...', duration: 1000 },
      ...(data.includeCompetitorAnalysis ? [{ step: 'competitors', message: 'Analizando competidores...', duration: 2200 }] : []),
      { step: 'insights', message: 'Generando insights y recomendaciones...', duration: 800 }
    ];

    for (let i = 0; i < steps.length; i++) {
      const currentStep = steps[i];
      setAnalysisProgress({
        step: currentStep.step,
        progress: ((i + 1) / steps.length) * 100,
        message: currentStep.message
      });
      
      await new Promise(resolve => setTimeout(resolve, currentStep.duration));
    }
  }, []);

  const generateMockResults = useCallback((data: FormData): BacklinksResults => {
    const baseScore = Math.floor(Math.random() * 30) + 60; // 60-90
    const totalBacklinks = Math.floor(Math.random() * 500) + 100; // 100-600
    
    const highQuality = Math.floor(totalBacklinks * (0.2 + Math.random() * 0.3)); // 20-50%
    const lowQuality = Math.floor(totalBacklinks * (0.1 + Math.random() * 0.2)); // 10-30%
    const mediumQuality = totalBacklinks - highQuality - lowQuality;

    const mockResults: BacklinksResults = {
      score: baseScore,
      totalBacklinks,
      qualityDistribution: {
        high: highQuality,
        medium: mediumQuality,
        low: lowQuality
      },
      domainAuthority: {
        score: Math.floor(Math.random() * 40) + 50, // 50-90
        recommendations: [
          'Busca backlinks de sitios con mayor autoridad de dominio (DA 70+)',
          'Diversifica las fuentes de tus backlinks en diferentes nichos',
          'Enfócate en sitios relevantes del ecosistema blockchain y Web3',
          'Considera guest posting en blogs de tecnología reconocidos'
        ]
      },
      anchorText: {
        score: Math.floor(Math.random() * 35) + 55, // 55-90
        distribution: {
          branded: Math.floor(Math.random() * 30) + 40, // 40-70%
          exact: Math.floor(Math.random() * 15) + 5, // 5-20%
          partial: Math.floor(Math.random() * 20) + 15, // 15-35%
          generic: Math.floor(Math.random() * 15) + 10 // 10-25%
        },
        recommendations: [
          'Varía el texto de anclaje para evitar sobre-optimización',
          'Incluye más palabras clave relacionadas con Web3 y DeFi',
          'Mantén un equilibrio natural entre textos de marca y palabras clave',
          'Usa sinónimos y variaciones de tus palabras clave principales'
        ]
      },
      linkVelocity: {
        score: Math.floor(Math.random() * 25) + 65, // 65-90
        monthlyGrowth: Array.from({ length: 12 }, () => Math.floor(Math.random() * 20) + 5),
        recommendations: [
          'Mantén un crecimiento orgánico y constante de enlaces',
          'Evita picos súbitos en la adquisición de enlaces',
          'Planifica una estrategia de link building a largo plazo',
          'Monitorea la velocidad de crecimiento mensualmente'
        ]
      },
      toxicLinks: {
        score: Math.floor(Math.random() * 20) + 75, // 75-95
        count: Math.floor(Math.random() * 15) + 2, // 2-17
        severity: {
          high: Math.floor(Math.random() * 3) + 1,
          medium: Math.floor(Math.random() * 5) + 2,
          low: Math.floor(Math.random() * 8) + 3
        },
        recommendations: [
          'Desautoriza inmediatamente los enlaces de sitios spam identificados',
          'Monitorea regularmente nuevos enlaces tóxicos con herramientas especializadas',
          'Mantén un perfil de enlaces limpio y de alta calidad',
          'Revisa mensualmente tu perfil de backlinks'
        ]
      },
      topBacklinks: [
        {
          domain: 'coindesk.com',
          url: 'https://coindesk.com/tech/blockchain-innovation',
          domainAuthority: 92,
          anchorText: data.projectName || 'proyecto blockchain',
          linkType: 'dofollow',
          firstSeen: '2024-01-15'
        },
        {
          domain: 'cointelegraph.com',
          url: 'https://cointelegraph.com/news/defi-trends',
          domainAuthority: 89,
          anchorText: 'innovación DeFi',
          linkType: 'dofollow',
          firstSeen: '2024-02-03'
        },
        {
          domain: 'decrypt.co',
          url: 'https://decrypt.co/web3-analysis',
          domainAuthority: 78,
          anchorText: 'análisis Web3',
          linkType: 'dofollow',
          firstSeen: '2024-01-28'
        }
      ],
      insights: {
        strengths: [
          'Buena diversidad de dominios de referencia',
          'Enlaces de sitios con alta autoridad en el sector crypto',
          'Crecimiento orgánico constante de backlinks'
        ],
        weaknesses: [
          'Concentración excesiva en ciertos tipos de anchor text',
          'Falta de enlaces de sitios educativos y gubernamentales',
          'Algunos enlaces de baja calidad que requieren atención'
        ],
        opportunities: [
          'Potencial para conseguir enlaces de exchanges principales',
          'Oportunidades en podcasts y medios especializados',
          'Colaboraciones con influencers del ecosistema blockchain'
        ],
        threats: [
          'Competidores con estrategias de link building más agresivas',
          'Posibles penalizaciones por enlaces de baja calidad',
          'Cambios en algoritmos que afecten el valor de ciertos enlaces'
        ]
      }
    };

    // Añadir análisis competitivo si está habilitado
    if (data.includeCompetitorAnalysis && data.competitors.trim()) {
      mockResults.competitorAnalysis = {
        score: Math.floor(Math.random() * 30) + 60,
        competitors: [
          {
            domain: 'competitor1.com',
            backlinks: Math.floor(Math.random() * 300) + 200,
            domainAuthority: Math.floor(Math.random() * 20) + 70,
            commonBacklinks: Math.floor(Math.random() * 20) + 5
          },
          {
            domain: 'competitor2.com',
            backlinks: Math.floor(Math.random() * 400) + 150,
            domainAuthority: Math.floor(Math.random() * 25) + 65,
            commonBacklinks: Math.floor(Math.random() * 15) + 3
          }
        ],
        opportunities: [
          'Sitios que enlazan a competidores pero no a ti',
          'Menciones no enlazadas de tu marca para convertir',
          'Directorios especializados donde no estás presente'
        ],
        recommendations: [
          'Analiza las estrategias de backlinks de tus competidores principales',
          'Identifica oportunidades de enlaces que están aprovechando',
          'Busca menciones no enlazadas de tu marca para convertirlas en backlinks',
          'Considera colaboraciones con sitios que enlazan a competidores'
        ]
      };
    }

    return mockResults;
  }, []);

  const handleSubmit = useCallback(async (data: FormData) => {
    setLoading(true);
    setError(null);
    setResults(null);

    try {
      await simulateAnalysisSteps(data);
      const mockResults = generateMockResults(data);
      setResults(mockResults);
      
      // Guardar resultados en sessionStorage
      sessionStorage.setItem('backlinksAnalysisResults', JSON.stringify({
        overallScore: mockResults.score,
        analysisType: data.analysisDepth || 'comprehensive',
        url: data.websiteUrl,
        riskLevel: mockResults.score >= 80 ? 'low' : mockResults.score >= 60 ? 'medium' : 'high',
        indexerStatus: {
          connected: true,
          dataSource: 'Web3 Link Index',
          lastUpdate: new Date().toLocaleString()
        },
        backlinksMetrics: {
          totalBacklinks: mockResults.totalBacklinks,
          domainAuthority: mockResults.domainAuthority.score,
          qualityScore: Math.floor((mockResults.qualityDistribution.high / mockResults.totalBacklinks) * 100),
          spamScore: Math.floor((mockResults.qualityDistribution.low / mockResults.totalBacklinks) * 100)
        },
        linkProfile: {
          dofollow: mockResults.anchorText.distribution.exact + mockResults.anchorText.distribution.partial,
          nofollow: mockResults.anchorText.distribution.generic,
          sponsored: Math.floor(Math.random() * 15) + 5,
          ugc: Math.floor(Math.random() * 10) + 5
        },
        topReferringDomains: mockResults.topBacklinks.slice(0, 3).map(link => ({
          domain: link.domain,
          authority: link.domainAuthority,
          links: Math.floor(Math.random() * 50) + 10,
          traffic: Math.floor(Math.random() * 10000) + 5000
        })),
        opportunities: [
          {
            title: 'Conseguir Enlaces de Proyectos DeFi',
            description: 'Oportunidad de obtener backlinks de alta calidad desde proyectos DeFi establecidos',
            solution: 'Crear contenido colaborativo con protocolos DeFi populares',
            implementation: 'Desarrollar guías técnicas, tutoriales y análisis de protocolos DeFi que agreguen valor real',
            estimatedImpact: '+15% autoridad de dominio',
            difficulty: 'medium',
            category: 'link-building'
          },
          {
            title: 'Optimizar Anchor Text Distribution',
            description: 'La distribución actual de anchor text puede mejorarse para mayor diversidad',
            solution: 'Diversificar los anchor texts con variaciones de marca y palabras clave',
            implementation: 'Crear una estrategia de anchor text que incluya: marca (40%), genéricos (30%), palabras clave (20%), URLs (10%)',
            estimatedImpact: '+10% relevancia temática',
            difficulty: 'easy',
            category: 'optimization'
          }
        ],
        diagnostics: [
          {
            issue: 'Enlaces de Baja Calidad Detectados',
            severity: 'medium',
            description: 'Se han identificado algunos backlinks de dominios con baja autoridad que podrían afectar el perfil de enlaces',
            recommendation: 'Revisar y considerar desautorizar enlaces de dominios spam o de muy baja calidad'
          },
          {
            issue: 'Velocidad de Adquisición de Enlaces',
            severity: 'low',
            description: 'La velocidad de adquisición de nuevos backlinks ha disminuido en los últimos 3 meses',
            recommendation: 'Implementar una estrategia más activa de link building y outreach'
          }
        ]
      }));
      
      // Redireccionar después de 2 segundos
      setTimeout(() => {
        router.push(`/dashboard/backlinks/analysis-results?type=${encodeURIComponent(data.analysisDepth || 'comprehensive')}&url=${encodeURIComponent(data.websiteUrl)}`);
      }, 2000);
      
    } catch (err) {
      setError('Error durante el análisis de backlinks. Por favor, inténtalo de nuevo.');
    } finally {
      setLoading(false);
      setAnalysisProgress({ step: '', progress: 0, message: '' });
    }
  }, [simulateAnalysisSteps, generateMockResults, router]);

  const resetAnalysis = useCallback(() => {
    setResults(null);
    setError(null);
    setAnalysisProgress({ step: '', progress: 0, message: '' });
  }, []);

  return {
    loading,
    results,
    error,
    analysisProgress,
    handleSubmit,
    resetAnalysis
  };
}