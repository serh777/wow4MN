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
  Shield, 
  Users, 
  TrendingUp, 
  CheckCircle, 
  AlertTriangle,
  BarChart3,
  Network,
  Star,
  Award,
  Target,
  Zap,
  Globe,
  Activity
} from 'lucide-react';

export default function AuthorityTrackingPage() {
  const router = useRouter();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [formData, setFormData] = useState({
    walletAddress: '',
    contractAddress: '',
    projectName: '',
    analysisType: 'comprehensive',
    timeframe: '30d',
    includeGovernance: true,
    includeReputation: true,
    includeInfluence: true
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
      router.push('/dashboard/authority-tracking/analysis-results');
    }, 2000);
  };

  const analysisTypes = [
    { value: 'comprehensive', label: 'Análisis Comprensivo', description: 'Evaluación completa de autoridad' },
    { value: 'governance', label: 'Autoridad de Gobernanza', description: 'Enfoque en participación en DAOs' },
    { value: 'reputation', label: 'Reputación Social', description: 'Análisis de reputación en redes' },
    { value: 'influence', label: 'Influencia Técnica', description: 'Impacto en desarrollo y protocolos' }
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
        <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
          <Shield className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Seguimiento de Autoridad Descentralizada
          </h1>
          <p className="text-muted-foreground">
            Evalúa la credibilidad y autoridad en ecosistemas descentralizados
          </p>
        </div>
      </div>

      {/* Alert de análisis completo */}
      {analysisComplete && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            ✅ Análisis de autoridad completado exitosamente. Redirigiendo a resultados...
          </AlertDescription>
        </Alert>
      )}

      {/* Formulario de análisis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-purple-500" />
            Configuración de Análisis
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
                  <Label htmlFor="contractAddress">Dirección de Contrato (Opcional)</Label>
                  <Input
                    id="contractAddress"
                    placeholder="0x..."
                    value={formData.contractAddress}
                    onChange={(e) => handleInputChange('contractAddress', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="projectName">Nombre del Proyecto (Opcional)</Label>
                  <Input
                    id="projectName"
                    placeholder="Ej: Uniswap, Compound..."
                    value={formData.projectName}
                    onChange={(e) => handleInputChange('projectName', e.target.value)}
                  />
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
                  <Label htmlFor="analysisType">Tipo de Análisis</Label>
                  <Select value={formData.analysisType} onValueChange={(value) => handleInputChange('analysisType', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {analysisTypes.map((type) => (
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

                <div className="space-y-4">
                  <Label>Métricas a Incluir</Label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                        id="includeReputation"
                        checked={formData.includeReputation}
                        onChange={(e) => handleInputChange('includeReputation', e.target.checked)}
                        className="rounded border-gray-300"
                      />
                      <Label htmlFor="includeReputation" className="text-sm">
                        Reputación Social
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="includeInfluence"
                        checked={formData.includeInfluence}
                        onChange={(e) => handleInputChange('includeInfluence', e.target.checked)}
                        className="rounded border-gray-300"
                      />
                      <Label htmlFor="includeInfluence" className="text-sm">
                        Influencia Técnica
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
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-3 text-lg"
            >
              {isAnalyzing ? (
                <>
                  <Activity className="mr-2 h-5 w-5 animate-spin" />
                  Analizando Autoridad...
                </>
              ) : (
                <>
                  <Shield className="mr-2 h-5 w-5" />
                  Analizar Autoridad
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Información sobre métricas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Users className="h-5 w-5 text-blue-500" />
              Autoridad de Gobernanza
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Evalúa la participación en DAOs, propuestas de gobernanza y poder de voto en protocolos descentralizados.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Badge variant="secondary">Participación DAO</Badge>
              <Badge variant="secondary">Propuestas</Badge>
              <Badge variant="secondary">Poder de Voto</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Star className="h-5 w-5 text-yellow-500" />
              Reputación Social
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Analiza la reputación en redes sociales Web3, comunidades y plataformas descentralizadas.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Badge variant="secondary">Seguidores</Badge>
              <Badge variant="secondary">Interacciones</Badge>
              <Badge variant="secondary">Menciones</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Award className="h-5 w-5 text-green-500" />
              Influencia Técnica
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Mide el impacto técnico en desarrollo de protocolos, contribuciones a código y liderazgo tecnológico.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Badge variant="secondary">Commits</Badge>
              <Badge variant="secondary">Protocolos</Badge>
              <Badge variant="secondary">Liderazgo</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

