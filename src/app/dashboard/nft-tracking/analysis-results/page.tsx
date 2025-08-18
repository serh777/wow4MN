'use client';

import React, { Suspense } from 'react';
import { RealNFTAnalysis } from './real-nft-analysis';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

function LoadingFallback() {
  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardContent className="p-8 text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Cargando análisis NFT...</h3>
          <p className="text-muted-foreground">
            Preparando análisis con datos reales de blockchain
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export default function NFTTrackingResultsPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <RealNFTAnalysis />
    </Suspense>
  );
}

