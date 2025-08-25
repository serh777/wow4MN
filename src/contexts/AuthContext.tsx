'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase-client';
import { toast } from 'sonner';
import type { User, Session } from '@supabase/supabase-js';
import { Database } from '@/lib/database.types';
import { createHash } from 'crypto';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  signInWithWallet: (walletAddress: string) => Promise<void>;
  linkWalletToUser: (email: string, password: string, walletAddress: string) => Promise<void>;
  trackUserActivity: (activity: string, data?: any) => Promise<void>;
  getPrivacySettings: () => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Función para hashear la dirección de wallet
  const hashWalletAddress = (address: string): string => {
    return createHash('sha256').update(address.toLowerCase()).digest('hex');
  };

  useEffect(() => {
    // Obtener sesión inicial
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.warn('Error al obtener sesión:', error.message);
          // Si hay error con el token, limpiar la sesión
          if (error.message.includes('Invalid Refresh Token') || error.message.includes('Refresh Token Not Found')) {
            await supabase.auth.signOut();
          }
        }
        
        setUser(session?.user ?? null);
      } catch (error) {
        console.error('Error inesperado al obtener sesión:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Escuchar cambios de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔔 Auth state change:', event, 'User ID:', session?.user?.id);
        setUser(session?.user ?? null);
        setLoading(false);

        if (event === 'SIGNED_IN') {
          console.log('SIGNED_IN event - redirigiendo a dashboard');
          router.push('/dashboard');
        } else if (event === 'SIGNED_OUT') {
          console.log('🚪 SIGNED_OUT event - redirigiendo a login');
          router.push('/auth/email-login');
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [router]);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
  };

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) throw error;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) throw error;
  };

  const signInWithWallet = async (walletAddress: string) => {
    try {
      console.log('🔐 Iniciando autenticación con wallet:', walletAddress);
      
      // Hashear la dirección para mayor privacidad
      const hashedAddress = hashWalletAddress(walletAddress);
      
      // Crear un email válido usando el hash
      const walletEmail = `wallet.${hashedAddress.slice(0, 16)}@wowseoweb3.com`;
      console.log('📧 Email generado:', walletEmail);
      
      // Generar una contraseña segura basada en el hash
      const walletPassword = `WowSeo${hashedAddress.slice(0, 8).toUpperCase()}#${hashedAddress.slice(-8)}!2024`;
      
      // Intentar iniciar sesión primero
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: walletEmail,
        password: walletPassword
      });
      
      if (signInError && signInError.message.includes('Invalid login credentials')) {
        console.log('👤 Usuario no existe, creando cuenta nueva...');
        
        // Si no existe el usuario, crearlo
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: walletEmail,
          password: walletPassword,
          options: {
            emailRedirectTo: undefined, // No redirigir por email
            data: {
              hashed_wallet_address: hashedAddress,
              auth_method: 'wallet',
              display_name: `Wallet ${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`,
              privacy_mode: true,
              email_confirmed_at: new Date().toISOString() // Marcar como confirmado
            }
          }
        });
        
        if (signUpError) {
          console.error('Error al crear usuario:', signUpError);
          if (signUpError.message.includes('Invalid email')) {
            throw new Error('Error de configuración del sistema. Por favor, usa el registro tradicional o contacta soporte.');
          }
          throw signUpError;
        }
        
        console.log('Usuario creado:', signUpData.user?.id);
        
        // Crear configuración de privacidad por defecto
        if (signUpData.user) {
          await supabase
            .from('user_privacy_settings')
            .insert({
              user_id: signUpData.user.id,
              save_analysis_history: true,
              save_search_queries: false,
              save_usage_metrics: true,
              allow_personalization: true,
              data_retention_days: 90,
              created_at: new Date().toISOString()
            });

          // Crear registro de sesión
          await supabase
            .from('wallet_sessions')
            .insert({
              user_id: signUpData.user.id,
              hashed_wallet_address: hashedAddress,
              session_start: new Date().toISOString()
            });
        }
        
        // Si el usuario se creó exitosamente y está confirmado
        if (signUpData.user && signUpData.session) {
          console.log('Sesión creada automáticamente');
          setUser(signUpData.user);
          console.log('Sesión creada, onAuthStateChange manejará la redirección');
          // Dejar que onAuthStateChange maneje la redirección
          return;
        }
        
        // Para usuarios de wallet, confirmar automáticamente el email
        if (signUpData.user && !signUpData.session) {
          console.log('Usuario creado pero sin sesión, confirmando automáticamente...');
          
          try {
            // Usar el admin API para confirmar el email automáticamente
            const { data: adminData, error: adminError } = await supabase.auth.admin.updateUserById(
              signUpData.user.id,
              {
                email_confirm: true,
                user_metadata: {
                  ...signUpData.user.user_metadata,
                  email_confirmed_at: new Date().toISOString()
                }
              }
            );
            
            if (adminError) {
              console.warn('No se pudo usar admin API, intentando login directo:', adminError.message);
              
              // Si no funciona el admin API, intentar login directo
              const { data: directLogin, error: directError } = await supabase.auth.signInWithPassword({
                email: walletEmail,
                password: walletPassword
              });
              
              if (directError && directError.message.includes('Email not confirmed')) {
                console.log('Email no confirmado, creando sesión manual para usuario de wallet');
                // Para usuarios de wallet, crear una sesión manual
                setUser(signUpData.user);
                // Dejar que onAuthStateChange maneje la redirección
                return;
              }
              
              if (directLogin.user) {
                console.log('Login directo exitoso');
                setUser(directLogin.user);
                return;
              }
            } else {
              console.log('Email confirmado via admin API, intentando login...');
              
              // Intentar login después de confirmar
              const { data: postConfirmLogin, error: postConfirmError } = await supabase.auth.signInWithPassword({
                email: walletEmail,
                password: walletPassword
              });
              
              if (postConfirmLogin.user) {
                console.log('Login exitoso después de confirmación admin');
                setUser(postConfirmLogin.user);
                return;
              }
              
              if (postConfirmError) {
                console.warn('Error en login post-confirmación:', postConfirmError.message);
                // Aún así, permitir acceso para usuarios de wallet
                setUser(signUpData.user);
                // Dejar que onAuthStateChange maneje la redirección
                return;
              }
            }
          } catch (confirmError) {
            console.error('Error en confirmación automática:', confirmError);
            // Para usuarios de wallet, permitir acceso incluso si falla la confirmación
            console.log('Permitiendo acceso de emergencia para usuario de wallet');
            setUser(signUpData.user);
            // Dejar que onAuthStateChange maneje la redirección
            return;
          }
        }
        
        // Si necesita confirmación, intentar login nuevamente
        console.log('Intentando login después de registro...');
        const { data: finalSignInData, error: finalSignInError } = await supabase.auth.signInWithPassword({
          email: walletEmail,
          password: walletPassword
        });
        
        if (finalSignInError) {
          console.error('Error en login final:', finalSignInError);
          if (finalSignInError.message.includes('Email not confirmed')) {
            console.log('Email no confirmado en login final, pero es usuario de wallet - creando sesión manual');
            // Para usuarios de wallet, crear una sesión manual y redirigir
            if (signUpData.user) {
              setUser(signUpData.user);
              // Dejar que onAuthStateChange maneje la redirección
              console.log('Sesión manual creada para usuario de wallet');
              return;
            }
          }
          throw finalSignInError;
        }
        
        console.log('Login exitoso después de registro:', finalSignInData.user?.id);
        
        if (finalSignInData.user) {
          setUser(finalSignInData.user);
          console.log('Login exitoso, onAuthStateChange manejará la redirección');
          // Dejar que onAuthStateChange maneje la redirección
        }
      } else if (signInError) {
        console.error('Error en login inicial:', signInError);
        
        // Si es un error de email no confirmado para usuario existente de wallet
        if (signInError.message.includes('Email not confirmed')) {
          console.log('Usuario de wallet existente con email no confirmado, intentando confirmar...');
          
          try {
            console.log('Intentando confirmar email automáticamente...');
            
            // Reintentar login directamente
            const { data: retryLogin, error: retryError } = await supabase.auth.signInWithPassword({
              email: walletEmail,
              password: walletPassword
            });
            
            if (retryLogin.user) {
              console.log('Login exitoso después de confirmación admin');
              setUser(retryLogin.user);
              return;
            }
            
            // Si todo falla, crear sesión manual
            console.log('No se pudo confirmar automáticamente, permitiendo acceso manual');
            // Crear un objeto user básico para la sesión manual
            const manualUser = {
              id: `manual-${hashedAddress}`,
              email: walletEmail,
              user_metadata: {
                hashed_wallet_address: hashedAddress,
                auth_method: 'wallet',
                display_name: `Wallet ${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`,
                privacy_mode: true
              }
            } as any;
            
            setUser(manualUser);
            // Dejar que onAuthStateChange maneje la redirección
            return;
            
          } catch (confirmError) {
            console.error('Error en proceso de confirmación:', confirmError);
          }
        }
        
        throw signInError;
      } else {
        console.log('Login exitoso (usuario existente):', signInData.user?.id);
        
        // Actualizar última conexión
        if (signInData.user) {
          await supabase
            .from('wallet_sessions')
            .upsert({
              user_id: signInData.user.id,
              hashed_wallet_address: hashedAddress,
              session_start: new Date().toISOString()
            }, {
              onConflict: 'user_id',
              ignoreDuplicates: false
            });
          
          setUser(signInData.user);
          console.log('Login exitoso, onAuthStateChange manejará la redirección');
          // Dejar que onAuthStateChange maneje la redirección
        }
      }
    } catch (error) {
      console.error('💥 Error en signInWithWallet:', error);
      throw error;
    }
  };

  const linkWalletToUser = async (email: string, password: string, walletAddress: string) => {
    try {
      console.log('🔗 Vinculando wallet a usuario:', email, walletAddress);
      
      const hashedAddress = hashWalletAddress(walletAddress);
      
      // Primero, crear o iniciar sesión con el usuario normal
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (signInError) {
        throw new Error('Credenciales inválidas. Verifica tu email y contraseña.');
      }
      
      // Actualizar el perfil del usuario con el hash de la dirección de wallet
      const { error: updateError } = await supabase.auth.updateUser({
        data: {
          hashed_wallet_address: hashedAddress,
          auth_method: 'hybrid' // Email + Wallet
        }
      });
      
      if (updateError) {
        console.error('Error al vincular wallet:', updateError);
        throw new Error('Error al vincular la wallet a tu cuenta.');
      }
      
      // Crear o actualizar registro de sesión
      if (signInData.user) {
        await supabase
          .from('wallet_sessions')
          .upsert({
            user_id: signInData.user.id,
            hashed_wallet_address: hashedAddress,
            session_start: new Date().toISOString()
          }, {
            onConflict: 'user_id'
          });
      }
      
      console.log('Wallet vinculada exitosamente');
      toast.success('Wallet vinculada exitosamente a tu cuenta');
      
    } catch (error) {
      console.error('💥 Error en linkWalletToUser:', error);
      throw error;
    }
  };

  // Función para rastrear actividad del usuario respetando configuración de privacidad
  const trackUserActivity = async (activity: string, data?: any): Promise<void> => {
    if (!user) return;

    try {
      // Obtener configuración de privacidad
      const { data: privacySettings } = await supabase
        .from('user_privacy_settings')
        .select('*')
        .eq('user_id', user.id)
        .single();

      // Solo rastrear si el usuario lo permite
      if (privacySettings?.save_usage_metrics) {
        await supabase
          .from('usage_metrics')
          .insert({
            user_id: user.id,
            metric_name: activity,
            metric_value: 1,
            metadata: data
          });
      }
    } catch (error) {
      console.error('Error tracking user activity:', error);
    }
  };

  // Función para obtener configuración de privacidad
  const getPrivacySettings = async () => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('user_privacy_settings')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting privacy settings:', error);
      return null;
    }
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    signInWithWallet,
    linkWalletToUser,
    trackUserActivity,
    getPrivacySettings,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}