'use client';

import { Web3Provider, useWeb3 } from '@/contexts/Web3Context';
import { ReactNode, useEffect, useState, createContext, useContext } from 'react';
import { ethers } from 'ethers';

// Interface para el tipo de retorno del hook useWeb3Safe
interface Web3SafeContextType {
  address: string | null;
  chainId: number | null;
  isConnected: boolean;
  isConnecting: boolean;
  balance: string | null;
  provider: ethers.BrowserProvider | null;
  signer: ethers.JsonRpcSigner | null;
  connect: () => Promise<string | null>;
  disconnect: () => Promise<void>;
  switchNetwork: (chainId: number) => Promise<void>;
  getBalance: () => Promise<string | null>;
}

interface ClientWeb3ProviderProps {
  children: ReactNode;
}

// Contexto por defecto para SSR - valores consistentes
const defaultWeb3Context: Web3SafeContextType = {
  address: null,
  chainId: null,
  isConnected: false,
  isConnecting: false,
  balance: null,
  provider: null,
  signer: null,
  connect: async () => null,
  disconnect: async () => {},
  switchNetwork: async () => {},
  getBalance: async () => null,
};

export const SSRWeb3Context = createContext<Web3SafeContextType>(defaultWeb3Context);

// Componente interno que maneja la transición SSR->Cliente
function ClientWeb3Bridge({ children }: { children: ReactNode }) {
  const [isHydrated, setIsHydrated] = useState(false);
  const [contextValue, setContextValue] = useState<Web3SafeContextType>(defaultWeb3Context);
  
  // Obtener el contexto Web3 real - siempre llamar el hook
  const web3Context = useWeb3();
  
  useEffect(() => {
    // Marcar como hidratado y actualizar contexto
    setIsHydrated(true);
    setContextValue(web3Context);
  }, [web3Context]);
  
  // Durante la hidratación, usar siempre valores por defecto para evitar mismatches
  const safeContextValue = isHydrated ? contextValue : defaultWeb3Context;
  
  return (
    <SSRWeb3Context.Provider value={safeContextValue}>
      {children}
    </SSRWeb3Context.Provider>
  );
}

// Hook personalizado que funciona con ambos contextos y es SSR-safe
export function useWeb3Safe(): Web3SafeContextType {
  const [isHydrated, setIsHydrated] = useState(false);
  
  useEffect(() => {
    setIsHydrated(true);
  }, []);
  
  // Siempre llamar useContext para mantener el orden de hooks
  const ssrContext = useContext(SSRWeb3Context);
  
  // Durante SSR y antes de la hidratación, siempre devolver valores por defecto
  if (!isHydrated) {
    return defaultWeb3Context;
  }
  
  // Después de la hidratación, usar el contexto real
  return ssrContext;
}

export function ClientWeb3Provider({ children }: ClientWeb3ProviderProps) {
  // Eliminar renderizado condicional para evitar problemas de hidratación
  // Siempre renderizar con Web3Provider para consistencia
  return (
    <Web3Provider>
      <ClientWeb3Bridge>{children}</ClientWeb3Bridge>
    </Web3Provider>
  );
}