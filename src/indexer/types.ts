import { ethers } from 'ethers';

/**
 * Tipos de estado para los indexadores
 */
export type IndexerStatus = 'inactive' | 'active' | 'error';

/**
 * Tipos de estado para los trabajos de indexación
 */
export type JobStatus = 'pending' | 'running' | 'completed' | 'failed';

/**
 * Configuración para la sincronización de bloques
 */
export interface SyncConfig {
  fromBlock: number;
  toBlock: number;
  batchSize: number;
  concurrency: number;
}

/**
 * Interfaz para los eventos procesados
 */
export interface ProcessedEvent {
  address: string;
  eventName: string;
  blockNumber: number;
  transactionHash: string;
  logIndex: number;
  topics: string[];
  data: string;
  args?: Record<string, any>;
}

/**
 * Interfaz para los manejadores de eventos
 */
export interface EventHandler {
  canHandle(event: ProcessedEvent): boolean;
  handle(event: ProcessedEvent): Promise<void>;
}

/**
 * Interfaz para los parsers de eventos
 */
export interface EventParser {
  parse(log: any): ProcessedEvent | null;
}