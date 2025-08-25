'use client';

import { useState, useEffect, useCallback } from 'react';
// Temporalmente comentado para evitar errores de sintaxis
// import { initializeAppKit, getAppKit } from '@/config/wallet';
import { handleWalletError, retryWalletOperation, cleanupWalletState } from '@/utils/wallet-error-handler';

interface Web3SafeState {
  address: string | null;
  chainId: number | null;
  isConnected: boolean;
  isConnecting: boolean;
  balance: string | null;
}

export function useWeb3Safe() {
  const [state, setState] = useState<Web3SafeState>({
    address: null,
    chainId: null,
    isConnected: false,
    isConnecting: false,
    balance: null
  });
  
  const [isClient, setIsClient] = useState(false);

  // Establecer que estamos en el cliente
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Inicializar AppKit cuando estemos en el cliente (temporalmente deshabilitado)
  // useEffect(() => {
  //   if (!isClient) return;
  //   
  //   try {
  //     const result = initializeAppKit();
  //     if (!result) {
  //       console.warn('useWeb3Safe: AppKit initialization failed');
  //     }
  //   } catch (error) {
  //     console.error('useWeb3Safe: Error initializing AppKit:', error);
  //     // No propagar el error para evitar crash de la app
  //   }
  // }, [isClient]);

  // Función para conectar wallet con manejo de errores mejorado para móvil
  const connect = useCallback(async (): Promise<string | null> => {
    if (!isClient) {
      console.warn('useWeb3Safe: Not on client side');
      return null;
    }

    setState(prev => ({ ...prev, isConnecting: true }));
    
    // Sistema de wallet temporalmente deshabilitado
    console.log('useWeb3Safe: Sistema de wallet temporalmente deshabilitado');
    setState(prev => ({ ...prev, isConnecting: false }));
    throw new Error('Sistema de wallet temporalmente deshabilitado para evitar errores de sintaxis');
  }, [isClient]);

  // Función para desconectar wallet
  const disconnect = useCallback(async () => {
    if (!isClient) return;

    try {
      // Sistema de wallet temporalmente deshabilitado
      console.log('Disconnect: Sistema de wallet temporalmente deshabilitado');
      // const appKit = getAppKit();
      // if (appKit) {
      //   await appKit.disconnect();
      // }
      
      // Limpiar estado local
      setState({
        address: null,
        chainId: null,
        isConnected: false,
        isConnecting: false,
        balance: null
      });
      
      // Limpiar estado persistente
      cleanupWalletState();
      
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
      // Forzar limpieza de estado incluso si la desconexión falla
      setState({
        address: null,
        chainId: null,
        isConnected: false,
        isConnecting: false,
        balance: null
      });
      cleanupWalletState();
    }
  }, [isClient]);

  // Escuchar cambios de estado del AppKit (temporalmente deshabilitado)
  useEffect(() => {
    if (!isClient) return;

    console.log('AppKit state subscription temporalmente deshabilitado');
    
    // Código original comentado:
    // const appKit = getAppKit();
    // if (!appKit) return;
    //
    // let unsubscribe: (() => void) | null = null;
    // 
    // try {
    //   unsubscribe = appKit.subscribeState((newState: any) => {
    //     setState({
    //       address: newState.address || null,
    //       chainId: newState.chainId || null,
    //       isConnected: !!newState.address,
    //       isConnecting: false,
    //       balance: null
    //     });
    //   });
    // } catch (error) {
    //   console.warn('Failed to subscribe to AppKit state:', error);
    // }
  }, [isClient]);

  // Si no estamos en el cliente, devolver estado vacío
  if (!isClient) {
    return {
      address: null,
      chainId: null,
      isConnected: false,
      isConnecting: false,
      balance: null,
      connect: async () => null,
      disconnect: async () => {}
    };
  }

  return {
    ...state,
    connect,
    disconnect
  };
}