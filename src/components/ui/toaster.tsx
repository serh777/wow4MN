'use client';

import {
  useToast,
  ToastProvider,
} from '@/components/ui/use-toast';
import { Toast } from '@/components/ui/toast';

export function Toaster() {
  const { toasts, dismiss } = useToast();

  return (
    <div className="fixed top-0 z-[100] flex flex-col items-end gap-2 p-4 max-h-screen w-full overflow-hidden">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          title={toast.title}
          description={toast.description}
          variant={toast.variant}
          action={toast.action}
          onClick={() => dismiss(toast.id!)}
          className="animate-in fade-in slide-in-from-top-full duration-300"
        />
      ))}
    </div>
  );
}

export { ToastProvider };