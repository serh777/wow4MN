'use client';

import * as React from 'react';
import { useState } from 'react';
import { AnalysisFormBase, AnalysisTypeField, CheckboxField } from '../../components/shared';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface FormData {
  contractAddress: string;
  blockchain: string;
  timeframe: string;
  analysisAreas: {
    gas: boolean;
    time: boolean;
    cost: boolean;
    contract: boolean;
  };
}

interface PerformanceAnalysisFormProps {
  onSubmit: (data: any) => Promise<void>;
  loading: boolean;
}

export function PerformanceAnalysisForm({ onSubmit, loading }: PerformanceAnalysisFormProps) {
  const [formData, setFormData] = useState<FormData>({
    contractAddress: '',
    blockchain: 'ethereum',
    timeframe: '30d',
    analysisAreas: {
      gas: true,
      time: true,
      cost: true,
      contract: true
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <AnalysisFormBase
      title="Análisis de Performance"
      description="Configura los parámetros para el análisis de rendimiento del contrato"
      onSubmit={handleSubmit}
      loading={loading}
      error={null}
      submitButtonText="Iniciar Análisis de Performance"
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="contractAddress">Dirección del Contrato</Label>
          <Input
            id="contractAddress"
            placeholder="0x..."
            value={formData.contractAddress}
            onChange={(e) => setFormData(prev => ({ ...prev, contractAddress: e.target.value }))}
            disabled={loading}
            required
          />
        </div>
        
        <AnalysisTypeField
          value={formData.blockchain}
          onChange={(value) => setFormData(prev => ({ ...prev, blockchain: value }))}
          options={[
            { value: 'ethereum', label: 'Ethereum' },
            { value: 'polygon', label: 'Polygon' },
            { value: 'bsc', label: 'Binance Smart Chain' },
            { value: 'avalanche', label: 'Avalanche' },
            { value: 'arbitrum', label: 'Arbitrum' },
            { value: 'optimism', label: 'Optimism' }
          ]}
        />
        
        <AnalysisTypeField
          value={formData.timeframe}
          onChange={(value) => setFormData(prev => ({ ...prev, timeframe: value }))}
          options={[
            { value: '7d', label: 'Últimos 7 días' },
            { value: '30d', label: 'Últimos 30 días' },
            { value: '90d', label: 'Últimos 90 días' },
            { value: '180d', label: 'Últimos 180 días' },
            { value: '1y', label: 'Último año' }
          ]}
        />
        
        <div className="space-y-2">
          <Label>Áreas a analizar</Label>
          <div className="grid grid-cols-2 gap-2">
            <CheckboxField
              id="gas"
              label="Uso de Gas"
              checked={formData.analysisAreas.gas}
              onChange={(checked) => setFormData(prev => ({
                ...prev,
                analysisAreas: { ...prev.analysisAreas, gas: checked }
              }))}
            />
            <CheckboxField
              id="time"
              label="Tiempos de Respuesta"
              checked={formData.analysisAreas.time}
              onChange={(checked) => setFormData(prev => ({
                ...prev,
                analysisAreas: { ...prev.analysisAreas, time: checked }
              }))}
            />
            <CheckboxField
              id="cost"
              label="Costos de Transacción"
              checked={formData.analysisAreas.cost}
              onChange={(checked) => setFormData(prev => ({
                ...prev,
                analysisAreas: { ...prev.analysisAreas, cost: checked }
              }))}
            />
            <CheckboxField
              id="contract"
              label="Eficiencia del Contrato"
              checked={formData.analysisAreas.contract}
              onChange={(checked) => setFormData(prev => ({
                ...prev,
                analysisAreas: { ...prev.analysisAreas, contract: checked }
              }))}
            />
          </div>
        </div>
      </div>
    </AnalysisFormBase>
  );
}