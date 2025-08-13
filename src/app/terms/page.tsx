'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { Icons } from '@/components/ui/icons';
import { IconWrapper } from '@/components/ui/icon-wrapper';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container py-12 md:py-24">
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-4xl font-bold tracking-tight">Términos de Servicio</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Condiciones de uso de los servicios de WowSeoWeb3
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-8">
          <Card>
            <CardContent className="p-6 space-y-4">
              <h2 className="text-2xl font-bold">1. Aceptación de los Términos</h2>
              <p className="text-muted-foreground">
                Al acceder y utilizar los servicios de WowSeoWeb3, aceptas estar sujeto a estos términos y condiciones.
                Te recomendamos leer detenidamente este documento antes de usar nuestros servicios.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 space-y-4">
              <h2 className="text-2xl font-bold">2. Descripción del Servicio</h2>
              <p className="text-muted-foreground">
                WowSeoWeb3 proporciona herramientas y servicios de optimización SEO especializados para proyectos blockchain:
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <IconWrapper icon="metadata" className="h-5 w-5 text-primary mt-1" />
                  <span>Análisis de metadatos de smart contracts</span>
                </li>
                <li className="flex items-start gap-2">
                  <IconWrapper icon="content" className="h-5 w-5 text-primary mt-1" />
                  <span>Auditoría de contenido Web3</span>
                </li>
                <li className="flex items-start gap-2">
                  <IconWrapper icon="performance" className="h-5 w-5 text-primary mt-1" />
                  <span>Análisis de rendimiento blockchain</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 space-y-4">
              <h2 className="text-2xl font-bold">3. Cuentas y Registro</h2>
              <p className="text-muted-foreground">
                Para acceder a ciertas funcionalidades:
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <IconWrapper icon="wallet" className="h-5 w-5 text-primary mt-1" />
                  <span>Debes conectar una wallet compatible</span>
                </li>
                <li className="flex items-start gap-2">
                  <IconWrapper icon="blockchain" className="h-5 w-5 text-primary mt-1" />
                  <span>Mantener la seguridad de tus credenciales</span>
                </li>
                <li className="flex items-start gap-2">
                  <IconWrapper icon="analytics" className="h-5 w-5 text-primary mt-1" />
                  <span>Proporcionar información precisa y actualizada</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 space-y-4">
              <h2 className="text-2xl font-bold">4. Uso Aceptable</h2>
              <p className="text-muted-foreground">
                Al utilizar nuestros servicios, te comprometes a:
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <IconWrapper icon="success" className="h-5 w-5 text-green-500 mt-1" />
                  <span>No violar leyes o regulaciones aplicables</span>
                </li>
                <li className="flex items-start gap-2">
                  <IconWrapper icon="success" className="h-5 w-5 text-green-500 mt-1" />
                  <span>No interferir con la seguridad del servicio</span>
                </li>
                <li className="flex items-start gap-2">
                  <IconWrapper icon="success" className="h-5 w-5 text-green-500 mt-1" />
                  <span>No realizar actividades fraudulentas</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 space-y-4">
              <h2 className="text-2xl font-bold">5. Propiedad Intelectual</h2>
              <p className="text-muted-foreground">
                Todos los derechos de propiedad intelectual relacionados con nuestros servicios son propiedad de WowSeoWeb3:
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <IconWrapper icon="content" className="h-5 w-5 text-primary mt-1" />
                  <span>Código fuente y algoritmos</span>
                </li>
                <li className="flex items-start gap-2">
                  <IconWrapper icon="content" className="h-5 w-5 text-primary mt-1" />
                  <span>Diseños y elementos visuales</span>
                </li>
                <li className="flex items-start gap-2">
                  <IconWrapper icon="content" className="h-5 w-5 text-primary mt-1" />
                  <span>Documentación y contenido</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 space-y-4">
              <h2 className="text-2xl font-bold">6. Limitación de Responsabilidad</h2>
              <p className="text-muted-foreground">
                WowSeoWeb3 no será responsable por:
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <IconWrapper icon="blockchain" className="h-5 w-5 text-primary mt-1" />
                  <span>Pérdidas derivadas del uso de nuestros servicios</span>
                </li>
                <li className="flex items-start gap-2">
                  <IconWrapper icon="blockchain" className="h-5 w-5 text-primary mt-1" />
                  <span>Interrupciones o fallos en el servicio</span>
                </li>
                <li className="flex items-start gap-2">
                  <IconWrapper icon="blockchain" className="h-5 w-5 text-primary mt-1" />
                  <span>Acciones realizadas por terceros</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 space-y-4">
              <h2 className="text-2xl font-bold">7. Modificaciones</h2>
              <p className="text-muted-foreground">
                Nos reservamos el derecho de modificar estos términos en cualquier momento. Los cambios entrarán en vigor
                inmediatamente después de su publicación en el sitio web.
              </p>
            </CardContent>
          </Card>

          <div className="text-center space-y-6">
            <p className="text-muted-foreground">
              ¿Tienes preguntas sobre nuestros términos de servicio?
            </p>
            <div className="flex justify-center gap-4">
              <Link href="/contact">
                <Button>
                  <IconWrapper icon="support" className="mr-2 h-4 w-4" />
                  Contactar Soporte
                </Button>
              </Link>
              <Link href="/privacy">
                <Button variant="outline">
                  Política de Privacidad
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}