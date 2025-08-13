'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Activity, 
  Database, 
  Clock, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  RefreshCw
} from 'lucide-react';

interface IndexerMetrics {
  indexerId: string;
  blocksProcessed: number;
  transactionsProcessed: number;
  eventsProcessed: number;
  processingRate: number;
  lastProcessedBlock: number;
  currentBlock: number;
  lag: number;
  uptime: number;
  errorRate: number;
  status: 'running' | 'stopped' | 'error';
}

interface SystemMetrics {
  totalIndexers: number;
  activeIndexers: number;
  totalBlocksProcessed: number;
  totalTransactionsProcessed: number;
  totalEventsProcessed: number;
  averageProcessingRate: number;
  systemUptime: number;
}

interface HealthCheck {
  name: string;
  status: 'pass' | 'fail';
  message?: string;
}

interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  checks: HealthCheck[];
}

interface IndexerMetricsProps {
  indexerId?: string;
}

export default function IndexerMetrics({ indexerId }: IndexerMetricsProps) {
  const [indexerMetrics, setIndexerMetrics] = useState<IndexerMetrics | null>(null);
  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics | null>(null);
  const [healthStatus, setHealthStatus] = useState<HealthStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const fetchMetrics = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch system metrics
      const systemResponse = await fetch('/api/indexers/metrics?type=system');
      if (systemResponse.ok) {
        const systemData = await systemResponse.json();
        setSystemMetrics(systemData.data);
      }

      // Fetch health status
      const healthResponse = await fetch('/api/indexers/metrics?type=health');
      if (healthResponse.ok) {
        const healthData = await healthResponse.json();
        setHealthStatus(healthData.data);
      }

      // Fetch indexer-specific metrics if indexerId is provided
      if (indexerId) {
        const indexerResponse = await fetch(`/api/indexers/metrics?type=indexer&indexerId=${indexerId}`);
        if (indexerResponse.ok) {
          const indexerData = await indexerResponse.json();
          setIndexerMetrics(indexerData.data);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error cargando métricas');
    } finally {
      setLoading(false);
    }
  }, [indexerId]);

  useEffect(() => {
    fetchMetrics();

    if (autoRefresh) {
      const interval = setInterval(fetchMetrics, 30000); // Refresh every 30 seconds
      return () => clearInterval(interval);
    }
  }, [indexerId, autoRefresh, fetchMetrics]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running':
      case 'healthy':
      case 'pass':
        return 'bg-green-500';
      case 'degraded':
        return 'bg-yellow-500';
      case 'stopped':
        return 'bg-gray-500';
      case 'error':
      case 'unhealthy':
      case 'fail':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const formatUptime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = Math.floor(minutes % 60);
    return `${hours}h ${mins}m`;
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="h-8 w-8 animate-spin" />
        <span className="ml-2">Cargando métricas...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-red-200">
        <CardContent className="p-6">
          <div className="flex items-center text-red-600">
            <XCircle className="h-5 w-5 mr-2" />
            <span>Error: {error}</span>
          </div>
          <Button onClick={fetchMetrics} className="mt-4">
            Reintentar
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Métricas del Indexer</h2>
        <div className="flex gap-2">
          <Button
            variant={autoRefresh ? "primary" : "outline"}
            size="sm"
            onClick={() => setAutoRefresh(!autoRefresh)}
          >
            <Activity className="h-4 w-4 mr-2" />
            Auto-refresh {autoRefresh ? 'ON' : 'OFF'}
          </Button>
          <Button variant="outline" size="sm" onClick={fetchMetrics}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualizar
          </Button>
        </div>
      </div>

      <Tabs defaultValue="system" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="system">Sistema</TabsTrigger>
          <TabsTrigger value="health">Salud</TabsTrigger>
          {indexerId && <TabsTrigger value="indexer">Indexer</TabsTrigger>}
        </TabsList>

        {/* System Metrics */}
        <TabsContent value="system" className="space-y-4">
          {systemMetrics && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Indexers</CardTitle>
                  <Database className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{systemMetrics.totalIndexers}</div>
                  <p className="text-xs text-muted-foreground">
                    {systemMetrics.activeIndexers} activos
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Bloques Procesados</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {formatNumber(systemMetrics.totalBlocksProcessed)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {systemMetrics.averageProcessingRate}/min promedio
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Transacciones</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {formatNumber(systemMetrics.totalTransactionsProcessed)}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Uptime del Sistema</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {formatUptime(systemMetrics.systemUptime)}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        {/* Health Status */}
        <TabsContent value="health" className="space-y-4">
          {healthStatus && (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    Estado General del Sistema
                    <Badge className={getStatusColor(healthStatus.status)}>
                      {healthStatus.status.toUpperCase()}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {healthStatus.checks.map((check, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded">
                        <div className="flex items-center gap-2">
                          {check.status === 'pass' ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          ) : (
                            <XCircle className="h-5 w-5 text-red-500" />
                          )}
                          <span className="font-medium capitalize">
                            {check.name.replace('_', ' ')}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {check.message && (
                            <span className="text-sm text-muted-foreground">
                              {check.message}
                            </span>
                          )}
                          <Badge 
                            variant={check.status === 'pass' ? 'secondary' : 'destructive'}
                            className={getStatusColor(check.status)}
                          >
                            {check.status.toUpperCase()}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        {/* Individual Indexer Metrics */}
        {indexerId && (
          <TabsContent value="indexer" className="space-y-4">
            {indexerMetrics && (
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      Indexer: {indexerMetrics.indexerId}
                      <Badge className={getStatusColor(indexerMetrics.status)}>
                        {indexerMetrics.status.toUpperCase()}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Progreso de Sincronización</label>
                        <Progress 
                          value={(indexerMetrics.lastProcessedBlock / indexerMetrics.currentBlock) * 100}
                          className="w-full"
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Bloque: {formatNumber(indexerMetrics.lastProcessedBlock)}</span>
                          <span>Actual: {formatNumber(indexerMetrics.currentBlock)}</span>
                        </div>
                        <div className="text-sm">
                          <span className="font-medium">Lag: </span>
                          <span className={indexerMetrics.lag > 1000 ? 'text-red-500' : 'text-green-500'}>
                            {formatNumber(indexerMetrics.lag)} bloques
                          </span>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <div className="text-sm font-medium">Tasa de Procesamiento</div>
                          <div className="text-2xl font-bold">{indexerMetrics.processingRate}</div>
                          <div className="text-xs text-muted-foreground">bloques/10min</div>
                        </div>

                        <div>
                          <div className="text-sm font-medium">Tasa de Errores</div>
                          <div className={`text-2xl font-bold ${
                            indexerMetrics.errorRate > 5 ? 'text-red-500' : 'text-green-500'
                          }`}>
                            {indexerMetrics.errorRate.toFixed(1)}%
                          </div>
                        </div>

                        <div>
                          <div className="text-sm font-medium">Uptime</div>
                          <div className="text-2xl font-bold">
                            {formatUptime(indexerMetrics.uptime)}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          {formatNumber(indexerMetrics.blocksProcessed)}
                        </div>
                        <div className="text-sm text-muted-foreground">Bloques</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {formatNumber(indexerMetrics.transactionsProcessed)}
                        </div>
                        <div className="text-sm text-muted-foreground">Transacciones</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">
                          {formatNumber(indexerMetrics.eventsProcessed)}
                        </div>
                        <div className="text-sm text-muted-foreground">Eventos</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}