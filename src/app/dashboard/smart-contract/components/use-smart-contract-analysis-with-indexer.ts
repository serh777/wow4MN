'use client';

import { useState } from 'react';
import { useAnalysisNotifications } from '@/components/notifications/use-analysis-notifications';
import { useIndexerService, IndexerQueryParams } from '@/hooks/useIndexerService';
import type { AnalysisResult } from '@/types';

// Tipos específicos para el análisis de smart contracts con indexador
interface SmartContractAnalysisParams {
  contractAddress: string;
  network: string;
  includeEvents?: boolean;
  includeTransactions?: boolean;
  fromBlock?: number;
  toBlock?: number;
}

interface ContractEventData {
  name: string;
  signature: string;
  blockNumber: number;
  transactionHash: string;
  timestamp: Date;
  params: Record<string, any>;
}

interface ContractTransactionData {
  hash: string;
  from: string;
  to: string;
  value: string;
  gasUsed: number;
  timestamp: Date;
  method?: string;
  status: boolean;
}

export function useSmartContractAnalysisWithIndexer() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<AnalysisResult | null>(null);
  const { notifyAnalysisStarted, notifyAnalysisCompleted, notifyAnalysisError } = useAnalysisNotifications();
  const { queryIndexedData, filterIndexers } = useIndexerService();

  const handleSubmit = async (data: SmartContractAnalysisParams) => {
    setLoading(true);
    notifyAnalysisStarted('Análisis de Smart Contract');
    
    try {
      if (!data.contractAddress || data.contractAddress.trim() === '') {
        throw new Error('La dirección del contrato es obligatoria');
      }

      // Determinar qué tipos de datos necesitamos indexar
      const dataTypes: string[] = [];
      if (data.includeEvents) dataTypes.push('events');
      if (data.includeTransactions) dataTypes.push('transactions');
      
      // Si no se especifica ninguno, incluir ambos por defecto
      if (dataTypes.length === 0) {
        dataTypes.push('events', 'transactions');
      }

      // Verificar si existen indexadores adecuados para esta consulta
      const availableIndexers = filterIndexers({
        network: data.network,
        status: 'active',
        dataType: dataTypes
      });

      // Si no hay indexadores activos para esta red y tipos de datos, buscar inactivos
      if (availableIndexers.length === 0) {
        const inactiveIndexers = filterIndexers({
          network: data.network,
          dataType: dataTypes
        });

        // Nota: En modo de exportación estática, no se pueden iniciar indexadores automáticamente
        // ya que requiere rutas de API dinámicas que no están disponibles
        if (inactiveIndexers.length > 0) {
          notifyAnalysisError('Análisis de Smart Contract', 'Los indexadores deben iniciarse manualmente en modo de exportación estática');
          return;
        } else {
          // No hay indexadores configurados para esta consulta
          notifyAnalysisError('Análisis de Smart Contract', 'No hay indexadores disponibles para esta consulta');
          return;
        }
      }

      // Preparar parámetros de consulta para el indexador
      const queryParams: IndexerQueryParams = {
        network: data.network,
        address: data.contractAddress,
        fromBlock: data.fromBlock,
        toBlock: data.toBlock,
        dataType: dataTypes  // Add the missing dataType property
      };

      // Consultar eventos del contrato
      let events: ContractEventData[] = [];
      if (dataTypes.includes('events')) {
        const eventsResult = await queryIndexedData<ContractEventData>({
          ...queryParams,
          dataType: ['events']
        });
        events = eventsResult.data;
      }

      // Consultar transacciones del contrato
      let transactions: ContractTransactionData[] = [];
      if (dataTypes.includes('transactions')) {
        const txResult = await queryIndexedData<ContractTransactionData>({
          ...queryParams,
          dataType: ['transactions']
        });
        transactions = txResult.data;
      }

      // Analizar los eventos para identificar patrones y métricas
      // Filtrar eventos con nombres válidos y luego extraer tipos únicos
      const validEvents = events.filter(event => event && event.name);
      // Usar un enfoque compatible para obtener valores únicos sin usar Set spread operator
      const eventTypesMap: Record<string, boolean> = {};
      validEvents.forEach(event => {
        eventTypesMap[event.name] = true;
      });
      const eventTypes = Object.keys(eventTypesMap);
      // Calcular frecuencia de eventos de manera más eficiente
      const eventFrequency: Record<string, number> = {};
      eventTypes.forEach(type => {
        eventFrequency[type] = validEvents.filter(event => event.name === type).length;
      });

      // Analizar las transacciones para identificar patrones y métricas
      const methodCalls: Record<string, number> = {};
      const gasUsageByMethod: Record<string, number[]> = {};
      
      transactions.forEach(tx => {
        if (tx.method) {
          methodCalls[tx.method] = (methodCalls[tx.method] || 0) + 1;
          
          if (!gasUsageByMethod[tx.method]) {
            gasUsageByMethod[tx.method] = [];
          }
          gasUsageByMethod[tx.method].push(tx.gasUsed);
        }
      });

      // Calcular estadísticas de gas por método
      const gasStats: Record<string, { avg: number, min: number, max: number }> = {};
      Object.entries(gasUsageByMethod).forEach(([method, usages]) => {
        if (usages.length > 0) {
          gasStats[method] = {
            avg: usages.reduce((sum, val) => sum + val, 0) / usages.length,
            min: Math.min(...usages),
            max: Math.max(...usages)
          };
        }
      });

      // Generar resultados del análisis
      const contractData = {
        contractAddress: data.contractAddress,
        network: data.network,
        events,
        transactions,
        metrics: {
          totalEvents: events.length,
          totalTransactions: transactions.length,
          uniqueEventTypes: eventTypes.length,
          uniqueMethodCalls: Object.keys(methodCalls).length,
          failedTransactions: transactions.filter(tx => !tx.status).length,
          successRate: transactions.length > 0 ? 
            (transactions.filter(tx => tx.status).length / transactions.length) * 100 : 0
        },
        eventAnalysis: {
          types: eventTypes,
          frequency: eventFrequency
        },
        transactionAnalysis: {
          methodCalls,
          gasStats
        },
        recommendations: [
          // Recomendaciones basadas en el análisis
          'Optimizar los métodos con mayor consumo de gas',
          'Implementar eventos para operaciones críticas que actualmente no los emiten',
          'Revisar los patrones de uso para identificar posibles mejoras en la interfaz del contrato'
        ]
      };

      // Calcular puntuación basada en varios factores
      const score = Math.min(100, Math.floor(
        (contractData.metrics.uniqueEventTypes * 10 + 
         contractData.metrics.uniqueMethodCalls * 5 + 
         contractData.metrics.successRate * 0.5) / 10
      ));

      setResults({
        type: 'smart-contract',
        data: contractData,
        score
      });
      
      notifyAnalysisCompleted('Análisis de Smart Contract', score);
    } catch (error) {
      console.error('Error en análisis de smart contract:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      notifyAnalysisError('Análisis de Smart Contract', errorMessage);
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