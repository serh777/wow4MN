import React from 'react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-xl font-bold text-primary">WowSeoWeb3</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Herramientas SEO avanzadas para proyectos Web3, optimizando tu presencia en el ecosistema blockchain.
            </p>
          </div>
          <div className="space-y-4">
            <h4 className="text-sm font-medium">Herramientas</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/register" className="text-sm text-muted-foreground hover:text-primary">
                  Análisis de Metadatos
                </Link>
              </li>
              <li>
                <Link href="/register" className="text-sm text-muted-foreground hover:text-primary">
                  Auditoría de Contenido
                </Link>
              </li>
              <li>
                <Link href="/register" className="text-sm text-muted-foreground hover:text-primary">
                  Análisis de Keywords
                </Link>
              </li>
              <li>
                <Link href="/register" className="text-sm text-muted-foreground hover:text-primary">
                  Verificación de Enlaces
                </Link>
              </li>
              <li>
                <Link href="/register" className="text-sm text-muted-foreground hover:text-primary">
                  Análisis de Rendimiento
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="text-sm font-medium">Empresa</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-sm text-muted-foreground hover:text-primary">
                  Sobre Nosotros
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-sm text-muted-foreground hover:text-primary">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-sm text-muted-foreground hover:text-primary">
                  Carreras
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-muted-foreground hover:text-primary">
                  Contacto
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="text-sm font-medium">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary">
                  Política de Privacidad
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-muted-foreground hover:text-primary">
                  Términos de Servicio
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="text-sm text-muted-foreground hover:text-primary">
                  Política de Cookies
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} WowSeoWeb3. Todos los derechos reservados.
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link href="https://twitter.com" className="text-muted-foreground hover:text-primary">
              Twitter
            </Link>
            <Link href="https://discord.com" className="text-muted-foreground hover:text-primary">
              Discord
            </Link>
            <Link href="https://github.com" className="text-muted-foreground hover:text-primary">
              GitHub
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
