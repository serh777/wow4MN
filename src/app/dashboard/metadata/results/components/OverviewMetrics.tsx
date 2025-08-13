'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Icons } from '@/components/icons';

// Componente IconWrapper
const IconWrapper = ({ icon, className }: { icon: keyof typeof Icons, className?: string }) => {
  const Icon = Icons[icon] || Icons.settings;
  return <Icon className={className} />;
};

interface MetricItem {
  label: string;
  value: string | number;
  change?: number;
  icon: keyof typeof Icons;
  color: string;
}

interface OverviewMetricsProps {
  totalElements: number;
  completionRate: number;
  qualityScore: number;
  standardCompliance: number;
  lastUpdated: string;
  contractAddress: string;
  network: string;
}

export default function OverviewMetrics({
  totalElements,
  completionRate,
  qualityScore,
  standardCompliance,
  lastUpdated,
  contractAddress,
  network
}: OverviewMetricsProps) {
  const metrics: MetricItem[] = [
    {
      label: 'Elementos Totales',
      value: totalElements,
      icon: 'database',
      color: 'text-blue-600'
    },
    {
      label: 'Tasa de Completitud',
      value: `${completionRate}%`,
      change: 5.2,
      icon: 'checkCircle',
      color: 'text-green-600'
    },
    {
      label: 'Puntuación de Calidad',
      value: `${qualityScore}/100`,
      change: -2.1,
      icon: 'star',
      color: 'text-yellow-600'
    },
    {
      label: 'Cumplimiento de Estándares',
      value: `${standardCompliance}%`,
      change: 8.7,
      icon: 'shield',
      color: 'text-purple-600'
    }
  ];

  const getChangeColor = (change: number) => {
    return change >= 0 ? 'text-green-600' : 'text-red-600';
  };

  const getChangeIcon = (change: number) => {
    return change >= 0 ? 'trendingUp' : 'trendingDown';
  };

  const getQualityBadge = (score: number) => {
    if (score >= 90) return { text: 'Excelente', color: 'bg-green-500' };
    if (score >= 75) return { text: 'Bueno', color: 'bg-blue-500' };
    if (score >= 60) return { text: 'Regular', color: 'bg-yellow-500' };
    if (score >= 40) return { text: 'Deficiente', color: 'bg-orange-500' };
    return { text: 'Crítico', color: 'bg-red-500' };
  };

  const qualityBadge = getQualityBadge(qualityScore);

  return (
    <div className="space-y-6">
      {/* Información del Contrato */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconWrapper icon="info" className="h-5 w-5" />
            Información del Contrato
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Dirección del Contrato</div>
              <div className="font-mono text-sm bg-muted p-2 rounded">
                {contractAddress}
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Red</div>
              <Badge variant="outline" className="w-fit">
                <IconWrapper icon="globe" className="w-3 h-3 mr-1" />
                {network}
              </Badge>
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">Última Actualización</div>
            <div className="text-sm">{lastUpdated}</div>
          </div>
        </CardContent>
      </Card>

      {/* Métricas Principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">{metric.label}</p>
                  <p className="text-2xl font-bold">{metric.value}</p>
                  {metric.change !== undefined && (
                    <div className={`flex items-center gap-1 text-xs ${getChangeColor(metric.change)}`}>
                      <IconWrapper 
                        icon={getChangeIcon(metric.change) as keyof typeof Icons} 
                        className="w-3 h-3" 
                      />
                      <span>{Math.abs(metric.change)}%</span>
                    </div>
                  )}
                </div>
                <div className={`p-3 rounded-full bg-muted/50 ${metric.color}`}>
                  <IconWrapper icon={metric.icon} className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Resumen de Calidad */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Resumen de Calidad</CardTitle>
              <CardDescription>
                Evaluación general de la calidad de los metadatos
              </CardDescription>
            </div>
            <Badge className={`${qualityBadge.color} text-white`}>
              {qualityBadge.text}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Completitud</span>
                <span className="text-sm text-muted-foreground">{completionRate}%</span>
              </div>
              <Progress value={completionRate} className="h-2" />
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Calidad</span>
                <span className="text-sm text-muted-foreground">{qualityScore}%</span>
              </div>
              <Progress value={qualityScore} className="h-2" />
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Estándares</span>
                <span className="text-sm text-muted-foreground">{standardCompliance}%</span>
              </div>
              <Progress value={standardCompliance} className="h-2" />
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{Math.floor(totalElements * 0.8)}</div>
              <div className="text-xs text-muted-foreground">Válidos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{Math.floor(totalElements * 0.15)}</div>
              <div className="text-xs text-muted-foreground">Advertencias</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{Math.floor(totalElements * 0.05)}</div>
              <div className="text-xs text-muted-foreground">Errores</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{Math.floor(totalElements * 0.9)}</div>
              <div className="text-xs text-muted-foreground">Optimizados</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}