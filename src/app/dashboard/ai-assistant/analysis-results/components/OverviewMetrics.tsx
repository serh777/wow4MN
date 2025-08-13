'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Search, 
  Code, 
  Zap, 
  Activity, 
  TrendingUp, 
  CheckCircle 
} from 'lucide-react';
import { AnalysisResults } from '../types';
import { cn } from '@/lib/utils';

interface OverviewMetricsProps {
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

export default function OverviewMetrics({
  results
}: OverviewMetricsProps) {
  const {
    web3Seo,
    smartContractSeo,
    dappPerformance,
    blockchainMetrics,
    predictions
  } = results;
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Web3 SEO</CardTitle>
            <Search className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{web3Seo.metaTags}</div>
            <p className="text-xs text-muted-foreground">Meta tags optimizados</p>
            <div className="mt-2">
              <DynamicProgress value={web3Seo.metaTags} />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Smart Contracts</CardTitle>
            <Code className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{smartContractSeo.gasOptimization}</div>
            <p className="text-xs text-muted-foreground">Optimización de gas</p>
            <div className="mt-2 flex items-center space-x-2">
              <Badge variant={smartContractSeo.contractVerification ? 'default' : 'destructive'} className="dark:text-white">
                {smartContractSeo.contractVerification ? 'Verificado' : 'No verificado'}
              </Badge>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">DApp Performance</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dappPerformance.loadTime}</div>
            <p className="text-xs text-muted-foreground">Tiempo de carga</p>
            <div className="mt-2">
              <DynamicProgress value={dappPerformance.loadTime} />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Blockchain Metrics</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{blockchainMetrics.networkHealth}</div>
            <p className="text-xs text-muted-foreground">Salud de la red</p>
            <div className="mt-2">
              <DynamicProgress value={blockchainMetrics.networkHealth} />
            </div>
          </CardContent>
        </Card>
      </div>

      {predictions && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>Predicciones de Mercado</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">Tendencia del Mercado</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">{predictions.marketTrend}</p>
                <div className="mt-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm">Potencial de Crecimiento:</span>
                    <Badge variant="default">{predictions.growthPotential}%</Badge>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Recomendaciones</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  {predictions.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}