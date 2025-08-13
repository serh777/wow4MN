'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { X, Heart, Copy, Check } from 'lucide-react';

interface DevelopmentPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DevelopmentPopup({ isOpen, onClose }: DevelopmentPopupProps) {
  const [copiedNetwork, setCopiedNetwork] = useState<string | null>(null);
  const walletAddress = '0x22A8CaCaD8d3C88EBf76B6AC378448F7197A0364';

  const networks = [
    { name: 'Ethereum', symbol: 'ETH', color: 'bg-blue-500' },
    { name: 'Optimism', symbol: 'OP', color: 'bg-red-500' },
    { name: 'Arbitrum', symbol: 'ARB', color: 'bg-blue-600' },
    { name: 'Avalanche', symbol: 'AVAX', color: 'bg-red-600' },
    { name: 'Binance Smart Chain', symbol: 'BNB', color: 'bg-yellow-500' },
    { name: 'Solana', symbol: 'SOL', color: 'bg-purple-500' }
  ];

  const copyToClipboard = async (network: string) => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(walletAddress);
      }
      setCopiedNetwork(network);
      setTimeout(() => setCopiedNetwork(null), 2000);
    } catch (err) {
      console.error('Error al copiar:', err);
    }
  };

  useEffect(() => {
      if (typeof document === 'undefined') return;

      if (isOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = 'unset';
      }
      return () => {
        document.body.style.overflow = 'unset';
      };
    }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm" 
        onClick={onClose}
      />
      
      {/* Modal */}
      <Card className="relative w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse" />
              <CardTitle className="text-lg">Proyecto en Desarrollo</CardTitle>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <CardDescription>
            Las herramientas SEO están actualmente en modo ficticio para demostración. La integración con wallets está completamente funcional y próximamente se activarán todas las funcionalidades SEO reales.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Estado del desarrollo */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm">Estado Actual:</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span>Integración con wallets (100% funcional)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                <span>Herramientas SEO (modo demo - próximamente reales)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full" />
                <span>Análisis avanzado de blockchain (en desarrollo)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                <span>Indexador de datos Web3 (implementándose)</span>
              </div>
            </div>
            <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-xs text-blue-700 dark:text-blue-300">
                💡 <strong>Nota importante:</strong> Las herramientas SEO actualmente muestran datos ficticios para demostración. Estamos trabajando en la integración con APIs reales para proporcionar análisis SEO auténticos muy pronto.
              </p>
            </div>
          </div>

          {/* Sección de donaciones */}
          <div className="border-t pt-6">
            <div className="flex items-center gap-2 mb-4">
              <Heart className="h-4 w-4 text-red-500" />
              <h3 className="font-semibold text-sm">¿Te gusta el proyecto?</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Si encuentras útil este proyecto y quieres apoyar su desarrollo, puedes hacer una donación a través de cualquiera de estas redes:
            </p>
            
            {/* Dirección de wallet */}
            <div className="bg-muted p-3 rounded-lg mb-4">
              <p className="text-xs text-muted-foreground mb-1">Dirección de wallet:</p>
              <p className="font-mono text-xs break-all">{walletAddress}</p>
            </div>

            {/* Redes disponibles */}
            <div className="grid grid-cols-2 gap-2">
              {networks.map((network) => (
                <Button
                  key={network.name}
                  variant="outline"
                  size="sm"
                  className="justify-between h-auto p-3"
                  onClick={() => copyToClipboard(network.name)}
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${network.color}`} />
                    <div className="text-left">
                      <div className="text-xs font-medium">{network.symbol}</div>
                      <div className="text-xs text-muted-foreground">{network.name}</div>
                    </div>
                  </div>
                  {copiedNetwork === network.name ? (
                    <Check className="h-3 w-3 text-green-500" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                </Button>
              ))}
            </div>
            
            <p className="text-xs text-muted-foreground mt-3 text-center">
              Haz clic en cualquier red para copiar la dirección
            </p>
          </div>

          {/* Botón de cerrar */}
          <div className="pt-4">
            <Button onClick={onClose} className="w-full">
              Entendido
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}