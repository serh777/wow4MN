'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Keyboard, Command, Search, Zap, Settings, Home, 
  ArrowUp, ArrowDown, ArrowLeft, ArrowRight, X, 
  HelpCircle, Star, Clock, BarChart3, Shield
} from 'lucide-react';
import { useRouter } from 'next/navigation';

interface KeyboardShortcut {
  key: string;
  description: string;
  action: () => void;
  category: 'navigation' | 'search' | 'tools' | 'general';
  icon?: React.ComponentType<{ className?: string }>;
}

interface KeyboardShortcutsProps {
  onSearchFocus?: () => void;
  onQuickAccessOpen?: () => void;
  onSettingsOpen?: () => void;
}

export function KeyboardShortcuts({ 
  onSearchFocus, 
  onQuickAccessOpen, 
  onSettingsOpen 
}: KeyboardShortcutsProps) {
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());
  const router = useRouter();

  // Definir atajos de teclado
  const shortcuts: KeyboardShortcut[] = [
    // Navegación
    {
      key: 'Ctrl+H',
      description: 'Ir al Dashboard',
      action: () => router.push('/dashboard'),
      category: 'navigation',
      icon: Home
    },
    {
      key: 'Ctrl+,',
      description: 'Abrir Configuración',
      action: () => {
        if (onSettingsOpen) {
          onSettingsOpen();
        } else {
          router.push('/dashboard/settings');
        }
      },
      category: 'navigation',
      icon: Settings
    },
    
    // Búsqueda
    {
      key: 'Ctrl+K',
      description: 'Enfocar búsqueda Web3',
      action: () => {
        if (onSearchFocus) {
          onSearchFocus();
        }
      },
      category: 'search',
      icon: Search
    },
    {
      key: '/',
      description: 'Búsqueda rápida',
      action: () => {
        if (onSearchFocus) {
          onSearchFocus();
        }
      },
      category: 'search',
      icon: Search
    },
    
    // Herramientas
    {
      key: 'Ctrl+Q',
      description: 'Acceso rápido a herramientas',
      action: () => {
        if (onQuickAccessOpen) {
          onQuickAccessOpen();
        }
      },
      category: 'tools',
      icon: Zap
    },
    {
      key: 'Ctrl+1',
      description: 'IA Análisis',
      action: () => router.push('/dashboard/ai-assistant'),
      category: 'tools',
      icon: BarChart3
    },
    {
      key: 'Ctrl+2',
      description: 'Análisis de Rendimiento',
      action: () => router.push('/dashboard/performance'),
      category: 'tools',
      icon: BarChart3
    },
    {
      key: 'Ctrl+3',
      description: 'Auditoría de Seguridad',
      action: () => router.push('/dashboard/security'),
      category: 'tools',
      icon: Shield
    },
    
    // General
    {
      key: '?',
      description: 'Mostrar atajos de teclado',
      action: () => setIsHelpOpen(true),
      category: 'general',
      icon: HelpCircle
    },
    {
      key: 'Escape',
      description: 'Cerrar modales/menús',
      action: () => {
        setIsHelpOpen(false);
        // Aquí se pueden agregar más acciones de cierre
      },
      category: 'general',
      icon: X
    }
  ];

  // Manejar teclas presionadas
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    const key = event.key.toLowerCase();
    const ctrl = event.ctrlKey || event.metaKey;
    const shift = event.shiftKey;
    const alt = event.altKey;

    // Construir la combinación de teclas
    let combination = '';
    if (ctrl) combination += 'Ctrl+';
    if (shift) combination += 'Shift+';
    if (alt) combination += 'Alt+';
    
    // Manejar teclas especiales
    if (key === ' ') {
      combination += 'Space';
    } else if (key === 'escape') {
      combination += 'Escape';
    } else if (key === '/') {
      combination += '/';
    } else if (key === '?') {
      combination += '?';
    } else {
      combination += key.toUpperCase();
    }

    // Buscar el atajo correspondiente
    const shortcut = shortcuts.find(s => s.key === combination);
    
    if (shortcut) {
      // Prevenir comportamiento por defecto solo si encontramos un atajo
      event.preventDefault();
      event.stopPropagation();
      
      // Ejecutar la acción
      shortcut.action();
      
      // Actualizar teclas presionadas para feedback visual
      setPressedKeys(new Set([combination]));
      setTimeout(() => setPressedKeys(new Set()), 200);
    }
  }, [shortcuts, router, onSearchFocus, onQuickAccessOpen, onSettingsOpen]);

  // Registrar event listeners
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  // Agrupar atajos por categoría
  const groupedShortcuts = shortcuts.reduce((acc, shortcut) => {
    if (!acc[shortcut.category]) {
      acc[shortcut.category] = [];
    }
    acc[shortcut.category].push(shortcut);
    return acc;
  }, {} as Record<string, KeyboardShortcut[]>);

  const categoryNames = {
    navigation: 'Navegación',
    search: 'Búsqueda',
    tools: 'Herramientas',
    general: 'General'
  };

  const categoryIcons = {
    navigation: ArrowRight,
    search: Search,
    tools: Zap,
    general: Command
  };

  // Componente para mostrar una tecla
  const KeyBadge = ({ keyStr }: { keyStr: string }) => {
    const keys = keyStr.split('+');
    return (
      <div className="flex items-center gap-1">
        {keys.map((key, index) => (
          <React.Fragment key={key}>
            {index > 0 && <span className="text-gray-400 text-xs">+</span>}
            <Badge 
              variant="outline" 
              className={`text-xs font-mono px-2 py-1 ${
                pressedKeys.has(keyStr) ? 'bg-blue-100 border-blue-300' : ''
              }`}
            >
              {key === 'Ctrl' ? '⌘' : key === 'Shift' ? '⇧' : key === 'Alt' ? '⌥' : key}
            </Badge>
          </React.Fragment>
        ))}
      </div>
    );
  };

  return (
    <>
      {/* Botón para mostrar ayuda de atajos */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsHelpOpen(true)}
        className="flex items-center gap-2"
        title="Atajos de teclado (?)"
      >
        <Keyboard className="h-4 w-4" />
        <span className="hidden sm:inline">Atajos</span>
      </Button>

      {/* Modal de ayuda de atajos */}
      {isHelpOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[80vh] overflow-hidden">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Keyboard className="h-5 w-5 text-blue-500" />
                  Atajos de Teclado
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsHelpOpen(false)}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm text-gray-600">
                Usa estos atajos para navegar más rápido por la plataforma
              </p>
            </CardHeader>
            
            <CardContent className="overflow-y-auto max-h-96">
              <div className="space-y-6">
                {Object.entries(groupedShortcuts).map(([category, categoryShortcuts]) => {
                  const CategoryIcon = categoryIcons[category as keyof typeof categoryIcons];
                  
                  return (
                    <div key={category}>
                      <div className="flex items-center gap-2 mb-3">
                        <CategoryIcon className="h-4 w-4 text-gray-500" />
                        <h3 className="font-medium text-gray-900">
                          {categoryNames[category as keyof typeof categoryNames]}
                        </h3>
                      </div>
                      
                      <div className="space-y-2">
                        {categoryShortcuts.map((shortcut) => {
                          const IconComponent = shortcut.icon;
                          
                          return (
                            <div
                              key={shortcut.key}
                              className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                {IconComponent && (
                                  <IconComponent className="h-4 w-4 text-gray-400" />
                                )}
                                <span className="text-sm text-gray-700">
                                  {shortcut.description}
                                </span>
                              </div>
                              <KeyBadge keyStr={shortcut.key} />
                            </div>
                          );
                        })}
                      </div>
                      
                      {category !== 'general' && <Separator className="mt-4" />}
                    </div>
                  );
                })}
              </div>
              
              {/* Tips adicionales */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">💡 Tips</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Usa <KeyBadge keyStr="Tab" /> para navegar entre elementos</li>
                  <li>• Presiona <KeyBadge keyStr="?" /> en cualquier momento para ver esta ayuda</li>
                  <li>• Los atajos funcionan desde cualquier página del dashboard</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}

// Hook para usar atajos de teclado personalizados
export function useKeyboardShortcuts(shortcuts: Record<string, () => void>) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      const ctrl = event.ctrlKey || event.metaKey;
      const shift = event.shiftKey;
      const alt = event.altKey;

      let combination = '';
      if (ctrl) combination += 'ctrl+';
      if (shift) combination += 'shift+';
      if (alt) combination += 'alt+';
      combination += key;

      const action = shortcuts[combination];
      if (action) {
        event.preventDefault();
        event.stopPropagation();
        action();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);
}

