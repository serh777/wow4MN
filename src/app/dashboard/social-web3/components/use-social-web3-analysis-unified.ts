'use client';

import { useAnalysisWithIndexer, BaseAnalysisParams } from '@/hooks/useAnalysisWithIndexer';
import type { AnalysisResult } from '@/types';

// Tipos específicos para el análisis social-web3
export interface SocialWeb3AnalysisParams extends BaseAnalysisParams {
  platforms?: string[];
  includeActivity?: boolean;
  includeFollowers?: boolean;
  includeContent?: boolean;
}

interface SocialActivityData {
  platform: string;
  type: 'post' | 'comment' | 'reaction' | 'follow' | 'mint' | 'other';
  timestamp: Date;
  contentId?: string;
  content?: string;
  metrics?: {
    likes?: number;
    comments?: number;
    reposts?: number;
  };
}

interface SocialFollowerData {
  platform: string;
  followerAddress: string;
  followingSince: Date;
  influenceScore?: number;
}

interface SocialContentData {
  platform: string;
  contentId: string;
  contentType: 'post' | 'article' | 'nft' | 'comment' | 'other';
  timestamp: Date;
  content: string;
  metrics: {
    views?: number;
    likes?: number;
    comments?: number;
    reposts?: number;
  };
}

interface SocialWeb3Data {
  address: string;
  network: string;
  platforms: string[];
  activity?: SocialActivityData[];
  followers?: SocialFollowerData[];
  content?: SocialContentData[];
  metrics: {
    engagementScore: number;
    influenceScore: number;
    contentQualityScore: number;
    communityScore: number;
    growthScore: number;
  };
  recommendations: string[];
}

/**
 * Hook unificado para análisis social-web3
 * 
 * Este hook puede funcionar con o sin indexador, dependiendo del parámetro useIndexer.
 * Reemplaza tanto a useSocialWeb3Analysis como a useSocialWeb3AnalysisWithIndexer.
 */
