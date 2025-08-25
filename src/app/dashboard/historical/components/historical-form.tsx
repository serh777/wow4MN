'use client';

import React from 'react';
import { InputForm } from '@/app/dashboard/results/content/components/tool-components';

interface HistoricalFormProps {
  onSubmit: (data: any) => Promise<void>;
  loading: boolean;
}

export function HistoricalForm({ onSubmit, loading }: HistoricalFormProps) {
  return (
    <InputForm onSubmit={onSubmit} isLoading={loading}>
      <div className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="projectName" className="text-sm font-medium">Nombre del Proyecto</label>
          <input 
            id="projectName"
            name="projectName"
            type="text" 
            placeholder="Nombre de tu proyecto Web3" 
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
        </div>
        
        <div className="space-y-2">
          <label htmlFor="timeframe" className="text-sm font-medium">Período de Análisis</label>
          <select 
            id="timeframe"
            name="timeframe"
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="7d">Últimos 7 días</option>
            <option value="30d" selected>Últimos 30 días</option>
            <option value="90d">Últimos 90 días</option>
            <option value="180d">Últimos 180 días</option>
            <option value="1y">Último año</option>
          </select>
        </div>
      </div>
    </InputForm>
  );
}