'use client';

import React, { memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  Zap, Clock, Gauge, TrendingUp, TrendingDown, 
  Wifi, Server, Globe, Timer, BarChart3
} from 'lucide-react';
import { ToolResult } from '../dynamic-results-renderer';
import GenericAnalysisResult from './generic-analysis-result';

export interface PerformanceAnalysisResultProps {
  result: ToolResult;
  onRetry?: () => void;
  variant?: 'card' | 'compact';
}

const PerformanceAnalysisResult = memo<PerformanceAnalysisResultProps>(function PerformanceAnalysisResult({
  result,
  onRetry,
  variant = 'card'
}) {
  // Si no es un análisis de rendimiento completado, usar el componente genérico
  if (result.status !== 'completed' || !result.data) {
    return (
      <GenericAnalysisResult 
        result={result} 
        onRetry={onRetry} 
        variant={variant} 
      />
    );
  }

  const performanceData = result.data;
  const performanceScore = result.score || 0;
  
  // Métricas principales de rendimiento
  const coreMetrics = {
    loadTime: performanceData.loadTime || performanceData.pageLoadTime,
    firstContentfulPaint: performanceData.firstContentfulPaint || performanceData.fcp,
    largestContentfulPaint: performanceData.largestContentfulPaint || performanceData.lcp,
    cumulativeLayoutShift: performanceData.cumulativeLayoutShift || performanceData.cls,
    firstInputDelay: performanceData.firstInputDelay || performanceData.fid,
    timeToInteractive: performanceData.timeToInteractive || performanceData.tti
  };

  const getPerformanceLevel = (score: number) => {
    if (score >= 90) return { level: 'Excelente', color: 'text-green-600', bgColor: 'bg-green-50' };
    if (score >= 70) return { level: 'Bueno', color: 'text-blue-600', bgColor: 'bg-blue-50' };
    if (score >= 50) return { level: 'Moderado', color: 'text-yellow-600', bgColor: 'bg-yellow-50' };
    return { level: 'Necesita mejoras', color: 'text-red-600', bgColor: 'bg-red-50' };
  };

  const performanceLevel = getPerformanceLevel(performanceScore);

  if (variant === 'compact') {
    return (
      <Card className={`border-blue-200 ${performanceLevel.bgColor} transition-all hover:shadow-md`}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Zap className={`h-5 w-5 ${performanceLevel.color}`} />
              <div>
                <h3 className="font-medium text-gray-900">Análisis de Rendimiento</h3>
                <p className="text-sm text-gray-600">
                  {coreMetrics.loadTime ? `${Math.round(coreMetrics.loadTime)}ms` : 'Tiempo de carga'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Badge variant="outline" className={performanceLevel.color}>
                {Math.round(performanceScore)}/100
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`border-blue-200 ${performanceLevel.bgColor} transition-all hover:shadow-lg`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-white shadow-sm">
              <Zap className={`h-6 w-6 ${performanceLevel.color}`} />
            </div>
            <div>
              <CardTitle className="text-lg">Análisis de Rendimiento</CardTitle>
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
            <Badge variant="outline" className={performanceLevel.color}>
              {performanceLevel.level}
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Puntuación de rendimiento */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Puntuación de Rendimiento</span>
            <span className={`text-lg font-bold ${performanceLevel.color}`}>
              {Math.round(performanceScore)}/100
            </span>
          </div>
          <Progress 
            value={performanceScore} 
            className="h-2" 
            // @ts-ignore
            indicatorClassName={performanceScore >= 70 ? 'bg-green-500' : performanceScore >= 50 ? 'bg-yellow-500' : 'bg-red-500'}
          />
        </div>
        
        <Separator />
        
        {/* Métricas Core Web Vitals */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
            <Gauge className="h-4 w-4" />
            Core Web Vitals
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {coreMetrics.largestContentfulPaint && (
              <WebVitalCard 
                label="LCP" 
                value={coreMetrics.largestContentfulPaint}
                unit="ms"
                description="Largest Contentful Paint"
                threshold={{ good: 2500, poor: 4000 }}
                icon={Timer}
              />
            )}
            
            {coreMetrics.firstInputDelay && (
              <WebVitalCard 
                label="FID" 
                value={coreMetrics.firstInputDelay}
                unit="ms"
                description="First Input Delay"
                threshold={{ good: 100, poor: 300 }}
                icon={Clock}
              />
            )}
            
            {coreMetrics.cumulativeLayoutShift && (
              <WebVitalCard 
                label="CLS" 
                value={coreMetrics.cumulativeLayoutShift}
                unit=""
                description="Cumulative Layout Shift"
                threshold={{ good: 0.1, poor: 0.25 }}
                icon={BarChart3}
              />
            )}
          </div>
        </div>
        
        {/* Métricas adicionales de rendimiento */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Métricas Adicionales
          </h4>
          
          <div className="grid grid-cols-2 gap-3">
            {coreMetrics.loadTime && (
              <PerformanceMetric 
                label="Tiempo de Carga" 
                value={coreMetrics.loadTime} 
                unit="ms"
                icon={Clock}
              />
            )}
            
            {coreMetrics.firstContentfulPaint && (
              <PerformanceMetric 
                label="First Contentful Paint" 
                value={coreMetrics.firstContentfulPaint} 
                unit="ms"
                icon={Zap}
              />
            )}
            
            {coreMetrics.timeToInteractive && (
              <PerformanceMetric 
                label="Time to Interactive" 
                value={coreMetrics.timeToInteractive} 
                unit="ms"
                icon={Wifi}
              />
            )}
            
            {performanceData.totalBlockingTime && (
              <PerformanceMetric 
                label="Total Blocking Time" 
                value={performanceData.totalBlockingTime} 
                unit="ms"
                icon={Server}
              />
            )}
          </div>
        </div>
        
        {/* Recursos y optimizaciones */}
        {performanceData.resources && (
          <>
            <Separator />
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Análisis de Recursos
              </h4>
              
              <div className="grid grid-cols-2 gap-3">
                <ResourceMetric 
                  label="Tamaño Total" 
                  value={performanceData.resources.totalSize || 0} 
                  unit="KB"
                />
                <ResourceMetric 
                  label="Número de Requests" 
                  value={performanceData.resources.requestCount || 0} 
                  unit=""
                />
                <ResourceMetric 
                  label="Imágenes" 
                  value={performanceData.resources.imageSize || 0} 
                  unit="KB"
                />
                <ResourceMetric 
                  label="JavaScript" 
                  value={performanceData.resources.jsSize || 0} 
                  unit="KB"
                />
              </div>
            </div>
          </>
        )}
        
        {/* Oportunidades de mejora */}
        {performanceData.opportunities && performanceData.opportunities.length > 0 && (
          <>
            <Separator />
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Oportunidades de Mejora
              </h4>
              
              <div className="space-y-2">
                {performanceData.opportunities.slice(0, 4).map((opportunity: any, index: number) => (
                  <OpportunityItem key={index} opportunity={opportunity} />
                ))}
              </div>
            </div>
          </>
        )}
        
        {/* Recomendaciones */}
        {result.recommendations && result.recommendations.length > 0 && (
          <>
            <Separator />
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Recomendaciones de Optimización
              </h4>
              
              <ul className="space-y-2">
                {result.recommendations.slice(0, 4).map((recommendation, index) => (
                  <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                    {recommendation}
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
});

// Componente para Core Web Vitals
const WebVitalCard = memo<{
  label: string;
  value: number;
  unit: string;
  description: string;
  threshold: { good: number; poor: number };
  icon: React.ComponentType<any>;
}>(function WebVitalCard({ label, value, unit, description, threshold, icon: Icon }) {
  const getVitalStatus = (val: number, thresh: { good: number; poor: number }) => {
    if (val <= thresh.good) return { status: 'good', color: 'text-green-600 bg-green-100 border-green-200' };
    if (val <= thresh.poor) return { status: 'needs-improvement', color: 'text-yellow-600 bg-yellow-100 border-yellow-200' };
    return { status: 'poor', color: 'text-red-600 bg-red-100 border-red-200' };
  };

  const status = getVitalStatus(value, threshold);

  return (
    <div className={`p-3 rounded-lg border ${status.color}`}>
      <div className="flex items-center gap-2 mb-1">
        <Icon className="h-4 w-4" />
        <span className="text-xs font-medium uppercase tracking-wide">{label}</span>
      </div>
      <div className="text-lg font-bold">
        {value.toFixed(unit === 'ms' ? 0 : 2)}{unit}
      </div>
      <div className="text-xs text-gray-600 mt-1">{description}</div>
    </div>
  );
});

// Componente para métricas de rendimiento
const PerformanceMetric = memo<{
  label: string;
  value: number;
  unit: string;
  icon: React.ComponentType<any>;
}>(function PerformanceMetric({ label, value, unit, icon: Icon }) {
  const formatValue = (val: number, unit: string) => {
    if (unit === 'ms' && val > 1000) {
      return `${(val / 1000).toFixed(1)}s`;
    }
    return `${val.toFixed(unit === 'ms' ? 0 : 2)}${unit}`;
  };

  return (
    <div className="p-3 bg-white rounded-lg border border-gray-100">
      <div className="flex items-center gap-2 mb-1">
        <Icon className="h-3 w-3 text-gray-500" />
        <span className="text-xs text-gray-500 uppercase tracking-wide">{label}</span>
      </div>
      <div className="text-sm font-semibold text-gray-900">
        {formatValue(value, unit)}
      </div>
    </div>
  );
});

// Componente para métricas de recursos
const ResourceMetric = memo<{
  label: string;
  value: number;
  unit: string;
}>(function ResourceMetric({ label, value, unit }) {
  const formatValue = (val: number, unit: string) => {
    if (unit === 'KB' && val > 1024) {
      return `${(val / 1024).toFixed(1)} MB`;
    }
    return `${val.toLocaleString()}${unit ? ` ${unit}` : ''}`;
  };

  return (
    <div className="p-3 bg-white rounded-lg border border-gray-100">
      <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">{label}</div>
      <div className="text-sm font-semibold text-gray-900">
        {formatValue(value, unit)}
      </div>
    </div>
  );
});

// Componente para oportunidades de mejora
const OpportunityItem = memo<{
  opportunity: any;
}>(function OpportunityItem({ opportunity }) {
  const potentialSavings = opportunity.potentialSavings || opportunity.savings;
  
  return (
    <div className="p-3 bg-white rounded-lg border border-gray-200">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="h-3 w-3 text-blue-600" />
            <span className="text-sm font-medium text-gray-900">
              {opportunity.title || opportunity.name}
            </span>
            {potentialSavings && (
              <Badge variant="outline" className="text-xs text-green-600">
                -{Math.round(potentialSavings)}ms
              </Badge>
            )}
          </div>
          <p className="text-xs text-gray-600">
            {opportunity.description || 'Oportunidad de optimización identificada'}
          </p>
        </div>
      </div>
    </div>
  );
});

export default PerformanceAnalysisResult;