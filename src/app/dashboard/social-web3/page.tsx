'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ErrorBoundary } from 'react-error-boundary';
import { SocialWeb3AnalysisTool } from './components/social-web3-analysis-tool';
import { useSocialWeb3Analysis } from './components/use-social-web3-analysis';
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

export default function SocialWeb3AnalysisPage() {
  const [hasResults, setHasResults] = useState(false);
  const { results } = useSocialWeb3Analysis();

  useEffect(() => {
    const savedResults = sessionStorage.getItem('socialWeb3AnalysisResults');
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
              ¡Análisis Social Web3 Completado!
            </CardTitle>
            <CardDescription className="text-lg">
              Tu análisis de presencia en redes sociales Web3 ha sido procesado exitosamente.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/dashboard/social-web3/analysis-results">
                <Button className="w-full sm:w-auto">
                  Ver Resultados Detallados
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/dashboard/social-web3">
                <Button variant="outline" className="w-full sm:w-auto" onClick={() => {
                  sessionStorage.removeItem('socialWeb3AnalysisResults');
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
      <SocialWeb3AnalysisTool />
    </ErrorBoundary>
  );
}