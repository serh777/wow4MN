'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { IconWrapper } from '@/components/ui/icon-wrapper';
import { ExternalLink, CheckCircle, AlertTriangle, Info } from 'lucide-react';

interface Web3HelpProps {
  onClose?: () => void;
}

export function Web3Help({ onClose }: Web3HelpProps) {
  const handleInstallMetaMask = () => {
    window.open('https://metamask.io/download/', '_blank');
  };

  const handleSwitchNetwork = async () => {
    if (typeof window !== 'undefined' && window.ethereum) {
      try {
        // Intentar cambiar a Polygon
        await (window.ethereum as any).request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x89' }], // Polygon
        });
      } catch (error: any) {
        if (error.code === 4902) {
          // Red no agregada, intentar agregarla
          try {
            await (window.ethereum as any).request({
              method: 'wallet_addEthereumChain',
              params: [{
                chainId: '0x89',
                chainName: 'Polygon Mainnet',
                nativeCurrency: {
                  name: 'MATIC',
                  symbol: 'MATIC',
                  decimals: 18,
                },
                rpcUrls: ['https://polygon-rpc.com'],
                blockExplorerUrls: ['https://polygonscan.com'],
              }],
            });
          } catch (addError) {
            console.error('Error adding network:', addError);
          }
        }
      }
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <IconWrapper icon="help" className="h-5 w-5" />
              Ayuda de Conexión Web3
            </CardTitle>
            <CardDescription>
              Soluciones rápidas para problemas comunes de conexión
            </CardDescription>
          </div>
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose}>
              ✕
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Problema 1: MetaMask no instalado */}
        <div className="space-y-3">
          <h3 className="font-semibold flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-orange-500" />
            MetaMask no está instalado
          </h3>
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                <p>Si ves errores de conexión, es posible que MetaMask no esté instalado.</p>
                <Button onClick={handleInstallMetaMask} className="w-full sm:w-auto">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Instalar MetaMask
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        </div>

        {/* Problema 2: Red no soportada */}
        <div className="space-y-3">
          <h3 className="font-semibold flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-red-500" />
            Red no soportada
          </h3>
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-3">
                <p>Asegúrate de estar conectado a una de estas redes:</p>
                <div className="grid grid-cols-2 gap-2">
                  <Badge variant="outline">Ethereum Mainnet</Badge>
                  <Badge variant="outline">Polygon</Badge>
                  <Badge variant="outline">BSC</Badge>
                  <Badge variant="outline">Avalanche</Badge>
                </div>
                <Button onClick={handleSwitchNetwork} variant="outline" className="w-full sm:w-auto">
                  <IconWrapper icon="network" className="h-4 w-4 mr-2" />
                  Cambiar a Polygon
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        </div>

        {/* Problema 3: MetaMask bloqueado */}
        <div className="space-y-3">
          <h3 className="font-semibold flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
            MetaMask está bloqueado
          </h3>
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                <p>Si MetaMask está bloqueado:</p>
                <ol className="list-decimal list-inside space-y-1 text-sm">
                  <li>Haz clic en el icono de MetaMask en tu navegador</li>
                  <li>Ingresa tu contraseña para desbloquearlo</li>
                  <li>Recarga esta página</li>
                </ol>
              </div>
            </AlertDescription>
          </Alert>
        </div>

        {/* Problema 4: Conexión rechazada */}
        <div className="space-y-3">
          <h3 className="font-semibold flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-purple-500" />
            Conexión rechazada
          </h3>
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                <p>Si rechazaste la conexión por error:</p>
                <ol className="list-decimal list-inside space-y-1 text-sm">
                  <li>Abre MetaMask</li>
                  <li>Ve a Configuración → Sitios conectados</li>
                  <li>Busca este sitio y reconéctalo</li>
                  <li>O simplemente recarga la página e intenta de nuevo</li>
                </ol>
              </div>
            </AlertDescription>
          </Alert>
        </div>

        {/* Soluciones generales */}
        <div className="space-y-3">
          <h3 className="font-semibold flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            Soluciones generales
          </h3>
          <div className="grid gap-3">
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Recarga la página:</strong> Muchos problemas se resuelven simplemente recargando.
              </AlertDescription>
            </Alert>
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Reinicia el navegador:</strong> Si los problemas persisten, cierra y abre el navegador.
              </AlertDescription>
            </Alert>
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Actualiza MetaMask:</strong> Asegúrate de tener la versión más reciente instalada.
              </AlertDescription>
            </Alert>
          </div>
        </div>

        {/* Información de contacto */}
        <div className="border-t pt-4">
          <p className="text-sm text-muted-foreground text-center">
            ¿Sigues teniendo problemas? {' '}
            <a href="/contact" className="text-primary hover:underline">
              Contacta nuestro soporte
            </a>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}