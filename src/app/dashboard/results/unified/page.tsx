'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Clock, AlertCircle, Activity, Zap, Database, Brain, TrendingUp } from 'lucide-react';
import { useAIAnalysis } from '../../ai-assistant/components/use-ai-analysis';
import { AIAnalysisResult } from '../../ai-assistant/components/types';



export default function UnifiedResultsPage() {
  const [unifiedResults, setUnifiedResults] = useState<AIAnalysisResult | null>(null);
  const [orchestrationResult, setOrchestrationResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Cargar resultados del análisis unificado
    const loadResults = () => {
      try {
        const savedResults = sessionStorage.getItem('unifiedAnalysisResult');
        const savedOrchestration = sessionStorage.getItem('orchestrationResult');
        
        if (savedResults) {
          setUnifiedResults(JSON.parse(savedResults));
        }
        
        if (savedOrchestration) {
          setOrchestrationResult(JSON.parse(savedOrchestration));
        }
      } catch (error) {
        console.error('Error loading unified results:', error);
      } finally {
        setLoading(false);
      }
    };

    loadResults();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Activity className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p>Cargando resultados del análisis unificado...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!unifiedResults) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              No hay resultados disponibles
            </CardTitle>
            <CardDescription>
              No se encontraron resultados del análisis unificado. Ejecuta un análisis primero.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const backgroundProcesses = (unifiedResults as any)?.backgroundProcesses || {};
  const completed = backgroundProcesses.completedProcesses || 0;
  const total = backgroundProcesses.totalProcesses || 1;
  const successRate = Math.round((completed / total) * 100);

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Resultados del Análisis Unificado</h1>
        <p className="text-muted-foreground">
          Análisis completado el {new Date(unifiedResults.timestamp).toLocaleString()}
        </p>
        <Badge variant="outline" className="text-sm">
          Tiempo de ejecución: {Math.round(((unifiedResults as any)?.executionTime || 0) / 1000)}s
        </Badge>
      </div>

      {/* Estadísticas Generales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Puntuación General</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{unifiedResults.overallScore}/100</div>
            <Progress value={unifiedResults.overallScore} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Procesos Completados</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completed}/{total}</div>
            <Progress value={successRate} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Agentes IA Activos</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{backgroundProcesses.aiAgentsCompleted}/{backgroundProcesses.aiAgentsExecuted}</div>
            <p className="text-xs text-muted-foreground mt-1">Agentes completados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Indexadores</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{backgroundProcesses.indexersActive}</div>
            <div className="flex items-center gap-1 mt-1">
              <div className={`w-2 h-2 rounded-full ${
                backgroundProcesses.indexerSchedulerActive ? 'bg-green-500' : 'bg-red-500'
              }`} />
              <p className="text-xs text-muted-foreground">
                {backgroundProcesses.indexerSchedulerActive ? 'Activo' : 'Inactivo'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Estado del Sistema de Orquestación */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Estado del Sistema de Orquestación
          </CardTitle>
          <CardDescription>
            Monitoreo en tiempo real de todos los procesos de análisis
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Agentes IA Autónomos</span>
                <Badge variant={backgroundProcesses.aiAgentsCompleted > 0 ? "default" : "secondary"}>
                  {backgroundProcesses.aiAgentsCompleted > 0 ? 'Completado' : 'Pendiente'}
                </Badge>
              </div>
              <Progress 
                value={(backgroundProcesses.aiAgentsCompleted / Math.max(backgroundProcesses.aiAgentsExecuted, 1)) * 100} 
                className="h-2" 
              />
              <p className="text-xs text-muted-foreground">
                {backgroundProcesses.aiAgentsCompleted} de {backgroundProcesses.aiAgentsExecuted} agentes completados
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Indexadores Especializados</span>
                <Badge variant={backgroundProcesses.indexerSchedulerActive ? "default" : "secondary"}>
                  {backgroundProcesses.indexerSchedulerActive ? 'Auto-inicializado' : 'Manual'}
                </Badge>
              </div>
              <Progress 
                value={backgroundProcesses.indexerSchedulerActive ? 100 : 0} 
                className="h-2" 
              />
              <p className="text-xs text-muted-foreground">
                Scheduler: {backgroundProcesses.indexerSchedulerActive ? 'Activo' : 'Inactivo'} • 
                Última ejecución: {new Date(backgroundProcesses.lastIndexerRun).toLocaleTimeString()}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Progreso General</span>
                <Badge variant="default">
                  {Math.round((completed / total) * 100)}%
                </Badge>
              </div>
              <Progress value={(completed / total) * 100} className="h-2" />
              <p className="text-xs text-muted-foreground">
                {completed} de {total} procesos completados
                {backgroundProcesses.orchestrationStatus && (
                  <> • Estado: {backgroundProcesses.orchestrationStatus}</>
                )}
              </p>
            </div>
          </div>

          {backgroundProcesses.resourceUtilization && (
            <div className="mt-4 p-3 bg-muted rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Utilización de Recursos</span>
                <span className="text-sm text-muted-foreground">
                  {Math.round(backgroundProcesses.resourceUtilization * 100)}%
                </span>
              </div>
              <Progress value={backgroundProcesses.resourceUtilization * 100} className="h-2" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Oportunidades Identificadas */}
      <Card>
        <CardHeader>
          <CardTitle>Oportunidades Identificadas</CardTitle>
          <CardDescription>
            Insights y recomendaciones generadas por el análisis unificado
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {((unifiedResults as any)?.identifiedOpportunities || []).map((opportunity: string, index: number) => (
              <div key={index} className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
                <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                <span className="text-sm">{opportunity}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Detalles de Orquestación (si están disponibles) */}
      {orchestrationResult && (
        <Card>
          <CardHeader>
            <CardTitle>Detalles de Orquestación</CardTitle>
            <CardDescription>
              Información técnica del sistema de orquestación
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2">Métricas de Ejecución</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>ID de Orquestación: {orchestrationResult.id}</li>
                  <li>Tareas Totales: {orchestrationResult.metrics?.totalTasks || 0}</li>
                  <li>Tareas Completadas: {orchestrationResult.metrics?.completedTasks || 0}</li>
                  <li>Estado: {orchestrationResult.status}</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Resultados por Componente</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>Análisis Tradicional: {orchestrationResult.results?.traditionalAnalysis ? '✓' : '✗'}</li>
                  <li>Agentes IA: {orchestrationResult.results?.aiAgents ? '✓' : '✗'}</li>
                  <li>Indexadores: {orchestrationResult.results?.indexers ? '✓' : '✗'}</li>
                </ul>
              </div>
            </div>
            
            {orchestrationResult.errors && orchestrationResult.errors.length > 0 && (
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h4 className="font-medium text-yellow-800 mb-2">Advertencias</h4>
                <ul className="space-y-1 text-sm text-yellow-700">
                  {orchestrationResult.errors.map((error: any, index: number) => (
                    <li key={index}>• {error.message || error}</li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}