'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Zap, 
  Shield, 
  Brain,
  Globe,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';

interface AIAnalysisResult {
  id: string;
  type: string;
  timestamp: Date;
  data: any;
  overallScore: number;
  riskLevel: string;
  opportunities: string[];
  predictions: {
    trafficGrowth: number;
    conversionImprovement: number;
    timeframe: string;
    confidence: number;
  };
  vulnerabilities: Array<{
    severity: string;
    description: string;
    recommendation: string;
  }>;
  blockchainMetrics: {
    gasOptimization: number;
    smartContractEfficiency: number;
    web3Integration: number;
  };
  competitorAnalysis: {
    position: number;
    gaps: string[];
    opportunities: string[];
  };
  recommendations: Array<{
    action: string;
    priority: string;
    impact: string;
    effort: string;
    roi: string;
  }>;
  aiInsights: {
    sentiment: number;
    contentQuality: number;
    userExperience: number;
    technicalDebt: number;
  };
  marketTrends: {
    industry: string;
    trendScore: number;
    emergingKeywords: string[];
  };
}

interface IndexerAnalysisResult {
  overallScore: number;
  web3Seo: number;
  smartContractSeo: number;
  dappPerformance: number;
  blockchainMetrics: number;
  opportunities: string[];
  diagnostics: string[];
}

interface ScoreCardProps {
  specialResults: AIAnalysisResult | null;
  indexerResults: IndexerAnalysisResult | null;
  analysisType: string;
}

const getScoreColor = (score: number) => {
  if (score >= 80) return 'text-green-600';
  if (score >= 60) return 'text-yellow-600';
  return 'text-red-600';
};

const getScoreBgColor = (score: number) => {
  if (score >= 80) return 'bg-green-100 dark:bg-green-900 border-green-200 dark:border-green-800';
  if (score >= 60) return 'bg-yellow-100 dark:bg-yellow-900 border-yellow-200 dark:border-yellow-800';
  return 'bg-red-100 dark:bg-red-900 border-red-200 dark:border-red-800';
};

const getRiskLevelColor = (level: string) => {
  switch (level.toLowerCase()) {
    case 'bajo': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    case 'medio': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    case 'alto': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
  }
};

const getScoreIcon = (score: number) => {
  if (score >= 80) return <CheckCircle className="h-5 w-5 text-green-600" />;
  if (score >= 60) return <Clock className="h-5 w-5 text-yellow-600" />;
  return <AlertTriangle className="h-5 w-5 text-red-600" />;
};

const getTrendIcon = (value: number) => {
  return value > 0 ? 
    <TrendingUp className="h-4 w-4 text-green-600" /> : 
    <TrendingDown className="h-4 w-4 text-red-600" />;
};

