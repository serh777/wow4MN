import { DataSource } from '@/components/tooltips/data-source-tooltip';

// Definiciones de fuentes de datos para diferentes herramientas
export const DATA_SOURCES: Record<string, DataSource> = {
  // APIs de SEO y Web
  'google-pagespeed': {
    name: 'Google PageSpeed Insights',
    description: 'API oficial de Google para analizar el rendimiento de páginas web en dispositivos móviles y de escritorio.',
    type: 'api',
    reliability: 'high',
    updateFrequency: 'Tiempo real',
    website: 'https://developers.google.com/speed/pagespeed/insights/',
    apiDocumentation: 'https://developers.google.com/speed/docs/insights/v5/get-started',
    requiresAuth: true,
    pricing: 'free',
    dataTypes: ['Performance', 'Core Web Vitals', 'SEO', 'Accessibility'],
    features: [
      'Métricas de Core Web Vitals',
      'Análisis de rendimiento móvil y escritorio',
      'Sugerencias de optimización',
      'Puntuación de SEO y accesibilidad'
    ],
    limitations: [
      'Límite de 25,000 consultas por día',
      'Análisis limitado a páginas públicas',
      'No incluye datos históricos'
    ],
    lastUpdated: new Date('2024-01-15')
  },

  'semrush': {
    name: 'SEMrush API',
    description: 'Plataforma completa de marketing digital que proporciona datos de SEO, PPC, contenido y redes sociales.',
    type: 'api',
    reliability: 'high',
    updateFrequency: 'Diario',
    website: 'https://www.semrush.com/',
    apiDocumentation: 'https://developer.semrush.com/',
    requiresAuth: true,
    pricing: 'paid',
    dataTypes: ['Keywords', 'Backlinks', 'Competencia', 'Tráfico', 'PPC'],
    features: [
      'Análisis de palabras clave',
      'Investigación de competencia',
      'Auditoría de backlinks',
      'Análisis de tráfico orgánico',
      'Datos de publicidad pagada'
    ],
    limitations: [
      'Requiere suscripción de pago',
      'Límites de API según el plan',
      'Datos principalmente para mercados principales'
    ],
    lastUpdated: new Date('2024-01-10')
  },

  'ahrefs': {
    name: 'Ahrefs API',
    description: 'Herramienta de SEO que proporciona datos completos sobre backlinks, palabras clave y análisis de competencia.',
    type: 'api',
    reliability: 'high',
    updateFrequency: 'Cada 15 minutos',
    website: 'https://ahrefs.com/',
    apiDocumentation: 'https://ahrefs.com/api',
    requiresAuth: true,
    pricing: 'paid',
    dataTypes: ['Backlinks', 'Keywords', 'Ranking', 'Contenido'],
    features: [
      'Base de datos de backlinks más grande',
      'Análisis de palabras clave avanzado',
      'Seguimiento de rankings',
      'Análisis de contenido',
      'Explorador de sitios web'
    ],
    limitations: [
      'Muy costoso para usuarios individuales',
      'Límites estrictos de API',
      'Curva de aprendizaje pronunciada'
    ],
    lastUpdated: new Date('2024-01-12')
  },

  // APIs de Blockchain
  'etherscan': {
    name: 'Etherscan API',
    description: 'Explorador de bloques y plataforma de análisis para la blockchain de Ethereum.',
    type: 'blockchain',
    reliability: 'high',
    updateFrequency: 'Tiempo real',
    website: 'https://etherscan.io/',
    apiDocumentation: 'https://docs.etherscan.io/',
    requiresAuth: true,
    pricing: 'freemium',
    dataTypes: ['Transacciones', 'Contratos', 'Tokens', 'Bloques', 'Cuentas'],
    features: [
      'Datos de transacciones en tiempo real',
      'Información de contratos inteligentes',
      'Análisis de tokens ERC-20/ERC-721',
      'Estadísticas de red',
      'Verificación de contratos'
    ],
    limitations: [
      '5 llamadas por segundo en plan gratuito',
      'Solo datos de Ethereum mainnet por defecto',
      'Historial limitado en plan gratuito'
    ],
    lastUpdated: new Date('2024-01-14')
  },

  'alchemy': {
    name: 'Alchemy API',
    description: 'Plataforma de desarrollo blockchain que proporciona APIs robustas para Ethereum y otras redes.',
    type: 'blockchain',
    reliability: 'high',
    updateFrequency: 'Tiempo real',
    website: 'https://www.alchemy.com/',
    apiDocumentation: 'https://docs.alchemy.com/',
    requiresAuth: true,
    pricing: 'freemium',
    dataTypes: ['NFTs', 'Transacciones', 'Contratos', 'Tokens', 'DeFi'],
    features: [
      'APIs de NFT especializadas',
      'Soporte multi-chain',
      'Webhooks en tiempo real',
      'Análisis avanzado de transacciones',
      'Herramientas de desarrollo'
    ],
    limitations: [
      'Límites de requests según el plan',
      'Algunas funciones requieren plan de pago',
      'Complejidad para usuarios principiantes'
    ],
    lastUpdated: new Date('2024-01-13')
  },

  'moralis': {
    name: 'Moralis API',
    description: 'Plataforma Web3 que simplifica el desarrollo de aplicaciones blockchain con APIs fáciles de usar.',
    type: 'blockchain',
    reliability: 'high',
    updateFrequency: 'Tiempo real',
    website: 'https://moralis.io/',
    apiDocumentation: 'https://docs.moralis.io/',
    requiresAuth: true,
    pricing: 'freemium',
    dataTypes: ['NFTs', 'Tokens', 'DeFi', 'Transacciones', 'Precios'],
    features: [
      'APIs simples para Web3',
      'Soporte para múltiples blockchains',
      'Datos de NFT y tokens',
      'Información de DeFi',
      'Autenticación Web3'
    ],
    limitations: [
      'Límites de requests en plan gratuito',
      'Algunas chains requieren plan premium',
      'Documentación en constante cambio'
    ],
    lastUpdated: new Date('2024-01-11')
  },

  'coingecko': {
    name: 'CoinGecko API',
    description: 'API completa de datos de criptomonedas que proporciona precios, volúmenes, capitalización de mercado y más.',
    type: 'api',
    reliability: 'high',
    updateFrequency: 'Cada minuto',
    website: 'https://www.coingecko.com/',
    apiDocumentation: 'https://www.coingecko.com/en/api/documentation',
    requiresAuth: false,
    pricing: 'freemium',
    dataTypes: ['Precios', 'Volumen', 'Market Cap', 'Datos históricos'],
    features: [
      'Datos de más de 10,000 criptomonedas',
      'Información de exchanges',
      'Datos históricos extensos',
      'Métricas de DeFi',
      'Datos de NFT'
    ],
    limitations: [
      '50 llamadas por minuto en plan gratuito',
      'Datos con retraso en plan gratuito',
      'Funciones avanzadas requieren suscripción'
    ],
    lastUpdated: new Date('2024-01-16')
  },

  // APIs de IA
  'openai': {
    name: 'OpenAI API',
    description: 'API de inteligencia artificial que proporciona acceso a modelos de lenguaje avanzados como GPT-4.',
    type: 'ai',
    reliability: 'high',
    updateFrequency: 'Tiempo real',
    website: 'https://openai.com/',
    apiDocumentation: 'https://platform.openai.com/docs',
    requiresAuth: true,
    pricing: 'paid',
    dataTypes: ['Texto', 'Análisis', 'Generación', 'Embeddings'],
    features: [
      'Modelos de lenguaje avanzados',
      'Análisis de sentimientos',
      'Generación de contenido',
      'Embeddings para búsqueda semántica',
      'Moderación de contenido'
    ],
    limitations: [
      'Costo por token utilizado',
      'Límites de rate según el plan',
      'Restricciones de contenido',
      'Posibles tiempos de espera en alta demanda'
    ],
    lastUpdated: new Date('2024-01-15')
  },

  'anthropic': {
    name: 'Anthropic Claude API',
    description: 'API de IA conversacional desarrollada por Anthropic, enfocada en ser útil, inofensiva y honesta.',
    type: 'ai',
    reliability: 'high',
    updateFrequency: 'Tiempo real',
    website: 'https://www.anthropic.com/',
    apiDocumentation: 'https://docs.anthropic.com/',
    requiresAuth: true,
    pricing: 'paid',
    dataTypes: ['Texto', 'Análisis', 'Conversación', 'Razonamiento'],
    features: [
      'Conversaciones largas y contextuales',
      'Análisis de documentos extensos',
      'Razonamiento complejo',
      'Seguridad y alineación avanzada',
      'Soporte multiidioma'
    ],
    limitations: [
      'Disponibilidad limitada por región',
      'Costo por token',
      'Lista de espera para acceso',
      'Límites de contexto según el modelo'
    ],
    lastUpdated: new Date('2024-01-14')
  },

  // APIs Sociales y Web
  'twitter': {
    name: 'Twitter API v2',
    description: 'API oficial de Twitter para acceder a tweets, usuarios, métricas y datos de la plataforma.',
    type: 'social',
    reliability: 'medium',
    updateFrequency: 'Tiempo real',
    website: 'https://twitter.com/',
    apiDocumentation: 'https://developer.twitter.com/en/docs/twitter-api',
    requiresAuth: true,
    pricing: 'freemium',
    dataTypes: ['Tweets', 'Usuarios', 'Métricas', 'Tendencias', 'Espacios'],
    features: [
      'Acceso a tweets en tiempo real',
      'Análisis de sentimientos',
      'Métricas de engagement',
      'Datos de usuarios y seguidores',
      'Tendencias y hashtags'
    ],
    limitations: [
      'Límites estrictos en plan gratuito',
      'Cambios frecuentes en políticas',
      'Costo elevado para uso comercial',
      'Restricciones de contenido'
    ],
    lastUpdated: new Date('2024-01-10')
  },

  // Fuentes Web Scraping
  'web-scraping': {
    name: 'Web Scraping',
    description: 'Extracción automatizada de datos de sitios web públicos mediante técnicas de scraping.',
    type: 'web',
    reliability: 'medium',
    updateFrequency: 'Bajo demanda',
    requiresAuth: false,
    pricing: 'free',
    dataTypes: ['HTML', 'Metadatos', 'Contenido', 'Enlaces', 'Imágenes'],
    features: [
      'Acceso a cualquier sitio web público',
      'Extracción de metadatos',
      'Análisis de estructura HTML',
      'Detección de tecnologías',
      'Análisis de rendimiento básico'
    ],
    limitations: [
      'Dependiente de la estructura del sitio',
      'Puede ser bloqueado por anti-bot',
      'Datos no siempre actualizados',
      'Posibles problemas legales',
      'Rendimiento variable'
    ],
    lastUpdated: new Date('2024-01-16')
  }
};

