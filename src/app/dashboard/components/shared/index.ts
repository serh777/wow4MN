// Componentes base
export { AnalysisFormBase } from './analysis-form-base';
export type { AnalysisFormBaseProps } from './analysis-form-base';

// Campos de formulario
export {
  UrlField,
  AnalysisTypeField,
  CheckboxField,
  TextAreaField,
  OptionsTabsContainer,
  BasicTabContent,
  AdvancedTabContent
} from './analysis-form-fields';

export type {
  UrlFieldProps,
  AnalysisTypeFieldProps,
  CheckboxFieldProps,
  TextAreaFieldProps
} from './analysis-form-fields';

// Hook base
export { useAnalysisBase } from './use-analysis-base';
export type {
  AnalysisBaseState,
  AnalysisBaseActions,
  AnalysisConfig
} from './use-analysis-base';

// Componentes de visualización de resultados
export {
  MetricCard,
  ResultsSection,
  ScoreDisplay,
  AnalysisResultsContainer
} from './analysis-results-display';

export type {
  MetricCardProps,
  ResultsSectionProps,
  ScoreDisplayProps
} from './analysis-results-display';

// Componentes de progreso de análisis
export {
  AnalysisProgress,
  AnalysisStepsList,
  ProgressStep
} from './analysis-progress';

export type {
  AnalysisProgressProps,
  ProgressStepProps
} from './analysis-progress';

// Configuraciones comunes
export const COMMON_ANALYSIS_TYPES = {
  CONTENT: [
    { value: 'comprehensive', label: 'Análisis Completo' },
    { value: 'seo', label: 'SEO Básico' },
    { value: 'readability', label: 'Legibilidad' },
    { value: 'performance', label: 'Rendimiento' }
  ],
  METADATA: [
    { value: 'basic', label: 'Metadatos Básicos' },
    { value: 'social', label: 'Redes Sociales' },
    { value: 'seo', label: 'SEO Avanzado' },
    { value: 'technical', label: 'Técnico' }
  ],
  INDIVIDUAL: [
    { value: 'custom', label: 'Personalizado' },
    { value: 'quick', label: 'Análisis Rápido' },
    { value: 'detailed', label: 'Análisis Detallado' }
  ]
};

export const COMMON_ANALYSIS_STEPS = {
  CONTENT: [
    'Extrayendo contenido...',
    'Analizando legibilidad...',
    'Evaluando SEO...',
    'Midiendo engagement...',
    'Procesando métricas...',
    'Generando recomendaciones...'
  ],
  METADATA: [
    'Extrayendo metadatos...',
    'Analizando estructura...',
    'Validando Open Graph...',
    'Verificando Twitter Cards...',
    'Evaluando SEO técnico...',
    'Generando informe...'
  ],
  INDIVIDUAL: [
    'Configurando herramientas...',
    'Ejecutando análisis seleccionados...',
    'Procesando resultados...',
    'Consolidando datos...',
    'Generando reporte personalizado...'
  ]
};

// Utilidades comunes
export const generateMockResults = (baseParams: any, specificData: any = {}) => {
  return {
    ...baseParams,
    timestamp: new Date().toISOString(),
    id: `analysis-${Date.now()}`,
    ...specificData
  };
};

export const createAnalysisConfig = (
  analysisName: string,
  resultPath: string,
  steps?: string[],
  stepDuration?: number
) => {
  return {
    analysisName,
    resultPath,
    steps: steps || COMMON_ANALYSIS_STEPS.CONTENT,
    stepDuration: stepDuration || 1000
  };
};