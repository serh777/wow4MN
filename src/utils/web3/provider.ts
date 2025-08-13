import { ethers } from 'ethers';

// Caché para el provider
let provider: ethers.Provider | null = null;

/**
 * Obtiene un provider de ethers.js configurado
 * @param rpcUrl URL del RPC (opcional, usa la variable de entorno por defecto)
 * @returns Provider configurado
 */
export function getProvider(rpcUrl?: string): ethers.Provider {
  if (provider) return provider;
  
  const url = rpcUrl || process.env.ETHEREUM_RPC_URL;
  
  if (!url) {
    throw new Error('No se ha proporcionado una URL de RPC. Configura ETHEREUM_RPC_URL en las variables de entorno.');
  }
  
  // Crear un nuevo provider
  provider = new ethers.JsonRpcProvider(url);
  
  return provider;
}

/**
 * Reinicia el provider (útil para cambiar de red o RPC)
 */
export function resetProvider(): void {
  provider = null;
}