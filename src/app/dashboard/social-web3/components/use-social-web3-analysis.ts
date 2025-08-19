'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAnalysisNotifications } from '@/components/notifications/use-analysis-notifications';
import { SocialWeb3APIsService } from '@/services/apis/social-web3-apis';
import { extractDomainFromUrl } from '@/app/dashboard/keywords/components/real-keywords-helpers';
import type { AnalysisResult } from '@/types';

export function useSocialWeb3Analysis() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<AnalysisResult | null>(null);
  const router = useRouter();
  const { notifyAnalysisStarted, notifyAnalysisCompleted, notifyAnalysisError } = useAnalysisNotifications();

  const handleSubmit = async (data: any) => {
    setLoading(true);
    notifyAnalysisStarted('Análisis Social Web3');
    
    try {
      if (!data.primaryIdentifier || data.primaryIdentifier.trim() === '') {
        throw new Error('El identificador principal es obligatorio');
      }

      // Determinar el identificador principal (puede ser handle, URL, o dirección)
      let identifier = data.primaryIdentifier;
      
      // Si es una URL, extraer el dominio o handle
      if (identifier.startsWith('http')) {
        identifier = extractDomainFromUrl(identifier);
      }
      
      // Realizar análisis completo de presencia social Web3
      const socialAnalysis = await SocialWeb3APIsService.analyzeSocialWeb3Presence(identifier);
      
      // Obtener perfiles de múltiples plataformas
      const profiles = await SocialWeb3APIsService.getMultiPlatformProfiles(identifier);
      
      // Análisis de contenido cross-platform
      const contentAnalysis = await SocialWeb3APIsService.analyzeContent(profiles);
      
      // Análisis de audiencia
      const audienceAnalysis = await SocialWeb3APIsService.analyzeAudience(profiles);
      
      // Análisis de competidores
      const competitorAnalysis = await SocialWeb3APIsService.analyzeCompetitors(identifier, data.industry);

      // Combinar todos los análisis
      const combinedResults = {
        ...socialAnalysis,
        additionalData: {
          profiles,
          contentAnalysis,
          audienceAnalysis,
          competitorAnalysis,
          inputData: data
        }
      };

      setResults(combinedResults);
      
      // Guardar en sessionStorage para la página de resultados
      sessionStorage.setItem('socialWeb3AnalysisResults', JSON.stringify(combinedResults));
      
      notifyAnalysisCompleted('Análisis Social Web3');
      
      // Redirigir a resultados después de 3 segundos
      setTimeout(() => {
        const params = new URLSearchParams({
          identifier: identifier,
          platforms: profiles.map(p => p.platform).join(','),
          score: combinedResults.overallScore.toString()
        });
        router.push(`/dashboard/social-web3/analysis-results?${params.toString()}`);
      }, 3000);
      
    } catch (error) {
      console.error('Error en análisis social Web3:', error);
      notifyAnalysisError('Error en el análisis social Web3');
      setResults(null);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    results,
    handleSubmit
  };
}

