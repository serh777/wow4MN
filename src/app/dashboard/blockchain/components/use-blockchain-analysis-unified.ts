'use client';

import { useAnalysisWithIndexer, BaseAnalysisParams } from '@/hooks/useAnalysisWithIndexer';
import type { AnalysisResult } from '@/types';

// Tipos específicos para el análisis de blockchain
export interface BlockchainAnalysisParams extends BaseAnalysisParams {
  blockchainId?: string;
  startBlock?: number;
  endBlock?: number;
  includeTransactions?: boolean;
  includeBlocks?: boolean;
  includeEvents?: boolean;
}

interface BlockData {
  number: number;
  hash: string;
  timestamp: Date;
  gasUsed: number;
  gasLimit: number;
  difficulty?: number;
  miner?: string;
  transactionCount: number;
}

interface TransactionData {
  hash: string;
  blockNumber: number;
  from: string;
  to: string;
  value: string;
  gasUsed: number;
  timestamp: Date;
  status: boolean;
}

interface EventData {
  address: string;
  blockNumber: number;
  transactionHash: string;
  event: string;
  timestamp: Date;
  params?: Record<string, any>;
}

interface BlockchainData {
  blockchainId: string;
  network: string;
  blocks?: BlockData[];
  transactions?: TransactionData[];
  events?: EventData[];
  metrics: {
    tps: number; // Transacciones por segundo
    avgBlockTime: number; // Tiempo promedio entre bloques en segundos
    avgGasUsed: number; // Uso promedio de gas
    avgTransactionsPerBlock: number; // Promedio de transacciones por bloque
    successRate: number; // Tasa de éxito de transacciones (porcentaje)
  };
  recommendations: string[];
}

/**
 * Hook unificado para análisis de blockchain
 * 
 * Este hook puede funcionar con o sin indexador, dependiendo del parámetro useIndexer.
 */
