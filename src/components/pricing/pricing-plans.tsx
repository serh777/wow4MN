'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { IconWrapper } from '@/components/ui/icon-wrapper';
import { useContract } from '@/hooks/use-contract';
import { useToast } from '@/components/ui/use-toast';
import { PRICING_PLANS } from '@/config/contract-config';
import { WalletDiagnosticHub } from '@/components/wallet/wallet-diagnostic-hub';
import { Web3Help } from './web3-help';
import { AlertTriangle, Settings } from 'lucide-react';
import Link from 'next/link';

interface PricingPlanProps {
  onPurchase?: (planName: string, transactionHash: string) => void;
}

export function PricingPlans({ onPurchase }: PricingPlanProps) {
  const { isInitialized, initialize, getToolsPrice, payForTools, error } = useContract();
  const { toast } = useToast();
  
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [planPrices, setPlanPrices] = useState<Record<string, { price: string, originalPrice: string | null }>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showDiagnostics, setShowDiagnostics] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [initializationAttempted, setInitializationAttempted] = useState(false);

  // Obtener los precios actualizados de los planes
  const fetchPlanPrices = useCallback(async () => {
    setIsLoading(true);
    try {
      // Intentar inicializar si no está inicializado
      if (!isInitialized && !initializationAttempted) {
        setInitializationAttempted(true);
        const initialized = await initialize();
        if (!initialized) {
          toast({
          title: 'Error de conexión Web3',
          description: 'No se pudo conectar con Web3. Asegúrate de que MetaMask esté instalado, desbloqueado y conectado a una red soportada (Ethereum, Polygon, BSC, Avalanche).',
          variant: 'destructive'
        });
        setShowDiagnostics(true); // Mostrar diagnóstico automáticamente
          return;
        }
      }
      
      const prices: Record<string, { price: string, originalPrice: string | null }> = {};
      
      // Obtener precio para cada plan
      for (const [planKey, plan] of Object.entries(PRICING_PLANS)) {
        try {
          const priceInfo = await getToolsPrice(plan.tools);
          if (priceInfo) {
            prices[planKey] = {
              price: priceInfo.formattedFinalPrice,
              originalPrice: priceInfo.isCompleteAuditOffer ? priceInfo.formattedTotalPrice : null
            };
          } else {
            console.warn(`No se pudo obtener precio para el plan ${planKey}`);
          }
        } catch (error) {
          console.error(`Error al obtener precio para el plan ${planKey}:`, error);
        }
      }
      
      setPlanPrices(prices);
      
      if (Object.keys(prices).length === 0) {
        toast({
          title: 'Advertencia',
          description: 'No se pudieron cargar los precios. Verifica tu conexión Web3 y que MetaMask esté conectado a una red soportada (Ethereum, Polygon, BSC, Avalanche).',
          variant: 'destructive'
        });
        setShowDiagnostics(true); // Mostrar automáticamente el diagnóstico
      }
    } catch (error) {
      console.error('Error fetching plan prices:', error);
      toast({
        title: 'Error',
        description: 'Error al obtener precios de los planes',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  }, [isInitialized, initializationAttempted, initialize, getToolsPrice, toast]);

  // Obtener los precios de los planes al cargar el componente
  useEffect(() => {
    fetchPlanPrices();
  }, [fetchPlanPrices]);

  // Manejar la compra de un plan
  const handlePurchase = async (planKey: string) => {
    if (!isInitialized) {
      const success = await initialize();
      if (!success) {
        toast({
          title: 'Error de conexión',
          description: 'No se pudo conectar con la wallet. Por favor, verifica que MetaMask esté instalado y conectado.',
          variant: 'destructive'
        });
        return;
      }
    }
    
    setLoadingPlan(planKey);
    
    try {
      const plan = PRICING_PLANS[planKey as keyof typeof PRICING_PLANS];
      const result = await payForTools(plan.tools);
      
      if (result.success && result.transactionHash) {
        toast({
          title: 'Compra exitosa',
          description: `Has adquirido el plan ${plan.name}. Transacción: ${result.transactionHash.substring(0, 10)}...`,
          variant: 'default'
        });
        onPurchase?.(plan.name, result.transactionHash);
      } else {
        toast({
          title: 'Error en la compra',
          description: result.error || 'Hubo un error al procesar la compra',
          variant: 'destructive'
        });
      }
    } catch (error: any) {
      toast({
        title: 'Error en la compra',
        description: error.message || 'Hubo un error al procesar la compra',
        variant: 'destructive'
      });
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Mostrar errores de Web3 */}
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>Error de Web3: {error}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDiagnostics(!showDiagnostics)}
            >
              <Settings className="h-4 w-4 mr-2" />
              Diagnóstico
            </Button>
          </AlertDescription>
        </Alert>
      )}
      
      {/* Ayuda Web3 */}
      {showHelp && (
        <Web3Help onClose={() => setShowHelp(false)} />
      )}
      
      {/* Componente de diagnóstico */}
      {showDiagnostics && (
        <WalletDiagnosticHub />
      )}
      
      {/* Estado de carga */}
      {isLoading && (
        <Alert>
          <AlertDescription className="flex items-center gap-2">
            <IconWrapper icon="loading" className="h-4 w-4 animate-spin" />
            Conectando con Web3 y cargando precios de los planes...
          </AlertDescription>
        </Alert>
      )}
      
      {/* Mensaje informativo si no hay precios cargados */}
       {!isLoading && Object.keys(planPrices).length === 0 && (
         <Alert variant="destructive">
           <AlertTriangle className="h-4 w-4" />
           <AlertDescription>
             <div className="flex items-center justify-between mb-3">
               <span>No se pudieron cargar los precios. Verifica tu conexión Web3.</span>
             </div>
             <div className="flex gap-2 flex-wrap">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={fetchPlanPrices}
                  disabled={isLoading}
                >
                  <IconWrapper icon="refresh" className="h-4 w-4 mr-2" />
                  Reintentar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowHelp(!showHelp)}
                >
                  <IconWrapper icon="help" className="h-4 w-4 mr-2" />
                  Ayuda
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowDiagnostics(!showDiagnostics)}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Diagnóstico
                </Button>
              </div>
           </AlertDescription>
         </Alert>
       )}
      
      <div className="grid md:grid-cols-3 gap-8">
      {/* Plan Pago por Uso */}
      <Card className="relative border-primary">
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
          Recomendado
        </div>
        <CardHeader>
          <CardTitle>Pago por Uso</CardTitle>
          <CardDescription>Paga solo por lo que necesitas</CardDescription>
          <div className="mt-4">
            {planPrices.INDIVIDUAL_TOOLS ? (
              <>
                <span className="text-3xl font-bold">${planPrices.INDIVIDUAL_TOOLS.price}</span>
                <span className="text-muted-foreground">por herramienta</span>
              </>
            ) : (
              <span className="text-3xl font-bold">Desde $5</span>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3 mb-6">
            <li className="flex items-center gap-2">
              <IconWrapper icon="success" className="h-4 w-4 text-green-500" />
              <span>Paga solo por las herramientas que necesites</span>
            </li>
            <li className="flex items-center gap-2">
              <IconWrapper icon="success" className="h-4 w-4 text-green-500" />
              <span>Precios desde $5 por herramienta</span>
            </li>
            <li className="flex items-center gap-2">
              <IconWrapper icon="success" className="h-4 w-4 text-green-500" />
              <span>Acceso inmediato tras el pago</span>
            </li>
            <li className="flex items-center gap-2">
              <IconWrapper icon="success" className="h-4 w-4 text-green-500" />
              <span>Sin compromisos mensuales</span>
            </li>
            <li className="flex items-center gap-2">
              <IconWrapper icon="success" className="h-4 w-4 text-green-500" />
              <span>Soporte por email</span>
            </li>
          </ul>
          <Button 
            className="w-full" 
            onClick={() => handlePurchase('INDIVIDUAL_TOOLS')}
            disabled={loadingPlan !== null}
          >
            {loadingPlan === 'INDIVIDUAL_TOOLS' ? (
              <>
                <IconWrapper icon="loading" className="mr-2 h-4 w-4 animate-spin" />
                Procesando...
              </>
            ) : (
              'Seleccionar Herramientas'
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Plan Auditoría Completa */}
      <Card>
        <CardHeader>
          <CardTitle>Auditoría Completa</CardTitle>
          <CardDescription>Análisis completo con descuento</CardDescription>
          <div className="mt-4">
            {planPrices.COMPLETE_AUDIT ? (
              <>
                <span className="text-3xl font-bold">${planPrices.COMPLETE_AUDIT.price}</span>
                {planPrices.COMPLETE_AUDIT.originalPrice && (
                  <span className="text-sm line-through text-muted-foreground ml-2">
                    ${planPrices.COMPLETE_AUDIT.originalPrice}
                  </span>
                )}
                <span className="text-muted-foreground">por auditoría</span>
              </>
            ) : (
              <span className="text-3xl font-bold">$42.3</span>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3 mb-6">
            <li className="flex items-center gap-2">
              <IconWrapper icon="success" className="h-4 w-4 text-green-500" />
              <span>Acceso a todas las 9 herramientas</span>
            </li>
            <li className="flex items-center gap-2">
              <IconWrapper icon="success" className="h-4 w-4 text-green-500" />
              <span>Análisis completo de tu proyecto</span>
            </li>
            <li className="flex items-center gap-2">
              <IconWrapper icon="success" className="h-4 w-4 text-green-500" />
              <span>Descuento del 10% sobre el precio total</span>
            </li>
            <li className="flex items-center gap-2">
              <IconWrapper icon="success" className="h-4 w-4 text-green-500" />
              <span>Soporte prioritario</span>
            </li>
            <li className="flex items-center gap-2">
              <IconWrapper icon="success" className="h-4 w-4 text-green-500" />
              <span>Recomendaciones personalizadas</span>
            </li>
            <li className="flex items-center gap-2">
              <IconWrapper icon="success" className="h-4 w-4 text-green-500" />
              <span>Informe detallado de resultados</span>
            </li>
          </ul>
          <Button 
            className="w-full" 
            onClick={() => handlePurchase('COMPLETE_AUDIT')}
            disabled={loadingPlan !== null}
          >
            {loadingPlan === 'COMPLETE_AUDIT' ? (
              <>
                <IconWrapper icon="loading" className="mr-2 h-4 w-4 animate-spin" />
                Procesando...
              </>
            ) : (
              'Obtener Auditoría Completa'
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Herramienta Especial IA */}
      <Card className="relative">
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-500 to-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
          IA Avanzada
        </div>
        <CardHeader>
          <CardTitle>Herramienta IA Especial</CardTitle>
          <CardDescription>Análisis avanzado con IA especializada</CardDescription>
          <div className="mt-4">
            {planPrices.AI_SPECIAL_TOOL ? (
              <>
                <span className="text-3xl font-bold">${planPrices.AI_SPECIAL_TOOL.price}</span>
                <span className="text-muted-foreground">por uso</span>
              </>
            ) : (
              <span className="text-3xl font-bold">$7</span>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3 mb-6">
            <li className="flex items-center gap-2">
              <IconWrapper icon="success" className="h-4 w-4 text-green-500" />
              <span>Análisis profundo con IA especializada</span>
            </li>
            <li className="flex items-center gap-2">
              <IconWrapper icon="success" className="h-4 w-4 text-green-500" />
              <span>Recomendaciones personalizadas avanzadas</span>
            </li>
            <li className="flex items-center gap-2">
              <IconWrapper icon="success" className="h-4 w-4 text-green-500" />
              <span>Predicciones y análisis predictivo</span>
            </li>
            <li className="flex items-center gap-2">
              <IconWrapper icon="success" className="h-4 w-4 text-green-500" />
              <span>Detección de anomalías y riesgos</span>
            </li>
            <li className="flex items-center gap-2">
              <IconWrapper icon="success" className="h-4 w-4 text-green-500" />
              <span>Identificación de oportunidades</span>
            </li>
            <li className="flex items-center gap-2">
              <IconWrapper icon="success" className="h-4 w-4 text-green-500" />
              <span>Soporte premium especializado</span>
            </li>
          </ul>
          <Button 
            className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600" 
            onClick={() => handlePurchase('AI_SPECIAL_TOOL')}
            disabled={loadingPlan !== null}
          >
            {loadingPlan === 'AI_SPECIAL_TOOL' ? (
              <>
                <IconWrapper icon="loading" className="mr-2 h-4 w-4 animate-spin" />
                Procesando...
              </>
            ) : (
              'Usar Herramienta IA Especial'
            )}
          </Button>
        </CardContent>
      </Card>
      </div>
    </div>
  );
}