'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import { TrendingUp, Target, Zap, Shield, Brain, Globe } from 'lucide-react';

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

interface VisualizationProps {
  specialResults: AIAnalysisResult | null;
  indexerResults: IndexerAnalysisResult | null;
  analysisType: string;
}

const COLORS = {
  primary: '#3B82F6',
  secondary: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  purple: '#8B5CF6',
  teal: '#14B8A6'
};

const PIE_COLORS = [COLORS.primary, COLORS.secondary, COLORS.warning, COLORS.danger];

export function Visualization({ specialResults, indexerResults, analysisType }: VisualizationProps) {
  if (!specialResults || !indexerResults) {
    return null;
  }

  // Datos para el gráfico de barras de métricas blockchain
  const blockchainData = [
    {
      name: 'SEO Web3',
      value: indexerResults.web3Seo,
      color: COLORS.primary
    },
    {
      name: 'Contratos',
      value: specialResults.blockchainMetrics.smartContractEfficiency,
      color: COLORS.secondary
    },
    {
      name: 'Gas',
      value: specialResults.blockchainMetrics.gasOptimization,
      color: COLORS.warning
    },
    {
      name: 'Web3',
      value: specialResults.blockchainMetrics.web3Integration,
      color: COLORS.purple
    }
  ];

  // Datos para el gráfico de radar de insights de IA
  const radarData = [
    {
      subject: 'Sentimiento',
      value: specialResults.aiInsights.sentiment,
      fullMark: 100
    },
    {
      subject: 'Contenido',
      value: specialResults.aiInsights.contentQuality,
      fullMark: 100
    },
    {
      subject: 'UX',
      value: specialResults.aiInsights.userExperience,
      fullMark: 100
    },
    {
      subject: 'Técnico',
      value: 100 - specialResults.aiInsights.technicalDebt,
      fullMark: 100
    }
  ];

  // Datos para el gráfico de líneas de predicciones
  const predictionData = [
    { month: 'Actual', traffic: 100, conversion: 100 },
    { month: 'Mes 1', traffic: 110, conversion: 105 },
    { month: 'Mes 2', traffic: 125, conversion: 112 },
    { month: 'Mes 3', traffic: 100 + specialResults.predictions.trafficGrowth, conversion: 100 + specialResults.predictions.conversionImprovement },
    { month: 'Mes 6', traffic: 100 + specialResults.predictions.trafficGrowth * 1.2, conversion: 100 + specialResults.predictions.conversionImprovement * 1.1 }
  ];

  // Datos para el gráfico de pastel de vulnerabilidades
  const vulnerabilityData = specialResults.vulnerabilities.reduce((acc, vuln) => {
    const existing = acc.find(item => item.name === vuln.severity);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ name: vuln.severity, value: 1 });
    }
    return acc;
  }, [] as Array<{ name: string; value: number }>);

  // Datos para el gráfico de ROI de recomendaciones
  const roiData = specialResults.recommendations.map((rec, index) => ({
    name: `Rec ${index + 1}`,
    roi: parseInt(rec.roi.replace(/[^0-9]/g, '')),
    priority: rec.priority
  })).sort((a, b) => b.roi - a.roi).slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Métricas Blockchain */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-yellow-600" />
            Métricas Blockchain
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={blockchainData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 100]} />
                <Tooltip 
                  formatter={(value) => [`${value}%`, 'Puntuación']}
                  labelStyle={{ color: '#374151' }}
                  contentStyle={{ 
                    backgroundColor: '#F9FAFB', 
                    border: '1px solid #E5E7EB',
                    borderRadius: '6px'
                  }}
                />
                <Bar dataKey="value" fill={COLORS.primary} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Insights de IA - Radar Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-600" />
            Análisis de IA
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis angle={90} domain={[0, 100]} />
                <Radar
                  name="Puntuación"
                  dataKey="value"
                  stroke={COLORS.purple}
                  fill={COLORS.purple}
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
                <Tooltip 
                  formatter={(value) => [`${value}%`, 'Puntuación']}
                  labelStyle={{ color: '#374151' }}
                  contentStyle={{ 
                    backgroundColor: '#F9FAFB', 
                    border: '1px solid #E5E7EB',
                    borderRadius: '6px'
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Predicciones de Crecimiento */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
            Predicciones de Crecimiento
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">+{specialResults.predictions.trafficGrowth}%</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Tráfico</div>
              </div>
              <div className="text-center p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                <div className="text-2xl font-bold text-green-600">+{specialResults.predictions.conversionImprovement}%</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Conversión</div>
              </div>
              <div className="text-center p-3 bg-purple-50 dark:bg-purple-950 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{specialResults.predictions.confidence}%</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Confianza</div>
              </div>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={predictionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip 
                  formatter={(value, name) => [`${value}%`, name === 'traffic' ? 'Tráfico' : 'Conversión']}
                  labelStyle={{ color: '#374151' }}
                  contentStyle={{ 
                    backgroundColor: '#F9FAFB', 
                    border: '1px solid #E5E7EB',
                    borderRadius: '6px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="traffic" 
                  stroke={COLORS.primary} 
                  strokeWidth={3}
                  dot={{ fill: COLORS.primary, strokeWidth: 2, r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="conversion" 
                  stroke={COLORS.secondary} 
                  strokeWidth={3}
                  dot={{ fill: COLORS.secondary, strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* ROI de Recomendaciones */}
      {roiData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-green-600" />
              ROI de Recomendaciones
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={roiData} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={60} />
                  <Tooltip 
                    formatter={(value) => [`$${value.toLocaleString()}`, 'ROI Estimado']}
                    labelStyle={{ color: '#374151' }}
                    contentStyle={{ 
                      backgroundColor: '#F9FAFB', 
                      border: '1px solid #E5E7EB',
                      borderRadius: '6px'
                    }}
                  />
                  <Bar dataKey="roi" fill={COLORS.secondary} radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Distribución de Vulnerabilidades */}
      {vulnerabilityData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-red-600" />
              Distribución de Vulnerabilidades
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={vulnerabilityData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${percent ? (percent * 100).toFixed(0) : 0}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {vulnerabilityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => [value, 'Cantidad']}
                    labelStyle={{ color: '#374151' }}
                    contentStyle={{ 
                      backgroundColor: '#F9FAFB', 
                      border: '1px solid #E5E7EB',
                      borderRadius: '6px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Análisis Competitivo */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-blue-600" />
            Posición Competitiva
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-center p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 rounded-lg">
              <div className="text-4xl font-bold text-blue-600 mb-2">
                #{specialResults.competitorAnalysis.position}
              </div>
              <div className="text-lg text-gray-600 dark:text-gray-400">
                Posición en el Mercado
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                {specialResults.marketTrends.industry}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2 text-red-600">Brechas Identificadas</h4>
                <ul className="space-y-1">
                  {specialResults.competitorAnalysis.gaps.map((gap, index) => (
                    <li key={index} className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2">
                      <span className="text-red-500 mt-1">•</span>
                      {gap}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium mb-2 text-green-600">Oportunidades</h4>
                <ul className="space-y-1">
                  {specialResults.competitorAnalysis.opportunities.map((opp, index) => (
                    <li key={index} className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2">
                      <span className="text-green-500 mt-1">•</span>
                      {opp}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tendencias del Mercado */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-purple-600" />
            Tendencias del Mercado
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Puntuación de Tendencia</span>
              <span className="text-lg font-bold text-purple-600">
                {specialResults.marketTrends.trendScore}/100
              </span>
            </div>
            <Progress value={specialResults.marketTrends.trendScore} className="h-3" />
            
            <div>
              <h4 className="font-medium mb-2">Palabras Clave Emergentes</h4>
              <div className="flex flex-wrap gap-2">
                {specialResults.marketTrends.emergingKeywords.map((keyword, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {keyword}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}