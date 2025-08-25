'use client';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

interface ErrorStateProps {
  onBackToHome: () => void;
}

export default function ErrorState({ onBackToHome }: ErrorStateProps) {
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Error al cargar resultados
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          No se pudieron cargar los resultados del análisis de contenido.
        </p>
        <Button onClick={onBackToHome} className="bg-blue-600 hover:bg-blue-700 text-white">
          Volver al análisis de contenido
        </Button>
      </div>
    </div>
  );
}