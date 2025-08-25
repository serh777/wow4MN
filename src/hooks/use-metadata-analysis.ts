'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useNotifications } from '@/components/notifications/notification-system';

interface MetadataAnalysisResult {
  score: number;
  recommendations: string[];
  standards: {
    erc721: boolean;
    erc1155: boolean;
    erc20: boolean;
  };
  seoScore: number;
  completeness: number;
  issues: string[];
  suggestions: string[];
}

interface MetadataAnalysisData {
  contractAddress: string;
  blockchain: string;
  projectType: string;
}

export function useMetadataAnalysis() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<MetadataAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { notifyAnalysisStarted, notifyAnalysisCompleted, notifyAnalysisError } = useNotifications();

  const analyzeMetadata = async (data: MetadataAnalysisData) => {
    setIsAnalyzing(true);
    setError(null);
    
    // Notificar inicio del análisis
    notifyAnalysisStarted('metadatos');
    
    try {
      // Simular análisis de metadatos
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Generar resultados simulados basados en el tipo de proyecto
      const mockResult: MetadataAnalysisResult = {
        score: Math.floor(Math.random() * 30) + 70, // 70-100%
        recommendations: generateRecommendations(data.projectType),
        standards: {
          erc721: data.projectType === 'nft',
          erc1155: data.projectType === 'nft',
          erc20: data.projectType === 'token'
        },
        seoScore: Math.floor(Math.random() * 25) + 75, // 75-100%
        completeness: Math.floor(Math.random() * 20) + 80, // 80-100%
        issues: generateIssues(data.projectType),
        suggestions: generateSuggestions(data.projectType)
      };
      
      setAnalysisResult(mockResult);
      
      // Guardar resultados en sessionStorage para la página de resultados
      const resultsData = {
        analysisResult: mockResult,
        formData: data,
        timestamp: new Date().toISOString()
      };
      
      sessionStorage.setItem('metadataAnalysisResults', JSON.stringify(resultsData));
      
      // Notificar finalización exitosa del análisis
      notifyAnalysisCompleted('metadatos', mockResult.score);
      
      // Redirigir automáticamente a la página de resultados después de 2 segundos
      setTimeout(() => {
        router.push(`/dashboard/results/metadata?address=${encodeURIComponent(data.contractAddress)}&blockchain=${encodeURIComponent(data.blockchain)}&projectType=${encodeURIComponent(data.projectType)}`);
      }, 2000);
    } catch (err) {
      const errorMessage = 'Error al analizar los metadatos. Por favor, inténtalo de nuevo.';
      setError(errorMessage);
      
      // Notificar error en el análisis
      notifyAnalysisError('metadatos', errorMessage);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetAnalysis = () => {
    setAnalysisResult(null);
    setError(null);
    setIsAnalyzing(false);
    
    // Limpiar datos de análisis almacenados
    sessionStorage.removeItem('metadataAnalysisResults');
  };

  return {
    isAnalyzing,
    analysisResult,
    error,
    analyzeMetadata,
    resetAnalysis
  };
}

function generateRecommendations(projectType: string): string[] {
  const baseRecommendations = [
    'Optimizar títulos y descripciones para SEO',
    'Añadir metadatos estructurados JSON-LD',
    'Mejorar la velocidad de carga de imágenes'
  ];
  
  switch (projectType) {
    case 'nft':
      return [
        'Implementar metadatos ERC-721 completos',
        'Optimizar imágenes para marketplaces NFT',
        'Añadir atributos de rareza y propiedades',
        ...baseRecommendations
      ];
    case 'defi':
      return [
        'Documentar protocolos de seguridad',
        'Añadir información de tokenomics',
        'Implementar metadatos de liquidez',
        ...baseRecommendations
      ];
    case 'token':
      return [
        'Completar metadatos ERC-20 estándar',
        'Añadir información de utilidad del token',
        'Documentar casos de uso',
        ...baseRecommendations
      ];
    default:
      return baseRecommendations;
  }
}

function generateIssues(projectType: string): string[] {
  const commonIssues = [
    'Falta información de contacto',
    'Metadatos incompletos en algunas secciones'
  ];
  
  switch (projectType) {
    case 'nft':
      return [
        'Algunas imágenes no tienen texto alternativo',
        'Falta información de royalties',
        ...commonIssues
      ];
    case 'defi':
      return [
        'Documentación de smart contracts incompleta',
        'Falta información de auditorías',
        ...commonIssues
      ];
    default:
      return commonIssues;
  }
}

function generateSuggestions(projectType: string): string[] {
  const baseSuggestions = [
    'Implementar schema.org markup',
    'Optimizar para búsquedas móviles',
    'Añadir metadatos Open Graph'
  ];
  
  switch (projectType) {
    case 'nft':
      return [
        'Usar IPFS para almacenamiento descentralizado',
        'Implementar metadatos dinámicos',
        ...baseSuggestions
      ];
    case 'defi':
      return [
        'Añadir calculadoras de rendimiento',
        'Implementar datos en tiempo real',
        ...baseSuggestions
      ];
    default:
      return baseSuggestions;
  }
}