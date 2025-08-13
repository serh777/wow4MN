'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { IconWrapper } from '@/components/ui/icon-wrapper';
import { AnalysisResults } from '../types';
import { cn } from '@/lib/utils';

interface Web3SeoMetricsProps {
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

export default function Web3SeoMetrics({ results }: Web3SeoMetricsProps) {
  const { web3Seo } = results;
  return (
    <div className="space-y-6">
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <IconWrapper icon="analytics" className="h-5 w-5 text-primary" />
          </div>
          Análisis Web3 SEO
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Optimización de metadatos y compatibilidad Web3
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Meta Tags Web3</CardTitle>
            <CardDescription>Optimización de metadatos para DApps</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Meta Tags</span>
                <span className="font-semibold">{web3Seo.metaTags}/100</span>
              </div>
              <DynamicProgress value={web3Seo.metaTags} />
              
              <div className="flex justify-between items-center">
                <span>Datos Estructurados</span>
                <span className="font-semibold">{web3Seo.structuredData}/100</span>
              </div>
              <DynamicProgress value={web3Seo.structuredData} />
              
              <div className="flex justify-between items-center">
                <span>Marcado Semántico</span>
                <span className="font-semibold">{web3Seo.semanticMarkup}/100</span>
              </div>
              <DynamicProgress value={web3Seo.semanticMarkup} />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Compatibilidad Web3</CardTitle>
            <CardDescription>Integración con wallets y protocolos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Compatibilidad General</span>
                <span className="font-semibold">{web3Seo.web3Compatibility}/100</span>
              </div>
              <DynamicProgress value={web3Seo.web3Compatibility} />
              
              <div className="mt-4">
                <h4 className="font-semibold mb-2">Wallets Soportados</h4>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">MetaMask</Badge>
                  <Badge variant="outline">WalletConnect</Badge>
                  <Badge variant="outline">Coinbase Wallet</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}