'use client';


import * as React from 'react';
import { ScoreCard } from '@/app/dashboard/results/content/components/tool-components';

interface PerformanceMetricsProps {
  metrics: {
    gasEfficiency: number;
    responseTime: number;
    costEfficiency: number;
    contractEfficiency: number;
  };
}

export function PerformanceMetrics({ metrics }: PerformanceMetricsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <ScoreCard 
        title="Eficiencia de Gas" 
        score={metrics.gasEfficiency} 
        description="Optimización del uso de gas" 
      />
      <ScoreCard 
        title="Tiempo de Respuesta" 
        score={metrics.responseTime} 
        description="Velocidad de procesamiento" 
      />
      <ScoreCard 
        title="Eficiencia de Costo" 
        score={metrics.costEfficiency} 
        description="Optimización de costos" 
      />
      <ScoreCard 
        title="Eficiencia del Contrato" 
        score={metrics.contractEfficiency} 
        description="Rendimiento general" 
      />
    </div>
  );
}