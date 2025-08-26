'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  Play, 
  Pause, 
  Square, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  XCircle,
  TrendingUp,
  Shield,
  Coins,
  Vote,
  Network,
  BarChart3,
  Zap,
  Target
} from 'lucide-react';
import { ComplexTask, TaskResult, complexTaskSystem } from './complex-task-system';
import { AIAnalysisParams } from './types';
import { BlockchainNavigator } from './blockchain-navigator';

interface ComplexTaskManagerProps {
  params: AIAnalysisParams;
  navigator: BlockchainNavigator;
  onTaskComplete?: (taskId: string, result: TaskResult) => void;
}

const taskTypeIcons = {
  seo_analysis: <TrendingUp className="h-4 w-4" />,
  security_audit: <Shield className="h-4 w-4" />,
  performance_optimization: <Zap className="h-4 w-4" />,
  market_research: <BarChart3 className="h-4 w-4" />,
  competitive_analysis: <Target className="h-4 w-4" />,
  defi_analysis: <Coins className="h-4 w-4" />,
  nft_valuation: <BarChart3 className="h-4 w-4" />,
  governance_analysis: <Vote className="h-4 w-4" />,
  cross_chain_analysis: <Network className="h-4 w-4" />,
  liquidity_analysis: <Coins className="h-4 w-4" />
};

const statusColors = {
  pending: 'bg-gray-500',
  in_progress: 'bg-blue-500',
  completed: 'bg-green-500',
  failed: 'bg-red-500',
  cancelled: 'bg-orange-500'
};

const priorityColors = {
  low: 'bg-gray-100 text-gray-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-orange-100 text-orange-800',
  critical: 'bg-red-100 text-red-800'
};

