'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { AlertTriangle, FileText, Code, BookOpen, Activity, Download, Share2, ArrowLeft, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import Link from 'next/link';

interface SmartContractResults {
  contractAddress: string;
  blockchain: string;
  metrics: {
    namingScore: number;
    documentationScore: number;
    metadataScore: number;
    eventsScore: number;
    interfaceScore: number;
  };
  issues: Array<{
    type: string;
    severity: string;
    description: string;
    recommendation: string;
  }>;
  recommendations: string[];
  score: number;
  detailedAnalysis?: {
    functions: Array<{
      name: string;
      visibility: string;
      documented: boolean;
      complexity: number;
      gasOptimized: boolean;
    }>;
    events: Array<{
      name: string;
      indexed: boolean;
      descriptive: boolean;
    }>;
    security: {
      vulnerabilities: number;
      riskLevel: string;
      auditRecommended: boolean;
    };
    compliance: {
      erc20: boolean;
      erc721: boolean;
      erc1155: boolean;
      customStandards: string[];
    };
  };
}

const generateMockResults = (): SmartContractResults => {
  const metrics = {
    namingScore: Math.floor(Math.random() * 30) + 60,
    documentationScore: Math.floor(Math.random() * 25) + 65,
    metadataScore: Math.floor(Math.random() * 20) + 70,
    eventsScore: Math.floor(Math.random() * 35) + 55,
    interfaceScore: Math.floor(Math.random() * 30) + 60
  };

  return {
    contractAddress: '0x742d35Cc6634C0532925a3b8D4C9db4C8b4b8b8b',
    blockchain: 'ethereum',
    metrics,
    issues: [
      {
        type: 'naming',
        severity: 'medium',
        description: 'Nombres de funciones poco descriptivos detectados',
        recommendation: 'Utiliza nombres que describan claramente la acción que realiza la función'
      },
      {
        type: 'documentation',
        severity: 'high',
        description: 'Falta de documentación NatSpec en funciones principales',
        recommendation: 'Añade comentarios NatSpec a todas las funciones públicas y externas'
      },
      {
        type: 'metadata',
        severity: 'medium',
        description: 'Metadatos incompletos en el contrato',
        recommendation: 'Completa los metadatos con nombre, versión, autor y descripción'
      },
      {
        type: 'events',
        severity: 'low',
        description: 'Eventos sin indexar detectados',
        recommendation: 'Indexa los parámetros importantes de los eventos para mejor búsqueda'
      },
      {
        type: 'interface',
        severity: 'medium',
        description: 'Interfaz no sigue estándares ERC',
        recommendation: 'Implementa interfaces estándar para mejor interoperabilidad'
      }
    ],
    recommendations: [
      'Mejorar la nomenclatura de funciones y variables para mayor claridad',
      'Añadir documentación NatSpec completa a todas las funciones públicas',
      'Optimizar eventos para mejor indexación y búsqueda',
      'Implementar interfaces estándar ERC para interoperabilidad',
      'Completar metadatos del contrato con información descriptiva',
      'Considerar auditoría de seguridad antes del despliegue en mainnet'
    ],
    score: Math.floor(Object.values(metrics).reduce((a, b) => a + b, 0) / Object.values(metrics).length),
    detailedAnalysis: {
      functions: [
        { name: 'transfer', visibility: 'public', documented: true, complexity: 2, gasOptimized: true },
        { name: 'approve', visibility: 'public', documented: true, complexity: 1, gasOptimized: true },
        { name: 'transferFrom', visibility: 'public', documented: false, complexity: 3, gasOptimized: false },
        { name: 'mint', visibility: 'external', documented: false, complexity: 2, gasOptimized: true },
        { name: 'burn', visibility: 'external', documented: true, complexity: 2, gasOptimized: true }
      ],
      events: [
        { name: 'Transfer', indexed: true, descriptive: true },
        { name: 'Approval', indexed: true, descriptive: true },
        { name: 'Mint', indexed: false, descriptive: false },
        { name: 'Burn', indexed: true, descriptive: true }
      ],
      security: {
        vulnerabilities: Math.floor(Math.random() * 3),
        riskLevel: ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)],
        auditRecommended: Math.random() > 0.5
      },
      compliance: {
        erc20: true,
        erc721: false,
        erc1155: false,
        customStandards: ['ERC-2612', 'ERC-3156']
      }
    }
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

