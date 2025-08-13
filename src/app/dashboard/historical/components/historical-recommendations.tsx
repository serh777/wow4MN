'use client';

import React from 'react';

interface HistoricalRecommendationsProps {
  recommendations: string[];
}

export function HistoricalRecommendations({ recommendations }: HistoricalRecommendationsProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Recomendaciones</h3>
      <ul className="space-y-2">
        {recommendations.map((rec, index) => (
          <li key={index} className="flex items-start gap-2">
            <span className="text-primary">•</span>
            <span>{rec}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}