'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { ethers } from 'ethers';
import { useAppKit } from '@reown/appkit/react';
import { 
  initializeAppKit,
  getAppKit,
  web3ModalConfig,
  checkNetworkConnectivity,
  retryWithBackoff,
  isMobileDevice
} from '@/config/wallet';
import { handleWalletError } from '@/utils/wallet-error-handler';

// Inicialización de AppKit solo en el cliente
if (typeof window !== 'undefined') {
  initializeAppKit();
}

interface Web3ContextType {
  address: string | null;
  chainId: number | null;
  isConnected: boolean;
  isConnecting: boolean;
  balance: string | null;
  provider: ethers.BrowserProvider | null;
  signer: ethers.JsonRpcSigner | null;
  connect: () => Promise<string | null>;
  disconnect: () => Promise<void>;
  switchNetwork: (chainId: number) => Promise<void>;
  getBalance: () => Promise<string | null>;
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

export function Web3Provider({ children }: { children: ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [balance, setBalance] = useState<string | null>(null);
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);
  
  // Estado para controlar la inicialización de AppKit
  const [isWeb3ModalInitialized, setIsWeb3ModalInitialized] = useState(
    typeof window !== 'undefined' && !!web3ModalConfig.projectId
  );

  // Hook de AppKit - se inicializará después de la hidratación
  const [appKitOpen, setAppKitOpen] = useState<(() => void) | null>(null);

  // Marcar como hidratado en el cliente e inicializar AppKit
  useEffect(() => {
    setIsHydrated(true);
    
    // Inicializar AppKit hook después de la hidratación
    if (typeof window !== 'undefined') {
      try {
        const appKit = getAppKit();
        if (appKit && appKit.open) {
          setAppKitOpen(() => appKit.open);
        }
      } catch (error) {
        console.warn('Error inicializando AppKit hook:', error);
      }
    }
  }, []);

  const disconnect = useCallback(async () => {
    try {
      // Limpiar listeners de eventos para evitar memory leaks
      // Limpiar listeners si existen
      if (isHydrated && typeof window !== 'undefined' && (window as any).ethereum) {
        try {
          const ethereum = (window as any).ethereum;
          if (ethereum.removeAllListeners) {
            ethereum.removeAllListeners();
          }
        } catch (error) {
          console.warn('Error limpiando listeners:', error);
        }
      }
      
      // Limpiar estado
      setAddress(null);
      setChainId(null);
      setIsConnected(false);
      setBalance(null);
      setProvider(null);
      setSigner(null);
      
      // Limpiar localStorage solo en el cliente hidratado
      if (isHydrated) {
        localStorage.removeItem('walletConnected');
        localStorage.removeItem('connectedWallet');
      }
      
      // Si hay un proveedor, intentar desconectar
      if (isHydrated && typeof window !== 'undefined' && window.ethereum) {
        try {
          // Algunos wallets soportan disconnect
          const ethereum = (window as any).ethereum;
          if (ethereum && ethereum.disconnect) {
            await ethereum.disconnect();
          }
        } catch (disconnectError) {
          console.warn('Error al desconectar wallet:', disconnectError);
          handleWalletError(disconnectError);
        }
      }
    } catch (error: any) {
      console.error('Error disconnecting wallet:', error);
      handleWalletError(error);
    }
  }, [isHydrated]);

  const getBalance = useCallback(async (): Promise<string | null> => {
    try {
      if (provider && address) {
        const balance = await provider.getBalance(address);
        const formattedBalance = ethers.formatEther(balance);
        setBalance(formattedBalance);
        return formattedBalance;
      }
      return null;
    } catch (error) {
      console.error('Error getting balance:', error);
      return null;
    }
  }, [provider, address]);

  const handleAccountsChanged = useCallback((accounts: string[]) => {
    if (accounts.length === 0) {
      disconnect();
    } else {
      setAddress(accounts[0]);
      getBalance();
    }
  }, [disconnect, getBalance]);

  const handleChainChanged = useCallback((chainId: string) => {
    setChainId(parseInt(chainId, 16));
    if (isHydrated && typeof window !== 'undefined') {
      window.location.reload(); // Recargar para evitar problemas de estado
    }
  }, [isHydrated]);

  const handleDisconnect = useCallback(() => {
    setAddress(null);
    setChainId(null);
    setIsConnected(false);
    setBalance(null);
    setProvider(null);
    setSigner(null);
  }, []);

  const checkConnection = useCallback(async () => {
    try {
      // Solo verificar conexión si el usuario había conectado previamente y estamos hidratados
      if (!isHydrated) return;
      
      const wasConnected = localStorage.getItem('walletConnected');
      if (!wasConnected) {
        return;
      }
      
      if (typeof window !== 'undefined' && (window as any).ethereum) {
        const ethereum = (window as any).ethereum;
        const accounts = await ethereum.request({ method: 'eth_accounts' });
        
        if (accounts.length > 0) {
          const provider = new ethers.BrowserProvider(ethereum);
          const signer = await provider.getSigner();
          const address = await signer.getAddress();
          const network = await provider.getNetwork();
          
          setAddress(address);
          setChainId(Number(network.chainId));
          setIsConnected(true);
          setProvider(provider);
          setSigner(signer);
          
          // Obtener balance
          const balance = await provider.getBalance(address);
          setBalance(ethers.formatEther(balance));
        }
      }
    } catch (error) {
      console.error('Error checking connection:', error);
    }
  }, [isHydrated]);

  const setupEventListeners = useCallback(() => {
    if (isHydrated && typeof window !== 'undefined' && (window as any).ethereum) {
      const ethereum = (window as any).ethereum;
      ethereum.on('accountsChanged', handleAccountsChanged);
      ethereum.on('chainChanged', handleChainChanged);
      ethereum.on('disconnect', handleDisconnect);
    }
  }, [isHydrated, handleAccountsChanged, handleChainChanged, handleDisconnect]);

  // Verificar conexión existente al cargar (solo si el usuario había conectado previamente)
  useEffect(() => {
    if (isHydrated) {
      checkConnection();
      setupEventListeners();
    }
  }, [isHydrated, checkConnection, setupEventListeners]);

  // Configurar listeners para conexión de wallet
   useEffect(() => {
     if (!isHydrated) return;
     
     // Listener para detectar cuando se conecta una wallet
     const handleWalletConnect = async () => {
       try {
         console.log('🌐 Web3Context: Wallet conectada detectada');
         
         // Verificar si hay un proveedor disponible
         if (typeof window !== 'undefined' && (window as any).ethereum) {
           const ethereum = (window as any).ethereum;
           const accounts = await ethereum.request({ method: 'eth_accounts' });
           
           if (accounts.length > 0) {
             const provider = new ethers.BrowserProvider(ethereum);
             const signer = await provider.getSigner();
             const address = await signer.getAddress();
             const network = await provider.getNetwork();
             
             setAddress(address);
             setChainId(Number(network.chainId));
             setIsConnected(true);
             setProvider(provider);
             setSigner(signer);
             
             // Obtener balance
             const balance = await provider.getBalance(address);
             setBalance(ethers.formatEther(balance));
             
             // Guardar en localStorage
             localStorage.setItem('walletConnected', 'true');
             
             console.log('🌐 Web3Context: Wallet conectada exitosamente:', address);
           }
         }
       } catch (error) {
         console.error('🌐 Web3Context: Error al manejar conexión de wallet:', error);
       }
     };
     
     // Agregar listeners para eventos de AppKit
     if (typeof window !== 'undefined') {
       window.addEventListener('walletconnect_session_update', handleWalletConnect);
       window.addEventListener('web3modal_provider_update', handleWalletConnect);
       
       // Cleanup
       return () => {
         window.removeEventListener('walletconnect_session_update', handleWalletConnect);
         window.removeEventListener('web3modal_provider_update', handleWalletConnect);
       };
     }
   }, [isHydrated]);

  const connect = async (): Promise<string | null> => {
    console.log('🌐 Web3Context: Iniciando conexión...');
    
    try {
      setIsConnecting(true);
      
      // Detectar si es dispositivo móvil
      const isMobile = isMobileDevice();
      console.log('Dispositivo móvil detectado:', isMobile);
      
      // Verificar conectividad de red primero
      console.log('🌐 Web3Context: Verificando conectividad...');
      const isOnline = await checkNetworkConnectivity();
      if (!isOnline) {
        throw new Error('Sin conexión a internet. Verifica tu conectividad.');
      }
      
      // En móviles, abrir el modal primero para mostrar opciones de WalletConnect
       if (isMobile) {
         console.log('Abriendo modal de AppKit para dispositivo móvil...');
         try {
            if (appKitOpen) {
              await appKitOpen();
              console.log('Modal de AppKit abierto');
            } else {
              throw new Error('AppKit no está disponible');
            }
           
           // Esperar a que se establezca la conexión
           await new Promise((resolve, reject) => {
             let attempts = 0;
             const maxAttempts = 30;
             
             const checkConnection = async () => {
               attempts++;
               
               if (typeof window !== 'undefined' && (window as any).ethereum) {
                 try {
                   const ethereum = (window as any).ethereum;
                   const accounts = await ethereum.request({ method: 'eth_accounts' });
                   
                   if (accounts.length > 0) {
                     console.log('Cuentas detectadas en móvil:', accounts);
                     resolve(accounts[0]);
                     return;
                   }
                 } catch (error) {
                   console.warn('Error verificando cuentas:', error);
                 }
               }
               
               if (attempts >= maxAttempts) {
                 reject(new Error('Timeout esperando conexión de wallet'));
                 return;
               }
               
               setTimeout(checkConnection, 1000);
             };
             
             checkConnection();
           });
         } catch (error) {
           console.error('Error abriendo modal AppKit:', error);
           throw new Error('No se pudo abrir el modal de selección de wallets');
         }
       }
      
      // Verificar si hay alguna cuenta ya conectada
      if (typeof window !== 'undefined' && (window as any).ethereum) {
        const ethereum = (window as any).ethereum;
        
        try {
          // Solicitar acceso a las cuentas
          const accounts = await ethereum.request({ 
            method: 'eth_requestAccounts',
            params: []
          });
          
          if (accounts.length === 0) {
            throw new Error('No se obtuvieron cuentas de la wallet');
          }
          
          console.log('🌐 Web3Context: Cuentas obtenidas:', accounts);
          
          // Crear proveedor y obtener información
          const provider = new ethers.BrowserProvider(ethereum);
          const signer = await provider.getSigner();
          const address = await signer.getAddress();
          const network = await provider.getNetwork();
          
          // Actualizar estado
          setAddress(address);
          setChainId(Number(network.chainId));
          setIsConnected(true);
          setProvider(provider);
          setSigner(signer);
          
          // Obtener balance
          const balance = await provider.getBalance(address);
          setBalance(ethers.formatEther(balance));
          
          // Guardar en localStorage solo si estamos hidratados
          if (isHydrated) {
            localStorage.setItem('walletConnected', 'true');
          }
          
          console.log('🌐 Web3Context: Conexión establecida exitosamente');
          console.log('🌐 Dirección:', address);
          console.log('🌐 Red:', Number(network.chainId));
          
          return address;
          
        } catch (error: any) {
          console.error('🌐 Web3Context: Error al conectar wallet:', error);
          
          if (error.code === 4001) {
            throw new Error('Conexión rechazada por el usuario');
          } else if (error.code === -32002) {
            throw new Error('Solicitud de conexión pendiente. Revisa tu wallet.');
          } else {
            throw new Error(error.message || 'Error desconocido al conectar wallet');
          }
        }
      } else {
        throw new Error('No se detectó ninguna wallet instalada');
      }
    } catch (error: any) {
      console.error('🌐 Web3Context: Error en connect():', error);
      handleWalletError(error);
      throw error;
    } finally {
      setIsConnecting(false);
    }
  };

  const switchNetwork = async (targetChainId: number): Promise<void> => {
    try {
      if (typeof window !== 'undefined' && (window as any).ethereum && provider) {
        const ethereum = (window as any).ethereum;
        
        // Convertir chainId a hexadecimal
        const chainIdHex = `0x${targetChainId.toString(16)}`;
        
        try {
          // Intentar cambiar a la red
          await ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: chainIdHex }],
          });
          
          // Actualizar chainId en el estado
          setChainId(targetChainId);
          
        } catch (switchError: any) {
          // Si la red no está agregada, agregarla
          if (switchError.code === 4902) {
            console.log('Red no encontrada, agregando...');
            
            // Configuración de redes (puedes expandir esto)
            let networkConfig;
            if (targetChainId === 137) { // Polygon
              networkConfig = {
                chainId: chainIdHex,
                chainName: 'Polygon Mainnet',
                nativeCurrency: {
                  name: 'MATIC',
                  symbol: 'MATIC',
                  decimals: 18
                },
                rpcUrls: ['https://polygon-rpc.com/'],
                blockExplorerUrls: ['https://polygonscan.com/']
              };
            } else {
              throw new Error(`Configuración de red no disponible para chainId ${targetChainId}`);
            }
            
            await ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [networkConfig],
            });
            
            setChainId(targetChainId);
          } else {
            throw switchError;
          }
        }
      } else {
        throw new Error('Proveedor Ethereum no disponible');
      }
    } catch (error: any) {
      console.error('Error switching network:', error);
      handleWalletError(error);
      throw error;
    }
  };

  return (
    <Web3Context.Provider value={{
      address,
      chainId,
      isConnected,
      isConnecting,
      balance,
      provider,
      signer,
      connect,
      disconnect,
      switchNetwork,
      getBalance
    }}>
      {children}
    </Web3Context.Provider>
  );
}

export function useWeb3() {
  const context = useContext(Web3Context);
  if (context === undefined) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
}