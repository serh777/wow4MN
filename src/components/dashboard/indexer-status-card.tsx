'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { IconWrapper } from '@/components/ui/icon-wrapper';
import { useToast } from '@/components/ui/use-toast';
import { 
  IndexerState, 
  DataAvailability, 
  IndexerRequirement,
  ToolDataAvailability 
} from '@/hooks/useIndexerOrchestrator';

interface IndexerStatusCardProps {
  indexerState: IndexerState;
  dataAvailability: DataAvailability | null;
  selectedTools: string[];
  targetAddress: string;
  onActivateIndexers: () => Promise<void>;
  isActivating: boolean;
}

/**
 * Componente que muestra el estado actual del indexador y permite activar indexadores necesarios
 */
export function IndexerStatusCard({
  indexerState,
  dataAvailability,
  selectedTools,
  targetAddress,
  onActivateIndexers,
  isActivating
}: IndexerStatusCardProps) {
  const { toast } = useToast();

  const getToolDisplayName = (tool: string): string => {
    const names: Record<string, string> = {
      'metadata': 'Análisis de Metadatos',
      'content': 'Auditoría de Contenido',
      'keywords': 'Análisis de Keywords',
      'social': 'Social Web3',
      'onchain': 'Análisis On-chain',
      'blockchain': 'Análisis Blockchain',
      'links': 'Verificación de Enlaces',
      'performance': 'Análisis de Rendimiento',
      'backlinks': 'Análisis de Backlinks',
      'security': 'Auditoría de Seguridad',
      'wallet': 'Análisis de Wallet',
  
    };
    return names[tool] || tool;
  };

  const getStatusBadge = (detail: ToolDataAvailability) => {
    if (detail.hasData) {
      return <Badge variant="default" className="bg-green-500/10 text-green-500 border-green-500/20">Datos Listos</Badge>;
    }
    if (detail.needsIndexer) {
      return <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">Requiere Indexador</Badge>;
    }
    return <Badge variant="outline">Sin Datos</Badge>;
  };

  const getDataCountDisplay = (detail: ToolDataAvailability) => {
    if (detail.dataCount > 0) {
      return (
        <div className="text-sm text-muted-foreground">
          {detail.dataCount.toLocaleString()} registros
          {detail.lastUpdate && (
            <span className="ml-2">
              • Actualizado {formatRelativeTime(detail.lastUpdate)}
            </span>
          )}
        </div>
      );
    }
    return null;
  };

  const formatRelativeTime = (date: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'hace un momento';
    if (diffMins < 60) return `hace ${diffMins} min`;
    if (diffHours < 24) return `hace ${diffHours}h`;
    return `hace ${diffDays}d`;
  };

  const calculateOverallProgress = (): number => {
    if (!dataAvailability?.details.length) return 0;
    
    const readyTools = dataAvailability.details.filter(d => d.hasData).length;
    return (readyTools / dataAvailability.details.length) * 100;
  };

  const getEstimatedTime = (): string => {
    if (!indexerState.required.length) return '0 min';
    
    const totalSeconds = indexerState.required
      .filter(req => !dataAvailability?.details.find(d => d.tool === req.tool && d.hasData))
      .reduce((sum, req) => sum + (req.estimatedTime || 60), 0);
    
    const minutes = Math.ceil(totalSeconds / 60);
    return `~${minutes} min`;
  };

  const handleActivateClick = async () => {
    if (!targetAddress) {
      toast({
        title: 'Dirección requerida',
        description: 'Ingresa una dirección de wallet o contrato para continuar',
        variant: 'destructive'
      });
      return;
    }

    if (selectedTools.length === 0) {
      toast({
        title: 'Herramientas requeridas',
        description: 'Selecciona al menos una herramienta para activar indexadores',
        variant: 'destructive'
      });
      return;
    }

    try {
      // Simular progreso de activación
      toast({
        title: 'Activando indexadores',
        description: 'Iniciando activación de indexadores...',
        variant: 'default'
      });
      
      // Simular tiempo de activación
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      await onActivateIndexers();
      
      // NOTA: El toast de éxito se muestra en la función onActivateIndexers del dashboard
      // para evitar duplicados
    } catch (error) {
      console.error('Error activando indexadores:', error);
      toast({
        title: 'Error de activación',
        description: 'No se pudieron activar los indexadores. Intenta nuevamente.',
        variant: 'destructive'
      });
    }
  };

  // Si no hay herramientas seleccionadas
  if (selectedTools.length === 0) {
    return (
      <Card className="border-muted">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconWrapper icon="server" className="h-5 w-5 text-muted-foreground" />
            Estado del Indexador
          </CardTitle>
          <CardDescription>
            Selecciona herramientas para ver los requisitos del indexador
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <IconWrapper icon="arrow-up" className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Selecciona herramientas arriba para comenzar</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Si no hay dirección objetivo
  if (!targetAddress) {
    return (
      <Card className="border-yellow-500/20 bg-yellow-500/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconWrapper icon="server" className="h-5 w-5 text-yellow-500" />
            Estado del Indexador
          </CardTitle>
          <CardDescription>
            Ingresa una dirección para verificar disponibilidad de datos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <IconWrapper icon="wallet" className="mx-auto h-12 w-12 text-yellow-500 mb-4" />
            <p className="text-muted-foreground mb-4">
              Se requiere una dirección de wallet o contrato para indexar datos
            </p>
            <Badge variant="outline" className="text-yellow-600 border-yellow-500/20">
              Dirección Requerida
            </Badge>
          </div>
        </CardContent>
      </Card>
    );
  }

  const overallProgress = calculateOverallProgress();
  const isDataReady = dataAvailability?.dataReady || false;
  const needsActivation = dataAvailability?.details.some(d => d.needsIndexer) || false;
  
  // Simular progreso cuando se está activando
  const displayProgress = isActivating ? Math.min(overallProgress + 20, 95) : overallProgress;

  return (
    <Card className={`border-2 transition-colors ${
      isDataReady 
        ? 'border-green-500/20 bg-green-500/5' 
        : needsActivation 
        ? 'border-primary/20 bg-primary/5'
        : 'border-muted'
    }`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <IconWrapper 
              icon="server" 
              className={`h-5 w-5 ${
                isDataReady 
                  ? 'text-green-500' 
                  : needsActivation 
                  ? 'text-primary'
                  : 'text-muted-foreground'
              }`} 
            />
            <CardTitle>Estado del Indexador</CardTitle>
          </div>
          <Badge 
            variant={isDataReady ? 'default' : 'secondary'}
            className={isDataReady ? 'bg-green-500/10 text-green-500 border-green-500/20' : ''}
          >
            {isActivating ? 'Activando...' : isDataReady ? 'Listo' : needsActivation ? 'Requiere Activación' : 'Verificando'}
          </Badge>
        </div>
        <CardDescription>
          {isActivating
            ? 'Activando indexadores y verificando datos...'
            : isDataReady 
            ? `Datos disponibles para ${dataAvailability?.totalDataPoints.toLocaleString()} registros`
            : `Verificando disponibilidad de datos para ${selectedTools.length} herramienta${selectedTools.length > 1 ? 's' : ''}`
          }
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Progreso General */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progreso de Datos</span>
            <span>{Math.round(overallProgress)}%</span>
          </div>
          <Progress value={displayProgress} className="h-2" />
        </div>

        {/* Detalles por Herramienta */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm">Estado por Herramienta</h4>
          {dataAvailability?.details.map((detail) => (
            <div key={detail.tool} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-sm">{getToolDisplayName(detail.tool)}</span>
                  {getStatusBadge(detail)}
                </div>
                {getDataCountDisplay(detail)}
                {detail.needsIndexer && detail.estimatedIndexingTime && (
                  <div className="text-xs text-muted-foreground mt-1">
                    Tiempo estimado: ~{Math.ceil(detail.estimatedIndexingTime / 60)} min
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                {detail.hasData ? (
                  <IconWrapper icon="check-circle" className="h-5 w-5 text-green-500" />
                ) : detail.needsIndexer ? (
                  <IconWrapper icon="clock" className="h-5 w-5 text-yellow-500" />
                ) : (
                  <IconWrapper icon="x-circle" className="h-5 w-5 text-red-500" />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Información Adicional */}
        {dataAvailability && (
          <div className="grid grid-cols-2 gap-4 p-3 bg-muted/50 rounded-lg">
            <div className="text-center">
              <div className="text-lg font-bold text-primary">
                {dataAvailability.totalDataPoints.toLocaleString()}
              </div>
              <div className="text-xs text-muted-foreground">Total de Registros</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-primary">
                {dataAvailability.activeIndexers.length}
              </div>
              <div className="text-xs text-muted-foreground">Indexadores Activos</div>
            </div>
          </div>
        )}

        {/* Botón de Acción */}
        {needsActivation && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <IconWrapper icon="info" className="h-4 w-4" />
              <span>Tiempo estimado de indexación: {getEstimatedTime()}</span>
            </div>
            <Button 
              onClick={handleActivateClick}
              disabled={isActivating}
              className="w-full"
              size="lg"
            >
              {isActivating ? (
                <>
                  <IconWrapper icon="loader-2" className="mr-2 h-4 w-4 animate-spin" />
                  Activando Indexadores...
                </>
              ) : (
                <>
                  <IconWrapper icon="play" className="mr-2 h-4 w-4" />
                  Activar Indexadores Requeridos
                </>
              )}
            </Button>
          </div>
        )}

        {isDataReady && (
          <div className="flex items-center gap-2 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
            <IconWrapper icon="check-circle" className="h-5 w-5 text-green-500" />
            <div className="flex-1">
              <p className="text-sm font-medium text-green-700">Datos Listos para Análisis</p>
              <p className="text-xs text-green-600">
                Todos los indexadores están activos y los datos están disponibles
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

/**
 * Componente simplificado para mostrar solo el estado básico
 */
export function IndexerStatusBadge({ 
  isDataReady, 
  isActivating, 
  totalDataPoints 
}: { 
  isDataReady: boolean; 
  isActivating: boolean; 
  totalDataPoints: number; 
}) {
  if (isActivating) {
    return (
      <Badge variant="secondary" className="bg-blue-500/10 text-blue-500 border-blue-500/20">
        <IconWrapper icon="loader-2" className="mr-1 h-3 w-3 animate-spin" />
        Activando
      </Badge>
    );
  }

  if (isDataReady) {
    return (
      <Badge variant="default" className="bg-green-500/10 text-green-500 border-green-500/20">
        <IconWrapper icon="check-circle" className="mr-1 h-3 w-3" />
        {totalDataPoints.toLocaleString()} registros
      </Badge>
    );
  }

  return (
    <Badge variant="outline">
      <IconWrapper icon="clock" className="mr-1 h-3 w-3" />
      Pendiente
    </Badge>
  );
}