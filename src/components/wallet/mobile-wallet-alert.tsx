'use client';

import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useMobileWallet } from '@/hooks/useMobileWallet';
import { isMobileDevice } from '@/config/wallet/mobile';
import { 
  AlertTriangle, 
  Smartphone, 
  ExternalLink,
  Download,
  RefreshCw
} from 'lucide-react';

interface MobileWalletAlertProps {
  className?: string;
  showDiagnosticLink?: boolean;
  onRefresh?: () => void;
}

export function MobileWalletAlert({ 
  className = '', 
  showDiagnosticLink = true,
  onRefresh 
}: MobileWalletAlertProps) {
  const { isMobile, hasWalletApp, detectedWallets, detectUserAgent } = useMobileWallet();
  const userAgentInfo = detectUserAgent();

  // No mostrar en desktop
  if (!isMobile) {
    return null;
  }

  // Si todo está bien, no mostrar alerta
  if (hasWalletApp && detectedWallets.length > 0) {
    return null;
  }

  const getAlertType = () => {
    if (!hasWalletApp && detectedWallets.length === 0) {
      return 'error'; // No hay wallets detectadas
    }
    if (hasWalletApp && detectedWallets.length === 0) {
      return 'warning'; // Hay wallet pero no se detecta correctamente
    }
    return 'info';
  };

  const getAlertMessage = () => {
    if (!hasWalletApp && detectedWallets.length === 0) {
      return {
        title: '❌ No se detectaron wallets móviles',
        description: 'Para usar Web3 en móvil, necesitas instalar una wallet compatible o usar WalletConnect.',
        solutions: [
          'Instala MetaMask, Trust Wallet, o Coinbase Wallet',
          'Abre esta página desde el navegador de tu wallet',
          'Usa WalletConnect desde cualquier navegador'
        ]
      };
    }
    
    if (hasWalletApp && detectedWallets.length === 0) {
      return {
        title: '⚠️ Wallet instalada pero no detectada',
        description: 'Tienes una wallet instalada pero no se está detectando correctamente.',
        solutions: [
          'Abre esta página desde el navegador integrado de tu wallet',
          'Actualiza tu app de wallet a la última versión',
          'Usa WalletConnect como alternativa'
        ]
      };
    }

    return {
      title: 'ℹ️ Información de wallet móvil',
      description: 'Configuración de wallet móvil detectada.',
      solutions: []
    };
  };

  const alertInfo = getAlertMessage();
  const alertType = getAlertType();

  const getAlertStyles = () => {
    switch (alertType) {
      case 'error':
        return 'border-red-200 bg-red-50';
      case 'warning':
        return 'border-yellow-200 bg-yellow-50';
      default:
        return 'border-blue-200 bg-blue-50';
    }
  };

  const openWalletStore = () => {
    const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
    const storeUrl = isIOS 
      ? 'https://apps.apple.com/search?term=metamask%20wallet'
      : 'https://play.google.com/store/search?q=metamask%20wallet';
    window.open(storeUrl, '_blank');
  };

  return (
    <Alert className={`${getAlertStyles()} ${className}`}>
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">
          {alertType === 'error' && <AlertTriangle className="h-5 w-5 text-red-600" />}
          {alertType === 'warning' && <AlertTriangle className="h-5 w-5 text-yellow-600" />}
          {alertType === 'info' && <Smartphone className="h-5 w-5 text-blue-600" />}
        </div>
        
        <div className="flex-1">
          <AlertDescription>
            <div className="space-y-3">
              <div>
                <h4 className="font-medium text-sm mb-1">{alertInfo.title}</h4>
                <p className="text-sm text-gray-700">{alertInfo.description}</p>
              </div>

              {/* Estado actual */}
              <div className="flex flex-wrap gap-2">
                <Badge variant={hasWalletApp ? 'default' : 'destructive'} className="text-xs">
                  {hasWalletApp ? '✓ Wallet App' : '✗ No Wallet App'}
                </Badge>
                <Badge variant={detectedWallets.length > 0 ? 'default' : 'secondary'} className="text-xs">
                  {detectedWallets.length} detectadas
                </Badge>
                <Badge variant={userAgentInfo.hasWallet ? 'default' : 'secondary'} className="text-xs">
                  {userAgentInfo.hasWallet ? `${userAgentInfo.walletName}` : 'Navegador estándar'}
                </Badge>
              </div>

              {/* Soluciones */}
              {alertInfo.solutions.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-gray-800 mb-2">Soluciones recomendadas:</p>
                  <ul className="text-xs text-gray-700 space-y-1">
                    {alertInfo.solutions.map((solution, index) => (
                      <li key={index} className="flex items-start gap-1">
                        <span className="text-gray-400 mt-0.5">•</span>
                        <span>{solution}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Acciones */}
              <div className="flex flex-wrap gap-2">
                {!hasWalletApp && (
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={openWalletStore}
                    className="text-xs h-8"
                  >
                    <Download className="h-3 w-3 mr-1" />
                    Instalar Wallet
                  </Button>
                )}
                
                {showDiagnosticLink && (
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => window.open('/mobile-wallet-debug', '_blank')}
                    className="text-xs h-8"
                  >
                    <ExternalLink className="h-3 w-3 mr-1" />
                    Diagnóstico
                  </Button>
                )}
                
                {onRefresh && (
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={onRefresh}
                    className="text-xs h-8"
                  >
                    <RefreshCw className="h-3 w-3 mr-1" />
                    Actualizar
                  </Button>
                )}
              </div>
            </div>
          </AlertDescription>
        </div>
      </div>
    </Alert>
  );
}

export default MobileWalletAlert;