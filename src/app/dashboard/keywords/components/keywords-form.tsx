'use client';

import * as React from 'react';
import { ToolLayout, InputForm } from '@/app/dashboard/results/content/components/tool-components';
import { AnalysisProgress } from './analysis-progress';

interface KeywordsFormProps {
  onSubmit: (data: any) => Promise<void>;
  loading: boolean;
  progress?: number;
  currentStep?: string;
}

export function KeywordsForm({ onSubmit, loading, progress = 0, currentStep }: KeywordsFormProps) {
  return (
    <div className="space-y-6">
      <AnalysisProgress 
        progress={progress}
        currentStep={currentStep || 'extracting'}
        isVisible={loading}
      />
      
      <InputForm onSubmit={onSubmit} isLoading={loading}>
      <div className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="projectName" className="text-sm font-medium">Nombre del Proyecto</label>
          <input 
            id="projectName"
            name="projectName"
            type="text" 
            placeholder="Mi Proyecto Web3" 
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            required
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="projectUrl" className="text-sm font-medium">URL del Proyecto</label>
          <input 
            id="projectUrl"
            name="projectUrl"
            type="text" 
            placeholder="https://tuproyecto.com" 
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            required
          />
          <p className="text-xs text-muted-foreground">Ingresa la URL principal de tu proyecto Web3</p>
        </div>
        
        <div className="space-y-2">
          <label htmlFor="keywords" className="text-sm font-medium">Palabras Clave</label>
          <textarea 
            id="keywords"
            name="keywords"
            placeholder="Ingresa palabras clave separadas por comas (ej: blockchain, NFT, DeFi)" 
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[100px]"
            required
          />
          <p className="text-xs text-muted-foreground">
            Ingresa las palabras clave que deseas analizar para tu proyecto Web3
          </p>
        </div>
        
        <div className="space-y-2">
          <label htmlFor="niche" className="text-sm font-medium">Nicho o Categoría</label>
          <select 
            id="niche"
            name="niche"
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            required
          >
            <option value="NFT">NFT</option>
            <option value="DeFi">DeFi</option>
            <option value="Gaming">Gaming</option>
            <option value="Metaverse">Metaverso</option>
            <option value="DAO">DAO</option>
            <option value="Web3 General">Web3 General</option>
            <option value="Other">Otro</option>
          </select>
        </div>
        
        <div className="space-y-2">
          <label htmlFor="keywordType" className="text-sm font-medium">Tipo de Keywords</label>
          <select 
            id="keywordType"
            name="keywordType"
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="general">General</option>
            <option value="technical">Técnicas</option>
            <option value="marketing">Marketing</option>
            <option value="defi">DeFi</option>
            <option value="nft">NFT</option>
          </select>
        </div>
        
        <div className="space-y-2">
          <label htmlFor="contractAddress" className="text-sm font-medium">
            Dirección del Contrato (opcional)
          </label>
          <input 
            id="contractAddress"
            name="contractAddress"
            type="text" 
            placeholder="0x..." 
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          />
          <p className="text-xs text-muted-foreground">
            Proporciona la dirección del contrato para un análisis más preciso
          </p>
        </div>
        
        <div className="space-y-2">
          <label htmlFor="competitorUrls" className="text-sm font-medium">URLs de Competidores (opcional)</label>
          <textarea
            id="competitorUrls"
            name="competitorUrls"
            placeholder="https://competidor1.com&#10;https://competidor2.com"
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm h-24 resize-none"
          ></textarea>
          <p className="text-xs text-muted-foreground">Una URL por línea</p>
        </div>
      </div>
    </InputForm>
    </div>
  );
}