// Mapeo de herramientas a fuentes de datos
export const TOOL_DATA_SOURCES: Record<string, string[]> = {
  'metadata': ['web-scraping', 'google-pagespeed'],
  'content': ['web-scraping', 'openai', 'anthropic'],
  'keywords': ['semrush', 'ahrefs', 'web-scraping'],
  'performance': ['google-pagespeed', 'web-scraping'],
  'security': ['web-scraping', 'openai'],
  'backlinks': ['ahrefs', 'semrush'],
  'links': ['web-scraping', 'ahrefs'],
  'competition': ['semrush', 'ahrefs'],
  'blockchain': ['etherscan', 'alchemy', 'moralis'],
  'smart-contract': ['etherscan', 'alchemy'],
  'social-web3': ['twitter', 'moralis', 'coingecko'],
  'authority-tracking': ['ahrefs', 'semrush'],
  'metaverse-optimizer': ['moralis', 'alchemy', 'coingecko'],
  'nft-tracking': ['alchemy', 'moralis', 'etherscan'],
  'ai-assistant': ['openai', 'anthropic']
};

// Función para obtener fuentes de datos por herramienta
export const getDataSourcesForTool = (toolId: string): DataSource[] => {
  const sourceIds = TOOL_DATA_SOURCES[toolId] || [];
  return sourceIds.map(id => DATA_SOURCES[id]).filter(Boolean);
};

// Función para obtener todas las fuentes de datos
export const getAllDataSources = (): DataSource[] => {
  return Object.values(DATA_SOURCES);
};

// Función para obtener fuente de datos por ID
export const getDataSourceById = (id: string): DataSource | undefined => {
  return DATA_SOURCES[id];
};

// Función para filtrar fuentes por tipo
export const getDataSourcesByType = (type: DataSource['type']): DataSource[] => {
  return Object.values(DATA_SOURCES).filter(source => source.type === type);
};

// Función para obtener fuentes que requieren autenticación
export const getAuthRequiredSources = (): DataSource[] => {
  return Object.values(DATA_SOURCES).filter(source => source.requiresAuth);
};

// Función para obtener fuentes gratuitas
export const getFreeSources = (): DataSource[] => {
  return Object.values(DATA_SOURCES).filter(source => 
    source.pricing === 'free' || !source.requiresAuth
  );
};