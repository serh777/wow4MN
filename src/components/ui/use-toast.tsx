// Adapted from https://ui.shadcn.com/docs/components/toast
'use client';

import * as React from 'react';
import { useState, useEffect, createContext, useContext } from 'react';

export type ToastProps = {
  id?: string;
  title?: string;
  description?: string;
  action?: React.ReactNode;
  variant?: 'default' | 'destructive';
};

type ToastActionElement = React.ReactElement<unknown, string>;

type ToastContextType = {
  toasts: ToastProps[];
  toast: (props: ToastProps) => string;
  dismiss: (id: string) => void;
};

const ToastContext = createContext<ToastContextType | null>(null);

export const TOAST_LIMIT = 5;
export const TOAST_REMOVE_DELAY = 3000;

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }

  return context;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  const toast = (props: ToastProps) => {
    const id = props.id || String(Date.now());
    const newToast = { ...props, id };

    setToasts((prevToasts) => {
      // Limit the number of toasts
      if (prevToasts.length >= TOAST_LIMIT) {
        const [, ...restToasts] = prevToasts;
        return [...restToasts, newToast];
      }
      return [...prevToasts, newToast];
    });

    // Auto dismiss after delay
    setTimeout(() => {
      dismiss(id);
    }, TOAST_REMOVE_DELAY);

    return id;
  };

  const dismiss = (id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toasts, toast, dismiss }}>
      {children}
    </ToastContext.Provider>
  );
}
