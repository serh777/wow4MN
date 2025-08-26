'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import {
  APIConfig,
  ValidationResult,
  ValidationSummary,
  validateAllAPIs,
  validateWithCache,
  validateAPI,
  getCachedResult,
  addAPIConfig,
  removeAPIConfig,
  updateAPIConfig,
  getAPIConfigs,
  clearValidationCache
} from '@/utils/api-validator';

export interface UseAPIValidatorOptions {
  autoValidate?: boolean;
  validationInterval?: number; // en milisegundos
  enableCache?: boolean;
  onValidationComplete?: (summary: ValidationSummary) => void;
  onValidationError?: (error: Error) => void;
}

export interface UseAPIValidatorReturn {
  // Estado
  summary: ValidationSummary | null;
  isValidating: boolean;
  error: string | null;
  lastValidation: Date | null;
  
  // Acciones
  validateAll: () => Promise<void>;
  validateSingle: (apiName: string) => Promise<ValidationResult | null>;
  retryValidation: () => Promise<void>;
  clearCache: () => void;
  
  // Configuración
  addAPI: (config: APIConfig) => void;
  removeAPI: (apiName: string) => void;
  updateAPI: (apiName: string, updates: Partial<APIConfig>) => void;
  getConfigs: () => APIConfig[];
  
  // Utilidades
  getAPIStatus: (apiName: string) => ValidationResult | null;
  isAPIHealthy: (apiName: string) => boolean;
  getHealthyAPIs: () => ValidationResult[];
  getFailedAPIs: () => ValidationResult[];
  getRequiredAPIsStatus: () => { healthy: number; total: number; critical: boolean };
}

const DEFAULT_OPTIONS: UseAPIValidatorOptions = {
  autoValidate: true,
  validationInterval: 5 * 60 * 1000, // 5 minutos
  enableCache: true
};

