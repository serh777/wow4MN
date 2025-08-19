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
  Box, 
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
    contentId: '',
    contentUrl: '',
    contentType: 'mixed',
    targetPlatforms: ['VRChat', 'Decentraland'],
    includeOptimization: true,
    includeUserExperience: true,
    includeMonetization: true
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
      // Validar que al menos uno de los campos principales esté lleno
      if (!formData.contentId && !formData.contentUrl) {
        throw new Error('Debe proporcionar al menos un ID de contenido o URL');
      }

      // Determinar el identificador principal para el análisis
      const contentId = formData.contentId || formData.contentUrl || 'default-metaverse-content';
      
      // Simular análisis real (en producción usaría MetaverseOptimizerAPIsService)
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      setIsAnalyzing(false);
      setAnalysisComplete(true);
      
      // Guardar datos del análisis para la página de resultados
      const analysisData = {
        contentId,
        contentUrl: formData.contentUrl,
        contentType: formData.contentType,
        targetPlatforms: formData.targetPlatforms,
        includeOptimization: formData.includeOptimization,
        includeUserExperience: formData.includeUserExperience,
        includeMonetization: formData.includeMonetization,
        timestamp: new Date().toISOString()
      };
      
      sessionStorage.setItem('metaverseOptimizerAnalysis', JSON.stringify(analysisData));
      
      // Mostrar mensaje de éxito y redirigir
      setTimeout(() => {
        const params = new URLSearchParams({
          contentId,
          type: formData.contentType,
          platforms: formData.targetPlatforms.join(',')
        });
        router.push(`/dashboard/metaverse-optimizer/analysis-results?${params.toString()}`);
      }, 2000);
      
    } catch (error) {
      console.error('Error en análisis:', error);
      setIsAnalyzing(false);
      // Aquí podrías mostrar un mensaje de error al usuario
    }
  };

  const contentTypes = [
    { value: 'mixed', label: 'Contenido Mixto', description: 'Múltiples tipos de assets' },
    { value: 'avatar', label: 'Avatar/Wearables', description: 'Avatares y accesorios' },
    { value: 'environment', label: 'Entorno Virtual', description: 'Espacios y construcciones' },
    { value: 'game', label: 'Juego/Experiencia', description: 'Experiencias interactivas' },
    { value: 'art', label: 'Arte Digital', description: 'Obras de arte y galerías' }
  ];

  const metaversePlatforms = [
    { value: 'VRChat', label: 'VRChat', description: 'Plataforma social VR' },
    { value: 'Decentraland', label: 'Decentraland', description: 'Mundo virtual descentralizado' },
    { value: 'The Sandbox', label: 'The Sandbox', description: 'Plataforma de gaming y creación' },
    { value: 'Horizon Worlds', label: 'Horizon Worlds', description: 'Plataforma VR de Meta' },
    { value: 'Spatial', label: 'Spatial', description: 'Espacios virtuales colaborativos' }
  ];
    { value: 'investors', label: 'Inversores' },
    { value: 'developers', label: 'Desarrolladores' },
    { value: 'brands', label: 'Marcas y Empresas' }
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="metaverse-header-icon">
          <Box className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="metaverse-header-title">
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
                  <Label htmlFor="contentId">ID de Contenido</Label>
                  <Input
                    id="contentId"
                    title="Ingresa el ID único del contenido a optimizar"
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
                    placeholder="https://play.decentraland.org/..."
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
                  <Label htmlFor="targetPlatforms">Plataformas Objetivo</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {metaversePlatforms.map((platform) => (
                      <div key={platform.value} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`platform-${platform.value}`}
                          checked={formData.targetPlatforms.includes(platform.value)}
                          onChange={(e) => {
                            const platforms = e.target.checked
                              ? [...formData.targetPlatforms, platform.value]
                              : formData.targetPlatforms.filter(p => p !== platform.value);
                            handleInputChange('targetPlatforms', platforms);
                          }}
                          className="rounded border-gray-300"
                        />
                        <Label htmlFor={`platform-${platform.value}`} className="text-sm">
                          {platform.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="advanced" className="space-y-6">
              <div className="space-y-6">
                <div className="space-y-4">
                  <Label>Análisis a Incluir</Label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="includeOptimization"
                        title="Incluir análisis de optimización de assets"
                        checked={formData.includeOptimization}
                        onChange={(e) => handleInputChange('includeOptimization', e.target.checked)}
                        className="rounded border-gray-300"
                      />
                      <Label htmlFor="includeOptimization" className="text-sm">
                        Optimización de Assets
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="includeUserExperience"
                        title="Incluir análisis de experiencia de usuario"
                        checked={formData.includeUserExperience}
                        onChange={(e) => handleInputChange('includeUserExperience', e.target.checked)}
                        className="rounded border-gray-300"
                      />
                      <Label htmlFor="includeUserExperience" className="text-sm">
                        Experiencia de Usuario
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="includeMonetization"
                        title="Incluir análisis de potencial de monetización"
                        checked={formData.includeMonetization}
                        onChange={(e) => handleInputChange('includeMonetization', e.target.checked)}
                        className="rounded border-gray-300"
                      />
                      <Label htmlFor="includeMonetization" className="text-sm">
                        Potencial de Monetización
                      </Label>
                    </div>
                  </div>
                </div>
              </div>
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
                        title="Incluir optimización para Realidad Virtual (VR)"
                        checked={formData.includeVR}
                        onChange={(e) => handleInputChange('includeVR', e.target.checked)}
                        className="metaverse-checkbox"
                      />
                      <Label htmlFor="includeVR" className="text-sm">
                        Realidad Virtual (VR)
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="includeAR"
                        title="Incluir optimización para Realidad Aumentada (AR)"
                        checked={formData.includeAR}
                        onChange={(e) => handleInputChange('includeAR', e.target.checked)}
                        className="metaverse-checkbox"
                      />
                      <Label htmlFor="includeAR" className="text-sm">
                        Realidad Aumentada (AR)
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="include3D"
                        title="Incluir optimización para Modelos 3D"
                        checked={formData.include3D}
                        onChange={(e) => handleInputChange('include3D', e.target.checked)}
                        className="metaverse-checkbox"
                      />
                      <Label htmlFor="include3D" className="text-sm">
                        Modelos 3D
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="includeInteractivity"
                        title="Incluir optimización para Interactividad"
                        checked={formData.includeInteractivity}
                        onChange={(e) => handleInputChange('includeInteractivity', e.target.checked)}
                        className="metaverse-checkbox"
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
              disabled={isAnalyzing || (!formData.contentId && !formData.contentUrl)}
              className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-8 py-3 text-lg"
            >
              {isAnalyzing ? (
                <>
                  <Activity className="mr-2 h-5 w-5 animate-spin" />
                  Optimizando Contenido...
                </>
              ) : (
                <>
                  <Box className="mr-2 h-5 w-5" />
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

