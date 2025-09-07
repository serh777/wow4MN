'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, AlertCircle, XCircle, TrendingUp, TrendingDown, Minus } from 'lucide-react';

export interface MetricCardProps {
  title: string;
  value: string | number;
  description?: string;
  trend?: 'up' | 'down' | 'neutral';
  status?: 'good' | 'warning' | 'error';
  progress?: number;
}

export interface ResultsSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

export interface ScoreDisplayProps {
  score: number;
  maxScore?: number;
  label: string;
  description?: string;
}

/**
 * Tarjeta para mostrar métricas individuales
 */
export function MetricCard({ 
  title, 
  value, 
  description, 
  trend, 
  status = 'good',
  progress 
}: MetricCardProps) {
  const getStatusIcon = () => {
    switch (status) {
      case 'good':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      case 'neutral':
        return <Minus className="h-4 w-4 text-gray-500" />;
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="flex items-center space-x-1">
          {getStatusIcon()}
          {getTrendIcon()}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">
            {description}
          </p>
        )}
        {progress !== undefined && (
          <Progress value={progress} className="mt-2" />
        )}
      </CardContent>
    </Card>
  );
}

/**
 * Sección de resultados con título y descripción
 */
export function ResultsSection({ title, description, children }: ResultsSectionProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold">{title}</h3>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      <Separator />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {children}
      </div>
    </div>
  );
}

/**
 * Componente para mostrar puntuaciones
 */
export function ScoreDisplay({ 
  score, 
  maxScore = 100, 
  label, 
  description 
}: ScoreDisplayProps) {
  const percentage = (score / maxScore) * 100;
  
  const getScoreColor = () => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreStatus = () => {
    if (percentage >= 80) return 'Excelente';
    if (percentage >= 60) return 'Bueno';
    if (percentage >= 40) return 'Regular';
    return 'Necesita mejoras';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{label}</span>
          <Badge variant={percentage >= 80 ? 'default' : percentage >= 60 ? 'secondary' : 'destructive'}>
            {getScoreStatus()}
          </Badge>
        </CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-4">
          <div className={`text-3xl font-bold ${getScoreColor()}`}>
            {score}
            <span className="text-lg text-muted-foreground">/{maxScore}</span>
          </div>
          <div className="flex-1">
            <Progress value={percentage} className="h-2" />
            <p className="text-xs text-muted-foreground mt-1">
              {percentage.toFixed(1)}%
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Contenedor principal para mostrar resultados de análisis
 */
export function AnalysisResultsContainer({ 
  title, 
  subtitle, 
  children 
}: { 
  title: string; 
  subtitle?: string; 
  children: React.ReactNode; 
}) {
  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">{title}</h1>
        {subtitle && (
          <p className="text-muted-foreground">{subtitle}</p>
        )}
      </div>
      
      <div className="space-y-8">
        {children}
      </div>
    </div>
  );
}

const AnalysisResultsComponents = {
  MetricCard,
  ResultsSection,
  ScoreDisplay,
  AnalysisResultsContainer
};

export default AnalysisResultsComponents;