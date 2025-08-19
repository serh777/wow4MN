'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Info, Database, Globe, Zap, Shield, BarChart3, 
  Users, Link, Search, Award, Crown, Gamepad2,
  CheckCircle, AlertTriangle, ExternalLink, 
  HelpCircle, BookOpen, Settings, Eye
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface DataSource {
  id: string;
  name: string;
  type: 'api' | 'indexer' | 'hybrid';
  status: 'active' | 'inactive' | 'error';
  description: string;
  tools: string[];
  endpoints: string[];
  rateLimit?: string;
  cost?: string;
  reliability: 'high' | 'medium' | 'low';
  dataTypes: string[];
}

const DATA_SOURCES: DataSource[] = [
  {
    id: 'etherscan',
    name: 'Etherscan API',
    type: 'api',
    status: 'active',
    description: 'API oficial de Etherscan para datos de blockchain Ethereum',
    tools: ['IA Analysis', 'Blockchain Analysis', 'Performance Analysis', 'Security Audit'],
    endpoints: ['Account API', 'Contract API', 'Transaction API', 'Block API'],
    rateLimit: '5 req/sec',
    cost: 'Gratis hasta 100K req/día',
    reliability: 'high',
    dataTypes: ['Transacciones', 'Balances', 'Contratos', 'Tokens', 'NFTs']
  },
  {
    id: 'alchemy',
    name: 'Alchemy API',
    type: 'api',
    status: 'active',
    description: 'Infraestructura Web3 avanzada con APIs optimizadas',
    tools: ['IA Analysis', 'Blockchain Analysis', 'NFT Tracking', 'Performance Analysis'],
    endpoints: ['Enhanced API', 'NFT API', 'Webhook API', 'Debug API'],
    rateLimit: '330 CU/sec',
    cost: 'Gratis hasta 300M CU/mes',
    reliability: 'high',
    dataTypes: ['Blockchain Data', 'NFT Metadata', 'Token Transfers', 'Smart Contracts']
  },
  {
    id: 'anthropic',
    name: 'Anthropic Claude',
    type: 'api',
    status: 'active',
    description: 'IA avanzada para análisis y generación de insights',
    tools: ['IA Analysis', 'Security Audit', 'Content Authenticity', 'Authority Tracking'],
    endpoints: ['Messages API', 'Completions API'],
    rateLimit: '50 req/min',
    cost: '$15/1M tokens',
    reliability: 'high',
    dataTypes: ['Análisis de Código', 'Insights', 'Recomendaciones', 'Auditorías']
  },
  {
    id: 'google-apis',
    name: 'Google APIs',
    type: 'api',
    status: 'active',
    description: 'Suite de APIs de Google para SEO y análisis web',
    tools: ['Keywords Analysis', 'Backlinks Analysis', 'Performance Analysis'],
    endpoints: ['Search Console API', 'PageSpeed API', 'Analytics API'],
    rateLimit: '100 req/100sec',
    cost: 'Gratis con límites',
    reliability: 'high',
    dataTypes: ['Keywords', 'Backlinks', 'Performance', 'Search Data']
  },
  {
    id: 'social-web3',
    name: 'Social Web3 APIs',
    type: 'hybrid',
    status: 'active',
    description: 'Agregador de múltiples plataformas sociales Web3',
    tools: ['Social Web3'],
    endpoints: ['Lens Protocol', 'Farcaster', 'Mastodon', 'Hive', 'Mirror.xyz'],
    rateLimit: 'Variable por plataforma',
    cost: 'Mayormente gratis',
    reliability: 'medium',
    dataTypes: ['Perfiles', 'Posts', 'Followers', 'Engagement', 'Contenido']
  },
  {
    id: 'custom-indexer',
    name: 'Indexador Personalizado',
    type: 'indexer',
    status: 'active',
    description: 'Sistema de indexación propio para datos específicos',
    tools: ['Blockchain Analysis', 'NFT Tracking', 'Ecosystem Interactions'],
    endpoints: ['Block Indexer', 'Transaction Indexer', 'Event Indexer'],
    rateLimit: 'Sin límites',
    cost: 'Costo de infraestructura',
    reliability: 'medium',
    dataTypes: ['Bloques', 'Transacciones', 'Eventos', 'Estados', 'Logs']
  },
  {
    id: 'security-apis',
    name: 'Security APIs',
    type: 'api',
    status: 'active',
    description: 'APIs especializadas en seguridad blockchain',
    tools: ['Security Audit'],
    endpoints: ['Vulnerability Scanner', 'Code Analysis', 'Risk Assessment'],
    rateLimit: '10 req/min',
    cost: 'Variable',
    reliability: 'high',
    dataTypes: ['Vulnerabilidades', 'Riesgos', 'Auditorías', 'Análisis de Código']
  },
  {
    id: 'metaverse-apis',
    name: 'Metaverse APIs',
    type: 'api',
    status: 'active',
    description: 'APIs para análisis de contenido metaverso',
    tools: ['Metaverse Optimizer'],
    endpoints: ['VRChat API', 'Decentraland API', 'Sandbox API'],
    rateLimit: 'Variable',
    cost: 'Variable',
    reliability: 'medium',
    dataTypes: ['Assets 3D', 'Experiencias', 'Usuarios', 'Métricas VR/AR']
  }
];

