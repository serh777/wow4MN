/**
 * Configuración principal de wallet - Punto de entrada unificado
 */

// Importar solo las variables necesarias para uso interno
import { supportedNetworks, defaultNetwork, networkConfig } from './networks';
import { desktopConfig, mobileConfig, appMetadata, initializeAppKit, cleanupAppKit, getAppKit } from './providers';
import { 
  isMobileDevice, 
  isIOS, 
  isAndroid, 
  isMobileBrowser, 
  isMobileWalletApp,
  mobileTimeouts,
  mobileRetryConfig,
  mobileWalletDeepLinks,
  mobileUIConfig
} from './mobile';

// Exportar configuraciones de redes
export {
  supportedNetworks,
  defaultNetwork,
  networkConfig,
  getNetworkConfig,
  isNetworkSupported,
  getDefaultNetwork,
  mainnet,
  polygon
} from './networks';

// Exportar configuraciones de proveedores
export {
  appMetadata,
  // ethersAdapter, // Temporalmente comentado
  mobileWalletIds,
  baseAppKitConfig,
  desktopConfig,
  mobileConfig,
  initializeAppKit,
  getAppKit,
  cleanupAppKit,
  web3ModalConfig
} from './providers';

// Exportar configuraciones móviles
export {
  isMobileDevice,
  isIOS,
  isAndroid,
  isMobileBrowser,
  isMobileWalletApp,
  mobileTimeouts,
  mobileRetryConfig,
  mobileWalletDeepLinks,
  generateMobileDeepLink,
  openMobileWallet,
  mobileEventConfig,
  supportsVibration,
  vibrate,
  mobileUIConfig,
  getOrientation,
  isFullscreen
} from './mobile';

// Configuración unificada para fácil acceso
export const walletConfig = {
  // Configuración de red
  networks: {
    supported: supportedNetworks,
    default: defaultNetwork,
    config: networkConfig
  },
  
  // Configuración de proveedores
  providers: {
    appKit: {
      desktop: desktopConfig,
      mobile: mobileConfig
    },
    metadata: appMetadata
  },
  
  // Configuración móvil
  mobile: {
    detection: {
      isMobileDevice,
      isIOS,
      isAndroid,
      isMobileBrowser,
      isMobileWalletApp
    },
    timeouts: mobileTimeouts,
    retry: mobileRetryConfig,
    deepLinks: mobileWalletDeepLinks,
    ui: mobileUIConfig
  }
};

// Función de inicialización completa (temporalmente deshabilitada)
export const initializeWalletSystem = async () => {
  try {
    console.log('Sistema de wallet temporalmente deshabilitado para evitar errores de sintaxis');
    
    // Verificar que estamos en el cliente
    if (typeof window === 'undefined') {
      console.warn('Sistema de wallet: Ejecutándose en el servidor, saltando inicialización');
      return null;
    }
    
    // Temporalmente deshabilitado para evitar errores de Coinbase SDK
    console.log('Wallet system disabled temporarily to fix syntax errors');
    return null;
    
    /* CÓDIGO ORIGINAL COMENTADO TEMPORALMENTE
    // Verificar PROJECT_ID
    const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || process.env.NEXT_PUBLIC_REOWN_API_KEY;
    if (!projectId) {
      console.error('Sistema de wallet: PROJECT_ID no configurado');
      return null;
    }
    
    // Inicializar AppKit
    const appKit = initializeAppKit();
    if (!appKit) {
      console.error('Sistema de wallet: Error al inicializar AppKit');
      return null;
    }
    
    console.log('Sistema de wallet inicializado correctamente');
    return appKit;
    */
    
  } catch (error) {
    console.error('Error al inicializar sistema de wallet:', error);
    return null;
  }
};

// Función de limpieza completa
export const cleanupWalletSystem = () => {
  try {
    console.log('Limpiando sistema de wallet...');
    cleanupAppKit();
    console.log('Sistema de wallet limpiado correctamente');
  } catch (error) {
    console.error('Error al limpiar sistema de wallet:', error);
  }
};

// Funciones utilitarias adicionales
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

// Exportaciones de compatibilidad (mantener la API existente)
export const networks = supportedNetworks;
export const defaultChain = defaultNetwork;
export const createAppKit = initializeAppKit;
export const getWalletConnectModal = getAppKit;

// Configuración legacy para compatibilidad
export const walletConnectConfig = {
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || process.env.NEXT_PUBLIC_REOWN_API_KEY || '',
  networks: supportedNetworks,
  defaultNetwork,
  isMobileDevice,
  initializeAppKit,
  getAppKit
};