'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Brain, Globe, Search, Zap, Shield, Link, Users, 
  BarChart3, Crown, Gamepad2, CheckCircle, Award,
  TrendingUp, AlertTriangle, Info, ExternalLink
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
  return (
    <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Resultados del Análisis
            </CardTitle>
            <p className="text-gray-600 mt-1">
              Dirección: <code className="bg-gray-100 px-2 py-1 rounded text-sm">{address}</code>
            </p>
          </div>
          
          <div className="text-right">
            <div className="text-3xl font-bold text-blue-600">
              {overallScore}/100
            </div>
            <p className="text-sm text-gray-500">Puntuación General</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4 mt-4">
          <Badge variant="outline" className="flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            {completedCount}/{toolCount} Completadas
          </Badge>
          <Badge variant="secondary">
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
  const avgScore = completedResults.reduce((sum, r) => sum + (r.score || 0), 0) / completedResults.length;
  
  const allInsights = completedResults.flatMap(r => r.insights || []);
  const topInsights = allInsights.slice(0, 3);
  
  const allRecommendations = completedResults.flatMap(r => r.recommendations || []);
  const topRecommendations = allRecommendations.slice(0, 3);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-blue-500" />
          Resumen Ejecutivo
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{Math.round(avgScore)}</div>
            <div className="text-sm text-gray-600">Puntuación Promedio</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{completedResults.length}</div>
            <div className="text-sm text-gray-600">Análisis Completados</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{allInsights.length}</div>
            <div className="text-sm text-gray-600">Insights Generados</div>
          </div>
        </div>

        {topInsights.length > 0 && (
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Insights Principales:</h4>
            <ul className="space-y-1">
              {topInsights.map((insight, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <Info className="h-4 w-4 text-blue-500 flex-shrink-0 mt-0.5" />
                  <span>{insight}</span>
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
  const Icon = config.icon;
  
  return (
    <Card className="overflow-hidden">
      <CardHeader className={`bg-gradient-to-r ${config.color} text-white`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Icon className="h-6 w-6" />
            <div>
              <CardTitle className="text-lg">{result.toolName}</CardTitle>
              <p className="text-white/80 text-sm">
                {getStatusText(result.status)}
              </p>
            </div>
          </div>
          
          {result.score !== undefined && (
            <div className="text-right">
              <div className="text-2xl font-bold">{result.score}</div>
              <div className="text-white/80 text-xs">Puntuación</div>
            </div>
          )}
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
    <div className="space-y-6">
      {/* Métricas principales */}
      {result.metrics && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(result.metrics).slice(0, 4).map(([key, value]) => (
            <div key={key} className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-lg font-semibold text-gray-900">
                {formatMetricValue(value)}
              </div>
              <div className="text-xs text-gray-600 capitalize">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Insights */}
      {result.insights && result.insights.length > 0 && (
        <div>
          <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
            <Info className="h-4 w-4 text-blue-500" />
            Insights
          </h4>
          <div className="space-y-2">
            {result.insights.map((insight, index) => (
              <div key={index} className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                <p className="text-sm text-gray-700">{insight}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recomendaciones */}
      {result.recommendations && result.recommendations.length > 0 && (
        <div>
          <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-green-500" />
            Recomendaciones
          </h4>
          <div className="space-y-2">
            {result.recommendations.map((recommendation, index) => (
              <div key={index} className="p-3 bg-green-50 rounded-lg border-l-4 border-green-500">
                <p className="text-sm text-gray-700">{recommendation}</p>
              </div>
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
    <div className="space-y-6">
      {selectedTools.map((toolId) => {
        const config = TOOL_COMPONENTS[toolId];
        const Icon = config?.icon || Search;
        
        return (
          <Card key={toolId} className="overflow-hidden">
            <CardHeader className={`bg-gradient-to-r ${config?.color || 'from-gray-400 to-gray-500'} text-white`}>
              <div className="flex items-center gap-3">
                <Icon className="h-6 w-6" />
                <div>
                  <CardTitle className="text-lg">
                    {toolId.split('-').map(word => 
                      word.charAt(0).toUpperCase() + word.slice(1)
                    ).join(' ')}
                  </CardTitle>
                  <p className="text-white/80 text-sm">Iniciando análisis...</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="animate-pulse space-y-4">
                <div className="grid grid-cols-4 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-16 bg-gray-200 rounded"></div>
                  ))}
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

// Componente de recomendaciones consolidadas
function ConsolidatedRecommendations({ results }: { results: ToolResult[] }) {
  const allRecommendations = results
    .filter(r => r.status === 'completed')
    .flatMap(r => r.recommendations || []);
    
  if (allRecommendations.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-green-500" />
          Plan de Acción Consolidado
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {allRecommendations.slice(0, 5).map((recommendation, index) => (
            <div key={index} className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
              <div className="flex-shrink-0 w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                {index + 1}
              </div>
              <p className="text-sm text-gray-700">{recommendation}</p>
            </div>
          ))}
        </div>
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

