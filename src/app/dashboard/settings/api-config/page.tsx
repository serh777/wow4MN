'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Breadcrumbs } from '@/components/navigation/breadcrumbs';
import APIStatusDashboard from '@/components/api/api-status-dashboard';
import APIConfigManager from '@/components/api/api-config-manager';
import { Activity, Settings, Key, Globe } from 'lucide-react';

const APIConfigPage: React.FC = () => {
  const breadcrumbItems = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Configuración', href: '/dashboard/settings' },
    { label: 'APIs', href: '/dashboard/settings/api-config' }
  ];

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Breadcrumbs */}
      <Breadcrumbs items={breadcrumbItems} />

      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-100">
            <Key className="h-6 w-6 text-blue-600" />
          </div>
          Configuración de APIs
        </h1>
        <p className="text-muted-foreground">
          Gestiona las conexiones de API, monitorea el estado de conectividad y configura las claves de acceso
          para todas las herramientas de análisis.
        </p>
      </div>

      {/* Tabs principales */}
      <Tabs defaultValue="status" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="status" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Estado y Monitoreo
          </TabsTrigger>
          <TabsTrigger value="config" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Configuración
          </TabsTrigger>
        </TabsList>

        {/* Tab de Estado y Monitoreo */}
        <TabsContent value="status" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Estado de Conectividad en Tiempo Real
              </CardTitle>
              <CardDescription>
                Monitoreo automático del estado de todas las APIs configuradas, incluyendo tiempos de respuesta,
                límites de velocidad y errores de conectividad.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <APIStatusDashboard className="" showControls={true} compact={false} />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab de Configuración */}
        <TabsContent value="config" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Gestión de APIs y Claves de Acceso
              </CardTitle>
              <CardDescription>
                Configura, actualiza y gestiona las claves de API para todos los servicios externos.
                Las claves se almacenan de forma segura y se validan automáticamente.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <APIConfigManager className="" />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Información adicional */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Globe className="h-5 w-5" />
              APIs Soportadas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="font-medium">OpenAI</span>
                <span className="text-muted-foreground">Análisis con IA</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Etherscan</span>
                <span className="text-muted-foreground">Datos de Ethereum</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">CoinGecko</span>
                <span className="text-muted-foreground">Precios de criptomonedas</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Alchemy</span>
                <span className="text-muted-foreground">Infraestructura blockchain</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Moralis</span>
                <span className="text-muted-foreground">Datos NFT y DeFi</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Google PageSpeed</span>
                <span className="text-muted-foreground">Análisis de rendimiento</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Key className="h-5 w-5" />
              Seguridad y Privacidad
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0"></div>
                <div>
                  <p className="font-medium">Almacenamiento Seguro</p>
                  <p className="text-muted-foreground">Las claves se almacenan de forma encriptada localmente</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0"></div>
                <div>
                  <p className="font-medium">Validación Automática</p>
                  <p className="text-muted-foreground">Verificación periódica de la validez de las claves</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0"></div>
                <div>
                  <p className="font-medium">Sin Transmisión Externa</p>
                  <p className="text-muted-foreground">Las claves nunca se envían a servidores externos no autorizados</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0"></div>
                <div>
                  <p className="font-medium">Control Total</p>
                  <p className="text-muted-foreground">Puedes agregar, modificar o eliminar APIs en cualquier momento</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default APIConfigPage;