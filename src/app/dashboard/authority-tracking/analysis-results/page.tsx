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
  Shield, Users, TrendingUp, Award, Star, Network, Activity, 
  Download, Share2, ArrowUp, ArrowDown, Minus,
  CheckCircle, AlertTriangle, Info, Target, Zap, Globe
} from 'lucide-react';

// Función para generar datos mock realistas
const generateMockResults = () => {
  const baseScore = Math.floor(Math.random() * 30) + 70; // 70-100
  
  return {
    overallScore: baseScore,
    walletAddress: '0x742d35Cc6634C0532925a3b8D4C2C4e0C8b4f8e9',
    analysisDate: new Date().toISOString(),
    
    // Métricas principales
    metrics: {
      governanceAuthority: Math.floor(Math.random() * 20) + 75,
      socialReputation: Math.floor(Math.random() * 25) + 70,
      technicalInfluence: Math.floor(Math.random() * 30) + 65,
      communityTrust: Math.floor(Math.random() * 20) + 80,
      protocolParticipation: Math.floor(Math.random() * 25) + 70,
      networkInfluence: Math.floor(Math.random() * 20) + 75
    },
    
    // Datos históricos
    historicalData: Array.from({ length: 30 }, (_, i) => ({
      date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toLocaleDateString(),
      authority: Math.floor(Math.random() * 20) + baseScore - 10,
      governance: Math.floor(Math.random() * 25) + 70,
      reputation: Math.floor(Math.random() * 20) + 75,
      influence: Math.floor(Math.random() * 30) + 65
    })),
    
    // Participación en protocolos
    protocolParticipation: [
      { protocol: 'Uniswap', participation: 85, votes: 23, proposals: 3 },
      { protocol: 'Compound', participation: 78, votes: 18, proposals: 1 },
      { protocol: 'Aave', participation: 92, votes: 31, proposals: 5 },
      { protocol: 'MakerDAO', participation: 67, votes: 12, proposals: 2 },
      { protocol: 'Curve', participation: 73, votes: 15, proposals: 1 }
    ],
    
    // Distribución de autoridad
    authorityDistribution: [
      { name: 'Gobernanza', value: 35, color: '#8B5CF6' },
      { name: 'Técnica', value: 25, color: '#06B6D4' },
      { name: 'Social', value: 20, color: '#10B981' },
      { name: 'Comunidad', value: 20, color: '#F59E0B' }
    ],
    
    // Análisis de red
    networkAnalysis: {
      connections: Math.floor(Math.random() * 500) + 200,
      influentialConnections: Math.floor(Math.random() * 50) + 25,
      networkReach: Math.floor(Math.random() * 10000) + 5000,
      clusteringCoefficient: (Math.random() * 0.3 + 0.4).toFixed(3)
    },
    
    // Recomendaciones
    recommendations: [
      {
        category: 'Gobernanza',
        priority: 'high',
        title: 'Aumentar participación en propuestas',
        description: 'Participa más activamente en propuestas de gobernanza para incrementar tu autoridad.',
        impact: 'Alto'
      },
      {
        category: 'Social',
        priority: 'medium',
        title: 'Expandir presencia en redes',
        description: 'Aumenta tu actividad en plataformas sociales Web3 para mejorar tu reputación.',
        impact: 'Medio'
      },
      {
        category: 'Técnica',
        priority: 'medium',
        title: 'Contribuir a protocolos',
        description: 'Considera contribuir técnicamente a protocolos para aumentar tu influencia.',
        impact: 'Alto'
      }
    ],
    
    // Comparación con la red
    networkComparison: {
      percentile: Math.floor(Math.random() * 20) + 75,
      averageScore: Math.floor(Math.random() * 15) + 60,
      topPerformers: Math.floor(Math.random() * 10) + 85
    }
  };
};

