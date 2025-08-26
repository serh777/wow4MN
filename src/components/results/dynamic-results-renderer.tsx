'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CircularProgress } from '@/components/ui/circular-progress';
import { 
  Brain, Globe, Search, Zap, Shield, Link, Users, 
  BarChart3, Crown, Gamepad2, CheckCircle, Award,
  TrendingUp, AlertTriangle, Info, ExternalLink, Database
} from 'lucide-react';

// Tipos para los resultados dinámicos
export interface ToolResult {
  toolId: string;
  toolName: string;
  status: 'completed' | 'running' | 'error' | 'pending';
  data: any;
  insights?: string[];
  recommendations?: string[];
  score?: number;
  metrics?: Record<string, any>;
  charts?: ChartData[];
  timestamp: string;
}

export interface ChartData {
  id: string;
  type: 'line' | 'bar' | 'pie' | 'area' | 'radar' | 'gauge';
  title: string;
  data: any[];
  config?: any;
}

export interface DynamicResultsProps {
  results: ToolResult[];
  selectedTools: string[];
  address: string;
  isLoading?: boolean;
  className?: string;
}

// Configuración de componentes por herramienta
const TOOL_COMPONENTS: Record<string, {
  icon: React.ComponentType<any>;
  color: string;
  priority: number;
  sections: string[];
}> = {
  'ai-assistant': {
    icon: Brain,
    color: 'from-purple-500 to-pink-500',
    priority: 1,
    sections: ['overview', 'insights', 'recommendations', 'score']
  },
  'blockchain': {
    icon: Globe,
    color: 'from-blue-500 to-cyan-500',
    priority: 2,
    sections: ['transactions', 'contracts', 'tokens', 'activity']
  },
  'nft-tracking': {
    icon: Award,
    color: 'from-indigo-500 to-purple-500',
    priority: 3,
    sections: ['collections', 'transfers', 'valuation', 'rarity']
  },
  'keywords': {
    icon: Search,
    color: 'from-yellow-500 to-orange-500',
    priority: 4,
    sections: ['volume', 'difficulty', 'trends', 'opportunities']
  },
  'backlinks': {
    icon: Link,
    color: 'from-green-500 to-emerald-500',
    priority: 5,
    sections: ['profile', 'quality', 'growth', 'competitors']
  },
  'performance': {
    icon: Zap,
    color: 'from-red-500 to-pink-500',
    priority: 6,
    sections: ['speed', 'vitals', 'optimization', 'mobile']
  },
  'security': {
    icon: Shield,
    color: 'from-gray-500 to-slate-500',
    priority: 7,
    sections: ['vulnerabilities', 'risks', 'audit', 'recommendations']
  },
  'social-web3': {
    icon: Users,
    color: 'from-pink-500 to-rose-500',
    priority: 8,
    sections: ['profiles', 'engagement', 'influence', 'growth']
  },
  'authority-tracking': {
    icon: Crown,
    color: 'from-amber-500 to-yellow-500',
    priority: 9,
    sections: ['governance', 'reputation', 'influence', 'participation']
  },
  'content-authenticity': {
    icon: CheckCircle,
    color: 'from-emerald-500 to-green-500',
    priority: 10,
    sections: ['verification', 'provenance', 'integrity', 'trust']
  },
  'metaverse-optimizer': {
    icon: Gamepad2,
    color: 'from-violet-500 to-purple-500',
    priority: 11,
    sections: ['assets', 'performance', 'compatibility', 'optimization']
  },
  'ecosystem-interactions': {
    icon: BarChart3,
    color: 'from-teal-500 to-cyan-500',
    priority: 12,
    sections: ['protocols', 'interactions', 'diversification', 'risks']
  },
  'security-scan': {
    icon: Shield,
    color: 'from-red-600 to-orange-600',
    priority: 13,
    sections: ['vulnerabilities', 'security-headers', 'ssl', 'privacy']
  },
  'social-media': {
    icon: Users,
    color: 'from-blue-600 to-indigo-600',
    priority: 14,
    sections: ['presence', 'engagement', 'audience', 'content']
  },
  'competitor-analysis': {
    icon: TrendingUp,
    color: 'from-purple-600 to-pink-600',
    priority: 15,
    sections: ['market-position', 'competitors', 'opportunities', 'metrics']
  },
  'seo-analyzer': {
    icon: Search,
    color: 'from-green-600 to-emerald-600',
    priority: 16,
    sections: ['technical', 'content', 'keywords', 'performance']
  },
  'performance-audit': {
    icon: Zap,
    color: 'from-yellow-600 to-orange-600',
    priority: 17,
    sections: ['core-vitals', 'lighthouse', 'resources', 'optimization']
  },
  'content-analysis': {
    icon: Brain,
    color: 'from-indigo-600 to-purple-600',
    priority: 18,
    sections: ['quality', 'readability', 'structure', 'engagement']
  },
  'content': {
    icon: Brain,
    color: 'from-indigo-600 to-purple-600',
    priority: 19,
    sections: ['quality', 'readability', 'structure', 'engagement']
  },
  'links': {
    icon: Link,
    color: 'from-green-500 to-emerald-500',
    priority: 20,
    sections: ['internal', 'external', 'broken', 'optimization']
  },
  'metadata': {
    icon: Search,
    color: 'from-blue-500 to-cyan-500',
    priority: 21,
    sections: ['tags', 'structure', 'seo', 'validation']
  },
  'wallet': {
    icon: Award,
    color: 'from-amber-500 to-yellow-500',
    priority: 22,
    sections: ['balance', 'transactions', 'tokens', 'activity']
  },
  'competition': {
    icon: BarChart3,
    color: 'from-orange-500 to-red-500',
    priority: 23,
    sections: ['competitors', 'market-share', 'analysis', 'opportunities']
  },
  'smart-contract': {
    icon: Shield,
    color: 'from-cyan-500 to-blue-500',
    priority: 24,
    sections: ['code-analysis', 'security', 'functions', 'events']
  },
  'historical': {
    icon: TrendingUp,
    color: 'from-indigo-500 to-purple-500',
    priority: 25,
    sections: ['trends', 'performance', 'metrics', 'analysis']
  }
};

