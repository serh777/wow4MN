'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle, 
  Target, 
  Zap, 
  Shield, 
  Brain,
  Copy,
  Download
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';

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

interface AnalysisResultsProps {
  response: string | null;
  specialResults: AIAnalysisResult | null;
  indexerResults: IndexerAnalysisResult | null;
  analysisType: string;
  loading: boolean;
  analysisProgress: number;
  indexerProgress: number;
  currentAnalysisStep: string;
  error: string | null;
}

const getScoreColor = (score: number) => {
  if (score >= 80) return 'text-green-600';
  if (score >= 60) return 'text-yellow-600';
  return 'text-red-600';
};

const getScoreBgColor = (score: number) => {
  if (score >= 80) return 'bg-green-100 dark:bg-green-900';
  if (score >= 60) return 'bg-yellow-100 dark:bg-yellow-900';
  return 'bg-red-100 dark:bg-red-900';
};

const getProgressBarColor = (score: number) => {
  if (score >= 80) return 'bg-green-500';
  if (score >= 60) return 'bg-yellow-500';
  return 'bg-red-500';
};

const getProgressBarGradient = (score: number) => {
  if (score >= 80) return 'bg-gradient-to-r from-green-400 to-green-600';
  if (score >= 60) return 'bg-gradient-to-r from-yellow-400 to-yellow-600';
  return 'bg-gradient-to-r from-red-400 to-red-600';
};

// Componente Progress personalizado con colores dinámicos
const DynamicProgress = ({ value, className }: { value: number; className?: string }) => {
  const getProgressBarClass = (score: number) => {
    if (score >= 80) return 'progress-bar-green';
    if (score >= 60) return 'progress-bar-yellow';
    return 'progress-bar-red';
  };
  
  return (
    <div className={cn("relative h-2 w-full overflow-hidden rounded-full bg-secondary", className)}>
      <div 
        className={cn("h-full rounded-full progress-bar-animated", getProgressBarClass(value))}
        data-progress={value || 0}
      />
    </div>
  );
};

const getRiskLevelColor = (level: string) => {
  switch (level.toLowerCase()) {
    case 'bajo': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    case 'medio': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    case 'alto': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority.toLowerCase()) {
    case 'alta': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    case 'media': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    case 'baja': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
  }
};

const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text);
};

