'use client';

import React from 'react';
import { ToolLayout } from '../results/content/components/tool-components';
import { InputForm } from '../results/content/components/InputForm';
import { useContentAnalysis } from '../results/content/components/use-content-analysis';
import { Card, CardContent } from '@/components/ui/card';

interface FormData {
  url: string;
  analysisType: string;
  contentType: string;
  targetAudience: string;
  includeReadability: boolean;
  includeSEO: boolean;
  includeEngagement: boolean;
  selectedIndexer: string;
  keywords: string;
}

export default function ContentPage() {
  const {
    loading,
    response,
    analysisType,
    specialResults,
    indexerResults,
    analysisProgress,
    indexerProgress,
    currentAnalysisStep,
    error,
    handleSubmit,
    resetAnalysis
  } = useContentAnalysis();

  const onSubmit = (data: FormData) => {
    handleSubmit({
      url: data.url,
      analysisType: data.analysisType,
      contentType: data.contentType,
      targetAudience: data.targetAudience,
      includeReadability: data.includeReadability,
      includeSEO: data.includeSEO,
      includeEngagement: data.includeEngagement,
      selectedIndexer: data.selectedIndexer,
      keywords: data.keywords
    });
  };

  const onReset = () => {
    resetAnalysis();
  };
  
  const hasResults = response || specialResults || indexerResults;

  return (
    <ToolLayout
      title="Análisis de Contenido"
      description="Herramienta especializada para evaluar y optimizar contenido digital Web3"
      icon="📝"
    >
      <div className="space-y-6">
        {/* Formulario de Entrada */}
        <InputForm 
          onSubmit={onSubmit}
          loading={loading}
          onReset={onReset}
        />

        {/* Estado de Carga */}
        {loading && (
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-center space-x-2">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                <span>Analizando contenido... Se redirigirá automáticamente a los resultados.</span>
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
                ¡Análisis de Contenido Completado!
              </h3>
              <p className="text-green-700 mb-4">
                Tu contenido ha sido analizado exitosamente. 
                Serás redirigido a la página de resultados en unos segundos.
              </p>
              <div className="text-sm text-green-600">
                Si no eres redirigido automáticamente, 
                <a 
                  href={`/dashboard/results/content?type=${analysisType}&url=${encodeURIComponent('ejemplo.com')}`}
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