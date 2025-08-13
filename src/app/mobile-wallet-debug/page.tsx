'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MobileWalletTroubleshooting from '@/components/wallet/mobile-wallet-troubleshooting';
import { ReownMobileConfig } from '@/components/wallet/reown-mobile-config';
import { DebugToolsWrapper } from '@/components/auth/debug-tools-wrapper';
import { useMobileWallet } from '@/hooks/useMobileWallet';
import { 
  Smartphone, 
  Download, 
  ExternalLink, 
  AlertCircle,
  CheckCircle,
  Info,
  Settings
} from 'lucide-react';

const mobileWallets = [
  {
    name: 'MetaMask',
    icon: '🦊',
    description: 'La wallet más popular para Ethereum',
    downloadUrl: {
      ios: 'https://apps.apple.com/app/metamask/id1438144202',
      android: 'https://play.google.com/store/apps/details?id=io.metamask'
    },
    deepLink: 'https://metamask.app.link/dapp/'
  },
  {
    name: 'Trust Wallet',
    icon: '🛡️',
    description: 'Wallet multi-cadena con soporte completo',
    downloadUrl: {
      ios: 'https://apps.apple.com/app/trust-crypto-bitcoin-wallet/id1288339409',
      android: 'https://play.google.com/store/apps/details?id=com.wallet.crypto.trustapp'
    },
    deepLink: 'https://link.trustwallet.com/open_url?coin_id=60&url='
  },
  {
    name: 'Coinbase Wallet',
    icon: '🔵',
    description: 'Wallet oficial de Coinbase',
    downloadUrl: {
      ios: 'https://apps.apple.com/app/coinbase-wallet/id1278383455',
      android: 'https://play.google.com/store/apps/details?id=org.toshi'
    },
    deepLink: 'https://go.cb-w.com/dapp?cb_url='
  },
  {
    name: 'Rainbow',
    icon: '🌈',
    description: 'Wallet moderna con interfaz intuitiva',
    downloadUrl: {
      ios: 'https://apps.apple.com/app/rainbow-ethereum-wallet/id1457119021',
      android: 'https://play.google.com/store/apps/details?id=me.rainbow'
    },
    deepLink: 'https://rnbwapp.com/dapp/'
  }
];

function detectPlatform(): 'ios' | 'android' | 'unknown' {
  if (typeof navigator === 'undefined') return 'unknown';
  
  const userAgent = navigator.userAgent.toLowerCase();
  if (/iphone|ipad|ipod/.test(userAgent)) return 'ios';
  if (/android/.test(userAgent)) return 'android';
  return 'unknown';
}

