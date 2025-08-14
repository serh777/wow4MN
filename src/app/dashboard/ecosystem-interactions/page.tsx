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
    walletAddress: '',
    protocolAddress: '',
    ecosystemType: 'defi',
    analysisDepth: 'comprehensive',
    timeframe: '30d',
    includeTransactions: true,
    includeProtocols: true,
    includeSocial: true,
    includeGovernance: true,
    includeNFTs: false
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    
    // Simular análisis
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setIsAnalyzing(false);
    setAnalysisComplete(true);
    
    // Mostrar mensaje de éxito y redirigir
    setTimeout(() => {
      router.push('/dashboard/ecosystem-interactions/analysis-results');
    }, 2000);
  };

  const ecosystemTypes = [
    { value: 'defi', label: 'DeFi', description: 'Finanzas descentralizadas' },
    { value: 'nft', label: 'NFT', description: 'Tokens no fungibles' },
    { value: 'gaming', label: 'Gaming', description: 'Juegos blockchain' },
    { value: 'dao', label: 'DAO', description: 'Organizaciones autónomas' },
    { value: 'metaverse', label: 'Metaverso', description: 'Mundos virtuales' },
    { value: 'social', label: 'Social', description: 'Redes sociales Web3' },
    { value: 'infrastructure', label: 'Infraestructura', description: 'Protocolos base' },
    { value: 'comprehensive', label: 'Comprensivo', description: 'Todos los ecosistemas' }
  ];

  const analysisDepths = [
    { value: 'basic', label: 'Básico', description: 'Análisis superficial' },
    { value: 'intermediate', label: 'Intermedio', description: 'Análisis detallado' },
    { value: 'comprehensive', label: 'Comprensivo', description: 'Análisis profundo' },
    { value: 'expert', label: 'Experto', description: 'Análisis exhaustivo' }
  ];

  const timeframes = [
    { value: '7d', label: '7 días' },
    { value: '30d', label: '30 días' },
    { value: '90d', label: '90 días' },
    { value: '1y', label: '1 año' },
    { value: 'all', label: 'Todo el tiempo' }
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg">
          <Network className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
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
                  <Label htmlFor="walletAddress">Dirección de Wallet</Label>
                  <Input
                    id="walletAddress"
                    placeholder="0x..."
                    value={formData.walletAddress}
                    onChange={(e) => handleInputChange('walletAddress', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="protocolAddress">Dirección de Protocolo (Opcional)</Label>
                  <Input
                    id="protocolAddress"
                    placeholder="0x..."
                    value={formData.protocolAddress}
                    onChange={(e) => handleInputChange('protocolAddress', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ecosystemType">Tipo de Ecosistema</Label>
                  <Select value={formData.ecosystemType} onValueChange={(value) => handleInputChange('ecosystemType', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ecosystemTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          <div className="flex flex-col">
                            <span>{type.label}</span>
                            <span className="text-xs text-muted-foreground">{type.description}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                        checked={formData.includeTransactions}
                        onChange={(e) => handleInputChange('includeTransactions', e.target.checked)}
                        className="rounded border-gray-300"
                      />
                      <Label htmlFor="includeTransactions" className="text-sm">
                        Transacciones On-Chain
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="includeProtocols"
                        checked={formData.includeProtocols}
                        onChange={(e) => handleInputChange('includeProtocols', e.target.checked)}
                        className="rounded border-gray-300"
                      />
                      <Label htmlFor="includeProtocols" className="text-sm">
                        Interacciones con Protocolos
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="includeSocial"
                        checked={formData.includeSocial}
                        onChange={(e) => handleInputChange('includeSocial', e.target.checked)}
                        className="rounded border-gray-300"
                      />
                      <Label htmlFor="includeSocial" className="text-sm">
                        Actividad Social
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="includeGovernance"
                        checked={formData.includeGovernance}
                        onChange={(e) => handleInputChange('includeGovernance', e.target.checked)}
                        className="rounded border-gray-300"
                      />
                      <Label htmlFor="includeGovernance" className="text-sm">
                        Participación en Gobernanza
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="includeNFTs"
                        checked={formData.includeNFTs}
                        onChange={(e) => handleInputChange('includeNFTs', e.target.checked)}
                        className="rounded border-gray-300"
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
              disabled={isAnalyzing || !formData.walletAddress}
              className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white px-8 py-3 text-lg"
            >
              {isAnalyzing ? (
                <>
                  <Activity className="mr-2 h-5 w-5 animate-spin" />
                  Analizando Interacciones...
                </>
              ) : (
                <>
                  <Network className="mr-2 h-5 w-5" />
                  Analizar Ecosistema
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

