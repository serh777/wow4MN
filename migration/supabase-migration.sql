-- Migración completa de Prisma a Supabase
-- Este script crea todas las tablas y configuraciones necesarias

-- Habilitar extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Crear tabla de usuarios personalizada que se sincroniza con auth.users
CREATE TABLE public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Función para crear usuario automáticamente
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para crear usuario automáticamente
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Tabla ToolData
CREATE TABLE public.tool_data (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  project_name TEXT NOT NULL,
  project_url TEXT NOT NULL,
  tool_id TEXT NOT NULL,
  analysis_data JSONB,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla MetadataAnalysis
CREATE TABLE public.metadata_analysis (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  project_name TEXT NOT NULL,
  project_url TEXT NOT NULL,
  title TEXT,
  description TEXT,
  keywords TEXT[],
  og_tags JSONB,
  twitter_tags JSONB,
  schema_markup JSONB,
  overall_score INTEGER,
  status TEXT DEFAULT 'completed',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla ContentAudit
CREATE TABLE public.content_audit (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  project_name TEXT NOT NULL,
  project_url TEXT NOT NULL,
  content_quality JSONB,
  readability JSONB,
  structure JSONB,
  images JSONB,
  links JSONB,
  overall_score INTEGER,
  status TEXT DEFAULT 'completed',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla KeywordAnalysis
CREATE TABLE public.keyword_analysis (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  project_name TEXT NOT NULL,
  project_url TEXT NOT NULL,
  primary_keywords TEXT[],
  secondary_keywords TEXT[],
  keyword_density JSONB,
  competitor_keywords JSONB,
  suggestions JSONB,
  overall_score INTEGER,
  status TEXT DEFAULT 'completed',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla LinkVerification
CREATE TABLE public.link_verification (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  project_name TEXT NOT NULL,
  project_url TEXT NOT NULL,
  internal_links JSONB,
  external_links JSONB,
  broken_links JSONB,
  redirect_chains JSONB,
  anchor_text_analysis JSONB,
  overall_score INTEGER,
  status TEXT DEFAULT 'completed',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla PerformanceAnalysis
CREATE TABLE public.performance_analysis (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  project_name TEXT NOT NULL,
  project_url TEXT NOT NULL,
  core_web_vitals JSONB,
  lighthouse_scores JSONB,
  page_speed JSONB,
  mobile_performance JSONB,
  recommendations JSONB,
  overall_score INTEGER,
  status TEXT DEFAULT 'completed',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla CompetitionAnalysis
CREATE TABLE public.competition_analysis (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  project_name TEXT NOT NULL,
  project_url TEXT NOT NULL,
  competitors JSONB,
  market_position JSONB,
  strengths JSONB,
  weaknesses JSONB,
  opportunities JSONB,
  overall_score INTEGER,
  status TEXT DEFAULT 'completed',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla BlockchainAnalysis
CREATE TABLE public.blockchain_analysis (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  project_name TEXT NOT NULL,
  project_url TEXT NOT NULL,
  contract_address TEXT,
  network TEXT,
  token_metrics JSONB,
  security_analysis JSONB,
  liquidity_analysis JSONB,
  holder_analysis JSONB,
  transaction_analysis JSONB,
  overall_score INTEGER,
  status TEXT DEFAULT 'completed',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla AIAssistantDashboard
CREATE TABLE public.ai_assistant_dashboard (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  project_name TEXT NOT NULL,
  project_url TEXT NOT NULL,
  ai_insights JSONB,
  recommendations JSONB,
  action_items JSONB,
  priority_tasks JSONB,
  progress_tracking JSONB,
  overall_score INTEGER,
  status TEXT DEFAULT 'completed',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla SocialWeb3Analysis
CREATE TABLE public.social_web3_analysis (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  address TEXT NOT NULL,
  network TEXT NOT NULL,
  platforms JSONB,
  activity JSONB,
  followers JSONB,
  content JSONB,
  engagement JSONB,
  influence JSONB,
  overall_score INTEGER,
  status TEXT DEFAULT 'completed',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla Indexer
CREATE TABLE public.indexers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'inactive',
  last_run TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL
);

-- Tabla IndexerJob
CREATE TABLE public.indexer_jobs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  indexer_id UUID REFERENCES public.indexers(id) ON DELETE CASCADE NOT NULL,
  status TEXT DEFAULT 'pending',
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  error TEXT,
  result JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla IndexerConfig
CREATE TABLE public.indexer_configs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  indexer_id UUID REFERENCES public.indexers(id) ON DELETE CASCADE NOT NULL,
  key TEXT NOT NULL,
  value TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(indexer_id, key)
);

-- Tabla Block
CREATE TABLE public.blocks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  block_number BIGINT UNIQUE NOT NULL,
  block_hash TEXT UNIQUE NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla Transaction
CREATE TABLE public.transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tx_hash TEXT UNIQUE NOT NULL,
  block_id UUID REFERENCES public.blocks(id) NOT NULL,
  from_address TEXT NOT NULL,
  to_address TEXT,
  value TEXT NOT NULL,
  gas_used BIGINT NOT NULL,
  gas_price TEXT NOT NULL,
  input TEXT,
  status INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla Event
CREATE TABLE public.events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  transaction_id UUID REFERENCES public.transactions(id) NOT NULL,
  address TEXT NOT NULL,
  event_name TEXT NOT NULL,
  topics TEXT[],
  data TEXT,
  log_index BIGINT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla ToolPayment
CREATE TABLE public.tool_payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
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
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla UserSettings
CREATE TABLE public.user_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  preferred_network TEXT DEFAULT 'ethereum',
  preferred_token TEXT DEFAULT 'USDC',
  notifications JSONB DEFAULT '{"email": true, "browser": true, "analysis_complete": true, "payment_success": true}',
  theme TEXT DEFAULT 'system',
  language TEXT DEFAULT 'es',
  timezone TEXT DEFAULT 'UTC',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla ToolActionHistory
CREATE TABLE public.tool_action_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  tool_id TEXT NOT NULL,
  tool_name TEXT NOT NULL,
  action TEXT NOT NULL,
  description TEXT NOT NULL,
  resource_id TEXT,
  metadata JSONB,
  tx_hash TEXT,
  network TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla AnalysisSummary
CREATE TABLE public.analysis_summary (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
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
  UNIQUE(user_id, project_name)
);

-- Crear índices para optimizar consultas
CREATE INDEX idx_tool_data_user_id ON public.tool_data(user_id);
CREATE INDEX idx_tool_data_tool_id ON public.tool_data(tool_id);
CREATE INDEX idx_tool_payments_user_id ON public.tool_payments(user_id);
CREATE INDEX idx_tool_payments_tool_id ON public.tool_payments(tool_id);
CREATE INDEX idx_tool_payments_status ON public.tool_payments(status);
CREATE INDEX idx_tool_action_history_user_id ON public.tool_action_history(user_id);
CREATE INDEX idx_tool_action_history_tool_id ON public.tool_action_history(tool_id);
CREATE INDEX idx_tool_action_history_action ON public.tool_action_history(action);
CREATE INDEX idx_analysis_summary_user_id ON public.analysis_summary(user_id);
CREATE INDEX idx_analysis_summary_project_url ON public.analysis_summary(project_url);

-- Configurar Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tool_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.metadata_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_audit ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.keyword_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.link_verification ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.performance_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.competition_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blockchain_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_assistant_dashboard ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_web3_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.indexers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.indexer_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.indexer_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tool_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tool_action_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analysis_summary ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para usuarios
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- Políticas RLS para tool_data
CREATE POLICY "Users can view own tool data" ON public.tool_data
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own tool data" ON public.tool_data
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own tool data" ON public.tool_data
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own tool data" ON public.tool_data
  FOR DELETE USING (auth.uid() = user_id);

-- Políticas similares para todas las tablas de análisis
CREATE POLICY "Users can manage own metadata analysis" ON public.metadata_analysis
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own content audit" ON public.content_audit
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own keyword analysis" ON public.keyword_analysis
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own link verification" ON public.link_verification
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own performance analysis" ON public.performance_analysis
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own competition analysis" ON public.competition_analysis
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own blockchain analysis" ON public.blockchain_analysis
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own ai assistant dashboard" ON public.ai_assistant_dashboard
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own social web3 analysis" ON public.social_web3_analysis
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own indexers" ON public.indexers
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own tool payments" ON public.tool_payments
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own settings" ON public.user_settings
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own action history" ON public.tool_action_history
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own analysis summary" ON public.analysis_summary
  FOR ALL USING (auth.uid() = user_id);

-- Políticas para indexer_jobs (acceso a través del indexer)
CREATE POLICY "Users can manage indexer jobs" ON public.indexer_jobs
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.indexers 
      WHERE indexers.id = indexer_jobs.indexer_id 
      AND indexers.user_id = auth.uid()
    )
  );

-- Políticas para indexer_configs (acceso a través del indexer)
CREATE POLICY "Users can manage indexer configs" ON public.indexer_configs
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.indexers 
      WHERE indexers.id = indexer_configs.indexer_id 
      AND indexers.user_id = auth.uid()
    )
  );

-- Las tablas de blockchain (blocks, transactions, events) son públicas de solo lectura
CREATE POLICY "Public read access to blocks" ON public.blocks
  FOR SELECT USING (true);

CREATE POLICY "Public read access to transactions" ON public.transactions
  FOR SELECT USING (true);

CREATE POLICY "Public read access to events" ON public.events
  FOR SELECT USING (true);

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Triggers para updated_at
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.tool_data FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.metadata_analysis FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.content_audit FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.keyword_analysis FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.link_verification FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.performance_analysis FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.competition_analysis FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.blockchain_analysis FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.ai_assistant_dashboard FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.social_web3_analysis FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.indexers FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.indexer_jobs FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.indexer_configs FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.blocks FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.transactions FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.events FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.tool_payments FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.user_settings FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.analysis_summary FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();