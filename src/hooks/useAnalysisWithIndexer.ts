'use client';

import { useState } from 'react';
import { useAnalysisNotifications } from '@/components/notifications/use-analysis-notifications';
import { useIndexerService, IndexerQueryParams } from '@/hooks/useIndexerService';
import type { AnalysisResult } from '@/types';

// Interfaz base para parámetros de análisis
export interface BaseAnalysisParams {
  network: string;
  address?: string;
  fromBlock?: number;
  toBlock?: number;
  fromTimestamp?: Date;
  toTimestamp?: Date;
  useIndexer?: boolean; // Parámetro para determinar si usar el indexador o no
}

// Opciones para el hook de análisis
export interface AnalysisOptions {
  analysisType: string; // Tipo de análisis (blockchain, smart-contract, wallet, social-web3)
  dataTypes: string[]; // Tipos de datos a consultar (events, transactions, social-activity, etc.)
  validateParams?: (params: any) => void; // Función opcional para validar parámetros
  processResults?: (data: any) => AnalysisResult; // Función opcional para procesar resultados
  generateMockData?: (params: any) => AnalysisResult; // Función opcional para generar datos simulados
}

/**
 * Hook base para análisis con o sin indexador
 * 
 * Este hook maneja la lógica común de todos los hooks de análisis:
 * - Estados para loading y results
 * - Notificaciones de análisis
 * - Verificación de indexadores disponibles
 * - Inicialización de indexadores inactivos
 * - Consulta de datos indexados
 * - Procesamiento de resultados
 */
export function useAnalysisWithIndexer<T extends BaseAnalysisParams, R = any>(options: AnalysisOptions) {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<AnalysisResult | null>(null);
  const { notifyAnalysisStarted, notifyAnalysisCompleted, notifyAnalysisError } = useAnalysisNotifications();
  const { queryIndexedData, filterIndexers } = useIndexerService();

  const handleSubmit = async (params: T) => {
    setLoading(true);
    notifyAnalysisStarted(`Análisis de ${options.analysisType}`);
    
    try {
      // Validación personalizada de parámetros si se proporciona
      if (options.validateParams) {
        options.validateParams(params);
      }

      // Si useIndexer es false o no está definido y hay una función para generar datos simulados,
      // usar datos simulados en lugar de consultar el indexador
      if (params.useIndexer === false && options.generateMockData) {
        const mockResults = options.generateMockData(params);
        setResults(mockResults);
        notifyAnalysisCompleted(`Análisis de ${options.analysisType}`, mockResults.score);
        setLoading(false);
        return;
      }

      // Verificar si existen indexadores adecuados para esta consulta
      const availableIndexers = filterIndexers({
        network: params.network,
        status: 'active',
        dataType: options.dataTypes
      });

      // Si no hay indexadores activos para esta red y tipos de datos, buscar inactivos
      if (availableIndexers.length === 0) {
        const inactiveIndexers = filterIndexers({
          network: params.network,
          dataType: options.dataTypes
        });

        // Nota: En modo de exportación estática, no se pueden iniciar indexadores automáticamente
        // ya que requiere rutas de API dinámicas que no están disponibles
        if (inactiveIndexers.length > 0) {
          notifyAnalysisError(`Análisis de ${options.analysisType}`, 'Los indexadores deben iniciarse manualmente en modo de exportación estática');
          return;
        } else {
          // No hay indexadores configurados para esta consulta
          notifyAnalysisError(`Análisis de ${options.analysisType}`, 'No hay indexadores disponibles para esta consulta');
          return;
        }
      }

      // Preparar parámetros de consulta para el indexador
      const queryParams: IndexerQueryParams = {
        network: params.network,
        address: params.address,
        fromBlock: params.fromBlock,
        toBlock: params.toBlock,
        // Convertir Date a string ISO para compatibilidad con el indexador
        fromTimestamp: params.fromTimestamp ? params.fromTimestamp.toISOString() : undefined,
        toTimestamp: params.toTimestamp ? params.toTimestamp.toISOString() : undefined,
        dataType: options.dataTypes
      };

      // Consultar datos indexados
      const data = await queryIndexedData<R>(queryParams);

      // Procesar resultados si se proporciona una función de procesamiento
      let processedResults: AnalysisResult;
      if (options.processResults) {
        processedResults = options.processResults(data);
      } else {
        // Procesamiento básico si no se proporciona una función específica
        const score = 70; // Puntuación predeterminada
        processedResults = {
          type: options.analysisType,
          data,
          score
        };
      }

      setResults(processedResults);
      notifyAnalysisCompleted(`Análisis de ${options.analysisType}`, processedResults.score);
    } catch (error) {
      console.error(`Error en análisis de ${options.analysisType}:`, error);
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      notifyAnalysisError(`Análisis de ${options.analysisType}`, errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    results,
    handleSubmit
  };
}