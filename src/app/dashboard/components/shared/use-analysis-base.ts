'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAnalysisNotifications } from '@/components/notifications/use-analysis-notifications';

export interface AnalysisBaseState {
  loading: boolean;
  error: string | null;
  response: any;
  specialResults: any;
  analysisType: string;
  currentAnalysisStep: string;
  analysisProgress: number;
}

export interface AnalysisBaseActions {
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setResponse: (response: any) => void;
  setSpecialResults: (results: any) => void;
  setAnalysisType: (type: string) => void;
  setCurrentAnalysisStep: (step: string) => void;
  setAnalysisProgress: (progress: number) => void;
  resetState: () => void;
}

export interface AnalysisConfig {
  analysisName: string;
  resultPath: string;
  steps: string[];
  stepDuration?: number;
}

/**
 * Hook base para la lógica común de análisis
 * Proporciona estado y funciones comunes para todos los tipos de análisis
 */
export function useAnalysisBase(config: AnalysisConfig) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<any>(null);
  const [specialResults, setSpecialResults] = useState<any>(null);
  const [analysisType, setAnalysisType] = useState('');
  const [currentAnalysisStep, setCurrentAnalysisStep] = useState('');
  const [analysisProgress, setAnalysisProgress] = useState(0);

  const router = useRouter();
  const { notifyAnalysisStarted, notifyAnalysisCompleted, notifyAnalysisError } = useAnalysisNotifications();

  const resetState = () => {
    setLoading(false);
    setError(null);
    setResponse(null);
    setSpecialResults(null);
    setAnalysisType('');
    setCurrentAnalysisStep('');
    setAnalysisProgress(0);
  };

  /**
   * Simula el progreso del análisis paso a paso
   */
  const simulateAnalysisProgress = async (steps: string[], stepDuration = 1000) => {
    for (let i = 0; i < steps.length; i++) {
      setCurrentAnalysisStep(steps[i]);
      setAnalysisProgress(((i + 1) / steps.length) * 100);
      await new Promise(resolve => setTimeout(resolve, stepDuration));
    }
  };

  /**
   * Inicia un análisis con notificaciones y manejo de errores
   */
  const startAnalysis = async (
    analysisParams: any,
    analysisFunction: (params: any) => Promise<any>
  ) => {
    setLoading(true);
    setError(null);
    setAnalysisType(analysisParams.analysisType || config.analysisName);
    setCurrentAnalysisStep(`Iniciando análisis de ${config.analysisName}...`);
    setAnalysisProgress(0);

    const analysisId = notifyAnalysisStarted(config.analysisName, analysisParams);

    try {
      // Simular progreso
      await simulateAnalysisProgress(config.steps, config.stepDuration);

      // Ejecutar función de análisis personalizada
      const results = await analysisFunction(analysisParams);

      setResponse(results);
      setSpecialResults(results);

      notifyAnalysisCompleted(config.analysisName, undefined, analysisParams);

      // Redirigir a resultados
      const searchParams = new URLSearchParams();
      Object.entries(analysisParams).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            searchParams.set(key, value.join(','));
          } else {
            searchParams.set(key, String(value));
          }
        }
      });

      router.push(`${config.resultPath}?${searchParams.toString()}`);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      notifyAnalysisError(config.analysisName, errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const state: AnalysisBaseState = {
    loading,
    error,
    response,
    specialResults,
    analysisType,
    currentAnalysisStep,
    analysisProgress
  };

  const actions: AnalysisBaseActions = {
    setLoading,
    setError,
    setResponse,
    setSpecialResults,
    setAnalysisType,
    setCurrentAnalysisStep,
    setAnalysisProgress,
    resetState
  };

  return {
    ...state,
    ...actions,
    startAnalysis,
    simulateAnalysisProgress
  };
}

export default useAnalysisBase;