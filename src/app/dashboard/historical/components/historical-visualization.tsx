'use client';

import React from 'react';
import type { HistoricalMetrics } from '../types';

interface HistoricalVisualizationProps {
  metrics: HistoricalMetrics;
}

export function HistoricalVisualization({ metrics }: HistoricalVisualizationProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Tendencias Históricas</h3>
      <p className="text-sm text-muted-foreground">Evolución de métricas clave a lo largo del tiempo</p>
      
      <div className="grid gap-4 md:grid-cols-2">
        {Object.entries(metrics).map(([key, data]: [string, Array<{ date: string; value: number }>]) => {
          const dataArray = Array.isArray(data) ? data : [];
          const lastValue = dataArray.length > 0 ? dataArray[dataArray.length - 1].value : 0;
          const firstValue = dataArray.length > 0 ? dataArray[0].value : 0;
          const change = lastValue - firstValue;
          const changePercent = firstValue > 0 ? Math.round((change / firstValue) * 100) : 0;
          
          return (
            <div key={key} className="rounded-lg border p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium capitalize">{key}</h4>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  changePercent > 0 ? 'bg-green-100 text-green-800' :
                  changePercent < 0 ? 'bg-red-100 text-red-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {changePercent > 0 ? '+' : ''}{changePercent}%
                </span>
              </div>
              
              <div className="h-[100px] relative mt-4 border-b border-l">
                <div className="absolute bottom-0 left-0 right-0 h-full flex items-end">
                  {dataArray.map((item, index) => {
                    const height = `${(item.value / 100) * 100}%`;
                    const width = `${100 / dataArray.length}%`;
                    
                    return (
                      <div 
                        key={index}
                        className="bg-primary/20 hover:bg-primary/40 transition-colors historical-bar"
                        style={{ 
                          height, 
                          width
                        }}
                        title={`${item.date}: ${item.value}`}
                      >
                        <div className="historical-bar-indicator bg-primary"></div>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                <span>{dataArray.length > 0 ? dataArray[0].date : 'N/A'}</span>
                <span>{dataArray.length > 0 ? dataArray[dataArray.length - 1].date : 'N/A'}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}