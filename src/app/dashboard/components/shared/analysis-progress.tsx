'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

export interface AnalysisProgressProps {
  isAnalyzing: boolean;
  progress: number;
  currentStep: string;
  totalSteps?: number;
  currentStepIndex?: number;
  error?: string | null;
  onCancel?: () => void;
  analysisType?: string;
  url?: string;
}

export interface ProgressStepProps {
  step: string;
  index: number;
  currentIndex: number;
  isCompleted: boolean;
  isError?: boolean;
}

/**
 * Componente individual para mostrar el estado de un paso
 */
export function ProgressStep({ 
  step, 
  index, 
  currentIndex, 
  isCompleted, 
  isError = false 
}: ProgressStepProps) {
  const getStepIcon = () => {
    if (isError) {
      return <XCircle className="h-4 w-4 text-red-500" />;
    }
    if (isCompleted) {
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
    if (index === currentIndex) {
      return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />;
    }
    return <div className="h-4 w-4 rounded-full border-2 border-gray-300" />;
  };

  const getStepStatus = () => {
    if (isError) return 'error';
    if (isCompleted) return 'completed';
    if (index === currentIndex) return 'current';
    return 'pending';
  };

  const status = getStepStatus();

  return (
    <div className="flex items-center space-x-3 py-2">
      {getStepIcon()}
      <span 
        className={`text-sm ${
          status === 'current' ? 'font-medium text-blue-600' :
          status === 'completed' ? 'text-green-600' :
          status === 'error' ? 'text-red-600' :
          'text-gray-500'
        }`}
      >
        {step}
      </span>
      {status === 'current' && (
        <Badge variant="secondary" className="text-xs">
          En progreso
        </Badge>
      )}
    </div>
  );
}

/**
 * Componente principal para mostrar el progreso del análisis
 */
export function AnalysisProgress({
  isAnalyzing,
  progress,
  currentStep,
  totalSteps = 6,
  currentStepIndex = 0,
  error,
  onCancel,
  analysisType = 'Análisis',
  url
}: AnalysisProgressProps) {
  if (!isAnalyzing && !error) {
    return null;
  }

  const getProgressColor = () => {
    if (error) return 'bg-red-500';
    if (progress === 100) return 'bg-green-500';
    return 'bg-blue-500';
  };

  const getStatusBadge = () => {
    if (error) {
      return (
        <Badge variant="destructive" className="flex items-center space-x-1">
          <AlertCircle className="h-3 w-3" />
          <span>Error</span>
        </Badge>
      );
    }
    if (progress === 100) {
      return (
        <Badge variant="default" className="flex items-center space-x-1 bg-green-500">
          <CheckCircle className="h-3 w-3" />
          <span>Completado</span>
        </Badge>
      );
    }
    return (
      <Badge variant="secondary" className="flex items-center space-x-1">
        <Loader2 className="h-3 w-3 animate-spin" />
        <span>Analizando</span>
      </Badge>
    );
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center space-x-2">
              <span>{analysisType}</span>
              {getStatusBadge()}
            </CardTitle>
            {url && (
              <CardDescription className="mt-1">
                Analizando: {url}
              </CardDescription>
            )}
          </div>
          {onCancel && isAnalyzing && !error && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onCancel}
              className="text-red-600 hover:text-red-700"
            >
              Cancelar
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Barra de progreso principal */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="font-medium">{currentStep}</span>
            <span className="text-muted-foreground">{progress}%</span>
          </div>
          <Progress 
            value={progress} 
            className="h-2"
          />
        </div>

        {/* Indicador de pasos */}
        <div className="text-xs text-muted-foreground text-center">
          Paso {Math.min(currentStepIndex + 1, totalSteps)} de {totalSteps}
        </div>

        {/* Mensaje de error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3">
            <div className="flex items-center space-x-2">
              <XCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-red-800">Error en el análisis</p>
                <p className="text-sm text-red-600 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Mensaje de éxito */}
        {progress === 100 && !error && (
          <div className="bg-green-50 border border-green-200 rounded-md p-3">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <p className="text-sm font-medium text-green-800">
                ¡Análisis completado exitosamente!
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

/**
 * Componente para mostrar una lista detallada de pasos
 */
export function AnalysisStepsList({
  steps,
  currentStepIndex,
  error
}: {
  steps: string[];
  currentStepIndex: number;
  error?: string | null;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Progreso del Análisis</CardTitle>
        <CardDescription>
          Seguimiento detallado de cada paso del proceso
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          {steps.map((step, index) => (
            <ProgressStep
              key={index}
              step={step}
              index={index}
              currentIndex={currentStepIndex}
              isCompleted={index < currentStepIndex}
              isError={error !== null && index === currentStepIndex}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

const AnalysisProgressComponents = {
  AnalysisProgress,
  AnalysisStepsList,
  ProgressStep
};

export default AnalysisProgressComponents;