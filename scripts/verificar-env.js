#!/usr/bin/env node

/**
 * Script para verificar y validar variables de entorno
 * Uso: node scripts/verificar-env.js
 */

const fs = require('fs');
const path = require('path');

// Variables requeridas para el funcionamiento completo
const REQUIRED_VARS = {
  // Supabase (CRÍTICO para autenticación)
  'NEXT_PUBLIC_SUPABASE_URL': {
    required: true,
    description: 'URL de tu proyecto Supabase',
    example: 'https://anbwbrqzffijhcznouwt.supabase.co'
  },
  'NEXT_PUBLIC_SUPABASE_ANON_KEY': {
    required: true,
    description: 'Clave pública anónima de Supabase',
    example: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...'
  },
  'SUPABASE_SERVICE_ROLE_KEY': {
    required: true,
    description: 'Clave de servicio de Supabase (SECRETA)',
    example: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...'
  },
  
  // NextAuth (REQUERIDO para autenticación)
  'NEXTAUTH_SECRET': {
    required: true,
    description: 'Clave secreta para NextAuth (genera con: openssl rand -base64 32)',
    example: 'tu-clave-secreta-muy-larga-y-segura'
  },
  'NEXTAUTH_URL': {
    required: true,
    description: 'URL de tu aplicación',
    example: 'http://localhost:3000 (local) o https://tu-dominio.netlify.app (producción)'
  },
  
  // Base de datos
  'DATABASE_URL': {
    required: false,
    description: 'URL de conexión a la base de datos',
    example: 'postgresql://username:password@localhost:5432/wowseoweb3'
  },
  
  // Email
  'RESEND_API_KEY': {
    required: false,
    description: 'Clave API de Resend para envío de emails',
    example: 're_xxxxxxxxxx'
  },
  
  // Web3
  'NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID': {
    required: false,
    description: 'Project ID de WalletConnect',
    example: 'tu-project-id'
  }
};

function loadEnvFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const vars = {};
    
    content.split('\n').forEach(line => {
      line = line.trim();
      if (line && !line.startsWith('#')) {
        const [key, ...valueParts] = line.split('=');
        if (key && valueParts.length > 0) {
          let value = valueParts.join('=');
          // Remover comillas si existen
          value = value.replace(/^["']|["']$/g, '');
          vars[key] = value;
        }
      }
    });
    
    return vars;
  } catch (error) {
    return null;
  }
}

function checkEnvironmentVariables() {
  console.log('🔍 Verificando variables de entorno...\n');
  
  const envLocalPath = path.join(process.cwd(), '.env.local');
  const envExamplePath = path.join(process.cwd(), '.env.example');
  const envNetlifyPath = path.join(process.cwd(), '.env.netlify');
  
  const envLocal = loadEnvFile(envLocalPath);
  const envExample = loadEnvFile(envExamplePath);
  const envNetlify = loadEnvFile(envNetlifyPath);
  
  if (!envLocal) {
    console.log('❌ No se encontró el archivo .env.local');
    console.log('💡 Crea el archivo .env.local basándote en .env.example\n');
    return;
  }
  
  console.log('📁 Archivos encontrados:');
  console.log(`   ✅ .env.local (${Object.keys(envLocal).length} variables)`);
  if (envExample) console.log(`   ✅ .env.example (${Object.keys(envExample).length} variables)`);
  if (envNetlify) console.log(`   ✅ .env.netlify (${Object.keys(envNetlify).length} variables)`);
  console.log();
  
  let hasErrors = false;
  let hasWarnings = false;
  
  console.log('🔍 Verificando variables requeridas:\n');
  
  Object.entries(REQUIRED_VARS).forEach(([varName, config]) => {
    const value = envLocal[varName];
    const hasValue = value && value.trim() !== '';
    const isExample = value && (value.includes('example') || value.includes('your-') || value.includes('placeholder'));
    
    if (config.required) {
      if (!hasValue) {
        console.log(`❌ ${varName}: FALTANTE`);
        console.log(`   📝 ${config.description}`);
        console.log(`   💡 Ejemplo: ${config.example}\n`);
        hasErrors = true;
      } else if (isExample) {
        console.log(`⚠️  ${varName}: VALOR DE EJEMPLO`);
        console.log(`   📝 ${config.description}`);
        console.log(`   🔄 Actual: ${value}`);
        console.log(`   💡 Necesitas reemplazar con valor real\n`);
        hasErrors = true;
      } else {
        console.log(`✅ ${varName}: OK`);
      }
    } else {
      if (!hasValue) {
        console.log(`⚠️  ${varName}: OPCIONAL - No configurada`);
        console.log(`   📝 ${config.description}\n`);
        hasWarnings = true;
      } else if (isExample) {
        console.log(`⚠️  ${varName}: OPCIONAL - Valor de ejemplo`);
        console.log(`   🔄 Actual: ${value}\n`);
        hasWarnings = true;
      } else {
        console.log(`✅ ${varName}: OK`);
      }
    }
  });
  
  console.log('\n' + '='.repeat(60));
  
  if (hasErrors) {
    console.log('\n❌ ERRORES ENCONTRADOS:');
    console.log('   • Hay variables requeridas faltantes o con valores de ejemplo');
    console.log('   • El login NO funcionará hasta que se corrijan');
    console.log('\n🔧 PASOS PARA CORREGIR:');
    console.log('   1. Ve a tu proyecto en Supabase: https://supabase.com/dashboard');
    console.log('   2. Obtén las claves reales de Settings > API');
    console.log('   3. Genera NEXTAUTH_SECRET: openssl rand -base64 32');
    console.log('   4. Actualiza .env.local con los valores reales');
    console.log('   5. Agrega las mismas variables en Netlify Dashboard');
  } else {
    console.log('\n✅ CONFIGURACIÓN BÁSICA CORRECTA');
    console.log('   • Todas las variables requeridas están configuradas');
    console.log('   • El login debería funcionar');
  }
  
  if (hasWarnings) {
    console.log('\n⚠️  ADVERTENCIAS:');
    console.log('   • Algunas funciones opcionales pueden no funcionar');
    console.log('   • Considera configurar las variables opcionales');
  }
  
  console.log('\n📋 PARA NETLIFY:');
  console.log('   1. Ve a tu sitio en Netlify Dashboard');
  console.log('   2. Settings > Build & Deploy > Environment variables');
  console.log('   3. Agrega todas las variables de .env.local');
  console.log('   4. Cambia NEXTAUTH_URL a tu dominio de Netlify');
  console.log('   5. Redeploy el sitio');
  
  console.log('\n🔗 ENLACES ÚTILES:');
  console.log('   • Supabase Dashboard: https://supabase.com/dashboard');
  console.log('   • Generar secreto: https://generate-secret.vercel.app/32');
  console.log('   • Documentación: ./SOLUCION_LOGIN_NETLIFY.md');
}

function generateEnvTemplate() {
  console.log('\n📝 PLANTILLA .env.local:\n');
  console.log('# Variables de entorno para desarrollo local');
  console.log('# Copia este archivo como .env.local y completa con valores reales\n');
  
  Object.entries(REQUIRED_VARS).forEach(([varName, config]) => {
    console.log(`# ${config.description}`);
    if (config.required) {
      console.log(`${varName}="${config.example}"`);
    } else {
      console.log(`# ${varName}="${config.example}"`);
    }
    console.log();
  });
}

// Ejecutar verificación
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.includes('--template')) {
    generateEnvTemplate();
  } else {
    checkEnvironmentVariables();
  }
}

module.exports = { checkEnvironmentVariables, loadEnvFile, REQUIRED_VARS };