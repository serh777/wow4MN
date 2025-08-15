'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Star, Zap, Clock, TrendingUp, Plus, X, Settings,
  Brain, BarChart3, Shield, Globe, Link, Users, Search,
  Database, Cpu, Award, Palette, Crown, Activity, Eye,
  FileText, Hash, GitBranch, Network, Gem, Lock
} from 'lucide-react';
import { useRouter } from 'next/navigation';

// Definición de herramientas disponibles
const AVAILABLE_TOOLS = [
  { id: 'ai-assistant', name: 'IA Análisis', icon: Brain, category: 'AI', color: 'bg-purple-100 text-purple-700' },
  { id: 'performance', name: 'Rendimiento', icon: BarChart3, category: 'Técnico', color: 'bg-blue-100 text-blue-700' },
  { id: 'security', name: 'Seguridad', icon: Shield, category: 'Seguridad', color: 'bg-red-100 text-red-700' },
  { id: 'blockchain', name: 'Blockchain', icon: Database, category: 'Web3', color: 'bg-green-100 text-green-700' },
  { id: 'social-web3', name: 'Social Web3', icon: Users, category: 'Social', color: 'bg-pink-100 text-pink-700' },
  { id: 'links', name: 'Enlaces', icon: Link, category: 'SEO', color: 'bg-indigo-100 text-indigo-700' },
  { id: 'backlinks', name: 'Backlinks', icon: GitBranch, category: 'SEO', color: 'bg-cyan-100 text-cyan-700' },
  { id: 'content', name: 'Contenido', icon: FileText, category: 'SEO', color: 'bg-orange-100 text-orange-700' },
  { id: 'keywords', name: 'Keywords', icon: Hash, category: 'SEO', color: 'bg-yellow-100 text-yellow-700' },
  { id: 'metadata', name: 'Metadatos', icon: Search, category: 'Técnico', color: 'bg-teal-100 text-teal-700' },
  { id: 'smart-contract', name: 'Contratos', icon: Cpu, category: 'Web3', color: 'bg-violet-100 text-violet-700' },
  { id: 'competition', name: 'Competencia', icon: Award, category: 'Análisis', color: 'bg-emerald-100 text-emerald-700' },
  { id: 'authority-tracking', name: 'Autoridad', icon: Crown, category: 'Web3', color: 'bg-amber-100 text-amber-700' },
  { id: 'metaverse-optimizer', name: 'Metaverso', icon: Palette, category: 'Web3', color: 'bg-rose-100 text-rose-700' },
  { id: 'content-authenticity', name: 'Autenticidad', icon: Eye, category: 'Seguridad', color: 'bg-lime-100 text-lime-700' },
  { id: 'nft-tracking', name: 'NFTs', icon: Gem, category: 'Web3', color: 'bg-fuchsia-100 text-fuchsia-700' },
  { id: 'ecosystem-interactions', name: 'Ecosistema', icon: Network, category: 'Web3', color: 'bg-sky-100 text-sky-700' }
];

interface QuickAccessMenuProps {
  className?: string;
  onToolSelect?: (toolId: string) => void;
}

