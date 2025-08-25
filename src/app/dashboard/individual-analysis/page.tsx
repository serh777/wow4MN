'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CircularProgress } from '@/components/ui/circular-progress';
import { 
  ArrowLeft, 
  CheckCircle, 
  AlertTriangle, 
  Info, 
  TrendingUp, 
  Clock,
  Zap,
  Shield,
  Search,
  BarChart3,
  Target,
  RefreshCw,
  Download,
  Share2
} from 'lucide-react';
import { useDynamicResults } from '@/hooks/use-dynamic-results';

// Definición de herramientas disponibles
const AVAILABLE_TOOLS = {
  'performance': {
    id: 'performance',
    name: 'Performance Audit',
    description: 'Análisis completo de rendimiento web',
    icon: Zap,
    color: 'from-yellow-500 to-orange-500',
    category: 'Técnico'
  },
  'security': {
    id: 'security',
    name: 'Security Scan',
    description: 'Auditoría de seguridad y vulnerabilidades',
    icon: Shield,
    color: 'from-red-500 to-pink-500',
    category: 'Seguridad'
  },
  'seo': {
    id: 'seo',
    name: 'SEO Analyzer',
    description: 'Optimización para motores de búsqueda',
    icon: Search,
    color: 'from-green-500 to-emerald-500',
    category: 'Marketing'
  },
  'analytics': {
    id: 'analytics',
    name: 'Web3 Analytics',
    description: 'Análisis de métricas blockchain',
    icon: BarChart3,
    color: 'from-blue-500 to-cyan-500',
    category: 'Análisis'
  }
};

