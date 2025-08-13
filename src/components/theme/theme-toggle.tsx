'use client';

import * as React from 'react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { IconWrapper } from '@/components/ui/icon-wrapper';
import { cn } from '@/lib/utils';

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // Evitar problemas de hidratación
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button 
        variant="ghost" 
        size="icon" 
        disabled
        className="relative overflow-hidden rounded-full hover:bg-accent/50 transition-all duration-300"
      >
        <IconWrapper
          icon="sun"
          className="h-5 w-5 transition-all duration-300"
        />
        <span className="sr-only">Toggle theme</span>
      </Button>
    );
  }

  const currentTheme = resolvedTheme || theme;
  const isLight = currentTheme === 'light';

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(isLight ? 'dark' : 'light')}
      className={cn(
        "relative overflow-hidden rounded-full transition-all duration-300 hover:scale-105",
        "hover:bg-gradient-to-r hover:from-primary/10 hover:to-secondary/10",
        "active:scale-95 shadow-sm hover:shadow-md"
      )}
    >
      <div className="relative">
        <IconWrapper
          icon={isLight ? 'moon' : 'sun'}
          className={cn(
            "h-5 w-5 transition-all duration-500 ease-in-out",
            isLight ? "rotate-0 scale-100" : "rotate-180 scale-100",
            "hover:rotate-12"
          )}
        />
        {/* Efecto de brillo */}
        <div className={cn(
          "absolute inset-0 rounded-full transition-opacity duration-300",
          isLight 
            ? "bg-gradient-to-r from-yellow-400/20 to-orange-400/20 opacity-0 hover:opacity-100" 
            : "bg-gradient-to-r from-blue-400/20 to-purple-400/20 opacity-0 hover:opacity-100"
        )} />
      </div>
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}