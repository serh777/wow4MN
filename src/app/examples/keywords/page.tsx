'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Icons } from '@/components/ui/icons';
import { IconWrapper } from '@/components/ui/icon-wrapper';

export default function KeywordsExamplePage() {
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
        <h1 className="text-3xl font-bold tracking-tight">Ejemplo: Estrategia de Keywords</h1>
        <p className="text-muted-foreground">
          Ejemplo de análisis para encontrar las mejores palabras clave para tu proyecto
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
                Sugiere palabras clave relevantes para un marketplace de NFTs enfocado en arte digital
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Análisis IA</CardTitle>
            <CardDescription>
              Resultados generados por IA
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <div className="bg-gradient-to-r from-primary/5 to-transparent p-6 rounded-lg border-l-4 border-l-primary">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <IconWrapper icon="search" className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-primary">Estrategia de Keywords</h3>
                    <p className="text-sm text-muted-foreground">Resultados generados por IA</p>
                  </div>
                </div>
                
                <h1 className="text-2xl font-bold text-primary mb-6 border-b border-primary/20 pb-2">Keywords para Marketplace NFT de Arte Digital</h1>
                
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <span className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs">
                    <IconWrapper icon="search" className="h-3 w-3" />
                  </span>
                  Keywords principales
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  <div className="bg-card p-4 rounded-lg border border-border">
                    <h3 className="font-bold text-primary mb-2">Keywords Primarias</h3>
                    <div className="flex flex-wrap gap-2">
                      <span className="bg-primary/10 text-primary px-2 py-1 rounded-md text-sm">NFT marketplace</span>
                      <span className="bg-primary/10 text-primary px-2 py-1 rounded-md text-sm">Arte digital NFT</span>
                      <span className="bg-primary/10 text-primary px-2 py-1 rounded-md text-sm">Coleccionables digitales</span>
                      <span className="bg-primary/10 text-primary px-2 py-1 rounded-md text-sm">Comprar NFTs</span>
                      <span className="bg-primary/10 text-primary px-2 py-1 rounded-md text-sm">Vender arte digital</span>
                    </div>
                  </div>
                  
                  <div className="bg-card p-4 rounded-lg border border-border">
                    <h3 className="font-bold text-primary mb-2">Keywords Secundarias</h3>
                    <div className="flex flex-wrap gap-2">
                      <span className="bg-primary/10 text-primary px-2 py-1 rounded-md text-sm">Artistas digitales</span>
                      <span className="bg-primary/10 text-primary px-2 py-1 rounded-md text-sm">Blockchain art</span>
                      <span className="bg-primary/10 text-primary px-2 py-1 rounded-md text-sm">Crypto art</span>
                      <span className="bg-primary/10 text-primary px-2 py-1 rounded-md text-sm">Tokens no fungibles</span>
                      <span className="bg-primary/10 text-primary px-2 py-1 rounded-md text-sm">Web3 gallery</span>
                    </div>
                  </div>
                </div>
                
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <span className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs">
                    <IconWrapper icon="check" className="h-3 w-3" />
                  </span>
                  Estrategia de implementación
                </h2>
                
                <div className="bg-card rounded-lg p-4 border border-border mb-8">
                  <ol className="list-none space-y-3">
                    <li className="flex items-center gap-3">
                      <div className="bg-green-500/20 rounded-full h-6 w-6 flex items-center justify-center text-green-500 font-bold shrink-0">1</div>
                      <span>Optimiza el título y descripción de tu marketplace con las keywords primarias</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="bg-green-500/20 rounded-full h-6 w-6 flex items-center justify-center text-green-500 font-bold shrink-0">2</div>
                      <span>Crea contenido de blog utilizando las keywords secundarias</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="bg-green-500/20 rounded-full h-6 w-6 flex items-center justify-center text-green-500 font-bold shrink-0">3</div>
                      <span>Implementa las keywords en los metadatos de tus smart contracts</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="bg-green-500/20 rounded-full h-6 w-6 flex items-center justify-center text-green-500 font-bold shrink-0">4</div>
                      <span>Utiliza las keywords en las descripciones de los NFTs</span>
                    </li>
                  </ol>
                </div>
                
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <span className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs">
                    <IconWrapper icon="analytics" className="h-3 w-3" />
                  </span>
                  Métricas a seguir
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-card p-4 rounded-lg border border-border">
                    <h4 className="font-bold text-primary mb-2">Métricas SEO</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Posición en rankings de búsqueda</li>
                      <li>• Tráfico orgánico</li>
                      <li>• Click-through rate (CTR)</li>
                      <li>• Tiempo de permanencia</li>
                    </ul>
                  </div>
                  
                  <div className="bg-card p-4 rounded-lg border border-border">
                    <h4 className="font-bold text-primary mb-2">Métricas de Conversión</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Registros de nuevos usuarios</li>
                      <li>• Transacciones completadas</li>
                      <li>• Valor promedio por transacción</li>
                      <li>• Retención de usuarios</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <div className="flex gap-3 w-full">
              <Link href="/register" className="flex-1">
                <Button variant="outline" className="w-full">
                  Acceder a Herramientas
                </Button>
              </Link>
              <Link href="/examples/metadata" className="flex-1">
                <Button className="w-full">
                  Siguiente Ejemplo
                  <IconWrapper icon="arrowRight" className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}