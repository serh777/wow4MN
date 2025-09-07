'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  onReset?: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

class ErrorBoundaryComponent extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // Detectar errores de hidratacion especificos
    const isHydrationError = error.message.includes('Hydration') || 
                           error.message.includes('client-side exception') ||
                           error.message.includes('Text content does not match');
    
    // Log detallado para debugging
    console.warn('Error caught by boundary:');
    console.warn('Message:', error.message || 'Unknown error');
    console.warn('Name:', error.name || 'Error');
    console.warn('Is Hydration Error:', isHydrationError);
    
    if (error.stack) {
      console.warn('Stack:', error.stack);
    }
    if (errorInfo.componentStack) {
      console.warn('Component stack:', errorInfo.componentStack);
    }
    
    // Actualizar estado con informacion del error
    this.setState({ errorInfo });
  }

  handleReset = () => {
    const { onReset } = this.props;
    
    this.setState({ hasError: false, error: undefined });
    
    if (typeof onReset === 'function') {
      onReset();
    }
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const isHydrationError = this.state.error?.message.includes('Hydration') || 
                              this.state.error?.message.includes('client-side exception') ||
                              this.state.error?.message.includes('Text content does not match');

      return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
          <Card className="max-w-lg w-full">
            <CardHeader className="text-center">
              <div className="flex items-center justify-center w-12 h-12 mx-auto bg-destructive/10 rounded-full mb-4">
                <AlertTriangle className="w-6 h-6 text-destructive" />
              </div>
              <CardTitle className="text-xl">
                {isHydrationError ? 'Error de Navegacion' : 'Algo salio mal'}
              </CardTitle>
              <CardDescription>
                {isHydrationError 
                  ? 'Ha ocurrido un error al navegar entre paginas. Esto es normal en algunas ocasiones.'
                  : 'Ha ocurrido un error inesperado en la aplicacion.'
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isHydrationError && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    <strong>Es normal este error?</strong><br />
                    Si, estos errores pueden ocurrir ocasionalmente al navegar hacia atras o entre paginas. 
                    Simplemente recarga la pagina o navega a otra seccion.
                  </p>
                </div>
              )}
              
              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  onClick={this.handleReset}
                  className="flex-1"
                  variant="secondary"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Intentar de nuevo
                </Button>
                <Button 
                  onClick={() => {
                    if (typeof window !== 'undefined') {
                      window.location.replace('/dashboard');
                    }
                  }}
                  variant="outline"
                  className="flex-1"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Ir al Dashboard
                </Button>
              </div>
              
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="mt-4">
                  <summary className="cursor-pointer text-sm font-medium text-muted-foreground">
                    Detalles del error (desarrollo)
                  </summary>
                  <pre className="mt-2 text-xs bg-muted p-3 rounded overflow-auto max-h-32">
                    {this.state.error.message}
                  </pre>
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

export default ErrorBoundaryComponent;