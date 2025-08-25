'use client';

import * as React from 'react';
import { ToolLayout } from '@/app/dashboard/results/content/components/tool-components';
import { SocialWeb3AnalysisForm } from './social-web3-analysis-form';
import { SocialWeb3AnalysisResults } from './social-web3-analysis-results';
import { useSocialWeb3Analysis } from './use-social-web3-analysis';

export function SocialWeb3AnalysisTool() {
  const { loading, results, handleSubmit } = useSocialWeb3Analysis();

  return (
    <ToolLayout 
      title="Análisis Social Web3" 
      description="Evalúa y optimiza tu presencia en plataformas sociales descentralizadas"
      icon="blockchain"
    >
      <SocialWeb3AnalysisForm onSubmit={handleSubmit} loading={loading} />
      {results && <SocialWeb3AnalysisResults results={results} />}
    </ToolLayout>
  );
}