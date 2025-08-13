export const config = {
  // Configuración de la red
  network: {
    chainId: 1, // Ethereum Mainnet
    name: 'mainnet',
  },
  
  // RPC URLs
  rpcUrls: {
    mainnet: process.env.INFURA_PROJECT_ID ? 
      `https://mainnet.infura.io/v3/${process.env.INFURA_PROJECT_ID}` : 
      process.env.ALCHEMY_API_KEY ? 
      `https://eth-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}` :
      'https://eth.llamarpc.com',
    goerli: process.env.INFURA_PROJECT_ID ? 
      `https://goerli.infura.io/v3/${process.env.INFURA_PROJECT_ID}` : 
      process.env.ALCHEMY_API_KEY ? 
      `https://eth-goerli.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}` :
      'https://goerli.infura.io/v3/',
    polygon: process.env.ALCHEMY_API_KEY ? 
      `https://polygon-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}` :
      'https://polygon-rpc.com',
  },
  
  // Bloque inicial para indexar (por defecto)
  startBlock: parseInt(process.env.START_BLOCK || '0'),
  
  // Contratos a monitorear
  contracts: {
    // Ejemplo: Uniswap V2 Factory
    uniswapV2Factory: {
      address: '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f',
      startBlock: 10000835,
    },
    // Puedes agregar más contratos aquí
  },
  
  // Configuración de indexación
  indexing: {
    batchSize: parseInt(process.env.BATCH_SIZE || '100'),
    concurrency: parseInt(process.env.CONCURRENCY || '1'),
    retryAttempts: parseInt(process.env.RETRY_ATTEMPTS || '3'),
    retryDelay: parseInt(process.env.RETRY_DELAY || '1000'),
  },
};