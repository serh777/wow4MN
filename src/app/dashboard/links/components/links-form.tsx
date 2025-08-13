'use client';

import React, { useState } from 'react';
import { InputForm } from '@/app/dashboard/content/analysis-results/components/tool-components';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface LinksFormProps {
  onSubmit: (data: {
    websiteUrl: string;
    scanDepth: number;
    linkTypes: string[];
    checkFrequency: string;
    excludePatterns: string;
  }) => void;
  loading: boolean;
}

export function LinksForm({ onSubmit, loading }: LinksFormProps) {
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [scanDepth, setScanDepth] = useState(3);
  const [linkTypes, setLinkTypes] = useState<string[]>(['internal', 'external']);
  const [checkFrequency, setCheckFrequency] = useState('weekly');
  const [excludePatterns, setExcludePatterns] = useState('');

  const handleSubmit = async (data: Record<string, string>) => {
    await onSubmit({
      websiteUrl: data.websiteUrl || websiteUrl,
      scanDepth: parseInt(data.scanDepth) || scanDepth,
      linkTypes,
      checkFrequency: data.checkFrequency || checkFrequency,
      excludePatterns: data.excludePatterns || excludePatterns
    });
  };

  const handleLinkTypeChange = (type: string, checked: boolean) => {
    if (checked) {
      setLinkTypes(prev => [...prev, type]);
    } else {
      setLinkTypes(prev => prev.filter(t => t !== type));
    }
  };

  return (
    <InputForm onSubmit={handleSubmit}>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">URL del Sitio Web</label>
          <input
            type="url"
            name="websiteUrl"
            value={websiteUrl}
            onChange={(e) => setWebsiteUrl(e.target.value)}
            placeholder="https://mi-sitio-web3.com"
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
          <p className="text-xs text-muted-foreground mt-1">URL completa del sitio web a analizar</p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Profundidad de Escaneo</label>
          <select
            name="scanDepth"
            value={scanDepth}
            onChange={(e) => setScanDepth(Number(e.target.value))}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            aria-label="Profundidad de Escaneo"
          >
            <option value={1}>1 nivel (solo página principal)</option>
            <option value={2}>2 niveles</option>
            <option value={3}>3 niveles (recomendado)</option>
            <option value={4}>4 niveles</option>
            <option value={5}>5 niveles (análisis completo)</option>
          </select>
          <p className="text-xs text-muted-foreground mt-1">Qué tan profundo quieres que sea el análisis</p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Tipos de Enlaces a Analizar</label>
          <div className="space-y-2">
            {[
              { value: 'internal', label: 'Enlaces Internos' },
              { value: 'external', label: 'Enlaces Externos' },
              { value: 'images', label: 'Enlaces de Imágenes' },
              { value: 'downloads', label: 'Enlaces de Descarga' },
              { value: 'social', label: 'Enlaces de Redes Sociales' }
            ].map((type) => (
              <label key={type.value} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={linkTypes.includes(type.value)}
                  onChange={(e) => handleLinkTypeChange(type.value, e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm">{type.label}</span>
              </label>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-1">Selecciona los tipos de enlaces que quieres incluir</p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Frecuencia de Verificación</label>
          <select
            name="checkFrequency"
            value={checkFrequency}
            onChange={(e) => setCheckFrequency(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            aria-label="Frecuencia de Verificación"
          >
            <option value="daily">Diario</option>
            <option value="weekly">Semanal</option>
            <option value="monthly">Mensual</option>
            <option value="quarterly">Trimestral</option>
          </select>
          <p className="text-xs text-muted-foreground mt-1">Con qué frecuencia quieres verificar los enlaces</p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Patrones a Excluir (opcional)</label>
          <textarea
            name="excludePatterns"
            value={excludePatterns}
            onChange={(e) => setExcludePatterns(e.target.value)}
            placeholder="/admin/*&#10;/private/*&#10;*.pdf"
            rows={3}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          ></textarea>
          <p className="text-xs text-muted-foreground mt-1">URLs o patrones que no quieres incluir en el análisis</p>
        </div>

        <Button 
          type="submit" 
          disabled={loading || !websiteUrl || linkTypes.length === 0}
          className="w-full"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analizando Enlaces...
            </>
          ) : (
            'Iniciar Análisis de Enlaces'
          )}
        </Button>
      </div>
    </InputForm>
  );
}