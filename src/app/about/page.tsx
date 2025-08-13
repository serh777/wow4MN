'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

import Link from 'next/link';
import Image from 'next/image';
import { Icons } from '@/components/ui/icons';
import { IconWrapper } from '@/components/ui/icon-wrapper';
import { Sparkles, TrendingUp, Shield, Zap, Globe, Bot, BarChart3 } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container py-12 md:py-24">
        {/* Hero Section */}
        <section className="py-20 text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tight md:text-6xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Quiénes Somos
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Somos una agencia especializada en desarrollo Web3 y soluciones blockchain empresariales, 
              comprometidos con la innovación y la excelencia en el ecosistema descentralizado.
            </p>
          </div>
        </section>

        {/* Nuestra Historia Section */}
        <section className="py-16">
          <div className="text-center max-w-4xl mx-auto">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Nuestra Historia
            </h2>
            <div className="space-y-4 text-lg text-muted-foreground leading-relaxed">
              <p>
                WowSeoWeb3 se estableció como una agencia de desarrollo especializada en soluciones blockchain empresariales. Reconociendo la creciente demanda de herramientas profesionales en el ecosistema Web3, nos posicionamos como líderes en el desarrollo de aplicaciones descentralizadas y herramientas de análisis especializadas.
              </p>
              <p>
                Nuestra empresa WowSeoWeb3 ha desarrollado una metodología única que combina las mejores prácticas del desarrollo tradicional con las innovaciones más avanzadas del ecosistema descentralizado y la inteligencia artificial. Utilizamos IA para optimizar el desarrollo, automatizar procesos y crear soluciones más inteligentes y eficientes, entregando productos robustos y escalables para empresas de todos los tamaños.
              </p>
              <p>
                Como agencia, ofrecemos servicios integrales que van desde el desarrollo de contratos inteligentes hasta la implementación de herramientas SEO especializadas para Web3. Integramos tecnologías como React, Next.js, Solidity, múltiples protocolos blockchain y sistemas de IA avanzados para crear soluciones que impulsen el crecimiento y la innovación de nuestros clientes.
              </p>
            </div>
          </div>
        </div>
        </section>

        {/* Nuestros Servicios Section */}
        <section className="py-16">
          <div className="text-center space-y-6 mb-12">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Nuestros Servicios
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Ofrecemos soluciones completas para el ecosistema Web3, desde desarrollo hasta implementación.
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-3 mb-16">
            <div className="space-y-4">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <IconWrapper icon="blockchain" className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Smart Contracts</h3>
              <p className="text-muted-foreground">
                Desarrollo y auditoría de contratos inteligentes seguros y eficientes para diversas blockchains. 
                Implementamos lógica de negocio compleja con las mejores prácticas de seguridad.
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <IconWrapper icon="wallet" className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Integración de Wallets</h3>
              <p className="text-muted-foreground">
                Conectamos tu aplicación con las principales wallets del mercado: MetaMask, WalletConnect, 
                Coinbase Wallet y más. Experiencia de usuario fluida y segura.
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <IconWrapper icon="analytics" className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Diseño UI/UX Web3</h3>
              <p className="text-muted-foreground">
                Diseñamos interfaces modernas y funcionales específicamente optimizadas para aplicaciones 
                descentralizadas, priorizando usabilidad y experiencia del usuario.
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <IconWrapper icon="ai" className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Herramientas SEO Web3</h3>
              <p className="text-muted-foreground">
                Desarrollamos herramientas especializadas para optimización SEO en proyectos blockchain, 
                mejorando la visibilidad y alcance de tu proyecto descentralizado.
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Globe className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Desarrollo Full-Stack</h3>
              <p className="text-muted-foreground">
                Creamos aplicaciones web completas con tecnologías modernas: React, Next.js, Node.js, 
                bases de datos y servicios cloud, todo integrado con blockchain.
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Consultoría Blockchain</h3>
              <p className="text-muted-foreground">
                Asesoramos en la implementación de soluciones blockchain, selección de tecnologías 
                y estrategias de tokenización para tu proyecto o empresa.
              </p>
            </div>
          </div>
        </section>

        {/* Nuestra Filosofía Section */}
        <section className="py-16">
          <div className="text-center space-y-6 mb-12">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Nuestra Filosofía
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              En WowSeoWeb3 creemos firmemente que la tecnología blockchain debe ser accesible y práctica. 
              Nuestros servicios están diseñados para ser intuitivos, potentes y escalables, 
              desde startups innovadoras hasta empresas establecidas que buscan adoptar Web3.
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-3 mb-16">
            <Card className="bg-gradient-to-br from-background via-primary/5 to-secondary/10 border-primary/20 hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6 text-center space-y-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg flex items-center justify-center mx-auto">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Innovación</h3>
                <p className="text-muted-foreground">
                  Desarrollamos constantemente nuevas soluciones y mejoramos nuestros servicios para mantenernos a la vanguardia del ecosistema Web3.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-background via-green-500/5 to-blue-500/10 border-green-500/20 hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6 text-center space-y-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-lg flex items-center justify-center mx-auto">
                  <Globe className="h-6 w-6 text-green-500" />
                </div>
                <h3 className="text-xl font-semibold">Accesibilidad</h3>
                <p className="text-muted-foreground">
                  Hacemos que las tecnologías blockchain complejas sean accesibles para empresas de todos los tamaños y sectores.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-background via-blue-500/5 to-purple-500/10 border-blue-500/20 hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6 text-center space-y-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg flex items-center justify-center mx-auto">
                  <Shield className="h-6 w-6 text-blue-500" />
                </div>
                <h3 className="text-xl font-semibold">Excelencia</h3>
                <p className="text-muted-foreground">
                  Nos comprometemos con la máxima calidad en cada proyecto, servicio y solución que entregamos a nuestros clientes.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA Section final */}
        <section className="py-16 bg-gradient-to-br from-primary/10 via-secondary/5 to-background rounded-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:30px_30px]" />
          <div className="relative text-center space-y-6">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              ¿Listo para transformar tu proyecto con Web3?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Contáctanos para desarrollar soluciones blockchain personalizadas que impulsen tu negocio hacia el futuro descentralizado.
            </p>
            
            {/* Beneficios empresariales */}
            <div className="flex flex-wrap justify-center gap-6 py-4">
              <div className="flex items-center gap-2 text-sm">
                <TrendingUp className="h-4 w-4 text-primary" />
                <span><strong>Soluciones</strong> escalables</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Zap className="h-4 w-4 text-green-500" />
                <span><strong>Desarrollo</strong> ágil</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Bot className="h-4 w-4 text-blue-500" />
                <span><strong>Tecnología</strong> avanzada</span>
              </div>
            </div>
            

          </div>
        </section>

        {/* Leadership Section */}
        <section className="py-16">
          <div className="text-center space-y-8">
            <div className="relative mx-auto w-32 h-32">
              <Image
                src="/images/perfil/serhiy-s-wowseoweb3.jpg"
                alt="Serhiy S. - CEO WowSeoWeb3"
                width={128}
                height={128}
                className="rounded-full object-cover w-full h-full shadow-lg border-4 border-primary/20"
                draggable={false}
                onContextMenu={(e) => e.preventDefault()}
                onDragStart={(e) => e.preventDefault()}
              />
            </div>
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-primary">Serhiy S.</h3>
              <div className="text-center space-y-2">
                <p className="text-lg font-semibold text-primary">
                  CEO & Director de Tecnología (CTO)
                </p>
                <div className="flex flex-wrap justify-center gap-3 text-sm text-muted-foreground">
                  <span className="bg-primary/10 px-3 py-1 rounded-full">IA Expert</span>
                  <span className="bg-primary/10 px-3 py-1 rounded-full">Marketing Online</span>
                  <span className="bg-primary/10 px-3 py-1 rounded-full">Automatización de Sistemas</span>
                </div>
              </div>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Estaré encantado de atenderte y ayudarte a resolver cualquier problema o duda que tengas. 
                No dudes en contactarme para ver cómo podemos impulsar tu proyecto Web3.
              </p>
              <Button asChild className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white">
                <Link href="/contact">
                  <Sparkles className="mr-2 h-4 w-4" />
                  Contactar Directamente
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}