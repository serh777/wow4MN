'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  AreaChart, Area
} from 'recharts';
import { 
  Target, TrendingUp, Eye, BarChart3, Star, Shield, Zap, 
  Download, Share2, ArrowUp, ArrowDown, Minus, RefreshCw,
  CheckCircle, AlertTriangle, Info, Globe, Link, Users, Clock,
  Activity, Award, Cpu, Database, Search, Palette, Crown
} from 'lucide-react';
import { useSearchParams, useRouter } from 'next/navigation';

// Función para generar datos mock realistas basados en herramientas seleccionadas
const generateUnifiedResults = (tools: string[], address: string) => {
  const baseScore = Math.floor(Math.random() * 30) + 70; // 70-100
  
  return {
    overallScore: baseScore,
    address: address,
    analysisDate: new Date().toISOString(),
    toolsAnalyzed: tools,
    
    // Puntuaciones por herramienta
    toolScores: tools.reduce((acc: any, tool: string) => {
      acc[tool] = Math.floor(Math.random() * 30) + 65; // 65-95
      return acc;
    }, {}),
    
    // Métricas principales consolidadas
    consolidatedMetrics: {
      visibility: Math.floor(Math.random() * 20) + 75,
      authority: Math.floor(Math.random() * 25) + 70,
      performance: Math.floor(Math.random() * 30) + 65,
      security: Math.floor(Math.random() * 20) + 80,
      engagement: Math.floor(Math.random() * 25) + 70,
      innovation: Math.floor(Math.random() * 20) + 75
    },
    
    // Resumen ejecutivo
    executiveSummary: {
      strengths: [
        'Excelente optimización técnica',
        'Alta autoridad en el ecosistema Web3',
        'Buena presencia en redes sociales descentralizadas',
        'Implementación sólida de estándares blockchain'
      ],
      weaknesses: [
        'Oportunidades de mejora en velocidad de carga',
        'Contenido podría ser más diversificado',
        'Algunas métricas de engagement pueden optimizarse'
      ],
      opportunities: [
        'Expansión a nuevos protocolos DeFi',
        'Integración con más marketplaces NFT',
        'Optimización para Layer 2 solutions'
      ],
      threats: [
        'Competencia creciente en el espacio Web3',
        'Cambios regulatorios potenciales',
        'Volatilidad del mercado crypto'
      ]
    },
    
    // Datos históricos consolidados
    historicalData: Array.from({ length: 30 }, (_, i) => ({
      date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toLocaleDateString(),
      overallScore: Math.floor(Math.random() * 20) + baseScore - 10,
      visibility: Math.floor(Math.random() * 25) + 70,
      authority: Math.floor(Math.random() * 30) + 65,
      performance: Math.floor(Math.random() * 35) + 60,
      engagement: Math.floor(Math.random() * 20) + 75
    })),
    
    // Distribución de puntuaciones
    scoreDistribution: [
      { name: 'Excelente (90-100)', value: 25, color: '#10B981' },
      { name: 'Bueno (75-89)', value: 45, color: '#F59E0B' },
      { name: 'Regular (60-74)', value: 25, color: '#EF4444' },
      { name: 'Necesita Mejora (<60)', value: 5, color: '#6B7280' }
    ],
    
    // Comparación con benchmarks
    benchmarkComparison: {
      yourScore: baseScore,
      industryAverage: Math.floor(Math.random() * 15) + 60,
      topPerformers: Math.floor(Math.random() * 10) + 85,
      percentile: Math.floor(Math.random() * 20) + 75
    },
    
    // Recomendaciones prioritarias
    priorityRecommendations: [
      {
        category: 'Técnico',
        priority: 'high',
        title: 'Optimizar velocidad de carga',
        description: 'Implementar lazy loading y optimización de imágenes para mejorar Core Web Vitals.',
        impact: 'Alto',
        effort: 'Medio',
        estimatedImprovement: '+15 puntos'
      },
      {
        category: 'Contenido',
        priority: 'medium',
        title: 'Diversificar estrategia de contenido',
        description: 'Crear contenido más variado para diferentes audiencias del ecosistema Web3.',
        impact: 'Medio',
        effort: 'Alto',
        estimatedImprovement: '+8 puntos'
      },
      {
        category: 'SEO',
        priority: 'medium',
        title: 'Mejorar estructura de enlaces internos',
        description: 'Optimizar la arquitectura de enlaces para mejorar el crawling y indexación.',
        impact: 'Medio',
        effort: 'Bajo',
        estimatedImprovement: '+5 puntos'
      },
      {
        category: 'Social',
        priority: 'low',
        title: 'Aumentar engagement en redes sociales',
        description: 'Implementar estrategias de community building más efectivas.',
        impact: 'Bajo',
        effort: 'Alto',
        estimatedImprovement: '+3 puntos'
      }
    ],
    
    // Análisis de competencia
    competitorAnalysis: {
      position: Math.floor(Math.random() * 10) + 1,
      totalCompetitors: 50,
      gapAnalysis: [
        { metric: 'SEO Score', you: baseScore, competitor: baseScore - 5 },
        { metric: 'Social Presence', you: baseScore - 10, competitor: baseScore + 5 },
        { metric: 'Technical Performance', you: baseScore + 5, competitor: baseScore - 8 },
        { metric: 'Content Quality', you: baseScore - 3, competitor: baseScore + 2 }
      ]
    },
    
    // Proyecciones de mejora
    improvementProjections: {
      currentTrajectory: Array.from({ length: 12 }, (_, i) => ({
        month: `Mes ${i + 1}`,
        projected: baseScore + (i * 2),
        optimistic: baseScore + (i * 3),
        conservative: baseScore + (i * 1)
      })),
      potentialImpact: {
        technical: 15,
        content: 8,
        social: 5,
        seo: 10
      }
    }
  };
};

