'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface MobileOptimizerProps {
  children: React.ReactNode;
}

export function MobileOptimizer({ children }: MobileOptimizerProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [isLandscape, setIsLandscape] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Verificar que estamos en el cliente
    if (typeof window === 'undefined') return;

    // Detect mobile device
    const checkMobile = () => {
      const userAgent = navigator.userAgent;
      const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
      const isSmallScreen = window.innerWidth <= 768;
      setIsMobile(isMobileDevice || isSmallScreen);
    };

    // Detect orientation
    const checkOrientation = () => {
      setIsLandscape(window.innerWidth > window.innerHeight);
    };

    // Ejecutar al cargar
    checkMobile();
    checkOrientation();

    // Listeners para cambios
    window.addEventListener('resize', checkMobile);
    window.addEventListener('resize', checkOrientation);
    window.addEventListener('orientationchange', checkOrientation);

    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('resize', checkOrientation);
      window.removeEventListener('orientationchange', checkOrientation);
    };
  }, []);

  useEffect(() => {
    // Verificar que estamos en el cliente
    if (typeof window === 'undefined' || typeof document === 'undefined') return;

    if (isMobile) {
      // Mobile-specific optimizations
      
      // 1. Prevenir zoom accidental
      const viewport = document.querySelector('meta[name="viewport"]');
      if (viewport) {
        viewport.setAttribute('content', 
          'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover'
        );
      }

      // 2. Optimizar touch events
      document.body.style.touchAction = 'manipulation';
      
      // 3. Mejorar scroll performance
      document.body.style.overscrollBehavior = 'none';
      (document.body.style as any).webkitOverflowScrolling = 'touch';
      
      // 4. Reducir animaciones en dispositivos lentos
      const connection = (navigator as any).connection;
      if (connection && (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g')) {
        document.body.classList.add('reduce-motion');
      }

      // 5. Optimize fonts for mobile
      const style = document.createElement('style');
      style.textContent = `
        @media (max-width: 768px) {
          * {
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
            text-rendering: optimizeSpeed;
          }
          
          .reduce-motion * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
          
          /* Optimize touch elements */
          button, a, [role="button"] {
            min-height: 44px;
            min-width: 44px;
            touch-action: manipulation;
          }
          
          /* Prevent accidental selection */
          .no-select {
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
          }
          
          /* Optimizar scroll */
          .scroll-container {
            -webkit-overflow-scrolling: touch;
            overflow-scrolling: touch;
          }
        }
      `;
      document.head.appendChild(style);

      return () => {
        document.head.removeChild(style);
      };
    }
  }, [isMobile]);

  useEffect(() => {
    // Handle orientation changes
    if (isMobile && isLandscape) {
      // Landscape-specific adjustments for mobile
      document.body.style.height = '100vh';
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.height = 'auto';
      document.body.style.overflow = 'auto';
    }
  }, [isMobile, isLandscape]);

  // Preload critical resources for mobile
  useEffect(() => {
    if (isMobile) {
      // Preload important pages
      router.prefetch('/features');
      router.prefetch('/pricing');
      
      // Preload critical images
      const criticalImages = [
        '/images/hero-mobile.webp',
        '/images/logo-mobile.webp'
      ];
      
      criticalImages.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        document.head.appendChild(link);
      });
    }
  }, [isMobile, router]);

  return (
    <div className={`mobile-optimized ${isMobile ? 'is-mobile' : 'is-desktop'} ${isLandscape ? 'is-landscape' : 'is-portrait'}`}>
      {children}
      
      {/* Slow connection indicator */}
      {isMobile && (
        <SlowConnectionIndicator />
      )}
    </div>
  );
}

// Component to indicate slow connection
function SlowConnectionIndicator() {
  const [isSlowConnection, setIsSlowConnection] = useState(false);

  useEffect(() => {
    const connection = (navigator as any).connection;
    if (connection) {
      const checkConnection = () => {
        const isSlow = connection.effectiveType === 'slow-2g' || 
                      connection.effectiveType === '2g' ||
                      connection.downlink < 1;
        setIsSlowConnection(isSlow);
      };

      checkConnection();
      connection.addEventListener('change', checkConnection);

      return () => {
        connection.removeEventListener('change', checkConnection);
      };
    }
  }, []);

  if (!isSlowConnection) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 bg-yellow-500 text-black p-2 rounded-lg text-sm z-50">
      <p className="text-center">
        📶 Slow connection detected. Optimizing experience...
      </p>
    </div>
  );
}

// Hook para detectar capacidades del dispositivo
export function useDeviceCapabilities() {
  const [capabilities, setCapabilities] = useState({
    isMobile: false,
    isLowEnd: false,
    supportsWebP: false,
    supportsAVIF: false,
    connectionSpeed: 'unknown'
  });

  useEffect(() => {
    const detectCapabilities = async () => {
      // Detect mobile
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
                      window.innerWidth <= 768;

      // Detectar dispositivo de gama baja
      const isLowEnd = navigator.hardwareConcurrency <= 2 || 
                      (navigator as any).deviceMemory <= 2;

      // Detectar soporte de formatos de imagen
      const supportsWebP = await checkImageSupport('webp');
      const supportsAVIF = await checkImageSupport('avif');

      // Detect connection speed
      const connection = (navigator as any).connection;
      const connectionSpeed = connection ? connection.effectiveType : 'unknown';

      setCapabilities({
        isMobile,
        isLowEnd,
        supportsWebP,
        supportsAVIF,
        connectionSpeed
      });
    };

    detectCapabilities();
  }, []);

  return capabilities;
}

// Helper function to detect image format support
function checkImageSupport(format: string): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    
    const testImages = {
      webp: 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA',
      avif: 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQ'
    };
    
    img.src = testImages[format as keyof typeof testImages] || '';
  });
}

export default MobileOptimizer;