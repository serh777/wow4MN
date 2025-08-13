'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useWeb3 } from '@/contexts/Web3Context';
import { UnifiedWalletConnect } from '@/components/wallet/unified-wallet-connect';
import { toast } from 'sonner';
import { Mail, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function WalletRegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const { address } = useWeb3();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!address) {
      toast.error('Por favor, conecta tu wallet primero');
      return;
    }

    if (!email || !password || !confirmPassword) {
      toast.error('Por favor, completa todos los campos');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Las contraseñas no coinciden');
      return;
    }

    if (password.length < 8) {
      toast.error('La contraseña debe tener al menos 8 caracteres');
      return;
    }

    setLoading(true);
    
    try {
      // Registrar usuario con email y vincular wallet
      await signUp(email, password);
      
      // Aquí podrías agregar lógica adicional para vincular la wallet
      // Por ejemplo, guardar la dirección en el perfil del usuario
      
      toast.success('Cuenta creada exitosamente. Revisa tu email para confirmar tu cuenta.');
      router.push('/auth/email-login');
    } catch (error: any) {
      console.error('Error en registro:', error);
      toast.error('Error al crear cuenta: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/10 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Registro con Wallet
          </CardTitle>
          <CardDescription className="text-center">
            Crea tu cuenta y vincula tu wallet para acceder a todas las funcionalidades
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Conexión de Wallet Unificada */}
          <div className="space-y-2">
            <Label>Wallet</Label>
            <UnifiedWalletConnect
              onSuccess={() => {
                toast.success('Wallet conectada exitosamente');
              }}
              onError={(error) => {
                toast.error('Error al conectar wallet: ' + error);
              }}
              variant="outline"
              showMobileInfo={false}
            />
          </div>

          {/* Formulario de registro */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                placeholder="Mínimo 8 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Repite tu contraseña"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading || !address}
            >
              {loading ? (
                'Creando cuenta...'
              ) : (
                <>
                  Crear Cuenta
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          <div className="text-center text-sm text-muted-foreground">
            ¿Ya tienes cuenta?{' '}
            <Link href="/auth/email-login" className="text-primary hover:underline">
              Inicia sesión
            </Link>
          </div>

          {/* Información adicional */}
          <div className="mt-6 p-4 bg-muted/50 rounded-lg">
            <h4 className="font-medium text-sm mb-2">💡 ¿Por qué necesito registrarme?</h4>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• Guarda tus análisis y configuraciones</li>
              <li>• Accede desde cualquier dispositivo</li>
              <li>• Recibe notificaciones importantes</li>
              <li>• Soporte técnico personalizado</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}