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
  Gem, TrendingUp, Eye, DollarSign, BarChart3, Star, 
  Download, Share2, ArrowUp, ArrowDown, Minus,
  CheckCircle, AlertTriangle, Info, Target, Image, Palette, Crown, Users,
  Activity, Clock, Award
} from 'lucide-react';

// Función para generar datos mock realistas
const generateMockResults = () => {
  const baseScore = Math.floor(Math.random() * 30) + 70; // 70-100
  
  return {
    overallScore: baseScore,
    nftAddress: '0x495f947276749Ce646f68AC8c248420045cb7b5e',
    tokenId: '12345',
    collectionName: 'Bored Ape Yacht Club',
    analysisDate: new Date().toISOString(),
    
    // Métricas principales
    metrics: {
      priceScore: Math.floor(Math.random() * 20) + 75,
      rarityScore: Math.floor(Math.random() * 25) + 70,
      marketScore: Math.floor(Math.random() * 30) + 65,
      liquidityScore: Math.floor(Math.random() * 20) + 80,
      trendScore: Math.floor(Math.random() * 25) + 70,
      utilityScore: Math.floor(Math.random() * 20) + 75
    },
    
    // Datos de precio
    priceData: {
      currentPrice: (Math.random() * 50 + 10).toFixed(2), // 10-60 ETH
      floorPrice: (Math.random() * 30 + 5).toFixed(2), // 5-35 ETH
      lastSale: (Math.random() * 40 + 8).toFixed(2), // 8-48 ETH
      avgPrice: (Math.random() * 35 + 12).toFixed(2), // 12-47 ETH
      priceChange24h: (Math.random() * 20 - 10).toFixed(1), // -10% to +10%
      volume24h: Math.floor(Math.random() * 1000 + 100) // 100-1100 ETH
    },
    
    // Análisis de rareza
    rarityAnalysis: {
      rank: Math.floor(Math.random() * 1000) + 1,
      totalSupply: 10000,
      rarityScore: (Math.random() * 500 + 100).toFixed(1),
      percentile: Math.floor(Math.random() * 20) + 80, // Top 20%
      traits: [
        { trait: 'Background', value: 'Blue', rarity: 15.2 },
        { trait: 'Fur', value: 'Golden Brown', rarity: 8.7 },
        { trait: 'Eyes', value: 'Laser Eyes', rarity: 2.1 },
        { trait: 'Mouth', value: 'Bored', rarity: 45.3 },
        { trait: 'Hat', value: 'Crown', rarity: 0.8 },
        { trait: 'Clothes', value: 'Tuxedo', rarity: 3.2 }
      ]
    },
    
    // Historial de precios
    priceHistory: Array.from({ length: 30 }, (_, i) => ({
      date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toLocaleDateString(),
      price: Math.random() * 20 + 20,
      volume: Math.random() * 100 + 50,
      sales: Math.floor(Math.random() * 10) + 1
    })),
    
    // Análisis de mercado
    marketAnalysis: {
      totalVolume: Math.floor(Math.random() * 50000 + 10000),
      totalSales: Math.floor(Math.random() * 5000 + 1000),
      uniqueOwners: Math.floor(Math.random() * 3000 + 2000),
      ownershipDistribution: Math.floor(Math.random() * 30) + 70, // 70-100%
      marketCap: Math.floor(Math.random() * 500000 + 100000),
      avgHoldingTime: Math.floor(Math.random() * 200) + 50 // 50-250 días
    },
    
    // Actividad de trading
    tradingActivity: [
      { marketplace: 'OpenSea', volume: 45.2, sales: 234, share: 65 },
      { marketplace: 'LooksRare', volume: 12.8, sales: 89, share: 18 },
      { marketplace: 'X2Y2', volume: 8.1, sales: 45, share: 12 },
      { marketplace: 'Blur', volume: 3.5, sales: 23, share: 5 }
    ],
    
    // Análisis de holders
    holderAnalysis: {
      whaleHolders: Math.floor(Math.random() * 50) + 20,
      diamondHands: Math.floor(Math.random() * 30) + 40, // %
      paperHands: Math.floor(Math.random() * 20) + 15, // %
      avgHoldingPeriod: Math.floor(Math.random() * 150) + 80,
      topHolderPercentage: Math.floor(Math.random() * 15) + 5 // %
    },
    
    // Distribución de rareza
    rarityDistribution: [
      { name: 'Común', value: 60, color: '#6B7280' },
      { name: 'Poco Común', value: 25, color: '#10B981' },
      { name: 'Raro', value: 10, color: '#F59E0B' },
      { name: 'Épico', value: 4, color: '#8B5CF6' },
      { name: 'Legendario', value: 1, color: '#EF4444' }
    ],
    
    // Recomendaciones
    recommendations: [
      {
        category: 'Precio',
        priority: 'high',
        title: 'Precio por encima del promedio',
        description: 'El NFT está valorado 15% por encima del precio promedio de la colección.',
        action: 'Considerar venta si buscas ganancias a corto plazo'
      },
      {
        category: 'Rareza',
        priority: 'medium',
        title: 'Traits raros detectados',
        description: 'Posee traits con rareza inferior al 5%, aumentando su valor potencial.',
        action: 'Mantener para apreciación a largo plazo'
      },
      {
        category: 'Mercado',
        priority: 'medium',
        title: 'Alta liquidez',
        description: 'La colección tiene alta actividad de trading y liquidez.',
        action: 'Fácil de vender cuando sea necesario'
      }
    ],
    
    // Comparación con colección
    collectionComparison: {
      yourRank: Math.floor(Math.random() * 1000) + 1,
      totalItems: 10000,
      percentile: Math.floor(Math.random() * 20) + 80,
      avgCollectionPrice: (Math.random() * 20 + 15).toFixed(2),
      floorPrice: (Math.random() * 15 + 8).toFixed(2)
    }
  };
};

