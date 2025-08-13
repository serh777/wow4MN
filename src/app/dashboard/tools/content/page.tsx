'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { Icons } from '@/components/icons';
import { IconWrapper } from '@/components/ui/icon-wrapper';
import { useToast } from '@/components/ui/use-toast';

import { useContract } from '@/hooks/use-contract';

export default function ContentToolPage() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();
  const { emitToolAction } = useContract();
  
  // Función para manejar el inicio del análisis después del pago
  const handleStartAnalysis = async () => {
    setIsAnalyzing(true);
    
    try {
      // Simular un análisis
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Registrar la acción en el contrato
      await emitToolAction('content', 'ANALYSIS', 'content-tool-page');
      
      toast({
        title: 'Análisis completado',
        description: 'El análisis de contenido ha sido completado exitosamente.',
        variant: 'default'
      });
      
      // Redirigir a la página de resultados o mostrar resultados
      // window.location.href = '/dashboard/tools/content/results';
    } catch (error) {
      console.error('Error al realizar el análisis:', error);
      toast({
        title: 'Error en el análisis',
        description: 'Ha ocurrido un error al realizar el análisis de contenido.',
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
            <IconWrapper icon="content" className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight">Auditoría de Contenido</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Analiza y optimiza el contenido de tu proyecto blockchain para máximo impacto y visibilidad
          </p>
        </div>

        <div className="grid gap-12 md:grid-cols-2 items-center mb-16">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">¿Qué analizamos?</h2>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <IconWrapper icon="success" className="h-5 w-5 text-green-500 mt-1" />
                <div>
                  <h3 className="font-medium">Documentación Técnica</h3>
                  <p className="text-muted-foreground">Análisis de whitepapers, documentación técnica y guías de usuario</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <IconWrapper icon="success" className="h-5 w-5 text-green-500 mt-1" />
                <div>
                  <h3 className="font-medium">Contenido Web3</h3>
                  <p className="text-muted-foreground">Evaluación de contenido en plataformas blockchain y redes sociales descentralizadas</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <IconWrapper icon="success" className="h-5 w-5 text-green-500 mt-1" />
                <div>
                  <h3 className="font-medium">Optimización SEO</h3>
                  <p className="text-muted-foreground">Recomendaciones para mejorar el posicionamiento y alcance del contenido</p>
                </div>
              </li>
            </ul>
            <div className="flex flex-col sm:flex-row gap-4">
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
                    <p className="text-sm text-muted-foreground">Evaluación detallada de todo tu contenido Web3</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 pb-4 border-b">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <IconWrapper icon="ai" className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">IA Especializada</h3>
                    <p className="text-sm text-muted-foreground">Recomendaciones personalizadas con IA</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <IconWrapper icon="blockchain" className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Ecosistema Web3</h3>
                    <p className="text-sm text-muted-foreground">Optimización para plataformas blockchain</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-8 md:grid-cols-3 mb-16">
          <Card className="relative overflow-hidden bg-gradient-to-br from-background via-orange-500/5 to-red-500/10 border-orange-500/20 hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6 text-center space-y-4">
              <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-orange-500/20 to-red-500/20 flex items-center justify-center mx-auto">
                <IconWrapper icon="keywords" className="h-6 w-6 text-orange-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Keywords Web3</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Identificación y optimización de palabras clave específicas del ecosistema blockchain.
              </p>
            </CardContent>
          </Card>
          <Card className="relative overflow-hidden bg-gradient-to-br from-background via-purple-500/5 to-pink-500/10 border-purple-500/20 hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6 text-center space-y-4">
              <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center mx-auto">
                <IconWrapper icon="links" className="h-6 w-6 text-purple-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Estructura de Enlaces</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Análisis y optimización de la estructura de enlaces internos y externos.
              </p>
            </CardContent>
          </Card>
          <Card className="relative overflow-hidden bg-gradient-to-br from-background via-teal-500/5 to-cyan-500/10 border-teal-500/20 hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6 text-center space-y-4">
              <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-teal-500/20 to-cyan-500/20 flex items-center justify-center mx-auto">
                <IconWrapper icon="performance" className="h-6 w-6 text-teal-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Rendimiento</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Evaluación del rendimiento y accesibilidad del contenido.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="text-center space-y-6">
          <h2 className="text-3xl font-bold">¿Listo para mejorar tu contenido?</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Optimiza tu contenido Web3 para alcanzar una mayor audiencia y mejorar el engagement.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/register">
              <Button 
                size="lg"
                className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white"
              >
                <IconWrapper icon="content" className="mr-2 h-4 w-4" />
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