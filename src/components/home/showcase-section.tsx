'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart3, TrendingUp, Shield, Zap, Search, Bot, ArrowRight, CheckCircle, Star, Play } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export function ShowcaseSection() {
  const showcaseItems = [
    {
      title: "Dashboard de Métricas Avanzadas",
      description: "Análisis completo de rendimiento SEO con métricas en tiempo real para optimizar tu presencia digital",
      features: ["Puntuación SEO detallada", "Métricas de rendimiento", "Análisis de velocidad"],
      image: "/images/inicio/metricas.PNG",
      stats: {
        score: "94/100",
        metric: "Performance Score",
        improvement: "+23% este mes"
      }
    },
    {
      title: "Análisis de Smart Contracts",
      description: "Auditoría completa de contratos inteligentes con detección de vulnerabilidades y optimización de gas",
      features: ["Detección de vulnerabilidades", "Análisis de gas", "Verificación de seguridad"],
      image: "/images/inicio/metricas2.PNG",
      stats: {
        score: "98/100",
        metric: "Security Score",
        improvement: "+15% este mes"
      }
    },
    {
      title: "Optimización Web3",
      description: "Herramientas avanzadas para optimizar tu presencia en el ecosistema Web3 y maximizar tu alcance",
      features: ["Análisis de keywords Web3", "Optimización de metadatos", "Estrategias de contenido"],
      image: "/images/inicio/metricas3.PNG",
      stats: {
        score: "92/100",
        metric: "SEO Score",
        improvement: "+31% este mes"
      }
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-background to-muted/20">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4 px-4 py-2">
            <Star className="w-4 h-4 mr-2" />
            Análisis Profesionales
          </Badge>
          <h2 className="text-3xl font-bold tracking-tighter md:text-4xl lg:text-5xl mb-4">
            Ve tus análisis en acción
          </h2>
          <p className="text-muted-foreground md:text-lg max-w-2xl mx-auto">
            Descubre cómo nuestras herramientas transforman la optimización SEO de proyectos Web3 
            con análisis detallados y recomendaciones precisas.
          </p>
          
          {/* Guía de Uso de Herramientas Web3 */}
          <div className="mt-12 max-w-6xl mx-auto">
            <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-2xl p-8 border border-border">
              <h3 className="text-2xl font-bold text-center mb-6 text-foreground flex items-center justify-center gap-2">
                <Bot className="h-6 w-6 text-primary" />
                Guía de Uso - Herramientas Web3
              </h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Pasos del Análisis */}
                <div>
                  <h4 className="font-semibold text-lg mb-4 flex items-center gap-2">
                    <Search className="h-5 w-5 text-blue-600" />
                    Pasos para el Análisis
                  </h4>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <Search className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <h5 className="font-medium">1. Ingresa URL Web3 o Contrato</h5>
                        <p className="text-sm text-muted-foreground">DApps, protocolos DeFi, NFT marketplaces, dominios descentralizados (.eth, .crypto, .dream) o direcciones de contratos</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <Shield className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <h5 className="font-medium">2. Selecciona Red e Indexador</h5>
                        <p className="text-sm text-muted-foreground">Elige la blockchain (Ethereum, Polygon, BSC) y el indexador compatible (The Graph, Moralis, Alchemy)</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <Zap className="h-4 w-4 text-purple-600" />
                      </div>
                      <div>
                        <h5 className="font-medium">3. Configura Opciones</h5>
                        <p className="text-sm text-muted-foreground">Activa metadata, eventos blockchain, transacciones y selecciona tipo de análisis específico</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <BarChart3 className="h-4 w-4 text-orange-600" />
                      </div>
                      <div>
                        <h5 className="font-medium">4. Obtén Análisis Completo</h5>
                        <p className="text-sm text-muted-foreground">Reportes con datos en tiempo real, métricas blockchain, auditorías de seguridad y recomendaciones IA</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Sitios Web3 Compatibles */}
                <div>
                  <h4 className="font-semibold text-lg mb-4 flex items-center gap-2">
                    <Shield className="h-5 w-5 text-green-600" />
                    Sitios Web3 Compatibles
                  </h4>
                  <div className="space-y-3">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border">
                      <h5 className="font-medium text-sm flex items-center gap-2 mb-2">
                        <TrendingUp className="h-4 w-4 text-yellow-600" />
                        Protocolos DeFi
                      </h5>
                      <p className="text-xs text-muted-foreground">Uniswap, Aave, Compound, Curve, PancakeSwap, SushiSwap</p>
                    </div>
                    
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border">
                      <h5 className="font-medium text-sm flex items-center gap-2 mb-2">
                        <Star className="h-4 w-4 text-purple-600" />
                        NFT Marketplaces
                      </h5>
                      <p className="text-xs text-muted-foreground">OpenSea, Rarible, Foundation, SuperRare, LooksRare</p>
                    </div>
                    
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border">
                      <h5 className="font-medium text-sm flex items-center gap-2 mb-2">
                        <Zap className="h-4 w-4 text-blue-600" />
                        Gaming/Metaverse
                      </h5>
                      <p className="text-xs text-muted-foreground">Decentraland, Sandbox, Axie Infinity, Illuvium</p>
                    </div>
                    
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border">
                      <h5 className="font-medium text-sm flex items-center gap-2 mb-2">
                        <CheckCircle className="h-4 w-4 text-indigo-600" />
                        Dominios Descentralizados
                      </h5>
                      <p className="text-xs text-muted-foreground">.eth, .crypto, .nft, .dao, .web3, .dream, .blockchain</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Indexadores y Compatibilidad */}
              <div className="bg-blue-50 dark:bg-blue-950/50 rounded-lg p-4 border border-blue-200 dark:border-blue-800 mb-6">
                <h4 className="font-semibold text-sm flex items-center gap-2 mb-2">
                  <Bot className="h-4 w-4 text-blue-600" />
                  Indexadores Blockchain Integrados
                </h4>
                <p className="text-xs text-muted-foreground mb-3">
                  Nuestro sistema valida automáticamente la compatibilidad entre redes blockchain e indexadores para garantizar análisis precisos con datos en tiempo real.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
                  <span className="bg-white dark:bg-gray-800 px-2 py-1 rounded border">The Graph</span>
                  <span className="bg-white dark:bg-gray-800 px-2 py-1 rounded border">Moralis</span>
                  <span className="bg-white dark:bg-gray-800 px-2 py-1 rounded border">Alchemy</span>
                  <span className="bg-white dark:bg-gray-800 px-2 py-1 rounded border">Infura</span>
                  <span className="bg-white dark:bg-gray-800 px-2 py-1 rounded border">QuickNode</span>
                  <span className="bg-white dark:bg-gray-800 px-2 py-1 rounded border">Ankr</span>
                </div>
              </div>
              
              <div className="text-center">
                <Button asChild variant="outline" className="border-primary/20 hover:bg-primary/5">
                  <Link href="/dashboard">
                    <Zap className="mr-2 h-4 w-4" />
                    Ver Dashboard
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-16 mb-16">
          {showcaseItems.map((item, index) => (
            <div key={index} className="space-y-8">
              {/* Contenido descriptivo */}
              <div className="text-center space-y-8">
                <div className="space-y-6">
                  <h3 className="text-4xl font-bold text-foreground leading-tight">{item.title}</h3>
                  <p className="text-xl text-muted-foreground leading-relaxed max-w-4xl mx-auto font-medium">{item.description}</p>
                </div>

                {/* Descripción detallada de la funcionalidad */}
                 <div className="space-y-6">
                   <h4 className="text-2xl font-bold text-foreground flex items-center justify-center">
                     <Star className="h-6 w-6 text-yellow-500 mr-3" />
                     ¿Cómo funciona?
                   </h4>
                   <div className="max-w-5xl mx-auto">
                     <p className="text-lg text-muted-foreground leading-relaxed text-center">
                       {index === 0 && "Estos gráficos provienen de nuestro motor de análisis SEO Web3 que escanea tu DApp y sitio web en tiempo real, evaluando más de 200 factores de optimización específicos para blockchain. El dashboard muestra métricas de velocidad de carga, compatibilidad con wallets, optimización para Web3, análisis de smart contracts y rendimiento en redes descentralizadas, generando reportes automáticos con recomendaciones específicas para mejorar tu posicionamiento en el ecosistema Web3."}
                       {index === 1 && "Los análisis mostrados son resultado de nuestro auditor de smart contracts que examina el código Solidity línea por línea. Detecta vulnerabilidades conocidas, analiza el consumo de gas, verifica patrones de seguridad y compara con las mejores prácticas de la industria. Cada métrica se actualiza automáticamente cuando despliegas nuevas versiones de tus contratos."}
                       {index === 2 && "Estas métricas se generan mediante nuestro sistema de inteligencia artificial especializado en Web3, que analiza keywords específicas del ecosistema blockchain, optimiza metadatos para DApps y evalúa la presencia en redes sociales descentralizadas. El algoritmo aprende continuamente de las tendencias del mercado cripto para sugerir estrategias de contenido más efectivas."}
                     </p>
                   </div>
                 </div>
              </div>

              {/* Imagen completa del dashboard */}
              <div className="relative group max-w-4xl mx-auto">
                <div className="relative overflow-hidden rounded-2xl shadow-2xl border border-border group-hover:shadow-3xl transition-all duration-500">
                  <Image
                    src={item.image}
                    alt={`Captura de ${item.title}`}
                    width={800}
                    height={500}
                    className="w-full h-auto object-cover rounded-2xl"
                    priority={index === 0}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-primary/10 via-background to-secondary/10 rounded-2xl p-8 md:p-12">
            <h3 className="text-2xl font-bold mb-4">
              ¿Listo para optimizar tu proyecto Web3?
            </h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Accede a todas nuestras herramientas especializadas y comienza a mejorar 
              la visibilidad de tu proyecto blockchain hoy mismo.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/features">
                <Button variant="outline" size="lg">
                  Ver Todas las Herramientas
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function BenefitsSection() {
  const benefits = [
    {
      icon: Shield,
      title: "Seguridad Web3",
      description: "Análisis de seguridad específicos para contratos inteligentes y aplicaciones descentralizadas."
    },
    {
      icon: TrendingUp,
      title: "Crecimiento Orgánico",
      description: "Estrategias SEO probadas adaptadas al ecosistema blockchain para aumentar tu visibilidad."
    },
    {
      icon: Bot,
      title: "IA Especializada",
      description: "Inteligencia artificial entrenada específicamente en datos y tendencias del mundo Web3."
    }
  ];

  return (
    <section className="py-16 md:py-20 bg-muted/30">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tighter md:text-4xl mb-4">
            Análisis Profesional para Web3
          </h2>
          <p className="text-muted-foreground md:text-lg max-w-2xl mx-auto">
            Desarrolladas por expertos en SEO y blockchain, nuestras herramientas ofrecen 
            ventajas únicas para proyectos Web3.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <div key={index} className="text-center group">
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <benefit.icon className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}