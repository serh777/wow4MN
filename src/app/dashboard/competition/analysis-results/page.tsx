'use client';

import React, { useEffect, useState, Suspense, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { ToolLayout } from '@/app/dashboard/content/analysis-results/components/tool-components';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Users, 
  BarChart3, 
  Globe, 
  Search,
  Download,
  Share2,
  AlertCircle,
  CheckCircle,
  XCircle,
  Info,
  ArrowLeft
} from 'lucide-react';
import ErrorBoundary from '@/components/error-boundary';
import Link from 'next/link';

interface CompetitionAnalysisResults {
  overallScore: number;
  analysisType: string;
  url: string;
  riskLevel: 'low' | 'medium' | 'high';
  indexerStatus: {
    connected: boolean;
    dataSource: string;
    lastUpdate: string;
  };
  competitionMetrics: {
    marketShare: number;
    competitorCount: number;
    positionRanking: number;
    visibilityScore: number;
  };
  competitorAnalysis: {
    topCompetitors: Array<{
      name: string;
      domain: string;
      marketShare: number;
      strengths: string[];
      weaknesses: string[];
    }>;
    marketGaps: string[];
    threats: string[];
  };
  performanceComparison: {
    trafficComparison: number;
    contentQuality: number;
    userEngagement: number;
    technicalPerformance: number;
  };
  marketOpportunities: {
    score: number;
    segments: Array<{
      name: string;
      potential: string;
      difficulty: string;
      description: string;
    }>;
  };
  opportunities: Array<{
    title: string;
    description: string;
    solution: string;
    implementation: string;
    estimatedImpact: string;
    difficulty: 'easy' | 'medium' | 'hard';
    category: string;
  }>;
  diagnostics: Array<{
    issue: string;
    severity: 'low' | 'medium' | 'high';
    description: string;
    recommendation: string;
  }>;
}

