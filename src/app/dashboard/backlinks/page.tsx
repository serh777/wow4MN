'use client';

import React from 'react';
import { ToolLayout } from '@/app/dashboard/content/analysis-results/components/tool-components';
import { InputForm } from './components/InputForm';
import { BacklinksResults } from './components/BacklinksResults';
import { useBacklinksAnalysis } from './components/use-backlinks-analysis';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CheckCircle } from 'lucide-react';

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

  return (
    <ToolLayout
      title="Análisis de Backlinks"
      description="Analiza el perfil de enlaces entrantes de tu sitio web y descubre oportunidades de mejora"
    >
      <div className="space-y-6">
        <InputForm onSubmit={onSubmit} loading={loading} />

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
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {results && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              <div className="font-medium mb-1">¡Análisis completado!</div>
              <div className="text-sm">
                Redirigiendo automáticamente a los resultados detallados...
                <br />
                <a 
                  href="/dashboard/backlinks/analysis-results" 
                  className="underline hover:no-underline"
                >
                  Haz clic aquí si no eres redirigido automáticamente
                </a>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {error && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-4">
              <div className="text-red-800">
                <h3 className="font-medium mb-1">Error en el análisis</h3>
                <p className="text-sm">{error}</p>
              </div>
            </CardContent>
          </Card>
        )}


      </div>
    </ToolLayout>
  );
}