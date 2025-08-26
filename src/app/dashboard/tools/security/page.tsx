'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function SecurityToolPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirigir a la página principal de la herramienta
    router.push('/dashboard/security');
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Redirigiendo a Auditoría de Seguridad...</p>
      </div>
    </div>
  );
}