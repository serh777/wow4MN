'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { Icons } from '@/components/ui/icons';
import { IconWrapper } from '@/components/ui/icon-wrapper';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container py-12 md:py-24">
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-4xl font-bold tracking-tight">Política de Privacidad</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Cómo recopilamos, usamos y protegemos tu información en WowSeoWeb3
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-8">
          <Card>
            <CardContent className="p-6 space-y-4">
              <h2 className="text-2xl font-bold">Información que Recopilamos</h2>
              <p className="text-muted-foreground">
                Recopilamos información cuando utilizas nuestros servicios, incluyendo:
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <IconWrapper icon="blockchain" className="h-5 w-5 text-primary mt-1" />
                  <span>Direcciones de wallet públicas para análisis de proyectos</span>
                </li>
                <li className="flex items-start gap-2">
                  <IconWrapper icon="analytics" className="h-5 w-5 text-primary mt-1" />
                  <span>Datos de análisis y métricas de rendimiento</span>
                </li>
                <li className="flex items-start gap-2">
                  <IconWrapper icon="content" className="h-5 w-5 text-primary mt-1" />
                  <span>Contenido y metadatos de smart contracts</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 space-y-4">
              <h2 className="text-2xl font-bold">Uso de la Información</h2>
              <p className="text-muted-foreground">
                Utilizamos la información recopilada para:
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <IconWrapper icon="performance" className="h-5 w-5 text-primary mt-1" />
                  <span>Proporcionar y mejorar nuestros servicios de análisis SEO Web3</span>
                </li>
                <li className="flex items-start gap-2">
                  <IconWrapper icon="ai" className="h-5 w-5 text-primary mt-1" />
                  <span>Generar recomendaciones personalizadas basadas en IA</span>
                </li>
                <li className="flex items-start gap-2">
                  <IconWrapper icon="analytics" className="h-5 w-5 text-primary mt-1" />
                  <span>Analizar tendencias y patrones en el ecosistema blockchain</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 space-y-4">
              <h2 className="text-2xl font-bold">Protección de Datos</h2>
              <p className="text-muted-foreground">
                Implementamos medidas de seguridad para proteger tu información:
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <IconWrapper icon="blockchain" className="h-5 w-5 text-primary mt-1" />
                  <span>Encriptación de datos sensibles</span>
                </li>
                <li className="flex items-start gap-2">
                  <IconWrapper icon="performance" className="h-5 w-5 text-primary mt-1" />
                  <span>Acceso restringido a información personal</span>
                </li>
                <li className="flex items-start gap-2">
                  <IconWrapper icon="analytics" className="h-5 w-5 text-primary mt-1" />
                  <span>Monitoreo continuo de seguridad</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 space-y-4">
              <h2 className="text-2xl font-bold">Compartir Información</h2>
              <p className="text-muted-foreground">
                No compartimos tu información personal con terceros, excepto:
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <IconWrapper icon="blockchain" className="h-5 w-5 text-primary mt-1" />
                  <span>Con tu consentimiento explícito</span>
                </li>
                <li className="flex items-start gap-2">
                  <IconWrapper icon="performance" className="h-5 w-5 text-primary mt-1" />
                  <span>Para cumplir con obligaciones legales</span>
                </li>
                <li className="flex items-start gap-2">
                  <IconWrapper icon="analytics" className="h-5 w-5 text-primary mt-1" />
                  <span>Con proveedores de servicios que nos ayudan a operar</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 space-y-4">
              <h2 className="text-2xl font-bold">Tus Derechos</h2>
              <p className="text-muted-foreground">
                Tienes derecho a:
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <IconWrapper icon="blockchain" className="h-5 w-5 text-primary mt-1" />
                  <span>Acceder a tu información personal</span>
                </li>
                <li className="flex items-start gap-2">
                  <IconWrapper icon="performance" className="h-5 w-5 text-primary mt-1" />
                  <span>Solicitar la corrección de datos inexactos</span>
                </li>
                <li className="flex items-start gap-2">
                  <IconWrapper icon="analytics" className="h-5 w-5 text-primary mt-1" />
                  <span>Solicitar la eliminación de tus datos</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <div className="text-center space-y-6">
            <p className="text-muted-foreground">
              ¿Tienes preguntas sobre nuestra política de privacidad?
            </p>
            <div className="flex justify-center gap-4">
              <Link href="/contact">
                <Button>
                  <IconWrapper icon="support" className="mr-2 h-4 w-4" />
                  Contactar Soporte
                </Button>
              </Link>
              <Link href="/terms">
                <Button variant="outline">
                  Términos de Servicio
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}