'use client';

import { MetadataAnalysisForm } from './components/metadata-analysis-form';
import { useMetadataAnalysis } from './components/use-metadata-analysis';

export default function MetadataPage() {
  const {
    loading,
    analysisProgress,
    currentAnalysisStep,
    error,
    handleSubmit
  } = useMetadataAnalysis();

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Análisis de Metadatos</h1>
        <p className="text-muted-foreground">
          Analiza y optimiza los metadatos de tu sitio web
        </p>
      </div>

      <div className="grid gap-6">
        <MetadataAnalysisForm onSubmit={handleSubmit} loading={loading} />
        
        {loading && (
          <div className="space-y-4">
            <div className="dynamic-progress-bar">
              <div 
                className="dynamic-progress-fill" 
                style={{ '--progress-width': `${analysisProgress}%` } as React.CSSProperties}
              ></div>
            </div>
            <p className="text-sm text-muted-foreground text-center">
              {currentAnalysisStep}
            </p>
          </div>
        )}
        
        {error && (
          <div className="p-4 border border-red-200 bg-red-50 rounded-lg">
            <p className="text-red-600">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
}