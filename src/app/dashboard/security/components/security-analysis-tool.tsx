'use client';

import * as React from 'react';
import { ToolLayout } from '@/app/dashboard/results/content/components/tool-components';
import { SecurityAnalysisForm } from './security-analysis-form';
import { SecurityAnalysisResults } from './security-analysis-results';
import { useSecurityAnalysis } from './use-security-analysis';

export function SecurityAnalysisTool() {
  const { loading, results, handleSubmit } = useSecurityAnalysis();

  return (
    <ToolLayout 
      title="Auditoría de Seguridad" 
      description="Evalúa la seguridad de contratos inteligentes, wallets y infraestructura Web3"
      icon="🔒"
    >
      <SecurityAnalysisForm onSubmit={handleSubmit} loading={loading} />
      {results && <SecurityAnalysisResults results={results} />}
    </ToolLayout>
  );
}