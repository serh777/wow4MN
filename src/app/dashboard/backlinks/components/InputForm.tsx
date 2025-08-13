'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, Link, Search, Target } from 'lucide-react';

interface FormData {
  websiteUrl: string;
  projectName: string;
  targetKeywords: string;
  competitors: string;
  analysisDepth: string;
  includeCompetitorAnalysis: boolean;
  includeToxicLinks: boolean;
  includeAnchorAnalysis: boolean;
}

interface InputFormProps {
  onSubmit: (data: FormData) => void;
  loading: boolean;
}

export function InputForm({ onSubmit, loading }: InputFormProps) {
  const [formData, setFormData] = React.useState<FormData>({
    websiteUrl: '',
    projectName: '',
    targetKeywords: '',
    competitors: '',
    analysisDepth: 'standard',
    includeCompetitorAnalysis: true,
    includeToxicLinks: true,
    includeAnchorAnalysis: true
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.websiteUrl.trim()) return;
    onSubmit(formData);
  };

  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Link className="h-5 w-5" />
          Configuración del Análisis de Backlinks
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* URL del sitio web */}
          <div className="space-y-2">
            <Label htmlFor="websiteUrl" className="text-sm font-medium flex items-center gap-2">
              <Search className="h-4 w-4" />
              URL del Sitio Web *
            </Label>
            <Input
              id="websiteUrl"
              type="url"
              placeholder="https://tu-proyecto-web3.com"
              value={formData.websiteUrl}
              onChange={(e) => handleInputChange('websiteUrl', e.target.value)}
              required
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              URL principal de tu proyecto para analizar sus backlinks
            </p>
          </div>

          {/* Nombre del proyecto */}
          <div className="space-y-2">
            <Label htmlFor="projectName" className="text-sm font-medium">
              Nombre del Proyecto
            </Label>
            <Input
              id="projectName"
              type="text"
              placeholder="Nombre de tu proyecto blockchain"
              value={formData.projectName}
              onChange={(e) => handleInputChange('projectName', e.target.value)}
              className="w-full"
            />
          </div>

          {/* Palabras clave objetivo */}
          <div className="space-y-2">
            <Label htmlFor="targetKeywords" className="text-sm font-medium flex items-center gap-2">
              <Target className="h-4 w-4" />
              Palabras Clave Objetivo
            </Label>
            <Input
              id="targetKeywords"
              type="text"
              placeholder="DeFi, NFT, blockchain, Web3, smart contracts"
              value={formData.targetKeywords}
              onChange={(e) => handleInputChange('targetKeywords', e.target.value)}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              Palabras clave para las que quieres analizar tus backlinks (separadas por comas)
            </p>
          </div>

          {/* Competidores */}
          <div className="space-y-2">
            <Label htmlFor="competitors" className="text-sm font-medium">
              Competidores (Opcional)
            </Label>
            <Textarea
              id="competitors"
              placeholder="https://competidor1.com&#10;https://competidor2.com&#10;https://competidor3.com"
              value={formData.competitors}
              onChange={(e) => handleInputChange('competitors', e.target.value)}
              className="w-full min-h-[80px] resize-none"
            />
            <p className="text-xs text-muted-foreground">
              URLs de competidores para análisis comparativo (una por línea)
            </p>
          </div>

          {/* Profundidad del análisis */}
          <div className="space-y-2">
            <Label htmlFor="analysisDepth" className="text-sm font-medium">
              Profundidad del Análisis
            </Label>
            <Select
              value={formData.analysisDepth}
              onValueChange={(value) => handleInputChange('analysisDepth', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona la profundidad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="basic">Básico (últimos 30 días)</SelectItem>
                <SelectItem value="standard">Estándar (últimos 90 días)</SelectItem>
                <SelectItem value="comprehensive">Completo (últimos 12 meses)</SelectItem>
                <SelectItem value="historical">Histórico (todos los datos disponibles)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Opciones de análisis */}
          <div className="space-y-4">
            <Label className="text-sm font-medium">Opciones de Análisis</Label>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="includeCompetitorAnalysis"
                  checked={formData.includeCompetitorAnalysis}
                  onCheckedChange={(checked) => handleInputChange('includeCompetitorAnalysis', !!checked)}
                />
                <Label htmlFor="includeCompetitorAnalysis" className="text-sm">
                  Incluir análisis competitivo
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="includeToxicLinks"
                  checked={formData.includeToxicLinks}
                  onCheckedChange={(checked) => handleInputChange('includeToxicLinks', !!checked)}
                />
                <Label htmlFor="includeToxicLinks" className="text-sm">
                  Detectar enlaces tóxicos
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="includeAnchorAnalysis"
                  checked={formData.includeAnchorAnalysis}
                  onCheckedChange={(checked) => handleInputChange('includeAnchorAnalysis', !!checked)}
                />
                <Label htmlFor="includeAnchorAnalysis" className="text-sm">
                  Análisis de texto de anclaje
                </Label>
              </div>
            </div>
          </div>

          {/* Botón de envío */}
          <Button
            type="submit"
            disabled={loading || !formData.websiteUrl.trim()}
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analizando Backlinks...
              </>
            ) : (
              <>
                <Link className="mr-2 h-4 w-4" />
                Iniciar Análisis de Backlinks
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}