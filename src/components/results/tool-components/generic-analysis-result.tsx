'use client';

import React, { memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  Info, CheckCircle, AlertTriangle, RefreshCw, 
  TrendingUp, BarChart3, Clock, ExternalLink
} from 'lucide-react';
import { ToolResult } from '../dynamic-results-renderer';

export interface GenericAnalysisResultProps {
  result: ToolResult;
  onRetry?: () => void;
  variant?: 'card' | 'compact';
}

const GenericAnalysisResult = memo<GenericAnalysisResultProps>(function GenericAnalysisResult({
  result,
  onRetry,
  variant = 'card'
}) {
  const statusConfig = {
    completed: {
      color: 'border-green-200 bg-green-50',
      icon: CheckCircle,
      iconColor: 'text-green-600',
      badge: 'success'
    },
    running: {
      color: 'border-yellow-200 bg-yellow-50 animate-pulse',
      icon: RefreshCw,
      iconColor: 'text-yellow-600',
      badge: 'warning'
    },
    error: {
      color: 'border-red-200 bg-red-50',
      icon: AlertTriangle,
      iconColor: 'text-red-600',
      badge: 'destructive'
    },
    pending: {
      color: 'border-gray-200 bg-gray-50',
      icon: Clock,
      iconColor: 'text-gray-600',
      badge: 'secondary'
    }
  };

  const config = statusConfig[result.status];
  const StatusIcon = config.icon;

  if (variant === 'compact') {
    return (
      <Card className={`${config.color} transition-all hover:shadow-md`}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <StatusIcon className={`h-5 w-5 ${config.iconColor}`} />
              <div>
                <h3 className="font-medium text-gray-900">{result.toolName}</h3>
                <p className="text-sm text-gray-600">
                  {new Date(result.timestamp).toLocaleTimeString('es-ES', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {result.status === 'completed' && result.score && (
                <Badge variant="outline" className="text-xs">
                  {Math.round(result.score)}/100
                </Badge>
              )}
              
              {result.status === 'error' && onRetry && (
                <Button variant="ghost" size="sm" onClick={onRetry}>
                  <RefreshCw className="h-3 w-3" />
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`${config.color} transition-all hover:shadow-lg`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-white shadow-sm">
              <StatusIcon className={`h-6 w-6 ${config.iconColor}`} />
            </div>
            <div>
              <CardTitle className="text-lg">{result.toolName}</CardTitle>
              <p className="text-sm text-gray-600">
                Ejecutado el {new Date(result.timestamp).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant={config.badge as any}>
              {getStatusText(result.status)}
            </Badge>
            
            {result.status === 'error' && onRetry && (
              <Button variant="outline" size="sm" onClick={onRetry}>
                <RefreshCw className="h-4 w-4 mr-1" />
                Reintentar
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Puntuación y métricas principales */}
        {result.status === 'completed' && (
          <>
            {result.score && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Puntuación General</span>
                  <span className="text-lg font-bold text-gray-900">{Math.round(result.score)}/100</span>
                </div>
                <Progress value={result.score} className="h-2" />
              </div>
            )}
            
            {/* Métricas clave */}
            {result.metrics && Object.keys(result.metrics).length > 0 && (
              <>
                <Separator />
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" />
                    Métricas Clave
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    {Object.entries(result.metrics).slice(0, 4).map(([key, value]) => (
                      <MetricCard key={key} label={key} value={value} />
                    ))}
                  </div>
                </div>
              </>
            )}
            
            {/* Insights */}
            {result.insights && result.insights.length > 0 && (
              <>
                <Separator />
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
                    <Info className="h-4 w-4" />
                    Insights Principales
                  </h4>
                  <ul className="space-y-2">
                    {result.insights.slice(0, 3).map((insight, index) => (
                      <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                        {insight}
                      </li>
                    ))}
                  </ul>
                  {result.insights.length > 3 && (
                    <p className="text-xs text-gray-500 mt-2">
                      +{result.insights.length - 3} insights adicionales
                    </p>
                  )}
                </div>
              </>
            )}
            
            {/* Recomendaciones */}
            {result.recommendations && result.recommendations.length > 0 && (
              <>
                <Separator />
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Recomendaciones
                  </h4>
                  <ul className="space-y-2">
                    {result.recommendations.slice(0, 3).map((recommendation, index) => (
                      <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 flex-shrink-0" />
                        {recommendation}
                      </li>
                    ))}
                  </ul>
                  {result.recommendations.length > 3 && (
                    <p className="text-xs text-gray-500 mt-2">
                      +{result.recommendations.length - 3} recomendaciones adicionales
                    </p>
                  )}
                </div>
              </>
            )}
          </>
        )}
        
        {/* Estado de error */}
        {result.status === 'error' && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-red-900">Error en el análisis</h4>
                <p className="text-sm text-red-700 mt-1">
                  {result.data?.error?.message || 'Ha ocurrido un error durante el análisis'}
                </p>
                {onRetry && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={onRetry}
                    className="mt-2 border-red-300 text-red-700 hover:bg-red-50"
                  >
                    <RefreshCw className="h-3 w-3 mr-1" />
                    Reintentar análisis
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
        
        {/* Estado de carga */}
        {result.status === 'running' && (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center gap-3">
              <RefreshCw className="h-5 w-5 text-yellow-600 animate-spin" />
              <div>
                <h4 className="text-sm font-medium text-yellow-900">Análisis en progreso</h4>
                <p className="text-sm text-yellow-700">Este análisis está siendo procesado...</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Estado pendiente */}
        {result.status === 'pending' && (
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-gray-600" />
              <div>
                <h4 className="text-sm font-medium text-gray-900">En cola</h4>
                <p className="text-sm text-gray-700">Este análisis está esperando ser procesado</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Datos adicionales */}
        {result.status === 'completed' && result.data && (
          <div className="pt-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs text-gray-500 hover:text-gray-700"
            >
              <ExternalLink className="h-3 w-3 mr-1" />
              Ver detalles completos
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
});

// Componente para mostrar métricas individuales
const MetricCard = memo<{
  label: string;
  value: any;
}>(function MetricCard({ label, value }) {
  const formatValue = (val: any): string => {
    if (typeof val === 'number') {
      if (val > 1000000) {
        return `${(val / 1000000).toFixed(1)}M`;
      }
      if (val > 1000) {
        return `${(val / 1000).toFixed(1)}K`;
      }
      return val.toLocaleString();
    }
    if (typeof val === 'boolean') {
      return val ? 'Sí' : 'No';
    }
    return String(val);
  };

  const formatLabel = (label: string): string => {
    return label
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim();
  };

  return (
    <div className="p-3 bg-white rounded-lg border border-gray-100">
      <div className="text-xs text-gray-500 uppercase tracking-wide">
        {formatLabel(label)}
      </div>
      <div className="text-sm font-semibold text-gray-900 mt-1">
        {formatValue(value)}
      </div>
    </div>
  );
});

// Función auxiliar para obtener texto de estado
function getStatusText(status: string): string {
  const statusTexts = {
    completed: 'Completado',
    running: 'En progreso',
    error: 'Error',
    pending: 'Pendiente'
  };
  
  return statusTexts[status as keyof typeof statusTexts] || status;
}

export default GenericAnalysisResult;