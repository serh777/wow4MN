'use client';

import { useState, useEffect, useCallback } from 'react';
import { isMobileDevice } from '@/config/wallet/mobile';

interface ReownConfig {
  enableInjected: boolean;
  enableEIP6963: boolean;
  connectionTimeout: number;
  retryAttempts: number;
  enableDeepLinks: boolean;
  enableQRCode: boolean;
  enableWalletConnect: boolean;
  projectId: string;
  metadata: {
    name: string;
    description: string;
    url: string;
    icons: string[];
  };
}

interface MobileWalletDetection {
  hasMetaMask: boolean;
  hasTrustWallet: boolean;
  hasCoinbaseWallet: boolean;
  hasRainbow: boolean;
  hasUnstoppableDomains: boolean;
  hasGenericWallet: boolean;
  totalDetected: number;
  detectedWallets: string[];
}

const DEFAULT_CONFIG: ReownConfig = {
  enableInjected: true,
  enableEIP6963: true,
  connectionTimeout: 30000,
  retryAttempts: 3,
  enableDeepLinks: true,
  enableQRCode: true,
  enableWalletConnect: true,
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '',
  metadata: {
    name: 'WOW4 DApp',
    description: 'Web3 Application with Advanced Mobile Support',
    url: typeof window !== 'undefined' ? window.location.origin : '',
    icons: ['/favicon.ico']
  }
};

export function useReownConfig() {
  const [config, setConfig] = useState<ReownConfig>(DEFAULT_CONFIG);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  // Cargar configuración guardada
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedConfig = localStorage.getItem('reown-mobile-config');
      if (savedConfig) {
        try {
          const parsed = JSON.parse(savedConfig);
          setConfig(prev => ({ ...prev, ...parsed }));
          setLastUpdate(new Date(localStorage.getItem('reown-config-timestamp') || Date.now()));
        } catch (error) {
          console.warn('Error loading saved Reown config:', error);
        }
      }
    }
  }, []);

  // Detectar wallets móviles con configuración actual
  const detectMobileWallets = useCallback((): MobileWalletDetection => {
    if (typeof window === 'undefined' || !isMobileDevice()) {
      return {
        hasMetaMask: false,
        hasTrustWallet: false,
        hasCoinbaseWallet: false,
        hasRainbow: false,
        hasUnstoppableDomains: false,
        hasGenericWallet: false,
        totalDetected: 0,
        detectedWallets: []
      };
    }

    const ethereum = (window as any).ethereum;
    const detectedWallets: string[] = [];
    
    let hasMetaMask = false;
    let hasTrustWallet = false;
    let hasCoinbaseWallet = false;
    let hasRainbow = false;
    let hasUnstoppableDomains = false;
    let hasGenericWallet = false;

    if (ethereum) {
      // Detección mejorada para MetaMask
      if (ethereum.isMetaMask || ethereum._metamask) {
        hasMetaMask = true;
        detectedWallets.push('MetaMask');
      }
      
      // Trust Wallet
      if (ethereum.isTrust || ethereum.trustWallet) {
        hasTrustWallet = true;
        detectedWallets.push('Trust Wallet');
      }
      
      // Coinbase Wallet
      if (ethereum.isCoinbaseWallet || ethereum.selectedProvider?.isCoinbaseWallet) {
        hasCoinbaseWallet = true;
        detectedWallets.push('Coinbase Wallet');
      }
      
      // Rainbow
      if (ethereum.isRainbow) {
        hasRainbow = true;
        detectedWallets.push('Rainbow');
      }
      
      // Unstoppable Domains
      if (ethereum.isUnstoppableDomains || /unstoppable/i.test(navigator.userAgent)) {
        hasUnstoppableDomains = true;
        detectedWallets.push('Unstoppable Domains');
      }
      
      // Wallet genérica si no se detectó ninguna específica
      if (detectedWallets.length === 0 && ethereum) {
        hasGenericWallet = true;
        detectedWallets.push('Ethereum Wallet');
      }
    }

    // Detección adicional por User Agent
    const userAgent = navigator.userAgent.toLowerCase();
    
    if (/metamask/i.test(userAgent) && !hasMetaMask) {
      hasMetaMask = true;
      detectedWallets.push('MetaMask (UA)');
    }
    
    if (/trust/i.test(userAgent) && !hasTrustWallet) {
      hasTrustWallet = true;
      detectedWallets.push('Trust Wallet (UA)');
    }
    
    if (/coinbase/i.test(userAgent) && !hasCoinbaseWallet) {
      hasCoinbaseWallet = true;
      detectedWallets.push('Coinbase Wallet (UA)');
    }

    return {
      hasMetaMask,
      hasTrustWallet,
      hasCoinbaseWallet,
      hasRainbow,
      hasUnstoppableDomains,
      hasGenericWallet,
      totalDetected: detectedWallets.length,
      detectedWallets
    };
  }, []);

  // Guardar configuración
  const saveConfig = useCallback((newConfig: Partial<ReownConfig>) => {
    const updatedConfig = { ...config, ...newConfig };
    setConfig(updatedConfig);
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('reown-mobile-config', JSON.stringify(updatedConfig));
      localStorage.setItem('reown-config-timestamp', new Date().toISOString());
      setLastUpdate(new Date());
    }
  }, [config]);

  // Resetear configuración
  const resetConfig = useCallback(() => {
    setConfig(DEFAULT_CONFIG);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('reown-mobile-config');
      localStorage.removeItem('reown-config-timestamp');
      setLastUpdate(null);
    }
  }, []);

  // Aplicar configuración dinámicamente
  const applyConfig = useCallback(async () => {
    setIsLoading(true);
    
    try {
      // Aquí se podría reinicializar Reown/WalletConnect con la nueva configuración
      // Por ahora, solo guardamos la configuración
      if (typeof window !== 'undefined') {
        // Disparar evento personalizado para que otros componentes se actualicen
        window.dispatchEvent(new CustomEvent('reown-config-updated', { 
          detail: config 
        }));
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simular aplicación
    } catch (error) {
      console.error('Error applying Reown config:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [config]);

  // Probar conectividad
  const testConnectivity = useCallback(async () => {
    setIsLoading(true);
    
    const results = {
      timestamp: new Date().toISOString(),
      config: config,
      detection: detectMobileWallets(),
      device: {
        isMobile: isMobileDevice(),
        userAgent: navigator.userAgent,
        online: navigator.onLine
      },
      ethereum: {
        available: typeof window !== 'undefined' && typeof (window as any).ethereum !== 'undefined',
        providers: typeof window !== 'undefined' ? Object.keys((window as any).ethereum || {}) : []
      }
    };
    
    setIsLoading(false);
    return results;
  }, [config, detectMobileWallets]);

  // Obtener configuración optimizada para móvil
  const getMobileOptimizedConfig = useCallback(() => {
    if (!isMobileDevice()) {
      return config;
    }

    return {
      ...config,
      // Configuraciones específicas para móvil
      enableInjected: true, // Siempre habilitado en móvil
      enableEIP6963: true,  // Importante para detección moderna
      connectionTimeout: Math.max(config.connectionTimeout, 30000), // Timeout mínimo para móvil
      enableDeepLinks: true, // Esencial para móvil
      retryAttempts: Math.max(config.retryAttempts, 3) // Más intentos en móvil
    };
  }, [config]);

  return {
    config,
    isLoading,
    lastUpdate,
    saveConfig,
    resetConfig,
    applyConfig,
    testConnectivity,
    detectMobileWallets,
    getMobileOptimizedConfig,
    isMobile: isMobileDevice()
  };
}

export type { ReownConfig, MobileWalletDetection };