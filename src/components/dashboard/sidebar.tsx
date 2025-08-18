'use client';

import React from 'react';
import { LogoWithText } from '@/components/ui/logo';
import { IconWrapper } from '@/components/ui/icon-wrapper';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Sidebar() {
  const pathname = usePathname();
  
  // No renderizar el sidebar si estamos en una página de herramientas
  if (pathname.includes('/dashboard/tools/')) {
    return null;
  }

  const isActive = (path: string) => {
    if (path === '/dashboard/competition' && pathname.startsWith('/dashboard/competition')) {
      return true;
    }
    if (path.startsWith('/dashboard/tools/') && pathname === path) {
      return true;
    }
    return pathname === path;
  };

  return (
    <div className="flex h-screen w-64 flex-col border-r bg-background">
      <div className="flex h-16 items-center border-b px-4">
        <LogoWithText />
      </div>
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid items-start px-2 text-sm font-medium">
          <Link
            href="/dashboard"
            className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-colors ${
              isActive('/dashboard') 
                ? 'bg-primary/10 text-primary' 
                : 'hover:bg-primary/10'
            }`}
          >
            <IconWrapper icon="dashboard" className="h-4 w-4" />
            <span>Dashboard</span>
          </Link>
          
          {/* Herramientas de Análisis SEO */}
          <div className="mt-6">
            <h4 className="mb-2 px-4 text-xs font-semibold text-muted-foreground">Análisis SEO Web3</h4>
            <div className="grid gap-1">
              <Link
                href="/dashboard/metadata"
                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-colors ${
                  isActive('/dashboard/metadata') 
                    ? 'bg-primary/10 text-primary' 
                    : 'hover:bg-primary/10'
                }`}
              >
                <IconWrapper icon="metadata" className="h-4 w-4" />
                <span>Análisis de Metadatos</span>
              </Link>
              <Link
                href="/dashboard/content"
                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-colors ${
                  isActive('/dashboard/content') 
                    ? 'bg-primary/10 text-primary' 
                    : 'hover:bg-primary/10'
                }`}
              >
                <IconWrapper icon="content" className="h-4 w-4" />
                <span>Auditoría de Contenido</span>
              </Link>
              <Link
                href="/dashboard/keywords"
                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-colors ${
                  isActive('/dashboard/keywords') 
                    ? 'bg-primary/10 text-primary' 
                    : 'hover:bg-primary/10'
                }`}
              >
                <IconWrapper icon="keywords" className="h-4 w-4" />
                <span>Análisis de Keywords</span>
              </Link>
              <Link
                href="/dashboard/links"
                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-colors ${
                  isActive('/dashboard/links') 
                    ? 'bg-primary/10 text-primary' 
                    : 'hover:bg-primary/10'
                }`}
              >
                <IconWrapper icon="links" className="h-4 w-4" />
                <span>Análisis de Enlaces</span>
              </Link>
              <Link
                href="/dashboard/backlinks"
                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-colors ${
                  isActive('/dashboard/backlinks') 
                    ? 'bg-primary/10 text-primary' 
                    : 'hover:bg-primary/10'
                }`}
              >
                <IconWrapper icon="analytics" className="h-4 w-4" />
                <span>Análisis de Backlinks</span>
              </Link>
              <Link
                href="/dashboard/performance"
                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-colors ${
                  isActive('/dashboard/performance') 
                    ? 'bg-primary/10 text-primary' 
                    : 'hover:bg-primary/10'
                }`}
              >
                <IconWrapper icon="performance" className="h-4 w-4" />
                <span>Análisis de Rendimiento</span>
              </Link>
              <Link
                href="/dashboard/competition"
                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-colors ${
                  isActive('/dashboard/competition') 
                    ? 'bg-primary/10 text-primary' 
                    : 'hover:bg-primary/10'
                }`}
              >
                <IconWrapper icon="competition" className="h-4 w-4" />
                <span>Análisis de Competencia</span>
              </Link>
            </div>
          </div>

          {/* Herramientas Web3 */}
          <div className="mt-6">
            <h4 className="mb-2 px-4 text-xs font-semibold text-muted-foreground">Web3 y Blockchain</h4>
            <div className="grid gap-1">
              <Link
                href="/dashboard/blockchain"
                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-colors ${
                  isActive('/dashboard/blockchain') 
                    ? 'bg-primary/10 text-primary' 
                    : 'hover:bg-primary/10'
                }`}
              >
                <IconWrapper icon="blockchain" className="h-4 w-4" />
                <span>Análisis Blockchain</span>
              </Link>
              <Link
                href="/dashboard/smart-contract"
                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-colors ${
                  isActive('/dashboard/smart-contract') 
                    ? 'bg-primary/10 text-primary' 
                    : 'hover:bg-primary/10'
                }`}
              >
                <IconWrapper icon="cpu" className="h-4 w-4" />
                <span>Smart Contract</span>
              </Link>
              <Link
                href="/dashboard/authority-tracking"
                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-colors ${
                  isActive('/dashboard/authority-tracking') 
                    ? 'bg-primary/10 text-primary' 
                    : 'hover:bg-primary/10'
                }`}
              >
                <IconWrapper icon="award" className="h-4 w-4" />
                <span>Autoridad Descentralizada</span>
              </Link>
              <Link
                href="/dashboard/nft-tracking"
                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-colors ${
                  isActive('/dashboard/nft-tracking') 
                    ? 'bg-primary/10 text-primary' 
                    : 'hover:bg-primary/10'
                }`}
              >
                <IconWrapper icon="gem" className="h-4 w-4" />
                <span>NFT Tracking</span>
              </Link>
              <Link
                href="/dashboard/ecosystem-interactions"
                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-colors ${
                  isActive('/dashboard/ecosystem-interactions') 
                    ? 'bg-primary/10 text-primary' 
                    : 'hover:bg-primary/10'
                }`}
              >
                <IconWrapper icon="network" className="h-4 w-4" />
                <span>Interacciones Ecosistema</span>
              </Link>
              <Link
                href="/dashboard/smart-contract"
                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-colors ${
                  isActive('/dashboard/smart-contract') 
                    ? 'bg-primary/10 text-primary' 
                    : 'hover:bg-primary/10'
                }`}
              >
                <IconWrapper icon="cpu" className="h-4 w-4" />
                <span>Smart Contract</span>
              </Link>
              <Link
                href="/dashboard/authority-tracking"
                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-colors ${
                  isActive('/dashboard/authority-tracking') 
                    ? 'bg-primary/10 text-primary' 
                    : 'hover:bg-primary/10'
                }`}
              >
                <IconWrapper icon="award" className="h-4 w-4" />
                <span>Autoridad Descentralizada</span>
              </Link>
              <Link
                href="/dashboard/nft-tracking"
                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-colors ${
                  isActive('/dashboard/nft-tracking') 
                    ? 'bg-primary/10 text-primary' 
                    : 'hover:bg-primary/10'
                }`}
              >
                <IconWrapper icon="gem" className="h-4 w-4" />
                <span>NFT Tracking</span>
              </Link>
              <Link
                href="/dashboard/ecosystem-interactions"
                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-colors ${
                  isActive('/dashboard/ecosystem-interactions') 
                    ? 'bg-primary/10 text-primary' 
                    : 'hover:bg-primary/10'
                }`}
              >
                <IconWrapper icon="network" className="h-4 w-4" />
                <span>Interacciones Ecosistema</span>
              </Link>
              <Link
                href="/dashboard/social-web3"
                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-colors ${
                  isActive('/dashboard/social-web3') 
                    ? 'bg-primary/10 text-primary' 
                    : 'hover:bg-primary/10'
                }`}
              >
                <IconWrapper icon="social" className="h-4 w-4" />
                <span>Social Web3</span>
              </Link>
            </div>
          </div>

          {/* Herramientas de Seguridad */}
          <div className="mt-6">
            <h4 className="mb-2 px-4 text-xs font-semibold text-muted-foreground">Seguridad</h4>
            <div className="grid gap-1">
              <Link
                href="/dashboard/security"
                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-colors ${
                  isActive('/dashboard/security') 
                    ? 'bg-primary/10 text-primary' 
                    : 'hover:bg-primary/10'
                }`}
              >
                <IconWrapper icon="shield" className="h-4 w-4" />
                <span>Auditoría de Seguridad</span>
              </Link>
              <Link
                href="/dashboard/content-authenticity"
                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-colors ${
                  isActive('/dashboard/content-authenticity') 
                    ? 'bg-primary/10 text-primary' 
                    : 'hover:bg-primary/10'
                }`}
              >
                <IconWrapper icon="lock" className="h-4 w-4" />
                <span>Autenticidad</span>
              </Link>
            </div>
          </div>

          {/* Herramientas de Metaverso */}
          <div className="mt-6">
            <h4 className="mb-2 px-4 text-xs font-semibold text-muted-foreground">Metaverso</h4>
            <div className="grid gap-1">
              <Link
                href="/dashboard/metaverse-optimizer"
                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-colors ${
                  isActive('/dashboard/metaverse-optimizer') 
                    ? 'bg-primary/10 text-primary' 
                    : 'hover:bg-primary/10'
                }`}
              >
                <IconWrapper icon="palette" className="h-4 w-4" />
                <span>Optimizador Metaverso</span>
              </Link>
            </div>
          </div>

          {/* Herramientas de IA */}
          <div className="mt-6">
            <h4 className="mb-2 px-4 text-xs font-semibold text-muted-foreground">Inteligencia Artificial</h4>
            <div className="grid gap-1">
              <Link
                href="/dashboard/ai-assistant"
                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-colors ${
                  isActive('/dashboard/ai-assistant') 
                    ? 'bg-primary/10 text-primary' 
                    : 'hover:bg-primary/10'
                }`}
              >
                <IconWrapper icon="ai" className="h-4 w-4" />
                <span>Asistente IA Web3</span>
              </Link>
            </div>
          </div>

          {/* Herramientas de Análisis Histórico */}
          <div className="mt-6">
            <h4 className="mb-2 px-4 text-xs font-semibold text-muted-foreground">Análisis Histórico</h4>
            <div className="grid gap-1">
              <Link
                href="/dashboard/historical"
                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-colors ${
                  isActive('/dashboard/historical') 
                    ? 'bg-primary/10 text-primary' 
                    : 'hover:bg-primary/10'
                }`}
              >
                <IconWrapper icon="activity" className="h-4 w-4" />
                <span>Análisis Histórico</span>
              </Link>
            </div>
          </div>

          {/* Reportes y Configuración */}
          <div className="mt-6">
            <h4 className="mb-2 px-4 text-xs font-semibold text-muted-foreground">Reportes y Configuración</h4>
            <div className="grid gap-1">
              <Link
                href="/dashboard/reports"
                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-colors ${
                  isActive('/dashboard/reports') 
                    ? 'bg-primary/10 text-primary' 
                    : 'hover:bg-primary/10'
                }`}
              >
                <IconWrapper icon="fileText" className="h-4 w-4" />
                <span>Generador de Informes</span>
              </Link>
              <Link
                href="/dashboard/wallet"
                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-colors ${
                  isActive('/dashboard/wallet') 
                    ? 'bg-primary/10 text-primary' 
                    : 'hover:bg-primary/10'
                }`}
              >
                <IconWrapper icon="wallet" className="h-4 w-4" />
                <span>Conectar Wallet</span>
              </Link>
              <Link
                href="/dashboard/indexers"
                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-colors ${
                  isActive('/dashboard/indexers') 
                    ? 'bg-primary/10 text-primary' 
                    : 'hover:bg-primary/10'
                }`}
              >
                <IconWrapper icon="database" className="h-4 w-4" />
                <span>Indexador Blockchain</span>
              </Link>
            </div>
          </div>
        </nav>
      </div>
      <div className="mt-auto border-t p-4">
        <Link
          href="/dashboard/settings"
          className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-colors ${
            isActive('/dashboard/settings') 
              ? 'bg-primary/10 text-primary' 
              : 'hover:bg-primary/10'
          }`}
        >
          <IconWrapper icon="settings" className="h-4 w-4" />
          <span>Configuración</span>
        </Link>
        <Link
          href="/dashboard/support"
          className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-colors ${
            isActive('/dashboard/support') 
              ? 'bg-primary/10 text-primary' 
              : 'hover:bg-primary/10'
          }`}
        >
          <IconWrapper icon="support" className="h-4 w-4" />
          <span>Soporte</span>
        </Link>
      </div>
    </div>
  );
}