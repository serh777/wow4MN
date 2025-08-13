'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Icons } from '@/components/ui/icons';
import { IconWrapper } from '@/components/ui/icon-wrapper';

export default function MetadataExamplePage() {
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
        <h1 className="text-3xl font-bold tracking-tight">Ejemplo: Análisis de Metadatos</h1>
        <p className="text-muted-foreground">
          Ejemplo de análisis para optimizar los metadatos de un smart contract
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
                Analiza cómo puedo optimizar los metadatos de mi smart contract para mejorar su visibilidad en exploradores de bloques
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
                    <IconWrapper icon="metadata" className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-primary">Análisis de Metadatos</h3>
                    <p className="text-sm text-muted-foreground">Resultados generados por IA</p>
                  </div>
                </div>
                
                <h1 className="text-2xl font-bold text-primary mb-6 border-b border-primary/20 pb-2">Optimización de Metadatos On-Chain</h1>
                
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <span className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs">
                    <IconWrapper icon="search" className="h-3 w-3" />
                  </span>
                  Hallazgos principales
                </h2>
                
                <div className="space-y-4 mb-8">
                  <div className="flex gap-3 items-start bg-card p-3 rounded-lg border border-border">
                    <div className="bg-primary/10 rounded-full h-6 w-6 flex items-center justify-center text-primary font-bold shrink-0 mt-0.5">1</div>
                    <div>
                      <span className="font-bold text-primary">Nombres descriptivos</span> - Los nombres de contratos, funciones y eventos deben ser descriptivos y contener palabras clave relevantes.
                    </div>
                  </div>
                  
                  <div className="flex gap-3 items-start bg-card p-3 rounded-lg border border-border">
                    <div className="bg-primary/10 rounded-full h-6 w-6 flex items-center justify-center text-primary font-bold shrink-0 mt-0.5">2</div>
                    <div>
                      <span className="font-bold text-primary">Documentación NatSpec</span> - Implementa comentarios NatSpec completos para mejorar la indexación y legibilidad.
                    </div>
                  </div>
                  
                  <div className="flex gap-3 items-start bg-card p-3 rounded-lg border border-border">
                    <div className="bg-primary/10 rounded-full h-6 w-6 flex items-center justify-center text-primary font-bold shrink-0 mt-0.5">3</div>
                    <div>
                      <span className="font-bold text-primary">URI de metadatos</span> - Utiliza URIs de metadatos que sigan estándares como ERC-721 Metadata o ERC-1155 Metadata.
                    </div>
                  </div>
                </div>
                
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <span className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs">
                    <IconWrapper icon="check" className="h-3 w-3" />
                  </span>
                  Plan de acción
                </h2>
                
                <div className="bg-card rounded-lg p-4 border border-border mb-8">
                  <ol className="list-none space-y-3">
                    <li className="flex items-center gap-3">
                      <div className="bg-green-500/20 rounded-full h-6 w-6 flex items-center justify-center text-green-500 font-bold shrink-0">1</div>
                      <span>Revisa y optimiza los nombres de funciones y eventos con palabras clave relevantes</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="bg-green-500/20 rounded-full h-6 w-6 flex items-center justify-center text-green-500 font-bold shrink-0">2</div>
                      <span>Implementa documentación NatSpec completa en todas las funciones públicas</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="bg-green-500/20 rounded-full h-6 w-6 flex items-center justify-center text-green-500 font-bold shrink-0">3</div>
                      <span>Configura URIs de metadatos siguiendo estándares de la industria</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="bg-green-500/20 rounded-full h-6 w-6 flex items-center justify-center text-green-500 font-bold shrink-0">4</div>
                      <span>Verifica el contrato en exploradores de bloques con código fuente</span>
                    </li>
                  </ol>
                </div>
                
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <span className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs">
                    <IconWrapper icon="code" className="h-3 w-3" />
                  </span>
                  Ejemplo de implementación
                </h2>
                
                <div className="bg-card rounded-lg p-4 border border-border mb-8">
                  <h4 className="font-bold text-primary mb-3">Antes (No optimizado)</h4>
                  <div className="bg-muted p-3 rounded text-sm font-mono mb-4">
                    <div className="text-muted-foreground">{/* Sin documentación NatSpec */}</div>
                    <div>function mint(address to, uint256 tokenId) public {}</div>
                  </div>
                  
                  <h4 className="font-bold text-primary mb-3">Después (Optimizado)</h4>
                  <div className="bg-muted p-3 rounded text-sm font-mono">
                    <div className="text-green-600">{/* /// @title Mint NFT Function */}</div>
                    <div className="text-green-600">{/* /// @notice Mints a new NFT to the specified address */}</div>
                    <div className="text-green-600">{/* /// @param to The address that will receive the minted NFT */}</div>
                    <div className="text-green-600">{/* /// @param tokenId The unique identifier for the NFT */}</div>
                    <div>function mintDigitalArtNFT(address to, uint256 tokenId) public {}</div>
                  </div>
                </div>
                
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <span className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs">
                    <IconWrapper icon="analytics" className="h-3 w-3" />
                  </span>
                  Métricas de seguimiento
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-card p-4 rounded-lg border border-border">
                    <h4 className="font-bold text-primary mb-2">Visibilidad</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Apariciones en exploradores de bloques</li>
                      <li>• Indexación en agregadores DeFi</li>
                      <li>• Menciones en documentación</li>
                      <li>• Búsquedas por nombre del contrato</li>
                    </ul>
                  </div>
                  
                  <div className="bg-card p-4 rounded-lg border border-border">
                    <h4 className="font-bold text-primary mb-2">Adopción</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Número de transacciones</li>
                      <li>• Usuarios únicos</li>
                      <li>• Integraciones con otras dApps</li>
                      <li>• Referencias en código externo</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <div className="flex gap-3 w-full">
              <Link href="/examples/keywords" className="flex-1">
                <Button variant="outline" className="w-full">
                  <IconWrapper icon="arrowLeft" className="mr-2 h-4 w-4" />
                  Ejemplo Anterior
                </Button>
              </Link>
              <Link href="/examples/social" className="flex-1">
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