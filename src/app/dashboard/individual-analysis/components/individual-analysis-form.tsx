'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface IndividualAnalysisFormProps {
  onSubmit: (data: any) => void;
  loading?: boolean;
}

export function IndividualAnalysisForm({ onSubmit, loading = false }: IndividualAnalysisFormProps) {
  const [formData, setFormData] = React.useState({
    url: '',
    analysisType: 'comprehensive',
    includePerformance: true,
    includeSecurity: true,
    includeSEO: true,
    includeAccessibility: true,
    includeUsability: true,
    selectedTools: ['lighthouse', 'pagespeed'],
    customParameters: '',
    reportFormat: 'detailed'
  });

  const availableTools = [
    { id: 'lighthouse', name: 'Lighthouse', description: 'Auditoría completa de rendimiento' },
    { id: 'pagespeed', name: 'PageSpeed Insights', description: 'Análisis de velocidad de Google' },
    { id: 'gtmetrix', name: 'GTmetrix', description: 'Análisis detallado de rendimiento' },
    { id: 'webpagetest', name: 'WebPageTest', description: 'Pruebas avanzadas de rendimiento' },
    { id: 'securityheaders', name: 'Security Headers', description: 'Análisis de cabeceras de seguridad' },
    { id: 'ssllabs', name: 'SSL Labs', description: 'Análisis de certificados SSL' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const toggleTool = (toolId: string) => {
    setFormData(prev => ({
      ...prev,
      selectedTools: prev.selectedTools.includes(toolId)
        ? prev.selectedTools.filter(id => id !== toolId)
        : [...prev.selectedTools, toolId]
    }));
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Análisis Individual Personalizado</CardTitle>
        <CardDescription>
          Configura un análisis detallado con herramientas específicas para tus necesidades
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="url">URL a analizar</Label>
            <Input
              id="url"
              type="url"
              placeholder="https://ejemplo.com"
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              required
            />
          </div>

          <Tabs value={formData.analysisType} onValueChange={(value) => setFormData({ ...formData, analysisType: value })}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="comprehensive">Completo</TabsTrigger>
              <TabsTrigger value="performance">Rendimiento</TabsTrigger>
              <TabsTrigger value="custom">Personalizado</TabsTrigger>
            </TabsList>

            <TabsContent value="comprehensive" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="performance"
                    checked={formData.includePerformance}
                    onCheckedChange={(checked) => setFormData({ ...formData, includePerformance: !!checked })}
                  />
                  <Label htmlFor="performance">Rendimiento</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="security"
                    checked={formData.includeSecurity}
                    onCheckedChange={(checked) => setFormData({ ...formData, includeSecurity: !!checked })}
                  />
                  <Label htmlFor="security">Seguridad</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="seo"
                    checked={formData.includeSEO}
                    onCheckedChange={(checked) => setFormData({ ...formData, includeSEO: !!checked })}
                  />
                  <Label htmlFor="seo">SEO</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="accessibility"
                    checked={formData.includeAccessibility}
                    onCheckedChange={(checked) => setFormData({ ...formData, includeAccessibility: !!checked })}
                  />
                  <Label htmlFor="accessibility">Accesibilidad</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="usability"
                    checked={formData.includeUsability}
                    onCheckedChange={(checked) => setFormData({ ...formData, includeUsability: !!checked })}
                  />
                  <Label htmlFor="usability">Usabilidad</Label>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="performance" className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Análisis enfocado exclusivamente en métricas de rendimiento y velocidad
              </p>
              <div className="space-y-2">
                <Label htmlFor="reportFormat">Formato del reporte</Label>
                <Select value={formData.reportFormat} onValueChange={(value) => setFormData({ ...formData, reportFormat: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona el formato" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="detailed">Detallado</SelectItem>
                    <SelectItem value="summary">Resumen</SelectItem>
                    <SelectItem value="technical">Técnico</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>

            <TabsContent value="custom" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label className="text-base font-medium">Herramientas de análisis</Label>
                  <p className="text-sm text-muted-foreground mb-3">
                    Selecciona las herramientas específicas que deseas utilizar
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {availableTools.map((tool) => (
                      <div key={tool.id} className="flex items-start space-x-2 p-3 border rounded-lg">
                        <Checkbox
                          id={tool.id}
                          checked={formData.selectedTools.includes(tool.id)}
                          onCheckedChange={() => toggleTool(tool.id)}
                        />
                        <div className="flex-1">
                          <Label htmlFor={tool.id} className="font-medium">{tool.name}</Label>
                          <p className="text-xs text-muted-foreground">{tool.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label htmlFor="customParameters">Parámetros personalizados</Label>
                  <Textarea
                    id="customParameters"
                    placeholder="Ingresa parámetros adicionales o configuraciones específicas..."
                    value={formData.customParameters}
                    onChange={(e) => setFormData({ ...formData, customParameters: e.target.value })}
                    rows={3}
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">Herramientas seleccionadas: {formData.selectedTools.length}</Badge>
            {formData.selectedTools.map(toolId => {
              const tool = availableTools.find(t => t.id === toolId);
              return tool ? <Badge key={toolId} variant="outline">{tool.name}</Badge> : null;
            })}
          </div>

          <Button type="submit" className="w-full" disabled={loading || formData.selectedTools.length === 0}>
            {loading ? 'Ejecutando análisis...' : 'Iniciar Análisis Personalizado'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}