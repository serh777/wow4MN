'use client';

import React from 'react';
import { ToolLayout } from '@/app/dashboard/content/analysis-results/components/tool-components';
import { SecurityAnalysisForm } from './components/security-analysis-form';
import { useSecurityAnalysis } from './components/use-security-analysis';
import ErrorBoundary from '@/components/error-boundary';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Loader2 } from 'lucide-react';

export default function SecurityAuditPage() {
  const { loading, results, error, progress: analysisProgress, handleSubmit } = useSecurityAnalysis();

  const hasResults = results;

  return (
    <ErrorBoundary>
      <ToolLayout
        title="Auditoría de Seguridad"
        description="Evalúa la seguridad de tu proyecto Web3, contratos inteligentes y infraestructura"
        icon="🔒"
      >
        <div className="space-y-6">
          <SecurityAnalysisForm onSubmit={handleSubmit} loading={loading} />
          
          {/* Estado de Carga */}
          {loading && (
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <div className="space-y-1">
                    <span className="text-sm font-medium">{analysisProgress?.currentStep || 'Analizando seguridad...'}</span>
                    <p className="text-xs text-muted-foreground">{analysisProgress?.message || 'Ejecutando verificaciones de seguridad'}</p>
                  </div>
                </div>
                <Progress value={analysisProgress?.percentage || 0} className="w-full" />
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
                  ¡Auditoría Completada!
                </h3>
                <p className="text-green-700 mb-4">
                  Tu auditoría de seguridad ha sido procesada exitosamente. 
                  Serás redirigido a la página de resultados en unos segundos.
                </p>
                <div className="text-sm text-green-600">
                  Si no eres redirigido automáticamente, 
                  <a 
                    href="/dashboard/security/analysis-results"
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