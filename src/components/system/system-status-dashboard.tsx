'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Activity, Server, Database, Wifi, Clock, AlertTriangle, 
  CheckCircle, XCircle, RefreshCw, TrendingUp, TrendingDown,
  Cpu, HardDrive, MemoryStick, Network, Zap, Shield,
  Users, BarChart3, Globe, Eye, Settings, X
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

// Tipos para el estado del sistema
interface SystemMetrics {
  cpu: number;
  memory: number;
  disk: number;
  network: number;
  uptime: number;
  requests: number;
  errors: number;
  responseTime: number;
}

interface ServiceStatus {
  name: string;
  status: 'online' | 'offline' | 'warning' | 'maintenance';
  uptime: number;
  lastCheck: Date;
  responseTime: number;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface SystemAlert {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  message: string;
  timestamp: Date;
  resolved: boolean;
}

interface SystemStatusDashboardProps {
  onClose?: () => void;
}

export function SystemStatusDashboard({ onClose }: SystemStatusDashboardProps = {}) {
  const [metrics, setMetrics] = useState<SystemMetrics>({
    cpu: 45,
    memory: 62,
    disk: 38,
    network: 78,
    uptime: 99.8,
    requests: 1247,
    errors: 3,
    responseTime: 245
  });

  const [services, setServices] = useState<ServiceStatus[]>([
    {
      name: 'API Gateway',
      status: 'online',
      uptime: 99.9,
      lastCheck: new Date(),
      responseTime: 120,
      description: 'Punto de entrada principal para todas las APIs',
      icon: Server
    },
    {
      name: 'Indexador Blockchain',
      status: 'online',
      uptime: 98.5,
      lastCheck: new Date(),
      responseTime: 340,
      description: 'Servicio de indexación de datos blockchain',
      icon: Database
    },
    {
      name: 'Análisis IA',
      status: 'warning',
      uptime: 97.2,
      lastCheck: new Date(),
      responseTime: 890,
      description: 'Motor de análisis con inteligencia artificial',
      icon: Cpu
    },
    {
      name: 'Web3 Connector',
      status: 'online',
      uptime: 99.1,
      lastCheck: new Date(),
      responseTime: 180,
      description: 'Conexión con redes blockchain',
      icon: Network
    },
    {
      name: 'Cache Redis',
      status: 'online',
      uptime: 99.7,
      lastCheck: new Date(),
      responseTime: 15,
      description: 'Sistema de caché en memoria',
      icon: MemoryStick
    },
    {
      name: 'Seguridad WAF',
      status: 'online',
      uptime: 100,
      lastCheck: new Date(),
      responseTime: 25,
      description: 'Firewall de aplicaciones web',
      icon: Shield
    }
  ]);

  const [alerts, setAlerts] = useState<SystemAlert[]>([
    {
      id: '1',
      type: 'warning',
      message: 'Análisis IA experimentando latencia elevada (>800ms)',
      timestamp: new Date(Date.now() - 300000),
      resolved: false
    },
    {
      id: '2',
      type: 'info',
      message: 'Mantenimiento programado del indexador completado',
      timestamp: new Date(Date.now() - 3600000),
      resolved: true
    },
    {
      id: '3',
      type: 'success',
      message: 'Actualización de seguridad aplicada exitosamente',
      timestamp: new Date(Date.now() - 7200000),
      resolved: true
    }
  ]);

  const [performanceData, setPerformanceData] = useState([
    { time: '00:00', requests: 120, responseTime: 200, errors: 0 },
    { time: '04:00', requests: 80, responseTime: 180, errors: 1 },
    { time: '08:00', requests: 300, responseTime: 220, errors: 2 },
    { time: '12:00', requests: 450, responseTime: 250, errors: 1 },
    { time: '16:00', requests: 380, responseTime: 240, errors: 0 },
    { time: '20:00', requests: 280, responseTime: 210, errors: 1 },
    { time: '24:00', requests: 150, responseTime: 190, errors: 0 }
  ]);

  const [isRefreshing, setIsRefreshing] = useState(false);

  // Simular actualización de métricas
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        cpu: Math.max(20, Math.min(80, prev.cpu + (Math.random() - 0.5) * 10)),
        memory: Math.max(30, Math.min(90, prev.memory + (Math.random() - 0.5) * 8)),
        network: Math.max(50, Math.min(100, prev.network + (Math.random() - 0.5) * 15)),
        requests: prev.requests + Math.floor(Math.random() * 10),
        responseTime: Math.max(100, Math.min(500, prev.responseTime + (Math.random() - 0.5) * 50))
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Función para refrescar datos
  const handleRefresh = async () => {
    setIsRefreshing(true);
    
    // Simular carga
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Actualizar timestamps de servicios
    setServices(prev => prev.map(service => ({
      ...service,
      lastCheck: new Date(),
      responseTime: Math.max(10, Math.min(1000, service.responseTime + (Math.random() - 0.5) * 100))
    })));
    
    setIsRefreshing(false);
  };

  // Obtener color del estado
  const getStatusColor = (status: ServiceStatus['status']) => {
    switch (status) {
      case 'online': return 'bg-green-100 text-green-700 border-green-200';
      case 'warning': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'offline': return 'bg-red-100 text-red-700 border-red-200';
      case 'maintenance': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  // Obtener icono del estado
  const getStatusIcon = (status: ServiceStatus['status']) => {
    switch (status) {
      case 'online': return CheckCircle;
      case 'warning': return AlertTriangle;
      case 'offline': return XCircle;
      case 'maintenance': return Settings;
      default: return Activity;
    }
  };

  // Calcular estado general del sistema
  const overallStatus = services.every(s => s.status === 'online') ? 'online' : 
                       services.some(s => s.status === 'offline') ? 'critical' : 'warning';

  const overallUptime = services.reduce((acc, service) => acc + service.uptime, 0) / services.length;

  return (
    <div className="space-y-6">
      
      {/* Header del Dashboard de Estado */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Estado del Sistema</h2>
          <p className="text-gray-600">Monitoreo en tiempo real de todos los servicios</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Badge 
            variant="outline" 
            className={`${getStatusColor(overallStatus === 'online' ? 'online' : overallStatus === 'critical' ? 'offline' : 'warning')} px-3 py-1`}
          >
            {overallStatus === 'online' ? 'Todos los sistemas operativos' : 
             overallStatus === 'critical' ? 'Problemas críticos detectados' : 
             'Advertencias activas'}
          </Badge>
          
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>
          
          {onClose && (
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
              className="flex items-center gap-2"
            >
              <X className="h-4 w-4" />
              Cerrar
            </Button>
          )}
        </div>
      </div>

      {/* Métricas Generales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Uptime General</p>
                <p className="text-2xl font-bold text-green-600">{overallUptime.toFixed(1)}%</p>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Solicitudes/Hora</p>
                <p className="text-2xl font-bold text-blue-600">{metrics.requests.toLocaleString()}</p>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <BarChart3 className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tiempo Respuesta</p>
                <p className="text-2xl font-bold text-purple-600">{metrics.responseTime}ms</p>
              </div>
              <div className="p-2 bg-purple-100 rounded-lg">
                <Clock className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Errores</p>
                <p className="text-2xl font-bold text-red-600">{metrics.errors}</p>
              </div>
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Estado de Servicios */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="h-5 w-5 text-blue-500" />
              Estado de Servicios
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {services.map((service) => {
              const StatusIcon = getStatusIcon(service.status);
              const ServiceIcon = service.icon;
              
              return (
                <div key={service.name} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <ServiceIcon className="h-4 w-4 text-gray-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-gray-900">{service.name}</p>
                        <StatusIcon className={`h-4 w-4 ${
                          service.status === 'online' ? 'text-green-500' :
                          service.status === 'warning' ? 'text-yellow-500' :
                          service.status === 'offline' ? 'text-red-500' :
                          'text-blue-500'
                        }`} />
                      </div>
                      <p className="text-sm text-gray-500">{service.description}</p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{service.uptime}%</p>
                    <p className="text-xs text-gray-500">{service.responseTime}ms</p>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Recursos del Sistema */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-green-500" />
              Recursos del Sistema
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Cpu className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-medium">CPU</span>
                </div>
                <span className="text-sm text-gray-600">{metrics.cpu}%</span>
              </div>
              <Progress value={metrics.cpu} className="h-2" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MemoryStick className="h-4 w-4 text-purple-500" />
                  <span className="text-sm font-medium">Memoria</span>
                </div>
                <span className="text-sm text-gray-600">{metrics.memory}%</span>
              </div>
              <Progress value={metrics.memory} className="h-2" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <HardDrive className="h-4 w-4 text-orange-500" />
                  <span className="text-sm font-medium">Disco</span>
                </div>
                <span className="text-sm text-gray-600">{metrics.disk}%</span>
              </div>
              <Progress value={metrics.disk} className="h-2" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Wifi className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium">Red</span>
                </div>
                <span className="text-sm text-gray-600">{metrics.network}%</span>
              </div>
              <Progress value={metrics.network} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico de Rendimiento */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-indigo-500" />
            Rendimiento en las Últimas 24 Horas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="requests"
                  stackId="1"
                  stroke="#3B82F6"
                  fill="#3B82F6"
                  fillOpacity={0.3}
                  name="Solicitudes"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="responseTime"
                  stroke="#8B5CF6"
                  strokeWidth={2}
                  name="Tiempo Respuesta (ms)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Alertas del Sistema */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            Alertas del Sistema
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {alerts.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <CheckCircle className="h-12 w-12 mx-auto mb-3 text-green-500" />
              <p>No hay alertas activas</p>
              <p className="text-sm">Todos los sistemas funcionan correctamente</p>
            </div>
          ) : (
            alerts.map((alert) => (
              <Alert key={alert.id} className={`${
                alert.type === 'error' ? 'border-red-200 bg-red-50' :
                alert.type === 'warning' ? 'border-yellow-200 bg-yellow-50' :
                alert.type === 'success' ? 'border-green-200 bg-green-50' :
                'border-blue-200 bg-blue-50'
              } ${alert.resolved ? 'opacity-60' : ''}`}>
                <AlertTriangle className={`h-4 w-4 ${
                  alert.type === 'error' ? 'text-red-500' :
                  alert.type === 'warning' ? 'text-yellow-500' :
                  alert.type === 'success' ? 'text-green-500' :
                  'text-blue-500'
                }`} />
                <AlertDescription className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{alert.message}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {alert.timestamp.toLocaleString()}
                      {alert.resolved && ' • Resuelto'}
                    </p>
                  </div>
                  {!alert.resolved && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setAlerts(prev => prev.map(a => 
                          a.id === alert.id ? { ...a, resolved: true } : a
                        ));
                      }}
                    >
                      Marcar como resuelto
                    </Button>
                  )}
                </AlertDescription>
              </Alert>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}

