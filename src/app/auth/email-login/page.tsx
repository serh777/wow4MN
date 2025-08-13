'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Icons } from '@/components/ui/icons';
import { IconWrapper } from '@/components/ui/icon-wrapper';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

export default function LoginPage() {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const { signIn, loading, user } = useAuth();
  const router = useRouter();
  
  // Redirigir si ya está autenticado
  React.useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Por favor, completa todos los campos');
      return;
    }

    try {
      await signIn(email, password);
      toast.success('¡Bienvenido!');
    } catch (error: any) {
      toast.error(error.message || 'Error al iniciar sesión');
    }
  };



  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-2">
            <IconWrapper icon="wallet" className="h-5 w-5 text-primary" />
            <CardTitle className="text-2xl">Iniciar Sesión</CardTitle>
          </div>
          <CardDescription>
            Ingresa tus credenciales para acceder a WowSeoWeb3
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="tu@email.com"
                className="w-full px-3 py-2 border rounded-md text-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                className="w-full px-3 py-2 border rounded-md text-sm"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button 
              type="submit" 
              className="w-full"
              disabled={loading}
            >
              {loading ? (
                <>
                  <IconWrapper icon="spinner" className="mr-2 h-4 w-4" />
                  <span>Iniciando sesión...</span>
                </>
              ) : (
                'Iniciar Sesión'
              )}
            </Button>
            <div className="text-center space-y-2">
              <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                ¿Olvidaste tu contraseña?
              </Link>
              <div className="text-sm text-muted-foreground">
                ¿No tienes una cuenta?{' '}
                <Link href="/auth/email-register" className="text-primary hover:underline">
                  Regístrate
                </Link>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}