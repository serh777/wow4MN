'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Icons } from '@/components/ui/icons';
import Link from 'next/link';
import { IconWrapper } from '@/components/ui/icon-wrapper';

export default function PerformanceToolPage() {



  return (
    <div className="min-h-screen bg-background">
      <div className="container py-12 md:py-24">
        <div className="text-center space-y-4 mb-12">
          <div className="mx-auto h-16 w-16 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
            <IconWrapper icon="performance" className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight">Análisis de Rendimiento</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Evalúa y optimiza el rendimiento de tus smart contracts y aplicaciones Web3 para una mejor experiencia de usuario
          </p>
        </div>

        <div className="grid gap-12 md:grid-cols-2 items-center mb-16">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">¿Qué analizamos?</h2>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <IconWrapper icon="success" className="h-5 w-5 text-green-500 mt-1" />
                <div>
                  <h3 className="font-medium">Optimización de Gas</h3>
                  <p className="text-muted-foreground">Análisis y recomendaciones para reducir costos de gas en tus contratos</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <IconWrapper icon="success" className="h-5 w-5 text-green-500 mt-1" />
                <div>
                  <h3 className="font-medium">Eficiencia de Contratos</h3>
                  <p className="text-muted-foreground">Evaluación de la eficiencia y optimización del código de tus smart contracts</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <IconWrapper icon="success" className="h-5 w-5 text-green-500 mt-1" />
                <div>
                  <h3 className="font-medium">Métricas de Rendimiento</h3>
                  <p className="text-muted-foreground">Monitoreo de tiempos de respuesta, costos y eficiencia en la blockchain</p>
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
                    <h3 className="font-medium">Análisis en Tiempo Real</h3>
                    <p className="text-sm text-muted-foreground">Monitoreo continuo del rendimiento</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 pb-4 border-b">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <IconWrapper icon="ai" className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Optimización Automática</h3>
                    <p className="text-sm text-muted-foreground">Sugerencias de mejora basadas en IA</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <IconWrapper icon="blockchain" className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Múltiples Blockchains</h3>
                    <p className="text-sm text-muted-foreground">Soporte para las principales redes</p>
                  </div>
                </div>

              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-8 md:grid-cols-3 mb-16">
          <Card className="group hover:shadow-2xl transition-all duration-500 border-0 bg-gradient-to-br from-orange-500/10 via-red-500/10 to-pink-500/10 hover:from-orange-500/20 hover:via-red-500/20 hover:to-pink-500/20">
            <CardContent className="p-8 space-y-4">
              <div className="h-12 w-12 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <IconWrapper icon="performance" className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white">Análisis en Tiempo Real</h3>
              <p className="text-white/80">
                Monitoreo continuo del rendimiento de tus aplicaciones Web3.
              </p>
            </CardContent>
          </Card>
          <Card className="group hover:shadow-2xl transition-all duration-500 border-0 bg-gradient-to-br from-cyan-500/10 via-blue-500/10 to-indigo-500/10 hover:from-cyan-500/20 hover:via-blue-500/20 hover:to-indigo-500/20">
            <CardContent className="p-8 space-y-4">
              <div className="h-12 w-12 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <IconWrapper icon="content" className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white">Optimización Avanzada</h3>
              <p className="text-white/80">
                Mejoras automáticas basadas en inteligencia artificial.
              </p>
            </CardContent>
          </Card>
          <Card className="group hover:shadow-2xl transition-all duration-500 border-0 bg-gradient-to-br from-violet-500/10 via-purple-500/10 to-fuchsia-500/10 hover:from-violet-500/20 hover:via-purple-500/20 hover:to-fuchsia-500/20">
            <CardContent className="p-8 space-y-4">
              <div className="h-12 w-12 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <IconWrapper icon="blockchain" className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white">Integración Web3</h3>
              <p className="text-white/80">
                Compatibilidad total con el ecosistema blockchain.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="text-center space-y-6">
          <h2 className="text-3xl font-bold">¿Listo para optimizar tu rendimiento?</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Mejora la eficiencia y reduce los costos de tus operaciones en la blockchain.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/register">
              <Button 
                size="lg"
                className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <IconWrapper icon="performance" className="mr-2 h-4 w-4" />
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