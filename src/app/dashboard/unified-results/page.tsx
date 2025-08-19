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
import { DynamicResultsRenderer } from '@/components/results/dynamic-results-renderer';
import { useDynamicResults } from '@/hooks/use-dynamic-results';
import { dashboardOrchestrator, DashboardAnalysisResponse } from '@/services/dashboard-orchestrator';

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
  const [analysisData, setAnalysisData] = useState<DashboardAnalysisResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadAnalysisResults = async () => {
      try {
        // Obtener parámetros de la URL
        const requestId = searchParams.get('requestId');
        const tools = searchParams.get('tools')?.split(',') || [];
        const address = searchParams.get('address') || '';
        
        if (!requestId && (tools.length === 0 || !address)) {
          router.push('/dashboard');
          return;
        }

        if (requestId) {
          // Cargar datos reales del orchestrator
          const analysisStatus = dashboardOrchestrator.getAnalysisStatus(requestId);
          
          if (analysisStatus) {
            setAnalysisData(analysisStatus);
            
            if (analysisStatus.status === 'completed') {
              // Convertir datos del orchestrator al formato esperado
              const convertedResults = convertOrchestratorData(analysisStatus);
              setResults(convertedResults);
              setLoading(false);
            } else if (analysisStatus.status === 'running') {
              // Continuar monitoreando el progreso
              const progressInterval = setInterval(() => {
                const updatedStatus = dashboardOrchestrator.getAnalysisStatus(requestId);
                if (updatedStatus) {
                  setAnalysisData(updatedStatus);
                  
                  if (updatedStatus.status === 'completed') {
                    clearInterval(progressInterval);
                    const convertedResults = convertOrchestratorData(updatedStatus);
                    setResults(convertedResults);
                    setLoading(false);
                  } else if (updatedStatus.status === 'error') {
                    clearInterval(progressInterval);
                    setError('Error en el análisis');
                    setLoading(false);
                  }
                }
              }, 2000);

              // Cleanup interval
              return () => clearInterval(progressInterval);
            } else if (analysisStatus.status === 'error') {
              setError('Error en el análisis');
              setLoading(false);
            }
          } else {
            // Si no se encuentra el análisis, usar datos mock
            setResults(generateUnifiedResults(tools, address));
            setLoading(false);
          }
        } else {
          // Fallback a datos mock si no hay requestId
          setResults(generateUnifiedResults(tools, address));
          setLoading(false);
        }
      } catch (error) {
        console.error('Error loading analysis results:', error);
        setError('Error cargando los resultados');
        setLoading(false);
      }
    };

    loadAnalysisResults();
  }, [searchParams, router]);

  // Función para convertir datos del orchestrator al formato esperado
  const convertOrchestratorData = (analysisData: DashboardAnalysisResponse) => {
    const toolScores: Record<string, number> = {};
    const toolResults: Record<string, any> = {};

    // Procesar resultados de cada herramienta
    analysisData.results.forEach(result => {
      if (result.status === 'success') {
        // Calcular puntuación basada en los datos
        const score = calculateToolScore(result.data);
        toolScores[result.toolId] = score;
        toolResults[result.toolId] = result.data;
      } else {
        toolScores[result.toolId] = 0;
        toolResults[result.toolId] = { error: result.error };
      }
    });

    return {
      overallScore: analysisData.overallScore || 0,
      address: analysisData.metadata.address,
      analysisDate: analysisData.metadata.timestamp,
      toolsAnalyzed: analysisData.metadata.toolsRequested,
      toolScores,
      toolResults,
      
      // Métricas consolidadas basadas en datos reales
      consolidatedMetrics: calculateConsolidatedMetrics(analysisData.results),
      
      // Resumen ejecutivo basado en insights reales
      executiveSummary: {
        strengths: analysisData.summary?.keyInsights?.slice(0, 3) || [],
        weaknesses: analysisData.summary?.criticalIssues?.slice(0, 3) || [],
        opportunities: analysisData.summary?.recommendations?.slice(0, 3) || [],
        threats: ['Análisis en progreso...']
      },
      
      // Recomendaciones reales
      recommendations: analysisData.summary?.recommendations?.map((rec, index) => ({
        id: index + 1,
        title: rec,
        description: `Implementar: ${rec}`,
        priority: index < 2 ? 'high' : index < 4 ? 'medium' : 'low',
        effort: ['Bajo', 'Medio', 'Alto'][Math.floor(Math.random() * 3)],
        impact: ['Alto', 'Medio', 'Bajo'][Math.floor(Math.random() * 3)]
      })) || [],
      
      // Datos de progreso reales
      progressData: analysisData.progress.map(p => ({
        tool: p.toolName,
        progress: p.progress,
        status: p.status
      })),
      
      // Tiempo de ejecución real
      executionTime: analysisData.summary?.totalExecutionTime || 0
    };
  };

  // Función para calcular puntuación de herramienta basada en datos
  const calculateToolScore = (data: any): number => {
    if (!data) return 0;
    
    // Lógica básica para calcular puntuación basada en el tipo de datos
    if (data.score) return data.score;
    if (data.overallScore) return data.overallScore;
    if (data.rating) return data.rating * 20; // Convertir rating 1-5 a 0-100
    
    // Calcular basado en métricas disponibles
    let score = 50; // Base score
    
    if (data.metrics) {
      const metrics = Object.values(data.metrics).filter(v => typeof v === 'number');
      if (metrics.length > 0) {
        const avgMetric = metrics.reduce((a: any, b: any) => a + b, 0) / metrics.length;
        score = Math.min(100, Math.max(0, avgMetric));
      }
    }
    
    return Math.round(score);
  };

  // Función para calcular métricas consolidadas
  const calculateConsolidatedMetrics = (results: any[]) => {
    const successfulResults = results.filter(r => r.status === 'success');
    
    return {
      visibility: calculateMetricAverage(successfulResults, 'visibility') || 75,
      authority: calculateMetricAverage(successfulResults, 'authority') || 70,
      performance: calculateMetricAverage(successfulResults, 'performance') || 65,
      security: calculateMetricAverage(successfulResults, 'security') || 80,
      engagement: calculateMetricAverage(successfulResults, 'engagement') || 70,
      innovation: calculateMetricAverage(successfulResults, 'innovation') || 75
    };
  };

  const calculateMetricAverage = (results: any[], metricName: string): number => {
    const values = results
      .map(r => r.data?.[metricName] || r.data?.metrics?.[metricName])
      .filter(v => typeof v === 'number');
    
    if (values.length === 0) return 0;
    return values.reduce((a, b) => a + b, 0) / values.length;
  };

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

