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
  Cube, Gamepad2, Eye, Zap, Globe, Activity, 
  Download, Share2, ArrowUp, ArrowDown, Minus,
  CheckCircle, AlertTriangle, Info, Target, Monitor, Users, Image,
  Clock, Cpu, Palette, Navigation
} from 'lucide-react';

// Función para generar datos mock realistas
const generateMockResults = () => {
  const baseScore = Math.floor(Math.random() * 30) + 70; // 70-100
  
  return {
    overallScore: baseScore,
    contentUrl: 'https://play.decentraland.org/realm/fenix',
    platform: 'Decentraland',
    analysisDate: new Date().toISOString(),
    
    // Métricas principales
    metrics: {
      performance: Math.floor(Math.random() * 20) + 75,
      visualQuality: Math.floor(Math.random() * 25) + 70,
      userExperience: Math.floor(Math.random() * 30) + 65,
      accessibility: Math.floor(Math.random() * 20) + 80,
      engagement: Math.floor(Math.random() * 25) + 70,
      monetization: Math.floor(Math.random() * 20) + 75
    },
    
    // Datos de rendimiento
    performanceData: {
      loadTime: (Math.random() * 3 + 2).toFixed(1), // 2-5 segundos
      fps: Math.floor(Math.random() * 20) + 50, // 50-70 FPS
      memoryUsage: Math.floor(Math.random() * 300) + 200, // 200-500 MB
      drawCalls: Math.floor(Math.random() * 500) + 100, // 100-600
      polygonCount: Math.floor(Math.random() * 50000) + 10000, // 10k-60k
      textureSize: Math.floor(Math.random() * 100) + 50 // 50-150 MB
    },
    
    // Análisis histórico
    historicalData: Array.from({ length: 30 }, (_, i) => ({
      date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toLocaleDateString(),
      performance: Math.floor(Math.random() * 20) + baseScore - 10,
      engagement: Math.floor(Math.random() * 25) + 70,
      visitors: Math.floor(Math.random() * 100) + 50,
      sessionTime: Math.floor(Math.random() * 10) + 5
    })),
    
    // Optimizaciones sugeridas
    optimizations: [
      {
        category: 'Rendimiento',
        priority: 'high',
        title: 'Reducir conteo de polígonos',
        description: 'Los modelos 3D tienen demasiados polígonos. Reducir en 30% mejoraría el rendimiento.',
        impact: 'Alto',
        effort: 'Medio',
        savings: '15% mejora en FPS'
      },
      {
        category: 'Visual',
        priority: 'medium',
        title: 'Optimizar texturas',
        description: 'Comprimir texturas sin pérdida de calidad visual significativa.',
        impact: 'Medio',
        effort: 'Bajo',
        savings: '25% reducción en memoria'
      },
      {
        category: 'UX',
        priority: 'high',
        title: 'Mejorar navegación',
        description: 'Agregar señalización y puntos de referencia para mejor orientación.',
        impact: 'Alto',
        effort: 'Bajo',
        savings: '40% menos abandono'
      },
      {
        category: 'Accesibilidad',
        priority: 'medium',
        title: 'Contraste de colores',
        description: 'Mejorar contraste para usuarios con discapacidades visuales.',
        impact: 'Medio',
        effort: 'Bajo',
        savings: '20% más usuarios'
      }
    ],
    
    // Análisis de audiencia
    audienceAnalysis: {
      totalVisitors: Math.floor(Math.random() * 5000) + 1000,
      avgSessionTime: (Math.random() * 10 + 5).toFixed(1),
      bounceRate: Math.floor(Math.random() * 30) + 20,
      returnVisitors: Math.floor(Math.random() * 40) + 30
    },
    
    // Distribución de dispositivos
    deviceDistribution: [
      { name: 'Desktop', value: 45, color: '#8B5CF6' },
      { name: 'VR Headset', value: 30, color: '#06B6D4' },
      { name: 'Mobile', value: 15, color: '#10B981' },
      { name: 'Tablet', value: 10, color: '#F59E0B' }
    ],
    
    // Comparación con benchmarks
    benchmarkComparison: {
      industry: {
        performance: Math.floor(Math.random() * 15) + 60,
        engagement: Math.floor(Math.random() * 15) + 65,
        retention: Math.floor(Math.random() * 15) + 55
      },
      topPerformers: {
        performance: Math.floor(Math.random() * 10) + 85,
        engagement: Math.floor(Math.random() * 10) + 88,
        retention: Math.floor(Math.random() * 10) + 82
      }
    },
    
    // Análisis de interactividad
    interactivityMetrics: [
      { feature: 'Objetos Interactivos', score: Math.floor(Math.random() * 30) + 70, usage: Math.floor(Math.random() * 40) + 60 },
      { feature: 'Navegación 3D', score: Math.floor(Math.random() * 25) + 75, usage: Math.floor(Math.random() * 30) + 70 },
      { feature: 'Chat/Social', score: Math.floor(Math.random() * 20) + 80, usage: Math.floor(Math.random() * 50) + 50 },
      { feature: 'Multimedia', score: Math.floor(Math.random() * 35) + 65, usage: Math.floor(Math.random() * 35) + 65 },
      { feature: 'Gamificación', score: Math.floor(Math.random() * 40) + 60, usage: Math.floor(Math.random() * 45) + 55 }
    ]
  };
};

