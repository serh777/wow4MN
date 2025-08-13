'use client';

import React from 'react';
import { Progress } from '@/components/ui/progress';
// Note: ScoreCard component is not being used in this file, so we can remove the import

interface HistoricalMetricsProps {
  data: HistoricalData;
  score: number;
}

export function HistoricalMetrics({ data, score }: HistoricalMetricsProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Puntuación General: {score}/100</h3>
        <Progress value={score} className="w-full h-2.5" />
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {data.trends.map((trend, index) => (
          <div key={index} className="rounded-lg border p-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium">{trend.metric}</h4>
              <span className={`text-xs px-2 py-1 rounded-full ${
                trend.trend === 'up' ? 'bg-green-100 text-green-800' :
                trend.trend === 'down' ? 'bg-red-100 text-red-800' :
                'bg-blue-100 text-blue-800'
              }`}>
                {trend.change}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">{trend.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
import type { HistoricalData } from '../types';