export default function UnifiedResultsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // Obtener parámetros de la URL
  const address = searchParams.get('address') || '';
  const toolsParam = searchParams.get('tools') || '';
  const requestId = searchParams.get('requestId') || '';
  const selectedTools = toolsParam ? toolsParam.split(',') : [];

  // Usar el hook de resultados dinámicos
  const {
    results,
    isLoading,
    error,
    progress,
    completedTools,
    failedTools,
    currentTool,
    startAnalysis,
    clearResults,
    retryTool,
    isAnalysisComplete,
    stats
  } = useDynamicResults({
    onComplete: (results) => {
      console.log('Análisis completado:', results);
    },
    onError: (error) => {
      console.error('Error en análisis:', error);
    },
    onProgress: (progress, currentTool) => {
      console.log(`Progreso: ${progress}% - ${currentTool}`);
    }
  });

  // Estados adicionales para compatibilidad
  const [analysisData, setAnalysisData] = useState<DashboardAnalysisResponse | null>(null);

  useEffect(() => {
    const loadAnalysisResults = async () => {
      if (!address || selectedTools.length === 0) {
        router.push('/dashboard');
        return;
      }

      try {
        if (requestId) {
          // Intentar obtener resultados del orchestrator existente
          const analysisStatus = dashboardOrchestrator.getAnalysisStatus(requestId);
          
          if (analysisStatus) {
            setAnalysisData(analysisStatus);
            
            if (analysisStatus.status === 'completed') {
              // Convertir datos del orchestrator al formato de resultados dinámicos
              const convertedResults = convertOrchestratorToToolResults(analysisStatus, selectedTools);
              // Aquí podrías actualizar el estado de resultados dinámicos si fuera necesario
            } else if (analysisStatus.status === 'running') {
              // Iniciar análisis con el sistema dinámico
              await startAnalysis(address, selectedTools);
            } else if (analysisStatus.status === 'error') {
              console.error('Error en análisis previo');
            }
          } else {
            // Iniciar nuevo análisis
            await startAnalysis(address, selectedTools);
          }
        } else {
          // Iniciar nuevo análisis
          await startAnalysis(address, selectedTools);
        }
      } catch (error) {
        console.error('Error loading analysis results:', error);
      }
    };

    loadAnalysisResults();
  }, [searchParams, router, address, selectedTools, requestId, startAnalysis]);

  // Función para convertir datos del orchestrator al formato ToolResult
  const convertOrchestratorToToolResults = (analysisData: DashboardAnalysisResponse, tools: string[]) => {
    return tools.map(toolId => ({
      toolId,
      toolName: getToolName(toolId),
      status: 'completed' as const,
      data: analysisData.results?.[toolId] || {},
      insights: analysisData.results?.[toolId]?.insights || [],
      recommendations: analysisData.results?.[toolId]?.recommendations || [],
      score: analysisData.results?.[toolId]?.score || 0,
      metrics: analysisData.results?.[toolId]?.metrics || {},
      timestamp: new Date().toISOString()
    }));
  };

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
        const overallScore = results.reduce((sum, r) => sum + (r.score || 0), 0) / results.length;
        await navigator.share({
          title: 'Análisis Unificado Web3',
          text: `Puntuación general: ${Math.round(overallScore)}/100`,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    }
  };

  const getToolName = (tool: string) => {
    const names: Record<string, string> = {
      'ai-assistant': 'IA Análisis',
      'blockchain': 'Blockchain Analysis',
      'nft-tracking': 'NFT Tracking',
      'keywords': 'Keywords Analysis',
      'backlinks': 'Backlinks Analysis',
      'performance': 'Performance Analysis',
      'security': 'Security Audit',
      'social-web3': 'Social Web3',
      'authority-tracking': 'Authority Tracking',
      'content-authenticity': 'Content Authenticity',
      'metaverse-optimizer': 'Metaverse Optimizer',
      'ecosystem-interactions': 'Ecosystem Interactions'
    };
    return names[tool] || tool.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-red-500" />
            <p className="text-xl font-medium text-red-600">Error en el Análisis</p>
            <p className="text-muted-foreground mb-4">{error}</p>
            <div className="flex gap-2 justify-center">
              <Button onClick={() => router.push('/dashboard')}>
                Volver al Dashboard
              </Button>
              <Button variant="outline" onClick={() => startAnalysis(address, selectedTools)}>
                Reintentar
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
              Resultados consolidados para {address.slice(0, 6)}...{address.slice(-4)}
            </p>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline">{selectedTools.length} herramientas analizadas</Badge>
              <Badge variant="outline">{new Date().toLocaleDateString()}</Badge>
              {isLoading && (
                <Badge variant="secondary" className="animate-pulse">
                  {currentTool ? `Procesando ${currentTool}...` : 'Analizando...'}
                </Badge>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push('/dashboard')}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Nuevo Análisis
          </Button>
          <Button 
            variant="outline" 
            onClick={exportResults}
            disabled={results.length === 0}
          >
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
          <Button 
            variant="outline" 
            onClick={shareResults}
            disabled={results.length === 0}
          >
            <Share2 className="h-4 w-4 mr-2" />
            Compartir
          </Button>
        </div>
      </div>

      {/* Barra de Progreso */}
      {isLoading && (
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Progreso del Análisis</h3>
                <span className="text-sm text-muted-foreground">
                  {stats.completed}/{stats.total} completadas
                </span>
              </div>
              <Progress value={progress} className="w-full" />
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>✅ {stats.completed} Completadas</span>
                <span>❌ {stats.failed} Fallidas</span>
                <span>⏳ {stats.pending} Pendientes</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Renderizador Dinámico de Resultados */}
      <DynamicResultsRenderer
        results={results}
        selectedTools={selectedTools}
        address={address}
        isLoading={isLoading}
        className="space-y-6"
      />

      {/* Botones de Acción para Herramientas Fallidas */}
      {failedTools.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              Herramientas con Errores
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {failedTools.map(toolId => (
                <div key={toolId} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <span className="font-medium">{getToolName(toolId)}</span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => retryTool(toolId, address)}
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Reintentar
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
