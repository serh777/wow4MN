'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { useWeb3Safe } from '@/hooks/useWeb3Safe';
import { IconWrapper } from '@/components/ui/icon-wrapper';
import { UnifiedWalletConnect } from '@/components/wallet/unified-wallet-connect';
import { Loader2, ArrowLeft } from 'lucide-react';

export default function WalletLoginPage() {
  const [isClient, setIsClient] = React.useState(false);
  const { signInWithWallet, loading, user } = useAuth();
  const router = useRouter();
  
  // Usar el hook seguro que maneja SSR
  const { address } = useWeb3Safe();

  // Establecer cliente
  React.useEffect(() => {
    setIsClient(true);
  }, []);

  // Redirigir si ya está autenticado
  React.useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  const handleWalletSuccess = async () => {
    try {
      if (!address) {
        toast.error('No se pudo obtener la dirección de la wallet');
        return;
      }
      console.log('✅ Wallet conectada:', address);
      // Autenticar con la wallet conectada
      await signInWithWallet(address);
      console.log('✅ Autenticación completada');
      toast.success('¡Conectado exitosamente! Redirigiendo...');
      // La redirección se maneja automáticamente en AuthContext
    } catch (error: any) {
      console.error('💥 Error en autenticación:', error);
      toast.error('Error de autenticación. Inténtalo nuevamente');
    }
  };

  const handleWalletError = (error: any) => {
    console.error('💥 Error en wallet login:', error);
    
    // Manejar errores específicos
    let errorMessage = 'Error al conectar con wallet';
    
    if (error.message?.includes('User rejected')) {
      errorMessage = 'Conexión cancelada por el usuario';
    } else if (error.message?.includes('No provider')) {
      errorMessage = 'No se encontró una wallet compatible';
    } else if (error.message?.includes('Network')) {
      errorMessage = 'Error de red. Verifica tu conexión';
    } else if (error.message?.includes('Invalid login credentials')) {
      errorMessage = 'Error de autenticación. Inténtalo nuevamente';
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    toast.error(errorMessage);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-6">
        <Card>
          <CardHeader className="space-y-1">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push('/')}
                className="p-2"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <CardTitle className="text-2xl">Acceso con Wallet</CardTitle>
                <CardDescription>
                  Conecta tu wallet Web3 para acceder a WowSeoWeb3
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Componente unificado de conexión con wallet */}
            {isClient && (
              <UnifiedWalletConnect
                onSuccess={handleWalletSuccess}
                onError={handleWalletError}
                size="lg"
                className="w-full"
                variant="outline"
                showMobileInfo={true}
              />
            )}
            
            {/* Información sobre autenticación con wallet mejorada */}
            <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-start gap-3">
                <IconWrapper icon="shield" className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-blue-700 dark:text-blue-300">
                  <p className="font-semibold mb-2">🔐 Acceso Web3 Privado y Seguro</p>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                      <span>Autenticación sin contraseñas usando tu wallet</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                      <span>Datos mínimos: solo dirección wallet (hasheada)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                      <span>Historial de análisis vinculado a tu identidad Web3</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                      <span>Control total: puedes eliminar tus datos cuando quieras</span>
                    </div>
                  </div>
                  <div className="mt-3 pt-2 border-t border-blue-200 dark:border-blue-700">
                    <p className="text-xs font-medium text-blue-600 dark:text-blue-400">
                      💡 Tu privacidad es nuestra prioridad. Solo guardamos lo esencial para mejorar tu experiencia.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Separador */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  ¿Prefieres email?
                </span>
              </div>
            </div>

            {/* Botón para ir al login con email */}
            <Button
              variant="ghost"
              className="w-full"
              onClick={() => router.push('/auth/email-login')}
            >
              Acceder con Email
            </Button>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}