'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, RefreshCw, Home, Bug, Wrench, ExternalLink } from 'lucide-react';

interface DashboardErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  onReset?: () => void;
  toolName?: string;
}

interface DashboardErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
  errorType?: 'service_not_found' | 'function_missing' | 'api_connection' | 'network_error' | 'unknown';
}

class DashboardErrorBoundaryComponent extends React.Component<DashboardErrorBoundaryProps, DashboardErrorBoundaryState> {
  constructor(props: DashboardErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): DashboardErrorBoundaryState {
    const errorType = DashboardErrorBoundaryComponent.categorizeError(error);
    return { hasError: true, error, errorType };
  }

  static categorizeError(error: Error): DashboardErrorBoundaryState['errorType'] {
    const message = error.message.toLowerCase();
    
    if (message.includes('servicio no encontrado') || message.includes('service not found')) {
      return 'service_not_found';
    }
    if (message.includes('is not a function') || message.includes('no es una función')) {
      return 'function_missing';
    }
    if (message.includes('connection error') || message.includes('net::err_failed') || message.includes('apiconnectionerror')) {
      return 'api_connection';
    }
    if (message.includes('network') || message.includes('fetch') || message.includes('timeout')) {
      return 'network_error';
    }
    
    return 'unknown';
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    const errorType = DashboardErrorBoundaryComponent.categorizeError(error);
    
    console.group('🚨 Dashboard Error Boundary');
    console.error('Error Type:', errorType);
    console.error('Tool Name:', this.props.toolName || 'Unknown');
    console.error('Message:', error.message);
    console.error('Stack:', error.stack);
    console.error('Component Stack:', errorInfo.componentStack);
    console.groupEnd();
    
    this.setState({ errorInfo, errorType });
  }

  handleReset = () => {
    const { onReset } = this.props;
    
    this.setState({ hasError: false, error: undefined, errorType: undefined });
    
    if (typeof onReset === 'function') {
      onReset();
    }
  };

  getErrorContent() {
    const { error, errorType } = this.state;
    const { toolName } = this.props;
    
    switch (errorType) {
      case 'service_not_found':
        return {
          title: 'Servicio No Disponible',
          description: `El servicio para la herramienta "${toolName || 'desconocida'}" no está disponible actualmente.`,
          icon: <Wrench className="w-6 h-6 text-orange-500" />,
          color: 'orange',
          suggestions: [
            'Este servicio está en desarrollo o mantenimiento',
            'Intenta usar otras herramientas disponibles',
            'Contacta al soporte si el problema persiste'
          ]
        };
      
      case 'function_missing':
        return {
          title: 'Función No Implementada',
          description: `Una función requerida no está implementada en el servicio "${toolName || 'desconocido'}".`,
          icon: <Bug className="w-6 h-6 text-red-500" />,
          color: 'red',
          suggestions: [
            'Esta funcionalidad está en desarrollo',
            'Reporta este error para acelerar la implementación',
            'Usa herramientas alternativas mientras tanto'
          ]
        };
      
      case 'api_connection':
        return {
          title: 'Error de Conexión API',
          description: 'No se pudo conectar con los servicios externos necesarios.',
          icon: <ExternalLink className="w-6 h-6 text-blue-500" />,
          color: 'blue',
          suggestions: [
            'Verifica tu conexión a internet',
            'Los servicios externos pueden estar temporalmente no disponibles',
            'Intenta nuevamente en unos minutos'
          ]
        };
      
      case 'network_error':
        return {
          title: 'Error de Red',
          description: 'Problema de conectividad de red detectado.',
          icon: <AlertTriangle className="w-6 h-6 text-yellow-500" />,
          color: 'yellow',
          suggestions: [
            'Revisa tu conexión a internet',
            'Intenta recargar la página',
            'Contacta a tu proveedor de internet si persiste'
          ]
        };
      
      default:
        return {
          title: 'Error Inesperado',
          description: 'Ha ocurrido un error inesperado en el dashboard.',
          icon: <AlertTriangle className="w-6 h-6 text-red-500" />,
          color: 'red',
          suggestions: [
            'Intenta recargar la página',
            'Limpia la caché del navegador',
            'Reporta este error si continúa ocurriendo'
          ]
        };
    }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const errorContent = this.getErrorContent();
      const { error } = this.state;

      return (
        <div className="min-h-[400px] flex items-center justify-center p-4">
          <Card className="max-w-2xl w-full">
            <CardHeader className="text-center">
              <div className="flex items-center justify-center w-16 h-16 mx-auto bg-gray-100 rounded-full mb-4">
                {errorContent.icon}
              </div>
              <CardTitle className="text-xl text-gray-900">
                {errorContent.title}
              </CardTitle>
              <CardDescription className="text-base">
                {errorContent.description}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Error Details Alert */}
              <Alert className="border-gray-200 bg-gray-50">
                <Bug className="w-4 h-4" />
                <AlertDescription>
                  <strong>Error:</strong> {error?.message || 'Error desconocido'}
                </AlertDescription>
              </Alert>

              {/* Suggestions */}
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900">Sugerencias:</h4>
                <ul className="space-y-2">
                  {errorContent.suggestions.map((suggestion, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0" />
                      {suggestion}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  onClick={this.handleReset}
                  className="flex-1 flex items-center justify-center gap-2"
                  variant="primary"
                >
                  <RefreshCw className="w-4 h-4" />
                  Intentar de Nuevo
                </Button>
                
                <Button 
                  onClick={() => {
                    if (typeof window !== 'undefined') {
                      window.location.href = '/dashboard';
                    }
                  }}
                  variant="outline"
                  className="flex-1 flex items-center justify-center gap-2"
                >
                  <Home className="w-4 h-4" />
                  Volver al Dashboard
                </Button>
              </div>

              {/* Development Details */}
              {process.env.NODE_ENV === 'development' && error && (
                <details className="mt-6">
                  <summary className="cursor-pointer text-sm font-medium text-gray-600 hover:text-gray-800">
                    Detalles Técnicos (Desarrollo)
                  </summary>
                  <div className="mt-3 space-y-2">
                    <div className="text-xs bg-gray-100 p-3 rounded-lg overflow-auto">
                      <div className="font-medium text-gray-700 mb-1">Error Message:</div>
                      <div className="text-gray-600">{error.message}</div>
                    </div>
                    {error.stack && (
                      <div className="text-xs bg-gray-100 p-3 rounded-lg overflow-auto max-h-32">
                        <div className="font-medium text-gray-700 mb-1">Stack Trace:</div>
                        <pre className="text-gray-600 whitespace-pre-wrap">{error.stack}</pre>
                      </div>
                    )}
                  </div>
                </details>
              )}
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default DashboardErrorBoundaryComponent;

// Hook para usar el error boundary de forma más sencilla
export function useDashboardErrorHandler() {
  const [error, setError] = React.useState<Error | null>(null);
  
  const handleError = React.useCallback((error: Error) => {
    console.error('Dashboard Error:', error);
    setError(error);
  }, []);
  
  const clearError = React.useCallback(() => {
    setError(null);
  }, []);
  
  return { error, handleError, clearError };
}

// Componente wrapper para facilitar el uso
export function DashboardErrorBoundary({ children, toolName }: { children: React.ReactNode; toolName?: string }) {
  return (
    <DashboardErrorBoundaryComponent toolName={toolName}>
      {children}
    </DashboardErrorBoundaryComponent>
  );
}