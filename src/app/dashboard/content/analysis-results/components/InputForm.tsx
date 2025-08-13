'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { FileText, Users, Search, Share2, PenTool, Info } from 'lucide-react';
import { getActiveIndexersForDropdown } from '@/utils/indexer-utils';

interface FormData {
  url: string;
  analysisType: string;
  contentType: string;
  targetAudience: string;
  includeReadability: boolean;
  includeSEO: boolean;
  includeEngagement: boolean;
  selectedIndexer: string;
  keywords: string;
}

interface InputFormProps {
  onSubmit: (data: FormData) => void;
  loading: boolean;
  onReset: () => void;
}

const analysisTypes = [
  { value: 'blog', label: 'Análisis de Blog', icon: FileText, description: 'Evaluación completa de artículos y posts: legibilidad, SEO, estructura y engagement' },
  { value: 'landing', label: 'Landing Page', icon: PenTool, description: 'Optimización de páginas de aterrizaje: conversión, CTA, propuesta de valor' },
  { value: 'social', label: 'Contenido Social', icon: Share2, description: 'Análisis de contenido para redes sociales: engagement, hashtags, formato' },
  { value: 'technical', label: 'Documentación Técnica', icon: Search, description: 'Evaluación de documentación: claridad, completitud, estructura técnica' },
  { value: 'marketing', label: 'Material de Marketing', icon: Users, description: 'Análisis de contenido promocional: persuasión, audiencia, llamadas a la acción' }
];

const contentTypes = [
  { value: 'article', label: 'Artículo/Blog Post' },
  { value: 'webpage', label: 'Página Web' },
  { value: 'landing', label: 'Landing Page' },
  { value: 'documentation', label: 'Documentación' },
  { value: 'social-post', label: 'Post Social Media' },
  { value: 'email', label: 'Email Marketing' },
  { value: 'whitepaper', label: 'Whitepaper' },
  { value: 'case-study', label: 'Caso de Estudio' }
];

const targetAudiences = [
  { value: 'general', label: 'Audiencia General' },
  { value: 'technical', label: 'Audiencia Técnica' },
  { value: 'business', label: 'Profesionales de Negocios' },
  { value: 'developers', label: 'Desarrolladores' },
  { value: 'investors', label: 'Inversores' },
  { value: 'users', label: 'Usuarios Finales' },
  { value: 'community', label: 'Comunidad Web3' },
  { value: 'beginners', label: 'Principiantes' }
];

const keywordExamples = [
  {
    title: "SEO Web3",
    keywords: "blockchain, DeFi, NFT, smart contracts, cryptocurrency"
  },
  {
    title: "Marketing Digital",
    keywords: "conversión, engagement, CTR, ROI, audiencia"
  },
  {
    title: "Contenido Técnico",
    keywords: "API, documentación, tutorial, guía, implementación"
  },
  {
    title: "Redes Sociales",
    keywords: "viral, hashtags, comunidad, influencer, trending"
  }
];

// Obtener indexadores activos desde las utilidades
const userIndexers = getActiveIndexersForDropdown().map(indexer => ({
  value: indexer.value,
  label: indexer.label,
  description: indexer.description,
  active: true
}));

