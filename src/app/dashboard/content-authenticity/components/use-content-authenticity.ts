// Hook para análisis real de Content Authenticity
'use client';

import { useState, useEffect, useCallback } from 'react';
import { ContentAuthenticityAPIsService } from '@/services/apis/content-authenticity-apis';

interface ContentAuthenticityState {
  isLoading: boolean;
  data: any | null;
  error: string | null;
}

export function useContentAuthenticity(contentId: string, options: {
  url?: string;
  contentType?: string;
  includeBlockchain?: boolean;
  includeIPFS?: boolean;
  includeSignatures?: boolean;
} = {}) {
  const [state, setState] = useState<ContentAuthenticityState>({
    isLoading: false,
    data: null,
    error: null
  });

  // Función para analizar patrón de modificaciones
  const analyzeModificationPattern = useCallback((modifications: any[]): string => {
    if (modifications.length <= 1) return 'minimal';
    
    const timeGaps = [];
    for (let i = 1; i < modifications.length; i++) {
      const gap = new Date(modifications[i].date).getTime() - 
                   new Date(modifications[i-1].date).getTime();
      timeGaps.push(gap);
    }
    
    const avgGap = timeGaps.reduce((a, b) => a + b, 0) / timeGaps.length;
    const dayGap = avgGap / (1000 * 60 * 60 * 24);
    
    if (dayGap < 1) return 'rapid';
    if (dayGap < 7) return 'frequent';
    if (dayGap < 30) return 'regular';
    return 'sporadic';
  }, []);

  // Función para analizar cambios históricos
  const analyzeHistoricalChanges = useCallback((data: any) => {
    const modifications = data.provenanceRecord?.modifications || [];
    
    if (modifications.length === 0) {
      return {
        changeFrequency: 'none',
        riskLevel: 'low',
        pattern: 'original'
      };
    }

    const changeFrequency = modifications.length > 5 ? 'high' : 
                           modifications.length > 2 ? 'medium' : 'low';
    
    const riskLevel = changeFrequency === 'high' ? 'medium' : 'low';
    
    return {
      changeFrequency,
      riskLevel,
      pattern: analyzeModificationPattern(modifications),
      totalChanges: modifications.length,
      lastModified: modifications[modifications.length - 1]?.date
    };
  }, [analyzeModificationPattern]);

  // Función para calcular confiabilidad
  const calculateTrustworthiness = useCallback((metrics: any): number => {
    const weights = {
      blockchain: 0.3,
      signature: 0.25,
      hash: 0.2,
      provenance: 0.15,
      timestamp: 0.1
    };

    return Math.round(
      (metrics.blockchainProof || 0) * weights.blockchain +
      (metrics.digitalSignature || 0) * weights.signature +
      (metrics.hashVerification || 0) * weights.hash +
      (metrics.provenanceChain || 0) * weights.provenance +
      (metrics.timestampAccuracy || 0) * weights.timestamp
    );
  }, []);

  // Función para calcular fuerza de verificación
  const calculateVerificationStrength = useCallback((proofs: any[], signatures: any[]): number => {
    const verifiedProofs = proofs.filter(p => p.verified).length;
    const verifiedSignatures = signatures.filter(s => s.verified).length;
    
    const proofScore = Math.min(verifiedProofs * 25, 60);
    const signatureScore = Math.min(verifiedSignatures * 20, 40);
    
    return proofScore + signatureScore;
  }, []);

  // Función para calcular cadena de custodia
  const calculateChainOfCustody = useCallback((provenance: any): number => {
    const ownership = provenance.ownership || [];
    const modifications = provenance.modifications || [];
    
    if (ownership.length === 0) return 0;
    
    const ownershipScore = Math.min(ownership.length * 20, 60);
    const modificationScore = Math.min(modifications.length * 10, 40);
    
    return ownershipScore + modificationScore;
  }, []);

  // Función para calcular verificación cross-chain
  const calculateCrossChainVerification = useCallback((proofs: any[]): number => {
    const uniqueNetworks = new Set(proofs.map(p => p.network));
    return Math.min(uniqueNetworks.size * 25, 100);
  }, []);

  // Función para calcular verificación de edad
  const calculateAgeVerification = useCallback((creationDate?: string): number => {
    if (!creationDate) return 0;
    
    const age = Date.now() - new Date(creationDate).getTime();
    const ageInDays = age / (1000 * 60 * 60 * 24);
    
    // Contenido más antiguo tiene mayor verificación de edad
    if (ageInDays > 365) return 100;
    if (ageInDays > 180) return 80;
    if (ageInDays > 90) return 60;
    if (ageInDays > 30) return 40;
    return 20;
  }, []);

  // Función para calcular métricas derivadas
  const calculateDerivedMetrics = useCallback((data: any) => {
    const metrics = data.metrics || {};
    const proofs = data.blockchainProofs || [];
    const signatures = data.digitalSignatures || [];

    return {
      // Métricas de confiabilidad
      trustworthiness: calculateTrustworthiness(metrics),
      verificationStrength: calculateVerificationStrength(proofs, signatures),
      
      // Métricas de integridad
      dataIntegrity: metrics.hashVerification || 0,
      chainOfCustody: calculateChainOfCustody(data.provenanceRecord || {}),
      
      // Métricas de red
      networkConsensus: metrics.networkConsensus || 0,
      crossChainVerification: calculateCrossChainVerification(proofs),
      
      // Métricas temporales
      ageVerification: calculateAgeVerification(data.provenanceRecord?.creationDate),
      timestampConsistency: metrics.timestampAccuracy || 0,
      
      // Métricas de riesgo
      riskScore: 100 - (data.riskAssessment?.confidence || 0),
      vulnerabilityCount: (data.riskAssessment?.factors || []).length
    };
      
  }, [calculateTrustworthiness, calculateVerificationStrength, calculateChainOfCustody, calculateCrossChainVerification, calculateAgeVerification]);

  // Función para generar insights específicos
  const generateAuthenticityInsights = useCallback((data: any, options: any) => {
    const insights = [];
    const metrics = data.metrics || {};
    const proofs = data.blockchainProofs || [];
    const signatures = data.digitalSignatures || [];
    const riskAssessment = data.riskAssessment || {};

    // Insights de verificación blockchain
    if (options.includeBlockchain !== false) {
      const verifiedProofs = proofs.filter((p: any) => p.verified);
      
      if (verifiedProofs.length > 2) {
        insights.push({
          type: 'positive',
          category: 'blockchain',
          title: 'Múltiples Verificaciones Blockchain',
          description: `Verificado en ${verifiedProofs.length} redes blockchain`,
          impact: 'high'
        });
      } else if (verifiedProofs.length === 0) {
        insights.push({
          type: 'warning',
          category: 'blockchain',
          title: 'Sin Verificación Blockchain',
          description: 'Contenido no verificado en blockchain',
          impact: 'high',
          actionable: true,
          recommendation: 'Registrar contenido en al menos una blockchain'
        });
      }
    }

    // Insights de firmas digitales
    if (options.includeSignatures !== false) {
      const validSignatures = signatures.filter((s: any) => s.verified);
      
      if (validSignatures.length > 0) {
        insights.push({
          type: 'positive',
          category: 'signatures',
          title: 'Firmas Digitales Válidas',
          description: `${validSignatures.length} firma(s) digital(es) verificada(s)`,
          impact: 'medium'
        });
      } else if (signatures.length > 0) {
        insights.push({
          type: 'warning',
          category: 'signatures',
          title: 'Firmas No Verificadas',
          description: 'Firmas digitales presentes pero no verificadas',
          impact: 'medium',
          actionable: true,
          recommendation: 'Verificar validez de las firmas digitales'
        });
      }
    }

    // Insights de hash
    if (metrics.hashVerification > 90) {
      insights.push({
        type: 'positive',
        category: 'integrity',
        title: 'Integridad Excelente',
        description: `Verificación de hash del ${metrics.hashVerification}%`,
        impact: 'high'
      });
    } else if (metrics.hashVerification < 50) {
      insights.push({
        type: 'warning',
        category: 'integrity',
        title: 'Integridad Comprometida',
        description: `Solo ${metrics.hashVerification}% de verificación de hash`,
        impact: 'high',
        actionable: true,
        recommendation: 'Regenerar hashes usando múltiples algoritmos'
      });
    }

    // Insights de riesgo
    if (riskAssessment.riskLevel === 'low') {
      insights.push({
        type: 'positive',
        category: 'risk',
        title: 'Bajo Riesgo de Falsificación',
        description: `Confianza del ${riskAssessment.confidence}%`,
        impact: 'high'
      });
    } else if (riskAssessment.riskLevel === 'high' || riskAssessment.riskLevel === 'critical') {
      insights.push({
        type: 'warning',
        category: 'risk',
        title: 'Alto Riesgo Detectado',
        description: `Nivel de riesgo: ${riskAssessment.riskLevel}`,
        impact: 'high',
        actionable: true,
        recommendation: 'Revisar y mejorar medidas de autenticidad'
      });
    }

    // Insights de procedencia
    const provenance = data.provenanceRecord || {};
    if (provenance.ownership?.length > 3) {
      insights.push({
        type: 'positive',
        category: 'provenance',
        title: 'Historial de Propiedad Completo',
        description: `${provenance.ownership.length} transferencias registradas`,
        impact: 'medium'
      });
    } else if (!provenance.creator) {
      insights.push({
        type: 'warning',
        category: 'provenance',
        title: 'Creador No Identificado',
        description: 'Sin información del creador original',
        impact: 'medium',
        actionable: true,
        recommendation: 'Establecer y verificar autoría original'
      });
    }

    return insights;
  }, []);

  // Función para generar recomendaciones de seguridad
  const generateSecurityRecommendations = useCallback((data: any) => {
    const recommendations = [];
    const metrics = data.metrics || {};
    const riskAssessment = data.riskAssessment || {};
    const proofs = data.blockchainProofs || [];
    const signatures = data.digitalSignatures || [];

    // Recomendaciones basadas en verificación blockchain
    if (proofs.length === 0) {
      recommendations.push({
        priority: 'high',
        category: 'blockchain',
        title: 'Implementar Verificación Blockchain',
        description: 'Registrar el contenido en al menos una blockchain para mejorar la autenticidad',
        implementation: 'Usar servicios como Ethereum, Polygon o Binance Smart Chain',
        estimatedImpact: 'Alto - Mejora significativa en confiabilidad'
      });
    }

    // Recomendaciones basadas en firmas digitales
    if (signatures.length === 0) {
      recommendations.push({
        priority: 'medium',
        category: 'signatures',
        title: 'Agregar Firmas Digitales',
        description: 'Implementar firmas digitales para verificar autoría',
        implementation: 'Usar certificados X.509 o firmas criptográficas',
        estimatedImpact: 'Medio - Mejora la verificación de autoría'
      });
    }

    // Recomendaciones basadas en integridad
    if (metrics.hashVerification < 80) {
      recommendations.push({
        priority: 'high',
        category: 'integrity',
        title: 'Mejorar Verificación de Hash',
        description: 'Implementar múltiples algoritmos de hash para mayor seguridad',
        implementation: 'Usar SHA-256, SHA-3 y BLAKE2 simultáneamente',
        estimatedImpact: 'Alto - Detecta mejor las modificaciones'
      });
    }

    // Recomendaciones basadas en riesgo
    if (riskAssessment.riskLevel === 'high' || riskAssessment.riskLevel === 'critical') {
      recommendations.push({
        priority: 'critical',
        category: 'risk',
        title: 'Medidas de Seguridad Urgentes',
        description: 'Implementar controles adicionales debido al alto riesgo detectado',
        implementation: 'Auditoría completa, re-verificación y monitoreo continuo',
        estimatedImpact: 'Crítico - Esencial para mantener confiabilidad'
      });
    }

    // Recomendaciones basadas en procedencia
    const provenance = data.provenanceRecord || {};
    if (!provenance.creator || !provenance.creationDate) {
      recommendations.push({
        priority: 'medium',
        category: 'provenance',
        title: 'Completar Información de Procedencia',
        description: 'Agregar información completa del creador y fecha de creación',
        implementation: 'Registrar metadatos completos en el momento de creación',
        estimatedImpact: 'Medio - Mejora la trazabilidad'
      });
    }

    return recommendations;
  }, []);

  // Función para procesar datos de autenticidad
  const processAuthenticityData = useCallback(async (rawData: any, options: any) => {
    const {
      includeBlockchain = true,
      includeIPFS = true,
      includeSignatures = true
    } = options;

    // Filtrar datos según las opciones seleccionadas
    let processedData = { ...rawData };

    // Agregar métricas calculadas
    processedData.calculatedMetrics = calculateDerivedMetrics(processedData);
    
    // Agregar insights específicos
    processedData.insights = generateAuthenticityInsights(processedData, options);

    // Agregar comparaciones históricas si están disponibles
    if (processedData.provenanceRecord?.modifications?.length > 0) {
      processedData.historicalComparison = analyzeHistoricalChanges(processedData);
    }

    // Agregar recomendaciones de seguridad
    processedData.securityRecommendations = generateSecurityRecommendations(processedData);

    return processedData;
  }, [analyzeHistoricalChanges, calculateDerivedMetrics, generateAuthenticityInsights, generateSecurityRecommendations]);

  const analyzeAuthenticity = useCallback(async () => {
    if (!contentId) {
      setState(prev => ({ ...prev, error: 'ID de contenido requerido' }));
      return;
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // Validar formato del contentId
      const isValidId = validateContentId(contentId);
      if (!isValidId.isValid) {
        throw new Error(isValidId.error);
      }

      // Realizar análisis completo de autenticidad
      const authenticityResult = await ContentAuthenticityAPIsService.analyzeContentAuthenticity(
        contentId,
        options
      );
      
      // Procesar datos adicionales
      const processedData = await processAuthenticityData(authenticityResult, options);
      
      setState({
        isLoading: false,
        data: processedData,
        error: null
      });

    } catch (error) {
      console.error('Error en análisis de autenticidad:', error);
      setState({
        isLoading: false,
        data: null,
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }, [contentId, options, processAuthenticityData]);

  // Auto-ejecutar análisis cuando cambie el contentId
  useEffect(() => {
    if (contentId) {
      analyzeAuthenticity();
    }
  }, [contentId, analyzeAuthenticity]);

  return {
    ...state,
    analyzeAuthenticity,
    refetch: analyzeAuthenticity
  };
}

// Función auxiliar para validar ID de contenido
function validateContentId(contentId: string): { isValid: boolean; error?: string } {
  if (!contentId || contentId.trim().length === 0) {
    return { isValid: false, error: 'ID de contenido requerido' };
  }

  const trimmed = contentId.trim();

  // Validar hash (64 caracteres hex)
  if (/^0x[a-fA-F0-9]{64}$/.test(trimmed)) {
    return { isValid: true };
  }

  // Validar IPFS hash
  if (/^Qm[a-zA-Z0-9]{44}$/.test(trimmed)) {
    return { isValid: true };
  }

  // Validar URL
  try {
    new URL(trimmed);
    return { isValid: true };
  } catch {
    // No es URL válida
  }

  // Validar ID alfanumérico
  if (/^[a-zA-Z0-9\-_]{3,}$/.test(trimmed)) {
    return { isValid: true };
  }

  return { 
    isValid: false, 
    error: 'Formato inválido. Use hash, IPFS hash, URL o ID alfanumérico' 
  };
}

