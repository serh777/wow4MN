'use client';

import React from 'react';
import { ToolLayout, InputForm } from '@/app/dashboard/results/content/components/tool-components';
import { useMetadataAnalysis } from '@/hooks/use-metadata-analysis';
import { useContract } from '@/hooks/use-contract';
import { useToast } from '@/components/ui/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, AlertCircle, CheckCircle2, Search, Star, Check, BarChart, Info } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { DataSourcesInfo } from '@/components/tooltips';

export default function MetadataToolPage() {
  const { toast } = useToast();
  const { emitToolAction } = useContract();
  const router = useRouter();
  const {
    isAnalyzing,
    analysisResult,
    error,
    analyzeMetadata,
    resetAnalysis
  } = useMetadataAnalysis();

  const [formData, setFormData] = React.useState({
    contractAddress: '',
    blockchain: '',
    projectType: ''
  });

  const handleSubmit = async (data: any) => {
    try {
      setFormData(data);
      
      // Emitir acción de herramienta
      await emitToolAction(
        'metadata_analysis',
        'ANALYSIS',
        data.contractAddress || '0x1234...abcd',
        JSON.stringify({
          timestamp: new Date().toISOString(),
          type: 'metadata_analysis',
          blockchain: data.blockchain,
          projectType: data.projectType
        })
      );
      
      // Iniciar análisis
      await analyzeMetadata(data);
      
      // La notificación de éxito se maneja automáticamente en el hook
      
    } catch (error) {
      console.error('Error en análisis:', error);
      toast({
        title: "Error",
        description: "Hubo un problema al realizar el análisis. Inténtalo de nuevo.",
        variant: "destructive"
      });
    }
  };

  const handlePaymentSuccess = () => {
    // Lógica adicional después del pago si es necesario
  };

  const formFields = [
    {
      name: 'contractAddress',
      label: 'Dirección del Contrato',
      type: 'text' as const,
      placeholder: '0x...',
      required: true
    },
    {
      name: 'blockchain',
      label: 'Blockchain',
      type: 'select' as const,
      required: true,
      options: [
        { value: 'ethereum', label: 'Ethereum' },
        { value: 'polygon', label: 'Polygon' },
        { value: 'bsc', label: 'BSC' },
        { value: 'arbitrum', label: 'Arbitrum' }
      ]
    },
    {
      name: 'projectType',
      label: 'Tipo de Proyecto',
      type: 'select' as const,
      required: true,
      options: [
        { value: 'token', label: 'Token ERC-20' },
        { value: 'nft', label: 'NFT Collection' },
        { value: 'defi', label: 'DeFi Protocol' },
        { value: 'dao', label: 'DAO' },
        { value: 'other', label: 'Otro' }
      ]
    }
  ];

  return (
    <ToolLayout
      title="Análisis de Metadatos Web3"
      description="Optimiza los metadatos de tus contratos inteligentes, NFTs y proyectos Web3 para mejorar su visibilidad y SEO."
      icon="metadata"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Tool Description */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <Search className="h-5 w-5 mr-2" />
                  ¿Qué analiza esta herramienta?
                </div>
                <DataSourcesInfo 
                  toolId="metadata" 
                  variant="compact"
                />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-medium">Metadatos de Contratos</h4>
                    <p className="text-sm text-muted-foreground">Analiza la estructura y calidad de los metadatos en tus contratos inteligentes.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-medium">Metadatos de NFTs</h4>
                    <p className="text-sm text-muted-foreground">Evalúa la completitud y optimización de metadatos de tokens no fungibles.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-medium">SEO Web3</h4>
                    <p className="text-sm text-muted-foreground">Optimización para motores de búsqueda especializados en blockchain.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-medium">Estándares de Metadatos</h4>
                    <p className="text-sm text-muted-foreground">Verificación de cumplimiento con estándares como ERC-721, ERC-1155.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Star className="h-5 w-5 mr-2" />
                Características principales
              </CardTitle>
              <CardDescription>
                <DataSourcesInfo 
                  toolId="metadata" 
                  variant="detailed"
                  showStats={true}
                />
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  Análisis completo de metadatos
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  Recomendaciones de optimización
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  Verificación de estándares
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  Puntuación de calidad
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Input Form and Results */}
        <div className="space-y-6">
          <InputForm 
            fields={formFields}
            onSubmit={handleSubmit} 
            isLoading={isAnalyzing}
            submitText="Analizar Metadata"
            loadingText="Analizando metadata..."
          />

          {/* Error Display */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {error}
              </AlertDescription>
            </Alert>
          )}

          {/* Estado de Carga */}
          {isAnalyzing && (
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                  <span>Analizando metadatos... Se redirigirá automáticamente a los resultados.</span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Mostrar mensaje de éxito y redirección */}
          {analysisResult && (
            <Card className="bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800">
              <CardContent className="pt-6 text-center">
                <div className="text-green-600 text-6xl mb-4">✅</div>
                <h3 className="text-xl font-semibold text-green-800 mb-2">
                  ¡Análisis de Metadatos Completado!
                </h3>
                <p className="text-green-700 mb-4">
                  Tu análisis de metadatos ha sido procesado exitosamente. 
                  Serás redirigido a la página de resultados en unos segundos.
                </p>
                <div className="text-sm text-green-600">
                  Si no eres redirigido automáticamente, 
                  <a 
                    href={`/dashboard/results/metadata?address=${formData.contractAddress}&blockchain=${formData.blockchain}`}
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
      </div>
    </ToolLayout>
  );
}