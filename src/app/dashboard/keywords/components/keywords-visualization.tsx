'use client';

import React from 'react';
import { Visualization } from '@/app/dashboard/results/content/components/tool-components';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Database, Zap, BarChart3 } from 'lucide-react';
import type { KeywordData } from '../types';

interface KeywordsVisualizationProps {
  keywords: KeywordData[];
}

export function KeywordsVisualization({ keywords }: KeywordsVisualizationProps) {
  return (
    <Visualization 
      title="Visualización de Keywords Web3" 
      description="Análisis visual de tus palabras clave con métricas Web3"
    >
      <div className="h-full flex flex-col justify-between">
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="web3">Web3</TabsTrigger>
            <TabsTrigger value="blockchain">Blockchain</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general" className="space-y-4">
            <h4 className="text-sm font-medium mb-4 flex items-center">
              <BarChart3 className="w-4 h-4 mr-2" />
              Comparativa de Puntuaciones
            </h4>
            <div className="space-y-4">
              {keywords.map((keyword, index) => (
                <div key={index}>
                  <div className="flex justify-between text-xs mb-1">
                    <span>{keyword.keyword}</span>
                    <span>{keyword.score}/100</span>
                  </div>
                  <Progress 
                    value={keyword.score} 
                    className={`h-2 ${
                      keyword.score >= 80 ? 'bg-green-500' : 
                      keyword.score >= 60 ? 'bg-yellow-500' : 
                      'bg-red-500'
                    }`}
                  />
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="web3" className="space-y-4">
            <h4 className="text-sm font-medium mb-4 flex items-center">
              <Zap className="w-4 h-4 mr-2" />
              Relevancia Web3
            </h4>
            <div className="space-y-4">
              {keywords.map((keyword, index) => (
                <div key={index}>
                  <div className="flex justify-between text-xs mb-1">
                    <span>{keyword.keyword}</span>
                    <span>{keyword.web3Relevance || 0}/10</span>
                  </div>
                  <Progress 
                    value={(keyword.web3Relevance || 0) * 10} 
                    className={`h-2 ${
                      (keyword.web3Relevance || 0) >= 8 ? 'bg-purple-500' : 
                      (keyword.web3Relevance || 0) >= 5 ? 'bg-blue-500' : 
                      'bg-gray-500'
                    }`}
                  />
                </div>
              ))}
            </div>
            
            <div className="mt-6">
              <h4 className="text-sm font-medium mb-2">Categorías Web3</h4>
              <div className="flex flex-wrap gap-2">
                {Array.from(new Set(keywords.map(k => k.web3Category).filter(Boolean))).map((category, idx) => (
                  <Badge key={idx} variant="outline" className="bg-green-100 text-green-800 border-green-200">
                    {category}
                  </Badge>
                ))}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="blockchain" className="space-y-4">
            <h4 className="text-sm font-medium mb-4 flex items-center">
              <Database className="w-4 h-4 mr-2" />
              Menciones Blockchain
            </h4>
            <div className="space-y-4">
              {keywords.map((keyword, index) => (
                <div key={index}>
                  <div className="flex justify-between text-xs mb-1">
                    <span>{keyword.keyword}</span>
                    <span>{keyword.blockchainMentions || 0}</span>
                  </div>
                  <Progress 
                    value={Math.min((keyword.blockchainMentions || 0) * 10, 100)} 
                    className="h-2 bg-blue-500"
                  />
                </div>
              ))}
            </div>
            
            <div className="mt-6">
              <h4 className="text-sm font-medium mb-2">Proyectos Relacionados</h4>
              <div className="flex flex-wrap gap-2">
                {keywords
                  .flatMap(k => k.relatedProjects || [])
                  .filter((project, idx, self) => self.indexOf(project) === idx)
                  .map((project, idx) => (
                    <Badge key={idx} variant="secondary">
                      {project}
                    </Badge>
                  ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Visualization>
  );
}