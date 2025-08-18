'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useMobileWallet } from '@/hooks/useMobileWallet';
import { isMobileDevice, isIOS, isAndroid, isMobileWalletApp } from '@/config/wallet/mobile';
import { 
  Smartphone, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  RefreshCw,
  ExternalLink,
  Info
} from 'lucide-react';

interface DiagnosticTest {
  name: string;
  status: 'pass' | 'fail' | 'warning' | 'info';
  message: string;
  solution?: string;
  action?: () => void;
}

export function MobileWalletTroubleshooting() {
  const { isMobile, hasWalletApp, detectedWallets, detectUserAgent } = useMobileWallet();
  const [tests, setTests] = useState<DiagnosticTest[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const runDiagnostics = useCallback(async () => {
    setIsRunning(true);
    const diagnosticTests: DiagnosticTest[] = [];

    // Test 1: Detección de dispositivo móvil
    diagnosticTests.push({
      name: 'Dispositivo Móvil',
      status: isMobile ? 'pass' : 'fail',
      message: isMobile ? 'Dispositivo móvil detectado correctamente' : 'No se detectó como dispositivo móvil',
      solution: !isMobile ? 'Asegúrate de estar usando un dispositivo móvil' : undefined
    });

    // Test 2: Sistema operativo
    const platform = isIOS() ? 'iOS' : isAndroid() ? 'Android' : 'Desconocido';
    diagnosticTests.push({
      name: 'Sistema Operativo',
      status: platform !== 'Desconocido' ? 'pass' : 'warning',
      message: `Plataforma detectada: ${platform}`,
      solution: platform === 'Desconocido' ? 'Verifica que estés usando iOS o Android' : undefined
    });

    // Test 3: Proveedor Ethereum
    const hasEthereum = typeof window !== 'undefined' && !!(window as any).ethereum;
    diagnosticTests.push({
      name: 'Proveedor Ethereum',
      status: hasEthereum ? 'pass' : 'warning',
      message: hasEthereum ? 'window.ethereum detectado' : 'window.ethereum no disponible',
      solution: !hasEthereum ? 'Abre esta página desde el navegador de tu wallet o usa WalletConnect' : undefined
    });

    // Test 4: Wallets detectadas
    diagnosticTests.push({
      name: 'Wallets Instaladas',
      status: detectedWallets.length > 0 ? 'pass' : 'warning',
      message: detectedWallets.length > 0 
        ? `${detectedWallets.length} wallet(s) detectada(s): ${detectedWallets.join(', ')}`
        : 'No se detectaron wallets instaladas',
      solution: detectedWallets.length === 0 ? 'Instala MetaMask, Trust Wallet, o Coinbase Wallet' : undefined
    });

    // Test 5: User Agent
    const userAgentInfo = detectUserAgent();
    diagnosticTests.push({
      name: 'Navegador de Wallet',
      status: userAgentInfo.hasWallet ? 'pass' : 'info',
      message: userAgentInfo.hasWallet 
        ? `Navegando desde ${userAgentInfo.walletName}` 
        : 'Navegando desde navegador estándar',
      solution: !userAgentInfo.hasWallet ? 'Para mejor compatibilidad, abre esta página desde el navegador de tu wallet' : undefined
    });

    // Test 6: Tipo de navegador móvil
    const isWalletApp = isMobileWalletApp();
    diagnosticTests.push({
      name: 'Tipo de Navegador',
      status: isWalletApp ? 'pass' : 'info',
      message: isWalletApp ? 'Navegador de wallet detectado' : 'Navegador estándar detectado',
      solution: !isWalletApp ? 'Considera usar el navegador integrado de tu wallet para mejor compatibilidad' : undefined
    });

    // Test 7: Capacidades Web3
    let web3Capabilities = 'Ninguna';
    if (typeof window !== 'undefined') {
      const capabilities = [];
      if ((window as any).ethereum) capabilities.push('Ethereum');
      if ((window as any).web3) capabilities.push('Web3');
      if ((window as any).solana) capabilities.push('Solana');
      web3Capabilities = capabilities.length > 0 ? capabilities.join(', ') : 'Ninguna';
    }
    
    diagnosticTests.push({
      name: 'Capacidades Web3',
      status: web3Capabilities !== 'Ninguna' ? 'pass' : 'warning',
      message: `Capacidades detectadas: ${web3Capabilities}`,
      solution: web3Capabilities === 'Ninguna' ? 'Instala una wallet compatible con Web3' : undefined
    });

    setTests(diagnosticTests);
    setIsRunning(false);
  }, [isMobile, detectedWallets, detectUserAgent]);

  useEffect(() => {
    runDiagnostics();
  }, [isMobile, hasWalletApp, detectedWallets, runDiagnostics]);

  const getStatusIcon = (status: DiagnosticTest['status']) => {
    switch (status) {
      case 'pass':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'fail':
        return <XCircle className="h-5 w-5 text-red-600" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case 'info':
        return <Info className="h-5 w-5 text-blue-600" />;
    }
  };

  const getStatusColor = (status: DiagnosticTest['status']) => {
    switch (status) {
      case 'pass':
        return 'bg-green-50 border-green-200';
      case 'fail':
        return 'bg-red-50 border-red-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'info':
        return 'bg-blue-50 border-blue-200';
    }
  };

  const openWalletStore = () => {
    const isIOSDevice = isIOS();
    const storeUrl = isIOSDevice 
      ? 'https://apps.apple.com/search?term=metamask%20wallet'
      : 'https://play.google.com/store/search?q=metamask%20wallet';
    window.open(storeUrl, '_blank');
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Smartphone className="h-5 w-5" />
          Diagnóstico de Wallets Móviles
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-600">
            Diagnóstico automático para identificar problemas de conexión de wallets en móvil
          </p>
          <Button 
            onClick={runDiagnostics} 
            disabled={isRunning}
            size="sm"
            variant="outline"
          >
            {isRunning ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            Actualizar
          </Button>
        </div>

        <div className="space-y-3">
          {tests.map((test, index) => (
            <div 
              key={index} 
              className={`p-3 rounded-lg border ${getStatusColor(test.status)}`}
            >
              <div className="flex items-start gap-3">
                {getStatusIcon(test.status)}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm">{test.name}</span>
                    <Badge variant="outline" className="text-xs">
                      {test.status.toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">{test.message}</p>
                  {test.solution && (
                    <Alert className="mt-2">
                      <AlertDescription className="text-xs">
                        <strong>Solución:</strong> {test.solution}
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Acciones recomendadas */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-sm mb-3">Acciones Recomendadas:</h4>
          <div className="space-y-2">
            {!hasWalletApp && (
              <Button 
                onClick={openWalletStore}
                size="sm"
                variant="outline"
                className="w-full justify-start"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Instalar Wallet desde la Tienda de Apps
              </Button>
            )}
            
            {hasWalletApp && detectedWallets.length === 0 && (
              <Alert>
                <AlertDescription className="text-sm">
                  <strong>Tip:</strong> Si tienes wallets instaladas pero no se detectan, 
                  intenta abrir esta página desde el navegador integrado de tu wallet.
                </AlertDescription>
              </Alert>
            )}
            
            {!isMobile && (
              <Alert>
                <AlertDescription className="text-sm">
                  <strong>Nota:</strong> Este diagnóstico está diseñado para dispositivos móviles. 
                  En escritorio, las wallets se detectan de manera diferente.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </div>

        {/* Información adicional */}
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-medium text-sm text-blue-900 mb-2">Información del Sistema:</h4>
          <div className="text-xs text-blue-800 space-y-1">
            <div>User Agent: {typeof navigator !== 'undefined' ? navigator.userAgent.substring(0, 100) + '...' : 'No disponible'}</div>
            <div>Pantalla: {typeof window !== 'undefined' ? `${window.screen.width}x${window.screen.height}` : 'No disponible'}</div>
            <div>Viewport: {typeof window !== 'undefined' ? `${window.innerWidth}x${window.innerHeight}` : 'No disponible'}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default MobileWalletTroubleshooting;