export function ScoreCard({ specialResults, indexerResults, analysisType }: ScoreCardProps) {
  if (!specialResults || !indexerResults) {
    return null;
  }

  const mainMetrics = [
    {
      title: 'Puntuación General',
      value: specialResults.overallScore,
      icon: <Target className="h-5 w-5" />,
      description: 'Evaluación global del proyecto'
    },
    {
      title: 'SEO Web3',
      value: indexerResults.web3Seo,
      icon: <Globe className="h-5 w-5" />,
      description: 'Optimización para búsquedas Web3'
    },
    {
      title: 'Eficiencia Blockchain',
      value: specialResults.blockchainMetrics.smartContractEfficiency,
      icon: <Zap className="h-5 w-5" />,
      description: 'Rendimiento de contratos inteligentes'
    },
    {
      title: 'Seguridad',
      value: Math.max(0, 100 - (specialResults.vulnerabilities.length * 20)),
      icon: <Shield className="h-5 w-5" />,
      description: 'Nivel de seguridad del proyecto'
    }
  ];

  const aiMetrics = [
    {
      title: 'Sentimiento',
      value: specialResults.aiInsights.sentiment,
      description: 'Análisis de percepción'
    },
    {
      title: 'Calidad Contenido',
      value: specialResults.aiInsights.contentQuality,
      description: 'Evaluación del contenido'
    },
    {
      title: 'Experiencia Usuario',
      value: specialResults.aiInsights.userExperience,
      description: 'UX y usabilidad'
    },
    {
      title: 'Salud Técnica',
      value: 100 - specialResults.aiInsights.technicalDebt,
      description: 'Estado técnico del proyecto'
    }
  ];

  const blockchainMetrics = [
    {
      title: 'Optimización Gas',
      value: specialResults.blockchainMetrics.gasOptimization,
      description: 'Eficiencia en costos de gas'
    },
    {
      title: 'Integración Web3',
      value: specialResults.blockchainMetrics.web3Integration,
      description: 'Nivel de integración Web3'
    },
    {
      title: 'Performance DApp',
      value: indexerResults.dappPerformance,
      description: 'Rendimiento de la aplicación'
    },
    {
      title: 'Métricas Blockchain',
      value: indexerResults.blockchainMetrics,
      description: 'Métricas generales blockchain'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Métricas Principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {mainMetrics.map((metric, index) => (
          <Card key={index} className={`${getScoreBgColor(metric.value)} border-2`}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className={getScoreColor(metric.value)}>
                  {metric.icon}
                </div>
                {getScoreIcon(metric.value)}
              </div>
              <div className={`text-2xl font-bold ${getScoreColor(metric.value)} mb-1`}>
                {metric.value}
              </div>
              <div className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
                {metric.title}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                {metric.description}
              </div>
              <Progress value={metric.value} className="mt-2 h-1" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Resumen Ejecutivo */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-600" />
            Resumen Ejecutivo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Puntuación y Riesgo */}
            <div className="space-y-4">
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className={`text-3xl font-bold ${getScoreColor(specialResults.overallScore)} mb-2`}>
                  {specialResults.overallScore}/100
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Puntuación General</div>
                <Badge className={getRiskLevelColor(specialResults.riskLevel)}>
                  Riesgo {specialResults.riskLevel}
                </Badge>
              </div>
            </div>

            {/* Predicciones */}
            <div className="space-y-3">
              <h4 className="font-medium text-sm text-gray-900 dark:text-gray-100">Predicciones</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Crecimiento Tráfico</span>
                  <div className="flex items-center gap-1">
                    {getTrendIcon(specialResults.predictions.trafficGrowth)}
                    <span className="text-sm font-medium text-green-600">
                      +{specialResults.predictions.trafficGrowth}%
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Mejora Conversión</span>
                  <div className="flex items-center gap-1">
                    {getTrendIcon(specialResults.predictions.conversionImprovement)}
                    <span className="text-sm font-medium text-green-600">
                      +{specialResults.predictions.conversionImprovement}%
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Confianza</span>
                  <span className="text-sm font-medium">
                    {specialResults.predictions.confidence}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Plazo</span>
                  <span className="text-sm font-medium">
                    {specialResults.predictions.timeframe}
                  </span>
                </div>
              </div>
            </div>

            {/* Posición Competitiva */}
            <div className="space-y-3">
              <h4 className="font-medium text-sm text-gray-900 dark:text-gray-100">Posición Competitiva</h4>
              <div className="text-center p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                <div className="text-2xl font-bold text-blue-600 mb-1">
                  #{specialResults.competitorAnalysis.position}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  en {specialResults.marketTrends.industry}
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm font-medium mb-1">Tendencia del Mercado</div>
                <div className={`text-lg font-bold ${getScoreColor(specialResults.marketTrends.trendScore)}`}>
                  {specialResults.marketTrends.trendScore}/100
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Métricas de IA */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-600" />
            Análisis de IA
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {aiMetrics.map((metric, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{metric.title}</span>
                  <span className={`text-sm font-bold ${getScoreColor(metric.value)}`}>
                    {metric.value}%
                  </span>
                </div>
                <Progress value={metric.value} className="h-2" />
                <p className="text-xs text-gray-600 dark:text-gray-400">{metric.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Métricas Blockchain */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-yellow-600" />
            Métricas Blockchain
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {blockchainMetrics.map((metric, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{metric.title}</span>
                  <span className={`text-sm font-bold ${getScoreColor(metric.value)}`}>
                    {metric.value}%
                  </span>
                </div>
                <Progress value={metric.value} className="h-2" />
                <p className="text-xs text-gray-600 dark:text-gray-400">{metric.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Oportunidades y Diagnósticos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Oportunidades */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              Oportunidades Principales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {specialResults.opportunities.slice(0, 4).map((opportunity, index) => (
                <div key={index} className="flex items-start gap-2 p-2 bg-green-50 dark:bg-green-950 rounded">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{opportunity}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Diagnósticos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-600" />
              Diagnósticos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {indexerResults.diagnostics.slice(0, 4).map((diagnostic, index) => (
                <div key={index} className="flex items-start gap-2 p-2 bg-blue-50 dark:bg-blue-950 rounded">
                  <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{diagnostic}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ROI Estimado */}
      {specialResults.recommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-green-600" />
              ROI Estimado de Recomendaciones
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {specialResults.recommendations.slice(0, 3).map((rec, index) => {
                const roi = parseInt(rec.roi.replace(/[^0-9]/g, ''));
                return (
                  <div key={index} className="text-center p-4 bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-950 dark:to-blue-950 rounded-lg border">
                    <div className="text-2xl font-bold text-green-600 mb-1">
                      ${roi.toLocaleString()}
                    </div>
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
                      {rec.action}
                    </div>
                    <Badge className={getRiskLevelColor(rec.priority)}>
                      {rec.priority}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}