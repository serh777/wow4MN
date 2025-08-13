'use client';

import React from 'react';
import { KeywordsResultsSafe } from './components/keywords-results-safe';
import ErrorBoundary from '@/components/error-boundary';



export default function KeywordsAnalysisResults() {
  return (
    <ErrorBoundary>
      <KeywordsResultsSafe />
    </ErrorBoundary>
  );
}