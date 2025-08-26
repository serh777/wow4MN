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
  AreaChart, Area, Sankey
} from 'recharts';
import { 
  Network, GitBranch, Users, TrendingUp, BarChart3, Zap, 
  Download, Share2, ArrowUp, ArrowDown, Minus,
  CheckCircle, AlertTriangle, Info, Target, Globe, Link, Layers,
  Activity, Eye, Award, Cpu
} from 'lucide-react';

// Función para generar datos mock realistas
const generateMockResults = () => {
  const baseScore = Math.floor(Math.random() * 30) + 70; // 70-100
  
  return {
    overallScore: baseScore,
    walletAddress: '0x742d35Cc6634C0532925a3b8D4C2C4e0C8b4f8e9',
    ecosystemType: 'DeFi',
    analysisDate: new Date().toISOString(),
    
    // Métricas principales
    metrics: {
      networkInfluence: Math.floor(Math.random() * 20) + 75,
      protocolDiversity: Math.floor(Math.random() * 25) + 70,
      transactionVolume: Math.floor(Math.random() * 30) + 65,
      socialImpact: Math.floor(Math.random() * 20) + 80,
      governanceParticipation: Math.floor(Math.random() * 25) + 70,
      crossChainActivity: Math.floor(Math.random() * 20) + 75
    },
    
    // Análisis de red
    networkAnalysis: {
      totalConnections: Math.floor(Math.random() * 1000) + 500,
      directConnections: Math.floor(Math.random() * 100) + 50,
      indirectConnections: Math.floor(Math.random() * 900) + 450,
      centralityScore: (Math.random() * 0.5 + 0.3).toFixed(3),
      clusteringCoefficient: (Math.random() * 0.4 + 0.2).toFixed(3),
      networkReach: Math.floor(Math.random() * 10000) + 5000
    },
    
    // Interacciones por protocolo
    protocolInteractions: [
      { protocol: 'Uniswap', transactions: 245, volume: 125.4, category: 'DEX', influence: 85 },
      { protocol: 'Aave', transactions: 89, volume: 89.2, category: 'Lending', influence: 78 },
      { protocol: 'Compound', transactions: 156, volume: 67.8, category: 'Lending', influence: 72 },
      { protocol: 'MakerDAO', transactions: 34, volume: 234.1, category: 'Stablecoin', influence: 91 },
      { protocol: 'Curve', transactions: 78, volume: 45.6, category: 'DEX', influence: 68 },
      { protocol: 'Yearn', transactions: 23, volume: 78.9, category: 'Yield', influence: 75 },
      { protocol: 'Synthetix', transactions: 45, volume: 34.2, category: 'Derivatives', influence: 65 },
      { protocol: 'Balancer', transactions: 67, volume: 23.4, category: 'DEX', influence: 62 }
    ],
    
    // Actividad histórica
    historicalActivity: Array.from({ length: 30 }, (_, i) => ({
      date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toLocaleDateString(),
      transactions: Math.floor(Math.random() * 50) + 10,
      volume: Math.random() * 100 + 20,
      protocols: Math.floor(Math.random() * 8) + 3,
      influence: Math.floor(Math.random() * 20) + baseScore - 10
    })),
    
    // Distribución por categorías
    categoryDistribution: [
      { name: 'DEX', value: 35, color: '#8B5CF6', transactions: 390 },
      { name: 'Lending', value: 25, color: '#06B6D4', transactions: 245 },
      { name: 'Stablecoin', value: 15, color: '#10B981', transactions: 134 },
      { name: 'Yield Farming', value: 12, color: '#F59E0B', transactions: 101 },
      { name: 'Derivatives', value: 8, color: '#EF4444', transactions: 67 },
      { name: 'NFT', value: 5, color: '#EC4899', transactions: 45 }
    ],
    
    // Análisis de influencia
    influenceMetrics: {
      directInfluence: Math.floor(Math.random() * 500) + 200,
      indirectInfluence: Math.floor(Math.random() * 2000) + 1000,
      viralCoefficient: (Math.random() * 2 + 1).toFixed(2),
      amplificationFactor: (Math.random() * 5 + 2).toFixed(1),
      reachMultiplier: (Math.random() * 10 + 5).toFixed(1)
    },
    
    // Patrones de interacción
    interactionPatterns: [
      {
        pattern: 'Arbitrage Trading',
        frequency: 'Alta',
        impact: 'Medio',
        description: 'Operaciones de arbitraje entre diferentes DEXs',
        protocols: ['Uniswap', 'SushiSwap', 'Curve']
      },
      {
        pattern: 'Yield Farming',
        frequency: 'Media',
        impact: 'Alto',
        description: 'Estrategias de farming en múltiples protocolos',
        protocols: ['Yearn', 'Compound', 'Aave']
      },
      {
        pattern: 'Governance Participation',
        frequency: 'Baja',
        impact: 'Alto',
        description: 'Participación activa en propuestas de gobernanza',
        protocols: ['MakerDAO', 'Compound', 'Uniswap']
      },
      {
        pattern: 'Liquidity Provision',
        frequency: 'Alta',
        impact: 'Medio',
        description: 'Provisión de liquidez en pools',
        protocols: ['Uniswap', 'Balancer', 'Curve']
      }
    ],
    
    // Análisis cross-chain
    crossChainAnalysis: {
      chains: [
        { name: 'Ethereum', transactions: 567, volume: 234.5, share: 65 },
        { name: 'Polygon', transactions: 234, volume: 89.2, share: 20 },
        { name: 'Arbitrum', transactions: 123, volume: 45.6, share: 10 },
        { name: 'Optimism', transactions: 67, volume: 23.4, share: 5 }
      ],
      bridgeTransactions: Math.floor(Math.random() * 50) + 20,
      crossChainVolume: (Math.random() * 100 + 50).toFixed(1)
    },
    
    // Radar de ecosistemas
    ecosystemRadar: [
      { ecosystem: 'DeFi', score: Math.floor(Math.random() * 30) + 70 },
      { ecosystem: 'NFT', score: Math.floor(Math.random() * 40) + 40 },
      { ecosystem: 'Gaming', score: Math.floor(Math.random() * 50) + 30 },
      { ecosystem: 'DAO', score: Math.floor(Math.random() * 35) + 55 },
      { ecosystem: 'Social', score: Math.floor(Math.random() * 45) + 35 },
      { ecosystem: 'Infrastructure', score: Math.floor(Math.random() * 25) + 65 }
    ],
    
    // Recomendaciones
    recommendations: [
      {
        category: 'Diversificación',
        priority: 'high',
        title: 'Expandir a nuevos protocolos',
        description: 'Considera interactuar con protocolos emergentes para aumentar tu influencia.',
        impact: 'Alto',
        effort: 'Medio'
      },
      {
        category: 'Gobernanza',
        priority: 'medium',
        title: 'Aumentar participación en DAOs',
        description: 'Tu participación en gobernanza puede incrementar significativamente tu autoridad.',
        impact: 'Alto',
        effort: 'Bajo'
      },
      {
        category: 'Cross-Chain',
        priority: 'medium',
        title: 'Explorar L2s y sidechains',
        description: 'Expandir actividad a Layer 2 puede reducir costos y aumentar frecuencia.',
        impact: 'Medio',
        effort: 'Medio'
      }
    ],
    
    // Comparación con peers
    peerComparison: {
      yourScore: baseScore,
      averageScore: Math.floor(Math.random() * 15) + 60,
      topPerformers: Math.floor(Math.random() * 10) + 85,
      percentile: Math.floor(Math.random() * 20) + 75
    }
  };
};

