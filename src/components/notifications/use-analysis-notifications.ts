'use client';

import { useContext } from 'react';
import { NotificationContext } from './notification-system';
import { useState } from 'react';

export interface AnalysisNotification {
  id: string;
  type: 'start' | 'complete' | 'error' | 'progress';
  analysisType: string;
  message: string;
  timestamp: Date;
  score?: number;
  details?: Record<string, any>;
  progress?: number; // Porcentaje de progreso (0-100)
}

/**
 * Hook mejorado para gestionar notificaciones de análisis
 * 
 * Proporciona funciones para notificar eventos relacionados con análisis
 * y mantiene un historial de notificaciones con contexto detallado.
 */
export function useAnalysisNotifications() {
  const notificationContext = useContext(NotificationContext);
  if (!notificationContext) {
    throw new Error('useAnalysisNotifications debe ser usado dentro de un NotificationProvider');
  }
  const { addNotification } = notificationContext;
  const [notifications, setNotifications] = useState<AnalysisNotification[]>([]);
  const [activeAnalyses, setActiveAnalyses] = useState<Record<string, boolean>>({});

  // Generar ID único para cada notificación
  const generateId = () => `analysis-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

  // Notificar inicio de análisis
  const notifyAnalysisStarted = (analysisType: string, details?: Record<string, any>) => {
    const id = generateId();
    const notification: AnalysisNotification = {
      id,
      type: 'start',
      analysisType,
      message: `Iniciando análisis de ${analysisType}`,
      timestamp: new Date(),
      details
    };

    setNotifications(prev => [...prev, notification]);
    setActiveAnalyses(prev => ({ ...prev, [id]: true }));

    addNotification({
      type: 'info',
      title: `Análisis de ${analysisType}`,
      message: 'Iniciando análisis...',
    });

    return id;
  };

  // Notificar progreso de análisis
  const notifyAnalysisProgress = (id: string, progress: number, message?: string) => {
    setNotifications(prev => prev.map(notif => {
      if (notif.id === id) {
        return {
          ...notif,
          type: 'progress',
          progress,
          message: message || `Progreso: ${progress}%`,
          timestamp: new Date()
        };
      }
      return notif;
    }));

    // Solo mostrar notificación para cambios significativos de progreso (cada 25%)
    if (progress % 25 === 0) {
      const analysisType = notifications.find(n => n.id === id)?.analysisType || 'desconocido';
      addNotification({
        type: 'info',
        title: `Análisis de ${analysisType}`,
        message: message || `Progreso: ${progress}%`,
      });
    }
  };

  // Notificar finalización de análisis
  const notifyAnalysisCompleted = (analysisType: string, score?: number, details?: Record<string, any>) => {
    const id = generateId();
    const notification: AnalysisNotification = {
      id,
      type: 'complete',
      analysisType,
      message: `Análisis de ${analysisType} completado`,
      timestamp: new Date(),
      score,
      details
    };

    setNotifications(prev => [...prev, notification]);
    
    // Cerrar análisis activos del mismo tipo
    const activeIds = Object.entries(activeAnalyses)
      .filter(([_, active]) => active)
      .map(([id]) => id);
      
    const relatedNotifications = notifications
      .filter(n => n.analysisType === analysisType && activeIds.includes(n.id));
      
    if (relatedNotifications.length > 0) {
      const updatedActiveAnalyses = { ...activeAnalyses };
      relatedNotifications.forEach(n => {
        updatedActiveAnalyses[n.id] = false;
      });
      setActiveAnalyses(updatedActiveAnalyses);
    }

    // Mostrar mensaje con puntuación si está disponible
    const scoreText = score !== undefined ? ` (Puntuación: ${score})` : '';
    addNotification({
      type: 'success',
      title: `Análisis completado`,
      message: `${analysisType}${scoreText}`,
    });

    return id;
  };

  // Notificar error en análisis
  const notifyAnalysisError = (analysisType: string, errorMessage: string, details?: Record<string, any>) => {
    const id = generateId();
    const notification: AnalysisNotification = {
      id,
      type: 'error',
      analysisType,
      message: `Error en análisis de ${analysisType}: ${errorMessage}`,
      timestamp: new Date(),
      details
    };

    setNotifications(prev => [...prev, notification]);
    
    // Cerrar análisis activos del mismo tipo
    const activeIds = Object.entries(activeAnalyses)
      .filter(([_, active]) => active)
      .map(([id]) => id);
      
    const relatedNotifications = notifications
      .filter(n => n.analysisType === analysisType && activeIds.includes(n.id));
      
    if (relatedNotifications.length > 0) {
      const updatedActiveAnalyses = { ...activeAnalyses };
      relatedNotifications.forEach(n => {
        updatedActiveAnalyses[n.id] = false;
      });
      setActiveAnalyses(updatedActiveAnalyses);
    }

    addNotification({
      type: 'error',
      title: `Error en análisis de ${analysisType}`,
      message: errorMessage,
    });

    return id;
  };

  // Obtener todas las notificaciones
  const getNotifications = () => notifications;

  // Obtener notificaciones activas
  const getActiveNotifications = () => {
    return notifications.filter(n => activeAnalyses[n.id]);
  };

  // Obtener notificaciones por tipo de análisis
  const getNotificationsByType = (analysisType: string) => {
    return notifications.filter(n => n.analysisType === analysisType);
  };

  // Limpiar notificaciones antiguas (más de 24 horas)
  const clearOldNotifications = () => {
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);
    
    setNotifications(prev => prev.filter(n => n.timestamp > oneDayAgo));
  };

  return {
    notifyAnalysisStarted,
    notifyAnalysisProgress,
    notifyAnalysisCompleted,
    notifyAnalysisError,
    getNotifications,
    getActiveNotifications,
    getNotificationsByType,
    clearOldNotifications
  };
}