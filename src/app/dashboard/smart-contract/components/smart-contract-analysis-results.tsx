'use client';

import * as React from 'react';
import { AnalysisResults, Visualization } from '@/app/dashboard/results/content/components/tool-components';
import { SaveAnalysisButton } from '@/components/notifications/notification-system';
import type { AnalysisResult } from '@/types';
import { SmartContractMetrics } from './smart-contract-metrics';
import { SmartContractIssues } from './smart-contract-issues';

interface SmartContractAnalysisResultsProps {
  results: AnalysisResult;
}

export function SmartContractAnalysisResults({ results }: SmartContractAnalysisResultsProps) {
  return (
    <>
      <div className="flex justify-end mb-4">
        <SaveAnalysisButton analysisData={results} />
      </div>

      <SmartContractMetrics metrics={results.data.metrics} />
      
      <AnalysisResults 
        results={
          <div className="space-y-4">
            <SmartContractIssues issues={results.data.issues} />
          </div>
        }
      />
    </>
  );
}