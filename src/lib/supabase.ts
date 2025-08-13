import { createClient } from '@supabase/supabase-js'
import type { Database } from '../types/supabase'

// Proporcionar valores por defecto para el build estático
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key'

// Solo mostrar advertencia en desarrollo si las variables no están configuradas
if (process.env.NODE_ENV === 'development' && (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)) {
  console.warn('Warning: Supabase environment variables not configured. Using placeholder values.')
}

// Cliente principal para uso en la aplicación
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Función para crear un nuevo cliente (útil para casos específicos)
export const createSupabaseClient = () => {
  return createClient<Database>(supabaseUrl, supabaseAnonKey)
}

export default supabase