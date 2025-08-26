'use client';

import { useState, useCallback, useMemo } from 'react';
import { DataSource } from '@/components/tooltips/data-source-tooltip';
import { 
  getDataSourcesForTool,
  getAllDataSources,
  getDataSourceById,
  getDataSourcesByType,
  getAuthRequiredSources,
  getFreeSources
} from '@/data/data-sources';

export interface DataSourceTooltipState {
  isVisible: boolean;
  position: { x: number; y: number } | null;
  dataSource: DataSource | null;
  context?: string;
}

export interface UseDataSourceTooltipsReturn {
  // Estado
  tooltipState: DataSourceTooltipState;
  
  // Acciones
  showTooltip: (dataSourceId: string, position?: { x: number; y: number }, context?: string) => void;
  hideTooltip: () => void;
  toggleTooltip: (dataSourceId: string, position?: { x: number; y: number }, context?: string) => void;
  
  // Utilidades de datos
  getToolDataSources: (toolId: string) => DataSource[];
  getAllSources: () => DataSource[];
  getSourceById: (id: string) => DataSource | undefined;
  getSourcesByType: (type: DataSource['type']) => DataSource[];
  getAuthSources: () => DataSource[];
  getFreeSources: () => DataSource[];
  
  // Estadísticas
  getSourceStats: () => {
    total: number;
    byType: Record<DataSource['type'], number>;
    byReliability: Record<DataSource['reliability'], number>;
    byPricing: Record<string, number>;
    authRequired: number;
    free: number;
  };
  
  // Validación
  isValidSource: (sourceId: string) => boolean;
  getSourceReliability: (sourceId: string) => DataSource['reliability'] | null;
  
  // Filtrado avanzado
  filterSources: (filters: {
    type?: DataSource['type'][];
    reliability?: DataSource['reliability'][];
    pricing?: string[];
    requiresAuth?: boolean;
    searchTerm?: string;
  }) => DataSource[];
}

export const useDataSourceTooltips = (): UseDataSourceTooltipsReturn => {
  const [tooltipState, setTooltipState] = useState<DataSourceTooltipState>({
    isVisible: false,
    position: null,
    dataSource: null,
    context: undefined
  });

  // Función para mostrar tooltip
  const showTooltip = useCallback((dataSourceId: string, position?: { x: number; y: number }, context?: string) => {
    const dataSource = getDataSourceById(dataSourceId);
    if (dataSource) {
      setTooltipState({
        isVisible: true,
        position: position || null,
        dataSource,
        context
      });
    }
  }, []);

  // Función para ocultar tooltip
  const hideTooltip = useCallback(() => {
    setTooltipState({
      isVisible: false,
      position: null,
      dataSource: null,
      context: undefined
    });
  }, []);

  // Función para alternar tooltip
  const toggleTooltip = useCallback((dataSourceId: string, position?: { x: number; y: number }, context?: string) => {
    if (tooltipState.isVisible && tooltipState.dataSource?.name === getDataSourceById(dataSourceId)?.name) {
      hideTooltip();
    } else {
      showTooltip(dataSourceId, position, context);
    }
  }, [tooltipState.isVisible, tooltipState.dataSource, showTooltip, hideTooltip]);

  // Utilidades de datos memoizadas
  const getToolDataSources = useCallback((toolId: string) => {
    return getDataSourcesForTool(toolId);
  }, []);

  const getAllSources = useCallback(() => {
    return getAllDataSources();
  }, []);

  const getSourceById = useCallback((id: string) => {
    return getDataSourceById(id);
  }, []);

  const getSourcesByType = useCallback((type: DataSource['type']) => {
    return getDataSourcesByType(type);
  }, []);

  const getAuthSources = useCallback(() => {
    return getAuthRequiredSources();
  }, []);

  const getFreeSources = useCallback(() => {
    return getFreeSources();
  }, []);

  // Estadísticas memoizadas
  const getSourceStats = useMemo(() => {
    return () => {
      const allSources = getAllDataSources();
      
      const byType: Record<DataSource['type'], number> = {
        'api': 0,
        'blockchain': 0,
        'web': 0,
        'database': 0,
        'ai': 0,
        'social': 0
      };
      
      const byReliability: Record<DataSource['reliability'], number> = {
        'high': 0,
        'medium': 0,
        'low': 0
      };
      
      const byPricing: Record<string, number> = {
        'free': 0,
        'freemium': 0,
        'paid': 0,
        'unknown': 0
      };
      
      let authRequired = 0;
      let free = 0;
      
      allSources.forEach(source => {
        byType[source.type]++;
        byReliability[source.reliability]++;
        
        const pricing = source.pricing || 'unknown';
        byPricing[pricing]++;
        
        if (source.requiresAuth) authRequired++;
        if (source.pricing === 'free' || !source.requiresAuth) free++;
      });
      
      return {
        total: allSources.length,
        byType,
        byReliability,
        byPricing,
        authRequired,
        free
      };
    };
  }, []);

  // Validación
  const isValidSource = useCallback((sourceId: string): boolean => {
    return getDataSourceById(sourceId) !== undefined;
  }, []);

  const getSourceReliability = useCallback((sourceId: string): DataSource['reliability'] | null => {
    const source = getDataSourceById(sourceId);
    return source ? source.reliability : null;
  }, []);

  // Filtrado avanzado
  const filterSources = useCallback((filters: {
    type?: DataSource['type'][];
    reliability?: DataSource['reliability'][];
    pricing?: string[];
    requiresAuth?: boolean;
    searchTerm?: string;
  }) => {
    let sources = getAllDataSources();
    
    // Filtrar por tipo
    if (filters.type && filters.type.length > 0) {
      sources = sources.filter(source => filters.type!.includes(source.type));
    }
    
    // Filtrar por confiabilidad
    if (filters.reliability && filters.reliability.length > 0) {
      sources = sources.filter(source => filters.reliability!.includes(source.reliability));
    }
    
    // Filtrar por pricing
    if (filters.pricing && filters.pricing.length > 0) {
      sources = sources.filter(source => {
        const pricing = source.pricing || 'unknown';
        return filters.pricing!.includes(pricing);
      });
    }
    
    // Filtrar por autenticación
    if (filters.requiresAuth !== undefined) {
      sources = sources.filter(source => source.requiresAuth === filters.requiresAuth);
    }
    
    // Filtrar por término de búsqueda
    if (filters.searchTerm && filters.searchTerm.trim()) {
      const searchTerm = filters.searchTerm.toLowerCase().trim();
      sources = sources.filter(source => 
        source.name.toLowerCase().includes(searchTerm) ||
        source.description.toLowerCase().includes(searchTerm) ||
        source.dataTypes?.some(type => type.toLowerCase().includes(searchTerm)) ||
        source.features?.some(feature => feature.toLowerCase().includes(searchTerm))
      );
    }
    
    return sources;
  }, []);

  return {
    tooltipState,
    showTooltip,
    hideTooltip,
    toggleTooltip,
    getToolDataSources,
    getAllSources,
    getSourceById,
    getSourcesByType,
    getAuthSources,
    getFreeSources,
    getSourceStats,
    isValidSource,
    getSourceReliability,
    filterSources
  };
};

export default useDataSourceTooltips;