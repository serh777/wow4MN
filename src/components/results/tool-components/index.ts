// Exportaciones de componentes de herramientas para carga lazy
export { default as GenericAnalysisResult } from './generic-analysis-result';
export { default as SecurityAnalysisResult } from './security-analysis-result';
export { default as PerformanceAnalysisResult } from './performance-analysis-result';
export { default as NFTAnalysisResult } from './nft-analysis-result';

// Tipos de props para cada componente
export type { GenericAnalysisResultProps } from './generic-analysis-result';
export type { SecurityAnalysisResultProps } from './security-analysis-result';
export type { PerformanceAnalysisResultProps } from './performance-analysis-result';
export type { NFTAnalysisResultProps } from './nft-analysis-result';

// Mapa de componentes para carga dinámica
export const TOOL_COMPONENT_MAP = {
  'security-scan': () => import('./security-analysis-result'),
  'performance-audit': () => import('./performance-analysis-result'),
  'nft-tracking': () => import('./nft-analysis-result'),
  'blockchain': () => import('./nft-analysis-result'), // Reutilizar para blockchain
  'ai-assistant': () => import('./generic-analysis-result'),
  'social-media': () => import('./generic-analysis-result'),
  'competitor-analysis': () => import('./generic-analysis-result'),
  'seo-analyzer': () => import('./generic-analysis-result'),
  'content-analysis': () => import('./generic-analysis-result'),
  'links': () => import('./generic-analysis-result'),
  'metadata': () => import('./generic-analysis-result'),
  'wallet': () => import('./generic-analysis-result'),
  'historical': () => import('./generic-analysis-result'),
  'keywords': () => import('./generic-analysis-result'),
  'backlinks': () => import('./generic-analysis-result'),
  'authority': () => import('./generic-analysis-result'),
  'smart-contract': () => import('./generic-analysis-result')
} as const;

// Tipo para las claves de herramientas
export type ToolComponentKey = keyof typeof TOOL_COMPONENT_MAP;