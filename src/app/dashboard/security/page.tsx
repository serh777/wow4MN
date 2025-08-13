'use client';

import * as React from 'react';
import { SecurityAnalysisTool } from './components/security-analysis-tool';
import ErrorBoundary from '@/components/error-boundary';
import { Card } from '@/components/ui/card';

export default function SecurityAuditPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Auditoría de Seguridad</h1>
        <p className="text-muted-foreground">
          Evalúa la seguridad de tu proyecto Web3, contratos inteligentes y infraestructura
        </p>
      </div>
      
      <Card className="p-6">
        <ErrorBoundary>
          <SecurityAnalysisTool />
        </ErrorBoundary>
      </Card>
    </div>
  );
}