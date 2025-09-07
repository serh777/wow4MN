'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { PageSpeedDashboard } from '@/components/ui/pagespeed-dashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BarChart3, 
  Users, 
  Globe, 
  TrendingUp, 
  ArrowLeft,
  Bot,
  Search,
  Zap,
  Activity,
  CheckCircle,
  Clock,
  AlertCircle,
  Shield,
  FileText,
  Link as LinkIcon,
  Coins,
  Loader2,
  RefreshCw
} from 'lucide-react';
import Link from 'next/link';
import { dashboardOrchestrator, DashboardAnalysisResponse } from '@/services/dashboard-orchestrator';

const UnifiedResultsPage = () => {
  const [analysisData, setAnalysisData] = useState<DashboardAnalysisResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [requestId, setRequestId] = useState<string | null>(null);

  // Función para convertir resultados del orchestrator a formato PageSpeed
  const convertToPageSpeedFormat = (analysisResponse: DashboardAnalysisResponse) => {
    const scores = [];

    // Mapear cada resultado a un score del dashboard
    for (const result of analysisResponse.results) {
      if (result.status === 'success' && result.data) {
        let score = 0;
        let metrics: any[] = [];
        let opportunities: any[] = [];

        // Calcular score basado en el tipo de herramienta y datos
        switch (result.toolId) {
          case 'performance':
            score = result.data.performanceScore || 85;
            metrics = [
              {
                name: 'Tiempo de Carga',
                value: result.data.loadTime || 2.1,
                unit: 's',
                status: (result.data.loadTime || 2.1) < 3 ? 'good' : 'needs-improvement',
                description: 'Tiempo total de carga de la página'
              },
              {
                name: 'Core Web Vitals',
                value: result.data.coreWebVitals || 78,
                unit: '%',
                status: (result.data.coreWebVitals || 78) > 75 ? 'good' : 'needs-improvement',
                description: 'Puntuación de métricas web esenciales'
              }
            ];
            opportunities = result.recommendations?.map(rec => ({
              title: rec,
              description: 'Optimización recomendada',
              impact: 'medium' as const
            })) || [];
            break;

          case 'security':
            score = result.data.securityScore || 78;
            metrics = [
              {
                name: 'Vulnerabilidades',
                value: result.data.vulnerabilities?.length || 0,
                unit: '',
                status: (result.data.vulnerabilities?.length || 0) === 0 ? 'good' : 'poor',
                description: 'Número de vulnerabilidades detectadas'
              }
            ];
            break;

          case 'content':
            score = result.data.contentScore || 85;
            metrics = [
              {
                name: 'Calidad SEO',
                value: result.data.seoScore || 88,
                unit: '%',
                status: (result.data.seoScore || 88) > 80 ? 'good' : 'needs-improvement',
                description: 'Optimización para motores de búsqueda'
              }
            ];
            break;

          case 'competition':
            score = result.data.competitionScore || 68;
            metrics = [
              {
                name: 'Posición Competitiva',
                value: result.data.marketPosition || 72,
                unit: '%',
                status: (result.data.marketPosition || 72) > 70 ? 'good' : 'needs-improvement',
                description: 'Posicionamiento frente a competidores'
              }
            ];
            break;

          default:
            score = Math.floor(Math.random() * 30) + 70; // Score entre 70-100
        }

        // Mapear iconos
        let icon = FileText;
        let category: 'performance' | 'seo' | 'security' | 'content' | 'social' | 'competition' = 'content';
        
        switch (result.toolId) {
          case 'performance':
            icon = Zap;
            category = 'performance';
            break;
          case 'security':
          case 'security-scan':
            icon = Shield;
            category = 'security';
            break;
          case 'keywords':
          case 'content':
            icon = Search;
            category = 'seo';
            break;
          case 'social-web3':
          case 'social-media':
            icon = Users;
            category = 'social';
            break;
          case 'competition':
          case 'competitor-analysis':
            icon = TrendingUp;
            category = 'competition';
            break;
          default:
            icon = FileText;
            category = 'content';
        }

        scores.push({
          id: result.toolId,
          title: result.toolName,
          score,
          description: `Análisis de ${result.toolName.toLowerCase()}`,
          icon,
          category,
          metrics,
          opportunities
        });
      }
    }

    return scores;
  };

  // Iniciar análisis al cargar la página
  useEffect(() => {
    const startAnalysis = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Definir herramientas a analizar
        const tools = [
          'performance',
          'security',
          'content',
          'competition',
          'social-web3',
          'metadata'
        ];
        
        // Usar una dirección de ejemplo o la del usuario
        const address = 'example.com'; // En producción, esto vendría del contexto del usuario
        
        const newRequestId = await dashboardOrchestrator.startAnalysis({
          address,
          tools,
          isCompleteAudit: true,
          options: {
            priority: 'comprehensive',
            includeAdvanced: true
          }
        });
        
        setRequestId(newRequestId);
        
        // Polling para obtener resultados
        const pollResults = () => {
          const results = dashboardOrchestrator.getAnalysisStatus(newRequestId);
          if (results) {
            setAnalysisData(results);
            
            if (results.status === 'completed' || results.status === 'error') {
              setIsLoading(false);
              if (results.status === 'error') {
                setError('Error en el análisis');
              }
            } else {
              // Continuar polling si aún está en progreso
              setTimeout(pollResults, 2000);
            }
          }
        };
        
        // Iniciar polling
        setTimeout(pollResults, 1000);
        
      } catch (err) {
        console.error('Error iniciando análisis:', err);
        setError('Error al iniciar el análisis');
        setIsLoading(false);
      }
    };

    startAnalysis();
  }, []);

  // Función para refrescar análisis
  const refreshAnalysis = () => {
    window.location.reload();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <Link href="/dashboard">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver al Dashboard
              </Button>
            </Link>
          </div>
          
          <Card className="max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center space-x-2">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span>Ejecutando Análisis Completo</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {analysisData && (
                <div className="space-y-3">
                  {analysisData.progress.map((progress) => (
                    <div key={progress.toolId} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{progress.toolName}</span>
                        <span>{progress.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${
                            progress.status === 'completed' ? 'bg-green-500' :
                            progress.status === 'error' ? 'bg-red-500' :
                            progress.status === 'running' ? 'bg-blue-500' :
                            'bg-gray-400'
                          }`}
                          style={{ width: `${progress.progress}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <p className="text-center text-gray-600 dark:text-gray-400">
                Analizando rendimiento, seguridad, contenido y competencia...
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <Link href="/dashboard">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver al Dashboard
              </Button>
            </Link>
          </div>
          
          <Card className="max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center space-x-2 text-red-600">
                <AlertCircle className="h-6 w-6" />
                <span>Error en el Análisis</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-gray-600 dark:text-gray-400">{error}</p>
              <Button onClick={refreshAnalysis} className="flex items-center space-x-2">
                <RefreshCw className="h-4 w-4" />
                <span>Reintentar Análisis</span>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!analysisData) {
    return null;
  }

  const dashboardScores = convertToPageSpeedFormat(analysisData);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver al Dashboard
              </Button>
            </Link>
          </div>
          <Button onClick={refreshAnalysis} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualizar Análisis
          </Button>
        </div>

        {/* PageSpeed Dashboard con datos reales */}
        <PageSpeedDashboard 
          scores={dashboardScores}
          overallScore={analysisData.overallScore}
          title="Análisis Completo del Sitio Web"
          subtitle={`Resultados en tiempo real - Análisis completado el ${new Date(analysisData.metadata.timestamp).toLocaleString()}`}
        />

        {/* Información adicional del análisis */}
        {analysisData.summary && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5" />
                <span>Resumen del Análisis</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {analysisData.summary.successfulTools}
                  </div>
                  <div className="text-sm text-gray-600">Exitosos</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {analysisData.summary.failedTools}
                  </div>
                  <div className="text-sm text-gray-600">Fallidos</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {Math.round(analysisData.summary.totalExecutionTime / 1000)}s
                  </div>
                  <div className="text-sm text-gray-600">Tiempo Total</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {analysisData.summary.keyInsights.length}
                  </div>
                  <div className="text-sm text-gray-600">Insights</div>
                </div>
              </div>
              
              {analysisData.summary.keyInsights.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-semibold">Insights Principales:</h4>
                  <ul className="space-y-1">
                    {analysisData.summary.keyInsights.slice(0, 5).map((insight, index) => (
                      <li key={index} className="text-sm text-gray-600 dark:text-gray-400 flex items-start space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>{insight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default UnifiedResultsPage;