'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/components/ui/use-toast';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

import { Web3Search } from '@/components/search/web3-search';
import { Breadcrumbs } from '@/components/navigation/breadcrumbs';
import { QuickAccessMenu } from '@/components/navigation/quick-access-menu';
import { KeyboardShortcuts } from '@/components/navigation/keyboard-shortcuts';
import { SystemStatusDashboard } from '@/components/system/system-status-dashboard';
import { ProjectManager } from '@/components/projects/project-manager';
import { DataSourcesGuide } from '@/components/dashboard/data-sources-guide';
import '@/styles/dashboard.css';
import { UnifiedWalletConnect } from '@/components/wallet/unified-wallet-connect';
import { useAuth } from '@/contexts/AuthContext';
import { useWeb3 } from '@/contexts/Web3Context';
import { useIndexerOrchestrator, useIndexerStatus, IndexerRequirement } from '@/hooks/useIndexerOrchestrator';
import { IndexerStatusCard } from '@/components/dashboard/indexer-status-card';
import { dashboardOrchestrator, AnalysisRequest } from '@/services/dashboard-orchestrator';
import { AIAssistantWidget } from '@/components/ai/ai-assistant-widget';
import APIStatusDashboard from '@/components/api/api-status-dashboard';
// Sidebar removido - ya se renderiza en layout.tsx
import { useRouter } from 'next/navigation';
import { 
  Loader2, LogOut, User, MessageCircle, Info, Target, Zap, Shield, 
  BarChart3, Globe, Link, Users, Search, Database, Cpu, Award, 
  Palette, Activity, Eye, ChevronLeft, ChevronRight, 
  Menu, X, CheckCircle, AlertTriangle, Sparkles, TrendingUp,
  Brain, FileText, Hash, GitBranch, Network, Gem, Lock, Settings
} from 'lucide-react';

// Definición de todas las herramientas disponibles
const AVAILABLE_TOOLS = [
  {
    id: 'ai-assistant',
    name: 'IA Análisis',
    description: 'Análisis avanzado con inteligencia artificial',
    icon: Brain,
    category: 'AI',
    color: 'from-purple-500 to-indigo-500'
  },
  {
    id: 'metadata',
    name: 'Metadatos',
    description: 'Análisis de metadatos y estructura',
    icon: Database,
    category: 'Web3',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'content',
    name: 'Contenido',
    description: 'Auditoría de contenido y calidad',
    icon: FileText,
    category: 'Web3',
    color: 'from-green-500 to-emerald-500'
  },
  {
    id: 'keywords',
    name: 'Keywords',
    description: 'Análisis de palabras clave',
    icon: Search,
    category: 'SEO',
    color: 'from-yellow-500 to-orange-500'
  },
  {
    id: 'performance',
    name: 'Rendimiento',
    description: 'Análisis de velocidad y optimización',
    icon: Zap,
    category: 'Technical',
    color: 'from-red-500 to-pink-500'
  },
  {
    id: 'security',
    name: 'Seguridad',
    description: 'Auditoría de seguridad completa',
    icon: Shield,
    category: 'Security',
    color: 'from-gray-500 to-slate-500'
  },
  {
    id: 'backlinks',
    name: 'Backlinks',
    description: 'Análisis de enlaces entrantes',
    icon: Link,
    category: 'Web3',
    color: 'from-teal-500 to-cyan-500'
  },
  {
    id: 'links',
    name: 'Enlaces',
    description: 'Verificación de enlaces internos',
    icon: Link,
    category: 'Web3',
    color: 'from-indigo-500 to-purple-500'
  },
  {
    id: 'competition',
    name: 'Competencia',
    description: 'Análisis competitivo del mercado',
    icon: BarChart3,
    category: 'Market',
    color: 'from-orange-500 to-red-500'
  },
  {
    id: 'blockchain',
    name: 'Blockchain',
    description: 'Análisis de datos blockchain',
    icon: Globe,
    category: 'Web3',
    color: 'from-violet-500 to-purple-500'
  },
  {
    id: 'smart-contract',
    name: 'Smart Contract',
    description: 'Análisis de contratos inteligentes',
    icon: Cpu,
    category: 'Web3',
    color: 'from-cyan-500 to-blue-500'
  },
  {
    id: 'social-web3',
    name: 'Social Web3',
    description: 'Análisis de redes sociales descentralizadas',
    icon: Users,
    category: 'Social',
    color: 'from-pink-500 to-rose-500'
  },
  {
    id: 'authority-tracking',
    name: 'Autoridad Descentralizada',
    description: 'Seguimiento de autoridad en ecosistemas',
    icon: Award,
    category: 'Web3',
    color: 'from-amber-500 to-yellow-500'
  },
  {
    id: 'metaverse-optimizer',
    name: 'Optimizador Metaverso',
    description: 'Optimización de contenido para metaversos',
    icon: Palette,
    category: 'Metaverse',
    color: 'from-fuchsia-500 to-pink-500'
  },
  {
    id: 'content-authenticity',
    name: 'Autenticidad',
    description: 'Verificación de autenticidad de contenido',
    icon: Lock,
    category: 'Security',
    color: 'from-green-500 to-teal-500'
  },
  {
    id: 'nft-tracking',
    name: 'NFT Tracking',
    description: 'Seguimiento y análisis de NFTs',
    icon: Gem,
    category: 'Web3',
    color: 'from-purple-500 to-pink-500'
  },
  {
    id: 'ecosystem-interactions',
    name: 'Interacciones Ecosistema',
    description: 'Análisis de interacciones en ecosistemas',
    icon: Network,
    category: 'Web3',
    color: 'from-indigo-500 to-blue-500'
  },
  {
    id: 'historical',
    name: 'Análisis Histórico',
    description: 'Análisis de evolución temporal de proyectos',
    icon: Activity,
    category: 'Technical',
    color: 'from-slate-500 to-gray-500'
  }
];

