/**
 * Dashboard unificado de análisis optimizado para Supabase/Netlify
 * Basado en análisis externo de mejoras para implementación
 * Integra todos los servicios de análisis en una interfaz moderna
 */

'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAnalysisOrchestrator, useQuickAnalysis } from '@/hooks/useAnalysisOrchestrator';
import type { UnifiedAnalysisRequest, AnalysisType, UnifiedRecommendation } from '@/services/analysis-orchestrator';
import {
  Play,
  Square,
  RefreshCw,
  Download,
  History,
  BarChart3,
  Zap,
  Globe,
  Search,
  FileText,
  Link,
  Hash,
  ExternalLink,
  Coins,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  Target,
  Shield,
  Cpu,
  Eye,
  BarChart,
  Filter,
  Settings,
  Info
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

// Tipos para el componente
interface AnalysisFormData {
  url: string;
  analysisTypes: AnalysisType[];
  priority: 'low' | 'medium' | 'high' | 'urgent';
  depth: 'basic' | 'detailed' | 'comprehensive';
  customPrompt?: string;
  targetKeywords?: string;
  competitorUrls?: string;
  blockchainAddress?: string;
  network?: string;
}

interface DashboardProps {
  userId?: string;
  className?: string;
  defaultUrl?: string;
  enableRealtime?: boolean;
}

// Configuración de tipos de análisis
const ANALYSIS_TYPES = [
  {
    id: 'ai-assistant' as AnalysisType,
    name: 'AI Assistant',
    description: 'Análisis inteligente con IA',
    icon: Zap,
    color: 'bg-purple-500',
    estimatedTime: '45s'
  },
  {
    id: 'performance' as AnalysisType,
    name: 'Performance',
    description: 'Velocidad y Core Web Vitals',
    icon: BarChart3,
    color: 'bg-blue-500',
    estimatedTime: '60s'
  },
  {
    id: 'metadata' as AnalysisType,
    name: 'Metadata & SEO',
    description: 'Metadatos y SEO técnico',
    icon: Globe,
    color: 'bg-green-500',
    estimatedTime: '20s'
  },
  {
    id: 'content' as AnalysisType,
    name: 'Content Analysis',
    description: 'Análisis de contenido y legibilidad',
    icon: FileText,
    color: 'bg-orange-500',
    estimatedTime: '40s'
  },
  {
    id: 'backlinks' as AnalysisType,
    name: 'Backlinks',
    description: 'Análisis de enlaces entrantes',
    icon: Link,
    color: 'bg-indigo-500',
    estimatedTime: '90s'
  },
  {
    id: 'keywords' as AnalysisType,
    name: 'Keywords',
    description: 'Investigación de palabras clave',
    icon: Hash,
    color: 'bg-pink-500',
    estimatedTime: '60s'
  },
  {
    id: 'links' as AnalysisType,
    name: 'Link Analysis',
    description: 'Análisis de estructura de enlaces',
    icon: ExternalLink,
    color: 'bg-teal-500',
    estimatedTime: '30s'
  },
  {
    id: 'blockchain' as AnalysisType,
    name: 'Blockchain',
    description: 'Análisis de blockchain y DeFi',
    icon: Coins,
    color: 'bg-yellow-500',
    estimatedTime: '30s'
  },
  {
    id: 'web3' as AnalysisType,
    name: 'Web3 Ecosystem',
    description: 'Análisis completo Web3',
    icon: Shield,
    color: 'bg-red-500',
    estimatedTime: '45s'
  }
];

const PRESET_CONFIGURATIONS = {
  quick: {
    name: 'Análisis Rápido',
    description: 'Análisis básico de performance y SEO',
    types: ['performance', 'metadata'] as AnalysisType[],
    depth: 'basic' as const,
    estimatedTime: '80s'
  },
  comprehensive: {
    name: 'Análisis Completo',
    description: 'Análisis integral de todos los aspectos',
    types: ['comprehensive'] as AnalysisType[],
    depth: 'comprehensive' as const,
    estimatedTime: '5-8min'
  },
  seo: {
    name: 'SEO Especializado',
    description: 'Enfoque en SEO y contenido',
    types: ['metadata', 'content', 'backlinks', 'keywords'] as AnalysisType[],
    depth: 'detailed' as const,
    estimatedTime: '3-4min'
  },
  web3: {
    name: 'Web3 & Blockchain',
    description: 'Análisis especializado en Web3',
    types: ['blockchain', 'web3', 'ai-assistant'] as AnalysisType[],
    depth: 'detailed' as const,
    estimatedTime: '2-3min'
  }
};

export default function UnifiedAnalysisDashboard({
  userId,
  className,
  defaultUrl = '',
  enableRealtime = true
}: DashboardProps) {
  // Hooks
  const orchestrator = useAnalysisOrchestrator({
    userId,
    enableRealtime,
    enableNotifications: true,
    autoRefresh: true
  });

  const quickAnalysis = useQuickAnalysis();

  // Estado del formulario
  const [formData, setFormData] = useState<AnalysisFormData>({
    url: defaultUrl,
    analysisTypes: [],
    priority: 'medium',
    depth: 'detailed'
  });

  const [selectedPreset, setSelectedPreset] = useState<string>('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [activeTab, setActiveTab] = useState('analysis');

  // Estado de comparación
  const [compareMode, setCompareMode] = useState(false);
  const [selectedForComparison, setSelectedForComparison] = useState<string[]>([]);

  // Calcular tiempo estimado
  const estimatedTime = useMemo(() => {
    if (selectedPreset && PRESET_CONFIGURATIONS[selectedPreset as keyof typeof PRESET_CONFIGURATIONS]) {
      return PRESET_CONFIGURATIONS[selectedPreset as keyof typeof PRESET_CONFIGURATIONS].estimatedTime;
    }

    const totalSeconds = formData.analysisTypes.reduce((total, type) => {
      const config = ANALYSIS_TYPES.find(t => t.id === type);
      const seconds = parseInt(config?.estimatedTime || '30');
      return total + seconds;
    }, 0);

    if (totalSeconds < 60) {
      return `${totalSeconds}s`;
    } else {
      return `${Math.ceil(totalSeconds / 60)}min`;
    }
  }, [formData.analysisTypes, selectedPreset]);

  // Manejar cambio de preset
  const handlePresetChange = (preset: string) => {
    setSelectedPreset(preset);
    
    if (preset && PRESET_CONFIGURATIONS[preset as keyof typeof PRESET_CONFIGURATIONS]) {
      const config = PRESET_CONFIGURATIONS[preset as keyof typeof PRESET_CONFIGURATIONS];
      setFormData(prev => ({
        ...prev,
        analysisTypes: config.types,
        depth: config.depth
      }));
    }
  };

  // Manejar envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.url) {
      toast.error('URL es requerida');
      return;
    }

    if (formData.analysisTypes.length === 0) {
      toast.error('Selecciona al menos un tipo de análisis');
      return;
    }

    try {
      const request: UnifiedAnalysisRequest = {
        url: formData.url,
        analysisTypes: formData.analysisTypes,
        priority: formData.priority,
        userId,
        options: {
          depth: formData.depth,
          customPrompt: formData.customPrompt,
          targetKeywords: formData.targetKeywords?.split(',').map(k => k.trim()).filter(Boolean),
          competitorUrls: formData.competitorUrls?.split(',').map(u => u.trim()).filter(Boolean),
          blockchainAddress: formData.blockchainAddress,
          network: formData.network
        }
      };

      await orchestrator.actions.startAnalysis(request);
      setActiveTab('progress');
    } catch (error) {
      console.error('Error iniciando análisis:', error);
    }
  };

  // Manejar análisis rápido
  const handleQuickAnalysis = async () => {
    if (!formData.url) {
      toast.error('URL es requerida');
      return;
    }

    try {
      await quickAnalysis.runQuickAnalysis(formData.url);
      setActiveTab('progress');
    } catch (error) {
      console.error('Error en análisis rápido:', error);
    }
  };

  // Manejar comparación
  const handleCompareAnalyses = async () => {
    if (selectedForComparison.length !== 2) {
      toast.error('Selecciona exactamente 2 análisis para comparar');
      return;
    }

    try {
      const comparison = await orchestrator.actions.compareAnalyses(
        selectedForComparison[0],
        selectedForComparison[1]
      );
      
      // Aquí podrías abrir un modal o navegar a una página de comparación
      console.log('Comparación:', comparison);
      toast.success('Comparación generada correctamente');
    } catch (error) {
      console.error('Error comparando análisis:', error);
    }
  };

  // Renderizar icono de análisis
  const renderAnalysisIcon = (type: AnalysisType, className?: string) => {
    const config = ANALYSIS_TYPES.find(t => t.id === type);
    if (!config) return null;
    
    const Icon = config.icon;
    return <Icon className={cn('h-4 w-4', className)} />;
  };

  // Renderizar badge de estado
  const renderStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: 'bg-gray-500', icon: Clock, text: 'Pendiente' },
      processing: { color: 'bg-blue-500', icon: RefreshCw, text: 'Procesando' },
      completed: { color: 'bg-green-500', icon: CheckCircle, text: 'Completado' },
      failed: { color: 'bg-red-500', icon: AlertTriangle, text: 'Fallido' },
      partial: { color: 'bg-yellow-500', icon: AlertTriangle, text: 'Parcial' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <Badge className={cn('text-white', config.color)}>
        <Icon className="h-3 w-3 mr-1" />
        {config.text}
      </Badge>
    );
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard de Análisis</h1>
          <p className="text-muted-foreground">
            Análisis integral optimizado para Supabase y Netlify
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => orchestrator.actions.loadHistory()}
            disabled={orchestrator.state.isLoadingHistory}
          >
            <RefreshCw className={cn('h-4 w-4 mr-2', orchestrator.state.isLoadingHistory && 'animate-spin')} />
            Actualizar
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCompareMode(!compareMode)}
          >
            <BarChart className="h-4 w-4 mr-2" />
            {compareMode ? 'Cancelar' : 'Comparar'}
          </Button>
        </div>
      </div>

      {/* Tabs principales */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="analysis">Nuevo Análisis</TabsTrigger>
          <TabsTrigger value="progress">Progreso</TabsTrigger>
          <TabsTrigger value="results">Resultados</TabsTrigger>
          <TabsTrigger value="history">Historial</TabsTrigger>
        </TabsList>

        {/* Tab: Nuevo Análisis */}
        <TabsContent value="analysis" className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* URL y configuración básica */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Configuración Básica
                </CardTitle>
                <CardDescription>
                  Configura la URL y el tipo de análisis que deseas realizar
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* URL */}
                <div className="space-y-2">
                  <Label htmlFor="url">URL a analizar</Label>
                  <Input
                    id="url"
                    type="url"
                    placeholder="https://ejemplo.com"
                    value={formData.url}
                    onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
                    required
                  />
                </div>

                {/* Presets */}
                <div className="space-y-2">
                  <Label>Configuración Predefinida</Label>
                  <Select value={selectedPreset} onValueChange={handlePresetChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona una configuración" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(PRESET_CONFIGURATIONS).map(([key, config]) => (
                        <SelectItem key={key} value={key}>
                          <div className="flex flex-col">
                            <span className="font-medium">{config.name}</span>
                            <span className="text-sm text-muted-foreground">{config.description}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Tipos de análisis personalizados */}
                {!selectedPreset && (
                  <div className="space-y-3">
                    <Label>Tipos de Análisis</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {ANALYSIS_TYPES.map((type) => (
                        <div key={type.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={type.id}
                            checked={formData.analysisTypes.includes(type.id)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setFormData(prev => ({
                                  ...prev,
                                  analysisTypes: [...prev.analysisTypes, type.id]
                                }));
                              } else {
                                setFormData(prev => ({
                                  ...prev,
                                  analysisTypes: prev.analysisTypes.filter(t => t !== type.id)
                                }));
                              }
                            }}
                          />
                          <Label htmlFor={type.id} className="flex items-center gap-2 cursor-pointer">
                            <div className={cn('w-3 h-3 rounded-full', type.color)} />
                            <span className="text-sm">{type.name}</span>
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Configuración adicional */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="priority">Prioridad</Label>
                    <Select
                      value={formData.priority}
                      onValueChange={(value: any) => setFormData(prev => ({ ...prev, priority: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Baja</SelectItem>
                        <SelectItem value="medium">Media</SelectItem>
                        <SelectItem value="high">Alta</SelectItem>
                        <SelectItem value="urgent">Urgente</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="depth">Profundidad</Label>
                    <Select
                      value={formData.depth}
                      onValueChange={(value: any) => setFormData(prev => ({ ...prev, depth: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="basic">Básico</SelectItem>
                        <SelectItem value="detailed">Detallado</SelectItem>
                        <SelectItem value="comprehensive">Completo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Tiempo estimado */}
                {estimatedTime && (
                  <Alert>
                    <Clock className="h-4 w-4" />
                    <AlertTitle>Tiempo Estimado</AlertTitle>
                    <AlertDescription>
                      El análisis tomará aproximadamente {estimatedTime}
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>

            {/* Configuración avanzada */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Configuración Avanzada
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAdvanced(!showAdvanced)}
                  >
                    {showAdvanced ? 'Ocultar' : 'Mostrar'}
                  </Button>
                </CardTitle>
              </CardHeader>
              
              {showAdvanced && (
                <CardContent className="space-y-4">
                  {/* Prompt personalizado para AI */}
                  {formData.analysisTypes.includes('ai-assistant') && (
                    <div className="space-y-2">
                      <Label htmlFor="customPrompt">Prompt Personalizado (AI)</Label>
                      <Textarea
                        id="customPrompt"
                        placeholder="Describe qué aspectos específicos quieres que analice la IA..."
                        value={formData.customPrompt || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, customPrompt: e.target.value }))}
                        rows={3}
                      />
                    </div>
                  )}

                  {/* Keywords objetivo */}
                  {(formData.analysisTypes.includes('keywords') || formData.analysisTypes.includes('content')) && (
                    <div className="space-y-2">
                      <Label htmlFor="targetKeywords">Palabras Clave Objetivo</Label>
                      <Input
                        id="targetKeywords"
                        placeholder="palabra1, palabra2, palabra3"
                        value={formData.targetKeywords || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, targetKeywords: e.target.value }))}
                      />
                      <p className="text-sm text-muted-foreground">
                        Separa las palabras clave con comas
                      </p>
                    </div>
                  )}

                  {/* URLs de competidores */}
                  {(formData.analysisTypes.includes('backlinks') || formData.analysisTypes.includes('keywords')) && (
                    <div className="space-y-2">
                      <Label htmlFor="competitorUrls">URLs de Competidores</Label>
                      <Input
                        id="competitorUrls"
                        placeholder="https://competidor1.com, https://competidor2.com"
                        value={formData.competitorUrls || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, competitorUrls: e.target.value }))}
                      />
                      <p className="text-sm text-muted-foreground">
                        URLs para análisis comparativo
                      </p>
                    </div>
                  )}

                  {/* Configuración blockchain */}
                  {(formData.analysisTypes.includes('blockchain') || formData.analysisTypes.includes('web3')) && (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="blockchainAddress">Dirección Blockchain</Label>
                        <Input
                          id="blockchainAddress"
                          placeholder="0x..."
                          value={formData.blockchainAddress || ''}
                          onChange={(e) => setFormData(prev => ({ ...prev, blockchainAddress: e.target.value }))}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="network">Red</Label>
                        <Select
                          value={formData.network || 'ethereum'}
                          onValueChange={(value) => setFormData(prev => ({ ...prev, network: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ethereum">Ethereum</SelectItem>
                            <SelectItem value="polygon">Polygon</SelectItem>
                            <SelectItem value="bsc">BSC</SelectItem>
                            <SelectItem value="arbitrum">Arbitrum</SelectItem>
                            <SelectItem value="optimism">Optimism</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}
                </CardContent>
              )}
            </Card>

            {/* Botones de acción */}
            <div className="flex items-center gap-4">
              <Button
                type="submit"
                disabled={orchestrator.state.isAnalyzing || !formData.url || formData.analysisTypes.length === 0}
                className="flex-1"
              >
                <Play className="h-4 w-4 mr-2" />
                Iniciar Análisis Completo
              </Button>
              
              <Button
                type="button"
                variant="outline"
                onClick={handleQuickAnalysis}
                disabled={orchestrator.state.isAnalyzing || !formData.url}
              >
                <Zap className="h-4 w-4 mr-2" />
                Análisis Rápido
              </Button>
            </div>
          </form>
        </TabsContent>

        {/* Tab: Progreso */}
        <TabsContent value="progress" className="space-y-6">
          {orchestrator.state.isAnalyzing ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <RefreshCw className="h-5 w-5 animate-spin" />
                    Análisis en Progreso
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={orchestrator.actions.cancelAnalysis}
                  >
                    <Square className="h-4 w-4 mr-2" />
                    Cancelar
                  </Button>
                </CardTitle>
                <CardDescription>
                  {orchestrator.state.progress?.currentStep || 'Iniciando análisis...'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Progress value={orchestrator.utils.getProgressPercentage()} className="w-full" />
                
                <div className="text-sm text-muted-foreground">
                  Progreso: {orchestrator.utils.getProgressPercentage()}%
                </div>
                
                {orchestrator.state.progress && (
                  <div className="text-sm">
                    <div>
                      <span className="font-medium">Progreso:</span> {orchestrator.state.progress.progress}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Eye className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No hay análisis en progreso</h3>
                <p className="text-muted-foreground text-center mb-4">
                  Inicia un nuevo análisis desde la pestaña &quot;Nuevo Análisis&quot;
                </p>
                <Button onClick={() => setActiveTab('analysis')}>
                  Iniciar Análisis
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Tab: Resultados */}
        <TabsContent value="results" className="space-y-6">
          {orchestrator.state.result ? (
            <div className="space-y-6">
              {/* Resumen del resultado */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Resumen del Análisis
                    </div>
                    <div className="flex items-center gap-2">
                      {renderStatusBadge(orchestrator.state.result.status)}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => orchestrator.actions.exportResult('json')}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Exportar
                      </Button>
                    </div>
                  </CardTitle>
                  <CardDescription>
                    Análisis de {orchestrator.state.result.url} • {new Date(orchestrator.state.result.timestamp).toLocaleString()}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Scores */}
                  <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">
                        {orchestrator.state.result.score.overall}
                      </div>
                      <div className="text-sm text-muted-foreground">General</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {orchestrator.state.result.score.seo}
                      </div>
                      <div className="text-sm text-muted-foreground">SEO</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {orchestrator.state.result.score.performance}
                      </div>
                      <div className="text-sm text-muted-foreground">Performance</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-600">
                        {orchestrator.state.result.score.security}
                      </div>
                      <div className="text-sm text-muted-foreground">Seguridad</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">
                        {orchestrator.state.result.score.content}
                      </div>
                      <div className="text-sm text-muted-foreground">Contenido</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {orchestrator.state.result.score.technical}
                      </div>
                      <div className="text-sm text-muted-foreground">Técnico</div>
                    </div>
                  </div>

                  <Separator />

                  {/* Resumen */}
                  <div>
                    <h4 className="font-medium mb-2">Resumen</h4>
                    <p className="text-sm text-muted-foreground">
                      {orchestrator.state.result.summary.overview}
                    </p>
                  </div>

                  {/* Hallazgos clave */}
                  {orchestrator.state.result.summary.keyFindings.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2">Hallazgos Clave</h4>
                      <ul className="text-sm space-y-1">
                        {orchestrator.state.result.summary.keyFindings.map((finding, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <Target className="h-4 w-4 mt-0.5 text-blue-500 flex-shrink-0" />
                            {finding}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Recomendaciones */}
              {orchestrator.state.result.recommendations.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      Recomendaciones ({orchestrator.state.result.recommendations.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-96">
                      <div className="space-y-4">
                        {orchestrator.state.result.recommendations.map((rec, index) => (
                          <div key={rec.id} className="border rounded-lg p-4">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <Badge variant={rec.priority === 'critical' ? 'destructive' : rec.priority === 'high' ? 'default' : 'secondary'}>
                                  {rec.priority}
                                </Badge>
                                <Badge variant="outline">{rec.category}</Badge>
                              </div>
                              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                {renderAnalysisIcon(rec.source)}
                                {rec.source}
                              </div>
                            </div>
                            
                            <h5 className="font-medium mb-1">{rec.title}</h5>
                            <p className="text-sm text-muted-foreground mb-3">{rec.description}</p>
                            
                            <div className="grid grid-cols-2 gap-4 text-xs">
                              <div>
                                <span className="font-medium">Dificultad:</span> {rec.implementation.difficulty}
                              </div>
                              <div>
                                <span className="font-medium">Tiempo:</span> {rec.implementation.timeEstimate}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              )}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <BarChart3 className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No hay resultados disponibles</h3>
                <p className="text-muted-foreground text-center mb-4">
                  Completa un análisis para ver los resultados aquí
                </p>
                <Button onClick={() => setActiveTab('analysis')}>
                  Iniciar Análisis
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Tab: Historial */}
        <TabsContent value="history" className="space-y-6">
          {/* Controles del historial */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-medium">Historial de Análisis</h3>
              {compareMode && (
                <Badge variant="outline">
                  {selectedForComparison.length}/2 seleccionados
                </Badge>
              )}
            </div>
            
            {compareMode && selectedForComparison.length === 2 && (
              <Button onClick={handleCompareAnalyses}>
                <BarChart className="h-4 w-4 mr-2" />
                Comparar Seleccionados
              </Button>
            )}
          </div>

          {/* Lista del historial */}
          {orchestrator.state.isLoadingHistory ? (
            <Card>
              <CardContent className="flex items-center justify-center py-12">
                <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
              </CardContent>
            </Card>
          ) : orchestrator.state.history.length > 0 ? (
            <div className="space-y-4">
              {orchestrator.state.history.map((analysis) => (
                <Card key={analysis.id} className={cn(
                  'cursor-pointer transition-colors',
                  compareMode && selectedForComparison.includes(analysis.id) && 'ring-2 ring-primary'
                )}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-medium">{analysis.url}</h4>
                          {renderStatusBadge(analysis.status)}
                          {compareMode && (
                            <Checkbox
                              checked={selectedForComparison.includes(analysis.id)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  if (selectedForComparison.length < 2) {
                                    setSelectedForComparison(prev => [...prev, analysis.id]);
                                  }
                                } else {
                                  setSelectedForComparison(prev => prev.filter(id => id !== analysis.id));
                                }
                              }}
                              disabled={!selectedForComparison.includes(analysis.id) && selectedForComparison.length >= 2}
                            />
                          )}
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{new Date(analysis.timestamp).toLocaleString()}</span>
                          <span>Score: {analysis.score.overall}</span>
                          <span>{orchestrator.utils.formatProcessingTime(analysis.processingTime)}</span>
                          <div className="flex items-center gap-1">
                            {analysis.analysisTypes.map(type => (
                              <div key={type} className="flex items-center gap-1">
                                {renderAnalysisIcon(type, 'h-3 w-3')}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            orchestrator.state.result = analysis;
                            setActiveTab('results');
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => orchestrator.actions.exportResult('json')}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <History className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No hay análisis previos</h3>
                <p className="text-muted-foreground text-center mb-4">
                  Los análisis completados aparecerán aquí
                </p>
                <Button onClick={() => setActiveTab('analysis')}>
                  Realizar Primer Análisis
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Error Alert */}
      {orchestrator.state.error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription className="flex items-center justify-between">
            <span>{orchestrator.state.error}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={orchestrator.actions.clearError}
            >
              Cerrar
            </Button>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}