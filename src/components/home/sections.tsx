'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { IconWrapper } from '@/components/ui/icon-wrapper';
import { DevelopmentPopup } from '@/components/development-popup';
import { Sparkles, TrendingUp, Shield, Zap, BarChart3, FileText, Search, Link as LinkIcon, Gauge, Wallet, Globe, ArrowLeftRight, Bot } from 'lucide-react';
import Link from 'next/link';

export function HeroSection() {
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    // Verificar si el popup ya se mostró antes
    const popupShown = localStorage.getItem('developmentPopupShown');
    
    if (!popupShown) {
      // Mostrar popup después de 3 segundos solo si no se ha mostrado antes
      const timer = setTimeout(() => {
        setShowPopup(true);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleClosePopup = () => {
    setShowPopup(false);
    // Marcar que el popup ya se mostró
    localStorage.setItem('developmentPopupShown', 'true');
  };

  return (
    <>
      <section className="py-20 md:py-28 bg-gradient-to-br from-background via-primary/5 to-secondary/10 relative overflow-hidden">
        {/* Elementos decorativos de fondo */}
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
        
        <div className="container px-4 md:px-6 relative">
          <div className="flex flex-col items-center space-y-6 text-center">
            {/* Badge de desarrollo */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              Herramientas SEO Web3 en modo demo.
            </div>
            
            <div className="space-y-4">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Revolucione su Presencia en Web3 con Analítica SEO y Blockchain
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl leading-relaxed">
                La primera plataforma que combina análisis blockchain avanzado con optimización SEO especializada para proyectos Web3. 
                <span className="text-primary font-semibold">Desarrollado por un especialista en SEO y blockchain.</span>
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
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/auth/wallet-login">
                <Button size="lg" className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90">
                  <Wallet className="mr-2 h-4 w-4" />
                  Conectar Wallet
                </Button>
              </Link>
              <Link href="/register">
                <Button size="lg" variant="outline" className="border-primary/20 hover:bg-primary/5">
                  <Zap className="mr-2 h-4 w-4" />
                  Registro Tradicional
                </Button>
              </Link>
            </div>
            
            {/* Nota personal */}
            <div className="mt-8 p-4 bg-muted/50 rounded-lg border border-primary/10 max-w-md">
              <p className="text-sm text-muted-foreground">
                💡 <strong>Tip del desarrollador:</strong>Las herramientas SEO muestran datos demo mientras implementamos APIs reales.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      <DevelopmentPopup 
        isOpen={showPopup} 
        onClose={handleClosePopup} 
      />
    </>
  );
}

export function FeaturesSection() {
  const [hoveredTool, setHoveredTool] = useState<number | null>(null);
  
  const features = [
    {
      icon: BarChart3,
      title: "Análisis de Metadatos Web3",
      description: "Optimiza los metadatos de tus contratos inteligentes y DApps para mejorar su indexación en buscadores especializados.",
      features: ["Meta tags Web3", "Optimización NFT", "Indexación blockchain", "Schema markup cripto"],
      color: "bg-blue-500/10 text-blue-600",
      gradient: "from-blue-500 to-cyan-500",
      category: "Análisis",
      premium: false,
      stats: { accuracy: "95%", speed: "2.3s", coverage: "12 redes" },
      link: "/register"
    },
    {
      icon: Bot,
      title: "Asistente IA Avanzado",
      description: "Inteligencia artificial especializada en Web3 que analiza tu proyecto y proporciona recomendaciones personalizadas.",
      features: ["Análisis predictivo", "Detección de anomalías", "Oportunidades de mejora", "Recomendaciones IA"],
      color: "bg-purple-500/10 text-purple-600",
      gradient: "from-purple-500 to-pink-500",
      category: "IA",
      premium: true,
      stats: { accuracy: "98%", speed: "1.8s", coverage: "24/7" },
      link: "/register"
    },
    {
      icon: Search,
      title: "Investigación de Palabras Clave Blockchain",
      description: "Descubre las palabras clave más relevantes para tu nicho en el ecosistema blockchain y cripto.",
      features: ["Keywords Web3", "Análisis de competencia", "Tendencias cripto", "Volumen de búsqueda"],
      color: "bg-green-500/10 text-green-600",
      gradient: "from-green-500 to-emerald-500",
      category: "SEO",
      premium: false,
      stats: { accuracy: "92%", speed: "3.1s", coverage: "50M+ keywords" },
      link: "/register"
    },
    {
      icon: Globe,
      title: "Análisis Social Web3",
      description: "Evalúa tu presencia en redes sociales descentralizadas y plataformas blockchain.",
      features: ["Redes descentralizadas", "Engagement cripto", "Comunidad Web3", "Influencer tracking"],
      color: "bg-orange-500/10 text-orange-600",
      gradient: "from-orange-500 to-red-500",
      category: "Social",
      premium: false,
      stats: { accuracy: "89%", speed: "4.2s", coverage: "15 plataformas" },
      link: "/register"
    },
    {
      icon: FileText,
      title: "Auditoría de Contenido",
      description: "Análisis completo del contenido de tu proyecto para optimizar su alcance en el ecosistema Web3.",
      features: ["SEO técnico", "Contenido Web3", "Optimización móvil", "Análisis semántico"],
      color: "bg-indigo-500/10 text-indigo-600",
      gradient: "from-indigo-500 to-blue-500",
      category: "Contenido",
      premium: false,
      stats: { accuracy: "94%", speed: "5.7s", coverage: "100+ métricas" },
      link: "/register"
    },
    {
      icon: Gauge,
      title: "Monitoreo de Rendimiento",
      description: "Supervisa el rendimiento de tu DApp y su posicionamiento en tiempo real.",
      features: ["Métricas en vivo", "Alertas automáticas", "Reportes detallados", "Uptime monitoring"],
      color: "bg-teal-500/10 text-teal-600",
      gradient: "from-teal-500 to-cyan-500",
      category: "Monitoreo",
      premium: true,
      stats: { accuracy: "99%", speed: "Real-time", coverage: "24/7" },
      link: "/register"
    },
    {
      icon: Wallet,
      title: "Análisis de Wallet",
      description: "Examina carteras y transacciones para obtener insights sobre comportamiento de usuarios.",
      features: ["Análisis de transacciones", "Patrones de uso", "Seguridad wallet", "Portfolio tracking"],
      color: "bg-yellow-500/10 text-yellow-600",
      gradient: "from-yellow-500 to-orange-500",
      category: "Blockchain",
      premium: true,
      stats: { accuracy: "96%", speed: "2.9s", coverage: "20+ redes" },
      link: "/register"
    },
    {
      icon: LinkIcon,
      title: "Análisis de Enlaces Web3",
      description: "Evalúa la calidad y relevancia de los enlaces en el ecosistema descentralizado.",
      features: ["Backlinks Web3", "Autoridad de dominio", "Enlaces tóxicos", "Link building"],
      color: "bg-rose-500/10 text-rose-600",
      gradient: "from-rose-500 to-pink-500",
      category: "Enlaces",
      premium: false,
      stats: { accuracy: "91%", speed: "3.8s", coverage: "1M+ dominios" },
      link: "/register"
    },
    {
      icon: ArrowLeftRight,
      title: "Análisis de Competencia DeFi",
      description: "Compara tu protocolo DeFi con la competencia y encuentra oportunidades de mejora.",
      features: ["Benchmarking DeFi", "TVL analysis", "Yield comparison", "Market share"],
      color: "bg-violet-500/10 text-violet-600",
      gradient: "from-violet-500 to-purple-500",
      category: "DeFi",
      premium: true,
      stats: { accuracy: "93%", speed: "4.5s", coverage: "500+ protocolos" },
      link: "/register"
    }
  ];

  return (
    <section className="py-16 md:py-20 bg-gradient-to-br from-background via-primary/5 to-secondary/10 relative overflow-hidden">
      {/* Elementos decorativos de fondo */}
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
      
      <div className="container px-4 md:px-6 relative">
        <div className="text-center space-y-6 mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            9 Herramientas Especializadas
          </div>
          <h2 className="text-3xl font-bold tracking-tighter md:text-4xl lg:text-5xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            9 Herramientas Especializadas para el Ecosistema Web3
          </h2>
          <p className="text-muted-foreground md:text-lg lg:text-xl max-w-4xl mx-auto leading-relaxed">
            Potencia tu proyecto blockchain con nuestro arsenal completo de herramientas SEO especializadas. 
            <span className="text-primary font-semibold">Desde análisis de metadatos hasta monitoreo en tiempo real</span>, 
            tenemos todo lo que necesitas para dominar el ecosistema Web3.
          </p>
          
          {/* Estadísticas globales */}
          <div className="flex flex-wrap justify-center gap-8 py-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">9</div>
              <div className="text-sm text-muted-foreground">Herramientas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-500">20+</div>
              <div className="text-sm text-muted-foreground">Blockchains</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-500">95%</div>
              <div className="text-sm text-muted-foreground">Precisión</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-500">24/7</div>
              <div className="text-sm text-muted-foreground">Monitoreo</div>
            </div>
          </div>
        </div>
        
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            const isHovered = hoveredTool === index;
            
            return (
              <Card 
                key={index} 
                className={`group relative overflow-hidden transition-all duration-500 border-2 cursor-pointer ${
                  isHovered 
                    ? 'shadow-2xl scale-105 border-primary/50 bg-gradient-to-br from-background to-primary/5' 
                    : 'hover:shadow-xl hover:scale-102 hover:border-primary/30'
                }`}
                onMouseEnter={() => setHoveredTool(index)}
                onMouseLeave={() => setHoveredTool(null)}
              >
                {/* Efecto de gradiente de fondo */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                
                {/* Badge de categoría y premium */}
                <div className="absolute top-4 right-4 flex gap-2">
                  <span className="px-2 py-1 text-xs font-medium bg-muted/80 text-muted-foreground rounded-full">
                    {feature.category}
                  </span>
                  {feature.premium && (
                    <span className="px-2 py-1 text-xs font-medium bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-full">
                      Premium
                    </span>
                  )}
                </div>
                
                <CardHeader className="space-y-4 pb-4">
                  <div className={`w-14 h-14 rounded-xl ${feature.color} flex items-center justify-center group-hover:scale-110 transition-all duration-300 relative`}>
                    <IconComponent className={`h-7 w-7 ${feature.color.includes('blue') ? 'text-blue-600 dark:text-blue-400' : 
                      feature.color.includes('purple') ? 'text-purple-600 dark:text-purple-400' :
                      feature.color.includes('green') ? 'text-green-600 dark:text-green-400' :
                      feature.color.includes('orange') ? 'text-orange-600 dark:text-orange-400' :
                      feature.color.includes('indigo') ? 'text-indigo-600 dark:text-indigo-400' :
                      feature.color.includes('teal') ? 'text-teal-600 dark:text-teal-400' :
                      feature.color.includes('yellow') ? 'text-yellow-600 dark:text-yellow-400' :
                      feature.color.includes('rose') ? 'text-rose-600 dark:text-rose-400' :
                      'text-gray-600 dark:text-gray-400'}`} />
                    {isHovered && (
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/20 to-transparent" />
                    )}
                  </div>
                  <div>
                    <CardTitle className="text-xl mb-3 group-hover:text-primary transition-colors">
                      {feature.title}
                    </CardTitle>
                    <CardDescription className="text-sm leading-relaxed text-muted-foreground">
                      {feature.description}
                    </CardDescription>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Estadísticas de la herramienta */}
                  <div className="grid grid-cols-3 gap-2 p-3 bg-muted/30 rounded-lg">
                    <div className="text-center">
                      <div className="text-sm font-semibold text-primary">{feature.stats.accuracy}</div>
                      <div className="text-xs text-muted-foreground">Precisión</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-semibold text-green-600">{feature.stats.speed}</div>
                      <div className="text-xs text-muted-foreground">Velocidad</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-semibold text-blue-600">{feature.stats.coverage}</div>
                      <div className="text-xs text-muted-foreground">Cobertura</div>
                    </div>
                  </div>
                  
                  {/* Lista de características */}
                  <ul className="space-y-2">
                    {feature.features.map((item, idx) => (
                      <li key={idx} className="flex items-center gap-3 text-sm group/item">
                        <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${feature.gradient} group-hover/item:scale-125 transition-transform`} />
                        <span className="group-hover/item:text-primary transition-colors">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                
                <CardFooter className="pt-4">
                  <Link href={feature.link} className="w-full">
                    <Button 
                      className={`w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 ${
                        isHovered ? 'scale-105' : ''
                      }`}
                    >
                      Explorar
                      <ArrowLeftRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            );
          })}
        </div>
        
        {/* CTA Section mejorada */}
        <div className="text-center mt-16 space-y-6">
          <div className="p-8 bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 rounded-2xl border border-primary/20">
            <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              ¿Listo para revolucionar tu SEO Web3?
            </h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Accede a todas las herramientas desde nuestro dashboard unificado y lleva tu proyecto al siguiente nivel.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/features">
                <Button variant="outline" size="lg" className="border-primary/20 hover:bg-primary/5">
                  Ver Demo Interactivo
                  <ArrowLeftRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function HybridAnalysisSection() {
  return (
    <section className="py-16 md:py-20 bg-primary/5">
      <div className="container px-4 md:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl lg:text-5xl">Auditorías Flexibles e Integrales</h2>
            <p className="text-muted-foreground md:text-lg lg:text-xl max-w-3xl mx-auto">
              Nuestro enfoque híbrido te permite elegir entre herramientas individuales especializadas o combinar múltiples análisis para obtener una visión integral de tu proyecto Web3.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
              <div className="bg-background p-6 rounded-lg shadow-lg border">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <IconWrapper icon="metadata" className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Herramientas Individuales</h3>
                <p className="text-sm text-muted-foreground mb-4">Accede a cada herramienta por separado para análisis específicos y detallados.</p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <span className="text-primary">✓</span>
                    <span>Análisis enfocado</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-primary">✓</span>
                    <span>Resultados inmediatos</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-primary">✓</span>
                    <span>Fácil de usar</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-background p-6 rounded-lg shadow-lg border">
                <div className="h-12 w-12 rounded-lg bg-secondary/10 flex items-center justify-center mx-auto mb-4">
                  <IconWrapper icon="analytics" className="h-6 w-6 text-secondary-foreground" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Análisis Personalizado</h3>
                <p className="text-sm text-muted-foreground mb-4">Selecciona las herramientas que necesitas para crear tu análisis ideal.</p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <span className="text-secondary">✓</span>
                    <span>Combinación flexible</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-secondary">✓</span>
                    <span>Reportes unificados</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-secondary">✓</span>
                    <span>Máximo control</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-background p-6 rounded-lg shadow-lg border md:col-span-2 lg:col-span-1">
                <div className="h-12 w-12 rounded-lg bg-gradient-to-r from-primary to-secondary flex items-center justify-center mx-auto mb-4">
                  <IconWrapper icon="ai" className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Datos Blockchain Reales</h3>
                <p className="text-sm text-muted-foreground mb-4">Información actualizada de múltiples fuentes blockchain y Web3.</p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <span className="text-primary">✓</span>
                    <span>Datos en tiempo real</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-primary">✓</span>
                    <span>Múltiples blockchains</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-primary">✓</span>
                    <span>Análisis con IA</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function CTASection() {
  const [showDonationPopup, setShowDonationPopup] = useState(false);

  return (
    <>
      <section className="py-16 md:py-20 bg-gradient-to-r from-primary/10 via-background to-secondary/10">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-6 text-center">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                ¿Listo para revolucionar tu proyecto Web3?
              </h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-lg leading-relaxed">
                Únete a la nueva era del SEO blockchain. Comienza a utilizar nuestras herramientas especializadas y 
                lleva tu presencia Web3 al siguiente nivel con análisis profesionales.
              </p>
            </div>
            
            {/* Estadísticas de impacto */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 py-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">9+</div>
                <div className="text-sm text-muted-foreground">Herramientas SEO</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-secondary">6+</div>
                <div className="text-sm text-muted-foreground">Redes blockchain</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-500">24/7</div>
                <div className="text-sm text-muted-foreground">Análisis en tiempo real</div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/contact">
                <Button size="lg" variant="outline" className="border-primary/20 hover:bg-primary/5">
                  <span className="mr-2">💬</span>
                  Contactar
                </Button>
              </Link>
            </div>
            
            {/* Sección de apoyo al proyecto */}
            <div className="mt-8 p-6 bg-muted/50 rounded-xl border border-primary/10 max-w-lg">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">💝</span>
                <h3 className="font-semibold">¿Te gusta este proyecto?</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Este proyecto es desarrollado de forma independiente. Tu apoyo ayuda a mantener y mejorar las herramientas.
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowDonationPopup(true)}
                className="w-full border-primary/30 hover:bg-primary/10"
              >
                <span className="mr-2">❤️</span>
                Apoyar el Desarrollo
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      <DevelopmentPopup 
        isOpen={showDonationPopup} 
        onClose={() => setShowDonationPopup(false)} 
      />
    </>
  );
}