'use client';

import * as React from 'react';
import { ToolLayout } from '@/app/dashboard/content/analysis-results/components/tool-components';
import { KeywordsForm } from './keywords-form';
import { KeywordsResults } from '@/app/dashboard/keywords/components/keywords-results';
import { useKeywordsAnalysis } from './use-keywords-analysis';

export function KeywordsTool() {
  const { loading, results, handleSubmit } = useKeywordsAnalysis();

  return (
    <ToolLayout 
      title="Análisis de Keywords" 
      description="Analiza y optimiza las palabras clave de tu proyecto Web3"
      icon="🔍"
    >
      <KeywordsForm onSubmit={handleSubmit} loading={loading} />
      {results && <KeywordsResults results={results} />}
    </ToolLayout>
  );
}