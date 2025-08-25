'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { IconWrapper } from '@/components/ui/icon-wrapper';
import { useToast } from '@/components/ui/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Server, 
  CheckCircle, 
  Clock, 
  XCircle, 
  Loader2, 
  Play, 
  Info, 
  Wallet, 
  ArrowUp,
  Zap,
  Database,
  Activity
} from 'lucide-react';
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
  const [animatedProgress, setAnimatedProgress] = useState(0);
  const [pulseActive, setPulseActive] = useState(false);

  const calculateOverallProgress = useCallback((): number => {
    if (!dataAvailability?.details.length) return 0;
    
    const readyTools = dataAvailability.details.filter(d => d.hasData).length;
    return (readyTools / dataAvailability.details.length) * 100;
  }, [dataAvailability]);

  // Animación del progreso
  useEffect(() => {
    const targetProgress = calculateOverallProgress();
    const timer = setTimeout(() => {
      setAnimatedProgress(targetProgress);
    }, 300);
    return () => clearTimeout(timer);
  }, [dataAvailability, calculateOverallProgress]);

  // Efecto de pulso cuando se activa
  useEffect(() => {
    if (isActivating) {
      setPulseActive(true);
      const timer = setTimeout(() => setPulseActive(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [isActivating]);

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
      return (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Badge variant="default" className="bg-green-500/10 text-green-500 border-green-500/20 flex items-center gap-1">
            <CheckCircle className="w-3 h-3" />
            Datos Listos
          </Badge>
        </motion.div>
      );
    }
    if (detail.needsIndexer) {
      return (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Requiere Indexador
          </Badge>
        </motion.div>
      );
    }
    return (
      <Badge variant="outline" className="flex items-center gap-1">
        <XCircle className="w-3 h-3" />
        Sin Datos
      </Badge>
    );
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
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="border-muted hover:border-primary/20 transition-colors duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <motion.div
                animate={{ rotate: pulseActive ? 360 : 0 }}
                transition={{ duration: 1 }}
              >
                <Server className="h-5 w-5 text-muted-foreground" />
              </motion.div>
              Estado del Indexador
            </CardTitle>
            <CardDescription>
              Selecciona herramientas para ver los requisitos del indexador
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <ArrowUp className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              </motion.div>
              <p className="text-muted-foreground">Selecciona herramientas arriba para comenzar</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  // Si no hay dirección objetivo
  if (!targetAddress) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <Card className="border-yellow-500/20 bg-yellow-500/5 hover:bg-yellow-500/10 transition-colors duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Server className="h-5 w-5 text-yellow-500" />
              </motion.div>
              Estado del Indexador
            </CardTitle>
            <CardDescription>
              Ingresa una dirección para verificar disponibilidad de datos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-6">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Wallet className="mx-auto h-12 w-12 text-yellow-500 mb-4" />
              </motion.div>
              <p className="text-muted-foreground mb-4">
                Se requiere una dirección de wallet o contrato para indexar datos
              </p>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Badge variant="outline" className="text-yellow-600 border-yellow-500/20">
                  Dirección Requerida
                </Badge>
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  const overallProgress = calculateOverallProgress();
  const isDataReady = dataAvailability?.dataReady || false;
  const needsActivation = dataAvailability?.details.some(d => d.needsIndexer) || false;
  
  // Simular progreso cuando se está activando
  const displayProgress = isActivating ? Math.min(overallProgress + 20, 95) : overallProgress;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={pulseActive ? 'animate-pulse' : ''}
    >
      <Card className={`border-2 transition-all duration-500 hover:shadow-lg ${
        isDataReady 
          ? 'border-green-500/20 bg-green-500/5 hover:bg-green-500/10' 
          : needsActivation 
          ? 'border-primary/20 bg-primary/5 hover:bg-primary/10'
          : 'border-muted hover:border-muted-foreground/20'
      }`}>
      <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <motion.div
                animate={{ 
                  rotate: isActivating ? 360 : 0,
                  scale: pulseActive ? [1, 1.2, 1] : 1
                }}
                transition={{ 
                  rotate: { duration: 2, repeat: isActivating ? Infinity : 0 },
                  scale: { duration: 0.5 }
                }}
              >
                {isDataReady ? (
                  <Database className={`h-5 w-5 text-green-500`} />
                ) : isActivating ? (
                  <Loader2 className={`h-5 w-5 text-primary animate-spin`} />
                ) : needsActivation ? (
                  <Activity className={`h-5 w-5 text-primary`} />
                ) : (
                  <Server className={`h-5 w-5 text-muted-foreground`} />
                )}
              </motion.div>
              <CardTitle>Estado del Indexador</CardTitle>
            </div>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Badge 
                variant={isDataReady ? 'default' : 'secondary'}
                className={`flex items-center gap-1 ${
                  isDataReady 
                    ? 'bg-green-500/10 text-green-500 border-green-500/20' 
                    : isActivating
                    ? 'bg-blue-500/10 text-blue-500 border-blue-500/20'
                    : ''
                }`}
              >
                {isActivating ? (
                  <>
                    <Loader2 className="w-3 h-3 animate-spin" />
                    Activando...
                  </>
                ) : isDataReady ? (
                  <>
                    <CheckCircle className="w-3 h-3" />
                    Listo
                  </>
                ) : needsActivation ? (
                  <>
                    <Zap className="w-3 h-3" />
                    Requiere Activación
                  </>
                ) : (
                  <>
                    <Clock className="w-3 h-3" />
                    Verificando
                  </>
                )}
              </Badge>
            </motion.div>
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
        <motion.div 
          className="space-y-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex justify-between text-sm">
            <span className="flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Progreso de Datos
            </span>
            <motion.span
              key={Math.round(overallProgress)}
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              {Math.round(overallProgress)}%
            </motion.span>
          </div>
          <Progress value={displayProgress} className="h-3 transition-all duration-500" />
        </motion.div>

        {/* Detalles por Herramienta */}
        <motion.div 
          className="space-y-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          <div className="flex items-center gap-2">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              <Info className="w-4 h-4 text-blue-500" />
            </motion.div>
            <h4 className="font-medium text-sm">Estado por Herramienta</h4>
          </div>
          {dataAvailability?.details.map((detail, index) => (
            <motion.div 
              key={detail.tool} 
              className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + index * 0.1, duration: 0.3 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-sm">{getToolDisplayName(detail.tool)}</span>
                  {getStatusBadge(detail)}
                </div>
                {getDataCountDisplay(detail)}
                {detail.needsIndexer && detail.estimatedIndexingTime && (
                  <motion.div 
                    className="text-xs text-muted-foreground mt-1"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                  >
                    Tiempo estimado: ~{Math.ceil(detail.estimatedIndexingTime / 60)} min
                  </motion.div>
                )}
              </div>
              <div className="flex items-center gap-2">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.5 + index * 0.1, duration: 0.3 }}
                >
                  {detail.hasData ? (
                    <IconWrapper icon="check-circle" className="h-5 w-5 text-green-500" />
                  ) : detail.needsIndexer ? (
                    <IconWrapper icon="clock" className="h-5 w-5 text-yellow-500" />
                  ) : (
                    <IconWrapper icon="x-circle" className="h-5 w-5 text-red-500" />
                  )}
                </motion.div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Información Adicional */}
        {dataAvailability && (
          <motion.div 
            className="space-y-3 pt-4 border-t"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.4 }}
          >
            <div className="flex items-center gap-2">
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity, 
                  repeatDelay: 4 
                }}
              >
                <Database className="w-4 h-4 text-purple-500" />
              </motion.div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Información Adicional
              </h4>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <motion.div 
                className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors cursor-pointer"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6, duration: 0.3 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.div 
                  className="text-lg font-bold text-blue-600 dark:text-blue-400"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.3 }}
                >
                  {dataAvailability.totalDataPoints.toLocaleString()}
                </motion.div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  Registros Totales
                </div>
              </motion.div>
              <motion.div 
                className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors cursor-pointer"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7, duration: 0.3 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.div 
                  className="text-lg font-bold text-green-600 dark:text-green-400"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.3 }}
                >
                  {dataAvailability.activeIndexers.length}
                </motion.div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  Indexadores Activos
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* Botón de Acción */}
        {needsActivation && (
          <motion.div 
            className="space-y-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.4 }}
          >
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <IconWrapper icon="info" className="h-4 w-4" />
              <span>Tiempo estimado de indexación: {getEstimatedTime()}</span>
            </div>
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button 
                onClick={handleActivateClick}
                disabled={isActivating}
                className={`w-full relative overflow-hidden ${
                  isActivating 
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600' 
                    : 'bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700'
                }`}
                size="lg"
              >
                <motion.div
                  className="flex items-center justify-center"
                  animate={isActivating ? { x: [0, 5, -5, 0] } : {}}
                  transition={{ duration: 0.5, repeat: isActivating ? Infinity : 0 }}
                >
                  {isActivating ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <IconWrapper icon="loader-2" className="mr-2 h-4 w-4" />
                      </motion.div>
                      <span>Activando Indexadores...</span>
                    </>
                  ) : (
                    <>
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                      >
                        <IconWrapper icon="play" className="mr-2 h-4 w-4" />
                      </motion.div>
                      <span>Activar Indexadores Requeridos</span>
                    </>
                  )}
                </motion.div>
                {isActivating && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    animate={{ x: ['-100%', '100%'] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                  />
                )}
              </Button>
            </motion.div>
          </motion.div>
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
    </motion.div>
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