// Hook para análisis real de Authority Tracking
'use client';

import { useState, useEffect, useCallback } from 'react';
import { AuthorityTrackingAPIsService } from '@/services/apis/authority-tracking-apis';

interface AuthorityAnalysisState {
  isLoading: boolean;
  data: any | null;
  error: string | null;
}

export function useAuthorityAnalysis(identifier: string, options: {
  analysisType?: string;
  timeframe?: string;
  includeGovernance?: boolean;
  includeReputation?: boolean;
  includeInfluence?: boolean;
} = {}) {
  const [state, setState] = useState<AuthorityAnalysisState>({
    isLoading: false,
    data: null,
    error: null
  });

  // Función auxiliar para parsear timeframe
  const parseTimeframe = useCallback((timeframe: string): number => {
    const timeframeMap: { [key: string]: number } = {
      '7d': 7,
      '30d': 30,
      '90d': 90,
      '1y': 365,
      'all': 9999
    };
    return timeframeMap[timeframe] || 30;
  }, []);

  // Función para calcular crecimiento de autoridad
  const calculateAuthorityGrowth = useCallback((evolution: any[]): number => {
    if (evolution.length < 2) return 0;
    
    const recent = evolution.slice(-3).map(e => e.overallScore);
    const older = evolution.slice(0, 3).map(e => e.overallScore);
    
    const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
    const olderAvg = older.reduce((a, b) => a + b, 0) / older.length;
    
    return ((recentAvg - olderAvg) / olderAvg) * 100;
  }, []);

  // Función para calcular tendencia de participación
  const calculateParticipationTrend = useCallback((evolution: any[]): string => {
    if (evolution.length < 3) return 'stable';
    
    const recent = evolution.slice(-3);
    const scores = recent.map(e => e.governanceScore);
    
    const trend = scores[2] - scores[0];
    
    if (trend > 5) return 'increasing';
    if (trend < -5) return 'decreasing';
    return 'stable';
  }, []);

  // Función para obtener roles únicos
  const getUniqueRoles = useCallback((participation: any[]): number => {
    const roles = new Set(participation.map(p => p.role));
    return roles.size;
  }, []);

  // Función para calcular métricas derivadas
  const calculateDerivedMetrics = useCallback((data: any) => {
    const governance = data.governanceMetrics || {};
    const social = data.socialReputationMetrics || {};
    const technical = data.technicalInfluenceMetrics || {};

    return {
      // Métricas de eficiencia
      governanceEfficiency: governance.successRate || 0,
      socialEngagement: social.networkInfluence || 0,
      technicalImpact: technical.technicalScore || 0,
      
      // Métricas de crecimiento
      authorityGrowth: calculateAuthorityGrowth(data.authorityEvolution || []),
      participationTrend: calculateParticipationTrend(data.authorityEvolution || []),
      
      // Métricas de diversificación
      protocolDiversification: (data.protocolParticipation || []).length,
      roleVariety: getUniqueRoles(data.protocolParticipation || []),
      
      // Métricas de red
      networkStrength: data.networkAnalysis?.networkCentrality || 0,
      connectionQuality: data.networkAnalysis?.influentialConnections || 0
    };
  }, [calculateAuthorityGrowth, calculateParticipationTrend, getUniqueRoles]);

  // Función para generar insights específicos
  const generateAuthorityInsights = useCallback((data: any, options: any) => {
    const insights = [];
    const governance = data.governanceMetrics || {};
    const social = data.socialReputationMetrics || {};
    const technical = data.technicalInfluenceMetrics || {};

    // Insights de gobernanza
    if (options.includeGovernance && governance.participationRate) {
      if (governance.participationRate > 80) {
        insights.push({
          type: 'positive',
          category: 'governance',
          title: 'Alta Participación en Gobernanza',
          description: `Participación del ${governance.participationRate}% en propuestas de gobernanza`,
          impact: 'high'
        });
      } else if (governance.participationRate < 30) {
        insights.push({
          type: 'warning',
          category: 'governance',
          title: 'Baja Participación en Gobernanza',
          description: `Solo ${governance.participationRate}% de participación en votaciones`,
          impact: 'medium'
        });
      }
    }

    // Insights de reputación social
    if (options.includeReputation && social.socialScore) {
      if (social.socialScore > 85) {
        insights.push({
          type: 'positive',
          category: 'reputation',
          title: 'Excelente Reputación Social',
          description: `Score de reputación de ${social.socialScore}/100`,
          impact: 'high'
        });
      }
    }

    // Insights de influencia técnica
    if (options.includeInfluence && technical.technicalScore) {
      if (technical.githubContributions > 500) {
        insights.push({
          type: 'positive',
          category: 'technical',
          title: 'Alto Impacto Técnico',
          description: `${technical.githubContributions} contribuciones en GitHub`,
          impact: 'high'
        });
      }
    }

    // Insights de diversificación
    const protocolCount = (data.protocolParticipation || []).length;
    if (protocolCount > 5) {
      insights.push({
        type: 'positive',
        category: 'diversification',
        title: 'Amplia Diversificación',
        description: `Participación activa en ${protocolCount} protocolos`,
        impact: 'medium'
      });
    } else if (protocolCount < 2) {
      insights.push({
        type: 'warning',
        category: 'diversification',
        title: 'Baja Diversificación',
        description: 'Considerar participar en más protocolos',
        impact: 'low'
      });
    }

    return insights;
  }, []);

  // Función para procesar datos de autoridad según opciones
  const processAuthorityData = useCallback(async (rawData: any, options: any) => {
    const {
      analysisType = 'comprehensive',
      timeframe = '30d',
      includeGovernance = true,
      includeReputation = true,
      includeInfluence = true
    } = options;

    // Filtrar datos según las opciones seleccionadas
    let processedData = { ...rawData };

    // Aplicar filtros según el tipo de análisis
    if (analysisType !== 'comprehensive') {
      switch (analysisType) {
        case 'governance':
          processedData = {
            ...processedData,
            focusArea: 'governance',
            primaryMetrics: processedData.governanceMetrics,
            secondaryMetrics: includeReputation ? processedData.socialReputationMetrics : null
          };
          break;
        case 'reputation':
          processedData = {
            ...processedData,
            focusArea: 'reputation',
            primaryMetrics: processedData.socialReputationMetrics,
            secondaryMetrics: includeGovernance ? processedData.governanceMetrics : null
          };
          break;
        case 'influence':
          processedData = {
            ...processedData,
            focusArea: 'influence',
            primaryMetrics: processedData.technicalInfluenceMetrics,
            secondaryMetrics: includeReputation ? processedData.socialReputationMetrics : null
          };
          break;
      }
    }

    // Filtrar evolución histórica según timeframe
    if (processedData.authorityEvolution && timeframe !== 'all') {
      const days = parseTimeframe(timeframe);
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);
      
      processedData.authorityEvolution = processedData.authorityEvolution.filter(
        (item: any) => new Date(item.date) >= cutoffDate
      );
    }

    // Agregar métricas calculadas
    processedData.calculatedMetrics = calculateDerivedMetrics(processedData);
    
    // Agregar insights específicos
    processedData.insights = generateAuthorityInsights(processedData, options);

    return processedData;
  }, [parseTimeframe, calculateDerivedMetrics, generateAuthorityInsights]);

  const analyzeAuthority = useCallback(async () => {
    if (!identifier) {
      setState(prev => ({ ...prev, error: 'Identificador requerido' }));
      return;
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // Validar si es una dirección válida
      const isValidAddress = /^0x[a-fA-F0-9]{40}$/.test(identifier) || identifier.includes('.eth');
      
      if (!isValidAddress && !identifier.includes('.')) {
        // Si no es una dirección, podría ser un nombre de proyecto
        console.log('Analizando proyecto por nombre:', identifier);
      }

      // Realizar análisis completo de autoridad
      const analysisResult = await AuthorityTrackingAPIsService.analyzeDecentralizedAuthority(identifier);
      
      // Procesar datos adicionales según las opciones
      const processedData = await processAuthorityData(analysisResult, options);
      
      setState({
        isLoading: false,
        data: processedData,
        error: null
      });

    } catch (error) {
      console.error('Error en análisis de autoridad:', error);
      setState({
        isLoading: false,
        data: null,
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }, [identifier, options, processAuthorityData]);

  // Auto-ejecutar análisis cuando cambie el identificador
  useEffect(() => {
    if (identifier) {
      analyzeAuthority();
    }
  }, [identifier, analyzeAuthority]);

  return {
    ...state,
    analyzeAuthority,
    refetch: analyzeAuthority
  };
}

