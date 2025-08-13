'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useMobileWallet } from '@/hooks/useMobileWallet';
import { useReownConfig } from '@/hooks/useReownConfig';
import { isMobileDevice, isIOS, isAndroid } from '@/config/wallet/mobile';
import { 
  Settings, 
  Smartphone, 
  Wifi, 
  RefreshCw,
  Copy,
  ExternalLink,
  CheckCircle,
  AlertTriangle,
  Info
} from 'lucide-react';

interface ReownMobileConfigProps {
  className?: string;
}

export function ReownMobileConfig({ className = '' }: ReownMobileConfigProps) {
  const { isMobile, hasWalletApp, detectedWallets, detectUserAgent } = useMobileWallet();
  const {
    config,
    isLoading,
    lastUpdate,
    saveConfig,
    resetConfig,
    testConnectivity,
    detectMobileWallets,
    getMobileOptimizedConfig
  } = useReownConfig();
  
  const [testResults, setTestResults] = useState<any>(null);
  const userAgentInfo = detectUserAgent();
  const mobileWalletDetection = detectMobileWallets();

  const handleSaveConfig = () => {
    alert('Configuración guardada. Los cambios se aplicarán automáticamente.');
  };

  const handleResetConfig = () => {
    resetConfig();
    alert('Configuración restablecida a valores por defecto.');
  };

  const handleTestConnection = async () => {
    try {
      const results = await testConnectivity();
      const enhancedResults = {
        ...results,
        mobileDetection: mobileWalletDetection,
        wallets: {
          detected: detectedWallets,
          hasWalletApp,
          userAgentInfo,
          mobileSpecific: mobileWalletDetection
        },
        network: {
          online: navigator.onLine,
          connection: (navigator as any).connection?.effectiveType || 'unknown'
        },
        lastConfigUpdate: lastUpdate?.toISOString() || 'Never'
      };
      setTestResults(enhancedResults);
    } catch (error) {
      console.error('Error testing connectivity:', error);
      alert('Error al ejecutar las pruebas de conectividad.');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copiado al portapapeles');
  };

  const getStatusIcon = (condition: boolean) => {
    return condition ? (
      <CheckCircle className="h-4 w-4 text-green-600" />
    ) : (
      <AlertTriangle className="h-4 w-4 text-red-600" />
    );
  };

  return (
    <Card className={`w-full max-w-4xl mx-auto ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Configuración Avanzada Reown/WalletConnect
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="config" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="config">Configuración</TabsTrigger>
            <TabsTrigger value="test">Pruebas</TabsTrigger>
            <TabsTrigger value="debug">Debug Info</TabsTrigger>
          </TabsList>
          
          <TabsContent value="config" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Configuración básica */}
              <div className="space-y-4">
                <h3 className="font-medium text-sm">Configuración Básica</h3>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="enableInjected" className="text-sm">
                    Habilitar Proveedores Inyectados
                  </Label>
                  <Switch
                    id="enableInjected"
                    checked={config.enableInjected}
                    onCheckedChange={(checked) => 
                      saveConfig({ enableInjected: checked })
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="enableEIP6963" className="text-sm">
                    Habilitar EIP-6963
                  </Label>
                  <Switch
                    id="enableEIP6963"
                    checked={config.enableEIP6963}
                    onCheckedChange={(checked) => 
                      saveConfig({ enableEIP6963: checked })
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="enableDeepLinks" className="text-sm">
                    Habilitar Deep Links
                  </Label>
                  <Switch
                    id="enableDeepLinks"
                    checked={config.enableDeepLinks}
                    onCheckedChange={(checked) => 
                      saveConfig({ enableDeepLinks: checked })
                    }
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="timeout" className="text-sm">
                    Timeout de Conexión (ms)
                  </Label>
                  <Input
                    id="timeout"
                    type="number"
                    value={config.connectionTimeout}
                    onChange={(e) => 
                      saveConfig({ connectionTimeout: parseInt(e.target.value) || 30000 })
                    }
                  />
                </div>
              </div>
              
              {/* Configuración avanzada */}
              <div className="space-y-4">
                <h3 className="font-medium text-sm">Configuración Avanzada</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="projectId" className="text-sm">
                    Project ID de WalletConnect
                  </Label>
                  <Input
                    id="projectId"
                    value={config.projectId}
                    onChange={(e) => 
                      saveConfig({ projectId: e.target.value })
                    }
                    placeholder="Ingresa tu Project ID"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="retries" className="text-sm">
                    Intentos de Reconexión
                  </Label>
                  <Input
                    id="retries"
                    type="number"
                    value={config.retryAttempts}
                    onChange={(e) => 
                      saveConfig({ retryAttempts: parseInt(e.target.value) || 3 })
                    }
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="metadata" className="text-sm">
                    Metadata de la App (JSON)
                  </Label>
                  <Textarea
                    id="metadata"
                    value={JSON.stringify(config.metadata, null, 2)}
                    onChange={(e) => {
                      try {
                        const parsed = JSON.parse(e.target.value);
                        saveConfig({ metadata: parsed });
                      } catch (e) {
                        // Ignorar errores de parsing mientras se escribe
                      }
                    }}
                    rows={4}
                  />
                </div>
              </div>
            </div>
            
            <div className="flex gap-2 pt-4">
              <Button onClick={handleSaveConfig} className="flex-1">
                Guardar Configuración
              </Button>
              <Button onClick={handleResetConfig} variant="outline">
                Resetear
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="test" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Pruebas de Conectividad</h3>
              <Button 
                onClick={handleTestConnection} 
                disabled={isLoading}
                className="flex items-center gap-2"
              >
                {isLoading ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <Wifi className="h-4 w-4" />
                )}
                {isLoading ? 'Probando...' : 'Ejecutar Pruebas'}
              </Button>
            </div>
            
            {testResults && (
              <div className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Card>
                    <CardContent className="p-3">
                      <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                        <Smartphone className="h-4 w-4" />
                        Dispositivo
                      </h4>
                      <div className="space-y-1 text-xs">
                        <div className="flex items-center justify-between">
                          <span>Móvil:</span>
                          <div className="flex items-center gap-1">
                            {getStatusIcon(testResults.device.isMobile)}
                            <span>{testResults.device.isMobile ? 'Sí' : 'No'}</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>iOS:</span>
                          <span>{testResults.device.isIOS ? 'Sí' : 'No'}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Android:</span>
                          <span>{testResults.device.isAndroid ? 'Sí' : 'No'}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-3">
                      <h4 className="font-medium text-sm mb-2">Ethereum Provider</h4>
                      <div className="space-y-1 text-xs">
                        <div className="flex items-center justify-between">
                          <span>Disponible:</span>
                          <div className="flex items-center gap-1">
                            {getStatusIcon(testResults.ethereum.available)}
                            <span>{testResults.ethereum.available ? 'Sí' : 'No'}</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>MetaMask:</span>
                          <span>{testResults.ethereum.isMetaMask ? 'Sí' : 'No'}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-3">
                      <h4 className="font-medium text-sm mb-2">Wallets Detectadas</h4>
                      <div className="space-y-1 text-xs">
                        <div className="flex items-center justify-between">
                          <span>Cantidad:</span>
                          <Badge variant={testResults.wallets.detected.length > 0 ? 'default' : 'destructive'}>
                            {testResults.wallets.detected.length}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Móvil específico:</span>
                          <Badge variant={testResults.mobileDetection.totalDetected > 0 ? 'default' : 'secondary'}>
                            {testResults.mobileDetection.totalDetected}
                          </Badge>
                        </div>
                        {testResults.wallets.detected.length > 0 && (
                          <div className="mt-2">
                            <div className="text-xs text-gray-600 mb-1">Detectadas:</div>
                            {testResults.wallets.detected.map((wallet: string, index: number) => (
                              <Badge key={index} variant="outline" className="mr-1 mb-1 text-xs">
                                {wallet}
                              </Badge>
                            ))}
                          </div>
                        )}
                        {testResults.mobileDetection.detectedWallets.length > 0 && (
                          <div className="mt-2">
                            <div className="text-xs text-gray-600 mb-1">Móvil específicas:</div>
                            {testResults.mobileDetection.detectedWallets.map((wallet: string, index: number) => (
                              <Badge key={index} variant="default" className="mr-1 mb-1 text-xs">
                                {wallet}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-3">
                      <h4 className="font-medium text-sm mb-2">Configuración Reown</h4>
                      <div className="space-y-1 text-xs">
                        <div className="flex items-center justify-between">
                          <span>Project ID:</span>
                          <div className="flex items-center gap-1">
                            {getStatusIcon(testResults.reown.projectId)}
                            <span>{testResults.reown.projectId ? 'Configurado' : 'Faltante'}</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Injected:</span>
                          <span>{testResults.reown.enableInjected ? 'Habilitado' : 'Deshabilitado'}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>EIP6963:</span>
                          <span>{testResults.reown.enableEIP6963 ? 'Habilitado' : 'Deshabilitado'}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <Button 
                  onClick={() => copyToClipboard(JSON.stringify(testResults, null, 2))}
                  variant="outline" 
                  size="sm"
                  className="w-full"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copiar Resultados Completos
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="debug" className="space-y-4">
            <div className="space-y-3">
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Esta información es útil para diagnosticar problemas de conectividad móvil.
                </AlertDescription>
              </Alert>
              
              <Card>
                <CardContent className="p-3">
                  <h4 className="font-medium text-sm mb-2">User Agent</h4>
                  <div className="text-xs bg-gray-100 p-2 rounded break-all">
                    {navigator.userAgent}
                  </div>
                  <Button 
                    onClick={() => copyToClipboard(navigator.userAgent)}
                    variant="outline" 
                    size="sm"
                    className="mt-2"
                  >
                    <Copy className="h-4 w-4 mr-1" />
                    Copiar
                  </Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-3">
                  <h4 className="font-medium text-sm mb-2">Información del Navegador</h4>
                  <div className="text-xs space-y-1">
                    <div><strong>Wallet detectada:</strong> {userAgentInfo.walletName || 'Ninguna'}</div>
                    <div><strong>Es DApp Browser:</strong> {userAgentInfo.isDAppBrowser ? 'Sí' : 'No'}</div>
                    <div><strong>Tiene Wallet:</strong> {userAgentInfo.hasWallet ? 'Sí' : 'No'}</div>
                    <div><strong>Online:</strong> {navigator.onLine ? 'Sí' : 'No'}</div>
                    <div><strong>Idioma:</strong> {navigator.language}</div>
                    <div><strong>Plataforma:</strong> {navigator.platform}</div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-3">
                  <h4 className="font-medium text-sm mb-2">Variables de Entorno</h4>
                  <div className="text-xs space-y-1">
                    <div><strong>NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID:</strong> {process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ? '✓ Configurado' : '✗ No configurado'}</div>
                    <div><strong>NODE_ENV:</strong> {process.env.NODE_ENV}</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

export default ReownMobileConfig;