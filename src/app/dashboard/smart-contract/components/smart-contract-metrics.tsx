'use client';

import * as React from 'react';
import { ScoreCard } from '@/app/dashboard/results/content/components/tool-components';

interface SmartContractMetricsProps {
  metrics: {
    namingScore: number;
    documentationScore: number;
    metadataScore: number;
    eventsScore: number;
    interfaceScore: number;
  };
}

export function SmartContractMetrics({ metrics }: SmartContractMetricsProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <ScoreCard
        title="Puntuación SEO"
        score={Object.values(metrics).reduce((a, b) => a + b, 0) / Object.values(metrics).length}
        description="Evaluación general de optimización del contrato"
      />
      <div className="grid gap-6">
        <div className="rounded-lg border bg-card text-card-foreground shadow p-4">
          <h3 className="font-medium">Métricas Principales</h3>
          <div className="mt-2 grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Nomenclatura</p>
              <p className="text-2xl font-bold">{metrics.namingScore}/100</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Documentación</p>
              <p className="text-2xl font-bold">{metrics.documentationScore}/100</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Metadatos</p>
              <p className="text-2xl font-bold">{metrics.metadataScore}/100</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Eventos</p>
              <p className="text-2xl font-bold">{metrics.eventsScore}/100</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}