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
  ShieldCheck, 
  FileText, 
  Image, 
  CheckCircle, 
  AlertTriangle,
  Fingerprint,
  Lock,
  Activity,
  Target,
  Hash,
  Scan,
  Eye,
  Clock,
  Database
} from 'lucide-react';

export default function ContentAuthenticityPage() {
  const router = useRouter();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [formData, setFormData] = useState({
    contentId: '',
    contentUrl: '',
    contentType: 'nft',
    includeBlockchain: true,
    includeIPFS: true,
    includeSignatures: true,
    blockchainNetwork: 'ethereum',
    contentHash: '',
    tokenId: ''
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    
    try {
      // Validar que al menos uno de los campos principales esté lleno
      if (!formData.contentId && !formData.contentUrl && !formData.contentHash) {
        throw new Error('Debe proporcionar al menos un identificador de contenido, URL o hash');
      }

      // Determinar el identificador principal para el análisis
      const contentId = formData.contentId || formData.contentUrl || formData.contentHash || 'default-content';
      
      // Simular análisis real (en producción usaría ContentAuthenticityAPIsService)
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      setIsAnalyzing(false);
      setAnalysisComplete(true);
      
      // Guardar datos del análisis para la página de resultados
      const analysisData = {
        contentId,
        contentUrl: formData.contentUrl,
        contentType: formData.contentType,
        includeBlockchain: formData.includeBlockchain,
        includeIPFS: formData.includeIPFS,
        includeSignatures: formData.includeSignatures,
        blockchainNetwork: formData.blockchainNetwork,
        timestamp: new Date().toISOString()
      };
      
      sessionStorage.setItem('contentAuthenticityAnalysis', JSON.stringify(analysisData));
      
      // Mostrar mensaje de éxito y redirigir
      setTimeout(() => {
        const params = new URLSearchParams({
          contentId,
          type: formData.contentType,
          network: formData.blockchainNetwork
        });
        router.push(`/dashboard/content-authenticity/analysis-results?${params.toString()}`);
      }, 2000);
      
    } catch (error) {
      console.error('Error en análisis:', error);
      setIsAnalyzing(false);
      // Aquí podrías mostrar un mensaje de error al usuario
    }
  };

  const contentTypes = [
    { value: 'nft', label: 'NFT', description: 'Token no fungible' },
    { value: 'digital_art', label: 'Arte Digital', description: 'Obras de arte digitales' },
    { value: 'document', label: 'Documento', description: 'Documentos digitales' },
    { value: 'media', label: 'Multimedia', description: 'Audio, video, imágenes' },
    { value: 'code', label: 'Código', description: 'Código fuente y smart contracts' },
    { value: 'data', label: 'Datos', description: 'Datasets y bases de datos' }
  ];

  const verificationMethods = [
    { value: 'blockchain', label: 'Blockchain', description: 'Verificación en cadena de bloques' },
    { value: 'hash', label: 'Hash Criptográfico', description: 'Verificación por hash' },
    { value: 'signature', label: 'Firma Digital', description: 'Verificación por firma digital' },
    { value: 'timestamp', label: 'Timestamp', description: 'Verificación temporal' },
    { value: 'ipfs', label: 'IPFS', description: 'Verificación en IPFS' },
    { value: 'comprehensive', label: 'Comprensivo', description: 'Todos los métodos disponibles' }
  ];

  const blockchainNetworks = [
    { value: 'ethereum', label: 'Ethereum' },
    { value: 'polygon', label: 'Polygon' },
    { value: 'binance', label: 'Binance Smart Chain' },
    { value: 'solana', label: 'Solana' },
    { value: 'avalanche', label: 'Avalanche' },
    { value: 'arbitrum', label: 'Arbitrum' }
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="content-auth-header-icon">
          <ShieldCheck className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="content-auth-header-title">
            Verificador de Autenticidad de Contenido
          </h1>
          <p className="text-muted-foreground">
            Verifica la autenticidad usando blockchain, almacenando hashes
          </p>
        </div>
      </div>

      {/* Alert de análisis completo */}
      {analysisComplete && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            ✅ Verificación de autenticidad completada exitosamente. Redirigiendo a resultados...
          </AlertDescription>
        </Alert>
      )}

      {/* Formulario de análisis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-green-500" />
            Configuración de Verificación
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="basic" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="basic">Verificación Básica</TabsTrigger>
              <TabsTrigger value="advanced">Configuración Avanzada</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="contentId">ID de Contenido</Label>
                  <Input
                    id="contentId"
                    title="Ingresa el ID único del contenido a verificar"
                    placeholder="ID, hash o identificador único"
                    value={formData.contentId}
                    onChange={(e) => handleInputChange('contentId', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contentUrl">URL del Contenido (Opcional)</Label>
                  <Input
                    id="contentUrl"
                    title="URL opcional para contexto adicional"
                    placeholder="https://... o IPFS hash"
                    value={formData.contentUrl}
                    onChange={(e) => handleInputChange('contentUrl', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contentType">Tipo de Contenido</Label>
                  <Select value={formData.contentType} onValueChange={(value) => handleInputChange('contentType', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {contentTypes.map((type) => (
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
                  <Label htmlFor="verificationMethod">Método de Verificación</Label>
                  <Select value={formData.verificationMethod} onValueChange={(value) => handleInputChange('verificationMethod', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {verificationMethods.map((method) => (
                        <SelectItem key={method.value} value={method.value}>
                          <div className="flex flex-col">
                            <span>{method.label}</span>
                            <span className="text-xs text-muted-foreground">{method.description}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="blockchainNetwork">Red Blockchain</Label>
                  <Select value={formData.blockchainNetwork} onValueChange={(value) => handleInputChange('blockchainNetwork', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {blockchainNetworks.map((network) => (
                        <SelectItem key={network.value} value={network.value}>
                          {network.label}
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
                    <Label htmlFor="contentHash">Hash del Contenido (Opcional)</Label>
                    <Input
                      id="contentHash"
                      title="Hash criptográfico del contenido para verificación"
                      placeholder="0x... o hash IPFS"
                      value={formData.contentHash}
                      onChange={(e) => handleInputChange('contentHash', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tokenId">Token ID (Para NFTs)</Label>
                    <Input
                      id="tokenId"
                      title="ID del token para NFTs específicos"
                      placeholder="123456"
                      value={formData.tokenId}
                      onChange={(e) => handleInputChange('tokenId', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="blockchainNetwork">Red Blockchain</Label>
                    <Select value={formData.blockchainNetwork} onValueChange={(value) => handleInputChange('blockchainNetwork', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {blockchainNetworks.map((network) => (
                          <SelectItem key={network.value} value={network.value}>
                            {network.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <Label>Métodos de Verificación</Label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="includeBlockchain"
                        title="Incluir verificación en blockchain"
                        checked={formData.includeBlockchain}
                        onChange={(e) => handleInputChange('includeBlockchain', e.target.checked)}
                        className="rounded border-gray-300"
                      />
                      <Label htmlFor="includeBlockchain" className="text-sm">
                        Verificación Blockchain
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="includeIPFS"
                        title="Incluir verificación en IPFS"
                        checked={formData.includeIPFS}
                        onChange={(e) => handleInputChange('includeIPFS', e.target.checked)}
                        className="rounded border-gray-300"
                      />
                      <Label htmlFor="includeIPFS" className="text-sm">
                        Verificación IPFS
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="includeSignatures"
                        title="Incluir verificación de firmas digitales"
                        checked={formData.includeSignatures}
                        onChange={(e) => handleInputChange('includeSignatures', e.target.checked)}
                        className="rounded border-gray-300"
                      />
                      <Label htmlFor="includeSignatures" className="text-sm">
                        Firmas Digitales
                      </Label>
                    </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-center mt-8">
            <Button 
              onClick={handleAnalyze}
              disabled={isAnalyzing || (!formData.contentId && !formData.contentUrl && !formData.contentHash)}
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-8 py-3 text-lg"
            >
              {isAnalyzing ? (
                <>
                  <Activity className="mr-2 h-5 w-5 animate-spin" />
                  Verificando Autenticidad...
                </>
              ) : (
                <>
                  <ShieldCheck className="mr-2 h-5 w-5" />
                  Verificar Autenticidad
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Información sobre verificaciones */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Fingerprint className="h-5 w-5 text-blue-500" />
              Verificación de Integridad
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Verifica que el contenido no ha sido modificado usando hashes criptográficos y firmas digitales.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Badge variant="secondary">SHA-256</Badge>
              <Badge variant="secondary">MD5</Badge>
              <Badge variant="secondary">Firma Digital</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Clock className="h-5 w-5 text-purple-500" />
              Verificación de Procedencia
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Rastrea el historial completo del contenido desde su creación hasta el estado actual.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Badge variant="secondary">Timestamp</Badge>
              <Badge variant="secondary">Historial</Badge>
              <Badge variant="secondary">Cadena de Custodia</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Lock className="h-5 w-5 text-green-500" />
              Verificación de Propiedad
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Confirma la propiedad legítima del contenido a través de registros blockchain y certificados.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Badge variant="secondary">Blockchain</Badge>
              <Badge variant="secondary">NFT</Badge>
              <Badge variant="secondary">Certificados</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

