'use client';

import * as React from 'react';
import { useState } from 'react';
import {
  AnalysisFormBase,
  UrlField,
  AnalysisTypeField,
  TextAreaField,
  AnalysisProgress
} from '../../components/shared';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface FormData {
  projectName: string;
  projectUrl: string;
  keywords: string;
  niche: string;
  keywordType: string;
  contractAddress: string;
  competitorUrls: string;
}

interface KeywordsFormProps {
  onSubmit: (data: FormData) => Promise<void>;
  loading: boolean;
  progress?: number;
  currentStep?: string;
}

export function KeywordsForm({ onSubmit, loading, progress = 0, currentStep }: KeywordsFormProps) {
  const [formData, setFormData] = useState<FormData>({
    projectName: '',
    projectUrl: '',
    keywords: '',
    niche: 'NFT',
    keywordType: 'web3',
    contractAddress: '',
    competitorUrls: ''
  });

  const handleSubmit = () => {
    onSubmit(formData);
  };
  return (
    <div className="space-y-6">
      <AnalysisProgress 
        progress={progress}
        currentStep={currentStep || 'extracting'}
        isAnalyzing={loading}
      />
      
      <AnalysisFormBase
        title="Análisis de Keywords"
        description="Configura los parámetros para el análisis de palabras clave"
        onSubmit={handleSubmit}
        loading={loading}
        error={null}
        submitButtonText="Iniciar Análisis de Keywords"
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="projectName">Nombre del Proyecto</Label>
            <Input
              id="projectName"
              placeholder="Mi Proyecto Web3"
              value={formData.projectName}
              onChange={(e) => setFormData(prev => ({ ...prev, projectName: e.target.value }))}
              disabled={loading}
            />
          </div>
          
          <UrlField
            value={formData.projectUrl}
            onChange={(value) => setFormData(prev => ({ ...prev, projectUrl: value }))}
            placeholder="https://tuproyecto.com"
            required
          />
          
          <TextAreaField
            label="Palabras Clave"
            value={formData.keywords}
            onChange={(value) => setFormData(prev => ({ ...prev, keywords: value }))}
            placeholder="Ingresa palabras clave separadas por comas (ej: blockchain, NFT, DeFi)"
            rows={4}
          />
          
          <AnalysisTypeField
            value={formData.niche}
            onChange={(value) => setFormData(prev => ({ ...prev, niche: value }))}
            options={[
              { value: 'NFT', label: 'NFT' },
              { value: 'DeFi', label: 'DeFi' },
              { value: 'Gaming', label: 'Gaming' },
              { value: 'Metaverse', label: 'Metaverso' },
              { value: 'DAO', label: 'DAO' },
              { value: 'Web3 General', label: 'Web3 General' },
              { value: 'Other', label: 'Otro' }
            ]}
          />
          
          <AnalysisTypeField
            value={formData.keywordType}
            onChange={(value) => setFormData(prev => ({ ...prev, keywordType: value }))}
            options={[
              { value: 'web3', label: 'Web3 (IA + Blockchain)' },
              { value: 'defi', label: 'DeFi' },
              { value: 'nft', label: 'NFT' },
              { value: 'dao', label: 'DAO' },
              { value: 'metaverse', label: 'Metaverso' },
              { value: 'general', label: 'General' },
              { value: 'technical', label: 'Técnicas' },
              { value: 'marketing', label: 'Marketing' }
            ]}
          />
          
          <div className="space-y-2">
            <Label htmlFor="contractAddress">Dirección del Contrato (opcional)</Label>
            <Input
              id="contractAddress"
              placeholder="0x..."
              value={formData.contractAddress}
              onChange={(e) => setFormData(prev => ({ ...prev, contractAddress: e.target.value }))}
              disabled={loading}
            />
          </div>
          
          <TextAreaField
            label="URLs de Competidores (opcional)"
            value={formData.competitorUrls}
            onChange={(value) => setFormData(prev => ({ ...prev, competitorUrls: value }))}
            placeholder="https://competidor1.com\nhttps://competidor2.com"
            rows={3}
          />
        </div>
      </AnalysisFormBase>
    </div>
  );
}