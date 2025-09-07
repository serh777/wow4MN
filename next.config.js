/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Configuración para Netlify
  output: 'standalone',
  // Optimizaciones de rendimiento para Core Web Vitals
  compress: true,
  poweredByHeader: false,
  generateEtags: true,
  
  // Headers de seguridad y rendimiento
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'no-referrer-when-downgrade'
          },
          {
            key: 'X-Robots-Tag',
            value: 'index, follow, max-snippet:-1, max-image-preview:large'
          }
        ]
      },
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate'
          }
        ]
      },
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      }
    ]
  },
  
  images: {
    unoptimized: false, // Habilitar optimización de imágenes
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384]
  },
  
  transpilePackages: [
    '@anthropic-ai/sdk',
    '@supabase/ssr',
    '@supabase/supabase-js'
  ],
  
  // Configuración de source maps
  productionBrowserSourceMaps: false,
  
  // Optimizaciones experimentales para Core Web Vitals
  experimental: {
    // optimizeCss: true, // Deshabilitado temporalmente por problemas de build
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
    scrollRestoration: true,
    largePageDataBytes: 128 * 1000, // 128KB
    optimisticClientCache: true
  },
  
  webpack: (config, { dev, isServer }) => {
    // Optimizaciones de webpack para Core Web Vitals
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
            priority: 10
          },
          common: {
            name: 'common',
            minChunks: 2,
            chunks: 'all',
            priority: 5,
            reuseExistingChunk: true
          }
        }
      };
      
      // Optimizaciones adicionales
      config.optimization.usedExports = true;
      config.optimization.sideEffects = false;
    }
    
    // Configuración para análisis de bundle
    if (process.env.ANALYZE === 'true') {
      const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'static',
          openAnalyzer: false,
          reportFilename: isServer ? '../analyze/server.html' : './analyze/client.html'
        })
      );
    }
    
    return config;
  }
}

module.exports = nextConfig