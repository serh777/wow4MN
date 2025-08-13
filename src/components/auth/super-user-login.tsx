'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useSuperUser } from '@/hooks/useSuperUser';
import { 
  Eye, 
  EyeOff, 
  Lock, 
  User, 
  X,
  Shield,
  AlertTriangle
} from 'lucide-react';

interface SuperUserLoginProps {
  onClose?: () => void;
  className?: string;
}

export function SuperUserLogin({ onClose, className = '' }: SuperUserLoginProps) {
  const {
    loginCredentials,
    setLoginCredentials,
    loginAsSuperUser,
    isLoading
  } = useSuperUser();
  
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await loginAsSuperUser(loginCredentials.email, loginCredentials.password);
      // El hook manejará el cierre del formulario
    } catch (error: any) {
      setError(error.message || 'Error de autenticación');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: 'email' | 'password', value: string) => {
    setLoginCredentials(prev => ({
      ...prev,
      [field]: value
    }));
    // Limpiar error cuando el usuario empiece a escribir
    if (error) setError('');
  };

  return (
    <div className={`fixed inset-0 bg-black/50 flex items-center justify-center z-50 ${className}`}>
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="relative">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Shield className="h-5 w-5 text-blue-600" />
              Acceso de Superusuario
            </CardTitle>
            {onClose && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          <p className="text-sm text-gray-600">
            Acceso restringido para herramientas de diagnóstico
          </p>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email de Superusuario
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  value={loginCredentials.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="srhskl@proton.me"
                  className="pl-10"
                  required
                  disabled={isSubmitting}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                Contraseña
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={loginCredentials.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder="Ingresa tu contraseña"
                  className="pl-10 pr-10"
                  required
                  disabled={isSubmitting}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isSubmitting}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            
            <div className="flex gap-2 pt-2">
              <Button
                type="submit"
                className="flex-1"
                disabled={isSubmitting || !loginCredentials.email || !loginCredentials.password}
              >
                {isSubmitting ? 'Autenticando...' : 'Iniciar Sesión'}
              </Button>
              {onClose && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={isSubmitting}
                >
                  Cancelar
                </Button>
              )}
            </div>
          </form>
          
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-2">
              <Shield className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-xs text-blue-800">
                <p className="font-medium mb-1">Información de Seguridad:</p>
                <ul className="space-y-1">
                  <li>• Solo el email autorizado puede acceder</li>
                  <li>• Las herramientas de diagnóstico están ocultas para usuarios normales</li>
                  <li>• En desarrollo, las herramientas son visibles por defecto</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default SuperUserLogin;