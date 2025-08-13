'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Icons } from '@/components/icons';
import Link from 'next/link';
import { useToast } from '@/components/ui/use-toast';
import { useContract } from '@/hooks/use-contract';

// Componente IconWrapper para mantener consistencia
const IconWrapper = ({ icon, className }: { icon: keyof typeof Icons, className?: string }) => {
  const Icon = Icons[icon] || Icons.settings;
  return <Icon className={className} />;
};

export default function AIAssistantToolPage() {
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
      await emitToolAction('ai-assistant', 'ANALYSIS', 'ai-assistant-tool-page');
      
      toast({
        title: 'Análisis completado',
        description: 'El análisis del asistente IA ha sido completado exitosamente.',
        variant: 'default'
      });
      
      // Redirigir a la página principal de la herramienta
      window.location.href = '/dashboard/ai-assistant';
    } catch (error) {
      console.error('Error al realizar el análisis:', error);
      toast({
        title: 'Error en el análisis',
        description: 'Ha ocurrido un error al realizar el análisis del asistente IA.',
        variant: 'destructive'
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-12 md:py-24">
        {/* Encabezado */}
        <div className="text-center space-y-4 mb-16">
          <div className="mx-auto h-20 w-20 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
            <IconWrapper icon="ai" className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight">Asistente IA</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Optimiza tu proyecto Web3 con recomendaciones personalizadas generadas por inteligencia artificial
          </p>
        </div>

        {/* Características principales */}
        <div className="grid gap-8 md:grid-cols-3 mb-16">
          <div className="space-y-4">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <IconWrapper icon="ai" className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold">Análisis Personalizado</h3>
            <p className="text-muted-foreground">
              Nuestro asistente IA analiza tu proyecto y genera recomendaciones específicas para mejorar su visibilidad y rendimiento.
            </p>
          </div>
          <div className="space-y-4">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <IconWrapper icon="metadata" className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold">Optimización SEO Web3</h3>
            <p className="text-muted-foreground">
              Mejora la visibilidad de tus smart contracts y aplicaciones descentralizadas con estrategias SEO específicas para Web3.
            </p>
          </div>
          <div className="space-y-4">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <IconWrapper icon="analytics" className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold">Métricas Accionables</h3>
            <p className="text-muted-foreground">
              Recibe métricas claras y recomendaciones accionables que puedes implementar inmediatamente en tu proyecto.
            </p>
          </div>
        </div>

        {/* Sección de ejemplos */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-center mb-8">Ejemplos de Análisis</h2>
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4">
                  <IconWrapper icon="search" className="h-5 w-5 text-blue-500" />
                </div>
                <h3 className="font-bold mb-2">Estrategia de Keywords</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Análisis para encontrar las mejores palabras clave para tu proyecto Web3
                </p>
                <Link href="/examples/keywords">
                  <Button variant="outline" size="sm" className="w-full">
                    Ver Ejemplo
                  </Button>
                </Link>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center mb-4">
                  <IconWrapper icon="metadata" className="h-5 w-5 text-green-500" />
                </div>
                <h3 className="font-bold mb-2">Análisis de Metadatos</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Optimización de metadatos para smart contracts y dApps
                </p>
                <Link href="/examples/metadata">
                  <Button variant="outline" size="sm" className="w-full">
                    Ver Ejemplo
                  </Button>
                </Link>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="h-10 w-10 rounded-lg bg-purple-500/10 flex items-center justify-center mb-4">
                  <IconWrapper icon="social" className="h-5 w-5 text-purple-500" />
                </div>
                <h3 className="font-bold mb-2">Estrategias Sociales</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Planes para redes sociales y marketing digital
                </p>
                <Link href="/examples/social">
                  <Button variant="outline" size="sm" className="w-full">
                    Ver Ejemplo
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="text-center space-y-6">
          <h2 className="text-3xl font-bold">¿Listo para optimizar con IA?</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Comienza a mejorar tu proyecto Web3 con recomendaciones personalizadas de nuestro asistente IA.
          </p>
          <div className="flex justify-center gap-4">
            <Button asChild size="lg" className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white">
              <Link href="/register">
                <IconWrapper icon="ai" className="mr-2 h-4 w-4" />
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