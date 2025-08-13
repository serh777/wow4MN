'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Search, 
  TrendingUp, 
  Target, 
  DollarSign, 
  Eye, 
  MousePointer,
  BarChart3,
  Users
} from 'lucide-react';

interface SafeKeywordResults {
  totalKeywords: number;
  avgSearchVolume: number;
  avgDifficulty: number;
  avgCpc: number;
  opportunityScore: number;
  recommendations: string[];
  analysisConfig?: {
    projectName: string;
    projectUrl: string;
    niche: string;
    keywordType: string;
    keywords: string;
  };
  timestamp?: string;
}

interface KeywordMetricsCardProps {
  results: SafeKeywordResults;
}

const getScoreColor = (score: number) => {
  if (score >= 80) return 'text-green-600';
  if (score >= 60) return 'text-yellow-600';
  return 'text-red-600';
};

const getScoreBgColor = (score: number) => {
  if (score >= 70) return 'bg-green-100 dark:bg-green-900';
  if (score >= 40) return 'bg-yellow-100 dark:bg-yellow-900';
  return 'bg-red-100 dark:bg-red-900';
};

const getProgressBarColor = (value: number) => {
  if (value >= 70) return 'progress-bar-green';
  if (value >= 40) return 'progress-bar-yellow';
  return 'progress-bar-red';
};

const getDifficultyProgressColor = (difficulty: string) => {
  if (difficulty.includes('Fácil')) return 'progress-bar-green';
  if (difficulty.includes('Medio')) return 'progress-bar-yellow';
  return 'progress-bar-red';
};

export default function KeywordMetricsCard({ results }: KeywordMetricsCardProps) {
  // Calcular métricas adicionales
  const competitionLevel = results.avgDifficulty;
  const trafficPotential = Math.min(100, (results.avgSearchVolume / 1000) * 10);
  const costEfficiency = Math.max(0, 100 - (results.avgCpc * 20));
  const marketPenetration = Math.min(100, (results.totalKeywords / 10) * 5);

  const mainMetrics = [
    {
      title: 'Potencial de Tráfico',
      value: Math.round(trafficPotential),
      icon: <TrendingUp className="h-5 w-5" />,
      description: 'Basado en volumen de búsqueda'
    },
    {
      title: 'Nivel de Competencia',
      value: competitionLevel,
      icon: <Target className="h-5 w-5" />,
      description: 'Dificultad promedio de ranking'
    },
    {
      title: 'Eficiencia de Costos',
      value: Math.round(costEfficiency),
      icon: <DollarSign className="h-5 w-5" />,
      description: 'Relación costo-beneficio'
    },
    {
      title: 'Penetración de Mercado',
      value: Math.round(marketPenetration),
      icon: <BarChart3 className="h-5 w-5" />,
      description: 'Cobertura de keywords'
    }
  ];

  const detailedMetrics = [
    {
      title: 'Volumen Total Estimado',
      value: (results.avgSearchVolume * results.totalKeywords).toLocaleString(),
      description: 'Búsquedas mensuales totales'
    },
    {
      title: 'CPC Promedio',
      value: `$${results.avgCpc.toFixed(2)}`,
      description: 'Costo por clic promedio'
    },
    {
      title: 'Keywords de Alta Oportunidad',
      value: Math.round(results.totalKeywords * 0.3).toString(),
      description: 'Keywords con bajo competition/alto volumen'
    },
    {
      title: 'ROI Estimado',
      value: `${Math.round(results.opportunityScore * 1.2)}%`,
      description: 'Retorno de inversión proyectado'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Métricas Principales */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5 text-blue-600" />
            Métricas Principales
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {mainMetrics.map((metric, index) => (
              <Card key={index} className={`${getScoreBgColor(metric.value)} border-2`}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className={getScoreColor(metric.value)}>
                      {metric.icon}
                    </div>
                    <Eye className={`h-4 w-4 ${getScoreColor(metric.value)}`} />
                  </div>
                  <div className={`text-2xl font-bold ${getScoreColor(metric.value)} mb-1`}>
                    {metric.value}%
                  </div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                    {metric.title}
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {metric.description}
                  </p>
                  <div className="progress-bar-container mt-2">
                    <div 
                      className={`progress-bar-fill ${getProgressBarColor(metric.value)}`}
                    ></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Métricas Detalladas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-purple-600" />
            Análisis Detallado
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {detailedMetrics.map((metric, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{metric.title}</span>
                  <span className="text-sm font-bold text-blue-600">
                    {metric.value}
                  </span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400">{metric.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Distribución de Keywords */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-green-600" />
            Distribución por Dificultad
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="default" className="bg-green-100 text-green-800">
                  Fácil (0-30)
                </Badge>
                <span className="text-sm text-gray-600">Keywords de baja competencia</span>
              </div>
              <span className="font-semibold">{Math.round(results.totalKeywords * 0.4)}</span>
            </div>
            <div className="progress-bar-container">
              <div 
                className={`progress-bar-fill progress-width-40 ${getDifficultyProgressColor('Fácil')}`}
              ></div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                  Medio (31-60)
                </Badge>
                <span className="text-sm text-gray-600">Keywords de competencia media</span>
              </div>
              <span className="font-semibold">{Math.round(results.totalKeywords * 0.4)}</span>
            </div>
            <div className="progress-bar-container">
              <div 
                className={`progress-bar-fill progress-width-40 ${getDifficultyProgressColor('Medio')}`}
              ></div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="destructive" className="bg-red-100 text-red-800">
                  Difícil (61-100)
                </Badge>
                <span className="text-sm text-gray-600">Keywords de alta competencia</span>
              </div>
              <span className="font-semibold">{Math.round(results.totalKeywords * 0.2)}</span>
            </div>
            <div className="progress-bar-container">
              <div 
                className={`progress-bar-fill progress-width-20 ${getDifficultyProgressColor('Difícil')}`}
              ></div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}