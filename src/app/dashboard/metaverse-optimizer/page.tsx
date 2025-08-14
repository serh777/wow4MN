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
  Cube, 
  Gamepad2, 
  Eye, 
  CheckCircle, 
  AlertTriangle,
  Zap,
  Globe,
  Activity,
  Target,
  Layers,
  Sparkles,
  Monitor,
  Users,
  Image
} from 'lucide-react';

export default function MetaverseOptimizerPage() {
  const router = useRouter();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [formData, setFormData] = useState({
    contentUrl: '',
    metaversePlatform: 'decentraland',
    contentType: 'virtual_space',
    optimizationGoal: 'performance',
    targetAudience: 'general',
    includeVR: true,
    includeAR: false,
    include3D: true,
    includeInteractivity: true
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
      router.push('/dashboard/metaverse-optimizer/analysis-results');
    }, 2000);
  };

  const metaversePlatforms = [
    { value: 'decentraland', label: 'Decentraland', description: 'Mundo virtual descentralizado' },
    { value: 'sandbox', label: 'The Sandbox', description: 'Plataforma de gaming y creación' },
    { value: 'cryptovoxels', label: 'Cryptovoxels', description: 'Mundo virtual basado en voxels' },
    { value: 'somnium', label: 'Somnium Space', description: 'Realidad virtual social' },
    { value: 'horizon', label: 'Horizon Worlds', description: 'Plataforma VR de Meta' },
    { value: 'vrchat', label: 'VRChat', description: 'Plataforma social VR' }
  ];

  const contentTypes = [
    { value: 'virtual_space', label: 'Espacio Virtual', description: 'Terrenos y construcciones' },
    { value: 'avatar', label: 'Avatar/Wearables', description: 'Avatares y accesorios' },
    { value: 'nft_gallery', label: 'Galería NFT', description: 'Exposición de arte digital' },
    { value: 'game', label: 'Juego/Experiencia', description: 'Experiencias interactivas' },
    { value: 'event_space', label: 'Espacio de Eventos', description: 'Venues para eventos' },
    { value: 'marketplace', label: 'Marketplace', description: 'Tiendas virtuales' }
  ];

  const optimizationGoals = [
    { value: 'performance', label: 'Rendimiento', description: 'Optimizar velocidad y fluidez' },
    { value: 'engagement', label: 'Engagement', description: 'Maximizar interacción de usuarios' },
    { value: 'accessibility', label: 'Accesibilidad', description: 'Mejorar acceso para todos' },
    { value: 'monetization', label: 'Monetización', description: 'Optimizar generación de ingresos' },
    { value: 'social', label: 'Social', description: 'Fomentar interacciones sociales' },
    { value: 'immersion', label: 'Inmersión', description: 'Crear experiencias inmersivas' }
  ];

  const targetAudiences = [
    { value: 'general', label: 'Audiencia General' },
    { value: 'gamers', label: 'Gamers' },
    { value: 'artists', label: 'Artistas y Creadores' },
    { value: 'investors', label: 'Inversores' },
    { value: 'developers', label: 'Desarrolladores' },
    { value: 'brands', label: 'Marcas y Empresas' }
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg">
          <Cube className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
            Optimizador de Contenido para Metaversos
          </h1>
          <p className="text-muted-foreground">
            Optimiza contenido en entornos virtuales para mejor visibilidad
          </p>
        </div>
      </div>

      {/* Alert de análisis completo */}
      {analysisComplete && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            ✅ Optimización de metaverso completada exitosamente. Redirigiendo a resultados...
          </AlertDescription>
        </Alert>
      )}

      {/* Formulario de análisis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-cyan-500" />
            Configuración de Optimización
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="basic" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="basic">Configuración Básica</TabsTrigger>
              <TabsTrigger value="advanced">Opciones Avanzadas</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="contentUrl">URL del Contenido</Label>
                  <Input
                    id="contentUrl"
                    placeholder="https://play.decentraland.org/..."
                    value={formData.contentUrl}
                    onChange={(e) => handleInputChange('contentUrl', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="metaversePlatform">Plataforma de Metaverso</Label>
                  <Select value={formData.metaversePlatform} onValueChange={(value) => handleInputChange('metaversePlatform', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {metaversePlatforms.map((platform) => (
                        <SelectItem key={platform.value} value={platform.value}>
                          <div className="flex flex-col">
                            <span>{platform.label}</span>
                            <span className="text-xs text-muted-foreground">{platform.description}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                  <Label htmlFor="optimizationGoal">Objetivo de Optimización</Label>
                  <Select value={formData.optimizationGoal} onValueChange={(value) => handleInputChange('optimizationGoal', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {optimizationGoals.map((goal) => (
                        <SelectItem key={goal.value} value={goal.value}>
                          <div className="flex flex-col">
                            <span>{goal.label}</span>
                            <span className="text-xs text-muted-foreground">{goal.description}</span>
                          </div>
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
                  <Label htmlFor="targetAudience">Audiencia Objetivo</Label>
                  <Select value={formData.targetAudience} onValueChange={(value) => handleInputChange('targetAudience', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {targetAudiences.map((audience) => (
                        <SelectItem key={audience.value} value={audience.value}>
                          {audience.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4">
                  <Label>Tecnologías a Optimizar</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="includeVR"
                        checked={formData.includeVR}
                        onChange={(e) => handleInputChange('includeVR', e.target.checked)}
                        className="rounded border-gray-300"
                      />
                      <Label htmlFor="includeVR" className="text-sm">
                        Realidad Virtual (VR)
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="includeAR"
                        checked={formData.includeAR}
                        onChange={(e) => handleInputChange('includeAR', e.target.checked)}
                        className="rounded border-gray-300"
                      />
                      <Label htmlFor="includeAR" className="text-sm">
                        Realidad Aumentada (AR)
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="include3D"
                        checked={formData.include3D}
                        onChange={(e) => handleInputChange('include3D', e.target.checked)}
                        className="rounded border-gray-300"
                      />
                      <Label htmlFor="include3D" className="text-sm">
                        Modelos 3D
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="includeInteractivity"
                        checked={formData.includeInteractivity}
                        onChange={(e) => handleInputChange('includeInteractivity', e.target.checked)}
                        className="rounded border-gray-300"
                      />
                      <Label htmlFor="includeInteractivity" className="text-sm">
                        Interactividad
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
              disabled={isAnalyzing || !formData.contentUrl}
              className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-8 py-3 text-lg"
            >
              {isAnalyzing ? (
                <>
                  <Activity className="mr-2 h-5 w-5 animate-spin" />
                  Optimizando Contenido...
                </>
              ) : (
                <>
                  <Cube className="mr-2 h-5 w-5" />
                  Optimizar para Metaverso
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Información sobre optimizaciones */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Zap className="h-5 w-5 text-yellow-500" />
              Optimización de Rendimiento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Mejora la velocidad de carga, reduce el lag y optimiza el uso de recursos para una experiencia fluida.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Badge variant="secondary">Compresión</Badge>
              <Badge variant="secondary">LOD</Badge>
              <Badge variant="secondary">Oclusión</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Eye className="h-5 w-5 text-blue-500" />
              Mejora Visual
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Optimiza texturas, iluminación y efectos visuales para crear experiencias más atractivas e inmersivas.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Badge variant="secondary">Texturas</Badge>
              <Badge variant="secondary">Iluminación</Badge>
              <Badge variant="secondary">Shaders</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Users className="h-5 w-5 text-green-500" />
              Experiencia de Usuario
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Mejora la navegación, interactividad y accesibilidad para maximizar el engagement del usuario.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Badge variant="secondary">UI/UX</Badge>
              <Badge variant="secondary">Navegación</Badge>
              <Badge variant="secondary">Accesibilidad</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

