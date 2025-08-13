'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useWeb3Safe } from '@/hooks/useWeb3Safe';
import { useAuth } from '@/contexts/AuthContext';
import { useMobileWallet } from '@/hooks/useMobileWallet';
import { MobileWalletInfo } from './mobile-wallet-info';
import { MobileWalletAlert } from './mobile-wallet-alert';
import { DebugToolsWrapper } from '@/components/auth/debug-tools-wrapper';
import { Loader2, Wallet, Smartphone } from 'lucide-react';
import { toast } from 'sonner';

interface HomeWalletConnectProps {
  className?: string;
  variant?: 'primary' | 'outline' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  showMobileInfo?: boolean;
}

export function HomeWalletConnect({
  className = '',
  variant = 'primary',
  size = 'md',
  showMobileInfo = true
}: HomeWalletConnectProps) {
  const router = useRouter();
  const { address, isConnecting, connect } = useWeb3Safe();
  const { signInWithWallet } = useAuth();
  const { isMobile, hasWalletApp, detectedWallets } = useMobileWallet();
  const [isConnectingLocal, setIsConnectingLocal] = useState(false);

  const handleConnect = async () => {
    if (isConnecting || isConnectingLocal) return;
    
    setIsConnectingLocal(true);
    
    try {
      // Primero conectar la wallet
      const walletAddress = await connect();
      
      if (walletAddress) {
        console.log('✅ Wallet conectada desde home:', walletAddress);
        
        // Luego autenticar con la wallet
        await signInWithWallet(walletAddress);
        
        console.log('✅ Autenticación completada desde home');
        toast.success('¡Conectado exitosamente! Redirigiendo al dashboard...');
        
        // Redirección automática al dashboard
        setTimeout(() => {
          router.push('/dashboard');
        }, 1000);
      }
    } catch (error) {
      console.error('💥 Error en conexión desde home:', error);
      
      let errorMessage = 'Error al conectar wallet';
      
      if (error instanceof Error) {
        if (error.message.includes('User rejected')) {
          errorMessage = 'Conexión cancelada por el usuario';
        } else if (error.message.includes('No provider')) {
          errorMessage = 'No se encontró una wallet compatible';
        } else if (error.message.includes('Network')) {
          errorMessage = 'Error de red. Verifica tu conexión';
        } else {
          errorMessage = error.message;
        }
      }
      
      toast.error(errorMessage);
    } finally {
      setIsConnectingLocal(false);
    }
  };

  // Si ya está conectado, mostrar estado conectado
  if (address) {
    return (
      <div className={`flex items-center space-x-2 p-3 bg-green-50 border border-green-200 rounded-lg ${className}`}>
        <Wallet className="h-4 w-4 text-green-600" />
        <span className="text-sm font-medium text-green-800">
          Conectado: {address.slice(0, 6)}...{address.slice(-4)}
        </span>
      </div>
    );
  }

  const isLoading = isConnecting || isConnectingLocal;

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Botón principal de conexión */}
      <Button
        onClick={handleConnect}
        disabled={isLoading}
        variant={variant}
        size={size}
        className="w-full"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Conectando...
          </>
        ) : (
          <>
            {isMobile ? (
              <Smartphone className="mr-2 h-4 w-4" />
            ) : (
              <Wallet className="mr-2 h-4 w-4" />
            )}
            Conectar Wallet
          </>
        )}
      </Button>

      {/* Información específica para móvil */}
      {isMobile && (
        <div className="mt-4 space-y-3">
          {/* Mobile wallet alert - Solo visible para superusuarios en producción */}
          <DebugToolsWrapper 
            title="Alertas de Diagnóstico Móvil"
            description="Alertas y diagnósticos para problemas de wallet móvil"
            className="mb-4"
          >
            <MobileWalletAlert onRefresh={() => window.location.reload()} />
          </DebugToolsWrapper>
          
          {detectedWallets.length > 0 && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800 font-medium mb-1">
                ✅ {detectedWallets.length} wallet{detectedWallets.length > 1 ? 's' : ''} detectada{detectedWallets.length > 1 ? 's' : ''}
              </p>
              <div className="text-xs text-green-700">
                {detectedWallets.join(', ')}
              </div>
            </div>
          )}

          {/* Componente de información móvil completo */}
          <MobileWalletInfo />
        </div>
      )}
    </div>
  );
}

export default HomeWalletConnect;