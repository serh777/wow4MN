'use client';

import * as React from 'react';
import { ToolLayout } from '@/app/dashboard/content/analysis-results/components/tool-components';
import { SmartContractAnalysisForm } from './smart-contract-analysis-form';
import { SmartContractAnalysisResults } from './smart-contract-analysis-results';
import { useSmartContractAnalysis } from './use-smart-contract-analysis';

export function SmartContractAnalysisTool() {
  const { loading, results, handleSubmit } = useSmartContractAnalysis();

  return (
    <ToolLayout 
      title="Análisis de Smart Contract" 
      description="Evalúa y optimiza tu contrato inteligente para mejor visibilidad"
      icon="blockchain"
    >
      <SmartContractAnalysisForm onSubmit={handleSubmit} loading={loading} />
      {results && <SmartContractAnalysisResults results={results} />}
    </ToolLayout>
  );
}