'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertCircle } from 'lucide-react';

export interface AnalysisFormBaseProps {
  title: string;
  description: string;
  children: React.ReactNode;
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
  error: string | null;
  progress?: number;
  currentStep?: string;
  submitButtonText?: string;
}

/**
 * Componente base para formularios de análisis
 * Proporciona estructura común y manejo de estados de carga/error
 */
export function AnalysisFormBase({
  title,
  description,
  children,
  onSubmit,
  loading,
  error,
  progress,
  currentStep,
  submitButtonText = 'Iniciar Análisis'
}: AnalysisFormBaseProps) {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>

      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-6">
            {children}
            
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            {loading && (
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm text-muted-foreground">
                    {currentStep || 'Procesando...'}
                  </span>
                </div>
                {progress !== undefined && (
                  <Progress value={progress} className="w-full" />
                )}
              </div>
            )}
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analizando...
                </>
              ) : (
                submitButtonText
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default AnalysisFormBase;