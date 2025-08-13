'use client';

import { useEffect } from 'react';
import { onCLS, onFCP, onLCP, onTTFB, onINP } from 'web-vitals';

interface Metric {
  name: string;
  value: number;
  id: string;
  delta: number;
  entries: PerformanceEntry[];
}

function sendToAnalytics(metric: Metric) {
  // Send to Google Analytics 4
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', metric.name, {
      event_category: 'Web Vitals',
      event_label: metric.id,
      value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
      non_interaction: true,
    });
  }

  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Core Web Vitals] ${metric.name}:`, {
      value: metric.value,
      id: metric.id,
      delta: metric.delta,
      entries: metric.entries
    });
  }
}

export function CoreWebVitals() {
  useEffect(() => {
    // Configure Core Web Vitals measurement
    onCLS(sendToAnalytics);
    onFCP(sendToAnalytics);
    onLCP(sendToAnalytics);
    onTTFB(sendToAnalytics);
    onINP(sendToAnalytics);

    // Optimize for better LCP
    const optimizeLCP = () => {
      // Preload critical resources
      const criticalImages = document.querySelectorAll('img[data-priority="high"]');
      criticalImages.forEach((img) => {
        if (img instanceof HTMLImageElement && img.loading !== 'eager') {
          img.loading = 'eager';
        }
      });

      // Optimize font loading
      const fontLinks = document.querySelectorAll('link[rel="preload"][as="font"]');
      fontLinks.forEach((link) => {
        if (link instanceof HTMLLinkElement && !link.crossOrigin) {
          link.crossOrigin = 'anonymous';
        }
      });
    };

    // Optimize for better CLS
    const optimizeCLS = () => {
      // Add size attributes to images without them
      const images = document.querySelectorAll('img:not([width]):not([height])');
      images.forEach((img) => {
        if (img instanceof HTMLImageElement) {
          // Set aspect ratio to prevent layout shift
          img.style.aspectRatio = '16/9'; // Default aspect ratio
        }
      });

      // Reserve space for dynamic content
      const dynamicContainers = document.querySelectorAll('[data-dynamic-content]');
      dynamicContainers.forEach((container) => {
        if (container instanceof HTMLElement && !container.style.minHeight) {
          container.style.minHeight = '200px'; // Reserve minimum space
        }
      });
    };

    // Run optimizations
    optimizeLCP();
    optimizeCLS();

    // Monitor for layout shifts
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'layout-shift' && !(entry as any).hadRecentInput) {
            console.warn('[CLS] Layout shift detected:', entry);
          }
        }
      });

      observer.observe({ entryTypes: ['layout-shift'] });

      return () => observer.disconnect();
    }
  }, []);

  return null; // This component doesn't render anything
}

// Hook for manual Core Web Vitals reporting
export function useWebVitals() {
  useEffect(() => {
    const reportVitals = (metric: Metric) => {
      sendToAnalytics(metric);
    };

    onCLS(reportVitals);
    onFCP(reportVitals);
    onLCP(reportVitals);
    onTTFB(reportVitals);
    onINP(reportVitals);
  }, []);
}

// Performance monitoring utilities
export const performanceUtils = {
  // Mark critical resources for priority loading
  markCriticalImage: (selector: string) => {
    const img = document.querySelector(selector);
    if (img instanceof HTMLImageElement) {
      img.setAttribute('data-priority', 'high');
      img.loading = 'eager';
      img.fetchPriority = 'high';
    }
  },

  // Prevent layout shifts by reserving space
  reserveSpace: (selector: string, minHeight: string) => {
    const element = document.querySelector(selector);
    if (element instanceof HTMLElement) {
      element.style.minHeight = minHeight;
      element.setAttribute('data-dynamic-content', 'true');
    }
  },

  // Optimize font loading
  optimizeFonts: () => {
    const style = document.createElement('style');
    style.textContent = `
      @font-face {
        font-family: 'Inter';
        font-display: swap;
      }
      @font-face {
        font-family: 'Poppins';
        font-display: swap;
      }
    `;
    document.head.appendChild(style);
  }
};