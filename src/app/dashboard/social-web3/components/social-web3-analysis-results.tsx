'use client';

import * as React from 'react';
import { AnalysisResults, Visualization } from '@/app/dashboard/results/content/components/tool-components';
import { SaveAnalysisButton } from '@/components/notifications/notification-system';
import { Progress } from '@/components/ui/progress';
import type { AnalysisResult } from '@/types';
import { SocialWeb3Metrics } from './social-web3-metrics';
import { SocialWeb3Platforms } from './social-web3-platforms';
import { SocialWeb3Recommendations } from './social-web3-recommendations';

interface SocialWeb3AnalysisResultsProps {
  results: AnalysisResult;
}

export function SocialWeb3AnalysisResults({ results }: SocialWeb3AnalysisResultsProps) {
  return (
    <>
      <div className="flex justify-end mb-4">
        <SaveAnalysisButton analysisData={results} />
      </div>

      <SocialWeb3Metrics metrics={results.data.metrics} />
      
      <AnalysisResults 
        results={
          <div className="space-y-6">
            <SocialWeb3Platforms platforms={results.data.platforms} />
            <SocialWeb3Recommendations recommendations={results.data.recommendations} />
          </div>
        }
      />
      
      <Visualization 
        title="Visualización de Métricas Sociales" 
        description="Representación visual de tu presencia en plataformas Web3"
      >
        <div className="h-full flex flex-col justify-between">
          <div className="flex-1">
            <h4 className="text-sm font-medium mb-4">Engagement por Plataforma</h4>
            <div className="space-y-4">
              {results.data.platforms.map((platform: {
                name: string;
                connected: boolean;
                followers: number;
                posts: number;
                engagement: number;
              }) => (
                <div key={platform.name}>
                  <div className="flex justify-between text-xs mb-1">
                    <span>{platform.name}</span>
                    <span>{platform.engagement}%</span>
                  </div>
                  <Progress 
                    value={platform.engagement} 
                    className="w-full" 
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </Visualization>
    </>
  );
}