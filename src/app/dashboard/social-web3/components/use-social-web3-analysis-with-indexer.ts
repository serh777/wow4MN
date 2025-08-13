'use client';

import { useState } from 'react';
import { useAnalysisNotifications } from '@/components/notifications/use-analysis-notifications';
import { useIndexerService, IndexerQueryParams } from '@/hooks/useIndexerService';
import type { AnalysisResult } from '@/types';

// Tipos específicos para el análisis de social-web3 con indexador
interface SocialWeb3AnalysisParams {
  address: string;
  network: string;
  platforms?: string[];
  includeActivity?: boolean;
  includeFollowers?: boolean;
  includeContent?: boolean;
  fromTimestamp?: Date;
  toTimestamp?: Date;
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

export function useSocialWeb3AnalysisWithIndexer() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<AnalysisResult | null>(null);
  const { notifyAnalysisStarted, notifyAnalysisCompleted, notifyAnalysisError } = useAnalysisNotifications();
  const { queryIndexedData, filterIndexers } = useIndexerService();

  const handleSubmit = async (data: SocialWeb3AnalysisParams) => {
    setLoading(true);
    notifyAnalysisStarted('Análisis Social Web3');
    
    try {
      if (!data.address || data.address.trim() === '') {
        throw new Error('La dirección es obligatoria');
      }

      // Determinar qué tipos de datos necesitamos indexar
      const dataTypes: string[] = [];
      if (data.includeActivity) dataTypes.push('social-activity');
      if (data.includeFollowers) dataTypes.push('social-followers');
      if (data.includeContent) dataTypes.push('social-content');
      
      // Si no se especifica ninguno, incluir actividad por defecto
      if (dataTypes.length === 0) {
        dataTypes.push('social-activity');
      }

      // Verificar si existen indexadores adecuados para esta consulta
      const availableIndexers = filterIndexers({
        network: data.network,
        status: 'active',
        dataType: dataTypes
      });

      // Si no hay indexadores activos para esta red y tipos de datos, buscar inactivos
      if (availableIndexers.length === 0) {
        const inactiveIndexers = filterIndexers({
          network: data.network,
          dataType: dataTypes
        });

        // Nota: En modo de exportación estática, no se pueden iniciar indexadores automáticamente
        // ya que requiere rutas de API dinámicas que no están disponibles
        if (inactiveIndexers.length > 0) {
          notifyAnalysisError('Análisis Social Web3', 'Los indexadores deben iniciarse manualmente en modo de exportación estática');
          return;
        } else {
          // No hay indexadores configurados para esta consulta
          notifyAnalysisError('Análisis Social Web3', 'No hay indexadores disponibles para esta consulta');
          return;
        }
      }

      // Preparar parámetros de consulta para el indexador
      const queryParams: IndexerQueryParams = {
        network: data.network,
        address: data.address,
        dataType: dataTypes  // Add the missing dataType property
      };

      // Consultar actividad social
      let activities: SocialActivityData[] = [];
      if (dataTypes.includes('social-activity')) {
        const activityResult = await queryIndexedData<SocialActivityData>({
          ...queryParams,
          dataType: ['social-activity']
        });
        activities = activityResult.data;
      }

      // Consultar seguidores
      let followers: SocialFollowerData[] = [];
      if (dataTypes.includes('social-followers')) {
        const followersResult = await queryIndexedData<SocialFollowerData>({
          ...queryParams,
          dataType: ['social-followers']
        });
        followers = followersResult.data;
      }

      // Consultar contenido
      let contents: SocialContentData[] = [];
      if (dataTypes.includes('social-content')) {
        const contentResult = await queryIndexedData<SocialContentData>({
          ...queryParams,
          dataType: ['social-content']
        });
        contents = contentResult.data;
      }

      // Filtrar por plataformas si se especifican
      if (data.platforms && data.platforms.length > 0) {
        activities = activities.filter(activity => data.platforms?.includes(activity.platform));
        followers = followers.filter(follower => data.platforms?.includes(follower.platform));
        contents = contents.filter(content => data.platforms?.includes(content.platform));
      }

      // Filtrar por rango de tiempo si se especifica
      if (data.fromTimestamp) {
        activities = activities.filter(activity => activity.timestamp >= data.fromTimestamp!);
        followers = followers.filter(follower => follower.followingSince >= data.fromTimestamp!);
        contents = contents.filter(content => content.timestamp >= data.fromTimestamp!);
      }

      if (data.toTimestamp) {
        activities = activities.filter(activity => activity.timestamp <= data.toTimestamp!);
        contents = contents.filter(content => content.timestamp <= data.toTimestamp!);
      }

      // Analizar actividad por plataforma
      const platformActivity: Record<string, number> = {};
      activities.forEach(activity => {
        platformActivity[activity.platform] = (platformActivity[activity.platform] || 0) + 1;
      });

      // Analizar tipos de actividad
      const activityTypes: Record<string, number> = {};
      activities.forEach(activity => {
        activityTypes[activity.type] = (activityTypes[activity.type] || 0) + 1;
      });

      // Analizar engagement del contenido
      const contentEngagement = contents.map(content => {
        const totalEngagement = (content.metrics.likes || 0) + 
                               (content.metrics.comments || 0) + 
                               (content.metrics.reposts || 0);
        return {
          contentId: content.contentId,
          platform: content.platform,
          timestamp: content.timestamp,
          engagement: totalEngagement
        };
      }).sort((a, b) => b.engagement - a.engagement);

      // Generar resultados del análisis
      const socialData = {
        address: data.address,
        network: data.network,
        activities,
        followers,
        contents,
        metrics: {
          totalActivities: activities.length,
          totalFollowers: followers.length,
          totalContent: contents.length,
          platformDistribution: platformActivity,
          activityTypeDistribution: activityTypes,
          averageEngagementPerContent: contents.length > 0 ?
            contents.reduce((sum, content) => {
              return sum + ((content.metrics.likes || 0) + 
                           (content.metrics.comments || 0) + 
                           (content.metrics.reposts || 0));
            }, 0) / contents.length : 0
        },
        engagement: {
          topContent: contentEngagement.slice(0, 5),
          recentActivity: [...activities].sort((a, b) => 
            b.timestamp.getTime() - a.timestamp.getTime()
          ).slice(0, 10),
          influentialFollowers: [...followers]
            .filter(f => f.influenceScore !== undefined)
            .sort((a, b) => (b.influenceScore || 0) - (a.influenceScore || 0))
            .slice(0, 5)
        },
        recommendations: [
          // Recomendaciones basadas en el análisis
          'Aumentar la actividad en plataformas con menor presencia',
          'Crear contenido similar al que ha generado mayor engagement',
          'Interactuar más con seguidores influyentes para aumentar alcance'
        ]
      };

      // Calcular puntuación basada en varios factores
      const activityScore = Math.min(100, activities.length / 5);
      const followerScore = Math.min(100, followers.length / 2);
      const contentScore = Math.min(100, contents.length * 5);
      const engagementScore = Math.min(100, socialData.metrics.averageEngagementPerContent * 10);
      
      const score = Math.floor((activityScore + followerScore + contentScore + engagementScore) / 4);

      setResults({
        type: 'social-web3',
        data: socialData,
        score
      });
      
      notifyAnalysisCompleted('Análisis Social Web3', score);
    } catch (error) {
      console.error('Error en análisis social Web3:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      notifyAnalysisError('Análisis Social Web3', errorMessage);
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