// Componente principal
export default function IndividualAnalysisPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const toolId = searchParams.get('tool');
  const address = searchParams.get('address');
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const [currentStep, setCurrentStep] = useState('');
  const [progress, setProgress] = useState(0);

  const tool = toolId ? AVAILABLE_TOOLS[toolId as keyof typeof AVAILABLE_TOOLS] : null;

  // Hook para resultados dinámicos
  const {
    results: dynamicResults,
    isLoading: dynamicLoading,
    error: dynamicError,
    progress: dynamicProgress,
    completedTools,
    failedTools,
    currentTool,
    startAnalysis,
    clearResults,
    retryTool
  } = useDynamicResults({
    onComplete: (results) => {
      setAnalysisComplete(true);
      setIsAnalyzing(false);
      if (results.length > 0) {
        setAnalysisResults(results[0]);
      }
    },
    onError: (error) => {
      setIsAnalyzing(false);
      console.error('Error en análisis:', error);
    },
    onProgress: (progress, currentTool) => {
      setProgress(progress);
      setCurrentStep(`Analizando con ${currentTool}...`);
    }
  });

  const handleStartAnalysis = useCallback(async () => {
    if (!tool || !address) return;
    
    setIsAnalyzing(true);
    setAnalysisComplete(false);
    setProgress(0);
    
    try {
      await startAnalysis(address, [tool.id]);
    } catch (error) {
      setIsAnalyzing(false);
      console.error('Error iniciando análisis:', error);
    }
  }, [tool, address, startAnalysis]);

  // Iniciar análisis automáticamente si hay parámetros
  useEffect(() => {
    if (tool && address && !isAnalyzing && !analysisComplete) {
      handleStartAnalysis();
    }
  }, [tool, address, isAnalyzing, analysisComplete, handleStartAnalysis]);

  const handleRetry = useCallback(async () => {
    if (!tool || !address) return;
    
    setIsAnalyzing(true);
    setAnalysisComplete(false);
    setProgress(0);
    
    try {
      await startAnalysis(address, [tool.id]);
    } catch (error) {
      setIsAnalyzing(false);
      console.error('Error iniciando análisis:', error);
    }
  }, [tool, address, startAnalysis]);

  const generateMockResults = () => {
    const baseScore = Math.floor(Math.random() * 40) + 60; // 60-100
    
    return {
      overallScore: baseScore,
      metrics: {
        performance: baseScore + Math.floor(Math.random() * 10) - 5,
        accessibility: baseScore + Math.floor(Math.random() * 10) - 5,
        bestPractices: baseScore + Math.floor(Math.random() * 10) - 5,
        seo: baseScore + Math.floor(Math.random() * 10) - 5
      },
      opportunities: [
        {
          title: 'Optimizar imágenes',
          description: 'Reducir el tamaño de las imágenes puede mejorar el tiempo de carga',
          impact: 'Alto',
          savings: '2.3s'
        },
        {
          title: 'Eliminar recursos no utilizados',
          description: 'Remover CSS y JavaScript no utilizado',
          impact: 'Medio',
          savings: '1.1s'
        },
        {
          title: 'Implementar lazy loading',
          description: 'Cargar imágenes solo cuando sean necesarias',
          impact: 'Medio',
          savings: '0.8s'
        }
      ],
      diagnostics: [
        {
          title: 'Tiempo de respuesta del servidor',
          value: '180ms',
          status: 'good'
        },
        {
          title: 'First Contentful Paint',
          value: '1.2s',
          status: 'good'
        },
        {
          title: 'Largest Contentful Paint',
          value: '2.8s',
          status: 'warning'
        },
        {
          title: 'Cumulative Layout Shift',
          value: '0.15',
          status: 'warning'
        }
      ]
    };
  };

  // Si no hay herramienta seleccionada
  if (!tool) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-6">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="p-8 text-center">
              <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Herramienta no especificada</h2>
              <p className="text-gray-600 mb-4">
                Por favor, selecciona una herramienta para realizar el análisis.
              </p>
              <Button onClick={() => router.push('/dashboard')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver al Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const IconComponent = tool.icon;
  const mockResults = analysisResults || generateMockResults();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button 
              variant="outline" 
              onClick={() => router.push('/dashboard')}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
            <div className="flex items-center space-x-3">
              <div className={`p-3 rounded-xl bg-gradient-to-br ${tool.color}`}>
                <IconComponent className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">{tool.name}</h1>
                <p className="text-gray-300">{tool.description}</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              onClick={handleRetry}
              disabled={isAnalyzing}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Reanalizar
            </Button>
            <Button 
              variant="outline"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
            <Button 
              variant="outline"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Compartir
            </Button>
          </div>
        </div>

        {/* Análisis en progreso */}
        {isAnalyzing && (
          <Card className="bg-white/10 border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-1">Análisis en progreso...</h3>
                  <p className="text-gray-300 text-sm">{currentStep || 'Iniciando análisis...'}</p>
                  <Progress value={progress} className="mt-2" />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-400">{Math.round(progress)}%</div>
                  <div className="text-xs text-gray-400">Completado</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Resultados tipo Google PageSpeed */}
        {(analysisComplete || !isAnalyzing) && (
          <>
            {/* Puntuación principal */}
            <Card className="bg-white/10 border-white/20">
              <CardContent className="p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                  <div className="text-center lg:text-left">
                    <h2 className="text-3xl font-bold text-white mb-2">Resultados del Análisis</h2>
                    <p className="text-gray-300 mb-4">
                      Dirección: <code className="bg-white/10 px-2 py-1 rounded text-sm">{address}</code>
                    </p>
                    <div className="flex items-center space-x-4">
                      <Badge variant="outline" className="bg-green-500/20 text-green-300 border-green-500/30">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Análisis Completado
                      </Badge>
                      <Badge variant="outline" className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                        <Clock className="h-3 w-3 mr-1" />
                        {new Date().toLocaleTimeString()}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex justify-center">
                    <CircularProgress 
                      value={mockResults.overallScore} 
                      size={150} 
                      color={mockResults.overallScore >= 90 ? 'green' : mockResults.overallScore >= 70 ? 'yellow' : 'red'}
                      label="Puntuación"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Métricas detalladas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Object.entries(mockResults.metrics).map(([key, value]) => {
                const getColor = (score: number) => {
                  if (score >= 90) return 'green';
                  if (score >= 70) return 'yellow';
                  return 'red';
                };
                
                return (
                  <Card key={key} className="bg-white/10 border-white/20">
                    <CardContent className="p-4 text-center">
                      <CircularProgress 
                        value={value as number} 
                        size={80} 
                        color={getColor(value as number)}
                        label={key.charAt(0).toUpperCase() + key.slice(1)}
                      />
                      <h3 className="text-sm font-medium text-white mt-2 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </h3>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Oportunidades de mejora */}
            <Card className="bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5" />
                  <span>Oportunidades de Mejora</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockResults.opportunities.map((opportunity: any, index: number) => (
                  <div key={index} className="flex items-start space-x-4 p-4 bg-white/5 rounded-lg">
                    <div className={`p-2 rounded-lg ${
                      opportunity.impact === 'Alto' ? 'bg-red-500/20 text-red-300' :
                      opportunity.impact === 'Medio' ? 'bg-yellow-500/20 text-yellow-300' :
                      'bg-green-500/20 text-green-300'
                    }`}>
                      <Target className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-white">{opportunity.title}</h4>
                      <p className="text-gray-300 text-sm mt-1">{opportunity.description}</p>
                      <div className="flex items-center space-x-4 mt-2">
                        <Badge variant="outline" className={`${
                          opportunity.impact === 'Alto' ? 'bg-red-500/20 text-red-300 border-red-500/30' :
                          opportunity.impact === 'Medio' ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' :
                          'bg-green-500/20 text-green-300 border-green-500/30'
                        }`}>
                          Impacto: {opportunity.impact}
                        </Badge>
                        <span className="text-sm text-gray-400">Ahorro potencial: {opportunity.savings}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Diagnósticos */}
            <Card className="bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5" />
                  <span>Diagnósticos Detallados</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {mockResults.diagnostics.map((diagnostic: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${
                          diagnostic.status === 'good' ? 'bg-green-400' :
                          diagnostic.status === 'warning' ? 'bg-yellow-400' :
                          'bg-red-400'
                        }`}></div>
                        <span className="text-white text-sm">{diagnostic.title}</span>
                      </div>
                      <span className="text-gray-300 font-mono text-sm">{diagnostic.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}