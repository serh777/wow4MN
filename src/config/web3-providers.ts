/**
 * Configuración de proveedores Web3 para pruebas con datos reales
 * Este archivo centraliza el acceso a las claves de API de servicios como Alchemy e Infura
 * Las claves se obtienen de variables de entorno para mantener la seguridad
 */

// Tipos para los proveedores Web3
export interface Web3Provider {
  name: string;
  networkEndpoints: Record<string, string>;
  apiKey: string;
  isConfigured: boolean;
}

// Función para obtener la clave de API de las variables de entorno
const getApiKey = (envName: string): string => {
  if (typeof process !== 'undefined' && process.env) {
    return process.env[envName] || '';
  }
  return '';
};

// Configuración de Alchemy
export const alchemyProvider: Web3Provider = {
  name: 'Alchemy',
  apiKey: getApiKey('ALCHEMY_API_KEY'),
  isConfigured: !!getApiKey('ALCHEMY_API_KEY'),
  networkEndpoints: {
    ethereum: 'https://eth-mainnet.g.alchemy.com/v2/',
    goerli: 'https://eth-goerli.g.alchemy.com/v2/',
    sepolia: 'https://eth-sepolia.g.alchemy.com/v2/',
    polygon: 'https://polygon-mainnet.g.alchemy.com/v2/',
    arbitrum: 'https://arb-mainnet.g.alchemy.com/v2/',
    optimism: 'https://opt-mainnet.g.alchemy.com/v2/'
  }
};

// Configuración de Infura
export const infuraProvider: Web3Provider = {
  name: 'Infura',
  apiKey: getApiKey('INFURA_API_KEY'),
  isConfigured: !!getApiKey('INFURA_API_KEY'),
  networkEndpoints: {
    ethereum: 'https://mainnet.infura.io/v3/',
    goerli: 'https://goerli.infura.io/v3/',
    sepolia: 'https://sepolia.infura.io/v3/',
    polygon: 'https://polygon-mainnet.infura.io/v3/',
    arbitrum: 'https://arbitrum-mainnet.infura.io/v3/',
    optimism: 'https://optimism-mainnet.infura.io/v3/'
  }
};

/**
 * Obtiene un proveedor Web3 configurado
 * Intenta usar Alchemy primero, luego Infura como respaldo
 */
export const getConfiguredProvider = (): Web3Provider | null => {
  if (alchemyProvider.isConfigured) {
    return alchemyProvider;
  }
  
  if (infuraProvider.isConfigured) {
    return infuraProvider;
  }
  
  return null;
};

/**
 * Construye una URL de endpoint para una red específica
 * @param network Nombre de la red (ethereum, goerli, etc.)
 * @returns URL completa del endpoint o null si no hay proveedor configurado
 */
export const getNetworkEndpoint = (network: string): string | null => {
  const provider = getConfiguredProvider();
  
  if (!provider) {
    console.warn('No hay proveedores Web3 configurados. Verifica las variables de entorno.');
    return null;
  }
  
  const baseUrl = provider.networkEndpoints[network];
  if (!baseUrl) {
    console.warn(`Red "${network}" no soportada por ${provider.name}`);
    return null;
  }
  
  return `${baseUrl}${provider.apiKey}`;
};