// Utilidades para gestión de indexadores

// Define el tipo para un Indexer
export interface Indexer {
  id: string;
  name: string;
  description?: string | null;
  status: 'active' | 'inactive' | 'error' | 'pending';
  network: string;
  dataType: string[];
  lastRun?: Date | null;
  createdAt: Date;
}

// Datos de ejemplo de indexadores (en una implementación real, esto vendría de la API)
export const mockIndexers: Indexer[] = [
  { 
    id: '1', 
    name: 'Indexador Principal ETH', 
    description: 'Indexa bloques y transacciones de la red principal de Ethereum.', 
    status: 'active', 
    network: 'ethereum',
    dataType: ['blocks', 'transactions'],
    lastRun: new Date(Date.now() - 3600000), 
    createdAt: new Date(Date.now() - 86400000 * 2) 
  },
  { 
    id: '2', 
    name: 'Indexador de Tokens ERC20 (Testnet)', 
    description: 'Rastrea transferencias de tokens ERC20 en Goerli.', 
    status: 'inactive', 
    network: 'goerli',
    dataType: ['events', 'logs'],
    createdAt: new Date(Date.now() - 86400000) 
  },
  { 
    id: '3', 
    name: 'Indexador de Eventos NFT (Polygon)', 
    description: 'Escucha eventos de minting y transferencias de NFTs en Polygon.', 
    status: 'error', 
    network: 'polygon',
    dataType: ['events'],
    lastRun: new Date(Date.now() - 7200000), 
    createdAt: new Date(Date.now() - 86400000 * 3) 
  },
  {
    id: '4',
    name: 'DeFi Tracker',
    description: 'Seguimiento de protocolos DeFi en múltiples redes',
    status: 'active',
    network: 'ethereum',
    dataType: ['events', 'transactions'],
    lastRun: new Date(Date.now() - 1800000),
    createdAt: new Date(Date.now() - 86400000 * 5)
  },
  {
    id: '5',
    name: 'NFT Analytics',
    description: 'Análisis de mercado NFT y colecciones',
    status: 'active',
    network: 'polygon',
    dataType: ['events', 'metadata'],
    lastRun: new Date(Date.now() - 900000),
    createdAt: new Date(Date.now() - 86400000 * 7)
  }
];

// Función para obtener indexadores activos para usar en dropdowns
export function getActiveIndexersForDropdown() {
  return mockIndexers
    .filter(indexer => indexer.status === 'active')
    .map(indexer => ({
      value: indexer.id,
      label: indexer.name,
      description: indexer.description || '',
      network: indexer.network,
      dataType: indexer.dataType
    }));
}

// Función para obtener todos los indexadores
export function getAllIndexers() {
  return mockIndexers;
}

// Función para obtener indexadores filtrados por estado
export function getIndexersByStatus(status: Indexer['status']) {
  return mockIndexers.filter(indexer => indexer.status === status);
}

// Función para obtener un indexador por ID
export function getIndexerById(id: string) {
  return mockIndexers.find(indexer => indexer.id === id);
}

// Función para obtener el label de la red
export function getNetworkLabel(network: string): string {
  const networks: Record<string, string> = {
    'ethereum': 'Ethereum Mainnet',
    'goerli': 'Goerli Testnet',
    'sepolia': 'Sepolia Testnet',
    'polygon': 'Polygon',
    'arbitrum': 'Arbitrum',
    'optimism': 'Optimism',
    'bsc': 'Binance Smart Chain'
  };
  
  return networks[network] || network;
}

// Función para obtener el color del estado
export function getStatusColor(status: Indexer['status']): string {
  switch (status) {
    case 'active': return 'bg-green-500/10 text-green-500';
    case 'inactive': return 'bg-gray-500/10 text-gray-500';
    case 'error': return 'bg-red-500/10 text-red-500';
    case 'pending': return 'bg-blue-500/10 text-blue-500';
    default: return 'bg-gray-500/10 text-gray-500';
  }
}