'use client';

import { useState, useEffect } from 'react';
import { useAnalysisNotifications } from '@/components/notifications/use-analysis-notifications';
import { getAllIndexers, type Indexer } from '@/utils/indexer-utils';

// Definición de tipos para el indexador
export interface IndexerData {
  id: string;
  name: string;
  description?: string | null;
  status: 'active' | 'inactive' | 'error' | 'pending';
  network: string;
  dataType: string[];
  lastRun?: Date | null;
  createdAt: Date;
}

export interface IndexerFormData {
  name: string;
  description: string;
  network: string;
  dataType: string[];
  filters?: string;
}

export interface IndexerQueryParams {
  network: string;
  address?: string;
  fromBlock?: number;
  toBlock?: number;
  fromTimestamp?: string; // Añadir esta propiedad
  toTimestamp?: string;   // Añadir esta propiedad
  dataType: string[];
}

export interface IndexerQueryResult<T> {
  data: T[];
  loading: boolean;
  error: string | null;
  pagination: {
    total: number;
    page: number;
    limit: number;
  };
}

/**
 * Hook personalizado para interactuar con el servicio de indexadores
 * Proporciona funciones para crear, gestionar y consultar datos de indexadores
 */
export function useIndexerService() {
  const [indexers, setIndexers] = useState<IndexerData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { notifyAnalysisStarted, notifyAnalysisCompleted, notifyAnalysisError } = useAnalysisNotifications();

  // Cargar los indexadores al inicializar el hook
  useEffect(() => {
    fetchIndexers();
  }, []);

  // Obtener todos los indexadores del usuario
  const fetchIndexers = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Usar datos mock en lugar de API para evitar errores de conexión
      const mockIndexers = getAllIndexers();
      
      // Transformar los datos mock al formato esperado por IndexerData
      const transformedIndexers: IndexerData[] = mockIndexers.map(indexer => ({
        id: indexer.id,
        name: indexer.name,
        description: indexer.description,
        status: indexer.status,
        network: indexer.network,
        dataType: indexer.dataType,
        lastRun: indexer.lastRun,
        createdAt: indexer.createdAt
      }));
      
      setIndexers(transformedIndexers);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido al cargar indexadores';
      setError(errorMessage);
      console.error('Error al cargar indexadores:', err);
    } finally {
      setLoading(false);
    }
  };

  // Crear un nuevo indexador
  const createIndexer = async (indexerData: IndexerFormData) => {
    setLoading(true);
    setError(null);
    notifyAnalysisStarted('Creación de Indexador');
    
    try {
      const response = await fetch('/api/indexers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(indexerData)
      });
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      const newIndexer = data.indexer;
      
      setIndexers(prev => [newIndexer, ...prev]);
      notifyAnalysisCompleted('Creación de Indexador', 100);
      return newIndexer;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido al crear indexador';
      setError(errorMessage);
      notifyAnalysisError('Creación de Indexador', errorMessage);
      console.error('Error al crear indexador:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Nota: Las funciones startIndexer y stopIndexer no están disponibles
  // en modo de exportación estática ya que requieren rutas de API dinámicas

  // Consultar datos indexados según parámetros
  const queryIndexedData = async <T>(params: IndexerQueryParams): Promise<IndexerQueryResult<T>> => {
    setLoading(true);
    setError(null);
    
    try {
      const queryString = new URLSearchParams(params as any).toString();
      const response = await fetch(`/api/indexed-data?${queryString}`);
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const result = await response.json();
      
      return {
        data: result.data || [],
        loading: false,
        error: null,
        pagination: result.pagination || {
          total: 0,
          page: 1,
          limit: 50,
        },
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido al consultar datos';
      setError(errorMessage);
      console.error('Error al consultar datos indexados:', err);
      
      return {
        data: [],
        loading: false,
        error: errorMessage,
        pagination: {
          total: 0,
          page: 1,
          limit: 10
        }
      };
    } finally {
      setLoading(false);
    }
  };

  // Obtener un indexador específico por ID
  const getIndexerById = (indexerId: string) => {
    return indexers.find(indexer => indexer.id === indexerId) || null;
  };

  // Filtrar indexadores por criterios
  const filterIndexers = (criteria: Partial<IndexerData>) => {
    return indexers.filter(indexer => {
      let match = true;
      
      if (criteria.network && indexer.network !== criteria.network) {
        match = false;
      }
      
      if (criteria.status && indexer.status !== criteria.status) {
        match = false;
      }
      
      if (criteria.dataType && criteria.dataType.length > 0) {
        const hasAllTypes = criteria.dataType.every(type => 
          indexer.dataType.includes(type)
        );
        if (!hasAllTypes) match = false;
      }
      
      return match;
    });
  };

  return {
    indexers,
    loading,
    error,
    fetchIndexers,
    createIndexer,
    queryIndexedData,
    getIndexerById,
    filterIndexers
  };
}