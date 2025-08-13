'use client';

import { useEffect, useRef } from 'react';

interface ProgressOverlayProps {
  width: number;
  colorClass: string;
  size?: 'small' | 'large';
  className?: string;
}

export function ProgressOverlay({ width, colorClass, size = 'small', className = '' }: ProgressOverlayProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.style.width = `${width}%`;
    }
  }, [width]);

  const heightClass = size === 'large' ? 'h-3' : 'h-2';
  const durationClass = size === 'large' ? 'duration-1000' : 'duration-500';

  return (
    <div 
      ref={ref}
      className={`absolute top-0 left-0 ${heightClass} rounded-full transition-all ${durationClass} ${colorClass} ${className}`}
    />
  );
}