// =============================================================================
// CONFIGURACIÓN DE CABECERAS DE SEGURIDAD - NEXT.JS
// =============================================================================
// Middleware de seguridad para aplicaciones Next.js
// Incluir en next.config.js o como middleware

/**
 * Configuración de cabeceras de seguridad para Next.js
 * Protege contra ataques comunes como XSS, clickjacking, CSRF, etc.
 */
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block'
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN' // Cambiado de DENY a SAMEORIGIN para permitir análisis
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin'
  },
  {
    key: 'Permissions-Policy',
    value: 'geolocation=(), microphone=(), camera=(), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=()'
  },
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self' *", // Temporalmente más permisivo para análisis
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' *", // Permitir todos los scripts para análisis
      "style-src 'self' 'unsafe-inline' *", // Permitir todos los estilos
      "font-src 'self' *", // Permitir todas las fuentes
      "img-src 'self' data: https: blob: *", // Permitir todas las imágenes
      "media-src 'self' https: *", // Permitir todos los medios
      "connect-src 'self' *", // Permitir todas las conexiones para análisis
      "frame-src *", // Permitir frames para herramientas de análisis
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      "upgrade-insecure-requests"
    ].join('; ')
  }
];

/**
 * Lista de rutas que deben ser protegidas con autenticación
 */
const protectedRoutes = [
  '/dashboard',
  '/admin',
  '/api/admin',
  '/api/dashboard',
  '/profile',
  '/settings'
];

/**
 * Lista de IPs bloqueadas (ejemplo)
 * En producción, esto debería venir de una base de datos o servicio externo
 */
const blockedIPs = [
  // Agregar IPs maliciosas aquí
  // '192.168.1.100',
  // '10.0.0.1'
];

/**
 * User agents maliciosos a bloquear
 */
// TEMPORALMENTE MODIFICADO PARA PERMITIR HERRAMIENTAS DE ANÁLISIS SSL
const blockedUserAgents = [
  // Temporalmente comentados para permitir herramientas de análisis
  // 'bot',
  // 'crawler',
  'mj12bot',
  'dotbot',
  'blexbot',
  'petalbot',
  'megaindex'
];

// User agents permitidos para análisis SSL y herramientas legítimas
const allowedAnalysisUserAgents = [
  'qualys ssl labs',
  'google pagespeed',
  'gtmetrix',
  'pingdom',
  'webpagetest',
  'lighthouse',
  'ssl-tools',
  'ssllabs',
  'mozilla/5.0',
  'googlebot',
  'bingbot',
  'slurp',
  'duckduckbot'
];

/**
 * Patrones de ataques comunes a detectar en URLs
 */
const maliciousPatterns = [
  /(<|%3C).*script.*(>|%3E)/i,
  /(<|%3C).*(iframe|object|embed|marquee|link|meta).*(>|%3E)/i,
  /(concat|delete|get|select|union|update|insert|drop|create|MD5|benchmark|script|javascript|vbscript)/i,
  /(\.\.|\.\/|\.\.\/)/,
  /(wp-config|wp-admin|xmlrpc|readme|license|changelog)/i,
  /\.(env|json|md|sql|log|conf|config|bak|backup|old|tmp|temp)$/i
];

/**
 * Función para verificar si una IP está bloqueada
 */
function isIPBlocked(ip) {
  return blockedIPs.includes(ip);
}

/**
 * Función para verificar si el user agent está bloqueado
 * MODIFICADA PARA PERMITIR HERRAMIENTAS DE ANÁLISIS SSL
 */
function isUserAgentBlocked(userAgent) {
  if (!userAgent) return false;
  
  // Primero verificar si es un user agent permitido para análisis
  const isAllowedAnalysis = allowedAnalysisUserAgents.some(allowed => 
    userAgent.toLowerCase().includes(allowed.toLowerCase())
  );
  
  if (isAllowedAnalysis) {
    return false; // Permitir herramientas de análisis SSL
  }
  
  // Si no es una herramienta de análisis permitida, verificar si está bloqueado
  return blockedUserAgents.some(blocked => 
    userAgent.toLowerCase().includes(blocked.toLowerCase())
  );
}

/**
 * Función para detectar patrones maliciosos en la URL
 */
function hasMaliciousPattern(url) {
  return maliciousPatterns.some(pattern => pattern.test(url));
}

