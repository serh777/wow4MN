'use client';

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  Info,
  ChevronDown,
  ChevronUp,
  Database,
  Globe,
  Zap,
  Shield,
  Key,
  Clock,
  ExternalLink,
  CheckCircle,
  AlertTriangle,
  TrendingUp
} from 'lucide-react';
import DataSourceTooltip, { DataSource } from './data-source-tooltip';
import { useDataSourceTooltips } from '@/hooks/use-data-source-tooltips';

export interface DataSourcesInfoProps {
  toolId: string;
  toolName?: string;
  className?: string;
  variant?: 'default' | 'compact' | 'detailed';
  showStats?: boolean;
  collapsible?: boolean;
  defaultExpanded?: boolean;
}

const DataSourcesInfo: React.FC<DataSourcesInfoProps> = ({
  toolId,
  toolName,
  className = '',
  variant = 'default',
  showStats = true,
  collapsible = false,
  defaultExpanded = false
}) => {
  const { getToolDataSources, getSourceStats } = useDataSourceTooltips();
  const [isExpanded, setIsExpanded] = React.useState(defaultExpanded);
  
  const dataSources = getToolDataSources(toolId);
  const stats = getSourceStats();

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

  if (dataSources.length === 0) {
    return (
      <div className={`text-sm text-muted-foreground ${className}`}>
        <div className="flex items-center gap-2">
          <Info className="h-4 w-4" />
          <span>No hay fuentes de datos configuradas para esta herramienta.</span>
        </div>
      </div>
    );
  }

  // Variante compacta
  if (variant === 'compact') {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <Info className="h-3 w-3 text-muted-foreground" />
        <span className="text-xs text-muted-foreground">Fuentes:</span>
        <div className="flex items-center gap-1">
          {dataSources.slice(0, 3).map((source, index) => (
            <DataSourceTooltip key={index} dataSource={source} compact>
              <Badge variant="outline" className="text-xs px-1 py-0 cursor-help">
                {source.name}
              </Badge>
            </DataSourceTooltip>
          ))}
          {dataSources.length > 3 && (
            <Badge variant="outline" className="text-xs px-1 py-0">
              +{dataSources.length - 3}
            </Badge>
          )}
        </div>
      </div>
    );
  }

  // Contenido principal
  const content = (
    <div className="space-y-4">
      {/* Estadísticas generales */}
      {showStats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="text-center">
            <div className="text-lg font-semibold text-primary">{dataSources.length}</div>
            <div className="text-xs text-muted-foreground">Fuentes</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-green-600">
              {dataSources.filter(s => s.reliability === 'high').length}
            </div>
            <div className="text-xs text-muted-foreground">Alta confiabilidad</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-blue-600">
              {dataSources.filter(s => s.pricing === 'free' || !s.requiresAuth).length}
            </div>
            <div className="text-xs text-muted-foreground">Gratuitas</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-orange-600">
              {dataSources.filter(s => s.requiresAuth).length}
            </div>
            <div className="text-xs text-muted-foreground">Requieren auth</div>
          </div>
        </div>
      )}

      <Separator />

      {/* Lista de fuentes de datos */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium flex items-center gap-2">
          <Database className="h-4 w-4" />
          Fuentes de datos utilizadas
        </h4>
        
        <div className="grid gap-3">
          {dataSources.map((source, index) => (
            <DataSourceTooltip key={index} dataSource={source} showBadge={false}>
              <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 cursor-help transition-colors">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    {getTypeIcon(source.type)}
                    <span className="font-medium text-sm">{source.name}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge className={`text-xs px-2 py-0 ${getReliabilityColor(source.reliability)}`}>
                      {source.reliability === 'high' ? 'Alta' :
                       source.reliability === 'medium' ? 'Media' : 'Baja'}
                    </Badge>
                    
                    {source.pricing && (
                      <Badge className={`text-xs px-2 py-0 ${getPricingColor(source.pricing)}`}>
                        {source.pricing === 'free' ? 'Gratis' :
                         source.pricing === 'freemium' ? 'Freemium' : 'Pago'}
                      </Badge>
                    )}
                    
                    {source.requiresAuth && (
                      <div className="flex items-center gap-1 text-orange-600">
                        <Key className="h-3 w-3" />
                        <span className="text-xs">Auth</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span className="text-xs">{source.updateFrequency}</span>
                  </div>
                  
                  {(source.website || source.apiDocumentation) && (
                    <div className="flex items-center gap-1">
                      {source.website && (
                        <a
                          title={`Visit ${source.name} website`}
                          href={source.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </DataSourceTooltip>
          ))}
        </div>
      </div>

      {/* Información adicional para variante detallada */}
      {variant === 'detailed' && (
        <>
          <Separator />
          
          <div className="space-y-3">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <Info className="h-4 w-4" />
              Información adicional
            </h4>
            
            <div className="text-xs text-muted-foreground space-y-2">
              <div className="flex items-start gap-2">
                <CheckCircle className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                <span>
                  Los datos se obtienen de múltiples fuentes para garantizar precisión y completitud.
                </span>
              </div>
              
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-3 w-3 text-yellow-500 mt-0.5 flex-shrink-0" />
                <span>
                  Algunas fuentes pueden requerir configuración de API keys para funcionalidad completa.
                </span>
              </div>
              
              <div className="flex items-start gap-2">
                <Shield className="h-3 w-3 text-blue-500 mt-0.5 flex-shrink-0" />
                <span>
                  Todas las consultas se realizan de forma segura y respetando los límites de las APIs.
                </span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );

  // Si es colapsible, envolver en Collapsible
  if (collapsible) {
    return (
      <Card className={className}>
        <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Database className="h-4 w-4" />
                    Fuentes de datos{toolName && ` - ${toolName}`}
                  </CardTitle>
                  <CardDescription>
                    {dataSources.length} fuente{dataSources.length !== 1 ? 's' : ''} configurada{dataSources.length !== 1 ? 's' : ''}
                  </CardDescription>
                </div>
                {isExpanded ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          
          <CollapsibleContent>
            <CardContent>
              {content}
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>
    );
  }

  // Variante por defecto
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Database className="h-4 w-4" />
          Fuentes de datos{toolName && ` - ${toolName}`}
        </CardTitle>
        <CardDescription>
          {dataSources.length} fuente{dataSources.length !== 1 ? 's' : ''} configurada{dataSources.length !== 1 ? 's' : ''}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {content}
      </CardContent>
    </Card>
  );
};

export default DataSourcesInfo;