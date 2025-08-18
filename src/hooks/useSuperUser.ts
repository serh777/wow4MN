'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase-client';
import type { User } from '@supabase/supabase-js';

const SUPERUSER_EMAIL = 'srhskl@proton.me';

interface LoginCredentials {
  email: string;
  password: string;
}

export function useSuperUser() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [loginCredentials, setLoginCredentials] = useState<LoginCredentials>({
    email: SUPERUSER_EMAIL,
    password: ''
  });
  // Usar la instancia de supabase importada

  useEffect(() => {
    // Obtener sesión actual
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setIsLoading(false);
    };

    getSession();

    // Escuchar cambios de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        setIsLoading(false);
        
        // Si se autentica exitosamente, cerrar el formulario de login
        if (event === 'SIGNED_IN' && session?.user?.email === SUPERUSER_EMAIL) {
          setShowLoginForm(false);
          setLoginCredentials(prev => ({ ...prev, password: '' })); // Limpiar contraseña
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const isAuthenticated = !!user;
  const isSuperUser = user?.email === SUPERUSER_EMAIL;
  const email = user?.email;

  const login = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw error;
    }

    return data;
  };

  const loginAsSuperUser = async (email: string, password: string) => {
    // Verificar que el email sea el del superusuario
    if (email !== SUPERUSER_EMAIL) {
      throw new Error('Email no autorizado para acceso de superusuario');
    }

    return await login(email, password);
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw error;
    }
    
    // Limpiar credenciales al cerrar sesión
    setLoginCredentials({
      email: SUPERUSER_EMAIL,
      password: ''
    });
  };

  // Determinar si se deben mostrar las herramientas de debug
  const shouldShowDebugTools = () => {
    // En desarrollo, siempre mostrar
    if (process.env.NODE_ENV === 'development') {
      return true;
    }
    
    // En producción, solo para superusuario autenticado
    return isAuthenticated && isSuperUser;
  };

  return {
    user,
    isLoading,
    isAuthenticated,
    isSuperUser,
    email,
    showLoginForm,
    setShowLoginForm,
    loginCredentials,
    setLoginCredentials,
    login,
    loginAsSuperUser,
    logout,
    shouldShowDebugTools,
  };
}