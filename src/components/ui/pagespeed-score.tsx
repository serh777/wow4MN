'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Info, CheckCircle, AlertTriangle, XCircle, Clock } from 'lucide-react';

interface PageSpeedScoreProps {
  score: number;
  title: string;
  description?: string;
  metrics?: Metric[];
  opportunities?: Opportunity[];
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

interface Metric {
  name: string;
  value: number;
  unit: string;
  status: 'good' | 'needs-improvement' | 'poor';
  description: string;
}

interface Opportunity {
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  savings?: string;
}

export const PageSpeedScore: React.FC<PageSpeedScoreProps> = ({
  score,
  title,
  description,
  metrics = [],
  opportunities = [],
  className = '',
  size = 'md'
}) => {
  const [animatedScore, setAnimatedScore] = useState(0);
  const [animatedMetrics, setAnimatedMetrics] = useState<number[]>([]);

  const getScoreColor = (score: number) => {
    if (score >= 90) return { color: 'text-green-600', bg: 'bg-green-500', ring: 'ring-green-200' };
    if (score >= 50) return { color: 'text-orange-600', bg: 'bg-orange-500', ring: 'ring-orange-200' };
    return { color: 'text-red-600', bg: 'bg-red-500', ring: 'ring-red-200' };
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return 'Bueno';
    if (score >= 50) return 'Necesita mejoras';
    return 'Deficiente';
  };

  const getMetricStatus = (status: string) => {
    switch (status) {
      case 'good': return { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100' };
      case 'needs-improvement': return { icon: AlertTriangle, color: 'text-orange-600', bg: 'bg-orange-100' };
      case 'poor': return { icon: XCircle, color: 'text-red-600', bg: 'bg-red-100' };
      default: return { icon: Info, color: 'text-gray-600', bg: 'bg-gray-100' };
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'low': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const circleSize = size === 'lg' ? 120 : size === 'md' ? 100 : 80;
  const strokeWidth = size === 'lg' ? 8 : size === 'md' ? 6 : 4;
  const radius = (circleSize - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = `${circumference} ${circumference}`;
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

  useEffect(() => {
    const timer = setTimeout(() => {
      const duration = 2000;
      const steps = 60;
      const stepValue = score / steps;
      const stepDuration = duration / steps;
      
      let currentStep = 0;
      const interval = setInterval(() => {
        currentStep++;
        const newValue = Math.min(stepValue * currentStep, score);
        setAnimatedScore(newValue);
        
        if (currentStep >= steps) {
          clearInterval(interval);
        }
      }, stepDuration);
      
      return () => clearInterval(interval);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [score]);

  useEffect(() => {
    if (metrics.length > 0) {
      const timer = setTimeout(() => {
        const duration = 1500;
        const steps = 50;
        const stepDuration = duration / steps;
        
        let currentStep = 0;
        const interval = setInterval(() => {
          currentStep++;
          const newMetrics = metrics.map(metric => 
            Math.min((metric.value / steps) * currentStep, metric.value)
          );
          setAnimatedMetrics(newMetrics);
          
          if (currentStep >= steps) {
            clearInterval(interval);
          }
        }, stepDuration);
        
        return () => clearInterval(interval);
      }, 800);
      
      return () => clearTimeout(timer);
    }
  }, [metrics]);

  const scoreColors = getScoreColor(animatedScore);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Main Score Circle */}
      <Card className="bg-white dark:bg-gray-900 shadow-lg border-0 ring-1 ring-gray-200 dark:ring-gray-800">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {title}
          </CardTitle>
          {description && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {description}
            </p>
          )}
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-4">
          <div className="relative">
            <svg
              width={circleSize}
              height={circleSize}
              className="transform -rotate-90 drop-shadow-sm"
            >
              {/* Background circle */}
              <circle
                cx={circleSize / 2}
                cy={circleSize / 2}
                r={radius}
                strokeWidth={strokeWidth}
                className="fill-none stroke-gray-200 dark:stroke-gray-700"
              />
              {/* Progress circle */}
              <circle
                cx={circleSize / 2}
                cy={circleSize / 2}
                r={radius}
                strokeWidth={strokeWidth}
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                className={`fill-none stroke-linecap-round transition-all duration-2000 ease-out ${scoreColors.bg.replace('bg-', 'stroke-')}`}
                style={{
                  filter: 'drop-shadow(0 0 6px rgba(0,0,0,0.1))'
                }}
              />
            </svg>
            
            {/* Center content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className={`text-3xl font-bold ${scoreColors.color} transition-all duration-500`}>
                {Math.round(animatedScore)}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-medium">
                {getScoreLabel(animatedScore)}
              </div>
            </div>
          </div>

          <Badge 
            variant="outline" 
            className={`${scoreColors.color} border-current bg-opacity-10 font-medium px-3 py-1`}
          >
            <Clock className="h-3 w-3 mr-1" />
            Puntuación: {Math.round(animatedScore)}/100
          </Badge>
        </CardContent>
      </Card>

      {/* Metrics */}
      {metrics.length > 0 && (
        <Card className="bg-white dark:bg-gray-900 shadow-lg border-0 ring-1 ring-gray-200 dark:ring-gray-800">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center">
              <Info className="h-5 w-5 mr-2 text-blue-600" />
              Métricas de Rendimiento
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {metrics.map((metric, index) => {
              const status = getMetricStatus(metric.status);
              const StatusIcon = status.icon;
              const animatedValue = animatedMetrics[index] || 0;
              
              return (
                <div key={metric.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className={`p-1 rounded-full ${status.bg}`}>
                        <StatusIcon className={`h-3 w-3 ${status.color}`} />
                      </div>
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {metric.name}
                      </span>
                    </div>
                    <span className={`font-bold ${status.color}`}>
                      {animatedValue.toFixed(1)}{metric.unit}
                    </span>
                  </div>
                  <Progress 
                    value={Math.min((animatedValue / metric.value) * 100, 100)} 
                    className="h-2"
                  />
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {metric.description}
                  </p>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* Opportunities */}
      {opportunities.length > 0 && (
        <Card className="bg-white dark:bg-gray-900 shadow-lg border-0 ring-1 ring-gray-200 dark:ring-gray-800">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 text-orange-600" />
              Oportunidades de Mejora
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {opportunities.map((opportunity, index) => (
              <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-2">
                <div className="flex items-start justify-between">
                  <h4 className="font-medium text-gray-900 dark:text-gray-100">
                    {opportunity.title}
                  </h4>
                  <div className="flex items-center space-x-2">
                    <Badge 
                      variant="outline" 
                      className={`${getImpactColor(opportunity.impact)} text-xs`}
                    >
                      {opportunity.impact === 'high' ? 'Alto' : 
                       opportunity.impact === 'medium' ? 'Medio' : 'Bajo'} impacto
                    </Badge>
                    {opportunity.savings && (
                      <Badge variant="secondary" className="text-xs">
                        {opportunity.savings}
                      </Badge>
                    )}
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {opportunity.description}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PageSpeedScore;