/**
 * Configuración centralizada de fuentes de datos para WowSeoWeb3
 * Define cómo cada herramienta obtiene sus datos y de qué fuentes
 */

export interface DataSourceConfig {
  id: string;
  name: string;
  type: 'api' | 'indexer' | 'hybrid';
  priority: number; // 1 = alta, 2 = media, 3 = baja
  endpoints: {
    primary: string;
    fallback?: string;
    rateLimit: string;
    authentication: 'api_key' | 'bearer' | 'none';
  };
  reliability: {
    uptime: number; // porcentaje
    responseTime: number; // ms promedio
    errorRate: number; // porcentaje
  };
  cost: {
    type: 'free' | 'freemium' | 'paid';
    limits: string;
    pricing?: string;
  };
}

export interface ToolDataMapping {
  toolId: string;
  toolName: string;
  dataSources: {
    primary: string; // ID de la fuente principal
    secondary?: string[]; // IDs de fuentes de respaldo
    indexer?: string; // ID del indexador si aplica
  };
  dataTypes: string[];
  processingFlow: 'api_only' | 'indexer_only' | 'hybrid' | 'api_with_indexer_fallback';
  cachingStrategy: 'none' | 'short' | 'medium' | 'long';
}

// Configuración de fuentes de datos disponibles
export const DATA_SOURCES: Record<string, DataSourceConfig> = {
  etherscan: {
    id: 'etherscan',
    name: 'Etherscan API',
    type: 'api',
    priority: 1,
    endpoints: {
      primary: 'https://api.etherscan.io/api',
      rateLimit: '5 req/sec',
      authentication: 'api_key'
    },
    reliability: {
      uptime: 99.9,
      responseTime: 200,
      errorRate: 0.1
    },
    cost: {
      type: 'freemium',
      limits: '100,000 req/día gratis',
      pricing: '$199/mes para plan Pro'
    }
  },

  alchemy: {
    id: 'alchemy',
    name: 'Alchemy API',
    type: 'api',
    priority: 1,
    endpoints: {
      primary: 'https://eth-mainnet.g.alchemy.com/v2/',
      rateLimit: '330 CU/sec',
      authentication: 'api_key'
    },
    reliability: {
      uptime: 99.95,
      responseTime: 150,
      errorRate: 0.05
    },
    cost: {
      type: 'freemium',
      limits: '300M CU/mes gratis',
      pricing: 'Variable según uso'
    }
  },

  anthropic: {
    id: 'anthropic',
    name: 'Anthropic Claude',
    type: 'api',
    priority: 1,
    endpoints: {
      primary: 'https://api.anthropic.com/v1/',
      rateLimit: '50 req/min',
      authentication: 'api_key'
    },
    reliability: {
      uptime: 99.5,
      responseTime: 2000,
      errorRate: 0.2
    },
    cost: {
      type: 'paid',
      limits: 'Sin límites con pago',
      pricing: '$15/1M tokens'
    }
  },

  google_apis: {
    id: 'google_apis',
    name: 'Google APIs Suite',
    type: 'api',
    priority: 1,
    endpoints: {
      primary: 'https://www.googleapis.com/',
      rateLimit: '100 req/100sec',
      authentication: 'api_key'
    },
    reliability: {
      uptime: 99.9,
      responseTime: 300,
      errorRate: 0.1
    },
    cost: {
      type: 'freemium',
      limits: 'Variable por servicio',
      pricing: 'Gratis con límites'
    }
  },

  custom_indexer: {
    id: 'custom_indexer',
    name: 'Indexador Personalizado',
    type: 'indexer',
    priority: 2,
    endpoints: {
      primary: 'local://indexer',
      rateLimit: 'Sin límites',
      authentication: 'none'
    },
    reliability: {
      uptime: 95.0,
      responseTime: 100,
      errorRate: 1.0
    },
    cost: {
      type: 'free',
      limits: 'Solo costo de infraestructura',
      pricing: 'Costo de servidor'
    }
  },

  social_web3_aggregator: {
    id: 'social_web3_aggregator',
    name: 'Agregador Social Web3',
    type: 'hybrid',
    priority: 2,
    endpoints: {
      primary: 'multiple://social_platforms',
      rateLimit: 'Variable por plataforma',
      authentication: 'api_key'
    },
    reliability: {
      uptime: 90.0,
      responseTime: 1000,
      errorRate: 2.0
    },
    cost: {
      type: 'freemium',
      limits: 'Variable por plataforma',
      pricing: 'Mayormente gratis'
    }
  }
};

