'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Icons } from '@/components/icons';
import Link from 'next/link';
import { IconWrapper } from '@/components/ui/icon-wrapper';
import { useToast } from '@/components/ui/use-toast';

import { useContract } from '@/hooks/use-contract';
import { useWeb3 } from '@/contexts/Web3Context';
import { useAuth } from '@/contexts/AuthContext';

export default function WalletToolPage() {
  const { toast } = useToast();
  const { emitToolAction, isToolSupported } = useContract();
  const { connect, disconnect, address, isConnected, isConnecting } = useWeb3();
  const { user } = useAuth();

  const handleButtonClick = () => {
    if (!user) {
      // Si no está autenticado, redirigir al registro
      window.location.href = '/auth/email-register';
    } else {
      // Si está autenticado, ejecutar la conexión de wallet
      handleConnectWallet();
    }
  };

  const handleConnectWallet = async () => {
    try {
      const connectedAddress = await connect();
      
      if (connectedAddress) {
        // Registrar la acción en el contrato
        if (isToolSupported('wallet')) {
          await emitToolAction('wallet', 'Conexión de wallet completada', 'wallet-tool-page');
        }
        
        toast({
          title: 'Wallet conectada',
          description: `Wallet ${connectedAddress.substring(0, 6)}...${connectedAddress.substring(38)} conectada con éxito.`,
        });
      }
    } catch (error) {
      console.error('Error al conectar wallet:', error);
      toast({
        title: 'Error',
        description: 'Ha ocurrido un error al conectar la wallet.',
        variant: 'destructive',
      });
    }
  };
  
  const handleDisconnectWallet = async () => {
    try {
      await disconnect();
      toast({
        title: 'Wallet desconectada',
        description: 'Tu wallet ha sido desconectada.',
      });
    } catch (error) {
      console.error('Error al desconectar wallet:', error);
    }
  };

  const handlePaymentSuccess = () => {
    toast({
      title: 'Pago exitoso',
      description: 'Tu pago ha sido procesado correctamente. Iniciando conexión...',
    });
    
    // Iniciar conexión después del pago exitoso
    handleConnectWallet();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-full mb-6">
            <IconWrapper icon="wallet" className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
            Integración con Wallets Web3
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Conecta tu wallet para acceder a funcionalidades avanzadas y análisis personalizados de tus proyectos Web3.
          </p>
        </div>

        <div className="grid gap-12 md:grid-cols-2 items-center mb-16">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">¿Qué ofrecemos?</h2>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <IconWrapper icon="success" className="h-5 w-5 text-green-500 mt-1" />
                <div>
                  <h3 className="font-medium">Análisis Personalizado</h3>
                  <p className="text-muted-foreground">Evaluación detallada de tus propios contratos y tokens</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <IconWrapper icon="success" className="h-5 w-5 text-green-500 mt-1" />
                <div>
                  <h3 className="font-medium">Gestión de Proyectos</h3>
                  <p className="text-muted-foreground">Administra y monitorea todos tus proyectos desde un solo lugar</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <IconWrapper icon="success" className="h-5 w-5 text-green-500 mt-1" />
                <div>
                  <h3 className="font-medium">Funciones Premium</h3>
                  <p className="text-muted-foreground">Acceso a herramientas y análisis avanzados</p>
                </div>
              </li>
            </ul>

          </div>
          <Card className="border-primary/10 hover:border-primary/20 transition-colors">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center gap-4 pb-4 border-b">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <IconWrapper icon="analytics" className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Análisis Avanzado</h3>
                    <p className="text-sm text-muted-foreground">Métricas detalladas de tus activos</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 pb-4 border-b">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <IconWrapper icon="ai" className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Recomendaciones IA</h3>
                    <p className="text-sm text-muted-foreground">Sugerencias personalizadas para tus proyectos</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <IconWrapper icon="blockchain" className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Multi-chain</h3>
                    <p className="text-sm text-muted-foreground">Soporte para múltiples blockchains</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-8 md:grid-cols-3 mb-16">
          <Card className="bg-gradient-to-br from-background via-primary/5 to-secondary/10 border-primary/20 hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6 text-center space-y-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg flex items-center justify-center mx-auto">
                <IconWrapper icon="performance" className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Conexión Segura</h3>
              <p className="text-muted-foreground">
                Integración segura con las principales wallets Web3 del mercado.
              </p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-background via-green-500/5 to-blue-500/10 border-green-500/20 hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6 text-center space-y-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-lg flex items-center justify-center mx-auto">
                <IconWrapper icon="content" className="h-6 w-6 text-green-500" />
              </div>
              <h3 className="text-xl font-semibold">Dashboard Personal</h3>
              <p className="text-muted-foreground">
                Panel de control personalizado para gestionar todos tus proyectos Web3.
              </p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-background via-blue-500/5 to-purple-500/10 border-blue-500/20 hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6 text-center space-y-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg flex items-center justify-center mx-auto">
                <IconWrapper icon="blockchain" className="h-6 w-6 text-blue-500" />
              </div>
              <h3 className="text-xl font-semibold">Análisis On-chain</h3>
              <p className="text-muted-foreground">
                Datos y métricas en tiempo real directamente de la blockchain.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Card className="inline-block border-primary/20 bg-gradient-to-r from-primary/5 to-secondary/5">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4">¿Listo para conectar tu wallet?</h2>
              <p className="text-muted-foreground mb-6 max-w-md">
                Conecta tu wallet y accede a todas las funcionalidades premium de nuestra plataforma.
              </p>
              
              <div className="flex justify-center gap-4">
            <Button size="lg" onClick={handleButtonClick} className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white">
              <IconWrapper icon="wallet" className="mr-2 h-4 w-4" />
              Conectar Wallet
            </Button>
            <Button variant="outline" size="lg" asChild className="border-primary/20 hover:bg-primary/5">
              <Link href="/contact">
                <IconWrapper icon="support" className="mr-2 h-4 w-4" />
                Contactar Soporte
              </Link>
            </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}