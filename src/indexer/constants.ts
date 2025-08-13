import { ethers } from 'ethers';

// Eventos comunes para monitorear
export const EVENTS = {
  // Eventos de ERC20
  ERC20: {
    TRANSFER: 'Transfer(address,address,uint256)',
    APPROVAL: 'Approval(address,address,uint256)',
  },
  
  // Eventos de ERC721
  ERC721: {
    TRANSFER: 'Transfer(address,address,uint256)',
    APPROVAL: 'Approval(address,address,uint256)',
    APPROVAL_FOR_ALL: 'ApprovalForAll(address,address,bool)',
  },
  
  // Eventos de Uniswap V2
  UNISWAP_V2: {
    PAIR_CREATED: 'PairCreated(address,address,address,uint256)',
    SWAP: 'Swap(address,uint256,uint256,uint256,uint256,address)',
    MINT: 'Mint(address,uint256,uint256)',
    BURN: 'Burn(address,uint256,uint256,address)',
  },
};

// Topics para filtrar eventos (keccak256 hash de las firmas de eventos)
export const TOPICS = {
  ERC20: {
    TRANSFER: ethers.id(EVENTS.ERC20.TRANSFER),
    APPROVAL: ethers.id(EVENTS.ERC20.APPROVAL),
  },
  ERC721: {
    TRANSFER: ethers.id(EVENTS.ERC721.TRANSFER),
    APPROVAL: ethers.id(EVENTS.ERC721.APPROVAL),
    APPROVAL_FOR_ALL: ethers.id(EVENTS.ERC721.APPROVAL_FOR_ALL),
  },
  UNISWAP_V2: {
    PAIR_CREATED: ethers.id(EVENTS.UNISWAP_V2.PAIR_CREATED),
    SWAP: ethers.id(EVENTS.UNISWAP_V2.SWAP),
    MINT: ethers.id(EVENTS.UNISWAP_V2.MINT),
    BURN: ethers.id(EVENTS.UNISWAP_V2.BURN),
  },
};

// Direcciones de contratos importantes
export const ADDRESSES = {
  // Ethereum Mainnet
  MAINNET: {
    UNISWAP_V2_FACTORY: '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f',
    UNISWAP_V2_ROUTER: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
    WETH: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    DAI: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
    USDC: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
  },
  
  // Goerli Testnet
  GOERLI: {
    // Añadir direcciones de testnet según sea necesario
  },
};