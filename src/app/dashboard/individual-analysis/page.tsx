'use client';

import { IndividualAnalysisForm } from './components/individual-analysis-form';
import { useIndividualAnalysis } from './components/use-individual-analysis';

export default function IndividualAnalysisPage() {
  const {
    loading,
    analysisProgress,
    currentAnalysisStep,
    error,
    toolResults,
    handleSubmit
  } = useIndividualAnalysis();

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Análisis Individual Personalizado</h1>
        <p className="text-muted-foreground">
          Configura y ejecuta análisis detallados con herramientas específicas
        </p>
      </div>

      <div className="grid gap-6">
        <IndividualAnalysisForm onSubmit={handleSubmit} loading={loading} />
        
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
            
            {Object.keys(toolResults).length > 0 && (
              <div className="mt-4">
                <h3 className="text-sm font-medium mb-2">Herramientas completadas:</h3>
                <div className="flex flex-wrap gap-2">
                  {Object.keys(toolResults).map(tool => (
                    <span key={tool} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                      {tool} ✓
                    </span>
                  ))}
                </div>
              </div>
            )}
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