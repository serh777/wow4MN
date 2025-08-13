import { ThemeProvider } from '@/components/theme/theme-provider';
import { NotificationProvider } from '@/components/notifications/notification-system';
import { CookieConsent } from '@/components/cookie-consent';
import { GoogleAnalytics } from '@/components/analytics/google-analytics';
import { Toaster, ToastProvider } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/AuthContext';
import { ClientWeb3Provider } from '@/components/providers/client-web3-provider';
import { CoreWebVitals } from '@/components/performance/core-web-vitals';
import { MobileOptimizer } from '@/components/performance/mobile-optimizer';
import ErrorBoundary from '@/components/error-boundary';
import { Toaster as HotToaster } from 'react-hot-toast';
import Script from 'next/script';
import './globals.css';
import { Inter, Poppins } from 'next/font/google';
import { Suspense } from 'react';
import { ConditionalLayout } from '@/components/layout/conditional-layout';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap'
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-heading',
  display: 'swap'
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <title>WowSEOWeb3 | Plataforma de Análisis SEO y Blockchain para Proyectos Web3</title>
        <meta name="description" content="La primera plataforma que combina analítica avanzada de blockchain con SEO especializado. Audite contratos inteligentes, analice datos on-chain y optimice la visibilidad de su DApp." />
        <meta name="keywords" content="SEO Web3, Blockchain SEO, DApp optimization, Smart Contract audit, NFT SEO, DeFi analytics, Web3 marketing, Crypto SEO tools, Blockchain analytics, On-chain data analysis" />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        
        {/* Core Web Vitals and Performance Optimization */}
        <meta name="theme-color" content="#000000" />
        <meta name="color-scheme" content="dark light" />
        <meta httpEquiv="X-DNS-Prefetch-Control" content="on" />
        {/* Font preloading removed - using system fonts for better performance */}
        <meta name="google-site-verification" content="saxwsfSm1KDiNVC_5-6Lpr3Vg7UZFRA13V8AMbabsLc" />
        <link rel="canonical" href="https://wowseoweb3.com" />
        
        {/* Open Graph Meta Tags */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="WowSEOWeb3 | Plataforma de Análisis SEO y Blockchain para Proyectos Web3" />
        <meta property="og:description" content="La primera plataforma que combina analítica avanzada de blockchain con SEO especializado. Audite contratos inteligentes, analice datos on-chain y optimice la visibilidad de su DApp." />
        <meta property="og:url" content="https://wowseoweb3.com" />
        <meta property="og:site_name" content="WowSEOWeb3" />
        <meta property="og:image" content="https://wowseoweb3.com/images/og-image.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:locale" content="es_ES" />
        
        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="WowSEOWeb3 | Plataforma de Análisis SEO y Blockchain para Proyectos Web3" />
        <meta name="twitter:description" content="La primera plataforma que combina analítica avanzada de blockchain con SEO especializado. Audite contratos inteligentes, analice datos on-chain y optimice la visibilidad de su DApp." />
        <meta name="twitter:image" content="https://wowseoweb3.com/images/twitter-card.png" />
        <meta name="twitter:site" content="@wowseoweb3" />
        <meta name="twitter:creator" content="@wowseoweb3" />
        
        {/* Favicon and Icons */}
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <meta name="theme-color" content="#3B82F6" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#1E3A8A" media="(prefers-color-scheme: dark)" />
        
        {/* Google Tag Manager */}
        <Script id="google-tag-manager" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-TWG4SXHP');
          `}
        </Script>

        {/* Structured Data */}
        <Script
          id="structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "WowSEOWeb3",
              "alternateName": "WowSEOWeb3 - Plataforma de Análisis SEO y Blockchain",
              "url": "https://wowseoweb3.com/",
              "description": "La primera plataforma que combina analítica avanzada de blockchain con SEO especializado. Audite contratos inteligentes, analice datos on-chain y optimice la visibilidad de su DApp.",
              "applicationCategory": "BusinessApplication",
              "operatingSystem": "Web",
              "keywords": "SEO Web3, Blockchain SEO, DApp optimization, Smart Contract audit, NFT SEO, DeFi analytics",
              "author": {
                "@type": "Organization",
                "name": "WowSEOWeb3",
                "url": "https://wowseoweb3.com"
              },
              "offers": {
                "@type": "Offer",
                "price": "4.99",
                "priceCurrency": "MATIC",
                "description": "Acceso completo a herramientas de análisis SEO y blockchain"
              },
              "featureList": [
                "Análisis de Metadatos Web3",
                "Asistente IA Avanzado",
                "Investigación de Palabras Clave Blockchain",
                "Monitoreo de Rendimiento",
                "Análisis de Wallet",
                "Análisis de Enlaces Web3",
                "Análisis de Competencia DeFi"
              ]
            })
          }}
        />

        {/* Chatwoot Live Chat */}
        <Script id="chatwoot-widget" strategy="afterInteractive">
          {`
            (function(d,t) {
              console.log('Chatwoot: Iniciando script');
              var websiteToken = '${process.env.NEXT_PUBLIC_CHATWOOT_TOKEN}';
              
              console.log('Chatwoot: Token =', websiteToken);
              
              if (!websiteToken || websiteToken === 'undefined') {
                console.warn('Chatwoot: Token no configurado');
                return;
              }
              
              var BASE_URL = 'https://app.chatwoot.com';
              console.log('Chatwoot: Creando elemento script');
              var g = d.createElement(t);
              var s = d.getElementsByTagName(t)[0];
              g.src = BASE_URL + '/packs/js/sdk.js';
              g.async = true;
              g.defer = true;
              
              g.onload = function() {
                console.log('Chatwoot: SDK cargado');
                if (window.chatwootSDK) {
                  console.log('Chatwoot: Ejecutando SDK');
                  window.chatwootSDK.run({
                    websiteToken: websiteToken,
                    baseUrl: BASE_URL
                  });
                  console.log('Chatwoot: SDK ejecutado');
                } else {
                  console.error('Chatwoot: SDK no disponible');
                }
              };
              
              g.onerror = function(error) {
                console.error('Chatwoot: Error cargando SDK', error);
                // Mostrar indicador de error en producción
                var errorIndicator = d.createElement('div');
                errorIndicator.innerHTML = '💬 Error cargando Chatwoot';
                errorIndicator.style.cssText = 'position:fixed;bottom:20px;right:20px;background:#ff4757;color:white;padding:10px;border-radius:8px;font-size:12px;z-index:9999;';
                d.body.appendChild(errorIndicator);
              };
              
              console.log('Chatwoot: Insertando script en DOM');
              s.parentNode.insertBefore(g, s);
            })(document, 'script');
          `}
        </Script>

        {/* Resource Hints for Performance */}
        <link rel="preconnect" href="https://app.chatwoot.com" />
        <link rel="preconnect" href="https://polygon-rpc.com" />
        <link rel="preconnect" href="https://explorer-api.walletconnect.com" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preload" href="https://www.googletagmanager.com/gtag/js?id=G-GVXST9CBLV" as="script" />
        <link rel="preconnect" href="https://auth.particle.network" />
        <link rel="preconnect" href="https://anbwbrqzffijhcznouwt.supabase.co" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://www.google-analytics.com" />
        <link rel="preconnect" href="https://widget.chatwoot.com" />
        <link rel="preconnect" href="https://cdn.jsdelivr.net" />
        <link rel="preconnect" href="https://unpkg.com" />
        <link rel="dns-prefetch" href="https://ethereum.org" />
        <link rel="dns-prefetch" href="https://polygon.technology" />
        
        {/* Security Headers for Bot Access */}
        <meta httpEquiv="X-Robots-Tag" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        <meta name="referrer" content="no-referrer-when-downgrade" />
        <meta name="format-detection" content="telephone=no" />
      </head>
      <body className={`${inter.variable} ${poppins.variable} font-sans`}>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-TWG4SXHP"
            height="0"
            width="0"
            className="gtm-iframe"
            title="Google Tag Manager"
          />
        </noscript>

        <ErrorBoundary>
          <MobileOptimizer>
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem
              disableTransitionOnChange
            >
              <AuthProvider>
                <ClientWeb3Provider>
                  <ToastProvider>
                    <NotificationProvider>
                      <Suspense fallback={null}>
                        <GoogleAnalytics />
                        <CoreWebVitals />
                      </Suspense>
                      <ConditionalLayout>
                        {children}
                      </ConditionalLayout>
                      <CookieConsent />
                      <Toaster />
                      <HotToaster position="top-right" />
                    </NotificationProvider>
                  </ToastProvider>
                </ClientWeb3Provider>
                </AuthProvider>
              </ThemeProvider>
          </MobileOptimizer>
        </ErrorBoundary>
      </body>
    </html>
  );
}