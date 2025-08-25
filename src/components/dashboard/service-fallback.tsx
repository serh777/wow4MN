'use client';

import React from 'react';
import { AlertTriangle, RefreshCw, Wifi, WifiOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ServiceFallbackProps {
  serviceName: string;
  error?: string;
  onRetry?: () => void;
  showRetryButton?: boolean;
  fallbackData?: any;
  isNetworkError?: boolean;
}

export function ServiceFallback({
  serviceName,
  error,
  onRetry,
  showRetryButton = true,
  fallbackData,
  isNetworkError = false
}: ServiceFallbackProps) {
  const getErrorIcon = () => {
    if (isNetworkError) {
      return <WifiOff className="h-5 w-5 text-red-500" />;
    }
    return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
  };

  const getErrorMessage = () => {
    if (isNetworkError) {
      return 'Error de conexión. Verifica tu conexión a internet.';
    }
    return error || `El servicio ${serviceName} no está disponible temporalmente.`;
  };

  const getFallbackContent = () => {
    if (fallbackData) {
      return (
        <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="font-medium text-blue-900 mb-2">Datos de respaldo disponibles:</h4>
          <p className="text-sm text-blue-700">
            Mostrando información almacenada en caché del último análisis exitoso.
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {getErrorIcon()}
          Servicio no disponible
        </CardTitle>
        <CardDescription>
          {serviceName}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Alert>
          <AlertDescription>
            {getErrorMessage()}
          </AlertDescription>
        </Alert>
        
        {getFallbackContent()}
        
        <div className="flex gap-2 mt-4">
          {showRetryButton && onRetry && (
            <Button 
              onClick={onRetry} 
              variant="outline" 
              size="sm"
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Reintentar
            </Button>
          )}
          
          {isNetworkError && (
            <Button 
              variant="ghost" 
              size="sm"
              className="flex items-center gap-2"
              onClick={() => window.location.reload()}
            >
              <Wifi className="h-4 w-4" />
              Recargar página
            </Button>
          )}
        </div>
        
        <div className="mt-4 text-xs text-gray-500">
          <p>Si el problema persiste, contacta al soporte técnico.</p>
          <p className="mt-1">Código de error: {error ? error.substring(0, 50) : 'SERVICE_UNAVAILABLE'}</p>
        </div>
      </CardContent>
    </Card>
  );
}

// Hook para manejar fallos de servicios
export function useServiceFallback() {
  const [failedServices, setFailedServices] = React.useState<Set<string>>(new Set());
  const [retryAttempts, setRetryAttempts] = React.useState<Map<string, number>>(new Map());
  
  const markServiceAsFailed = React.useCallback((serviceName: string) => {
    setFailedServices(prev => new Set([...prev, serviceName]));
  }, []);
  
  const markServiceAsWorking = React.useCallback((serviceName: string) => {
    setFailedServices(prev => {
      const newSet = new Set(prev);
      newSet.delete(serviceName);
      return newSet;
    });
    setRetryAttempts(prev => {
      const newMap = new Map(prev);
      newMap.delete(serviceName);
      return newMap;
    });
  }, []);
  
  const incrementRetryAttempt = React.useCallback((serviceName: string) => {
    setRetryAttempts(prev => {
      const newMap = new Map(prev);
      const currentAttempts = newMap.get(serviceName) || 0;
      newMap.set(serviceName, currentAttempts + 1);
      return newMap;
    });
  }, []);
  
  const isServiceFailed = React.useCallback((serviceName: string) => {
    return failedServices.has(serviceName);
  }, [failedServices]);
  
  const getRetryAttempts = React.useCallback((serviceName: string) => {
    return retryAttempts.get(serviceName) || 0;
  }, [retryAttempts]);
  
  const shouldShowFallback = React.useCallback((serviceName: string, maxRetries: number = 3) => {
    return isServiceFailed(serviceName) && getRetryAttempts(serviceName) >= maxRetries;
  }, [isServiceFailed, getRetryAttempts]);
  
  return {
    failedServices: Array.from(failedServices),
    markServiceAsFailed,
    markServiceAsWorking,
    incrementRetryAttempt,
    isServiceFailed,
    getRetryAttempts,
    shouldShowFallback
  };
}

export default ServiceFallback;