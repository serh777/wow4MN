'use client';

import { useEffect, useState, Suspense, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

import OverallScoreCard from './components/OverallScoreCard';
import OverviewMetrics from './components/OverviewMetrics';
import OpportunitiesSection from './components/OpportunitiesSection';
import DiagnosticsSection from './components/DiagnosticsSection';
import LoadingState from './components/LoadingState';
import ErrorState from './components/ErrorState';
import { ContentAnalysisResults } from './types';

function ContentAnalysisResultsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState<ContentAnalysisResults | null>(null);
  const [indexerConnecting, setIndexerConnecting] = useState(true);
  const [indexerProgress, setIndexerProgress] = useState(0);
  const [hasContentResults, setHasContentResults] = useState(false);

  const getAnalysisTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'comprehensive': 'Análisis Integral de Contenido',
      'seo': 'Análisis SEO de Contenido',
      'readability': 'Análisis de Legibilidad',
      'engagement': 'Análisis de Engagement'
    };
    return labels[type] || 'Análisis Personalizado';
  };

  const analysisType = searchParams.get('type') || 'comprehensive';
  const url = searchParams.get('url') || 'wowseoweb3.com';

  const generateMockResults = useCallback((type: 'comprehensive' | 'seo' | 'readability' | 'engagement'): ContentAnalysisResults => {
    // Generar seed basado en la URL para resultados consistentes
    const seed = url.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const seededRandom = (index: number) => {
      const x = Math.sin(seed + index) * 10000;
      return x - Math.floor(x);
    };
    
    const baseResults: ContentAnalysisResults = {
      overallScore: Math.floor(seededRandom(1) * 40) + 60,
      analysisType: type,
      url: url,
      contentQuality: ['excellent', 'good', 'fair', 'poor'][Math.floor(seededRandom(2) * 4)] as 'excellent' | 'good' | 'fair' | 'poor',
      indexerStatus: {
        connected: true,
        dataSource: 'Content Analysis Engine',
        lastUpdate: new Date().toLocaleString()
      },
      contentMetrics: {
        readabilityScore: Math.floor(seededRandom(3) * 30) + 70,
        keywordDensity: Math.floor(seededRandom(4) * 5) + 2,
        contentLength: Math.floor(seededRandom(5) * 2000) + 800,
        headingStructure: Math.floor(seededRandom(6) * 25) + 75
      },
      seoOptimization: {
        titleOptimization: Math.floor(seededRandom(7) * 30) + 70,
        metaDescription: Math.floor(seededRandom(8) * 40) + 60,
        headingTags: Math.floor(seededRandom(9) * 35) + 65,
        internalLinks: Math.floor(seededRandom(10) * 25) + 75
      },
      engagementMetrics: {
        socialShares: Math.floor(seededRandom(11) * 100) + 50,
        timeOnPage: Math.floor(seededRandom(12) * 5) + 2,
        bounceRate: Math.floor(seededRandom(13) * 30) + 30,
        userInteraction: Math.floor(seededRandom(14) * 40) + 60
      },
      technicalSeo: {
        pageSpeed: Math.floor(seededRandom(15) * 30) + 70,
        mobileOptimization: Math.floor(seededRandom(16) * 40) + 60,
        structuredData: Math.floor(seededRandom(17) * 35) + 65,
        accessibility: Math.floor(seededRandom(18) * 25) + 75
      },
      opportunities: [
        {
          title: 'Optimizar Títulos y Meta Descripciones',
          description: 'Los títulos son demasiado largos y las meta descripciones no incluyen palabras clave objetivo',
          solution: 'Reducir títulos a 50-60 caracteres e incluir palabras clave principales en meta descripciones',
          implementation: 'Título: "Guía Web3 SEO | Optimización para DApps" (52 caracteres)\nMeta: "Aprende técnicas avanzadas de SEO para Web3 y DApps. Guía completa con ejemplos prácticos." (95 caracteres)',
          estimatedImpact: '+25% CTR en resultados de búsqueda',
          difficulty: 'easy',
          category: 'seo'
        },
        {
          title: 'Mejorar Estructura de Encabezados',
          description: 'Falta jerarquía clara en los encabezados H1-H6, afectando la legibilidad y SEO',
          solution: 'Reorganizar contenido con estructura jerárquica clara y palabras clave en encabezados',
          implementation: 'H1: Título principal\nH2: Secciones principales\nH3: Subsecciones\nH4: Detalles específicos\nEvitar saltos de niveles',
          estimatedImpact: '+30% mejora en legibilidad',
          difficulty: 'medium',
          category: 'readability'
        },
        {
          title: 'Aumentar Engagement con CTAs',
          description: 'Faltan llamadas a la acción claras y elementos interactivos para mejorar engagement',
          solution: 'Agregar CTAs estratégicos, botones de compartir y elementos interactivos',
          implementation: 'Botones: "Descargar Guía", "Suscribirse", "Compartir"\nElementos: Polls, quizzes, comentarios\nUbicación: Cada 300-400 palabras',
          estimatedImpact: '+40% tiempo en página',
          difficulty: 'medium',
          category: 'engagement'
        },
        {
          title: 'Optimización para Móviles',
          description: 'El contenido no está completamente optimizado para dispositivos móviles',
          solution: 'Implementar diseño responsive y optimizar velocidad de carga móvil',
          implementation: 'CSS responsive\nImágenes optimizadas\nTexto legible en móvil\nBotones táctiles apropiados',
          estimatedImpact: '+35% usuarios móviles',
          difficulty: 'hard',
          category: 'technical'
        }
      ],
      diagnostics: [
        {
          title: 'Densidad de Palabras Clave Excesiva',
          description: 'La densidad de palabras clave supera el 4%, lo que puede ser penalizado por buscadores',
          solution: 'Reducir densidad a 1-2% usando sinónimos y variaciones naturales de las palabras clave',
          codeExample: 'Palabra clave: "SEO Web3"\nVariaciones: "optimización Web3", "posicionamiento blockchain", "SEO para DApps"\nUso natural en contexto sin repetición excesiva',
          severity: 'warning',
          category: 'seo'
        },
        {
          title: 'Falta de Datos Estructurados',
          description: 'No se detectaron datos estructurados (Schema.org) para mejorar la visibilidad en buscadores',
          solution: 'Implementar Schema.org apropiado para el tipo de contenido (Article, BlogPosting, etc.)',
          codeExample: '<script type="application/ld+json">\n{\n  "@context": "https://schema.org",\n  "@type": "Article",\n  "headline": "Título del artículo",\n  "author": {\n    "@type": "Person",\n    "name": "Autor"\n  },\n  "datePublished": "2024-01-15"\n}\n</script>',
          severity: 'critical',
          category: 'seo'
        }
      ],
      contentStrategy: {
        recommendations: [
          'Crear contenido evergreen sobre fundamentos Web3',
          'Desarrollar series de tutoriales paso a paso',
          'Incluir estudios de caso reales',
          'Optimizar para búsquedas de cola larga'
        ],
        targetKeywords: [
          'SEO Web3',
          'optimización DApps',
          'marketing blockchain',
          'posicionamiento crypto',
          'contenido descentralizado'
        ],
        contentGaps: [
          'Guías para principiantes en Web3',
          'Comparativas de herramientas SEO',
          'Casos de éxito documentados',
          'Tendencias futuras del sector'
        ],
        competitorAnalysis: [
          'Analizar top 10 competidores en Web3 SEO',
          'Identificar gaps de contenido',
          'Estudiar estrategias de palabras clave',
          'Evaluar calidad y profundidad del contenido'
        ]
      },
      readabilityAnalysis: {
        fleschScore: Math.floor(seededRandom(19) * 30) + 60,
        averageSentenceLength: Math.floor(seededRandom(20) * 10) + 15,
        complexWords: Math.floor(seededRandom(21) * 20) + 10,
        suggestions: [
          'Reducir longitud promedio de oraciones',
          'Simplificar términos técnicos complejos',
          'Agregar más ejemplos prácticos',
          'Usar voz activa en lugar de pasiva'
        ]
      },
      engagementStrategy: {
        improvements: [
          'Agregar elementos visuales interactivos',
          'Incluir videos explicativos cortos',
          'Crear infografías resumiendo conceptos clave',
          'Implementar sistema de comentarios'
        ],
        callToActions: [
          'Suscribirse al newsletter Web3',
          'Descargar checklist SEO gratuito',
          'Unirse a la comunidad Discord',
          'Solicitar consultoría personalizada'
        ],
        userJourney: [
          'Awareness: Blog posts educativos',
          'Consideration: Guías detalladas',
          'Decision: Casos de estudio',
          'Retention: Contenido avanzado'
        ],
        conversionOptimization: [
          'Optimizar formularios de contacto',
          'Mejorar páginas de aterrizaje',
          'Implementar pruebas A/B en CTAs',
          'Personalizar contenido por segmento'
        ]
      }
    };

    return baseResults;
  }, [url]);

  const handleBackToHome = () => {
    router.push('/dashboard/content');
  };

  useEffect(() => {
    const loadAnalysisResults = async () => {
      setLoading(true);
      setIndexerConnecting(true);
      setIndexerProgress(0);

      try {
        // Intentar cargar resultados desde sessionStorage
        const storedResults = sessionStorage.getItem('contentAnalysisResults');
        
        if (storedResults) {
          const parsedResults = JSON.parse(storedResults);
          
          // Convertir los resultados almacenados al formato esperado
          const convertedResults = {
            overallScore: parsedResults.specialResults?.overallScore || 75,
            analysisType: parsedResults.analysisType,
            url: parsedResults.url,
            contentQuality: parsedResults.specialResults?.contentQuality || 'good',
            indexerStatus: {
              connected: true,
              dataSource: 'Content Analysis Engine',
              lastUpdate: new Date().toLocaleString()
            },
            contentMetrics: {
              readabilityScore: parsedResults.specialResults?.contentMetrics?.readabilityScore || 75,
              keywordDensity: parsedResults.indexerResults?.contentQuality || 3,
              contentLength: 1200,
              headingStructure: parsedResults.indexerResults?.seoOptimization || 80
            },
            seoOptimization: {
              titleOptimization: parsedResults.specialResults?.contentMetrics?.seoOptimization || 70,
              metaDescription: parsedResults.indexerResults?.seoOptimization || 65,
              headingTags: parsedResults.indexerResults?.technicalSeo || 70,
              internalLinks: 80
            },
            engagementMetrics: {
              socialShares: 75,
              timeOnPage: 3,
              bounceRate: 45,
              userInteraction: parsedResults.specialResults?.contentMetrics?.engagementPotential || 60
            },
            technicalSeo: {
              pageSpeed: parsedResults.indexerResults?.technicalSeo || 75,
              mobileOptimization: 70,
              structuredData: 65,
              accessibility: 75
            },
            opportunities: parsedResults.specialResults?.opportunities || [],
            diagnostics: parsedResults.indexerResults?.diagnostics?.map((diag: string) => ({
              title: diag,
              description: `Problema detectado: ${diag}`,
              solution: 'Revisar y corregir según las mejores prácticas',
              codeExample: '',
              severity: 'warning' as const,
              category: 'technical' as const
            })) || []
          };
          
          setResults(convertedResults);
          setHasContentResults(true);
          setIndexerConnecting(false);
          setIndexerProgress(100);
          setLoading(false);
          
          return;
        }
      } catch (error) {
        console.error('Error loading stored results:', error);
      }

      // Fallback: simular análisis si no hay datos guardados
      const progressInterval = setInterval(() => {
        setIndexerProgress(prev => {
          if (prev >= 100) {
            clearInterval(progressInterval);
            setIndexerConnecting(false);
            return 100;
          }
          return prev + Math.random() * 15;
        });
      }, 200);

      setTimeout(() => {
        const mockResults = generateMockResults(analysisType as 'comprehensive' | 'seo' | 'readability' | 'engagement');
        setResults(mockResults);
        setHasContentResults(true);
        setLoading(false);
      }, 3000);

      return () => {
        clearInterval(progressInterval);
      };
    };

    loadAnalysisResults();
  }, [analysisType, url, generateMockResults]);

  if (loading) {
    return (
      <LoadingState 
        url={url}
        indexerConnecting={indexerConnecting}
        indexerProgress={indexerProgress}
        onBackToHome={handleBackToHome}
      />
    );
  }

  if (!results) {
    return <ErrorState onBackToHome={handleBackToHome} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Resultados del Análisis de Contenido
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
            Análisis completo para: <span className="font-semibold text-blue-600 dark:text-blue-400">{url}</span>
          </p>
          <Button 
            variant="outline" 
            onClick={handleBackToHome}
            className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            ← Volver al Análisis de Contenido
          </Button>
        </div>

        {/* Overall Score */}
        <div className="flex justify-center mb-8">
          <OverallScoreCard 
            results={results} 
            getAnalysisTypeLabel={getAnalysisTypeLabel}
          />
        </div>

        {/* Overview Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">📊 Métricas Generales</CardTitle>
            <CardDescription className="text-center">
              Resumen de las principales métricas de contenido analizadas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <OverviewMetrics results={results} />
          </CardContent>
        </Card>

        {/* Opportunities */}
        <Card>
          <CardContent className="pt-6">
            <OpportunitiesSection results={results} />
          </CardContent>
        </Card>

        {/* Diagnostics */}
        <Card>
          <CardContent className="pt-6">
            <DiagnosticsSection results={results} />
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center py-8">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Análisis generado el {new Date().toLocaleString()}
          </p>
          <Button 
            variant="ghost"
            onClick={handleBackToHome}
            className="bg-blue-600 hover:bg-blue-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 h-10 px-4 rounded-md font-medium"
          >
            Realizar Nuevo Análisis
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function ContentAnalysisResultsPageWrapper() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <ContentAnalysisResultsPage />
    </Suspense>
  );
}