// Mapeo de herramientas a fuentes de datos
export const TOOL_DATA_MAPPINGS: Record<string, ToolDataMapping> = {
  'ai-assistant': {
    toolId: 'ai-assistant',
    toolName: 'IA Analysis',
    dataSources: {
      primary: 'anthropic',
      secondary: ['etherscan', 'alchemy'],
      indexer: 'custom_indexer'
    },
    dataTypes: ['blockchain_data', 'smart_contracts', 'transactions', 'ai_insights'],
    processingFlow: 'hybrid',
    cachingStrategy: 'short'
  },

  'blockchain': {
    toolId: 'blockchain',
    toolName: 'Blockchain Analysis',
    dataSources: {
      primary: 'etherscan',
      secondary: ['alchemy'],
      indexer: 'custom_indexer'
    },
    dataTypes: ['blocks', 'transactions', 'contracts', 'tokens', 'events'],
    processingFlow: 'api_with_indexer_fallback',
    cachingStrategy: 'medium'
  },

  'nft-tracking': {
    toolId: 'nft-tracking',
    toolName: 'NFT Tracking',
    dataSources: {
      primary: 'alchemy',
      secondary: ['etherscan'],
      indexer: 'custom_indexer'
    },
    dataTypes: ['nft_metadata', 'nft_transfers', 'nft_collections', 'marketplace_data'],
    processingFlow: 'api_with_indexer_fallback',
    cachingStrategy: 'long'
  },

  'keywords': {
    toolId: 'keywords',
    toolName: 'Keywords Analysis',
    dataSources: {
      primary: 'google_apis',
      secondary: []
    },
    dataTypes: ['search_volume', 'keyword_difficulty', 'serp_data', 'trends'],
    processingFlow: 'api_only',
    cachingStrategy: 'long'
  },

  'backlinks': {
    toolId: 'backlinks',
    toolName: 'Backlinks Analysis',
    dataSources: {
      primary: 'google_apis',
      secondary: []
    },
    dataTypes: ['backlink_profiles', 'domain_authority', 'link_quality', 'anchor_text'],
    processingFlow: 'api_only',
    cachingStrategy: 'long'
  },

  'performance': {
    toolId: 'performance',
    toolName: 'Performance Analysis',
    dataSources: {
      primary: 'google_apis',
      secondary: ['etherscan']
    },
    dataTypes: ['page_speed', 'core_vitals', 'gas_optimization', 'load_times'],
    processingFlow: 'hybrid',
    cachingStrategy: 'medium'
  },

  'security': {
    toolId: 'security',
    toolName: 'Security Audit',
    dataSources: {
      primary: 'anthropic',
      secondary: ['etherscan', 'alchemy']
    },
    dataTypes: ['vulnerabilities', 'code_analysis', 'risk_assessment', 'audit_reports'],
    processingFlow: 'hybrid',
    cachingStrategy: 'short'
  },

  'social-web3': {
    toolId: 'social-web3',
    toolName: 'Social Web3',
    dataSources: {
      primary: 'social_web3_aggregator',
      secondary: []
    },
    dataTypes: ['social_profiles', 'engagement_metrics', 'content_analysis', 'influence_scores'],
    processingFlow: 'api_only',
    cachingStrategy: 'medium'
  },

  'authority-tracking': {
    toolId: 'authority-tracking',
    toolName: 'Authority Tracking',
    dataSources: {
      primary: 'social_web3_aggregator',
      secondary: ['anthropic']
    },
    dataTypes: ['governance_participation', 'reputation_scores', 'influence_metrics', 'dao_activity'],
    processingFlow: 'hybrid',
    cachingStrategy: 'medium'
  },

  'content-authenticity': {
    toolId: 'content-authenticity',
    toolName: 'Content Authenticity',
    dataSources: {
      primary: 'etherscan',
      secondary: ['alchemy', 'anthropic']
    },
    dataTypes: ['content_hashes', 'blockchain_proofs', 'authenticity_scores', 'provenance_data'],
    processingFlow: 'hybrid',
    cachingStrategy: 'long'
  },

  'metaverse-optimizer': {
    toolId: 'metaverse-optimizer',
    toolName: 'Metaverse Optimizer',
    dataSources: {
      primary: 'anthropic',
      secondary: []
    },
    dataTypes: ['3d_assets', 'vr_metrics', 'user_experience', 'performance_optimization'],
    processingFlow: 'api_only',
    cachingStrategy: 'medium'
  },

  'ecosystem-interactions': {
    toolId: 'ecosystem-interactions',
    toolName: 'Ecosystem Interactions',
    dataSources: {
      primary: 'etherscan',
      secondary: ['alchemy', 'custom_indexer']
    },
    dataTypes: ['cross_chain_data', 'protocol_interactions', 'defi_metrics', 'ecosystem_health'],
    processingFlow: 'api_with_indexer_fallback',
    cachingStrategy: 'medium'
  }
};

