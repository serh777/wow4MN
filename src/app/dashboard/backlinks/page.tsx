'use client';

import React from 'react';
import { ToolLayout } from '@/app/dashboard/results/content/components/tool-components';
import { InputForm } from './components/InputForm';
import { BacklinksResults } from './components/BacklinksResults';
import { useBacklinksAnalysis } from './components/use-backlinks-analysis';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Loader2 } from 'lucide-react';

export default function BacklinksAnalysisPage() {
  const {
    loading,
    results,
    error,
    analysisProgress,
    handleSubmit,
    resetAnalysis
  } = useBacklinksAnalysis();

  const onSubmit = async (data: any) => {
    await handleSubmit(data);
  };

  const hasResults = results;

  return (
    <ToolLayout
      title="Análisis de Backlinks"
      description="Analiza el perfil de enlaces entrantes de tu sitio web y descubre oportunidades de mejora"
      icon="🔗"
    >
      <div className="space-y-6">
        <InputForm onSubmit={onSubmit} loading={loading} />

        {/* Estado de Carga */}
        {loading && (
          <Card>
            <CardContent className="p-6">
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
                <div>
                  <h3 className="font-medium mb-2">{analysisProgress.step}</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {analysisProgress.message}
                  </p>
                  <Progress value={analysisProgress.progress} className="w-full" />
                  <p className="text-sm text-muted-foreground mt-2">
                    Se redirigirá automáticamente a los resultados.
                  </p>
                </div>
              </div>
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
                Tu análisis de backlinks ha sido procesado exitosamente. 
                Serás redirigido a la página de resultados en unos segundos.
              </p>
              <div className="text-sm text-green-600">
                Si no eres redirigido automáticamente, 
                <a 
                  href="/dashboard/results/backlinks"
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
  );
}