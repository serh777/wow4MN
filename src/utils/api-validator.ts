'use client';

/**
 * Validador automático de API keys y conectividad
 * Verifica la validez y conectividad de las diferentes APIs utilizadas en la aplicación
 */

export interface APIConfig {
  name: string;
  key: string;
  baseUrl: string;
  testEndpoint: string;
  headers?: Record<string, string>;
  timeout?: number;
  required: boolean;
  description: string;
}

export interface ValidationResult {
  apiName: string;
  isValid: boolean;
  isConnected: boolean;
  responseTime?: number;
  error?: string;
  lastChecked: Date;
  status: 'success' | 'warning' | 'error' | 'pending';
  details?: {
    rateLimitRemaining?: number;
    rateLimitReset?: Date;
    version?: string;
    features?: string[];
  };
}

export interface ValidationSummary {
  totalAPIs: number;
  validAPIs: number;
  connectedAPIs: number;
  failedAPIs: number;
  overallStatus: 'healthy' | 'degraded' | 'critical';
  lastValidation: Date;
  results: ValidationResult[];
}

// Configuraciones de APIs por defecto
const DEFAULT_API_CONFIGS: APIConfig[] = [
  {
    name: 'OpenAI',
    key: process.env.NEXT_PUBLIC_OPENAI_API_KEY || '',
    baseUrl: 'https://api.openai.com/v1',
    testEndpoint: '/models',
    headers: {
      'Authorization': 'Bearer {key}',
      'Content-Type': 'application/json'
    },
    timeout: 10000,
    required: true,
    description: 'API de OpenAI para análisis con IA'
  },
  {
    name: 'Etherscan',
    key: process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY || '',
    baseUrl: 'https://api.etherscan.io/api',
    testEndpoint: '?module=stats&action=ethsupply&apikey={key}',
    timeout: 15000,
    required: true,
    description: 'API de Etherscan para datos de blockchain'
  },
  {
    name: 'CoinGecko',
    key: process.env.NEXT_PUBLIC_COINGECKO_API_KEY || '',
    baseUrl: 'https://api.coingecko.com/api/v3',
    testEndpoint: '/ping',
    headers: {
      'x-cg-demo-api-key': '{key}'
    },
    timeout: 10000,
    required: false,
    description: 'API de CoinGecko para precios de criptomonedas'
  },
  {
    name: 'Alchemy',
    key: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY || '',
    baseUrl: 'https://eth-mainnet.g.alchemy.com/v2/{key}',
    testEndpoint: '',
    headers: {
      'Content-Type': 'application/json'
    },
    timeout: 10000,
    required: false,
    description: 'API de Alchemy para datos avanzados de blockchain'
  },
  {
    name: 'Moralis',
    key: process.env.NEXT_PUBLIC_MORALIS_API_KEY || '',
    baseUrl: 'https://deep-index.moralis.io/api/v2',
    testEndpoint: '/dateToBlock?chain=eth&date=2021-01-01T00:00:00.000Z',
    headers: {
      'X-API-Key': '{key}',
      'Content-Type': 'application/json'
    },
    timeout: 10000,
    required: false,
    description: 'API de Moralis para datos NFT y DeFi'
  },
  {
    name: 'Google PageSpeed',
    key: process.env.NEXT_PUBLIC_GOOGLE_PAGESPEED_API_KEY || '',
    baseUrl: 'https://www.googleapis.com/pagespeedonline/v5',
    testEndpoint: '/runPagespeed?url=https://google.com&key={key}',
    timeout: 30000,
    required: false,
    description: 'API de Google PageSpeed para análisis de rendimiento'
  }
];

class APIValidator {
  private configs: APIConfig[];
  private cache: Map<string, ValidationResult> = new Map();
  private cacheTimeout = 5 * 60 * 1000; // 5 minutos

  constructor(configs: APIConfig[] = DEFAULT_API_CONFIGS) {
    this.configs = configs;
  }

