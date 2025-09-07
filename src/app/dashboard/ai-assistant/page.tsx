'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain, 
  Database, 
  Zap, 
  Activity, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  TrendingUp,
  Shield,
  Search,
  Globe,
  BarChart3
} from 'lucide-react';
import { useRouter } from 'next/navigation';

// Importar el hook de análisis unificado
import { useAIAnalysis } from './components/use-ai-analysis';

interface AnalysisConfig {
  target: string;
  analysisType: 'comprehensive' | 'security' | 'performance' | 'seo' | 'blockchain' | 'social';
  network?: string;
  includeAI: boolean;
  includeIndexers: boolean;
  includeTraditional: boolean;
  parallelExecution: boolean;
}

export default function UnifiedAnalysisPage() {
  const router = useRouter();
  const {
    runUnifiedAnalysis,
    isLoading,
    error,
    progress,
    progressMessage,
    getOrchestratorStatus,
    cleanupOrchestrator
  } = useAIAnalysis();

  const [config, setConfig] = useState<AnalysisConfig>({
    target: '',
    analysisType: 'comprehensive',
    network: 'ethereum',
    includeAI: true,
    includeIndexers: true,
    includeTraditional: true,
    parallelExecution: true
  });

  const [orchestratorStatus, setOrchestratorStatus] = useState<any>(null);

  const handleAnalysisSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!config.target.trim()) {
      return;
    }

    try {
      const analysisParams = {
        contractAddress: config.target,
        url: config.target,
        network: config.network || 'ethereum',
        analysisType: config.analysisType,
        includeMetadata: true,
        includeEvents: true,
        includeTransactions: true,
        selectedIndexer: 'default'
      };

      await runUnifiedAnalysis(analysisParams);
      
      // Redirigir a resultados unificados
      router.push('/dashboard/results/unified');
    } catch (error) {
      console.error('Error during unified analysis:', error);
    }
  };

  const refreshOrchestratorStatus = () => {
    const status = getOrchestratorStatus();
    setOrchestratorStatus(status);
  };

  const analysisTypes = [
    { value: 'comprehensive', label: 'Análisis Completo', icon: BarChart3, description: 'Análisis integral con todos los componentes' },
    { value: 'security', label: 'Seguridad', icon: Shield, description: 'Enfoque en vulnerabilidades y seguridad' },
    { value: 'performance', label: 'Rendimiento', icon: TrendingUp, description: 'Optimización y métricas de rendimiento' },
    { value: 'seo', label: 'SEO Web3', icon: Search, description: 'Optimización para motores de búsqueda' },
    { value: 'blockchain', label: 'Blockchain', icon: Database, description: 'Análisis específico de contratos y transacciones' },
    { value: 'social', label: 'Social Web3', icon: Globe, description: 'Análisis de presencia social y comunidad' }
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Sistema de Análisis Unificado</h1>
        <p className="text-muted-foreground">
          Análisis integral con IA, indexadores y herramientas tradicionales ejecutándose automáticamente
        </p>
      </div>

      <Tabs defaultValue="analysis" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="analysis">Nuevo Análisis</TabsTrigger>
          <TabsTrigger value="status">Estado del Sistema</TabsTrigger>
          <TabsTrigger value="history">Historial</TabsTrigger>
        </TabsList>

        {/* Pestaña de Análisis */}
        <TabsContent value="analysis" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Configuración del Análisis
              </CardTitle>
              <CardDescription>
                Configura y ejecuta un análisis unificado completo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAnalysisSubmit} className="space-y-6">
                {/* Target Input */}
                <div className="space-y-2">
                  <Label htmlFor="target">Objetivo del Análisis</Label>
                  <Input
                    id="target"
                    placeholder="Dirección de contrato, URL del sitio web, o dominio"
                    value={config.target}
                    onChange={(e) => setConfig(prev => ({ ...prev, target: e.target.value }))}
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground">
                    Ejemplo: 0x1234... (contrato), https://example.com (sitio web), o example.com (dominio)
                  </p>
                </div>

                {/* Analysis Type */}
                <div className="space-y-3">
                  <Label>Tipo de Análisis</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {analysisTypes.map((type) => {
                      const Icon = type.icon;
                      return (
                        <Card 
                          key={type.value}
                          className={`cursor-pointer transition-all hover:shadow-md ${
                            config.analysisType === type.value 
                              ? 'ring-2 ring-primary bg-primary/5' 
                              : 'hover:bg-muted/50'
                          }`}
                          onClick={() => setConfig(prev => ({ ...prev, analysisType: type.value as any }))}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start gap-3">
                              <Icon className="h-5 w-5 mt-0.5 text-primary" />
                              <div className="space-y-1">
                                <h4 className="font-medium text-sm">{type.label}</h4>
                                <p className="text-xs text-muted-foreground">{type.description}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>

                {/* Network Selection (for blockchain analysis) */}
                {(config.analysisType === 'blockchain' || config.analysisType === 'comprehensive') && (
                  <div className="space-y-2">
                    <Label htmlFor="network">Red Blockchain</Label>
                    <Select value={config.network} onValueChange={(value) => setConfig(prev => ({ ...prev, network: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona una red" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ethereum">Ethereum</SelectItem>
                        <SelectItem value="polygon">Polygon</SelectItem>
                        <SelectItem value="bsc">Binance Smart Chain</SelectItem>
                        <SelectItem value="arbitrum">Arbitrum</SelectItem>
                        <SelectItem value="optimism">Optimism</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Components Configuration */}
                <div className="space-y-3">
                  <Label>Componentes del Análisis</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Brain className="h-4 w-4" />
                          <span className="text-sm font-medium">Agentes IA Autónomos</span>
                        </div>
                        <input
                          type="checkbox"
                          checked={config.includeAI}
                          onChange={(e) => setConfig(prev => ({ ...prev, includeAI: e.target.checked }))}
                          className="h-4 w-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Análisis inteligente con IA especializada
                      </p>
                    </Card>

                    <Card className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Database className="h-4 w-4" />
                          <span className="text-sm font-medium">Indexadores Especializados</span>
                        </div>
                        <input
                          type="checkbox"
                          checked={config.includeIndexers}
                          onChange={(e) => setConfig(prev => ({ ...prev, includeIndexers: e.target.checked }))}
                          className="h-4 w-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Indexación automática de datos blockchain
                      </p>
                    </Card>

                    <Card className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <BarChart3 className="h-4 w-4" />
                          <span className="text-sm font-medium">Análisis Tradicional</span>
                        </div>
                        <input
                          type="checkbox"
                          checked={config.includeTraditional}
                          onChange={(e) => setConfig(prev => ({ ...prev, includeTraditional: e.target.checked }))}
                          className="h-4 w-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Herramientas de análisis convencionales
                      </p>
                    </Card>

                    <Card className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Zap className="h-4 w-4" />
                          <span className="text-sm font-medium">Ejecución Paralela</span>
                        </div>
                        <input
                          type="checkbox"
                          checked={config.parallelExecution}
                          onChange={(e) => setConfig(prev => ({ ...prev, parallelExecution: e.target.checked }))}
                          className="h-4 w-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Ejecutar todos los componentes simultáneamente
                      </p>
                    </Card>
                  </div>
                </div>

                {/* Progress Display */}
                {isLoading && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Activity className="h-4 w-4 animate-spin" />
                      <span className="text-sm font-medium">Análisis en progreso...</span>
                    </div>
                    <Progress value={progress} className="w-full" />
                    <p className="text-xs text-muted-foreground">{progressMessage}</p>
                  </div>
                )}

                {/* Error Display */}
                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                      <span className="text-sm font-medium text-red-800">Error</span>
                    </div>
                    <p className="text-sm text-red-700 mt-1">{error}</p>
                  </div>
                )}

                {/* Submit Button */}
                <Button 
                  type="submit" 
                  disabled={isLoading || !config.target.trim()}
                  className="w-full"
                  size="lg"
                >
                  {isLoading ? (
                    <>
                      <Activity className="h-4 w-4 animate-spin mr-2" />
                      Ejecutando Análisis Unificado...
                    </>
                  ) : (
                    <>
                      <Zap className="h-4 w-4 mr-2" />
                      Iniciar Análisis Unificado
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pestaña de Estado */}
        <TabsContent value="status" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Estado del Sistema de Orquestación
                </div>
                <Button variant="outline" size="sm" onClick={refreshOrchestratorStatus}>
                  Actualizar
                </Button>
              </CardTitle>
              <CardDescription>
                Monitoreo en tiempo real de todos los componentes del sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              {orchestratorStatus ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <Brain className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                      <h3 className="font-medium">Agentes IA</h3>
                      <p className="text-2xl font-bold">{orchestratorStatus.activeAgents || 0}</p>
                      <p className="text-xs text-muted-foreground">Activos</p>
                    </div>
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <Database className="h-8 w-8 mx-auto mb-2 text-green-500" />
                      <h3 className="font-medium">Indexadores</h3>
                      <p className="text-2xl font-bold">{orchestratorStatus.activeIndexers || 0}</p>
                      <p className="text-xs text-muted-foreground">Sincronizando</p>
                    </div>
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <Zap className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
                      <h3 className="font-medium">Procesos</h3>
                      <p className="text-2xl font-bold">{orchestratorStatus.totalProcesses || 0}</p>
                      <p className="text-xs text-muted-foreground">En ejecución</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Activity className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">Haz clic en &quot;Actualizar&quot; para ver el estado del sistema</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pestaña de Historial */}
        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Historial de Análisis</CardTitle>
              <CardDescription>
                Análisis anteriores y sus resultados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Clock className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">No hay análisis anteriores disponibles</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => router.push('/dashboard/results/unified')}
                >
                  Ver Últimos Resultados
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}