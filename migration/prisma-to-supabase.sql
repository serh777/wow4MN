-- Migración completa de Prisma a Supabase
-- Ejecutar en el SQL Editor de Supabase

-- Habilitar extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla genérica para datos de herramientas
CREATE TABLE IF NOT EXISTS tool_data (
    id TEXT PRIMARY KEY,
    tool_id TEXT NOT NULL,
    data JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    user_id TEXT NOT NULL DEFAULT '',
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Análisis de Metadatos
CREATE TABLE IF NOT EXISTS metadata_analysis (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT NOT NULL,
    project_name TEXT NOT NULL,
    project_url TEXT NOT NULL,
    title JSONB NOT NULL,
    description JSONB NOT NULL,
    keywords JSONB NOT NULL,
    og_tags JSONB NOT NULL,
    twitter_tags JSONB NOT NULL,
    overall_score INTEGER NOT NULL,
    status TEXT DEFAULT 'completed',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Auditoría de Contenido
CREATE TABLE IF NOT EXISTS content_audit (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT NOT NULL,
    project_name TEXT NOT NULL,
    project_url TEXT NOT NULL,
    content_quality JSONB NOT NULL,
    readability JSONB NOT NULL,
    structure JSONB NOT NULL,
    multimedia JSONB NOT NULL,
    accessibility JSONB NOT NULL,
    overall_score INTEGER NOT NULL,
    status TEXT DEFAULT 'completed',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Análisis de Palabras Clave
CREATE TABLE IF NOT EXISTS keyword_analysis (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT NOT NULL,
    project_name TEXT NOT NULL,
    project_url TEXT NOT NULL,
    target_keywords JSONB NOT NULL,
    keyword_data JSONB NOT NULL,
    competition JSONB NOT NULL,
    opportunities JSONB NOT NULL,
    overall_score INTEGER NOT NULL,
    status TEXT DEFAULT 'completed',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Verificación de Enlaces
CREATE TABLE IF NOT EXISTS link_verification (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT NOT NULL,
    project_name TEXT NOT NULL,
    project_url TEXT NOT NULL,
    internal_links JSONB NOT NULL,
    external_links JSONB NOT NULL,
    backlinks JSONB NOT NULL,
    link_health JSONB NOT NULL,
    overall_score INTEGER NOT NULL,
    status TEXT DEFAULT 'completed',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Análisis de Rendimiento
CREATE TABLE IF NOT EXISTS performance_analysis (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT NOT NULL,
    project_name TEXT NOT NULL,
    project_url TEXT NOT NULL,
    page_speed JSONB NOT NULL,
    core_web_vitals JSONB NOT NULL,
    lighthouse_scores JSONB NOT NULL,
    mobile_performance JSONB NOT NULL,
    recommendations JSONB NOT NULL,
    overall_score INTEGER NOT NULL,
    status TEXT DEFAULT 'completed',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Análisis de Competencia
CREATE TABLE IF NOT EXISTS competition_analysis (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT NOT NULL,
    project_name TEXT NOT NULL,
    project_url TEXT NOT NULL,
    competitors JSONB NOT NULL,
    market_share JSONB NOT NULL,
    strengths JSONB NOT NULL,
    weaknesses JSONB NOT NULL,
    opportunities JSONB NOT NULL,
    threats JSONB NOT NULL,
    overall_score INTEGER NOT NULL,
    status TEXT DEFAULT 'completed',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Análisis Blockchain
CREATE TABLE IF NOT EXISTS blockchain_analysis (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT NOT NULL,
    network TEXT NOT NULL,
    address TEXT,
    project_name TEXT NOT NULL,
    transactions JSONB NOT NULL,
    events JSONB NOT NULL,
    token_metrics JSONB NOT NULL,
    security JSONB NOT NULL,
    performance JSONB NOT NULL,
    overall_score INTEGER NOT NULL,
    status TEXT DEFAULT 'completed',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Dashboard del Asistente IA
CREATE TABLE IF NOT EXISTS ai_assistant_dashboard (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT NOT NULL,
    project_name TEXT NOT NULL,
    project_url TEXT NOT NULL,
    ai_model TEXT NOT NULL,
    analysis_type TEXT NOT NULL,
    confidence REAL NOT NULL,
    accuracy REAL NOT NULL,
    processing_time REAL NOT NULL,
    data_quality REAL NOT NULL,
    insights JSONB,
    predictions JSONB,
    anomalies JSONB,
    trends JSONB,
    recommendations JSONB,
    risk_factors JSONB,
    opportunities JSONB,
    model_performance JSONB,
    metadata JSONB,
    overall_score INTEGER NOT NULL,
    status TEXT DEFAULT 'completed',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Análisis Social Web3
CREATE TABLE IF NOT EXISTS social_web3_analysis (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT NOT NULL,
    address TEXT NOT NULL,
    network TEXT NOT NULL,
    platforms JSONB NOT NULL,
    activity JSONB NOT NULL,
    followers JSONB NOT NULL,
    content JSONB NOT NULL,
    engagement JSONB NOT NULL,
    influence JSONB NOT NULL,
    overall_score INTEGER NOT NULL,
    status TEXT DEFAULT 'completed',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Indexers
CREATE TABLE IF NOT EXISTS indexers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'inactive',
    last_run TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    user_id TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Trabajos de Indexer
CREATE TABLE IF NOT EXISTS indexer_jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    indexer_id UUID NOT NULL,
    status TEXT DEFAULT 'pending',
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    error TEXT,
    result JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    FOREIGN KEY (indexer_id) REFERENCES indexers(id) ON DELETE CASCADE
);

-- Configuraciones de Indexer
CREATE TABLE IF NOT EXISTS indexer_configs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    indexer_id UUID NOT NULL,
    key TEXT NOT NULL,
    value TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    FOREIGN KEY (indexer_id) REFERENCES indexers(id) ON DELETE CASCADE,
    UNIQUE(indexer_id, key)
);

-- Bloques
CREATE TABLE IF NOT EXISTS blocks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    block_number BIGINT UNIQUE NOT NULL,
    block_hash TEXT UNIQUE NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Transacciones
CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tx_hash TEXT UNIQUE NOT NULL,
    block_id UUID NOT NULL,
    from_address TEXT NOT NULL,
    to_address TEXT,
    value TEXT NOT NULL,
    gas_used BIGINT NOT NULL,
    gas_price TEXT NOT NULL,
    input TEXT NOT NULL,
    status INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    FOREIGN KEY (block_id) REFERENCES blocks(id) ON DELETE CASCADE
);

-- Eventos
CREATE TABLE IF NOT EXISTS events (
    id TEXT PRIMARY KEY,
    transaction_id UUID NOT NULL,
    address TEXT NOT NULL,
    event_name TEXT NOT NULL,
    topics TEXT[] NOT NULL,
    data TEXT NOT NULL,
    log_index BIGINT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    FOREIGN KEY (transaction_id) REFERENCES transactions(id) ON DELETE CASCADE
);

-- Pagos de Herramientas
CREATE TABLE IF NOT EXISTS tool_payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT NOT NULL,
    tool_id TEXT NOT NULL,
    tool_name TEXT NOT NULL,
    amount TEXT NOT NULL,
    token_address TEXT NOT NULL,
    token_symbol TEXT NOT NULL,
    tx_hash TEXT UNIQUE NOT NULL,
    block_number BIGINT,
    network TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    plan_id INTEGER,
    discount INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Configuraciones de Usuario
CREATE TABLE IF NOT EXISTS user_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT UNIQUE NOT NULL,
    preferred_network TEXT DEFAULT 'ethereum',
    preferred_token TEXT DEFAULT 'USDC',
    notifications JSONB DEFAULT '{"email": true, "browser": true, "analysis_complete": true, "payment_success": true}',
    theme TEXT DEFAULT 'system',
    language TEXT DEFAULT 'es',
    timezone TEXT DEFAULT 'UTC',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Historial de Acciones de Herramientas
CREATE TABLE IF NOT EXISTS tool_action_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT NOT NULL,
    tool_id TEXT NOT NULL,
    tool_name TEXT NOT NULL,
    action TEXT NOT NULL,
    description TEXT NOT NULL,
    resource_id TEXT,
    metadata JSONB,
    tx_hash TEXT,
    network TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Resumen de Análisis
CREATE TABLE IF NOT EXISTS analysis_summary (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT NOT NULL,
    project_name TEXT NOT NULL,
    project_url TEXT NOT NULL,
    total_analyses INTEGER DEFAULT 0,
    average_score REAL DEFAULT 0,
    last_analysis TIMESTAMP WITH TIME ZONE,
    tools_used JSONB DEFAULT '[]',
    improvements JSONB DEFAULT '[]',
    status TEXT DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE(user_id, project_name)
);

-- Crear índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_tool_payments_user_id ON tool_payments(user_id);
CREATE INDEX IF NOT EXISTS idx_tool_payments_tool_id ON tool_payments(tool_id);
CREATE INDEX IF NOT EXISTS idx_tool_payments_status ON tool_payments(status);
CREATE INDEX IF NOT EXISTS idx_tool_action_history_user_id ON tool_action_history(user_id);
CREATE INDEX IF NOT EXISTS idx_tool_action_history_tool_id ON tool_action_history(tool_id);
CREATE INDEX IF NOT EXISTS idx_tool_action_history_action ON tool_action_history(action);
CREATE INDEX IF NOT EXISTS idx_analysis_summary_user_id ON analysis_summary(user_id);
CREATE INDEX IF NOT EXISTS idx_analysis_summary_project_url ON analysis_summary(project_url);

-- Crear triggers para updated_at automático
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql' SECURITY DEFINER SET search_path = public;

-- Aplicar triggers a todas las tablas que tienen updated_at
CREATE TRIGGER update_metadata_analysis_updated_at BEFORE UPDATE ON metadata_analysis FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_content_audit_updated_at BEFORE UPDATE ON content_audit FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_keyword_analysis_updated_at BEFORE UPDATE ON keyword_analysis FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_link_verification_updated_at BEFORE UPDATE ON link_verification FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_performance_analysis_updated_at BEFORE UPDATE ON performance_analysis FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_competition_analysis_updated_at BEFORE UPDATE ON competition_analysis FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_blockchain_analysis_updated_at BEFORE UPDATE ON blockchain_analysis FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_ai_assistant_dashboard_updated_at BEFORE UPDATE ON ai_assistant_dashboard FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_social_web3_analysis_updated_at BEFORE UPDATE ON social_web3_analysis FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_indexers_updated_at BEFORE UPDATE ON indexers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_indexer_jobs_updated_at BEFORE UPDATE ON indexer_jobs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_indexer_configs_updated_at BEFORE UPDATE ON indexer_configs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_blocks_updated_at BEFORE UPDATE ON blocks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON transactions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tool_payments_updated_at BEFORE UPDATE ON tool_payments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_settings_updated_at BEFORE UPDATE ON user_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_analysis_summary_updated_at BEFORE UPDATE ON analysis_summary FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Comentarios para documentación
COMMENT ON TABLE users IS 'Tabla principal de usuarios del sistema';
COMMENT ON TABLE tool_data IS 'Datos genéricos de herramientas para compatibilidad';
COMMENT ON TABLE metadata_analysis IS 'Análisis de metadatos SEO';
COMMENT ON TABLE content_audit IS 'Auditorías de contenido web';
COMMENT ON TABLE keyword_analysis IS 'Análisis de palabras clave';
COMMENT ON TABLE link_verification IS 'Verificación y análisis de enlaces';
COMMENT ON TABLE performance_analysis IS 'Análisis de rendimiento web';
COMMENT ON TABLE competition_analysis IS 'Análisis de competencia';
COMMENT ON TABLE blockchain_analysis IS 'Análisis de datos blockchain';
COMMENT ON TABLE ai_assistant_dashboard IS 'Dashboard del asistente de IA';
COMMENT ON TABLE social_web3_analysis IS 'Análisis de redes sociales Web3';
COMMENT ON TABLE tool_payments IS 'Gestión de pagos de herramientas';
COMMENT ON TABLE user_settings IS 'Configuraciones personalizadas de usuario';
COMMENT ON TABLE tool_action_history IS 'Historial de acciones realizadas con herramientas';
COMMENT ON TABLE analysis_summary IS 'Resúmenes agregados de análisis por proyecto';

-- Mensaje de finalización
SELECT 'Migración de Prisma a Supabase completada exitosamente' AS resultado;