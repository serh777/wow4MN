'use client';

import React, { useState } from 'react';
import { ToolLayout } from '@/app/dashboard/results/content/components/tool-components';
import { InputForm } from './components/InputForm';
import { useAIAnalysis } from './components/use-ai-analysis';
import { ComplexTaskManager } from './components/complex-task-manager';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Brain, Bot, Zap } from 'lucide-react';
import { BlockchainNavigator } from './components/blockchain-navigator';

interface FormData {
  url: string;
  analysisType: string;
  network: string;
  contractAddress: string;
  includeMetadata: boolean;
  includeEvents: boolean;
  includeTransactions: boolean;
  selectedIndexer: string;
  prompt: string;
}

export default function AIAssistantPage() {
  const [activeTab, setActiveTab] = useState('traditional');
  const [navigator] = useState(() => new BlockchainNavigator());
  
  const {
    isLoading,
    results,
    indexerResults,
    progress,
    currentStep,
    error,
    handleSubmit,
    resetAnalysis,
    progressMessage,
    analysisPhase
  } = useAIAnalysis();

  const onSubmit = (data: FormData) => {
    handleSubmit({
      url: data.url,
      analysisType: data.analysisType,
      network: data.network,
      contractAddress: data.contractAddress,
      includeMetadata: data.includeMetadata,
      includeEvents: data.includeEvents,
      includeTransactions: data.includeTransactions,
      selectedIndexer: data.selectedIndexer,
      prompt: data.prompt
    });
  };

  const onReset = () => {
    resetAnalysis();
  };

  const hasResults = results !== null || indexerResults !== null;

  // Parámetros para el ComplexTaskManager
  const taskParams = {
    url: 'wowseoweb3.com',
    analysisType: 'comprehensive',
    network: 'ethereum',
    contractAddress: '',
    includeMetadata: true,
    includeEvents: true,
    includeTransactions: true,
    selectedIndexer: 'alchemy',
    prompt: 'Análisis completo de Web3 SEO'
  };

  return (
    <ToolLayout
      title="Asistente IA Web3"
      description="Herramienta avanzada de análisis con inteligencia artificial y agentes autónomos para proyectos Web3"
      icon="🤖"
    >
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="traditional" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            Análisis Tradicional
          </TabsTrigger>
          <TabsTrigger value="complex" className="flex items-center gap-2">
            <Bot className="h-4 w-4" />
            Agentes IA Autónomos
          </TabsTrigger>
        </TabsList>

        <TabsContent value="traditional" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                Análisis IA Tradicional
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Formulario de Entrada */}
                <InputForm 
                  onSubmit={onSubmit}
                  loading={isLoading}
                  onReset={onReset}
                />

                {/* Estado de Carga */}
                {isLoading && (
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-center space-x-2">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                        <span>Analizando... Se redirigirá automáticamente a los resultados.</span>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Error */}
                {error && !isLoading && (
                  <Card>
                    <CardContent className="p-6">
                      <div className="text-center text-red-600">
                        <p>Error en el análisis: {error}</p>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Mostrar mensaje de éxito y redirección */}
                {hasResults && (
                  <Card className="bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800">
                    <CardContent className="pt-6 text-center">
                      <div className="text-green-600 text-6xl mb-4">✅</div>
                      <h3 className="text-xl font-semibold text-green-800 mb-2">
                        ¡Análisis Completado!
                      </h3>
                      <p className="text-green-700 mb-4">
                        Tu análisis ha sido procesado exitosamente. 
                        Serás redirigido a la página de resultados en unos segundos.
                      </p>
                      <div className="text-sm text-green-600">
                        Si no eres redirigido automáticamente, 
                        <a 
                          href={`/dashboard/results/ai-assistant?type=ai-assistant&url=${encodeURIComponent('wowseoweb3.com')}`}
                          className="underline font-medium hover:text-green-800"
                        >
                          haz clic aquí
                        </a>
                        .
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="complex" className="space-y-6">
          <ComplexTaskManager 
            params={taskParams}
            navigator={navigator}
            onTaskComplete={(taskId, result) => {
              console.log('Task completed:', taskId, result);
            }}
          />
        </TabsContent>
      </Tabs>
    </ToolLayout>
  );
}