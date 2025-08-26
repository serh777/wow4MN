'use client';

import React, { memo, useMemo, useState, Suspense, lazy } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Brain, Globe, Search, Zap, Shield, Link, Users, 
  BarChart3, Crown, Gamepad2, CheckCircle, Award,
  TrendingUp, AlertTriangle, Info, ExternalLink,
  RefreshCw, Download, Eye, EyeOff, Grid, List, Filter, Target
} from 'lucide-react';
import { ToolResult } from './dynamic-results-renderer';
import { TOOL_COMPONENT_MAP, type ToolComponentKey } from './tool-components';

// Componente genérico como fallback
const GenericAnalysisResult = lazy(() => import('./tool-components/generic-analysis-result'));

export interface OptimizedResultsProps {
  results: ToolResult[];
  selectedTools: string[];
  address: string;
  isLoading?: boolean;
  onRetryTool?: (toolId: string) => void;
  onExportResults?: (format: 'json' | 'csv') => void;
  className?: string;
  viewMode?: 'grid' | 'list' | 'compact';
  showOnlyCompleted?: boolean;
  enableVirtualization?: boolean;
}

export interface ToolConfig {
  icon: React.ComponentType<any>;
  color: string;
  priority: number;
  category: 'analysis' | 'security' | 'performance' | 'tracking' | 'content';
  componentKey?: ToolComponentKey;
}

// Configuración optimizada de herramientas con lazy loading
const TOOL_CONFIGS: Record<string, ToolConfig> = {
  'ai-assistant': {
    icon: Brain,
    color: 'from-purple-500 to-pink-500',
    priority: 1,
    category: 'analysis'
  },
  'blockchain': {
    icon: Globe,
    color: 'from-blue-500 to-cyan-500',
    priority: 2,
    category: 'analysis'
  },
  'nft-tracking': {
    icon: Award,
    color: 'from-indigo-500 to-purple-500',
    priority: 3,
    category: 'tracking',
    componentKey: 'nft-tracking'
  },
  'security': {
    icon: Shield,
    color: 'from-red-500 to-orange-500',
    priority: 4,
    category: 'security',
    componentKey: 'security-scan'
  },
  'performance': {
    icon: Zap,
    color: 'from-yellow-500 to-orange-500',
    priority: 5,
    category: 'performance',
    componentKey: 'performance-audit'
  },
  'keywords': {
    icon: Search,
    color: 'from-green-500 to-emerald-500',
    priority: 6,
    category: 'content',
    componentKey: 'keywords'
  },
  'backlinks': {
    icon: Link,
    color: 'from-teal-500 to-cyan-500',
    priority: 7,
    category: 'content',
    componentKey: 'backlinks'
  },
  'social-web3': {
    icon: Users,
    color: 'from-pink-500 to-rose-500',
    priority: 8,
    category: 'tracking'
  },
  'authority-tracking': {
    icon: Crown,
    color: 'from-amber-500 to-yellow-500',
    priority: 9,
    category: 'tracking'
  },
  'content-authenticity': {
    icon: CheckCircle,
    color: 'from-emerald-500 to-green-500',
    priority: 10,
    category: 'content'
  },
  'metaverse-optimizer': {
    icon: Gamepad2,
    color: 'from-violet-500 to-purple-500',
    priority: 11,
    category: 'performance'
  },
  'ecosystem-interactions': {
    icon: BarChart3,
    color: 'from-teal-500 to-cyan-500',
    priority: 12,
    category: 'analysis'
  },
  'competition': {
    icon: TrendingUp,
    color: 'from-orange-500 to-red-500',
    priority: 13,
    category: 'analysis'
  },
  'smart-contract': {
    icon: Shield,
    color: 'from-blue-600 to-purple-600',
    priority: 14,
    category: 'security',
    componentKey: 'smart-contract'
  },
  'historical': {
    icon: BarChart3,
    color: 'from-gray-500 to-slate-500',
    priority: 15,
    category: 'analysis',
    componentKey: 'historical'
  },
  'metadata': {
    icon: Info,
    color: 'from-blue-500 to-indigo-500',
    priority: 16,
    category: 'analysis',
    componentKey: 'metadata'
  },
  'wallet': {
    icon: Users,
    color: 'from-purple-500 to-pink-500',
    priority: 17,
    category: 'analysis',
    componentKey: 'wallet'
  },
  'authority': {
    icon: Crown,
    color: 'from-yellow-500 to-orange-500',
    priority: 18,
    category: 'tracking',
    componentKey: 'authority'
  }
};

