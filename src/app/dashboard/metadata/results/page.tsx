'use client';

import { useEffect, useState, Suspense, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';
import { Icons } from '@/components/icons';

// Componente IconWrapper
const IconWrapper = ({ icon, className }: { icon: keyof typeof Icons, className?: string }) => {
  const Icon = Icons[icon] || Icons.settings;
  return <Icon className={className} />;
};

// Componente Progress personalizado con colores dinámicos
const DynamicProgress = ({ value, className }: { value: number; className?: string }) => {
  const getProgressBarClass = (score: number) => {
    if (score >= 80) return 'progress-bar-green';
    if (score >= 60) return 'progress-bar-yellow';
    return 'progress-bar-red';
  };
  
  return (
    <div className={cn("relative h-2 w-full overflow-hidden rounded-full bg-secondary", className)}>
      <div 
        className={cn("h-full rounded-full progress-bar-animated", getProgressBarClass(value))}
        data-progress={Math.round(value) || 0}
      />
    </div>
  );
};

// Componente CircularProgress
interface CircularProgressProps {
  value: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
}

const CircularProgress: React.FC<CircularProgressProps> = ({
  value,
  size = 120,
  strokeWidth = 8,
  className = ''
}) => {
  const [animatedValue, setAnimatedValue] = useState(0);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = `${circumference} ${circumference}`;
  const strokeDashoffset = circumference - (animatedValue / 100) * circumference;

  useEffect(() => {
    const timer = setTimeout(() => {
      const duration = 2000;
      const steps = 60;
      const stepValue = value / steps;
      const stepDuration = duration / steps;
      
      let currentStep = 0;
      const interval = setInterval(() => {
        currentStep++;
        const newValue = Math.min(stepValue * currentStep, value);
        setAnimatedValue(newValue);
        
        if (currentStep >= steps) {
          clearInterval(interval);
        }
      }, stepDuration);
      
      return () => clearInterval(interval);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [value]);
  
  const getProgressClass = (score: number) => {
    if (score >= 80) return 'circular-progress-green';
    if (score >= 60) return 'circular-progress-yellow';
    return 'circular-progress-red';
  };

  return (
    <div 
      className={`circular-progress ${className}`}
      style={{ '--size': `${size}px` } as React.CSSProperties}
    >
      <svg
        width={size}
        height={size}
        className="circular-progress-svg"
        style={{ transform: 'rotate(-90deg)' }}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          fill="none"
          className="circular-progress-background"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className={`circular-progress-foreground ${getProgressClass(animatedValue)}`}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center circular-progress-text">
          <div className="text-3xl font-bold text-gray-900 dark:text-white">
            {Math.round(animatedValue)}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Score
          </div>
        </div>
      </div>
    </div>
  );
};

// Tipos para los resultados de metadata
interface MetadataResults {
  url: string;
  analysisType: string;
  overallScore: number;
  metadata: {
    contractName: string;
    symbol: string;
    description: string;
    completeness: number;
    seoOptimization: number;
    standardCompliance: number;
  };
  tokens: {
    totalTokens: number;
    withMetadata: number;
    missingMetadata: number;
    qualityScore: number;
  };
  recommendations: Array<{
    type: 'critical' | 'warning' | 'suggestion';
    title: string;
    description: string;
    impact: string;
  }>;
  seoMetrics: {
    titleOptimization: number;
    descriptionQuality: number;
    keywordDensity: number;
    structuredData: number;
  };
}

// Componente de carga
function LoadingState({ url, onBackToHome }: { url: string; onBackToHome: () => void }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + 2;
      });
    }, 100);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
            <IconWrapper icon="metadata" className="h-6 w-6 text-primary animate-pulse" />
          </div>
          <CardTitle>Analizando Metadatos</CardTitle>
          <CardDescription>Evaluando {url}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Progress value={progress} className="w-full" />
          <p className="text-sm text-center text-muted-foreground">
            {progress < 30 && "Extrayendo metadatos del contrato..."}
            {progress >= 30 && progress < 60 && "Analizando estructura de datos..."}
            {progress >= 60 && progress < 90 && "Evaluando optimización SEO..."}
            {progress >= 90 && "Generando recomendaciones..."}
          </p>
          <Button variant="outline" onClick={onBackToHome} className="w-full">
            Volver al Dashboard
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

// Componente de error
function ErrorState({ onBackToHome }: { onBackToHome: () => void }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
            <IconWrapper icon="warning" className="h-6 w-6 text-red-600" />
          </div>
          <CardTitle className="text-red-600">Error en el Análisis</CardTitle>
          <CardDescription>No se pudieron obtener los metadatos</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={onBackToHome} className="w-full">
            Volver al Dashboard
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

// Componente principal de resultados
function MetadataResultsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState<MetadataResults | null>(null);

  const url = searchParams.get('url') || 'ejemplo.com';
  const analysisType = searchParams.get('type') || 'metadata';

  // Generar resultados simulados
  const generateMockResults = useCallback((): MetadataResults => {
    const baseScore = Math.floor(Math.random() * 30) + 60;
    
    return {
      url,
      analysisType: 'Análisis de Metadatos',
      overallScore: baseScore,
      metadata: {
        contractName: 'MyToken',
        symbol: 'MTK',
        description: 'Un token innovador para el ecosistema DeFi',
        completeness: Math.floor(Math.random() * 20) + 75,
        seoOptimization: Math.floor(Math.random() * 25) + 65,
        standardCompliance: Math.floor(Math.random() * 15) + 80
      },
      tokens: {
        totalTokens: Math.floor(Math.random() * 1000) + 500,
        withMetadata: Math.floor(Math.random() * 400) + 400,
        missingMetadata: Math.floor(Math.random() * 200) + 50,
        qualityScore: Math.floor(Math.random() * 20) + 70
      },
      recommendations: [
        {
          type: 'critical',
          title: 'Descripción del contrato incompleta',
          description: 'Agregar una descripción más detallada mejorará la visibilidad',
          impact: 'Alto impacto en SEO'
        },
        {
          type: 'warning',
          title: 'Metadatos de tokens inconsistentes',
          description: 'Algunos tokens no siguen el estándar ERC-721',
          impact: 'Medio impacto en compatibilidad'
        },
        {
          type: 'suggestion',
          title: 'Optimizar palabras clave',
          description: 'Incluir términos relevantes en los metadatos',
          impact: 'Mejora en descubrimiento'
        }
      ],
      seoMetrics: {
        titleOptimization: Math.floor(Math.random() * 25) + 70,
        descriptionQuality: Math.floor(Math.random() * 30) + 60,
        keywordDensity: Math.floor(Math.random() * 20) + 75,
        structuredData: Math.floor(Math.random() * 35) + 55
      }
    };
  }, [url]);

  useEffect(() => {
    // Intentar cargar datos del sessionStorage primero
    const storedData = sessionStorage.getItem('metadataAnalysisResults');
    
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        if (parsedData.analysisResult) {
          // Convertir los datos del hook a la estructura esperada por la página
          const convertedResults: MetadataResults = {
            url: parsedData.formData?.contractAddress || url,
            analysisType: 'Análisis de Metadatos',
            overallScore: parsedData.analysisResult.score,
            metadata: {
              contractName: 'Smart Contract',
              symbol: 'SC',
              description: 'Análisis de metadatos del contrato inteligente',
              completeness: parsedData.analysisResult.completeness,
              seoOptimization: parsedData.analysisResult.seoScore,
              standardCompliance: parsedData.analysisResult.standards.erc721 ? 95 : 75
            },
            tokens: {
              totalTokens: 1000,
              withMetadata: 850,
              missingMetadata: 150,
              qualityScore: parsedData.analysisResult.score
            },
            recommendations: parsedData.analysisResult.recommendations.map((rec: string, index: number) => ({
              type: index === 0 ? 'critical' as const : index === 1 ? 'warning' as const : 'suggestion' as const,
              title: rec,
              description: `Recomendación basada en el análisis de metadatos`,
              impact: index === 0 ? 'Alto impacto' : index === 1 ? 'Medio impacto' : 'Bajo impacto'
            })),
            seoMetrics: {
              titleOptimization: parsedData.analysisResult.seoScore,
              descriptionQuality: parsedData.analysisResult.completeness,
              keywordDensity: Math.floor(Math.random() * 20) + 70,
              structuredData: parsedData.analysisResult.standards.erc721 ? 90 : 60
            }
          };
          
          setResults(convertedResults);
          setLoading(false);
          return;
        }
      } catch (error) {
        console.error('Error parsing stored analysis data:', error);
      }
    }
    
    // Si no hay datos almacenados, simular carga de análisis
    const timer = setTimeout(() => {
      const mockResults = generateMockResults();
      setResults(mockResults);
      setLoading(false);
    }, 3000);

    return () => {
      clearTimeout(timer);
    };
  }, [generateMockResults, url]);

  if (loading) {
    return (
      <LoadingState 
         url={url}
         onBackToHome={() => router.push('/dashboard')}
       />
    );
  }

  if (!results) {
    return (
      <ErrorState onBackToHome={() => router.push('/dashboard')} />
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadge = (score: number) => {
    if (score >= 80) return 'bg-green-100 text-green-800';
    if (score >= 60) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Resultados del Análisis de Metadatos
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                {results.analysisType} para {results.url}
              </p>
            </div>
            <Button onClick={() => router.push('/dashboard')} variant="outline">
              <IconWrapper icon="home" className="mr-2 h-4 w-4" />
              Volver al Dashboard
            </Button>
          </div>
          
          {/* Puntuación General */}
          <div className="flex justify-center mb-8">
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Puntuación General</h2>
              <p className="text-gray-600 dark:text-gray-400">Calidad de metadatos</p>
              <CircularProgress value={results.overallScore} size={150} className="mx-auto" />
              <Badge className={getScoreBadge(results.overallScore)}>
                {results.overallScore >= 80 ? 'Excelente' : results.overallScore >= 60 ? 'Bueno' : 'Necesita Mejoras'}
              </Badge>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {/* Métricas de Metadatos */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IconWrapper icon="metadata" className="h-5 w-5" />
                Análisis de Metadatos del Contrato
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Completitud</span>
                    <span className={`text-sm ${getScoreColor(results.metadata.completeness)}`}>
                      {results.metadata.completeness}%
                    </span>
                  </div>
                  <DynamicProgress value={results.metadata.completeness} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Optimización SEO</span>
                    <span className={`text-sm ${getScoreColor(results.metadata.seoOptimization)}`}>
                      {results.metadata.seoOptimization}%
                    </span>
                  </div>
                  <DynamicProgress value={results.metadata.seoOptimization} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Cumplimiento de Estándares</span>
                    <span className={`text-sm ${getScoreColor(results.metadata.standardCompliance)}`}>
                      {results.metadata.standardCompliance}%
                    </span>
                  </div>
                  <DynamicProgress value={results.metadata.standardCompliance} className="h-2" />
                </div>
              </div>
              
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="text-sm text-muted-foreground">Nombre del Contrato</div>
                  <div className="font-medium">{results.metadata.contractName}</div>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="text-sm text-muted-foreground">Símbolo</div>
                  <div className="font-medium">{results.metadata.symbol}</div>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="text-sm text-muted-foreground">Descripción</div>
                  <div className="font-medium text-sm">{results.metadata.description}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Análisis de Tokens */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IconWrapper icon="token" className="h-5 w-5" />
                Análisis de Tokens
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{results.tokens.totalTokens}</div>
                  <div className="text-sm text-muted-foreground">Total de Tokens</div>
                </div>
                <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{results.tokens.withMetadata}</div>
                  <div className="text-sm text-muted-foreground">Con Metadatos</div>
                </div>
                <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">{results.tokens.missingMetadata}</div>
                  <div className="text-sm text-muted-foreground">Sin Metadatos</div>
                </div>
                <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{results.tokens.qualityScore}%</div>
                  <div className="text-sm text-muted-foreground">Calidad Promedio</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Métricas SEO */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IconWrapper icon="analytics" className="h-5 w-5" />
                Métricas SEO
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Optimización de Títulos</span>
                      <span className={`text-sm ${getScoreColor(results.seoMetrics.titleOptimization)}`}>
                        {results.seoMetrics.titleOptimization}%
                      </span>
                    </div>
                    <DynamicProgress value={results.seoMetrics.titleOptimization} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Calidad de Descripciones</span>
                      <span className={`text-sm ${getScoreColor(results.seoMetrics.descriptionQuality)}`}>
                        {results.seoMetrics.descriptionQuality}%
                      </span>
                    </div>
                    <DynamicProgress value={results.seoMetrics.descriptionQuality} className="h-2" />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Densidad de Palabras Clave</span>
                      <span className={`text-sm ${getScoreColor(results.seoMetrics.keywordDensity)}`}>
                        {results.seoMetrics.keywordDensity}%
                      </span>
                    </div>
                    <DynamicProgress value={results.seoMetrics.keywordDensity} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Datos Estructurados</span>
                      <span className={`text-sm ${getScoreColor(results.seoMetrics.structuredData)}`}>
                        {results.seoMetrics.structuredData}%
                      </span>
                    </div>
                    <DynamicProgress value={results.seoMetrics.structuredData} className="h-2" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recomendaciones */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IconWrapper icon="lightbulb" className="h-5 w-5" />
                Recomendaciones de Mejora
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {results.recommendations.map((rec, index) => {
                  const getTypeColor = (type: string) => {
                    switch (type) {
                      case 'critical': return 'border-red-200 bg-red-50 dark:bg-red-900/20';
                      case 'warning': return 'border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20';
                      case 'suggestion': return 'border-blue-200 bg-blue-50 dark:bg-blue-900/20';
                      default: return 'border-gray-200 bg-gray-50 dark:bg-gray-900/20';
                    }
                  };

                  const getTypeIcon = (type: string) => {
                    switch (type) {
                      case 'critical': return 'warning';
                      case 'warning': return 'alert';
                      case 'suggestion': return 'lightbulb';
                      default: return 'info';
                    }
                  };

                  return (
                    <div key={index} className={`p-4 rounded-lg border ${getTypeColor(rec.type)}`}>
                      <div className="flex items-start gap-3">
                        <IconWrapper 
                          icon={getTypeIcon(rec.type) as keyof typeof Icons} 
                          className="h-5 w-5 mt-0.5 text-current" 
                        />
                        <div className="flex-1">
                          <h4 className="font-medium">{rec.title}</h4>
                          <p className="text-sm text-muted-foreground mt-1">{rec.description}</p>
                          <Badge variant="outline" className="mt-2 text-xs">
                            {rec.impact}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Acciones */}
          <div className="flex justify-center gap-4">
            <Button onClick={() => router.push('/dashboard')} variant="outline">
              <IconWrapper icon="home" className="mr-2 h-4 w-4" />
              Volver al Dashboard
            </Button>
            <Button onClick={() => window.print()}>
              <IconWrapper icon="download" className="mr-2 h-4 w-4" />
              Exportar Reporte
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MetadataResultsPageWrapper() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <MetadataResultsPage />
    </Suspense>
  );
}