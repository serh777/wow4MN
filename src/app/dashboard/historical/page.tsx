'use client';

import * as React from 'react';
import Link from 'next/link';
import { ToolLayout } from '@/app/dashboard/content/analysis-results/components/tool-components';
import { HistoricalForm } from './components/historical-form';
import { HistoricalVisualization } from './components/historical-visualization';
import { HistoricalMetrics } from './components/historical-metrics';
import { HistoricalRecommendations } from './components/historical-recommendations';
import { useHistoricalAnalysis } from './components/use-historical-analysis';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, ExternalLink } from 'lucide-react';
import ErrorBoundary from '@/components/error-boundary';

export default function HistoricalAnalysisPage() {
  const { loading, results, handleSubmit } = useHistoricalAnalysis();

  return (
    <ToolLayout 
      title="Análisis Histórico" 
      description="Evalúa la evolución de tu proyecto Web3 a lo largo del tiempo"
    >
      <ErrorBoundary>
        <HistoricalForm onSubmit={handleSubmit} loading={loading} />
        
        {results && (
          <>
            {/* Analysis Completion Message */}
            <Card className="p-6 bg-green-50 border-green-200">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-6 w-6 text-green-600" />
                <div className="flex-1">
                  <h3 className="font-semibold text-green-900">¡Análisis completado!</h3>
                  <p className="text-sm text-green-700 mt-1">
                    Serás redirigido automáticamente a los resultados detallados en unos segundos...
                  </p>
                </div>
                <Button asChild variant="outline" size="sm">
                  <Link href="/dashboard/historical/analysis-results" className="flex items-center gap-2">
                    Ver resultados
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </Card>

            {/* Original Results Display */}
            <div className="space-y-6">
              <Card className="p-6">
                <HistoricalMetrics data={results.data} score={results.score} />
              </Card>
              
              <Card className="p-6">
                <HistoricalVisualization metrics={results.data.metrics} />
              </Card>
              
              <Card className="p-6">
                <HistoricalRecommendations recommendations={results.data.recommendations} />
              </Card>
            </div>
          </>
        )}
      </ErrorBoundary>
    </ToolLayout>
  );
}