interface DataSourcesGuideProps {
  className?: string;
  selectedTool?: string;
}

export function DataSourcesGuide({ className = '', selectedTool }: DataSourcesGuideProps) {
  const [selectedSource, setSelectedSource] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'inactive': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'error': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default: return <HelpCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'api': return <Globe className="h-4 w-4 text-blue-500" />;
      case 'indexer': return <Database className="h-4 w-4 text-purple-500" />;
      case 'hybrid': return <Zap className="h-4 w-4 text-orange-500" />;
      default: return <Settings className="h-4 w-4 text-gray-500" />;
    }
  };

  const getReliabilityColor = (reliability: string) => {
    switch (reliability) {
      case 'high': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredSources = selectedTool 
    ? DATA_SOURCES.filter(source => 
        source.tools.some(tool => 
          tool.toLowerCase().includes(selectedTool.toLowerCase())
        )
      )
    : DATA_SOURCES;

  return (
    <TooltipProvider>
      <Card className={`${className}`}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-blue-500" />
              <CardTitle className="text-lg">Guía de Fuentes de Datos</CardTitle>
            </div>
            <div className="flex items-center gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowDetails(!showDetails)}
                  >
                    <Eye className="h-4 w-4" />
                    {showDetails ? 'Ocultar' : 'Detalles'}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Mostrar/ocultar información detallada de las fuentes</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
          
          {selectedTool && (
            <div className="text-sm text-gray-600">
              Mostrando fuentes para: <Badge variant="outline">{selectedTool}</Badge>
            </div>
          )}
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Resumen de tipos */}
          <div className="grid grid-cols-3 gap-4">
            <Tooltip>
              <TooltipTrigger asChild>
                <Card className="p-3 cursor-help">
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-blue-500" />
                    <div>
                      <div className="font-medium text-sm">APIs Externas</div>
                      <div className="text-xs text-gray-500">
                        {DATA_SOURCES.filter(s => s.type === 'api').length} fuentes
                      </div>
                    </div>
                  </div>
                </Card>
              </TooltipTrigger>
              <TooltipContent>
                <p>APIs de terceros como Etherscan, Alchemy, Google</p>
                <p>Datos en tiempo real con límites de rate</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Card className="p-3 cursor-help">
                  <div className="flex items-center gap-2">
                    <Database className="h-4 w-4 text-purple-500" />
                    <div>
                      <div className="font-medium text-sm">Indexadores</div>
                      <div className="text-xs text-gray-500">
                        {DATA_SOURCES.filter(s => s.type === 'indexer').length} fuentes
                      </div>
                    </div>
                  </div>
                </Card>
              </TooltipTrigger>
              <TooltipContent>
                <p>Sistemas propios de indexación blockchain</p>
                <p>Datos históricos completos sin límites</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Card className="p-3 cursor-help">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-orange-500" />
                    <div>
                      <div className="font-medium text-sm">Híbridos</div>
                      <div className="text-xs text-gray-500">
                        {DATA_SOURCES.filter(s => s.type === 'hybrid').length} fuentes
                      </div>
                    </div>
                  </div>
                </Card>
              </TooltipTrigger>
              <TooltipContent>
                <p>Combinación de APIs y indexación propia</p>
                <p>Flexibilidad y redundancia de datos</p>
              </TooltipContent>
            </Tooltip>
          </div>

          <Separator />

          {/* Lista de fuentes */}
          <div className="space-y-3">
            {filteredSources.map((source) => (
              <Card 
                key={source.id} 
                className={`transition-all cursor-pointer ${
                  selectedSource === source.id ? 'ring-2 ring-blue-500' : 'hover:shadow-md'
                }`}
                onClick={() => setSelectedSource(selectedSource === source.id ? null : source.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="flex flex-col items-center gap-1">
                        {getTypeIcon(source.type)}
                        {getStatusIcon(source.status)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-gray-900">{source.name}</h4>
                          <Badge variant="outline" className="text-xs">
                            {source.type}
                          </Badge>
                          <Badge className={`text-xs ${getReliabilityColor(source.reliability)}`}>
                            {source.reliability}
                          </Badge>
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-2">{source.description}</p>
                        
                        <div className="flex flex-wrap gap-1 mb-2">
                          {source.tools.slice(0, 3).map((tool, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {tool}
                            </Badge>
                          ))}
                          {source.tools.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{source.tools.length - 3} más
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      {source.cost && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Badge variant="outline" className="text-xs">
                              {source.cost.includes('Gratis') ? '💰 Gratis' : '💳 Pago'}
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{source.cost}</p>
                          </TooltipContent>
                        </Tooltip>
                      )}
                      
                      {source.rateLimit && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Badge variant="outline" className="text-xs">
                              ⚡ {source.rateLimit}
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Límite de velocidad: {source.rateLimit}</p>
                          </TooltipContent>
                        </Tooltip>
                      )}
                    </div>
                  </div>

                  {/* Detalles expandidos */}
                  {selectedSource === source.id && showDetails && (
                    <div className="mt-4 pt-4 border-t space-y-3">
                      <div>
                        <h5 className="font-medium text-sm mb-2">Endpoints disponibles:</h5>
                        <div className="grid grid-cols-2 gap-2">
                          {source.endpoints.map((endpoint, index) => (
                            <div key={index} className="flex items-center gap-2 text-sm">
                              <ExternalLink className="h-3 w-3 text-gray-400" />
                              <span>{endpoint}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h5 className="font-medium text-sm mb-2">Tipos de datos:</h5>
                        <div className="flex flex-wrap gap-1">
                          {source.dataTypes.map((dataType, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {dataType}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h5 className="font-medium text-sm mb-2">Herramientas que lo usan:</h5>
                        <div className="flex flex-wrap gap-1">
                          {source.tools.map((tool, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {tool}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredSources.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Database className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No se encontraron fuentes de datos para la herramienta seleccionada.</p>
            </div>
          )}

          {/* Información adicional */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <h5 className="font-medium text-blue-900 mb-1">¿Cómo funcionan las fuentes de datos?</h5>
                  <ul className="text-blue-800 space-y-1 text-xs">
                    <li>• <strong>APIs Externas:</strong> Consultan datos en tiempo real de servicios terceros</li>
                    <li>• <strong>Indexadores:</strong> Procesan y almacenan datos blockchain localmente</li>
                    <li>• <strong>Híbridos:</strong> Combinan ambos enfoques para mayor confiabilidad</li>
                    <li>• <strong>Rate Limits:</strong> Límites de velocidad para evitar sobrecarga</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}