export function useBlockchainAnalysis() {
  // Función para validar parámetros
  const validateParams = (params: BlockchainAnalysisParams) => {
    if (!params.network || params.network.trim() === '') {
      throw new Error('La red blockchain es obligatoria');
    }
  };

  // Función para generar datos simulados (cuando no se usa indexador)
  const generateMockData = (params: BlockchainAnalysisParams): AnalysisResult => {
    const blockchainData: BlockchainData = {
      blockchainId: params.blockchainId || params.network,
      network: params.network,
      metrics: {
        tps: Math.random() * 15 + 5,
        avgBlockTime: Math.random() * 10 + 2,
        avgGasUsed: Math.floor(Math.random() * 5000000) + 2000000,
        avgTransactionsPerBlock: Math.floor(Math.random() * 100) + 50,
        successRate: Math.random() * 10 + 90 // 90-100%
      },
      recommendations: [
        'Optimizar el tamaño de las transacciones para reducir costos de gas',
        'Considerar implementar soluciones de capa 2 para mayor escalabilidad',
        'Monitorear picos de congestión de la red para planificar transacciones',
        'Evaluar el uso de contratos más eficientes en gas'
      ]
    };

    // Generar bloques simulados si se solicitan
    if (params.includeBlocks) {
      blockchainData.blocks = generateMockBlocks(params);
    }

    // Generar transacciones simuladas si se solicitan
    if (params.includeTransactions) {
      blockchainData.transactions = generateMockTransactions(params);
    }

    // Generar eventos simulados si se solicitan
    if (params.includeEvents) {
      blockchainData.events = generateMockEvents(params);
    }

    // Calcular puntuación general basada en métricas
    const score = calculateScore(blockchainData.metrics);

    return {
      type: 'blockchain',
      data: blockchainData,
      score
    };
  };

  // Funciones auxiliares para generar datos simulados
  const generateMockBlocks = (params: BlockchainAnalysisParams): BlockData[] => {
    const blocks: BlockData[] = [];
    const blockCount = Math.floor(Math.random() * 20) + 10; // 10-30 bloques
    const startBlock = params.startBlock || 10000000;
    
    for (let i = 0; i < blockCount; i++) {
      const blockNumber = startBlock + i;
      const timestamp = new Date();
      timestamp.setMinutes(timestamp.getMinutes() - (blockCount - i) * 2);
      const transactionCount = Math.floor(Math.random() * 100) + 20;
      
      blocks.push({
        number: blockNumber,
        hash: `0x${Math.random().toString(16).substring(2, 66)}`,
        timestamp,
        gasUsed: Math.floor(Math.random() * 8000000) + 2000000,
        gasLimit: 15000000,
        difficulty: params.network.toLowerCase() === 'ethereum' ? Math.floor(Math.random() * 1000000) + 2000000 : undefined,
        miner: `0x${Math.random().toString(16).substring(2, 42)}`,
        transactionCount
      });
    }
    
    return blocks;
  };

  const generateMockTransactions = (params: BlockchainAnalysisParams): TransactionData[] => {
    const transactions: TransactionData[] = [];
    const txCount = Math.floor(Math.random() * 50) + 30; // 30-80 transacciones
    const startBlock = params.startBlock || 10000000;
    
    for (let i = 0; i < txCount; i++) {
      const blockNumber = startBlock + Math.floor(Math.random() * 20);
      const timestamp = new Date();
      timestamp.setMinutes(timestamp.getMinutes() - Math.floor(Math.random() * 60));
      
      transactions.push({
        hash: `0x${Math.random().toString(16).substring(2, 66)}`,
        blockNumber,
        from: `0x${Math.random().toString(16).substring(2, 42)}`,
        to: `0x${Math.random().toString(16).substring(2, 42)}`,
        value: (Math.random() * 2).toFixed(18),
        gasUsed: Math.floor(Math.random() * 100000) + 21000,
        timestamp,
        status: Math.random() > 0.05 // 5% de probabilidad de fallo
      });
    }
    
    return transactions;
  };

  const generateMockEvents = (params: BlockchainAnalysisParams): EventData[] => {
    const events: EventData[] = [];
    const eventCount = Math.floor(Math.random() * 40) + 20; // 20-60 eventos
    const startBlock = params.startBlock || 10000000;
    const eventTypes = ['Transfer', 'Approval', 'Swap', 'Mint', 'Burn', 'Deposit', 'Withdraw'];
    
    for (let i = 0; i < eventCount; i++) {
      const blockNumber = startBlock + Math.floor(Math.random() * 20);
      const timestamp = new Date();
      timestamp.setMinutes(timestamp.getMinutes() - Math.floor(Math.random() * 60));
      const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
      
      events.push({
        address: `0x${Math.random().toString(16).substring(2, 42)}`,
        blockNumber,
        transactionHash: `0x${Math.random().toString(16).substring(2, 66)}`,
        event: eventType,
        timestamp,
        params: generateEventParams(eventType)
      });
    }
    
    return events;
  };

  const generateEventParams = (eventType: string): Record<string, any> => {
    switch (eventType) {
      case 'Transfer':
        return {
          from: `0x${Math.random().toString(16).substring(2, 42)}`,
          to: `0x${Math.random().toString(16).substring(2, 42)}`,
          value: (Math.random() * 100).toFixed(18)
        };
      case 'Approval':
        return {
          owner: `0x${Math.random().toString(16).substring(2, 42)}`,
          spender: `0x${Math.random().toString(16).substring(2, 42)}`,
          value: (Math.random() * 1000).toFixed(18)
        };
      case 'Swap':
        return {
          sender: `0x${Math.random().toString(16).substring(2, 42)}`,
          amount0In: (Math.random() * 10).toFixed(18),
          amount1In: (Math.random() * 10).toFixed(18),
          amount0Out: (Math.random() * 10).toFixed(18),
          amount1Out: (Math.random() * 10).toFixed(18),
          to: `0x${Math.random().toString(16).substring(2, 42)}`
        };
      default:
        return {
          user: `0x${Math.random().toString(16).substring(2, 42)}`,
          amount: (Math.random() * 50).toFixed(18)
        };
    }
  };

  // Función para calcular puntuación general
  const calculateScore = (metrics: BlockchainData['metrics']): number => {
    // Ponderaciones para cada métrica
    const weights = {
      tps: 0.25,
      avgBlockTime: 0.15,
      avgGasUsed: 0.15,
      avgTransactionsPerBlock: 0.2,
      successRate: 0.25
    };
    
    // Normalizar cada métrica a una escala de 0-100
    const normalizedScores = {
      tps: Math.min(100, metrics.tps * 5), // Asumiendo que 20 TPS es excelente
      avgBlockTime: Math.max(0, 100 - metrics.avgBlockTime * 10), // Menor tiempo de bloque es mejor
      avgGasUsed: Math.max(0, 100 - (metrics.avgGasUsed / 15000000) * 100), // Menor uso de gas es mejor
      avgTransactionsPerBlock: Math.min(100, metrics.avgTransactionsPerBlock / 2), // Más transacciones por bloque es mejor
      successRate: metrics.successRate // Ya está en porcentaje
    };
    
    // Calcular puntuación ponderada
    let weightedScore = 0;
    for (const [key, weight] of Object.entries(weights)) {
      weightedScore += normalizedScores[key as keyof typeof normalizedScores] * weight;
    }
    
    return Math.round(weightedScore);
  };

  // Función para procesar resultados del indexador
  const processResults = (data: any): AnalysisResult => {
    const blocks = data.blocks || [];
    const transactions = data.transactions || [];
    const events = data.events || [];
    
    // Calcular métricas basadas en datos reales
    const metrics = calculateMetrics(blocks, transactions);
    
    const blockchainData: BlockchainData = {
      blockchainId: data.blockchainId || data.network,
      network: data.network,
      blocks,
      transactions,
      events,
      metrics,
      recommendations: generateRecommendations(blocks, transactions, events, metrics)
    };

    // Calcular puntuación general
    const score = calculateScore(metrics);

    return {
      type: 'blockchain',
      data: blockchainData,
      score
    };
  };

  // Funciones auxiliares para el procesamiento de resultados
  const calculateMetrics = (blocks: BlockData[], transactions: TransactionData[]): BlockchainData['metrics'] => {
    // Valores predeterminados en caso de datos insuficientes
    if (blocks.length < 2) {
      return {
        tps: 0,
        avgBlockTime: 0,
        avgGasUsed: 0,
        avgTransactionsPerBlock: 0,
        successRate: 100
      };
    }
    
    // Ordenar bloques por número
    const sortedBlocks = [...blocks].sort((a, b) => a.number - b.number);
    
    // Calcular tiempo promedio entre bloques
    let totalBlockTime = 0;
    for (let i = 1; i < sortedBlocks.length; i++) {
      const timeDiff = sortedBlocks[i].timestamp.getTime() - sortedBlocks[i-1].timestamp.getTime();
      totalBlockTime += timeDiff / 1000; // Convertir a segundos
    }
    const avgBlockTime = totalBlockTime / (sortedBlocks.length - 1);
    
    // Calcular uso promedio de gas
    const avgGasUsed = blocks.reduce((sum, block) => sum + block.gasUsed, 0) / blocks.length;
    
    // Calcular promedio de transacciones por bloque
    const avgTransactionsPerBlock = blocks.reduce((sum, block) => sum + block.transactionCount, 0) / blocks.length;
    
    // Calcular tasa de éxito de transacciones
    const successfulTxs = transactions.filter(tx => tx.status).length;
    const successRate = transactions.length > 0 ? (successfulTxs / transactions.length) * 100 : 100;
    
    // Calcular TPS (transacciones por segundo)
    const totalTxs = blocks.reduce((sum, block) => sum + block.transactionCount, 0);
    const timeSpanSeconds = (sortedBlocks[sortedBlocks.length - 1].timestamp.getTime() - 
                           sortedBlocks[0].timestamp.getTime()) / 1000;
    const tps = timeSpanSeconds > 0 ? totalTxs / timeSpanSeconds : 0;
    
    return {
      tps,
      avgBlockTime,
      avgGasUsed,
      avgTransactionsPerBlock,
      successRate
    };
  };

  const generateRecommendations = (
    blocks: BlockData[], 
    transactions: TransactionData[], 
    events: EventData[],
    metrics: BlockchainData['metrics']
  ): string[] => {
    const recommendations: string[] = [];
    
    // Recomendaciones basadas en métricas
    if (metrics.avgGasUsed > 10000000) {
      recommendations.push('Optimizar el uso de gas en las transacciones');
    }
    
    if (metrics.avgBlockTime > 15) {
      recommendations.push('Considerar el uso de redes más rápidas para aplicaciones que requieren baja latencia');
    }
    
    if (metrics.successRate < 95) {
      recommendations.push('Investigar las causas de las transacciones fallidas para mejorar la tasa de éxito');
    }
    
    // Recomendaciones basadas en patrones de transacciones
    const highValueTxs = transactions.filter(tx => parseFloat(tx.value) > 10).length;
    if (highValueTxs > 0) {
      recommendations.push('Implementar medidas de seguridad adicionales para transacciones de alto valor');
    }
    
    // Recomendaciones generales
    recommendations.push('Monitorear picos de congestión de la red para planificar transacciones');
    recommendations.push('Evaluar el uso de contratos más eficientes en gas');
    
    if (recommendations.length < 3) {
      recommendations.push('Considerar implementar soluciones de capa 2 para mayor escalabilidad');
    }
    
    return recommendations;
  };

  // Determinar los tipos de datos a consultar basados en los parámetros
  const getDataTypes = (params: BlockchainAnalysisParams): string[] => {
    const dataTypes: string[] = [];
    if (params.includeBlocks) dataTypes.push('blocks');
    if (params.includeTransactions) dataTypes.push('transactions');
    if (params.includeEvents) dataTypes.push('events');
    
    // Si no se especifica ninguno, incluir bloques y transacciones por defecto
    if (dataTypes.length === 0) {
      dataTypes.push('blocks', 'transactions');
    }
    
    return dataTypes;
  };

  // Usar el hook base con las opciones específicas para blockchain
  return useAnalysisWithIndexer<BlockchainAnalysisParams>({
    analysisType: 'blockchain',
    dataTypes: ['blocks', 'transactions', 'events'], // Tipos de datos predeterminados
    validateParams,
    processResults,
    generateMockData
  });
}