// Componente principal optimizado
export const OptimizedResultsRenderer = memo<OptimizedResultsProps>(function OptimizedResultsRenderer({
  results,
  selectedTools,
  address,
  isLoading = false,
  onRetryTool,
  onExportResults,
  className = '',
  viewMode = 'grid',
  showOnlyCompleted = false,
  enableVirtualization = false
}) {
  // Memoizar resultados filtrados y ordenados
  const processedResults = useMemo(() => {
    let filtered = results.filter(result => selectedTools.includes(result.toolId));
    
    if (showOnlyCompleted) {
      filtered = filtered.filter(result => result.status === 'completed');
    }
    
    return filtered.sort((a, b) => {
      const priorityA = TOOL_CONFIGS[a.toolId]?.priority || 999;
      const priorityB = TOOL_CONFIGS[b.toolId]?.priority || 999;
      return priorityA - priorityB;
    });
  }, [results, selectedTools, showOnlyCompleted]);

  // Memoizar estadísticas
  const stats = useMemo(() => {
    const total = processedResults.length;
    const completed = processedResults.filter(r => r.status === 'completed').length;
    const failed = processedResults.filter(r => r.status === 'error').length;
    const running = processedResults.filter(r => r.status === 'running').length;
    const pending = processedResults.filter(r => r.status === 'pending').length;
    
    const overallScore = completed > 0 
      ? processedResults
          .filter(r => r.status === 'completed' && r.score)
          .reduce((sum, r) => sum + (r.score || 0), 0) / completed
      : 0;
    
    return { total, completed, failed, running, pending, overallScore };
  }, [processedResults]);

  // Memoizar agrupación por categorías
  const resultsByCategory = useMemo(() => {
    const categories: Record<string, ToolResult[]> = {};
    
    processedResults.forEach(result => {
      const category = TOOL_CONFIGS[result.toolId]?.category || 'analysis';
      if (!categories[category]) {
        categories[category] = [];
      }
      categories[category].push(result);
    });
    
    return categories;
  }, [processedResults]);

  if (isLoading && processedResults.length === 0) {
    return <LoadingSkeleton selectedTools={selectedTools} viewMode={viewMode} />;
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header optimizado */}
      <ResultsHeader 
        address={address}
        stats={stats}
        onExportResults={onExportResults}
        viewMode={viewMode}
      />

      {/* Filtros y controles */}
      <ResultsControls 
        stats={stats}
        showOnlyCompleted={showOnlyCompleted}
      />

      {/* Renderizado condicional según modo de vista */}
      {viewMode === 'compact' ? (
        <CompactResultsView 
          results={processedResults}
          onRetryTool={onRetryTool}
        />
      ) : viewMode === 'list' ? (
        <ListResultsView 
          results={processedResults}
          onRetryTool={onRetryTool}
          enableVirtualization={enableVirtualization}
        />
      ) : (
        <GridResultsView 
          resultsByCategory={resultsByCategory}
          onRetryTool={onRetryTool}
        />
      )}

      {/* Resumen consolidado */}
      {processedResults.length > 1 && (
        <ConsolidatedSummary results={processedResults} stats={stats} />
      )}
    </div>
  );
});

