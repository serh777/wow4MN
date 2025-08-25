'use client';

import * as React from 'react';
import { ToolLayout } from '@/app/dashboard/results/content/components/tool-components';
import { PerformanceAnalysisForm } from './performance-analysis-form';
import { PerformanceAnalysisResults } from './performance-analysis-results';
import { usePerformanceAnalysis } from './use-performance-analysis';

export function PerformanceAnalysisTool() {
  const { loading, results, handleSubmit } = usePerformanceAnalysis();

  return (
    <ToolLayout 
      title="Monitoreo de Rendimiento en Blockchain" 
      description="Analiza y optimiza el rendimiento de tus contratos y transacciones"
      icon="performance"
    >
      <PerformanceAnalysisForm onSubmit={handleSubmit} loading={loading} />
      {results && <PerformanceAnalysisResults results={results} />}
    </ToolLayout>
  );
}