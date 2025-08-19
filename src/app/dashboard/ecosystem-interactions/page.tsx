'use client';

'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { IconWrapper } from '@/components/ui/icon-wrapper';
import { useRouter } from 'next/navigation';
import { 
  Network, 
  GitBranch, 
  Users, 
  CheckCircle, 
  AlertTriangle,
  BarChart3,
  Zap,
  Activity,
  Target,
  Globe,
  Link,
  Layers,
  TrendingUp,
  Eye
} from 'lucide-react';

export default function EcosystemInteractionsPage() {
  const router = useRouter();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [formData, setFormData] = useState({
    address: '',
    includeNetworks: ['ethereum', 'polygon', 'bsc', 'arbitrum', 'optimism'],
    includeProtocols: true,
    includeCrossChain: true,
    includeRiskAnalysis: true,
    timeframe: 'month'
  });

  const handleInputChange = (field: string, value: string | boolean | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    
    try {
      // Validar que la dirección esté presente
      if (!formData.address) {
        throw new Error('Dirección requerida para el análisis');
      }

      // Simular análisis real (en producción usaría EcosystemInteractionsAPIsService)
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      setIsAnalyzing(false);
      setAnalysisComplete(true);
      
      // Guardar datos del análisis para la página de resultados
      const analysisData = {
        address: formData.address,
        includeNetworks: formData.includeNetworks,
        includeProtocols: formData.includeProtocols,
        includeCrossChain: formData.includeCrossChain,
        includeRiskAnalysis: formData.includeRiskAnalysis,
        timeframe: formData.timeframe,
        timestamp: new Date().toISOString()
      };
      
      sessionStorage.setItem('ecosystemInteractionsAnalysis', JSON.stringify(analysisData));
      
      // Mostrar mensaje de éxito y redirigir
      setTimeout(() => {
        const params = new URLSearchParams({
          address: formData.address,
          networks: formData.includeNetworks.join(','),
          timeframe: formData.timeframe
        });
        router.push(`/dashboard/ecosystem-interactions/analysis-results?${params.toString()}`);
      }, 2000);
      
    } catch (error) {
      console.error('Error en análisis:', error);
      setIsAnalyzing(false);
      // Aquí podrías mostrar un mensaje de error al usuario
    }
  };

  const networkOptions = [
    { value: 'ethereum', label: 'Ethereum', description: 'Red principal' },
    { value: 'polygon', label: 'Polygon', description: 'Layer 2 escalable' },
    { value: 'bsc', label: 'BSC', description: 'Binance Smart Chain' },
    { value: 'arbitrum', label: 'Arbitrum', description: 'Layer 2 optimista' },
    { value: 'optimism', label: 'Optimism', description: 'Layer 2 optimista' },
    { value: 'avalanche', label: 'Avalanche', description: 'Red de alta velocidad' }
  ];

  const timeframes = [
    { value: 'week', label: '1 semana' },
    { value: 'month', label: '1 mes' },
    { value: 'quarter', label: '3 meses' },
    { value: 'year', label: '1 año' }
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="ecosystem-header-icon">
          <Network className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="ecosystem-header-title">
            Analizador de Interacciones en Ecosistemas
          </h1>
          <p className="text-muted-foreground">
            Evalúa impacto de interacciones en visibilidad y autoridad del contenido
          </p>
        </div>
      </div>

      {/* Alert de análisis completo */}
      {analysisComplete && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            ✅ Análisis de interacciones completado exitosamente. Redirigiendo a resultados...
          </AlertDescription>
        </Alert>
      )}

      {/* Formulario de análisis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-indigo-500" />
            Configuración de Análisis de Interacciones
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="basic" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="basic">Análisis Básico</TabsTrigger>
              <TabsTrigger value="advanced">Configuración Avanzada</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="address">Dirección de Wallet o Contrato</Label>
                  <Input
                    id="address"
                    placeholder="0x... o nombre.eth"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Ingresa una dirección Ethereum o dominio ENS
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timeframe">Período de Análisis</Label>
                  <Select value={formData.timeframe} onValueChange={(value) => handleInputChange('timeframe', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {timeframes.map((timeframe) => (
                        <SelectItem key={timeframe.value} value={timeframe.value}>
                          {timeframe.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3 md:col-span-2">
                  <Label>Redes a Incluir</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {networkOptions.map((network) => (
                      <div key={network.value} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={network.value}
                          checked={formData.includeNetworks.includes(network.value)}
                          onChange={(e) => {
                            const newNetworks = e.target.checked
                              ? [...formData.includeNetworks, network.value]
                              : formData.includeNetworks.filter(n => n !== network.value);
                            handleInputChange('includeNetworks', newNetworks);
                          }}
                          className="rounded border-gray-300"
                        />
                        <label htmlFor={network.value} className="text-sm">
                          <div>
                            <span className="font-medium">{network.label}</span>
                            <p className="text-xs text-muted-foreground">{network.description}</p>
                          </div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="advanced" className="space-y-6">
              <div className="space-y-6">
                <div className="space-y-4">
                  <Label>Opciones de Análisis</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="includeProtocols"
                        checked={formData.includeProtocols}
                        onChange={(e) => handleInputChange('includeProtocols', e.target.checked)}
                        className="rounded border-gray-300"
                      />
                      <label htmlFor="includeProtocols" className="text-sm">
                        <div>
                          <span className="font-medium">Análisis de Protocolos</span>
                          <p className="text-xs text-muted-foreground">Incluir interacciones con protocolos DeFi</p>
                        </div>
                      </label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="includeCrossChain"
                        checked={formData.includeCrossChain}
                        onChange={(e) => handleInputChange('includeCrossChain', e.target.checked)}
                        className="rounded border-gray-300"
                      />
                      <label htmlFor="includeCrossChain" className="text-sm">
                        <div>
                          <span className="font-medium">Análisis Cross-Chain</span>
                          <p className="text-xs text-muted-foreground">Incluir bridges y transferencias entre redes</p>
                        </div>
                      </label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="includeRiskAnalysis"
                        checked={formData.includeRiskAnalysis}
                        onChange={(e) => handleInputChange('includeRiskAnalysis', e.target.checked)}
                        className="rounded border-gray-300"
                      />
                      <label htmlFor="includeRiskAnalysis" className="text-sm">
                        <div>
                          <span className="font-medium">Análisis de Riesgo</span>
                          <p className="text-xs text-muted-foreground">Evaluar factores de riesgo del ecosistema</p>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {timeframes.map((timeframe) => (
                        <SelectItem key={timeframe.value} value={timeframe.value}>
                          {timeframe.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="advanced" className="space-y-6">
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="analysisDepth">Profundidad de Análisis</Label>
                  <Select value={formData.analysisDepth} onValueChange={(value) => handleInputChange('analysisDepth', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {analysisDepths.map((depth) => (
                        <SelectItem key={depth.value} value={depth.value}>
                          <div className="flex flex-col">
                            <span>{depth.label}</span>
                            <span className="text-xs text-muted-foreground">{depth.description}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4">
                  <Label>Tipos de Interacciones a Analizar</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="includeTransactions"
                        title="Incluir análisis de transacciones on-chain"
                        checked={formData.includeTransactions}
                        onChange={(e) => handleInputChange('includeTransactions', e.target.checked)}
                        className="ecosystem-checkbox"
                      />
                      <Label htmlFor="includeTransactions" className="text-sm">
                        Transacciones On-Chain
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="includeProtocols"
                        title="Incluir análisis de interacciones con protocolos"
                        checked={formData.includeProtocols}
                        onChange={(e) => handleInputChange('includeProtocols', e.target.checked)}
                        className="ecosystem-checkbox"
                      />
                      <Label htmlFor="includeProtocols" className="text-sm">
                        Interacciones con Protocolos
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="includeSocial"
                        title="Incluir análisis de actividad social"
                        checked={formData.includeSocial}
                        onChange={(e) => handleInputChange('includeSocial', e.target.checked)}
                        className="ecosystem-checkbox"
                      />
                      <Label htmlFor="includeSocial" className="text-sm">
                        Actividad Social
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="includeGovernance"
                        title="Incluir análisis de participación en gobernanza"
                        checked={formData.includeGovernance}
                        onChange={(e) => handleInputChange('includeGovernance', e.target.checked)}
                        className="ecosystem-checkbox"
                      />
                      <Label htmlFor="includeGovernance" className="text-sm">
                        Participación en Gobernanza
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="includeNFTs"
                        title="Incluir análisis de trading de NFTs"
                        checked={formData.includeNFTs}
                        onChange={(e) => handleInputChange('includeNFTs', e.target.checked)}
                        className="ecosystem-checkbox"
                      />
                      <Label htmlFor="includeNFTs" className="text-sm">
                        Trading de NFTs
                      </Label>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-center mt-8">
            <Button 
              onClick={handleAnalyze}
              disabled={isAnalyzing || !formData.address || formData.includeNetworks.length === 0}
              className="ecosystem-analyze-button"
            >
              {isAnalyzing ? (
                <>
                  <Activity className="mr-2 h-5 w-5 animate-spin" />
                  Analizando Interacciones del Ecosistema...
                </>
              ) : (
                <>
                  <Network className="mr-2 h-5 w-5" />
                  Analizar Interacciones del Ecosistema
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Información sobre análisis */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <GitBranch className="h-5 w-5 text-blue-500" />
              Análisis de Red
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Mapea conexiones entre wallets, protocolos y contratos para identificar patrones de interacción.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Badge variant="secondary">Conexiones</Badge>
              <Badge variant="secondary">Centralidad</Badge>
              <Badge variant="secondary">Clusters</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <TrendingUp className="h-5 w-5 text-green-500" />
              Impacto en Visibilidad
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Evalúa cómo las interacciones afectan la visibilidad y autoridad del contenido en el ecosistema.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Badge variant="secondary">Alcance</Badge>
              <Badge variant="secondary">Influencia</Badge>
              <Badge variant="secondary">Autoridad</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Layers className="h-5 w-5 text-purple-500" />
              Análisis Multi-Protocolo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Analiza interacciones across múltiples protocolos y ecosistemas para una vista holística.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Badge variant="secondary">Cross-Chain</Badge>
              <Badge variant="secondary">Multi-DeFi</Badge>
              <Badge variant="secondary">Composabilidad</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