export function ComplexTaskManager({ params, navigator, onTaskComplete }: ComplexTaskManagerProps) {
  const [tasks, setTasks] = useState<ComplexTask[]>([]);
  const [selectedTask, setSelectedTask] = useState<ComplexTask | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [isExecuting, setIsExecuting] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Cargar tareas existentes
    setTasks(complexTaskSystem.getAllTasks());
  }, []);

  const createTask = (templateId: string) => {
    const task = complexTaskSystem.createTask(templateId, params);
    setTasks(prev => [...prev, task]);
    setSelectedTask(task);
  };

  const executeTask = async (taskId: string) => {
    if (isExecuting.has(taskId)) return;
    
    setIsExecuting(prev => new Set(prev).add(taskId));
    
    try {
      const context = {
        params,
        agents: new Map(),
        navigator,
        progressCallback: (id: string, progress: number) => {
          setTasks(prev => prev.map(task => 
            task.id === id ? { ...task, progress } : task
          ));
        },
        resultCallback: (id: string, result: TaskResult) => {
          setTasks(prev => prev.map(task => 
            task.id === id ? { ...task, results: result, status: 'completed' as const } : task
          ));
          onTaskComplete?.(id, result);
        }
      };
      
      await complexTaskSystem.executeTask(taskId, context);
    } catch (error) {
      console.error('Error executing task:', error);
      setTasks(prev => prev.map(task => 
        task.id === taskId ? { ...task, status: 'failed' as const } : task
      ));
    } finally {
      setIsExecuting(prev => {
        const newSet = new Set(prev);
        newSet.delete(taskId);
        return newSet;
      });
    }
  };

  const cancelTask = (taskId: string) => {
    complexTaskSystem.cancelTask(taskId);
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, status: 'cancelled' as const } : task
    ));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'in_progress': return <Play className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'failed': return <XCircle className="h-4 w-4" />;
      case 'cancelled': return <AlertCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Sistema de Tareas Complejas</h2>
          <p className="text-muted-foreground">
            Gestiona y ejecuta análisis avanzados con agentes IA especializados
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => createTask('comprehensive_web3_seo')} variant="outline">
            <TrendingUp className="h-4 w-4 mr-2" />
            SEO Web3
          </Button>
          <Button onClick={() => createTask('defi_protocol_analysis')} variant="outline">
            <Coins className="h-4 w-4 mr-2" />
            DeFi Analysis
          </Button>
          <Button onClick={() => createTask('nft_collection_valuation')} variant="outline">
            <BarChart3 className="h-4 w-4 mr-2" />
            NFT Valuation
          </Button>
          <Button onClick={() => createTask('governance_health_check')} variant="outline">
            <Vote className="h-4 w-4 mr-2" />
            Governance
          </Button>
          <Button onClick={() => createTask('cross_chain_security_audit')} variant="outline">
            <Network className="h-4 w-4 mr-2" />
            Cross-Chain
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lista de Tareas */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Tareas Activas</CardTitle>
              <CardDescription>
                {tasks.length} tareas en total
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px]">
                <div className="space-y-3">
                  {tasks.map((task) => (
                    <div
                      key={task.id}
                      className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                        selectedTask?.id === task.id ? 'bg-primary/10 border-primary' : 'hover:bg-muted'
                      }`}
                      onClick={() => setSelectedTask(task)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {taskTypeIcons[task.type]}
                          <span className="font-medium text-sm">{task.name}</span>
                        </div>
                        <Badge className={statusColors[task.status]}>
                          {getStatusIcon(task.status)}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                        <Badge variant="outline" className={priorityColors[task.priority]}>
                          {task.priority}
                        </Badge>
                        <span>{formatDuration(task.estimatedDuration)}</span>
                      </div>
                      
                      {task.status === 'in_progress' && (
                        <Progress value={task.progress} className="h-1" />
                      )}
                      
                      <div className="flex gap-1 mt-2">
                        {task.status === 'pending' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              executeTask(task.id);
                            }}
                            disabled={isExecuting.has(task.id)}
                          >
                            <Play className="h-3 w-3" />
                          </Button>
                        )}
                        {(task.status === 'in_progress' || task.status === 'pending') && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              cancelTask(task.id);
                            }}
                          >
                            <Square className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Detalles de Tarea */}
        <div className="lg:col-span-2">
          {selectedTask ? (
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Resumen</TabsTrigger>
                <TabsTrigger value="subtasks">Subtareas</TabsTrigger>
                <TabsTrigger value="results">Resultados</TabsTrigger>
                <TabsTrigger value="recommendations">Recomendaciones</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-4">
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      {taskTypeIcons[selectedTask.type]}
                      <CardTitle>{selectedTask.name}</CardTitle>
                      <Badge className={statusColors[selectedTask.status]}>
                        {selectedTask.status}
                      </Badge>
                    </div>
                    <CardDescription>{selectedTask.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Prioridad</label>
                        <Badge className={priorityColors[selectedTask.priority]}>
                          {selectedTask.priority}
                        </Badge>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Duración Estimada</label>
                        <p className="text-sm">{formatDuration(selectedTask.estimatedDuration)}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Progreso</label>
                        <div className="flex items-center gap-2">
                          <Progress value={selectedTask.progress} className="flex-1" />
                          <span className="text-sm">{selectedTask.progress}%</span>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Agentes Requeridos</label>
                        <p className="text-sm">{selectedTask.requiredAgents.join(', ')}</p>
                      </div>
                    </div>
                    
                    {selectedTask.dependencies.length > 0 && (
                      <div>
                        <label className="text-sm font-medium">Dependencias</label>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {selectedTask.dependencies.map((dep) => (
                            <Badge key={dep} variant="outline">{dep}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="subtasks" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Subtareas ({selectedTask.subtasks.length})</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[400px]">
                      <div className="space-y-3">
                        {selectedTask.subtasks.map((subtask, index) => (
                          <div key={subtask.id} className="p-3 border rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <span className="text-xs bg-muted px-2 py-1 rounded">
                                  {index + 1}
                                </span>
                                <span className="font-medium">{subtask.name}</span>
                              </div>
                              <Badge className={statusColors[subtask.status]}>
                                {getStatusIcon(subtask.status)}
                              </Badge>
                            </div>
                            
                            <p className="text-sm text-muted-foreground mb-2">
                              Acción: {subtask.action}
                            </p>
                            
                            {subtask.status === 'in_progress' && (
                              <Progress value={subtask.progress} className="h-1" />
                            )}
                            
                            {subtask.agentId && (
                              <p className="text-xs text-muted-foreground mt-2">
                                Agente: {subtask.agentId}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="results" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Resultados de Análisis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {selectedTask.results ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium">Estado</label>
                            <Badge variant={selectedTask.results.success ? 'default' : 'destructive'}>
                              {selectedTask.results.success ? 'Exitoso' : 'Fallido'}
                            </Badge>
                          </div>
                          <div>
                            <label className="text-sm font-medium">Tiempo de Ejecución</label>
                            <p className="text-sm">{selectedTask.results.executionTime}ms</p>
                          </div>
                        </div>
                        
                        {selectedTask.results.insights.length > 0 && (
                          <div>
                            <label className="text-sm font-medium">Insights</label>
                            <ul className="list-disc list-inside space-y-1 mt-2">
                              {selectedTask.results.insights.map((insight, index) => (
                                <li key={index} className="text-sm">{insight}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        {selectedTask.results.errors && selectedTask.results.errors.length > 0 && (
                          <div>
                            <label className="text-sm font-medium text-red-600">Errores</label>
                            <ul className="list-disc list-inside space-y-1 mt-2">
                              {selectedTask.results.errors.map((error, index) => (
                                <li key={index} className="text-sm text-red-600">{error}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-muted-foreground">No hay resultados disponibles aún.</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="recommendations" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Recomendaciones</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {selectedTask.results?.recommendations ? (
                      <ScrollArea className="h-[400px]">
                        <div className="space-y-3">
                          {selectedTask.results.recommendations.map((rec, index) => (
                            <div key={index} className="p-3 border rounded-lg">
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="font-medium">{rec.title}</h4>
                                <Badge className={priorityColors[rec.priority]}>
                                  {rec.priority}
                                </Badge>
                              </div>
                              
                              <p className="text-sm text-muted-foreground mb-2">
                                {rec.description}
                              </p>
                              
                              <div className="text-xs space-y-1">
                                <p><strong>Implementación:</strong> {rec.implementation}</p>
                                <div className="flex justify-between">
                                  <span>Impacto: {rec.estimatedImpact}%</span>
                                  <span>Esfuerzo: {rec.estimatedEffort}%</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    ) : (
                      <p className="text-muted-foreground">No hay recomendaciones disponibles aún.</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center h-[600px]">
                <div className="text-center">
                  <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Selecciona una tarea</h3>
                  <p className="text-muted-foreground">
                    Elige una tarea de la lista para ver sus detalles y gestionar su ejecución.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

export default ComplexTaskManager;