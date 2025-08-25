'use client';

import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Header } from './header';
import { Footer } from './footer';

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

export function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Evitar problemas de hidratación
  if (!mounted) {
    return (
      <div className="min-h-screen">
        {children}
      </div>
    );
  }
  
  // Detectar si estamos en una ruta de dashboard
  const isDashboardRoute = pathname?.startsWith('/dashboard');
  
  if (isDashboardRoute) {
    // En dashboard, no mostrar header ni footer (el dashboard tiene su propio layout)
    return (
      <div className="min-h-screen">
        {children}
      </div>
    );
  }
  
  // En otras rutas, mostrar el layout normal con header y footer
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}