'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CircularProgress } from '@/components/ui/circular-progress';
import { 
  ArrowLeft, 
  CheckCircle, 
  AlertTriangle, 
  Info, 
  TrendingUp, 
  Clock,
  Zap,
  Shield,
  Search,
  BarChart3,
  Target,
  RefreshCw,
  Download,
  Share2
} from 'lucide-react';
import { useDynamicResults } from '@/hooks/use-dynamic-results';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Definición de herramientas disponibles
const AVAILABLE_TOOLS = {
  'performance': {
    id: 'performance',
    name: 'Performance Audit',
    description: 'Análisis completo de rendimiento web',
    icon: Zap,
    color: 'from-yellow-500 to-orange-500',
    category: 'Técnico'
  },
  'security': {
    id: 'security',
    name: 'Security Scan',
    description: 'Auditoría de seguridad y vulnerabilidades',
    icon: Shield,
    color: 'from-red-500 to-pink-500',
    category: 'Seguridad'
  },
  'seo': {
    id: 'seo',
    name: 'SEO Analyzer',
    description: 'Optimización para motores de búsqueda',
    icon: Search,
    color: 'from-green-500 to-emerald-500',
    category: 'Marketing'
  },
  'analytics': {
    id: 'analytics',
    name: 'Web3 Analytics',
    description: 'Análisis de métricas blockchain',
    icon: BarChart3,
    color: 'from-blue-500 to-cyan-500',
    category: 'Análisis'
  }
};

export default function IndividualAnalysisPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedTool, setSelectedTool] = useState<typeof AVAILABLE_TOOLS[keyof typeof AVAILABLE_TOOLS] | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState(null);
  const [error, setError] = useState<string | null>(null);

  const toolId = searchParams.get('tool');
  const address = searchParams.get('address');

  const { results, isLoading, error: dynamicError, startAnalysis } = useDynamicResults();

  // Iniciar análisis cuando se tengan los parámetros necesarios
  useEffect(() => {
    if (toolId && address) {
      startAnalysis(address, [toolId]);
    }
  }, [toolId, address, startAnalysis]);

  useEffect(() => {
    if (toolId && toolId in AVAILABLE_TOOLS) {
      setSelectedTool(AVAILABLE_TOOLS[toolId as keyof typeof AVAILABLE_TOOLS]);
    }
  }, [toolId]);

  const handleAnalyze = useCallback(async () => {
    if (!selectedTool || !address) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      if (toolId && address) {
        await startAnalysis(address, [toolId]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error durante el análisis');
    } finally {
      setIsAnalyzing(false);
    }
  }, [selectedTool, address, startAnalysis, toolId]);

  if (!toolId || !selectedTool) {
    return (
      <div className="container mx-auto p-6">
        <Button 
          variant="outline" 
          onClick={() => router.back()}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver
        </Button>
        <div className="text-center py-12">
          <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-yellow-500" />
          <h2 className="text-xl font-semibold mb-2">Herramienta no encontrada</h2>
          <p className="text-muted-foreground">La herramienta solicitada no está disponible.</p>
        </div>
      </div>
    );
  }

  const IconComponent = selectedTool.icon;

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <Button 
          variant="outline" 
          onClick={() => router.back()}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver
        </Button>
        
        <div className="flex items-center gap-4 mb-4">
          <div className={`p-3 rounded-lg bg-gradient-to-r ${selectedTool.color}`}>
            <IconComponent className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">{selectedTool.name}</h1>
            <p className="text-muted-foreground">{selectedTool.description}</p>
          </div>
        </div>

        <Badge variant="secondary">{selectedTool.category}</Badge>
      </div>

      {address && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Objetivo del Análisis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-mono text-sm bg-muted p-2 rounded">{address}</p>
          </CardContent>
        </Card>
      )}

      {error && (
        <Alert className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {isLoading || isAnalyzing ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Analizando...</h3>
              <p className="text-muted-foreground">
                Ejecutando {selectedTool.name} en {address}
              </p>
            </div>
          </CardContent>
        </Card>
      ) : results ? (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                Análisis Completado
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-500">✓</div>
                  <p className="text-sm text-muted-foreground">Completado</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{new Date().toLocaleTimeString()}</div>
                  <p className="text-sm text-muted-foreground">Hora de finalización</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">1</div>
                  <p className="text-sm text-muted-foreground">Herramienta ejecutada</p>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Descargar
                </Button>
                <Button size="sm" variant="outline">
                  <Share2 className="h-4 w-4 mr-2" />
                  Compartir
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Renderizar resultados específicos aquí */}
          <Card>
            <CardHeader>
              <CardTitle>Resultados del Análisis</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted p-4 rounded text-sm overflow-auto">
                {JSON.stringify(results, null, 2)}
              </pre>
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <Target className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">Listo para Analizar</h3>
              <p className="text-muted-foreground mb-4">
                Haz clic en el botón para comenzar el análisis con {selectedTool.name}
              </p>
              <Button onClick={handleAnalyze} disabled={!address}>
                <Zap className="h-4 w-4 mr-2" />
                Iniciar Análisis
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}