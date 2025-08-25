'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { AlertTriangle, TrendingUp, Zap, Clock, DollarSign, Activity, Download, Share2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface PerformanceResults {
  contractAddress: string;
  blockchain: string;
  metrics: {
    gasEfficiency: number;
    responseTime: number;
    costEfficiency: number;
    contractEfficiency: number;
  };
  historicalData: {
    gasUsage: Array<{ date: string; value: number }>;
    transactionCount: Array<{ date: string; value: number }>;
    confirmationTime: Array<{ date: string; value: number }>;
    costPerTransaction: Array<{ date: string; value: number }>;
  };
  issues: Array<{
    type: string;
    severity: string;
    description: string;
    recommendation: string;
  }>;
  optimizations: Array<{
    title: string;
    description: string;
    impact: string;
    difficulty: string;
    gasSavings: string;
  }>;
  networkComparison: {
    gasUsed: { project: number; network: number; difference: string };
    confirmationTime: { project: number; network: number; difference: string };
  };
  score: number;
}

const generateMockResults = (): PerformanceResults => {
  const generateHistoricalData = (days: number, min: number, max: number) => {
    const data = [];
    let lastValue = min + Math.random() * (max - min);
    
    for (let i = 0; i < days; i++) {
      const change = lastValue * (Math.random() * 0.3 - 0.15);
      lastValue = Math.max(min, Math.min(max, lastValue + change));
      
      data.push({
        date: new Date(Date.now() - (days - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        value: Math.round(lastValue)
      });
    }
    
    return data;
  };

  const metrics = {
    gasEfficiency: Math.floor(Math.random() * 30) + 60,
    responseTime: Math.floor(Math.random() * 25) + 65,
    costEfficiency: Math.floor(Math.random() * 20) + 70,
    contractEfficiency: Math.floor(Math.random() * 35) + 55
  };

  return {
    contractAddress: '0x742d35Cc6634C0532925a3b8D4C9db4C8b4b8b8b',
    blockchain: 'ethereum',
    metrics,
    historicalData: {
      gasUsage: generateHistoricalData(30, 40000, 120000),
      transactionCount: generateHistoricalData(30, 50, 200),
      confirmationTime: generateHistoricalData(30, 20, 80),
      costPerTransaction: generateHistoricalData(30, 3, 20)
    },
    issues: [
      {
        type: 'gas',
        severity: 'high',
        description: 'Alto consumo de gas en función transferBatch',
        recommendation: 'Optimizar el bucle en transferBatch para reducir operaciones redundantes'
      },
      {
        type: 'time',
        severity: 'medium',
        description: 'Tiempos de confirmación variables',
        recommendation: 'Considerar ajustes dinámicos de gas según la congestión'
      },
      {
        type: 'cost',
        severity: 'low',
        description: 'Costos de transacción por encima del promedio',
        recommendation: 'Implementar estrategias de batching para reducir costos'
      }
    ],
    optimizations: [
      {
        title: 'Optimización de bucles',
        description: 'Reducir operaciones dentro de bucles para mejorar eficiencia',
        impact: 'Alto',
        difficulty: 'Media',
        gasSavings: '30-40%'
      },
      {
        title: 'Batch processing',
        description: 'Agrupar múltiples operaciones en una sola transacción',
        impact: 'Alto',
        difficulty: 'Baja',
        gasSavings: '40-60%'
      },
      {
        title: 'Storage optimization',
        description: 'Optimizar el uso de storage para reducir costos',
        impact: 'Medio',
        difficulty: 'Alta',
        gasSavings: '20-30%'
      }
    ],
    networkComparison: {
      gasUsed: {
        project: 85000,
        network: 100000,
        difference: '-15%'
      },
      confirmationTime: {
        project: 45,
        network: 50,
        difference: '-10%'
      }
    },
    score: Math.floor(Object.values(metrics).reduce((a, b) => a + b, 0) / Object.values(metrics).length)
  };
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'high': return 'destructive';
    case 'medium': return 'default';
    case 'low': return 'secondary';
    default: return 'default';
  }
};

const getImpactColor = (impact: string) => {
  switch (impact) {
    case 'Alto': return 'destructive';
    case 'Medio': return 'default';
    case 'Bajo': return 'secondary';
    default: return 'default';
  }
};

export default function PerformanceAnalysisResults() {
  const [results, setResults] = useState<PerformanceResults | null>(null);
  const router = useRouter();

  useEffect(() => {
    const savedResults = sessionStorage.getItem('performanceAnalysisResults');
    if (savedResults) {
      setResults(JSON.parse(savedResults));
    } else {
      // Generate mock results if no saved data
      const mockResults = generateMockResults();
      setResults(mockResults);
    }
  }, []);

  const handleExport = () => {
    if (results) {
      const dataStr = JSON.stringify(results, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      const exportFileDefaultName = `performance-analysis-${results.contractAddress}-${new Date().toISOString().split('T')[0]}.json`;
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
    }
  };

  const handleShare = async () => {
    if (navigator.share && results) {
      try {
        await navigator.share({
          title: 'Análisis de Rendimiento Blockchain',
          text: `Análisis de rendimiento para el contrato ${results.contractAddress}. Puntuación: ${results.score}/100`,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    }
  };

  if (!results) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Cargando resultados...</h1>
        </div>
      </div>
    );
  }

  const metricsData = [
    { name: 'Eficiencia Gas', value: results.metrics.gasEfficiency, icon: Zap },
    { name: 'Tiempo Respuesta', value: results.metrics.responseTime, icon: Clock },
    { name: 'Eficiencia Costo', value: results.metrics.costEfficiency, icon: DollarSign },
    { name: 'Eficiencia Contrato', value: results.metrics.contractEfficiency, icon: Activity }
  ];

  const issuesData = results.issues.map((issue, index) => ({
    name: issue.type,
    value: issue.severity === 'high' ? 3 : issue.severity === 'medium' ? 2 : 1,
    severity: issue.severity
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <Link href="/dashboard/performance" className="flex items-center text-sm text-muted-foreground hover:text-foreground mb-2">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Volver al análisis
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Resultados del Análisis de Rendimiento</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              Contrato: {results.contractAddress} • Blockchain: {results.blockchain}
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
                  <Activity className="h-5 w-5" />
                  Puntuación General de Rendimiento
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
                        strokeDasharray={`${results.score}, 100`}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-2xl font-bold">{results.score}</span>
                    </div>
                  </div>
                  <Badge variant={results.score >= 80 ? 'default' : results.score >= 60 ? 'secondary' : 'destructive'}>
                    {results.score >= 80 ? 'Excelente' : results.score >= 60 ? 'Bueno' : 'Necesita Mejoras'}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Métricas Generales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {metricsData.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{metric.name}</CardTitle>
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{metric.value}%</div>
                  <Progress value={metric.value} className="mt-2" />
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Datos Históricos */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Datos Históricos</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Uso de Gas (30 días)</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={results.historicalData.gasUsage}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Transacciones por Día</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={results.historicalData.transactionCount}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tiempo de Confirmación (segundos)</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={results.historicalData.confirmationTime}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="value" stroke="#ffc658" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Costo por Transacción (USD)</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={results.historicalData.costPerTransaction}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="value" stroke="#ff7300" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Problemas Detectados */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Problemas Detectados</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="space-y-4">
              {results.issues.map((issue, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{issue.type.toUpperCase()}</CardTitle>
                      <Badge variant={getSeverityColor(issue.severity)}>
                        {issue.severity}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">{issue.description}</p>
                    <div className="bg-muted p-3 rounded-md">
                      <p className="text-sm font-medium">Recomendación:</p>
                      <p className="text-sm">{issue.recommendation}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Distribución de Problemas</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={issuesData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {issuesData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Optimizaciones */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Optimizaciones Recomendadas</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {results.optimizations.map((optimization, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {optimization.title}
                    <Badge variant={getImpactColor(optimization.impact)}>
                      {optimization.impact}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{optimization.description}</p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Dificultad:</span>
                      <span className="font-medium">{optimization.difficulty}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Ahorro de Gas:</span>
                      <span className="font-medium text-green-600">{optimization.gasSavings}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Comparación con la Red */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Comparación con la Red</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Comparación de Gas Usado</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Tu Proyecto:</span>
                    <span className="font-bold">{results.networkComparison.gasUsed.project.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Promedio Red:</span>
                    <span className="font-bold">{results.networkComparison.gasUsed.network.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Diferencia:</span>
                    <Badge variant={results.networkComparison.gasUsed.difference.startsWith('-') ? 'default' : 'destructive'}>
                      {results.networkComparison.gasUsed.difference}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Comparación de Tiempo de Confirmación</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Tu Proyecto:</span>
                    <span className="font-bold">{results.networkComparison.confirmationTime.project}s</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Promedio Red:</span>
                    <span className="font-bold">{results.networkComparison.confirmationTime.network}s</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Diferencia:</span>
                    <Badge variant={results.networkComparison.confirmationTime.difference.startsWith('-') ? 'default' : 'destructive'}>
                      {results.networkComparison.confirmationTime.difference}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Botones de Acción */}
        <div className="flex justify-center gap-4">
          <Link href="/dashboard/performance">
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