export function InputForm({ onSubmit, loading, onReset }: InputFormProps) {
  const [formData, setFormData] = useState<FormData>({
    url: '',
    analysisType: 'blog',
    contentType: 'article',
    targetAudience: 'general',
    includeReadability: true,
    includeSEO: true,
    includeEngagement: true,
    selectedIndexer: userIndexers.length > 0 ? userIndexers[0].value : '',
    keywords: ''
  });
  
  const [urlValidation, setUrlValidation] = useState<{
    isValid: boolean;
    message: string;
  }>({ isValid: true, message: '' });

  const [showInfoDialog, setShowInfoDialog] = useState(false);

  // Validación básica de URL
  const validateURL = (url: string) => {
    if (!url) {
      setUrlValidation({ isValid: true, message: '' });
      return;
    }
    
    try {
      new URL(url);
      setUrlValidation({ isValid: true, message: 'URL válida' });
    } catch {
      setUrlValidation({ isValid: false, message: 'Por favor, ingresa una URL válida' });
    }
  };

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Validar URL en tiempo real
    if (field === 'url') {
      validateURL(value);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar antes de enviar
    if (!formData.url || !urlValidation.isValid) {
      return;
    }
    
    onSubmit(formData);
  };

  const selectedAnalysisType = analysisTypes.find(type => type.value === formData.analysisType);
  const selectedIndexer = userIndexers.find(indexer => indexer.value === formData.selectedIndexer);

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-6 w-6 text-blue-600" />
            Análisis de Contenido
          </CardTitle>
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 dark:hover:bg-blue-950"
              onMouseEnter={() => setShowInfoDialog(true)}
              onMouseLeave={() => setShowInfoDialog(false)}
            >
              <Info className="h-4 w-4" />
            </Button>
            {showInfoDialog && (
              <div className="absolute right-0 top-full mt-2 w-80 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
                <h4 className="font-semibold mb-2">Análisis de Contenido Web3</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Herramienta especializada para evaluar y optimizar contenido digital. 
                  Analiza legibilidad, SEO, engagement y efectividad del mensaje.
                </p>
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* URL del Contenido */}
          <div className="space-y-2">
            <Label htmlFor="url" className="text-sm font-medium">
              URL del Contenido *
            </Label>
            <Input
              id="url"
              type="url"
              placeholder="https://ejemplo.com/mi-contenido"
              value={formData.url}
              onChange={(e) => handleInputChange('url', e.target.value)}
              className={`transition-colors ${
                !urlValidation.isValid && formData.url 
                  ? 'border-red-500 focus:border-red-500' 
                  : urlValidation.isValid && formData.url
                  ? 'border-green-500 focus:border-green-500'
                  : ''
              }`}
              disabled={loading}
            />
            {formData.url && (
              <p className={`text-xs ${
                urlValidation.isValid ? 'text-green-600' : 'text-red-600'
              }`}>
                {urlValidation.message}
              </p>
            )}
          </div>

          {/* Tipo de Análisis */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Tipo de Análisis</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {analysisTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <div
                    key={type.value}
                    className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                      formData.analysisType === type.value
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/30'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                    }`}
                    onClick={() => handleInputChange('analysisType', type.value)}
                  >
                    <div className="flex items-start gap-3">
                      <Icon className={`h-5 w-5 mt-0.5 ${
                        formData.analysisType === type.value ? 'text-blue-600' : 'text-gray-500'
                      }`} />
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{type.label}</h4>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                          {type.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Configuración del Contenido */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Tipo de Contenido */}
            <div className="space-y-2">
              <Label htmlFor="contentType" className="text-sm font-medium">
                Tipo de Contenido
              </Label>
              <Select
                value={formData.contentType}
                onValueChange={(value) => handleInputChange('contentType', value)}
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona el tipo" />
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

            {/* Audiencia Objetivo */}
            <div className="space-y-2">
              <Label htmlFor="targetAudience" className="text-sm font-medium">
                Audiencia Objetivo
              </Label>
              <Select
                value={formData.targetAudience}
                onValueChange={(value) => handleInputChange('targetAudience', value)}
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona la audiencia" />
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

          {/* Palabras Clave */}
          <div className="space-y-2">
            <Label htmlFor="keywords" className="text-sm font-medium">
              Palabras Clave (opcional)
            </Label>
            <Textarea
              id="keywords"
              placeholder="blockchain, DeFi, smart contracts, Web3..."
              value={formData.keywords}
              onChange={(e) => handleInputChange('keywords', e.target.value)}
              className="min-h-[80px] resize-none"
              disabled={loading}
            />
            <div className="flex flex-wrap gap-2 mt-2">
              {keywordExamples.map((example, index) => (
                <Button
                  key={index}
                  type="button"
                  variant="outline"
                  size="sm"
                  className="text-xs h-7"
                  onClick={() => handleInputChange('keywords', example.keywords)}
                  disabled={loading}
                >
                  {example.title}
                </Button>
              ))}
            </div>
          </div>

          {/* Opciones de Análisis */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Incluir en el Análisis</Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="includeReadability"
                  checked={formData.includeReadability}
                  onCheckedChange={(checked) => handleInputChange('includeReadability', checked)}
                  disabled={loading}
                />
                <Label htmlFor="includeReadability" className="text-sm">
                  Análisis de Legibilidad
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="includeSEO"
                  checked={formData.includeSEO}
                  onCheckedChange={(checked) => handleInputChange('includeSEO', checked)}
                  disabled={loading}
                />
                <Label htmlFor="includeSEO" className="text-sm">
                  Optimización SEO
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="includeEngagement"
                  checked={formData.includeEngagement}
                  onCheckedChange={(checked) => handleInputChange('includeEngagement', checked)}
                  disabled={loading}
                />
                <Label htmlFor="includeEngagement" className="text-sm">
                  Métricas de Engagement
                </Label>
              </div>
            </div>
          </div>

          {/* Indexador */}
          {userIndexers.length > 0 && (
            <div className="space-y-2">
              <Label htmlFor="indexer" className="text-sm font-medium">
                Indexador de Datos
              </Label>
              <Select
                value={formData.selectedIndexer}
                onValueChange={(value) => handleInputChange('selectedIndexer', value)}
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un indexador" />
                </SelectTrigger>
                <SelectContent>
                  {userIndexers.map((indexer) => (
                    <SelectItem key={indexer.value} value={indexer.value}>
                      <div className="flex items-center gap-2">
                        <span>{indexer.label}</span>
                        <Badge variant="secondary" className="text-xs">
                          Activo
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedIndexer && (
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {selectedIndexer.description}
                </p>
              )}
            </div>
          )}

          {/* Información del Análisis Seleccionado */}
          {selectedAnalysisType && (
            <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-start gap-3">
                <selectedAnalysisType.icon className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900 dark:text-blue-100">
                    {selectedAnalysisType.label}
                  </h4>
                  <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                    {selectedAnalysisType.description}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Botones de Acción */}
          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={loading || !formData.url || !urlValidation.isValid}
              className="flex-1"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Analizando...
                </>
              ) : (
                'Iniciar Análisis'
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onReset}
              disabled={loading}
            >
              Limpiar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}