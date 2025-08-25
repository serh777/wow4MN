'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useWeb3Safe } from '@/hooks/useWeb3Safe';
import { useMobileWallet } from '@/hooks/useMobileWallet';
import { MobileWalletInfo } from './mobile-wallet-info';
import { 
  Loader2, Wallet, Smartphone, Globe, AlertTriangle, 
  CheckCircle, ExternalLink, Wifi, WifiOff 
} from 'lucide-react';
import { isMobileDevice, isMobileWalletApp, isMobileBrowser, openMobileWallet } from '@/config/wallet/mobile';

interface UnifiedWalletConnectProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
  className?: string;
  variant?: 'primary' | 'outline' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  showMobileInfo?: boolean;
  showBrowserInfo?: boolean;
}

export function UnifiedWalletConnect({
  onSuccess,
  onError,
  className = '',
  variant = 'primary',
  size = 'md',
  showMobileInfo = true,
  showBrowserInfo = true
}: UnifiedWalletConnectProps) {
  const { address, isConnecting, connect } = useWeb3Safe();
  const { isMobile, hasWalletApp, detectedWallets } = useMobileWallet();
  const [isConnectingLocal, setIsConnectingLocal] = useState(false);
  const [browserType, setBrowserType] = useState<'web3' | 'web2' | 'unknown'>('unknown');
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'connecting' | 'connected' | 'error'>('idle');

  // Detectar tipo de navegador al montar
  useEffect(() => {
    const detectBrowserType = () => {
      if (typeof window === 'undefined') return 'unknown';
      
      // Verificar si es navegador Web3
      const hasEthereum = !!(window as any).ethereum;
      const hasWeb3 = !!(window as any).web3;
      const hasProviders = !!(window as any).ethereum?.providers;
      
      if (hasEthereum || hasWeb3 || hasProviders) {
        setBrowserType('web3');
      } else {
        setBrowserType('web2');
      }
    };

    detectBrowserType();
    
    // Escuchar cambios en el provider
    const handleProviderChange = () => {
      detectBrowserType();
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('ethereum#initialized', handleProviderChange);
      
      // Verificar periódicamente por si se instala un wallet
      const interval = setInterval(detectBrowserType, 2000);
      
      return () => {
        window.removeEventListener('ethereum#initialized', handleProviderChange);
        clearInterval(interval);
      };
    }
  }, []);

  // Actualizar estado de conexión
  useEffect(() => {
    if (address) {
      setConnectionStatus('connected');
    } else if (isConnecting || isConnectingLocal) {
      setConnectionStatus('connecting');
    } else {
      setConnectionStatus('idle');
    }
  }, [address, isConnecting, isConnectingLocal]);

  const handleConnect = async () => {
    if (isConnecting || isConnectingLocal) return;
    
    setIsConnectingLocal(true);
    setConnectionStatus('connecting');
    
    try {
      await connect();
      setConnectionStatus('connected');
      onSuccess?.();
    } catch (error) {
      setConnectionStatus('error');
      const errorMessage = error instanceof Error ? error.message : 'Error al conectar wallet';
      onError?.(errorMessage);
      console.error('Error connecting wallet:', error);
    } finally {
      setIsConnectingLocal(false);
    }
  };

  const handleMobileWalletOpen = (walletKey: 'metamask' | 'trust' | 'coinbase' | 'rainbow') => {
    openMobileWallet(walletKey);
  };

  // Si ya está conectado, mostrar estado conectado
  if (address) {
    return (
      <div className={`flex items-center space-x-2 p-3 bg-green-50 border border-green-200 rounded-lg ${className}`}>
        <CheckCircle className="h-4 w-4 text-green-600" />
        <span className="text-sm font-medium text-green-800">
          Conectado: {address.slice(0, 6)}...{address.slice(-4)}
        </span>
        <Badge variant="secondary" className="text-xs">
          {browserType === 'web3' ? 'Web3' : 'Web2'}
        </Badge>
      </div>
    );
  }

  const isLoading = isConnecting || isConnectingLocal;
  const isMobileEnv = isMobileDevice();
  const isInWalletApp = isMobileWalletApp();
  const isInMobileBrowser = isMobileBrowser();

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Información del navegador */}
      {showBrowserInfo && (
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {browserType === 'web3' ? (
                  <Wifi className="h-4 w-4 text-green-500" />
                ) : (
                  <WifiOff className="h-4 w-4 text-orange-500" />
                )}
                <span className="text-sm font-medium">
                  {browserType === 'web3' ? 'Navegador Web3' : 'Navegador Web2'}
                </span>
              </div>
              <Badge 
                variant={browserType === 'web3' ? 'default' : 'secondary'}
                className="text-xs"
              >
                {browserType === 'web3' ? 'Óptimo' : 'Limitado'}
              </Badge>
            </div>
            
            {browserType === 'web2' && (
              <div className="mt-2 text-xs text-orange-600">
                Para mejor experiencia, usa un navegador Web3 como MetaMask Browser
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Botón principal de conexión */}
      <Button
        onClick={handleConnect}
        disabled={isLoading || (isMobileEnv && browserType === 'web2' && !isInWalletApp)}
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
            {isMobileEnv ? (
              <Smartphone className="mr-2 h-4 w-4" />
            ) : (
              <Wallet className="mr-2 h-4 w-4" />
            )}
            {isMobileEnv ? 'Conectar Wallet Móvil' : 'Conectar Wallet'}
          </>
        )}
      </Button>

      {/* Información específica para móvil */}
      {showMobileInfo && isMobileEnv && (
        <div className="space-y-3">
          
          {/* Estado de detección en app wallet */}
          {isInWalletApp && (
            <Card className="border-l-4 border-l-green-500">
              <CardContent className="p-3">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium text-green-800">
                    Navegador Web3 móvil detectado
                  </span>
                </div>
                <div className="text-xs text-green-700 mt-1">
                  Conexión óptima disponible
                </div>
              </CardContent>
            </Card>
          )}

          {/* Estado en navegador móvil Web2 */}
          {isInMobileBrowser && browserType === 'web2' && (
            <Card className="border-l-4 border-l-orange-500">
              <CardContent className="p-3">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-4 w-4 text-orange-500" />
                  <span className="text-sm font-medium text-orange-800">
                    Navegador Web2 móvil
                  </span>
                </div>
                <div className="text-xs text-orange-700 mt-1">
                  Funcionalidad limitada. Recomendamos usar una app wallet.
                </div>
                
                {/* Botones para abrir wallets móviles */}
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleMobileWalletOpen('metamask')}
                    className="text-xs"
                  >
                    <ExternalLink className="h-3 w-3 mr-1" />
                    MetaMask
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleMobileWalletOpen('trust')}
                    className="text-xs"
                  >
                    <ExternalLink className="h-3 w-3 mr-1" />
                    Trust
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleMobileWalletOpen('coinbase')}
                    className="text-xs"
                  >
                    <ExternalLink className="h-3 w-3 mr-1" />
                    Coinbase
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleMobileWalletOpen('rainbow')}
                    className="text-xs"
                  >
                    <ExternalLink className="h-3 w-3 mr-1" />
                    Rainbow
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Wallets detectadas */}
          {hasWalletApp && detectedWallets.length > 0 && (
            <Card className="border-l-4 border-l-blue-500">
              <CardContent className="p-3">
                <div className="flex items-center space-x-2">
                  <Wallet className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-medium text-blue-800">
                    {detectedWallets.length} wallet{detectedWallets.length > 1 ? 's' : ''} detectada{detectedWallets.length > 1 ? 's' : ''}
                  </span>
                </div>
                <div className="text-xs text-blue-700 mt-1">
                  {detectedWallets.join(', ')}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Información adicional para móvil */}
          <MobileWalletInfo />
        </div>
      )}

      {/* Estado de error */}
      {connectionStatus === 'error' && (
        <Card className="border-l-4 border-l-red-500">
          <CardContent className="p-3">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              <span className="text-sm font-medium text-red-800">
                Error de conexión
              </span>
            </div>
            <div className="text-xs text-red-700 mt-1">
              Verifica tu wallet y vuelve a intentar
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recomendaciones según el entorno */}
      {isMobileEnv && browserType === 'web2' && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-3">
            <div className="text-sm font-medium text-blue-800 mb-2">
              💡 Recomendaciones para móvil:
            </div>
            <ul className="text-xs text-blue-700 space-y-1">
              <li>• Usa el navegador integrado de tu wallet (MetaMask, Trust, etc.)</li>
              <li>• O instala una app wallet compatible</li>
              <li>• Para mejor experiencia, usa un navegador Web3</li>
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default UnifiedWalletConnect;