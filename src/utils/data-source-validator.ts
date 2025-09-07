/**
 * Validador de fuentes de datos y configuración de APIs
 * Verifica que todas las fuentes estén correctamente configuradas
 */

import { DATA_SOURCES, TOOL_DATA_MAPPINGS, validateDataSourceConfig } from '@/config/data-sources-config';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  recommendations: string[];
}

export interface APIKeyStatus {
  key: string;
  name: string;
  status: 'valid' | 'invalid' | 'missing' | 'unknown';
  lastChecked?: Date;
  errorMessage?: string;
}

// Mapeo de variables de entorno a fuentes de datos
const ENV_VAR_MAPPING: Record<string, string[]> = {
  'NEXT_PUBLIC_ETHERSCAN_API_KEY': ['etherscan'],
  'NEXT_PUBLIC_ALCHEMY_API_KEY': ['alchemy'],
  'NEXT_PUBLIC_ANTHROPIC_API_KEY': ['anthropic'],
  'NEXT_PUBLIC_GOOGLE_API_KEY': ['google_apis'],
  'NEXT_PUBLIC_INFURA_PROJECT_ID': ['custom_indexer'],
  'NEXT_PUBLIC_REOWN_API_KEY': ['social_web3_aggregator'],
  'NEXT_PUBLIC_DUNE_API_KEY': ['social_web3_aggregator']
};

/**
 * Valida la configuración completa de fuentes de datos
 */
export async function validateDataSources(): Promise<ValidationResult> {
  const result: ValidationResult = {
    isValid: true,
    errors: [],
    warnings: [],
    recommendations: []
  };

  // 1. Validar configuración básica
  const configValidation = validateDataSourceConfig();
  if (!configValidation.isValid) {
    result.errors.push(...configValidation.errors);
    result.isValid = false;
  }

  // 2. Validar variables de entorno
  const envValidation = validateEnvironmentVariables();
  result.errors.push(...envValidation.errors);
  result.warnings.push(...envValidation.warnings);
  result.recommendations.push(...envValidation.recommendations);

  if (envValidation.errors.length > 0) {
    result.isValid = false;
  }

  // 3. Validar conectividad de APIs (opcional, puede ser lento)
  // const connectivityValidation = await validateAPIConnectivity();
  // result.warnings.push(...connectivityValidation.warnings);

  // 4. Generar recomendaciones de optimización
  const optimizationRecommendations = generateOptimizationRecommendations();
  result.recommendations.push(...optimizationRecommendations);

  return result;
}

/**
 * Valida que las variables de entorno necesarias estén configuradas
 */
function validateEnvironmentVariables(): ValidationResult {
  const result: ValidationResult = {
    isValid: true,
    errors: [],
    warnings: [],
    recommendations: []
  };

  // Variables críticas
  const criticalVars = [
    'NEXT_PUBLIC_ETHERSCAN_API_KEY',
    'NEXT_PUBLIC_ALCHEMY_API_KEY',
    'NEXT_PUBLIC_ANTHROPIC_API_KEY'
  ];

  // Variables opcionales pero recomendadas
  const optionalVars = [
    'NEXT_PUBLIC_GOOGLE_API_KEY',
    'NEXT_PUBLIC_INFURA_PROJECT_ID',
    'NEXT_PUBLIC_REOWN_API_KEY',
    'NEXT_PUBLIC_DUNE_API_KEY'
  ];

  // Verificar variables críticas
  criticalVars.forEach(varName => {
    const value = process.env[varName];
    if (!value || value.trim() === '') {
      result.errors.push(`Variable crítica faltante: ${varName}`);
      result.isValid = false;
    } else if (value.includes('your-') || value.includes('placeholder')) {
      result.errors.push(`Variable ${varName} contiene valor placeholder`);
      result.isValid = false;
    }
  });

  // Verificar variables opcionales
  optionalVars.forEach(varName => {
    const value = process.env[varName];
    if (!value || value.trim() === '') {
      result.warnings.push(`Variable opcional faltante: ${varName}`);
      result.recommendations.push(`Configura ${varName} para funcionalidad completa`);
    }
  });

  // Verificar configuración del indexador
  const indexerVars = ['START_BLOCK', 'BATCH_SIZE', 'ETHEREUM_RPC_URL'];
  indexerVars.forEach(varName => {
    const value = process.env[varName];
    if (!value) {
      result.warnings.push(`Variable del indexador faltante: ${varName}`);
    }
  });

  return result;
}

/**
 * Valida la conectividad con las APIs externas
 */