export default function MobileWalletDebugPage() {
  const { isMobile, hasWalletApp, detectedWallets, canUseWalletConnect } = useMobileWallet();
  const platform = detectPlatform();

  const openInWallet = (wallet: typeof mobileWallets[0]) => {
    const currentUrl = window.location.href;
    const deepLinkUrl = wallet.deepLink + encodeURIComponent(currentUrl);
    window.open(deepLinkUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            🔧 Diagnóstico de Wallets Móviles
          </h1>
          <p className="text-lg text-gray-600">
            Herramienta de diagnóstico para resolver problemas de conexión de wallets en dispositivos móviles
          </p>
        </div>

        {/* Estado actual */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5" />
              Estado Actual
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Badge variant={isMobile ? 'default' : 'secondary'}>
                  {isMobile ? 'Móvil' : 'Escritorio'}
                </Badge>
                <span className="text-sm text-gray-600">Tipo de dispositivo</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Badge variant={hasWalletApp ? 'default' : 'destructive'}>
                  {hasWalletApp ? 'Detectada' : 'No detectada'}
                </Badge>
                <span className="text-sm text-gray-600">Wallet instalada</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Badge variant={detectedWallets.length > 0 ? 'default' : 'secondary'}>
                  {detectedWallets.length} wallets
                </Badge>
                <span className="text-sm text-gray-600">Wallets detectadas</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Badge variant={canUseWalletConnect ? 'default' : 'secondary'}>
                  {canUseWalletConnect ? 'Disponible' : 'No disponible'}
                </Badge>
                <span className="text-sm text-gray-600">WalletConnect</span>
              </div>
            </div>
            
            {detectedWallets.length > 0 && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm font-medium text-green-800 mb-1">
                  ✅ Wallets detectadas:
                </p>
                <p className="text-sm text-green-700">
                  {detectedWallets.join(', ')}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Componente de diagnóstico */}
        <DebugToolsWrapper>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Herramientas de Diagnóstico
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="troubleshooting" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="troubleshooting">Diagnóstico</TabsTrigger>
                  <TabsTrigger value="config">Configuración Avanzada</TabsTrigger>
                </TabsList>
                <TabsContent value="troubleshooting" className="mt-4">
                  <MobileWalletTroubleshooting />
                </TabsContent>
                <TabsContent value="config" className="mt-4">
                  <ReownMobileConfig />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </DebugToolsWrapper>

        {/* Problemas comunes y soluciones */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Problemas Comunes y Soluciones
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-l-4 border-red-500 pl-4">
                <h4 className="font-medium text-red-900 mb-2">
                  ❌ "No se detectaron wallets instaladas"
                </h4>
                <div className="text-sm text-red-800 space-y-1">
                  <p><strong>Causa:</strong> Navegando desde navegador estándar en lugar del navegador de la wallet</p>
                  <p><strong>Solución:</strong></p>
                  <ul className="list-disc list-inside ml-4 space-y-1">
                    <li>Abre tu app de wallet (MetaMask, Trust Wallet, etc.)</li>
                    <li>Usa el navegador integrado de la wallet</li>
                    <li>Navega a esta página desde ahí</li>
                    <li>Alternativamente, usa WalletConnect desde cualquier navegador</li>
                  </ul>
                </div>
              </div>

              <div className="border-l-4 border-yellow-500 pl-4">
                <h4 className="font-medium text-yellow-900 mb-2">
                  ⚠️ "Wallet instalada pero no se conecta"
                </h4>
                <div className="text-sm text-yellow-800 space-y-1">
                  <p><strong>Causa:</strong> Problemas de compatibilidad o configuración</p>
                  <p><strong>Solución:</strong></p>
                  <ul className="list-disc list-inside ml-4 space-y-1">
                    <li>Actualiza tu app de wallet a la última versión</li>
                    <li>Reinicia la app de wallet</li>
                    <li>Limpia el cache del navegador de la wallet</li>
                    <li>Intenta con WalletConnect como alternativa</li>
                  </ul>
                </div>
              </div>

              <div className="border-l-4 border-blue-500 pl-4">
                <h4 className="font-medium text-blue-900 mb-2">
                  ℹ️ "QR de WalletConnect no aparece"
                </h4>
                <div className="text-sm text-blue-800 space-y-1">
                  <p><strong>Causa:</strong> Configuración de WalletConnect o conectividad</p>
                  <p><strong>Solución:</strong></p>
                  <ul className="list-disc list-inside ml-4 space-y-1">
                    <li>Verifica tu conexión a internet</li>
                    <li>Recarga la página</li>
                    <li>Intenta desde una red WiFi diferente</li>
                    <li>Usa el navegador de la wallet directamente</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Wallets recomendadas */}
        {!hasWalletApp && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5" />
                Instalar Wallet Móvil
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Para usar Web3 en móvil, necesitas instalar una wallet compatible:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mobileWallets.map((wallet) => (
                  <div key={wallet.name} className="border rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-2xl">{wallet.icon}</span>
                      <div>
                        <h4 className="font-medium">{wallet.name}</h4>
                        <p className="text-xs text-gray-600">{wallet.description}</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      {platform !== 'unknown' && (
                        <Button
                          size="sm"
                          onClick={() => window.open(wallet.downloadUrl[platform as keyof typeof wallet.downloadUrl], '_blank')}
                          className="flex-1"
                        >
                          <Download className="h-3 w-3 mr-1" />
                          Instalar
                        </Button>
                      )}
                      
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openInWallet(wallet)}
                        className="flex-1"
                      >
                        <ExternalLink className="h-3 w-3 mr-1" />
                        Abrir
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Instrucciones paso a paso */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Guía Paso a Paso
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h4 className="font-medium mb-3">Método 1: Navegador de Wallet (Recomendado)</h4>
                <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
                  <li>Abre tu app de wallet móvil (MetaMask, Trust Wallet, etc.)</li>
                  <li>Busca la opción "Navegador" o "Browser" en la app</li>
                  <li>Navega a esta página web desde el navegador de la wallet</li>
                  <li>La wallet se detectará automáticamente</li>
                  <li>Haz clic en "Conectar Wallet" para establecer la conexión</li>
                </ol>
              </div>

              <div>
                <h4 className="font-medium mb-3">Método 2: WalletConnect</h4>
                <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
                  <li>Usa cualquier navegador móvil (Chrome, Safari, etc.)</li>
                  <li>Haz clic en "Conectar Wallet" en esta página</li>
                  <li>Selecciona "WalletConnect" en el modal</li>
                  <li>Escanea el código QR con tu app de wallet</li>
                  <li>Autoriza la conexión en tu wallet</li>
                </ol>
              </div>

              <div>
                <h4 className="font-medium mb-3">Método 3: Deep Links</h4>
                <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
                  <li>Haz clic en uno de los botones "Abrir" de las wallets arriba</li>
                  <li>Esto abrirá la página directamente en tu wallet</li>
                  <li>Autoriza la conexión cuando se solicite</li>
                </ol>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>¿Sigues teniendo problemas? Contacta a nuestro soporte técnico.</p>
        </div>
      </div>
    </div>
  );
}