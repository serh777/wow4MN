'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { IconWrapper } from '@/components/ui/icon-wrapper';

export default function ReportsPage() {
  return (
    <div className="container py-10">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Generador de Informes</h1>
          <Button>
            <IconWrapper icon="add" className="mr-2 h-4 w-4" />
            Nuevo Informe
          </Button>
        </div>
        
        <p className="text-muted-foreground">
          Genera informes detallados sobre el rendimiento de tu proyecto Web3 para compartir con stakeholders.
        </p>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Informe SEO Web3</CardTitle>
              <CardDescription>
                Análisis completo de optimización on-chain
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Incluye análisis de metadatos, contenido y rendimiento técnico.
              </p>
              <Button variant="outline" className="mt-4 w-full">
                <IconWrapper icon="fileText" className="mr-2 h-4 w-4" />
                Generar Informe
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Informe de Rendimiento</CardTitle>
              <CardDescription>
                Métricas de rendimiento y optimización
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Análisis detallado del rendimiento técnico de tu proyecto blockchain.
              </p>
              <Button variant="outline" className="mt-4 w-full">
                <IconWrapper icon="performance" className="mr-2 h-4 w-4" />
                Generar Informe
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Informe Ejecutivo</CardTitle>
              <CardDescription>
                Resumen para presentar a inversores
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Informe conciso con métricas clave y recomendaciones estratégicas.
              </p>
              <Button variant="outline" className="mt-4 w-full">
                <IconWrapper icon="reports" className="mr-2 h-4 w-4" />
                Generar Informe
              </Button>
            </CardContent>
          </Card>
        </div>
        
        <div className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Informes Recientes</CardTitle>
              <CardDescription>
                No hay informes recientes. Genera un nuevo informe para verlo aquí.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  );
}