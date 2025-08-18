'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Search, Clock, Star, Globe, Wallet, FileText, Gem, 
  TrendingUp, ExternalLink, Plus, X, ChevronRight,
  Zap, Shield, Users, Database, Crown, Award
} from 'lucide-react';
import { useRouter } from 'next/navigation';

// Tipos de resultados de búsqueda
interface SearchResult {
  id: string;
  type: 'wallet' | 'contract' | 'domain' | 'token' | 'nft' | 'defi';
  address: string;
  name?: string;
  description?: string;
  verified?: boolean;
  category?: string;
  network?: string;
  icon?: string;
  metrics?: {
    balance?: string;
    transactions?: number;
    holders?: number;
    volume?: string;
  };
}

// Sugerencias populares de Web3
const POPULAR_SUGGESTIONS = [
  { type: 'domain', value: 'vitalik.eth', name: 'Vitalik Buterin', category: 'ENS Domain' },
  { type: 'contract', value: '0xA0b86a33E6441E6C8A2c1b8e6c5b8e6c5b8e6c5b', name: 'Uniswap V3', category: 'DeFi Protocol' },
  { type: 'wallet', value: '0x742d35Cc6634C0532925a3b8D4C2C4e4c4e4c4e4', name: 'Whale Wallet', category: 'High Value' },
  { type: 'domain', value: 'opensea.eth', name: 'OpenSea', category: 'NFT Marketplace' },
  { type: 'contract', value: '0x7f268357A8c2552623316e2562D90e642bB538E5', name: 'Wrapped Bitcoin', category: 'Token Contract' },
  { type: 'domain', value: 'ethereum.eth', name: 'Ethereum Foundation', category: 'Foundation' }
];

// Historial de búsquedas (simulado)
const SEARCH_HISTORY = [
  { value: 'metamask.eth', timestamp: Date.now() - 3600000 },
  { value: '0x742d35Cc6634C0532925a3b8D4C2C4e4c4e4c4e4', timestamp: Date.now() - 7200000 },
  { value: 'uniswap.eth', timestamp: Date.now() - 86400000 }
];

// Favoritos (simulado)
const FAVORITES = [
  { value: 'vitalik.eth', name: 'Vitalik Buterin' },
  { value: 'opensea.eth', name: 'OpenSea' }
];

interface Web3SearchProps {
  onSelect?: (result: SearchResult) => void;
  placeholder?: string;
  className?: string;
  showSuggestions?: boolean;
  autoFocus?: boolean;
}

