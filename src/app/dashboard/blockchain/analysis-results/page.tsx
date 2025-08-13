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

interface BlockchainAnalysisResults {
  overallScore: number;
  analysisType: string;
  url: string;
  riskLevel: 'low' | 'medium' | 'high';
  indexerStatus: {
    connected: boolean;
    dataSource: string;
    lastUpdate: string;
  };
  blockchainMetrics: {
    smartContracts: number;
    transactions: number;
    securityScore: number;
    gasOptimization: number;
  };
  securityAnalysis: {
    vulnerabilities: number;
    auditScore: number;
    riskFactors: Array<{
      factor: string;
      severity: 'low' | 'medium' | 'high';
      description: string;
    }>;
  };
  performanceMetrics: {
    gasEfficiency: number;
    executionTime: number;
    throughput: number;
    scalability: number;
  };
  complianceStatus: {
    score: number;
    regulations: Array<{
      name: string;
      status: 'compliant' | 'partial' | 'non-compliant';
      description: string;
    }>;
  };
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

function BlockchainAnalysisResultsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState<BlockchainAnalysisResults | null>(null);
  const [indexerConnecting, setIndexerConnecting] = useState(true);
  const [indexerProgress, setIndexerProgress] = useState(0);
  const { queryIndexedData, filterIndexers } = useIndexerService();

  const analysisType = searchParams.get('type') || 'comprehensive';
  const url = searchParams.get('url') || 'wowseoweb3.com';

