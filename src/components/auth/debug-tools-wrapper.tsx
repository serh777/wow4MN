'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useSuperUser } from '@/hooks/useSuperUser';
import { SuperUserLogin } from './super-user-login';
import { 
  Settings, 
  Shield, 
  Eye, 
  EyeOff,
  LogOut,
  User
} from 'lucide-react';

interface DebugToolsWrapperProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  className?: string;
  showInDevelopment?: boolean;
}

export function DebugToolsWrapper({ 
  children, 
  title = "Herramientas de Diagnóstico",
  description = "Herramientas avanzadas para diagnóstico y configuración",
  className = '',
  showInDevelopment = true
}: DebugToolsWrapperProps) {
  const {
    isAuthenticated,
    isLoading,
    email,
    showLoginForm,
    setShowLoginForm,
    logout,
    shouldShowDebugTools
  } = useSuperUser();
  
  const [isVisible, setIsVisible] = useState(false);

  // En desarrollo, mostrar siempre si showInDevelopment es true
  const isDevelopment = process.env.NODE_ENV === 'development';
  const canShowTools = shouldShowDebugTools();

  // Si no se pueden mostrar las herramientas, no renderizar nada
  if (!canShowTools) {
    return null;
  }

  // Si está cargando, mostrar indicador
  if (isLoading) {
    return (
      <div className={`p-4 border border-gray-200 rounded-lg bg-gray-50 ${className}`}>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Settings className="h-4 w-4 animate-spin" />
          Verificando permisos...
        </div>
      </div>
    );
  }

  // Si no está autenticado en producción, mostrar botón de acceso
  if (!isDevelopment && !isAuthenticated) {
    return (
      <>
        <div className={`p-4 border border-blue-200 rounded-lg bg-blue-50 ${className}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-600" />
              <div>
                <h3 className="font-medium text-blue-900">{title}</h3>
                <p className="text-sm text-blue-700">{description}</p>
              </div>
            </div>
            <Button
              onClick={() => setShowLoginForm(true)}
              variant="outline"
              size="sm"
              className="border-blue-300 text-blue-700 hover:bg-blue-100"
            >
              <User className="h-4 w-4 mr-1" />
              Acceso Admin
            </Button>
          </div>
        </div>
        
        {showLoginForm && (
          <SuperUserLogin onClose={() => setShowLoginForm(false)} />
        )}
      </>
    );
  }

  // Si está autenticado o en desarrollo, mostrar las herramientas
  return (
    <div className={`border border-gray-200 rounded-lg ${className}`}>
      {/* Header con información de estado */}
      <div className="p-3 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-gray-600" />
            <div>
              <h3 className="font-medium text-gray-900">{title}</h3>
              <p className="text-xs text-gray-600">{description}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Badge de estado */}
            {isDevelopment ? (
              <Badge variant="secondary" className="text-xs">
                Desarrollo
              </Badge>
            ) : (
              <Badge variant="default" className="text-xs">
                Admin: {email}
              </Badge>
            )}
            
            {/* Botón de visibilidad */}
            <Button
              onClick={() => setIsVisible(!isVisible)}
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
            >
              {isVisible ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>
            
            {/* Botón de logout solo en producción */}
            {!isDevelopment && isAuthenticated && (
              <Button
                onClick={logout}
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                title="Cerrar sesión de admin"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
      
      {/* Contenido de las herramientas */}
      {isVisible && (
        <div className="p-4">
          {children}
        </div>
      )}
      
      {/* Información de estado cuando está colapsado */}
      {!isVisible && (
        <div className="p-3 text-center">
          <p className="text-xs text-gray-500">
            Herramientas de diagnóstico disponibles - Click en el ojo para mostrar
          </p>
        </div>
      )}
    </div>
  );
}

export default DebugToolsWrapper;