/**
 * Función para verificar si una ruta está protegida
 */
function isProtectedRoute(pathname) {
  return protectedRoutes.some(route => pathname.startsWith(route));
}

/**
 * Función para obtener la IP real del cliente
 */
function getClientIP(request) {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const cfConnectingIP = request.headers.get('cf-connecting-ip');
  
  if (cfConnectingIP) return cfConnectingIP;
  if (realIP) return realIP;
  if (forwarded) return forwarded.split(',')[0].trim();
  
  return request.ip || 'unknown';
}

/**
 * Middleware de seguridad principal
 */
function securityMiddleware(request) {
  const { pathname, search } = request.nextUrl;
  const userAgent = request.headers.get('user-agent') || '';
  const clientIP = getClientIP(request);
  const fullURL = pathname + search;
  
  // Verificar IP bloqueada
  if (isIPBlocked(clientIP)) {
    console.log(`Blocked IP attempt: ${clientIP}`);
    return new Response('Access Denied', { status: 403 });
  }
  
  // Verificar user agent bloqueado
  if (isUserAgentBlocked(userAgent)) {
    console.log(`Blocked User Agent: ${userAgent} from IP: ${clientIP}`);
    return new Response('Access Denied', { status: 403 });
  }
  
  // Verificar patrones maliciosos
  if (hasMaliciousPattern(fullURL)) {
    console.log(`Malicious pattern detected: ${fullURL} from IP: ${clientIP}`);
    return new Response('Bad Request', { status: 400 });
  }
  
  // Bloquear acceso a archivos sensibles
  if (pathname.match(/\.(env|json|md|sql|log|conf|config|bak|backup|old|tmp|temp|ts|tsx|js|jsx)$/)) {
    return new Response('Not Found', { status: 404 });
  }
  
  // Bloquear acceso a directorios sensibles
  if (pathname.match(/^\/(\.|node_modules|src|config|scripts|prisma|dist|cache|artifacts|contracts|indexer|hooks|services|utils|types|contexts|lib|components)\//)) {
    return new Response('Not Found', { status: 404 });
  }
  
  return null; // Continuar con la solicitud
}

/**
 * Configuración para rate limiting (ejemplo básico)
 */
const rateLimitConfig = {
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // límite de 100 solicitudes por ventana de tiempo
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false
};

/**
 * Función para logging de seguridad
 */
function logSecurityEvent(event, details) {
  const timestamp = new Date().toISOString();
  console.log(`[SECURITY] ${timestamp} - ${event}:`, details);
  
  // En producción, enviar a un servicio de logging como Sentry, LogRocket, etc.
  // if (process.env.NODE_ENV === 'production') {
  //   // Enviar a servicio de logging
  // }
}

/**
 * Exportar configuraciones y funciones
 */
module.exports = {
  securityHeaders,
  securityMiddleware,
  protectedRoutes,
  blockedIPs,
  blockedUserAgents,
  allowedAnalysisUserAgents,  // Nueva exportación
  maliciousPatterns,
  rateLimitConfig,
  isIPBlocked,
  isUserAgentBlocked,
  hasMaliciousPattern,
  isProtectedRoute,
  getClientIP,
  logSecurityEvent
};

/**
 * Ejemplo de uso en next.config.js:
 * 
 * const { securityHeaders } = require('./security-headers');
 * 
 * module.exports = {
 *   async headers() {
 *     return [
 *       {
 *         source: '/(.*)',
 *         headers: securityHeaders,
 *       },
 *     ];
 *   },
 * };
 */

/**
 * Ejemplo de uso en middleware.js:
 * 
 * import { NextResponse } from 'next/server';
 * import { securityMiddleware, securityHeaders } from './security-headers';
 * 
 * export function middleware(request) {
 *   // Aplicar middleware de seguridad
 *   const securityResponse = securityMiddleware(request);
 *   if (securityResponse) {
 *     return securityResponse;
 *   }
 * 
 *   // Continuar con la solicitud y agregar cabeceras de seguridad
 *   const response = NextResponse.next();
 *   
 *   securityHeaders.forEach(({ key, value }) => {
 *     response.headers.set(key, value);
 *   });
 * 
 *   return response;
 * }
 * 
 * export const config = {
 *   matcher: [
 *     '/((?!api|_next/static|_next/image|favicon.ico).*)',
 *   ],
 * };
 */