export async function validateAPIConnectivity(): Promise<ValidationResult> {
  const result: ValidationResult = {
    isValid: true,
    errors: [],
    warnings: [],
    recommendations: []
  };

  const apiTests = [
    {
      name: 'Etherscan',
      test: () => testEtherscanAPI()
    },
    {
      name: 'Alchemy',
      test: () => testAlchemyAPI()
    },
    {
      name: 'Anthropic',
      test: () => testAnthropicAPI()
    }
  ];

  for (const apiTest of apiTests) {
    try {
      const isConnected = await apiTest.test();
      if (!isConnected) {
        result.warnings.push(`No se pudo conectar a ${apiTest.name}`);
      }
    } catch (error) {
      result.warnings.push(`Error conectando a ${apiTest.name}: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  return result;
}

/**
 * Prueba la conectividad con Etherscan API
 */
async function testEtherscanAPI(): Promise<boolean> {
  const apiKey = process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY;
  if (!apiKey) return false;

  try {
    const response = await fetch(
      `https://api.etherscan.io/api?module=stats&action=ethsupply&apikey=${apiKey}`,
      { method: 'GET', signal: AbortSignal.timeout(5000) }
    );
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Prueba la conectividad con Alchemy API
 */
async function testAlchemyAPI(): Promise<boolean> {
  const apiKey = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY;
  if (!apiKey) return false;

  try {
    const response = await fetch(
      `https://eth-mainnet.g.alchemy.com/v2/${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'eth_blockNumber',
          params: [],
          id: 1
        }),
        signal: AbortSignal.timeout(5000)
      }
    );
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Prueba la conectividad con Anthropic API
 */
async function testAnthropicAPI(): Promise<boolean> {
  const apiKey = process.env.ANTHROPIC_API_KEY || process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY;
  if (!apiKey) return false;

  try {
    const response = await fetch(
      'https://api.anthropic.com/v1/messages',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-3-haiku-20240307',
          max_tokens: 10,
          messages: [{ role: 'user', content: 'test' }]
        }),
        signal: AbortSignal.timeout(5000)
      }
    );
    return response.status !== 401; // 401 = unauthorized, otros errores pueden ser temporales
  } catch {
    return false;
  }
}

/**
 * Genera recomendaciones de optimización
 */
function generateOptimizationRecommendations(): string[] {
  const recommendations: string[] = [];

  // Analizar uso de fuentes de datos
  const sourceUsage = analyzeDataSourceUsage();
  
  if (sourceUsage.underutilized.length > 0) {
    recommendations.push(
      `Fuentes subutilizadas: ${sourceUsage.underutilized.join(', ')}. Considera optimizar su uso.`
    );
  }

  if (sourceUsage.overloaded.length > 0) {
    recommendations.push(
      `Fuentes sobrecargadas: ${sourceUsage.overloaded.join(', ')}. Considera usar fuentes alternativas.`
    );
  }

  // Recomendaciones de caching
  const cachingRecommendations = analyzeCachingStrategy();
  recommendations.push(...cachingRecommendations);

  // Recomendaciones de indexador
  if (shouldUseIndexer()) {
    recommendations.push(
      'Considera activar el indexador personalizado para reducir dependencia de APIs externas'
    );
  }

  return recommendations;
}

/**
 * Analiza el uso de fuentes de datos
 */
function analyzeDataSourceUsage() {
  const usage: Record<string, number> = {};
  
  // Contar cuántas herramientas usan cada fuente
  Object.values(TOOL_DATA_MAPPINGS).forEach(mapping => {
    const sources = [
      mapping.dataSources.primary,
      ...(mapping.dataSources.secondary || [])
    ];
    
    sources.forEach(sourceId => {
      usage[sourceId] = (usage[sourceId] || 0) + 1;
    });
  });

  const totalTools = Object.keys(TOOL_DATA_MAPPINGS).length;
  const underutilized = Object.entries(usage)
    .filter(([_, count]) => count < totalTools * 0.2)
    .map(([sourceId]) => sourceId);
    
  const overloaded = Object.entries(usage)
    .filter(([_, count]) => count > totalTools * 0.8)
    .map(([sourceId]) => sourceId);

  return { usage, underutilized, overloaded };
}

/**
 * Analiza la estrategia de caching
 */
function analyzeCachingStrategy(): string[] {
  const recommendations: string[] = [];
  
  const strategies = Object.values(TOOL_DATA_MAPPINGS)
    .map(mapping => mapping.cachingStrategy);
    
  const noCacheCount = strategies.filter(s => s === 'none').length;
  
  if (noCacheCount > strategies.length * 0.5) {
    recommendations.push(
      'Muchas herramientas no usan cache. Considera implementar caching para mejorar rendimiento.'
    );
  }

  return recommendations;
}

/**
 * Determina si se debería usar el indexador
 */
function shouldUseIndexer(): boolean {
  const indexerTools = Object.values(TOOL_DATA_MAPPINGS)
    .filter(mapping => mapping.dataSources.indexer).length;
    
  const totalTools = Object.keys(TOOL_DATA_MAPPINGS).length;
  
  return indexerTools > totalTools * 0.3; // Si más del 30% de herramientas pueden usar indexador
}

/**
 * Obtiene el estado de las API keys
 */
export function getAPIKeyStatus(): APIKeyStatus[] {
  const statuses: APIKeyStatus[] = [];

  Object.entries(ENV_VAR_MAPPING).forEach(([envVar, sources]) => {
    const value = process.env[envVar];
    const status: APIKeyStatus = {
      key: envVar,
      name: sources.join(', '),
      status: 'unknown',
      lastChecked: new Date()
    };

    if (!value || value.trim() === '') {
      status.status = 'missing';
      status.errorMessage = 'Variable de entorno no configurada';
    } else if (value.includes('your-') || value.includes('placeholder')) {
      status.status = 'invalid';
      status.errorMessage = 'Contiene valor placeholder';
    } else {
      status.status = 'valid';
    }

    statuses.push(status);
  });

  return statuses;
}

/**
 * Genera un reporte completo del estado de las fuentes de datos
 */
export async function generateDataSourceReport(): Promise<{
  validation: ValidationResult;
  apiKeys: APIKeyStatus[];
  sourceUsage: any;
  recommendations: string[];
}> {
  const validation = await validateDataSources();
  const apiKeys = getAPIKeyStatus();
  const sourceUsage = analyzeDataSourceUsage();
  const recommendations = generateOptimizationRecommendations();

  return {
    validation,
    apiKeys,
    sourceUsage,
    recommendations
  };
}

