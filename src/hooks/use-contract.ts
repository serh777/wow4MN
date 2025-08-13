'use client';

import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { contractService, ContractService } from '@/services/contract-service';
import { TOOL_NAMES_TO_IDS } from '@/config/contract-config';

interface UseContractReturn {
  isInitialized: boolean;
  isConnecting: boolean;
  error: string | null;
  initialize: () => Promise<boolean>;
  getToolsPrice: (toolNames: string[], tokenAddress?: string) => Promise<{
    totalPriceBeforeDiscount: bigint;
    finalPrice: bigint;
    isCompleteAuditOffer: boolean;
    formattedTotalPrice: string;
    formattedFinalPrice: string;
  } | null>;
  payForTools: (toolNames: string[], tokenAddress?: string) => Promise<{
    success: boolean;
    transactionHash?: string;
    error?: string;
  }>;
  emitToolAction: (
    toolName: string,
    actionType: string,
    resourceId: string,
    metadataURI?: string
  ) => Promise<{
    success: boolean;
    transactionHash?: string;
    error?: string;
  }>;
  isToolSupported: (toolName: string) => boolean;
}

/**
 * Hook para interactuar con el contrato inteligente DashboardToolsContract
 */
export function useContract(): UseContractReturn {
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Inicializar el servicio del contrato
  const initialize = useCallback(async (): Promise<boolean> => {
    try {
      setIsConnecting(true);
      setError(null);
      const success = await contractService.initialize();
      setIsInitialized(success);
      if (!success) {
        console.warn('Contract initialization failed, but allowing basic functionality');
        setError(null); // No mostrar error para funcionalidad básica
        setIsInitialized(true); // Permitir funcionalidad básica sin MetaMask
        return true;
      }
      return success;
    } catch (err: any) {
      console.warn('Contract initialization failed, but allowing basic functionality:', err.message);
      setError(null); // No mostrar error para funcionalidad básica
      setIsInitialized(true); // Permitir funcionalidad básica sin MetaMask
      return true;
    } finally {
      setIsConnecting(false);
    }
  }, []);

  // Auto-inicializar el contrato al montar el componente
  useEffect(() => {
    initialize();
  }, [initialize]);

  // Obtener el precio de las herramientas
  const getToolsPrice = useCallback(async (toolNames: string[], tokenAddress?: string) => {
    try {
      setError(null);
      if (!isInitialized) {
        const success = await initialize();
        if (!success) return null;
      }

      const result = await contractService.getToolsPrice(toolNames, tokenAddress);
      if (!result) return null;

      // Formatear los precios para mostrarlos en la UI (18 decimales)
      return {
        ...result,
        formattedTotalPrice: formatPrice(result.totalPriceBeforeDiscount),
        formattedFinalPrice: formatPrice(result.finalPrice)
      };
    } catch (err: any) {
      setError(err.message || 'Error al obtener el precio de las herramientas');
      return null;
    }
  }, [isInitialized, initialize]);

  // Pagar por las herramientas
  const payForTools = useCallback(async (toolNames: string[], tokenAddress?: string) => {
    try {
      setError(null);
      if (!isInitialized) {
        const success = await initialize();
        if (!success) {
          return { success: false, error: 'No se pudo inicializar el contrato' };
        }
      }

      return await contractService.payForTools(toolNames, tokenAddress);
    } catch (err: any) {
      setError(err.message || 'Error al pagar por las herramientas');
      return { success: false, error: err.message || 'Error desconocido' };
    }
  }, [isInitialized, initialize]);

  // Emitir una acción de herramienta
  const emitToolAction = useCallback(async (
    toolName: string,
    actionType: string,
    resourceId: string,
    metadataURI: string = ''
  ) => {
    try {
      setError(null);
      if (!isInitialized) {
        const success = await initialize();
        if (!success) {
          return { success: false, error: 'No se pudo inicializar el contrato' };
        }
      }

      return await contractService.emitToolAction(toolName, actionType, resourceId, metadataURI);
    } catch (err: any) {
      setError(err.message || 'Error al emitir acción de herramienta');
      return { success: false, error: err.message || 'Error desconocido' };
    }
  }, [isInitialized, initialize]);

  // Verificar si una herramienta está soportada
  const isToolSupported = useCallback((toolName: string): boolean => {
    return !!TOOL_NAMES_TO_IDS[toolName];
  }, []);

  // Formatear precio de bigint a string con 2 decimales
  const formatPrice = (price: bigint): string => {
    // Usar ethers para formatear el precio
    return ethers.formatEther(price);
  };

  return {
    isInitialized,
    isConnecting,
    error,
    initialize,
    getToolsPrice,
    payForTools,
    emitToolAction,
    isToolSupported
  };
}