export function useAPIValidator(options: UseAPIValidatorOptions = {}): UseAPIValidatorReturn {
  const opts = useMemo(() => ({ ...DEFAULT_OPTIONS, ...options }), [options]);
  
  // Estado
  const [summary, setSummary] = useState<ValidationSummary | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastValidation, setLastValidation] = useState<Date | null>(null);
  
  // Referencias
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const mountedRef = useRef(true);
  
  // Función de validación principal
  const performValidation = useCallback(async (useCache: boolean = true) => {
    if (!mountedRef.current) return;
    
    setIsValidating(true);
    setError(null);
    
    try {
      const validationSummary = useCache && opts.enableCache 
        ? await validateWithCache()
        : await validateAllAPIs();
      
      if (mountedRef.current) {
        setSummary(validationSummary);
        setLastValidation(new Date());
        opts.onValidationComplete?.(validationSummary);
      }
    } catch (err: any) {
      if (mountedRef.current) {
        const errorMessage = err.message || 'Error durante la validación de APIs';
        setError(errorMessage);
        opts.onValidationError?.(err);
      }
    } finally {
      if (mountedRef.current) {
        setIsValidating(false);
      }
    }
  }, [opts]);
  
  // Validar todas las APIs
  const validateAll = useCallback(async () => {
    await performValidation(false);
  }, [performValidation]);
  
  // Validar una API específica
  const validateSingle = useCallback(async (apiName: string): Promise<ValidationResult | null> => {
    const configs = getAPIConfigs();
    const config = configs.find(c => c.name === apiName);
    
    if (!config) {
      console.warn(`API config not found: ${apiName}`);
      return null;
    }
    
    try {
      const result = await validateAPI(config);
      
      // Actualizar el summary con el nuevo resultado
      if (summary) {
        const updatedResults = summary.results.map(r => 
          r.apiName === apiName ? result : r
        );
        
        const updatedSummary: ValidationSummary = {
          ...summary,
          results: updatedResults,
          validAPIs: updatedResults.filter(r => r.isValid).length,
          connectedAPIs: updatedResults.filter(r => r.isConnected).length,
          failedAPIs: updatedResults.filter(r => r.status === 'error').length,
          lastValidation: new Date()
        };
        
        setSummary(updatedSummary);
      }
      
      return result;
    } catch (err: any) {
      console.error(`Error validating API ${apiName}:`, err);
      return null;
    }
  }, [summary]);
  
  // Reintentar validación
  const retryValidation = useCallback(async () => {
    clearValidationCache();
    await performValidation(false);
  }, [performValidation]);
  
  // Limpiar cache
  const clearCache = useCallback(() => {
    clearValidationCache();
    setError(null);
  }, []);
  
  // Agregar API
  const addAPI = useCallback((config: APIConfig) => {
    addAPIConfig(config);
    // Re-validar después de agregar
    if (opts.autoValidate) {
      performValidation(false);
    }
  }, [opts.autoValidate, performValidation]);
  
  // Remover API
  const removeAPI = useCallback((apiName: string) => {
    removeAPIConfig(apiName);
    // Actualizar summary removiendo la API
    if (summary) {
      const updatedResults = summary.results.filter(r => r.apiName !== apiName);
      const updatedSummary: ValidationSummary = {
        ...summary,
        totalAPIs: updatedResults.length,
        results: updatedResults,
        validAPIs: updatedResults.filter(r => r.isValid).length,
        connectedAPIs: updatedResults.filter(r => r.isConnected).length,
        failedAPIs: updatedResults.filter(r => r.status === 'error').length
      };
      setSummary(updatedSummary);
    }
  }, [summary]);
  
  // Actualizar API
  const updateAPI = useCallback((apiName: string, updates: Partial<APIConfig>) => {
    updateAPIConfig(apiName, updates);
    // Re-validar la API específica
    if (opts.autoValidate) {
      validateSingle(apiName);
    }
  }, [opts.autoValidate, validateSingle]);
  
  // Obtener configuraciones
  const getConfigs = useCallback(() => {
    return getAPIConfigs();
  }, []);
  
  // Obtener estado de una API específica
  const getAPIStatus = useCallback((apiName: string): ValidationResult | null => {
    if (!summary) return getCachedResult(apiName);
    return summary.results.find(r => r.apiName === apiName) || null;
  }, [summary]);
  
  // Verificar si una API está saludable
  const isAPIHealthy = useCallback((apiName: string): boolean => {
    const status = getAPIStatus(apiName);
    return status ? status.isValid && status.isConnected : false;
  }, [getAPIStatus]);
  
  // Obtener APIs saludables
  const getHealthyAPIs = useCallback((): ValidationResult[] => {
    return summary?.results.filter(r => r.isValid && r.isConnected) || [];
  }, [summary]);
  
  // Obtener APIs fallidas
  const getFailedAPIs = useCallback((): ValidationResult[] => {
    return summary?.results.filter(r => r.status === 'error') || [];
  }, [summary]);
  
  // Obtener estado de APIs requeridas
  const getRequiredAPIsStatus = useCallback(() => {
    const configs = getAPIConfigs();
    const requiredConfigs = configs.filter(c => c.required);
    const requiredResults = summary?.results.filter(r => 
      requiredConfigs.some(c => c.name === r.apiName)
    ) || [];
    
    const healthy = requiredResults.filter(r => r.isValid && r.isConnected).length;
    const total = requiredResults.length;
    const critical = requiredResults.some(r => r.status === 'error');
    
    return { healthy, total, critical };
  }, [summary]);
  
  // Efecto para validación automática inicial
  useEffect(() => {
    if (opts.autoValidate) {
      performValidation(opts.enableCache);
    }
  }, [opts.autoValidate, opts.enableCache, performValidation]);
  
  // Efecto para validación periódica
  useEffect(() => {
    if (opts.autoValidate && opts.validationInterval && opts.validationInterval > 0) {
      intervalRef.current = setInterval(() => {
        performValidation(opts.enableCache);
      }, opts.validationInterval);
      
      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }
  }, [opts.autoValidate, opts.validationInterval, opts.enableCache, performValidation]);
  
  // Cleanup al desmontar
  useEffect(() => {
    return () => {
      mountedRef.current = false;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);
  
  return {
    // Estado
    summary,
    isValidating,
    error,
    lastValidation,
    
    // Acciones
    validateAll,
    validateSingle,
    retryValidation,
    clearCache,
    
    // Configuración
    addAPI,
    removeAPI,
    updateAPI,
    getConfigs,
    
    // Utilidades
    getAPIStatus,
    isAPIHealthy,
    getHealthyAPIs,
    getFailedAPIs,
    getRequiredAPIsStatus
  };
}

export default useAPIValidator;