'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ErrorBoundary } from 'react-error-boundary';
import { SmartContractAnalysisTool } from './components/smart-contract-analysis-tool';
import { useSmartContractAnalysis } from './components/use-smart-contract-analysis';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, ExternalLink } from 'lucide-react';

function ErrorFallback({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) {
  return (
    <div className="text-center p-8">
      <h2 className="text-xl font-semibold text-red-600 mb-4">Algo salió mal</h2>
      <p className="text-gray-600 mb-4">{error.message}</p>
      <button
        onClick={resetErrorBoundary}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Intentar de nuevo
      </button>
    </div>
  );
}

export default function SmartContractSEOPage() {
  const [hasResults, setHasResults] = useState(false);
  const { results } = useSmartContractAnalysis();

  useEffect(() => {
    const savedResults = sessionStorage.getItem('smartContractAnalysisResults');
    setHasResults(!!savedResults || !!results);
  }, [results]);

  if (hasResults) {
    return (
      <div className="container mx-auto p-6">
        <Card className="max-w-2xl mx-auto">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <CardTitle className="text-2xl font-bold text-green-700">
              ¡Análisis de Smart Contract Completado!
            </CardTitle>
            <CardDescription className="text-lg">
              Tu análisis de smart contract ha sido procesado exitosamente.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/dashboard/smart-contract/analysis-results">
                <Button className="w-full sm:w-auto">
                  Ver Resultados Detallados
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/dashboard/smart-contract">
                <Button variant="outline" className="w-full sm:w-auto" onClick={() => {
                  sessionStorage.removeItem('smartContractAnalysisResults');
                }}>
                  Realizar Nuevo Análisis
                </Button>
              </Link>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Serás redirigido automáticamente a los resultados detallados...
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <SmartContractAnalysisTool />
    </ErrorBoundary>
  );
}