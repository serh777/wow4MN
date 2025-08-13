'use client';

import React from 'react';
import { Button } from '@/components/ui/button';

export function CookieConsent() {
  const [accepted, setAccepted] = React.useState(false);

  React.useEffect(() => {
    const cookieConsent = localStorage.getItem('cookie-consent');
    if (cookieConsent) {
      setAccepted(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'true');
    setAccepted(true);
  };

  const handleReject = () => {
    localStorage.setItem('cookie-consent', 'false');
    setAccepted(true);
  };

  if (accepted) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-4 shadow-lg z-50">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-sm">
          <p>
            Utilizamos cookies para mejorar tu experiencia en nuestro sitio web. 
            Al continuar navegando, aceptas nuestra{' '}
            <a href="/cookies" className="text-primary hover:underline">política de cookies</a>.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleReject}>
            Rechazar
          </Button>
          <Button size="sm" onClick={handleAccept}>
            Aceptar
          </Button>
        </div>
      </div>
    </div>
  );
}