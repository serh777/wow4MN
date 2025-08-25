'use client';

import { useEffect, useState, Suspense, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/ui/use-toast';
import OverallScoreCard from './components/OverallScoreCard';
import OverviewMetrics from './components/OverviewMetrics';
import Web3SeoMetrics from './components/Web3SeoMetrics';
import SmartContractMetrics from './components/SmartContractMetrics';
import OpportunitiesSection from './components/OpportunitiesSection';
import DiagnosticsSection from './components/DiagnosticsSection';
import LoadingState from './components/LoadingState';
import ErrorState from './components/ErrorState';
import { AnalysisResults } from './types';





function AnalysisResultsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState<AnalysisResults | null>(null);
  const [indexerConnecting, setIndexerConnecting] = useState(true);
  const [indexerProgress, setIndexerProgress] = useState(0);
  const [hasAIResults, setHasAIResults] = useState(false);

  const getAnalysisTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'comprehensive': 'Análisis Integral',
      'performance': 'Análisis de Rendimiento',
      'seo': 'Análisis SEO',
      'security': 'Análisis de Seguridad',
      'blockchain': 'Análisis Blockchain'
    };
    return labels[type] || 'Análisis Personalizado';
  };

  const analysisType = searchParams.get('type') || 'comprehensive';
  const url = searchParams.get('url') || 'wowseoweb3.com';

  const generateMockResults = useCallback((type: 'comprehensive' | 'predictive' | 'anomaly' | 'opportunity'): AnalysisResults => {
    // Generar seed basado en la URL para resultados consistentes
    const seed = url.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const seededRandom = (index: number) => {
      const x = Math.sin(seed + index) * 10000;
      return x - Math.floor(x);
    };
    
    const overallScoreValue = Math.floor(seededRandom(1) * 40) + 60;
    const getScoreStatus = (score: number): 'excellent' | 'good' | 'fair' | 'poor' => {
      if (score >= 90) return 'excellent';
      if (score >= 75) return 'good';
      if (score >= 60) return 'fair';
      return 'poor';
    };
    
    let baseResults: AnalysisResults = {
      id: `analysis-${Date.now()}`,
      timestamp: new Date().toISOString(),
      status: 'completed',
      progress: 100,
      overallScore: {
        score: overallScoreValue,
        status: getScoreStatus(overallScoreValue),
        insights: [
          'Strong Web3 integration detected',
          'Smart contract optimization opportunities identified',
          'Good community engagement metrics'
        ],
        recommendations: [
          'Improve gas optimization in smart contracts',
          'Enhance metadata structure for better discoverability',
          'Implement more comprehensive error handling'
        ]
      },
      web3SeoMetrics: {
        onChainPresence: Math.floor(seededRandom(3) * 30) + 70,
        smartContractOptimization: Math.floor(seededRandom(4) * 40) + 60,
        decentralizedContent: Math.floor(seededRandom(5) * 35) + 65,
        communityEngagement: Math.floor(seededRandom(6) * 25) + 75,
        tokenomicsHealth: Math.floor(seededRandom(7) * 30) + 70,
        trends: {
          period: '30d',
          changes: {
            onChainPresence: Math.floor(seededRandom(8) * 20) - 10,
            smartContractOptimization: Math.floor(seededRandom(9) * 15) - 7,
            decentralizedContent: Math.floor(seededRandom(10) * 25) - 12,
            communityEngagement: Math.floor(seededRandom(11) * 18) - 9,
            tokenomicsHealth: Math.floor(seededRandom(12) * 22) - 11
          }
        }
      },
      overviewMetrics: {
        totalAnalyzed: Math.floor(seededRandom(13) * 50) + 150,
        issuesFound: Math.floor(seededRandom(14) * 15) + 5,
        opportunitiesIdentified: Math.floor(seededRandom(15) * 10) + 8,
        completionRate: Math.floor(seededRandom(16) * 20) + 80,
        lastUpdated: new Date().toISOString()
      },
      smartContractMetrics: {
        contractsAnalyzed: Math.floor(seededRandom(17) * 10) + 5,
        vulnerabilities: {
          critical: Math.floor(seededRandom(18) * 3),
          high: Math.floor(seededRandom(19) * 5) + 1,
          medium: Math.floor(seededRandom(20) * 8) + 2,
          low: Math.floor(seededRandom(21) * 12) + 3
        },
        securityScore: Math.floor(seededRandom(22) * 30) + 70,
        gasOptimization: {
          current: Math.floor(seededRandom(23) * 50000) + 100000,
          potential: Math.floor(seededRandom(24) * 30000) + 70000,
          savings: Math.floor(seededRandom(25) * 40) + 20
        },
        codeQuality: {
          score: Math.floor(seededRandom(26) * 25) + 75,
          issues: ['Unused variables detected', 'Consider using events for logging'],
          suggestions: ['Implement access control patterns', 'Add comprehensive unit tests']
        },
        recommendations: [
          'Implement multi-signature wallet integration',
          'Add circuit breaker pattern for emergency stops',
          'Optimize gas usage in loops and storage operations'
        ]
      },
      opportunities: [
        {
          id: 'web3-meta-tags',
          title: 'Implementar Meta Tags Web3',
          description: 'Faltan meta tags específicos para DApps y Web3 que mejoran la indexación',
          impact: 'high',
          effort: 'low',
          category: 'web3-seo'
        },
        {
          id: 'gas-optimization',
          title: 'Optimizar Gas en Smart Contracts',
          description: 'Los contratos consumen 40% más gas del recomendado por mejores prácticas',
          impact: 'high',
          effort: 'medium',
          category: 'smart-contract'
        },
        {
          id: 'web3-loading',
          title: 'Mejorar Tiempo de Carga Web3',
          description: 'La inicialización de Web3 tarda 3.2s, 60% más que el estándar',
          impact: 'medium',
          effort: 'medium',
          category: 'dapp-performance'
        },
        {
          id: 'multi-chain',
          title: 'Soporte Multi-Chain',
          description: 'Solo soporta Ethereum, perdiendo 30% de usuarios potenciales',
          impact: 'high',
          effort: 'high',
          category: 'user-experience'
        }
      ],
      diagnostics: [
        {
          id: 'schema-org-dapps',
          category: 'web3-seo',
          status: 'warning',
          title: 'Falta Schema.org para DApps',
          description: 'No se detectó marcado estructurado específico para aplicaciones descentralizadas. Esto reduce la visibilidad en buscadores Web3.',
          recommendation: 'Implementar schema.org/SoftwareApplication con propiedades Web3 específicas incluyendo blockchain, contratos y categoría DApp'
        },
        {
          id: 'contract-verification',
          category: 'smart-contract',
          status: 'failed',
          title: 'Contrato no verificado en Etherscan',
          description: 'El smart contract principal (0x742d35Cc6634C0532925a3b8D4C9db96) no está verificado. Esto afecta la confianza del usuario y el SEO.',
          recommendation: 'Verificar el contrato en Etherscan usando Hardhat o Foundry. Incluir documentación ABI completa.'
        }
      ]
    };

    if (type === 'predictive') {
      baseResults = {
        ...baseResults,
        predictions: {
          marketTrend: 'Crecimiento del 45% en adopción DeFi',
          growthPotential: 85,
          riskFactors: ['Volatilidad del mercado', 'Cambios regulatorios', 'Competencia'],
          recommendations: ['Diversificar protocolos', 'Mejorar UX', 'Implementar cross-chain']
        }
      };
    }

    if (type === 'anomaly') {
      baseResults = {
        ...baseResults,
        anomalies: {
          detected: [
            {
              type: 'performance',
              severity: 'medium',
              description: 'Patrón inusual en velocidad de carga en móviles',
              timestamp: new Date().toISOString(),
              affectedMetrics: ['loadTime', 'mobilePerformance']
            },
            {
              type: 'engagement',
              severity: 'low',
              description: 'Fluctuación detectada en métricas de engagement',
              timestamp: new Date().toISOString(),
              affectedMetrics: ['userEngagement', 'sessionDuration']
            },
            {
              type: 'metadata',
              severity: 'medium',
              description: 'Inconsistencia en estructura de metadatos',
              timestamp: new Date().toISOString(),
              affectedMetrics: ['seoScore', 'structuredData']
            },
            {
              type: 'blockchain',
              severity: 'high',
              description: 'Anomalía en patrones de transacciones blockchain',
              timestamp: new Date().toISOString(),
              affectedMetrics: ['transactionVolume', 'gasUsage']
            }
          ],
          summary: {
            total: 4,
            bySeverity: {
              low: 1,
              medium: 2,
              high: 1,
              critical: 0
            }
          }
        }
      };
    }

    if (type === 'opportunity') {
      baseResults = {
        ...baseResults,
        marketOpportunities: {
          gaps: [
            'Falta de integración DeFi nativa',
            'Ausencia de NFT marketplace',
            'Limitada optimización para wallets móviles'
          ],
          potential: [
            'Liderar en experiencia Web3',
            'Capturar mercado DeFi emergente',
            'Innovar en UX blockchain'
          ],
          strategy: [
            'Implementar yield farming',
            'Crear marketplace NFT',
            'Optimizar para WalletConnect'
          ],
          trends: {
            industry: 'Web3 & DeFi',
            growth: Math.floor(seededRandom(20) * 30) + 70,
            keywords: ['DeFi', 'NFT', 'Web3', 'Blockchain', 'Metaverse']
          }
        }
      };
    }

    return baseResults;
  }, [url]);

  useEffect(() => {
    // Simular carga de análisis
    const timer = setTimeout(() => {
      const mockResults = generateMockResults(analysisType as 'comprehensive' | 'predictive' | 'anomaly' | 'opportunity');
      setResults(mockResults);
      setLoading(false);
      
      // Toast removido para evitar notificaciones duplicadas
      // El sistema de notificaciones ya maneja la finalización del análisis
    }, 3000);

    const indexerTimer = setInterval(() => {
      setIndexerProgress(prev => {
        if (prev >= 100) {
          setIndexerConnecting(false);
          clearInterval(indexerTimer);
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    return () => {
      clearTimeout(timer);
      clearInterval(indexerTimer);
    };
  }, [analysisType, url, generateMockResults, toast]); // Depende de analysisType, url, generateMockResults y toast

  if (loading) {
    return (
      <LoadingState 
         progress={indexerProgress}
         currentStep={indexerConnecting ? 'Connecting to indexer...' : 'Analyzing data...'}
         onCancel={() => router.push('/dashboard/ai-assistant')}
       />
    );
  }

  if (!results) {
    return (
      <ErrorState onGoHome={() => router.push('/dashboard/ai-assistant')} />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Resultados del Análisis
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                {getAnalysisTypeLabel(results.analysisType || 'standard')} para {results.url || 'sitio web'}
              </p>
            </div>

          </div>
          
          {/* Puntuación General */}
          <div className="flex justify-center mb-8">
            <div className="w-full max-w-md">
              <OverallScoreCard 
                score={results.overallScore.score}
                status={results.overallScore.status === 'fair' ? 'needs-improvement' : results.overallScore.status}
                insights={results.overallScore.insights}
                recommendations={results.overallScore.recommendations}
              />
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {/* Web3 SEO Section */}
          <Web3SeoMetrics 
            metrics={{
              domainAuthority: results.web3SeoMetrics.onChainPresence,
              pageAuthority: results.web3SeoMetrics.smartContractOptimization,
              backlinks: results.web3SeoMetrics.decentralizedContent,
              referringDomains: results.web3SeoMetrics.communityEngagement,
              organicKeywords: results.web3SeoMetrics.tokenomicsHealth,
              technicalScore: 85,
              contentScore: 78,
              userExperience: 82
            }}
            trends={{
              trafficChange: results.web3SeoMetrics.trends.changes.traffic || 0,
              keywordChange: results.web3SeoMetrics.trends.changes.keywords || 0,
              backlinkChange: results.web3SeoMetrics.trends.changes.backlinks || 0
            }}
          />
          
          {/* Smart Contract Section */}
          <SmartContractMetrics 
            metrics={{
              contractsAnalyzed: results.smartContractMetrics.contractsAnalyzed,
              securityScore: results.smartContractMetrics.securityScore,
              gasOptimization: results.smartContractMetrics.gasOptimization.current,
              codeQuality: results.smartContractMetrics.codeQuality.score,
              vulnerabilities: results.smartContractMetrics.vulnerabilities.critical + results.smartContractMetrics.vulnerabilities.high + results.smartContractMetrics.vulnerabilities.medium + results.smartContractMetrics.vulnerabilities.low,
              recommendations: results.smartContractMetrics.recommendations
            }}
          />
          
          {/* Opportunities Section */}
          <OpportunitiesSection opportunities={results.opportunities || []} />

          {/* Diagnostics Section */}
          <DiagnosticsSection diagnostics={results.diagnostics || []} />
        </div>
      </div>
    </div>
  );
}

export default function AnalysisResultsPageWrapper() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div></div>}>
      <AnalysisResultsPage />
    </Suspense>
  );
}