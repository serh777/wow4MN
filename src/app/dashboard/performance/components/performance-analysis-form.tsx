'use client';

import * as React from 'react';
import { InputForm } from '@/app/dashboard/content/analysis-results/components/tool-components';

interface PerformanceAnalysisFormProps {
  onSubmit: (data: any) => Promise<void>;
  loading: boolean;
}

export function PerformanceAnalysisForm({ onSubmit, loading }: PerformanceAnalysisFormProps) {
  return (
    <InputForm onSubmit={onSubmit} isLoading={loading}>
      <div className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="contractAddress" className="text-sm font-medium">Dirección del Contrato</label>
          <input 
            id="contractAddress"
            name="contractAddress"
            type="text" 
            placeholder="0x..." 
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            required
          />
          <p className="text-xs text-muted-foreground">Ingresa la dirección del contrato inteligente a analizar</p>
        </div>
        
        <div className="space-y-2">
          <label htmlFor="blockchain" className="text-sm font-medium">Blockchain</label>
          <select 
            id="blockchain"
            name="blockchain"
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="ethereum">Ethereum</option>
            <option value="polygon">Polygon</option>
            <option value="bsc">Binance Smart Chain</option>
            <option value="avalanche">Avalanche</option>
            <option value="arbitrum">Arbitrum</option>
            <option value="optimism">Optimism</option>
          </select>
        </div>
        
        <div className="space-y-2">
          <label htmlFor="timeframe" className="text-sm font-medium">Período de Análisis</label>
          <select 
            id="timeframe"
            name="timeframe"
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="7d">Últimos 7 días</option>
            <option value="30d">Últimos 30 días</option>
            <option value="90d">Últimos 90 días</option>
            <option value="180d">Últimos 180 días</option>
            <option value="1y">Último año</option>
          </select>
        </div>
        
        <div className="space-y-2">
          <label htmlFor="analysisAreas" className="text-sm font-medium">Áreas a analizar</label>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="gas" name="analysisAreas" value="gas" defaultChecked />
              <label htmlFor="gas" className="text-sm">Uso de Gas</label>
            </div>
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="time" name="analysisAreas" value="time" defaultChecked />
              <label htmlFor="time" className="text-sm">Tiempos de Respuesta</label>
            </div>
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="cost" name="analysisAreas" value="cost" defaultChecked />
              <label htmlFor="cost" className="text-sm">Costos de Transacción</label>
            </div>
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="contract" name="analysisAreas" value="contract" defaultChecked />
              <label htmlFor="contract" className="text-sm">Eficiencia del Contrato</label>
            </div>
          </div>
        </div>
      </div>
    </InputForm>
  );
}