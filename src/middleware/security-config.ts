// Security configuration for allowing legitimate bots and analysis tools
// while blocking malicious traffic

export const allowedBots = [
  // Google bots
  'Googlebot',
  'Googlebot-Image',
  'Googlebot-News',
  'Googlebot-Video',
  'Google-PageSpeed',
  'Google-Mobile',
  'Chrome-Lighthouse',
  'Google-Site-Verification',
  'AdsBot-Google',
  'Mediapartners-Google',
  
  // Other search engines
  'Bingbot',
  'Slurp', // Yahoo
  'DuckDuckBot',
  'Baiduspider',
  'YandexBot',
  
  // Analysis and monitoring tools
  'GTmetrix',
  'Pingdom',
  'WebPageTest',
  'UptimeRobot',
  'StatusCake',
  'Lighthouse',
  'PageSpeed',
  
  // Social media crawlers
  'facebookexternalhit',
  'Twitterbot',
  'LinkedInBot',
  'WhatsApp',
  'TelegramBot',
  
  // SEO tools
  'AhrefsBot',
  'SemrushBot',
  'MJ12bot',
  'DotBot',
  'SiteAuditBot'
];

export const blockedUserAgents = [
  // Known malicious bots
  'SemrushBot-SA', // Aggressive version
  'MJ12bot/v1.4.8', // Aggressive version
  'AhrefsBot/7.0', // Aggressive version
  'BLEXBot',
  'DotBot/1.1',
  'Rogerbot',
  'SiteAuditBot',
  'spbot',
  'MegaIndex.ru',
  'SeznamBot',
  'linkdexbot',
  'Ezooms',
  'CCBot',
  'ChatGPT-User',
  'GPTBot',
  'Google-Extended'
];

export const allowedIPs = [
  // Google IP ranges (simplified - in production use full ranges)
  '66.249.64.0/19',
  '64.233.160.0/19',
  '72.14.192.0/18',
  '209.85.128.0/17',
  '216.239.32.0/19',
  
  // Bing IP ranges
  '40.77.167.0/24',
  '157.55.39.0/24',
  '207.46.13.0/24',
  
  // Common analysis tools IPs (examples)
  '172.255.48.0/20', // GTmetrix
  '185.39.146.0/24', // Pingdom
];

export const securityHeaders = {
  // Allow legitimate bots while maintaining security
  'X-Robots-Tag': 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'no-referrer-when-downgrade',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  
  // Content Security Policy that allows analysis tools
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://widget.chatwoot.com https://app.chatwoot.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://widget.chatwoot.com https://app.chatwoot.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https: blob:",
    "connect-src 'self' https://www.google-analytics.com https://vitals.vercel-analytics.com wss://widget.chatwoot.com wss://app.chatwoot.com https://app.chatwoot.com",
    "frame-src 'self' https://www.google.com https://widget.chatwoot.com https://app.chatwoot.com"
  ].join('; ')
};

// Rate limiting configuration
export const rateLimiting = {
  // More lenient for known bots
  bots: {
    windowMs: 60 * 1000, // 1 minute
    max: 100, // 100 requests per minute
    skipSuccessfulRequests: true
  },
  
  // Standard rate limiting for regular users
  users: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // 100 requests per 15 minutes
    skipSuccessfulRequests: false
  },
  
  // Strict rate limiting for unknown/suspicious traffic
  strict: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20, // 20 requests per 15 minutes
    skipSuccessfulRequests: false
  }
};

// Function to check if user agent is a legitimate bot
export function isLegitimateBot(userAgent: string): boolean {
  if (!userAgent) return false;
  
  const lowerUA = userAgent.toLowerCase();
  
  // Check against allowed bots
  return allowedBots.some(bot => 
    lowerUA.includes(bot.toLowerCase())
  );
}

// Function to check if user agent should be blocked
export function isBlockedBot(userAgent: string): boolean {
  if (!userAgent) return false;
  
  const lowerUA = userAgent.toLowerCase();
  
  // Check against blocked user agents
  return blockedUserAgents.some(blocked => 
    lowerUA.includes(blocked.toLowerCase())
  );
}

// Function to determine appropriate rate limiting
export function getRateLimitConfig(userAgent: string) {
  if (isLegitimateBot(userAgent)) {
    return rateLimiting.bots;
  }
  
  if (isBlockedBot(userAgent)) {
    return rateLimiting.strict;
  }
  
  return rateLimiting.users;
}

// Netlify-specific configuration
export const netlifyConfig = {
  // Headers for _headers file
  headers: Object.entries(securityHeaders)
    .map(([key, value]) => `  ${key}: ${value}`)
    .join('\n'),
    
  // Redirects for _redirects file
  redirects: [
    // Block known bad bots while allowing analysis tools
    '/api/* 403! User-Agent:BLEXBot',
    '/api/* 403! User-Agent:DotBot/1.1',
    '/api/* 403! User-Agent:MegaIndex.ru',
    
    // Allow specific analysis tools
    '/* 200 User-Agent:Googlebot',
    '/* 200 User-Agent:Chrome-Lighthouse',
    '/* 200 User-Agent:GTmetrix',
    '/* 200 User-Agent:PageSpeed'
  ]
};