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
  Gem, 
  TrendingUp, 
  Eye, 
  CheckCircle, 
  AlertTriangle,
  BarChart3,
  DollarSign,
  Activity,
  Target,
  Image,
  Palette,
  Crown,
  Star,
  Users
} from 'lucide-react';

export default function NFTTrackingPage() {
  const router = useRouter();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [formData, setFormData] = useState({
    nftAddress: '',
    tokenId: '',
    collectionAddress: '',
    trackingType: 'comprehensive',
    blockchain: 'ethereum',
    includePrice: true,
    includeRarity: true,
    includeHistory: true,
    includeMarketplace: true,
    timeframe: '30d'
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
      router.push('/dashboard/nft-tracking/analysis-results');
    }, 2000);
  };

  const trackingTypes = [
    { value: 'comprehensive', label: 'Análisis Comprensivo', description: 'Análisis completo del NFT' },
    { value: 'price', label: 'Seguimiento de Precio', description: 'Enfoque en precio y valoración' },
    { value: 'rarity', label: 'Análisis de Rareza', description: 'Evaluación de rareza y traits' },
    { value: 'market', label: 'Análisis de Mercado', description: 'Tendencias de mercado y volumen' },
    { value: 'collection', label: 'Análisis de Colección', description: 'Métricas de toda la colección' }
  ];

  const blockchains = [
    { value: 'ethereum', label: 'Ethereum' },
    { value: 'polygon', label: 'Polygon' },
    { value: 'binance', label: 'Binance Smart Chain' },
    { value: 'solana', label: 'Solana' },
    { value: 'avalanche', label: 'Avalanche' },
    { value: 'arbitrum', label: 'Arbitrum' }
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
        <div className="p-2 bg-gradient-to-r from-pink-500 to-rose-500 rounded-lg">
          <Gem className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
            Herramientas de Seguimiento de NFTs
          </h1>
          <p className="text-muted-foreground">
            Analiza y optimiza NFTs para visibilidad en mercados descentralizados
          </p>
        </div>
      </div>

      {/* Alert de análisis completo */}
      {analysisComplete && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            ✅ Análisis de NFT completado exitosamente. Redirigiendo a resultados...
          </AlertDescription>
        </Alert>
      )}

      {/* Formulario de análisis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-pink-500" />
            Configuración de Análisis NFT
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
                  <Label htmlFor="nftAddress">Dirección del NFT</Label>
                  <Input
                    id="nftAddress"
                    placeholder="0x..."
                    value={formData.nftAddress}
                    onChange={(e) => handleInputChange('nftAddress', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tokenId">Token ID</Label>
                  <Input
                    id="tokenId"
                    placeholder="123456"
                    value={formData.tokenId}
                    onChange={(e) => handleInputChange('tokenId', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="collectionAddress">Dirección de Colección (Opcional)</Label>
                  <Input
                    id="collectionAddress"
                    placeholder="0x..."
                    value={formData.collectionAddress}
                    onChange={(e) => handleInputChange('collectionAddress', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="blockchain">Blockchain</Label>
                  <Select value={formData.blockchain} onValueChange={(value) => handleInputChange('blockchain', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {blockchains.map((blockchain) => (
                        <SelectItem key={blockchain.value} value={blockchain.value}>
                          {blockchain.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="advanced" className="space-y-6">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="trackingType">Tipo de Análisis</Label>
                    <Select value={formData.trackingType} onValueChange={(value) => handleInputChange('trackingType', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {trackingTypes.map((type) => (
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

                <div className="space-y-4">
                  <Label>Métricas a Incluir</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="includePrice"
                        title="Incluir análisis de precio del NFT"
                        checked={formData.includePrice}
                        onChange={(e) => handleInputChange('includePrice', e.target.checked)}
                        className="rounded border-gray-300"
                      />
                      <Label htmlFor="includePrice" className="text-sm">
                        Análisis de Precio
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="includeRarity"
                        title="Incluir análisis de rareza del NFT"
                        checked={formData.includeRarity}
                        onChange={(e) => handleInputChange('includeRarity', e.target.checked)}
                        className="rounded border-gray-300"
                      />
                      <Label htmlFor="includeRarity" className="text-sm">
                        Análisis de Rareza
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="includeHistory"
                        title="Incluir historial de transacciones del NFT"
                        checked={formData.includeHistory}
                        onChange={(e) => handleInputChange('includeHistory', e.target.checked)}
                        className="rounded border-gray-300"
                      />
                      <Label htmlFor="includeHistory" className="text-sm">
                        Historial de Transacciones
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="includeMarketplace"
                        title="Incluir análisis de marketplace del NFT"
                        checked={formData.includeMarketplace}
                        onChange={(e) => handleInputChange('includeMarketplace', e.target.checked)}
                        className="rounded border-gray-300"
                      />
                      <Label htmlFor="includeMarketplace" className="text-sm">
                        Análisis de Marketplace
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
              disabled={isAnalyzing || !formData.nftAddress || !formData.tokenId}
              className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white px-8 py-3 text-lg"
            >
              {isAnalyzing ? (
                <>
                  <Activity className="mr-2 h-5 w-5 animate-spin" />
                  Analizando NFT...
                </>
              ) : (
                <>
                  <Gem className="mr-2 h-5 w-5" />
                  Analizar NFT
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
              <DollarSign className="h-5 w-5 text-green-500" />
              Análisis de Precio
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Rastrea precios históricos, tendencias de mercado y valoraciones para optimizar estrategias de venta.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Badge variant="secondary">Precio Floor</Badge>
              <Badge variant="secondary">Volumen</Badge>
              <Badge variant="secondary">Tendencias</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Star className="h-5 w-5 text-yellow-500" />
              Análisis de Rareza
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Evalúa la rareza basada en traits, atributos y posición dentro de la colección para determinar valor.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Badge variant="secondary">Traits</Badge>
              <Badge variant="secondary">Ranking</Badge>
              <Badge variant="secondary">Percentil</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <BarChart3 className="h-5 w-5 text-blue-500" />
              Análisis de Mercado
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Analiza tendencias de mercado, volumen de trading y comportamiento de compradores en diferentes plataformas.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Badge variant="secondary">OpenSea</Badge>
              <Badge variant="secondary">LooksRare</Badge>
              <Badge variant="secondary">X2Y2</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

