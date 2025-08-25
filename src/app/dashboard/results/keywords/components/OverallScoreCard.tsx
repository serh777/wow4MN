'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, TrendingUp, Target } from 'lucide-react';
import { CircularProgress } from '@/components/ui/circular-progress';



interface SafeKeywordResults {
  totalKeywords: number;
  avgSearchVolume: number;
  avgDifficulty: number;
  avgCpc: number;
  opportunityScore: number;
  recommendations: string[];
  analysisConfig?: {
    projectName: string;
    projectUrl: string;
    niche: string;
    keywordType: string;
    keywords: string;
  };
  timestamp?: string;
}

interface OverallScoreCardProps {
  results: SafeKeywordResults;
}

export default function OverallScoreCard({ results }: OverallScoreCardProps) {
  const getDifficultyLevel = (difficulty: number) => {
    if (difficulty >= 70) return { label: 'Alta', color: 'destructive' };
    if (difficulty >= 40) return { label: 'Media', color: 'secondary' };
    return { label: 'Baja', color: 'default' };
  };

  const getVolumeLevel = (volume: number) => {
    if (volume >= 10000) return { label: 'Alto Volumen', color: 'default' };
    if (volume >= 1000) return { label: 'Volumen Medio', color: 'secondary' };
    return { label: 'Bajo Volumen', color: 'outline' };
  };

  const difficultyLevel = getDifficultyLevel(results.avgDifficulty);
  const volumeLevel = getVolumeLevel(results.avgSearchVolume);

  return (
    <div className="space-y-8 mb-12">
      {/* Puntuación General - Primero */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Puntuación de Oportunidad</h2>
        <div className="flex justify-center">
          <CircularProgress 
            value={results.opportunityScore} 
            color={results.opportunityScore >= 80 ? 'green' : results.opportunityScore >= 60 ? 'yellow' : 'red'}
            label="Oportunidad"
          />
        </div>
      </div>
      
      {/* Información de estado */}
      <div className="flex flex-wrap items-center justify-center gap-6 mb-8">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
            Análisis Completado
          </span>
        </div>
        <Badge 
          variant={difficultyLevel.color as any}
          className="text-sm"
        >
          Dificultad {difficultyLevel.label}
        </Badge>
        <Badge 
          variant={volumeLevel.color as any}
          className="text-sm"
        >
          {volumeLevel.label}
        </Badge>
        {results.analysisConfig && (
          <Badge variant="outline" className="text-sm">
            {results.analysisConfig.niche}
          </Badge>
        )}
      </div>

      {/* Métricas detalladas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="flex flex-col items-center py-6">
          <div className="text-center mb-4">
            <Search className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {results.totalKeywords}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Keywords Analizadas</div>
          </div>
        </div>
        
        <div className="flex flex-col items-center py-6">
          <div className="text-center mb-4">
            <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {results.avgSearchVolume.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Volumen Promedio</div>
          </div>
        </div>
        
        <div className="flex flex-col items-center py-6">
          <div className="text-center mb-4">
            <Target className="h-8 w-8 text-orange-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {results.avgDifficulty}%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Dificultad Promedio</div>
          </div>
        </div>
      </div>
    </div>
  );
}