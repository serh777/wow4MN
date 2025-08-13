'use client';

import { useState, useEffect, useCallback } from 'react';
import { initializeAppKit, getAppKit } from '@/config/wallet';
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

  // Inicializar AppKit cuando estemos en el cliente
  useEffect(() => {
    if (!isClient) return;
    
    try {
      initializeAppKit();
    } catch (error) {
      console.error('Error initializing AppKit:', error);
    }
  }, [isClient]);

  // Función para conectar wallet con manejo de errores mejorado para móvil
  const connect = useCallback(async (): Promise<string | null> => {
    if (!isClient) {
      console.warn('useWeb3Safe: Not on client side');
      return null;
    }

    try {
      setState(prev => ({ ...prev, isConnecting: true }));
      
      const appKit = getAppKit();
      if (!appKit) {
        throw new Error('AppKit not initialized');
      }

      // Detectar si estamos en móvil
      const isMobile = typeof navigator !== 'undefined' ? /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) : false;
      
      // En móvil, intentar detectar wallets instaladas primero
      if (typeof window !== 'undefined' && (window as any).ethereum) {
        try {
          // Verificar si hay múltiples proveedores (EIP-6963)
          if ((window as any).ethereum.providers && Array.isArray((window as any).ethereum.providers)) {
            // Intentar con el primer proveedor disponible
            for (const provider of (window as any).ethereum.providers) {
              try {
                const accounts = await provider.request({ method: 'eth_requestAccounts' });
                if (accounts && accounts.length > 0) {
                  const address = accounts[0];
                  const chainId = await provider.request({ method: 'eth_chainId' });
                  
                  setState({
                    address,
                    chainId: parseInt(chainId, 16),
                    isConnected: true,
                    isConnecting: false,
                    balance: null
                  });
                  
                  return address;
                }
              } catch (providerError) {
                console.warn('Provider connection failed, trying next:', providerError);
                continue;
              }
            }
          } else {
            // Intentar con el proveedor principal
            const accounts = await (window as any).ethereum.request({
              method: 'eth_requestAccounts'
            });
            
            if (accounts && accounts.length > 0) {
              const address = accounts[0];
              const chainId = await (window as any).ethereum.request({
                method: 'eth_chainId'
              });
              
              setState({
                address,
                chainId: parseInt(chainId, 16),
                isConnected: true,
                isConnecting: false,
                balance: null
              });
              
              return address;
            }
          }
        } catch (directError) {
          console.warn('Direct wallet connection failed, falling back to AppKit:', directError);
        }
      }

      // Usar AppKit como fallback o método principal para desktop
      await appKit.open();
      
      // Esperar a que se conecte con timeout ajustado para móvil
      return new Promise((resolve, reject) => {
        // Timeout reducido para móvil (30s) o normal para desktop (45s)
        const timeoutDuration = isMobile ? 30000 : 45000;
        const timeout = setTimeout(() => {
          setState(prev => ({ ...prev, isConnecting: false }));
          reject(new Error(`Connection timeout after ${timeoutDuration / 1000} seconds - Please try again`));
        }, timeoutDuration);

        let unsubscribe: (() => void) | null = null;
        
        try {
          unsubscribe = appKit.subscribeState((newState: any) => {
            if (newState.address) {
              clearTimeout(timeout);
              setState({
                address: newState.address,
                chainId: newState.chainId || null,
                isConnected: true,
                isConnecting: false,
                balance: null
              });
              if (unsubscribe) unsubscribe();
              resolve(newState.address);
            }
          });
        } catch (subscriptionError) {
          console.error('Subscription error:', subscriptionError);
          clearTimeout(timeout);
          setState(prev => ({ ...prev, isConnecting: false }));
          reject(new Error('Failed to subscribe to wallet state'));
        }
        
        // Cleanup en caso de error
        setTimeout(() => {
          if (unsubscribe) {
            try {
              unsubscribe();
            } catch (cleanupError) {
              console.warn('Cleanup error:', cleanupError);
            }
          }
        }, timeoutDuration + 1000);
      });
    } catch (error) {
      console.error('Error connecting wallet:', error);
      setState(prev => ({ ...prev, isConnecting: false }));
      
      // Manejar error específico de wallet
      const errorInfo = handleWalletError(error);
      console.warn('Wallet connection error details:', errorInfo);
      
      // Si es un error de suscripción, limpiar estado
      if ((error as any)?.message?.includes('subscription') || (error as any)?.message?.includes('restore')) {
        cleanupWalletState();
      }
      
      throw new Error(errorInfo.message);
    }
  }, [isClient]);

  // Función para desconectar wallet
  const disconnect = useCallback(async () => {
    if (!isClient) return;

    try {
      const appKit = getAppKit();
      if (appKit) {
        await appKit.disconnect();
      }
      
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

  // Escuchar cambios de estado del AppKit
  useEffect(() => {
    if (!isClient) return;

    const appKit = getAppKit();
    if (!appKit) return;

    let unsubscribe: (() => void) | null = null;
    
    try {
      unsubscribe = appKit.subscribeState((newState: any) => {
        setState({
          address: newState.address || null,
          chainId: newState.chainId || null,
          isConnected: !!newState.address,
          isConnecting: false,
          balance: null
        });
      });
    } catch (error) {
      console.warn('Failed to subscribe to AppKit state:', error);
      // Reintentar suscripción después de un delay
      setTimeout(() => {
        try {
          const retryAppKit = getAppKit();
          if (retryAppKit && !unsubscribe) {
            unsubscribe = retryAppKit.subscribeState((newState: any) => {
              setState({
                address: newState.address || null,
                chainId: newState.chainId || null,
                isConnected: !!newState.address,
                isConnecting: false,
                balance: null
              });
            });
          }
        } catch (retryError) {
          console.error('Retry subscription failed:', retryError);
        }
      }, 2000);
    }

    return () => {
      if (unsubscribe) {
        try {
          unsubscribe();
        } catch (error) {
          console.warn('Error during unsubscribe:', error);
        }
      }
    };
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