'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAnalysisNotifications } from '@/components/notifications/use-analysis-notifications';

interface LinkAnalysisData {
  websiteUrl: string;
  scanDepth: number;
  linkTypes: string[];
  checkFrequency: string;
  excludePatterns: string;
}

interface LinkResults {
  score: number;
  totalLinks: number;
  workingLinks: number;
  brokenLinks: number;
  redirectLinks: number;
  internalLinks: number;
  externalLinks: number;
  linkHealth: {
    score: number;
    recommendations: string[];
  };
  seoValue: {
    score: number;
    recommendations: string[];
  };
  userExperience: {
    score: number;
    recommendations: string[];
  };
  security: {
    score: number;
    recommendations: string[];
  };
  performance: {
    score: number;
    recommendations: string[];
  };
}

export function useLinksAnalysis() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<LinkResults | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { notifyAnalysisStarted, notifyAnalysisCompleted, notifyAnalysisError } = useAnalysisNotifications();

  const handleSubmit = async (data: LinkAnalysisData) => {
    setLoading(true);
    notifyAnalysisStarted('Enlaces');

    try {
      // Simular análisis de enlaces
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Generar resultados mock basados en los datos de entrada
      const mockResults: LinkResults = {
        score: Math.floor(Math.random() * 30) + 70, // 70-100
        totalLinks: Math.floor(Math.random() * 200) + 150, // 150-350
        workingLinks: 0,
        brokenLinks: 0,
        redirectLinks: 0,
        internalLinks: 0,
        externalLinks: 0,
        linkHealth: {
          score: Math.floor(Math.random() * 25) + 75,
          recommendations: [
            'Reparar enlaces rotos encontrados',
            'Optimizar redirecciones innecesarias',
            'Verificar enlaces externos periódicamente'
          ]
        },
        seoValue: {
          score: Math.floor(Math.random() * 30) + 70,
          recommendations: [
            'Mejorar texto ancla descriptivo',
            'Balancear enlaces internos y externos',
            'Añadir atributos rel apropiados'
          ]
        },
        userExperience: {
          score: Math.floor(Math.random() * 25) + 75,
          recommendations: [
            'Reducir tiempo de carga de páginas enlazadas',
            'Añadir indicadores visuales para enlaces externos',
            'Optimizar navegación interna'
          ]
        },
        security: {
          score: Math.floor(Math.random() * 20) + 80,
          recommendations: [
            'Migrar enlaces HTTP a HTTPS',
            'Revisar enlaces a dominios externos',
            'Implementar políticas de seguridad'
          ]
        },
        performance: {
          score: Math.floor(Math.random() * 30) + 70,
          recommendations: [
            'Optimizar imágenes enlazadas',
            'Implementar lazy loading',
            'Reducir cadenas de redirección'
          ]
        }
      };

      // Calcular distribución de enlaces
      mockResults.brokenLinks = Math.floor(mockResults.totalLinks * 0.05); // 5%
      mockResults.redirectLinks = Math.floor(mockResults.totalLinks * 0.15); // 15%
      mockResults.workingLinks = mockResults.totalLinks - mockResults.brokenLinks - mockResults.redirectLinks;
      mockResults.internalLinks = Math.floor(mockResults.totalLinks * 0.65); // 65%
      mockResults.externalLinks = mockResults.totalLinks - mockResults.internalLinks;

      // Crear resultados detallados para sessionStorage
      const detailedResults = {
        ...mockResults,
        detailedMetrics: {
          averageResponseTime: Math.round((Math.random() * 2 + 0.5) * 10) / 10, // 0.5-2.5s
          httpsPercentage: Math.floor(Math.random() * 20) + 80, // 80-100%
          noFollowLinks: Math.floor(mockResults.totalLinks * 0.1), // 10%
          anchorTextOptimization: Math.floor(Math.random() * 40) + 60, // 60-100%
          linkDepthDistribution: {
            'Nivel 1': Math.floor(mockResults.totalLinks * 0.2),
            'Nivel 2': Math.floor(mockResults.totalLinks * 0.35),
            'Nivel 3': Math.floor(mockResults.totalLinks * 0.25),
            'Nivel 4+': Math.floor(mockResults.totalLinks * 0.2)
          },
          topDomains: [
            { domain: data.websiteUrl.replace('https://', '').replace('http://', ''), count: mockResults.internalLinks, score: 95 },
            { domain: 'partner-site.com', count: Math.floor(mockResults.externalLinks * 0.3), score: 88 },
            { domain: 'social-platform.com', count: Math.floor(mockResults.externalLinks * 0.2), score: 82 },
            { domain: 'external-resource.org', count: Math.floor(mockResults.externalLinks * 0.15), score: 76 }
          ],
          brokenLinkDetails: [
            { url: '/old-page', status: 404, error: 'Página no encontrada' },
            { url: '/removed-content', status: 410, error: 'Contenido eliminado' },
            { url: 'https://external-broken.com', status: 500, error: 'Error del servidor' }
          ].slice(0, mockResults.brokenLinks),
          redirectChains: [
            { url: '/old-url', redirects: 3, finalUrl: '/new-final-url' },
            { url: '/legacy-page', redirects: 2, finalUrl: '/current-page' }
          ].slice(0, Math.min(mockResults.redirectLinks, 5))
        },
        recommendations: [
          {
            priority: 'high' as const,
            category: 'Enlaces Rotos',
            title: 'Reparar enlaces críticos',
            description: `Se encontraron ${mockResults.brokenLinks} enlaces rotos que afectan la experiencia del usuario`,
            impact: 'Mejora inmediata en UX y SEO'
          },
          {
            priority: 'medium' as const,
            category: 'Seguridad',
            title: 'Migrar a HTTPS',
            description: 'Algunos enlaces aún usan HTTP en lugar de HTTPS',
            impact: 'Mejor seguridad y ranking SEO'
          },
          {
            priority: 'medium' as const,
            category: 'Rendimiento',
            title: 'Optimizar redirecciones',
            description: 'Reducir cadenas de redirección para mejorar velocidad',
            impact: 'Tiempo de carga más rápido'
          },
          {
            priority: 'low' as const,
            category: 'SEO',
            title: 'Mejorar texto ancla',
            description: 'Optimizar el texto ancla para mejor relevancia SEO',
            impact: 'Mejor posicionamiento en buscadores'
          }
        ],
        analysisDate: new Date().toISOString(),
        websiteUrl: data.websiteUrl,
        scanDepth: data.scanDepth
      };

      setResults(mockResults);
      notifyAnalysisCompleted('Enlaces', mockResults.score);
      
      // Guardar resultados detallados en sessionStorage
      sessionStorage.setItem('linksAnalysisResults', JSON.stringify(detailedResults));
      
      // Redirigir después de 2 segundos
      setTimeout(() => {
        router.push('/dashboard/links/analysis-results');
      }, 2000);
      
    } catch (err) {
      console.error('Error en análisis de enlaces:', err);
      setError('Error al realizar el análisis de enlaces');
      notifyAnalysisError('Enlaces', 'Error al realizar el análisis de enlaces');
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    results,
    error,
    handleSubmit
  };
}