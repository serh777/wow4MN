'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  AnalysisFormBase,
  UrlField,
  AnalysisTypeField,
  CheckboxField,
  TextAreaField,
  OptionsTabsContainer,
  BasicTabContent,
  AdvancedTabContent,
  COMMON_ANALYSIS_TYPES
} from '@/app/dashboard/components/shared';

interface ContentAnalysisFormProps {
  onSubmit: (data: any) => void;
  loading?: boolean;
}

export function ContentAnalysisForm({ onSubmit, loading = false }: ContentAnalysisFormProps) {
  const [formData, setFormData] = React.useState({
    url: '',
    analysisType: 'comprehensive',
    contentType: 'webpage',
    targetAudience: 'general',
    includeReadability: true,
    includeSEO: true,
    includeEngagement: true,
    selectedIndexer: 'default',
    keywords: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <AnalysisFormBase
      title="Análisis de Contenido"
      description="Analiza la calidad, legibilidad y optimización SEO de tu contenido"
      onSubmit={handleSubmit}
      loading={loading}
      error={null}
      submitButtonText="Iniciar Análisis"
    >
      <UrlField
        value={formData.url}
        onChange={(value) => setFormData({ ...formData, url: value })}
        placeholder="https://ejemplo.com/articulo"
      />

      <div className="grid grid-cols-2 gap-4">
        <AnalysisTypeField
          value={formData.contentType}
          onChange={(value) => setFormData({ ...formData, contentType: value })}
          options={[
            { value: 'webpage', label: 'Página web' },
            { value: 'blog', label: 'Artículo de blog' },
            { value: 'product', label: 'Página de producto' },
            { value: 'landing', label: 'Landing page' }
          ]}
        />

        <AnalysisTypeField
          value={formData.targetAudience}
          onChange={(value) => setFormData({ ...formData, targetAudience: value })}
          options={[
            { value: 'general', label: 'General' },
            { value: 'technical', label: 'Técnica' },
            { value: 'business', label: 'Empresarial' },
            { value: 'academic', label: 'Académica' }
          ]}
        />
      </div>

      <OptionsTabsContainer>
        <BasicTabContent>
          <div className="grid grid-cols-3 gap-4">
            <CheckboxField
              id="readability"
              label="Legibilidad"
              checked={formData.includeReadability}
              onChange={(checked) => setFormData({ ...formData, includeReadability: !!checked })}
            />
            <CheckboxField
              id="seo"
              label="SEO"
              checked={formData.includeSEO}
              onChange={(checked) => setFormData({ ...formData, includeSEO: !!checked })}
            />
            <CheckboxField
              id="engagement"
              label="Engagement"
              checked={formData.includeEngagement}
              onChange={(checked) => setFormData({ ...formData, includeEngagement: !!checked })}
            />
          </div>
        </BasicTabContent>

        <AdvancedTabContent>
          <TextAreaField
            label="Palabras clave objetivo"
            placeholder="Ingresa las palabras clave separadas por comas"
            value={formData.keywords}
            onChange={(value) => setFormData({ ...formData, keywords: value })}
          />
        </AdvancedTabContent>

        <BasicTabContent>
          <p className="text-sm text-muted-foreground">
            Análisis enfocado en la facilidad de lectura y comprensión del contenido
          </p>
        </BasicTabContent>

        <BasicTabContent>
          <p className="text-sm text-muted-foreground">
            Análisis enfocado en elementos que mejoran la interacción del usuario
          </p>
        </BasicTabContent>
      </OptionsTabsContainer>

      <AnalysisTypeField
        value={formData.selectedIndexer}
        onChange={(value) => setFormData({ ...formData, selectedIndexer: value })}
        options={[
          { value: 'default', label: 'Indexador por defecto' },
          { value: 'advanced', label: 'Indexador avanzado' },
          { value: 'fast', label: 'Indexador rápido' }
        ]}
      />
    </AnalysisFormBase>
  );
}