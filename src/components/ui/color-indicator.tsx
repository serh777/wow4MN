'use client';

import { useEffect, useRef } from 'react';

interface ColorIndicatorProps {
  color: string;
  className?: string;
}

export function ColorIndicator({ color, className = '' }: ColorIndicatorProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.style.backgroundColor = color;
    }
  }, [color]);

  return (
    <div 
      ref={ref}
      className={`w-4 h-4 rounded-full ${className}`}
    />
  );
}