export function useSocialWeb3Analysis() {
  // Función para validar parámetros
  const validateParams = (params: SocialWeb3AnalysisParams) => {
    if (!params.address || params.address.trim() === '') {
      throw new Error('La dirección es obligatoria');
    }
  };

  // Función para generar datos simulados (cuando no se usa indexador)
  const generateMockData = (params: SocialWeb3AnalysisParams): AnalysisResult => {
    const platforms = params.platforms || ['lens', 'farcaster', 'mirror', 'cyberconnect'];
    
    const socialData: SocialWeb3Data = {
      address: params.address || '',
      network: params.network || 'ethereum',
      platforms,
      metrics: {
        engagementScore: Math.floor(Math.random() * 30) + 60,
        influenceScore: Math.floor(Math.random() * 25) + 65,
        contentQualityScore: Math.floor(Math.random() * 20) + 70,
        communityScore: Math.floor(Math.random() * 35) + 55,
        growthScore: Math.floor(Math.random() * 30) + 60
      },
      recommendations: [
        'Aumentar la frecuencia de publicación en Lens',
        'Interactuar más con creadores de contenido influyentes',
        'Diversificar el contenido entre plataformas',
        'Participar en más comunidades relacionadas con tus intereses'
      ]
    };

    // Generar datos de actividad simulados si se solicitan
    if (params.includeActivity) {
      socialData.activity = generateMockActivity(platforms);
    }

    // Generar datos de seguidores simulados si se solicitan
    if (params.includeFollowers) {
      socialData.followers = generateMockFollowers(platforms);
    }

    // Generar datos de contenido simulados si se solicitan
    if (params.includeContent) {
      socialData.content = generateMockContent(platforms);
    }

    const score = Math.floor(
      Object.values(socialData.metrics).reduce((a, b) => a + b, 0) / 
      Object.values(socialData.metrics).length
    );

    return {
      type: 'social-web3',
      data: socialData,
      score
    };
  };

  // Funciones auxiliares para generar datos simulados
  const generateMockActivity = (platforms: string[]): SocialActivityData[] => {
    const activities: SocialActivityData[] = [];
    const types: Array<'post' | 'comment' | 'reaction' | 'follow' | 'mint' | 'other'> = 
      ['post', 'comment', 'reaction', 'follow', 'mint', 'other'];
    
    // Generar entre 5 y 15 actividades aleatorias
    const activityCount = Math.floor(Math.random() * 10) + 5;
    
    for (let i = 0; i < activityCount; i++) {
      const platform = platforms[Math.floor(Math.random() * platforms.length)];
      const type = types[Math.floor(Math.random() * types.length)];
      const daysAgo = Math.floor(Math.random() * 30);
      const timestamp = new Date();
      timestamp.setDate(timestamp.getDate() - daysAgo);
      
      activities.push({
        platform,
        type,
        timestamp,
        contentId: type === 'post' || type === 'comment' ? `content-${Math.floor(Math.random() * 1000)}` : undefined,
        content: type === 'post' || type === 'comment' ? `Ejemplo de contenido en ${platform}` : undefined,
        metrics: type === 'post' ? {
          likes: Math.floor(Math.random() * 50),
          comments: Math.floor(Math.random() * 10),
          reposts: Math.floor(Math.random() * 5)
        } : undefined
      });
    }
    
    return activities;
  };

  const generateMockFollowers = (platforms: string[]): SocialFollowerData[] => {
    const followers: SocialFollowerData[] = [];
    
    // Generar entre 3 y 12 seguidores aleatorios
    const followerCount = Math.floor(Math.random() * 9) + 3;
    
    for (let i = 0; i < followerCount; i++) {
      const platform = platforms[Math.floor(Math.random() * platforms.length)];
      const monthsAgo = Math.floor(Math.random() * 12);
      const followingSince = new Date();
      followingSince.setMonth(followingSince.getMonth() - monthsAgo);
      
      followers.push({
        platform,
        followerAddress: `0x${Math.random().toString(16).substring(2, 14)}`,
        followingSince,
        influenceScore: Math.floor(Math.random() * 100)
      });
    }
    
    return followers;
  };

  const generateMockContent = (platforms: string[]): SocialContentData[] => {
    const contents: SocialContentData[] = [];
    const contentTypes: Array<'post' | 'article' | 'nft' | 'comment' | 'other'> = 
      ['post', 'article', 'nft', 'comment', 'other'];
    
    // Generar entre 4 y 10 contenidos aleatorios
    const contentCount = Math.floor(Math.random() * 6) + 4;
    
    for (let i = 0; i < contentCount; i++) {
      const platform = platforms[Math.floor(Math.random() * platforms.length)];
      const contentType = contentTypes[Math.floor(Math.random() * contentTypes.length)];
      const daysAgo = Math.floor(Math.random() * 60);
      const timestamp = new Date();
      timestamp.setDate(timestamp.getDate() - daysAgo);
      
      contents.push({
        platform,
        contentId: `content-${Math.floor(Math.random() * 1000)}`,
        contentType,
        timestamp,
        content: `Ejemplo de ${contentType} en ${platform}`,
        metrics: {
          views: Math.floor(Math.random() * 200),
          likes: Math.floor(Math.random() * 50),
          comments: Math.floor(Math.random() * 15),
          reposts: Math.floor(Math.random() * 10)
        }
      });
    }
    
    return contents;
  };

  // Función para procesar resultados del indexador
  const processResults = (data: any): AnalysisResult => {
    const activity = data['social-activity'] || [];
    const followers = data['social-followers'] || [];
    const content = data['social-content'] || [];
    
    // Extraer plataformas únicas de los datos
    const platforms = new Set<string>();
    activity.forEach((item: SocialActivityData) => platforms.add(item.platform));
    followers.forEach((item: SocialFollowerData) => platforms.add(item.platform));
    content.forEach((item: SocialContentData) => platforms.add(item.platform));
    
    // Calcular métricas basadas en datos reales
    const engagementScore = calculateEngagementScore(activity, content);
    const influenceScore = calculateInfluenceScore(followers, content);
    const contentQualityScore = calculateContentQualityScore(content);
    const communityScore = calculateCommunityScore(activity, followers);
    const growthScore = calculateGrowthScore(activity, followers, content);
    
    const socialData: SocialWeb3Data = {
      address: data.address,
      network: data.network,
      platforms: Array.from(platforms),
      activity,
      followers,
      content,
      metrics: {
        engagementScore,
        influenceScore,
        contentQualityScore,
        communityScore,
        growthScore
      },
      recommendations: generateRecommendations(activity, followers, content, Array.from(platforms))
    };

    const score = Math.floor(
      Object.values(socialData.metrics).reduce((a, b) => a + b, 0) / 
      Object.values(socialData.metrics).length
    );

    return {
      type: 'social-web3',
      data: socialData,
      score
    };
  };

  // Funciones auxiliares para el procesamiento de resultados
  const calculateEngagementScore = (activity: SocialActivityData[], content: SocialContentData[]): number => {
    if (activity.length === 0 && content.length === 0) return 50;
    
    let totalEngagement = 0;
    let engagementPoints = 0;
    
    // Puntos por actividad
    activity.forEach(item => {
      switch (item.type) {
        case 'post': engagementPoints += 5; break;
        case 'comment': engagementPoints += 3; break;
        case 'reaction': engagementPoints += 1; break;
        case 'follow': engagementPoints += 2; break;
        case 'mint': engagementPoints += 4; break;
        default: engagementPoints += 1;
      }
    });
    
    // Puntos por interacciones en contenido
    content.forEach(item => {
      const interactions = (item.metrics.likes || 0) + 
                         (item.metrics.comments || 0) * 2 + 
                         (item.metrics.reposts || 0) * 3;
      totalEngagement += interactions;
    });
    
    // Calcular puntuación final (máximo 100)
    const baseScore = 50;
    const activityBonus = Math.min(25, engagementPoints / 2);
    const interactionBonus = Math.min(25, totalEngagement / 20);
    
    return Math.min(100, baseScore + activityBonus + interactionBonus);
  };

  const calculateInfluenceScore = (followers: SocialFollowerData[], content: SocialContentData[]): number => {
    if (followers.length === 0 && content.length === 0) return 50;
    
    // Puntuación base
    let score = 50;
    
    // Bonificación por número de seguidores
    score += Math.min(20, followers.length * 2);
    
    // Bonificación por seguidores influyentes
    const influentialFollowers = followers.filter(f => (f.influenceScore || 0) > 70).length;
    score += Math.min(15, influentialFollowers * 3);
    
    // Bonificación por alcance de contenido
    const totalViews = content.reduce((sum, item) => sum + (item.metrics.views || 0), 0);
    score += Math.min(15, totalViews / 100);
    
    return Math.min(100, score);
  };

  const calculateContentQualityScore = (content: SocialContentData[]): number => {
    if (content.length === 0) return 50;
    
    // Puntuación base
    let score = 60;
    
    // Bonificación por diversidad de contenido
    const contentTypes = new Set(content.map(c => c.contentType));
    score += contentTypes.size * 5;
    
    // Bonificación por engagement promedio
    const avgEngagement = content.reduce((sum, item) => {
      const engagement = (item.metrics.likes || 0) + 
                        (item.metrics.comments || 0) * 2 + 
                        (item.metrics.reposts || 0) * 3;
      return sum + engagement;
    }, 0) / content.length;
    
    score += Math.min(20, avgEngagement / 2);
    
    return Math.min(100, score);
  };

  const calculateCommunityScore = (activity: SocialActivityData[], followers: SocialFollowerData[]): number => {
    // Puntuación base
    let score = 55;
    
    // Bonificación por interacciones comunitarias
    const communityInteractions = activity.filter(a => 
      a.type === 'comment' || a.type === 'follow'
    ).length;
    
    score += Math.min(25, communityInteractions * 2);
    
    // Bonificación por seguidores
    score += Math.min(20, followers.length * 1.5);
    
    return Math.min(100, score);
  };

  const calculateGrowthScore = (
    activity: SocialActivityData[], 
    followers: SocialFollowerData[], 
    content: SocialContentData[]
  ): number => {
    // Ordenar actividades por fecha
    const sortedActivity = [...activity].sort((a, b) => 
      a.timestamp.getTime() - b.timestamp.getTime()
    );
    
    // Ordenar seguidores por fecha
    const sortedFollowers = [...followers].sort((a, b) => 
      a.followingSince.getTime() - b.followingSince.getTime()
    );
    
    // Ordenar contenido por fecha
    const sortedContent = [...content].sort((a, b) => 
      a.timestamp.getTime() - b.timestamp.getTime()
    );
    
    // Calcular crecimiento de actividad
    let activityGrowth = 0;
    if (sortedActivity.length > 1) {
      const firstHalf = sortedActivity.slice(0, Math.floor(sortedActivity.length / 2));
      const secondHalf = sortedActivity.slice(Math.floor(sortedActivity.length / 2));
      activityGrowth = (secondHalf.length - firstHalf.length) / firstHalf.length * 100;
    }
    
    // Calcular crecimiento de seguidores
    let followerGrowth = 0;
    if (sortedFollowers.length > 1) {
      const firstHalf = sortedFollowers.slice(0, Math.floor(sortedFollowers.length / 2));
      const secondHalf = sortedFollowers.slice(Math.floor(sortedFollowers.length / 2));
      followerGrowth = (secondHalf.length - firstHalf.length) / firstHalf.length * 100;
    }
    
    // Calcular crecimiento de engagement en contenido
    let contentGrowth = 0;
    if (sortedContent.length > 1) {
      const firstHalf = sortedContent.slice(0, Math.floor(sortedContent.length / 2));
      const secondHalf = sortedContent.slice(Math.floor(sortedContent.length / 2));
      
      const firstHalfEngagement = firstHalf.reduce((sum, item) => 
        sum + (item.metrics.likes || 0) + (item.metrics.comments || 0) + (item.metrics.reposts || 0), 0
      );
      
      const secondHalfEngagement = secondHalf.reduce((sum, item) => 
        sum + (item.metrics.likes || 0) + (item.metrics.comments || 0) + (item.metrics.reposts || 0), 0
      );
      
      if (firstHalfEngagement > 0) {
        contentGrowth = (secondHalfEngagement - firstHalfEngagement) / firstHalfEngagement * 100;
      }
    }
    
    // Calcular puntuación final
    const baseScore = 50;
    const growthBonus = Math.min(50, (
      Math.max(0, activityGrowth) + 
      Math.max(0, followerGrowth) + 
      Math.max(0, contentGrowth)
    ) / 6);
    
    return Math.min(100, baseScore + growthBonus);
  };

  const generateRecommendations = (
    activity: SocialActivityData[], 
    followers: SocialFollowerData[], 
    content: SocialContentData[],
    platforms: string[]
  ): string[] => {
    const recommendations: string[] = [];
    
    // Recomendaciones basadas en actividad
    if (activity.length < 10) {
      recommendations.push('Aumentar la frecuencia de interacción en plataformas Web3');
    }
    
    // Recomendaciones basadas en tipos de actividad
    const activityTypes = new Set(activity.map(a => a.type));
    if (!activityTypes.has('post')) {
      recommendations.push('Crear más contenido original en tus plataformas');
    }
    if (!activityTypes.has('comment')) {
      recommendations.push('Participar más en conversaciones de la comunidad');
    }
    
    // Recomendaciones basadas en plataformas
    if (platforms.length < 3) {
      recommendations.push('Diversificar tu presencia en más plataformas Web3');
    }
    
    // Recomendaciones basadas en seguidores
    if (followers.length < 5) {
      recommendations.push('Construir una comunidad más amplia interactuando con más usuarios');
    }
    
    // Recomendaciones basadas en contenido
    if (content.length > 0) {
      const avgLikes = content.reduce((sum, item) => sum + (item.metrics.likes || 0), 0) / content.length;
      if (avgLikes < 10) {
        recommendations.push('Mejorar la calidad del contenido para aumentar el engagement');
      }
    }
    
    // Añadir recomendaciones genéricas si hay pocas específicas
    if (recommendations.length < 3) {
      recommendations.push('Participar en más comunidades relacionadas con tus intereses');
      recommendations.push('Interactuar más con creadores de contenido influyentes');
    }
    
    return recommendations;
  };

  // Determinar los tipos de datos a consultar basados en los parámetros
  const getDataTypes = (params: SocialWeb3AnalysisParams): string[] => {
    const dataTypes: string[] = [];
    if (params.includeActivity) dataTypes.push('social-activity');
    if (params.includeFollowers) dataTypes.push('social-followers');
    if (params.includeContent) dataTypes.push('social-content');
    
    // Si no se especifica ninguno, incluir actividad por defecto
    if (dataTypes.length === 0) {
      dataTypes.push('social-activity');
    }
    
    return dataTypes;
  };

  // Usar el hook base con las opciones específicas para social-web3
  return useAnalysisWithIndexer<SocialWeb3AnalysisParams>({
    analysisType: 'social-web3',
    dataTypes: ['social-activity', 'social-followers', 'social-content'], // Tipos de datos predeterminados
    validateParams,
    processResults,
    generateMockData
  });
}