const downloadReport = (content: string, filename: string) => {
  const blob = new Blob([content], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export function AnalysisResults({
  response,
  specialResults,
  indexerResults,
  analysisType,
  loading,
  analysisProgress,
  indexerProgress,
  currentAnalysisStep,
  error
}: AnalysisResultsProps) {
  if (error) {
    return (
      <Card className="w-full border-red-200 dark:border-red-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            Error en el Análisis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-600 dark:text-red-400">{error}</p>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-blue-600 animate-pulse" />
              Análisis en Progreso
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Análisis IA</span>
                <span>{Math.round(analysisProgress)}%</span>
              </div>
              <Progress value={analysisProgress} className="h-2" />
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Datos del Indexador</span>
                <span>{Math.round(indexerProgress)}%</span>
              </div>
              <Progress value={indexerProgress} className="h-2" />
            </div>
            
            {currentAnalysisStep && (
              <p className="text-sm text-gray-600 dark:text-gray-400 animate-pulse">
                {currentAnalysisStep}
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!response && !specialResults) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Resumen Ejecutivo */}
      {specialResults && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-blue-600" />
                Resumen Ejecutivo
              </CardTitle>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => response && copyToClipboard(response)}
                >
                  <Copy className="h-4 w-4 mr-1" />
                  Copiar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => response && downloadReport(response, `analisis-ia-${Date.now()}.md`)}
                >
                  <Download className="h-4 w-4 mr-1" />
                  Descargar
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className={`p-4 rounded-lg ${getScoreBgColor(specialResults.overallScore)}`}>
                <div className="text-center">
                  <div className={`text-3xl font-bold ${getScoreColor(specialResults.overallScore)}`}>
                    {specialResults.overallScore}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Puntuación General</div>
                </div>
              </div>
              
              <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                <div className="text-center">
                  <Badge className={getRiskLevelColor(specialResults.riskLevel)}>
                    {specialResults.riskLevel}
                  </Badge>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">Nivel de Riesgo</div>
                </div>
              </div>
              
              <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    +{specialResults.predictions.trafficGrowth}%
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Crecimiento Proyectado</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Métricas Blockchain */}
      {specialResults && indexerResults && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-600" />
              Métricas Blockchain
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">SEO Web3</span>
                  <span className={`text-sm font-medium ${getScoreColor(indexerResults.web3Seo)}`}>
                    {indexerResults.web3Seo}%
                  </span>
                </div>
                <DynamicProgress value={indexerResults.web3Seo} />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Eficiencia Contratos</span>
                  <span className={`text-sm font-medium ${getScoreColor(specialResults.blockchainMetrics.smartContractEfficiency)}`}>
                    {specialResults.blockchainMetrics.smartContractEfficiency}%
                  </span>
                </div>
                <DynamicProgress value={specialResults.blockchainMetrics.smartContractEfficiency} />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Optimización Gas</span>
                  <span className={`text-sm font-medium ${getScoreColor(specialResults.blockchainMetrics.gasOptimization)}`}>
                    {specialResults.blockchainMetrics.gasOptimization}%
                  </span>
                </div>
                <DynamicProgress value={specialResults.blockchainMetrics.gasOptimization} />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Integración Web3</span>
                  <span className={`text-sm font-medium ${getScoreColor(specialResults.blockchainMetrics.web3Integration)}`}>
                    {specialResults.blockchainMetrics.web3Integration}%
                  </span>
                </div>
                <DynamicProgress value={specialResults.blockchainMetrics.web3Integration} />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recomendaciones */}
      {specialResults && specialResults.recommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Recomendaciones Prioritarias
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {specialResults.recommendations.map((rec, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium">{rec.action}</h4>
                    <Badge className={getPriorityColor(rec.priority)}>
                      {rec.priority}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{rec.impact}</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Esfuerzo:</span>
                      <span className="ml-1 font-medium">{rec.effort}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">ROI:</span>
                      <span className="ml-1 font-medium text-green-600">${rec.roi}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Vulnerabilidades */}
      {specialResults && specialResults.vulnerabilities.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-red-600" />
              Análisis de Seguridad
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {specialResults.vulnerabilities.map((vuln, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium">{vuln.description}</h4>
                    <Badge className={getPriorityColor(vuln.severity)}>
                      {vuln.severity}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <strong>Recomendación:</strong> {vuln.recommendation}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Insights de IA */}
      {specialResults && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-purple-600" />
              Insights de IA
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Sentimiento</span>
                  <span className={`text-sm font-medium ${getScoreColor(specialResults.aiInsights.sentiment)}`}>
                    {specialResults.aiInsights.sentiment}%
                  </span>
                </div>
                <DynamicProgress value={specialResults.aiInsights.sentiment} />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Calidad Contenido</span>
                  <span className={`text-sm font-medium ${getScoreColor(specialResults.aiInsights.contentQuality)}`}>
                    {specialResults.aiInsights.contentQuality}%
                  </span>
                </div>
                <DynamicProgress value={specialResults.aiInsights.contentQuality} />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">UX</span>
                  <span className={`text-sm font-medium ${getScoreColor(specialResults.aiInsights.userExperience)}`}>
                    {specialResults.aiInsights.userExperience}%
                  </span>
                </div>
                <DynamicProgress value={specialResults.aiInsights.userExperience} />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Deuda Técnica</span>
                  <span className={`text-sm font-medium ${getScoreColor(100 - specialResults.aiInsights.technicalDebt)}`}>
                    {specialResults.aiInsights.technicalDebt}%
                  </span>
                </div>
                <DynamicProgress value={specialResults.aiInsights.technicalDebt} />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Análisis Completo */}
      {response && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-blue-600" />
              Análisis Completo IA
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <ReactMarkdown>{response}</ReactMarkdown>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}