'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Target, TrendingUp } from 'lucide-react';
import { ContentAnalysisResults } from '../types';
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

  const getProgressClass = (score: number) => {
    if (score >= 80) return 'circular-progress-green';
    if (score >= 60) return 'circular-progress-yellow';
    return 'circular-progress-red';
  };

  return (
    <div 
      className={`circular-progress ${className}`}
      style={{ '--size': `${size}px` } as React.CSSProperties}
    >
      <svg
        width={size}
        height={size}
        className="circular-progress-svg"
        style={{ transform: 'rotate(-90deg)' }}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          fill="none"
          className="circular-progress-background"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className={`circular-progress-foreground ${getProgressClass(animatedValue)}`}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center circular-progress-text">
          <div className="text-3xl font-bold text-gray-900 dark:text-white">
            {Math.round(animatedValue)}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Score
          </div>
        </div>
      </div>
    </div>
  );
};

interface OverallScoreCardProps {
  results: ContentAnalysisResults;
  getAnalysisTypeLabel: (type: string) => string;
}

export default function OverallScoreCard({
  results,
  getAnalysisTypeLabel
}: OverallScoreCardProps) {
  const getQualityColor = (quality: string) => {
    switch (quality) {
      case 'excellent': return 'bg-green-100 text-green-800 border-green-200';
      case 'good': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'fair': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'poor': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getQualityIcon = (quality: string) => {
    switch (quality) {
      case 'excellent': return <TrendingUp className="h-4 w-4" />;
      case 'good': return <Target className="h-4 w-4" />;
      case 'fair': return <FileText className="h-4 w-4" />;
      case 'poor': return <FileText className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getQualityLabel = (quality: string) => {
    switch (quality) {
      case 'excellent': return 'Excelente';
      case 'good': return 'Bueno';
      case 'fair': return 'Regular';
      case 'poor': return 'Deficiente';
      default: return 'Sin evaluar';
    }
  };

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800">
      <CardHeader className="text-center pb-2">
        <div className="flex items-center justify-center space-x-2 mb-2">
          <FileText className="h-6 w-6 text-blue-600" />
          <CardTitle className="text-xl font-bold text-blue-900 dark:text-blue-100">
            Puntuación General de Contenido
          </CardTitle>
        </div>
        <CardContent className="pt-0">
          <div className="flex flex-col items-center space-y-4">
            <CircularProgress 
              value={results.overallScore} 
              size={140}
              className="mb-4"
            />
            
            <div className="text-center space-y-2">
              <Badge 
                variant="outline" 
                className={`${getQualityColor(results.contentQuality)} font-medium px-3 py-1`}
              >
                <span className="flex items-center space-x-1">
                  {getQualityIcon(results.contentQuality)}
                  <span>{getQualityLabel(results.contentQuality)}</span>
                </span>
              </Badge>
              
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {getAnalysisTypeLabel(results.analysisType)}
              </div>
              
              <div className="text-xs text-gray-500 dark:text-gray-500">
                Análisis de: {results.url}
              </div>
            </div>
          </div>
        </CardContent>
      </CardHeader>
    </Card>
  );
}