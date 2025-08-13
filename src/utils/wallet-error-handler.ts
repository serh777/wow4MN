/**
 * Utilidades para manejar errores específicos de wallets
 * Incluye manejo de errores de MetaMask, WalletConnect y otros proveedores
 */

export interface WalletError {
  code: number | string;
  message: string;
  data?: any;
}

export interface WalletErrorInfo {
  title: string;
  message: string;
  action?: string;
  isRetryable: boolean;
}

// Códigos de error comunes de MetaMask
export const METAMASK_ERROR_CODES = {
  USER_REJECTED: 4001,
  UNAUTHORIZED: 4100,
  UNSUPPORTED_METHOD: 4200,
  DISCONNECTED: 4900,
  CHAIN_DISCONNECTED: 4901,
  NETWORK_ERROR: -32002,
  RESOURCE_UNAVAILABLE: -32003,
  TRANSACTION_REJECTED: -32003,
  METHOD_NOT_FOUND: -32601,
  INVALID_PARAMS: -32602,
  INTERNAL_ERROR: -32603,
  PARSE_ERROR: -32700,
  INVALID_REQUEST: -32600,
  RATE_LIMITED: 429
} as const;

// Mapeo de errores comunes
const ERROR_MAPPINGS: Record<number | string, WalletErrorInfo> = {
  [METAMASK_ERROR_CODES.USER_REJECTED]: {
    title: 'Conexión Cancelada',
    message: 'Has cancelado la conexión con tu wallet. Intenta nuevamente si deseas conectar.',
    action: 'Haz clic en "Conectar Wallet" e acepta la conexión en MetaMask.',
    isRetryable: true
  },
  [METAMASK_ERROR_CODES.UNAUTHORIZED]: {
    title: 'Acceso No Autorizado',
    message: 'Tu wallet no está autorizada para conectarse a esta aplicación.',
    action: 'Verifica que MetaMask esté desbloqueado y autoriza la conexión.',
    isRetryable: true
  },
  [METAMASK_ERROR_CODES.UNSUPPORTED_METHOD]: {
    title: 'Método No Soportado',
    message: 'Tu wallet no soporta esta funcionalidad.',
    action: 'Actualiza MetaMask a la versión más reciente.',
    isRetryable: false
  },
  [METAMASK_ERROR_CODES.DISCONNECTED]: {
    title: 'Wallet Desconectada',
    message: 'Tu wallet se ha desconectado de la aplicación.',
    action: 'Reconecta tu wallet para continuar.',
    isRetryable: true
  },
  [METAMASK_ERROR_CODES.CHAIN_DISCONNECTED]: {
    title: 'Red Desconectada',
    message: 'Tu wallet no está conectada a ninguna red blockchain.',
    action: 'Conecta tu wallet a una red compatible (Ethereum o Polygon).',
    isRetryable: true
  },
  [METAMASK_ERROR_CODES.NETWORK_ERROR]: {
    title: 'Error de Red',
    message: 'Hay un problema de conectividad con la red blockchain.',
    action: 'Verifica tu conexión a internet y vuelve a intentar.',
    isRetryable: true
  },
  [METAMASK_ERROR_CODES.RATE_LIMITED]: {
    title: 'Demasiadas Solicitudes',
    message: 'Has realizado demasiadas solicitudes. Espera un momento antes de intentar nuevamente.',
    action: 'Espera 30 segundos antes de volver a intentar.',
    isRetryable: true
  },
  403: {
    title: 'Acceso Denegado',
    message: 'El servidor ha denegado el acceso. Esto puede deberse a problemas de configuración.',
    action: 'Verifica tu conexión y vuelve a intentar en unos minutos.',
    isRetryable: true
  },
  'Connection timeout': {
    title: 'Tiempo de Conexión Agotado',
    message: 'La conexión con tu wallet ha tardado demasiado tiempo.',
    action: 'Verifica que MetaMask esté funcionando correctamente y vuelve a intentar.',
    isRetryable: true
  },
  'Subscribing failed': {
    title: 'Error de Suscripción',
    message: 'No se pudo establecer la comunicación con tu wallet.',
    action: 'Recarga la página y vuelve a intentar conectar tu wallet.',
    isRetryable: true
  },
  'Restore will override': {
    title: 'Conflicto de Sesión',
    message: 'Hay un conflicto con una sesión anterior de wallet.',
    action: 'Recarga la página para limpiar la sesión anterior.',
    isRetryable: true
  }
};

/**
 * Procesa un error de wallet y devuelve información útil para el usuario
 */
export function handleWalletError(error: any): WalletErrorInfo {
  console.error('Wallet error:', error);
  
  // Extraer código de error
  let errorCode: number | string | undefined;
  let errorMessage = '';
  
  if (error?.code !== undefined) {
    errorCode = error.code;
  } else if (error?.message) {
    errorMessage = error.message.toLowerCase();
    
    // Buscar patrones en el mensaje
    if (errorMessage.includes('user rejected') || errorMessage.includes('user denied')) {
      errorCode = METAMASK_ERROR_CODES.USER_REJECTED;
    } else if (errorMessage.includes('timeout')) {
      errorCode = 'Connection timeout';
    } else if (errorMessage.includes('subscribing') && errorMessage.includes('failed')) {
      errorCode = 'Subscribing failed';
    } else if (errorMessage.includes('restore will override')) {
      errorCode = 'Restore will override';
    } else if (errorMessage.includes('403') || errorMessage.includes('forbidden')) {
      errorCode = 403;
    }
  }
  
  // Buscar mapeo de error
  if (errorCode !== undefined && ERROR_MAPPINGS[errorCode]) {
    return ERROR_MAPPINGS[errorCode];
  }
  
  // Error genérico
  return {
    title: 'Error de Conexión',
    message: 'Ha ocurrido un error inesperado al conectar con tu wallet.',
    action: 'Verifica que tu wallet esté instalada y funcionando correctamente, luego vuelve a intentar.',
    isRetryable: true
  };
}

/**
 * Verifica si un error es recuperable automáticamente
 */
export function isRetryableError(error: any): boolean {
  const errorInfo = handleWalletError(error);
  return errorInfo.isRetryable;
}

/**
 * Implementa retry automático para errores recuperables
 */
export async function retryWalletOperation<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> {
  let lastError: any;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      
      if (!isRetryableError(error) || attempt === maxRetries) {
        throw error;
      }
      
      console.warn(`Wallet operation failed (attempt ${attempt}/${maxRetries}), retrying in ${delay}ms...`, error);
      await new Promise(resolve => setTimeout(resolve, delay));
      delay *= 2; // Exponential backoff
    }
  }
  
  throw lastError;
}

/**
 * Limpia el estado de wallet en caso de errores persistentes
 */
export function cleanupWalletState(): void {
  try {
    // Limpiar localStorage relacionado con wallets
    const keysToRemove = [
      'walletconnect',
      'WALLETCONNECT_DEEPLINK_CHOICE',
      'WCM_VERSION',
      'wc@2:client:0.3//session',
      'wc@2:core:0.3//keychain',
      'wc@2:core:0.3//messages'
    ];
    
    keysToRemove.forEach(key => {
      try {
        localStorage.removeItem(key);
      } catch (e) {
        // Ignorar errores de localStorage
      }
    });
    
    // Limpiar sessionStorage
    try {
      sessionStorage.removeItem('wagmi.wallet');
      sessionStorage.removeItem('wagmi.connected');
    } catch (e) {
      // Ignorar errores de sessionStorage
    }
    
    console.log('Wallet state cleaned up');
  } catch (error) {
    console.warn('Error cleaning up wallet state:', error);
  }
}