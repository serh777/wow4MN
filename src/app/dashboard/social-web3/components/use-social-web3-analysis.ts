'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import type { AnalysisResult } from '@/types';

export function useSocialWeb3Analysis() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<AnalysisResult | null>(null);
  const router = useRouter();

  const handleSubmit = async (data: any) => {
    setLoading(true);
    toast.info('Iniciando análisis de presencia social Web3...');
    
    try {
      const socialData = {
        metrics: {
          engagement: Math.floor(Math.random() * 30) + 60,
          reach: Math.floor(Math.random() * 25) + 65,
          influence: Math.floor(Math.random() * 20) + 70,
          consistency: Math.floor(Math.random() * 35) + 55
        },
        platforms: [
          {
            name: 'Mastodon',
            connected: !!data.mastodonHandle,
            followers: Math.floor(Math.random() * 1000) + 100,
            posts: Math.floor(Math.random() * 500) + 50,
            engagement: Math.floor(Math.random() * 20) + 5
          },
          {
            name: 'Hive',
            connected: !!data.hiveHandle,
            followers: Math.floor(Math.random() * 2000) + 200,
            posts: Math.floor(Math.random() * 300) + 30,
            engagement: Math.floor(Math.random() * 15) + 8
          },
          {
            name: 'Lens Protocol',
            connected: !!data.lensHandle,
            followers: Math.floor(Math.random() * 1500) + 150,
            posts: Math.floor(Math.random() * 200) + 20,
            engagement: Math.floor(Math.random() * 25) + 10
          },
          {
            name: 'Mirror.xyz',
            connected: !!data.mirrorHandle,
            followers: Math.floor(Math.random() * 800) + 80,
            posts: Math.floor(Math.random() * 100) + 10,
            engagement: Math.floor(Math.random() * 30) + 15
          }
        ],
        recommendations: [
          {
            platform: 'Mastodon',
            tips: [
              'Aumenta la frecuencia de publicación',
              'Interactúa más con otros usuarios',
              'Utiliza hashtags relevantes'
            ]
          },
          {
            platform: 'Hive',
            tips: [
              'Crea contenido más técnico',
              'Participa en comunidades activas',
              'Utiliza etiquetas específicas'
            ]
          },
          {
            platform: 'Lens Protocol',
            tips: [
              'Conecta con más perfiles Web3',
              'Comparte actualizaciones del proyecto',
              'Utiliza colecciones para organizar contenido'
            ]
          }
        ]
      };

      const score = Math.floor(
        Object.values(socialData.metrics).reduce((a, b) => a + b, 0) / 
        Object.values(socialData.metrics).length
      );

      const analysisResults = {
        type: 'social-web3',
        data: socialData,
        score
      };
      
      setResults(analysisResults);
      
      // Save detailed results to sessionStorage
      const detailedResults = {
        platforms: data.platforms || ['Mastodon', 'Hive', 'Lens Protocol', 'Mirror.xyz'],
        metrics: socialData.metrics,
        platforms_data: socialData.platforms,
        recommendations: socialData.recommendations,
        score,
        detailedAnalysis: {
          contentAnalysis: {
            topHashtags: ['#Web3', '#DeFi', '#NFT', '#Blockchain', '#Crypto', '#DAO'],
            bestPerformingContent: [
              'Guías técnicas sobre DeFi',
              'Análisis de mercado cripto',
              'Tutoriales de desarrollo Web3',
              'Reseñas de protocolos'
            ],
            optimalPostingTimes: ['9:00 AM', '1:00 PM', '6:00 PM', '9:00 PM']
          },
          audienceInsights: {
            demographics: [
              { age: '18-24', percentage: 25 },
              { age: '25-34', percentage: 40 },
              { age: '35-44', percentage: 25 },
              { age: '45+', percentage: 10 }
            ],
            interests: [
              { topic: 'DeFi', engagement: 85 },
              { topic: 'NFTs', engagement: 70 },
              { topic: 'DAOs', engagement: 65 },
              { topic: 'Gaming', engagement: 60 },
              { topic: 'Metaverse', engagement: 55 }
            ],
            geographicDistribution: [
              { region: 'América del Norte', percentage: 35 },
              { region: 'Europa', percentage: 30 },
              { region: 'Asia', percentage: 25 },
              { region: 'Otros', percentage: 10 }
            ]
          },
          competitorAnalysis: {
            similarProfiles: [
              { name: '@web3builder', followers: 15000, engagement: 8.5 },
              { name: '@defiexpert', followers: 12000, engagement: 7.2 },
              { name: '@nftcreator', followers: 18000, engagement: 6.8 }
            ],
            industryBenchmarks: {
              avgEngagement: 7.5,
              avgFollowers: 8500
            }
          },
          growthProjections: {
            nextMonth: {
              followers: Math.floor(Math.random() * 500) + 200,
              engagement: Math.floor(Math.random() * 2) + 1
            },
            nextQuarter: {
              followers: Math.floor(Math.random() * 1500) + 800,
              engagement: Math.floor(Math.random() * 5) + 3
            }
          }
        }
      };
      
      sessionStorage.setItem('socialWeb3AnalysisResults', JSON.stringify(detailedResults));
      
      toast.success('Análisis de presencia social Web3 completado exitosamente');
      
      // Redirect after 3 seconds
      setTimeout(() => {
        router.push('/dashboard/social-web3/analysis-results');
      }, 3000);
    } catch (error) {
      console.error('Error en análisis social Web3:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      toast.error(`Error al analizar presencia social Web3: ${errorMessage}`);
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