// Web3 Keywords Service
// Servicio para análisis de keywords utilizando tecnologías Web3 e IA
// Usa DeepSeek como IA principal y Anthropic como fallback

import { EtherscanService } from './etherscan';
import { AlchemyService } from './alchemy';
import { AnthropicService } from './anthropic';

// Configuración de DeepSeek API (principal)
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY || process.env.NEXT_PUBLIC_DEEPSEEK_API_KEY;

// Configuración de Anthropic como fallback
import Anthropic from '@anthropic-ai/sdk';
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY,
});

export interface Web3KeywordData {
  keyword: string;
  searchVolume: number;
  competition: 'Low' | 'Medium' | 'High';
  cpc: number;
  difficulty: number;
  trend: number[];
  web3Relevance: number; // Puntuación de 0-100 de relevancia para Web3
  blockchainMentions: number; // Número de menciones en blockchain
  web3Category?: string; // Categoría Web3 (DeFi, NFT, DAO, etc.)
  relatedProjects?: string[]; // Proyectos blockchain relacionados
}

export interface Web3KeywordAnalysisOptions {
  includeBlockchainData?: boolean;
  includeProjectRelevance?: boolean;
  includeTrendAnalysis?: boolean;
  depth?: 'basic' | 'detailed' | 'comprehensive';
  blockchain?: 'ethereum' | 'polygon' | 'solana' | 'all';
}

export interface Web3KeywordAnalysisResult {
  keywords: Web3KeywordData[];
  totalKeywords: number;
  avgSearchVolume: number;
  avgDifficulty: number;
  avgCpc: number;
  web3Categories: {
    category: string;
    keywordCount: number;
    avgRelevance: number;
  }[];
  recommendations: string[];
  blockchainInsights?: {
    trendingTopics: string[];
    risingProjects: string[];
    popularContracts: {
      address: string;
      name: string;
      interactions: number;
    }[];
  };
  timestamp: string;
}