export function DynamicResultsRenderer({ 
  results, 
  selectedTools, 
  address, 
  isLoading = false,
  className = '' 
}: DynamicResultsProps) {
  
  // Ordenar resultados por prioridad de herramienta
  const sortedResults = results.sort((a, b) => {
    const priorityA = TOOL_COMPONENTS[a.toolId]?.priority || 999;
    const priorityB = TOOL_COMPONENTS[b.toolId]?.priority || 999;
    return priorityA - priorityB;
  });

  // Filtrar solo herramientas seleccionadas
  const filteredResults = sortedResults.filter(result => 
    selectedTools.includes(result.toolId)
  );

  // Calcular puntuación general
  const overallScore = calculateOverallScore(filteredResults);

  if (isLoading) {
    return <LoadingResults selectedTools={selectedTools} />;
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header de Resultados */}
      <ResultsHeader 
        address={address}
        toolCount={selectedTools.length}
        overallScore={overallScore}
        completedCount={filteredResults.filter(r => r.status === 'completed').length}
      />

      {/* Resumen Ejecutivo */}
      {filteredResults.length > 1 && (
        <ExecutiveSummary results={filteredResults} />
      )}

      {/* Resultados por Herramienta */}
      <div className="grid gap-6">
        {filteredResults.map((result) => (
          <ToolResultCard 
            key={result.toolId}
            result={result}
            config={TOOL_COMPONENTS[result.toolId]}
          />
        ))}
      </div>

      {/* Recomendaciones Consolidadas */}
      {filteredResults.length > 0 && (
        <ConsolidatedRecommendations results={filteredResults} />
      )}
    </div>
  );
}

