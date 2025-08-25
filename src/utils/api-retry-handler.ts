// Sistema de reintentos y manejo de errores para APIs externas

export interface RetryConfig {
  maxRetries: number;
  baseDelay: number;
  maxDelay: number;
  backoffMultiplier: number;
  retryCondition?: (error: any) => boolean;
}

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
  isNetworkError: boolean;
  isRetryable: boolean;
  originalError?: any;
}

const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxRetries: 3,
  baseDelay: 1000,
  maxDelay: 10000,
  backoffMultiplier: 2,
  retryCondition: (error) => {
    // Reintentar en errores de red, timeouts y errores 5xx
    if (error.isNetworkError) return true;
    if (error.status >= 500) return true;
    if (error.code === 'TIMEOUT') return true;
    if (error.code === 'NETWORK_ERROR') return true;
    return false;
  }
};

export class ApiRetryHandler {
  private config: RetryConfig;
  private activeRequests: Map<string, AbortController> = new Map();

  constructor(config: Partial<RetryConfig> = {}) {
    this.config = { ...DEFAULT_RETRY_CONFIG, ...config };
  }

  /**
   * Ejecuta una función con reintentos automáticos
   */
  async executeWithRetry<T>(
    fn: () => Promise<T>,
    requestId?: string,
    customConfig?: Partial<RetryConfig>
  ): Promise<T> {
    const config = { ...this.config, ...customConfig };
    let lastError: ApiError | undefined;
    
    // Crear AbortController para cancelar la petición si es necesario
    if (requestId) {
      const controller = new AbortController();
      this.activeRequests.set(requestId, controller);
    }

    for (let attempt = 0; attempt <= config.maxRetries; attempt++) {
      try {
        const result = await fn();
        
        // Limpiar el controlador si la petición fue exitosa
        if (requestId) {
          this.activeRequests.delete(requestId);
        }
        
        return result;
      } catch (error) {
        lastError = this.normalizeError(error);
        
        // Si no es el último intento y el error es reintentable
        if (attempt < config.maxRetries && this.shouldRetry(lastError, config)) {
          const delay = this.calculateDelay(attempt, config);
          console.warn(`Intento ${attempt + 1} falló, reintentando en ${delay}ms:`, lastError.message);
          
          await this.delay(delay);
          continue;
        }
        
        // Si llegamos aquí, no hay más reintentos
        break;
      }
    }

    // Limpiar el controlador en caso de error final
    if (requestId) {
      this.activeRequests.delete(requestId);
    }

    throw lastError || new Error('Unknown error occurred');
  }

  /**
   * Cancela una petición activa
   */
  cancelRequest(requestId: string): boolean {
    const controller = this.activeRequests.get(requestId);
    if (controller) {
      controller.abort();
      this.activeRequests.delete(requestId);
      return true;
    }
    return false;
  }

  /**
   * Cancela todas las peticiones activas
   */
  cancelAllRequests(): void {
    for (const [requestId, controller] of this.activeRequests) {
      controller.abort();
    }
    this.activeRequests.clear();
  }

  /**
   * Normaliza errores a un formato estándar
   */
  private normalizeError(error: any): ApiError {
    // Error de red
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      return {
        message: 'Error de conexión de red',
        code: 'NETWORK_ERROR',
        isNetworkError: true,
        isRetryable: true,
        originalError: error
      };
    }

    // Error de timeout
    if (error.name === 'AbortError' || error.code === 'TIMEOUT') {
      return {
        message: 'Timeout de la petición',
        code: 'TIMEOUT',
        isNetworkError: false,
        isRetryable: true,
        originalError: error
      };
    }

    // Error HTTP
    if (error.status) {
      return {
        message: error.message || `Error HTTP ${error.status}`,
        status: error.status,
        code: `HTTP_${error.status}`,
        isNetworkError: false,
        isRetryable: error.status >= 500 || error.status === 429,
        originalError: error
      };
    }

    // Error genérico
    return {
      message: error.message || 'Error desconocido',
      code: 'UNKNOWN_ERROR',
      isNetworkError: false,
      isRetryable: false,
      originalError: error
    };
  }

  /**
   * Determina si se debe reintentar basado en el error y configuración
   */
  private shouldRetry(error: ApiError, config: RetryConfig): boolean {
    if (config.retryCondition) {
      return config.retryCondition(error);
    }
    return error.isRetryable;
  }

  /**
   * Calcula el delay para el siguiente intento usando backoff exponencial
   */
  private calculateDelay(attempt: number, config: RetryConfig): number {
    const exponentialDelay = config.baseDelay * Math.pow(config.backoffMultiplier, attempt);
    const jitteredDelay = exponentialDelay * (0.5 + Math.random() * 0.5); // Jitter del 50%
    return Math.min(jitteredDelay, config.maxDelay);
  }

  /**
   * Función de delay con Promise
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Instancia global del manejador de reintentos
export const apiRetryHandler = new ApiRetryHandler();

/**
 * Wrapper para fetch con reintentos automáticos
 */
export async function fetchWithRetry(
  url: string,
  options: RequestInit = {},
  retryConfig?: Partial<RetryConfig>
): Promise<Response> {
  const requestId = `fetch_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  return apiRetryHandler.executeWithRetry(async () => {
    const controller = apiRetryHandler['activeRequests'].get(requestId);
    const timeoutController = new AbortController();
    const signal = controller?.signal || options.signal;
    
    // Crear timeout manual
    const timeoutId = setTimeout(() => timeoutController.abort(), 30000);
    
    try {
      const response = await fetch(url, {
        ...options,
        signal: signal || timeoutController.signal,
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw {
          message: `HTTP ${response.status}: ${response.statusText}`,
          status: response.status,
          response
        };
      }
      
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      if (timeoutController.signal.aborted) {
        throw { code: 'TIMEOUT', message: 'Request timeout' };
      }
      throw error;
    }
  }, requestId, retryConfig);
}

/**
 * Wrapper para llamadas a APIs con manejo de errores y reintentos
 */
export async function apiCall<T>(
  apiFunction: () => Promise<T>,
  serviceName: string,
  retryConfig?: Partial<RetryConfig>
): Promise<T> {
  const requestId = `${serviceName}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  try {
    return await apiRetryHandler.executeWithRetry(apiFunction, requestId, retryConfig);
  } catch (error) {
    console.error(`Error en servicio ${serviceName}:`, error);
    throw error;
  }
}

export default ApiRetryHandler;