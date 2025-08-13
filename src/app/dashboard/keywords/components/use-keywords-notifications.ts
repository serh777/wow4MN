'use client';

import { useContext } from 'react';
import { NotificationContext } from '@/components/notifications/notification-system';

/**
 * Hook simplificado para notificaciones específicas de análisis de keywords
 * Sin estado interno para evitar referencias circulares
 */
export function useKeywordsNotifications() {
  const notificationContext = useContext(NotificationContext);
  if (!notificationContext) {
    throw new Error('useKeywordsNotifications debe ser usado dentro de un NotificationProvider');
  }
  const { addNotification } = notificationContext;

  const notifyAnalysisStarted = (analysisType: string) => {
    addNotification({
      type: 'info',
      title: 'Análisis Iniciado',
      message: `Iniciando análisis de ${analysisType}`,
      duration: 3000
    });
  };

  const notifyAnalysisCompleted = (analysisType: string, score: number) => {
    addNotification({
      type: 'success',
      title: 'Análisis Completado',
      message: `${analysisType} completado con éxito. Score: ${score}%`,
      duration: 5000
    });
  };

  const notifyAnalysisError = (analysisType: string, error: string) => {
    addNotification({
      type: 'error',
      title: 'Error en Análisis',
      message: `Error en ${analysisType}: ${error}`,
      duration: 7000
    });
  };

  return {
    notifyAnalysisStarted,
    notifyAnalysisCompleted,
    notifyAnalysisError
  };
}