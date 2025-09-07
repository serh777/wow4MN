'use client';

import React, { useState, useEffect } from 'react';
import { Logo } from '@/components/ui/logo';
import { IconWrapper } from '@/components/ui/icon-wrapper';
import { ThemeToggle } from '@/components/theme/theme-toggle';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronLeft, ChevronRight, ChevronDown, ChevronUp } from 'lucide-react';

export function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedSections, setExpandedSections] = useState<{[key: string]: boolean}>({
    'seo': true,
    'web3': false,
    'security': false,
    'metaverse': false,
    'ai': false,
    'historical': false,
    'reports': false,
    'system': false
  });

  // Cargar estado del sidebar desde localStorage
  useEffect(() => {
    const savedState = localStorage.getItem('dashboard_sidebar_collapsed');
    if (savedState) {
      setIsCollapsed(JSON.parse(savedState));
    }
  }, []);

  // Guardar estado del sidebar en localStorage
  useEffect(() => {
    localStorage.setItem('dashboard_sidebar_collapsed', JSON.stringify(isCollapsed));
  }, [isCollapsed]);

  // Comentado temporalmente para evitar problemas de renderizado
  // if (pathname.includes('/dashboard/tools/')) {
  //   return null;
  // }

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const toggleSection = (sectionKey: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionKey]: !prev[sectionKey]
    }));
  };

  const isActive = (path: string) => {
    if (path === '/dashboard/competition' && pathname.startsWith('/dashboard/competition')) {
      return true;
    }
    if (path.startsWith('/dashboard/tools/') && pathname === path) {
      return true;
    }
    return pathname === path;
  };

  const NavLink = ({ href, icon, children, tooltip }: {
    href: string;
    icon: string;
    children: React.ReactNode;
    tooltip?: string;
  }) => {
    const active = isActive(href);
    return (
      <Link
        href={href}
        className={`nav-link ${active ? 'active' : ''} relative group`}
      >
        <IconWrapper icon={icon} className="h-4 w-4" />
        <span>{children}</span>
        {isCollapsed && tooltip && (
          <div className="nav-link-tooltip">
            {tooltip}
          </div>
        )}
      </Link>
    );
  };

  const CollapsibleSection = ({ sectionKey, title, children }: {
    sectionKey: string;
    title: string;
    children: React.ReactNode;
  }) => {
    const isExpanded = expandedSections[sectionKey];
    const shouldShowContent = isCollapsed || isExpanded;
    
    return (
      <div className="nav-section">
        {!isCollapsed && (
          <div className="nav-section-title">
            <button
              onClick={() => toggleSection(sectionKey)}
              className="collapsible-header"
            >
              <span>{title}</span>
              <div className="chevron-icon">
                {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </div>
            </button>
          </div>
        )}
        <div className={`nav-section-content ${shouldShowContent ? 'visible' : 'hidden'}`}>
          {children}
        </div>
      </div>
     );
   };

  return (
    <div className={`sidebar-container ${isCollapsed ? 'sidebar-collapsed' : 'sidebar-expanded'} custom-scrollbar`}>
      {/* Toggle Button - Más discreto */}
      <button
        onClick={toggleSidebar}
        className="sidebar-toggle-discrete"
        title={isCollapsed ? 'Expandir sidebar' : 'Colapsar sidebar'}
      >
        {isCollapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
      </button>

      {/* Header */}
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <Logo size="small" />
          <span>WowSEOWeb3</span>
        </div>
      </div>

      {/* Navigation */}
      <div className="sidebar-nav">
        {/* Dashboard Principal */}
        <div className="nav-section">
          <div className="nav-section-title simple-title">Principal</div>
          <NavLink href="/dashboard" icon="dashboard" tooltip="Dashboard">
            Dashboard
          </NavLink>
          <NavLink href="/dashboard/ai-assistant" icon="zap" tooltip="Análisis Unificado">
            Análisis Unificado
          </NavLink>
        </div>

        {/* Herramientas de Análisis SEO */}
        <CollapsibleSection sectionKey="seo" title="SEO & Análisis Web3">
          <NavLink href="/dashboard/metadata" icon="metadata" tooltip="Metadatos">
            Metadatos
          </NavLink>
          <NavLink href="/dashboard/content" icon="content" tooltip="Contenido">
            Contenido
          </NavLink>
          <NavLink href="/dashboard/keywords" icon="keywords" tooltip="Keywords">
            Keywords
          </NavLink>
          <NavLink href="/dashboard/links" icon="links" tooltip="Enlaces">
            Enlaces
          </NavLink>
          <NavLink href="/dashboard/backlinks" icon="analytics" tooltip="Backlinks">
            Backlinks
          </NavLink>
          <NavLink href="/dashboard/performance" icon="performance" tooltip="Rendimiento">
            Rendimiento
          </NavLink>
          <NavLink href="/dashboard/competition" icon="competition" tooltip="Competencia">
            Competencia
          </NavLink>
        </CollapsibleSection>

        {/* Herramientas Web3 */}
        <CollapsibleSection sectionKey="web3" title="Web3 & Blockchain">
          <NavLink href="/dashboard/blockchain" icon="blockchain" tooltip="Blockchain">
            Blockchain
          </NavLink>
          <NavLink href="/dashboard/smart-contract" icon="cpu" tooltip="Smart Contract">
            Smart Contracts
          </NavLink>
          <NavLink href="/dashboard/authority-tracking" icon="award" tooltip="Autoridad">
            Autoridad Web3
          </NavLink>
          <NavLink href="/dashboard/nft-tracking" icon="gem" tooltip="NFT Tracking">
            NFT Tracking
          </NavLink>
          <NavLink href="/dashboard/ecosystem-interactions" icon="network" tooltip="Ecosistema">
            Ecosistema
          </NavLink>
          <NavLink href="/dashboard/social-web3" icon="social" tooltip="Social Web3">
            Social Web3
          </NavLink>
        </CollapsibleSection>

        {/* Herramientas de Seguridad */}
        <CollapsibleSection sectionKey="security" title="Seguridad">
          <NavLink href="/dashboard/security" icon="shield" tooltip="Seguridad">
            Auditoría de Seguridad
          </NavLink>
          <NavLink href="/dashboard/content-authenticity" icon="lock" tooltip="Autenticidad">
            Autenticidad
          </NavLink>
        </CollapsibleSection>

        {/* Herramientas de Metaverso */}
        <CollapsibleSection sectionKey="metaverse" title="Metaverso">
          <NavLink href="/dashboard/metaverse-optimizer" icon="palette" tooltip="Metaverso">
            Optimizador Metaverso
          </NavLink>
        </CollapsibleSection>

        {/* Herramientas de IA */}
        <CollapsibleSection sectionKey="ai" title="Inteligencia Artificial">
          <NavLink href="/dashboard/ai-assistant" icon="ai" tooltip="IA Assistant">
            Asistente IA Web3
          </NavLink>
        </CollapsibleSection>

        {/* Herramientas de Análisis Histórico */}
        <CollapsibleSection sectionKey="historical" title="Análisis Histórico">
          <NavLink href="/dashboard/historical" icon="activity" tooltip="Histórico">
            Análisis Histórico
          </NavLink>
        </CollapsibleSection>

        {/* Reportes y Configuración */}
        <CollapsibleSection sectionKey="reports" title="Reportes & Config">
          <NavLink href="/dashboard/reports" icon="fileText" tooltip="Reportes">
            Generador de Informes
          </NavLink>
          <NavLink href="/dashboard/wallet" icon="wallet" tooltip="Wallet">
            Conectar Wallet
          </NavLink>
          <NavLink href="/dashboard/indexers" icon="database" tooltip="Indexadores">
            Indexador Blockchain
          </NavLink>
        </CollapsibleSection>

        {/* Configuración y Soporte */}
        <CollapsibleSection sectionKey="system" title="Sistema">
          <NavLink href="/dashboard/test-tools" icon="activity" tooltip="Test Herramientas">
            Test Herramientas
          </NavLink>
          <NavLink href="/dashboard/settings" icon="settings" tooltip="Configuración">
            Configuración
          </NavLink>
          <NavLink href="/dashboard/support" icon="support" tooltip="Soporte">
            Soporte
          </NavLink>
          
          {/* Toggle de Tema */}
          <div className="nav-link theme-toggle-container">
            <div className="nav-link-content">
              <IconWrapper icon="palette" className="nav-icon" />
              {!isCollapsed && (
                <span className="nav-text">Cambiar Tema</span>
              )}
            </div>
            <div className="theme-toggle-wrapper">
              <ThemeToggle />
            </div>
          </div>
        </CollapsibleSection>
      </div>
    </div>
  );
}