'use client';

import React from 'react';

import { Footer } from '@/components/layout/footer';
import { FeaturesSection, HybridAnalysisSection } from '@/components/home/sections';
import { Sparkles, TrendingUp, Shield } from 'lucide-react';

export default function FeaturesPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        {/* Hero Section específico para Features */}
        <section className="py-20 md:py-28 bg-gradient-to-br from-background via-primary/5 to-secondary/10 relative overflow-hidden">
          {/* Elementos decorativos de fondo */}
          <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
          
          <div className="container px-4 md:px-6 relative">
            <div className="flex flex-col items-center space-y-6 text-center">
              {/* Badge de herramientas */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium">
                <Sparkles className="w-4 h-4" />
                Herramientas SEO Web3
              </div>
              
              <div className="space-y-4">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Herramientas especializadas para Web3
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl leading-relaxed">
                  Descubre nuestro conjunto completo de herramientas SEO diseñadas específicamente para proyectos blockchain. 
                  <span className="text-primary font-semibold">Cada herramienta está optimizada para el ecosistema Web3.</span>
                </p>
              </div>
              
              {/* Estadísticas rápidas */}
              <div className="flex flex-wrap justify-center gap-6 py-4">
                <div className="flex items-center gap-2 text-sm">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <span><strong>9</strong> Herramientas especializadas</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span><strong>Multi-red</strong> blockchain</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Shield className="h-4 w-4 text-blue-500" />
                  <span><strong>Análisis</strong> en tiempo real</span>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Sección de herramientas */}
        <FeaturesSection />
        
        {/* Sección de análisis híbrido */}
        <HybridAnalysisSection />
      </main>
      <Footer />
    </div>
  );
}