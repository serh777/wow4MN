/**
 * Configuración de redes blockchain soportadas
 */

// Temporalmente comentado para evitar errores de sintaxis
// import { mainnet, polygon } from '@reown/appkit/networks';

// Definiciones temporales de redes para evitar dependencias de AppKit
const mainnet = {
  id: 1,
  name: 'Ethereum',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: { default: { http: ['https://ethereum.publicnode.com'] } },
  blockExplorers: { default: { name: 'Etherscan', url: 'https://etherscan.io' } }
};

const polygon = {
  id: 137,
  name: 'Polygon',
  nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
  rpcUrls: { default: { http: ['https://polygon.llamarpc.com'] } },
  blockExplorers: { default: { name: 'PolygonScan', url: 'https://polygonscan.com' } }
};

// Redes soportadas
export const supportedNetworks = [mainnet, polygon];

// Red por defecto
export const defaultNetwork = mainnet;

// Configuración específica de redes
export const networkConfig = {
  [mainnet.id]: {
    name: 'Ethereum Mainnet',
    currency: 'ETH',
    explorerUrl: 'https://etherscan.io',
    rpcUrls: [
      'https://eth-mainnet.g.alchemy.com/v2/your-api-key',
      'https://mainnet.infura.io/v3/your-api-key',
      'https://ethereum.publicnode.com'
    ]
  },
  [polygon.id]: {
    name: 'Polygon',
    currency: 'MATIC',
    explorerUrl: 'https://polygonscan.com',
    rpcUrls: [
      'https://polygon-mainnet.g.alchemy.com/v2/your-api-key',
      'https://polygon-mainnet.infura.io/v3/your-api-key',
      'https://polygon.publicnode.com'
    ]
  }
};

// Función para obtener configuración de red
export function getNetworkConfig(chainId: number) {
  return networkConfig[chainId as keyof typeof networkConfig] || networkConfig[defaultNetwork.id];
}

// Función para verificar si una red está soportada
export function isNetworkSupported(chainId: number): boolean {
  return supportedNetworks.some(network => network.id === chainId);
}

// Función para obtener la red por defecto
export function getDefaultNetwork() {
  return defaultNetwork;
}

export { mainnet, polygon };