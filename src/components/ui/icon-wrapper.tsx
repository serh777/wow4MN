import React from 'react';
import { Icons } from '@/components/icons';
import { cn } from '@/lib/utils';

interface IconWrapperProps {
  icon: string;
  className?: string;
}

export function IconWrapper({ icon, className }: IconWrapperProps) {
  // Map icon string to the actual icon component
  const IconComponent = getIconComponent(icon, className);
  
  // Si el icono no existe, mostrar un icono específico según el tipo
  if (!IconComponent) {
    // Asignar iconos alternativos según el tipo de herramienta
    if (icon === 'competition') {
      return Icons.settings ? <Icons.settings className={className} /> : null;
    } else if (icon === 'reports' || icon === 'fileText') {
      return Icons.settings ? <Icons.settings className={className} /> : null;
    } else if (icon === 'content') {
      return Icons.settings ? <Icons.settings className={className} /> : null;
    } else if (icon === 'social-web3') {
      return Icons.moon ? <Icons.moon className={className} /> : null;
    } else if (icon === 'ai') {
      return Icons.sun ? <Icons.sun className={className} /> : null;
    }
    
    // Icono de respaldo genérico
    return Icons.dashboard ? <Icons.dashboard className={className} /> : null;
  }
  
  return IconComponent;
}

function getIconComponent(icon: string, className?: string) {
  switch (icon) {
    // Iconos básicos
    case 'dashboard':
      return Icons.dashboard ? <Icons.dashboard className={className} /> : null;
    case 'settings':
      return Icons.settings ? <Icons.settings className={className} /> : null;
    case 'support':
      return Icons.support ? <Icons.support className={className} /> : null;
    
    // Iconos de herramientas SEO
    case 'metadata':
      return Icons.metadata ? <Icons.metadata className={className} /> : null;
    case 'content':
      return Icons.content ? <Icons.content className={className} /> : null;
    case 'keywords':
      return Icons.keywords ? <Icons.keywords className={className} /> : null;
    case 'links':
      return Icons.links ? <Icons.links className={className} /> : null;
    case 'performance':
      return Icons.performance ? <Icons.performance className={className} /> : null;
    case 'competition':
      return Icons.analytics ? <Icons.analytics className={className} /> : null;
    case 'reports':
    case 'fileText':
      return Icons.save ? <Icons.save className={className} /> : null;
    
    // Iconos Web3
    case 'wallet':
      return Icons.wallet ? <Icons.wallet className={className} /> : null;
    case 'blockchain':
      return Icons.blockchain ? <Icons.blockchain className={className} /> : null;
    case 'shield':
      return Icons.shield ? <Icons.shield className={className} /> : null;
    case 'database':
      return Icons.database ? <Icons.database className={className} /> : null;
    
    // Iconos IA y Social
    case 'ai':
      return Icons.ai ? <Icons.ai className={className} /> : null;
    case 'social':
      return Icons.twitter ? <Icons.twitter className={className} /> : null;
    
    // Iconos para nuevas herramientas
    case 'success':
      return Icons.success ? <Icons.success className={className} /> : null;
    case 'analytics':
      return Icons.analytics ? <Icons.analytics className={className} /> : null;
    
    // Otros iconos
    case 'sun':
      return Icons.sun ? <Icons.sun className={className} /> : null;
    case 'moon':
      return Icons.moon ? <Icons.moon className={className} /> : null;
    case 'loading':
    case 'spinner':
      return Icons.spinner ? <Icons.spinner className={className} /> : null;
    case 'sparkles':
      return Icons.sparkles ? <Icons.sparkles className={className} /> : null;
    case 'target':
      return Icons.target ? <Icons.target className={className} /> : null;
    case 'alert':
      return Icons.alert ? <Icons.alert className={className} /> : null;
    case 'warning':
      return Icons.warning ? <Icons.warning className={className} /> : null;
    case 'lightbulb':
      return Icons.lightbulb ? <Icons.lightbulb className={className} /> : null;
    case 'trending-up':
    case 'trendingUp':
      return Icons.trendingUp ? <Icons.trendingUp className={className} /> : null;
    case 'x':
    case 'close':
      return Icons.close ? <Icons.close className={className} /> : null;
    case 'info':
      return Icons.info ? <Icons.info className={className} /> : null;
    
    default:
      return null;
  }
}