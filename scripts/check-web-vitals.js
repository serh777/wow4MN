#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Colores para la consola
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

// Thresholds para Core Web Vitals
const thresholds = {
  LCP: { good: 2500, poor: 4000 }, // Largest Contentful Paint
  FID: { good: 100, poor: 300 },   // First Input Delay
  CLS: { good: 0.1, poor: 0.25 },  // Cumulative Layout Shift
  FCP: { good: 1800, poor: 3000 }, // First Contentful Paint
  TTFB: { good: 800, poor: 1800 }, // Time to First Byte
  INP: { good: 200, poor: 500 }    // Interaction to Next Paint
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkWebVitalsImplementation() {
  log('\n🔍 Verificando implementación de Core Web Vitals...', 'cyan');
  
  const coreWebVitalsPath = path.join(__dirname, '..', 'src', 'components', 'performance', 'core-web-vitals.tsx');
  
  if (!fs.existsSync(coreWebVitalsPath)) {
    log('❌ Componente CoreWebVitals no encontrado', 'red');
    return false;
  }
  
  const content = fs.readFileSync(coreWebVitalsPath, 'utf8');
  
  // Verificar que se están midiendo todas las métricas importantes
  const requiredMetrics = ['CLS', 'INP', 'FCP', 'LCP', 'TTFB'];
  const missingMetrics = requiredMetrics.filter(metric => !content.includes(metric));
  
  if (missingMetrics.length > 0) {
    log(`❌ Métricas faltantes: ${missingMetrics.join(', ')}`, 'red');
    return false;
  }
  
  log('✅ Implementación de Core Web Vitals correcta', 'green');
  return true;
}

function checkLayoutImplementation() {
  log('\n🔍 Verificando integración en layout...', 'cyan');
  
  const layoutPath = path.join(__dirname, '..', 'src', 'app', 'layout.tsx');
  
  if (!fs.existsSync(layoutPath)) {
    log('❌ Layout no encontrado', 'red');
    return false;
  }
  
  const content = fs.readFileSync(layoutPath, 'utf8');
  
  if (!content.includes('CoreWebVitals')) {
    log('❌ CoreWebVitals no está integrado en el layout', 'red');
    return false;
  }
  
  if (!content.includes('MobileOptimizer')) {
    log('❌ MobileOptimizer no está integrado en el layout', 'red');
    return false;
  }
  
  log('✅ Integración en layout correcta', 'green');
  return true;
}

function checkMetaTags() {
  log('\n🔍 Verificando meta tags de rendimiento...', 'cyan');
  
  const layoutPath = path.join(__dirname, '..', 'src', 'app', 'layout.tsx');
  const content = fs.readFileSync(layoutPath, 'utf8');
  
  const requiredMetaTags = [
    'viewport',
    'theme-color',
    'color-scheme',
    'X-DNS-Prefetch-Control',
    'preconnect'
  ];
  
  const missingTags = requiredMetaTags.filter(tag => !content.includes(tag));
  
  if (missingTags.length > 0) {
    log(`⚠️  Meta tags faltantes: ${missingTags.join(', ')}`, 'yellow');
  } else {
    log('✅ Meta tags de rendimiento correctos', 'green');
  }
  
  return missingTags.length === 0;
}

function checkNextConfig() {
  log('\n🔍 Verificando configuración de Next.js...', 'cyan');
  
  const configPath = path.join(__dirname, '..', 'next.config.js');
  
  if (!fs.existsSync(configPath)) {
    log('❌ next.config.js no encontrado', 'red');
    return false;
  }
  
  const content = fs.readFileSync(configPath, 'utf8');
  
  const requiredConfigs = [
    'compress',
    'optimizePackageImports',
    'splitChunks',
    'scrollRestoration',
    'optimisticClientCache'
  ];
  
  const missingConfigs = requiredConfigs.filter(config => !content.includes(config));
  
  if (missingConfigs.length > 0) {
    log(`⚠️  Configuraciones faltantes: ${missingConfigs.join(', ')}`, 'yellow');
  } else {
    log('✅ Configuración de Next.js optimizada', 'green');
  }
  
  return missingConfigs.length === 0;
}

function checkDependencies() {
  log('\n🔍 Verificando dependencias de rendimiento...', 'cyan');
  
  const packagePath = path.join(__dirname, '..', 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  
  const requiredDeps = {
    'web-vitals': 'dependencies',
    '@lhci/cli': 'devDependencies',
    'webpack-bundle-analyzer': 'devDependencies'
  };
  
  let allPresent = true;
  
  for (const [dep, type] of Object.entries(requiredDeps)) {
    if (!packageJson[type] || !packageJson[type][dep]) {
      log(`❌ Dependencia faltante: ${dep} en ${type}`, 'red');
      allPresent = false;
    }
  }
  
  if (allPresent) {
    log('✅ Todas las dependencias de rendimiento están instaladas', 'green');
  }
  
  return allPresent;
}

function checkLighthouseConfig() {
  log('\n🔍 Verificando configuración de Lighthouse...', 'cyan');
  
  const configPath = path.join(__dirname, '..', 'lighthouserc.js');
  
  if (!fs.existsSync(configPath)) {
    log('❌ lighthouserc.js no encontrado', 'red');
    return false;
  }
  
  log('✅ Configuración de Lighthouse presente', 'green');
  return true;
}

function generateReport() {
  log('\n📊 Generando reporte de Core Web Vitals...', 'magenta');
  
  const results = {
    webVitalsImplementation: checkWebVitalsImplementation(),
    layoutIntegration: checkLayoutImplementation(),
    metaTags: checkMetaTags(),
    nextConfig: checkNextConfig(),
    dependencies: checkDependencies(),
    lighthouseConfig: checkLighthouseConfig()
  };
  
  const passed = Object.values(results).filter(Boolean).length;
  const total = Object.keys(results).length;
  const score = Math.round((passed / total) * 100);
  
  log('\n📈 RESUMEN DEL ANÁLISIS', 'magenta');
  log('========================', 'magenta');
  log(`Puntuación general: ${score}%`, score >= 80 ? 'green' : score >= 60 ? 'yellow' : 'red');
  log(`Verificaciones pasadas: ${passed}/${total}`, 'cyan');
  
  if (score < 100) {
    log('\n🔧 RECOMENDACIONES:', 'yellow');
    
    if (!results.webVitalsImplementation) {
      log('• Implementar correctamente el componente CoreWebVitals', 'yellow');
    }
    if (!results.layoutIntegration) {
      log('• Integrar CoreWebVitals y MobileOptimizer en el layout', 'yellow');
    }
    if (!results.metaTags) {
      log('• Agregar meta tags de rendimiento faltantes', 'yellow');
    }
    if (!results.nextConfig) {
      log('• Optimizar configuración de Next.js', 'yellow');
    }
    if (!results.dependencies) {
      log('• Instalar dependencias de rendimiento faltantes', 'yellow');
    }
    if (!results.lighthouseConfig) {
      log('• Configurar Lighthouse para auditorías', 'yellow');
    }
  }
  
  log('\n🚀 PRÓXIMOS PASOS:', 'blue');
  log('• Ejecutar: npm run audit:performance', 'blue');
  log('• Ejecutar: npm run audit:mobile', 'blue');
  log('• Ejecutar: npm run analyze:bundle', 'blue');
  
  return score;
}

function main() {
  log('🎯 VERIFICADOR DE CORE WEB VITALS', 'magenta');
  log('==================================', 'magenta');
  
  const score = generateReport();
  
  if (score >= 80) {
    log('\n🎉 ¡Excelente! Tu implementación de Core Web Vitals está bien configurada.', 'green');
    process.exit(0);
  } else if (score >= 60) {
    log('\n⚠️  Tu implementación necesita algunas mejoras.', 'yellow');
    process.exit(1);
  } else {
    log('\n❌ Tu implementación necesita mejoras significativas.', 'red');
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  checkWebVitalsImplementation,
  checkLayoutImplementation,
  checkMetaTags,
  checkNextConfig,
  checkDependencies,
  checkLighthouseConfig,
  generateReport
};