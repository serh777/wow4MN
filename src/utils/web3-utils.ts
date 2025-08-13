/**
 * Utilidades para Web3 y detección de MetaMask
 */

// Tipos para el estado de MetaMask
export interface MetaMaskState {
  isInstalled: boolean;
  isConnected: boolean;
  isUnlocked: boolean;
  chainId: string | null;
  accounts: string[];
}

/**
 * Detecta si MetaMask está instalado y disponible
 */
export function detectMetaMask(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  // Verificar si ethereum está disponible
  if (!window.ethereum) {
    return false;
  }

  // Verificar si es MetaMask específicamente
  return window.ethereum.isMetaMask === true;
}

/**
 * Obtiene el estado actual de MetaMask
 */
export async function getMetaMaskState(): Promise<MetaMaskState> {
  const defaultState: MetaMaskState = {
    isInstalled: false,
    isConnected: false,
    isUnlocked: false,
    chainId: null,
    accounts: []
  };

  if (!detectMetaMask()) {
    return defaultState;
  }

  try {
    // Verificar si MetaMask está desbloqueado
    const accounts = await (window.ethereum as any).request({ 
      method: 'eth_accounts' 
    }) as string[];
    
    // Obtener chainId actual
    const chainId = await (window.ethereum as any).request({ 
      method: 'eth_chainId' 
    }) as string;

    return {
      isInstalled: true,
      isConnected: accounts.length > 0,
      isUnlocked: accounts.length > 0,
      chainId,
      accounts
    };
  } catch (error) {
    console.warn('Error al obtener estado de MetaMask:', error);
    return {
      ...defaultState,
      isInstalled: true
    };
  }
}

/**
 * Solicita conexión a MetaMask con manejo de errores mejorado
 */
export async function requestMetaMaskConnection(): Promise<{
  success: boolean;
  accounts?: string[];
  error?: string;
}> {
  if (!detectMetaMask()) {
    return {
      success: false,
      error: 'MetaMask no está instalado. Por favor instala MetaMask desde https://metamask.io/'
    };
  }

  try {
    const accounts = await (window.ethereum as any).request({
      method: 'eth_requestAccounts'
    }) as string[];

    if (!accounts || accounts.length === 0) {
      return {
        success: false,
        error: 'No se obtuvieron cuentas de MetaMask'
      };
    }

    return {
      success: true,
      accounts
    };
  } catch (error: any) {
    let errorMessage = 'Error desconocido al conectar con MetaMask';
    
    if (error.code === 4001) {
      errorMessage = 'Usuario rechazó la conexión a MetaMask';
    } else if (error.code === -32002) {
      errorMessage = 'Ya hay una solicitud de conexión pendiente en MetaMask';
    } else if (error.code === -32603) {
      errorMessage = 'Error interno de MetaMask';
    }

    return {
      success: false,
      error: errorMessage
    };
  }
}

/**
 * Verifica si una red está soportada
 */
export function isSupportedNetwork(chainId: number, supportedChains: Record<number, string>): boolean {
  return chainId in supportedChains;
}

/**
 * Convierte chainId de hex a decimal
 */
export function hexToDecimal(hex: string): number {
  return parseInt(hex, 16);
}

/**
 * Convierte chainId de decimal a hex
 */
export function decimalToHex(decimal: number): string {
  return `0x${decimal.toString(16)}`;
}

/**
 * Maneja errores de Web3 de forma consistente
 */
export function handleWeb3Error(error: any): string {
  if (error.code === 4001) {
    return 'Usuario rechazó la transacción';
  }
  if (error.code === -32002) {
    return 'Ya hay una solicitud pendiente en MetaMask';
  }
  if (error.code === -32603) {
    return 'Error interno de MetaMask';
  }
  if (error.message?.includes('insufficient funds')) {
    return 'Fondos insuficientes para completar la transacción';
  }
  if (error.message?.includes('gas')) {
    return 'Error relacionado con el gas de la transacción';
  }
  if (error.message?.includes('network')) {
    return 'Error de conexión de red';
  }
  
  return error.message || 'Error desconocido en la operación Web3';
}

/**
 * Espera a que MetaMask esté disponible
 */
export function waitForMetaMask(timeout: number = 3000): Promise<boolean> {
  return new Promise((resolve) => {
    if (detectMetaMask()) {
      resolve(true);
      return;
    }

    const startTime = Date.now();
    const checkInterval = setInterval(() => {
      if (detectMetaMask()) {
        clearInterval(checkInterval);
        resolve(true);
      } else if (Date.now() - startTime > timeout) {
        clearInterval(checkInterval);
        resolve(false);
      }
    }, 100);
  });
}