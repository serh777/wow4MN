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
        contractName: 'Example Contract',
        symbol: 'EXM',
        description: 'Un contrato de ejemplo con metadatos optimizados para SEO',
        completeness: Math.floor(Math.random() * 20) + 75,
        seoOptimization: Math.floor(Math.random() * 25) + 70,
        standardCompliance: Math.floor(Math.random() * 15) + 80
      },
      tokens: {
        totalTokens: Math.floor(Math.random() * 10000) + 1000,
        withMetadata: Math.floor(Math.random() * 8000) + 800,
        missingMetadata: Math.floor(Math.random() * 200) + 50,
        qualityScore: Math.floor(Math.random() * 20) + 75
      },
      recommendations: [
        {
          type: 'critical',
          title: 'Metadatos faltantes',
          description: 'Algunos tokens no tienen metadatos completos',
          impact: 'Alto impacto en SEO y experiencia de usuario'
        },
        {
          type: 'warning',
          title: 'Optimización de imágenes',
          description: 'Las imágenes pueden optimizarse para mejor rendimiento',
          impact: 'Impacto medio en velocidad de carga'
        },
        {
          type: 'suggestion',
          title: 'Estructura de datos mejorada',
          description: 'Implementar schema.org para mejor indexación',
          impact: 'Mejora el SEO y la visibilidad'
        }
      ],
      seoMetrics: {
        titleOptimization: Math.floor(Math.random() * 25) + 70,
        descriptionQuality: Math.floor(Math.random() * 30) + 65,
        keywordDensity: Math.floor(Math.random() * 20) + 75,
        structuredData: Math.floor(Math.random() * 15) + 80
      }
    };
  }, [url]);

  useEffect(() => {
    // Simular carga de datos
    const loadResults = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 2000));
        const mockResults = generateMockResults();
        setResults(mockResults);
      } catch (error) {
        console.error('Error loading results:', error);
        toast({
          title: 'Error',
          description: 'No se pudieron cargar los resultados del análisis',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };

    loadResults();
  }, [generateMockResults, toast]);

  const handleBackToHome = () => {
    router.push('/dashboard');
  };

  const handleNewAnalysis = () => {
    router.push('/dashboard/metadata');
  };

  if (loading) {
    return <LoadingState url={url} onBackToHome={handleBackToHome} />;
  }

  if (!results) {
    return <ErrorState onBackToHome={handleBackToHome} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Resultados del Análisis de Metadatos</h1>
            <p className="text-muted-foreground">Análisis completo para {results.url}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleNewAnalysis}>
              Nuevo Análisis
            </Button>
            <Button onClick={handleBackToHome}>
              Dashboard
            </Button>
          </div>
        </div>

        {/* Score Overview */}
        <div className="grid gap-6 md:grid-cols-4">
          <Card className="md:col-span-1">
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-lg">Puntuación General</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center">
              <CircularProgress value={results.overallScore} />
            </CardContent>
          </Card>
          
          <Card className="md:col-span-3">
            <CardHeader>
              <CardTitle>Métricas Clave</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Completitud de Metadatos</span>
                  <span className="text-sm text-muted-foreground">{results.metadata.completeness}%</span>
                </div>
                <DynamicProgress value={results.metadata.completeness} />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Optimización SEO</span>
                  <span className="text-sm text-muted-foreground">{results.metadata.seoOptimization}%</span>
                </div>
                <DynamicProgress value={results.metadata.seoOptimization} />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Cumplimiento de Estándares</span>
                  <span className="text-sm text-muted-foreground">{results.metadata.standardCompliance}%</span>
                </div>
                <DynamicProgress value={results.metadata.standardCompliance} />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Calidad de Tokens</span>
                  <span className="text-sm text-muted-foreground">{results.tokens.qualityScore}%</span>
                </div>
                <DynamicProgress value={results.tokens.qualityScore} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Information */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IconWrapper icon="metadata" className="h-5 w-5" />
                Información del Contrato
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Nombre:</span>
                  <span className="text-sm">{results.metadata.contractName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Símbolo:</span>
                  <span className="text-sm">{results.metadata.symbol}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Descripción:</span>
                  <span className="text-sm text-right max-w-[200px]">{results.metadata.description}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IconWrapper icon="analytics" className="h-5 w-5" />
                Statistics de Tokens
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Total de Tokens:</span>
                  <span className="text-sm">{results.tokens.totalTokens.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Con Metadatos:</span>
                  <span className="text-sm text-green-600">{results.tokens.withMetadata.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Sin Metadatos:</span>
                  <span className="text-sm text-red-600">{results.tokens.missingMetadata.toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recommendations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconWrapper icon="ai" className="h-5 w-5" />
              Recomendaciones
            </CardTitle>
            <CardDescription>
              Sugerencias para mejorar los metadatos y optimización SEO
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {results.recommendations.map((rec, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Badge 
                      variant={rec.type === 'critical' ? 'destructive' : rec.type === 'warning' ? 'default' : 'secondary'}
                      className="mt-1"
                    >
                      {rec.type === 'critical' ? 'Crítico' : rec.type === 'warning' ? 'Advertencia' : 'Sugerencia'}
                    </Badge>
                    <div className="flex-1">
                      <h4 className="font-medium">{rec.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1">{rec.description}</p>
                      <p className="text-xs text-blue-600 mt-2">{rec.impact}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* SEO Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconWrapper icon="search" className="h-5 w-5" />
              Métricas SEO
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Optimización de Títulos</span>
                  <span className="text-sm text-muted-foreground">{results.seoMetrics.titleOptimization}%</span>
                </div>
                <DynamicProgress value={results.seoMetrics.titleOptimization} />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Calidad de Descripciones</span>
                  <span className="text-sm text-muted-foreground">{results.seoMetrics.descriptionQuality}%</span>
                </div>
                <DynamicProgress value={results.seoMetrics.descriptionQuality} />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Densidad de Keywords</span>
                  <span className="text-sm text-muted-foreground">{results.seoMetrics.keywordDensity}%</span>
                </div>
                <DynamicProgress value={results.seoMetrics.keywordDensity} />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Datos Estructurados</span>
                  <span className="text-sm text-muted-foreground">{results.seoMetrics.structuredData}%</span>
                </div>
                <DynamicProgress value={results.seoMetrics.structuredData} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4">
          <Button onClick={handleNewAnalysis} size="lg">
            <IconWrapper icon="metadata" className="mr-2 h-4 w-4" />
            Nuevo Análisis
          </Button>
          <Button variant="outline" onClick={handleBackToHome} size="lg">
            <IconWrapper icon="dashboard" className="mr-2 h-4 w-4" />
            Volver al Dashboard
          </Button>
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