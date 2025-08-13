'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';

// Componente IconWrapper
const IconWrapper = ({ icon, className }: { icon: keyof typeof Icons, className?: string }) => {
  const Icon = Icons[icon] || Icons.settings;
  return <Icon className={className} />;
};

interface LoadingStateProps {
  url: string;
  onBackToHome: () => void;
}

export default function LoadingState({ url, onBackToHome }: LoadingStateProps) {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    "Conectando con el contrato inteligente...",
    "Extrayendo metadatos del contrato...",
    "Analizando estructura de datos...",
    "Evaluando tokens y NFTs...",
    "Calculando métricas SEO...",
    "Generando recomendaciones..."
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + 2;
        
        // Actualizar el paso actual basado en el progreso
        const stepIndex = Math.floor((newProgress / 100) * steps.length);
        setCurrentStep(Math.min(stepIndex, steps.length - 1));
        
        if (newProgress >= 100) {
          clearInterval(timer);
          return 100;
        }
        return newProgress;
      });
    }, 100);

    return () => clearInterval(timer);
  }, [steps.length]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
            <IconWrapper icon="metadata" className="h-8 w-8 text-primary animate-pulse" />
          </div>
          <CardTitle className="text-xl">Analizando Metadatos</CardTitle>
          <CardDescription className="text-sm">
            Evaluando {url}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progreso</span>
              <span className="font-medium">{progress}%</span>
            </div>
            <Progress value={progress} className="w-full h-2" />
          </div>
          
          <div className="space-y-3">
            <div className="text-sm font-medium text-center">
              {steps[currentStep]}
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
                <div className={`w-2 h-2 rounded-full ${
                  progress > 20 ? 'bg-green-500' : 'bg-gray-300'
                }`} />
                <span>Conexión</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
                <div className={`w-2 h-2 rounded-full ${
                  progress > 40 ? 'bg-green-500' : 'bg-gray-300'
                }`} />
                <span>Extracción</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
                <div className={`w-2 h-2 rounded-full ${
                  progress > 60 ? 'bg-green-500' : 'bg-gray-300'
                }`} />
                <span>Análisis</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
                <div className={`w-2 h-2 rounded-full ${
                  progress > 80 ? 'bg-green-500' : 'bg-gray-300'
                }`} />
                <span>Optimización</span>
              </div>
            </div>
          </div>
          
          <Button variant="outline" onClick={onBackToHome} className="w-full">
            <IconWrapper icon="home" className="mr-2 h-4 w-4" />
            Volver al Dashboard
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}