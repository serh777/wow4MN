#!/usr/bin/env node

/**
 * Script de configuración automática para Netlify
 * Basado en análisis externo de mejoras para implementación
 * Configura variables de entorno, Edge Functions y optimizaciones
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
  title: (msg) => console.log(`\n${colors.bright}${colors.cyan}🚀 ${msg}${colors.reset}\n`)
};

// Configuración de variables de entorno para Netlify
const NETLIFY_ENV_VARS = {
  // Supabase
  'NEXT_PUBLIC_SUPABASE_URL': 'URL de tu proyecto Supabase',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY': 'Clave anónima de Supabase',
  'SUPABASE_SERVICE_ROLE_KEY': 'Clave de service role (PRIVADA)',
  'SUPABASE_JWT_SECRET': 'JWT secret de Supabase',
  
  // APIs de Blockchain
  'ETHEREUM_RPC_URL': 'URL RPC de Ethereum (Alchemy/Infura)',
  'POLYGON_RPC_URL': 'URL RPC de Polygon',
  'ALCHEMY_API_KEY': 'Clave API de Alchemy',
  'MORALIS_API_KEY': 'Clave API de Moralis',
  
  // APIs de IA
  'ANTHROPIC_API_KEY': 'Clave API de Anthropic (Claude)',
  'OPENAI_API_KEY': 'Clave API de OpenAI (backup)',
  'DEEPSEEK_API_KEY': 'Clave API de DeepSeek (alternativa)',
  
  // APIs de SEO
  'GOOGLE_PSI_API_KEY': 'Clave API de Google PageSpeed Insights',
  'AHREFS_API_KEY': 'Clave API de Ahrefs',
  'SEMRUSH_API_KEY': 'Clave API de SEMrush',
  
  // APIs de Social Web3
  'FARCASTER_API_KEY': 'Clave API de Farcaster',
  'LENS_ACCESS_TOKEN': 'Token de acceso de Lens Protocol',
  'TWITTER_BEARER_TOKEN': 'Bearer token de Twitter/X',
  
  // Seguridad y Análisis
  'ETHERSCAN_API_KEY': 'Clave API de Etherscan',
  'MYTHX_API_KEY': 'Clave API de MythX',
  
  // Monitoreo
  'SENTRY_DSN': 'DSN de Sentry para error tracking',
  'NEXT_PUBLIC_POSTHOG_KEY': 'Clave de PostHog para analytics',
  
  // Configuración
  'NODE_ENV': 'production',
  'NEXT_PUBLIC_APP_ENV': 'production',
  'ENABLE_REAL_TIME_ANALYSIS': 'true',
  'ENABLE_AI_RECOMMENDATIONS': 'true'
};

// Configuración de Edge Functions
const EDGE_FUNCTIONS = [
  {
    name: 'ai-analysis',
    path: 'netlify/edge-functions/ai-analysis.ts',
    description: 'Procesamiento de análisis con IA'
  },
  {
    name: 'blockchain-indexer',
    path: 'netlify/edge-functions/blockchain-indexer.ts',
    description: 'Indexación de datos blockchain'
  },
  {
    name: 'seo-crawler',
    path: 'netlify/edge-functions/seo-crawler.ts',
    description: 'Crawler para análisis SEO'
  },
  {
    name: 'rate-limiter',
    path: 'netlify/edge-functions/rate-limiter.ts',
    description: 'Rate limiting para APIs'
  }
];

// Headers de seguridad
const SECURITY_HEADERS = {
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://cdn.jsdelivr.net https://unpkg.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https: wss:;"
};

class NetlifySetup {
  constructor() {
    this.projectRoot = process.cwd();
    this.netlifyDir = path.join(this.projectRoot, 'netlify');
    this.edgeFunctionsDir = path.join(this.netlifyDir, 'edge-functions');
  }

  async run() {
    log.title('Configuración de Netlify para Producción');
    
    try {
      await this.checkPrerequisites();
      await this.createNetlifyConfig();
      await this.createEdgeFunctions();
      await this.setupEnvironmentVariables();
      await this.createDeployScript();
      await this.optimizeForProduction();
      
      log.success('\n🎉 Configuración de Netlify completada exitosamente!');
      this.showNextSteps();
    } catch (error) {
      log.error(`Error durante la configuración: ${error.message}`);
      process.exit(1);
    }
  }

  async checkPrerequisites() {
    log.info('Verificando prerequisitos...');
    
    // Verificar si Netlify CLI está instalado
    try {
      execSync('netlify --version', { stdio: 'pipe' });
      log.success('Netlify CLI encontrado');
    } catch (error) {
      log.warning('Netlify CLI no encontrado. Instalando...');
      try {
        execSync('npm install -g netlify-cli', { stdio: 'inherit' });
        log.success('Netlify CLI instalado');
      } catch (installError) {
        throw new Error('No se pudo instalar Netlify CLI. Instálalo manualmente: npm install -g netlify-cli');
      }
    }
    
    // Verificar estructura del proyecto
    const requiredFiles = ['package.json', 'next.config.js'];
    for (const file of requiredFiles) {
      if (!fs.existsSync(path.join(this.projectRoot, file))) {
        throw new Error(`Archivo requerido no encontrado: ${file}`);
      }
    }
    
    log.success('Prerequisitos verificados');
  }

  async createNetlifyConfig() {
    log.info('Creando configuración de Netlify...');
    
    const netlifyToml = `[build]
  command = "npm run build"
  publish = ".next"
  
[build.environment]
  NODE_VERSION = "18"
  NPM_VERSION = "9"
  NEXT_TELEMETRY_DISABLED = "1"

[[plugins]]
  package = "@netlify/plugin-nextjs"

# Edge Functions
[[edge_functions]]
  function = "ai-analysis"
  path = "/api/ai-analysis/*"
  
[[edge_functions]]
  function = "blockchain-indexer"
  path = "/api/blockchain/*"
  
[[edge_functions]]
  function = "seo-crawler"
  path = "/api/seo/*"
  
[[edge_functions]]
  function = "rate-limiter"
  path = "/api/*"

# Headers de seguridad
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Permissions-Policy = "camera=(), microphone=(), geolocation=()"
    Content-Security-Policy = "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https: wss:;"

# Redirects para SPA
[[redirects]]
  from = "/dashboard/*"
  to = "/dashboard/index.html"
  status = 200
  
[[redirects]]
  from = "/api/dashboard/*"
  to = "/.netlify/functions/dashboard-api"
  status = 200

# Cache optimization
[[headers]]
  for = "/static/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
    
[[headers]]
  for = "/_next/static/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

# Prerender optimization
[build.processing]
  skip_processing = false
[build.processing.css]
  bundle = true
  minify = true
[build.processing.js]
  bundle = true
  minify = true
[build.processing.html]
  pretty_urls = true
`;
    
    fs.writeFileSync(path.join(this.projectRoot, 'netlify.toml'), netlifyToml);
    log.success('netlify.toml creado');
  }

  async createEdgeFunctions() {
    log.info('Creando Edge Functions...');
    
    // Crear directorio de Edge Functions
    if (!fs.existsSync(this.edgeFunctionsDir)) {
      fs.mkdirSync(this.edgeFunctionsDir, { recursive: true });
    }
    
    // Crear Edge Function para análisis con IA
    const aiAnalysisFunction = `import { Context } from "@netlify/edge-functions";

export default async (request: Request, context: Context) => {
  // Rate limiting
  const clientIP = context.ip;
  const rateLimitKey = \`ai-analysis:\${clientIP}\`;
  
  try {
    const { searchParams } = new URL(request.url);
    const address = searchParams.get('address');
    const tools = searchParams.get('tools')?.split(',') || [];
    
    if (!address) {
      return new Response(JSON.stringify({ error: 'Address is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Procesar análisis con IA
    const analysisResult = await processAIAnalysis(address, tools);
    
    return new Response(JSON.stringify(analysisResult), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=300' // 5 minutos
      }
    });
  } catch (error) {
    console.error('AI Analysis Error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

async function processAIAnalysis(address: string, tools: string[]) {
  // Implementar lógica de análisis con IA
  // Conectar con Anthropic/OpenAI/DeepSeek
  return {
    address,
    tools,
    analysis: 'AI analysis results',
    timestamp: new Date().toISOString()
  };
}

export const config = {
  path: "/api/ai-analysis/*"
};
`;
    
    fs.writeFileSync(
      path.join(this.edgeFunctionsDir, 'ai-analysis.ts'),
      aiAnalysisFunction
    );
    
    // Crear Edge Function para rate limiting
    const rateLimiterFunction = `import { Context } from "@netlify/edge-functions";

const RATE_LIMITS = {
  '/api/ai-analysis': { requests: 10, window: 60000 }, // 10 requests per minute
  '/api/blockchain': { requests: 50, window: 60000 },   // 50 requests per minute
  '/api/seo': { requests: 30, window: 60000 }          // 30 requests per minute
};

export default async (request: Request, context: Context) => {
  const { pathname } = new URL(request.url);
  const clientIP = context.ip;
  
  // Encontrar límite aplicable
  const rateLimit = Object.entries(RATE_LIMITS)
    .find(([path]) => pathname.startsWith(path))?.[1];
  
  if (rateLimit) {
    const rateLimitKey = \`rate-limit:\${pathname}:\${clientIP}\`;
    
    // Aquí implementarías la lógica de rate limiting
    // usando KV storage o similar
    
    // Por ahora, solo loggeamos
    console.log(\`Rate limit check for \${clientIP} on \${pathname}\`);
  }
  
  // Continuar con la request
  return context.next();
};

export const config = {
  path: "/api/*"
};
`;
    
    fs.writeFileSync(
      path.join(this.edgeFunctionsDir, 'rate-limiter.ts'),
      rateLimiterFunction
    );
    
    log.success('Edge Functions creadas');
  }

  async setupEnvironmentVariables() {
    log.info('Configurando variables de entorno...');
    
    // Crear archivo de ejemplo para variables de entorno
    const envExample = Object.entries(NETLIFY_ENV_VARS)
      .map(([key, description]) => `# ${description}\n${key}=your-${key.toLowerCase().replace(/_/g, '-')}-here`)
      .join('\n\n');
    
    fs.writeFileSync(
      path.join(this.projectRoot, '.env.netlify.example'),
      `# Variables de entorno para Netlify\n# Copia este archivo a .env.local para desarrollo\n\n${envExample}`
    );
    
    log.success('Archivo de ejemplo de variables de entorno creado');
    log.warning('Recuerda configurar las variables de entorno en Netlify Dashboard');
  }

  async createDeployScript() {
    log.info('Creando script de deploy...');
    
    const deployScript = `#!/bin/bash

# Script de deploy para Netlify
# Basado en análisis de mejoras para implementación

set -e

echo "🚀 Iniciando deploy a Netlify..."

# Verificar que estamos en la rama correcta
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "main" ] && [ "$CURRENT_BRANCH" != "master" ]; then
  echo "⚠️  Advertencia: No estás en la rama main/master"
  read -p "¿Continuar con el deploy desde $CURRENT_BRANCH? (y/N): " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Deploy cancelado"
    exit 1
  fi
fi

# Verificar que no hay cambios sin commit
if [ -n "$(git status --porcelain)" ]; then
  echo "❌ Hay cambios sin commit. Commit tus cambios antes del deploy."
  exit 1
fi

# Ejecutar tests
echo "🧪 Ejecutando tests..."
npm run test:ci || {
  echo "❌ Tests fallaron. Deploy cancelado."
  exit 1
}

# Build del proyecto
echo "🔨 Building proyecto..."
npm run build || {
  echo "❌ Build falló. Deploy cancelado."
  exit 1
}

# Deploy a Netlify
echo "📤 Deploying a Netlify..."
netlify deploy --prod --dir=.next || {
  echo "❌ Deploy falló."
  exit 1
}

echo "✅ Deploy completado exitosamente!"
echo "🌐 Tu sitio está disponible en: $(netlify status --json | jq -r '.site.url')"
`;
    
    fs.writeFileSync(path.join(this.projectRoot, 'scripts/deploy-netlify.sh'), deployScript);
    
    // Hacer el script ejecutable
    try {
      execSync('chmod +x scripts/deploy-netlify.sh');
    } catch (error) {
      // En Windows, chmod puede no estar disponible
      log.warning('No se pudo hacer el script ejecutable (normal en Windows)');
    }
    
    log.success('Script de deploy creado');
  }

  async optimizeForProduction() {
    log.info('Aplicando optimizaciones para producción...');
    
    // Crear configuración optimizada de Next.js
    const nextConfigOptimized = `/** @type {import('next').NextConfig} */
