'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  RefreshCw,
  Settings,
  Zap,
  Globe,
  Key,
  Activity,
  TrendingUp,
  TrendingDown,
  Minus
} from 'lucide-react';
import { useAPIValidator } from '@/hooks/use-api-validator';
import { ValidationResult, APIConfig } from '@/utils/api-validator';

interface APIStatusDashboardProps {
  className?: string;
  showControls?: boolean;
  compact?: boolean;
}

const APIStatusDashboard: React.FC<APIStatusDashboardProps> = ({
  className = '',
  showControls = true,
  compact = false
}) => {
  const {
    summary,
    isValidating,
    error,
    lastValidation,
    validateAll,
    validateSingle,
    retryValidation,
    clearCache,
    getAPIStatus,
    isAPIHealthy,
    getHealthyAPIs,
    getFailedAPIs,
    getRequiredAPIsStatus
  } = useAPIValidator({
    autoValidate: true,
    validationInterval: 5 * 60 * 1000, // 5 minutos
    enableCache: true
  });

  const [selectedAPI, setSelectedAPI] = useState<string | null>(null);

  // Función para obtener el icono de estado
  const getStatusIcon = (status: ValidationResult['status'], size = 16) => {
    switch (status) {
      case 'success':
        return <CheckCircle className={`text-green-500`} size={size} />;
      case 'warning':
        return <AlertTriangle className={`text-yellow-500`} size={size} />;
      case 'error':
        return <XCircle className={`text-red-500`} size={size} />;
      case 'pending':
        return <Clock className={`text-gray-500`} size={size} />;
      default:
        return <Minus className={`text-gray-400`} size={size} />;
    }
  };

  // Función para obtener el color del badge
  const getStatusColor = (status: ValidationResult['status']) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'error':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'pending':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  // Función para formatear el tiempo de respuesta
  const formatResponseTime = (time?: number) => {
    if (!time) return 'N/A';
    return time < 1000 ? `${time}ms` : `${(time / 1000).toFixed(1)}s`;
  };

  // Función para formatear la fecha
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      day: '2-digit',
      month: '2-digit'
    }).format(date);
  };

  // Calcular estadísticas
  const requiredStatus = getRequiredAPIsStatus();
  const healthyAPIs = getHealthyAPIs();
  const failedAPIs = getFailedAPIs();
  const healthPercentage = summary ? (summary.validAPIs / summary.totalAPIs) * 100 : 0;

  if (compact) {
    return (
      <Card className={`${className}`}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              <CardTitle className="text-sm">Estado APIs</CardTitle>
            </div>
            {summary && (
              <Badge className={getStatusColor(summary.overallStatus === 'healthy' ? 'success' : 
                summary.overallStatus === 'degraded' ? 'warning' : 'error')}>
                {summary.overallStatus === 'healthy' ? 'Saludable' :
                 summary.overallStatus === 'degraded' ? 'Degradado' : 'Crítico'}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          {summary && (
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Conectadas: {summary.connectedAPIs}/{summary.totalAPIs}</span>
                <span>{Math.round(healthPercentage)}%</span>
              </div>
              <Progress value={healthPercentage} className="h-2" />
              {requiredStatus.critical && (
                <Alert className="py-2">
                  <AlertTriangle className="h-3 w-3" />
                  <AlertDescription className="text-xs">
                    APIs críticas desconectadas
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header con estadísticas generales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total APIs</p>
                <p className="text-2xl font-bold">{summary?.totalAPIs || 0}</p>
              </div>
              <Globe className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Conectadas</p>
                <p className="text-2xl font-bold text-green-600">{summary?.connectedAPIs || 0}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Fallidas</p>
                <p className="text-2xl font-bold text-red-600">{summary?.failedAPIs || 0}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Salud General</p>
                <p className="text-2xl font-bold">{Math.round(healthPercentage)}%</p>
              </div>
              <Activity className="h-8 w-8 text-blue-500" />
            </div>
            <Progress value={healthPercentage} className="mt-2 h-2" />
          </CardContent>
        </Card>
      </div>

      {/* Alertas críticas */}
      {requiredStatus.critical && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertTitle className="text-red-800">APIs Críticas Desconectadas</AlertTitle>
          <AlertDescription className="text-red-700">
            Hay {requiredStatus.total - requiredStatus.healthy} de {requiredStatus.total} APIs requeridas que no están funcionando correctamente.
            Esto puede afectar la funcionalidad de la aplicación.
          </AlertDescription>
        </Alert>
      )}

      {/* Error general */}
      {error && (
        <Alert className="border-red-200 bg-red-50">
          <XCircle className="h-4 w-4 text-red-600" />
          <AlertTitle className="text-red-800">Error de Validación</AlertTitle>
          <AlertDescription className="text-red-700">{error}</AlertDescription>
        </Alert>
      )}

      {/* Controles */}
      {showControls && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              onClick={validateAll}
              disabled={isValidating}
              size="sm"
              variant="outline"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isValidating ? 'animate-spin' : ''}`} />
              {isValidating ? 'Validando...' : 'Validar Todas'}
            </Button>
            <Button
              onClick={retryValidation}
              disabled={isValidating}
              size="sm"
              variant="outline"
            >
              <Zap className="h-4 w-4 mr-2" />
              Reintentar
            </Button>
            <Button
              onClick={clearCache}
              size="sm"
              variant="ghost"
            >
              Limpiar Cache
            </Button>
          </div>
          {lastValidation && (
            <p className="text-sm text-muted-foreground">
              Última validación: {formatDate(lastValidation)}
            </p>
          )}
        </div>
      )}

      {/* Lista detallada de APIs */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">Todas ({summary?.totalAPIs || 0})</TabsTrigger>
          <TabsTrigger value="healthy">Saludables ({healthyAPIs.length})</TabsTrigger>
          <TabsTrigger value="failed">Fallidas ({failedAPIs.length})</TabsTrigger>
          <TabsTrigger value="required">Requeridas ({requiredStatus.total})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {summary?.results.map((result) => (
            <APIStatusCard
              key={result.apiName}
              result={result}
              onValidate={() => validateSingle(result.apiName)}
              isValidating={isValidating}
              getStatusIcon={getStatusIcon}
              getStatusColor={getStatusColor}
              formatResponseTime={formatResponseTime}
              formatDate={formatDate}
            />
          ))}
        </TabsContent>

        <TabsContent value="healthy" className="space-y-4">
          {healthyAPIs.map((result) => (
            <APIStatusCard
              key={result.apiName}
              result={result}
              onValidate={() => validateSingle(result.apiName)}
              isValidating={isValidating}
              getStatusIcon={getStatusIcon}
              getStatusColor={getStatusColor}
              formatResponseTime={formatResponseTime}
              formatDate={formatDate}
            />
          ))}
        </TabsContent>

        <TabsContent value="failed" className="space-y-4">
          {failedAPIs.map((result) => (
            <APIStatusCard
              key={result.apiName}
              result={result}
              onValidate={() => validateSingle(result.apiName)}
              isValidating={isValidating}
              getStatusIcon={getStatusIcon}
              getStatusColor={getStatusColor}
              formatResponseTime={formatResponseTime}
              formatDate={formatDate}
            />
          ))}
        </TabsContent>

        <TabsContent value="required" className="space-y-4">
          {summary?.results
            .filter(result => {
              // Filtrar solo APIs requeridas
              const configs = summary ? [] : []; // Aquí deberías obtener las configs reales
              return true; // Placeholder - implementar lógica real
            })
            .map((result) => (
              <APIStatusCard
                key={result.apiName}
                result={result}
                onValidate={() => validateSingle(result.apiName)}
                isValidating={isValidating}
                getStatusIcon={getStatusIcon}
                getStatusColor={getStatusColor}
                formatResponseTime={formatResponseTime}
                formatDate={formatDate}
              />
            ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Componente para cada tarjeta de API
interface APIStatusCardProps {
  result: ValidationResult;
  onValidate: () => void;
  isValidating: boolean;
  getStatusIcon: (status: ValidationResult['status'], size?: number) => React.ReactNode;
  getStatusColor: (status: ValidationResult['status']) => string;
  formatResponseTime: (time?: number) => string;
  formatDate: (date: Date) => string;
}

const APIStatusCard: React.FC<APIStatusCardProps> = ({
  result,
  onValidate,
  isValidating,
  getStatusIcon,
  getStatusColor,
  formatResponseTime,
  formatDate
}) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {getStatusIcon(result.status, 20)}
            <div>
              <CardTitle className="text-lg">{result.apiName}</CardTitle>
              <CardDescription>
                Última verificación: {formatDate(result.lastChecked)}
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={getStatusColor(result.status)}>
              {result.status === 'success' ? 'Conectada' :
               result.status === 'warning' ? 'Advertencia' :
               result.status === 'error' ? 'Error' : 'Pendiente'}
            </Badge>
            <Button
              onClick={onValidate}
              disabled={isValidating}
              size="sm"
              variant="outline"
            >
              <RefreshCw className={`h-3 w-3 ${isValidating ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="font-medium text-muted-foreground">Estado</p>
            <p className={result.isConnected ? 'text-green-600' : 'text-red-600'}>
              {result.isConnected ? 'Conectada' : 'Desconectada'}
            </p>
          </div>
          <div>
            <p className="font-medium text-muted-foreground">Validez</p>
            <p className={result.isValid ? 'text-green-600' : 'text-red-600'}>
              {result.isValid ? 'Válida' : 'Inválida'}
            </p>
          </div>
          <div>
            <p className="font-medium text-muted-foreground">Tiempo Respuesta</p>
            <p>{formatResponseTime(result.responseTime)}</p>
          </div>
          <div>
            <p className="font-medium text-muted-foreground">Rate Limit</p>
            <p>{result.details?.rateLimitRemaining || 'N/A'}</p>
          </div>
        </div>
        
        {result.error && (
          <>
            <Separator className="my-3" />
            <Alert className="border-red-200 bg-red-50">
              <XCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-700">
                {result.error}
              </AlertDescription>
            </Alert>
          </>
        )}
        
        {result.details?.version && (
          <>
            <Separator className="my-3" />
            <div className="text-xs text-muted-foreground">
              Versión API: {result.details.version}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default APIStatusDashboard;