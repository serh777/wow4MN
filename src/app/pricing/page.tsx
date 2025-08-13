'use client';

import React from 'react';
import { Button } from '@/components/ui/button';

import { IconWrapper } from '@/components/ui/icon-wrapper';
import { PricingPlans } from '@/components/pricing/pricing-plans';
import { useToast } from '@/components/ui/use-toast';
import { Sparkles, TrendingUp, Shield, Zap } from 'lucide-react';

export default function PricingPage() {
  const { toast } = useToast();

  // Manejar la compra exitosa de un plan
  const handlePurchase = (planName: string, transactionHash: string) => {
    toast({
      title: 'Plan adquirido',
      description: `Has adquirido el plan ${planName} correctamente. Ahora puedes acceder a todas las herramientas incluidas.`,
      variant: 'default',
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-12 md:py-24">
        {/* Hero Section con estilo moderno */}
        <section className="py-16 md:py-20 bg-gradient-to-br from-background via-primary/5 to-secondary/10 relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
          <div className="absolute top-10 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
          
          <div className="container px-4 md:px-6 relative">
            <div className="text-center space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-full text-sm font-medium">
                <TrendingUp className="w-4 h-4" />
                Precios transparentes y justos
              </div>
              
              <h1 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Planes y Precios
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Elige el plan que mejor se adapte a tus necesidades de optimización Web3. 
                <span className="text-primary font-semibold">Pagos seguros con criptomonedas.</span>
              </p>
              
              {/* Estadísticas de valor */}
              <div className="flex flex-wrap justify-center gap-6 py-4">
                <div className="flex items-center gap-2 text-sm">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <span><strong>Sin</strong> comisiones ocultas</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Shield className="h-4 w-4 text-green-500" />
                  <span><strong>Pagos</strong> seguros Web3</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Zap className="h-4 w-4 text-blue-500" />
                  <span><strong>Activación</strong> instantánea</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <PricingPlans onPurchase={handlePurchase} />

        {/* CTA Section personalizada */}
        <section className="mt-16 py-16 bg-gradient-to-br from-primary/10 via-secondary/5 to-background rounded-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:30px_30px]" />
          <div className="relative text-center space-y-6">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              ¿Necesitas algo diferente?
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Contáctanos para discutir tus necesidades específicas y crear un plan personalizado para tu proyecto. 
              <span className="text-primary font-semibold">Soluciones a medida para proyectos Web3.</span>
            </p>
            
            {/* Beneficios del contacto personalizado */}
            <div className="flex flex-wrap justify-center gap-6 py-4">
              <div className="flex items-center gap-2 text-sm">
                <Sparkles className="h-4 w-4 text-primary" />
                <span><strong>Consulta</strong> gratuita</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Shield className="h-4 w-4 text-green-500" />
                <span><strong>Soporte</strong> personalizado</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Zap className="h-4 w-4 text-blue-500" />
                <span><strong>Implementación</strong> rápida</span>
              </div>
            </div>
            
            <Button variant="outline" size="lg" className="border-primary/20 hover:bg-primary/5">
              <Sparkles className="mr-2 h-4 w-4" />
              Hablar con un Experto
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}