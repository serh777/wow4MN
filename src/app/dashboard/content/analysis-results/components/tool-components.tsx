'use client';

import * as React from 'react';

interface ToolLayoutProps {
  title: string;
  description: string;
  icon?: string;
  children: React.ReactNode;
}

export function ToolLayout({ title, description, icon, children }: ToolLayoutProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        {icon && <span className="text-2xl">{icon}</span>}
        <div>
          <h2 className="text-2xl font-bold">{title}</h2>
          <p className="text-muted-foreground">{description}</p>
        </div>
      </div>
      <div className="space-y-6">{children}</div>
    </div>
  );
}

interface FormField {
  name: string;
  label: string;
  type: 'text' | 'select' | 'textarea';
  placeholder?: string;
  required?: boolean;
  options?: { value: string; label: string }[];
}

type FormData = Record<string, string>;

interface InputFormProps {
  fields?: FormField[];
  onSubmit: (data: FormData) => Promise<void>;
  isLoading?: boolean;
  submitText?: string;
  loadingText?: string;
  children?: React.ReactNode;
}

export function InputForm({ 
  fields, 
  onSubmit, 
  isLoading = false, 
  submitText = 'Analizar', 
  loadingText = 'Analizando...', 
  children 
}: InputFormProps) {
  const handleSubmit = React.useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const browserFormData = new FormData(form);
    const data: FormData = {};
    
    // Recopilar todos los datos del formulario
    for (const [key, value] of browserFormData.entries()) {
      data[key] = value.toString();
    }
    
    onSubmit(data);
  }, [onSubmit]);

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow">
      <div className="p-6">
        <h3 className="text-lg font-medium mb-4">Configuracion del Analisis</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          {fields && fields.map((field) => (
            <div key={field.name} className="space-y-2">
              <label htmlFor={field.name} className="text-sm font-medium">
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              
              {field.type === 'text' && (
                <input
                  id={field.name}
                  type="text"
                  name={field.name}
                  placeholder={field.placeholder}
                  required={field.required}
                  className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                />
              )}
              
              {field.type === 'select' && (
                <select
                  id={field.name}
                  name={field.name}
                  required={field.required}
                  className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                >
                  <option value="">Seleccionar...</option>
                  {field.options?.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              )}
              
              {field.type === 'textarea' && (
                <textarea
                  id={field.name}
                  name={field.name}
                  placeholder={field.placeholder}
                  required={field.required}
                  rows={3}
                  className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 resize-none"
                />
              )}
            </div>
          ))}
          
          {children}
          
          <div className="mt-6">
            <button 
              type="submit" 
              className="w-full inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? loadingText : submitText}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

interface AnalysisResultsProps {
  results: unknown;
  title?: string;
}

export const AnalysisResults = React.memo<AnalysisResultsProps>(({ results, title = 'Resultados del Análisis' }) => {
  if (!results) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No hay resultados disponibles</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">{title}</h3>
      <div className="bg-gray-50 p-4 rounded-lg">
        <pre className="whitespace-pre-wrap text-sm overflow-x-auto">
          {typeof results === 'string' ? results : JSON.stringify(results, null, 2)}
        </pre>
      </div>
    </div>
  );
});

AnalysisResults.displayName = 'AnalysisResults';

interface VisualizationProps {
  title: string;
  description: string;
  children: React.ReactNode;
  height?: string;
}

export const Visualization = React.memo<VisualizationProps>(({ title, description, children, height = '300px' }) => {
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow">
      <div className="p-6">
        <div className="mb-4">
          <h3 className="text-lg font-medium">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <div className="resizable-container">
          {children}
        </div>
      </div>
    </div>
  );
});

Visualization.displayName = 'Visualization';

interface ScoreCardProps {
  title: string;
  score: number | string;
  description: string;
  variant?: 'default' | 'success' | 'warning' | 'danger';
}

export const ScoreCard = React.memo<ScoreCardProps>(({ title, score, description, variant = 'default' }) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'success':
        return 'border-green-200 bg-green-50 text-green-900';
      case 'warning':
        return 'border-yellow-200 bg-yellow-50 text-yellow-900';
      case 'danger':
        return 'border-red-200 bg-red-50 text-red-900';
      default:
        return 'border bg-card text-card-foreground';
    }
  };

  return (
    <div className={`rounded-lg shadow p-4 ${getVariantClasses()}`}>
      <div className="flex flex-col items-center text-center">
        <h3 className="font-medium">{title}</h3>
        <div className="mt-2 mb-1">
          <div className="text-3xl font-bold">{score}</div>
        </div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    </div>
  );
});

ScoreCard.displayName = 'ScoreCard';