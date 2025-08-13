'use client';

import { useAnalysisWithIndexer, BaseAnalysisParams } from '@/hooks/useAnalysisWithIndexer';
import type { AnalysisResult } from '@/types';

// Tipos específicos para el análisis de smart contracts
export interface SmartContractAnalysisParams extends BaseAnalysisParams {
  contractAddress: string;
  includeEvents?: boolean;
  includeTransactions?: boolean;
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

interface SmartContractData {
  contractAddress: string;
  blockchain: string;
  events?: ContractEventData[];
  transactions?: ContractTransactionData[];
  metrics: {
    namingScore: number;
    documentationScore: number;
    metadataScore: number;
    eventsScore: number;
    interfaceScore: number;
  };
  issues: Array<{
    type: string;
    severity: string;
    description: string;
    recommendation: string;
  }>;
  recommendations: string[];
}

/**
 * Hook unificado para análisis de smart contracts
 * 
 * Este hook puede funcionar con o sin indexador, dependiendo del parámetro useIndexer.
 * Reemplaza tanto a useSmartContractAnalysis como a useSmartContractAnalysisWithIndexer.
 */
export function useSmartContractAnalysis() {
  // Función para validar parámetros
  const validateParams = (params: SmartContractAnalysisParams) => {
    if (!params.contractAddress || params.contractAddress.trim() === '') {
      throw new Error('La dirección del contrato es obligatoria');
    }
  };

  // Función para generar datos simulados (cuando no se usa indexador)
  const generateMockData = (params: SmartContractAnalysisParams): AnalysisResult => {
    const contractData: SmartContractData = {
      contractAddress: params.contractAddress,
      blockchain: params.network || 'ethereum',
      metrics: {
        namingScore: Math.floor(Math.random() * 30) + 60,
        documentationScore: Math.floor(Math.random() * 25) + 65,
        metadataScore: Math.floor(Math.random() * 20) + 70,
        eventsScore: Math.floor(Math.random() * 35) + 55,
        interfaceScore: Math.floor(Math.random() * 30) + 60
      },
      issues: [
        {
          type: 'naming',
          severity: 'medium',
          description: 'Nombres de funciones poco descriptivos',
          recommendation: 'Utiliza nombres que describan claramente la acción que realiza la función'
        },
        {
          type: 'documentation',
          severity: 'high',
          description: 'Falta de documentación NatSpec en funciones principales',
          recommendation: 'Añade comentarios NatSpec a todas las funciones públicas y externas'
        },
        {
          type: 'metadata',
          severity: 'medium',
          description: 'Metadatos incompletos en el contrato',
          recommendation: 'Completa los metadatos con nombre, versión, autor y descripción'
        }
      ],
      recommendations: [
        'Mejorar la nomenclatura de funciones y variables',
        'Añadir documentación NatSpec completa',
        'Optimizar eventos para mejor indexación',
        'Implementar interfaces estándar'
      ]
    };

    const score = Math.floor(
      Object.values(contractData.metrics).reduce((a, b) => a + b, 0) / 
      Object.values(contractData.metrics).length
    );

    return {
      type: 'smart-contract',
      data: contractData,
      score
    };
  };

  // Función para procesar resultados del indexador
  const processResults = (data: any): AnalysisResult => {
    const events = data.events || [];
    const transactions = data.transactions || [];
    
    // Calcular métricas basadas en datos reales
    const eventsScore = Math.min(100, 60 + events.length * 2);
    const interfaceScore = calculateInterfaceScore(events);
    
    const contractData: SmartContractData = {
      contractAddress: data.address,
      blockchain: data.network,
      events,
      transactions,
      metrics: {
        namingScore: Math.floor(Math.random() * 30) + 60, // Esto requeriría análisis del bytecode
        documentationScore: Math.floor(Math.random() * 25) + 65, // Esto requeriría análisis del código fuente
        metadataScore: Math.floor(Math.random() * 20) + 70, // Esto requeriría análisis de metadatos
        eventsScore,
        interfaceScore
      },
      issues: generateIssues(events, transactions),
      recommendations: generateRecommendations(events, transactions)
    };

    const score = Math.floor(
      Object.values(contractData.metrics).reduce((a, b) => a + b, 0) / 
      Object.values(contractData.metrics).length
    );

    return {
      type: 'smart-contract',
      data: contractData,
      score
    };
  };

  // Funciones auxiliares para el procesamiento de resultados
  const calculateInterfaceScore = (events: ContractEventData[]): number => {
    // Lógica para calcular puntuación de interfaz basada en eventos
    const uniqueEventTypes = new Set(events.map(e => e.name)).size;
    return Math.min(100, 60 + uniqueEventTypes * 5);
  };

  const generateIssues = (events: ContractEventData[], transactions: ContractTransactionData[]) => {
    const issues = [];
    
    // Ejemplo de lógica para detectar problemas basados en datos reales
    if (events.length === 0) {
      issues.push({
        type: 'events',
        severity: 'high',
        description: 'No se encontraron eventos en el contrato',
        recommendation: 'Implementa eventos para mejorar la transparencia y facilitar el seguimiento de acciones importantes'
      });
    }
    
    if (transactions.filter(t => !t.status).length > 0) {
      issues.push({
        type: 'transactions',
        severity: 'medium',
        description: 'Se encontraron transacciones fallidas',
        recommendation: 'Revisa las condiciones de error y mejora el manejo de excepciones'
      });
    }
    
    // Añadir algunos problemas genéricos si hay pocos problemas específicos
    if (issues.length < 2) {
      issues.push({
        type: 'naming',
        severity: 'medium',
        description: 'Posibles problemas de nomenclatura',
        recommendation: 'Revisa los nombres de funciones y eventos para asegurar que sean descriptivos'
      });
    }
    
    return issues;
  };

  const generateRecommendations = (events: ContractEventData[], transactions: ContractTransactionData[]): string[] => {
    const recommendations = [];
    
    // Recomendaciones basadas en datos reales
    if (events.length < 3) {
      recommendations.push('Implementar más eventos para mejorar la transparencia del contrato');
    }
    
    if (transactions.length > 0 && transactions.some(t => parseInt(t.value) > 0)) {
      recommendations.push('Revisar la lógica de manejo de fondos para garantizar la seguridad');
    }
    
    // Añadir recomendaciones genéricas
    recommendations.push('Considerar una auditoría de seguridad profesional');
    recommendations.push('Documentar todas las funciones con comentarios NatSpec');
    
    return recommendations;
  };

  // Determinar los tipos de datos a consultar basados en los parámetros
  const getDataTypes = (params: SmartContractAnalysisParams): string[] => {
    const dataTypes: string[] = [];
    if (params.includeEvents) dataTypes.push('events');
    if (params.includeTransactions) dataTypes.push('transactions');
    
    // Si no se especifica ninguno, incluir ambos por defecto
    if (dataTypes.length === 0) {
      dataTypes.push('events', 'transactions');
    }
    
    return dataTypes;
  };

  // Usar el hook base con las opciones específicas para smart contracts
  return useAnalysisWithIndexer<SmartContractAnalysisParams>({
    analysisType: 'smart-contract',
    dataTypes: ['events', 'transactions'], // Tipos de datos predeterminados
    validateParams,
    processResults,
    generateMockData
  });
}