// Componente de Header de Resultados
function ResultsHeader({ 
  address, 
  toolCount, 
  overallScore, 
  completedCount 
}: {
  address: string;
  toolCount: number;
  overallScore: number;
  completedCount: number;
}) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'from-green-500 to-emerald-600';
    if (score >= 60) return 'from-yellow-500 to-orange-500';
    return 'from-red-500 to-rose-600';
  };

  return (
    <Card className="mb-8 border-0 shadow-xl bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900">
      <CardHeader className="pb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2">
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
              Resultados del Análisis
            </CardTitle>
            <p className="text-muted-foreground">
              Dirección: <code className="bg-muted px-2 py-1 rounded text-sm font-mono">{address}</code>
            </p>
            <div className="flex items-center gap-2 text-muted-foreground">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium">
                {completedCount} de {toolCount} herramientas completadas
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className={`text-4xl font-bold bg-gradient-to-r ${getScoreColor(overallScore)} bg-clip-text text-transparent`}>
                {overallScore}/100
              </div>
              <div className="text-sm text-muted-foreground font-medium">Puntuación General</div>
            </div>
            <div className="h-12 w-px bg-border"></div>
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-700 dark:text-slate-300">
                {Math.round((completedCount / toolCount) * 100)}%
              </div>
              <div className="text-sm text-muted-foreground font-medium">Completado</div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4 mt-6">
          <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200">
            {new Date().toLocaleDateString('es-ES', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </Badge>
        </div>
      </CardHeader>
    </Card>
  );
}

// Componente de Resumen Ejecutivo
function ExecutiveSummary({ results }: { results: ToolResult[] }) {
  const completedResults = results.filter(r => r.status === 'completed');
  const avgScore = completedResults.reduce((sum, r) => sum + (r.score || 0), 0) / completedResults.length || 0;
  
  const allInsights = completedResults.flatMap(r => r.insights || []);
  const topInsights = allInsights.slice(0, 3);
  
  // Calcular métricas adicionales
  const performanceScore = completedResults.find(r => r.toolId === 'performance')?.score || 0;
  const securityScore = completedResults.find(r => r.toolId === 'security')?.score || 0;
  const seoScore = completedResults.find(r => r.toolId === 'keywords')?.score || avgScore;

  const getScoreColor = (score: number): 'green' | 'yellow' | 'red' => {
    if (score >= 80) return 'green';
    if (score >= 60) return 'yellow';
    return 'red';
  };

  const getGradientColor = (score: number) => {
    if (score >= 80) return 'from-green-500 to-emerald-600';
    if (score >= 60) return 'from-yellow-500 to-orange-500';
    return 'from-red-500 to-rose-600';
  };

  return (
    <Card className="border-0 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-xl">
          <div className="p-2 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-lg">
            <TrendingUp className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <span className="bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent font-bold">
            Resumen Ejecutivo
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Círculos de progreso principales tipo Google Speed */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 justify-items-center">
          <div className="text-center">
            <CircularProgress 
              value={avgScore} 
              size={100} 
              color={getScoreColor(avgScore)}
              label="General"
            />
            <p className="text-sm text-gray-600 mt-2 font-medium">Puntuación General</p>
          </div>
          
          <div className="text-center">
            <CircularProgress 
              value={performanceScore} 
              size={100} 
              color={getScoreColor(performanceScore)}
              label="Performance"
            />
            <p className="text-sm text-gray-600 mt-2 font-medium">Rendimiento</p>
          </div>
          
          <div className="text-center">
            <CircularProgress 
              value={securityScore} 
              size={100} 
              color={getScoreColor(securityScore)}
              label="Security"
            />
            <p className="text-sm text-gray-600 mt-2 font-medium">Seguridad</p>
          </div>
          
          <div className="text-center">
            <CircularProgress 
              value={seoScore} 
              size={100} 
              color={getScoreColor(seoScore)}
              label="SEO"
            />
            <p className="text-sm text-gray-600 mt-2 font-medium">Optimización SEO</p>
          </div>
        </div>

        {/* Estadísticas adicionales */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="group">
            <Card className="p-6 border-0 bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 hover:shadow-md transition-all duration-300">
              <div className="text-center space-y-3">
                <div className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-cyan-600 bg-clip-text text-transparent group-hover:scale-105 transition-transform">
                  {completedResults.length}
                </div>
                <div className="text-sm text-muted-foreground font-medium">Análisis Completados</div>
                <div className="flex items-center justify-center gap-1 text-xs text-blue-600 dark:text-blue-400">
                  <CheckCircle className="w-3 h-3" />
                  <span>Procesamiento completo</span>
                </div>
              </div>
            </Card>
          </div>
          <div className="group">
            <Card className="p-6 border-0 bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 hover:shadow-md transition-all duration-300">
              <div className="text-center space-y-3">
                <div className="text-3xl font-bold bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent group-hover:scale-105 transition-transform">
                  {allInsights.length}
                </div>
                <div className="text-sm text-muted-foreground font-medium">Insights Generados</div>
                <div className="flex items-center justify-center gap-1 text-xs text-green-600 dark:text-green-400">
                  <Info className="w-3 h-3" />
                  <span>Análisis completado</span>
                </div>
              </div>
            </Card>
          </div>
          <div className="group">
            <Card className="p-6 border-0 bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 hover:shadow-md transition-all duration-300">
              <div className="text-center space-y-3">
                <div className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-violet-600 bg-clip-text text-transparent group-hover:scale-105 transition-transform">
                  {results.length}
                </div>
                <div className="text-sm text-muted-foreground font-medium">Herramientas Utilizadas</div>
                <div className="flex items-center justify-center gap-1 text-xs text-purple-600 dark:text-purple-400">
                  <Database className="w-3 h-3" />
                  <span>Herramientas activas</span>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {topInsights.length > 0 && (
          <div>
            <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Insights Principales:</h4>
            <ul className="space-y-1">
              {topInsights.map((insight, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <Info className="h-4 w-4 text-blue-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 dark:text-gray-300">{insight}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Componente de Tarjeta de Resultado por Herramienta
function ToolResultCard({ 
  result, 
  config 
}: { 
  result: ToolResult;
  config: typeof TOOL_COMPONENTS[string];
}) {
  // Verificación de seguridad para config
  if (!config) {
    console.warn(`Config no encontrado para herramienta: ${result.toolId}`);
    return (
      <Card className="overflow-hidden border-0 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-gray-500 to-slate-500 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Search className="h-6 w-6" />
              <div>
                <CardTitle className="text-lg">{result.toolName || result.toolId}</CardTitle>
                <p className="text-white/80 text-sm">
                  {getStatusText(result.status)}
                </p>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-center py-8">
            <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Configuración no encontrada</h3>
            <p className="text-gray-600">La herramienta {result.toolId} no está configurada correctamente.</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  const Icon = config.icon;
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-5 w-5" />;
      case 'running': return <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>;
      case 'error': return <AlertTriangle className="h-5 w-5" />;
      default: return <div className="h-5 w-5 rounded-full bg-white/30"></div>;
    }
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800';
      case 'running': return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800';
      case 'error': return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800';
      default: return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-300 dark:border-gray-800';
    }
  };
  
  return (
    <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900">
      <CardHeader className={`bg-gradient-to-r ${config.color} text-white relative overflow-hidden`}>
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative flex items-center gap-4">
          <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
            <Icon className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <CardTitle className="text-xl font-bold">{result.toolName}</CardTitle>
            <p className="text-white/90 text-sm font-medium">
              {result.status === 'completed' ? 'Análisis completado exitosamente' : 
               result.status === 'running' ? 'Procesando análisis...' :
               result.status === 'error' ? 'Error durante el análisis' : 'En cola de procesamiento'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {result.score !== undefined && (
              <div className="text-center">
                <div className="text-2xl font-bold">{Math.round(result.score)}</div>
                <div className="text-xs text-white/80">Score</div>
              </div>
            )}
            <Badge className={`${getStatusColor(result.status)} border`}>
              <div className="flex items-center gap-1">
                {getStatusIcon(result.status)}
                <span className="font-medium">
                  {result.status === 'completed' ? 'Completado' :
                   result.status === 'running' ? 'En Progreso' :
                   result.status === 'error' ? 'Error' : 'Pendiente'}
                </span>
              </div>
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-6">
        {result.status === 'completed' ? (
          <CompletedToolResult result={result} sections={config.sections} />
        ) : result.status === 'error' ? (
          <ErrorToolResult result={result} />
        ) : (
          <PendingToolResult result={result} />
        )}
      </CardContent>
    </Card>
  );
}

// Componente para resultado completado
function CompletedToolResult({ 
  result, 
  sections 
}: { 
  result: ToolResult;
  sections: string[];
}) {
  return (
    <div className="space-y-8">
      {/* Métricas principales */}
      {result.metrics && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(result.metrics).slice(0, 4).map(([key, value]) => (
            <div key={key} className="group">
              <Card className="p-4 border-0 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 hover:shadow-md transition-all duration-300">
                <div className="text-center space-y-2">
                  <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 group-hover:scale-105 transition-transform">
                    {formatMetricValue(value)}
                  </div>
                  <div className="text-xs text-muted-foreground font-medium capitalize leading-tight">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </div>
                </div>
              </Card>
            </div>
          ))}
        </div>
      )}

      {/* Insights */}
      {result.insights && result.insights.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Info className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Insights Clave</h4>
          </div>
          <div className="grid gap-3">
            {result.insights.map((insight, index) => (
              <Card key={index} className="border-0 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-l-4 border-l-blue-500">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="p-1 bg-blue-200 dark:bg-blue-800 rounded-full mt-1">
                      <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full"></div>
                    </div>
                    <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed flex-1">{insight}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Recomendaciones */}
      {result.recommendations && result.recommendations.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Recomendaciones</h4>
          </div>
          <div className="grid gap-3">
            {result.recommendations.map((recommendation, index) => (
              <Card key={index} className="border-0 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-l-4 border-l-green-500">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="p-1 bg-green-200 dark:bg-green-800 rounded-full mt-1">
                      <CheckCircle className="w-3 h-3 text-green-600 dark:text-green-400" />
                    </div>
                    <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed flex-1">{recommendation}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Gráficos */}
      {result.charts && result.charts.length > 0 && (
        <div>
          <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-purple-500" />
            Visualizaciones
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {result.charts.map((chart) => (
              <ChartPlaceholder key={chart.id} chart={chart} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Componente para resultado con error
function ErrorToolResult({ result }: { result: ToolResult }) {
  return (
    <div className="text-center py-8">
      <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">Error en el Análisis</h3>
      <p className="text-gray-600 mb-4">
        No se pudo completar el análisis de {result.toolName}
      </p>
      <Badge variant="destructive">Error</Badge>
    </div>
  );
}

// Componente para resultado pendiente
function PendingToolResult({ result }: { result: ToolResult }) {
  return (
    <div className="text-center py-8">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">Procesando...</h3>
      <p className="text-gray-600 mb-4">
        Analizando datos con {result.toolName}
      </p>
      <Badge variant="secondary">En Progreso</Badge>
    </div>
  );
}

// Componente de placeholder para gráficos
function ChartPlaceholder({ chart }: { chart: ChartData }) {
  return (
    <div className="p-4 border rounded-lg bg-gray-50">
      <h5 className="font-medium text-gray-900 mb-2">{chart.title}</h5>
      <div className="h-32 bg-gray-200 rounded flex items-center justify-center">
        <div className="text-gray-500 text-sm">
          Gráfico {chart.type} - {chart.data.length} puntos de datos
        </div>
      </div>
    </div>
  );
}

// Componente de carga
function LoadingResults({ selectedTools }: { selectedTools: string[] }) {
  return (
    <div className="space-y-8">
      {/* Header de carga */}
      <Card className="border-0 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 shadow-lg animate-pulse">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600 rounded-lg"></div>
            <div className="space-y-2 flex-1">
              <div className="h-6 bg-gradient-to-r from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600 rounded w-1/3"></div>
              <div className="h-4 bg-gradient-to-r from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600 rounded w-1/2"></div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="text-center space-y-3">
                <div className="w-16 h-16 bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600 rounded-full mx-auto"></div>
                <div className="h-4 bg-gradient-to-r from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600 rounded w-3/4 mx-auto"></div>
                <div className="h-3 bg-gradient-to-r from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600 rounded w-1/2 mx-auto"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Cards de herramientas cargando */}
      {selectedTools.map((toolId) => {
        const config = TOOL_COMPONENTS[toolId];
        const Icon = config?.icon || Search;
        
        return (
          <Card key={toolId} className="border-0 bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 shadow-lg animate-pulse">
            <CardHeader className={`bg-gradient-to-r ${config?.color || 'from-gray-400 to-gray-500'} text-white relative overflow-hidden`}>
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-bold">
                      {toolId.split('-').map(word => 
                        word.charAt(0).toUpperCase() + word.slice(1)
                      ).join(' ')}
                    </CardTitle>
                    <p className="text-white/90 text-sm font-medium">Iniciando análisis...</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <Badge className="bg-white/20 text-white border-white/30">
                    <span className="font-medium">Procesando</span>
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                {/* Métricas simuladas */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <Card key={i} className="p-4 border-0 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700">
                      <div className="text-center space-y-2">
                        <div className="h-8 bg-gradient-to-r from-slate-300 to-slate-400 dark:from-slate-600 dark:to-slate-500 rounded w-12 mx-auto animate-pulse"></div>
                        <div className="h-3 bg-gradient-to-r from-slate-300 to-slate-400 dark:from-slate-600 dark:to-slate-500 rounded w-16 mx-auto animate-pulse"></div>
                      </div>
                    </Card>
                  ))}
                </div>
                
                {/* Contenido simulado */}
                <div className="space-y-4">
                  <div className="space-y-3">
                    <div className="h-4 bg-gradient-to-r from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600 rounded animate-pulse"></div>
                    <div className="h-4 bg-gradient-to-r from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600 rounded w-5/6 animate-pulse"></div>
                    <div className="h-4 bg-gradient-to-r from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600 rounded w-4/6 animate-pulse"></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
      
      {/* Indicador de progreso global */}
      <Card className="border-0 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 shadow-lg">
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
              <span className="text-lg font-semibold text-slate-900 dark:text-slate-100">Procesando análisis...</span>
            </div>
            <p className="text-sm text-muted-foreground">Esto puede tomar unos momentos mientras procesamos todos los datos</p>
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
              <div className="h-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full animate-pulse" style={{ width: '60%' }}></div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Componente de recomendaciones consolidadas
function ConsolidatedRecommendations({ results }: { results: ToolResult[] }) {
  const allRecommendations = results
    .filter(r => r.status === 'completed' && r.recommendations)
    .flatMap(r => r.recommendations!)
    .filter((rec, index, arr) => arr.indexOf(rec) === index); // Eliminar duplicados

  if (allRecommendations.length === 0) return null;

  const priorityRecommendations = allRecommendations.slice(0, 5);
  const additionalRecommendations = allRecommendations.slice(5, 10);

  return (
    <Card className="mt-8 border-0 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-xl">
          <div className="p-2 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-lg">
            <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
          <span className="bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent font-bold">
            Recomendaciones Consolidadas
          </span>
        </CardTitle>
        <p className="text-sm text-muted-foreground mt-2">
          Acciones prioritarias basadas en el análisis completo
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Recomendaciones prioritarias */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-1 bg-red-100 dark:bg-red-900/30 rounded-full">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            </div>
            <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 uppercase tracking-wide">Prioridad Alta</h4>
          </div>
          <div className="grid gap-3">
            {priorityRecommendations.map((recommendation, index) => (
              <Card key={index} className="border-0 bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-950/20 dark:to-rose-950/20 border-l-4 border-l-red-500 hover:shadow-md transition-all duration-300">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-red-100 dark:bg-red-900/50 rounded-lg mt-0.5">
                      <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{recommendation}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="destructive" className="text-xs">
                          Crítico
                        </Badge>
                        <span className="text-xs text-muted-foreground">#{index + 1}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Recomendaciones adicionales */}
        {additionalRecommendations.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-1 bg-yellow-100 dark:bg-yellow-900/30 rounded-full">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              </div>
              <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 uppercase tracking-wide">Recomendaciones Adicionales</h4>
            </div>
            <div className="grid gap-3">
              {additionalRecommendations.map((recommendation, index) => (
                <Card key={index + 5} className="border-0 bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-950/20 dark:to-amber-950/20 border-l-4 border-l-yellow-500 hover:shadow-md transition-all duration-300">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="p-1 bg-yellow-200 dark:bg-yellow-800 rounded-full mt-1">
                        <CheckCircle className="w-3 h-3 text-yellow-600 dark:text-yellow-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{recommendation}</p>
                        <span className="text-xs text-muted-foreground">#{index + 6}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Contador de recomendaciones adicionales */}
        {allRecommendations.length > 10 && (
          <div className="text-center pt-4 border-t border-slate-200 dark:border-slate-700">
            <Badge variant="secondary" className="bg-gradient-to-r from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 text-slate-700 dark:text-slate-300">
              <Info className="w-3 h-3 mr-1" />
              +{allRecommendations.length - 10} recomendaciones adicionales disponibles
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Funciones de utilidad
function calculateOverallScore(results: ToolResult[]): number {
  const completedResults = results.filter(r => r.status === 'completed' && r.score !== undefined);
  if (completedResults.length === 0) return 0;
  
  const totalScore = completedResults.reduce((sum, r) => sum + (r.score || 0), 0);
  return Math.round(totalScore / completedResults.length);
}

function getStatusText(status: string): string {
  switch (status) {
    case 'completed': return 'Análisis completado';
    case 'running': return 'Analizando...';
    case 'error': return 'Error en análisis';
    case 'pending': return 'En cola';
    default: return 'Estado desconocido';
  }
}

function formatMetricValue(value: any): string {
  if (typeof value === 'number') {
    if (value > 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value > 1000) return `${(value / 1000).toFixed(1)}K`;
    return value.toFixed(0);
  }
  return String(value);
}

