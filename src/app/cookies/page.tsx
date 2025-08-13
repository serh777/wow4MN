'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { Icons } from '@/components/ui/icons';
import { IconWrapper } from '@/components/ui/icon-wrapper';

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container py-12 md:py-24">
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-4xl font-bold tracking-tight">Política de Cookies</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Información sobre cómo utilizamos las cookies y tecnologías similares en WowSeoWeb3
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-8">
          <Card>
            <CardContent className="p-6 space-y-4">
              <h2 className="text-2xl font-bold">¿Qué son las Cookies?</h2>
              <p className="text-muted-foreground">
                Las cookies son pequeños archivos de texto que se almacenan en tu dispositivo cuando visitas nuestro sitio web. 
                Nos ayudan a proporcionar funcionalidades esenciales y mejorar tu experiencia de usuario.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 space-y-4">
              <h2 className="text-2xl font-bold">Tipos de Cookies que Utilizamos</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <IconWrapper icon="performance" className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-medium">Cookies Esenciales</h3>
                    <p className="text-sm text-muted-foreground">
                      Necesarias para el funcionamiento básico del sitio y la conexión con wallets Web3.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <IconWrapper icon="analytics" className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-medium">Cookies Analíticas</h3>
                    <p className="text-sm text-muted-foreground">
                      Nos ayudan a entender cómo utilizas nuestro sitio para mejorar nuestros servicios.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <IconWrapper icon="blockchain" className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-medium">Cookies de Funcionalidad</h3>
                    <p className="text-sm text-muted-foreground">
                      Permiten funciones avanzadas como la personalización y el guardado de preferencias.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 space-y-4">
              <h2 className="text-2xl font-bold">Gestión de Cookies</h2>
              <p className="text-muted-foreground">
                Puedes gestionar tus preferencias de cookies en cualquier momento:
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <IconWrapper icon="success" className="h-5 w-5 text-green-500 mt-1" />
                  <span>Aceptar o rechazar cookies no esenciales</span>
                </li>
                <li className="flex items-start gap-2">
                  <IconWrapper icon="success" className="h-5 w-5 text-green-500 mt-1" />
                  <span>Modificar la configuración de tu navegador para gestionar cookies</span>
                </li>
                <li className="flex items-start gap-2">
                  <IconWrapper icon="success" className="h-5 w-5 text-green-500 mt-1" />
                  <span>Eliminar cookies existentes en cualquier momento</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 space-y-4">
              <h2 className="text-2xl font-bold">Cookies de Terceros</h2>
              <p className="text-muted-foreground">
                Algunos servicios de terceros pueden establecer sus propias cookies:
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <IconWrapper icon="analytics" className="h-5 w-5 text-primary mt-1" />
                  <span>Servicios de análisis (Google Analytics)</span>
                </li>
                <li className="flex items-start gap-2">
                  <IconWrapper icon="blockchain" className="h-5 w-5 text-primary mt-1" />
                  <span>Proveedores de servicios Web3</span>
                </li>
                <li className="flex items-start gap-2">
                  <IconWrapper icon="wallet" className="h-5 w-5 text-primary mt-1" />
                  <span>Servicios de conexión de wallets</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 space-y-4">
              <h2 className="text-2xl font-bold">Duración de las Cookies</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <IconWrapper icon="performance" className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-medium">Cookies de Sesión</h3>
                    <p className="text-sm text-muted-foreground">
                      Se eliminan cuando cierras tu navegador.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <IconWrapper icon="analytics" className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-medium">Cookies Persistentes</h3>
                    <p className="text-sm text-muted-foreground">
                      Permanecen en tu dispositivo por un período específico o hasta que las elimines.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="text-center space-y-6">
            <p className="text-muted-foreground">
              ¿Tienes preguntas sobre nuestra política de cookies?
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