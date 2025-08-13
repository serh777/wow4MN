'use client';

import * as React from 'react';

interface PerformanceOptimizationsProps {
  optimizations: Array<{
    title: string;
    description: string;
    impact: string;
    difficulty: string;
    gasSavings: string;
  }>;
}

export function PerformanceOptimizations({ optimizations }: PerformanceOptimizationsProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Optimizaciones Recomendadas</h3>
      <div className="space-y-4">
        {optimizations.map((optimization, index) => (
          <div key={index} className="rounded-lg border p-4">
            <h4 className="font-medium">{optimization.title}</h4>
            <p className="text-sm text-muted-foreground mt-1">{optimization.description}</p>
            <div className="grid grid-cols-3 gap-4 mt-3">
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1">Impacto</p>
                <p className={`text-sm ${
                  optimization.impact === 'Alto' ? 'text-green-600' :
                  optimization.impact === 'Medio' ? 'text-yellow-600' :
                  'text-blue-600'
                }`}>
                  {optimization.impact}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1">Dificultad</p>
                <p className={`text-sm ${
                  optimization.difficulty === 'Alta' ? 'text-red-600' :
                  optimization.difficulty === 'Media' ? 'text-yellow-600' :
                  'text-green-600'
                }`}>
                  {optimization.difficulty}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1">Ahorro de Gas</p>
                <p className="text-sm text-green-600">{optimization.gasSavings}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}