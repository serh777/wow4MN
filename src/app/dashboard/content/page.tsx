'use client';

import { ContentAnalysisForm } from './components/content-analysis-form';
import { useContentAnalysis } from './components/use-content-analysis';

export default function ContentPage() {
  const {
    loading,
    analysisProgress,
    currentAnalysisStep,
    error,
    handleSubmit
  } = useContentAnalysis();

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Análisis de Contenido</h1>
        <p className="text-muted-foreground">
          Analiza la calidad, legibilidad y optimización SEO de tu contenido
        </p>
      </div>

      <div className="grid gap-6">
        <ContentAnalysisForm onSubmit={handleSubmit} loading={loading} />
        
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