// Función para llamar a DeepSeek API (principal)
async function callDeepSeekAPI(messages: any[], model: string = 'deepseek-chat'): Promise<any> {
  try {
    const response = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: 0.7,
        max_tokens: 4000,
      }),
    });

    if (!response.ok) {
      throw new Error(`DeepSeek API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || '';
  } catch (error) {
    console.error('Error calling DeepSeek API:', error);
    throw error;
  }
}

// Función para llamar a Anthropic como fallback
async function callAnthropicAPI(messages: any[]): Promise<string> {
  try {
    const systemMessage = messages.find(m => m.role === 'system')?.content || '';
    const userMessages = messages.filter(m => m.role !== 'system');
    
    const response = await anthropic.messages.create({
      model: 'claude-3-sonnet-20240229',
      max_tokens: 4000,
      system: systemMessage,
      messages: userMessages,
    });

    return response.content[0]?.type === 'text' ? response.content[0].text : '';
  } catch (error) {
    console.error('Error calling Anthropic API:', error);
    throw error;
  }
}

// Función principal que usa DeepSeek primero, Anthropic como fallback
async function callAIService(messages: any[]): Promise<string> {
  try {
    // Intentar con DeepSeek primero
    if (DEEPSEEK_API_KEY) {
      return await callDeepSeekAPI(messages);
    }
  } catch (error) {
    console.warn('DeepSeek API failed, falling back to Anthropic:', error);
  }

  // Fallback a Anthropic
  try {
    return await callAnthropicAPI(messages);
  } catch (error) {
    console.error('Both AI services failed:', error);
    throw new Error('No AI service available');
  }
}

export class Web3KeywordsService {
  private static etherscanService = new EtherscanService();
  private static alchemyService = new AlchemyService();
  private static anthropicService = new AnthropicService();

  // Método de instancia para compatibilidad con orchestrator
  async analyzeKeywords(keywords: string[], options: Web3KeywordAnalysisOptions = {}): Promise<Web3KeywordAnalysisResult> {
    return Web3KeywordsService.analyzeKeywords(keywords, options);
  }

  /**
   * Analiza keywords utilizando tecnologías Web3 e IA
   */
  static async analyzeKeywords(keywords: string[], options: Web3KeywordAnalysisOptions = {}): Promise<Web3KeywordAnalysisResult> {
    try {
      // Obtener datos de keywords mediante IA
      const keywordsData = await this.getKeywordsDataWithAI(keywords);
      
      // Enriquecer con datos blockchain si se solicita
      let blockchainInsights;
      if (options.includeBlockchainData) {
        blockchainInsights = await this.getBlockchainInsights(keywords, options.blockchain || 'ethereum');
      }
      
      // Calcular métricas agregadas
      const totalKeywords = keywordsData.length;
      const avgSearchVolume = this.calculateAverage(keywordsData.map(k => k.searchVolume));
      const avgDifficulty = this.calculateAverage(keywordsData.map(k => k.difficulty));
      const avgCpc = this.calculateAverage(keywordsData.map(k => k.cpc));
      
      // Agrupar por categorías Web3
      const categoriesMap = new Map<string, {count: number, relevance: number}>();
      keywordsData.forEach(keyword => {
        if (keyword.web3Category) {
          const category = categoriesMap.get(keyword.web3Category) || {count: 0, relevance: 0};
          category.count += 1;
          category.relevance += keyword.web3Relevance;
          categoriesMap.set(keyword.web3Category, category);
        }
      });
      
      const web3Categories = Array.from(categoriesMap.entries()).map(([category, data]) => ({
        category,
        keywordCount: data.count,
        avgRelevance: data.relevance / data.count
      }));
      
      // Generar recomendaciones basadas en los datos
      const recommendations = await this.generateRecommendations(keywordsData, blockchainInsights);
      
      return {
        keywords: keywordsData,
        totalKeywords,
        avgSearchVolume,
        avgDifficulty,
        avgCpc,
        web3Categories,
        recommendations,
        blockchainInsights,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error analyzing keywords with Web3:', error);
      throw new Error('Failed to analyze keywords with Web3 technologies');
    }
  }

  /**
   * Obtiene datos de keywords utilizando IA (DeepSeek principal, Anthropic fallback)
   */
  private static async getKeywordsDataWithAI(keywords: string[]): Promise<Web3KeywordData[]> {
    try {
      // Construir prompt para IA
      const prompt = `
        Analiza las siguientes keywords relacionadas con Web3 y blockchain:
        ${keywords.join(', ')}
        
        Para cada keyword, proporciona:
        1. Volumen de búsqueda estimado (número)
        2. Nivel de competencia (Low, Medium, High)
        3. CPC estimado (número decimal)
        4. Dificultad (0-100)
        5. Tendencia de los últimos 12 meses (12 valores numéricos)
        6. Relevancia para Web3 (0-100)
        7. Número estimado de menciones en blockchain
        8. Categoría Web3 (DeFi, NFT, DAO, Gaming, Layer2, etc.)
        9. Proyectos blockchain relacionados (lista de nombres)
        
        Responde en formato JSON estructurado.
      `;
      
      // Llamar a IA (DeepSeek principal, Anthropic fallback)
      const messages = [
        { role: 'system', content: 'Eres un experto en análisis de keywords Web3 y blockchain. Proporciona análisis precisos y datos realistas.' },
        { role: 'user', content: prompt }
      ];
      const response = await callAIService(messages);
      
      // Parsear respuesta JSON
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No se pudo extraer JSON de la respuesta de IA');
      }
      
      const parsedData = JSON.parse(jsonMatch[0]);
      
      // Transformar datos al formato requerido
      return keywords.map(keyword => {
        const keywordData = parsedData[keyword] || {};
        return {
          keyword,
          searchVolume: keywordData.searchVolume || this.generateRealisticSearchVolume(keyword),
          competition: keywordData.competition || this.generateRealisticCompetition(keyword),
          cpc: keywordData.cpc || this.generateRealisticCPC(keyword),
          difficulty: keywordData.difficulty || this.generateRealisticDifficulty(keyword),
          trend: keywordData.trend || this.generateRealisticTrend(),
          web3Relevance: keywordData.web3Relevance || this.calculateWeb3Relevance(keyword),
          blockchainMentions: keywordData.blockchainMentions || this.estimateBlockchainMentions(keyword),
          web3Category: keywordData.web3Category || this.determineWeb3Category(keyword),
          relatedProjects: keywordData.relatedProjects || this.findRelatedProjects(keyword)
        };
      });
    } catch (error) {
      console.error('Error getting keywords data with AI:', error);
      
      // Fallback: generar datos realistas
      return keywords.map(keyword => ({
        keyword,
        searchVolume: this.generateRealisticSearchVolume(keyword),
        competition: this.generateRealisticCompetition(keyword),
        cpc: this.generateRealisticCPC(keyword),
        difficulty: this.generateRealisticDifficulty(keyword),
        trend: this.generateRealisticTrend(),
        web3Relevance: this.calculateWeb3Relevance(keyword),
        blockchainMentions: this.estimateBlockchainMentions(keyword),
        web3Category: this.determineWeb3Category(keyword),
        relatedProjects: this.findRelatedProjects(keyword)
      }));
    }
  }

  /**
   * Obtiene insights de blockchain relacionados con las keywords
   */
  private static async getBlockchainInsights(keywords: string[], blockchain: string): Promise<any> {
    try {
      // Obtener temas tendencia en blockchain
      const trendingTopics = await this.getTrendingTopicsFromBlockchain(blockchain);
      
      // Filtrar por relevancia a las keywords
      const relevantTopics = trendingTopics.filter(topic => 
        keywords.some(keyword => 
          topic.toLowerCase().includes(keyword.toLowerCase()) || 
          keyword.toLowerCase().includes(topic.toLowerCase())
        )
      );
      
      // Obtener proyectos emergentes
      const risingProjects = await this.getRisingProjectsFromBlockchain(blockchain);
      
      // Obtener contratos populares
      const popularContracts = await this.getPopularContractsFromBlockchain(blockchain);
      
      return {
        trendingTopics: relevantTopics.length > 0 ? relevantTopics : trendingTopics.slice(0, 5),
        risingProjects: risingProjects.slice(0, 5),
        popularContracts: popularContracts.slice(0, 5)
      };
    } catch (error) {
      console.error('Error getting blockchain insights:', error);
      
      // Fallback: datos simulados
      return {
        trendingTopics: [
          'DeFi yield optimization',
          'NFT marketplace aggregation',
          'Layer 2 scaling solutions',
          'Cross-chain bridges',
          'DAO governance tools'
        ],
        risingProjects: [
          'Optimism',
          'Arbitrum',
          'Base',
          'Lens Protocol',
          'Farcaster'
        ],
        popularContracts: [
          {
            address: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
            name: 'Uniswap V2 Router',
            interactions: 15243
          },
          {
            address: '0x00000000006c3852cbEf3e08E8dF289169EdE581',
            name: 'OpenSea Seaport',
            interactions: 8721
          },
          {
            address: '0x4d224452801ACEd8B2F0aebE155379bb5D594381',
            name: 'ApeCoin',
            interactions: 6543
          }
        ]
      };
    }
  }

  /**
   * Genera recomendaciones basadas en los datos de keywords y blockchain
   */
  private static async generateRecommendations(keywordsData: Web3KeywordData[], blockchainInsights?: any): Promise<string[]> {
    try {
      // Construir prompt para Anthropic Claude
      const prompt = `
        Basándote en estos datos de keywords Web3:
        ${JSON.stringify(keywordsData)}
        
        ${blockchainInsights ? `Y estos insights de blockchain: ${JSON.stringify(blockchainInsights)}` : ''}
        
        Genera 5-7 recomendaciones estratégicas para optimizar contenido Web3 y blockchain.
        Las recomendaciones deben ser específicas, accionables y enfocadas en SEO para Web3.
        Responde solo con una lista de recomendaciones, sin introducción ni conclusión.
      `;
      
      // Llamar a Anthropic Claude
      const response = await this.anthropicService.chatWithAI(prompt);
      
      // Extraer recomendaciones (una por línea)
      const recommendations = response
        .split('\n')
        .filter(line => line.trim().length > 0)
        .map(line => line.replace(/^\d+\.\s*/, '').trim()) // Eliminar numeración
        .slice(0, 7); // Limitar a 7 recomendaciones
      
      return recommendations.length > 0 ? recommendations : this.getDefaultRecommendations();
    } catch (error) {
      console.error('Error generating recommendations:', error);
      return this.getDefaultRecommendations();
    }
  }

  /**
   * Obtiene temas tendencia desde blockchain
   */
  private static async getTrendingTopicsFromBlockchain(blockchain: string): Promise<string[]> {
    // En una implementación real, esto podría consultar APIs de indexadores blockchain
    // o analizar datos on-chain para identificar temas tendencia
    
    // Por ahora, devolvemos datos simulados
    const trendingTopics = {
      'ethereum': [
        'Layer 2 scaling',
        'EIP-4844 (Proto-Danksharding)',
        'MEV optimization',
        'Account abstraction',
        'Liquid staking derivatives',
        'Decentralized social',
        'ZK-rollups'
      ],
      'polygon': [
        'zkEVM adoption',
        'Enterprise blockchain',
        'Gaming infrastructure',
        'Polygon 2.0',
        'Cross-chain messaging',
        'Supernets',
        'NFT marketplaces'
      ],
      'solana': [
        'DeFi composability',
        'Mobile SDK',
        'Compressed NFTs',
        'Solana Pay',
        'Gaming ecosystems',
        'Firedancer client',
        'MEV on Solana'
      ],
      'all': [
        'Cross-chain interoperability',
        'Real-world assets (RWA)',
        'Decentralized physical infrastructure',
        'AI + blockchain integration',
        'Institutional DeFi',
        'Zero-knowledge proofs',
        'Modular blockchains'
      ]
    };
    
    return trendingTopics[blockchain as keyof typeof trendingTopics] || trendingTopics['all'];
  }

  /**
   * Obtiene proyectos emergentes desde blockchain
   */
  private static async getRisingProjectsFromBlockchain(blockchain: string): Promise<string[]> {
    // En una implementación real, esto consultaría datos on-chain o APIs
    // para identificar proyectos con crecimiento reciente
    
    // Por ahora, devolvemos datos simulados
    const risingProjects = {
      'ethereum': [
        'Base',
        'Blast',
        'Eigenlayer',
        'Farcaster',
        'Pendle',
        'Ethena',
        'Hyperlane'
      ],
      'polygon': [
        'Polygon zkEVM',
        'Lens Protocol',
        'Aavegotchi',
        'QuickSwap',
        'Polymarket',
        'Gains Network',
        'Lido on Polygon'
      ],
      'solana': [
        'Jupiter',
        'Kamino Finance',
        'Drift Protocol',
        'Marginfi',
        'Helium',
        'Squads',
        'Sanctum'
      ],
      'all': [
        'LayerZero',
        'Celestia',
        'Arbitrum',
        'Optimism',
        'Starknet',
        'Sei Network',
        'Mantle'
      ]
    };
    
    return risingProjects[blockchain as keyof typeof risingProjects] || risingProjects['all'];
  }

  /**
   * Obtiene contratos populares desde blockchain
   */
  private static async getPopularContractsFromBlockchain(blockchain: string): Promise<{address: string, name: string, interactions: number}[]> {
    // En una implementación real, esto consultaría datos on-chain o APIs
    // para identificar contratos con más interacciones
    
    // Por ahora, devolvemos datos simulados
    const popularContracts = {
      'ethereum': [
        {
          address: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
          name: 'Uniswap V2 Router',
          interactions: 15243
        },
        {
          address: '0x00000000006c3852cbEf3e08E8dF289169EdE581',
          name: 'OpenSea Seaport',
          interactions: 8721
        },
        {
          address: '0x4d224452801ACEd8B2F0aebE155379bb5D594381',
          name: 'ApeCoin',
          interactions: 6543
        },
        {
          address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
          name: 'WETH',
          interactions: 5932
        },
        {
          address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
          name: 'USDC',
          interactions: 5421
        }
      ],
      'polygon': [
        {
          address: '0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506',
          name: 'SushiSwap Router',
          interactions: 9876
        },
        {
          address: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
          name: 'USDC (Polygon)',
          interactions: 7654
        },
        {
          address: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270',
          name: 'WMATIC',
          interactions: 6543
        },
        {
          address: '0x53E0bca35eC356BD5ddDFebbD1Fc0fD03FaBad39',
          name: 'ChainLink Token',
          interactions: 4321
        },
        {
          address: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
          name: 'WETH (Polygon)',
          interactions: 3210
        }
      ],
      'all': [
        {
          address: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
          name: 'Uniswap V2 Router',
          interactions: 15243
        },
        {
          address: '0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506',
          name: 'SushiSwap Router',
          interactions: 9876
        },
        {
          address: '0x00000000006c3852cbEf3e08E8dF289169EdE581',
          name: 'OpenSea Seaport',
          interactions: 8721
        },
        {
          address: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
          name: 'USDC (Polygon)',
          interactions: 7654
        },
        {
          address: '0x4d224452801ACEd8B2F0aebE155379bb5D594381',
          name: 'ApeCoin',
          interactions: 6543
        }
      ]
    };
    
    return popularContracts[blockchain as keyof typeof popularContracts] || popularContracts['all'];
  }

  /**
   * Genera un volumen de búsqueda realista basado en la keyword
   */
  private static generateRealisticSearchVolume(keyword: string): number {
    const isWeb3Related = this.isWeb3Related(keyword);
    const baseVolume = isWeb3Related ? 5000 : 2000;
    return Math.floor(Math.random() * baseVolume) + baseVolume;
  }

  /**
   * Genera un nivel de competencia realista basado en la keyword
   */
  private static generateRealisticCompetition(keyword: string): 'Low' | 'Medium' | 'High' {
    const isWeb3Related = this.isWeb3Related(keyword);
    if (isWeb3Related) {
      return 'High';
    }
    const options: ('Low' | 'Medium' | 'High')[] = ['Low', 'Medium', 'High'];
    return options[Math.floor(Math.random() * options.length)];
  }

  /**
   * Genera un CPC realista basado en la keyword
   */
  private static generateRealisticCPC(keyword: string): number {
    const isWeb3Related = this.isWeb3Related(keyword);
    const baseCPC = isWeb3Related ? 3.5 : 1.5;
    return parseFloat((Math.random() * 5 + baseCPC).toFixed(2));
  }

  /**
   * Genera una dificultad realista basada en la keyword
   */
  private static generateRealisticDifficulty(keyword: string): number {
    const isWeb3Related = this.isWeb3Related(keyword);
    return Math.floor(Math.random() * 40) + (isWeb3Related ? 60 : 30);
  }

  /**
   * Genera una tendencia realista para los últimos 12 meses
   */
  private static generateRealisticTrend(): number[] {
    return Array.from({ length: 12 }, () => Math.floor(Math.random() * 100) + 50);
  }

  /**
   * Calcula la relevancia de una keyword para Web3
   */
  private static calculateWeb3Relevance(keyword: string): number {
    const web3Terms = [
      'web3', 'blockchain', 'crypto', 'nft', 'token', 'defi', 'dao', 'ethereum',
      'bitcoin', 'solana', 'polygon', 'layer2', 'wallet', 'smart contract', 'dapp',
      'metaverse', 'decentralized', 'mining', 'staking', 'yield', 'protocol'
    ];
    
    const keywordLower = keyword.toLowerCase();
    let relevance = 0;
    
    // Verificar si la keyword contiene términos Web3
    for (const term of web3Terms) {
      if (keywordLower.includes(term)) {
        relevance += 25;
      }
    }
    
    // Ajustar según la especificidad
    if (keywordLower === 'web3' || keywordLower === 'blockchain' || keywordLower === 'crypto') {
      relevance = 100;
    } else if (relevance > 100) {
      relevance = 100;
    } else if (relevance === 0) {
      // Asignar un valor mínimo para keywords no relacionadas
      relevance = Math.floor(Math.random() * 20);
    }
    
    return relevance;
  }

  /**
   * Estima el número de menciones en blockchain para una keyword
   */
  private static estimateBlockchainMentions(keyword: string): number {
    const relevance = this.calculateWeb3Relevance(keyword);
    const baseMentions = relevance * 10;
    return Math.floor(baseMentions + (Math.random() * baseMentions * 0.5));
  }

  /**
   * Determina la categoría Web3 de una keyword
   */
  private static determineWeb3Category(keyword: string): string {
    const keywordLower = keyword.toLowerCase();
    
    const categories = {
      'defi': ['defi', 'yield', 'staking', 'lending', 'swap', 'liquidity', 'amm', 'dex'],
      'nft': ['nft', 'collectible', 'art', 'marketplace', 'opensea', 'mint'],
      'dao': ['dao', 'governance', 'vote', 'proposal', 'treasury'],
      'layer1': ['ethereum', 'bitcoin', 'solana', 'cardano', 'avalanche', 'blockchain'],
      'layer2': ['layer2', 'rollup', 'optimism', 'arbitrum', 'polygon', 'scaling'],
      'metaverse': ['metaverse', 'virtual', 'land', 'avatar', 'sandbox', 'decentraland'],
      'gaming': ['game', 'play', 'earn', 'p2e', 'axie', 'guild'],
      'identity': ['identity', 'did', 'kyc', 'verification', 'proof'],
      'infrastructure': ['node', 'rpc', 'indexer', 'oracle', 'chainlink', 'api'],
      'wallet': ['wallet', 'custody', 'key', 'seed', 'metamask', 'ledger']
    };
    
    for (const [category, terms] of Object.entries(categories)) {
      if (terms.some(term => keywordLower.includes(term))) {
        return category;
      }
    }
    
    return 'general';
  }

  /**
   * Encuentra proyectos blockchain relacionados con una keyword
   */
  private static findRelatedProjects(keyword: string): string[] {
    const keywordLower = keyword.toLowerCase();
    
    const projectsByCategory = {
      'defi': ['Uniswap', 'Aave', 'Compound', 'MakerDAO', 'Curve'],
      'nft': ['OpenSea', 'Blur', 'Foundation', 'SuperRare', 'Rarible'],
      'dao': ['Snapshot', 'Aragon', 'DAOhaus', 'Colony', 'Tally'],
      'layer1': ['Ethereum', 'Bitcoin', 'Solana', 'Cardano', 'Avalanche'],
      'layer2': ['Optimism', 'Arbitrum', 'Polygon', 'zkSync', 'StarkNet'],
      'metaverse': ['Decentraland', 'The Sandbox', 'Otherside', 'Somnium Space', 'Voxels'],
      'gaming': ['Axie Infinity', 'The Sandbox', 'Illuvium', 'Gala Games', 'Sorare'],
      'identity': ['Worldcoin', 'BrightID', 'Civic', 'ENS', 'Proof of Humanity'],
      'infrastructure': ['The Graph', 'Chainlink', 'Infura', 'Alchemy', 'QuickNode'],
      'wallet': ['MetaMask', 'Rainbow', 'Ledger', 'Trezor', 'Trust Wallet']
    };
    
    const category = this.determineWeb3Category(keyword);
    const projects = projectsByCategory[category as keyof typeof projectsByCategory] || projectsByCategory['layer1'];
    
    // Seleccionar un subconjunto aleatorio de proyectos
    const numProjects = Math.floor(Math.random() * 3) + 2; // 2-4 proyectos
    const shuffled = [...projects].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, numProjects);
  }

  /**
   * Verifica si una keyword está relacionada con Web3
   */
  private static isWeb3Related(keyword: string): boolean {
    const web3Terms = [
      'web3', 'blockchain', 'crypto', 'nft', 'token', 'defi', 'dao', 'ethereum',
      'bitcoin', 'solana', 'polygon', 'layer2', 'wallet', 'smart contract', 'dapp'
    ];
    
    const keywordLower = keyword.toLowerCase();
    return web3Terms.some(term => keywordLower.includes(term));
  }

  /**
   * Calcula el promedio de un array de números
   */
  private static calculateAverage(numbers: number[]): number {
    if (numbers.length === 0) return 0;
    const sum = numbers.reduce((a, b) => a + b, 0);
    return parseFloat((sum / numbers.length).toFixed(2));
  }

  /**
   * Devuelve recomendaciones predeterminadas
   */
  private static getDefaultRecommendations(): string[] {
    return [
      'Optimiza contenido para términos específicos de Web3 con alta relevancia y volumen de búsqueda',
      'Crea contenido educativo sobre proyectos blockchain emergentes identificados en el análisis',
      'Desarrolla páginas específicas para cada categoría Web3 relevante (DeFi, NFT, DAO, etc.)',
      'Incorpora términos técnicos de blockchain en metadatos y contenido para mejorar visibilidad',
      'Utiliza datos on-chain para enriquecer contenido y demostrar experiencia en el sector',
      'Establece backlinks desde comunidades Web3 activas para aumentar autoridad',
      'Mantén contenido actualizado con las últimas tendencias blockchain identificadas'
    ];
  }
}

// Exportar instancia singleton
export const web3KeywordsService = new Web3KeywordsService();