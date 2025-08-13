'use client';

import { useState, useEffect, useCallback } from 'react';
import { isMobileDevice } from '@/config/wallet';

export interface MobileWalletDetection {
  isMobile: boolean;
  hasWalletApp: boolean;
  detectedWallets: string[];
  canUseWalletConnect: boolean;
  detectUserAgent: () => { hasWallet: boolean; walletName: string | null; isDAppBrowser: boolean; };
}

export const useMobileWallet = (): MobileWalletDetection => {
  const [detection, setDetection] = useState<MobileWalletDetection>({
    isMobile: false,
    hasWalletApp: false,
    detectedWallets: [],
    canUseWalletConnect: false,
    detectUserAgent: () => ({ hasWallet: false, walletName: null, isDAppBrowser: false })
  });

  // Detectar wallets instaladas - MEJORADO para móvil
  const detectInstalledWallets = useCallback(() => {
    if (typeof window === 'undefined') return [];
    
    const detected: string[] = [];
    
    // Verificar múltiples proveedores Ethereum (EIP-6963)
    if ((window as any).ethereum?.providers && Array.isArray((window as any).ethereum.providers)) {
      (window as any).ethereum.providers.forEach((provider: any) => {
        if (provider.isMetaMask && !detected.includes('MetaMask')) {
          detected.push('MetaMask');
        } else if (provider.isTrust && !detected.includes('Trust Wallet')) {
          detected.push('Trust Wallet');
        } else if (provider.isCoinbaseWallet && !detected.includes('Coinbase Wallet')) {
          detected.push('Coinbase Wallet');
        } else if (provider.isRainbow && !detected.includes('Rainbow')) {
          detected.push('Rainbow');
        }
      });
    }
    
    // Verificar proveedor principal si no hay múltiples
    if ((window as any).ethereum && detected.length === 0) {
      if ((window as any).ethereum.isMetaMask) {
        detected.push('MetaMask');
      } else if ((window as any).ethereum.isTrust || (window as any).trustWallet) {
        detected.push('Trust Wallet');
      } else if ((window as any).ethereum.isCoinbaseWallet || (window as any).ethereum.isCoinbaseBrowser) {
        detected.push('Coinbase Wallet');
      } else if ((window as any).ethereum.isRainbow) {
        detected.push('Rainbow');
      } else if ((window as any).ethereum.isZerion) {
        detected.push('Zerion');
      }
    }
    
    // Verificaciones adicionales para wallets específicas
    if ((window as any).coinbaseWalletExtension && !detected.includes('Coinbase Wallet')) {
      detected.push('Coinbase Wallet');
    }
    
    if ((window as any).trustWallet && !detected.includes('Trust Wallet')) {
      detected.push('Trust Wallet');
    }
    
    // Verificar si hay un proveedor genérico sin identificar
    if ((window as any).ethereum && detected.length === 0) {
      // Si hay ethereum pero no se identificó ninguna wallet específica
      detected.push('Ethereum Wallet');
    }
    
    return detected;
  }, []);

  // Detectar información del User Agent - MEJORADO
  const detectUserAgent = useCallback(() => {
    if (typeof window === 'undefined') return { hasWallet: false, walletName: null, isDAppBrowser: false };
    
    const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent.toLowerCase() : '';
    
    // Detectar wallets específicas en el User Agent con patrones más amplios
    const walletPatterns = [
      { pattern: /metamask/i, name: 'MetaMask' },
      { pattern: /trust.*wallet|trustwallet/i, name: 'Trust Wallet' },
      { pattern: /coinbase.*wallet|coinbasewallet/i, name: 'Coinbase Wallet' },
      { pattern: /rainbow/i, name: 'Rainbow' },
      { pattern: /zerion/i, name: 'Zerion' },
      { pattern: /ledger.*live|ledgerlive/i, name: 'Ledger Live' },
      { pattern: /unstoppable.*domains|unstoppabledomains/i, name: 'Unstoppable Domains' },
      { pattern: /1inch.*wallet|1inchwallet/i, name: '1inch Wallet' },
      { pattern: /argent/i, name: 'Argent' },
      { pattern: /exodus/i, name: 'Exodus' },
      { pattern: /phantom/i, name: 'Phantom' },
      // Patrones adicionales para navegadores de wallets
      { pattern: /dapp.*browser|dappbrowser/i, name: 'DApp Browser' },
      { pattern: /web3.*browser|web3browser/i, name: 'Web3 Browser' },
      { pattern: /wallet.*browser|walletbrowser/i, name: 'Wallet Browser' },
      // Patrones para detectar navegadores integrados
      { pattern: /wv\)|.*webview.*|.*inapp.*/i, name: 'In-App Browser' }
    ];
    
    // Detectar si es un DApp Browser
    const isDAppBrowser = /dapp.*browser|dappbrowser|web3.*browser|web3browser|wallet.*browser|walletbrowser/i.test(userAgent) ||
                         /wv\)|.*webview.*|.*inapp.*/i.test(userAgent) ||
                         !!(window as any).ethereum;
    
    for (const { pattern, name } of walletPatterns) {
      if (pattern.test(userAgent)) {
        return { hasWallet: true, walletName: name, isDAppBrowser };
      }
    }
    
    // Verificar si estamos en un navegador móvil con capacidades Web3
    const isMobileBrowser = /android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
    if (isMobileBrowser && (window as any).ethereum) {
      return { hasWallet: true, walletName: 'Mobile Web3 Browser', isDAppBrowser: true };
    }
    
    // Detectar si estamos en un WebView (común en apps de wallets)
    if (/wv\)|.*webview.*|.*inapp.*/i.test(userAgent) && (window as any).ethereum) {
      return { hasWallet: true, walletName: 'Wallet WebView', isDAppBrowser: true };
    }
    
    return { hasWallet: false, walletName: null, isDAppBrowser };
  }, []);

  const detectMobileWallets = useCallback(() => {
    if (typeof window === 'undefined') {
      return {
        isMobile: false,
        hasWalletApp: false,
        detectedWallets: [],
        canUseWalletConnect: false,
        detectUserAgent: () => ({ hasWallet: false, walletName: null, isDAppBrowser: false })
      };
    }

    const isMobile = isMobileDevice();
    const installedWallets = detectInstalledWallets();
    const userAgentInfo = detectUserAgent();
    let detectedWallets: string[] = [...installedWallets];
    let hasWalletApp = installedWallets.length > 0;

    // Detectar wallets específicas en móvil
    if (isMobile) {
      // Agregar wallet detectada por user agent si no está ya en la lista
      if (userAgentInfo.hasWallet && userAgentInfo.walletName && !detectedWallets.includes(userAgentInfo.walletName)) {
        detectedWallets.push(userAgentInfo.walletName);
        hasWalletApp = true;
      }
      
      // Verificar si el navegador soporta deep links (para WalletConnect)
      const canUseWalletConnect = true; // WalletConnect siempre disponible en móvil
      
      return {
        isMobile,
        hasWalletApp,
        detectedWallets,
        canUseWalletConnect,
        detectUserAgent
      };
    }

    // Para desktop
    if ((window as any).ethereum && !hasWalletApp) {
      hasWalletApp = true;
      if (detectedWallets.length === 0) {
        detectedWallets.push('Ethereum Wallet');
      }
    }

    return {
      isMobile,
      hasWalletApp,
      detectedWallets,
      canUseWalletConnect: false, // Desktop no necesita WalletConnect
      detectUserAgent
    };
  }, [detectInstalledWallets, detectUserAgent]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Detectar wallets al montar el componente
    const initialDetection = detectMobileWallets();
    setDetection({ ...initialDetection, detectUserAgent });

    // Redetectar cuando cambie el tamaño de la ventana
    const handleResize = () => {
      const newDetection = detectMobileWallets();
      setDetection({ ...newDetection, detectUserAgent });
    };

    // Redetectar cuando se inyecten nuevos proveedores
    const handleEthereumChange = () => {
      setTimeout(() => {
        const newDetection = detectMobileWallets();
        setDetection({ ...newDetection, detectUserAgent });
      }, 100);
    };

    window.addEventListener('resize', handleResize);
    
    // Escuchar cambios en ethereum
    if ((window as any).ethereum) {
      (window as any).ethereum.on('connect', handleEthereumChange);
      (window as any).ethereum.on('disconnect', handleEthereumChange);
    }

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if ((window as any).ethereum) {
        (window as any).ethereum.removeListener('connect', handleEthereumChange);
        (window as any).ethereum.removeListener('disconnect', handleEthereumChange);
      }
    };
  }, [detectMobileWallets]);

  return {
    ...detection,
    detectUserAgent
  };
};

export default useMobileWallet;