// Configuración de indexadores
export const INDEXER_CONFIG = {
  enabled: true,
  networks: ['ethereum', 'polygon', 'bsc', 'arbitrum'],
  startBlock: {
    ethereum: 18000000, // Bloque reciente para empezar
    polygon: 45000000,
    bsc: 30000000,
    arbitrum: 100000000
  },
  batchSize: 100,
  concurrency: 3,
  retryAttempts: 3,
  retryDelay: 1000,
  dataRetention: {
    blocks: '30 days',
    transactions: '90 days',
    events: '180 days',
    processed_data: '1 year'
  }
};

// Funciones de utilidad
export function getDataSourcesForTool(toolId: string): string[] {
  const mapping = TOOL_DATA_MAPPINGS[toolId];
  if (!mapping) return [];
  
  const sources = [mapping.dataSources.primary];
  if (mapping.dataSources.secondary) {
    sources.push(...mapping.dataSources.secondary);
  }
  if (mapping.dataSources.indexer) {
    sources.push(mapping.dataSources.indexer);
  }
  
  return sources;
}

export function getProcessingFlowForTool(toolId: string): string {
  const mapping = TOOL_DATA_MAPPINGS[toolId];
  return mapping?.processingFlow || 'api_only';
}

export function requiresIndexer(toolId: string): boolean {
  const mapping = TOOL_DATA_MAPPINGS[toolId];
  return !!(mapping?.dataSources.indexer || 
           mapping?.processingFlow === 'indexer_only' ||
           mapping?.processingFlow === 'hybrid' ||
           mapping?.processingFlow === 'api_with_indexer_fallback');
}

export function getDataTypesForTool(toolId: string): string[] {
  const mapping = TOOL_DATA_MAPPINGS[toolId];
  return mapping?.dataTypes || [];
}

export function getCachingStrategyForTool(toolId: string): string {
  const mapping = TOOL_DATA_MAPPINGS[toolId];
  return mapping?.cachingStrategy || 'none';
}

// Validación de configuración
export function validateDataSourceConfig(): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  // Verificar que todas las herramientas tengan fuentes válidas
  Object.entries(TOOL_DATA_MAPPINGS).forEach(([toolId, mapping]) => {
    const primarySource = DATA_SOURCES[mapping.dataSources.primary];
    if (!primarySource) {
      errors.push(`Herramienta ${toolId}: fuente primaria '${mapping.dataSources.primary}' no encontrada`);
    }
    
    mapping.dataSources.secondary?.forEach(sourceId => {
      if (!DATA_SOURCES[sourceId]) {
        errors.push(`Herramienta ${toolId}: fuente secundaria '${sourceId}' no encontrada`);
      }
    });
    
    if (mapping.dataSources.indexer && !DATA_SOURCES[mapping.dataSources.indexer]) {
      errors.push(`Herramienta ${toolId}: indexador '${mapping.dataSources.indexer}' no encontrado`);
    }
  });
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

// Estadísticas de uso
export function getDataSourceStats() {
  const stats = {
    totalSources: Object.keys(DATA_SOURCES).length,
    byType: {
      api: 0,
      indexer: 0,
      hybrid: 0
    },
    byReliability: {
      high: 0,
      medium: 0,
      low: 0
    },
    byCost: {
      free: 0,
      freemium: 0,
      paid: 0
    }
  };
  
  Object.values(DATA_SOURCES).forEach(source => {
    stats.byType[source.type]++;
    stats.byCost[source.cost.type]++;
    
    if (source.reliability.uptime >= 99) stats.byReliability.high++;
    else if (source.reliability.uptime >= 95) stats.byReliability.medium++;
    else stats.byReliability.low++;
  });
  
  return stats;
}

