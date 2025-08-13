'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useWeb3Safe } from '@/hooks/useWeb3Safe';
import { useMobileWallet } from '@/hooks/useMobileWallet';
import { MobileWalletInfo } from './mobile-wallet-info';
import { Loader2, Wallet, Smartphone } from 'lucide-react';

interface UnifiedWalletConnectProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
  className?: string;
  variant?: 'primary' | 'outline' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  showMobileInfo?: boolean;
}

export function UnifiedWalletConnect({
  onSuccess,
  onError,
  className = '',
  variant = 'primary',
  size = 'md',
  showMobileInfo = true
}: UnifiedWalletConnectProps) {
  const { address, isConnecting, connect } = useWeb3Safe();
  const { isMobile, hasWalletApp, detectedWallets } = useMobileWallet();
  const [isConnectingLocal, setIsConnectingLocal] = useState(false);

  const handleConnect = async () => {
    if (isConnecting || isConnectingLocal) return;
    
    setIsConnectingLocal(true);
    
    try {
      await connect();
      onSuccess?.();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al conectar wallet';
      onError?.(errorMessage);
      console.error('Error connecting wallet:', error);
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
            {isMobile ? 'Conectar Wallet Móvil' : 'Conectar Wallet'}
          </>
        )}
      </Button>

      {/* Información específica para móvil */}
      {showMobileInfo && isMobile && (
        <div className="space-y-3">
          {/* Estado de detección */}
          {hasWalletApp && detectedWallets.length > 0 ? (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800 font-medium mb-2">
                ✅ {detectedWallets.length} wallet{detectedWallets.length > 1 ? 's' : ''} detectada{detectedWallets.length > 1 ? 's' : ''}
              </p>
              <div className="text-xs text-green-700">
                {detectedWallets.join(', ')}
              </div>
            </div>
          ) : (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-sm text-amber-800 font-medium mb-2">
                ⚠️ No se detectaron wallets instaladas
              </p>
              <p className="text-xs text-amber-700">
                Instala una wallet móvil para continuar
              </p>
            </div>
          )}

          {/* Componente de información móvil completo */}
          <MobileWalletInfo />
        </div>
      )}
    </div>
  );
}

export default UnifiedWalletConnect;