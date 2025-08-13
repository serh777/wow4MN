'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Icons } from '@/components/ui/icons';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

// Componente IconWrapper para mantener consistencia
const IconWrapper = ({ icon, className }: { icon: keyof typeof Icons, className?: string }) => {
  const Icon = Icons[icon] || Icons.settings;
  return <Icon className={className} />;
};

export default function RegisterPage() {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [fullName, setFullName] = React.useState('');
  const { signUp, loading, user } = useAuth();
  const router = useRouter();

  // Redirigir si ya está autenticado
  React.useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!email || !password || !confirmPassword) {
      toast.error('Por favor, completa todos los campos');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Las contraseñas no coinciden');
      return;
    }

    if (password.length < 6) {
      toast.error('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    try {
      await signUp(email, password);
      toast.success('¡Cuenta creada! Revisa tu email para confirmar.');
    } catch (error: any) {
      toast.error(error.message || 'Error al crear la cuenta');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-2">
            <IconWrapper icon="wallet" className="h-5 w-5 text-primary" />
            <CardTitle className="text-2xl">Crear Cuenta</CardTitle>
          </div>
          <CardDescription>
            Únete a WowSeoWeb3 y comienza a optimizar tu presencia Web3
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="fullName" className="text-sm font-medium">
                Nombre Completo (Opcional)
              </label>
              <input
                id="fullName"
                type="text"
                placeholder="Tu nombre completo"
                className="w-full px-3 py-2 border rounded-md text-sm"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
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
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-sm font-medium">
                Confirmar Contraseña
              </label>
              <input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                className="w-full px-3 py-2 border rounded-md text-sm"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
                  <span>Creando cuenta...</span>
                </>
              ) : (
                'Crear Cuenta'
              )}
            </Button>
            <div className="text-center space-y-2">
              <div className="text-sm text-muted-foreground">
                ¿Ya tienes una cuenta?{' '}
                <Link href="/auth/email-login" className="text-primary hover:underline">
                  Inicia sesión
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  O continúa con
                </span>
              </div>
            </div>
            <div className="flex justify-center">
              <Link href="/auth/wallet-register" className="w-full">
                <Button variant="outline" type="button" className="w-full">
                  <IconWrapper icon="wallet" className="mr-2 h-4 w-4" />
                  Conectar con Wallet
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}