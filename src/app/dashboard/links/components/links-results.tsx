'use client';

import React from 'react';
import { AnalysisResults, Visualization, ScoreCard } from '@/app/dashboard/content/analysis-results/components/tool-components';
import { Progress } from '@/components/ui/progress';

interface LinkResults {
  score: number;
  totalLinks: number;
  workingLinks: number;
  brokenLinks: number;
  redirectLinks: number;
  internalLinks: number;
  externalLinks: number;
  linkHealth: {
    score: number;
    recommendations: string[];
  };
  seoValue: {
    score: number;
    recommendations: string[];
  };
  userExperience: {
    score: number;
    recommendations: string[];
  };
  security: {
    score: number;
    recommendations: string[];
  };
  performance: {
    score: number;
    recommendations: string[];
  };
}

interface LinksResultsProps {
  results: LinkResults;
}

export function LinksResults({ results }: LinksResultsProps) {
  return (
    <>
      <AnalysisResults 
        results={
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Puntuación General de Enlaces: {results.score}/100</h3>
              <Progress value={results.score} className="w-full" />
              <p className="text-sm text-muted-foreground">
                Se analizaron {results.totalLinks} enlaces en total. {results.workingLinks} funcionan correctamente, 
                {results.brokenLinks} están rotos y {results.redirectLinks} son redirecciones.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-medium text-green-800">Enlaces Funcionando</h4>
                <p className="text-2xl font-bold text-green-600">{results.workingLinks}</p>
                <p className="text-sm text-green-600">{((results.workingLinks / results.totalLinks) * 100).toFixed(1)}%</p>
              </div>
              <div className="bg-red-50 p-4 rounded-lg">
                <h4 className="font-medium text-red-800">Enlaces Rotos</h4>
                <p className="text-2xl font-bold text-red-600">{results.brokenLinks}</p>
                <p className="text-sm text-red-600">{((results.brokenLinks / results.totalLinks) * 100).toFixed(1)}%</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-800">Enlaces Internos</h4>
                <p className="text-2xl font-bold text-blue-600">{results.internalLinks}</p>
                <p className="text-sm text-blue-600">{((results.internalLinks / results.totalLinks) * 100).toFixed(1)}%</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-medium text-purple-800">Enlaces Externos</h4>
                <p className="text-2xl font-bold text-purple-600">{results.externalLinks}</p>
                <p className="text-sm text-purple-600">{((results.externalLinks / results.totalLinks) * 100).toFixed(1)}%</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Análisis Detallado</h3>
              <div className="grid grid-cols-1 gap-4">
                <ScoreCard 
                  title="Salud de Enlaces" 
                  score={results.linkHealth.score} 
                  description={results.linkHealth.recommendations.join(', ')}
                />
                <ScoreCard 
                  title="Valor SEO" 
                  score={results.seoValue.score} 
                  description={results.seoValue.recommendations.join(', ')}
                />
                <ScoreCard 
                  title="Experiencia de Usuario" 
                  score={results.userExperience.score} 
                  description={results.userExperience.recommendations.join(', ')}
                />
                <ScoreCard 
                  title="Seguridad" 
                  score={results.security.score} 
                  description={results.security.recommendations.join(', ')}
                />
                <ScoreCard 
                  title="Rendimiento" 
                  score={results.performance.score} 
                  description={results.performance.recommendations.join(', ')}
                />
              </div>
            </div>
          </div>
        }
      />
      
      <Visualization 
        title="Estado de Enlaces" 
        description="Distribución visual del estado y tipos de enlaces en tu sitio"
      >
        <div className="h-full flex flex-col justify-between">
          <div className="flex-1">
            <h4 className="text-sm font-medium mb-4">Estado de Enlaces</h4>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span>Funcionando</span>
                  <span>{results.workingLinks} enlaces</span>
                </div>
                <Progress value={(results.workingLinks / results.totalLinks) * 100} className="w-full h-2" />
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span>Rotos</span>
                  <span>{results.brokenLinks} enlaces</span>
                </div>
                <Progress value={(results.brokenLinks / results.totalLinks) * 100} className="w-full h-2" />
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span>Redirecciones</span>
                  <span>{results.redirectLinks} enlaces</span>
                </div>
                <Progress value={(results.redirectLinks / results.totalLinks) * 100} className="w-full h-2" />
              </div>
            </div>
            
            <h4 className="text-sm font-medium mb-4 mt-6">Distribución por Tipo</h4>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span>Enlaces Internos</span>
                  <span>{results.internalLinks} enlaces</span>
                </div>
                <Progress value={(results.internalLinks / results.totalLinks) * 100} className="w-full h-2" />
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span>Enlaces Externos</span>
                  <span>{results.externalLinks} enlaces</span>
                </div>
                <Progress value={(results.externalLinks / results.totalLinks) * 100} className="w-full h-2" />
              </div>
            </div>
          </div>
          
          <div className="mt-6 pt-4 border-t">
            <h4 className="text-sm font-medium mb-2">Acciones Recomendadas</h4>
            <ul className="text-xs space-y-1 text-muted-foreground">
              <li>• Reparar {results.brokenLinks} enlaces rotos identificados</li>
              <li>• Optimizar {results.redirectLinks} redirecciones</li>
              <li>• Revisar enlaces externos periódicamente</li>
              <li>• Mantener equilibrio interno/externo</li>
            </ul>
          </div>
        </div>
      </Visualization>
    </>
  );
}