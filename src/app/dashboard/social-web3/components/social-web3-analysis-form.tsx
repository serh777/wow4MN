'use client';

import * as React from 'react';
import { InputForm } from '@/app/dashboard/content/analysis-results/components/tool-components';

interface SocialWeb3AnalysisFormProps {
  onSubmit: (data: any) => Promise<void>;
  loading: boolean;
}

export function SocialWeb3AnalysisForm({ onSubmit, loading }: SocialWeb3AnalysisFormProps) {
  return (
    <InputForm onSubmit={onSubmit} isLoading={loading}>
      <div className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="mastodonHandle" className="text-sm font-medium">Usuario de Mastodon</label>
          <input 
            id="mastodonHandle"
            name="mastodonHandle"
            type="text" 
            placeholder="@usuario@instancia.social" 
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="hiveHandle" className="text-sm font-medium">Usuario de Hive</label>
          <input 
            id="hiveHandle"
            name="hiveHandle"
            type="text" 
            placeholder="@usuario" 
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="lensHandle" className="text-sm font-medium">Perfil de Lens Protocol</label>
          <input 
            id="lensHandle"
            name="lensHandle"
            type="text" 
            placeholder="@usuario.lens" 
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="mirrorHandle" className="text-sm font-medium">Usuario de Mirror.xyz</label>
          <input 
            id="mirrorHandle"
            name="mirrorHandle"
            type="text" 
            placeholder="usuario.mirror.xyz" 
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          />
        </div>
      </div>
    </InputForm>
  );
}