'use client';

import React from 'react';
import { AnalysisResults } from '@/app/dashboard/results/content/components/tool-components';
import { Badge } from '@/components/ui/badge';
import { Database, Zap, Tag, Link } from 'lucide-react';
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
            <h3 className="text-lg font-medium">Análisis de Palabras Clave Web3</h3>
            <div className="grid grid-cols-1 gap-4">
              {data.keywords.map((keyword, index) => (
                <div key={index} className="rounded-lg border bg-card text-card-foreground shadow p-4">
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium">{keyword.keyword}</h4>
                    {keyword.web3Category && (
                      <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                        <Tag className="w-3 h-3 mr-1" />
                        {keyword.web3Category}
                      </Badge>
                    )}
                  </div>
                  
                  <div className="mt-2 text-xl font-bold">{keyword.score}/100</div>
                  
                  <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Volumen:</span> {keyword.volume}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Competencia:</span> {keyword.competition}%
                    </div>
                    
                    {keyword.web3Relevance !== undefined && (
                      <div>
                        <span className="text-muted-foreground">Relevancia Web3:</span> {keyword.web3Relevance}/10
                      </div>
                    )}
                    
                    {keyword.blockchainMentions !== undefined && (
                      <div>
                        <span className="text-muted-foreground">Menciones Blockchain:</span> {keyword.blockchainMentions}
                      </div>
                    )}
                  </div>
                  
                  {keyword.relatedProjects && keyword.relatedProjects.length > 0 && (
                    <div className="mt-3">
                      <h5 className="text-sm font-medium mb-1 flex items-center">
                        <Link className="w-4 h-4 mr-1" />
                        Proyectos Relacionados:
                      </h5>
                      <div className="flex flex-wrap gap-1">
                        {keyword.relatedProjects.map((project, projectIndex) => (
                          <Badge key={projectIndex} variant="secondary" className="text-xs">
                            {project}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {keyword.blockchainInsights && (
                    <div className="mt-3">
                      <h5 className="text-sm font-medium mb-1 flex items-center">
                        <Database className="w-4 h-4 mr-1" />
                        Insights Blockchain:
                      </h5>
                      {keyword.blockchainInsights.trendingTopics.length > 0 && (
                        <div className="text-xs mb-1">
                          <span className="font-medium">Tendencias:</span> {keyword.blockchainInsights.trendingTopics.join(', ')}
                        </div>
                      )}
                    </div>
                  )}
                  
                  <div className="mt-3">
                    <h5 className="text-sm font-medium mb-1 flex items-center">
                      <Zap className="w-4 h-4 mr-1" />
                      Recomendaciones:
                    </h5>
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
            <h3 className="text-lg font-medium">Palabras Clave Web3 Sugeridas</h3>
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