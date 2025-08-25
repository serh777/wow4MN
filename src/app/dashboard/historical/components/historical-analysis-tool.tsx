'use client';

import * as React from 'react';
import { ToolLayout } from '@/app/dashboard/results/content/components/tool-components';
import { HistoricalForm } from './historical-form';
import { HistoricalVisualization } from './historical-visualization';
import { HistoricalMetrics } from './historical-metrics';
import { HistoricalRecommendations } from './historical-recommendations';
import { useHistoricalAnalysis } from './use-historical-analysis';
import { Card } from '@/components/ui/card';

export function HistoricalAnalysisTool() {
  const { loading, results, handleSubmit } = useHistoricalAnalysis();

  return (
    <ToolLayout 
      title="Análisis Histórico" 
      description="Analiza la evolución de tu proyecto Web3 a lo largo del tiempo"
      icon="📊"
    >
      <HistoricalForm onSubmit={handleSubmit} loading={loading} />
      
      {results && (
        <div className="space-y-6 mt-6">
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
      )}
    </ToolLayout>
  );
}