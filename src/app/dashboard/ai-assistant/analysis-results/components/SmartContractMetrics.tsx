'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { IconWrapper } from '@/components/ui/icon-wrapper';
import { AnalysisResults } from '../types';
import { cn } from '@/lib/utils';

interface SmartContractMetricsProps {
  results: AnalysisResults;
}

// Componente Progress personalizado con colores dinámicos
const DynamicProgress = ({ value, className }: { value: number; className?: string }) => {
  const getProgressBarClass = (score: number) => {
    if (score >= 80) return 'progress-bar-green';
    if (score >= 60) return 'progress-bar-yellow';
    return 'progress-bar-red';
  };
  
  return (
    <div className={cn("relative h-2 w-full overflow-hidden rounded-full bg-secondary", className)}>
      <div 
        className={cn("h-full rounded-full progress-bar-animated", getProgressBarClass(value))}
        data-progress={value || 0}
      />
    </div>
  );
};

export default function SmartContractMetrics({ results }: SmartContractMetricsProps) {
  const { smartContractSeo } = results;
  return (
    <div className="space-y-6">
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <IconWrapper icon="blockchain" className="h-5 w-5 text-primary" />
          </div>
          Análisis Smart Contracts
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Optimización y seguridad de contratos inteligentes
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Optimización de Contratos</CardTitle>
            <CardDescription>Análisis de eficiencia y seguridad</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Optimización de Gas</span>
                <span className="font-semibold">{smartContractSeo.gasOptimization}/100</span>
              </div>
              <DynamicProgress value={smartContractSeo.gasOptimization} />
              
              <div className="flex justify-between items-center">
                <span>Documentación ABI</span>
                <span className="font-semibold">{smartContractSeo.abiDocumentation}/100</span>
              </div>
              <DynamicProgress value={smartContractSeo.abiDocumentation} />
              
              <div className="flex justify-between items-center">
                <span>Auditoría de Seguridad</span>
                <span className="font-semibold">{smartContractSeo.securityAudit}/100</span>
              </div>
              <DynamicProgress value={smartContractSeo.securityAudit} />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Estado del Contrato</CardTitle>
            <CardDescription>Verificación y transparencia</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Verificación en Etherscan</span>
                <Badge variant={smartContractSeo.contractVerification ? 'default' : 'destructive'}>
                  {smartContractSeo.contractVerification ? 'Verificado' : 'No Verificado'}
                </Badge>
              </div>
              
              <Separator />
              
              <div>
                <h4 className="font-semibold mb-2">Recomendaciones</h4>
                <ul className="text-sm space-y-1">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Implementar patrones de proxy</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-500" />
                    <span>Optimizar loops con unchecked</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <XCircle className="h-4 w-4 text-red-500" />
                    <span>Verificar contrato en Etherscan</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}