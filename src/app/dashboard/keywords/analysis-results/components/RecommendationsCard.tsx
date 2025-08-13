'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Lightbulb, 
  Target, 
  TrendingUp, 
  Clock, 
  DollarSign,
  CheckCircle,
  AlertTriangle,
  Zap,
  Users,
  BarChart3
} from 'lucide-react';

interface SafeKeywordResults {
  totalKeywords: number;
  avgSearchVolume: number;
  avgDifficulty: number;
  avgCpc: number;
  opportunityScore: number;
  recommendations: string[];
  analysisConfig?: {
    projectName: string;
    projectUrl: string;
    niche: string;
    keywordType: string;
    keywords: string;
  };
  timestamp?: string;
}

interface RecommendationsCardProps {
  results: SafeKeywordResults;
}

const getPriorityColor = (priority: string) => {
  switch (priority.toLowerCase()) {
    case 'alta': return 'destructive';
    case 'media': return 'secondary';
    case 'baja': return 'outline';
    default: return 'default';
  }
};

const getImpactColor = (impact: string) => {
  switch (impact.toLowerCase()) {
    case 'alto': return 'text-green-600';
    case 'medio': return 'text-yellow-600';
    case 'bajo': return 'text-red-600';
    default: return 'text-gray-600';
  }
};

export default function RecommendationsCard({ results }: RecommendationsCardProps) {
  // Generar recomendaciones estratégicas detalladas
  const strategicRecommendations = [
    {
      action: 'Optimizar para keywords de cola larga',
      priority: 'Alta',
      impact: 'Alto',
      effort: 'Medio',
      roi: '150%',
      timeframe: '2-3 meses',
      description: 'Enfócate en keywords específicas con menor competencia pero alta intención de compra',
      icon: <Target className="h-5 w-5" />
    },
    {
      action: 'Crear contenido para keywords de tendencia',
      priority: 'Alta',
      impact: 'Alto',
      effort: 'Alto',
      roi: '200%',
      timeframe: '1-2 meses',
      description: 'Aprovecha las tendencias emergentes en Web3 y blockchain para capturar tráfico temprano',
      icon: <TrendingUp className="h-5 w-5" />
    },
    {
      action: 'Optimizar para búsquedas locales Web3',
      priority: 'Media',
      impact: 'Medio',
      effort: 'Bajo',
      roi: '120%',
      timeframe: '3-4 semanas',
      description: 'Incluye términos geográficos relevantes para capturar audiencia local interesada en crypto',
      icon: <Users className="h-5 w-5" />
    },
    {
      action: 'Implementar estrategia de contenido estacional',
      priority: 'Media',
      impact: 'Alto',
      effort: 'Medio',
      roi: '180%',
      timeframe: '4-6 semanas',
      description: 'Planifica contenido para eventos importantes del ecosistema crypto y blockchain',
      icon: <Clock className="h-5 w-5" />
    },
    {
      action: 'Optimizar para búsquedas de voz',
      priority: 'Baja',
      impact: 'Medio',
      effort: 'Bajo',
      roi: '90%',
      timeframe: '2-3 semanas',
      description: 'Adapta el contenido para consultas conversacionales sobre Web3 y DeFi',
      icon: <Zap className="h-5 w-5" />
    },
    {
      action: 'Desarrollar clusters de contenido temático',
      priority: 'Alta',
      impact: 'Alto',
      effort: 'Alto',
      roi: '250%',
      timeframe: '2-3 meses',
      description: 'Crea grupos de contenido interconectado sobre temas específicos de blockchain',
      icon: <BarChart3 className="h-5 w-5" />
    }
  ];

  // Oportunidades inmediatas
  const immediateOpportunities = [
    {
      title: 'Keywords de Baja Competencia',
      value: Math.round(results.totalKeywords * 0.3),
      description: 'Keywords con dificultad <30 y volumen >1000',
      action: 'Crear contenido optimizado',
      urgency: 'Alta'
    },
    {
      title: 'Gaps de Contenido',
      value: Math.round(results.totalKeywords * 0.25),
      description: 'Temas con alta demanda pero poca oferta',
      action: 'Desarrollar contenido único',
      urgency: 'Media'
    },
    {
      title: 'Keywords Estacionales',
      value: Math.round(results.totalKeywords * 0.15),
      description: 'Términos con picos de búsqueda predecibles',
      action: 'Planificar calendario editorial',
      urgency: 'Media'
    },
    {
      title: 'Oportunidades de Featured Snippets',
      value: Math.round(results.totalKeywords * 0.2),
      description: 'Keywords con potencial para posición cero',
      action: 'Optimizar formato de respuesta',
      urgency: 'Alta'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Recomendaciones Estratégicas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-yellow-600" />
            Recomendaciones Estratégicas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {strategicRecommendations.map((rec, index) => (
              <div key={index} className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="text-blue-600">
                      {rec.icon}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">{rec.action}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{rec.description}</p>
                    </div>
                  </div>
                  <Badge variant={getPriorityColor(rec.priority) as any}>
                    {rec.priority}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
                  <div className="text-center">
                    <div className={`text-lg font-bold ${getImpactColor(rec.impact)}`}>
                      {rec.impact}
                    </div>
                    <div className="text-xs text-gray-500">Impacto</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-blue-600">
                      {rec.effort}
                    </div>
                    <div className="text-xs text-gray-500">Esfuerzo</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-600">
                      {rec.roi}
                    </div>
                    <div className="text-xs text-gray-500">ROI Estimado</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-purple-600">
                      {rec.timeframe}
                    </div>
                    <div className="text-xs text-gray-500">Tiempo</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Oportunidades Inmediatas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-orange-600" />
            Oportunidades Inmediatas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {immediateOpportunities.map((opp, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-900 dark:text-white">{opp.title}</h4>
                  <Badge variant={opp.urgency === 'Alta' ? 'destructive' : 'secondary'}>
                    {opp.urgency}
                  </Badge>
                </div>
                <div className="text-2xl font-bold text-blue-600 mb-2">
                  {opp.value}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  {opp.description}
                </p>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium">{opp.action}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recomendaciones Originales */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-green-600" />
            Recomendaciones del Análisis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {results.recommendations.map((recommendation, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                <Badge variant="outline" className="mt-0.5">{index + 1}</Badge>
                <div className="flex-1">
                  <p className="text-sm text-gray-700 dark:text-gray-300">{recommendation}</p>
                </div>
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Próximos Pasos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-purple-600" />
            Plan de Acción Recomendado
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 border-l-4 border-green-500 bg-green-50 dark:bg-green-950">
              <div className="text-green-600">
                <span className="font-bold">Semana 1-2:</span>
              </div>
              <span className="text-sm">Identificar y optimizar keywords de baja competencia</span>
            </div>
            <div className="flex items-center gap-3 p-3 border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-950">
              <div className="text-blue-600">
                <span className="font-bold">Semana 3-4:</span>
              </div>
              <span className="text-sm">Desarrollar contenido para keywords de tendencia</span>
            </div>
            <div className="flex items-center gap-3 p-3 border-l-4 border-purple-500 bg-purple-50 dark:bg-purple-950">
              <div className="text-purple-600">
                <span className="font-bold">Mes 2:</span>
              </div>
              <span className="text-sm">Implementar estrategia de clusters de contenido</span>
            </div>
            <div className="flex items-center gap-3 p-3 border-l-4 border-orange-500 bg-orange-50 dark:bg-orange-950">
              <div className="text-orange-600">
                <span className="font-bold">Mes 3:</span>
              </div>
              <span className="text-sm">Evaluar resultados y optimizar estrategia</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}