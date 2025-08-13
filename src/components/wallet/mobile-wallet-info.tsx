'use client';

import React, { useState } from 'react';
import { useMobileWallet } from '@/hooks/useMobileWallet';
import { WalletDiagnosticHub } from './wallet-diagnostic-hub';
import { Download, ExternalLink, CheckCircle, AlertCircle, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MobileWalletInfoProps {
  className?: string;
}

const MobileWalletInfo: React.FC<MobileWalletInfoProps> = ({ className = '' }) => {
  const { isMobile, hasWalletApp, detectedWallets, canUseWalletConnect } = useMobileWallet();
  const [showDiagnostics, setShowDiagnostics] = useState(false);

  if (!isMobile) {
    return null;
  }

  // Si ya tiene wallets detectadas, mostrar información diferente
  if (hasWalletApp && detectedWallets.length > 0) {
    return (
      <div className={`bg-green-50 border border-green-200 rounded-lg p-4 ${className}`}>
        <div className="flex items-center gap-2 mb-3">
          <CheckCircle className="h-5 w-5 text-green-600" />
          <h3 className="font-semibold text-green-900">Wallets Detectadas</h3>
        </div>
        
        <p className="text-sm text-green-700 mb-3">
          ¡Perfecto! Hemos detectado las siguientes wallets en tu dispositivo:
        </p>
        
        <div className="grid gap-2 mb-4">
          {detectedWallets.map((wallet) => (
            <div key={wallet} className="flex items-center justify-between p-3 bg-white rounded-lg border border-green-100">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-gray-900">{wallet}</span>
              </div>
              <span className="text-xs text-green-600 font-medium">Disponible</span>
            </div>
          ))}
        </div>
        
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-xs text-blue-800 mb-2">
            <span className="font-medium">Siguiente paso:</span> Haz clic en &quot;Conectar con Wallet&quot; y selecciona tu wallet preferida en el modal que aparece.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowDiagnostics(!showDiagnostics)}
            className="w-full"
          >
            <Settings className="h-3 w-3 mr-1" />
            {showDiagnostics ? 'Ocultar' : 'Ver'} Diagnóstico
          </Button>
        </div>
        
        {showDiagnostics && (
          <div className="mt-3 space-y-4">
            <WalletDiagnosticHub />
          </div>
        )}
      </div>
    );
  }

  const mobileWallets = [
    {
      name: 'MetaMask',
      description: 'La wallet más popular para Ethereum',
      downloadUrl: {
        android: 'https://play.google.com/store/apps/details?id=io.metamask',
        ios: 'https://apps.apple.com/app/metamask/id1438144202'
      },
      icon: '🦊'
    },
    {
      name: 'Trust Wallet',
      description: 'Wallet segura y fácil de usar',
      downloadUrl: {
        android: 'https://play.google.com/store/apps/details?id=com.wallet.crypto.trustapp',
        ios: 'https://apps.apple.com/app/trust-crypto-bitcoin-wallet/id1288339409'
      },
      icon: '🛡️'
    },
    {
      name: 'Coinbase Wallet',
      description: 'Wallet oficial de Coinbase',
      downloadUrl: {
        android: 'https://play.google.com/store/apps/details?id=org.toshi',
        ios: 'https://apps.apple.com/app/coinbase-wallet/id1278383455'
      },
      icon: '🔵'
    },
    {
      name: 'Rainbow',
      description: 'Wallet moderna con gran diseño',
      downloadUrl: {
        android: 'https://play.google.com/store/apps/details?id=me.rainbow',
        ios: 'https://apps.apple.com/app/rainbow-ethereum-wallet/id1457119021'
      },
      icon: '🌈'
    }
  ];

  const detectPlatform = () => {
    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
    if (/android/i.test(userAgent)) {
      return 'android';
    }
    if (/iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream) {
      return 'ios';
    }
    return 'android'; // Default to Android
  };

  const platform = detectPlatform();

  return (
    <div className={`bg-orange-50 border border-orange-200 rounded-lg p-4 ${className}`}>
      <div className="flex items-center gap-2 mb-3">
        <AlertCircle className="h-5 w-5 text-orange-600" />
        <h3 className="font-semibold text-orange-900">No se detectaron Wallets</h3>
      </div>
      
      <p className="text-sm text-orange-700 mb-4">
        Para conectar tu wallet desde el móvil, necesitas instalar una de estas aplicaciones:
      </p>
      
      <div className="space-y-3">
        {mobileWallets.map((wallet) => (
          <div key={wallet.name} className="flex items-center justify-between bg-white rounded-lg p-3 border border-blue-100">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{wallet.icon}</span>
              <div>
                <h4 className="font-medium text-gray-900">{wallet.name}</h4>
                <p className="text-xs text-gray-600">{wallet.description}</p>
              </div>
            </div>
            
            <a
              href={wallet.downloadUrl[platform as keyof typeof wallet.downloadUrl]}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1.5 rounded-md text-xs font-medium hover:bg-blue-700 transition-colors"
            >
              <Download className="h-3 w-3" />
              Instalar
            </a>
          </div>
        ))}
      </div>
      
      <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
        <div className="flex items-start gap-2">
          <span className="text-yellow-600 mt-0.5">⚠️</span>
          <div className="text-xs text-yellow-800">
            <p className="font-medium mb-1">Instrucciones para conectar:</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>Instala una de las wallets recomendadas</li>
              <li>Crea o importa tu wallet</li>
              <li><strong>Opción 1:</strong> Abre esta página desde el navegador de tu wallet</li>
              <li><strong>Opción 2:</strong> Usa WalletConnect desde cualquier navegador</li>
              <li>Haz clic en &quot;Conectar Wallet&quot; y sigue las instrucciones</li>
            </ol>
            <div className="mt-3">
              <a 
                href="/mobile-wallet-debug" 
                className="inline-flex items-center gap-1 text-xs text-blue-700 hover:text-blue-900 underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                🔧 Herramientas de diagnóstico móvil
              </a>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-3">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowDiagnostics(!showDiagnostics)}
          className="w-full"
        >
          <Settings className="h-3 w-3 mr-1" />
          {showDiagnostics ? 'Ocultar' : 'Ver'} Diagnóstico Avanzado
        </Button>
      </div>
      
      {showDiagnostics && (
        <div className="mt-3 space-y-4">
          <WalletDiagnosticHub />
        </div>
      )}
      
      <div className="mt-3 text-center">
        <a
          href="https://ethereum.org/en/wallets/find-wallet/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800"
        >
          <ExternalLink className="h-3 w-3" />
          Ver más wallets compatibles
        </a>
      </div>
    </div>
  );
};

export { MobileWalletInfo };
export default MobileWalletInfo;