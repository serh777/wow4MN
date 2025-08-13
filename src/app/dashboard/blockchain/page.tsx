'use client';

import React from 'react';
import { ToolLayout } from '@/app/dashboard/content/analysis-results/components/tool-components';
import { InputForm } from './components/InputForm';
import { BlockchainResults } from './components/BlockchainResults';
import { useBlockchainAnalysis } from './components/use-blockchain-analysis';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Loader2 } from 'lucide-react';
import ErrorBoundary from '@/components/error-boundary';

export default function BlockchainAnalysisPage() {
  const {
    isLoading: loading,
    results,
    error,
    progress: analysisProgress,
    handleSubmit,
    resetAnalysis
  } = useBlockchainAnalysis();

  return (
    <ErrorBoundary>
      <ToolLayout
        title="Análisis Blockchain"
        description="Evalúa el rendimiento y la seguridad de tus contratos inteligentes"
        icon="🔗"
      >
        <div className="space-y-6">
          <InputForm onSubmit={handleSubmit} isLoading={loading} />
          
          {loading && (
             <Card>
               <CardContent className="p-6">
                 <div className="flex items-center gap-3 mb-4">
                   <Loader2 className="h-5 w-5 animate-spin" />
                   <div className="space-y-1">
                     <span className="text-sm font-medium">{analysisProgress.currentStep}</span>
                     <p className="text-xs text-muted-foreground">{analysisProgress.message}</p>
                   </div>
                 </div>
                 <Progress value={analysisProgress.percentage} className="w-full" />
               </CardContent>
             </Card>
           )}
          
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {results && (
            <Card className="border-green-200 bg-green-50">
              <CardContent className="p-6">
                <div className="text-center space-y-3">
                  <div className="text-green-600 font-semibold">¡Análisis completado!</div>
                  <p className="text-sm text-muted-foreground">
                    Serás redirigido automáticamente a los resultados completos...
                  </p>
                  <a 
                    href="/dashboard/blockchain/analysis-results" 
                    className="text-blue-600 hover:text-blue-800 underline text-sm"
                  >
                    O haz clic aquí para ir manualmente
                  </a>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </ToolLayout>
    </ErrorBoundary>
  );
}