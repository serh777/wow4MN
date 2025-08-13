'use client';

import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
  showLoader?: boolean;
}

export function ProtectedRoute({ 
  children, 
  redirectTo = '/register',
  showLoader = true 
}: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      // Redirigir a la página de registro si no está autenticado
      router.push(redirectTo);
    }
  }, [user, loading, router, redirectTo]);

  // Mostrar loader mientras se verifica la autenticación
  if (loading) {
    if (!showLoader) return null;
    
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  // Si no hay usuario, no renderizar nada (se redirigirá)
  if (!user) {
    return null;
  }

  // Si hay usuario, renderizar el contenido protegido
  return <>{children}</>;
}

// Hook personalizado para verificar autenticación en componentes
export function useRequireAuth(redirectTo: string = '/register') {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push(redirectTo);
    }
  }, [user, loading, router, redirectTo]);

  return { user, loading, isAuthenticated: !!user };
}