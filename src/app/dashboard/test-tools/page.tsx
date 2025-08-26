'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Loader2, Play, CheckCircle, AlertTriangle, Clock } from 'lucide-react';
import { dashboardOrchestrator } from '@/services/dashboard-orchestrator';

interface TestResult {
  toolId: string;
  status: 'idle' | 'running' | 'success' | 'error';
  data?: any;
  error?: string;
  executionTime?: number;
}

const AVAILABLE_TOOLS = [
  { id: 'ai-assistant', name: 'AI Assistant', description: 'Análisis inteligente con Claude AI' },
  { id: 'blockchain', name: 'Blockchain Analysis', description: 'Análisis de contratos y transacciones' },
  { id: 'nft-tracking', name: 'NFT Tracking', description: 'Seguimiento y análisis de NFTs' },
  { id: 'metadata', name: 'Metadata Analysis', description: 'Análisis de metadatos web y contratos' },
  { id: 'content', name: 'Content Analysis', description: 'Análisis de contenido y SEO' },
  { id: 'links', name: 'Links Analysis', description: 'Análisis de enlaces y backlinks' },
  { id: 'competition', name: 'Competition Analysis', description: 'Análisis de competencia' },
  { id: 'performance', name: 'Performance Analysis', description: 'Análisis de rendimiento' },
  { id: 'security', name: 'Security Analysis', description: 'Auditoría de seguridad' },
  { id: 'social-web3', name: 'Social Web3', description: 'Análisis de redes sociales Web3' },
  { id: 'authority-tracking', name: 'Authority Tracking', description: 'Seguimiento de autoridad descentralizada' },
  { id: 'metaverse-optimizer', name: 'Metaverse Optimizer', description: 'Optimización para metaversos' },
];

export default function TestToolsPage() {
  const [address, setAddress] = useState('');
  const [selectedTool, setSelectedTool] = useState('');
  const [testResults, setTestResults] = useState<Map<string, TestResult>>(new Map());
  const [orchestrator] = useState(() => dashboardOrchestrator);

  const runSingleTool = async (toolId: string) => {
    if (!address.trim()) {
      alert('Por favor ingresa una dirección o URL');
      return;
    }

    // Actualizar estado a running
    setTestResults(prev => new Map(prev.set(toolId, {
      toolId,
      status: 'running'
    })));

    try {
      const startTime = Date.now();
      
      // Ejecutar análisis individual
      const requestId = await orchestrator.startAnalysis({
        address: address.trim(),
        tools: [toolId],
        isCompleteAudit: false
      });

      // Esperar a que complete
      let attempts = 0;
      const maxAttempts = 60; // 60 segundos máximo
      
      while (attempts < maxAttempts) {
        const status = await orchestrator.getAnalysisStatus(requestId);

        if (status && status.status === 'completed') {
          const result = status.results.find(r => r.toolId === toolId);
          
          setTestResults(prev => new Map(prev.set(toolId, {
            toolId,
            status: result?.status === 'success' ? 'success' : 'error',
            data: result?.data,
            error: result?.error,
            executionTime: Date.now() - startTime
          })));
          break;
        } else if (status && status.status === 'error') {
          setTestResults(prev => new Map(prev.set(toolId, {
            toolId,
            status: 'error',
            error: 'Error en el análisis',
            executionTime: Date.now() - startTime
          })));
          break;
        }
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        attempts++;
      }
      
      if (attempts >= maxAttempts) {
        setTestResults(prev => new Map(prev.set(toolId, {
          toolId,
          status: 'error',
          error: 'Timeout - El análisis tardó demasiado',
          executionTime: Date.now() - startTime
        })));
      }
      
    } catch (error) {
      setTestResults(prev => new Map(prev.set(toolId, {
        toolId,
        status: 'error',
        error: error instanceof Error ? error.message : 'Error desconocido'
      })));
    }
  };

  const runAllTools = async () => {
    if (!address.trim()) {
      alert('Por favor ingresa una dirección o URL');
      return;
    }

    // Limpiar resultados anteriores
    setTestResults(new Map());

    // Ejecutar todas las herramientas secuencialmente
    for (const tool of AVAILABLE_TOOLS) {
      await runSingleTool(tool.id);
      // Pequeña pausa entre herramientas
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  };

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'running':
        return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />;
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: TestResult['status']) => {
    switch (status) {
      case 'running':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Ejecutando</Badge>;
      case 'success':
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Éxito</Badge>;
      case 'error':
        return <Badge variant="destructive">Error</Badge>;
      default:
        return <Badge variant="outline">Pendiente</Badge>;
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Test Individual de Herramientas
        </h1>
        <p className="text-muted-foreground">
          Prueba cada herramienta de análisis individualmente antes del análisis conjunto
        </p>
      </div>

      {/* Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Configuración de Prueba</CardTitle>
          <CardDescription>
            Ingresa una dirección de contrato, URL o dirección de wallet para probar las herramientas
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="address">Dirección o URL</Label>
            <Input
              id="address"
              placeholder="0x... o https://..."
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2">
            <Button onClick={runAllTools} className="flex-1">
              <Play className="h-4 w-4 mr-2" />
              Probar Todas las Herramientas
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {AVAILABLE_TOOLS.map((tool) => {
          const result = testResults.get(tool.id);
          
          return (
            <Card key={tool.id} className="relative">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(result?.status || 'idle')}
                    <CardTitle className="text-sm">{tool.name}</CardTitle>
                  </div>
                  {getStatusBadge(result?.status || 'idle')}
                </div>
                <CardDescription className="text-xs">
                  {tool.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-3">
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="w-full"
                  onClick={() => runSingleTool(tool.id)}
                  disabled={result?.status === 'running' || !address.trim()}
                >
                  {result?.status === 'running' ? (
                    <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                  ) : (
                    <Play className="h-3 w-3 mr-1" />
                  )}
                  Probar
                </Button>
                
                {result && (
                  <div className="text-xs space-y-1">
                    {result.executionTime && (
                      <p className="text-muted-foreground">
                        Tiempo: {result.executionTime}ms
                      </p>
                    )}
                    
                    {result.error && (
                      <p className="text-red-600 break-words">
                        Error: {result.error}
                      </p>
                    )}
                    
                    {result.data && (
                      <details className="cursor-pointer">
                        <summary className="text-blue-600 hover:text-blue-800">
                          Ver datos
                        </summary>
                        <pre className="mt-1 p-2 bg-gray-50 dark:bg-gray-800 rounded text-xs overflow-auto max-h-32">
                          {JSON.stringify(result.data, null, 2)}
                        </pre>
                      </details>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Summary */}
      {testResults.size > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Resumen de Pruebas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {Array.from(testResults.values()).filter(r => r.status === 'success').length}
                </div>
                <div className="text-sm text-muted-foreground">Exitosas</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-600">
                  {Array.from(testResults.values()).filter(r => r.status === 'error').length}
                </div>
                <div className="text-sm text-muted-foreground">Con Error</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {Array.from(testResults.values()).filter(r => r.status === 'running').length}
                </div>
                <div className="text-sm text-muted-foreground">Ejecutando</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-600">
                  {AVAILABLE_TOOLS.length - testResults.size}
                </div>
                <div className="text-sm text-muted-foreground">Pendientes</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}