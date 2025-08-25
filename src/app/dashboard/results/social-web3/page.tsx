'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, LineChart, Line } from 'recharts';
import { Users, MessageCircle, TrendingUp, Share2, Download, ArrowLeft, CheckCircle, ExternalLink, Hash, Heart, Eye } from 'lucide-react';
import Link from 'next/link';

interface SocialWeb3Results {
  platforms: string[];
  metrics: {
    engagement: number;
    reach: number;
    influence: number;
    consistency: number;
  };
  platforms_data: Array<{
    name: string;
    connected: boolean;
    followers: number;
    posts: number;
    engagement: number;
    growth?: number;
    avgLikes?: number;
    avgComments?: number;
  }>;
  recommendations: Array<{
    platform: string;
    tips: string[];
  }>;
  score: number;
  detailedAnalysis?: {
    contentAnalysis: {
      topHashtags: string[];
      bestPerformingContent: string[];
      optimalPostingTimes: string[];
    };
    audienceInsights: {
      demographics: Array<{ age: string; percentage: number }>;
      interests: Array<{ topic: string; engagement: number }>;
      geographicDistribution: Array<{ region: string; percentage: number }>;
    };
    competitorAnalysis: {
      similarProfiles: Array<{ name: string; followers: number; engagement: number }>;
      industryBenchmarks: { avgEngagement: number; avgFollowers: number };
    };
    growthProjections: {
      nextMonth: { followers: number; engagement: number };
      nextQuarter: { followers: number; engagement: number };
    };
  };
}

const generateMockResults = (): SocialWeb3Results => {
  const metrics = {
    engagement: Math.floor(Math.random() * 30) + 60,
    reach: Math.floor(Math.random() * 25) + 65,
    influence: Math.floor(Math.random() * 20) + 70,
    consistency: Math.floor(Math.random() * 35) + 55
  };

  return {
    platforms: ['Mastodon', 'Hive', 'Lens Protocol', 'Mirror.xyz'],
    metrics,
    platforms_data: [
      {
        name: 'Mastodon',
        connected: true,
        followers: Math.floor(Math.random() * 1000) + 500,
        posts: Math.floor(Math.random() * 500) + 100,
        engagement: Math.floor(Math.random() * 20) + 10,
        growth: Math.floor(Math.random() * 15) + 5,
        avgLikes: Math.floor(Math.random() * 50) + 20,
        avgComments: Math.floor(Math.random() * 15) + 5
      },
      {
        name: 'Hive',
        connected: true,
        followers: Math.floor(Math.random() * 2000) + 800,
        posts: Math.floor(Math.random() * 300) + 80,
        engagement: Math.floor(Math.random() * 15) + 12,
        growth: Math.floor(Math.random() * 20) + 8,
        avgLikes: Math.floor(Math.random() * 80) + 30,
        avgComments: Math.floor(Math.random() * 25) + 10
      },
      {
        name: 'Lens Protocol',
        connected: true,
        followers: Math.floor(Math.random() * 1500) + 600,
        posts: Math.floor(Math.random() * 200) + 50,
        engagement: Math.floor(Math.random() * 25) + 15,
        growth: Math.floor(Math.random() * 25) + 10,
        avgLikes: Math.floor(Math.random() * 60) + 25,
        avgComments: Math.floor(Math.random() * 20) + 8
      },
      {
        name: 'Mirror.xyz',
        connected: false,
        followers: Math.floor(Math.random() * 800) + 300,
        posts: Math.floor(Math.random() * 100) + 30,
        engagement: Math.floor(Math.random() * 10) + 8,
        growth: Math.floor(Math.random() * 12) + 3,
        avgLikes: Math.floor(Math.random() * 40) + 15,
        avgComments: Math.floor(Math.random() * 10) + 3
      }
    ],
    recommendations: [
      {
        platform: 'Mastodon',
        tips: [
          'Aumenta la frecuencia de publicaciones a 2-3 por día',
          'Usa más hashtags relevantes en tus posts',
          'Interactúa más con otros usuarios de la comunidad'
        ]
      },
      {
        platform: 'Hive',
        tips: [
          'Publica contenido más visual y atractivo',
          'Participa en comunidades temáticas',
          'Mantén consistencia en horarios de publicación'
        ]
      },
      {
        platform: 'Lens Protocol',
        tips: [
          'Aprovecha las funciones de coleccionables NFT',
          'Colabora con otros creadores de contenido',
          'Experimenta con diferentes formatos de contenido'
        ]
      }
    ],
    score: Math.floor((metrics.engagement + metrics.reach + metrics.influence + metrics.consistency) / 4),
    detailedAnalysis: {
      contentAnalysis: {
        topHashtags: ['#Web3', '#DeFi', '#NFT', '#Blockchain', '#Crypto', '#Metaverse'],
        bestPerformingContent: [
          'Tutorial sobre DeFi farming',
          'Análisis de mercado NFT',
          'Guía de wallets Web3',
          'Review de nuevos protocolos'
        ],
        optimalPostingTimes: ['9:00 AM', '1:00 PM', '6:00 PM', '9:00 PM']
      },
      audienceInsights: {
        demographics: [
          { age: '18-24', percentage: 25 },
          { age: '25-34', percentage: 40 },
          { age: '35-44', percentage: 25 },
          { age: '45+', percentage: 10 }
        ],
        interests: [
          { topic: 'DeFi', engagement: 85 },
          { topic: 'NFTs', engagement: 78 },
          { topic: 'Gaming', engagement: 72 },
          { topic: 'Metaverse', engagement: 68 }
        ],
        geographicDistribution: [
          { region: 'América del Norte', percentage: 35 },
          { region: 'Europa', percentage: 30 },
          { region: 'Asia', percentage: 25 },
          { region: 'Otros', percentage: 10 }
        ]
      },
      competitorAnalysis: {
        similarProfiles: [
          { name: '@web3guru', followers: 15000, engagement: 12 },
          { name: '@defiexpert', followers: 22000, engagement: 8 },
          { name: '@nftcollector', followers: 18000, engagement: 15 }
        ],
        industryBenchmarks: { avgEngagement: 10, avgFollowers: 12000 }
      },
      growthProjections: {
        nextMonth: { followers: 500, engagement: 3 },
        nextQuarter: { followers: 1800, engagement: 5 }
      }
    }
  };
};



