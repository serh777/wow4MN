'use client';

import * as React from 'react';
import Link from 'next/link';
import { ToolLayout } from '@/app/dashboard/content/analysis-results/components/tool-components';
import { KeywordsForm } from './components/keywords-form';
import { KeywordsResults } from './components/keywords-results';
import { useKeywordsAnalysis } from './components/use-keywords-analysis';
import ErrorBoundary from '@/components/error-boundary';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, ExternalLink } from 'lucide-react';

export default function KeywordsPage() {
  const { loading, results, handleSubmit, progress, currentStep } = useKeywordsAnalysis();

  return (
    <ToolLayout 
      title="Análisis de Keywords" 
      description="Analiza y optimiza las palabras clave de tu proyecto Web3 para mejorar su visibilidad"
      icon="🔍"
    >
      <ErrorBoundary>
        <KeywordsForm 
          onSubmit={handleSubmit} 
          loading={loading} 
          progress={progress}
          currentStep={currentStep}
        />
        
        {results && (
          <Card className="p-6 bg-green-50 border-green-200">
            <div className="flex items-center space-x-3 mb-4">
              <CheckCircle className="h-6 w-6 text-green-600" />
              <div>
                <h3 className="text-lg font-semibold text-green-800">
                  ¡Análisis de Keywords Completado!
                </h3>
                <p className="text-green-700">
                  Tu análisis se ha procesado exitosamente. Serás redirigido automáticamente a los resultados detallados.
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Link href="/dashboard/keywords/analysis-results">
                <Button className="flex items-center space-x-2">
                  <span>Ver Resultados Detallados</span>
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </Link>
              <p className="text-sm text-green-600">
                Redirección automática en 2 segundos...
              </p>
            </div>
          </Card>
        )}
        
        {results && <KeywordsResults results={results} />}
      </ErrorBoundary>
    </ToolLayout>
  );
}