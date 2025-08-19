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
import { useRouter } from 'next/navigation';
import { 
  Loader2, LogOut, User, MessageCircle, Info, Target, Zap, Shield, 
  BarChart3, Globe, Link, Users, Search, Database, Cpu, Award, 
  Palette, Crown, Activity, Eye, ChevronLeft, ChevronRight, 
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
    color: 'from-purple-500 to-indigo-500',
    price: 8
  },
  {
    id: 'metadata',
    name: 'Metadatos',
    description: 'Análisis de metadatos y estructura',
    icon: Database,
    category: 'SEO',
    color: 'from-blue-500 to-cyan-500',
    price: 5
  },
  {
    id: 'content',
    name: 'Contenido',
    description: 'Auditoría de contenido y calidad',
    icon: FileText,
    category: 'SEO',
    color: 'from-green-500 to-emerald-500',
    price: 5
  },
  {
    id: 'keywords',
    name: 'Keywords',
    description: 'Análisis de palabras clave',
    icon: Search,
    category: 'SEO',
    color: 'from-yellow-500 to-orange-500',
    price: 6
  },
  {
    id: 'performance',
    name: 'Rendimiento',
    description: 'Análisis de velocidad y optimización',
    icon: Zap,
    category: 'Technical',
    color: 'from-red-500 to-pink-500',
    price: 7
  },
  {
    id: 'security',
    name: 'Seguridad',
    description: 'Auditoría de seguridad completa',
    icon: Shield,
    category: 'Security',
    color: 'from-gray-500 to-slate-500',
    price: 9
  },
  {
    id: 'backlinks',
    name: 'Backlinks',
    description: 'Análisis de enlaces entrantes',
    icon: Link,
    category: 'SEO',
    color: 'from-teal-500 to-cyan-500',
    price: 6
  },
  {
    id: 'links',
    name: 'Enlaces',
    description: 'Verificación de enlaces internos',
    icon: Link,
    category: 'SEO',
    color: 'from-indigo-500 to-purple-500',
    price: 5
  },
  {
    id: 'competition',
    name: 'Competencia',
    description: 'Análisis competitivo del mercado',
    icon: BarChart3,
    category: 'Market',
    color: 'from-orange-500 to-red-500',
    price: 8
  },
  {
    id: 'blockchain',
    name: 'Blockchain',
    description: 'Análisis de datos blockchain',
    icon: Globe,
    category: 'Web3',
    color: 'from-violet-500 to-purple-500',
    price: 10
  },
  {
    id: 'smart-contract',
    name: 'Smart Contract',
    description: 'Análisis de contratos inteligentes',
    icon: Cpu,
    category: 'Web3',
    color: 'from-cyan-500 to-blue-500',
    price: 12
  },
  {
    id: 'social-web3',
    name: 'Social Web3',
    description: 'Análisis de redes sociales descentralizadas',
    icon: Users,
    category: 'Social',
    color: 'from-pink-500 to-rose-500',
    price: 7
  },
  {
    id: 'authority-tracking',
    name: 'Autoridad Descentralizada',
    description: 'Seguimiento de autoridad en ecosistemas',
    icon: Award,
    category: 'Web3',
    color: 'from-amber-500 to-yellow-500',
    price: 9
  },
  {
    id: 'metaverse-optimizer',
    name: 'Optimizador Metaverso',
    description: 'Optimización de contenido para metaversos',
    icon: Palette,
    category: 'Metaverse',
    color: 'from-fuchsia-500 to-pink-500',
    price: 11
  },
  {
    id: 'content-authenticity',
    name: 'Autenticidad',
    description: 'Verificación de autenticidad de contenido',
    icon: Lock,
    category: 'Security',
    color: 'from-green-500 to-teal-500',
    price: 8
  },
  {
    id: 'nft-tracking',
    name: 'NFT Tracking',
    description: 'Seguimiento y análisis de NFTs',
    icon: Gem,
    category: 'Web3',
    color: 'from-purple-500 to-pink-500',
    price: 10
  },
  {
    id: 'ecosystem-interactions',
    name: 'Interacciones Ecosistema',
    description: 'Análisis de interacciones en ecosistemas',
    icon: Network,
    category: 'Web3',
    color: 'from-indigo-500 to-blue-500',
    price: 9
  },
  {
    id: 'historical',
    name: 'Análisis Histórico',
    description: 'Análisis de evolución temporal de proyectos',
    icon: Activity,
    category: 'Technical',
    color: 'from-slate-500 to-gray-500',
    price: 8
  }
];

