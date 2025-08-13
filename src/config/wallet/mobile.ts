/**
 * Configuración específica para dispositivos móviles
 */

// Función para detectar dispositivos móviles
export const isMobileDevice = (): boolean => {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') return false;
  
  const userAgent = navigator.userAgent.toLowerCase();
  const mobileKeywords = [
    'android', 'webos', 'iphone', 'ipad', 'ipod', 
    'blackberry', 'iemobile', 'opera mini', 'mobile'
  ];
  
  return mobileKeywords.some(keyword => userAgent.includes(keyword));
};

// Función para detectar iOS
export const isIOS = (): boolean => {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') return false;
  
  const userAgent = navigator.userAgent.toLowerCase();
  return /iphone|ipad|ipod/.test(userAgent);
};

// Función para detectar Android
export const isAndroid = (): boolean => {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') return false;
  
  const userAgent = navigator.userAgent.toLowerCase();
  return /android/.test(userAgent);
};

// Función para detectar si está en un navegador móvil
export const isMobileBrowser = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  return isMobileDevice() && !(window as any).ethereum;
};

// Función para detectar si está en una app móvil con wallet
export const isMobileWalletApp = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  return isMobileDevice() && !!(window as any).ethereum;
};

// Configuración de timeouts para móvil
export const mobileTimeouts = {
  connection: 30000, // 30 segundos
  transaction: 60000, // 60 segundos
  networkSwitch: 15000, // 15 segundos
  retry: 5000 // 5 segundos entre reintentos
};

// Configuración de reintentos para móvil
export const mobileRetryConfig = {
  maxAttempts: 3,
  backoffMultiplier: 2,
  initialDelay: 1000
};

// Wallets móviles populares con sus deep links
export const mobileWalletDeepLinks = {
  metamask: {
    name: 'MetaMask',
    ios: 'https://metamask.app.link/dapp/',
    android: 'https://metamask.app.link/dapp/',
    universal: 'https://metamask.app.link/dapp/'
  },
  trust: {
    name: 'Trust Wallet',
    ios: 'https://link.trustwallet.com/open_url?coin_id=60&url=',
    android: 'https://link.trustwallet.com/open_url?coin_id=60&url=',
    universal: 'https://link.trustwallet.com/open_url?coin_id=60&url='
  },
  coinbase: {
    name: 'Coinbase Wallet',
    ios: 'https://go.cb-w.com/dapp?cb_url=',
    android: 'https://go.cb-w.com/dapp?cb_url=',
    universal: 'https://go.cb-w.com/dapp?cb_url='
  },
  rainbow: {
    name: 'Rainbow',
    ios: 'https://rnbwapp.com/dapp/',
    android: 'https://rnbwapp.com/dapp/',
    universal: 'https://rnbwapp.com/dapp/'
  }
};

// Función para generar deep link
export const generateMobileDeepLink = (walletKey: keyof typeof mobileWalletDeepLinks, dappUrl: string): string => {
  const wallet = mobileWalletDeepLinks[walletKey];
  if (!wallet) return dappUrl;
  
  const platform = isIOS() ? 'ios' : isAndroid() ? 'android' : 'universal';
  return wallet[platform] + encodeURIComponent(dappUrl);
};

// Función para abrir wallet móvil
export const openMobileWallet = (walletKey: keyof typeof mobileWalletDeepLinks, dappUrl?: string): void => {
  if (typeof window === 'undefined') return;
  
  const currentUrl = dappUrl || window.location.href;
  const deepLink = generateMobileDeepLink(walletKey, currentUrl);
  
  // Intentar abrir el deep link
  window.open(deepLink, '_blank');
  
  // Fallback: redirigir después de un tiempo si no se abre la app
  setTimeout(() => {
    if (document.visibilityState === 'visible') {
      console.log(`No se pudo abrir ${mobileWalletDeepLinks[walletKey].name}`);
    }
  }, 3000);
};

// Configuración de eventos táctiles para móvil
export const mobileEventConfig = {
  touchStart: 'touchstart',
  touchEnd: 'touchend',
  touchMove: 'touchmove',
  click: 'click'
};

// Función para detectar soporte de vibración
export const supportsVibration = (): boolean => {
  return typeof navigator !== 'undefined' && 'vibrate' in navigator;
};

// Función para vibrar en móvil
export const vibrate = (pattern: number | number[] = 100): void => {
  if (supportsVibration() && isMobileDevice() && typeof navigator !== 'undefined') {
    (navigator as any).vibrate(pattern);
  }
};

// Configuración de UI para móvil
export const mobileUIConfig = {
  buttonHeight: '48px',
  fontSize: '16px',
  spacing: '16px',
  borderRadius: '12px',
  maxWidth: '100%',
  padding: '12px 16px'
};

// Función para detectar orientación
export const getOrientation = (): 'portrait' | 'landscape' => {
  if (typeof window === 'undefined') return 'portrait';
  
  return window.innerHeight > window.innerWidth ? 'portrait' : 'landscape';
};

// Función para detectar si está en pantalla completa
export const isFullscreen = (): boolean => {
  if (typeof document === 'undefined') return false;
  
  return !!(document.fullscreenElement || 
           (document as any).webkitFullscreenElement || 
           (document as any).mozFullScreenElement || 
           (document as any).msFullscreenElement);
};