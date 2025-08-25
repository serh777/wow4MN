/**
 * Configuración de WalletConnect y AppKit - Archivo de compatibilidad
 * 
 * Este archivo mantiene la compatibilidad con el código existente
 * mientras redirige a la nueva configuración modular.
 */

// Importar desde la nueva configuración modular
export {
  // Configuraciones principales
  supportedNetworks as networks,
  defaultNetwork,
  appMetadata as metadata,
  // ethersAdapter, // Temporalmente comentado
  mobileWalletIds,
  
  // Funciones de AppKit
  initializeAppKit,
  getAppKit,
  cleanupAppKit,
  
  // Configuraciones móviles
  isMobileDevice,
  mobileTimeouts,
  mobileRetryConfig,
  
  // Configuración legacy
  web3ModalConfig,
  
  // Sistema completo
  initializeWalletSystem,
  cleanupWalletSystem,
  walletConfig
} from './wallet';

// Importar utilidades de manejo de errores
import { handleWalletError } from '../utils/wallet-error-handler';

// Re-exportar función de manejo de errores
export { handleWalletError };

// Función para verificar conectividad de red
export const checkNetworkConnectivity = async (): Promise<boolean> => {
  try {
    const response = await fetch('https://api.github.com/zen', {
      method: 'GET',
      cache: 'no-cache',
      signal: AbortSignal.timeout(5000)
    });
    return response.ok;
  } catch {
    return false;
  }
};

// Función de reintento con backoff exponencial
export const retryWithBackoff = async (
  fn: () => Promise<any>,
  maxAttempts: number = 3,
  baseDelay: number = 1000
): Promise<any> => {
  let lastError: any;
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      if (attempt === maxAttempts) {
        throw lastError;
      }
      
      const delay = baseDelay * Math.pow(2, attempt - 1);
      console.log(`Intento ${attempt} falló, reintentando en ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError;
};

// Funciones legacy para compatibilidad
export const getMobileEthersConfig = () => {
  console.warn('getMobileEthersConfig está deprecado. Usa la nueva configuración modular.');
  return {
    metadata: {
      name: 'WowSEOWeb3',
      description: 'Herramientas SEO para Web3',
      url: process.env.NEXT_PUBLIC_SITE_URL || 'https://wowseoweb3.com',
      icons: ['https://wowseoweb3.com/logo.svg']
    },
    enableEIP6963: true,
    enableInjected: true,
    enableCoinbase: false, // Temporalmente deshabilitado para evitar errores de sintaxis
    defaultChainId: 1,
    auth: {
      socials: [],
      showWallets: true
    }
  };
};

export const getMobileWalletConfig = () => {
  console.warn('getMobileWalletConfig está deprecado. Usa la nueva configuración modular.');
  return {
    mobileWalletIds: [
      'c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96',
      '4622a2b2d6af1c9844944291e5e7351a6aa24cd7b23099efac1b2fd875da31a0',
      'fd20dc426fb37566d803205b19bbc1d4096b248ac04548e3cfb6b3a38bd033aa',
      '1ae92b26df02f0abca6304df07debccd18262fdf5fe82daa81593582dac9a369',
      '19177a98252e07ddfc9af2083ba8e07ef627cb6103467ffebb3f8f4205fd7927',
      'ef333840daf915aafdc4a004525502d6d49d77bd9c65e0642dbaefb3c2893bef'
    ],
    enableWalletConnect: true,
    enableInjected: true,
    enableCoinbase: false, // Temporalmente deshabilitado para evitar errores de sintaxis
    enableEIP6963: true,
    enableNetworkView: false,
    enableExplorer: false
  };
};

export const handleWalletConnectError = (error: any) => {
  console.warn('handleWalletConnectError está deprecado. Usa handleWalletError.');
  return handleWalletError(error);
};

export const cleanupEventListeners = () => {
  console.warn('cleanupEventListeners está deprecado. Usa cleanupWalletSystem.');
  if (typeof window !== 'undefined' && (window as any).ethereum) {
    try {
      const ethereum = (window as any).ethereum;
      if (ethereum.removeAllListeners) {
        ethereum.removeAllListeners();
      }
    } catch (error) {
      console.warn('Error limpiando listeners:', error);
    }
  }
};

export const retryConfig = {
  maxRetries: 3,
  retryDelay: 1000,
  backoffMultiplier: 2
};

export const retryConnection = async (
  connectionFn: () => Promise<any>,
  config = retryConfig
): Promise<any> => {
  console.warn('retryConnection está deprecado. Usa retryWithBackoff.');
  return retryWithBackoff(connectionFn, config.maxRetries, config.retryDelay);
};

// Re-exportar configuraciones principales para compatibilidad
// Temporalmente comentado para evitar errores de sintaxis
// export { mainnet, polygon } from '@reown/appkit/networks';

// Configuración legacy de ethers
export const ethersConfig = {
  // name: 'EthersAdapter', // Temporalmente comentado
  deprecated: true,
  message: 'Usa la nueva configuración modular'
};