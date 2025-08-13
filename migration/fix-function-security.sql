-- Script para corregir advertencias de seguridad en funciones de Supabase
-- Ejecutar este script en el SQL Editor de Supabase para resolver function_search_path_mutable warnings

-- Corregir función cleanup_expired_data
CREATE OR REPLACE FUNCTION cleanup_expired_data()
RETURNS void AS $$
BEGIN
  -- Eliminar análisis expirados
  DELETE FROM user_analysis_history WHERE expires_at < NOW();
  
  -- Eliminar consultas expiradas
  DELETE FROM user_search_queries WHERE expires_at < NOW();
  
  -- Eliminar métricas expiradas
  DELETE FROM user_usage_metrics WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Corregir función update_data_expiration
CREATE OR REPLACE FUNCTION update_data_expiration()
RETURNS TRIGGER AS $$
DECLARE
  retention_days INTEGER;
BEGIN
  -- Obtener días de retención del usuario
  SELECT data_retention_days INTO retention_days
  FROM user_privacy_settings
  WHERE user_id = NEW.user_id;
  
  -- Si no hay configuración, usar 90 días por defecto
  IF retention_days IS NULL THEN
    retention_days := 90;
  END IF;
  
  -- Establecer fecha de expiración
  NEW.expires_at := NOW() + INTERVAL '1 day' * retention_days;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Corregir función update_updated_at_column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Corregir función handle_updated_at (si existe)
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Verificar que las funciones se han actualizado correctamente
SELECT 
  proname as function_name,
  prosecdef as security_definer,
  proconfig as config_settings
FROM pg_proc 
WHERE proname IN (
  'cleanup_expired_data', 
  'update_data_expiration', 
  'update_updated_at_column', 
  'handle_updated_at'
)
AND pronamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public');