  /**
   * Valida una API específica
   */
  async validateAPI(config: APIConfig): Promise<ValidationResult> {
    const startTime = Date.now();
    const result: ValidationResult = {
      apiName: config.name,
      isValid: false,
      isConnected: false,
      lastChecked: new Date(),
      status: 'pending'
    };

    try {
      // Verificar si la API key está presente
      if (!config.key || config.key.trim() === '') {
        throw new Error('API key no configurada');
      }

      // Preparar URL y headers
      const url = this.buildTestUrl(config);
      const headers = this.buildHeaders(config);

      // Realizar petición de prueba
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), config.timeout || 10000);

      const response = await fetch(url, {
        method: 'GET',
        headers,
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      result.responseTime = Date.now() - startTime;

      // Verificar respuesta
      if (response.ok) {
        result.isValid = true;
        result.isConnected = true;
        result.status = 'success';

        // Extraer información adicional de headers
        result.details = this.extractAPIDetails(response, config);
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

    } catch (error: any) {
      result.isValid = false;
      result.isConnected = false;
      result.error = error.message || 'Error desconocido';
      result.status = config.required ? 'error' : 'warning';
      result.responseTime = Date.now() - startTime;
    }

    // Actualizar cache
    this.cache.set(config.name, result);
    return result;
  }

  /**
   * Valida todas las APIs configuradas
   */
  async validateAllAPIs(): Promise<ValidationSummary> {
    const results: ValidationResult[] = [];
    
    // Validar APIs en paralelo
    const validationPromises = this.configs.map(config => 
      this.validateAPI(config).catch(error => ({
        apiName: config.name,
        isValid: false,
        isConnected: false,
        lastChecked: new Date(),
        status: 'error' as const,
        error: error.message
      }))
    );

    const validationResults = await Promise.all(validationPromises);
    results.push(...validationResults);

    // Calcular resumen
    const totalAPIs = results.length;
    const validAPIs = results.filter(r => r.isValid).length;
    const connectedAPIs = results.filter(r => r.isConnected).length;
    const failedAPIs = results.filter(r => r.status === 'error').length;
    const requiredFailedAPIs = results.filter(r => 
      r.status === 'error' && this.configs.find(c => c.name === r.apiName)?.required
    ).length;

    let overallStatus: 'healthy' | 'degraded' | 'critical';
    if (requiredFailedAPIs > 0) {
      overallStatus = 'critical';
    } else if (failedAPIs > 0 || validAPIs < totalAPIs * 0.8) {
      overallStatus = 'degraded';
    } else {
      overallStatus = 'healthy';
    }

    return {
      totalAPIs,
      validAPIs,
      connectedAPIs,
      failedAPIs,
      overallStatus,
      lastValidation: new Date(),
      results
    };
  }

  /**
   * Obtiene el resultado de validación desde cache si está disponible
   */
  getCachedResult(apiName: string): ValidationResult | null {
    const cached = this.cache.get(apiName);
    if (cached && Date.now() - cached.lastChecked.getTime() < this.cacheTimeout) {
      return cached;
    }
    return null;
  }

  /**
   * Valida APIs con cache
   */
  async validateWithCache(): Promise<ValidationSummary> {
    const results: ValidationResult[] = [];
    const toValidate: APIConfig[] = [];

    // Verificar cache primero
    for (const config of this.configs) {
      const cached = this.getCachedResult(config.name);
      if (cached) {
        results.push(cached);
      } else {
        toValidate.push(config);
      }
    }

    // Validar APIs no cacheadas
    if (toValidate.length > 0) {
      const newResults = await Promise.all(
        toValidate.map(config => this.validateAPI(config))
      );
      results.push(...newResults);
    }

    // Calcular resumen
    const totalAPIs = results.length;
    const validAPIs = results.filter(r => r.isValid).length;
    const connectedAPIs = results.filter(r => r.isConnected).length;
    const failedAPIs = results.filter(r => r.status === 'error').length;
    const requiredFailedAPIs = results.filter(r => 
      r.status === 'error' && this.configs.find(c => c.name === r.apiName)?.required
    ).length;

    let overallStatus: 'healthy' | 'degraded' | 'critical';
    if (requiredFailedAPIs > 0) {
      overallStatus = 'critical';
    } else if (failedAPIs > 0 || validAPIs < totalAPIs * 0.8) {
      overallStatus = 'degraded';
    } else {
      overallStatus = 'healthy';
    }

    return {
      totalAPIs,
      validAPIs,
      connectedAPIs,
      failedAPIs,
      overallStatus,
      lastValidation: new Date(),
      results
    };
  }

  /**
   * Construye la URL de prueba para una API
   */
  private buildTestUrl(config: APIConfig): string {
    let url = config.baseUrl;
    if (config.testEndpoint) {
      url += config.testEndpoint;
    }
    return url.replace('{key}', config.key);
  }

  /**
   * Construye los headers para una petición
   */
  private buildHeaders(config: APIConfig): Record<string, string> {
    const headers: Record<string, string> = {};
    
    if (config.headers) {
      Object.entries(config.headers).forEach(([key, value]) => {
        headers[key] = value.replace('{key}', config.key);
      });
    }

    return headers;
  }

  /**
   * Extrae información adicional de la respuesta de la API
   */
  private extractAPIDetails(response: Response, config: APIConfig): ValidationResult['details'] {
    const details: ValidationResult['details'] = {};

    // Rate limiting info
    const rateLimitRemaining = response.headers.get('x-ratelimit-remaining') || 
                              response.headers.get('x-rate-limit-remaining');
    if (rateLimitRemaining) {
      details.rateLimitRemaining = parseInt(rateLimitRemaining);
    }

    const rateLimitReset = response.headers.get('x-ratelimit-reset') || 
                          response.headers.get('x-rate-limit-reset');
    if (rateLimitReset) {
      details.rateLimitReset = new Date(parseInt(rateLimitReset) * 1000);
    }

    // API version
    const version = response.headers.get('api-version') || 
                   response.headers.get('x-api-version');
    if (version) {
      details.version = version;
    }

    return details;
  }

  /**
   * Agrega una nueva configuración de API
   */
  addAPIConfig(config: APIConfig): void {
    this.configs.push(config);
  }

  /**
   * Remueve una configuración de API
   */
  removeAPIConfig(apiName: string): void {
    this.configs = this.configs.filter(config => config.name !== apiName);
    this.cache.delete(apiName);
  }

  /**
   * Actualiza una configuración de API existente
   */
  updateAPIConfig(apiName: string, updates: Partial<APIConfig>): void {
    const index = this.configs.findIndex(config => config.name === apiName);
    if (index !== -1) {
      this.configs[index] = { ...this.configs[index], ...updates };
      this.cache.delete(apiName); // Invalidar cache
    }
  }

  /**
   * Obtiene todas las configuraciones de API
   */
  getAPIConfigs(): APIConfig[] {
    return [...this.configs];
  }

  /**
   * Limpia el cache de validaciones
   */
  clearCache(): void {
    this.cache.clear();
  }
}

// Instancia singleton del validador
const apiValidator = new APIValidator();

// Funciones de utilidad exportadas
export const validateAPI = (config: APIConfig) => apiValidator.validateAPI(config);
export const validateAllAPIs = () => apiValidator.validateAllAPIs();
export const validateWithCache = () => apiValidator.validateWithCache();
export const getCachedResult = (apiName: string) => apiValidator.getCachedResult(apiName);
export const addAPIConfig = (config: APIConfig) => apiValidator.addAPIConfig(config);
export const removeAPIConfig = (apiName: string) => apiValidator.removeAPIConfig(apiName);
export const updateAPIConfig = (apiName: string, updates: Partial<APIConfig>) => 
  apiValidator.updateAPIConfig(apiName, updates);
export const getAPIConfigs = () => apiValidator.getAPIConfigs();
export const clearValidationCache = () => apiValidator.clearCache();

export default apiValidator;