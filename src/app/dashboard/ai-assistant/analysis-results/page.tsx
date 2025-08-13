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
    
    const baseResults: AnalysisResults = {
      overallScore: Math.floor(seededRandom(1) * 40) + 60,
      analysisType: type,
      url: url,
      riskLevel: ['low', 'medium', 'high'][Math.floor(seededRandom(2) * 3)] as 'low' | 'medium' | 'high',
      indexerStatus: {
        connected: true,
        dataSource: 'Ethereum Mainnet',
        lastUpdate: new Date().toLocaleString()
      },
      web3Seo: {
        metaTags: Math.floor(seededRandom(3) * 30) + 70,
        structuredData: Math.floor(seededRandom(4) * 40) + 60,
        semanticMarkup: Math.floor(seededRandom(5) * 35) + 65,
        web3Compatibility: Math.floor(seededRandom(6) * 25) + 75
      },
      smartContractSeo: {
        contractVerification: seededRandom(7) > 0.3,
        abiDocumentation: Math.floor(seededRandom(8) * 40) + 60,
        gasOptimization: Math.floor(seededRandom(9) * 30) + 70,
        securityAudit: Math.floor(seededRandom(10) * 50) + 50
      },
      dappPerformance: {
        loadTime: Math.floor(seededRandom(11) * 30) + 70,
        web3Integration: Math.floor(seededRandom(12) * 40) + 60,
        userExperience: Math.floor(seededRandom(13) * 35) + 65,
        mobileOptimization: Math.floor(seededRandom(14) * 45) + 55
      },
      blockchainMetrics: {
        transactionVolume: Math.floor(seededRandom(15) * 40) + 60,
        activeUsers: Math.floor(seededRandom(16) * 30) + 70,
        networkHealth: Math.floor(seededRandom(17) * 20) + 80,
        multiChainSupport: Math.floor(seededRandom(18) * 50) + 50
      },
      opportunities: [
        {
          title: 'Implementar Meta Tags Web3',
          description: 'Faltan meta tags específicos para DApps y Web3 que mejoran la indexación',
          solution: 'Agregar meta tags como web3-provider, contract-address, blockchain-network y dapp-category',
          implementation: 'Añadir en el <head>:\n<meta name="web3-provider" content="metamask,walletconnect" />\n<meta name="blockchain-network" content="ethereum" />\n<meta name="contract-address" content="0x..." />\n<meta name="dapp-category" content="defi" />',
          estimatedImpact: '+25% visibilidad en buscadores Web3',
          difficulty: 'easy',
          category: 'web3-seo'
        },
        {
          title: 'Optimizar Gas en Smart Contracts',
          description: 'Los contratos consumen 40% más gas del recomendado por mejores prácticas',
          solution: 'Refactorizar funciones críticas y usar patrones de optimización de gas',
          implementation: 'Implementar:\n- Usar mapping en lugar de arrays\n- Optimizar loops con unchecked\n- Usar eventos para logs\n- Implementar proxy patterns',
          estimatedImpact: '-35% costos de gas promedio',
          difficulty: 'medium',
          category: 'smart-contract'
        },
        {
          title: 'Mejorar Tiempo de Carga Web3',
          description: 'La inicialización de Web3 tarda 3.2s, 60% más que el estándar',
          solution: 'Implementar lazy loading y cache de providers Web3',
          implementation: 'Usar dynamic imports:\nimport("@web3-react/core").then(module => {\n  // Inicializar solo cuando sea necesario\n});\nImplementar service worker para cache',
          estimatedImpact: '+45% velocidad de carga inicial',
          difficulty: 'medium',
          category: 'dapp-performance'
        },
        {
          title: 'Soporte Multi-Chain',
          description: 'Solo soporta Ethereum, perdiendo 30% de usuarios potenciales',
          solution: 'Implementar soporte para Polygon, BSC y Arbitrum',
          implementation: 'Configurar múltiples providers:\nconst chains = [ethereum, polygon, bsc, arbitrum];\nImplementar switch automático de red',
          estimatedImpact: '+50% base de usuarios potencial',
          difficulty: 'hard',
          category: 'user-experience'
        }
      ],
      diagnostics: [
        {
          title: 'Falta Schema.org para DApps',
          description: 'No se detectó marcado estructurado específico para aplicaciones descentralizadas. Esto reduce la visibilidad en buscadores Web3.',
          solution: 'Implementar schema.org/SoftwareApplication con propiedades Web3 específicas incluyendo blockchain, contratos y categoría DApp',
          codeExample: '<script type="application/ld+json">\n{\n  "@context": "https://schema.org",\n  "@type": "SoftwareApplication",\n  "name": "Mi DApp",\n  "applicationCategory": "DeFi",\n  "operatingSystem": "Web3",\n  "offers": {\n    "@type": "Offer",\n    "price": "0",\n    "priceCurrency": "ETH"\n  }\n}\n</script>',
          severity: 'warning',
          category: 'web3-seo'
        },
        {
          title: 'Contrato no verificado en Etherscan',
          description: 'El smart contract principal (0x742d35Cc6634C0532925a3b8D4C9db96) no está verificado. Esto afecta la confianza del usuario y el SEO.',
          solution: 'Verificar el contrato en Etherscan usando Hardhat o Foundry. Incluir documentación ABI completa.',
          codeExample: 'npx hardhat verify --network mainnet 0x742d35Cc6634C0532925a3b8D4C9db96 "Constructor arg 1" "Constructor arg 2"\n\n# O usando Foundry:\nforge verify-contract 0x742d35Cc6634C0532925a3b8D4C9db96 src/MyContract.sol:MyContract --etherscan-api-key $ETHERSCAN_API_KEY',
          severity: 'critical',
          category: 'smart-contract'
        }
      ]
    };

    if (type === 'predictive') {
      baseResults.predictions = {
        marketTrend: 'Crecimiento del 45% en adopción DeFi',
        growthPotential: 85,
        riskFactors: ['Volatilidad del mercado', 'Cambios regulatorios', 'Competencia'],
        recommendations: ['Diversificar protocolos', 'Mejorar UX', 'Implementar cross-chain']
      };
    }

    if (type === 'anomaly') {
      baseResults.anomalies = {
        detected: [
          'Patrón inusual en velocidad de carga en móviles',
          'Fluctuación detectada en métricas de engagement',
          'Inconsistencia en estructura de metadatos',
          'Anomalía en patrones de transacciones blockchain'
        ],
        severity: 'medium',
        recommendations: [
          'Revisar configuración de CDN',
          'Optimizar consultas de base de datos',
          'Actualizar schema markup',
          'Verificar configuración de red'
        ]
      };
    }

    if (type === 'opportunity') {
      baseResults.marketOpportunities = {
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
          industry: 'DeFi/Web3',
          growth: 156,
          keywords: [
            'Layer 2 solutions',
            'Cross-chain interoperability',
            'Sustainable DeFi',
            'AI-powered trading'
          ]
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
         url={url}
         indexerConnecting={indexerConnecting}
         indexerProgress={indexerProgress}
         onBackToHome={() => router.push('/dashboard/ai-assistant')}
       />
    );
  }

  if (!results) {
    return (
      <ErrorState onBackToHome={() => router.push('/dashboard/ai-assistant')} />
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
                {getAnalysisTypeLabel(results.analysisType)} para {results.url}
              </p>
            </div>

          </div>
          
          {/* Puntuación General */}
          <div className="flex justify-center mb-8">
            <div className="w-full max-w-md">
              <OverallScoreCard results={results} getAnalysisTypeLabel={getAnalysisTypeLabel} />
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {/* Web3 SEO Section */}
          <Web3SeoMetrics results={results} />
          
          {/* Smart Contract Section */}
          <SmartContractMetrics results={results} />
          
          {/* Opportunities Section */}
          <OpportunitiesSection results={results} />

          {/* Diagnostics Section */}
          <DiagnosticsSection results={results} />
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