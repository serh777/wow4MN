'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { IconWrapper } from '@/components/ui/icon-wrapper';
import { useWeb3Safe } from '@/hooks/useWeb3Safe';
import { useMobileWallet } from '@/hooks/useMobileWallet';
import { checkNetworkConnectivity } from '@/config/wallet';
import { 
  RefreshCw, 
  Smartphone, 
  Wifi, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Info,
  Wrench
} from 'lucide-react';

interface DiagnosticResult {
  test: string;
  status: 'pass' | 'fail' | 'warning' | 'info' | 'checking';
  message: string;
  solution?: string;
  details?: string;
}

export function WalletDiagnosticHub() {
  const { isConnected, address, chainId } = useWeb3Safe();
  const { 
    isMobile, 
    hasWalletApp, 
    detectedWallets, 
    canUseWalletConnect,
    detectUserAgent 
  } = useMobileWallet();
  
  const [generalDiagnostics, setGeneralDiagnostics] = useState<DiagnosticResult[]>([]);
  const [mobileDiagnostics, setMobileDiagnostics] = useState<DiagnosticResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [activeTab, setActiveTab] = useState('general');

  // Diagnósticos generales
  const runGeneralDiagnostics = useCallback(async () => {
    const results: DiagnosticResult[] = [];

    // Test 1: Conectividad de red
    results.push({ test: 'Conectividad de Red', status: 'checking', message: 'Verificando...' });
    try {
      const isOnline = await checkNetworkConnectivity();
      results[results.length - 1] = {
        test: 'Conectividad de Red',
        status: isOnline ? 'pass' : 'fail',
        message: isOnline ? 'Conexión a internet activa' : 'Sin conexión a internet',
        solution: !isOnline ? 'Verifica tu conexión a internet y vuelve a intentar' : undefined
      };
    } catch (error) {
      results[results.length - 1] = {
        test: 'Conectividad de Red',
        status: 'fail',
        message: 'Error verificando conectividad',
        solution: 'Verifica tu conexión a internet'
      };
    }

    // Test 2: Proveedor Ethereum
    const hasEthereum = typeof window !== 'undefined' && !!(window as any).ethereum;
    results.push({
      test: 'Proveedor Ethereum',
      status: hasEthereum ? 'pass' : 'fail',
      message: hasEthereum ? 'window.ethereum detectado' : 'No se detectó proveedor Ethereum',
      solution: !hasEthereum ? 'Instala MetaMask u otra wallet compatible' : undefined
    });

    // Test 3: Estado de conexión
    results.push({
      test: 'Estado de Conexión',
      status: isConnected ? 'pass' : 'info',
      message: isConnected ? `Conectado: ${address?.slice(0, 6)}...${address?.slice(-4)}` : 'No conectado',
      details: isConnected ? `Red: ${chainId}` : 'Haz clic en "Conectar Wallet" para conectar'
    });

    // Test 4: Variables de entorno
    const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID;
    results.push({
      test: 'Configuración WalletConnect',
      status: projectId ? 'pass' : 'warning',
      message: projectId ? 'PROJECT_ID configurado' : 'PROJECT_ID no encontrado',
      solution: !projectId ? 'Configura NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID en .env' : undefined
    });

    setGeneralDiagnostics(results);
  }, [isConnected, address, chainId]);

  // Diagnósticos móviles
  const runMobileDiagnostics = useCallback(async () => {
    const results: DiagnosticResult[] = [];

    // Test 1: Detección de dispositivo móvil
    results.push({
      test: 'Dispositivo Móvil',
      status: isMobile ? 'pass' : 'info',
      message: isMobile ? 'Dispositivo móvil detectado' : 'Dispositivo de escritorio detectado',
      details: isMobile ? 'Optimizaciones móviles activas' : 'Usando configuración de escritorio'
    });

    // Test 2: Proveedor Ethereum en móvil
    const hasEthereum = typeof window !== 'undefined' && !!(window as any).ethereum;
    results.push({
      test: 'Proveedor Ethereum Móvil',
      status: hasEthereum ? 'pass' : 'warning',
      message: hasEthereum ? 'Proveedor Ethereum disponible' : 'No se detectó proveedor Ethereum',
      solution: !hasEthereum ? 'Abre esta página desde el navegador de tu wallet o usa WalletConnect' : undefined
    });

    // Test 3: Múltiples proveedores (EIP-6963)
    if (hasEthereum) {
      const hasMultipleProviders = !!(window as any).ethereum?.providers && Array.isArray((window as any).ethereum.providers);
      results.push({
        test: 'Múltiples Proveedores (EIP-6963)',
        status: hasMultipleProviders ? 'pass' : 'warning',
        message: hasMultipleProviders ? `${(window as any).ethereum.providers.length} proveedores detectados` : 'Un solo proveedor detectado',
        solution: !hasMultipleProviders ? 'Esto es normal si solo tienes una wallet instalada' : undefined
      });
    }

    // Test 4: Wallets instaladas
    results.push({
      test: 'Wallets Instaladas',
      status: detectedWallets.length > 0 ? 'pass' : 'fail',
      message: detectedWallets.length > 0 ? `${detectedWallets.length} wallet(s) detectada(s)` : 'No se detectaron wallets instaladas',
      details: detectedWallets.length > 0 ? `Wallets: ${detectedWallets.join(', ')}` : undefined,
      solution: detectedWallets.length === 0 ? 'Instala MetaMask, Trust Wallet, o Coinbase Wallet' : undefined
    });

    // Test 5: User Agent
    const userAgentInfo = detectUserAgent();
    results.push({
      test: 'User Agent',
      status: userAgentInfo.hasWallet ? 'pass' : 'info',
      message: userAgentInfo.hasWallet ? `Navegando desde ${userAgentInfo.walletName}` : 'Navegando desde navegador estándar',
      details: userAgentInfo.hasWallet ? 'Wallet detectada en User Agent' : 'No hay wallet en User Agent'
    });

    // Test 6: WalletConnect
    results.push({
      test: 'WalletConnect Disponible',
      status: canUseWalletConnect ? 'pass' : 'warning',
      message: canUseWalletConnect ? 'WalletConnect está disponible como alternativa' : 'WalletConnect no disponible',
      solution: !canUseWalletConnect ? 'WalletConnect puede ayudar si las wallets instaladas no funcionan' : undefined
    });

    // Test 7: Conectividad específica móvil
    try {
      const response = await fetch('https://cloudflare.com/cdn-cgi/trace', { 
        method: 'GET',
        cache: 'no-cache'
      });
      results.push({
        test: 'Conectividad Móvil',
        status: response.ok ? 'pass' : 'warning',
        message: response.ok ? 'Conectividad móvil estable' : 'Problemas de conectividad móvil',
        solution: !response.ok ? 'Verifica tu conexión móvil o cambia a WiFi' : undefined
      });
    } catch (error) {
      results.push({
        test: 'Conectividad Móvil',
        status: 'fail',
        message: 'Error de conectividad móvil',
        solution: 'Verifica tu conexión a internet móvil'
      });
    }

    setMobileDiagnostics(results);
  }, [isMobile, detectedWallets, canUseWalletConnect, detectUserAgent]);

  // Ejecutar diagnósticos
  const runAllDiagnostics = useCallback(async () => {
    setIsRunning(true);
    await Promise.all([
      runGeneralDiagnostics(),
      runMobileDiagnostics()
    ]);
    setIsRunning(false);
  }, [runGeneralDiagnostics, runMobileDiagnostics]);

  // Ejecutar diagnósticos al montar
  useEffect(() => {
    runAllDiagnostics();
  }, [runAllDiagnostics]);

  // Función para obtener el icono según el estado
  const getStatusIcon = (status: DiagnosticResult['status']) => {
    switch (status) {
      case 'pass':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'fail':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'info':
        return <Info className="h-4 w-4 text-blue-500" />;
      case 'checking':
        return <RefreshCw className="h-4 w-4 text-gray-500 animate-spin" />;
      default:
        return <Info className="h-4 w-4 text-gray-500" />;
    }
  };

  // Función para obtener el color del badge
  const getStatusColor = (status: DiagnosticResult['status']) => {
    switch (status) {
      case 'pass':
        return 'bg-green-100 text-green-800';
      case 'fail':
        return 'bg-red-100 text-red-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'info':
        return 'bg-blue-100 text-blue-800';
      case 'checking':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Renderizar resultados de diagnóstico
  const renderDiagnosticResults = (results: DiagnosticResult[]) => (
    <div className="space-y-3">
      {results.map((result, index) => (
        <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
          <div className="flex-shrink-0 mt-0.5">
            {getStatusIcon(result.status)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-medium text-sm">{result.test}</h4>
              <Badge className={`text-xs ${getStatusColor(result.status)}`}>
                {result.status === 'pass' ? 'Correcto' : 
                 result.status === 'fail' ? 'Error' :
                 result.status === 'warning' ? 'Advertencia' :
                 result.status === 'checking' ? 'Verificando' : 'Info'}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-1">{result.message}</p>
            {result.details && (
              <p className="text-xs text-muted-foreground mb-1">{result.details}</p>
            )}
            {result.solution && (
              <Alert className="mt-2">
                <Wrench className="h-4 w-4" />
                <AlertDescription className="text-xs">
                  <strong>Solución:</strong> {result.solution}
                </AlertDescription>
              </Alert>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <IconWrapper icon="settings" className="h-5 w-5" />
            <CardTitle>Diagnóstico de Wallet</CardTitle>
          </div>
          <Button 
            onClick={runAllDiagnostics} 
            disabled={isRunning}
            variant="outline"
            size="sm"
          >
            {isRunning ? (
              <RefreshCw className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            {isRunning ? 'Ejecutando...' : 'Ejecutar Diagnóstico'}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="general" className="flex items-center gap-2">
              <Wifi className="h-4 w-4" />
              General
            </TabsTrigger>
            <TabsTrigger value="mobile" className="flex items-center gap-2">
              <Smartphone className="h-4 w-4" />
              Móvil
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="general" className="mt-4">
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-3">
                <Wifi className="h-4 w-4 text-blue-500" />
                <h3 className="font-medium">Diagnósticos Generales</h3>
              </div>
              {renderDiagnosticResults(generalDiagnostics)}
            </div>
          </TabsContent>
          
          <TabsContent value="mobile" className="mt-4">
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-3">
                <Smartphone className="h-4 w-4 text-purple-500" />
                <h3 className="font-medium">Diagnósticos Móviles</h3>
              </div>
              {renderDiagnosticResults(mobileDiagnostics)}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

export default WalletDiagnosticHub;