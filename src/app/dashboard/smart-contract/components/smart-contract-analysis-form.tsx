'use client';

import * as React from 'react';
import { InputForm } from '@/app/dashboard/content/analysis-results/components/tool-components';

interface SmartContractAnalysisFormProps {
  onSubmit: (data: any) => Promise<void>;
  loading: boolean;
}

export function SmartContractAnalysisForm({ onSubmit, loading }: SmartContractAnalysisFormProps) {
  return (
    <InputForm onSubmit={onSubmit} isLoading={loading}>
      <div className="grid gap-4">
        <div className="grid gap-2">
          <label htmlFor="contractAddress" className="text-sm font-medium">Dirección del Contrato</label>
          <input
            id="contractAddress"
            name="contractAddress"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            placeholder="0x..."
            required
          />
        </div>
        <div className="grid gap-2">
          <label htmlFor="blockchain" className="text-sm font-medium">Blockchain</label>
          <select
            id="blockchain"
            name="blockchain"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="ethereum">Ethereum</option>
            <option value="polygon">Polygon</option>
            <option value="bsc">Binance Smart Chain</option>
            <option value="avalanche">Avalanche</option>
          </select>
        </div>
      </div>
    </InputForm>
  );
}