// Componente de header optimizado
const ResultsHeader = memo<{
  address: string;
  stats: any;
  onExportResults?: (format: 'json' | 'csv') => void;
  viewMode: string;
}>(function ResultsHeader({ address, stats, onExportResults, viewMode }) {
  return (
    <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <CardTitle className="text-2xl font-bold text-gray-900">
              Análisis Unificado
            </CardTitle>
            <p className="text-gray-600 mt-1 text-sm">
              <span className="font-medium">Dirección:</span>{' '}
              <code className="bg-gray-100 px-2 py-1 rounded text-xs font-mono">
                {address.length > 20 ? `${address.slice(0, 10)}...${address.slice(-10)}` : address}
              </code>
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-3xl font-bold text-blue-600">
                {Math.round(stats.overallScore)}/100
              </div>
              <p className="text-sm text-gray-500">Puntuación</p>
            </div>
            
            {onExportResults && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onExportResults('json')}
                  className="flex items-center gap-1"
                >
                  <Download className="h-3 w-3" />
                  JSON
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onExportResults('csv')}
                  className="flex items-center gap-1"
                >
                  <Download className="h-3 w-3" />
                  CSV
                </Button>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-3 mt-4">
          <StatusBadge 
            icon={CheckCircle} 
            count={stats.completed} 
            total={stats.total}
            label="Completadas"
            variant="success"
          />
          {stats.running > 0 && (
            <StatusBadge 
              icon={RefreshCw} 
              count={stats.running}
              label="En progreso"
              variant="warning"
              animated
            />
          )}
          {stats.failed > 0 && (
            <StatusBadge 
              icon={AlertTriangle} 
              count={stats.failed}
              label="Fallidas"
              variant="destructive"
            />
          )}
          <Badge variant="secondary" className="text-xs">
            {new Date().toLocaleDateString('es-ES', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </Badge>
        </div>
      </CardHeader>
    </Card>
  );
});

// Componente de badge de estado
const StatusBadge = memo<{
  icon: React.ComponentType<any>;
  count: number;
  total?: number;
  label: string;
  variant: 'success' | 'warning' | 'destructive' | 'secondary';
  animated?: boolean;
}>(function StatusBadge({ icon: Icon, count, total, label, variant, animated }) {
  const variantClasses = {
    success: 'bg-green-100 text-green-800 border-green-200',
    warning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    destructive: 'bg-red-100 text-red-800 border-red-200',
    secondary: 'bg-gray-100 text-gray-800 border-gray-200'
  };

  return (
    <Badge 
      variant="outline" 
      className={`flex items-center gap-1 ${variantClasses[variant]} ${animated ? 'animate-pulse' : ''}`}
    >
      <Icon className="h-3 w-3" />
      {total ? `${count}/${total}` : count} {label}
    </Badge>
  );
});

// Componente de controles
const ResultsControls = memo<{
  stats: any;
  showOnlyCompleted: boolean;
}>(function ResultsControls({ stats, showOnlyCompleted }) {
  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
      <div className="flex items-center gap-4">
        <div className="text-sm text-gray-600">
          <span className="font-medium">Progreso:</span> {stats.completed}/{stats.total} herramientas
        </div>
        <div className="progress-bar-compact">
          <div 
            className="progress-bar-compact-fill"
            style={{ '--progress-width': `${(stats.completed / stats.total) * 100}%` } as React.CSSProperties}
          />
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <Button
          variant={showOnlyCompleted ? "primary" : "outline"}
          size="sm"
          className="flex items-center gap-1"
        >
          {showOnlyCompleted ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
          {showOnlyCompleted ? 'Mostrar todas' : 'Solo completadas'}
        </Button>
      </div>
    </div>
  );
});

// Vista de grid por categorías
const GridResultsView = memo<{
  resultsByCategory: Record<string, ToolResult[]>;
  onRetryTool?: (toolId: string) => void;
}>(function GridResultsView({ resultsByCategory, onRetryTool }) {
  const categoryNames = {
    analysis: 'Análisis',
    security: 'Seguridad',
    performance: 'Rendimiento',
    tracking: 'Seguimiento',
    content: 'Contenido'
  };

  return (
    <div className="space-y-8">
      {Object.entries(resultsByCategory).map(([category, results]) => (
        <div key={category}>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${getCategoryColor(category)}`} />
            {categoryNames[category as keyof typeof categoryNames] || category}
            <Badge variant="secondary" className="text-xs">
              {results.length}
            </Badge>
          </h3>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {results.map((result) => (
              <Suspense key={result.toolId} fallback={<ToolResultSkeleton />}>
                <OptimizedToolCard 
                  result={result}
                  config={TOOL_CONFIGS[result.toolId]}
                  onRetry={onRetryTool ? () => onRetryTool(result.toolId) : undefined}
                />
              </Suspense>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
});

// Vista de lista
const ListResultsView = memo<{
  results: ToolResult[];
  onRetryTool?: (toolId: string) => void;
  enableVirtualization: boolean;
}>(function ListResultsView({ results, onRetryTool, enableVirtualization }) {
  // TODO: Implementar virtualización si enableVirtualization es true
  return (
    <div className="space-y-3">
      {results.map((result) => (
        <Suspense key={result.toolId} fallback={<ToolResultSkeleton />}>
          <OptimizedToolCard 
            result={result}
            config={TOOL_CONFIGS[result.toolId]}
            onRetry={onRetryTool ? () => onRetryTool(result.toolId) : undefined}
            variant="list"
          />
        </Suspense>
      ))}
    </div>
  );
});

// Vista compacta
const CompactResultsView = memo<{
  results: ToolResult[];
  onRetryTool?: (toolId: string) => void;
}>(function CompactResultsView({ results, onRetryTool }) {
  return (
    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {results.map((result) => (
        <CompactToolCard 
          key={result.toolId}
          result={result}
          config={TOOL_CONFIGS[result.toolId]}
          onRetry={onRetryTool ? () => onRetryTool(result.toolId) : undefined}
        />
      ))}
    </div>
  );
});

// Tarjeta de herramienta optimizada
const OptimizedToolCard = memo<{
  result: ToolResult;
  config?: ToolConfig;
  onRetry?: () => void;
  variant?: 'card' | 'list';
}>(function OptimizedToolCard({ result, config, onRetry, variant = 'card' }) {
  const Icon = config?.icon || Info;
  const componentKey = config?.componentKey;
  
  if (componentKey && TOOL_COMPONENT_MAP[componentKey]) {
    const LazyComponent = lazy(TOOL_COMPONENT_MAP[componentKey]);
    return (
      <Suspense fallback={<ToolResultSkeleton />}>
        <LazyComponent result={result} onRetry={onRetry} variant={variant === 'list' ? 'compact' : variant} />
      </Suspense>
    );
  }

  return (
    <Suspense fallback={<ToolResultSkeleton />}>
      <GenericAnalysisResult result={result} onRetry={onRetry} variant={variant === 'list' ? 'compact' : variant} />
    </Suspense>
  );
});

// Tarjeta compacta
const CompactToolCard = memo<{
  result: ToolResult;
  config?: ToolConfig;
  onRetry?: () => void;
}>(function CompactToolCard({ result, config, onRetry }) {
  const Icon = config?.icon || Info;
  const statusColors = {
    completed: 'border-green-200 bg-green-50',
    running: 'border-yellow-200 bg-yellow-50 animate-pulse',
    error: 'border-red-200 bg-red-50',
    pending: 'border-gray-200 bg-gray-50'
  };

  return (
    <Card className={`p-3 ${statusColors[result.status]} transition-all hover:shadow-md`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4" />
          <span className="text-sm font-medium truncate">{result.toolName}</span>
        </div>
        
        {result.status === 'completed' && result.score && (
          <Badge variant="secondary" className="text-xs">
            {Math.round(result.score)}
          </Badge>
        )}
        
        {result.status === 'error' && onRetry && (
          <Button variant="ghost" size="sm" onClick={onRetry}>
            <RefreshCw className="h-3 w-3" />
          </Button>
        )}
      </div>
    </Card>
  );
});

// Resumen consolidado
const ConsolidatedSummary = memo<{
  results: ToolResult[];
  stats: any;
}>(function ConsolidatedSummary({ results, stats }) {
  const insights = useMemo(() => {
    return results
      .filter(r => r.status === 'completed' && r.insights)
      .flatMap(r => r.insights || [])
      .slice(0, 5); // Top 5 insights
  }, [results]);

  const recommendations = useMemo(() => {
    return results
      .filter(r => r.status === 'completed' && r.recommendations)
      .flatMap(r => r.recommendations || [])
      .slice(0, 5); // Top 5 recommendations
  }, [results]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Resumen Consolidado
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {insights.length > 0 && (
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Insights Principales</h4>
            <ul className="space-y-1">
              {insights.map((insight, index) => (
                <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                  <Info className="h-3 w-3 mt-0.5 text-blue-500 flex-shrink-0" />
                  {insight}
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {recommendations.length > 0 && (
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Recomendaciones</h4>
            <ul className="space-y-1">
              {recommendations.map((recommendation, index) => (
                <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                  <CheckCircle className="h-3 w-3 mt-0.5 text-green-500 flex-shrink-0" />
                  {recommendation}
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
});

// Skeleton de carga
const LoadingSkeleton = memo<{
  selectedTools: string[];
  viewMode: string;
}>(function LoadingSkeleton({ selectedTools, viewMode }) {
  return (
    <div className="space-y-6">
      <Skeleton className="h-32 w-full" />
      <div className={viewMode === 'grid' ? 'grid gap-4 md:grid-cols-2 lg:grid-cols-3' : 'space-y-3'}>
        {selectedTools.map((toolId) => (
          <ToolResultSkeleton key={toolId} />
        ))}
      </div>
    </div>
  );
});

const ToolResultSkeleton = memo(function ToolResultSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <Skeleton className="h-8 w-8 rounded" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <Skeleton className="h-20 w-full" />
          <div className="flex gap-2">
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-6 w-16" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

// Utilidades
function getCategoryColor(category: string): string {
  const colors = {
    analysis: 'from-blue-500 to-cyan-500',
    security: 'from-red-500 to-orange-500',
    performance: 'from-yellow-500 to-orange-500',
    tracking: 'from-purple-500 to-pink-500',
    content: 'from-green-500 to-emerald-500'
  };
  
  return colors[category as keyof typeof colors] || 'from-gray-500 to-slate-500';
}

export default OptimizedResultsRenderer;