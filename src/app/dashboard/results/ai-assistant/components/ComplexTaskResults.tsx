'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  TrendingUp, 
  BarChart3, 
  Coins, 
  Shield, 
  Network,
  ExternalLink
} from 'lucide-react';

interface ComplexTaskResult {
  id: string;
  type: 'defi-analysis' | 'nft-analysis' | 'governance-analysis' | 'cross-chain-analysis';
  status: 'completed' | 'processing' | 'failed';
  title: string;
  description: string;
  progress: number;
  results?: {
    score: number;
    insights: string[];
    recommendations: string[];
    metrics: Record<string, number>;
    data: any;
  };
  executionTime: number;
  createdAt: string;
}

interface ComplexTaskResultsProps {
  tasks: ComplexTaskResult[];
  onViewDetails?: (taskId: string) => void;
}

const getTaskIcon = (type: string) => {
  switch (type) {
    case 'defi-analysis':
      return <Coins className="w-5 h-5 text-green-600" />;
    case 'nft-analysis':
      return <BarChart3 className="w-5 h-5 text-purple-600" />;
    case 'governance-analysis':
      return <Shield className="w-5 h-5 text-blue-600" />;
    case 'cross-chain-analysis':
      return <Network className="w-5 h-5 text-orange-600" />;
    default:
      return <TrendingUp className="w-5 h-5 text-gray-600" />;
  }
};

const getTaskTypeLabel = (type: string) => {
  const labels: Record<string, string> = {
    'defi-analysis': 'Análisis DeFi',
    'nft-analysis': 'Análisis NFT',
    'governance-analysis': 'Análisis de Gobernanza',
    'cross-chain-analysis': 'Análisis Cross-Chain'
  };
  return labels[type] || 'Análisis Personalizado';
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'completed':
      return <Badge className="bg-green-100 text-green-800 border-green-200"><CheckCircle className="w-3 h-3 mr-1" />Completado</Badge>;
    case 'processing':
      return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200"><Clock className="w-3 h-3 mr-1" />Procesando</Badge>;
    case 'failed':
      return <Badge className="bg-red-100 text-red-800 border-red-200"><AlertTriangle className="w-3 h-3 mr-1" />Fallido</Badge>;
    default:
      return <Badge variant="secondary">Desconocido</Badge>;
  }
};

const getScoreColor = (score: number) => {
  if (score >= 80) return 'text-green-600';
  if (score >= 60) return 'text-yellow-600';
  return 'text-red-600';
};

export default function ComplexTaskResults({ tasks, onViewDetails }: ComplexTaskResultsProps) {
  if (!tasks || tasks.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-purple-600" />
            Tareas Complejas de IA
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">No hay tareas complejas ejecutadas aún.</p>
            <p className="text-sm text-gray-500">
              Las tareas complejas aparecerán aquí cuando se ejecuten desde el sistema de agentes autónomos.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const completedTasks = tasks.filter(task => task.status === 'completed');
  const processingTasks = tasks.filter(task => task.status === 'processing');
  const failedTasks = tasks.filter(task => task.status === 'failed');

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-purple-600" />
            Tareas Complejas de IA
          </CardTitle>
          <div className="flex gap-4 text-sm text-gray-600">
            <span>Total: {tasks.length}</span>
            <span className="text-green-600">Completadas: {completedTasks.length}</span>
            <span className="text-yellow-600">En proceso: {processingTasks.length}</span>
            <span className="text-red-600">Fallidas: {failedTasks.length}</span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {tasks.map((task) => (
              <Card key={task.id} className="border-l-4 border-l-purple-500">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getTaskIcon(task.type)}
                      <div>
                        <h4 className="font-semibold">{task.title}</h4>
                        <p className="text-sm text-gray-600">{getTaskTypeLabel(task.type)}</p>
                      </div>
                    </div>
                    {getStatusBadge(task.status)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-700">{task.description}</p>
                  
                  {task.status === 'processing' && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progreso</span>
                        <span>{task.progress}%</span>
                      </div>
                      <Progress value={task.progress} className="w-full" />
                    </div>
                  )}
                  
                  {task.status === 'completed' && task.results && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Puntuación General</span>
                        <span className={`text-lg font-bold ${getScoreColor(task.results.score)}`}>
                          {task.results.score}/100
                        </span>
                      </div>
                      
                      {task.results.insights.length > 0 && (
                        <div>
                          <h5 className="text-sm font-medium mb-2">Insights Clave</h5>
                          <ul className="space-y-1">
                            {task.results.insights.slice(0, 2).map((insight, index) => (
                              <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                                <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0" />
                                {insight}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {task.results.recommendations.length > 0 && (
                        <div>
                          <h5 className="text-sm font-medium mb-2">Recomendaciones</h5>
                          <ul className="space-y-1">
                            {task.results.recommendations.slice(0, 2).map((rec, index) => (
                              <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                                {rec}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="text-xs text-gray-500">
                      <span>Ejecutado en {task.executionTime}ms</span>
                      <span className="mx-2">•</span>
                      <span>{new Date(task.createdAt).toLocaleString()}</span>
                    </div>
                    
                    {task.status === 'completed' && onViewDetails && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => onViewDetails(task.id)}
                        className="text-xs"
                      >
                        <ExternalLink className="w-3 h-3 mr-1" />
                        Ver Detalles
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}