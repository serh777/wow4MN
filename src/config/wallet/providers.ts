/**
 * Configuración de proveedores de wallet
 */

import { createAppKit } from '@reown/appkit/react';
import { EthersAdapter } from '@reown/appkit-adapter-ethers';
import { supportedNetworks, defaultNetwork } from './networks';

// Función para obtener la URL base
const getBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  return 'https://wowseoweb3.com';
};

// Metadata de la aplicación
export const appMetadata = {
  name: 'WowSEOWeb3',
  description: 'Herramientas SEO para Web3',
  url: getBaseUrl(),
  icons: [`${getBaseUrl()}/favicon.svg`]
};

// Configuración del adaptador de Ethers
export const ethersAdapter = new EthersAdapter();

// IDs de wallets móviles priorizadas
export const mobileWalletIds = [
  'c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96', // MetaMask
  '4622a2b2d6af1c9844944291e5e7351a6aa24cd7b23099efac1b2fd875da31a0', // Trust Wallet
  'fd20dc426fb37566d803205b19bbc1d4096b248ac04548e3cfb6b3a38bd033aa', // Coinbase Wallet
  '1ae92b26df02f0abca6304df07debccd18262fdf5fe82daa81593582dac9a369', // Rainbow
  'bc949c5d968ae81310268bf9193f9c9fb7bb4e1283e1284af8f2bd4992535fd6', // Zerion
  '19177a98252e07ddfc9af2083ba8e07ef627cb6103467ffebb3f8f4205fd7927'  // Ledger Live
];

// Configuración base de AppKit
export const baseAppKitConfig = {
  adapters: [ethersAdapter],
  networks: supportedNetworks as [any, ...any[]],
  defaultNetwork,
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || process.env.NEXT_PUBLIC_REOWN_API_KEY || '14d3760d5b3c4a8b416b23e1018b60bc',
  metadata: appMetadata,
  features: {
    analytics: false, // Disable analytics if no valid project ID
    email: false,
    socials: []
  }
};

// Configuración específica para escritorio
export const desktopConfig = {
  ...baseAppKitConfig,
  enableInjected: true,
  enableEIP6963: true,
  enableCoinbase: true,
  enableNetworkView: true,
  enableExplorer: true
};

// Configuración específica para móvil
export const mobileConfig = {
  ...baseAppKitConfig,
  enableInjected: true,
  enableEIP6963: true,
  enableCoinbase: true,
  enableNetworkView: false,
  enableExplorer: false,
  mobileWalletIds,
  connectionTimeout: 30000, // 30 segundos para móvil
  retryAttempts: 3
};

// Variable global para AppKit
let appKit: any = null;

// Función para inicializar AppKit
export const initializeAppKit = () => {
  if (typeof window === 'undefined') {
    console.warn('AppKit: No se puede inicializar en el servidor');
    return null;
  }

  if (appKit) {
    console.log('AppKit: Ya está inicializado');
    return appKit;
  }

  try {
    const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || process.env.NEXT_PUBLIC_REOWN_API_KEY || '717c912a-af06-42ea-817e-06d64c964a69';
    
    if (!projectId || projectId === '717c912a-af06-42ea-817e-06d64c964a69') {
      console.warn('AppKit: Usando PROJECT_ID de desarrollo. Configura NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID para producción.');
    }

    // Detectar si es móvil
    const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
      navigator.userAgent.toLowerCase()
    );

    const config = isMobile ? mobileConfig : desktopConfig;
    
    console.log('AppKit: Inicializando con configuración:', isMobile ? 'móvil' : 'escritorio');
    
    appKit = createAppKit(config);
    
    console.log('AppKit: Inicializado correctamente');
    return appKit;
  } catch (error) {
    console.error('AppKit: Error durante la inicialización:', error);
    return null;
  }
};

// Función para obtener la instancia de AppKit
export const getAppKit = () => {
  if (!appKit) {
    return initializeAppKit();
  }
  return appKit;
};

// Función para limpiar AppKit
export const cleanupAppKit = () => {
  if (appKit) {
    try {
      // Limpiar listeners si existen
      if (typeof appKit.disconnect === 'function') {
        appKit.disconnect();
      }
    } catch (error) {
      console.warn('AppKit: Error durante la limpieza:', error);
    } finally {
      appKit = null;
    }
  }
};

// Configuración de Web3Modal (legacy)
export const web3ModalConfig = {
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || process.env.NEXT_PUBLIC_REOWN_API_KEY || ''
};