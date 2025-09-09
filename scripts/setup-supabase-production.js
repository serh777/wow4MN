#!/usr/bin/env node

/**
 * Script de configuración automática para Supabase
 * Basado en análisis externo de mejoras para implementación
 * Configura base de datos, RLS, Edge Functions y optimizaciones
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Colores para output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

const log = {
  info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}✅${colors.reset} ${msg}`),
  warning: (msg) => console.log(`${colors.yellow}⚠️${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}❌${colors.reset} ${msg}`),
  title: (msg) => console.log(`\n${colors.bright}${colors.cyan}🗄️ ${msg}${colors.reset}\n`)
};

// Esquemas de base de datos optimizados
const DATABASE_SCHEMAS = {
  // Tabla para análisis de direcciones
  analysis_results: `
    CREATE TABLE IF NOT EXISTS analysis_results (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      address TEXT NOT NULL,
      tool_type TEXT NOT NULL,
      analysis_data JSONB NOT NULL,
      metadata JSONB DEFAULT '{}',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
      
      -- Índices para performance
      CONSTRAINT unique_address_tool_user UNIQUE(address, tool_type, user_id)
    );
    
    -- Índices optimizados
    CREATE INDEX IF NOT EXISTS idx_analysis_results_address ON analysis_results(address);
    CREATE INDEX IF NOT EXISTS idx_analysis_results_tool_type ON analysis_results(tool_type);
    CREATE INDEX IF NOT EXISTS idx_analysis_results_user_id ON analysis_results(user_id);
    CREATE INDEX IF NOT EXISTS idx_analysis_results_created_at ON analysis_results(created_at DESC);
    CREATE INDEX IF NOT EXISTS idx_analysis_results_metadata_gin ON analysis_results USING GIN(metadata);
  `,
  
  // Tabla para caché de APIs
  api_cache: `
    CREATE TABLE IF NOT EXISTS api_cache (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      cache_key TEXT NOT NULL UNIQUE,
      cache_data JSONB NOT NULL,
      expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      
      -- TTL automático
      CONSTRAINT valid_expiry CHECK (expires_at > created_at)
    );
    
    -- Índices para caché
    CREATE INDEX IF NOT EXISTS idx_api_cache_key ON api_cache(cache_key);
    CREATE INDEX IF NOT EXISTS idx_api_cache_expires ON api_cache(expires_at);
  `,
  
  // Tabla para configuración de usuarios
  user_preferences: `
    CREATE TABLE IF NOT EXISTS user_preferences (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
      preferences JSONB DEFAULT '{}',
      favorite_tools TEXT[] DEFAULT '{}',
      api_quotas JSONB DEFAULT '{}',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
    
    -- Índices
    CREATE INDEX IF NOT EXISTS idx_user_preferences_user_id ON user_preferences(user_id);
  `,
  
  // Tabla para métricas y analytics
  usage_analytics: `
    CREATE TABLE IF NOT EXISTS usage_analytics (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
      tool_type TEXT NOT NULL,
      action_type TEXT NOT NULL,
      metadata JSONB DEFAULT '{}',
      ip_address INET,
      user_agent TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
    
    -- Índices para analytics
    CREATE INDEX IF NOT EXISTS idx_usage_analytics_user_id ON usage_analytics(user_id);
    CREATE INDEX IF NOT EXISTS idx_usage_analytics_tool_type ON usage_analytics(tool_type);
    CREATE INDEX IF NOT EXISTS idx_usage_analytics_created_at ON usage_analytics(created_at DESC);
  `,
  
  // Tabla para rate limiting
  rate_limits: `
    CREATE TABLE IF NOT EXISTS rate_limits (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      identifier TEXT NOT NULL, -- IP o user_id
      endpoint TEXT NOT NULL,
      requests_count INTEGER DEFAULT 1,
      window_start TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      
      CONSTRAINT unique_identifier_endpoint UNIQUE(identifier, endpoint)
    );
    
    -- Índices para rate limiting
    CREATE INDEX IF NOT EXISTS idx_rate_limits_identifier ON rate_limits(identifier);
    CREATE INDEX IF NOT EXISTS idx_rate_limits_window_start ON rate_limits(window_start);
  `
};

// Políticas RLS (Row Level Security)
const RLS_POLICIES = {
  analysis_results: [
    {
      name: 'Users can view own analysis results',
      policy: `
        CREATE POLICY "Users can view own analysis results" ON analysis_results
        FOR SELECT USING (auth.uid() = user_id);
      `
    },
    {
      name: 'Users can insert own analysis results',
      policy: `
        CREATE POLICY "Users can insert own analysis results" ON analysis_results
        FOR INSERT WITH CHECK (auth.uid() = user_id);
      `
    },
    {
      name: 'Users can update own analysis results',
      policy: `
        CREATE POLICY "Users can update own analysis results" ON analysis_results
        FOR UPDATE USING (auth.uid() = user_id);
      `
    }
  ],
  
  user_preferences: [
    {
      name: 'Users can manage own preferences',
      policy: `
        CREATE POLICY "Users can manage own preferences" ON user_preferences
        FOR ALL USING (auth.uid() = user_id);
      `
    }
  ],
  
  usage_analytics: [
    {
      name: 'Users can view own analytics',
      policy: `
        CREATE POLICY "Users can view own analytics" ON usage_analytics
        FOR SELECT USING (auth.uid() = user_id);
      `
    },
    {
      name: 'Service role can insert analytics',
      policy: `
        CREATE POLICY "Service role can insert analytics" ON usage_analytics
        FOR INSERT WITH CHECK (true);
      `
    }
  ]
};

// Edge Functions para Supabase
const EDGE_FUNCTIONS = {
  'analysis-processor': `
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    const { address, tools, userId } = await req.json()

    if (!address || !tools || !userId) {
      throw new Error('Missing required parameters')
    }

    // Procesar análisis para cada herramienta
    const results = []
    for (const tool of tools) {
      const analysisResult = await processToolAnalysis(tool, address)
      
      // Guardar en base de datos
      const { data, error } = await supabase
        .from('analysis_results')
        .upsert({
          address,
          tool_type: tool,
          analysis_data: analysisResult,
          user_id: userId,
          updated_at: new Date().toISOString()
        })
        .select()

      if (error) throw error
      results.push(data[0])
    }

    return new Response(
      JSON.stringify({ success: true, results }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})

async function processToolAnalysis(tool: string, address: string) {
  // Implementar lógica específica por herramienta
  switch (tool) {
    case 'metadata':
      return await analyzeMetadata(address)
    case 'content':
      return await analyzeContent(address)
    case 'links':
      return await analyzeLinks(address)
    case 'competition':
      return await analyzeCompetition(address)
    default:
      return { tool, address, analysis: 'Not implemented' }
  }
}

async function analyzeMetadata(address: string) {
  // Implementar análisis de metadata
  return {
    title: 'Sample Title',
    description: 'Sample Description',
    keywords: ['web3', 'blockchain'],
    score: 85
  }
}

async function analyzeContent(address: string) {
  // Implementar análisis de contenido
  return {
    wordCount: 1500,
    readability: 'Good',
    seoScore: 78
  }
}

async function analyzeLinks(address: string) {
  // Implementar análisis de enlaces
  return {
    internalLinks: 25,
    externalLinks: 10,
    brokenLinks: 0
  }
}

async function analyzeCompetition(address: string) {
  // Implementar análisis de competencia
  return {
    competitors: ['competitor1.com', 'competitor2.com'],
    marketPosition: 'Strong'
  }
}
`,

  'cache-manager': `
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )

    const { method } = req
    const url = new URL(req.url)
    const cacheKey = url.searchParams.get('key')

    if (method === 'GET') {
      // Obtener del caché
      const { data, error } = await supabase
        .from('api_cache')
        .select('cache_data')
        .eq('cache_key', cacheKey)
        .gt('expires_at', new Date().toISOString())
        .single()

      if (error || !data) {
        return new Response(
          JSON.stringify({ cached: false }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      return new Response(
        JSON.stringify({ cached: true, data: data.cache_data }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (method === 'POST') {
      // Guardar en caché
      const { key, data, ttl = 3600 } = await req.json()
      const expiresAt = new Date(Date.now() + ttl * 1000).toISOString()

      const { error } = await supabase
        .from('api_cache')
        .upsert({
          cache_key: key,
          cache_data: data,
          expires_at: expiresAt
        })

      if (error) throw error

      return new Response(
        JSON.stringify({ success: true }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response('Method not allowed', { status: 405 })
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})
`
};

class SupabaseSetup {
  constructor() {
    this.projectRoot = process.cwd();
    this.supabaseDir = path.join(this.projectRoot, 'supabase');
    this.migrationsDir = path.join(this.supabaseDir, 'migrations');
    this.functionsDir = path.join(this.supabaseDir, 'functions');
  }

  async run() {
    log.title('Configuración de Supabase para Producción');
    
    try {
      await this.checkPrerequisites();
      await this.initializeSupabase();
      await this.createDatabaseSchemas();
      await this.setupRLS();
      await this.createEdgeFunctions();
      await this.setupEnvironmentConfig();
      await this.createMigrationScripts();
      await this.optimizeDatabase();
      
      log.success('\n🎉 Configuración de Supabase completada exitosamente!');
      this.showNextSteps();
    } catch (error) {
      log.error(`Error durante la configuración: ${error.message}`);
      process.exit(1);
    }
  }

  async checkPrerequisites() {
    log.info('Verificando prerequisitos...');
    
    // Verificar si Supabase CLI está instalado
    try {
      execSync('supabase --version', { stdio: 'pipe' });
      log.success('Supabase CLI encontrado');
    } catch (error) {
      log.warning('Supabase CLI no encontrado. Instalando...');
      try {
        execSync('npm install -g supabase', { stdio: 'inherit' });
        log.success('Supabase CLI instalado');
      } catch (installError) {
        throw new Error('No se pudo instalar Supabase CLI. Instálalo manualmente: npm install -g supabase');
      }
    }
    
    log.success('Prerequisitos verificados');
  }

  async initializeSupabase() {
    log.info('Inicializando proyecto Supabase...');
    
    if (!fs.existsSync(this.supabaseDir)) {
      try {
        execSync('supabase init', { stdio: 'inherit', cwd: this.projectRoot });
        log.success('Proyecto Supabase inicializado');
      } catch (error) {
        throw new Error('Error al inicializar Supabase');
      }
    } else {
      log.info('Proyecto Supabase ya existe');
    }
  }

  async createDatabaseSchemas() {
    log.info('Creando esquemas de base de datos...');
    
    if (!fs.existsSync(this.migrationsDir)) {
      fs.mkdirSync(this.migrationsDir, { recursive: true });
    }
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    
    // Crear migración inicial
    const migrationContent = `-- Migración inicial para Web3 Dashboard
-- Creada automáticamente por setup-supabase-production.js

-- Habilitar extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";

${Object.values(DATABASE_SCHEMAS).join('\n\n')}

-- Habilitar RLS en todas las tablas
ALTER TABLE analysis_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_analytics ENABLE ROW LEVEL SECURITY;

-- Función para limpiar caché expirado
CREATE OR REPLACE FUNCTION clean_expired_cache()
RETURNS void AS $$
BEGIN
  DELETE FROM api_cache WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_analysis_results_updated_at
  BEFORE UPDATE ON analysis_results
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_preferences_updated_at
  BEFORE UPDATE ON user_preferences
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Función para obtener estadísticas de uso
CREATE OR REPLACE FUNCTION get_usage_stats(user_uuid UUID DEFAULT NULL)
RETURNS TABLE (
  tool_type TEXT,
  usage_count BIGINT,
  last_used TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ua.tool_type,
    COUNT(*) as usage_count,
    MAX(ua.created_at) as last_used
  FROM usage_analytics ua
  WHERE (user_uuid IS NULL OR ua.user_id = user_uuid)
  GROUP BY ua.tool_type
  ORDER BY usage_count DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
`;
    
    const migrationFile = path.join(this.migrationsDir, `${timestamp}_initial_setup.sql`);
    fs.writeFileSync(migrationFile, migrationContent);
    
    log.success('Esquemas de base de datos creados');
  }

  async setupRLS() {
    log.info('Configurando Row Level Security...');
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    
    let rlsContent = '-- Políticas de Row Level Security\n-- Creadas automáticamente por setup-supabase-production.js\n\n';
    
    for (const [table, policies] of Object.entries(RLS_POLICIES)) {
      rlsContent += `-- Políticas para ${table}\n`;
      for (const policy of policies) {
        rlsContent += `${policy.policy}\n`;
      }
      rlsContent += '\n';
    }
    
    const rlsFile = path.join(this.migrationsDir, `${timestamp}_rls_policies.sql`);
    fs.writeFileSync(rlsFile, rlsContent);
    
    log.success('Políticas RLS configuradas');
  }

  async createEdgeFunctions() {
    log.info('Creando Edge Functions...');
    
    if (!fs.existsSync(this.functionsDir)) {
      fs.mkdirSync(this.functionsDir, { recursive: true });
    }
    
    for (const [functionName, functionCode] of Object.entries(EDGE_FUNCTIONS)) {
      const functionDir = path.join(this.functionsDir, functionName);
      if (!fs.existsSync(functionDir)) {
        fs.mkdirSync(functionDir, { recursive: true });
      }
      
      fs.writeFileSync(path.join(functionDir, 'index.ts'), functionCode);
      
      // Crear archivo de configuración para la función
      const configContent = `{
  "importMap": "../import_map.json"
}`;
      fs.writeFileSync(path.join(functionDir, 'deno.json'), configContent);
    }
    
    // Crear import map compartido
    const importMap = {
      "imports": {
        "@supabase/supabase-js": "https://esm.sh/@supabase/supabase-js@2",
        "std/": "https://deno.land/std@0.168.0/"
      }
    };
    
    fs.writeFileSync(
      path.join(this.functionsDir, 'import_map.json'),
      JSON.stringify(importMap, null, 2)
    );
    
    log.success('Edge Functions creadas');
  }

  async setupEnvironmentConfig() {
    log.info('Configurando variables de entorno...');
    
    const envConfig = `# Configuración de Supabase para desarrollo local
# Copia este archivo a .env.local

# Supabase
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SUPABASE_JWT_SECRET=your-jwt-secret

# Base de datos
DATABASE_URL=postgresql://postgres:postgres@localhost:54322/postgres

# Configuración de desarrollo
NEXT_PUBLIC_APP_ENV=development
ENABLE_REAL_TIME_ANALYSIS=true
ENABLE_CACHING=true
CACHE_TTL=3600

# Rate limiting
RATE_LIMIT_REQUESTS_PER_MINUTE=60
RATE_LIMIT_ENABLED=true
`;
    
    fs.writeFileSync(path.join(this.projectRoot, '.env.supabase.example'), envConfig);
    
    // Crear configuración de Supabase
    const supabaseConfig = {
      "api": {
        "enabled": true,
        "port": 54321
      },
      "db": {
        "enabled": true,
        "port": 54322,
        "shadow_port": 54320,
        "major_version": 15
      },
      "studio": {
        "enabled": true,
        "port": 54323
      },
      "inbucket": {
        "enabled": true,
        "port": 54324
      },
      "storage": {
        "enabled": true,
        "image_transformation": {
          "enabled": true
        }
      },
      "auth": {
        "enabled": true,
        "site_url": "http://localhost:3000",
        "additional_redirect_urls": ["https://your-domain.netlify.app"]
      },
      "edge_functions": {
        "enabled": true,
        "port": 54325
      }
    };
    
    fs.writeFileSync(
      path.join(this.supabaseDir, 'config.toml'),
      `# Configuración de Supabase\n# Generada automáticamente\n\n` +
      Object.entries(supabaseConfig)
        .map(([key, value]) => `[${key}]\n${Object.entries(value).map(([k, v]) => `${k} = ${JSON.stringify(v)}`).join('\n')}`)
        .join('\n\n')
    );
    
    log.success('Configuración de entorno creada');
  }

  async createMigrationScripts() {
    log.info('Creando scripts de migración...');
    
    const migrationScript = `#!/bin/bash

# Script de migración para Supabase
# Basado en análisis de mejoras para implementación

set -e

echo "🗄️ Iniciando migración de Supabase..."

# Verificar que Supabase CLI está instalado
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI no encontrado. Instálalo con: npm install -g supabase"
    exit 1
fi

# Verificar conexión a Supabase
echo "🔗 Verificando conexión..."
supabase status || {
    echo "⚠️ Supabase no está ejecutándose. Iniciando..."
    supabase start
}

# Ejecutar migraciones
echo "📊 Ejecutando migraciones..."
supabase db reset --linked || {
    echo "❌ Error en migraciones. Revisa los archivos SQL."
    exit 1
}

# Generar tipos TypeScript
echo "🔧 Generando tipos TypeScript..."
supabase gen types typescript --linked > src/types/supabase.ts || {
    echo "⚠️ No se pudieron generar los tipos TypeScript"
}

# Ejecutar seeds si existen
if [ -d "supabase/seed.sql" ]; then
    echo "🌱 Ejecutando seeds..."
    supabase db seed --linked
fi

echo "✅ Migración completada exitosamente!"
echo "🌐 Supabase Studio disponible en: http://localhost:54323"
echo "📊 Base de datos disponible en: postgresql://postgres:postgres@localhost:54322/postgres"
`;
    
    const scriptsDir = path.join(this.projectRoot, 'scripts');
    if (!fs.existsSync(scriptsDir)) {
      fs.mkdirSync(scriptsDir, { recursive: true });
    }
    
    fs.writeFileSync(path.join(scriptsDir, 'migrate-supabase.sh'), migrationScript);
    
    // Script de backup
    const backupScript = `#!/bin/bash

# Script de backup para Supabase

set -e

echo "💾 Creando backup de Supabase..."

# Crear directorio de backups
mkdir -p backups

# Backup de la base de datos
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="backups/supabase_backup_$TIMESTAMP.sql"

supabase db dump --linked > "$BACKUP_FILE" || {
    echo "❌ Error creando backup"
    exit 1
}

echo "✅ Backup creado: $BACKUP_FILE"

# Comprimir backup
gzip "$BACKUP_FILE"
echo "📦 Backup comprimido: $BACKUP_FILE.gz"

# Limpiar backups antiguos (mantener últimos 7)
find backups -name "supabase_backup_*.sql.gz" -mtime +7 -delete
echo "🧹 Backups antiguos limpiados"
`;
    
    fs.writeFileSync(path.join(scriptsDir, 'backup-supabase.sh'), backupScript);
    
    log.success('Scripts de migración creados');
  }

  async optimizeDatabase() {
    log.info('Aplicando optimizaciones de base de datos...');
    
    const optimizationScript = `-- Optimizaciones de performance para Supabase
-- Creadas automáticamente por setup-supabase-production.js

-- Configurar parámetros de performance
ALTER SYSTEM SET shared_preload_libraries = 'pg_stat_statements';
ALTER SYSTEM SET track_activity_query_size = 2048;
ALTER SYSTEM SET pg_stat_statements.track = 'all';

-- Configurar conexiones
ALTER SYSTEM SET max_connections = 100;
ALTER SYSTEM SET shared_buffers = '256MB';
ALTER SYSTEM SET effective_cache_size = '1GB';
ALTER SYSTEM SET work_mem = '4MB';
ALTER SYSTEM SET maintenance_work_mem = '64MB';

-- Configurar checkpoints
ALTER SYSTEM SET checkpoint_completion_target = 0.9;
ALTER SYSTEM SET wal_buffers = '16MB';

-- Configurar logging
ALTER SYSTEM SET log_min_duration_statement = 1000; -- Log queries > 1s
ALTER SYSTEM SET log_checkpoints = on;
ALTER SYSTEM SET log_connections = on;
ALTER SYSTEM SET log_disconnections = on;

-- Crear función para estadísticas de performance
CREATE OR REPLACE FUNCTION get_performance_stats()
RETURNS TABLE (
  query TEXT,
  calls BIGINT,
  total_time DOUBLE PRECISION,
  mean_time DOUBLE PRECISION
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    pss.query,
    pss.calls,
    pss.total_exec_time as total_time,
    pss.mean_exec_time as mean_time
  FROM pg_stat_statements pss
  ORDER BY pss.total_exec_time DESC
  LIMIT 20;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Crear índices adicionales para performance
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_analysis_results_composite 
  ON analysis_results(user_id, tool_type, created_at DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_usage_analytics_composite 
  ON usage_analytics(user_id, tool_type, created_at DESC);

-- Configurar auto-vacuum
ALTER TABLE analysis_results SET (autovacuum_vacuum_scale_factor = 0.1);
ALTER TABLE usage_analytics SET (autovacuum_vacuum_scale_factor = 0.05);
ALTER TABLE api_cache SET (autovacuum_vacuum_scale_factor = 0.2);

-- Crear job para limpiar caché expirado (requiere pg_cron)
-- SELECT cron.schedule('clean-expired-cache', '0 */6 * * *', 'SELECT clean_expired_cache();');
`;
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    const optimizationFile = path.join(this.migrationsDir, `${timestamp}_performance_optimizations.sql`);
    fs.writeFileSync(optimizationFile, optimizationScript);
    
    log.success('Optimizaciones de base de datos aplicadas');
  }

  showNextSteps() {
    console.log(`\n${colors.bright}${colors.green}🎯 Próximos pasos:${colors.reset}\n`);
    console.log('1. 🚀 Iniciar Supabase localmente:');
    console.log('   - supabase start');
    console.log('   - Esto iniciará todos los servicios locales\n');
    
    console.log('2. 🔗 Conectar con tu proyecto Supabase:');
    console.log('   - supabase login');
    console.log('   - supabase link --project-ref your-project-ref\n');
    
    console.log('3. 📊 Ejecutar migraciones:');
    console.log('   - chmod +x scripts/migrate-supabase.sh');
    console.log('   - ./scripts/migrate-supabase.sh\n');
    
    console.log('4. 🔧 Configurar variables de entorno:');
    console.log('   - Copia .env.supabase.example a .env.local');
    console.log('   - Actualiza las URLs y claves con tus valores reales\n');
    
    console.log('5. 🚀 Deploy Edge Functions:');
    console.log('   - supabase functions deploy analysis-processor');
    console.log('   - supabase functions deploy cache-manager\n');
    
    console.log('6. 📈 Monitorear performance:');
    console.log('   - Usa Supabase Studio para monitorear queries');
    console.log('   - Ejecuta SELECT * FROM get_performance_stats();\n');
    
    console.log(`${colors.bright}${colors.blue}📚 Recursos útiles:${colors.reset}`);
    console.log('- Supabase Studio: http://localhost:54323');
    console.log('- Documentación: https://supabase.com/docs');
    console.log('- Edge Functions: https://supabase.com/docs/guides/functions');
    console.log('- RLS: https://supabase.com/docs/guides/auth/row-level-security');
  }
}

// Ejecutar setup si es llamado directamente
if (require.main === module) {
  const setup = new SupabaseSetup();
  setup.run().catch(console.error);
}

module.exports = SupabaseSetup;