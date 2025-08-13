'use client';

import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Clock, Search, BarChart3, Zap, Target } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface AnalysisProgressProps {
  progress: number;
  currentStep: string;
  isVisible: boolean;
}

const analysisSteps = [
  { 
    id: 'extracting', 
    label: 'Extrayendo Keywords', 
    description: 'Analizando contenido y extrayendo palabras clave relevantes',
    icon: Search,
    color: 'bg-blue-500'
  },
  { 
    id: 'analyzing', 
    label: 'Analizando Competencia', 
    description: 'Evaluando keywords de competidores en el espacio Web3',
    icon: BarChart3,
    color: 'bg-purple-500'
  },
  { 
    id: 'processing', 
    label: 'Procesando SEO', 
    description: 'Calculando métricas de SEO y oportunidades de ranking',
    icon: Zap,
    color: 'bg-orange-500'
  },
  { 
    id: 'finalizing', 
    label: 'Finalizando Análisis', 
    description: 'Generando reporte completo y recomendaciones',
    icon: Target,
    color: 'bg-green-500'
  }
];

export function AnalysisProgress({ progress, currentStep, isVisible }: AnalysisProgressProps) {
  if (!isVisible) return null;

  const currentStepIndex = analysisSteps.findIndex(step => step.id === currentStep);
  const currentStepData = analysisSteps[currentStepIndex] || analysisSteps[0];

  return (
    <Card className="w-full max-w-2xl mx-auto bg-gradient-to-br from-background to-muted/20 border-2 border-primary/20">
      <CardHeader className="text-center pb-4">
        <CardTitle className="flex items-center justify-center gap-3 text-xl">
          <div className="p-2 rounded-full bg-primary/10">
            <Search className="h-6 w-6 text-primary" />
          </div>
          Análisis de Keywords Web3
        </CardTitle>
        <div className="flex items-center justify-between mt-2">
          <Badge variant="outline" className="text-sm">
            Paso {currentStepIndex + 1} de {analysisSteps.length}
          </Badge>
          <span className="text-2xl font-bold text-primary">
            {Math.round(progress)}%
          </span>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Barra de progreso principal */}
        <div className="space-y-2">
          <Progress 
            value={progress} 
            className="h-3 bg-muted" 
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Iniciando</span>
            <span>Completado</span>
          </div>
        </div>

        {/* Paso actual destacado */}
        <div className="bg-card border rounded-lg p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className={`p-2 rounded-full ${currentStepData.color} text-white`}>
              <currentStepData.icon className="h-4 w-4" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-foreground">{currentStepData.label}</h4>
              <p className="text-sm text-muted-foreground">{currentStepData.description}</p>
            </div>
            <div className="animate-pulse">
              <div className="h-2 w-2 bg-primary rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Lista de todos los pasos */}
        <div className="space-y-2">
          {analysisSteps.map((step, index) => {
            const isActive = currentStep === step.id;
            const isCompleted = currentStepIndex > index;
            const Icon = step.icon;
            
            return (
              <div 
                key={step.id} 
                className={`flex items-center gap-3 p-3 rounded-md transition-all duration-300 ${
                  isActive ? 'bg-primary/10 border border-primary/20 scale-105' : 
                  isCompleted ? 'bg-green-50 dark:bg-green-950/20' : 'bg-muted/30'
                }`}
              >
                <div className={`p-1.5 rounded-full transition-colors ${
                  isActive ? step.color + ' text-white' :
                  isCompleted ? 'bg-green-500 text-white' : 'bg-muted text-muted-foreground'
                }`}>
                  {isCompleted ? (
                    <CheckCircle className="h-3 w-3" />
                  ) : (
                    <Icon className={`h-3 w-3 ${
                      isActive ? 'animate-pulse' : ''
                    }`} />
                  )}
                </div>
                
                <span className={`text-sm font-medium transition-colors ${
                  isActive ? 'text-primary' :
                  isCompleted ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'
                }`}>
                  {step.label}
                </span>
                
                {isActive && (
                  <div className="ml-auto flex items-center gap-1">
                    <Clock className="h-3 w-3 text-primary animate-spin" />
                    <span className="text-xs text-primary font-medium">En progreso</span>
                  </div>
                )}
                
                {isCompleted && (
                  <CheckCircle className="h-4 w-4 text-green-500 ml-auto" />
                )}
              </div>
            );
          })}
        </div>

        {/* Mensaje motivacional */}
        <div className="text-center p-4 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg border border-primary/10">
          <p className="text-sm text-muted-foreground">
            🚀 <strong>Optimizando para Web3 SEO</strong> - Preparando análisis profesional para maximizar tu visibilidad en el ecosistema blockchain
          </p>
        </div>
      </CardContent>
    </Card>
  );
}