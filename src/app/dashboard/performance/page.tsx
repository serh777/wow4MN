'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { PerformanceAnalysisTool } from './components/performance-analysis-tool';
import { usePerformanceAnalysis } from './components/use-performance-analysis';
import ErrorBoundary from '@/components/error-boundary';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, ExternalLink } from 'lucide-react';

export default function BlockchainPerformancePage() {
  const [showResults, setShowResults] = useState(false);
  const { results } = usePerformanceAnalysis();

  useEffect(() => {
    const savedResults = sessionStorage.getItem('performanceAnalysisResults');
    if (savedResults && results) {
      setShowResults(true);
      // Auto redirect after 5 seconds
      const timer = setTimeout(() => {
        window.location.href = '/dashboard/results/performance';
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [results]);

  if (showResults) {
    return (
      <div className="container mx-auto p-6">
        <Card className="max-w-2xl mx-auto">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <CardTitle className="text-2xl">¡Análisis de Rendimiento Completado!</CardTitle>
            <CardDescription>
              El análisis de rendimiento de tu contrato blockchain ha sido completado exitosamente.
              Serás redirigido automáticamente a los resultados detallados.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="space-y-2">
              <Link href="/dashboard/results/performance">
                <Button className="w-full">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Ver Resultados Detallados
                </Button>
              </Link>
              <Link href="/dashboard/performance">
                <Button variant="outline" className="w-full">
                  Realizar Nuevo Análisis
                </Button>
              </Link>
            </div>
            <p className="text-sm text-muted-foreground">
              Redirigiendo automáticamente en 5 segundos...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <PerformanceAnalysisTool />
    </ErrorBoundary>
  );
}