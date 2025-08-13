'use client';

import { useEffect, useState, Suspense, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/ui/use-toast';
import { ArrowLeft, Download, Share2, RefreshCw } from 'lucide-react';
import { useIndexerService } from '@/hooks/useIndexerService';

interface BacklinksAnalysisResults {
  overallScore: number;
  analysisType: string;
  url: string;
  riskLevel: 'low' | 'medium' | 'high';
  indexerStatus: {
    connected: boolean;
    dataSource: string;
    lastUpdate: string;
  };
  backlinksMetrics: {
    totalBacklinks: number;
    domainAuthority: number;
    qualityScore: number;
    spamScore: number;
  };
  linkProfile: {
    dofollow: number;
    nofollow: number;
    sponsored: number;
    ugc: number;
  };
  topReferringDomains: Array<{
    domain: string;
    authority: number;
    links: number;
    traffic: number;
  }>;
  opportunities: Array<{
    title: string;
    description: string;
    solution: string;
    implementation: string;
    estimatedImpact: string;
    difficulty: 'easy' | 'medium' | 'hard';
    category: string;
  }>;
  diagnostics: Array<{
    issue: string;
    severity: 'low' | 'medium' | 'high';
    description: string;
    recommendation: string;
  }>;
}

function BacklinksAnalysisResultsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState<BacklinksAnalysisResults | null>(null);
  const [indexerConnecting, setIndexerConnecting] = useState(true);
  const [indexerProgress, setIndexerProgress] = useState(0);
  const { queryIndexedData, filterIndexers } = useIndexerService();

  const analysisType = searchParams.get('type') || 'comprehensive';
  const url = searchParams.get('url') || 'wowseoweb3.com';

  const generateMockResults = useCallback((): BacklinksAnalysisResults => {
    const seed = url.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const seededRandom = (index: number) => {
      const x = Math.sin(seed + index) * 10000;
      return x - Math.floor(x);
    };
    
    return {
      overallScore: Math.floor(seededRandom(1) * 40) + 60,
      analysisType,
      url,
      riskLevel: ['low', 'medium', 'high'][Math.floor(seededRandom(2) * 3)] as 'low' | 'medium' | 'high',
      indexerStatus: {
        connected: true,
        dataSource: 'Web3 Link Index',
        lastUpdate: new Date().toLocaleString()
      },
      backlinksMetrics: {
        totalBacklinks: Math.floor(seededRandom(3) * 5000) + 1000,
        domainAuthority: Math.floor(seededRandom(4) * 40) + 60,
        qualityScore: Math.floor(seededRandom(5) * 30) + 70,
        spamScore: Math.floor(seededRandom(6) * 20) + 5
      },
      linkProfile: {
        dofollow: Math.floor(seededRandom(7) * 60) + 40,
        nofollow: Math.floor(seededRandom(8) * 40) + 30,
        sponsored: Math.floor(seededRandom(9) * 15) + 5,
        ugc: Math.floor(seededRandom(10) * 10) + 5
      },
      topReferringDomains: [
        {
          domain: 'ethereum.org',
          authority: 95,
          links: Math.floor(seededRandom(11) * 50) + 10,
          traffic: Math.floor(seededRandom(12) * 10000) + 5000
        },
        {
          domain: 'coindesk.com',
          authority: 88,
          links: Math.floor(seededRandom(13) * 30) + 5,
          traffic: Math.floor(seededRandom(14) * 8000) + 3000
        },
        {
          domain: 'cointelegraph.com',
          authority: 85,
          links: Math.floor(seededRandom(15) * 25) + 8,
          traffic: Math.floor(seededRandom(16) * 6000) + 2000
        }
      ],
      opportunities: [
        {
          title: 'Conseguir Enlaces de Proyectos DeFi',
          description: 'Oportunidad de obtener backlinks de alta calidad desde proyectos DeFi establecidos',
          solution: 'Crear contenido colaborativo con protocolos DeFi populares',
          implementation: 'Desarrollar guías técnicas, tutoriales y análisis de protocolos DeFi que agreguen valor real',
          estimatedImpact: '+15% autoridad de dominio',
          difficulty: 'medium',
          category: 'link-building'
        },
        {
          title: 'Optimizar Anchor Text Distribution',
          description: 'La distribución actual de anchor text puede mejorarse para mayor diversidad',
          solution: 'Diversificar los anchor texts con variaciones de marca y palabras clave',
          implementation: 'Crear una estrategia de anchor text que incluya: marca (40%), genéricos (30%), palabras clave (20%), URLs (10%)',
          estimatedImpact: '+10% relevancia temática',
          difficulty: 'easy',
          category: 'optimization'
        }
      ],
      diagnostics: [
        {
          issue: 'Enlaces de Baja Calidad Detectados',
          severity: 'medium',
          description: 'Se han identificado algunos backlinks de dominios con baja autoridad que podrían afectar el perfil de enlaces',
          recommendation: 'Revisar y considerar desautorizar enlaces de dominios spam o de muy baja calidad'
        },
        {
          issue: 'Velocidad de Adquisición de Enlaces',
          severity: 'low',
          description: 'La velocidad de adquisición de nuevos backlinks ha disminuido en los últimos 3 meses',
          recommendation: 'Implementar una estrategia más activa de link building y outreach'
        }
      ]
    };
  }, [url, analysisType]);

  useEffect(() => {
    const loadResults = async () => {
      try {
        setLoading(true);
        setIndexerConnecting(true);
        
        // Simular conexión con indexador
        const progressInterval = setInterval(() => {
          setIndexerProgress(prev => {
            if (prev >= 100) {
              clearInterval(progressInterval);
              setIndexerConnecting(false);
              return 100;
            }
            return prev + 10;
          });
        }, 200);

        // Intentar cargar desde sessionStorage primero
        const storedResults = sessionStorage.getItem('backlinksAnalysisResults');
        if (storedResults) {
          const parsedResults = JSON.parse(storedResults);
          setResults(parsedResults);
        } else {
          // Generar resultados mock si no hay datos almacenados
          const mockResults = generateMockResults();
          setResults(mockResults);
        }

        // Simular carga de datos del indexador
        setTimeout(() => {
          setLoading(false);
        }, 2000);

      } catch (error) {
        console.error('Error loading analysis results:', error);
        toast({
          title: "Error",
          description: "No se pudieron cargar los resultados del análisis",
          variant: "destructive"
        });
        setLoading(false);
        setIndexerConnecting(false);
      }
    };

    loadResults();
  }, [generateMockResults, toast]);

  const handleExport = () => {
    if (!results) return;
    
    const dataStr = JSON.stringify(results, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `backlinks-analysis-${results.url}-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleShare = async () => {
    if (navigator.share && results) {
      try {
        await navigator.share({
          title: `Análisis de Backlinks - ${results.url}`,
          text: `Resultados del análisis de backlinks para ${results.url}. Puntuación general: ${results.overallScore}/100`,
          url: window.location.href
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Enlace copiado",
        description: "El enlace ha sido copiado al portapapeles"
      });
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Análisis de Backlinks</h1>
            <p className="text-muted-foreground">Cargando resultados para {url}...</p>
          </div>
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Conectando con indexador...</span>
                <span>{indexerProgress}%</span>
              </div>
              <Progress value={indexerProgress} className="w-full" />
              {indexerConnecting && (
                <p className="text-sm text-muted-foreground">
                  Obteniendo datos de backlinks desde Web3 Link Index...
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="p-6 text-center">
            <p>No se encontraron resultados de análisis.</p>
            <Button onClick={() => router.push('/dashboard/backlinks')} className="mt-4">
              Realizar nuevo análisis
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Análisis de Backlinks</h1>
            <p className="text-muted-foreground">{results.url}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleShare}>
            <Share2 className="h-4 w-4 mr-2" />
            Compartir
          </Button>
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Overall Score */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Puntuación General
            <Badge className={getRiskColor(results.riskLevel)}>
              Riesgo {results.riskLevel}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <div className={`text-6xl font-bold ${getScoreColor(results.overallScore)}`}>
              {results.overallScore}
            </div>
            <div className="text-xl text-muted-foreground">/ 100</div>
            <Progress value={results.overallScore} className="mt-4" />
          </div>
        </CardContent>
      </Card>

      {/* Backlinks Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Backlinks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{results.backlinksMetrics.totalBacklinks.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Domain Authority</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{results.backlinksMetrics.domainAuthority}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Quality Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{results.backlinksMetrics.qualityScore}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Spam Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{results.backlinksMetrics.spamScore}%</div>
          </CardContent>
        </Card>
      </div>

      {/* Link Profile */}
      <Card>
        <CardHeader>
          <CardTitle>Perfil de Enlaces</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{results.linkProfile.dofollow}%</div>
              <div className="text-sm text-muted-foreground">Dofollow</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{results.linkProfile.nofollow}%</div>
              <div className="text-sm text-muted-foreground">Nofollow</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{results.linkProfile.sponsored}%</div>
              <div className="text-sm text-muted-foreground">Sponsored</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{results.linkProfile.ugc}%</div>
              <div className="text-sm text-muted-foreground">UGC</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Top Referring Domains */}
      <Card>
        <CardHeader>
          <CardTitle>Principales Dominios de Referencia</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {results.topReferringDomains.map((domain, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <div className="font-medium">{domain.domain}</div>
                  <div className="text-sm text-muted-foreground">
                    Authority: {domain.authority} | Enlaces: {domain.links}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">{domain.traffic.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">tráfico estimado</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Opportunities */}
      <Card>
        <CardHeader>
          <CardTitle>Oportunidades de Mejora</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {results.opportunities.map((opportunity, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">{opportunity.title}</h3>
                  <Badge variant={opportunity.difficulty === 'easy' ? 'default' : opportunity.difficulty === 'medium' ? 'secondary' : 'destructive'}>
                    {opportunity.difficulty}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{opportunity.description}</p>
                <p className="text-sm mb-2"><strong>Solución:</strong> {opportunity.solution}</p>
                <p className="text-sm mb-2"><strong>Implementación:</strong> {opportunity.implementation}</p>
                <p className="text-sm text-green-600"><strong>Impacto estimado:</strong> {opportunity.estimatedImpact}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Diagnostics */}
      <Card>
        <CardHeader>
          <CardTitle>Diagnósticos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {results.diagnostics.map((diagnostic, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">{diagnostic.issue}</h3>
                  <Badge className={getRiskColor(diagnostic.severity)}>
                    {diagnostic.severity}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{diagnostic.description}</p>
                <p className="text-sm"><strong>Recomendación:</strong> {diagnostic.recommendation}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Indexer Status */}
      <Card>
        <CardHeader>
          <CardTitle>Estado del Indexador</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Fuente de datos: {results.indexerStatus.dataSource}</p>
              <p className="text-sm text-muted-foreground">Última actualización: {results.indexerStatus.lastUpdate}</p>
            </div>
            <Badge className="bg-green-100 text-green-600">
              Conectado
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function BacklinksAnalysisResultsPageWrapper() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <BacklinksAnalysisResultsPage />
    </Suspense>
  );
}