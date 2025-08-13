'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, TrendingUp, Target } from 'lucide-react';
import { useState, useEffect } from 'react';

interface CircularProgressProps {
  value: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
}

const CircularProgress: React.FC<CircularProgressProps> = ({
  value,
  size = 120,
  strokeWidth = 8,
  className = ''
}) => {
  const [animatedValue, setAnimatedValue] = useState(0);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = `${circumference} ${circumference}`;
  const strokeDashoffset = circumference - (animatedValue / 100) * circumference;

  useEffect(() => {
    const timer = setTimeout(() => {
      const duration = 2000; // 2 segundos de animación
      const steps = 60; // 60 pasos para animación suave
      const stepValue = value / steps;
      const stepDuration = duration / steps;
      
      let currentStep = 0;
      const interval = setInterval(() => {
        currentStep++;
        const newValue = Math.min(stepValue * currentStep, value);
        setAnimatedValue(newValue);
        
        if (currentStep >= steps) {
          clearInterval(interval);
        }
      }, stepDuration);
      
      return () => clearInterval(interval);
    }, 300); // Delay inicial de 300ms
    
    return () => clearTimeout(timer);
  }, [value]);

  const getSizeClass = (size: number) => {
    switch (size) {
      case 120: return 'circular-progress-120';
      case 100: return 'circular-progress-100';
      case 80: return 'circular-progress-80';
      default: return 'circular-progress-120';
    }
  };
  
  const getColor = (score: number) => {
    if (score >= 80) return '#10b981';
    if (score >= 60) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div className={`relative ${getSizeClass(size)} ${className}`}>
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-gray-200 dark:text-gray-700"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={getColor(animatedValue)}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {Math.round(animatedValue)}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Score
          </div>
        </div>
      </div>
    </div>
  );
}

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
          <CircularProgress value={results.opportunityScore} />
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