export function QuickAccessMenu({ className = "", onToolSelect }: QuickAccessMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [recentTools, setRecentTools] = useState<string[]>([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const router = useRouter();

  // Cargar favoritos y herramientas recientes del localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem('favorite_tools');
    const savedRecent = localStorage.getItem('recent_tools');
    
    if (savedFavorites) {
      try {
        setFavorites(JSON.parse(savedFavorites));
      } catch (error) {
        console.error('Error loading favorites:', error);
      }
    } else {
      // Favoritos por defecto
      setFavorites(['ai-assistant', 'performance', 'security', 'blockchain']);
    }
    
    if (savedRecent) {
      try {
        setRecentTools(JSON.parse(savedRecent));
      } catch (error) {
        console.error('Error loading recent tools:', error);
      }
    }
  }, []);

  // Guardar favoritos en localStorage
  const saveFavorites = (newFavorites: string[]) => {
    setFavorites(newFavorites);
    localStorage.setItem('favorite_tools', JSON.stringify(newFavorites));
  };

  // Agregar herramienta a recientes
  const addToRecent = (toolId: string) => {
    const newRecent = [toolId, ...recentTools.filter(id => id !== toolId)].slice(0, 6);
    setRecentTools(newRecent);
    localStorage.setItem('recent_tools', JSON.stringify(newRecent));
  };

  // Toggle favorito
  const toggleFavorite = (toolId: string) => {
    const newFavorites = favorites.includes(toolId)
      ? favorites.filter(id => id !== toolId)
      : [...favorites, toolId].slice(0, 8); // Máximo 8 favoritos
    
    saveFavorites(newFavorites);
  };

  // Manejar selección de herramienta
  const handleToolSelect = (toolId: string) => {
    addToRecent(toolId);
    setIsOpen(false);
    
    if (onToolSelect) {
      onToolSelect(toolId);
    } else {
      router.push(`/dashboard/${toolId}`);
    }
  };

  // Obtener herramientas favoritas
  const favoriteTools = AVAILABLE_TOOLS.filter(tool => favorites.includes(tool.id));
  
  // Obtener herramientas recientes
  const recentToolsData = AVAILABLE_TOOLS.filter(tool => recentTools.includes(tool.id))
    .sort((a, b) => recentTools.indexOf(a.id) - recentTools.indexOf(b.id));

  // Obtener herramientas populares (simulado)
  const popularTools = AVAILABLE_TOOLS.filter(tool => 
    ['ai-assistant', 'performance', 'security', 'blockchain', 'social-web3'].includes(tool.id)
  );

  return (
    <div className={`relative ${className}`}>
      {/* Botón de acceso rápido */}
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2"
      >
        <Zap className="h-4 w-4" />
        <span className="hidden sm:inline">Acceso Rápido</span>
      </Button>

      {/* Menú desplegable */}
      {isOpen && (
        <Card className="absolute top-full right-0 mt-2 w-80 z-50 shadow-xl border-2">
          <CardContent className="p-0">
            
            {/* Header */}
            <div className="p-4 border-b bg-gradient-to-r from-blue-50 to-purple-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-blue-500" />
                  <h3 className="font-semibold text-gray-900">Acceso Rápido</h3>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsEditMode(!isEditMode)}
                    className="h-8 w-8 p-0"
                  >
                    <Settings className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsOpen(false)}
                    className="h-8 w-8 p-0"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="max-h-96 overflow-y-auto">
              
              {/* Herramientas Favoritas */}
              {favoriteTools.length > 0 && (
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <h4 className="font-medium text-gray-900">Favoritas</h4>
                    <Badge variant="secondary" className="text-xs">
                      {favoriteTools.length}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    {favoriteTools.map((tool) => {
                      const IconComponent = tool.icon;
                      return (
                        <div
                          key={tool.id}
                          className="relative group cursor-pointer p-3 rounded-lg border hover:border-blue-300 hover:bg-blue-50 transition-all"
                          onClick={() => handleToolSelect(tool.id)}
                        >
                          <div className="flex items-center gap-2">
                            <div className={`p-1.5 rounded-lg ${tool.color}`}>
                              <IconComponent className="h-3 w-3" />
                            </div>
                            <span className="text-sm font-medium text-gray-900 truncate">
                              {tool.name}
                            </span>
                          </div>
                          
                          {isEditMode && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleFavorite(tool.id);
                              }}
                              className="absolute -top-1 -right-1 h-6 w-6 p-0 bg-red-500 hover:bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {favoriteTools.length > 0 && <Separator />}

              {/* Herramientas Recientes */}
              {recentToolsData.length > 0 && (
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <h4 className="font-medium text-gray-900">Recientes</h4>
                  </div>
                  
                  <div className="space-y-1">
                    {recentToolsData.slice(0, 4).map((tool) => {
                      const IconComponent = tool.icon;
                      return (
                        <div
                          key={tool.id}
                          className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                          onClick={() => handleToolSelect(tool.id)}
                        >
                          <div className={`p-1.5 rounded-lg ${tool.color}`}>
                            <IconComponent className="h-3 w-3" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {tool.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {tool.category}
                            </p>
                          </div>
                          {!favorites.includes(tool.id) && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleFavorite(tool.id);
                              }}
                              className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {recentToolsData.length > 0 && <Separator />}

              {/* Herramientas Populares */}
              <div className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <h4 className="font-medium text-gray-900">Populares</h4>
                </div>
                
                <div className="space-y-1">
                  {popularTools.slice(0, 3).map((tool) => {
                    const IconComponent = tool.icon;
                    const isFavorite = favorites.includes(tool.id);
                    
                    return (
                      <div
                        key={tool.id}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors group"
                        onClick={() => handleToolSelect(tool.id)}
                      >
                        <div className={`p-1.5 rounded-lg ${tool.color}`}>
                          <IconComponent className="h-3 w-3" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {tool.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {tool.category}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(tool.id);
                          }}
                          className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Star className={`h-3 w-3 ${isFavorite ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}`} />
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 border-t bg-gray-50">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setIsOpen(false);
                    router.push('/dashboard');
                  }}
                  className="w-full"
                >
                  Ver todas las herramientas
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Hook para gestionar herramientas favoritas
export function useFavoriteTools() {
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('favorite_tools');
    if (saved) {
      try {
        setFavorites(JSON.parse(saved));
      } catch (error) {
        console.error('Error loading favorites:', error);
      }
    }
  }, []);

  const addFavorite = (toolId: string) => {
    const newFavorites = [...favorites, toolId].slice(0, 8);
    setFavorites(newFavorites);
    localStorage.setItem('favorite_tools', JSON.stringify(newFavorites));
  };

  const removeFavorite = (toolId: string) => {
    const newFavorites = favorites.filter(id => id !== toolId);
    setFavorites(newFavorites);
    localStorage.setItem('favorite_tools', JSON.stringify(newFavorites));
  };

  const toggleFavorite = (toolId: string) => {
    if (favorites.includes(toolId)) {
      removeFavorite(toolId);
    } else {
      addFavorite(toolId);
    }
  };

  const isFavorite = (toolId: string) => favorites.includes(toolId);

  return {
    favorites,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite
  };
}

