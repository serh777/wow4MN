'use client';

import React from 'react';
import Script from 'next/script';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export function GoogleAnalytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchParamsString = searchParams?.toString();

  useEffect(() => {
    if (pathname) {
      pageview(pathname);
    }
  }, [pathname, searchParamsString]);

  return (
    <React.Fragment>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=G-GVXST9CBLV`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-GVXST9CBLV');
        `}
      </Script>
    </React.Fragment>
  );
}

// Función para enviar pageviews a Google Analytics
function pageview(url: string) {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('config', 'G-GVXST9CBLV', {
      page_path: url,
    });
  }
}

// Función para enviar eventos personalizados
export function sendGAEvent(action: string, category: string, label: string, value?: number) {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
}
