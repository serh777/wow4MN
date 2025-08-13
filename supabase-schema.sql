-- Crear extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabla de usuarios (Supabase Auth ya maneja esto, pero podemos extenderla)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla ToolData (basada en el esquema Prisma)
CREATE TABLE IF NOT EXISTS public.tool_data (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  tool_name TEXT NOT NULL,
  input_data JSONB NOT NULL,
  output_data JSONB,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla Indexer (basada en el esquema Prisma)
CREATE TABLE IF NOT EXISTS public.indexers (
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  contract_address TEXT NOT NULL,
  abi JSONB NOT NULL,
  start_block BIGINT DEFAULT 0,
  current_block BIGINT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla IndexerJob (basada en el esquema Prisma)
CREATE TABLE IF NOT EXISTS public.indexer_jobs (
  id SERIAL PRIMARY KEY,
  indexer_id INTEGER REFERENCES public.indexers(id) ON DELETE CASCADE,
  from_block BIGINT NOT NULL,
  to_block BIGINT NOT NULL,
  status TEXT DEFAULT 'pending',
  error_message TEXT,
  processed_events INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla IndexerConfig (basada en el esquema Prisma)
CREATE TABLE IF NOT EXISTS public.indexer_configs (
  id SERIAL PRIMARY KEY,
  indexer_id INTEGER REFERENCES public.indexers(id) ON DELETE CASCADE,
  key TEXT NOT NULL,
  value TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(indexer_id, key)
);

-- Tabla Block (basada en el esquema Prisma)
CREATE TABLE IF NOT EXISTS public.blocks (
  id SERIAL PRIMARY KEY,
  block_number BIGINT UNIQUE NOT NULL,
  block_hash TEXT UNIQUE NOT NULL,
  parent_hash TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
  gas_limit BIGINT NOT NULL,
  gas_used BIGINT NOT NULL,
  miner TEXT NOT NULL,
  difficulty BIGINT,
  total_difficulty BIGINT,
  size INTEGER,
  transaction_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla Transaction (basada en el esquema Prisma)
CREATE TABLE IF NOT EXISTS public.transactions (
  id SERIAL PRIMARY KEY,
  hash TEXT UNIQUE NOT NULL,
  block_id INTEGER REFERENCES public.blocks(id) ON DELETE CASCADE,
  block_number BIGINT NOT NULL,
  transaction_index INTEGER NOT NULL,
  from_address TEXT NOT NULL,
  to_address TEXT,
  value DECIMAL(78, 0) NOT NULL,
  gas_limit BIGINT NOT NULL,
  gas_used BIGINT,
  gas_price BIGINT,
  max_fee_per_gas BIGINT,
  max_priority_fee_per_gas BIGINT,
  nonce INTEGER NOT NULL,
  input_data TEXT,
  status INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla Event (basada en el esquema Prisma)
CREATE TABLE IF NOT EXISTS public.events (
  id SERIAL PRIMARY KEY,
  transaction_id INTEGER REFERENCES public.transactions(id) ON DELETE CASCADE,
  indexer_id INTEGER REFERENCES public.indexers(id) ON DELETE CASCADE,
  contract_address TEXT NOT NULL,
  event_name TEXT NOT NULL,
  event_signature TEXT NOT NULL,
  log_index INTEGER NOT NULL,
  block_number BIGINT NOT NULL,
  transaction_hash TEXT NOT NULL,
  data JSONB NOT NULL,
  topics TEXT[] NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para actualizar updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tool_data_updated_at BEFORE UPDATE ON public.tool_data FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_indexers_updated_at BEFORE UPDATE ON public.indexers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_indexer_jobs_updated_at BEFORE UPDATE ON public.indexer_jobs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Función para manejar nuevos usuarios de auth.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para crear usuario en public.users cuando se registra en auth.users
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Políticas RLS (Row Level Security)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tool_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.indexers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.indexer_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.indexer_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Política para users: los usuarios solo pueden ver/editar sus propios datos
CREATE POLICY "Users can view own profile" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (auth.uid() = id);

-- Política para tool_data: los usuarios solo pueden ver/editar sus propios datos
CREATE POLICY "Users can view own tool data" ON public.tool_data FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own tool data" ON public.tool_data FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own tool data" ON public.tool_data FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own tool data" ON public.tool_data FOR DELETE USING (auth.uid() = user_id);

-- Políticas para tablas de blockchain (lectura pública, escritura restringida)
CREATE POLICY "Public read access" ON public.indexers FOR SELECT TO authenticated USING (true);
CREATE POLICY "Public read access" ON public.indexer_jobs FOR SELECT TO authenticated USING (true);
CREATE POLICY "Public read access" ON public.indexer_configs FOR SELECT TO authenticated USING (true);
CREATE POLICY "Public read access" ON public.blocks FOR SELECT TO authenticated USING (true);
CREATE POLICY "Public read access" ON public.transactions FOR SELECT TO authenticated USING (true);
CREATE POLICY "Public read access" ON public.events FOR SELECT TO authenticated USING (true);

-- Índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_tool_data_user_id ON public.tool_data(user_id);
CREATE INDEX IF NOT EXISTS idx_tool_data_created_at ON public.tool_data(created_at);
CREATE INDEX IF NOT EXISTS idx_blocks_block_number ON public.blocks(block_number);
CREATE INDEX IF NOT EXISTS idx_transactions_hash ON public.transactions(hash);
CREATE INDEX IF NOT EXISTS idx_transactions_block_number ON public.transactions(block_number);
CREATE INDEX IF NOT EXISTS idx_events_contract_address ON public.events(contract_address);
CREATE INDEX IF NOT EXISTS idx_events_block_number ON public.events(block_number);
CREATE INDEX IF NOT EXISTS idx_events_transaction_hash ON public.events(transaction_hash);

-- Insertar datos de ejemplo para indexers
INSERT INTO public.indexers (name, description, contract_address, abi, start_block) VALUES
('WowSEOWeb3 Dashboard', 'Indexer para el contrato principal del dashboard', '0x545d5eDfCafB5e43068991C2FA1Ea6f0F1E9B561', '[]', 0)
ON CONFLICT (name) DO NOTHING;