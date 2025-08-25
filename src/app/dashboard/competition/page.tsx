'use client';

import React from 'react';
import { ToolLayout } from '@/app/dashboard/results/content/components/tool-components';
import { InputForm } from './components/InputForm';
import { CompetitionResults } from './components/CompetitionResults';
import { useCompetitionAnalysis } from './components/use-competition-analysis';
import ErrorBoundary from '@/components/error-boundary';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Loader2 } from 'lucide-react';

export default function CompetitionAnalysisPage() {
  const { isLoading: loading, results, error, progress: analysisProgress, handleSubmit } = useCompetitionAnalysis();

  const hasResults = results;

  return (
    <ErrorBoundary>
      <ToolLayout
        title="Análisis de Competencia"
        description="Compara tu proyecto con competidores en el ecosistema Web3 y descubre oportunidades de mejora"
        icon="📊"
      >
        <div className="space-y-6">
          <InputForm onSubmit={handleSubmit} isLoading={loading} />
          
          {/* Estado de Carga */}
          {loading && (
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <div className="space-y-1">
                    <span className="text-sm font-medium">{analysisProgress.currentStep}</span>
                    <p className="text-xs text-muted-foreground">{analysisProgress.message}</p>
                  </div>
                </div>
                <Progress value={analysisProgress.percentage} className="w-full" />
                <p className="text-sm text-muted-foreground mt-2">
                  Se redirigirá automáticamente a los resultados.
                </p>
              </CardContent>
            </Card>
          )}
          
          {/* Error */}
          {error && !loading && (
            <Card>
              <CardContent className="p-6">
                <div className="text-center text-red-600">
                  <p>Error en el análisis: {error}</p>
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* Mostrar mensaje de éxito y redirección */}
          {hasResults && (
            <Card className="bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800">
              <CardContent className="pt-6 text-center">
                <div className="text-green-600 text-6xl mb-4">✅</div>
                <h3 className="text-xl font-semibold text-green-800 mb-2">
                  ¡Análisis Completado!
                </h3>
                <p className="text-green-700 mb-4">
                  Tu análisis de competencia ha sido procesado exitosamente. 
                  Serás redirigido a la página de resultados en unos segundos.
                </p>
                <div className="text-sm text-green-600">
                  Si no eres redirigido automáticamente, 
                  <a 
                    href="/dashboard/results/competition"
                    className="underline font-medium hover:text-green-800"
                  >
                    haz clic aquí
                  </a>
                  .
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </ToolLayout>
    </ErrorBoundary>
  );
}