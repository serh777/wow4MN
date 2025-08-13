module.exports = {
  ci: {
    collect: {
      url: [
        'http://localhost:3000',
        'http://localhost:3000/features',
        'http://localhost:3000/pricing',
        'http://localhost:3000/about'
      ],
      startServerCommand: 'npm run build && npm run start',
      numberOfRuns: 3,
      settings: {
        chromeFlags: '--no-sandbox --disable-dev-shm-usage',
        preset: 'desktop',
        onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
        skipAudits: [
          'uses-http2',
          'canonical',
          'meta-description'
        ]
      }
    },
    assert: {
      assertions: {
        // Core Web Vitals thresholds
        'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        'total-blocking-time': ['error', { maxNumericValue: 300 }],
        'first-contentful-paint': ['error', { maxNumericValue: 1800 }],
        'speed-index': ['error', { maxNumericValue: 3400 }],
        'interactive': ['error', { maxNumericValue: 3800 }],
        
        // Performance metrics
        'server-response-time': ['error', { maxNumericValue: 600 }],
        'render-blocking-resources': ['error', { maxNumericValue: 500 }],
        'unused-css-rules': ['warn', { maxNumericValue: 20000 }],
        'unused-javascript': ['warn', { maxNumericValue: 20000 }],
        'uses-optimized-images': 'error',
        'uses-webp-images': 'warn',
        'uses-responsive-images': 'error',
        'efficient-animated-content': 'warn',
        
        // SEO and Accessibility
        'meta-viewport': 'error',
        'document-title': 'error',
        'html-has-lang': 'error',
        'color-contrast': 'error',
        'tap-targets': 'error',
        'font-size': 'error',
        
        // Best practices
        'uses-https': 'error',
        'is-on-https': 'error',
        'no-vulnerable-libraries': 'error',
        'csp-xss': 'warn'
      }
    },
    upload: {
      target: 'temporary-public-storage'
    },
    server: {
      port: 9001,
      storage: './lighthouse-reports'
    }
  }
};

// Configuración específica para diferentes entornos
if (process.env.NODE_ENV === 'production') {
  module.exports.ci.collect.url = [
    'https://wowseoweb3.com',
    'https://wowseoweb3.com/features',
    'https://wowseoweb3.com/pricing',
    'https://wowseoweb3.com/about'
  ];
  module.exports.ci.collect.startServerCommand = undefined;
}

// Configuración para móvil
const mobileConfig = {
  ...module.exports,
  ci: {
    ...module.exports.ci,
    collect: {
      ...module.exports.ci.collect,
      settings: {
        ...module.exports.ci.collect.settings,
        preset: 'mobile',
        chromeFlags: '--no-sandbox --disable-dev-shm-usage --disable-gpu'
      }
    },
    assert: {
      assertions: {
        // Thresholds más estrictos para móvil
        'largest-contentful-paint': ['error', { maxNumericValue: 4000 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        'total-blocking-time': ['error', { maxNumericValue: 600 }],
        'first-contentful-paint': ['error', { maxNumericValue: 3000 }],
        'speed-index': ['error', { maxNumericValue: 5800 }],
        'interactive': ['error', { maxNumericValue: 6500 }],
        
        // Específicos para móvil
        'tap-targets': 'error',
        'font-size': 'error',
        'viewport': 'error'
      }
    }
  }
};

// Exportar configuración móvil si se especifica
if (process.env.LIGHTHOUSE_MOBILE === 'true') {
  module.exports = mobileConfig;
}