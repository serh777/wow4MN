'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Icons } from '@/components/icons';
import Link from 'next/link';
// Wrapper component for icons
const IconWrapper = ({ icon, className }: { icon: keyof typeof Icons, className?: string }) => {
  const IconComponent = Icons[icon];
  return <IconComponent className={className} />;
};

export default function LinksToolPage() {



  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        {/* Hero Section */}
        <div className="text-center space-y-6 mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl mb-6">
            <IconWrapper icon="links" className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Análisis de Enlaces
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Optimiza la estructura de enlaces de tu sitio Web3. Detecta enlaces rotos, 
            mejora la navegación y potencia tu SEO con análisis avanzados.
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-12 items-start mb-16">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">¿Qué analizamos?</h2>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <IconWrapper icon="success" className="h-5 w-5 text-green-500 mt-1" />
                <div>
                  <h3 className="font-medium">Enlaces Internos y Externos</h3>
                  <p className="text-muted-foreground">Análisis completo de todos los enlaces de tu sitio web y su funcionalidad</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <IconWrapper icon="success" className="h-5 w-5 text-green-500 mt-1" />
                <div>
                  <h3 className="font-medium">Detección de Enlaces Rotos</h3>
                  <p className="text-muted-foreground">Identificación automática de enlaces que no funcionan o devuelven errores</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <IconWrapper icon="success" className="h-5 w-5 text-green-500 mt-1" />
                <div>
                  <h3 className="font-medium">Optimización SEO</h3>
                  <p className="text-muted-foreground">Recomendaciones para mejorar la estructura de enlaces y el posicionamiento</p>
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
                    <h3 className="font-medium">Análisis Profundo</h3>
                    <p className="text-sm text-muted-foreground">Evaluación completa de la estructura de enlaces</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 pb-4 border-b">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <IconWrapper icon="ai" className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">IA Especializada</h3>
                    <p className="text-sm text-muted-foreground">Algoritmos avanzados para detectar problemas</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <IconWrapper icon="blockchain" className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Ecosistema Web3</h3>
                    <p className="text-sm text-muted-foreground">Especializado en sitios y aplicaciones Web3</p>
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
                Obtén resultados instantáneos y monitorea el estado de tus enlaces continuamente.
              </p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-background via-green-500/5 to-blue-500/10 border-green-500/20 hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6 text-center space-y-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-lg flex items-center justify-center mx-auto">
                <IconWrapper icon="content" className="h-6 w-6 text-green-500" />
              </div>
              <h3 className="text-xl font-semibold">Optimización Avanzada</h3>
              <p className="text-muted-foreground">
                Recomendaciones específicas para mejorar la navegación y experiencia del usuario.
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
                Análisis especializado para DApps, DEXs y otros proyectos del ecosistema Web3.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="text-center space-y-6">
          <h2 className="text-3xl font-bold">¿Listo para optimizar tus enlaces?</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Mejora la navegación de tu sitio Web3 y detecta problemas antes de que afecten a tus usuarios.
          </p>
          <div className="flex justify-center gap-4">
            <Button asChild size="lg" className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white">
              <Link href="/register">
                <IconWrapper icon="links" className="mr-2 h-4 w-4" />
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