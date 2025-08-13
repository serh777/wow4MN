// Utilidades para validación Web3

// Patrones de URLs Web3 conocidas
const WEB3_URL_PATTERNS = [
  // DeFi Protocols
  /^https?:\/\/(app\.|www\.)?uniswap\.(org|com)/,
  /^https?:\/\/(app\.|www\.)?sushiswap\.(org|com)/,
  /^https?:\/\/(app\.|www\.)?pancakeswap\.(finance|com)/,
  /^https?:\/\/(app\.|www\.)?aave\.(com|org)/,
  /^https?:\/\/(app\.|www\.)?compound\.(finance|com)/,
  /^https?:\/\/(app\.|www\.)?curve\.(fi|com)/,
  /^https?:\/\/(app\.|www\.)?balancer\.(fi|com)/,
  /^https?:\/\/(app\.|www\.)?1inch\.(io|com)/,
  /^https?:\/\/(app\.|www\.)?yearn\.(finance|com)/,
  /^https?:\/\/(app\.|www\.)?convex\.(finance|com)/,
  
  // NFT Marketplaces
  /^https?:\/\/(www\.)?opensea\.(io|com)/,
  /^https?:\/\/(www\.)?rarible\.(com|org)/,
  /^https?:\/\/(www\.)?foundation\.(app|com)/,
  /^https?:\/\/(www\.)?superrare\.(com|co)/,
  /^https?:\/\/(www\.)?niftygateway\.(com|io)/,
  /^https?:\/\/(www\.)?async\.(art|com)/,
  /^https?:\/\/(www\.)?makersplace\.(com|io)/,
  
  // Gaming & Metaverse
  /^https?:\/\/(www\.)?decentraland\.(org|com)/,
  /^https?:\/\/(www\.)?sandbox\.(game|com)/,
  /^https?:\/\/(www\.)?axieinfinity\.(com|io)/,
  /^https?:\/\/(www\.)?cryptokitties\.(co|com)/,
  /^https?:\/\/(www\.)?somniumspace\.(com|io)/,
  
  // DAO Platforms
  /^https?:\/\/(www\.)?snapshot\.(org|com)/,
  /^https?:\/\/(www\.)?aragon\.(org|com)/,
  /^https?:\/\/(www\.)?daohaus\.(club|com)/,
  /^https?:\/\/(www\.)?colony\.(io|com)/,
  
  // Blockchain Explorers
  /^https?:\/\/(www\.)?etherscan\.(io|com)/,
  /^https?:\/\/(www\.)?polygonscan\.(com|io)/,
  /^https?:\/\/(www\.)?bscscan\.(com|io)/,
  /^https?:\/\/(www\.)?arbiscan\.(io|com)/,
  /^https?:\/\/(www\.)?optimistic\.etherscan\.(io|com)/,
  /^https?:\/\/(www\.)?snowtrace\.(io|com)/,
  
  // DeFi Analytics
  /^https?:\/\/(www\.)?defipulse\.(com|io)/,
  /^https?:\/\/(www\.)?defitvl\.(com|io)/,
  /^https?:\/\/(www\.)?dune\.(xyz|com)/,
  /^https?:\/\/(www\.)?nansen\.(ai|com)/,
  
  // Web3 Infrastructure
  /^https?:\/\/(www\.)?ens\.(domains|com)/,
  /^https?:\/\/(www\.)?ipfs\.(io|com)/,
  /^https?:\/\/(www\.)?thegraph\.(com|org)/,
  /^https?:\/\/(www\.)?chainlink\.(com|org)/,
  
  // Generic patterns for common Web3 domains
  /\.eth\//,
  /\.crypto\//,
  /\.nft\//,
  /\.dao\//,
  /\.defi\//,
  
  // Unstoppable Domains and Web3 TLDs
  /\.crypto$/,
  /\.nft$/,
  /\.blockchain$/,
  /\.bitcoin$/,
  /\.dao$/,
  /\.888$/,
  /\.wallet$/,
  /\.x$/,
  /\.klever$/,
  /\.hi$/,
  /\.kresus$/,
  /\.polygon$/,
  /\.anime$/,
  /\.manga$/,
  /\.binanceus$/,
  
  // Handshake domains and other Web3 TLDs
  /\.dream$/,
  /\.web3$/,
  /\.dapp$/,
  /\.metaverse$/,
  /\.gamefi$/,
  /\.defi$/,
  /\.yield$/,
  /\.swap$/,
  /\.stake$/,
  /\.farm$/,
  /\.pool$/,
  /\.vault$/,
  /\.bridge$/,
  /\.layer2$/,
  /\.rollup$/,
  /\.sidechain$/,
  /\.crosschain$/,
  
  // ENS domains
  /\.eth$/,
  
  // Generic Web3 pattern for any domain that might be Web3-related
  /^https?:\/\/(www\.)?.+\.(crypto|nft|blockchain|bitcoin|dao|888|wallet|x|klever|hi|kresus|polygon|anime|manga|binanceus|dream|web3|dapp|metaverse|gamefi|defi|yield|swap|stake|farm|pool|vault|bridge|layer2|rollup|sidechain|crosschain|eth)(\/.*)?$/,
];

