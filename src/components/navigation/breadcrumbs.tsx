'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
}

interface BreadcrumbsProps {
  items?: BreadcrumbItem[];
  className?: string;
}

// Mapeo de rutas a nombres legibles
const ROUTE_NAMES: Record<string, string> = {
  'dashboard': 'Dashboard',
  'ai-assistant': 'IA Análisis',
  'analysis-results': 'Resultados',
  'links': 'Análisis de Enlaces',
  'backlinks': 'Análisis de Backlinks',
  'performance': 'Análisis de Rendimiento',
  'competition': 'Análisis de Competencia',
  'blockchain': 'Análisis Blockchain',
  'security': 'Auditoría de Seguridad',
  'social-web3': 'Social Web3',
  'content': 'Análisis de Contenido',
  'keywords': 'Análisis de Keywords',
  'metadata': 'Análisis de Metadatos',
  'smart-contract': 'Contratos Inteligentes',
  'authority-tracking': 'Seguimiento de Autoridad',
  'metaverse-optimizer': 'Optimizador de Metaversos',
  'content-authenticity': 'Verificador de Autenticidad',
  'nft-tracking': 'Seguimiento de NFTs',
  'ecosystem-interactions': 'Interacciones de Ecosistema',
  'unified-results': 'Resultados Unificados',
  'settings': 'Configuración',
  'tools': 'Herramientas',
  'wallet': 'Wallet',
  'indexers': 'Indexadores',
  'historical': 'Datos Históricos'
};

export function Breadcrumbs({ items, className = "" }: BreadcrumbsProps) {
  const pathname = usePathname();
  
  // Si se proporcionan items personalizados, usarlos
  if (items) {
    return (
      <nav className={`flex items-center space-x-1 text-sm text-gray-500 ${className}`}>
        <Link 
          href="/dashboard" 
          className="flex items-center hover:text-gray-700 transition-colors"
        >
          <Home className="h-4 w-4" />
        </Link>
        
        {items.map((item, index) => (
          <React.Fragment key={item.href}>
            <ChevronRight className="h-4 w-4 text-gray-400" />
            {index === items.length - 1 ? (
              <span className="flex items-center font-medium text-gray-900">
                {item.icon && <item.icon className="h-4 w-4 mr-1" />}
                {item.label}
              </span>
            ) : (
              <Link 
                href={item.href}
                className="flex items-center hover:text-gray-700 transition-colors"
              >
                {item.icon && <item.icon className="h-4 w-4 mr-1" />}
                {item.label}
              </Link>
            )}
          </React.Fragment>
        ))}
      </nav>
    );
  }
  
  // Generar breadcrumbs automáticamente basado en la ruta actual
  const pathSegments = pathname.split('/').filter(segment => segment !== '');
  
  // Si estamos en la página principal del dashboard, no mostrar breadcrumbs
  if (pathSegments.length <= 1) {
    return null;
  }
  
  const breadcrumbItems: BreadcrumbItem[] = [];
  let currentPath = '';
  
  pathSegments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    
    // Saltar el primer segmento si es 'dashboard' para evitar duplicación
    if (index === 0 && segment === 'dashboard') {
      return;
    }
    
    const label = ROUTE_NAMES[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
    breadcrumbItems.push({
      label,
      href: currentPath
    });
  });
  
  if (breadcrumbItems.length === 0) {
    return null;
  }
  
  return (
    <nav className={`flex items-center space-x-1 text-sm text-gray-500 ${className}`}>
      <Link 
        href="/dashboard" 
        className="flex items-center hover:text-gray-700 transition-colors"
      >
        <Home className="h-4 w-4" />
        <span className="ml-1 hidden sm:inline">Dashboard</span>
      </Link>
      
      {breadcrumbItems.map((item, index) => (
        <React.Fragment key={item.href}>
          <ChevronRight className="h-4 w-4 text-gray-400" />
          {index === breadcrumbItems.length - 1 ? (
            <span className="font-medium text-gray-900 truncate max-w-xs">
              {item.label}
            </span>
          ) : (
            <Link 
              href={item.href}
              className="hover:text-gray-700 transition-colors truncate max-w-xs"
            >
              {item.label}
            </Link>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}

// Hook para usar breadcrumbs personalizados
export function useBreadcrumbs() {
  const [breadcrumbs, setBreadcrumbs] = React.useState<BreadcrumbItem[]>([]);
  
  const updateBreadcrumbs = React.useCallback((items: BreadcrumbItem[]) => {
    setBreadcrumbs(items);
  }, []);
  
  const addBreadcrumb = React.useCallback((item: BreadcrumbItem) => {
    setBreadcrumbs(prev => [...prev, item]);
  }, []);
  
  const removeBreadcrumb = React.useCallback((href: string) => {
    setBreadcrumbs(prev => prev.filter(item => item.href !== href));
  }, []);
  
  const clearBreadcrumbs = React.useCallback(() => {
    setBreadcrumbs([]);
  }, []);
  
  return {
    breadcrumbs,
    updateBreadcrumbs,
    addBreadcrumb,
    removeBreadcrumb,
    clearBreadcrumbs
  };
}