  const generateMockResults = useCallback((): BlockchainAnalysisResults => {
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
        dataSource: 'Blockchain Analytics Index',
        lastUpdate: new Date().toLocaleString()
      },
      blockchainMetrics: {
        smartContracts: Math.floor(seededRandom(3) * 50) + 10,
        transactions: Math.floor(seededRandom(4) * 100000) + 50000,
        securityScore: Math.floor(seededRandom(5) * 30) + 70,
        gasOptimization: Math.floor(seededRandom(6) * 25) + 75
      },
      securityAnalysis: {
        vulnerabilities: Math.floor(seededRandom(7) * 5) + 1,
        auditScore: Math.floor(seededRandom(8) * 30) + 70,
        riskFactors: [
          {
            factor: 'Reentrancy Risk',
            severity: 'medium',
            description: 'Algunos contratos pueden ser vulnerables a ataques de reentrancy'
          },
          {
            factor: 'Access Control',
            severity: 'low',
            description: 'Controles de acceso implementados correctamente en la mayoría de contratos'
          }
        ]
      },
      performanceMetrics: {
        gasEfficiency: Math.floor(seededRandom(9) * 25) + 75,
        executionTime: Math.floor(seededRandom(10) * 500) + 100,
        throughput: Math.floor(seededRandom(11) * 1000) + 500,
        scalability: Math.floor(seededRandom(12) * 30) + 70
      },
      complianceStatus: {
        score: Math.floor(seededRandom(13) * 30) + 70,
        regulations: [
          {
            name: 'GDPR',
            status: 'compliant',
            description: 'Cumple con las regulaciones de protección de datos'
          },
          {
            name: 'AML/KYC',
            status: 'partial',
            description: 'Implementación parcial de controles anti-lavado'
          }
        ]
      },
      opportunities: [
        {
          title: 'Optimización de Gas',
          description: 'Oportunidad de reducir costos de gas mediante optimización de contratos',
          solution: 'Implementar técnicas de optimización de gas en smart contracts',
          implementation: 'Revisar y refactorizar contratos para usar menos gas, implementar batch operations',
          estimatedImpact: '-30% costos de gas',
          difficulty: 'medium',
          category: 'optimization'
        },
        {
          title: 'Mejora de Seguridad',
          description: 'Implementar auditorías de seguridad adicionales',
          solution: 'Realizar auditorías de seguridad regulares y implementar mejores prácticas',
          implementation: 'Contratar firmas de auditoría especializadas, implementar testing automatizado',
          estimatedImpact: '+25% seguridad',
          difficulty: 'hard',
          category: 'security'
        }
      ],
      diagnostics: [
        {
          issue: 'Alto Consumo de Gas',
          severity: 'medium',
          description: 'Algunos contratos consumen más gas del necesario',
          recommendation: 'Optimizar funciones de contratos para reducir consumo de gas'
        },
        {
          issue: 'Falta de Documentación',
          severity: 'low',
          description: 'Algunos contratos carecen de documentación técnica completa',
          recommendation: 'Mejorar la documentación técnica de todos los smart contracts'
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
        const storedResults = sessionStorage.getItem('blockchainAnalysisResults');
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
    link.download = `blockchain-analysis-${results.url}-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleShare = async () => {
    if (navigator.share && results) {
      try {
        await navigator.share({
          title: `Análisis Blockchain - ${results.url}`,
          text: `Resultados del análisis blockchain para ${results.url}. Puntuación general: ${results.overallScore}/100`,
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
            <h1 className="text-3xl font-bold">Análisis Blockchain</h1>
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
                  Obteniendo datos blockchain desde Blockchain Analytics Index...
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
            <Button onClick={() => router.push('/dashboard/blockchain')} className="mt-4">
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

  const getComplianceColor = (status: string) => {
    switch (status) {
      case 'compliant': return 'text-green-600 bg-green-100';
      case 'partial': return 'text-yellow-600 bg-yellow-100';
      case 'non-compliant': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
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
            <h1 className="text-3xl font-bold">Análisis Blockchain</h1>
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
      <div className="flex justify-center mb-8">
        <div className="w-full max-w-md">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 justify-center">
                🔗 Puntuación General Blockchain
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
                      strokeDasharray={`${results.overallScore}, 100`}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold">{results.overallScore}</span>
                  </div>
                </div>
                <Badge className={getRiskColor(results.riskLevel)}>
                  Riesgo {results.riskLevel === 'low' ? 'Bajo' : results.riskLevel === 'medium' ? 'Medio' : 'Alto'}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Blockchain Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Smart Contracts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{results.blockchainMetrics.smartContracts}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Transacciones</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{results.blockchainMetrics.transactions.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Seguridad</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{results.blockchainMetrics.securityScore}/100</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Optimización Gas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{results.blockchainMetrics.gasOptimization}%</div>
          </CardContent>
        </Card>
      </div>

      {/* Security Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Análisis de Seguridad</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="text-center mb-4">
                <div className="text-3xl font-bold">{results.securityAnalysis.auditScore}/100</div>
                <div className="text-sm text-muted-foreground">Puntuación de Auditoría</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{results.securityAnalysis.vulnerabilities}</div>
                <div className="text-sm text-muted-foreground">Vulnerabilidades Detectadas</div>
              </div>
            </div>
            <div className="space-y-3">
              <h4 className="font-medium">Factores de Riesgo</h4>
              {results.securityAnalysis.riskFactors.map((factor, index) => (
                <div key={index} className="border rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium">{factor.factor}</span>
                    <Badge className={getRiskColor(factor.severity)}>
                      {factor.severity}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{factor.description}</p>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Métricas de Rendimiento</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{results.performanceMetrics.gasEfficiency}%</div>
              <div className="text-sm text-muted-foreground">Eficiencia Gas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{results.performanceMetrics.executionTime}ms</div>
              <div className="text-sm text-muted-foreground">Tiempo Ejecución</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{results.performanceMetrics.throughput}</div>
              <div className="text-sm text-muted-foreground">Throughput</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{results.performanceMetrics.scalability}%</div>
              <div className="text-sm text-muted-foreground">Escalabilidad</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Compliance Status */}
      <Card>
        <CardHeader>
          <CardTitle>Estado de Cumplimiento</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-center mb-4">
              <div className="text-3xl font-bold">{results.complianceStatus.score}/100</div>
              <div className="text-sm text-muted-foreground">Puntuación de Cumplimiento</div>
            </div>
            <div className="space-y-3">
              {results.complianceStatus.regulations.map((regulation, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">{regulation.name}</div>
                    <div className="text-sm text-muted-foreground">{regulation.description}</div>
                  </div>
                  <Badge className={getComplianceColor(regulation.status)}>
                    {regulation.status}
                  </Badge>
                </div>
              ))}
            </div>
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

export default function BlockchainAnalysisResultsPageWrapper() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <BlockchainAnalysisResultsPage />
    </Suspense>
  );
}