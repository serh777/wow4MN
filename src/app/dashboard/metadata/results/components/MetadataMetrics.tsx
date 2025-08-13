'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Icons } from '@/components/icons';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProgressOverlay } from '@/components/ui/progress-overlay';

// Componente IconWrapper
const IconWrapper = ({ icon, className }: { icon: keyof typeof Icons, className?: string }) => {
  const Icon = Icons[icon] || Icons.settings;
  return <Icon className={className} />;
};

interface MetadataMetric {
  name: string;
  value: number;
  maxValue: number;
  status: 'excellent' | 'good' | 'warning' | 'error';
  description: string;
}

interface MetadataMetricsProps {
  contractMetrics: MetadataMetric[];
  tokenMetrics: MetadataMetric[];
  nftMetrics: MetadataMetric[];
}

export default function MetadataMetrics({ 
  contractMetrics, 
  tokenMetrics, 
  nftMetrics 
}: MetadataMetricsProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-green-600 bg-green-100 dark:bg-green-900/20';
      case 'good': return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20';
      case 'warning': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20';
      case 'error': return 'text-red-600 bg-red-100 dark:bg-red-900/20';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'excellent': return 'checkCircle';
      case 'good': return 'check';
      case 'warning': return 'alertTriangle';
      case 'error': return 'xCircle';
      default: return 'info';
    }
  };

  const getProgressColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'bg-green-500';
      case 'good': return 'bg-blue-500';
      case 'warning': return 'bg-yellow-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const MetricCard = ({ metric }: { metric: MetadataMetric }) => {
    const percentage = (metric.value / metric.maxValue) * 100;
    
    return (
      <Card className="h-full">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium">{metric.name}</CardTitle>
            <Badge className={getStatusColor(metric.status)}>
              <IconWrapper 
                icon={getStatusIcon(metric.status) as keyof typeof Icons} 
                className="w-3 h-3 mr-1" 
              />
              {metric.status}
            </Badge>
          </div>
          <CardDescription className="text-xs">
            {metric.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold">{metric.value}</span>
            <span className="text-sm text-muted-foreground">/ {metric.maxValue}</span>
          </div>
          
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span>Completitud</span>
              <span>{percentage.toFixed(1)}%</span>
            </div>
            <div className="relative">
              <Progress value={percentage} className="h-2" />
              <ProgressOverlay 
                width={percentage}
                colorClass={getProgressColor(metric.status)}
                size="small"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <IconWrapper icon="database" className="h-5 w-5" />
          Métricas de Metadatos
        </CardTitle>
        <CardDescription>
          Análisis detallado de la estructura y calidad de los metadatos
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="contract" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="contract" className="text-xs">
              <IconWrapper icon="fileText" className="w-4 h-4 mr-1" />
              Contrato
            </TabsTrigger>
            <TabsTrigger value="tokens" className="text-xs">
              <IconWrapper icon="coins" className="w-4 h-4 mr-1" />
              Tokens
            </TabsTrigger>
            <TabsTrigger value="nfts" className="text-xs">
              <IconWrapper icon="image" className="w-4 h-4 mr-1" />
              NFTs
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="contract" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {contractMetrics.map((metric, index) => (
                <MetricCard key={index} metric={metric} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="tokens" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tokenMetrics.map((metric, index) => (
                <MetricCard key={index} metric={metric} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="nfts" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {nftMetrics.map((metric, index) => (
                <MetricCard key={index} metric={metric} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}