// Categorías de herramientas
const TOOL_CATEGORIES = [
  { id: 'all', name: 'Todas', icon: Target },
  { id: 'AI', name: 'Inteligencia Artificial', icon: Brain },
  { id: 'SEO', name: 'Keywords & SEO', icon: Search },
  { id: 'Web3', name: 'Web3 & Blockchain', icon: Globe },
  { id: 'Technical', name: 'Técnico', icon: Zap },
  { id: 'Security', name: 'Seguridad', icon: Shield },
  { id: 'Social', name: 'Social', icon: Users },
  { id: 'Market', name: 'Mercado', icon: BarChart3 },
  { id: 'Metaverse', name: 'Metaverso', icon: Palette }
];

export default function DashboardPage() {
  // Hooks de autenticación y Web3
  const { user, loading, signOut } = useAuth();
  const { address: walletAddress, isConnected } = useWeb3();
  const router = useRouter();
  const { toast } = useToast();

  // Estados principales
  const [selectedTools, setSelectedTools] = useState<string[]>([]);
  const [address, setAddress] = useState('');
  const [isValidAddress, setIsValidAddress] = useState<boolean | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  // Estado del sidebar removido - se maneja en layout.tsx
  const [showSystemStatus, setShowSystemStatus] = useState(false);
  const [showProjectManager, setShowProjectManager] = useState(false);
  const [showDataSourcesGuide, setShowDataSourcesGuide] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isCompleteAudit, setIsCompleteAudit] = useState<boolean>(false);
  const [analysisProgress, setAnalysisProgress] = useState<{[key: string]: number}>({});
  
  // Estados para validación Web3
  const [addressError, setAddressError] = useState<string>('');
  const [isValidatingAddress, setIsValidatingAddress] = useState<boolean>(false);
  const [isActivating, setIsActivating] = useState<boolean>(false);

  // Integración del indexador
  const {
    getRequiredIndexers,
    checkDataAvailability,
    activateIndexersForAnalysis,
    getIndexingProgress,
    getDataTypesForTool,
    estimateIndexingTime
  } = useIndexerOrchestrator();
  
  const {
    availability: dataAvailability,
    loading: indexerLoading,
    checkStatus,
    isDataReady,
    totalDataPoints
  } = useIndexerStatus(selectedTools, address);

  // Función para activar indexadores
  const handleActivateIndexers = async () => {
    setIsActivating(true);
    try {
      await activateIndexersForAnalysis(selectedTools, address);
      await checkStatus();
    } catch (error) {
      console.error('Error activating indexers:', error);
    } finally {
      setIsActivating(false);
    }
  };

  // Estado del indexador
  const [requiredIndexers, setRequiredIndexers] = useState<IndexerRequirement[]>([]);
  
  useEffect(() => {
    const loadRequiredIndexers = async () => {
      try {
        const required = await getRequiredIndexers(selectedTools);
        setRequiredIndexers(required);
      } catch (error) {
        console.error('Error loading required indexers:', error);
      }
    };
    
    if (selectedTools.length > 0) {
      loadRequiredIndexers();
    }
  }, [selectedTools, getRequiredIndexers]);
  
  const indexerState = {
    required: requiredIndexers,
    active: dataAvailability?.activeIndexers || [],
    progress: dataAvailability?.progress || {},
    dataReady: isDataReady,
    isActivating,
    error: null
  };

  // Verificar autenticación
  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/email-login');
    }
  }, [user, loading, router]);

  // Función para validar direcciones Web3
  const validateWeb3Address = useCallback(async (inputAddress: string) => {
    if (!inputAddress) {
      setAddressError('');
      return true;
    }

    setIsValidatingAddress(true);
    setAddressError('');

    try {
      // Validar formato de dirección Ethereum
      if (inputAddress.startsWith('0x') && inputAddress.length === 42) {
        const isValidHex = /^0x[a-fA-F0-9]{40}$/.test(inputAddress);
        if (isValidHex) {
          setIsValidatingAddress(false);
          return true;
        }
      }

      // Validar dominios Web3 (ENS, .crypto, .eth, etc.)
      const web3Domains = ['.eth', '.crypto', '.blockchain', '.bitcoin', '.wallet', '.nft', '.dao', '.defi'];
      const isWeb3Domain = web3Domains.some(domain => inputAddress.toLowerCase().includes(domain));
      
      if (isWeb3Domain) {
        setIsValidatingAddress(false);
        return true;
      }

      // Validar otras direcciones blockchain (Bitcoin, etc.)
      if (inputAddress.length >= 26 && inputAddress.length <= 62) {
        // Formato básico de direcciones blockchain
        setIsValidatingAddress(false);
        return true;
      }

      // Si no es válido
      setAddressError('Por favor, ingresa una dirección Web3 válida (wallet, contrato, o dominio .eth)');
      setIsValidatingAddress(false);
      return false;

    } catch (error) {
      setAddressError('Error al validar la dirección');
      setIsValidatingAddress(false);
      return false;
    }
  }, []);

  // Sincronizar dirección de wallet conectada
  useEffect(() => {
    if (isConnected && walletAddress && !address) {
      setAddress(walletAddress);
      validateWeb3Address(walletAddress);
    }
  }, [isConnected, walletAddress, address, validateWeb3Address]);

  // Lógica del sidebar removida - se maneja en layout.tsx

  // Manejar cambio de dirección
  const handleAddressChange = useCallback(async (value: string) => {
    setAddress(value);
    await validateWeb3Address(value);
  }, [validateWeb3Address]);

  // Manejar selección de herramientas
  const handleToolSelection = (toolId: string) => {
    setSelectedTools(prev => {
      if (prev.includes(toolId)) {
        return prev.filter(t => t !== toolId);
      } else {
        return [...prev, toolId];
      }
    });
    setIsCompleteAudit(false);
  };

  // Manejar auditoría completa
  const handleCompleteAuditChange = (checked: boolean) => {
    setIsCompleteAudit(checked);
    if (checked) {
      setSelectedTools(AVAILABLE_TOOLS.map(tool => tool.id));
    }
  };

  // Sin funcionalidad de pago - removido completamente

  // Filtrar herramientas por categoría
  const filteredTools = selectedCategory === 'all' 
    ? AVAILABLE_TOOLS 
    : AVAILABLE_TOOLS.filter(tool => tool.category === selectedCategory);

  // Manejar análisis
  const handleAnalysis = async () => {
    if (selectedTools.length === 0) {
      toast({
        title: 'Error',
        description: 'Selecciona al menos una herramienta para el análisis',
        variant: 'destructive'
      });
      return;
    }

    if (!address) {
      toast({
        title: 'Error',
        description: 'Ingresa una dirección Web3 válida',
        variant: 'destructive'
      });
      return;
    }

    if (addressError) {
      toast({
        title: 'Error',
        description: 'Corrige la dirección Web3 antes de continuar',
        variant: 'destructive'
      });
      return;
    }

    setIsAnalyzing(true);

    try {
      // Crear solicitud de análisis
      const analysisRequest: AnalysisRequest = {
        address,
        tools: selectedTools,
        isCompleteAudit,
        options: {
          timeframe: '30d',
          includeAdvanced: true,
          priority: 'comprehensive'
        }
      };

      // Iniciar análisis real con el orchestrator
      const requestId = await dashboardOrchestrator.startAnalysis(analysisRequest);

      toast({
        title: 'Análisis iniciado',
        description: `Procesando ${selectedTools.length} herramientas para ${address}...`,
        variant: 'default'
      });

      // Monitorear progreso del análisis
      const progressInterval = setInterval(async () => {
        const status = dashboardOrchestrator.getAnalysisStatus(requestId);
        
        if (status) {
          const completedTools = status.progress.filter(p => p.status === 'completed').length;
          const totalTools = status.progress.length;
          
          if (status.status === 'completed') {
            clearInterval(progressInterval);
            
            toast({
              title: 'Análisis completado',
              description: `${completedTools}/${totalTools} herramientas procesadas exitosamente`,
              variant: 'default'
            });

            // Redirigir a página de resultados con el requestId
            const resultsUrl = `/dashboard/unified-results?requestId=${requestId}&address=${encodeURIComponent(address)}&tools=${encodeURIComponent(selectedTools.join(','))}`;
            
            setTimeout(() => {
              router.push(resultsUrl);
            }, 1000);
            
          } else if (status.status === 'error') {
            clearInterval(progressInterval);
            throw new Error('Error en el análisis');
          }
        }
      }, 2000); // Verificar cada 2 segundos

      // Timeout de seguridad (5 minutos)
      setTimeout(() => {
        clearInterval(progressInterval);
        if (isAnalyzing) {
          setIsAnalyzing(false);
          toast({
            title: 'Análisis en progreso',
            description: 'El análisis está tomando más tiempo del esperado. Puedes verificar el estado en la página de resultados.',
            variant: 'default'
          });
          
          const resultsUrl = `/dashboard/unified-results?requestId=${requestId}&address=${encodeURIComponent(address)}&tools=${encodeURIComponent(selectedTools.join(','))}`;
          router.push(resultsUrl);
        }
      }, 300000); // 5 minutos

    } catch (error) {
      console.error('Error en análisis:', error);
      toast({
        title: 'Error en el análisis',
        description: error instanceof Error ? error.message : 'Ha ocurrido un error al realizar el análisis',
        variant: 'destructive'
      });
    } finally {
      // No establecer isAnalyzing a false aquí, se hace cuando el análisis se completa
    }
  };

  // Manejar cierre de sesión
  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/login');
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: 'Error',
        description: 'Error al cerrar sesión',
        variant: 'destructive'
      });
    }
  };

  // Mostrar loader mientras se verifica la autenticación
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // Redirigir si no hay usuario autenticado
  if (!user) {
    return null;
  }

  return (
    <div className="dashboard-layout min-h-screen">
      {/* Fondo de partículas animado */}
      <div className="particles-bg">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="particle dashboard-particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              '--animation-delay': `${Math.random() * 6}s`
            } as React.CSSProperties}
          />
        ))}
      </div>

      {/* Sidebar removido - ya se renderiza en layout.tsx */}

      {/* Contenedor principal con sidebar */}
      <div className="main-container">
        {/* Header Principal Profesional */}
        <div className="hero-header">
          <div className="hero-content">
            <div className="hero-text">
              <h1 className="hero-title">
                <Sparkles className="w-10 h-10 text-blue-400" />
                Dashboard Web3
              </h1>
              <p className="hero-subtitle">
                Plataforma Profesional de Análisis Web3 para Desarrolladores
              </p>
              <p className="hero-description">
                Herramientas avanzadas para auditar, analizar y optimizar proyectos blockchain
              </p>
            </div>
            
            {/* Controles del Header */}
            <div className="header-controls">
              <UnifiedWalletConnect onSuccess={() => {}} />
              <Button variant="outline" size="sm" onClick={() => router.push('/dashboard/settings')} className="glass-button">
                <Settings className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={handleSignOut} className="glass-button">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Buscador Web3 Futurista */}
          <div className="search-container">
            <Web3Search 
              onSelect={(result) => {
                setAddress(result.address);
                validateWeb3Address(result.address);
              }}
              placeholder="🔍 Buscar dominios Web3, wallets, contratos inteligentes..."
              className="futuristic-search"
              showSuggestions={true}
            />
          </div>
          
          {/* Sección de Características Destacadas */}
          <div className="features-highlight">
            <div className="features-grid">
              <div className="feature-item">
                <div className="feature-icon">
                  <Brain className="h-6 w-6 text-purple-400" />
                </div>
                <div className="feature-content">
                  <h3 className="feature-title">IA Avanzada</h3>
                  <p className="feature-description">Análisis inteligente con machine learning</p>
                </div>
              </div>
              <div className="feature-item">
                <div className="feature-icon">
                  <Shield className="h-6 w-6 text-green-400" />
                </div>
                <div className="feature-content">
                  <h3 className="feature-title">Seguridad Total</h3>
                  <p className="feature-description">Auditorías completas de smart contracts</p>
                </div>
              </div>
              <div className="feature-item">
                <div className="feature-icon">
                  <Zap className="h-6 w-6 text-yellow-400" />
                </div>
                <div className="feature-content">
                  <h3 className="feature-title">Tiempo Real</h3>
                  <p className="feature-description">Resultados instantáneos y precisos</p>
                </div>
              </div>
              <div className="feature-item">
                <div className="feature-icon">
                  <Globe className="h-6 w-6 text-blue-400" />
                </div>
                <div className="feature-content">
                  <h3 className="feature-title">Multi-Chain</h3>
                  <p className="feature-description">Compatible con todas las blockchains</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Contenido Principal */}
        <div className="main-content">
          {/* Panel de Estado y Navegación */}
          <div className="dashboard-nav-panel">
            <div className="nav-cards-grid">
              {/* Estado del Navegador */}
              <Card className="nav-card browser-status-card">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/20">
                        <AlertTriangle className="h-4 w-4 text-orange-600" />
                      </div>
                      <div>
                        <CardTitle className="text-sm font-medium">Navegador Web2</CardTitle>
                        <CardDescription className="text-xs">Estado de Conexión</CardDescription>
                      </div>
                    </div>
                    <Badge variant="secondary" className="text-xs">Limitado</Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-xs text-muted-foreground mb-2">
                    Para mejor experiencia, usa un navegador Web3 como MetaMask Browser
                  </p>
                </CardContent>
              </Card>

              {/* Estado del Indexador */}
              <Card className="nav-card indexer-status-card">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/20">
                        <Database className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <CardTitle className="text-sm font-medium">Indexador Web3</CardTitle>
                        <CardDescription className="text-xs">Sistema de Datos</CardDescription>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                      Activo
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Última sincronización:</span>
                    <span className="font-medium">Hace 2 min</span>
                  </div>
                  <Button variant="outline" size="sm" className="w-full mt-2 h-7 text-xs">
                    <Settings className="h-3 w-3 mr-1" />
                    Configurar
                  </Button>
                </CardContent>
              </Card>

              {/* Guía de Uso */}
              <TooltipProvider>
                <Card className="nav-card guide-card">
                  <CardHeader className="pb-3">
                    <div className="flex items-center space-x-2">
                      <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/20">
                        <Info className="h-4 w-4 text-purple-600" />
                      </div>
                      <div>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <CardTitle className="text-sm font-medium cursor-help">Guía de Uso</CardTitle>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Accede a tutoriales y documentación completa</p>
                          </TooltipContent>
                        </Tooltip>
                        <CardDescription className="text-xs">Aprende a usar la plataforma</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-2">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="outline" size="sm" className="w-full h-7 text-xs">
                            <FileText className="h-3 w-3 mr-1" />
                            Ver Documentación
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Guía completa de todas las herramientas disponibles</p>
                        </TooltipContent>
                      </Tooltip>
                      <div className="flex gap-1">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="sm" className="flex-1 h-6 text-xs">
                              <Search className="h-3 w-3 mr-1" />
                              Buscar
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Buscar en la documentación</p>
                          </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="sm" className="flex-1 h-6 text-xs">
                              <Eye className="h-3 w-3 mr-1" />
                              Demo
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Ver demostración interactiva</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TooltipProvider>

              {/* Contador de Herramientas */}
              <Card className="nav-card tools-counter-card">
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-2">
                    <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/20">
                      <Target className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <CardTitle className="text-sm font-medium">Herramientas</CardTitle>
                      <CardDescription className="text-xs">Seleccionadas para análisis</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{selectedTools.length}</div>
                      <div className="text-xs text-muted-foreground">Seleccionadas</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-muted-foreground">{AVAILABLE_TOOLS.length}</div>
                      <div className="text-xs text-muted-foreground">Disponibles</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Sección de Herramientas */}
          <div className="tools-section">
            <div className="section-header">
              <h2 className="section-title">
                <Sparkles className="w-8 h-8" />
                Herramientas de Análisis Web3
              </h2>
              <p className="section-subtitle">
                Selecciona las herramientas que deseas utilizar para tu análisis personalizado
              </p>
            </div>

            {/* Filtros de Categoría */}
            <div className="category-filters">
              {TOOL_CATEGORIES.map(category => {
                const IconComponent = category.icon;
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`category-filter ${
                      selectedCategory === category.id ? 'active' : ''
                    }`}
                  >
                    <IconComponent className="w-5 h-5" />
                    <span>{category.name}</span>
                  </button>
                );
              })}
            </div>

            {/* Grid de Herramientas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredTools.map(tool => {
                const IconComponent = tool.icon;
                const isSelected = selectedTools.includes(tool.id);
                
                return (
                  <div
                    key={tool.id}
                    onClick={() => handleToolSelection(tool.id)}
                    className={`group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 transition-all duration-300 hover:bg-white/10 hover:border-white/20 hover:scale-105 cursor-pointer ${
                      isSelected ? 'ring-2 ring-blue-500/50 bg-blue-500/10' : ''
                    }`}
                  >
                    {/* Background Gradient */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${tool.color} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-300`} />
                    
                    {/* Selection Indicator */}
                    {isSelected && (
                      <div className="absolute top-4 right-4 z-10">
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      </div>
                    )}
                    
                    {/* Icon */}
                    <div className={`relative w-12 h-12 bg-gradient-to-br ${tool.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    
                    {/* Content */}
                    <div className="relative z-10">
                      <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-blue-300 transition-colors">
                        {tool.name}
                      </h3>
                      <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                        {tool.description}
                      </p>
                      
                      {/* Category Badge */}
                      <div className="flex items-center justify-between">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/10 text-white/80">
                          {tool.category}
                        </span>
                        
                        {/* Mock Statistics */}
                        <div className="flex items-center space-x-2 text-xs text-gray-400">
                          <TrendingUp className="w-3 h-3" />
                          <span>{Math.floor(Math.random() * 100) + 50}%</span>
                        </div>
                      </div>
                      
                      {/* Features List */}
                    <div className="mt-4 space-y-1">
                      <div className="flex items-center text-xs text-gray-400">
                        <div className="w-1 h-1 bg-green-400 rounded-full mr-2" />
                        Análisis en tiempo real
                      </div>
                      <div className="flex items-center text-xs text-gray-400">
                        <div className="w-1 h-1 bg-blue-400 rounded-full mr-2" />
                        Reportes detallados
                      </div>
                      <div className="flex items-center text-xs text-gray-400">
                        <div className="w-1 h-1 bg-purple-400 rounded-full mr-2" />
                        Integración Web3
                      </div>
                    </div>
                    
                    {/* Botón de análisis individual */}
                    <div className="mt-4 pt-4 border-t border-white/10">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full bg-white/5 border-white/20 text-white hover:bg-white/10 text-xs"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (address && isValidAddress) {
                            window.open(`/dashboard/individual-analysis?tool=${tool.id}&address=${encodeURIComponent(address)}`, '_blank');
                          } else {
                            alert('Por favor, ingresa una dirección válida primero');
                          }
                        }}
                        disabled={!address || !isValidAddress}
                      >
                        <Target className="w-3 h-3 mr-1" />
                        Análisis Individual
                      </Button>
                    </div>
                    </div>
                    
                    {/* Hover Effect Border */}
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sección de Estado de APIs */}
          <div className="api-status-section mb-8">
            <div className="section-header">
              <h2 className="section-title">
                <Activity className="w-8 h-8" />
                Estado de Conectividad
              </h2>
              <p className="section-subtitle">
                Monitoreo en tiempo real de las APIs y servicios externos
              </p>
            </div>
            <APIStatusDashboard compact={true} showControls={false} />
          </div>

          {/* Sección de Configuración de Análisis */}
          <div className="analysis-section">
            <div className="section-header">
              <h2 className="section-title">
                <Settings className="w-8 h-8" />
                Configuración de Análisis
              </h2>
              <p className="section-subtitle">
                Configura los parámetros y ejecuta el análisis Web3
              </p>
            </div>

            <div className="analysis-config-grid">
              {/* Panel de Configuración */}
              <Card className="config-panel">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Target className="w-5 h-5" />
                    <span>Parámetros de Análisis</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Input de dirección */}
                  <div className="space-y-2">
                    <Label htmlFor="address-input" className="text-sm font-medium">
                      Dirección Web3 / Dominio ENS
                    </Label>
                    <div className="relative">
                      <Input
                        id="address-input"
                        type="text"
                        placeholder="0x... o dominio.eth"
                        value={address}
                        onChange={(e) => handleAddressChange(e.target.value)}
                        className={`pr-10 ${addressError ? 'border-red-500' : address && !addressError ? 'border-green-500' : ''}`}
                      />
                      {isValidatingAddress && (
                        <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 animate-spin" />
                      )}
                      {address && !isValidatingAddress && !addressError && (
                        <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-green-500" />
                      )}
                      {addressError && (
                        <AlertTriangle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-red-500" />
                      )}
                    </div>
                    {addressError && (
                      <p className="text-sm text-red-500">{addressError}</p>
                    )}
                  </div>

                  {/* Checkbox para auditoría completa */}
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="complete-audit"
                      checked={isCompleteAudit}
                      onCheckedChange={handleCompleteAuditChange}
                    />
                    <Label htmlFor="complete-audit" className="text-sm">
                      Auditoría Completa Premium (todas las herramientas)
                    </Label>
                  </div>
                </CardContent>
              </Card>

              {/* Panel de Herramientas Seleccionadas */}
              <Card className="selected-tools-panel">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5" />
                      <span>Herramientas Seleccionadas</span>
                    </div>
                    <Badge variant="outline" className="bg-primary/10">
                      {selectedTools.length} de {AVAILABLE_TOOLS.length}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedTools.length > 0 ? (
                    <div className="space-y-4">
                      <div className="flex flex-wrap gap-2">
                        {selectedTools.map((toolId) => {
                          const tool = AVAILABLE_TOOLS.find(t => t.id === toolId);
                          if (!tool) return null;
                          const IconComponent = tool.icon;
                          return (
                            <Badge
                              key={toolId}
                              variant="secondary"
                              className="flex items-center space-x-1 px-2 py-1"
                            >
                              <IconComponent className="w-3 h-3" />
                              <span className="text-xs">{tool.name}</span>
                            </Badge>
                          );
                        })}
                      </div>
                      
                      {/* Botón de análisis */}
                      <Button
                        onClick={handleAnalysis}
                        disabled={!address || selectedTools.length === 0 || isAnalyzing || !!addressError}
                        className="w-full"
                        size="lg"
                      >
                        {isAnalyzing ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Procesando Análisis...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4 mr-2" />
                            Iniciar Análisis Premium
                          </>
                        )}
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Target className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                      <p className="text-sm text-muted-foreground mb-2">
                        No hay herramientas seleccionadas
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Selecciona herramientas de la sección anterior para comenzar
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>


        </div>
      </div>

      {/* Widget de Asistente IA */}
      <AIAssistantWidget
        contextData={{
          address,
          selectedTools,
          analysisResults: null
        }}
        defaultMinimized={true}
      />

      {/* Modales */}
      {showSystemStatus && (
        <SystemStatusDashboard 
          onClose={() => setShowSystemStatus(false)}
        />
      )}
      
      {showProjectManager && (
        <ProjectManager 
          onClose={() => setShowProjectManager(false)}
        />
      )}
      
      {showDataSourcesGuide && (
        <DataSourcesGuide 
          onClose={() => setShowDataSourcesGuide(false)}
        />
      )}
    </div>
  );
}