export default function EcosystemInteractionsResults() {
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
    link.download = `ecosystem-interactions-${Date.now()}.json`;
    link.click();
  };

  const shareResults = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Análisis de Interacciones en Ecosistemas',
          text: `Puntuación de interacciones: ${results?.overallScore}/100`,
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

  const getFrequencyColor = (frequency: string) => {
    switch (frequency) {
      case 'Alta': return 'bg-green-100 text-green-800';
      case 'Media': return 'bg-yellow-100 text-yellow-800';
      case 'Baja': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'Alto': return 'bg-purple-100 text-purple-800';
      case 'Medio': return 'bg-blue-100 text-blue-800';
      case 'Bajo': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Activity className="h-8 w-8 animate-spin mx-auto mb-4 text-indigo-500" />
            <p className="text-lg font-medium">Analizando interacciones en ecosistemas...</p>
            <p className="text-muted-foreground">Mapeando conexiones y patrones de actividad</p>
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
          <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg">
            <Network className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Análisis de Interacciones en Ecosistemas
            </h1>
            <p className="text-muted-foreground">
              Resultados para {results.walletAddress.slice(0, 6)}...{results.walletAddress.slice(-4)} • {results.ecosystemType}
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
      <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Puntuación de Interacciones</h2>
              <p className="text-muted-foreground">Evaluación del impacto en visibilidad y autoridad del contenido</p>
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
                    stroke="url(#gradientIndigo)"
                    strokeWidth="8"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={`${(results.overallScore / 100) * 314} 314`}
                  />
                  <defs>
                    <linearGradient id="gradientIndigo" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#6366F1" />
                      <stop offset="100%" stopColor="#8B5CF6" />
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
              <Network className="h-5 w-5 text-blue-500" />
              Influencia de Red
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl font-bold">{results.metrics.networkInfluence}</span>
              {getScoreIcon(results.metrics.networkInfluence)}
            </div>
            <Progress value={results.metrics.networkInfluence} className="mb-2" />
            <p className="text-sm text-muted-foreground">
              {results.networkAnalysis.totalConnections} conexiones totales
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Layers className="h-5 w-5 text-purple-500" />
              Diversidad de Protocolos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl font-bold">{results.metrics.protocolDiversity}</span>
              {getScoreIcon(results.metrics.protocolDiversity)}
            </div>
            <Progress value={results.metrics.protocolDiversity} className="mb-2" />
            <p className="text-sm text-muted-foreground">
              {results.protocolInteractions.length} protocolos activos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <BarChart3 className="h-5 w-5 text-green-500" />
              Volumen de Transacciones
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl font-bold">{results.metrics.transactionVolume}</span>
              {getScoreIcon(results.metrics.transactionVolume)}
            </div>
            <Progress value={results.metrics.transactionVolume} className="mb-2" />
            <p className="text-sm text-muted-foreground">
              {results.protocolInteractions.reduce((sum: number, p: any) => sum + p.transactions, 0)} transacciones totales
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Análisis de Red Detallado */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GitBranch className="h-5 w-5 text-blue-500" />
            Análisis de Red Detallado
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{results.networkAnalysis.totalConnections}</div>
              <p className="text-sm text-muted-foreground">Conexiones Totales</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{results.networkAnalysis.directConnections}</div>
              <p className="text-sm text-muted-foreground">Conexiones Directas</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{results.networkAnalysis.centralityScore}</div>
              <p className="text-sm text-muted-foreground">Puntuación de Centralidad</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{results.networkAnalysis.clusteringCoefficient}</div>
              <p className="text-sm text-muted-foreground">Coeficiente de Clustering</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-cyan-600">{results.networkAnalysis.networkReach.toLocaleString()}</div>
              <p className="text-sm text-muted-foreground">Alcance de Red</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-pink-600">{results.influenceMetrics.viralCoefficient}</div>
              <p className="text-sm text-muted-foreground">Coeficiente Viral</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actividad Histórica */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-500" />
            Actividad Histórica (30 días)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={results.historicalActivity}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="transactions" stroke="#6366F1" strokeWidth={2} name="Transacciones" />
                <Line type="monotone" dataKey="volume" stroke="#8B5CF6" strokeWidth={2} name="Volumen" />
                <Line type="monotone" dataKey="protocols" stroke="#10B981" strokeWidth={2} name="Protocolos" />
                <Line type="monotone" dataKey="influence" stroke="#F59E0B" strokeWidth={2} name="Influencia" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Interacciones por Protocolo */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Layers className="h-5 w-5 text-purple-500" />
            Interacciones por Protocolo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {results.protocolInteractions.map((protocol: any, index: number) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">{protocol.protocol[0]}</span>
                  </div>
                  <div>
                    <h4 className="font-medium">{protocol.protocol}</h4>
                    <p className="text-sm text-muted-foreground">
                      {protocol.transactions} tx • {protocol.volume} ETH • {protocol.category}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold">{protocol.influence}</div>
                  <Progress value={protocol.influence} className="w-20" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Distribución por Categorías y Radar de Ecosistemas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-green-500" />
              Distribución por Categorías
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={results.categoryDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {results.categoryDistribution.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {results.categoryDistribution.map((item: any, index: number) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="color-indicator" style={{ '--indicator-color': item.color } as React.CSSProperties}></div>
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
              Radar de Ecosistemas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={results.ecosystemRadar}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="ecosystem" />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} />
                  <Radar
                    name="Puntuación"
                    dataKey="score"
                    stroke="#6366F1"
                    fill="#6366F1"
                    fillOpacity={0.3}
                    strokeWidth={2}
                  />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Patrones de Interacción */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-yellow-500" />
            Patrones de Interacción Detectados
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {results.interactionPatterns.map((pattern: any, index: number) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{pattern.pattern}</h4>
                  <div className="flex gap-2">
                    <Badge className={getFrequencyColor(pattern.frequency)}>
                      {pattern.frequency} Frecuencia
                    </Badge>
                    <Badge className={getImpactColor(pattern.impact)}>
                      {pattern.impact} Impacto
                    </Badge>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{pattern.description}</p>
                <div className="flex flex-wrap gap-1">
                  {pattern.protocols.map((protocol: string, idx: number) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      {protocol}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Análisis Cross-Chain */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Link className="h-5 w-5 text-cyan-500" />
            Análisis Cross-Chain
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {results.crossChainAnalysis.chains.map((chain: any, index: number) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-xs">{chain.name[0]}</span>
                  </div>
                  <div>
                    <h4 className="font-medium">{chain.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {chain.transactions} tx • {chain.volume} ETH
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold">{chain.share}%</div>
                  <Progress value={chain.share} className="w-16" />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-xl font-bold text-cyan-600">{results.crossChainAnalysis.bridgeTransactions}</div>
                <p className="text-sm text-muted-foreground">Transacciones Bridge</p>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-blue-600">{results.crossChainAnalysis.crossChainVolume} ETH</div>
                <p className="text-sm text-muted-foreground">Volumen Cross-Chain</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recomendaciones */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-yellow-500" />
            Recomendaciones de Optimización
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
                  <div className="flex items-center gap-4 text-xs">
                    <span className="text-muted-foreground">Impacto: <strong>{rec.impact}</strong></span>
                    <span className="text-muted-foreground">Esfuerzo: <strong>{rec.effort}</strong></span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Comparación con Peers */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-purple-500" />
            Comparación con Peers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-indigo-600 mb-2">
                {results.peerComparison.yourScore}
              </div>
              <p className="text-sm text-muted-foreground">Tu Puntuación</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {results.peerComparison.averageScore}
              </div>
              <p className="text-sm text-muted-foreground">Promedio</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {results.peerComparison.topPerformers}
              </div>
              <p className="text-sm text-muted-foreground">Top Performers</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {results.peerComparison.percentile}%
              </div>
              <p className="text-sm text-muted-foreground">Percentil</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

