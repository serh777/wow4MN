'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Icons } from '@/components/icons';

// Componente IconWrapper
const IconWrapper = ({ icon, className }: { icon: keyof typeof Icons, className?: string }) => {
  const Icon = Icons[icon] || Icons.settings;
  return <Icon className={className} />;
};

interface ErrorStateProps {
  error: string;
  onRetry: () => void;
  onBackToHome: () => void;
}

export default function ErrorState({ error, onRetry, onBackToHome }: ErrorStateProps) {
  const getErrorDetails = (errorMessage: string) => {
    if (errorMessage.includes('network')) {
      return {
        title: 'Error de Conexión',
        description: 'No se pudo conectar con la red blockchain.',
        suggestions: [
          'Verifica tu conexión a internet',
          'Comprueba que la URL del contrato sea correcta',
          'Intenta cambiar de red blockchain'
        ]
      };
    }
    
    if (errorMessage.includes('contract')) {
      return {
        title: 'Error del Contrato',
        description: 'El contrato inteligente no pudo ser analizado.',
        suggestions: [
          'Verifica que la dirección del contrato sea válida',
          'Asegúrate de que el contrato esté desplegado',
          'Comprueba que el contrato tenga metadatos públicos'
        ]
      };
    }
    
    if (errorMessage.includes('metadata')) {
      return {
        title: 'Error de Metadatos',
        description: 'No se pudieron extraer los metadatos del contrato.',
        suggestions: [
          'El contrato puede no tener metadatos configurados',
          'Verifica que el contrato implemente estándares como ERC-721 o ERC-1155',
          'Comprueba la configuración de metadatos del contrato'
        ]
      };
    }
    
    return {
      title: 'Error Desconocido',
      description: 'Ocurrió un error inesperado durante el análisis.',
      suggestions: [
        'Intenta realizar el análisis nuevamente',
        'Verifica que todos los parámetros sean correctos',
        'Contacta al soporte si el problema persiste'
      ]
    };
  };

  const errorDetails = getErrorDetails(error);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-6">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
            <IconWrapper icon="alertTriangle" className="h-8 w-8 text-red-600 dark:text-red-400" />
          </div>
          <CardTitle className="text-xl text-red-600 dark:text-red-400">
            {errorDetails.title}
          </CardTitle>
          <CardDescription>
            {errorDetails.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert variant="destructive">
            <IconWrapper icon="alertCircle" className="h-4 w-4" />
            <AlertDescription className="text-sm">
              {error}
            </AlertDescription>
          </Alert>
          
          <div className="space-y-3">
            <h4 className="text-sm font-medium">Posibles soluciones:</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {errorDetails.suggestions.map((suggestion, index) => (
                <li key={index} className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground mt-2 flex-shrink-0" />
                  <span>{suggestion}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="flex gap-3">
            <Button onClick={onRetry} className="flex-1">
              <IconWrapper icon="refresh" className="mr-2 h-4 w-4" />
              Reintentar
            </Button>
            <Button variant="outline" onClick={onBackToHome} className="flex-1">
              <IconWrapper icon="home" className="mr-2 h-4 w-4" />
              Volver
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}