const getSeverityIcon = (severity: string) => {
  switch (severity) {
    case 'high': return XCircle;
    case 'medium': return AlertCircle;
    case 'low': return AlertTriangle;
    default: return AlertTriangle;
  }
};

export default function SmartContractAnalysisResults() {
  const [results, setResults] = useState<SmartContractResults | null>(null);
  const router = useRouter();

  useEffect(() => {
    const savedResults = sessionStorage.getItem('smartContractAnalysisResults');
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
      const exportFileDefaultName = `smart-contract-analysis-${results.contractAddress}-${new Date().toISOString().split('T')[0]}.json`;
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
          title: 'Análisis de Smart Contract',
          text: `Análisis de smart contract para ${results.contractAddress}. Puntuación: ${results.score}/100`,
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
    { name: 'Nomenclatura', value: results.metrics.namingScore, icon: Code },
    { name: 'Documentación', value: results.metrics.documentationScore, icon: BookOpen },
    { name: 'Metadatos', value: results.metrics.metadataScore, icon: FileText },
    { name: 'Eventos', value: results.metrics.eventsScore, icon: Activity },
    { name: 'Interfaz', value: results.metrics.interfaceScore, icon: Code }
  ];

  const radarData = Object.entries(results.metrics).map(([key, value]) => ({
    metric: key.replace('Score', ''),
    value,
    fullMark: 100
  }));

  const issuesData = results.issues.map((issue, index) => ({
    name: issue.type,
    value: issue.severity === 'high' ? 3 : issue.severity === 'medium' ? 2 : 1,
    severity: issue.severity
  }));

  const functionsData = results.detailedAnalysis?.functions.map(func => ({
    name: func.name,
    complexity: func.complexity,
    documented: func.documented ? 1 : 0,
    gasOptimized: func.gasOptimized ? 1 : 0
  })) || [];

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link href="/dashboard/smart-contract" className="flex items-center text-sm text-muted-foreground hover:text-foreground mb-2">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Volver al análisis
          </Link>
          <h1 className="text-3xl font-bold">Resultados del Análisis de Smart Contract</h1>
          <p className="text-muted-foreground mt-1">
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

      {/* Overall Score */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="h-5 w-5" />
            Puntuación General del Smart Contract
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="text-4xl font-bold">{results.score}/100</div>
            <Progress value={results.score} className="flex-1" />
            <Badge variant={results.score >= 80 ? 'default' : results.score >= 60 ? 'secondary' : 'destructive'}>
              {results.score >= 80 ? 'Excelente' : results.score >= 60 ? 'Bueno' : 'Necesita Mejoras'}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
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

      {/* Detailed Analysis */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Resumen</TabsTrigger>
          <TabsTrigger value="issues">Problemas</TabsTrigger>
          <TabsTrigger value="functions">Funciones</TabsTrigger>
          <TabsTrigger value="security">Seguridad</TabsTrigger>
          <TabsTrigger value="compliance">Cumplimiento</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Radar de Métricas</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="metric" />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} />
                    <Radar name="Puntuación" dataKey="value" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

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

          <Card>
            <CardHeader>
              <CardTitle>Recomendaciones Principales</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {results.recommendations.map((recommendation, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <p className="text-sm">{recommendation}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="issues" className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {results.issues.map((issue, index) => {
              const SeverityIcon = getSeverityIcon(issue.severity);
              return (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <SeverityIcon className="h-5 w-5" />
                        {issue.type.toUpperCase()}
                      </CardTitle>
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
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="functions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Análisis de Funciones</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={functionsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="complexity" fill="#8884d8" name="Complejidad" />
                  <Bar dataKey="documented" fill="#82ca9d" name="Documentado" />
                  <Bar dataKey="gasOptimized" fill="#ffc658" name="Optimizado" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Funciones Detectadas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {results.detailedAnalysis?.functions.map((func, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-md">
                      <div>
                        <p className="font-medium">{func.name}</p>
                        <p className="text-sm text-muted-foreground">{func.visibility}</p>
                      </div>
                      <div className="flex gap-2">
                        <Badge variant={func.documented ? 'default' : 'destructive'}>
                          {func.documented ? 'Documentado' : 'Sin docs'}
                        </Badge>
                        <Badge variant={func.gasOptimized ? 'default' : 'secondary'}>
                          {func.gasOptimized ? 'Optimizado' : 'No optimizado'}
                        </Badge>
                      </div>
                    </div>
                  )) || []}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Eventos Detectados</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {results.detailedAnalysis?.events.map((event, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-md">
                      <div>
                        <p className="font-medium">{event.name}</p>
                      </div>
                      <div className="flex gap-2">
                        <Badge variant={event.indexed ? 'default' : 'secondary'}>
                          {event.indexed ? 'Indexado' : 'No indexado'}
                        </Badge>
                        <Badge variant={event.descriptive ? 'default' : 'destructive'}>
                          {event.descriptive ? 'Descriptivo' : 'Poco claro'}
                        </Badge>
                      </div>
                    </div>
                  )) || []}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Análisis de Seguridad</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Vulnerabilidades Detectadas:</span>
                    <Badge variant={results.detailedAnalysis?.security.vulnerabilities === 0 ? 'default' : 'destructive'}>
                      {results.detailedAnalysis?.security.vulnerabilities || 0}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Nivel de Riesgo:</span>
                    <Badge variant={results.detailedAnalysis?.security.riskLevel === 'Low' ? 'default' : 
                                   results.detailedAnalysis?.security.riskLevel === 'Medium' ? 'secondary' : 'destructive'}>
                      {results.detailedAnalysis?.security.riskLevel || 'Unknown'}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Auditoría Recomendada:</span>
                    <Badge variant={results.detailedAnalysis?.security.auditRecommended ? 'destructive' : 'default'}>
                      {results.detailedAnalysis?.security.auditRecommended ? 'Sí' : 'No'}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recomendaciones de Seguridad</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                    <p className="text-sm">Implementar controles de acceso adecuados</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                    <p className="text-sm">Validar todas las entradas de usuario</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                    <p className="text-sm">Usar modificadores de seguridad apropiados</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                    <p className="text-sm">Considerar patrones de seguridad estándar</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Cumplimiento de Estándares</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>ERC-20:</span>
                    <Badge variant={results.detailedAnalysis?.compliance.erc20 ? 'default' : 'secondary'}>
                      {results.detailedAnalysis?.compliance.erc20 ? 'Cumple' : 'No cumple'}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>ERC-721:</span>
                    <Badge variant={results.detailedAnalysis?.compliance.erc721 ? 'default' : 'secondary'}>
                      {results.detailedAnalysis?.compliance.erc721 ? 'Cumple' : 'No cumple'}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>ERC-1155:</span>
                    <Badge variant={results.detailedAnalysis?.compliance.erc1155 ? 'default' : 'secondary'}>
                      {results.detailedAnalysis?.compliance.erc1155 ? 'Cumple' : 'No cumple'}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Estándares Personalizados</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {results.detailedAnalysis?.compliance.customStandards.map((standard, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">{standard}</span>
                    </div>
                  )) || [
                    <div key="none" className="text-sm text-muted-foreground">
                      No se detectaron estándares personalizados
                    </div>
                  ]}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4">
        <Link href="/dashboard/smart-contract">
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
  );
}