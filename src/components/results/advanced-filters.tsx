'use client';

import React, { memo, useState, useCallback, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { 
  Filter, X, Search, Calendar, BarChart3, 
  AlertTriangle, CheckCircle2, Clock, RefreshCw,
  ChevronDown, ChevronUp, Settings
} from 'lucide-react';
import { ToolResult } from './dynamic-results-renderer';

export interface FilterOptions {
  searchQuery: string;
  categories: string[];
  statuses: string[];
  scoreRange: [number, number];
  dateRange: {
    from?: Date;
    to?: Date;
  };
  toolIds: string[];
  hasIssues: boolean | null;
  sortBy: 'priority' | 'status' | 'timestamp' | 'score' | 'name';
  sortOrder: 'asc' | 'desc';
}

export interface AdvancedFiltersProps {
  results: ToolResult[];
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  className?: string;
}

const AdvancedFilters = memo<AdvancedFiltersProps>(function AdvancedFilters({
  results,
  filters,
  onFiltersChange,
  className = ''
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showPresets, setShowPresets] = useState(false);

  // Extraer opciones disponibles de los resultados
  const availableOptions = useMemo(() => {
    const categories = new Set<string>();
    const statuses = new Set<string>();
    const toolIds = new Set<string>();
    let minScore = 100;
    let maxScore = 0;
    let minDate: Date | null = null;
    let maxDate: Date | null = null;

    results.forEach(result => {
      // Categorías (inferidas del toolId)
      const category = getCategoryFromToolId(result.toolId);
      categories.add(category);
      
      // Estados
      statuses.add(result.status);
      
      // Tool IDs
      toolIds.add(result.toolId);
      
      // Rango de puntuaciones
      if (result.score !== undefined) {
        minScore = Math.min(minScore, result.score);
        maxScore = Math.max(maxScore, result.score);
      }
      
      // Rango de fechas
      const date = new Date(result.timestamp);
      if (!minDate || date < minDate) minDate = date;
      if (!maxDate || date > maxDate) maxDate = date;
    });

    return {
      categories: Array.from(categories).sort(),
      statuses: Array.from(statuses).sort(),
      toolIds: Array.from(toolIds).sort(),
      scoreRange: [minScore === 100 ? 0 : minScore, maxScore] as [number, number],
      dateRange: { min: minDate, max: maxDate }
    };
  }, [results]);

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

  // Obtener nombre legible del toolId
  const getToolName = (toolId: string): string => {
    const names: { [key: string]: string } = {
      'ai-assistant': 'Asistente IA',
      'blockchain': 'Análisis Blockchain',
      'nft-tracking': 'Tracking NFT',
      'security-scan': 'Escaneo de Seguridad',
      'performance-audit': 'Auditoría de Rendimiento',
      'content-analysis': 'Análisis de Contenido',
      'social-media': 'Redes Sociales',
      'seo-analyzer': 'Analizador SEO',
      'competitor-analysis': 'Análisis de Competencia',
      'links': 'Análisis de Enlaces',
      'metadata': 'Análisis de Metadatos',
      'wallet': 'Análisis de Wallet'
    };
    return names[toolId] || toolId;
  };

  // Callbacks para actualizar filtros
  const updateFilters = useCallback((updates: Partial<FilterOptions>) => {
    onFiltersChange({ ...filters, ...updates });
  }, [filters, onFiltersChange]);

  const handleCategoryToggle = useCallback((category: string) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter(c => c !== category)
      : [...filters.categories, category];
    updateFilters({ categories: newCategories });
  }, [filters.categories, updateFilters]);

  const handleStatusToggle = useCallback((status: string) => {
    const newStatuses = filters.statuses.includes(status)
      ? filters.statuses.filter(s => s !== status)
      : [...filters.statuses, status];
    updateFilters({ statuses: newStatuses });
  }, [filters.statuses, updateFilters]);

  const handleToolToggle = useCallback((toolId: string) => {
    const newToolIds = filters.toolIds.includes(toolId)
      ? filters.toolIds.filter(t => t !== toolId)
      : [...filters.toolIds, toolId];
    updateFilters({ toolIds: newToolIds });
  }, [filters.toolIds, updateFilters]);

  // Presets de filtros
  const filterPresets = [
    {
      name: 'Solo Completados',
      filters: { statuses: ['completed'] }
    },
    {
      name: 'Con Errores',
      filters: { statuses: ['error'] }
    },
    {
      name: 'Puntuación Alta',
      filters: { scoreRange: [80, 100] as [number, number] }
    },
    {
      name: 'Seguridad',
      filters: { categories: ['Seguridad'] }
    },
    {
      name: 'Rendimiento',
      filters: { categories: ['Rendimiento'] }
    }
  ];

  const applyPreset = useCallback((preset: typeof filterPresets[0]) => {
    updateFilters(preset.filters);
  }, [updateFilters]);

  const clearAllFilters = useCallback(() => {
    updateFilters({
      searchQuery: '',
      categories: [],
      statuses: [],
      scoreRange: [0, 100],
      dateRange: {},
      toolIds: [],
      hasIssues: null,
      sortBy: 'priority',
      sortOrder: 'desc'
    });
  }, [updateFilters]);

  // Contar filtros activos
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.searchQuery) count++;
    if (filters.categories.length > 0) count++;
    if (filters.statuses.length > 0) count++;
    if (filters.scoreRange[0] > 0 || filters.scoreRange[1] < 100) count++;
    if (filters.dateRange.from || filters.dateRange.to) count++;
    if (filters.toolIds.length > 0) count++;
    if (filters.hasIssues !== null) count++;
    return count;
  }, [filters]);

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            <CardTitle className="text-lg">Filtros Avanzados</CardTitle>
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {activeFiltersCount}
              </Badge>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowPresets(!showPresets)}
            >
              <Settings className="h-4 w-4 mr-1" />
              Presets
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Búsqueda */}
        <div className="space-y-2">
          <Label htmlFor="search">Búsqueda</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="search"
              placeholder="Buscar en resultados..."
              value={filters.searchQuery}
              onChange={(e) => updateFilters({ searchQuery: e.target.value })}
              className="pl-10"
            />
          </div>
        </div>
        
        {/* Presets */}
        {showPresets && (
          <div className="space-y-2">
            <Label>Filtros Predefinidos</Label>
            <div className="flex flex-wrap gap-2">
              {filterPresets.map((preset, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => applyPreset(preset)}
                >
                  {preset.name}
                </Button>
              ))}
            </div>
          </div>
        )}
        
        {/* Filtros básicos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Ordenamiento */}
          <div className="space-y-2">
            <Label>Ordenar por</Label>
            <div className="flex gap-2">
              <Select 
                value={filters.sortBy} 
                onValueChange={(value: any) => updateFilters({ sortBy: value })}
              >
                <SelectTrigger className="flex-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="priority">Prioridad</SelectItem>
                  <SelectItem value="status">Estado</SelectItem>
                  <SelectItem value="timestamp">Fecha</SelectItem>
                  <SelectItem value="score">Puntuación</SelectItem>
                  <SelectItem value="name">Nombre</SelectItem>
                </SelectContent>
              </Select>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => updateFilters({ 
                  sortOrder: filters.sortOrder === 'asc' ? 'desc' : 'asc' 
                })}
              >
                {filters.sortOrder === 'asc' ? '↑' : '↓'}
              </Button>
            </div>
          </div>
          
          {/* Issues */}
          <div className="space-y-2">
            <Label>Issues</Label>
            <Select 
              value={filters.hasIssues === null ? 'all' : filters.hasIssues.toString()}
              onValueChange={(value) => updateFilters({ 
                hasIssues: value === 'all' ? null : value === 'true' 
              })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="true">Con Issues</SelectItem>
                <SelectItem value="false">Sin Issues</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Rango de puntuación */}
          <div className="space-y-2">
            <Label>Puntuación: {filters.scoreRange[0]} - {filters.scoreRange[1]}</Label>
            <Slider
              value={filters.scoreRange}
              onValueChange={(value: number[]) => updateFilters({ scoreRange: value as [number, number] })}
              max={100}
              min={0}
              step={5}
              className="w-full"
            />
          </div>
        </div>
        
        {/* Filtros expandidos */}
        {isExpanded && (
          <>
            <Separator />
            
            {/* Estados */}
            <div className="space-y-2">
              <Label>Estados</Label>
              <div className="flex flex-wrap gap-2">
                {availableOptions.statuses.map(status => {
                  const isSelected = filters.statuses.includes(status);
                  const statusConfigs = {
                    completed: { icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-100' },
                    running: { icon: Clock, color: 'text-blue-600', bg: 'bg-blue-100' },
                    error: { icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-100' },
                    pending: { icon: RefreshCw, color: 'text-gray-600', bg: 'bg-gray-100' }
                  };
                  const statusConfig = statusConfigs[status as keyof typeof statusConfigs] || { icon: Clock, color: 'text-gray-600', bg: 'bg-gray-100' };
                  
                  const Icon = statusConfig.icon;
                  
                  return (
                    <Button
                      key={status}
                      variant={isSelected ? 'primary' : 'outline'}
                      size="sm"
                      onClick={() => handleStatusToggle(status)}
                      className={isSelected ? '' : `${statusConfig.color} border-current`}
                    >
                      <Icon className="h-3 w-3 mr-1" />
                      {status}
                    </Button>
                  );
                })}
              </div>
            </div>
            
            {/* Categorías */}
            <div className="space-y-2">
              <Label>Categorías</Label>
              <div className="flex flex-wrap gap-2">
                {availableOptions.categories.map(category => (
                  <Button
                    key={category}
                    variant={filters.categories.includes(category) ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => handleCategoryToggle(category)}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>
            
            {/* Herramientas específicas */}
            <div className="space-y-2">
              <Label>Herramientas</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {availableOptions.toolIds.map(toolId => (
                  <div key={toolId} className="flex items-center space-x-2">
                    <Checkbox
                      id={toolId}
                      checked={filters.toolIds.includes(toolId)}
                      onCheckedChange={() => handleToolToggle(toolId)}
                    />
                    <label 
                      htmlFor={toolId} 
                      className="text-sm text-gray-700 cursor-pointer truncate"
                      title={getToolName(toolId)}
                    >
                      {getToolName(toolId)}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
        
        {/* Acciones */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="text-sm text-gray-600">
            {activeFiltersCount > 0 ? `${activeFiltersCount} filtros activos` : 'Sin filtros'}
          </div>
          
          <div className="flex gap-2">
            {activeFiltersCount > 0 && (
              <Button variant="outline" size="sm" onClick={clearAllFilters}>
                <X className="h-3 w-3 mr-1" />
                Limpiar
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

export default AdvancedFilters;