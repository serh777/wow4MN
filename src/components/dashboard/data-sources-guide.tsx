'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Info, Database, Globe, Zap, Shield, BarChart3, 
  Users, Link, Search, Award, Crown, Gamepad2,
  CheckCircle, AlertTriangle, ExternalLink, 
  HelpCircle, BookOpen, Settings, Eye, X, Activity,
  Loader2, TrendingUp, Clock, DollarSign, Wifi
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
  onClose?: () => void;
}

export function DataSourcesGuide({ className = '', selectedTool, onClose }: DataSourcesGuideProps) {
  const [selectedSource, setSelectedSource] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [animatedCounts, setAnimatedCounts] = useState({ api: 0, indexer: 0, hybrid: 0 });

  // Simular carga inicial y animar contadores
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    
    // Animar contadores
    const apiCount = DATA_SOURCES.filter(s => s.type === 'api').length;
    const indexerCount = DATA_SOURCES.filter(s => s.type === 'indexer').length;
    const hybridCount = DATA_SOURCES.filter(s => s.type === 'hybrid').length;
    
    const animateCounters = () => {
      let step = 0;
      const interval = setInterval(() => {
        step++;
        setAnimatedCounts({
          api: Math.min(step, apiCount),
          indexer: Math.min(step, indexerCount),
          hybrid: Math.min(step, hybridCount)
        });
        
        if (step >= Math.max(apiCount, indexerCount, hybridCount)) {
          clearInterval(interval);
        }
      }, 100);
    };
    
    setTimeout(animateCounters, 600);
    
    return () => clearTimeout(timer);
  }, []);

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
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className={`${className} relative overflow-hidden`}>
          {isLoading && (
            <motion.div
              className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="flex items-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
                <span className="text-sm text-gray-600">Cargando fuentes de datos...</span>
              </div>
            </motion.div>
          )}
          
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
                >
                  <BookOpen className="h-5 w-5 text-blue-500" />
                </motion.div>
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
              {onClose && (
                <Button
                  variant="ghost"
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
          
          {selectedTool && (
            <div className="text-sm text-gray-600">
              Mostrando fuentes para: <Badge variant="outline">{selectedTool}</Badge>
            </div>
          )}
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Resumen de tipos */}
          <motion.div 
            className="grid grid-cols-3 gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Tooltip>
              <TooltipTrigger asChild>
                <motion.div
                  whileHover={{ scale: 1.02, y: -2 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Card className="p-3 cursor-help hover:shadow-md transition-shadow border-blue-200 bg-blue-50/50">
                    <div className="flex items-center gap-2">
                      <motion.div
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.5 }}
                      >
                        <Globe className="h-4 w-4 text-blue-500" />
                      </motion.div>
                      <div>
                        <div className="font-medium text-sm text-blue-900">APIs Externas</div>
                        <motion.div 
                          className="text-lg font-bold text-blue-700"
                          key={animatedCounts.api}
                          initial={{ scale: 1.2, opacity: 0.5 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ duration: 0.3 }}
                        >
                          {animatedCounts.api} fuentes
                        </motion.div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              </TooltipTrigger>
              <TooltipContent>
                <p>APIs de terceros como Etherscan, Alchemy, Google</p>
                <p>Datos en tiempo real con límites de rate</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <motion.div
                  whileHover={{ scale: 1.02, y: -2 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Card className="p-3 cursor-help hover:shadow-md transition-shadow border-green-200 bg-green-50/50">
                    <div className="flex items-center gap-2">
                      <motion.div
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.5 }}
                      >
                        <Database className="h-4 w-4 text-green-600" />
                      </motion.div>
                      <div>
                        <div className="font-medium text-sm text-green-900">Indexadores</div>
                        <motion.div 
                          className="text-lg font-bold text-green-700"
                          key={animatedCounts.indexer}
                          initial={{ scale: 1.2, opacity: 0.5 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ duration: 0.3 }}
                        >
                          {animatedCounts.indexer} fuentes
                        </motion.div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Sistemas propios de indexación blockchain</p>
                <p>Datos históricos completos sin límites</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <motion.div
                  whileHover={{ scale: 1.02, y: -2 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Card className="p-3 cursor-help hover:shadow-md transition-shadow border-purple-200 bg-purple-50/50">
                    <div className="flex items-center gap-2">
                      <motion.div
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.5 }}
                      >
                        <Zap className="h-4 w-4 text-purple-600" />
                      </motion.div>
                      <div>
                        <div className="font-medium text-sm text-purple-900">Híbridos</div>
                        <motion.div 
                          className="text-lg font-bold text-purple-700"
                          key={animatedCounts.hybrid}
                          initial={{ scale: 1.2, opacity: 0.5 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ duration: 0.3 }}
                        >
                          {animatedCounts.hybrid} fuentes
                        </motion.div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Combinación de APIs y indexación propia</p>
                <p>Flexibilidad y redundancia de datos</p>
              </TooltipContent>
            </Tooltip>
          </motion.div>

          <Separator />

          {/* Lista de fuentes */}
          <motion.div 
            className="space-y-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <AnimatePresence>
              {filteredSources.map((source, index) => (
                <motion.div
                  key={source.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  whileHover={{ scale: 1.01, y: -2 }}
                >
                  <Card 
                    className={`transition-all cursor-pointer border-l-4 border-l-transparent hover:border-l-blue-400 ${
                      selectedSource === source.id ? 'ring-2 ring-blue-500' : 'hover:shadow-lg'
                    }`}
                    onClick={() => setSelectedSource(selectedSource === source.id ? null : source.id)}
                  >
                    <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="flex flex-col items-center gap-1">
                        <motion.div
                          whileHover={{ rotate: 360, scale: 1.1 }}
                          transition={{ duration: 0.5 }}
                        >
                          {getTypeIcon(source.type)}
                        </motion.div>
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          transition={{ duration: 0.2 }}
                        >
                          {getStatusIcon(source.status)}
                        </motion.div>
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
                  <AnimatePresence>
                    {selectedSource === source.id && showDetails && (
                      <motion.div 
                        className="mt-4 pt-4 border-t space-y-3"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <motion.div 
                          className="grid grid-cols-1 md:grid-cols-2 gap-4"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: 0.1 }}
                        >
                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            transition={{ duration: 0.2 }}
                          >
                            <h5 className="font-medium text-sm mb-2 flex items-center gap-1">
                              <motion.div
                                animate={{ rotate: [0, 10, -10, 0] }}
                                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                              >
                                <ExternalLink className="h-3 w-3 text-gray-400" />
                              </motion.div>
                              Endpoints disponibles:
                            </h5>
                            <div className="grid grid-cols-1 gap-2">
                              {source.endpoints.map((endpoint, index) => (
                                <motion.div 
                                  key={index} 
                                  className="flex items-center gap-2 text-sm bg-gray-50 p-2 rounded hover:bg-gray-100 transition-colors"
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ duration: 0.3, delay: index * 0.05 }}
                                  whileHover={{ scale: 1.02 }}
                                >
                                  <ExternalLink className="h-3 w-3 text-gray-400" />
                                  <span className="font-mono text-xs">{endpoint}</span>
                                </motion.div>
                              ))}
                            </div>
                          </motion.div>

                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            transition={{ duration: 0.2 }}
                          >
                            <h5 className="font-medium text-sm mb-2 flex items-center gap-1">
                              <motion.div
                                animate={{ scale: [1, 1.1, 1] }}
                                transition={{ duration: 2, repeat: Infinity, repeatDelay: 2 }}
                              >
                                <BarChart3 className="h-3 w-3 text-blue-500" />
                              </motion.div>
                              Tipos de datos:
                            </h5>
                            <div className="flex flex-wrap gap-1">
                              {source.dataTypes.map((dataType, index) => (
                                <motion.div
                                  key={index}
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{ duration: 0.3, delay: index * 0.05 }}
                                  whileHover={{ scale: 1.1 }}
                                >
                                  <Badge variant="outline" className="text-xs">
                                    {dataType}
                                  </Badge>
                                </motion.div>
                              ))}
                            </div>
                          </motion.div>
                        </motion.div>

                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: 0.2 }}
                          whileHover={{ scale: 1.01 }}
                        >
                          <h5 className="font-medium text-sm mb-2 flex items-center gap-1">
                            <motion.div
                              animate={{ rotate: [0, 360] }}
                              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                            >
                              <Settings className="h-3 w-3 text-purple-500" />
                            </motion.div>
                            Herramientas que lo usan:
                          </h5>
                          <div className="flex flex-wrap gap-1">
                            {source.tools.map((tool, index) => (
                              <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.3, delay: index * 0.05 }}
                                whileHover={{ scale: 1.1, rotate: 2 }}
                              >
                                <Badge variant="secondary" className="text-xs">
                                  {tool}
                                </Badge>
                              </motion.div>
                            ))}
                          </div>
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {filteredSources.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Database className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No se encontraron fuentes de datos para la herramienta seleccionada.</p>
            </div>
          )}

          {/* Información adicional */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            whileHover={{ scale: 1.01 }}
          >
            <Card className="bg-gradient-to-r from-blue-50/50 to-purple-50/50 border-blue-200 hover:shadow-lg transition-all duration-300">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <motion.div 
                    className="p-2 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg"
                    animate={{ 
                      rotate: [0, 5, -5, 0],
                      scale: [1, 1.05, 1]
                    }}
                    transition={{ 
                      duration: 4, 
                      repeat: Infinity, 
                      repeatDelay: 2 
                    }}
                  >
                    <Info className="h-5 w-5 text-blue-600" />
                  </motion.div>
                  <div className="text-sm">
                    <motion.h5 
                      className="font-medium text-blue-900 mb-1 flex items-center gap-2"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.7 }}
                    >
                      ¿Cómo funcionan las fuentes de datos?
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                      >
                        <Activity className="h-4 w-4 text-purple-500" />
                      </motion.div>
                    </motion.h5>
                    <motion.ul 
                      className="text-blue-800 space-y-1 text-xs"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.8 }}
                    >
                      <motion.li
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.9 }}
                      >
                        • <strong>APIs Externas:</strong> Consultan datos en tiempo real de servicios terceros
                      </motion.li>
                      <motion.li
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 1.0 }}
                      >
                        • <strong>Indexadores:</strong> Procesan y almacenan datos blockchain localmente
                      </motion.li>
                      <motion.li
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 1.1 }}
                      >
                        • <strong>Híbridos:</strong> Combinan ambos enfoques para mayor confiabilidad
                      </motion.li>
                      <motion.li
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 1.2 }}
                      >
                        • <strong>Rate Limits:</strong> Límites de velocidad para evitar sobrecarga
                      </motion.li>
                    </motion.ul>
                    
                    <motion.div 
                      className="mt-3 flex items-center gap-4 text-xs text-blue-700"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5, delay: 1.3 }}
                    >
                      <div className="flex items-center gap-1">
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                        >
                          <Wifi className="h-3 w-3" />
                        </motion.div>
                        <span>Tiempo real</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <motion.div
                          animate={{ rotate: [0, 360] }}
                          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        >
                          <TrendingUp className="h-3 w-3" />
                        </motion.div>
                        <span>Alta precisión</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <motion.div
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          <Shield className="h-3 w-3" />
                        </motion.div>
                        <span>Seguro</span>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
    </TooltipProvider>
  );
}

