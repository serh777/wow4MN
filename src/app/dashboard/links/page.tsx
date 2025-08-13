'use client';

import React from 'react';
import Link from 'next/link';
import { ToolLayout } from '@/app/dashboard/content/analysis-results/components/tool-components';
import { LinksTool } from './components/links-tool';
import { useLinksAnalysis } from './components/use-links-analysis';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, ExternalLink } from 'lucide-react';

export default function LinksAnalysisPage() {
  const { results } = useLinksAnalysis();

  // Si hay resultados, mostrar mensaje de finalización
  if (results) {
    return (
      <ToolLayout 
        title="Análisis de Enlaces" 
        description="Análisis completado exitosamente"
      >
        <Card className="p-6">
          <div className="text-center space-y-4">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
            <h2 className="text-xl font-semibold">¡Análisis de Enlaces Completado!</h2>
            <p className="text-muted-foreground">
              Tu análisis de enlaces ha sido completado exitosamente. 
              Serás redirigido automáticamente a los resultados detallados.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/dashboard/links/analysis-results">
                <Button className="w-full sm:w-auto">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Ver Resultados Detallados
                </Button>
              </Link>
              <Link href="/dashboard/links">
                <Button variant="outline" className="w-full sm:w-auto">
                  Realizar Nuevo Análisis
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </ToolLayout>
    );
  }

  // Si no hay resultados, mostrar la herramienta
  return (
    <LinksTool />
  );
}