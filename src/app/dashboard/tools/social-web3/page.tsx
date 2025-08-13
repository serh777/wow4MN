'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { Icons } from '@/components/icons';
import { IconWrapper } from '@/components/ui/icon-wrapper';
import { useToast } from '@/components/ui/use-toast';

import { useContract } from '@/hooks/use-contract';

export default function SocialWeb3ToolPage() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();
  const { emitToolAction, isToolSupported } = useContract();

  const handleStartAnalysis = async () => {
    setIsAnalyzing(true);
    
    try {
      // Simular análisis
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Registrar la acción en el contrato
      if (isToolSupported('social-web3')) {
        await emitToolAction('social-web3', 'Análisis de Social Web3 completado', 'social-web3-tool-page');
      }
      
      toast({
        title: 'Análisis completado',
        description: 'El análisis de Social Web3 ha sido completado con éxito.',
      });
    } catch (error) {
      console.error('Error al realizar el análisis:', error);
      toast({
        title: 'Error',
        description: 'Ha ocurrido un error al realizar el análisis.',
        variant: 'destructive',
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handlePaymentSuccess = () => {
    toast({
      title: 'Pago exitoso',
      description: 'Tu pago ha sido procesado correctamente. Iniciando análisis...',
    });
    
    // Iniciar análisis después del pago exitoso
    handleStartAnalysis();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5">
      <div className="container py-12 md:py-24">
        <div className="text-center space-y-4 mb-12">
          <div className="mx-auto h-16 w-16 rounded-lg bg-gradient-to-r from-primary/20 to-secondary/20 flex items-center justify-center mb-4 border border-primary/10">
            <IconWrapper icon="blockchain" className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Social Web3</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Optimiza tu presencia en plataformas sociales descentralizadas y aumenta tu visibilidad en el ecosistema Web3
          </p>
        </div>

        <div className="grid gap-12 md:grid-cols-2 items-center mb-16">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">¿Qué analizamos?</h2>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <IconWrapper icon="success" className="h-5 w-5 text-green-500 mt-1" />
                <div>
                  <h3 className="font-medium">Perfiles Descentralizados</h3>
                  <p className="text-muted-foreground">Análisis y optimización de perfiles en Lens Protocol, Farcaster y otras plataformas Web3</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <IconWrapper icon="success" className="h-5 w-5 text-green-500 mt-1" />
                <div>
                  <h3 className="font-medium">Engagement On-chain</h3>
                  <p className="text-muted-foreground">Métricas de interacción y estrategias para aumentar la participación de la comunidad</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <IconWrapper icon="success" className="h-5 w-5 text-green-500 mt-1" />
                <div>
                  <h3 className="font-medium">Reputación Web3</h3>
                  <p className="text-muted-foreground">Evaluación y mejora de tu reputación en el ecosistema blockchain</p>
                </div>
              </li>
            </ul>

          </div>
          <Card className="border-primary/10 bg-gradient-to-r from-primary/5 to-secondary/5 hover:border-primary/20 transition-all duration-300">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center gap-4 pb-4 border-b border-primary/10">
                  <div className="h-10 w-10 rounded-lg bg-gradient-to-r from-primary/20 to-secondary/20 flex items-center justify-center border border-primary/10">
                    <IconWrapper icon="analytics" className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Análisis de Audiencia</h3>
                    <p className="text-sm text-muted-foreground">Comprende a tu comunidad en plataformas Web3</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 pb-4 border-b border-primary/10">
                  <div className="h-10 w-10 rounded-lg bg-gradient-to-r from-primary/20 to-secondary/20 flex items-center justify-center border border-primary/10">
                    <IconWrapper icon="ai" className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Recomendaciones IA</h3>
                    <p className="text-sm text-muted-foreground">Estrategias personalizadas basadas en IA</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-lg bg-gradient-to-r from-primary/20 to-secondary/20 flex items-center justify-center border border-primary/10">
                    <IconWrapper icon="blockchain" className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Integración Multi-plataforma</h3>
                    <p className="text-sm text-muted-foreground">Conecta con todas las redes sociales Web3</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-8 md:grid-cols-3 mb-16">
          <Card className="border-primary/10 bg-gradient-to-r from-primary/5 to-secondary/5 hover:border-primary/20 transition-all duration-300">
            <CardContent className="p-6 space-y-4">
              <div className="h-12 w-12 rounded-lg bg-gradient-to-r from-primary/20 to-secondary/20 flex items-center justify-center border border-primary/10">
                <IconWrapper icon="blockchain" className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Optimización de Perfiles</h3>
              <p className="text-muted-foreground">
                Mejora tus perfiles en plataformas descentralizadas para máxima visibilidad.
              </p>
            </CardContent>
          </Card>
          <Card className="border-primary/10 bg-gradient-to-r from-primary/5 to-secondary/5 hover:border-primary/20 transition-all duration-300">
            <CardContent className="p-6 space-y-4">
              <div className="h-12 w-12 rounded-lg bg-gradient-to-r from-primary/20 to-secondary/20 flex items-center justify-center border border-primary/10">
                <IconWrapper icon="content" className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Estrategia de Contenido</h3>
              <p className="text-muted-foreground">
                Desarrolla una estrategia de contenido efectiva para redes Web3.
              </p>
            </CardContent>
          </Card>
          <Card className="border-primary/10 bg-gradient-to-r from-primary/5 to-secondary/5 hover:border-primary/20 transition-all duration-300">
            <CardContent className="p-6 space-y-4">
              <div className="h-12 w-12 rounded-lg bg-gradient-to-r from-primary/20 to-secondary/20 flex items-center justify-center border border-primary/10">
                <IconWrapper icon="blockchain" className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Conexiones On-chain</h3>
              <p className="text-muted-foreground">
                Analiza y optimiza tus conexiones en el ecosistema blockchain.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Card className="inline-block border-primary/20 bg-gradient-to-r from-primary/5 to-secondary/5">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4">¿Listo para mejorar tu presencia social Web3?</h2>
              <p className="text-muted-foreground mb-6 max-w-md">
                Optimiza tu presencia en plataformas descentralizadas y conecta con tu comunidad de manera más efectiva.
              </p>
              
              <div className="flex justify-center gap-4">
                {isAnalyzing ? (
                  <Button size="lg" disabled>
                    <IconWrapper icon="loading" className="mr-2 h-4 w-4 animate-spin" />
                    Analizando...
                  </Button>
                ) : (
                  <Button asChild size="lg" className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white">
                    <Link href="/register">
                      <IconWrapper icon="blockchain" className="mr-2 h-4 w-4" />
                      Comenzar Análisis
                    </Link>
                  </Button>
                )}
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