'use client';

import React from 'react';
import { AnalysisResults } from '@/app/dashboard/results/content/components/tool-components';
import type { KeywordAnalysisData } from '../types';

interface KeywordsAnalysisProps {
  data: KeywordAnalysisData;
}

export function KeywordsAnalysis({ data }: KeywordsAnalysisProps) {
  return (
    <AnalysisResults 
      results={
        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Análisis de Palabras Clave</h3>
            <div className="grid grid-cols-1 gap-4">
              {data.keywords.map((keyword, index) => (
                <div key={index} className="rounded-lg border bg-card text-card-foreground shadow p-4">
                  <h4 className="font-medium">{keyword.keyword}</h4>
                  <div className="mt-2 text-xl font-bold">{keyword.score}/100</div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Volumen: {keyword.volume} | Competencia: {keyword.competition}%
                  </p>
                  <div className="mt-3">
                    <h5 className="text-sm font-medium mb-1">Recomendaciones:</h5>
                    <ul className="text-sm space-y-1">
                      {keyword.recommendations.map((rec, recIndex) => (
                        <li key={recIndex} className="flex items-start gap-2">
                          <span className="text-primary">•</span>
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Palabras Clave Sugeridas</h3>
            <div className="flex flex-wrap gap-2">
              {data.suggestedKeywords.map((keyword, index) => (
                <div 
                  key={index}
                  className="bg-primary/10 text-primary rounded-full px-3 py-1 text-sm"
                >
                  {keyword}
                </div>
              ))}
            </div>
          </div>
        </div>
      }
    />
  );
}