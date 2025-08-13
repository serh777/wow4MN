'use client';

import * as React from 'react';

interface SocialWeb3RecommendationsProps {
  recommendations: Array<{
    platform: string;
    tips: string[];
  }>;
}

export function SocialWeb3Recommendations({ recommendations }: SocialWeb3RecommendationsProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Recomendaciones por Plataforma</h3>
      <div className="space-y-4">
        {recommendations.map((rec) => (
          <div key={rec.platform} className="rounded-lg border p-4">
            <h4 className="font-medium mb-2">{rec.platform}</h4>
            <ul className="space-y-1">
              {rec.tips.map((tip, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span className="text-sm">{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}