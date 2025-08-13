'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { IconWrapper } from '@/components/ui/icon-wrapper';
import Link from 'next/link';
import { useToast } from '@/components/ui/use-toast';

import { useContract } from '@/hooks/use-contract';

export default function KeywordsToolPage() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();
  const { emitToolAction, isToolSupported } = useContract();

  const handleStartAnalysis = async () => {
    setIsAnalyzing(true);
    
    try {
      // Simular análisis
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Registrar la acción en el contrato
      if (isToolSupported('keywords')) {
        await emitToolAction('keywords', 'Análisis de Keywords completado', 'keywords-tool-page');
      }
      
      toast({
        title: 'Análisis completado',
        description: 'El análisis de keywords ha sido completado con éxito.',
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
    <div className="min-h-screen bg-background">
      <div className="container py-12 md:py-24">
        <div className="text-center space-y-4 mb-12">
          <div className="mx-auto h-16 w-16 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
            <IconWrapper icon="keywords" className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight">Análisis de Keywords</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Identifica y optimiza las palabras clave más relevantes para tu proyecto en el ecosistema Web3
          </p>
        </div>

        <div className="grid gap-12 md:grid-cols-2 items-center mb-16">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">¿Qué analizamos?</h2>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <IconWrapper icon="success" className="h-5 w-5 text-green-500 mt-1" />
                <div>
                  <h3 className="font-medium">Keywords Blockchain</h3>
                  <p className="text-muted-foreground">Análisis de palabras clave específicas del ecosistema Web3 y DeFi</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <IconWrapper icon="success" className="h-5 w-5 text-green-500 mt-1" />
                <div>
                  <h3 className="font-medium">Tendencias del Mercado</h3>
                  <p className="text-muted-foreground">Identificación de tendencias y oportunidades en el mercado crypto</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <IconWrapper icon="success" className="h-5 w-5 text-green-500 mt-1" />
                <div>
                  <h3 className="font-medium">Análisis Competitivo</h3>
                  <p className="text-muted-foreground">Comparativa con proyectos similares y líderes del mercado</p>
                </div>
              </li>
            </ul>
            <div className="flex gap-4">
              {/* Botón Explorar removido */}
            </div>
          </div>
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center gap-4 pb-4 border-b">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <IconWrapper icon="analytics" className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Análisis Profundo</h3>
                    <p className="text-sm text-muted-foreground">Investigación detallada de keywords Web3</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 pb-4 border-b">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <IconWrapper icon="ai" className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">IA Especializada</h3>
                    <p className="text-sm text-muted-foreground">Recomendaciones basadas en IA</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <IconWrapper icon="blockchain" className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Datos On-chain</h3>
                    <p className="text-sm text-muted-foreground">Análisis basado en datos blockchain</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-8 md:grid-cols-3 mb-16">
          <Card className="relative overflow-hidden bg-gradient-to-br from-emerald-500/5 to-green-500/10 border border-emerald-500/20 hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6 text-center space-y-4">
              <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center mx-auto">
                <IconWrapper icon="performance" className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Análisis en Tiempo Real</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Monitoreo continuo de tendencias y cambios en el mercado crypto.
              </p>
            </CardContent>
          </Card>
          <Card className="relative overflow-hidden bg-gradient-to-br from-indigo-500/5 to-blue-500/10 border border-indigo-500/20 hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6 text-center space-y-4">
              <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center mx-auto">
                <IconWrapper icon="content" className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Optimización de Contenido</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Recomendaciones para optimizar tu contenido con las keywords identificadas.
              </p>
            </CardContent>
          </Card>
          <Card className="relative overflow-hidden bg-gradient-to-br from-rose-500/5 to-pink-500/10 border border-rose-500/20 hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6 text-center space-y-4">
              <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center mx-auto">
                <IconWrapper icon="blockchain" className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Integración Web3</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Análisis específico para cada blockchain y tipo de proyecto.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="text-center space-y-6">
          <h2 className="text-3xl font-bold">¿Listo para optimizar tus keywords?</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Mejora la visibilidad de tu proyecto con palabras clave optimizadas para Web3.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/register">
              <Button 
                size="lg"
                className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <IconWrapper icon="keywords" className="mr-2 h-4 w-4" />
                Comenzar Análisis
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" size="lg">
                <IconWrapper icon="support" className="mr-2 h-4 w-4" />
                Contactar Soporte
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}