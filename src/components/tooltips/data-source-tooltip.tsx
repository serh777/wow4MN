'use client';

import React from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Info,
  ExternalLink,
  Clock,
  Shield,
  Zap,
  Database,
  Globe,
  Key,
  TrendingUp,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

export interface DataSource {
  name: string;
  description: string;
  type: 'api' | 'blockchain' | 'web' | 'database' | 'ai' | 'social';
  reliability: 'high' | 'medium' | 'low';
  updateFrequency: string;
  website?: string;
  apiDocumentation?: string;
  limitations?: string[];
  features?: string[];
  pricing?: 'free' | 'freemium' | 'paid';
  requiresAuth: boolean;
  dataTypes?: string[];
  lastUpdated?: Date;
}

export interface DataSourceTooltipProps {
  dataSource: DataSource;
  children: React.ReactNode;
  side?: 'top' | 'right' | 'bottom' | 'left';
  align?: 'start' | 'center' | 'end';
  className?: string;
  showBadge?: boolean;
  compact?: boolean;
}

const DataSourceTooltip: React.FC<DataSourceTooltipProps> = ({
  dataSource,
  children,
  side = 'top',
  align = 'center',
  className = '',
  showBadge = true,
  compact = false
}) => {
  // Función para obtener el icono según el tipo
  const getTypeIcon = (type: DataSource['type']) => {
    switch (type) {
      case 'api':
        return <Globe className="h-3 w-3" />;
      case 'blockchain':
        return <Database className="h-3 w-3" />;
      case 'web':
        return <Globe className="h-3 w-3" />;
      case 'database':
        return <Database className="h-3 w-3" />;
      case 'ai':
        return <Zap className="h-3 w-3" />;
      case 'social':
        return <TrendingUp className="h-3 w-3" />;
      default:
        return <Info className="h-3 w-3" />;
    }
  };

  // Función para obtener el color según la confiabilidad
  const getReliabilityColor = (reliability: DataSource['reliability']) => {
    switch (reliability) {
      case 'high':
        return 'text-green-600 bg-green-100';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'low':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  // Función para obtener el icono de confiabilidad
  const getReliabilityIcon = (reliability: DataSource['reliability']) => {
    switch (reliability) {
      case 'high':
        return <CheckCircle className="h-3 w-3" />;
      case 'medium':
        return <Clock className="h-3 w-3" />;
      case 'low':
        return <AlertTriangle className="h-3 w-3" />;
      default:
        return <Info className="h-3 w-3" />;
    }
  };

  // Función para obtener el color del pricing
  const getPricingColor = (pricing: DataSource['pricing']) => {
    switch (pricing) {
      case 'free':
        return 'text-green-600 bg-green-100';
      case 'freemium':
        return 'text-blue-600 bg-blue-100';
      case 'paid':
        return 'text-orange-600 bg-orange-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  // Función para formatear la fecha
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild className={className}>
          <div className="inline-flex items-center gap-1 cursor-help">
            {children}
            {showBadge && (
              <div className="flex items-center gap-1">
                <Info className="h-3 w-3 text-muted-foreground" />
                <Badge variant="outline" className="text-xs px-1 py-0">
                  {dataSource.name}
                </Badge>
              </div>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent
          side={side}
          align={align}
          className="max-w-sm p-4 space-y-3"
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              {getTypeIcon(dataSource.type)}
              <h4 className="font-semibold text-sm">{dataSource.name}</h4>
            </div>
            <div className="flex items-center gap-1">
              {getReliabilityIcon(dataSource.reliability)}
              <Badge className={`text-xs px-2 py-0 ${getReliabilityColor(dataSource.reliability)}`}>
                {dataSource.reliability === 'high' ? 'Alta' :
                 dataSource.reliability === 'medium' ? 'Media' : 'Baja'}
              </Badge>
            </div>
          </div>

          {/* Descripción */}
          <p className="text-xs text-muted-foreground leading-relaxed">
            {dataSource.description}
          </p>

          {!compact && (
            <>
              <Separator />
              
              {/* Información técnica */}
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="font-medium text-muted-foreground">Tipo:</span>
                    <div className="flex items-center gap-1 mt-1">
                      {getTypeIcon(dataSource.type)}
                      <span className="capitalize">{dataSource.type}</span>
                    </div>
                  </div>
                  <div>
                    <span className="font-medium text-muted-foreground">Actualización:</span>
                    <div className="flex items-center gap-1 mt-1">
                      <Clock className="h-3 w-3" />
                      <span>{dataSource.updateFrequency}</span>
                    </div>
                  </div>
                </div>

                {/* Autenticación y Pricing */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="font-medium text-muted-foreground">Autenticación:</span>
                    <div className="flex items-center gap-1 mt-1">
                      {dataSource.requiresAuth ? (
                        <>
                          <Key className="h-3 w-3 text-orange-500" />
                          <span>Requerida</span>
                        </>
                      ) : (
                        <>
                          <Shield className="h-3 w-3 text-green-500" />
                          <span>No requerida</span>
                        </>
                      )}
                    </div>
                  </div>
                  {dataSource.pricing && (
                    <div>
                      <span className="font-medium text-muted-foreground">Precio:</span>
                      <div className="mt-1">
                        <Badge className={`text-xs px-2 py-0 ${getPricingColor(dataSource.pricing)}`}>
                          {dataSource.pricing === 'free' ? 'Gratis' :
                           dataSource.pricing === 'freemium' ? 'Freemium' : 'Pago'}
                        </Badge>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Tipos de datos */}
              {dataSource.dataTypes && dataSource.dataTypes.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <span className="font-medium text-xs text-muted-foreground">Tipos de datos:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {dataSource.dataTypes.map((type, index) => (
                        <Badge key={index} variant="outline" className="text-xs px-1 py-0">
                          {type}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Características */}
              {dataSource.features && dataSource.features.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <span className="font-medium text-xs text-muted-foreground">Características:</span>
                    <ul className="mt-1 space-y-1">
                      {dataSource.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-1 text-xs">
                          <CheckCircle className="h-2 w-2 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              )}

              {/* Limitaciones */}
              {dataSource.limitations && dataSource.limitations.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <span className="font-medium text-xs text-muted-foreground">Limitaciones:</span>
                    <ul className="mt-1 space-y-1">
                      {dataSource.limitations.map((limitation, index) => (
                        <li key={index} className="flex items-start gap-1 text-xs">
                          <AlertTriangle className="h-2 w-2 text-yellow-500 mt-0.5 flex-shrink-0" />
                          <span>{limitation}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              )}

              {/* Enlaces */}
              {(dataSource.website || dataSource.apiDocumentation) && (
                <>
                  <Separator />
                  <div className="flex flex-wrap gap-2">
                    {dataSource.website && (
                      <a
                        href={dataSource.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800"
                      >
                        <ExternalLink className="h-3 w-3" />
                        Sitio web
                      </a>
                    )}
                    {dataSource.apiDocumentation && (
                      <a
                        href={dataSource.apiDocumentation}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800"
                      >
                        <ExternalLink className="h-3 w-3" />
                        Documentación
                      </a>
                    )}
                  </div>
                </>
              )}

              {/* Última actualización */}
              {dataSource.lastUpdated && (
                <>
                  <Separator />
                  <div className="text-xs text-muted-foreground">
                    Última actualización: {formatDate(dataSource.lastUpdated)}
                  </div>
                </>
              )}
            </>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default DataSourceTooltip;