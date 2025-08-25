'use client';

import * as React from 'react';
import { ScoreCard } from '@/app/dashboard/results/content/components/tool-components';

interface SocialWeb3MetricsProps {
  metrics: {
    engagement: number;
    reach: number;
    influence: number;
    consistency: number;
  };
}

export function SocialWeb3Metrics({ metrics }: SocialWeb3MetricsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <ScoreCard 
        title="Engagement" 
        score={metrics.engagement} 
        description="Interacción con la comunidad" 
      />
      <ScoreCard 
        title="Alcance" 
        score={metrics.reach} 
        description="Visibilidad en plataformas Web3" 
      />
      <ScoreCard 
        title="Influencia" 
        score={metrics.influence} 
        description="Impacto en el ecosistema" 
      />
      <ScoreCard 
        title="Consistencia" 
        score={metrics.consistency} 
        description="Regularidad de publicación" 
      />
    </div>
  );
}