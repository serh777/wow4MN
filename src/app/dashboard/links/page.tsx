'use client';

import React from 'react';
import { ToolLayout } from '@/app/dashboard/results/content/components/tool-components';
import { LinksForm } from './components/links-form';
import { useLinksAnalysis } from './components/use-links-analysis';
import { Card, CardContent } from '@/components/ui/card';

export default function LinksAnalysisPage() {
  const { loading, results, error, handleSubmit } = useLinksAnalysis();

  const onSubmit = (data: {
    websiteUrl: string;
    scanDepth: number;
    linkTypes: string[];
    checkFrequency: string;
    excludePatterns: string;
  }) => {
    handleSubmit(data);
  };

  const hasResults = results;

  return (
    <ToolLayout
      title="Análisis de Enlaces"
      description="Analiza la salud, SEO y rendimiento de todos los enlaces en tu sitio web"
      icon="🔗"
    >
      <div className="space-y-6">
        {/* Formulario de Entrada */}
        <LinksForm 
          onSubmit={onSubmit}
          loading={loading}
        />

        {/* Estado de Carga */}
        {loading && (
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-center space-x-2">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                <span>Analizando enlaces... Se redirigirá automáticamente a los resultados.</span>
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
                Tu análisis de enlaces ha sido procesado exitosamente. 
                Serás redirigido a la página de resultados en unos segundos.
              </p>
              <div className="text-sm text-green-600">
                Si no eres redirigido automáticamente, 
                <a 
                  href="/dashboard/results/links"
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