export default function SocialWeb3AnalysisResults() {
  const [results, setResults] = useState<SocialWeb3Results | null>(null);
  const router = useRouter();

  useEffect(() => {
    const savedResults = sessionStorage.getItem('socialWeb3AnalysisResults');
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
      const exportFileDefaultName = `social-web3-analysis-${new Date().toISOString().split('T')[0]}.json`;
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
          title: 'Análisis Social Web3',
          text: `Mi análisis de presencia en redes sociales Web3. Puntuación: ${results.score}/100`,
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
    { name: 'Engagement', value: results.metrics.engagement, icon: Heart },
    { name: 'Alcance', value: results.metrics.reach, icon: Eye },
    { name: 'Influencia', value: results.metrics.influence, icon: TrendingUp },
    { name: 'Consistencia', value: results.metrics.consistency, icon: CheckCircle }
  ];

  const radarData = Object.entries(results.metrics).map(([key, value]) => ({
    metric: key.charAt(0).toUpperCase() + key.slice(1),
    value,
    fullMark: 100
  }));

  const platformsData = results.platforms_data.map(platform => ({
    name: platform.name,
    followers: platform.followers,
    posts: platform.posts,
    engagement: platform.engagement,
    growth: platform.growth || 0
  }));

  const growthData = results.platforms_data.map(platform => ({
    name: platform.name,
    thisMonth: platform.followers,
    nextMonth: platform.followers + (platform.growth || 0) * 30,
    engagement: platform.engagement
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <Link href="/dashboard/social-web3" className="flex items-center text-sm text-muted-foreground hover:text-foreground mb-2">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Volver al análisis
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Resultados del Análisis Social Web3</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              Análisis completo de tu presencia en plataformas sociales descentralizadas
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
                  <Users className="h-5 w-5" />
                  Puntuación General Social Web3
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

        {/* Métricas Principales */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Métricas Principales</h2>
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
        </div>

        {/* Resumen General */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Resumen General</h2>
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
                <CardTitle>Distribución por Plataforma</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={platformsData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="followers"
                    >
                      {platformsData.map((entry, index) => (
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {results.recommendations.map((rec, index) => (
                  <div key={index} className="space-y-3">
                    <h4 className="font-semibold text-lg">{rec.platform}</h4>
                    <div className="space-y-2">
                      {rec.tips.map((tip, tipIndex) => (
                        <div key={tipIndex} className="flex items-start gap-3">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <p className="text-sm">{tip}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Análisis de Plataformas */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Análisis de Plataformas</h2>
          <Card>
            <CardHeader>
              <CardTitle>Comparación de Plataformas</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={platformsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="followers" fill="#8884d8" name="Seguidores" />
                  <Bar dataKey="posts" fill="#82ca9d" name="Publicaciones" />
                  <Bar dataKey="engagement" fill="#ffc658" name="Engagement %" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {results.platforms_data.map((platform, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {platform.name}
                    <Badge variant={platform.connected ? 'default' : 'secondary'}>
                      {platform.connected ? 'Conectado' : 'Desconectado'}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Seguidores:</span>
                    <span className="font-medium">{platform.followers.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Publicaciones:</span>
                    <span className="font-medium">{platform.posts}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Engagement:</span>
                    <span className="font-medium">{platform.engagement}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Crecimiento:</span>
                    <span className="font-medium text-green-600">+{platform.growth}%</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Análisis de Contenido */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Análisis de Contenido</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Hashtags Más Populares</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {results.detailedAnalysis?.contentAnalysis.topHashtags.map((hashtag, index) => (
                    <Badge key={index} variant="outline" className="flex items-center gap-1">
                      <Hash className="h-3 w-3" />
                      {hashtag.replace('#', '')}
                    </Badge>
                  )) || []}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Mejores Horarios de Publicación</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  {results.detailedAnalysis?.contentAnalysis.optimalPostingTimes.map((time, index) => (
                    <Badge key={index} variant="secondary" className="justify-center">
                      {time}
                    </Badge>
                  )) || []}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Contenido de Mejor Rendimiento</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {results.detailedAnalysis?.contentAnalysis.bestPerformingContent.map((content, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 border rounded-md">
                    <TrendingUp className="h-5 w-5 text-green-500" />
                    <span>{content}</span>
                  </div>
                )) || []}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Análisis de Audiencia */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Análisis de Audiencia</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Demografía de Audiencia</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={results.detailedAnalysis?.audienceInsights.demographics || []}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ age, percentage }) => `${age}: ${percentage}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="percentage"
                    >
                      {(results.detailedAnalysis?.audienceInsights.demographics || []).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Intereses de la Audiencia</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={results.detailedAnalysis?.audienceInsights.interests || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="topic" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="engagement" fill="#8884d8" name="Engagement %" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Distribución Geográfica</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {results.detailedAnalysis?.audienceInsights.geographicDistribution.map((region, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span>{region.region}</span>
                    <div className="flex items-center gap-2">
                      <Progress value={region.percentage} className="w-24" />
                      <span className="text-sm font-medium">{region.percentage}%</span>
                    </div>
                  </div>
                )) || []}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Proyecciones de Crecimiento */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Proyecciones de Crecimiento</h2>
          <Card>
            <CardHeader>
              <CardTitle>Proyección de Crecimiento</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={growthData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="thisMonth" stroke="#8884d8" name="Mes Actual" />
                  <Line type="monotone" dataKey="nextMonth" stroke="#82ca9d" name="Próximo Mes" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Proyecciones</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Próximo Mes</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Nuevos Seguidores:</span>
                      <span className="font-medium text-green-600">+{results.detailedAnalysis?.growthProjections.nextMonth.followers}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Mejora en Engagement:</span>
                      <span className="font-medium text-green-600">+{results.detailedAnalysis?.growthProjections.nextMonth.engagement}%</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Próximo Trimestre</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Nuevos Seguidores:</span>
                      <span className="font-medium text-green-600">+{results.detailedAnalysis?.growthProjections.nextQuarter.followers}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Mejora en Engagement:</span>
                      <span className="font-medium text-green-600">+{results.detailedAnalysis?.growthProjections.nextQuarter.engagement}%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Análisis Competitivo</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Benchmarks de la Industria</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Engagement Promedio:</span>
                        <span className="font-medium">{results.detailedAnalysis?.competitorAnalysis.industryBenchmarks.avgEngagement}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Seguidores Promedio:</span>
                        <span className="font-medium">{results.detailedAnalysis?.competitorAnalysis.industryBenchmarks.avgFollowers.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Perfiles Similares</h4>
                    <div className="space-y-2">
                      {results.detailedAnalysis?.competitorAnalysis.similarProfiles.map((profile, index) => (
                        <div key={index} className="flex justify-between items-center p-2 border rounded">
                          <span className="text-sm">{profile.name}</span>
                          <div className="text-xs text-muted-foreground">
                            {profile.followers.toLocaleString()} • {profile.engagement}%
                          </div>
                        </div>
                      )) || []}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Botones de Acción */}
        <div className="flex justify-center gap-4">
          <Link href="/dashboard/social-web3">
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

interface SocialWeb3Results {
  platforms: string[];
  metrics: {
    engagement: number;
    reach: number;
    influence: number;
    consistency: number;
  };
  platforms_data: Array<{
    name: string;
    connected: boolean;
    followers: number;
    posts: number;
    engagement: number;
    growth?: number;
    avgLikes?: number;
    avgComments?: number;
  }>;
  recommendations: Array<{
    platform: string;
    tips: string[];
  }>;
  score: number;
  detailedAnalysis?: {
    contentAnalysis: {
      topHashtags: string[];
      bestPerformingContent: string[];
      optimalPostingTimes: string[];
    };
    audienceInsights: {
      demographics: Array<{ age: string; percentage: number }>;
      interests: Array<{ topic: string; engagement: number }>;
      geographicDistribution: Array<{ region: string; percentage: number }>;
    };
    competitorAnalysis: {
      similarProfiles: Array<{ name: string; followers: number; engagement: number }>;
      industryBenchmarks: { avgEngagement: number; avgFollowers: number };
    };
    growthProjections: {
      nextMonth: { followers: number; engagement: number };
      nextQuarter: { followers: number; engagement: number };
    };
  };
}



const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

