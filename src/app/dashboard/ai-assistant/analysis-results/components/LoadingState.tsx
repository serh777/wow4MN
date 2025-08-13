'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useRouter } from 'next/navigation';

interface LoadingStateProps {
  url: string;
  indexerConnecting: boolean;
  indexerProgress: number;
  onBackToHome: () => void;
}

export default function LoadingState({ url, indexerConnecting, indexerProgress, onBackToHome }: LoadingStateProps) {
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Analizando {url}
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            {indexerConnecting ? 'Conectando con indexador blockchain...' : 'Procesando datos Web3...'}
          </p>
          
          <div className="w-full max-w-md mx-auto mb-4">
            <Progress 
              value={indexerProgress} 
              className="h-3"
            />
            <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mt-2">
              <span>Progreso del indexador</span>
              <span>{indexerProgress}%</span>
            </div>
          </div>
          
          <div className="flex items-center justify-center space-x-2 mb-6">
            <div className={`w-3 h-3 rounded-full ${
              indexerConnecting ? 'bg-yellow-500' : 'bg-green-500'
            } animate-pulse`}></div>
            <span className="text-sm text-gray-600 dark:text-gray-300">
              {indexerConnecting ? 'Conectando...' : 'Conectado'}
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center">
          <Button onClick={onBackToHome} className="bg-blue-600 hover:bg-blue-700 text-white">
            Volver al asistente
          </Button>
        </div>
      </div>
    </div>
  );
}