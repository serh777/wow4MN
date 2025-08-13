#!/usr/bin/env node

/**
 * Script para generar comandos de Netlify CLI
 * Uso: node scripts/generar-netlify-vars.js
 */

const fs = require('fs');
const path = require('path');

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

function generateNetlifyCommands() {
  console.log('🚀 Generador de Comandos para Netlify CLI\n');
  
  const envLocalPath = path.join(process.cwd(), '.env.local');
  const envLocal = loadEnvFile(envLocalPath);
  
  if (!envLocal) {
    console.log('❌ No se encontró el archivo .env.local');
    console.log('💡 Primero configura tu .env.local con las variables correctas\n');
    return;
  }
  
  // Variables críticas que DEBEN estar configuradas
  const criticalVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY',
    'NEXTAUTH_SECRET',
    'NEXTAUTH_URL'
  ];
  
  // Variables recomendadas
  const recommendedVars = [
    'RESEND_API_KEY',
    'NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID',
    'NEXT_PUBLIC_ALCHEMY_API_KEY',
    'NEXT_PUBLIC_INFURA_API_KEY',
    'NEXT_PUBLIC_GA_MEASUREMENT_ID'
  ];
  
  console.log('📋 INSTRUCCIONES:');
  console.log('1. Instala Netlify CLI: npm install -g netlify-cli');
  console.log('2. Autentícate: netlify login');
  console.log('3. Ve a tu directorio del proyecto');
  console.log('4. Ejecuta los comandos de abajo\n');
  
  console.log('🔑 VARIABLES CRÍTICAS (REQUERIDAS):\n');
  
  let hasCriticalIssues = false;
  
  criticalVars.forEach(varName => {
    const value = envLocal[varName];
    const hasValue = value && value.trim() !== '';
    const isExample = value && (value.includes('example') || value.includes('your-') || value.includes('placeholder') || value.includes('REEMPLAZAR'));
    
    if (!hasValue) {
      console.log(`❌ ${varName}: FALTANTE`);
      console.log(`   netlify env:set ${varName} "TU_VALOR_AQUI"\n`);
      hasCriticalIssues = true;
    } else if (isExample) {
      console.log(`⚠️  ${varName}: VALOR DE EJEMPLO`);
      console.log(`   Actual: ${value}`);
      console.log(`   netlify env:set ${varName} "REEMPLAZAR_CON_VALOR_REAL"\n`);
      hasCriticalIssues = true;
    } else {
      // Ajustar NEXTAUTH_URL para producción
      if (varName === 'NEXTAUTH_URL' && value.includes('localhost')) {
        console.log(`🔄 ${varName}: NECESITA AJUSTE PARA PRODUCCIÓN`);
        console.log(`   Actual: ${value}`);
        console.log(`   netlify env:set ${varName} "https://TU-SITIO.netlify.app"\n`);
      } else {
        console.log(`✅ ${varName}: OK`);
        console.log(`   netlify env:set ${varName} "${value}"\n`);
      }
    }
  });
  
  console.log('📦 VARIABLES RECOMENDADAS:\n');
  
  recommendedVars.forEach(varName => {
    const value = envLocal[varName];
    const hasValue = value && value.trim() !== '';
    const isExample = value && (value.includes('example') || value.includes('your-') || value.includes('placeholder'));
    
    if (hasValue && !isExample) {
      console.log(`✅ ${varName}: OK`);
      console.log(`   netlify env:set ${varName} "${value}"\n`);
    } else {
      console.log(`⚠️  ${varName}: OPCIONAL`);
      console.log(`   # netlify env:set ${varName} "TU_VALOR_AQUI"\n`);
    }
  });
  
  console.log('=' .repeat(60));
  
  if (hasCriticalIssues) {
    console.log('\n❌ ACCIÓN REQUERIDA:');
    console.log('   • Primero corrige las variables críticas en .env.local');
    console.log('   • Luego ejecuta este script nuevamente');
    console.log('   • Finalmente ejecuta los comandos de Netlify CLI\n');
  } else {
    console.log('\n✅ LISTO PARA NETLIFY CLI:');
    console.log('   • Copia y ejecuta los comandos de arriba');
    console.log('   • Después ejecuta: netlify deploy --prod\n');
  }
  
  console.log('🔗 COMANDOS ÚTILES DE NETLIFY CLI:');
  console.log('   netlify env:list                    # Ver variables actuales');
  console.log('   netlify env:unset VARIABLE_NAME     # Eliminar variable');
  console.log('   netlify deploy --prod               # Deploy a producción');
  console.log('   netlify open                        # Abrir dashboard');
  console.log('   netlify logs                        # Ver logs\n');
}

function generateBatchScript() {
  console.log('\n📝 SCRIPT BATCH PARA WINDOWS:\n');
  
  const envLocalPath = path.join(process.cwd(), '.env.local');
  const envLocal = loadEnvFile(envLocalPath);
  
  if (!envLocal) {
    console.log('❌ No se encontró .env.local');
    return;
  }
  
  console.log('@echo off');
  console.log('echo Configurando variables de entorno en Netlify...');
  console.log('echo.');
  
  const criticalVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY', 
    'SUPABASE_SERVICE_ROLE_KEY',
    'NEXTAUTH_SECRET',
    'NEXTAUTH_URL'
  ];
  
  criticalVars.forEach(varName => {
    const value = envLocal[varName];
    if (value && !value.includes('example') && !value.includes('REEMPLAZAR')) {
      let finalValue = value;
      if (varName === 'NEXTAUTH_URL' && value.includes('localhost')) {
        finalValue = 'https://TU-SITIO.netlify.app';
      }
      console.log(`netlify env:set ${varName} "${finalValue}"`);
    } else {
      console.log(`REM netlify env:set ${varName} "VALOR_PENDIENTE"`);
    }
  });
  
  console.log('echo.');
  console.log('echo Variables configuradas!');
  console.log('echo Ejecutando deploy...');
  console.log('netlify deploy --prod');
  console.log('pause');
}

// Ejecutar
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.includes('--batch')) {
    generateBatchScript();
  } else {
    generateNetlifyCommands();
  }
}

module.exports = { generateNetlifyCommands, loadEnvFile };