export function Web3Search({ 
  onSelect, 
  placeholder = "Buscar dominios Web3, wallets, contratos...",
  className = "",
  showSuggestions = true,
  autoFocus = false
}: Web3SearchProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [searchHistory, setSearchHistory] = useState(SEARCH_HISTORY);
  const [favorites, setFavorites] = useState(FAVORITES);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Función para validar si es una dirección Web3 válida
  const isValidWeb3Address = useCallback((address: string): boolean => {
    // Direcciones Ethereum
    if (address.startsWith('0x') && address.length === 42) {
      return /^0x[a-fA-F0-9]{40}$/.test(address);
    }
    
    // Dominios ENS y Web3
    const web3Domains = ['.eth', '.crypto', '.blockchain', '.bitcoin', '.wallet', '.nft', '.dao', '.defi'];
    if (web3Domains.some(domain => address.toLowerCase().includes(domain))) {
      return true;
    }
    
    // Otras direcciones blockchain (Bitcoin, etc.)
    if (address.length >= 26 && address.length <= 62) {
      return true;
    }
    
    return false;
  }, []);

  // Función para buscar resultados
  const searchWeb3 = useCallback(async (searchQuery: string): Promise<SearchResult[]> => {
    if (!searchQuery.trim()) return [];
    
    // Simular búsqueda con datos mock
    const mockResults: SearchResult[] = [];
    
    // Si es una dirección válida, agregar como resultado directo
    if (isValidWeb3Address(searchQuery)) {
      const resultType = searchQuery.includes('.') ? 'domain' : 'wallet';
      mockResults.push({
        id: `direct-${searchQuery}`,
        type: resultType,
        address: searchQuery,
        name: resultType === 'domain' ? searchQuery : `Wallet ${searchQuery.slice(0, 6)}...${searchQuery.slice(-4)}`,
        verified: true,
        category: resultType === 'domain' ? 'ENS Domain' : 'Ethereum Wallet',
        network: 'Ethereum',
        metrics: {
          balance: resultType === 'wallet' ? '12.5 ETH' : undefined,
          transactions: Math.floor(Math.random() * 10000) + 100
        }
      });
    }
    
    // Buscar en sugerencias populares
    const popularMatches = POPULAR_SUGGESTIONS.filter(suggestion =>
      suggestion.value.toLowerCase().includes(searchQuery.toLowerCase()) ||
      suggestion.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    popularMatches.forEach(match => {
      mockResults.push({
        id: `popular-${match.value}`,
        type: match.type as any,
        address: match.value,
        name: match.name,
        verified: true,
        category: match.category,
        network: 'Ethereum',
        metrics: {
          balance: match.type === 'wallet' ? `${(Math.random() * 100).toFixed(1)} ETH` : undefined,
          transactions: Math.floor(Math.random() * 50000) + 1000,
          holders: match.type === 'contract' ? Math.floor(Math.random() * 100000) + 10000 : undefined
        }
      });
    });
    
    // Agregar algunos resultados adicionales simulados
    if (searchQuery.length > 2) {
      for (let i = 0; i < 3; i++) {
        mockResults.push({
          id: `mock-${i}-${searchQuery}`,
          type: ['wallet', 'contract', 'domain'][i % 3] as any,
          address: `0x${Math.random().toString(16).substr(2, 40)}`,
          name: `${searchQuery} Result ${i + 1}`,
          verified: Math.random() > 0.5,
          category: ['DeFi Protocol', 'NFT Collection', 'Token Contract'][i % 3],
          network: ['Ethereum', 'Polygon', 'BSC'][i % 3],
          metrics: {
            balance: `${(Math.random() * 1000).toFixed(2)} ETH`,
            transactions: Math.floor(Math.random() * 10000) + 100,
            holders: Math.floor(Math.random() * 50000) + 1000
          }
        });
      }
    }
    
    return mockResults.slice(0, 8); // Limitar a 8 resultados
  }, [isValidWeb3Address]);

  // Manejar cambio en el input
  const handleInputChange = useCallback(async (value: string) => {
    setQuery(value);
    setSelectedIndex(-1);
    
    if (value.trim().length > 0) {
      setIsLoading(true);
      setIsOpen(true);
      
      try {
        // Simular delay de búsqueda
        await new Promise(resolve => setTimeout(resolve, 300));
        const searchResults = await searchWeb3(value);
        setResults(searchResults);
      } catch (error) {
        console.error('Error searching:', error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    } else {
      setResults([]);
      setIsOpen(false);
    }
  }, [searchWeb3]);

  // Manejar selección de resultado
  const handleSelectResult = useCallback((result: SearchResult) => {
    setQuery(result.address);
    setIsOpen(false);
    
    // Agregar al historial
    const newHistoryItem = { value: result.address, timestamp: Date.now() };
    setSearchHistory(prev => [newHistoryItem, ...prev.filter(item => item.value !== result.address)].slice(0, 10));
    
    // Callback externo
    if (onSelect) {
      onSelect(result);
    }
  }, [onSelect]);

  // Manejar análisis directo
  const handleAnalyzeResult = useCallback((result: SearchResult) => {
    // Redirigir al dashboard con la dirección pre-cargada
    const params = new URLSearchParams({
      address: result.address,
      tools: 'ai-assistant,metadata,content,performance' // Herramientas por defecto
    });
    router.push(`/dashboard?${params.toString()}`);
  }, [router]);

  // Manejar teclas
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!isOpen) return;
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, results.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && results[selectedIndex]) {
          handleSelectResult(results[selectedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSelectedIndex(-1);
        break;
    }
  }, [isOpen, results, selectedIndex, handleSelectResult]);

  // Agregar/quitar de favoritos
  const toggleFavorite = useCallback((result: SearchResult) => {
    setFavorites(prev => {
      const exists = prev.find(fav => fav.value === result.address);
      if (exists) {
        return prev.filter(fav => fav.value !== result.address);
      } else {
        return [...prev, { value: result.address, name: result.name || result.address }];
      }
    });
  }, []);

  // Obtener icono por tipo
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'wallet': return Wallet;
      case 'contract': return FileText;
      case 'domain': return Globe;
      case 'token': return Gem;
      case 'nft': return Crown;
      case 'defi': return TrendingUp;
      default: return Database;
    }
  };

  // Obtener color por tipo
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'wallet': return 'bg-blue-100 text-blue-700';
      case 'contract': return 'bg-purple-100 text-purple-700';
      case 'domain': return 'bg-green-100 text-green-700';
      case 'token': return 'bg-yellow-100 text-yellow-700';
      case 'nft': return 'bg-pink-100 text-pink-700';
      case 'defi': return 'bg-indigo-100 text-indigo-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  // Cerrar al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (resultsRef.current && !resultsRef.current.contains(event.target as Node) &&
          inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Auto focus
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  return (
    <div className={`relative ${className}`}>
      {/* Input de búsqueda */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          ref={inputRef}
          value={query}
          onChange={(e) => handleInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (query.trim() || showSuggestions) {
              setIsOpen(true);
            }
          }}
          placeholder={placeholder}
          className="pl-10 pr-4 py-2 w-full"
        />
        {query && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setQuery('');
              setResults([]);
              setIsOpen(false);
            }}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>

      {/* Resultados de búsqueda */}
      {isOpen && (
        <Card className="absolute top-full left-0 right-0 mt-2 z-50 shadow-xl border-2">
          <CardContent className="p-0">
            <div className="max-h-96 overflow-y-auto" ref={resultsRef}>
            
            {/* Cargando */}
            {isLoading && (
              <div className="p-4 text-center text-gray-500">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto mb-2"></div>
                Buscando en Web3...
              </div>
            )}

            {/* Sin resultados */}
            {!isLoading && query.trim() && results.length === 0 && (
              <div className="p-4 text-center text-gray-500">
                <Search className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                <p>No se encontraron resultados para &quot;{query}&quot;</p>
                <p className="text-sm mt-1">Intenta con una dirección Web3 o dominio ENS</p>
              </div>
            )}

            {/* Resultados */}
            {!isLoading && results.length > 0 && (
              <div className="py-2">
                <div className="px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Resultados de búsqueda
                </div>
                {results.map((result, index) => {
                  const IconComponent = getTypeIcon(result.type);
                  const isSelected = index === selectedIndex;
                  const isFavorite = favorites.some(fav => fav.value === result.address);
                  
                  return (
                    <div
                      key={result.id}
                      className={`px-3 py-3 cursor-pointer border-l-4 transition-all ${
                        isSelected 
                          ? 'bg-blue-50 border-blue-500' 
                          : 'hover:bg-gray-50 border-transparent'
                      }`}
                      onClick={() => handleSelectResult(result)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3 flex-1 min-w-0">
                          <div className={`p-2 rounded-lg ${getTypeColor(result.type)}`}>
                            <IconComponent className="h-4 w-4" />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="font-medium text-gray-900 truncate">
                                {result.name || result.address}
                              </p>
                              {result.verified && (
                                <Shield className="h-3 w-3 text-green-500" />
                              )}
                            </div>
                            
                            <p className="text-sm text-gray-500 truncate">
                              {result.address}
                            </p>
                            
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="text-xs">
                                {result.category}
                              </Badge>
                              {result.network && (
                                <Badge variant="secondary" className="text-xs">
                                  {result.network}
                                </Badge>
                              )}
                            </div>
                            
                            {result.metrics && (
                              <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                                {result.metrics.balance && (
                                  <span>Balance: {result.metrics.balance}</span>
                                )}
                                {result.metrics.transactions && (
                                  <span>Tx: {result.metrics.transactions.toLocaleString()}</span>
                                )}
                                {result.metrics.holders && (
                                  <span>Holders: {result.metrics.holders.toLocaleString()}</span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-1 ml-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFavorite(result);
                            }}
                            className="h-8 w-8 p-0"
                          >
                            <Star className={`h-3 w-3 ${isFavorite ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}`} />
                          </Button>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAnalyzeResult(result);
                            }}
                            className="h-8 w-8 p-0"
                          >
                            <Zap className="h-3 w-3 text-blue-500" />
                          </Button>
                          
                          <ChevronRight className="h-4 w-4 text-gray-400" />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Sugerencias cuando no hay query */}
            {!query.trim() && showSuggestions && (
              <div className="py-2">
                {/* Favoritos */}
                {favorites.length > 0 && (
                  <>
                    <div className="px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wide flex items-center gap-2">
                      <Star className="h-3 w-3" />
                      Favoritos
                    </div>
                    {favorites.slice(0, 3).map((favorite, index) => (
                      <div
                        key={`fav-${favorite.value}`}
                        className="px-3 py-2 cursor-pointer hover:bg-gray-50 flex items-center justify-between"
                        onClick={() => handleInputChange(favorite.value)}
                      >
                        <div className="flex items-center space-x-3">
                          <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                          <div>
                            <p className="font-medium text-gray-900">{favorite.name}</p>
                            <p className="text-sm text-gray-500">{favorite.value}</p>
                          </div>
                        </div>
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                      </div>
                    ))}
                    <Separator className="my-2" />
                  </>
                )}

                {/* Historial reciente */}
                {searchHistory.length > 0 && (
                  <>
                    <div className="px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wide flex items-center gap-2">
                      <Clock className="h-3 w-3" />
                      Búsquedas recientes
                    </div>
                    {searchHistory.slice(0, 3).map((item, index) => (
                      <div
                        key={`history-${item.value}`}
                        className="px-3 py-2 cursor-pointer hover:bg-gray-50 flex items-center justify-between"
                        onClick={() => handleInputChange(item.value)}
                      >
                        <div className="flex items-center space-x-3">
                          <Clock className="h-4 w-4 text-gray-400" />
                          <div>
                            <p className="font-medium text-gray-900">{item.value}</p>
                            <p className="text-xs text-gray-500">
                              {new Date(item.timestamp).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                      </div>
                    ))}
                    <Separator className="my-2" />
                  </>
                )}

                {/* Sugerencias populares */}
                <div className="px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wide flex items-center gap-2">
                  <TrendingUp className="h-3 w-3" />
                  Populares en Web3
                </div>
                {POPULAR_SUGGESTIONS.slice(0, 4).map((suggestion, index) => {
                  const IconComponent = getTypeIcon(suggestion.type);
                  return (
                    <div
                      key={`suggestion-${suggestion.value}`}
                      className="px-3 py-2 cursor-pointer hover:bg-gray-50 flex items-center justify-between"
                      onClick={() => handleInputChange(suggestion.value)}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`p-1.5 rounded-lg ${getTypeColor(suggestion.type)}`}>
                          <IconComponent className="h-3 w-3" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{suggestion.name}</p>
                          <p className="text-sm text-gray-500">{suggestion.value}</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {suggestion.category}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

