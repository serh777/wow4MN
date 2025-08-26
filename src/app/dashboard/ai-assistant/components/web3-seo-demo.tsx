'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Activity, 
  Bot, 
  Search, 
  Shield, 
  Zap, 
  TrendingUp, 
  Network, 
  Eye,
  CheckCircle,
  AlertTriangle,
  Info
} from 'lucide-react';
import { useAIAnalysis } from './use-ai-analysis';
import { BlockchainNavigator } from './blockchain-navigator';
import { ComplexTaskSystem } from './complex-task-system';

interface DemoProps {
  contractAddress?: string;
  network?: string;
}

export function Web3SeoDemo({ contractAddress = '0x...', network = 'ethereum' }: DemoProps) {
  const {
    isLoading,
    progress,
    progressMessage,
    agentProgress,
    activeAgents,
    blockchainNavigator,
    complexTaskSystem,
    handleSubmit
  } = useAIAnalysis();

  const [demoStep, setDemoStep] = useState(0);
  const [navigationResults, setNavigationResults] = useState<any[]>([]);
  const [activeTasks, setActiveTasks] = useState<any[]>([]);
  const [insights, setInsights] = useState<string[]>([]);

  // Simular demostración automática
  useEffect(() => {
    if (demoStep > 0 && demoStep < 5) {
      const timer = setTimeout(() => {
        setDemoStep(prev => prev + 1);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [demoStep]);

  const startDemo = async () => {
    setDemoStep(1);
    
    // Paso 1: Navegación blockchain
    setTimeout(async () => {
      const mockResults = [
        { address: '0x1234...', type: 'Contract', seoScore: 85, gasEfficiency: 92 },
        { address: '0x5678...', type: 'Token', seoScore: 78, gasEfficiency: 88 },
        { address: '0x9abc...', type: 'DeFi', seoScore: 91, gasEfficiency: 85 }
      ];
      setNavigationResults(mockResults);
    }, 1500);

    // Paso 2: Tareas complejas
    setTimeout(() => {
      const mockTasks = [
        { id: 'task1', name: 'Análisis SEO Web3', status: 'completed', progress: 100 },
        { id: 'task2', name: 'Auditoría de Seguridad', status: 'in_progress', progress: 75 },
        { id: 'task3', name: 'Optimización de Gas', status: 'pending', progress: 0 }
      ];
      setActiveTasks(mockTasks);
    }, 4500);

    // Paso 3: Insights generados
    setTimeout(() => {
      const mockInsights = [
        'Oportunidad de optimización de gas detectada: -23% de costos',
        'Patrón de interoperabilidad identificado con 5 protocolos DeFi',
        'Vulnerabilidad de seguridad menor encontrada en función transfer',
        'SEO Web3: Mejora potencial del 34% en visibilidad on-chain'
      ];
      setInsights(mockInsights);
    }, 7500);
  };

  const runRealAnalysis = () => {
    handleSubmit({
      url: contractAddress,
      contractAddress,
      network,
      analysisType: 'comprehensive',
      includeMetadata: true,
      includeEvents: true,
      includeTransactions: true,
      selectedIndexer: 'etherscan',
      includeGasOptimization: true,
      includeSecurityAudit: true,
      includeSeoAnalysis: true
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-6 w-6 text-blue-500" />
            Agentes IA Blockchain - Análisis SEO Web3 Automatizado
          </CardTitle>
          <CardDescription>
            Demostración de agentes autónomos estilo Fetch.ai para navegación blockchain y análisis SEO Web3
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Button onClick={startDemo} disabled={demoStep > 0 && demoStep < 5}>
              <Eye className="h-4 w-4 mr-2" />
              Iniciar Demo
            </Button>
            <Button onClick={runRealAnalysis} variant="outline" disabled={isLoading}>
              <Search className="h-4 w-4 mr-2" />
              Análisis Real
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Progress */}
      {(isLoading || demoStep > 0) && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Progreso del Análisis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Progress value={isLoading ? progress : (demoStep / 5) * 100} className="w-full" />
              <p className="text-sm text-muted-foreground">
                {isLoading ? progressMessage : `Paso ${demoStep}/5: Ejecutando demostración...`}
              </p>
              
              {/* Agentes activos */}
              {activeAgents.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {activeAgents.map(agentId => (
                    <Badge key={agentId} variant="secondary" className="flex items-center gap-1">
                      <Activity className="h-3 w-3" />
                      {agentId}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Demo Content */}
      <Tabs defaultValue="navigation" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="navigation">Navegación Blockchain</TabsTrigger>
          <TabsTrigger value="tasks">Tareas Complejas</TabsTrigger>
          <TabsTrigger value="insights">Insights IA</TabsTrigger>
          <TabsTrigger value="metrics">Métricas SEO Web3</TabsTrigger>
        </TabsList>

        {/* Navegación Blockchain */}
        <TabsContent value="navigation">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Network className="h-5 w-5" />
                Navegación Autónoma de Blockchain
              </CardTitle>
              <CardDescription>
                Los agentes navegan automáticamente por contratos relacionados y analizan su ecosistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              {demoStep >= 2 ? (
                <div className="space-y-4">
                  {navigationResults.map((result, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <div>
                          <p className="font-medium">{result.address}</p>
                          <p className="text-sm text-muted-foreground">{result.type}</p>
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <div className="text-center">
                          <p className="text-sm font-medium">{result.seoScore}</p>
                          <p className="text-xs text-muted-foreground">SEO Score</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-medium">{result.gasEfficiency}%</p>
                          <p className="text-xs text-muted-foreground">Gas Efficiency</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Network className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Esperando inicio de navegación...</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tareas Complejas */}
        <TabsContent value="tasks">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Sistema de Tareas Complejas
              </CardTitle>
              <CardDescription>
                Tareas automatizadas que coordinan múltiples agentes para análisis profundo
              </CardDescription>
            </CardHeader>
            <CardContent>
              {demoStep >= 3 ? (
                <div className="space-y-4">
                  {activeTasks.map((task) => (
                    <div key={task.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{task.name}</h4>
                        <Badge 
                          variant={task.status === 'completed' ? 'default' : 
                                 task.status === 'in_progress' ? 'secondary' : 'outline'}
                        >
                          {task.status === 'completed' && <CheckCircle className="h-3 w-3 mr-1" />}
                          {task.status === 'in_progress' && <Activity className="h-3 w-3 mr-1" />}
                          {task.status}
                        </Badge>
                      </div>
                      <Progress value={task.progress} className="w-full" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Zap className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Esperando creación de tareas...</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Insights IA */}
        <TabsContent value="insights">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Insights Generados por IA
              </CardTitle>
              <CardDescription>
                Análisis inteligente y recomendaciones basadas en navegación blockchain
              </CardDescription>
            </CardHeader>
            <CardContent>
              {demoStep >= 4 ? (
                <div className="space-y-3">
                  {insights.map((insight, index) => (
                    <Alert key={index}>
                      <Info className="h-4 w-4" />
                      <AlertDescription>{insight}</AlertDescription>
                    </Alert>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Generando insights...</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Métricas SEO Web3 */}
        <TabsContent value="metrics">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Métricas SEO Web3
              </CardTitle>
              <CardDescription>
                Puntuaciones y métricas específicas para optimización Web3
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <p className="text-2xl font-bold text-green-600">92</p>
                  <p className="text-sm text-muted-foreground">Smart Contract Efficiency</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">88</p>
                  <p className="text-sm text-muted-foreground">Gas Optimization</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <p className="text-2xl font-bold text-purple-600">85</p>
                  <p className="text-sm text-muted-foreground">Web3 Integration</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <p className="text-2xl font-bold text-orange-600">91</p>
                  <p className="text-sm text-muted-foreground">Security Score</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Información adicional */}
      <Card>
        <CardHeader>
          <CardTitle>Capacidades de los Agentes IA Blockchain</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Network className="h-4 w-4" />
                Navegación Autónoma
              </h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Exploración automática de contratos relacionados</li>
                <li>• Análisis de transacciones y patrones de uso</li>
                <li>• Identificación de oportunidades de interoperabilidad</li>
                <li>• Mapeo de ecosistemas DeFi y NFT</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Análisis SEO Web3
              </h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Optimización de visibilidad on-chain</li>
                <li>• Análisis de eficiencia de gas</li>
                <li>• Auditorías de seguridad automatizadas</li>
                <li>• Recomendaciones de mejora personalizadas</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}