export default function UnifiedResultsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Obtener parámetros de la URL
    const tools = searchParams.get('tools')?.split(',') || [];
    const address = searchParams.get('address') || '';
    
    if (tools.length === 0 || !address) {
      router.push('/dashboard');
      return;
    }

    // Simular carga de datos
    const timer = setTimeout(() => {
      setResults(generateUnifiedResults(tools, address));
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [searchParams, router]);

  const exportResults = () => {
    const dataStr = JSON.stringify(results, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `unified-analysis-${Date.now()}.json`;
    link.click();
  };

  const shareResults = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Análisis Unificado Web3',
          text: `Puntuación general: ${results?.overallScore}/100`,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 80) return <ArrowUp className="h-4 w-4 text-green-600" />;
    if (score >= 60) return <Minus className="h-4 w-4 text-yellow-600" />;
    return <ArrowDown className="h-4 w-4 text-red-600" />;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getToolIcon = (tool: string) => {
    const icons: Record<string, any> = {
      'ai-assistant': Cpu,
      'metadata': Database,
      'content': Search,
      'keywords': Target,
      'social': Users,
      'performance': Zap,
      'security': Shield,
      'backlinks': Link,
      'blockchain': Globe,
      'competition': BarChart3,
      'links': Link,
      'smart-contract': Cpu,
      'social-web3': Users,
      'authority-tracking': Award,
      'metaverse-optimizer': Palette,
      'content-authenticity': Shield,
      'nft-tracking': Crown,
      'ecosystem-interactions': Globe
    };
    const IconComponent = icons[tool] || Target;
    return <IconComponent className="h-4 w-4" />;
  };

  const getToolName = (tool: string) => {
    const names: Record<string, string> = {
      'ai-assistant': 'IA Análisis',
      'metadata': 'Metadatos',
      'content': 'Contenido',
      'keywords': 'Keywords',
      'social': 'Social',
      'performance': 'Rendimiento',
      'security': 'Seguridad',
      'backlinks': 'Backlinks',
      'blockchain': 'Blockchain',
      'competition': 'Competencia',
      'links': 'Enlaces',
      'smart-contract': 'Smart Contract',
      'social-web3': 'Social Web3',
      'authority-tracking': 'Autoridad',
      'metaverse-optimizer': 'Metaverso',
      'content-authenticity': 'Autenticidad',
      'nft-tracking': 'NFT Tracking',
      'ecosystem-interactions': 'Ecosistemas'
    };
    return names[tool] || tool;
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Activity className="h-12 w-12 animate-spin mx-auto mb-4 text-blue-500" />
            <p className="text-xl font-medium">Consolidando resultados del análisis...</p>
            <p className="text-muted-foreground">Procesando datos de múltiples herramientas</p>
          </div>
        </div>
      </div>
    );
  }

  if (!results) return null;

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
            <Target className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Análisis Unificado Web3
            </h1>
            <p className="text-muted-foreground text-lg">
              Resultados consolidados para {results.address.slice(0, 6)}...{results.address.slice(-4)}
            </p>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline">{results.toolsAnalyzed.length} herramientas analizadas</Badge>
              <Badge variant="outline">{new Date(results.analysisDate).toLocaleDateString()}</Badge>
            </div>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push('/dashboard')}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Nuevo Análisis
          </Button>
          <Button variant="outline" onClick={exportResults}>
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
          <Button variant="outline" onClick={shareResults}>
            <Share2 className="h-4 w-4 mr-2" />
            Compartir
          </Button>
        </div>
      </div>

      {/* Puntuación General */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardContent className="p-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Puntuación General</h2>
              <p className="text-muted-foreground text-lg">
                Evaluación consolidada basada en {results.toolsAnalyzed.length} herramientas de análisis
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {results.toolsAnalyzed.map((tool: string) => (
                  <Badge key={tool} variant="secondary" className="flex items-center gap-1">
                    {getToolIcon(tool)}
                    {getToolName(tool)}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="text-center">
              <div className="relative w-40 h-40">
                <svg className="w-40 h-40 transform -rotate-90" viewBox="0 0 120 120">
                  <circle
                    cx="60"
                    cy="60"
                    r="50"
                    stroke="#e5e7eb"
                    strokeWidth="8"
                    fill="none"
                  />
                  <circle
                    cx="60"
                    cy="60"
                    r="50"
                    stroke="url(#gradientBlue)"
                    strokeWidth="8"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={`${(results.overallScore / 100) * 314} 314`}
                  />
                  <defs>
                    <linearGradient id="gradientBlue" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#3B82F6" />
                      <stop offset="100%" stopColor="#8B5CF6" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-gray-900">{results.overallScore}</div>
                    <div className="text-sm text-muted-foreground">/ 100</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Métricas Consolidadas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Eye className="h-5 w-5 text-blue-500" />
              Visibilidad
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-2">
              <span className="text-3xl font-bold">{results.consolidatedMetrics.visibility}</span>
              {getScoreIcon(results.consolidatedMetrics.visibility)}
            </div>
            <Progress value={results.consolidatedMetrics.visibility} className="mb-2" />
            <p className="text-sm text-muted-foreground">
              Presencia y alcance en el ecosistema Web3
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Award className="h-5 w-5 text-purple-500" />
              Autoridad
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-2">
              <span className="text-3xl font-bold">{results.consolidatedMetrics.authority}</span>
              {getScoreIcon(results.consolidatedMetrics.authority)}
            </div>
            <Progress value={results.consolidatedMetrics.authority} className="mb-2" />
            <p className="text-sm text-muted-foreground">
              Credibilidad y influencia en la comunidad
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Zap className="h-5 w-5 text-green-500" />
              Rendimiento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-2">
              <span className="text-3xl font-bold">{results.consolidatedMetrics.performance}</span>
              {getScoreIcon(results.consolidatedMetrics.performance)}
            </div>
            <Progress value={results.consolidatedMetrics.performance} className="mb-2" />
            <p className="text-sm text-muted-foreground">
              Optimización técnica y velocidad
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Puntuaciones por Herramienta */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-blue-500" />
            Puntuaciones por Herramienta
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={Object.entries(results.toolScores).map(([tool, score]) => ({
                tool: getToolName(tool),
                score: score,
                fullName: tool
              }))}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="tool" angle={-45} textAnchor="end" height={100} />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Bar dataKey="score" fill="url(#gradientBar)" radius={[4, 4, 0, 0]} />
                <defs>
                  <linearGradient id="gradientBar" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.8}/>
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Tendencias Históricas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-500" />
            Tendencias Históricas (30 días)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={results.historicalData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="overallScore" stroke="#3B82F6" strokeWidth={3} name="Puntuación General" />
                <Line type="monotone" dataKey="visibility" stroke="#10B981" strokeWidth={2} name="Visibilidad" />
                <Line type="monotone" dataKey="authority" stroke="#8B5CF6" strokeWidth={2} name="Autoridad" />
                <Line type="monotone" dataKey="performance" stroke="#F59E0B" strokeWidth={2} name="Rendimiento" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Resumen Ejecutivo */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5 text-blue-500" />
            Resumen Ejecutivo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3 text-green-700 flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Fortalezas
              </h4>
              <ul className="space-y-2">
                {results.executiveSummary.strengths.map((strength: string, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-sm">{strength}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3 text-yellow-700 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Áreas de Mejora
              </h4>
              <ul className="space-y-2">
                {results.executiveSummary.weaknesses.map((weakness: string, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-sm">{weakness}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <Separator className="my-6" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3 text-blue-700 flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Oportunidades
              </h4>
              <ul className="space-y-2">
                {results.executiveSummary.opportunities.map((opportunity: string, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-sm">{opportunity}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3 text-red-700 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Amenazas
              </h4>
              <ul className="space-y-2">
                {results.executiveSummary.threats.map((threat: string, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-sm">{threat}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recomendaciones Prioritarias */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-yellow-500" />
            Recomendaciones Prioritarias
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {results.priorityRecommendations.map((rec: any, index: number) => (
              <div key={index} className="flex gap-4 p-4 border rounded-lg">
                <div className="flex-shrink-0">
                  {rec.priority === 'high' ? (
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                  ) : rec.priority === 'medium' ? (
                    <Info className="h-5 w-5 text-yellow-500" />
                  ) : (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-medium">{rec.title}</h4>
                    <Badge className={getPriorityColor(rec.priority)}>
                      {rec.priority === 'high' ? 'Alta' : rec.priority === 'medium' ? 'Media' : 'Baja'} Prioridad
                    </Badge>
                    <Badge variant="outline">{rec.category}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{rec.description}</p>
                  <div className="flex items-center gap-4 text-xs">
                    <span className="text-muted-foreground">Impacto: <strong>{rec.impact}</strong></span>
                    <span className="text-muted-foreground">Esfuerzo: <strong>{rec.effort}</strong></span>
                    <span className="text-green-600 font-medium">{rec.estimatedImprovement}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Comparación con Benchmarks */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-purple-500" />
            Comparación con Benchmarks
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {results.benchmarkComparison.yourScore}
              </div>
              <p className="text-sm text-muted-foreground">Tu Puntuación</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-600 mb-2">
                {results.benchmarkComparison.industryAverage}
              </div>
              <p className="text-sm text-muted-foreground">Promedio Industria</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {results.benchmarkComparison.topPerformers}
              </div>
              <p className="text-sm text-muted-foreground">Top Performers</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {results.benchmarkComparison.percentile}%
              </div>
              <p className="text-sm text-muted-foreground">Percentil</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Distribución de Puntuaciones */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-green-500" />
            Distribución de Puntuaciones
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={results.scoreDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {results.scoreDistribution.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {results.scoreDistribution.map((item: any, index: number) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                <span className="text-sm">{item.name}: {item.value}%</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

