'use client';

import React from 'react';
import { HeroSection, HybridAnalysisSection, CTASection } from '@/components/home/sections';
import { ShowcaseSection } from '@/components/home/showcase-section';
import { AlertTriangle, Info } from 'lucide-react';

function BetaBanner() {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border-b border-blue-200 dark:border-blue-800">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-center gap-3 text-sm">
          <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          <span className="text-blue-800 dark:text-blue-200">
            <strong>Versión Beta:</strong> Esta plataforma está en desarrollo activo. 
            Algunas funciones pueden estar en pruebas. 
            <span className="hidden sm:inline">¡Tu feedback es muy valioso para nosotros!</span>
          </span>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <>
      <BetaBanner />
      <HeroSection />
      <ShowcaseSection />
      <HybridAnalysisSection />
      <CTASection />
    </>
  );
}