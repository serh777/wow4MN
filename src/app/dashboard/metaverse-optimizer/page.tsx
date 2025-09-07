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
  const [formData, setFormData] = useState({
    contentId: '',
    contentUrl: '',
    contentType: 'website',
    optimizationLevel: 'balanced',
    targetPlatform: 'web',
    includeVR: false,
    includeAR: false,
    include3D: false,
    includeInteractivity: false,
    optimizationGoal: 'performance',
    targetAudience: 'general'
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAnalyze = async () => {
    if (!formData.contentId && !formData.contentUrl) {
      return;
    }

    setIsAnalyzing(true);
    
    try {
      // Simular análisis
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Navegar a resultados
      const params = new URLSearchParams({
        tools: 'metaverse-optimizer',
        address: formData.contentId || formData.contentUrl,
        requestId: `metaverse-${Date.now()}`
      });
      
      router.push(`/dashboard/results/unified?${params.toString()}`);
    } catch (error) {
      console.error('Error during analysis:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const contentTypes = [
    { value: 'website', label: 'Sitio Web' },
    { value: 'app', label: 'Aplicación Web' },
    { value: 'game', label: 'Juego' },
    { value: 'experience', label: 'Experiencia Inmersiva' }
  ];

  const optimizationLevels = [
    { value: 'basic', label: 'Básico' },
    { value: 'balanced', label: 'Equilibrado' },
    { value: 'aggressive', label: 'Agresivo' }
  ];

  const targetPlatforms = [
    { value: 'web', label: 'Web' },
    { value: 'mobile', label: 'Móvil' },
    { value: 'vr', label: 'VR' },
    { value: 'ar', label: 'AR' }
  ];

  const optimizationGoals = [
    { value: 'performance', label: 'Rendimiento' },
    { value: 'visual', label: 'Calidad Visual' },
    { value: 'compatibility', label: 'Compatibilidad' },
    { value: 'accessibility', label: 'Accesibilidad' }
  ];

  const targetAudiences = [
    { value: 'general', label: 'Audiencia General' },
    { value: 'gamers', label: 'Gamers' },
    { value: 'professionals', label: 'Profesionales' },
    { value: 'developers', label: 'Desarrolladores' }
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg">
          <Box className="h-8 w-8 text-white" />
        </div>
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
            Optimizador de Metaverso
          </h1>
          <p className="text-muted-foreground text-lg">
            Optimiza tu contenido para experiencias inmersivas en el metaverso
          </p>
        </div>
      </div>

      {/* Formulario Principal */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-cyan-500" />
            Configuración de Optimización
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic">Básico</TabsTrigger>
              <TabsTrigger value="advanced">Avanzado</TabsTrigger>
              <TabsTrigger value="audience">Audiencia</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="contentId">ID del Contenido</Label>
                  <Input
                    id="contentId"
                    placeholder="Ej: my-metaverse-site"
                    value={formData.contentId}
                    onChange={(e) => handleInputChange('contentId', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contentUrl">URL del Contenido</Label>
                  <Input
                    id="contentUrl"
                    placeholder="https://mi-sitio-metaverso.com"
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
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="optimizationLevel">Nivel de Optimización</Label>
                  <Select value={formData.optimizationLevel} onValueChange={(value) => handleInputChange('optimizationLevel', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {optimizationLevels.map((level) => (
                        <SelectItem key={level.value} value={level.value}>
                          {level.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="targetPlatform">Plataforma Objetivo</Label>
                  <Select value={formData.targetPlatform} onValueChange={(value) => handleInputChange('targetPlatform', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {targetPlatforms.map((platform) => (
                        <SelectItem key={platform.value} value={platform.value}>
                          {platform.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="advanced" className="space-y-6">
              <div className="space-y-6">
                <div className="space-y-4">
                  <Label>Tecnologías a Incluir</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <input
                        title="Enable Virtual Reality"
                        placeholder="Enable Virtual Reality"
                        type="checkbox"
                        id="includeVR"
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
                        title="Enable Augmented Reality"
                        placeholder="Enable Augmented Reality"
                        type="checkbox"
                        id="includeAR"
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
                        title="Enable 3D Models"
                        placeholder="Enable 3D Models"
                        type="checkbox"
                        id="include3D"
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
                        title="Enable Interactivity"
                        placeholder="Enable Interactivity"
                        type="checkbox"
                        id="includeInteractivity"
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

                <div className="space-y-2">
                  <Label htmlFor="optimizationGoal">Objetivo de Optimización</Label>
                  <Select value={formData.optimizationGoal} onValueChange={(value) => handleInputChange('optimizationGoal', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {optimizationGoals.map((goal) => (
                        <SelectItem key={goal.value} value={goal.value}>
                          {goal.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="audience" className="space-y-6">
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

      {/* Información adicional */}
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

