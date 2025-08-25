// Servicio API para análisis de interacciones en ecosistemas descentralizados
import { EtherscanService } from './etherscan';
import { AlchemyService } from './alchemy';
import { AnthropicService } from './anthropic';

// Tipos para el servicio de Ecosystem Interactions
interface EcosystemAddress {
  address: string;
  network: string;
  type: 'wallet' | 'contract' | 'protocol';
}

interface CrossChainInteraction {
  fromNetwork: string;
  toNetwork: string;
  transactionHash: string;
  timestamp: number;
  value: string;
  type: 'bridge' | 'swap' | 'transfer' | 'defi';
  protocol?: string;
}

interface ProtocolInteraction {
  protocol: string;
  network: string;
  interactionType: string;
  frequency: number;
  totalValue: string;
  lastInteraction: number;
}

interface EcosystemMetrics {
  totalNetworks: number;
  totalProtocols: number;
  crossChainVolume: string;
  interactionFrequency: number;
  diversityScore: number;
  activityScore: number;
  riskScore: number;
  overallScore: number;
}

interface EcosystemAnalysisResult {
  address: string;
  networks: string[];
  metrics: EcosystemMetrics;
  crossChainInteractions: CrossChainInteraction[];
  protocolInteractions: ProtocolInteraction[];
  networkDistribution: { [network: string]: number };
  protocolDistribution: { [protocol: string]: number };
  riskFactors: string[];
  opportunities: string[];
  insights: any[];
  recommendations: any[];
  timestamp: number;
}

export class EcosystemInteractionsAPIsService {
  private static etherscanService = new EtherscanService();
  private static alchemyService = new AlchemyService();
  private static anthropicService = new AnthropicService();

