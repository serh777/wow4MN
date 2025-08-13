-- Tabla para configuración de privacidad de usuarios
CREATE TABLE IF NOT EXISTS user_privacy_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  save_analysis_history BOOLEAN DEFAULT true,
  save_search_queries BOOLEAN DEFAULT false,
  save_usage_metrics BOOLEAN DEFAULT true,
  allow_personalization BOOLEAN DEFAULT true,
  data_retention_days INTEGER DEFAULT 90,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Tabla para sesiones de wallet (tracking anónimo)
CREATE TABLE IF NOT EXISTS user_wallet_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  wallet_hash TEXT NOT NULL, -- Hash SHA256 de la dirección de wallet
  first_connection TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_connection TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  connection_count INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Tabla para historial de análisis (opcional según privacidad)
CREATE TABLE IF NOT EXISTS user_analysis_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  analysis_type TEXT NOT NULL,
  analysis_data JSONB,
  url_analyzed TEXT,
  results JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE -- Para auto-eliminación según retención
);

-- Tabla para consultas de búsqueda (opcional según privacidad)
CREATE TABLE IF NOT EXISTS user_search_queries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  query_text TEXT NOT NULL,
  query_type TEXT,
  results_count INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE -- Para auto-eliminación según retención
);

-- Tabla para métricas de uso (anónimas)
CREATE TABLE IF NOT EXISTS user_usage_metrics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL,
  activity_data JSONB,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE -- Para auto-eliminación según retención
);

-- Índices para optimizar consultas
CREATE INDEX IF NOT EXISTS idx_user_privacy_settings_user_id ON user_privacy_settings(user_id);
CREATE INDEX IF NOT EXISTS idx_user_wallet_sessions_user_id ON user_wallet_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_wallet_sessions_wallet_hash ON user_wallet_sessions(wallet_hash);
CREATE INDEX IF NOT EXISTS idx_user_analysis_history_user_id ON user_analysis_history(user_id);
CREATE INDEX IF NOT EXISTS idx_user_analysis_history_expires_at ON user_analysis_history(expires_at);
CREATE INDEX IF NOT EXISTS idx_user_search_queries_user_id ON user_search_queries(user_id);
CREATE INDEX IF NOT EXISTS idx_user_search_queries_expires_at ON user_search_queries(expires_at);
CREATE INDEX IF NOT EXISTS idx_user_usage_metrics_user_id ON user_usage_metrics(user_id);
CREATE INDEX IF NOT EXISTS idx_user_usage_metrics_expires_at ON user_usage_metrics(expires_at);

-- Función para auto-eliminación de datos expirados
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

-- Función para actualizar expires_at basado en configuración de privacidad
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

-- Triggers para auto-establecer expires_at
CREATE TRIGGER set_analysis_expiration
  BEFORE INSERT ON user_analysis_history
  FOR EACH ROW
  EXECUTE FUNCTION update_data_expiration();

CREATE TRIGGER set_search_expiration
  BEFORE INSERT ON user_search_queries
  FOR EACH ROW
  EXECUTE FUNCTION update_data_expiration();

CREATE TRIGGER set_metrics_expiration
  BEFORE INSERT ON user_usage_metrics
  FOR EACH ROW
  EXECUTE FUNCTION update_data_expiration();

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Triggers para updated_at
CREATE TRIGGER update_user_privacy_settings_updated_at
  BEFORE UPDATE ON user_privacy_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_wallet_sessions_updated_at
  BEFORE UPDATE ON user_wallet_sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Políticas RLS (Row Level Security)
ALTER TABLE user_privacy_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_wallet_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_analysis_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_search_queries ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_usage_metrics ENABLE ROW LEVEL SECURITY;

-- Políticas para que los usuarios solo accedan a sus propios datos
CREATE POLICY "Users can view own privacy settings" ON user_privacy_settings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own privacy settings" ON user_privacy_settings
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own wallet sessions" ON user_wallet_sessions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own wallet sessions" ON user_wallet_sessions
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own analysis history" ON user_analysis_history
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own analysis history" ON user_analysis_history
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own search queries" ON user_search_queries
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own search queries" ON user_search_queries
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own usage metrics" ON user_usage_metrics
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own usage metrics" ON user_usage_metrics
  FOR ALL USING (auth.uid() = user_id);

-- Comentarios para documentación
COMMENT ON TABLE user_privacy_settings IS 'Configuración de privacidad personalizada por usuario';
COMMENT ON TABLE user_wallet_sessions IS 'Tracking de sesiones de wallet con hashes para privacidad';
COMMENT ON TABLE user_analysis_history IS 'Historial de análisis SEO (opcional según privacidad)';
COMMENT ON TABLE user_search_queries IS 'Historial de búsquedas (opcional según privacidad)';
COMMENT ON TABLE user_usage_metrics IS 'Métricas de uso anónimas para mejoras de producto';
COMMENT ON COLUMN user_wallet_sessions.wallet_hash IS 'Hash SHA256 de la dirección de wallet para privacidad';
COMMENT ON FUNCTION cleanup_expired_data() IS 'Función para limpiar datos expirados según configuración de retención';