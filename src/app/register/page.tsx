'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { IconWrapper } from '@/components/ui/icon-wrapper';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Mail, Wallet, ArrowRight, Shield, Zap, Lock } from 'lucide-react';

export default function RegisterPage() {
  const { user } = useAuth();
  const router = useRouter();

  // Redirigir si ya está autenticado
  React.useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/10 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Únete a WOW SEO Web3
          </h1>
          <p className="mt-4 text-muted-foreground md:text-lg max-w-2xl mx-auto">
            Elige tu método preferido para crear tu cuenta y acceder a las herramientas de análisis Web3 más avanzadas.
          </p>
        </div>

        {/* Opciones de registro */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Registro con Email */}
          <Card className="relative overflow-hidden border-2 hover:border-primary/50 transition-all duration-300 group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardHeader className="relative">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-xl">Registro con Email</CardTitle>
              <CardDescription>
                Método tradicional y seguro. Perfecto para usuarios que prefieren el acceso con email y contraseña.
              </CardDescription>
            </CardHeader>
            <CardContent className="relative space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Shield className="h-4 w-4 text-green-500" />
                  <span>Verificación por email</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Lock className="h-4 w-4 text-blue-500" />
                  <span>Contraseña segura</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Zap className="h-4 w-4 text-yellow-500" />
                  <span>Acceso rápido</span>
                </div>
              </div>
              
              <Link href="/auth/email-register" className="block">
                <Button className="w-full group-hover:bg-primary/90 transition-colors">
                  Registrarse con Email
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              
              <p className="text-xs text-center text-muted-foreground">
                ¿Ya tienes cuenta?{' '}
                <Link href="/auth/email-login" className="text-primary hover:underline">
                  Inicia sesión
                </Link>
              </p>
            </CardContent>
          </Card>

          {/* Registro con Wallet */}
          <Card className="relative overflow-hidden border-2 hover:border-secondary/50 transition-all duration-300 group">
            <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardHeader className="relative">
              <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center mb-4">
                <Wallet className="h-6 w-6 text-secondary" />
              </div>
              <CardTitle className="text-xl">Registro con Wallet</CardTitle>
              <CardDescription>
                Conecta tu wallet Web3 directamente. Ideal para usuarios activos en el ecosistema blockchain.
              </CardDescription>
            </CardHeader>
            <CardContent className="relative space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Shield className="h-4 w-4 text-green-500" />
                  <span>Sin contraseñas</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Lock className="h-4 w-4 text-blue-500" />
                  <span>Autenticación blockchain</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Zap className="h-4 w-4 text-yellow-500" />
                  <span>Acceso Web3 nativo</span>
                </div>
              </div>
              
              <Link href="/auth/wallet-register" className="block">
                <Button variant="secondary" className="w-full group-hover:bg-secondary/90 transition-colors">
                  Conectar Wallet
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              
              <p className="text-xs text-center text-muted-foreground">
                ¿Ya tienes cuenta?{' '}
                <Link href="/auth/wallet-login" className="text-secondary hover:underline">
                  Conecta tu wallet
                </Link>
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Información adicional */}
        <Card className="bg-muted/50 border-primary/10">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <h3 className="font-semibold text-lg">¿Por qué registrarse en WOW SEO Web3?</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="space-y-2">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                    <Shield className="h-4 w-4 text-primary" />
                  </div>
                  <p className="font-medium">Análisis Seguros</p>
                  <p className="text-muted-foreground">Tus datos y análisis están protegidos con la mejor seguridad</p>
                </div>
                <div className="space-y-2">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                    <Zap className="h-4 w-4 text-primary" />
                  </div>
                  <p className="font-medium">Herramientas Avanzadas</p>
                  <p className="text-muted-foreground">Acceso completo a 9+ herramientas especializadas en Web3</p>
                </div>
                <div className="space-y-2">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                    <Lock className="h-4 w-4 text-primary" />
                  </div>
                  <p className="font-medium">Historial Personalizado</p>
                  <p className="text-muted-foreground">Guarda y accede a todos tus análisis desde cualquier dispositivo</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Enlaces adicionales */}
        <div className="text-center mt-8 space-y-2">
          <p className="text-sm text-muted-foreground">
            ¿Necesitas ayuda? {' '}
            <Link href="/contact" className="text-primary hover:underline">
              Contacta con soporte
            </Link>
          </p>
          <p className="text-sm text-muted-foreground">
            <Link href="/" className="text-primary hover:underline">
              ← Volver al inicio
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}