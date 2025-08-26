'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function NFTTrackingToolPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirigir a la página principal de la herramienta
    router.push('/dashboard/nft-tracking');
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Redirigiendo a NFT Tracking...</p>
      </div>
    </div>
  );
}