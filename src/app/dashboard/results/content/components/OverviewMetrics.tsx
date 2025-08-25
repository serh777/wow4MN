'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  FileText, 
  Search, 
  Users, 
  Zap, 
  TrendingUp, 
  CheckCircle 
} from 'lucide-react';
import { ContentAnalysisResults } from '../types';
import { cn } from '@/lib/utils';

interface OverviewMetricsProps {
  results: ContentAnalysisResults;
}

// Componente Progress personalizado con colores dinámicos
const DynamicProgress = ({ value, className }: { value: number; className?: string }) => {
  const getProgressBarClass = (score: number) => {
    if (score >= 80) return 'progress-bar-green';
    if (score >= 60) return 'progress-bar-yellow';
    return 'progress-bar-red';
  };
  
  return (
    <div className={cn("relative h-2 w-full overflow-hidden rounded-full bg-secondary", className)}>
      <div 
        className={cn("h-full rounded-full progress-bar-animated", getProgressBarClass(value))}
        data-progress={value || 0}
      />
    </div>
  );
};

export default function OverviewMetrics({
  results
}: OverviewMetricsProps) {
  const {
    contentMetrics,
    seoOptimization,
    engagementMetrics,
    technicalSeo,
    contentStrategy
  } = results;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Calidad del Contenido</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{contentMetrics.readabilityScore}</div>
            <p className="text-xs text-muted-foreground">Puntuación de legibilidad</p>
            <div className="mt-2">
              <DynamicProgress value={contentMetrics.readabilityScore} />
            </div>
            <div className="mt-2 text-xs text-gray-600 dark:text-gray-400">
              Longitud: {contentMetrics.contentLength} palabras
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Optimización SEO</CardTitle>
            <Search className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{seoOptimization.titleOptimization}</div>
            <p className="text-xs text-muted-foreground">Optimización de título</p>
            <div className="mt-2">
              <DynamicProgress value={seoOptimization.titleOptimization} />
            </div>
            <div className="mt-2 flex items-center space-x-2">
              <Badge variant={seoOptimization.metaDescription > 70 ? 'default' : 'destructive'} className="dark:text-white text-xs">
                Meta: {seoOptimization.metaDescription}%
              </Badge>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Engagement</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{engagementMetrics.timeOnPage}</div>
            <p className="text-xs text-muted-foreground">Tiempo en página (min)</p>
            <div className="mt-2">
              <DynamicProgress value={Math.min(engagementMetrics.timeOnPage * 20, 100)} />
            </div>
            <div className="mt-2 text-xs text-gray-600 dark:text-gray-400">
              Rebote: {engagementMetrics.bounceRate}%
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">SEO Técnico</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{technicalSeo.pageSpeed}</div>
            <p className="text-xs text-muted-foreground">Velocidad de página</p>
            <div className="mt-2">
              <DynamicProgress value={technicalSeo.pageSpeed} />
            </div>
            <div className="mt-2 flex items-center space-x-2">
              <Badge variant={technicalSeo.mobileOptimization > 80 ? 'default' : 'destructive'} className="dark:text-white text-xs">
                Móvil: {technicalSeo.mobileOptimization}%
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {contentStrategy && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>Estrategia de Contenido</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">Palabras Clave Objetivo</h4>
                <div className="flex flex-wrap gap-2">
                  {contentStrategy.targetKeywords.slice(0, 5).map((keyword, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Recomendaciones</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  {contentStrategy.recommendations.slice(0, 3).map((rec, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}