const nextConfig = {
  // Optimizaciones para Netlify
  output: 'standalone',
  trailingSlash: false,
  
  // Optimizaciones de performance
  swcMinify: true,
  compress: true,
  
  // Optimizaciones de imágenes
  images: {
    domains: ['your-domain.com'],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
  },
  
  // Headers de seguridad
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          }
        ]
      }
    ];
  },
  
  // Redirects
  async redirects() {
    return [
      {
        source: '/dashboard',
        destination: '/dashboard/unified-results',
        permanent: false
      }
    ];
  },
  
  // Variables de entorno públicas
  env: {
    NEXT_PUBLIC_APP_VERSION: process.env.npm_package_version,
    NEXT_PUBLIC_BUILD_TIME: new Date().toISOString(),
  },
  
  // Webpack optimizations
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    
    return config;
  },
};

module.exports = nextConfig;
`;
    
    // Backup del next.config.js actual
    const nextConfigPath = path.join(this.projectRoot, 'next.config.js');
    if (fs.existsSync(nextConfigPath)) {
      fs.copyFileSync(nextConfigPath, `${nextConfigPath}.backup`);
      log.info('Backup de next.config.js creado');
    }
    
    fs.writeFileSync(nextConfigPath, nextConfigOptimized);
    log.success('Configuración de Next.js optimizada');
  }

  showNextSteps() {
    console.log(`