export default function AuthorityTrackingResults() {
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
    link.download = `authority-analysis-${Date.now()}.json`;
    link.click();
  };

  const shareResults = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Análisis de Autoridad Descentralizada',
          text: `Puntuación de autoridad: ${results?.overallScore}/100`,
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

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Activity className="h-8 w-8 animate-spin mx-auto mb-4 text-purple-500" />
            <p className="text-lg font-medium">Analizando autoridad descentralizada...</p>
            <p className="text-muted-foreground">Esto puede tomar unos momentos</p>
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
          <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Análisis de Autoridad Descentralizada
            </h1>
            <p className="text-muted-foreground">
              Resultados para {results.walletAddress.slice(0, 6)}...{results.walletAddress.slice(-4)}
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
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Puntuación de Autoridad</h2>
              <p className="text-muted-foreground">Evaluación general de autoridad descentralizada</p>
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
                    stroke="url(#gradient)"
                    strokeWidth="8"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={`${(results.overallScore / 100) * 314} 314`}
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#8B5CF6" />
                      <stop offset="100%" stopColor="#EC4899" />
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
              <Users className="h-5 w-5 text-blue-500" />
              Autoridad de Gobernanza
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl font-bold">{results.metrics.governanceAuthority}</span>
              {getScoreIcon(results.metrics.governanceAuthority)}
            </div>
            <Progress value={results.metrics.governanceAuthority} className="mb-2" />
            <p className="text-sm text-muted-foreground">
              Participación en DAOs y propuestas de gobernanza
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Star className="h-5 w-5 text-yellow-500" />
              Reputación Social
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl font-bold">{results.metrics.socialReputation}</span>
              {getScoreIcon(results.metrics.socialReputation)}
            </div>
            <Progress value={results.metrics.socialReputation} className="mb-2" />
            <p className="text-sm text-muted-foreground">
              Reputación en redes sociales y comunidades Web3
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Award className="h-5 w-5 text-green-500" />
              Influencia Técnica
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl font-bold">{results.metrics.technicalInfluence}</span>
              {getScoreIcon(results.metrics.technicalInfluence)}
            </div>
            <Progress value={results.metrics.technicalInfluence} className="mb-2" />
            <p className="text-sm text-muted-foreground">
              Contribuciones técnicas y liderazgo en protocolos
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Datos Históricos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-500" />
            Evolución de Autoridad (30 días)
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
                <Line type="monotone" dataKey="authority" stroke="#8B5CF6" strokeWidth={2} name="Autoridad General" />
                <Line type="monotone" dataKey="governance" stroke="#06B6D4" strokeWidth={2} name="Gobernanza" />
                <Line type="monotone" dataKey="reputation" stroke="#10B981" strokeWidth={2} name="Reputación" />
                <Line type="monotone" dataKey="influence" stroke="#F59E0B" strokeWidth={2} name="Influencia" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Participación en Protocolos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Network className="h-5 w-5 text-purple-500" />
            Participación en Protocolos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {results.protocolParticipation.map((protocol: any, index: number) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">{protocol.protocol[0]}</span>
                  </div>
                  <div>
                    <h4 className="font-medium">{protocol.protocol}</h4>
                    <p className="text-sm text-muted-foreground">
                      {protocol.votes} votos • {protocol.proposals} propuestas
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold">{protocol.participation}%</div>
                  <Progress value={protocol.participation} className="w-20" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Distribución de Autoridad y Análisis de Red */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-green-500" />
              Distribución de Autoridad
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={results.authorityDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {results.authorityDistribution.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {results.authorityDistribution.map((item: any, index: number) => (
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
              <Globe className="h-5 w-5 text-blue-500" />
              Análisis de Red
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Conexiones Totales</span>
                <span className="font-bold">{results.networkAnalysis.connections.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Conexiones Influyentes</span>
                <span className="font-bold">{results.networkAnalysis.influentialConnections}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Alcance de Red</span>
                <span className="font-bold">{results.networkAnalysis.networkReach.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Coeficiente de Clustering</span>
                <span className="font-bold">{results.networkAnalysis.clusteringCoefficient}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recomendaciones */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-yellow-500" />
            Recomendaciones de Mejora
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {results.recommendations.map((rec: any, index: number) => (
              <div key={index} className="flex gap-4 p-4 border rounded-lg">
                <div className="flex-shrink-0">
                  {rec.priority === 'high' ? (
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                  ) : (
                    <Info className="h-5 w-5 text-blue-500" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium">{rec.title}</h4>
                    <Badge variant={rec.priority === 'high' ? 'destructive' : 'secondary'}>
                      {rec.priority === 'high' ? 'Alta' : 'Media'} Prioridad
                    </Badge>
                    <Badge variant="outline">{rec.category}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{rec.description}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Impacto esperado:</span>
                    <Badge variant="secondary">{rec.impact}</Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Comparación con la Red */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart className="h-5 w-5 text-purple-500" />
            Comparación con la Red
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {results.networkComparison.percentile}%
              </div>
              <p className="text-sm text-muted-foreground">Percentil en la red</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {results.networkComparison.averageScore}
              </div>
              <p className="text-sm text-muted-foreground">Puntuación promedio</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {results.networkComparison.topPerformers}
              </div>
              <p className="text-sm text-muted-foreground">Top performers</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

