'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { LogoWithText } from '@/components/ui/logo';
import { ThemeToggle } from '@/components/theme/theme-toggle';
import { useAuth } from '@/contexts/AuthContext';
import { HomeWalletConnect } from '@/components/wallet/home-wallet-connect';
import { LogOut, User, Menu, X, Wallet } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Header() {
  const { user, signOut } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full futuristic-header">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <LogoWithText />
          <span className={cn(
            "inline-flex items-center px-2 py-1 text-xs font-medium bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full shadow-sm",
            isClient && "animate-pulse"
          )}>
            BETA
          </span>
        </div>
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">
            Inicio
          </Link>
          <Link href="/features" className="text-sm font-medium hover:text-primary transition-colors">
            Herramientas
          </Link>
          <Link href="/about" className="text-sm font-medium hover:text-primary transition-colors">
            Nosotros
          </Link>
          <Link href="/blog" className="text-sm font-medium hover:text-primary transition-colors">
            Blog
          </Link>
          <Link href="/contact" className="text-sm font-medium hover:text-primary transition-colors">
            Contacto
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              // Usuario autenticado
              <>
                <Link href="/dashboard">
                  <Button variant="ghost" size="sm" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Dashboard
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleSignOut}
                  className="flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Salir
                </Button>
              </>
            ) : (
              // Usuario no autenticado
              <>
                <Link href="/auth/email-login">
                  <Button variant="ghost" size="sm">Iniciar Sesión</Button>
                </Link>
                <HomeWalletConnect 
                  variant="outline" 
                  size="sm" 
                  showMobileInfo={false}
                  className="min-w-[140px]"
                />
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t bg-background/95 backdrop-blur">
          <div className="container py-4 space-y-4">
            <nav className="flex flex-col space-y-3">
              <Link 
                href="/" 
                className="text-sm font-medium hover:text-primary transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Inicio
              </Link>
              <Link 
                href="/features" 
                className="text-sm font-medium hover:text-primary transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Herramientas
              </Link>
              <Link 
                href="/about" 
                className="text-sm font-medium hover:text-primary transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Nosotros
              </Link>
              <Link 
                href="/blog" 
                className="text-sm font-medium hover:text-primary transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Blog
              </Link>
              <Link 
                href="/contact" 
                className="text-sm font-medium hover:text-primary transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contacto
              </Link>
            </nav>
            
            <div className="border-t pt-4 space-y-3">
              {user ? (
                // Usuario autenticado
                <>
                  <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="ghost" size="sm" className="w-full justify-start gap-2">
                      <User className="h-4 w-4" />
                      Dashboard
                    </Button>
                  </Link>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => {
                      handleSignOut();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full justify-start gap-2"
                  >
                    <LogOut className="h-4 w-4" />
                    Salir
                  </Button>
                </>
              ) : (
                // Usuario no autenticado
                <>
                  <Link href="/auth/email-login" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="ghost" size="sm" className="w-full">Iniciar Sesión</Button>
                  </Link>
                  <div onClick={() => setIsMobileMenuOpen(false)}>
                    <HomeWalletConnect 
                      variant="outline" 
                      size="sm" 
                      showMobileInfo={true}
                      className="w-full"
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}