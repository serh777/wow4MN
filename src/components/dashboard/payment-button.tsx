'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { useContract } from '@/hooks/use-contract';
import { useToast } from '@/components/ui/use-toast';
import { IconWrapper } from '@/components/ui/icon-wrapper';

interface PaymentButtonProps {
  toolNames: string[];
  onSuccess?: (transactionHash: string) => void;
  onError?: (error: string) => void;
  variant?: 'primary' | 'outline' | 'secondary' | 'ghost' | 'link' | 'destructive' | 'accent';
  size?: 'md' | 'sm' | 'lg' | 'icon';
  className?: string;
  disabled?: boolean;
  showPrice?: boolean;
}

export function PaymentButton({
  toolNames,
  onSuccess,
  onError,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  showPrice = true
}: PaymentButtonProps) {
  const { isInitialized, initialize, getToolsPrice, payForTools, isToolSupported } = useContract();
  const { toast } = useToast();
  
  const [isLoading, setIsLoading] = useState(false);
  const [price, setPrice] = useState<string | null>(null);
  const [isDiscounted, setIsDiscounted] = useState(false);
  const [originalPrice, setOriginalPrice] = useState<string | null>(null);
  
  // Verificar si todas las herramientas están soportadas
  const allToolsSupported = toolNames.every(tool => isToolSupported(tool));

  // Obtener el precio actualizado
  const fetchPrice = useCallback(async () => {
    if (!isInitialized) {
      await initialize();
    }
    
    if (toolNames.length === 0) {
      setPrice(null);
      return;
    }
    
    const priceInfo = await getToolsPrice(toolNames);
    if (priceInfo) {
      setPrice(priceInfo.formattedFinalPrice);
      setOriginalPrice(priceInfo.formattedTotalPrice);
      setIsDiscounted(priceInfo.isCompleteAuditOffer);
    }
  }, [isInitialized, initialize, toolNames, getToolsPrice]);

  // Obtener el precio al cargar el componente
  useEffect(() => {
    if (toolNames.length > 0 && allToolsSupported) {
      fetchPrice();
    }
  }, [toolNames, allToolsSupported, fetchPrice]);

  // Manejar el pago
  const handlePayment = async () => {
    if (!isInitialized) {
      const success = await initialize();
      if (!success) {
        toast({
          title: 'Error de conexión',
          description: 'No se pudo conectar con la wallet. Por favor, verifica que MetaMask esté instalado y conectado.',
          variant: 'destructive'
        });
        onError?.('Error de conexión a la wallet');
        return;
      }
    }
    
    setIsLoading(true);
    
    try {
      const result = await payForTools(toolNames);
      
      if (result.success && result.transactionHash) {
        toast({
          title: 'Pago exitoso',
          description: `Transacción completada: ${result.transactionHash.substring(0, 10)}...`,
          variant: 'default'
        });
        onSuccess?.(result.transactionHash);
      } else {
        toast({
          title: 'Error en el pago',
          description: result.error || 'Hubo un error al procesar el pago',
          variant: 'destructive'
        });
        onError?.(result.error || 'Error desconocido');
      }
    } catch (error: any) {
      toast({
        title: 'Error en el pago',
        description: error.message || 'Hubo un error al procesar el pago',
        variant: 'destructive'
      });
      onError?.(error.message || 'Error desconocido');
    } finally {
      setIsLoading(false);
    }
  };

  // Si no hay herramientas o no están soportadas, deshabilitar el botón
  const isButtonDisabled = disabled || !allToolsSupported || toolNames.length === 0;

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      disabled={isButtonDisabled}
      onClick={handlePayment}
    >
      {isLoading ? (
        <>
          <IconWrapper icon="loading" className="mr-2 h-4 w-4 animate-spin" />
          Procesando...
        </>
      ) : (
        <>
          <IconWrapper icon="wallet" className="mr-2 h-4 w-4" />
          {showPrice && price ? (
            <>
              Pagar {isDiscounted && originalPrice ? (
                <span>
                  <span className="line-through text-muted-foreground mr-1">{originalPrice}</span>
                  {price}
                </span>
              ) : price}
            </>
          ) : (
            'Pagar'
          )}
        </>
      )}
    </Button>
  );
}