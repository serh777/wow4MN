'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Icons } from '@/components/icons';
import { UnifiedWalletConnect } from '@/components/wallet/unified-wallet-connect';
import { useWeb3Safe } from '@/hooks/useWeb3Safe';
import { Alert, AlertDescription } from '@/components/ui/alert';

export function WalletHub() {
  const { address, isConnected, balance } = useWeb3Safe();
  const router = useRouter();

  const tools = [
    {
      id: 'smart-contract',
      title: 'Smart Contract Analysis',
      description: 'Analiza la seguridad y optimización de contratos inteligentes',
      icon: Icons.code,
      path: '/dashboard/smart-contract',
      color: 'bg-blue-500/10 text-blue-600',
      premium: false
    },
    {
      id: 'social-web3',
      title: 'Social Web3 Analysis',
      description: 'Evalúa tu presencia en plataformas descentralizadas',
      icon: Icons.user,
      path: '/dashboard/social-web3',
      color: 'bg-purple-500/10 text-purple-600',
      premium: false
    },
    {
      id: 'ai-assistant',
      title: 'AI Assistant',
      description: 'Asistente inteligente para optimización Web3',
      icon: Icons.ai,
      path: '/dashboard/ai-assistant',
      color: 'bg-green-500/10 text-green-600',
      premium: true
    },
    {
      id: 'links',
      title: 'Link Analysis',
      description: 'Analiza y optimiza la estructura de enlaces',
      icon: Icons.links,
      path: '/dashboard/links',
      color: 'bg-orange-500/10 text-orange-600',
      premium: false
    },
    {
      id: 'content',
      title: 'Content Analysis',
      description: 'Optimiza el contenido para Web3 y SEO',
      icon: Icons.content,
      path: '/dashboard/content',
      color: 'bg-indigo-500/10 text-indigo-600',
      premium: false
    },
    {
      id: 'technical',
      title: 'Technical SEO',
      description: 'Análisis técnico y rendimiento del sitio',
      icon: Icons.settings,
      path: '/dashboard/technical',
      color: 'bg-red-500/10 text-red-600',
      premium: false
    }
  ];

  const handleToolAccess = (tool: typeof tools[0]) => {
    if (tool.premium && !isConnected) {
      // Para herramientas premium, requerir conexión de wallet
      return;
    }
    router.push(tool.path);
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const formatBalance = (bal: string) => {
    return `${parseFloat(bal).toFixed(4)} ETH`;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Wallet Hub
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Centro de conexión para todas las herramientas Web3. Conecta tu wallet para acceder a funcionalidades personalizadas y análisis avanzados.
        </p>
      </div>

      {/* Wallet Connection Status */}
      <Card className="border-2">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className={`h-3 w-3 rounded-full ${
                  isConnected ? 'bg-green-500' : 'bg-gray-400'
                }`} />
                <CardTitle>Estado de Conexión</CardTitle>
              </div>
            <Badge variant={isConnected ? "default" : "secondary"}>
              {isConnected ? "Conectado" : "Desconectado"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {isConnected && address ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Dirección</p>
                <p className="font-mono text-sm bg-muted px-3 py-2 rounded">
                  {formatAddress(address)}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Balance</p>
                <p className="font-semibold">
                  {balance ? formatBalance(balance) : 'Cargando...'}
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <Alert>
                <Icons.help className="h-4 w-4" />
                <AlertDescription>
                  Conecta tu wallet para acceder a todas las funcionalidades y obtener análisis personalizados.
                </AlertDescription>
              </Alert>
              <UnifiedWalletConnect />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tools Grid */}
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">Herramientas Disponibles</h2>
          <p className="text-muted-foreground">
            Accede a todas las herramientas de análisis Web3 desde un solo lugar
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool) => {
            const IconComponent = tool.icon;
            const isAccessible = !tool.premium || isConnected;
            
            return (
              <Card 
                key={tool.id} 
                className={`transition-all duration-200 hover:shadow-lg ${
                  isAccessible 
                    ? 'hover:scale-105 cursor-pointer border-2 hover:border-primary/50' 
                    : 'opacity-60 cursor-not-allowed'
                }`}
                onClick={() => isAccessible && handleToolAccess(tool)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className={`h-12 w-12 rounded-lg flex items-center justify-center ${tool.color}`}>
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <div className="flex gap-2">
                      {tool.premium && (
                        <Badge variant="outline" className="text-xs">
                          Premium
                        </Badge>
                      )}
                      {isAccessible && (
                        <Badge variant="default" className="text-xs">
                          Disponible
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{tool.title}</CardTitle>
                    <CardDescription className="text-sm">
                      {tool.description}
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <Button 
                    variant={isAccessible ? "primary" : "outline"}
                    className="w-full"
                    disabled={!isAccessible}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (isAccessible) handleToolAccess(tool);
                    }}
                  >
                    {tool.premium && !isConnected ? (
                      <>
                        <Icons.warning className="h-4 w-4 mr-2" />
                        Conectar Wallet
                      </>
                    ) : (
                      <>
                        <Icons.arrowRight className="h-4 w-4 mr-2" />
                        Acceder
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Benefits Section */}
      <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
        <CardHeader>
          <CardTitle className="text-center">Beneficios de Conectar tu Wallet</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center space-y-2">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <Icons.check className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-medium">Análisis Personalizado</h3>
              <p className="text-sm text-muted-foreground">
                Recibe recomendaciones específicas para tus proyectos
              </p>
            </div>
            <div className="text-center space-y-2">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <Icons.fileText className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-medium">Historial de Análisis</h3>
              <p className="text-sm text-muted-foreground">
                Guarda y compara resultados a lo largo del tiempo
              </p>
            </div>
            <div className="text-center space-y-2">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <Icons.star className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-medium">Herramientas Premium</h3>
              <p className="text-sm text-muted-foreground">
                Accede a funcionalidades avanzadas exclusivas
              </p>
            </div>
            <div className="text-center space-y-2">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <Icons.analytics className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-medium">Métricas Avanzadas</h3>
              <p className="text-sm text-muted-foreground">
                Obtén insights detallados sobre tu ecosistema Web3
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}