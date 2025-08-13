'use client';

import React from 'react';
import { useState, useEffect, createContext, useContext } from 'react';
import { Icons } from '@/components/icons';
// La implementación de useAnalysisNotifications se ha movido a use-analysis-notifications.ts
// Ya no necesitamos importarlo aquí, evitamos la referencia circular

type NotificationType = 'info' | 'success' | 'warning' | 'error';

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  duration?: number;
  read?: boolean;
  actionUrl?: string;
  timestamp: Date;
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void;
  removeNotification: (id: string) => void;
  notifyAnalysisStarted: (analysisType: string) => void;
  notifyAnalysisCompleted: (analysisType: string, score: number) => void;
  notifyAnalysisError: (analysisType: string, errorMessage: string) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearAll: () => void;
}

export const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [recentNotifications, setRecentNotifications] = useState<Set<string>>(new Set());

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp'>) => {
    // Crear una clave única para evitar duplicados
    const notificationKey = `${notification.type}-${notification.title}-${notification.message}`;
    
    // Verificar si ya existe una notificación similar reciente (últimos 2 segundos)
    if (recentNotifications.has(notificationKey)) {
      return; // No agregar notificación duplicada
    }
    
    // Agregar a notificaciones recientes
    setRecentNotifications(prev => new Set(prev).add(notificationKey));
    
    // Limpiar de notificaciones recientes después de 2 segundos
    setTimeout(() => {
      setRecentNotifications(prev => {
        const newSet = new Set(prev);
        newSet.delete(notificationKey);
        return newSet;
      });
    }, 2000);
    
    const id = Math.random().toString(36).substring(2, 9);
    setNotifications((prev) => [
      ...prev,
      { 
        ...notification, 
        id,
        timestamp: new Date(),
        read: false
      }
    ]);
    
    if (notification.duration !== 0) {
      setTimeout(() => {
        removeNotification(id);
      }, notification.duration || 5000);
    }
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id));
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, read: true }))
    );
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const notifyAnalysisStarted = (analysisType: string) => {
    addNotification({
      type: 'info',
      title: 'Análisis iniciado',
      message: `El ${analysisType} ha comenzado. Esto puede tomar unos momentos.`,
      duration: 3000,
    });
  };

  const notifyAnalysisCompleted = (analysisType: string, score: number) => {
    addNotification({
      type: 'success',
      title: 'Análisis completado',
      message: `El ${analysisType} ha finalizado con una puntuación de ${score}/100.`,
      duration: 5000,
    });
  };

  const notifyAnalysisError = (analysisType: string, errorMessage: string) => {
    addNotification({
      type: 'error',
      title: 'Error en el análisis',
      message: `Error en ${analysisType}: ${errorMessage}`,
      duration: 7000,
    });
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        removeNotification,
        notifyAnalysisStarted,
        notifyAnalysisCompleted,
        notifyAnalysisError,
        markAsRead,
        markAllAsRead,
        clearAll,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = React.useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}

export function NotificationIcon({ type }: { type: NotificationType }) {
  switch (type) {
    case 'success':
      return (
        <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-500">
          <Icons.success className="h-4 w-4" />
        </div>
      );
    case 'error':
      return (
        <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center text-red-500">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6 6 18"/>
            <path d="m6 6 12 12"/>
          </svg>
        </div>
      );
    case 'warning':
      return (
        <div className="h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-500">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 9v4"/>
            <path d="M12 17h.01"/>
            <path d="m9 3 2 2h2l2-2 5 5v3l-2 2v3l2 2v3l-5 5h-3l-2-2h-3l-2 2H5l-5-5v-3l2-2v-3l-2-2V8l5-5Z"/>
          </svg>
        </div>
      );
    case 'info':
    default:
      return (
        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-500">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 16v-4"/>
            <path d="M12 8h.01"/>
          </svg>
        </div>
      );
  }
}

export function NotificationItem({ notification, onClose }: { notification: Notification; onClose: () => void }) {
  return (
    <div className={`rounded-lg border p-4 mb-2 ${notification.read ? 'bg-background' : 'bg-card'}`}>
      <div className="flex items-start gap-3">
        <NotificationIcon type={notification.type} />
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <h4 className="font-medium">{notification.title}</h4>
            <button
              type="button"
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground"
              aria-label="Cerrar notificación"
            >
              <Icons.close className="h-4 w-4" />
            </button>
          </div>
          <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-muted-foreground">
              {notification.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
            {notification.actionUrl && (
              <a
                href={notification.actionUrl}
                className="text-xs text-primary hover:underline"
              >
                Ver detalles
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function NotificationCenter() {
  const [isOpen, setIsOpen] = React.useState(false);
  const { notifications, removeNotification, markAsRead, markAllAsRead, clearAll } = useNotifications();
  
  const unreadCount = notifications.filter((n) => !n.read).length;
  
  return (
    <div className="relative">
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen && unreadCount > 0) {
            markAllAsRead();
          }
        }}
        className="relative p-2 rounded-full hover:bg-primary/10"
      >
        <Icons.bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-primary text-[10px] font-medium text-primary-foreground flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 rounded-lg border bg-background shadow-lg z-50">
          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Notificaciones</h3>
              <button
                onClick={clearAll}
                className="text-xs text-primary hover:underline"
              >
                Limpiar todo
              </button>
            </div>
          </div>
          
          <div className="max-h-[400px] overflow-y-auto p-4">
            {notifications.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No hay notificaciones
              </p>
            ) : (
              notifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onClose={() => {
                    removeNotification(notification.id);
                    markAsRead(notification.id);
                  }}
                />
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Add the SaveAnalysisButton component
interface SaveAnalysisButtonProps {
  analysisData: any;
}

export function SaveAnalysisButton({ analysisData }: SaveAnalysisButtonProps) {
  const { addNotification } = useNotifications();
  
  const handleSave = () => {
    // In a real implementation, this would save the analysis to a database or local storage
    console.log('Saving analysis data:', analysisData);
    
    // Show a notification
    addNotification({
      type: 'success',
      title: 'Análisis guardado',
      message: `El análisis ha sido guardado correctamente con una puntuación de ${analysisData.score}/100.`,
      duration: 5000,
    });
  };
  
  return (
    <button
      onClick={handleSave}
      className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
    >
      <Icons.save className="mr-2 h-4 w-4" />
      Guardar Análisis
    </button>
  );
}

// La función useAnalysisNotifications se ha movido a use-analysis-notifications.ts
// para evitar referencias circulares

// Re-exportar useAnalysisNotifications para compatibilidad
export { useAnalysisNotifications } from './use-analysis-notifications';