export default function MetaverseOptimizerResults() {
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular carga de datos
    const timer = setTimeout(() => {
      setResults(generateMockResults());
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const exportResults = () => {
    const dataStr = JSON.stringify(results, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `metaverse-optimization-${Date.now()}.json`;
    link.click();
  };

  const shareResults = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Optimización de Metaverso',
          text: `Puntuación de optimización: ${results?.overallScore}/100`,
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
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'secondary';
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Activity className="h-8 w-8 animate-spin mx-auto mb-4 text-cyan-500" />
            <p className="text-lg font-medium">Optimizando contenido para metaverso...</p>
            <p className="text-muted-foreground">Analizando rendimiento y experiencia de usuario</p>
          </div>
        </div>
      </div>
    );
  }

  if (!results) return null;

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg">
            <Cube className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
              Optimización de Metaverso
            </h1>
            <p className="text-muted-foreground">
              Resultados para {results.platform} • {results.contentUrl.split('/').pop()}
            </p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportResults}>
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
          <Button variant="outline" onClick={shareResults}>
            <Share2 className="h-4 w-4 mr-2" />
            Compartir
          </Button>
        </div>
      </div>

      {/* Puntuación General */}
      <Card className="bg-gradient-to-r from-cyan-50 to-blue-50 border-cyan-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Puntuación de Optimización</h2>
              <p className="text-muted-foreground">Evaluación general de contenido para metaverso</p>
            </div>
            <div className="text-center">
              <div className="relative w-32 h-32">
                <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
                  <circle
                    cx="60"
                    cy="60"
                    r="50"
                    stroke="#e5e7eb"
                    strokeWidth="8"
                    fill="none"
                  />
                  <circle
                    cx="60"
                    cy="60"
                    r="50"
                    stroke="url(#gradientCyan)"
                    strokeWidth="8"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={`${(results.overallScore / 100) * 314} 314`}
                  />
                  <defs>
                    <linearGradient id="gradientCyan" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#06B6D4" />
                      <stop offset="100%" stopColor="#3B82F6" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-900">{results.overallScore}</div>
                    <div className="text-sm text-muted-foreground">/ 100</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Métricas Principales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Zap className="h-5 w-5 text-yellow-500" />
              Rendimiento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl font-bold">{results.metrics.performance}</span>
              {getScoreIcon(results.metrics.performance)}
            </div>
            <Progress value={results.metrics.performance} className="mb-2" />
            <p className="text-sm text-muted-foreground">
              Velocidad de carga y fluidez de la experiencia
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Eye className="h-5 w-5 text-purple-500" />
              Calidad Visual
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl font-bold">{results.metrics.visualQuality}</span>
              {getScoreIcon(results.metrics.visualQuality)}
            </div>
            <Progress value={results.metrics.visualQuality} className="mb-2" />
            <p className="text-sm text-muted-foreground">
              Texturas, iluminación y efectos visuales
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Users className="h-5 w-5 text-green-500" />
              Experiencia de Usuario
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl font-bold">{results.metrics.userExperience}</span>
              {getScoreIcon(results.metrics.userExperience)}
            </div>
            <Progress value={results.metrics.userExperience} className="mb-2" />
            <p className="text-sm text-muted-foreground">
              Navegación, interactividad y usabilidad
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Métricas de Rendimiento Detalladas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Monitor className="h-5 w-5 text-blue-500" />
            Métricas de Rendimiento Detalladas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            <div className="text-center">
              <Clock className="h-8 w-8 mx-auto mb-2 text-blue-500" />
              <div className="text-2xl font-bold">{results.performanceData.loadTime}s</div>
              <p className="text-sm text-muted-foreground">Tiempo de Carga</p>
            </div>
            <div className="text-center">
              <Activity className="h-8 w-8 mx-auto mb-2 text-green-500" />
              <div className="text-2xl font-bold">{results.performanceData.fps}</div>
              <p className="text-sm text-muted-foreground">FPS Promedio</p>
            </div>
            <div className="text-center">
              <Cpu className="h-8 w-8 mx-auto mb-2 text-purple-500" />
              <div className="text-2xl font-bold">{results.performanceData.memoryUsage}MB</div>
              <p className="text-sm text-muted-foreground">Uso de Memoria</p>
            </div>
            <div className="text-center">
              <Target className="h-8 w-8 mx-auto mb-2 text-orange-500" />
              <div className="text-2xl font-bold">{results.performanceData.drawCalls}</div>
              <p className="text-sm text-muted-foreground">Draw Calls</p>
            </div>
            <div className="text-center">
              <Cube className="h-8 w-8 mx-auto mb-2 text-cyan-500" />
              <div className="text-2xl font-bold">{results.performanceData.polygonCount.toLocaleString()}</div>
              <p className="text-sm text-muted-foreground">Polígonos</p>
            </div>
            <div className="text-center">
              <Image className="h-8 w-8 mx-auto mb-2 text-pink-500" />
              <div className="text-2xl font-bold">{results.performanceData.textureSize}MB</div>
              <p className="text-sm text-muted-foreground">Texturas</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Datos Históricos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-blue-500" />
            Evolución de Métricas (30 días)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={results.historicalData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="performance" stroke="#06B6D4" strokeWidth={2} name="Rendimiento" />
                <Line type="monotone" dataKey="engagement" stroke="#10B981" strokeWidth={2} name="Engagement" />
                <Line type="monotone" dataKey="visitors" stroke="#F59E0B" strokeWidth={2} name="Visitantes" />
                <Line type="monotone" dataKey="sessionTime" stroke="#8B5CF6" strokeWidth={2} name="Tiempo Sesión" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Análisis de Interactividad */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gamepad2 className="h-5 w-5 text-purple-500" />
            Análisis de Interactividad
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {results.interactivityMetrics.map((metric: any, index: number) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium mb-1">{metric.feature}</h4>
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Calidad</span>
                        <span>{metric.score}%</span>
                      </div>
                      <Progress value={metric.score} className="h-2" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Uso</span>
                        <span>{metric.usage}%</span>
                      </div>
                      <Progress value={metric.usage} className="h-2" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Distribución de Dispositivos y Audiencia */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Monitor className="h-5 w-5 text-green-500" />
              Distribución de Dispositivos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={results.deviceDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {results.deviceDistribution.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {results.deviceDistribution.map((item: any, index: number) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-sm">{item.name}: {item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-500" />
              Análisis de Audiencia
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Visitantes Totales</span>
                <span className="font-bold">{results.audienceAnalysis.totalVisitors.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Tiempo Promedio de Sesión</span>
                <span className="font-bold">{results.audienceAnalysis.avgSessionTime} min</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Tasa de Rebote</span>
                <span className="font-bold">{results.audienceAnalysis.bounceRate}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Visitantes Recurrentes</span>
                <span className="font-bold">{results.audienceAnalysis.returnVisitors}%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Optimizaciones Sugeridas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-yellow-500" />
            Optimizaciones Sugeridas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {results.optimizations.map((opt: any, index: number) => (
              <div key={index} className="flex gap-4 p-4 border rounded-lg">
                <div className="flex-shrink-0">
                  {opt.priority === 'high' ? (
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                  ) : (
                    <Info className="h-5 w-5 text-blue-500" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium">{opt.title}</h4>
                    <Badge variant={getPriorityColor(opt.priority)}>
                      {opt.priority === 'high' ? 'Alta' : opt.priority === 'medium' ? 'Media' : 'Baja'} Prioridad
                    </Badge>
                    <Badge variant="outline">{opt.category}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{opt.description}</p>
                  <div className="flex items-center gap-4 text-xs">
                    <span className="text-muted-foreground">Impacto: <strong>{opt.impact}</strong></span>
                    <span className="text-muted-foreground">Esfuerzo: <strong>{opt.effort}</strong></span>
                    <span className="text-green-600">Beneficio: <strong>{opt.savings}</strong></span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Comparación con Benchmarks */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-purple-500" />
            Comparación con Benchmarks
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-cyan-600 mb-2">
                {results.overallScore}
              </div>
              <p className="text-sm text-muted-foreground">Tu Puntuación</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {results.benchmarkComparison.industry.performance}
              </div>
              <p className="text-sm text-muted-foreground">Promedio Industria</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {results.benchmarkComparison.topPerformers.performance}
              </div>
              <p className="text-sm text-muted-foreground">Top Performers</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

