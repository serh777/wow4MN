'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Icons } from '@/components/ui/icons';
import { IconWrapper } from '@/components/ui/icon-wrapper';

export default function SocialExamplePage() {
  return (
    <div className="container py-6 space-y-6">
      <div className="flex flex-col space-y-2">
        <div className="flex items-center gap-4 mb-4">
          <Link href="/">
            <Button variant="outline" size="sm">
              <IconWrapper icon="arrowLeft" className="mr-2 h-4 w-4" />
              Volver al Inicio
            </Button>
          </Link>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Ejemplo: Estrategias para Redes Sociales</h1>
        <p className="text-muted-foreground">
          Ejemplos de estrategias para aumentar engagement y conversiones en redes sociales
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Consulta de Ejemplo</CardTitle>
            <CardDescription>
              Esta es la consulta que se utilizó para generar el análisis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-muted p-4 rounded-lg">
              <p className="font-mono text-sm">
                Crea una estrategia de redes sociales para promocionar mi proyecto Web3 y aumentar la adopción
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center">
                  <IconWrapper icon="instagram" className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle>Estrategia para Instagram</CardTitle>
                  <CardDescription>Ejemplo de estrategia para aumentar engagement</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-pink-500/10 to-purple-500/10 p-4 rounded-lg border border-pink-500/20">
                  <p className="font-semibold text-pink-700 dark:text-pink-300 mb-2">
                    <IconWrapper icon="target" className="inline mr-2 h-4 w-4" />
                    Objetivo: Aumentar el engagement en un 25% en 3 meses
                  </p>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <div className="bg-green-500/20 rounded-full h-6 w-6 flex items-center justify-center text-green-500 font-bold shrink-0 mt-0.5">1</div>
                    <span className="text-sm">Publicar contenido visual 3 veces por semana mostrando el desarrollo del proyecto</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="bg-green-500/20 rounded-full h-6 w-6 flex items-center justify-center text-green-500 font-bold shrink-0 mt-0.5">2</div>
                    <span className="text-sm">Utilizar hashtags relevantes: #Web3 #DeFi #NFT #Blockchain #Crypto</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="bg-green-500/20 rounded-full h-6 w-6 flex items-center justify-center text-green-500 font-bold shrink-0 mt-0.5">3</div>
                    <span className="text-sm">Crear Reels semanales mostrando casos de uso y testimonios</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="bg-green-500/20 rounded-full h-6 w-6 flex items-center justify-center text-green-500 font-bold shrink-0 mt-0.5">4</div>
                    <span className="text-sm">Interactuar activamente respondiendo comentarios en menos de 2 horas</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="bg-green-500/20 rounded-full h-6 w-6 flex items-center justify-center text-green-500 font-bold shrink-0 mt-0.5">5</div>
                    <span className="text-sm">Colaborar con micro-influencers del sector Web3</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                  <IconWrapper icon="twitter" className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle>Estrategia para Twitter/X</CardTitle>
                  <CardDescription>Plan para aumentar seguidores y conversiones</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 p-4 rounded-lg border border-blue-500/20">
                  <p className="font-semibold text-blue-700 dark:text-blue-300 mb-2">
                    <IconWrapper icon="target" className="inline mr-2 h-4 w-4" />
                    Objetivo: Generar tráfico cualificado a la web
                  </p>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <div className="bg-green-500/20 rounded-full h-6 w-6 flex items-center justify-center text-green-500 font-bold shrink-0 mt-0.5">1</div>
                    <span className="text-sm">Publicar 5-7 tweets diarios con contenido de valor sobre Web3</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="bg-green-500/20 rounded-full h-6 w-6 flex items-center justify-center text-green-500 font-bold shrink-0 mt-0.5">2</div>
                    <span className="text-sm">Participar en conversaciones relevantes usando hashtags trending</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="bg-green-500/20 rounded-full h-6 w-6 flex items-center justify-center text-green-500 font-bold shrink-0 mt-0.5">3</div>
                    <span className="text-sm">Compartir estadísticas y datos interesantes del mercado crypto</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="bg-green-500/20 rounded-full h-6 w-6 flex items-center justify-center text-green-500 font-bold shrink-0 mt-0.5">4</div>
                    <span className="text-sm">Crear hilos explicativos sobre tecnología blockchain</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="bg-green-500/20 rounded-full h-6 w-6 flex items-center justify-center text-green-500 font-bold shrink-0 mt-0.5">5</div>
                    <span className="text-sm">Utilizar llamadas a la acción efectivas en cada tweet</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                <IconWrapper icon="calendar" className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle>Calendario Editorial</CardTitle>
                <CardDescription>Ejemplo de planificación mensual para redes sociales</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 p-4 rounded-lg border border-green-500/20">
                <p className="font-semibold text-green-700 dark:text-green-300 mb-4">
                  Un calendario editorial bien estructurado debe incluir:
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-bold text-primary flex items-center gap-2">
                    <IconWrapper icon="check" className="h-4 w-4" />
                    Elementos esenciales
                  </h4>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <div className="h-2 w-2 bg-primary rounded-full"></div>
                      <span className="text-sm">Fechas de publicación específicas</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-2 w-2 bg-primary rounded-full"></div>
                      <span className="text-sm">Plataformas donde se publicará</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-2 w-2 bg-primary rounded-full"></div>
                      <span className="text-sm">Tipo de contenido (imagen, video, texto)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-2 w-2 bg-primary rounded-full"></div>
                      <span className="text-sm">Tema o mensaje principal</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-2 w-2 bg-primary rounded-full"></div>
                      <span className="text-sm">Hashtags a utilizar</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-2 w-2 bg-primary rounded-full"></div>
                      <span className="text-sm">Call-to-action específico</span>
                    </li>
                  </ul>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-bold text-primary flex items-center gap-2">
                    <IconWrapper icon="analytics" className="h-4 w-4" />
                    Métricas a seguir
                  </h4>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm">Engagement rate por publicación</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm">Alcance y impresiones</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm">Clicks en enlaces</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm">Nuevos seguidores</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm">Conversiones a la web</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm">Menciones y shares</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="bg-card p-4 rounded-lg border border-border">
                <h4 className="font-bold text-primary mb-3 flex items-center gap-2">
                  <IconWrapper icon="lightbulb" className="h-4 w-4" />
                  Consejos adicionales
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium mb-2">Timing óptimo:</p>
                    <ul className="space-y-1 text-muted-foreground">
                      <li>• Twitter: 9-10 AM y 7-9 PM</li>
                      <li>• Instagram: 11 AM-1 PM y 7-9 PM</li>
                      <li>• LinkedIn: 8-10 AM y 12-2 PM</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-medium mb-2">Frecuencia recomendada:</p>
                    <ul className="space-y-1 text-muted-foreground">
                      <li>• Twitter: 3-5 veces al día</li>
                      <li>• Instagram: 1 vez al día</li>
                      <li>• LinkedIn: 2-3 veces por semana</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <div className="flex gap-3 w-full">
              <Link href="/examples/metadata" className="flex-1">
                <Button variant="outline" className="w-full">
                  <IconWrapper icon="arrowLeft" className="mr-2 h-4 w-4" />
                  Ejemplo Anterior
                </Button>
              </Link>
              <Link href="/register" className="flex-1">
                <Button className="w-full">
                  Acceder a Herramientas
                  <IconWrapper icon="home" className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}