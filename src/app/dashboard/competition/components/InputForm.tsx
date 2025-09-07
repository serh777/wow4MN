'use client';

import React, { useState } from 'react';
import {
  AnalysisFormBase,
  UrlField,
  AnalysisTypeField,
  TextAreaField
} from '../../components/shared';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface FormData {
  projectName: string;
  projectUrl: string;
  competitors: string;
  niche: string;
  analysisType: string;
}

interface InputFormProps {
  onSubmit: (data: FormData) => void;
  isLoading: boolean;
}

export function InputForm({ onSubmit, isLoading }: InputFormProps) {
  const [formData, setFormData] = useState<FormData>({
    projectName: '',
    projectUrl: '',
    competitors: '',
    niche: 'nft',
    analysisType: 'complete'
  });

  const handleSubmit = () => {
    onSubmit(formData);
  };

  return (
    <AnalysisFormBase
      title="Configuración del Análisis"
      description="Configura los parámetros para el análisis de competencia"
      onSubmit={handleSubmit}
      loading={isLoading}
      error={null}
      submitButtonText="Iniciar Análisis de Competencia"
    >
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="projectName">Nombre del Proyecto</Label>
          <Input
            id="projectName"
            placeholder="Mi Proyecto Web3"
            value={formData.projectName}
            onChange={(e) => setFormData(prev => ({ ...prev, projectName: e.target.value }))}
            disabled={isLoading}
          />
        </div>
        
        <UrlField
          value={formData.projectUrl}
          onChange={(value) => setFormData(prev => ({ ...prev, projectUrl: value }))}
          placeholder="https://miproyecto.eth"
          required
        />
        
        <TextAreaField
          label="Competidores"
          value={formData.competitors}
          onChange={(value) => setFormData(prev => ({ ...prev, competitors: value }))}
          placeholder="URLs de competidores separadas por comas"
          rows={4}
        />
        
        <AnalysisTypeField
          value={formData.niche}
          onChange={(value) => setFormData(prev => ({ ...prev, niche: value }))}
          options={[
            { value: 'nft', label: 'NFT' },
            { value: 'defi', label: 'DeFi' },
            { value: 'gaming', label: 'Gaming' },
            { value: 'dao', label: 'DAO' },
            { value: 'dapp', label: 'dApp' },
            { value: 'infrastructure', label: 'Infraestructura' },
            { value: 'other', label: 'Otro' }
          ]}
        />
        
        <AnalysisTypeField
          value={formData.analysisType}
          onChange={(value) => setFormData(prev => ({ ...prev, analysisType: value }))}
          options={[
            { value: 'complete', label: 'Análisis Completo' },
            { value: 'seo', label: 'SEO Web3' },
            { value: 'technical', label: 'Técnico' },
            { value: 'social', label: 'Social' },
            { value: 'onchain', label: 'On-chain' }
          ]}
        />
      </div>
    </AnalysisFormBase>
  );
}