  // Método de instancia para análisis de interacciones del ecosistema
  async analyzeEcosystemInteractions(address: string, options?: any): Promise<any> {
    try {
      const analysis = await EcosystemInteractionsAPIsService.analyzeEcosystemInteractions(address, options || {});
      return {
        address,
        analysis,
        includeNetworks: options?.includeNetworks || ['ethereum', 'polygon', 'bsc'],
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error analyzing ecosystem interactions:', error);
      return { error: 'Failed to analyze ecosystem interactions' };
    }
  }

  /**
   * Analiza las interacciones de un address en múltiples ecosistemas
   */
  static async analyzeEcosystemInteractions(
    address: string,
    options: {
      includeNetworks?: string[];
      includeProtocols?: boolean;
      includeCrossChain?: boolean;
      includeRiskAnalysis?: boolean;
      timeframe?: 'week' | 'month' | 'quarter' | 'year';
    } = {}
  ): Promise<EcosystemAnalysisResult> {
    try {
      const {
        includeNetworks = ['ethereum', 'polygon', 'bsc', 'arbitrum', 'optimism'],
        includeProtocols = true,
        includeCrossChain = true,
        includeRiskAnalysis = true,
        timeframe = 'month'
      } = options;

      console.log(`Analizando interacciones del ecosistema para: ${address}`);

      // 1. Análisis básico de la dirección
      const basicAnalysis = await this.performBasicAnalysis(address);

      // 2. Análisis multi-red
      const networkAnalysis = await this.analyzeMultiNetworkActivity(address, includeNetworks);

      // 3. Análisis de protocolos
      const protocolAnalysis = includeProtocols 
        ? await this.analyzeProtocolInteractions(address, includeNetworks)
        : { protocols: [], interactions: [] };

      // 4. Análisis cross-chain
      const crossChainAnalysis = includeCrossChain
        ? await this.analyzeCrossChainInteractions(address, includeNetworks)
        : { interactions: [], bridges: [] };

      // 5. Análisis de riesgo
      const riskAnalysis = includeRiskAnalysis
        ? await this.performRiskAnalysis(address, networkAnalysis, protocolAnalysis)
        : { riskScore: 0, factors: [] };

      // 6. Calcular métricas del ecosistema
      const metrics = this.calculateEcosystemMetrics(
        networkAnalysis,
        protocolAnalysis,
        crossChainAnalysis,
        riskAnalysis
      );

      // 7. Generar insights con IA
      const insights = await this.generateEcosystemInsights(
        address,
        metrics,
        networkAnalysis,
        protocolAnalysis,
        crossChainAnalysis
      );

      // 8. Generar recomendaciones
      const recommendations = this.generateRecommendations(
        metrics,
        networkAnalysis,
        protocolAnalysis,
        riskAnalysis
      );

      return {
        address,
        networks: includeNetworks,
        metrics,
        crossChainInteractions: crossChainAnalysis.interactions || [],
        protocolInteractions: protocolAnalysis.interactions || [],
        networkDistribution: this.calculateNetworkDistribution(networkAnalysis),
        protocolDistribution: this.calculateProtocolDistribution(protocolAnalysis),
        riskFactors: riskAnalysis.factors || [],
        opportunities: this.identifyOpportunities(metrics, networkAnalysis, protocolAnalysis),
        insights,
        recommendations,
        timestamp: Date.now()
      };

    } catch (error) {
      console.error('Error en análisis de ecosistema:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      throw new Error(`Error al analizar interacciones del ecosistema: ${errorMessage}`);
    }
  }

  /**
   * Realiza análisis básico de la dirección
   */
  private static async performBasicAnalysis(address: string): Promise<any> {
    try {
      // Obtener información básica de Ethereum
      const ethBalance = await EtherscanService.getAccountBalance(address);
      const ethTransactions = await EtherscanService.getContractTransactions(address, 1, 100);

      return {
        address,
        ethBalance,
        transactionCount: ethTransactions.length,
        firstActivity: ethTransactions.length > 0 ? ethTransactions[ethTransactions.length - 1].timeStamp : null,
        lastActivity: ethTransactions.length > 0 ? ethTransactions[0].timeStamp : null
      };
    } catch (error) {
      console.error('Error en análisis básico:', error);
      return {
        address,
        ethBalance: '0',
        transactionCount: 0,
        firstActivity: null,
        lastActivity: null
      };
    }
  }

  /**
   * Analiza actividad en múltiples redes
   */
  private static async analyzeMultiNetworkActivity(address: string, networks: string[]): Promise<any> {
    const networkActivity: { [key: string]: { transactions: number; balance: string; tokens: any[]; nfts: any[] } } = {};

    for (const network of networks) {
      try {
        let activity: { transactions: number; balance: string; tokens: any[]; nfts: any[] } = { transactions: 0, balance: '0', tokens: [], nfts: [] };

        switch (network.toLowerCase()) {
          case 'ethereum':
            const ethTransactions = await EtherscanService.getContractTransactions(address, 1, 50);
            const ethBalance = await EtherscanService.getAccountBalance(address);
            const ethTokens = await EtherscanService.getERC20Transfers(address);
            
            activity = {
              transactions: ethTransactions.length,
              balance: ethBalance,
              tokens: ethTokens.slice(0, 10),
              nfts: []
            };
            break;

          case 'polygon':
          case 'bsc':
          case 'arbitrum':
          case 'optimism':
            // Simular datos para otras redes (en producción usarías APIs específicas)
            activity = {
              transactions: Math.floor(Math.random() * 100) + 10,
              balance: (Math.random() * 10).toFixed(4),
              tokens: this.generateMockTokens(network),
              nfts: this.generateMockNFTs(network)
            };
            break;
        }

        networkActivity[network] = activity;
      } catch (error) {
        console.error(`Error analizando red ${network}:`, error);
        networkActivity[network] = { transactions: 0, balance: '0', tokens: [], nfts: [] };
      }
    }

    return networkActivity;
  }

  /**
   * Analiza interacciones con protocolos
   */
  private static async analyzeProtocolInteractions(address: string, networks: string[]): Promise<any> {
    const protocols = [
      'Uniswap', 'Aave', 'Compound', 'MakerDAO', 'Curve',
      'SushiSwap', 'Balancer', 'Yearn', 'Synthetix', 'Chainlink'
    ];

    const interactions = [];
    const protocolStats: { [key: string]: { frequency: number; totalValue: string; networks: string[] } } = {};

    for (const protocol of protocols) {
      const frequency = Math.floor(Math.random() * 50) + 1;
      const totalValue = (Math.random() * 100000).toFixed(2);
      const lastInteraction = Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000);

      const interaction: ProtocolInteraction = {
        protocol,
        network: networks[Math.floor(Math.random() * networks.length)],
        interactionType: this.getRandomInteractionType(),
        frequency,
        totalValue,
        lastInteraction
      };

      interactions.push(interaction);
      protocolStats[protocol] = {
        frequency,
        totalValue,
        networks: [interaction.network]
      };
    }

    return {
      protocols,
      interactions,
      stats: protocolStats
    };
  }

  /**
   * Analiza interacciones cross-chain
   */
  private static async analyzeCrossChainInteractions(address: string, networks: string[]): Promise<any> {
    const interactions: CrossChainInteraction[] = [];
    const bridges = ['Polygon Bridge', 'Arbitrum Bridge', 'Optimism Gateway', 'Multichain', 'Hop Protocol'];

    // Generar interacciones cross-chain simuladas
    for (let i = 0; i < 20; i++) {
      const fromNetwork = networks[Math.floor(Math.random() * networks.length)];
      let toNetwork = networks[Math.floor(Math.random() * networks.length)];
      
      // Asegurar que from y to sean diferentes
      while (toNetwork === fromNetwork) {
        toNetwork = networks[Math.floor(Math.random() * networks.length)];
      }

      const interaction: CrossChainInteraction = {
        fromNetwork,
        toNetwork,
        transactionHash: this.generateMockTxHash(),
        timestamp: Date.now() - Math.floor(Math.random() * 90 * 24 * 60 * 60 * 1000),
        value: (Math.random() * 10000).toFixed(2),
        type: this.getRandomCrossChainType(),
        protocol: bridges[Math.floor(Math.random() * bridges.length)]
      };

      interactions.push(interaction);
    }

    return {
      interactions: interactions.sort((a, b) => b.timestamp - a.timestamp),
      bridges,
      totalVolume: interactions.reduce((sum, int) => sum + parseFloat(int.value), 0).toFixed(2)
    };
  }

  /**
   * Realiza análisis de riesgo
   */
  private static async performRiskAnalysis(address: string, networkAnalysis: any, protocolAnalysis: any): Promise<any> {
    const riskFactors = [];
    let riskScore = 0;

    // Analizar diversificación de redes
    const activeNetworks = Object.keys(networkAnalysis).filter(
      network => networkAnalysis[network].transactions > 0
    );

    if (activeNetworks.length < 3) {
      riskFactors.push('Baja diversificación de redes');
      riskScore += 20;
    }

    // Analizar concentración de protocolos
    const totalInteractions = protocolAnalysis.interactions?.length || 0;
    if (totalInteractions < 5) {
      riskFactors.push('Pocas interacciones con protocolos');
      riskScore += 15;
    }

    // Analizar actividad reciente
    const recentActivity = protocolAnalysis.interactions?.filter(
      (int: any) => Date.now() - int.lastInteraction < 30 * 24 * 60 * 60 * 1000
    ).length || 0;

    if (recentActivity < 3) {
      riskFactors.push('Baja actividad reciente');
      riskScore += 10;
    }

    // Analizar concentración de valor
    const totalValue = protocolAnalysis.interactions?.reduce(
      (sum: number, int: any) => sum + parseFloat(int.totalValue), 0
    ) || 0;

    if (totalValue > 500000) {
      riskFactors.push('Alta concentración de valor');
      riskScore += 25;
    }

    return {
      riskScore: Math.min(riskScore, 100),
      factors: riskFactors,
      level: riskScore < 30 ? 'low' : riskScore < 60 ? 'medium' : 'high'
    };
  }

  /**
   * Calcula métricas del ecosistema
   */
  private static calculateEcosystemMetrics(
    networkAnalysis: any,
    protocolAnalysis: any,
    crossChainAnalysis: any,
    riskAnalysis: any
  ): EcosystemMetrics {
    const activeNetworks = Object.keys(networkAnalysis).filter(
      network => networkAnalysis[network].transactions > 0
    );

    const totalProtocols = protocolAnalysis.interactions?.length || 0;
    const crossChainVolume = crossChainAnalysis.totalVolume || '0';
    
    const totalTransactions = Object.values(networkAnalysis).reduce(
      (sum: number, network: any) => sum + (network.transactions || 0), 0
    );

    const diversityScore = Math.min(100, (activeNetworks.length * 20) + (totalProtocols * 2));
    const activityScore = Math.min(100, (totalTransactions as number) * 2);
    const riskScore = riskAnalysis.riskScore || 0;
    const overallScore = Math.round((diversityScore + activityScore + (100 - riskScore)) / 3);

    return {
      totalNetworks: activeNetworks.length,
      totalProtocols,
      crossChainVolume,
      interactionFrequency: totalTransactions as number,
      diversityScore,
      activityScore,
      riskScore,
      overallScore
    };
  }

  /**
   * Genera insights con IA
   */
  private static async generateEcosystemInsights(
    address: string,
    metrics: EcosystemMetrics,
    networkAnalysis: any,
    protocolAnalysis: any,
    crossChainAnalysis: any
  ): Promise<any[]> {
    try {
      const prompt = `
Analiza las siguientes métricas de interacciones en ecosistemas descentralizados:

Dirección: ${address}
Redes activas: ${metrics.totalNetworks}
Protocolos utilizados: ${metrics.totalProtocols}
Volumen cross-chain: $${metrics.crossChainVolume}
Frecuencia de interacciones: ${metrics.interactionFrequency}
Score de diversidad: ${metrics.diversityScore}/100
Score de actividad: ${metrics.activityScore}/100
Score de riesgo: ${metrics.riskScore}/100
Score general: ${metrics.overallScore}/100

Proporciona 5 insights clave sobre el comportamiento del usuario en el ecosistema descentralizado, enfocándote en:
1. Diversificación de redes y protocolos
2. Patrones de uso cross-chain
3. Nivel de sofisticación DeFi
4. Gestión de riesgo
5. Oportunidades de optimización

Formato: JSON array con objetos {type, title, description, impact}
`;

      const response = await this.anthropicService.chatWithAI(prompt);
      return JSON.parse(response);
    } catch (error) {
      console.error('Error generando insights:', error);
      return this.generateFallbackInsights(metrics);
    }
  }

  /**
   * Genera insights de respaldo
   */
  private static generateFallbackInsights(metrics: EcosystemMetrics): any[] {
    const insights = [];

    if (metrics.diversityScore > 80) {
      insights.push({
        type: 'positive',
        title: 'Excelente Diversificación',
        description: `Score de diversidad de ${metrics.diversityScore}/100 indica uso sofisticado del ecosistema`,
        impact: 'high'
      });
    } else if (metrics.diversityScore < 40) {
      insights.push({
        type: 'warning',
        title: 'Diversificación Limitada',
        description: `Score de diversidad de ${metrics.diversityScore}/100 sugiere concentración de riesgo`,
        impact: 'medium'
      });
    }

    if (metrics.activityScore > 70) {
      insights.push({
        type: 'positive',
        title: 'Alta Actividad',
        description: `${metrics.interactionFrequency} interacciones demuestran uso activo`,
        impact: 'medium'
      });
    }

    if (metrics.riskScore > 60) {
      insights.push({
        type: 'warning',
        title: 'Riesgo Elevado',
        description: `Score de riesgo de ${metrics.riskScore}/100 requiere atención`,
        impact: 'high'
      });
    }

    if (parseFloat(metrics.crossChainVolume) > 10000) {
      insights.push({
        type: 'positive',
        title: 'Usuario Cross-Chain Avanzado',
        description: `$${metrics.crossChainVolume} en volumen cross-chain indica sofisticación`,
        impact: 'medium'
      });
    }

    return insights;
  }

  /**
   * Genera recomendaciones
   */
  private static generateRecommendations(
    metrics: EcosystemMetrics,
    networkAnalysis: any,
    protocolAnalysis: any,
    riskAnalysis: any
  ): any[] {
    const recommendations = [];

    if (metrics.totalNetworks < 3) {
      recommendations.push({
        category: 'Diversification',
        priority: 'high',
        title: 'Expandir a Más Redes',
        description: 'Considerar usar Polygon, Arbitrum u Optimism para reducir costos',
        actionItems: [
          'Explorar Layer 2 solutions',
          'Diversificar holdings cross-chain',
          'Usar bridges confiables'
        ]
      });
    }

    if (metrics.totalProtocols < 5) {
      recommendations.push({
        category: 'Protocol Usage',
        priority: 'medium',
        title: 'Diversificar Protocolos DeFi',
        description: 'Explorar más protocolos para optimizar rendimientos',
        actionItems: [
          'Investigar yield farming opportunities',
          'Considerar protocolos de lending',
          'Explorar DEXs alternativos'
        ]
      });
    }

    if (riskAnalysis.riskScore > 60) {
      recommendations.push({
        category: 'Risk Management',
        priority: 'high',
        title: 'Mejorar Gestión de Riesgo',
        description: 'Implementar estrategias de mitigación de riesgo',
        actionItems: [
          'Diversificar posiciones',
          'Usar stop-loss strategies',
          'Monitorear exposición por protocolo'
        ]
      });
    }

    return recommendations;
  }

  /**
   * Calcula distribución por red
   */
  private static calculateNetworkDistribution(networkAnalysis: any): { [network: string]: number } {
    const distribution: { [key: string]: number } = {};
    const totalTransactions = Object.values(networkAnalysis).reduce(
      (sum: number, network: any) => sum + network.transactions, 0
    );

    Object.keys(networkAnalysis).forEach(network => {
      const networkData = networkAnalysis[network];
      distribution[network] = (totalTransactions as number) > 0 
        ? Math.round(((networkData.transactions || 0) / (totalTransactions as number)) * 100)
        : 0;
    });

    return distribution;
  }

  /**
   * Calcula distribución por protocolo
   */
  private static calculateProtocolDistribution(protocolAnalysis: any): { [protocol: string]: number } {
    const distribution: { [key: string]: number } = {};
    const interactions = protocolAnalysis.interactions || [];
    const totalInteractions = interactions.length;

    const protocolCounts: { [key: string]: number } = {};
    interactions.forEach((interaction: any) => {
      protocolCounts[interaction.protocol] = (protocolCounts[interaction.protocol] || 0) + 1;
    });

    Object.keys(protocolCounts).forEach(protocol => {
      distribution[protocol] = totalInteractions > 0
        ? Math.round((protocolCounts[protocol] / totalInteractions) * 100)
        : 0;
    });

    return distribution;
  }

  /**
   * Identifica oportunidades
   */
  private static identifyOpportunities(
    metrics: EcosystemMetrics,
    networkAnalysis: any,
    protocolAnalysis: any
  ): string[] {
    const opportunities = [];

    if (metrics.totalNetworks < 5) {
      opportunities.push('Expandir a redes Layer 2 para reducir costos');
    }

    if (parseFloat(metrics.crossChainVolume) < 1000) {
      opportunities.push('Explorar oportunidades de arbitraje cross-chain');
    }

    if (metrics.totalProtocols < 10) {
      opportunities.push('Diversificar en más protocolos DeFi');
    }

    const hasLending = protocolAnalysis.interactions?.some(
      (int: any) => ['Aave', 'Compound'].includes(int.protocol)
    );
    if (!hasLending) {
      opportunities.push('Considerar protocolos de lending para yield');
    }

    const hasYieldFarming = protocolAnalysis.interactions?.some(
      (int: any) => ['Yearn', 'Curve'].includes(int.protocol)
    );
    if (!hasYieldFarming) {
      opportunities.push('Explorar yield farming strategies');
    }

    return opportunities;
  }

  // Funciones auxiliares para generar datos mock
  private static generateMockTokens(network: string): any[] {
    const tokens = ['USDC', 'USDT', 'DAI', 'WETH', 'LINK'];
    return tokens.slice(0, Math.floor(Math.random() * 3) + 1).map(token => ({
      symbol: token,
      balance: (Math.random() * 1000).toFixed(2),
      value: (Math.random() * 2000).toFixed(2)
    }));
  }

  private static generateMockNFTs(network: string): any[] {
    const collections = ['CryptoPunks', 'BAYC', 'Azuki', 'Doodles'];
    return collections.slice(0, Math.floor(Math.random() * 2)).map(collection => ({
      collection,
      count: Math.floor(Math.random() * 5) + 1,
      floorPrice: (Math.random() * 10).toFixed(2)
    }));
  }

  private static generateMockTxHash(): string {
    return '0x' + Array.from({length: 64}, () => Math.floor(Math.random() * 16).toString(16)).join('');
  }

  private static getRandomInteractionType(): string {
    const types = ['swap', 'liquidity', 'lending', 'borrowing', 'staking', 'farming'];
    return types[Math.floor(Math.random() * types.length)];
  }

  private static getRandomCrossChainType(): 'bridge' | 'swap' | 'transfer' | 'defi' {
    const types: ('bridge' | 'swap' | 'transfer' | 'defi')[] = ['bridge', 'swap', 'transfer', 'defi'];
    return types[Math.floor(Math.random() * types.length)];
  }
}

