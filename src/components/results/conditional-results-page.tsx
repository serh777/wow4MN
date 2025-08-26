'use client';

import React, { memo, useMemo, useState, useCallback, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Filter, Download, RefreshCw, Search, Eye, EyeOff,
  BarChart3, TrendingUp, AlertTriangle, CheckCircle2,
  Grid, List, Settings, Clock, Target, Zap
} from 'lucide-react';
import { OptimizedResultsRenderer } from './optimized-results-renderer';
import { useUnifiedResultsManager } from '@/hooks/use-unified-results-manager';
import { ToolResult } from './dynamic-results-renderer';
import ExecutiveSummary from './executive-summary';
import AdvancedFilters, { FilterOptions } from './advanced-filters';

export interface ConditionalResultsPageProps {
  analysisId?: string;
  selectedTools?: string[];
  autoRefresh?: boolean;
  refreshInterval?: number;
}

const ConditionalResultsPage = memo<ConditionalResultsPageProps>(function ConditionalResultsPage({
  analysisId,
  selectedTools = [],
  autoRefresh = false,
  refreshInterval = 30000
}) {
  // Estados locales
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'compact'>('grid');
  const [showExecutiveSummary, setShowExecutiveSummary] = useState(true);
  const [filters, setFilters] = useState<FilterOptions>({
    searchQuery: '',
    categories: [],
    statuses: [],
    scoreRange: [0, 100],
    dateRange: {},
    toolIds: selectedTools,
    hasIssues: null,
    sortBy: 'priority',
    sortOrder: 'desc'
  });

  // Hook de gestión unificada de resultados
  const {
    results,
    isLoading,
    error,
    progress,
    completedTools,
    failedTools,
    currentTool,
    startAnalysis,
    clearResults,
    retryTool,
    exportResults,
    stats
  } = useUnifiedResultsManager({
    autoRefresh,
    refreshInterval,
    maxRetries: 3
  });

  // Efectos
  useEffect(() => {
    if (analysisId && !results.length) {
      // Iniciar análisis si hay un ID de análisis
      console.log('Monitoring analysis:', analysisId);
    }
  }, [analysisId, results.length]);

  // Filtrado y ordenamiento de resultados
  const filteredAndSortedResults = useMemo(() => {
    let filtered = results;

    // Filtrar por herramientas seleccionadas
    if (filters.toolIds.length > 0) {
      filtered = filtered.filter(result => filters.toolIds.includes(result.toolId));
    }

    // Filtrar por categorías
    if (filters.categories.length > 0) {
      filtered = filtered.filter(result => {
        const category = getCategoryFromToolId(result.toolId);
        return filters.categories.includes(category);
      });
    }

    // Filtrar por estados
    if (filters.statuses.length > 0) {
      filtered = filtered.filter(result => filters.statuses.includes(result.status));
    }

    // Filtrar por rango de puntuación
    filtered = filtered.filter(result => {
      if (result.score === undefined) return true;
      return result.score >= filters.scoreRange[0] && result.score <= filters.scoreRange[1];
    });

    // Filtrar por issues
    if (filters.hasIssues !== null) {
      filtered = filtered.filter(result => {
        const hasIssues = result.metrics && Object.keys(result.metrics).some(key => 
          key.toLowerCase().includes('issue') || 
          key.toLowerCase().includes('vulnerability') ||
          key.toLowerCase().includes('error')
        );
        return filters.hasIssues ? hasIssues : !hasIssues;
      });
    }

    // Filtrar por búsqueda
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(result => 
        result.toolName.toLowerCase().includes(query) ||
        result.insights?.some(insight => insight.toLowerCase().includes(query)) ||
        result.recommendations?.some(rec => rec.toLowerCase().includes(query))
      );
    }

    // Filtrar por rango de fechas
    if (filters.dateRange.from || filters.dateRange.to) {
      filtered = filtered.filter(result => {
        const resultDate = new Date(result.timestamp);
        if (filters.dateRange.from && resultDate < filters.dateRange.from) return false;
        if (filters.dateRange.to && resultDate > filters.dateRange.to) return false;
        return true;
      });
    }

    // Ordenar
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (filters.sortBy) {
        case 'priority':
          const priorityA = getToolConfig(a.toolId)?.priority || 999;
          const priorityB = getToolConfig(b.toolId)?.priority || 999;
          comparison = priorityA - priorityB;
          break;
        case 'status':
          const statusOrder = { completed: 0, running: 1, error: 2, pending: 3 };
          comparison = (statusOrder[a.status as keyof typeof statusOrder] || 4) - 
                      (statusOrder[b.status as keyof typeof statusOrder] || 4);
          break;
        case 'timestamp':
          comparison = new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
          break;
        case 'score':
          comparison = (a.score || 0) - (b.score || 0);
          break;
        case 'name':
          comparison = a.toolName.localeCompare(b.toolName);
          break;
      }
      
      return filters.sortOrder === 'desc' ? -comparison : comparison;
    });

    return filtered;
  }, [results, filters]);

  // Variables adicionales necesarias
  const searchQuery = filters.searchQuery || '';
  const filterCategory = filters.categories.length > 0 ? filters.categories[0] : 'all';

  // Callbacks
  const handleRetry = useCallback((toolId: string) => {
    retryTool(toolId, { address: '', selectedTools });
  }, [retryTool, selectedTools]);

  const handleExport = useCallback((format: 'json' | 'csv' = 'json') => {
    const exported = exportResults(format);
    // Crear y descargar archivo
    const blob = new Blob([exported], { 
      type: format === 'json' ? 'application/json' : 'text/csv' 
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analysis-results.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [exportResults]);

  const handleRefresh = useCallback(() => {
    if (analysisId) {
      clearResults();
      console.log('Refreshing analysis:', analysisId);
    }
  }, [analysisId, clearResults]);

  // Función auxiliar para obtener configuración de herramienta
  const getToolConfig = (toolId: string) => {
    // Esta función debería obtener la configuración desde TOOL_CONFIGS
    // Por ahora retornamos un objeto básico
    return {
      category: 'analysis',
      priority: 1
    };
  };

  // Función auxiliar para obtener categoría desde toolId
  const getCategoryFromToolId = (toolId: string): string => {
    if (toolId.includes('security')) return 'Seguridad';
    if (toolId.includes('performance')) return 'Rendimiento';
    if (toolId.includes('nft') || toolId.includes('blockchain')) return 'Blockchain';
    if (toolId.includes('content') || toolId.includes('seo')) return 'Contenido';
    if (toolId.includes('social')) return 'Social';
    if (toolId.includes('ai')) return 'IA';
    if (toolId.includes('metadata')) return 'Metadatos';
    if (toolId.includes('links')) return 'Enlaces';
    if (toolId.includes('wallet')) return 'Wallet';
    return 'General';
  };

  return (
    <div className="space-y-6">
      {/* Header con estadísticas */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">Resultados del Análisis</CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                {stats.total} herramientas • {stats.completed} completadas • {stats.failed} errores
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              {isLoading && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Analizando...
                </div>
              )}
              
              <Button variant="outline" size="sm" onClick={handleRefresh}>
                <RefreshCw className="h-4 w-4 mr-1" />
                Actualizar
              </Button>
              
              <Button variant="outline" size="sm" onClick={() => handleExport()}>
                <Download className="h-4 w-4 mr-1" />
                Exportar
              </Button>
            </div>
          </div>
        </CardHeader>
        
        {/* Barra de progreso general */}
        {isLoading && (
          <CardContent className="pt-0">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Progreso general</span>
                <span>{Math.round((stats.completed / stats.total) * 100)}%</span>
              </div>
              <div className="progress-bar-container">
                <div 
                  className="progress-bar-fill"
                  style={{ '--progress-width': `${(stats.completed / stats.total) * 100}%` } as React.CSSProperties}
                />
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Resumen ejecutivo */}
      {showExecutiveSummary && filteredAndSortedResults.length > 0 && (
        <ExecutiveSummary results={filteredAndSortedResults} />
      )}

      {/* Filtros avanzados */}
      <AdvancedFilters
        results={results}
        filters={filters}
        onFiltersChange={setFilters}
      />

      {/* Controles de vista */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-700">Vista:</span>
              
              {/* Modo de vista */}
              <div className="flex border rounded-lg">
                <Button
                  variant={viewMode === 'grid' ? 'primary' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="rounded-r-none"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'primary' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="rounded-none border-x"
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'compact' ? 'primary' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('compact')}
                  className="rounded-l-none"
                >
                  <Target className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowExecutiveSummary(!showExecutiveSummary)}
              >
                {showExecutiveSummary ? <EyeOff className="h-4 w-4 mr-1" /> : <Eye className="h-4 w-4 mr-1" />}
                {showExecutiveSummary ? 'Ocultar' : 'Mostrar'} Resumen
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resultados */}
      {filteredAndSortedResults.length > 0 ? (
        <OptimizedResultsRenderer
          results={filteredAndSortedResults}
          viewMode={viewMode}
          onRetryTool={handleRetry}
          selectedTools={[]}
          address=""
        />
      ) : (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="space-y-3">
              <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                <Search className="h-6 w-6 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">No se encontraron resultados</h3>
              <p className="text-gray-600">
                {searchQuery || filterCategory !== 'all' 
                  ? 'Intenta ajustar los filtros de búsqueda'
                  : 'Los resultados aparecerán aquí cuando el análisis esté completo'
                }
              </p>
              {(filters.searchQuery || filters.categories.length > 0 || filters.statuses.length > 0) && (
                <Button 
                  variant="outline" 
                  onClick={() => setFilters({
                    searchQuery: '',
                    categories: [],
                    statuses: [],
                    scoreRange: [0, 100],
                    dateRange: {},
                    toolIds: selectedTools,
                    hasIssues: null,
                    sortBy: 'priority',
                    sortOrder: 'desc'
                  })}
                >
                  Limpiar filtros
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Información de estado */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-red-900">Error en el análisis</h4>
                <p className="text-sm text-red-700 mt-1">{error}</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleRefresh}
                  className="mt-2 border-red-300 text-red-700 hover:bg-red-50"
                >
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Reintentar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
});

export default ConditionalResultsPage;