'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Icons } from '@/components/icons';
import Link from 'next/link';
import { useToast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';

import { useContract } from '@/hooks/use-contract';

// Componente IconWrapper para mantener consistencia
const IconWrapper = ({ icon, className }: { icon: keyof typeof Icons, className?: string }) => {
  const Icon = Icons[icon] || Icons.settings;
  return <Icon className={className} />;
};

export default function MetadataToolPage() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();
  const { emitToolAction } = useContract();
  const router = useRouter();
  
  // Función para manejar el inicio del análisis después del pago
  const handleStartAnalysis = async () => {
    setIsAnalyzing(true);
    
    try {
      // Simular un análisis
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Registrar la acción en el contrato
      await emitToolAction('metadata', 'ANALYSIS', 'metadata-tool-page');
      
      toast({
        title: 'Análisis completado',
        description: 'El análisis de metadatos ha sido completado exitosamente.',
        variant: 'default'
      });
      
      // Redirigir a la página principal de la herramienta para iniciar análisis detallado
      router.push(`/dashboard/metadata`);
    } catch (error) {
      console.error('Error al realizar el análisis:', error);
      toast({
        title: 'Error en el análisis',
        description: 'Ha ocurrido un error al realizar el análisis de metadatos.',
        variant: 'destructive'
      });
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  // Función para manejar el pago exitoso
  const handlePaymentSuccess = (transactionHash: string) => {
    toast({
      title: 'Pago exitoso',
      description: `Herramienta desbloqueada. Transacción: ${transactionHash.substring(0, 10)}...`,
      variant: 'default'
    });
    
    // Iniciar análisis automáticamente después del pago
    handleStartAnalysis();
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-12 md:py-24">
        <div className="text-center space-y-4 mb-12">
          <div className="mx-auto h-16 w-16 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
            <IconWrapper icon="metadata" className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight">Análisis de Metadatos</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Optimiza los metadatos de tus smart contracts y tokens para máxima visibilidad en el ecosistema Web3
          </p>
        </div>

        <div className="grid gap-12 md:grid-cols-2 items-center mb-16">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">¿Qué analizamos?</h2>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <IconWrapper icon="success" className="h-5 w-5 text-green-500 mt-1" />
                <div>
                  <h3 className="font-medium">Metadatos de Smart Contracts</h3>
                  <p className="text-muted-foreground">Análisis completo de nombres, símbolos, descripciones y otros metadatos on-chain</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <IconWrapper icon="success" className="h-5 w-5 text-green-500 mt-1" />
                <div>
                  <h3 className="font-medium">Tokens y NFTs</h3>
                  <p className="text-muted-foreground">Evaluación de metadatos de tokens y colecciones NFT para mejor descubrimiento</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <IconWrapper icon="success" className="h-5 w-5 text-green-500 mt-1" />
                <div>
                  <h3 className="font-medium">Optimización SEO</h3>
                  <p className="text-muted-foreground">Recomendaciones para mejorar la visibilidad en exploradores blockchain y motores de búsqueda</p>
                </div>
              </li>
            </ul>

          </div>
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center gap-4 pb-4 border-b">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <IconWrapper icon="analytics" className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Análisis Detallado</h3>
                    <p className="text-sm text-muted-foreground">Evaluación completa de todos los metadatos relevantes</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 pb-4 border-b">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <IconWrapper icon="ai" className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Recomendaciones IA</h3>
                    <p className="text-sm text-muted-foreground">Sugerencias personalizadas basadas en IA</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <IconWrapper icon="blockchain" className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Múltiples Blockchains</h3>
                    <p className="text-sm text-muted-foreground">Soporte para las principales redes blockchain</p>
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
              <h3 className="text-xl font-semibold">Análisis en Tiempo Real</h3>
              <p className="text-muted-foreground">
                Obtén resultados instantáneos y monitorea los cambios en tus metadatos a lo largo del tiempo.
              </p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-background via-green-500/5 to-blue-500/10 border-green-500/20 hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6 text-center space-y-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-lg flex items-center justify-center mx-auto">
                <IconWrapper icon="content" className="h-6 w-6 text-green-500" />
              </div>
              <h3 className="text-xl font-semibold">Mejores Prácticas</h3>
              <p className="text-muted-foreground">
                Recomendaciones basadas en las mejores prácticas del ecosistema Web3 y SEO tradicional.
              </p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-background via-blue-500/5 to-purple-500/10 border-blue-500/20 hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6 text-center space-y-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg flex items-center justify-center mx-auto">
                <IconWrapper icon="blockchain" className="h-6 w-6 text-blue-500" />
              </div>
              <h3 className="text-xl font-semibold">Integración Web3</h3>
              <p className="text-muted-foreground">
                Conecta tu wallet para un análisis más detallado y personalizado de tus proyectos.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="text-center space-y-6">
          <h2 className="text-3xl font-bold">¿Listo para optimizar tus metadatos?</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Comienza a mejorar la visibilidad de tus smart contracts y tokens con nuestras herramientas especializadas.
          </p>
          <div className="flex justify-center gap-4">
            <Button asChild size="lg" className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white">
              <Link href="/register">
                <IconWrapper icon="metadata" className="mr-2 h-4 w-4" />
                Comenzar Análisis
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild className="border-primary/20 hover:bg-primary/5">
              <Link href="/contact">
                <IconWrapper icon="support" className="mr-2 h-4 w-4" />
                Contactar Soporte
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}