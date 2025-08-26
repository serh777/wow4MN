'use client';

import React, { memo, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, TrendingDown, AlertTriangle, CheckCircle2, 
  Clock, Target, Zap, Shield, BarChart3, Eye,
  ArrowUp, ArrowDown, Minus
} from 'lucide-react';
import { ToolResult } from './dynamic-results-renderer';

export interface ExecutiveSummaryProps {
  results: ToolResult[];
  className?: string;
}

interface SummaryMetrics {
  overallScore: number;
  totalIssues: number;
  criticalIssues: number;
  completedTools: number;
  totalTools: number;
  topInsights: string[];
  priorityRecommendations: string[];
  scoreDistribution: { [key: string]: number };
  categoryScores: { [key: string]: number };
  trends: { [key: string]: 'up' | 'down' | 'stable' };
}

const ExecutiveSummary = memo<ExecutiveSummaryProps>(function ExecutiveSummary({
  results,
  className = ''
}) {
  // Calcular métricas del resumen ejecutivo
  const metrics = useMemo((): SummaryMetrics => {
    const completedResults = results.filter(r => r.status === 'completed');
    const totalTools = results.length;
    const completedTools = completedResults.length;
    
    // Calcular puntuación general
    const scores = completedResults
      .map(r => r.score)
      .filter((score): score is number => score !== undefined);
    const overallScore = scores.length > 0 
      ? Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length)
      : 0;
    
    // Contar issues
    let totalIssues = 0;
    let criticalIssues = 0;
    
    completedResults.forEach(result => {
      if (result.metrics) {
        // Buscar métricas relacionadas con issues
        Object.entries(result.metrics).forEach(([key, value]) => {
          if (key.toLowerCase().includes('issue') || 
              key.toLowerCase().includes('vulnerability') ||
              key.toLowerCase().includes('error')) {
            if (typeof value === 'number') {
              totalIssues += value;
              if (key.toLowerCase().includes('critical') || 
                  key.toLowerCase().includes('high')) {
                criticalIssues += value;
              }
            }
          }
        });
      }
    });
    
    // Extraer top insights (máximo 3)
    const allInsights = completedResults
      .flatMap(r => r.insights || [])
      .filter(insight => insight.length > 10) // Filtrar insights muy cortos
      .slice(0, 3);
    
    // Extraer recomendaciones prioritarias (máximo 3)
    const allRecommendations = completedResults
      .flatMap(r => r.recommendations || [])
      .filter(rec => rec.length > 10)
      .slice(0, 3);
    
    // Distribución de puntuaciones
    const scoreDistribution = {
      excellent: scores.filter(s => s >= 90).length,
      good: scores.filter(s => s >= 70 && s < 90).length,
      fair: scores.filter(s => s >= 50 && s < 70).length,
      poor: scores.filter(s => s < 50).length
    };
    
    // Puntuaciones por categoría
    const categoryScores: { [key: string]: number } = {};
    const categoryGroups: { [key: string]: number[] } = {};
    
    completedResults.forEach(result => {
      const category = getCategoryFromToolId(result.toolId);
      if (result.score !== undefined) {
        if (!categoryGroups[category]) {
          categoryGroups[category] = [];
        }
        categoryGroups[category].push(result.score);
      }
    });
    
    Object.entries(categoryGroups).forEach(([category, scores]) => {
      categoryScores[category] = Math.round(
        scores.reduce((sum, score) => sum + score, 0) / scores.length
      );
    });
    
    // Tendencias (simuladas por ahora)
    const trends: { [key: string]: 'up' | 'down' | 'stable' } = {
      security: overallScore > 75 ? 'up' : overallScore < 50 ? 'down' : 'stable',
      performance: overallScore > 80 ? 'up' : overallScore < 60 ? 'down' : 'stable',
      quality: overallScore > 70 ? 'up' : overallScore < 55 ? 'down' : 'stable'
    };
    
    return {
      overallScore,
      totalIssues,
      criticalIssues,
      completedTools,
      totalTools,
      topInsights: allInsights,
      priorityRecommendations: allRecommendations,
      scoreDistribution,
      categoryScores,
      trends
    };
  }, [results]);
  
  // Función auxiliar para obtener categoría desde toolId
  const getCategoryFromToolId = (toolId: string): string => {
    if (toolId.includes('security')) return 'Seguridad';
    if (toolId.includes('performance')) return 'Rendimiento';
    if (toolId.includes('nft') || toolId.includes('blockchain')) return 'Blockchain';
    if (toolId.includes('content') || toolId.includes('seo')) return 'Contenido';
    if (toolId.includes('social')) return 'Social';
    return 'General';
  };
  
  // Función para obtener color de score
  const getScoreColor = (score: number): string => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-blue-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };
  
  // Función para obtener icono de tendencia
  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return <ArrowUp className="h-4 w-4 text-green-600" />;
      case 'down': return <ArrowDown className="h-4 w-4 text-red-600" />;
      case 'stable': return <Minus className="h-4 w-4 text-gray-600" />;
    }
  };
  
  return (
    <div className={`space-y-6 ${className}`}>
      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Puntuación general */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Puntuación General</p>
                <p className={`text-2xl font-bold ${getScoreColor(metrics.overallScore)}`}>
                  {metrics.overallScore}/100
                </p>
              </div>
              <div className="p-2 bg-blue-100 rounded-full">
                <BarChart3 className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <Progress value={metrics.overallScore} className="mt-2" />
          </CardContent>
        </Card>
        
        {/* Herramientas completadas */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Progreso</p>
                <p className="text-2xl font-bold text-gray-900">
                  {metrics.completedTools}/{metrics.totalTools}
                </p>
              </div>
              <div className="p-2 bg-green-100 rounded-full">
                <CheckCircle2 className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <Progress 
              value={(metrics.completedTools / metrics.totalTools) * 100} 
              className="mt-2" 
            />
          </CardContent>
        </Card>
        
        {/* Issues totales */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Issues Detectados</p>
                <p className="text-2xl font-bold text-gray-900">
                  {metrics.totalIssues}
                </p>
                {metrics.criticalIssues > 0 && (
                  <p className="text-xs text-red-600">
                    {metrics.criticalIssues} críticos
                  </p>
                )}
              </div>
              <div className="p-2 bg-yellow-100 rounded-full">
                <AlertTriangle className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Tendencia de seguridad */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tendencia</p>
                <div className="flex items-center gap-2 mt-1">
                  {getTrendIcon(metrics.trends.security)}
                  <span className="text-lg font-semibold text-gray-900">
                    Seguridad
                  </span>
                </div>
              </div>
              <div className="p-2 bg-purple-100 rounded-full">
                <Shield className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Distribución de puntuaciones */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Distribución de Puntuaciones</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {metrics.scoreDistribution.excellent}
              </div>
              <div className="text-sm text-gray-600">Excelente (90+)</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {metrics.scoreDistribution.good}
              </div>
              <div className="text-sm text-gray-600">Bueno (70-89)</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {metrics.scoreDistribution.fair}
              </div>
              <div className="text-sm text-gray-600">Regular (50-69)</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {metrics.scoreDistribution.poor}
              </div>
              <div className="text-sm text-gray-600">Deficiente (&lt;50)</div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Puntuaciones por categoría */}
      {Object.keys(metrics.categoryScores).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Puntuaciones por Categoría</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(metrics.categoryScores).map(([category, score]) => (
                <div key={category} className="flex items-center justify-between">
                  <span className="font-medium text-gray-700">{category}</span>
                  <div className="flex items-center gap-3">
                    <Progress value={score} className="w-24" />
                    <span className={`font-bold ${getScoreColor(score)}`}>
                      {score}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Insights principales */}
      {metrics.topInsights.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Insights Principales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {metrics.topInsights.map((insight, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                    {index + 1}
                  </div>
                  <p className="text-sm text-gray-700">{insight}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Recomendaciones prioritarias */}
      {metrics.priorityRecommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Target className="h-5 w-5" />
              Recomendaciones Prioritarias
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {metrics.priorityRecommendations.map((recommendation, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                  <div className="flex-shrink-0 w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                    {index + 1}
                  </div>
                  <p className="text-sm text-gray-700">{recommendation}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Estado de análisis */}
      {metrics.completedTools < metrics.totalTools && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-blue-600" />
              <div>
                <h4 className="text-sm font-medium text-blue-900">
                  Análisis en progreso
                </h4>
                <p className="text-sm text-blue-700">
                  {metrics.totalTools - metrics.completedTools} herramientas pendientes. 
                  Los resultados se actualizarán automáticamente.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
});

export default ExecutiveSummary;