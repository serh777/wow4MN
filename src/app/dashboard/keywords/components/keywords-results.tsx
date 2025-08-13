'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { SaveAnalysisButton } from '@/components/notifications/notification-system';
import { KeywordsAnalysis } from './keywords-analysis';
import { KeywordsVisualization } from './keywords-visualization';
import type { KeywordAnalysisResult } from '../types';

interface KeywordsResultsProps {
  results: KeywordAnalysisResult;
}

export function KeywordsResults({ results }: KeywordsResultsProps) {
  return (
    <>
      <div className="flex justify-end mb-4">
        <SaveAnalysisButton analysisData={results} />
      </div>

      <KeywordsAnalysis data={results.data} />
      
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Visualización de Keywords</CardTitle>
          <CardDescription>
            Representación visual de tus palabras clave
          </CardDescription>
        </CardHeader>
        <CardContent>
          <KeywordsVisualization keywords={results.data.keywords} />
        </CardContent>
      </Card>
    </>
  );
}