function CompetitionAnalysisResultsContent() {
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState<CompetitionAnalysisResults | null>(null);
  const searchParams = useSearchParams();
  const analysisType = searchParams.get('type') || 'comprehensive';
  const url = searchParams.get('url') || '';

  const generateMockResults = useCallback((): CompetitionAnalysisResults => {
    return {
      overallScore: Math.floor(Math.random() * 40) + 60,
      analysisType,
      url: url || 'https://ejemplo.com',
      riskLevel: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as 'low' | 'medium' | 'high',
      indexerStatus: {
        connected: true,
        dataSource: 'Web3 Analytics API',
        lastUpdate: new Date().toLocaleString()
      },
      competitionMetrics: {
        marketShare: Math.floor(Math.random() * 30) + 10,
        competitorCount: Math.floor(Math.random() * 50) + 20,
        positionRanking: Math.floor(Math.random() * 10) + 1,
        visibilityScore: Math.floor(Math.random() * 40) + 50
      },
      competitorAnalysis: {
        topCompetitors: [
          {
            name: 'Competitor A',
            domain: 'competidora.com',
            marketShare: Math.floor(Math.random() * 20) + 15,
            strengths: ['SEO fuerte', 'Contenido de calidad', 'Buena UX'],
            weaknesses: ['Velocidad lenta', 'Poca presencia social']
          },
          {
            name: 'Competitor B', 
            domain: 'competidorb.com',
            marketShare: Math.floor(Math.random() * 15) + 10,
            strengths: ['Tecnología avanzada', 'Buen marketing'],
            weaknesses: ['Contenido limitado', 'Precios altos']
          }
        ],
        marketGaps: [
          'Falta de contenido especializado en Web3',
          'Herramientas de análisis limitadas',
          'Poca integración con blockchain'
        ],
        threats: [
          'Nuevos competidores emergentes',
          'Cambios en algoritmos de búsqueda',
          'Evolución rápida del mercado Web3'
        ]
      },
      performanceComparison: {
        trafficComparison: Math.floor(Math.random() * 40) + 60,
        contentQuality: Math.floor(Math.random() * 30) + 70,
        userEngagement: Math.floor(Math.random() * 35) + 55,
        technicalPerformance: Math.floor(Math.random() * 25) + 75
      },
      marketOpportunities: {
        score: Math.floor(Math.random() * 30) + 70,
        segments: [
          {
            name: 'DeFi Analytics',
            potential: 'Alto',
            difficulty: 'Medio',
            description: 'Análisis especializado en protocolos DeFi'
          },
          {
            name: 'NFT Market Analysis',
            potential: 'Medio',
            difficulty: 'Bajo',
            description: 'Herramientas para análisis de mercados NFT'
          }
        ]
      },
      opportunities: [
        {
          title: 'Optimización de contenido Web3',
          description: 'Mejorar el contenido relacionado con blockchain y criptomonedas',
          solution: 'Crear guías especializadas y tutoriales técnicos',
          implementation: 'Desarrollar un calendario de contenido Web3',
          estimatedImpact: 'Alto - Incremento del 25% en tráfico orgánico',
          difficulty: 'medium' as const,
          category: 'Contenido'
        },
        {
          title: 'Integración de herramientas DeFi',
          description: 'Añadir funcionalidades de análisis DeFi avanzadas',
          solution: 'Implementar APIs de protocolos DeFi principales',
          implementation: 'Fase de desarrollo de 3 meses',
          estimatedImpact: 'Muy Alto - Diferenciación competitiva',
          difficulty: 'hard' as const,
          category: 'Tecnología'
        }
      ],
      diagnostics: [
        {
          issue: 'Velocidad de carga lenta en móviles',
          severity: 'medium' as const,
          description: 'Los tiempos de carga superan los 3 segundos en dispositivos móviles',
          recommendation: 'Optimizar imágenes y implementar lazy loading'
        },
        {
          issue: 'Contenido duplicado detectado',
          severity: 'low' as const,
          description: 'Algunas páginas tienen contenido similar que puede afectar el SEO',
          recommendation: 'Revisar y consolidar contenido duplicado'
        }
      ]
    };
  }, [analysisType, url]);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      const storedResults = localStorage.getItem('competitionAnalysisResults');
      if (storedResults) {
        setResults(JSON.parse(storedResults));
      } else {
        // Generar datos mock si no hay datos guardados
        setResults(generateMockResults());
      }
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, [generateMockResults]);



  const handleExport = () => {
    console.log('Exportando resultados...');
  };

  const handleShare = () => {
    console.log('Compartiendo resultados...');
  };

  if (loading) {
    return (
      <ErrorBoundary>
        <ToolLayout
          title="Resultados del Análisis de Competencia"
          description="Cargando resultados detallados..."
          icon="🎯"
        >
          <div className="flex items-center justify-center h-64">
            <div className="text-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-muted-foreground">Procesando análisis de competencia...</p>
            </div>
          </div>
        </ToolLayout>
      </ErrorBoundary>
    );
  }

  if (!results) {
    return (
      <ErrorBoundary>
        <ToolLayout
          title="Resultados del Análisis de Competencia"
          description="No se encontraron resultados"
          icon="🎯"
        >
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              No se encontraron resultados del análisis. Por favor, ejecuta un nuevo análisis.
            </AlertDescription>
          </Alert>
        </ToolLayout>
      </ErrorBoundary>
    );
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'low': return <Info className="h-4 w-4 text-blue-500" />;
      case 'medium': return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'high': return <XCircle className="h-4 w-4 text-red-500" />;
      default: return <Info className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <Link href="/dashboard/competition" className="flex items-center text-sm text-muted-foreground hover:text-foreground mb-2">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Volver al análisis
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Resultados del Análisis de Competencia</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              Análisis completo para {results.url}
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleExport} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
            <Button onClick={handleShare} variant="outline">
              <Share2 className="h-4 w-4 mr-2" />
              Compartir
            </Button>
          </div>
        </div>

        {/* Puntuación General */}
        <div className="flex justify-center mb-8">
          <div className="w-full max-w-md">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 justify-center">
                  <Target className="h-5 w-5" />
                  Puntuación General de Competencia
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="relative w-32 h-32 mx-auto mb-4">
                    <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#e5e7eb"
                        strokeWidth="2"
                      />
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#3b82f6"
                        strokeWidth="2"
                        strokeDasharray={`${results.overallScore}, 100`}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-2xl font-bold">{results.overallScore}</span>
                    </div>
                  </div>
                  <Badge className={getRiskColor(results.riskLevel)}>
                    {results.riskLevel === 'low' ? 'Bajo Riesgo' : 
                     results.riskLevel === 'medium' ? 'Riesgo Medio' : 'Alto Riesgo'}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Métricas Principales */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="text-center space-y-2">
                <div className="text-2xl font-bold">{results.competitionMetrics.positionRanking}</div>
                <div className="text-sm text-muted-foreground">Posición en Ranking</div>
                <div className="flex items-center justify-center">
                  <TrendingUp className="h-4 w-4 text-blue-500" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="text-center space-y-2">
                <div className="text-2xl font-bold">{results.competitionMetrics.marketShare}%</div>
                <div className="text-sm text-muted-foreground">Cuota de Mercado</div>
                <div className="flex items-center justify-center">
                  <Target className="h-4 w-4 text-blue-500" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="text-center space-y-2">
                <div className="text-2xl font-bold">{results.competitionMetrics.competitorCount}</div>
                <div className="text-sm text-muted-foreground">Competidores Activos</div>
                <div className="flex items-center justify-center">
                  <Users className="h-4 w-4 text-green-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="text-center space-y-2">
                <div className="text-2xl font-bold">{results.competitionMetrics.visibilityScore}</div>
                <div className="text-sm text-muted-foreground">Puntuación Visibilidad</div>
                <div className="flex items-center justify-center">
                  <Search className="h-4 w-4 text-purple-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Estado del indexador */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="font-medium">Indexador Conectado</span>
                <Badge variant="outline">{results.indexerStatus.dataSource}</Badge>
              </div>
              <div className="text-sm text-muted-foreground">
                Última actualización: {results.indexerStatus.lastUpdate}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Resumen General */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Resumen General</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Métricas de Competencia
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Cuota de Mercado</span>
                    <span className="font-medium">{results.competitionMetrics.marketShare}%</span>
                  </div>
                  <Progress value={results.competitionMetrics.marketShare} />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Puntuación de Visibilidad</span>
                    <span className="font-medium">{results.competitionMetrics.visibilityScore}</span>
                  </div>
                  <Progress value={results.competitionMetrics.visibilityScore} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Oportunidades de Mercado
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{results.marketOpportunities.score}</div>
                    <div className="text-sm text-muted-foreground">Puntuación de Oportunidades</div>
                  </div>
                  <div className="space-y-2">
                    {results.marketOpportunities.segments.map((segment, index) => (
                      <div key={index} className="p-3 border rounded-lg">
                        <div className="font-medium">{segment.name}</div>
                        <div className="text-sm text-muted-foreground">{segment.description}</div>
                        <div className="flex gap-2 mt-2">
                          <Badge variant="outline">Potencial: {segment.potential}</Badge>
                          <Badge variant="outline">Dificultad: {segment.difficulty}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Análisis de Competidores */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Análisis de Competidores</h2>
          <Card>
            <CardHeader>
              <CardTitle>Competidores Principales</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {results.competitorAnalysis.topCompetitors.map((competitor, index) => (
                  <div key={index} className="p-4 border rounded-lg space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{competitor.name}</h3>
                        <p className="text-sm text-muted-foreground">{competitor.domain}</p>
                      </div>
                      <Badge variant="outline">{competitor.marketShare}% cuota</Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium text-green-600 mb-2">Fortalezas</h4>
                        <ul className="text-sm space-y-1">
                          {competitor.strengths.map((strength, i) => (
                            <li key={i} className="flex items-center gap-2">
                              <CheckCircle className="h-3 w-3 text-green-500" />
                              {strength}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium text-red-600 mb-2">Debilidades</h4>
                        <ul className="text-sm space-y-1">
                          {competitor.weaknesses.map((weakness, i) => (
                            <li key={i} className="flex items-center gap-2">
                              <XCircle className="h-3 w-3 text-red-500" />
                              {weakness}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Gaps del Mercado</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {results.competitorAnalysis.marketGaps.map((gap, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-blue-500" />
                      <span className="text-sm">{gap}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Amenazas Competitivas</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {results.competitorAnalysis.threats.map((threat, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <TrendingDown className="h-4 w-4 text-red-500" />
                      <span className="text-sm">{threat}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Comparación de Rendimiento */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Comparación de Rendimiento</h2>
          <Card>
            <CardHeader>
              <CardTitle>Métricas de Rendimiento vs Competencia</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Comparación de Tráfico</span>
                      <span className="font-medium">{results.performanceComparison.trafficComparison}%</span>
                    </div>
                    <Progress value={results.performanceComparison.trafficComparison} />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Calidad de Contenido</span>
                      <span className="font-medium">{results.performanceComparison.contentQuality}%</span>
                    </div>
                    <Progress value={results.performanceComparison.contentQuality} />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Engagement de Usuario</span>
                      <span className="font-medium">{results.performanceComparison.userEngagement}%</span>
                    </div>
                    <Progress value={results.performanceComparison.userEngagement} />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Rendimiento Técnico</span>
                      <span className="font-medium">{results.performanceComparison.technicalPerformance}%</span>
                    </div>
                    <Progress value={results.performanceComparison.technicalPerformance} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Oportunidades */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Oportunidades de Mejora</h2>
          <div className="grid gap-4">
            {results.opportunities.map((opportunity, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{opportunity.title}</CardTitle>
                    <Badge className={getDifficultyColor(opportunity.difficulty)}>
                      {opportunity.difficulty === 'easy' ? 'Fácil' : 
                       opportunity.difficulty === 'medium' ? 'Medio' : 'Difícil'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-muted-foreground">{opportunity.description}</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-2">Solución</h4>
                      <p className="text-sm">{opportunity.solution}</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Implementación</h4>
                      <p className="text-sm">{opportunity.implementation}</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t">
                    <Badge variant="outline">{opportunity.category}</Badge>
                    <span className="text-sm font-medium text-green-600">{opportunity.estimatedImpact}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Diagnósticos */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Diagnósticos y Recomendaciones</h2>
          <div className="space-y-4">
            {results.diagnostics.map((diagnostic, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    {getSeverityIcon(diagnostic.severity)}
                    <div className="flex-1 space-y-2">
                      <div className="flex justify-between items-start">
                        <h3 className="font-medium">{diagnostic.issue}</h3>
                        <Badge className={getRiskColor(diagnostic.severity)}>
                          {diagnostic.severity === 'low' ? 'Bajo' : 
                           diagnostic.severity === 'medium' ? 'Medio' : 'Alto'}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{diagnostic.description}</p>
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <h4 className="font-medium text-blue-800 mb-1">Recomendación</h4>
                        <p className="text-sm text-blue-700">{diagnostic.recommendation}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Botones de Acción */}
        <div className="flex justify-center gap-4">
          <Link href="/dashboard/competition">
            <Button variant="outline">
              Realizar Nuevo Análisis
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button>
              Volver al Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

interface CompetitionAnalysisResults {
  overallScore: number;
  analysisType: string;
  url: string;
  riskLevel: 'low' | 'medium' | 'high';
  indexerStatus: {
    connected: boolean;
    dataSource: string;
    lastUpdate: string;
  };
  competitionMetrics: {
    marketShare: number;
    competitorCount: number;
    positionRanking: number;
    visibilityScore: number;
  };
  competitorAnalysis: {
    topCompetitors: Array<{
      name: string;
      domain: string;
      marketShare: number;
      strengths: string[];
      weaknesses: string[];
    }>;
    marketGaps: string[];
    threats: string[];
  };
  performanceComparison: {
    trafficComparison: number;
    contentQuality: number;
    userEngagement: number;
    technicalPerformance: number;
  };
  marketOpportunities: {
    score: number;
    segments: Array<{
      name: string;
      potential: string;
      difficulty: string;
      description: string;
    }>;
  };
  opportunities: Array<{
    title: string;
    description: string;
    solution: string;
    implementation: string;
    estimatedImpact: string;
    difficulty: 'easy' | 'medium' | 'hard';
    category: string;
  }>;
  diagnostics: Array<{
    issue: string;
    severity: 'low' | 'medium' | 'high';
    description: string;
    recommendation: string;
  }>;
}


export default function CompetitionAnalysisResultsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CompetitionAnalysisResultsContent />
    </Suspense>
  );
}
