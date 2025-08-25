'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ContentAnalysisResults } from '../types';

interface OpportunitiesSectionProps {
  results: ContentAnalysisResults;
}

export default function OpportunitiesSection({ results }: OpportunitiesSectionProps) {
  const { opportunities } = results;
  return (
    <div className="space-y-6">
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          🚀 Oportunidades de Mejora
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Recomendaciones específicas para optimizar tu contenido
        </p>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        {opportunities.map((opportunity, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{opportunity.title}</CardTitle>
                  <CardDescription className="mt-2">
                    {opportunity.description}
                  </CardDescription>
                </div>
                <div className="flex flex-col items-end space-y-2">
                  <Badge 
                    variant={opportunity.difficulty === 'easy' ? 'default' : opportunity.difficulty === 'medium' ? 'secondary' : 'destructive'}
                    className="text-xs"
                  >
                    {opportunity.difficulty === 'easy' ? '🟢 Fácil' : opportunity.difficulty === 'medium' ? '🟡 Medio' : '🔴 Difícil'}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {opportunity.estimatedImpact}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2 text-green-700 dark:text-green-400">💡 Solución</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{opportunity.solution}</p>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2 text-blue-700 dark:text-blue-400">🔧 Implementación</h4>
                  <pre className="text-xs bg-gray-100 dark:bg-gray-800 p-3 rounded-md overflow-x-auto">
                    <code>{opportunity.implementation}</code>
                  </pre>
                </div>
                
                <div className="flex items-center justify-between pt-2 border-t">
                  <Badge variant="secondary" className="text-xs">
                    {opportunity.category === 'seo' ? 'SEO' :
                     opportunity.category === 'readability' ? 'Legibilidad' :
                     opportunity.category === 'engagement' ? 'Engagement' : 'Técnico'}
                  </Badge>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Impacto estimado: {opportunity.estimatedImpact}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}