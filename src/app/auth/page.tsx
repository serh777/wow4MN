'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { IconWrapper } from '@/components/ui/icon-wrapper';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Mail, Wallet, ArrowRight, Shield, Zap, Lock } from 'lucide-react';

export default function AuthPage() {
  const { user } = useAuth();
  const router = useRouter();

  // Redirigir si ya está autenticado
  React.useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <IconWrapper icon="wallet" className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">WowSEOWeb3</h1>
          </div>
          <p className="text-lg text-muted-foreground">
            Elige tu método de autenticación preferido
          </p>
        </div>

        {/* Opciones de autenticación */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Autenticación con Email */}
          <Card className="relative overflow-hidden border-2 hover:border-primary/50 transition-colors">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Mail className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-xl">Email & Contraseña</CardTitle>
                  <CardDescription>Método tradicional y familiar</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Características */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Shield className="h-4 w-4 text-green-500" />
                  <span>Seguridad estándar con 2FA</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Lock className="h-4 w-4 text-green-500" />
                  <span>Recuperación de contraseña</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Zap className="h-4 w-4 text-green-500" />
                  <span>Acceso rápido y familiar</span>
                </div>
              </div>

              {/* Botones */}
              <div className="space-y-2 pt-4">
                <Link href="/auth/email-login" className="block">
                  <Button className="w-full" variant="primary">
                    <Mail className="h-4 w-4 mr-2" />
                    Iniciar Sesión con Email
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
                <Link href="/auth/email-register" className="block">
                  <Button className="w-full" variant="outline">
                    Crear Cuenta con Email
                  </Button>
                </Link>
              </div>

              {/* Ideal para */}
              <div className="pt-3 border-t">
                <p className="text-xs text-muted-foreground">
                  <strong>Ideal para:</strong> Usuarios nuevos en Web3, preferencia por métodos tradicionales
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Autenticación con Wallet */}
          <Card className="relative overflow-hidden border-2 hover:border-primary/50 transition-colors">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Wallet className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <CardTitle className="text-xl">Wallet Web3</CardTitle>
                  <CardDescription>Autenticación descentralizada</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Características */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Shield className="h-4 w-4 text-purple-500" />
                  <span>Seguridad criptográfica máxima</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Lock className="h-4 w-4 text-purple-500" />
                  <span>Sin contraseñas que recordar</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Zap className="h-4 w-4 text-purple-500" />
                  <span>Acceso instantáneo Web3</span>
                </div>
              </div>

              {/* Botones */}
              <div className="space-y-2 pt-4">
                <Link href="/auth/wallet-login" className="block">
                  <Button className="w-full" variant="primary">
                    <Wallet className="h-4 w-4 mr-2" />
                    Conectar Wallet
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
                <Link href="/auth/wallet-register" className="block">
                  <Button className="w-full" variant="outline">
                    Crear Cuenta con Wallet
                  </Button>
                </Link>
              </div>

              {/* Ideal para */}
              <div className="pt-3 border-t">
                <p className="text-xs text-muted-foreground">
                  <strong>Ideal para:</strong> Usuarios Web3, holders de crypto, máxima seguridad
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Información adicional */}
        <div className="mt-8 text-center">
          <Card className="bg-muted/50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-center gap-2 mb-3">
                <Shield className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Seguridad Garantizada</h3>
              </div>
              <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
                Ambos métodos ofrecen seguridad de nivel empresarial. Puedes cambiar entre métodos 
                de autenticación en cualquier momento desde tu panel de control.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-xs text-muted-foreground">
          <p>
            ¿Necesitas ayuda? Consulta nuestra{' '}
            <Link href="/docs" className="text-primary hover:underline">
              documentación
            </Link>{' '}
            o{' '}
            <Link href="/support" className="text-primary hover:underline">
              contacta soporte
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}