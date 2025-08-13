'use client';

import React from 'react';
import { ToolLayout } from '@/app/dashboard/content/analysis-results/components/tool-components';
import { InputForm } from './components/InputForm';
import { useAIAnalysis } from './components/use-ai-analysis';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain } from 'lucide-react';

interface FormData {
  url: string;
  analysisType: string;
  network: string;
  contractAddress: string;
  includeMetadata: boolean;
  includeEvents: boolean;
  includeTransactions: boolean;
  selectedIndexer: string;
  prompt: string;
}

export default function AIAssistantPage() {
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
  } = useAIAnalysis();

  const onSubmit = (data: FormData) => {
    handleSubmit({
      url: data.url,
      analysisType: data.analysisType,
      network: data.network,
      contractAddress: data.contractAddress,
      includeMetadata: data.includeMetadata,
      includeEvents: data.includeEvents,
      includeTransactions: data.includeTransactions,
      selectedIndexer: data.selectedIndexer,
      prompt: data.prompt
    });
  };

  const onReset = () => {
    resetAnalysis();
  };
  
  const hasResults = response || specialResults || indexerResults;

  return (
    <ToolLayout
      title="Análisis IA Web3"
      description="Herramienta avanzada de análisis con inteligencia artificial para proyectos Web3 y blockchain"
      icon="🧠"
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
                <span>Analizando... Se redirigirá automáticamente a los resultados.</span>
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
                Tu análisis ha sido procesado exitosamente. 
                Serás redirigido a la página de resultados en unos segundos.
              </p>
              <div className="text-sm text-green-600">
                Si no eres redirigido automáticamente, 
                <a 
                  href={`/dashboard/ai-assistant/analysis-results?type=${analysisType}&url=${encodeURIComponent('wowseoweb3.com')}`}
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