'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart3, Shield, Globe } from 'lucide-react';
import { AnalysisResults } from '../types';
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
    if (score >= 90) return '#10b981';
    if (score >= 50) return '#f59e0b';
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
};

interface OverallScoreCardProps {
  results: AnalysisResults;
  getAnalysisTypeLabel: (type: string) => string;
}

export default function OverallScoreCard({
  results,
  getAnalysisTypeLabel
}: OverallScoreCardProps) {
  const {
    overallScore,
    web3Seo,
    smartContractSeo,
    dappPerformance,
    blockchainMetrics,
    indexerStatus,
    riskLevel,
    analysisType,
    url
  } = results;
  return (
    <div className="space-y-8 mb-12">
      {/* Puntuación General - Primero */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Puntuación General</h2>
        <div className="flex justify-center">
          <CircularProgress value={overallScore} />
        </div>
      </div>
      
      {/* Información de estado */}
      <div className="flex flex-wrap items-center justify-center gap-6 mb-8">
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${
            indexerStatus.connected ? 'bg-green-500' : 'bg-red-500'
          }`}></div>
          <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
            {indexerStatus.connected ? 'Indexador Conectado' : 'Indexador Desconectado'}
          </span>
        </div>
        <Badge 
          variant="outline" 
          className="text-sm"
        >
          {indexerStatus.dataSource}
        </Badge>
        <Badge 
          variant={riskLevel === 'low' ? 'default' : riskLevel === 'medium' ? 'secondary' : 'destructive'}
          className="text-sm"
        >
          Riesgo {riskLevel === 'low' ? 'Bajo' : riskLevel === 'medium' ? 'Medio' : 'Alto'}
        </Badge>
      </div>
      
      {/* Título de Métricas Clave */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center justify-center space-x-2">
          <BarChart3 className="h-6 w-6" />
          <span>Métricas Clave</span>
        </h2>
      </div>
      
      {/* Métricas sin bloque contenedor */}
       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-32 lg:gap-60 mb-8 px-12 justify-center items-center mx-auto max-w-7xl">
         <div className="flex flex-col items-center py-6">
           <CircularProgress value={web3Seo.metaTags} size={120} />
           <div className="text-lg font-medium text-gray-700 dark:text-gray-300 mt-4 text-center">Meta Tags Web3</div>
         </div>
         <div className="flex flex-col items-center py-6">
           <CircularProgress value={smartContractSeo.gasOptimization} size={120} />
           <div className="text-lg font-medium text-gray-700 dark:text-gray-300 mt-4 text-center">Optimización Gas</div>
         </div>
         <div className="flex flex-col items-center py-6">
           <CircularProgress value={dappPerformance.loadTime} size={120} />
           <div className="text-lg font-medium text-gray-700 dark:text-gray-300 mt-4 text-center">Rendimiento DApp</div>
         </div>
         <div className="flex flex-col items-center py-6">
           <CircularProgress value={blockchainMetrics.activeUsers} size={120} />
           <div className="text-lg font-medium text-gray-700 dark:text-gray-300 mt-4 text-center">Usuarios Activos</div>
         </div>
       </div>
    </div>
  );
}