'use client';

import React from 'react';
import { ToolLayout } from '@/app/dashboard/results/content/components/tool-components';
import { LinksForm } from './links-form';
import { LinksResults } from './links-results';
import { useLinksAnalysis } from './use-links-analysis';

export function LinksTool() {
  const { loading, results, handleSubmit } = useLinksAnalysis();

  return (
    <ToolLayout 
      title="Análisis de Enlaces" 
      description="Analiza la salud, SEO y rendimiento de todos los enlaces en tu sitio web"
    >
      <LinksForm onSubmit={handleSubmit} loading={loading} />
      
      {results && (
        <LinksResults results={results} />
      )}
    </ToolLayout>
  );
}