// Patrones para direcciones de contratos
const CONTRACT_ADDRESS_PATTERNS = {
  ethereum: /^0x[a-fA-F0-9]{40}$/,
  polygon: /^0x[a-fA-F0-9]{40}$/,
  bsc: /^0x[a-fA-F0-9]{40}$/,
  arbitrum: /^0x[a-fA-F0-9]{40}$/,
  optimism: /^0x[a-fA-F0-9]{40}$/,
  avalanche: /^0x[a-fA-F0-9]{40}$/,
};

// Función para validar si una URL es Web3
export function isWeb3URL(url: string): boolean {
  if (!url) return false;
  
  // Verificar si es una dirección de contrato
  if (isContractAddress(url)) return true;
  
  // Verificar patrones de URLs Web3
  return WEB3_URL_PATTERNS.some(pattern => pattern.test(url));
}

// Función para validar direcciones de contratos
export function isContractAddress(address: string): boolean {
  if (!address) return false;
  
  // Verificar formato general de dirección Ethereum (0x + 40 caracteres hex)
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

// Función para validar compatibilidad entre red e indexador
export function isNetworkIndexerCompatible(network: string, indexerNetwork: string): boolean {
  // Si el indexador no especifica red, es compatible con todas
  if (!indexerNetwork) return true;
  
  // Verificar compatibilidad directa
  if (network === indexerNetwork) return true;
  
  // Verificar compatibilidades especiales
  const compatibilityMap: Record<string, string[]> = {
    'ethereum': ['ethereum', 'goerli', 'sepolia'], // Mainnet compatible con testnets
    'polygon': ['polygon', 'mumbai'], // Polygon compatible con Mumbai testnet
    'bsc': ['bsc', 'bsc-testnet'],
    'arbitrum': ['arbitrum', 'arbitrum-goerli'],
    'optimism': ['optimism', 'optimism-goerli'],
    'avalanche': ['avalanche', 'fuji']
  };
  
  const compatibleNetworks = compatibilityMap[network] || [network];
  return compatibleNetworks.includes(indexerNetwork);
}

// Función para obtener sugerencias de mejora para URLs no Web3
export function getWeb3URLSuggestions(url: string): string[] {
  const suggestions: string[] = [];
  
  if (!url) {
    suggestions.push('Ingresa una URL válida');
    return suggestions;
  }
  
  if (!isWeb3URL(url)) {
    suggestions.push('Esta URL no parece ser de un sitio Web3');
    suggestions.push('Ejemplos de URLs Web3 válidas:');
    suggestions.push('• https://app.uniswap.org');
    suggestions.push('• https://opensea.io');
    suggestions.push('• https://etherscan.io');
    suggestions.push('• 0x1234...abcd (dirección de contrato)');
    suggestions.push('• https://app.aave.com');
  }
  
  return suggestions;
}

// Función para detectar el tipo de sitio Web3
export function detectWeb3SiteType(url: string): string {
  if (isContractAddress(url)) return 'Contrato Inteligente';
  
  const typePatterns = [
    { type: 'DeFi Protocol', patterns: [/uniswap|sushiswap|pancakeswap|aave|compound|curve|balancer|1inch|yearn|convex|\.(defi|yield|swap|stake|farm|pool|vault)$/i] },
    { type: 'NFT Marketplace', patterns: [/opensea|rarible|foundation|superrare|niftygateway|async|makersplace|\.nft$/i] },
    { type: 'Gaming/Metaverse', patterns: [/decentraland|sandbox|axieinfinity|cryptokitties|somniumspace|\.(gamefi|metaverse)$/i] },
    { type: 'DAO Platform', patterns: [/snapshot|aragon|daohaus|colony|\.dao$/i] },
    { type: 'Blockchain Explorer', patterns: [/etherscan|polygonscan|bscscan|arbiscan|snowtrace/i] },
    { type: 'DeFi Analytics', patterns: [/defipulse|defitvl|dune|nansen/i] },
    { type: 'Web3 Infrastructure', patterns: [/ens|ipfs|thegraph|chainlink|\.(bridge|layer2|rollup|sidechain|crosschain)$/i] },
    { type: 'Dominio Web3 Descentralizado', patterns: [/\.(crypto|blockchain|bitcoin|888|wallet|x|klever|hi|kresus|polygon|anime|manga|binanceus|dream|web3|dapp|eth)$/i] },
    { type: 'ENS Domain', patterns: [/\.eth$/i] },
    { type: 'Unstoppable Domain', patterns: [/\.(crypto|nft|blockchain|bitcoin|dao|888|wallet|x|klever|hi|kresus|polygon|anime|manga|binanceus)$/i] },
    { type: 'Handshake Domain', patterns: [/\.(dream|web3|dapp|metaverse|gamefi|defi|yield|swap|stake|farm|pool|vault|bridge|layer2|rollup|sidechain|crosschain)$/i] }
  ];
  
  for (const { type, patterns } of typePatterns) {
    if (patterns.some(pattern => pattern.test(url))) {
      return type;
    }
  }
  
  return 'Sitio Web3';
}

// Función para validar que el análisis sea viable
export function validateAnalysisViability(data: {
  url: string;
  network: string;
  selectedIndexer: string;
  indexerNetwork?: string;
}): { isValid: boolean; errors: string[]; warnings: string[] } {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Validar que hay una URL
  if (!data.url || data.url.trim() === '') {
    errors.push('Debes proporcionar una URL para analizar');
  } else {
    // Validar formato básico de URL
    try {
      new URL(data.url);
    } catch {
      errors.push('La URL proporcionada no tiene un formato válido');
    }
  }
  
  // Validar indexador seleccionado
  if (!data.selectedIndexer) {
    errors.push('Debes seleccionar un indexador activo para realizar el análisis');
  }
  
  // Validar compatibilidad red-indexador
  if (data.indexerNetwork && !isNetworkIndexerCompatible(data.network, data.indexerNetwork)) {
    warnings.push(`El indexador está configurado para ${data.indexerNetwork} pero seleccionaste la red ${data.network}. Esto podría afectar la calidad del análisis.`);
  }
  
  // Agregar información si es Web3
  if (data.url && isWeb3URL(data.url)) {
    warnings.push('Sitio Web3 detectado. El análisis incluirá métricas específicas de blockchain.');
  }
  
  // Validar dirección de contrato si se proporciona
  if (data.url && isContractAddress(data.url)) {
    const siteType = detectWeb3SiteType(data.url);
    warnings.push(`Detectado: ${siteType}. El análisis se enfocará en datos on-chain del contrato.`);
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}