${colors.bright}${colors.green}🎯 Próximos pasos:${colors.reset}
`);
    console.log('1. 🔑 Configurar variables de entorno en Netlify Dashboard:');
    console.log('   - Ve a tu sitio en Netlify > Site settings > Environment variables');
    console.log('   - Agrega todas las variables del archivo .env.netlify.example\n');
    
    console.log('2. 🚀 Conectar repositorio:');
    console.log('   - netlify init');
    console.log('   - Sigue las instrucciones para conectar tu repositorio\n');
    
    console.log('3. 📤 Deploy inicial:');
    console.log('   - git add .');
    console.log('   - git commit -m "feat: configuración de Netlify"');
    console.log('   - git push origin main\n');
    
    console.log('4. 🔧 Configurar dominios personalizados (opcional):');
    console.log('   - Ve a Netlify Dashboard > Domain settings');
    console.log('   - Agrega tu dominio personalizado\n');
    
    console.log('5. 📊 Configurar monitoreo:');
    console.log('   - Configura Sentry para error tracking');
    console.log('   - Configura PostHog para analytics\n');
    
    console.log(`${colors.bright}${colors.blue}📚 Documentación útil:${colors.reset}`);
    console.log('- Netlify Next.js: https://docs.netlify.com/frameworks/next-js/');
    console.log('- Edge Functions: https://docs.netlify.com/edge-functions/overview/');
    console.log('- Supabase + Netlify: https://supabase.com/docs/guides/getting-started/tutorials/with-nextjs');
  }
}

// Ejecutar setup si es llamado directamente
if (require.main === module) {
  const setup = new NetlifySetup();
  setup.run().catch(console.error);
}

module.exports = NetlifySetup;