export default function NFTTrackingResults() {
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
    link.download = `nft-analysis-${Date.now()}.json`;
    link.click();
  };

  const shareResults = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Análisis de NFT',
          text: `Puntuación NFT: ${results?.overallScore}/100`,
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

  const getPriceChangeColor = (change: string) => {
    const num = parseFloat(change);
    if (num > 0) return 'text-green-600';
    if (num < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const getRarityColor = (rarity: number) => {
    if (rarity < 1) return 'text-red-600 font-bold';
    if (rarity < 5) return 'text-purple-600 font-bold';
    if (rarity < 15) return 'text-yellow-600 font-medium';
    if (rarity < 30) return 'text-green-600';
    return 'text-gray-600';
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Activity className="h-8 w-8 animate-spin mx-auto mb-4 text-pink-500" />
            <p className="text-lg font-medium">Analizando NFT...</p>
            <p className="text-muted-foreground">Obteniendo datos de precio, rareza y mercado</p>
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
          <div className="p-2 bg-gradient-to-r from-pink-500 to-rose-500 rounded-lg">
            <Gem className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
              Análisis de NFT
            </h1>
            <p className="text-muted-foreground">
              {results.collectionName} • Token #{results.tokenId}
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
      <Card className="bg-gradient-to-r from-pink-50 to-rose-50 border-pink-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Puntuación General del NFT</h2>
              <p className="text-muted-foreground">Evaluación basada en precio, rareza y tendencias de mercado</p>
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
                    stroke="url(#gradientPink)"
                    strokeWidth="8"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={`${(results.overallScore / 100) * 314} 314`}
                  />
                  <defs>
                    <linearGradient id="gradientPink" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#EC4899" />
                      <stop offset="100%" stopColor="#F43F5E" />
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
              <DollarSign className="h-5 w-5 text-green-500" />
              Precio
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl font-bold">{results.metrics.priceScore}</span>
              {getScoreIcon(results.metrics.priceScore)}
            </div>
            <Progress value={results.metrics.priceScore} className="mb-2" />
            <p className="text-sm text-muted-foreground">
              Valoración actual: {results.priceData.currentPrice} ETH
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Star className="h-5 w-5 text-yellow-500" />
              Rareza
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl font-bold">{results.metrics.rarityScore}</span>
              {getScoreIcon(results.metrics.rarityScore)}
            </div>
            <Progress value={results.metrics.rarityScore} className="mb-2" />
            <p className="text-sm text-muted-foreground">
              Ranking: #{results.rarityAnalysis.rank} de {results.rarityAnalysis.totalSupply.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <BarChart3 className="h-5 w-5 text-blue-500" />
              Mercado
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl font-bold">{results.metrics.marketScore}</span>
              {getScoreIcon(results.metrics.marketScore)}
            </div>
            <Progress value={results.metrics.marketScore} className="mb-2" />
            <p className="text-sm text-muted-foreground">
              Volumen 24h: {results.priceData.volume24h} ETH
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Datos de Precio Detallados */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-green-500" />
            Análisis de Precio Detallado
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{results.priceData.currentPrice} ETH</div>
              <p className="text-sm text-muted-foreground">Precio Actual</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{results.priceData.floorPrice} ETH</div>
              <p className="text-sm text-muted-foreground">Precio Floor</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{results.priceData.lastSale} ETH</div>
              <p className="text-sm text-muted-foreground">Última Venta</p>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${getPriceChangeColor(results.priceData.priceChange24h)}`}>
                {results.priceData.priceChange24h}%
              </div>
              <p className="text-sm text-muted-foreground">Cambio 24h</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Historial de Precios */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-500" />
            Historial de Precios (30 días)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={results.priceHistory}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="price" stroke="#EC4899" strokeWidth={2} name="Precio (ETH)" />
                <Line type="monotone" dataKey="volume" stroke="#06B6D4" strokeWidth={2} name="Volumen" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Análisis de Rareza */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-yellow-500" />
            Análisis de Rareza
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-4">Traits del NFT</h4>
              <div className="space-y-3">
                {results.rarityAnalysis.traits.map((trait: any, index: number) => (
                  <div key={index} className="flex justify-between items-center p-3 border rounded-lg">
                    <div>
                      <span className="font-medium">{trait.trait}</span>
                      <p className="text-sm text-muted-foreground">{trait.value}</p>
                    </div>
                    <div className="text-right">
                      <span className={`text-sm ${getRarityColor(trait.rarity)}`}>
                        {trait.rarity}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-4">Distribución de Rareza</h4>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={results.rarityDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {results.rarityDistribution.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-4">
                {results.rarityDistribution.map((item: any, index: number) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="text-sm">{item.name}: {item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actividad de Trading */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-purple-500" />
            Actividad de Trading por Marketplace
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {results.tradingActivity.map((marketplace: any, index: number) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">{marketplace.marketplace[0]}</span>
                  </div>
                  <div>
                    <h4 className="font-medium">{marketplace.marketplace}</h4>
                    <p className="text-sm text-muted-foreground">
                      {marketplace.sales} ventas • {marketplace.volume} ETH
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold">{marketplace.share}%</div>
                  <Progress value={marketplace.share} className="w-20" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Análisis de Holders y Métricas de Mercado */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-500" />
              Análisis de Holders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Whale Holders</span>
                <span className="font-bold">{results.holderAnalysis.whaleHolders}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Diamond Hands</span>
                <span className="font-bold">{results.holderAnalysis.diamondHands}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Paper Hands</span>
                <span className="font-bold">{results.holderAnalysis.paperHands}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Período Promedio</span>
                <span className="font-bold">{results.holderAnalysis.avgHoldingPeriod} días</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-green-500" />
              Métricas de Mercado
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Volumen Total</span>
                <span className="font-bold">{results.marketAnalysis.totalVolume.toLocaleString()} ETH</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Ventas Totales</span>
                <span className="font-bold">{results.marketAnalysis.totalSales.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Owners Únicos</span>
                <span className="font-bold">{results.marketAnalysis.uniqueOwners.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Market Cap</span>
                <span className="font-bold">{results.marketAnalysis.marketCap.toLocaleString()} ETH</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recomendaciones */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-yellow-500" />
            Recomendaciones
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
                  <p className="text-sm font-medium text-blue-600">{rec.action}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Comparación con Colección */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-purple-500" />
            Comparación con Colección
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-pink-600 mb-2">
                #{results.collectionComparison.yourRank}
              </div>
              <p className="text-sm text-muted-foreground">Tu Ranking</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {results.collectionComparison.percentile}%
              </div>
              <p className="text-sm text-muted-foreground">Percentil</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {results.collectionComparison.avgCollectionPrice} ETH
              </div>
              <p className="text-sm text-muted-foreground">Precio Promedio</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