// Categorías de herramientas
const TOOL_CATEGORIES = [
  { id: 'all', name: 'Todas', icon: Target },
  { id: 'AI', name: 'Inteligencia Artificial', icon: Brain },
  { id: 'SEO', name: 'SEO Tradicional', icon: Search },
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
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showSystemStatus, setShowSystemStatus] = useState(false);
  const [showProjectManager, setShowProjectManager] = useState(false);
  const [showDataSourcesGuide, setShowDataSourcesGuide] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isCompleteAudit, setIsCompleteAudit] = useState<boolean>(false);
  
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

  // Cargar estado del sidebar desde localStorage
  useEffect(() => {
    const savedSidebarState = localStorage.getItem('dashboard_sidebar_collapsed');
    if (savedSidebarState) {
      setSidebarCollapsed(JSON.parse(savedSidebarState));
    }
  }, []);

  // Guardar estado del sidebar en localStorage
  useEffect(() => {
    localStorage.setItem('dashboard_sidebar_collapsed', JSON.stringify(sidebarCollapsed));
  }, [sidebarCollapsed]);

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

  // Calcular precio total
  const calculateTotalPrice = (): number => {
    const baseTotal = selectedTools.reduce((total, toolId) => {
      const tool = AVAILABLE_TOOLS.find(t => t.id === toolId);
      return total + (tool?.price || 0);
    }, 0);
    return isCompleteAudit ? baseTotal * 0.8 : baseTotal; // 20% descuento en auditoría completa
  };

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex">
      {/* Panel Lateral Colapsible */}
      <div className={`bg-white shadow-xl sidebar-transition ${
        sidebarCollapsed ? 'sidebar-collapsed' : 'sidebar-expanded'
      } flex flex-col border-r border-gray-200 relative z-10 custom-scrollbar`}>
        
        {/* Header del Sidebar */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          {!sidebarCollapsed && (
            <div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Herramientas Web3
              </h2>
              <p className="text-sm text-gray-500">Selecciona las herramientas para tu análisis</p>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            {sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>

        {/* Categorías */}
        {!sidebarCollapsed && (
          <div className="p-4 border-b border-gray-200">
            <div className="grid grid-cols-2 gap-2">
              {TOOL_CATEGORIES.map((category) => {
                const IconComponent = category.icon;
                return (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category.id)}
                    className={`category-button text-xs justify-start ${
                      selectedCategory === category.id 
                        ? 'category-button active' 
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <IconComponent className="h-3 w-3 mr-1" />
                    {category.name}
                  </Button>
                );
              })}
            </div>
          </div>
        )}

        {/* Lista de Herramientas */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {filteredTools.map((tool) => {
            const IconComponent = tool.icon;
            const isSelected = selectedTools.includes(tool.id);
            
            return (
              <div
                key={tool.id}
                className={`tool-card p-3 rounded-lg border cursor-pointer ${
                  isSelected 
                    ? 'tool-card selected' 
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
                onClick={() => handleToolSelection(tool.id)}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg bg-gradient-to-r ${tool.color} ${
                    sidebarCollapsed ? 'w-8 h-8' : 'w-10 h-10'
                  } flex items-center justify-center shadow-sm`}>
                    <IconComponent className={`text-white ${
                      sidebarCollapsed ? 'h-4 w-4' : 'h-5 w-5'
                    }`} />
                  </div>
                  
                  {!sidebarCollapsed && (
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-gray-900 truncate">{tool.name}</h4>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <Badge variant="secondary" className="text-xs">
                            ${tool.price}
                          </Badge>
                          {isSelected && <CheckCircle className="h-4 w-4 text-green-500" />}
                        </div>
                      </div>
                      <p className="text-sm text-gray-500 mt-1 line-clamp-2">{tool.description}</p>
                      <Badge variant="outline" className="text-xs mt-2">
                        {tool.category}
                      </Badge>
                    </div>
                  )}
                  
                  {sidebarCollapsed && isSelected && (
                    <div className="absolute -right-2 -top-2">
                      <CheckCircle className="h-4 w-4 text-green-500 bg-white rounded-full" />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer del Sidebar */}
        {!sidebarCollapsed && selectedTools.length > 0 && (
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Herramientas seleccionadas:</span>
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  {selectedTools.length}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Precio total:</span>
                <div className="flex items-center gap-2">
                  {isCompleteAudit && (
                    <Badge variant="destructive" className="text-xs">-20%</Badge>
                  )}
                  <span className="text-lg font-bold text-green-600">
                    ${calculateTotalPrice().toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="complete-audit"
                  checked={isCompleteAudit}
                  onCheckedChange={handleCompleteAuditChange}
                />
                <Label htmlFor="complete-audit" className="text-sm text-gray-700">
                  Auditoría completa (20% descuento)
                </Label>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Área Principal */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header Principal */}
        <div className="bg-white shadow-sm border-b border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="min-w-0 flex-1">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Dashboard Web3 SEO
              </h1>
              <p className="text-gray-600 mt-1">
                Motor central de análisis profesional para proyectos Web3
              </p>
            </div>
            
            <div className="flex items-center gap-2 flex-shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDataSourcesGuide(!showDataSourcesGuide)}
                className={`flex items-center gap-2 ${showDataSourcesGuide ? 'bg-purple-50 border-purple-300' : ''}`}
              >
                <Info className="h-4 w-4" />
                <span className="hidden lg:inline">Fuentes</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSystemStatus(!showSystemStatus)}
                className={`flex items-center gap-2 ${showSystemStatus ? 'bg-blue-50 border-blue-300' : ''}`}
              >
                <Activity className="h-4 w-4" />
                <span className="hidden lg:inline">Estado</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowProjectManager(!showProjectManager)}
                className={`flex items-center gap-2 ${showProjectManager ? 'bg-green-50 border-green-300' : ''}`}
              >
                <FileText className="h-4 w-4" />
                <span className="hidden lg:inline">Proyectos</span>
              </Button>
              <QuickAccessMenu onToolSelect={(toolId) => {
                setSelectedTools(prev => prev.includes(toolId) ? prev : [...prev, toolId]);
              }} />
              <KeyboardShortcuts 
                onSearchFocus={() => {
                  const searchInput = document.querySelector('input[placeholder*="Buscar"]') as HTMLInputElement;
                  if (searchInput) {
                    searchInput.focus();
                  }
                }}
                onQuickAccessOpen={() => {}}
                onSettingsOpen={() => router.push('/dashboard/settings')}
              />
              <UnifiedWalletConnect onSuccess={() => {}} />
              <Button variant="outline" size="sm" onClick={() => router.push('/dashboard/settings')}>
                <Settings className="h-4 w-4" />
                <span className="hidden lg:inline ml-2">Config</span>
              </Button>
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                <LogOut className="h-4 w-4" />
                <span className="hidden lg:inline ml-2">Salir</span>
              </Button>
            </div>
          </div>
          
          {/* Buscador Web3 */}
          <div className="max-w-2xl">
            <Web3Search 
              onSelect={(result) => {
                setAddress(result.address);
                validateWeb3Address(result.address);
              }}
              placeholder="🔍 Buscar dominios Web3, wallets, contratos inteligentes..."
              className="w-full"
              showSuggestions={true}
            />
          </div>
          
          {/* Breadcrumbs */}
          <div className="mt-4">
            <Breadcrumbs />
          </div>
        </div>
        
        {/* Contenido Principal */}
        <div className="flex-1 p-6 space-y-6">
          
          {/* Dashboard de Estado del Sistema */}
          {showSystemStatus && (
            <div className="mb-6">
              <SystemStatusDashboard />
            </div>
          )}

          {/* Gestor de Proyectos */}
          {showProjectManager && (
            <div className="mb-6">
              <ProjectManager 
                onProjectSelect={(project) => {
                  setAddress(project.address);
                  setSelectedTools(project.tools);
                  validateWeb3Address(project.address);
                  setShowProjectManager(false);
                  toast({
                    title: 'Proyecto cargado',
                    description: `Se ha cargado el proyecto "${project.name}"`,
                    variant: 'default'
                  });
                }}
                onTemplateApply={(template) => {
                  setSelectedTools(template.tools);
                  setShowProjectManager(false);
                  toast({
                    title: 'Plantilla aplicada',
                    description: `Se han seleccionado ${template.tools.length} herramientas`,
                    variant: 'default'
                  });
                }}
              />
            </div>
          )}

          {/* Guía de Fuentes de Datos */}
          {showDataSourcesGuide && (
            <div className="mb-6">
              <DataSourcesGuide 
                selectedTool={selectedTools.length === 1 ? selectedTools[0] : undefined}
              />
            </div>
          )}

          {/* Estado del Indexador */}
          <IndexerStatusCard 
            indexerState={indexerState}
            dataAvailability={dataAvailability}
            selectedTools={selectedTools}
            targetAddress={address}
            onActivateIndexers={handleActivateIndexers}
            isActivating={isActivating}
          />
          
          {/* Configuración de Análisis */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-6 w-6 text-blue-500" />
                Configuración de Análisis
              </CardTitle>
              <CardDescription>
                Ingresa la dirección Web3 y configura tu análisis personalizado
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Input de Dirección */}
              <div className="space-y-2">
                <Label htmlFor="address">Dirección Web3 / Dominio ENS</Label>
                <div className="relative">
                  <Input
                    id="address"
                    placeholder="0x... o dominio.eth"
                    value={address}
                    onChange={(e) => handleAddressChange(e.target.value)}
                    className={`pr-10 ${addressError ? 'border-red-300' : ''}`}
                  />
                  {isValidatingAddress && (
                    <Loader2 className="absolute right-3 top-3 h-4 w-4 animate-spin text-gray-400" />
                  )}
                  {address && !isValidatingAddress && !addressError && (
                    <CheckCircle className="absolute right-3 top-3 h-4 w-4 text-green-500" />
                  )}
                  {addressError && (
                    <AlertTriangle className="absolute right-3 top-3 h-4 w-4 text-red-500" />
                  )}
                </div>
                {addressError && (
                  <p className="text-sm text-red-600">{addressError}</p>
                )}
                <p className="text-sm text-gray-500">
                  Solo se permiten direcciones Web3, contratos inteligentes y dominios descentralizados
                </p>
              </div>

              {/* Resumen de Selección */}
              {selectedTools.length > 0 && (
                <div className="space-y-3">
                  <Label>Herramientas Seleccionadas ({selectedTools.length})</Label>
                  <div className="flex flex-wrap gap-2">
                    {selectedTools.map(toolId => {
                      const tool = AVAILABLE_TOOLS.find(t => t.id === toolId);
                      if (!tool) return null;
                      const IconComponent = tool.icon;
                      
                      return (
                        <Badge key={toolId} variant="secondary" className="flex items-center gap-1">
                          <IconComponent className="h-3 w-3" />
                          {tool.name}
                          <span className="text-xs text-gray-500">${tool.price}</span>
                        </Badge>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Estado del Indexador */}
              {address && selectedTools.length > 0 && (
                <IndexerStatusCard 
                  indexerState={indexerState}
                  dataAvailability={dataAvailability}
                  selectedTools={selectedTools}
                  targetAddress={address}
                  onActivateIndexers={handleActivateIndexers}
                  isActivating={isActivating}
                />
              )}

              {/* Botón de Análisis */}
              <div className="flex justify-center pt-4">
                <Button
                  onClick={handleAnalysis}
                  disabled={isAnalyzing || selectedTools.length === 0 || !address || !!addressError}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-8 py-3 text-lg font-medium shadow-lg"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Analizando...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-5 w-5" />
                      Iniciar Análisis Profesional
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Información del Sistema */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <BarChart3 className="h-5 w-5 text-blue-500" />
                  Herramientas Disponibles
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {AVAILABLE_TOOLS.length}
                </div>
                <p className="text-sm text-gray-500">
                  Herramientas profesionales de análisis Web3
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Globe className="h-5 w-5 text-green-500" />
                  Redes Soportadas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600 mb-2">
                  15+
                </div>
                <p className="text-sm text-gray-500">
                  Ethereum, Polygon, BSC, Arbitrum y más
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <TrendingUp className="h-5 w-5 text-purple-500" />
                  Análisis Realizados
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  1,247
                </div>
                <p className="text-sm text-gray-500">
                  Análisis completados este mes
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Mensaje de Estado */}
          {selectedTools.length === 0 && (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                Selecciona las herramientas que deseas utilizar para tu análisis desde el panel lateral.
                Puedes colapsar el panel usando el botón de flecha para tener más espacio visual.
              </AlertDescription>
            </Alert>
          )}
        </div>
      </div>

      {/* Widget de Asistente IA */}
      <AIAssistantWidget
        contextData={{
          address,
          selectedTools,
          analysisResults: null // Se puede pasar datos de análisis cuando estén disponibles
        }}
        defaultMinimized={true}
      />
    </div>
  );
}

