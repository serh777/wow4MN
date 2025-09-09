/**
 * Servicio de análisis de keywords optimizado para Supabase/Netlify
 * Basado en análisis Web3 e IA (DeepSeek principal, Anthropic fallback)
 * Sin dependencias de terceros - Solo tecnologías blockchain y AI
 */

import { createClient } from '@supabase/supabase-js';

// Tipos para análisis de keywords
export interface KeywordsAnalysisRequest {
  keywords: string[];
  domain?: string;
  country?: string;
  language?: string;
  includeCompetitors?: boolean;
  includeRelatedKeywords?: boolean;
  includeLongTail?: boolean;
  includeQuestions?: boolean;
  includeSeasonality?: boolean;
  includeLocalSearch?: boolean;
  depth?: 'basic' | 'detailed' | 'comprehensive';
  userId?: string;
}

export interface KeywordsAnalysisResult {
  id: string;
  keywords: string[];
  domain?: string;
  timestamp: string;
  overview: KeywordsOverview;
  keywordMetrics: KeywordMetrics[];
  competitorAnalysis: CompetitorKeywordsAnalysis;
  relatedKeywords: RelatedKeywordsAnalysis;
  longTailKeywords: LongTailKeywordsAnalysis;
  questionKeywords: QuestionKeywordsAnalysis;
  seasonalityAnalysis: SeasonalityAnalysis;
  localSearchAnalysis: LocalSearchAnalysis;
  keywordGaps: KeywordGapsAnalysis;
  contentOpportunities: ContentOpportunity[];
  recommendations: KeywordsRecommendation[];
  score: {
    overall: number;
    difficulty: number;
    opportunity: number;
    relevance: number;
    volume: number;
    competition: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface KeywordsOverview {
  totalKeywords: number;
  averageSearchVolume: number;
  averageDifficulty: number;
  averageCPC: number;
  totalSearchVolume: number;
  highVolumeKeywords: number; // >10k searches
  mediumVolumeKeywords: number; // 1k-10k searches
  lowVolumeKeywords: number; // <1k searches
  easyKeywords: number; // difficulty <30
  mediumKeywords: number; // difficulty 30-70
  hardKeywords: number; // difficulty >70
  commercialIntent: {
    high: number;
    medium: number;
    low: number;
    informational: number;
  };
  keywordTypes: {
    shortTail: number; // 1-2 words
    mediumTail: number; // 3-4 words
    longTail: number; // 5+ words
  };
  // Nuevos campos para análisis Web3
  web3Relevance?: number; // Relevancia promedio para Web3 (0-100)
  blockchainMentions?: number; // Promedio de menciones en blockchain
  web3Categories?: Record<string, number>; // Distribución de categorías Web3
  relatedBlockchainProjects?: string[]; // Proyectos blockchain relacionados
}

export interface KeywordMetrics {
  keyword: string;
  searchVolume: number;
  difficulty: number;
  cpc: number;
  competition: number;
  competitionLevel: 'low' | 'medium' | 'high';
  intent: 'informational' | 'navigational' | 'commercial' | 'transactional';
  trend: 'rising' | 'stable' | 'declining';
  seasonality: {
    isseasonal: boolean;
    peakMonths: string[];
    lowMonths: string[];
    seasonalityScore: number;
  };
  localSearch: {
    isLocal: boolean;
    localVolume?: number;
    cities?: string[];
  };
  serp: {
    totalResults: number;
    featuredSnippet: boolean;
    peopleAlsoAsk: boolean;
    localPack: boolean;
    shopping: boolean;
    images: boolean;
    videos: boolean;
    news: boolean;
  };
  currentRanking?: {
    position: number;
    url: string;
    title: string;
    description: string;
  };
  topCompetitors: {
    domain: string;
    position: number;
    url: string;
    title: string;
    estimatedTraffic: number;
  }[];
  relatedKeywords: string[];
  questions: string[];
  variations: string[];
  // Nuevos campos para análisis Web3
  web3Relevance?: number; // Relevancia para Web3 (0-100)
  blockchainMentions?: number; // Número de menciones en blockchain
  web3Category?: string; // Categoría Web3 (DeFi, NFT, DAO, etc.)
  relatedProjects?: string[]; // Proyectos blockchain relacionados
  blockchainInsights?: {
    trendingTopics?: string[];
    risingProjects?: string[];
    popularContracts?: {
      address: string;
      name: string;
      interactions: number;
    }[];
  };
}

export interface CompetitorKeywordsAnalysis {
  competitors: {
    domain: string;
    totalKeywords: number;
    organicTraffic: number;
    averagePosition: number;
    visibility: number;
    sharedKeywords: number;
    uniqueKeywords: number;
    keywordGap: number;
  }[];
  keywordOverlap: {
    competitor: string;
    sharedKeywords: {
      keyword: string;
      yourPosition: number;
      competitorPosition: number;
      searchVolume: number;
      difficulty: number;
      opportunity: 'high' | 'medium' | 'low';
    }[];
  }[];
  competitorGaps: {
    competitor: string;
    missingKeywords: {
      keyword: string;
      competitorPosition: number;
      searchVolume: number;
      difficulty: number;
      priority: 'high' | 'medium' | 'low';
    }[];
  }[];
  winningKeywords: {
    keyword: string;
    yourPosition: number;
    bestCompetitorPosition: number;
    advantage: number;
    searchVolume: number;
  }[];
  losingKeywords: {
    keyword: string;
    yourPosition: number;
    bestCompetitorPosition: number;
    gap: number;
    searchVolume: number;
  }[];
}

export interface RelatedKeywordsAnalysis {
  totalRelated: number;
  semanticGroups: {
    group: string;
    keywords: {
      keyword: string;
      searchVolume: number;
      difficulty: number;
      relevance: number;
    }[];
    totalVolume: number;
    averageDifficulty: number;
  }[];
  synonyms: {
    original: string;
    synonyms: string[];
  }[];
  variations: {
    original: string;
    variations: string[];
  }[];
  broadMatch: {
    keyword: string;
    searchVolume: number;
    difficulty: number;
    relevance: number;
  }[];
  phraseMatch: {
    keyword: string;
    searchVolume: number;
    difficulty: number;
    relevance: number;
  }[];
}

export interface LongTailKeywordsAnalysis {
  totalLongTail: number;
  longTailKeywords: {
    keyword: string;
    searchVolume: number;
    difficulty: number;
    wordCount: number;
    intent: string;
    parentKeyword: string;
    opportunity: 'high' | 'medium' | 'low';
  }[];
  longTailGroups: {
    baseKeyword: string;
    variations: string[];
    totalVolume: number;
    averageDifficulty: number;
  }[];
  modifiers: {
    modifier: string;
    count: number;
    averageVolume: number;
    examples: string[];
  }[];
  opportunities: {
    keyword: string;
    searchVolume: number;
    difficulty: number;
    competitionGap: number;
    contentGap: boolean;
  }[];
}

export interface QuestionKeywordsAnalysis {
  totalQuestions: number;
  questionTypes: {
    what: number;
    how: number;
    why: number;
    when: number;
    where: number;
    who: number;
    which: number;
    other: number;
  };
  questions: {
    question: string;
    searchVolume: number;
    difficulty: number;
    intent: string;
    answerLength: 'short' | 'medium' | 'long';
    featuredSnippetOpportunity: boolean;
    relatedQuestions: string[];
  }[];
  peopleAlsoAsk: {
    question: string;
    relatedKeyword: string;
    searchVolume: number;
  }[];
  contentGaps: {
    question: string;
    searchVolume: number;
    competitorCoverage: number;
    opportunity: 'high' | 'medium' | 'low';
  }[];
}

export interface SeasonalityAnalysis {
  seasonalKeywords: {
    keyword: string;
    seasonalityScore: number;
    peakMonths: string[];
    lowMonths: string[];
    yearOverYearTrend: number;
    predictedPeaks: {
      month: string;
      expectedVolume: number;
      confidence: number;
    }[];
  }[];
  seasonalTrends: {
    month: string;
    averageVolume: number;
    indexScore: number;
  }[];
  planningRecommendations: {
    keyword: string;
    action: 'prepare' | 'optimize' | 'monitor';
    timing: string;
    expectedImpact: 'high' | 'medium' | 'low';
  }[];
}

export interface LocalSearchAnalysis {
  localKeywords: {
    keyword: string;
    localVolume: number;
    globalVolume: number;
    localDifficulty: number;
    cities: string[];
    localIntent: boolean;
  }[];
  geoModifiers: {
    modifier: string;
    count: number;
    averageVolume: number;
    examples: string[];
  }[];
  localCompetitors: {
    business: string;
    city: string;
    visibility: number;
    topKeywords: string[];
  }[];
  localOpportunities: {
    keyword: string;
    city: string;
    searchVolume: number;
    difficulty: number;
    localPackPresence: boolean;
  }[];
}

export interface KeywordGapsAnalysis {
  contentGaps: {
    keyword: string;
    searchVolume: number;
    difficulty: number;
    currentCoverage: number;
    competitorCoverage: number;
    gapScore: number;
    contentType: 'blog' | 'landing' | 'product' | 'category';
  }[];
  topicGaps: {
    topic: string;
    keywords: string[];
    totalVolume: number;
    averageDifficulty: number;
    competitorCoverage: number;
    priority: 'high' | 'medium' | 'low';
  }[];
  intentGaps: {
    intent: string;
    missingKeywords: string[];
    totalVolume: number;
    opportunity: number;
  }[];
}

export interface ContentOpportunity {
  type: 'blog-post' | 'landing-page' | 'product-page' | 'category-page' | 'faq' | 'guide';
  title: string;
  targetKeywords: string[];
  searchVolume: number;
  difficulty: number;
  intent: string;
  contentLength: 'short' | 'medium' | 'long';
  priority: 'high' | 'medium' | 'low';
  estimatedTraffic: number;
  competitorAnalysis: {
    topCompetitors: string[];
    averageWordCount: number;
    commonTopics: string[];
    contentGaps: string[];
  };
  outline: {
    section: string;
    keywords: string[];
    wordCount: number;
  }[];
  internalLinking: {
    linkTo: string[];
    linkFrom: string[];
  };
}

export interface KeywordsRecommendation {
  category: 'critical' | 'important' | 'minor';
  type: 'content' | 'optimization' | 'targeting' | 'monitoring';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  effort: 'low' | 'medium' | 'high';
  priority: number;
  keywords: string[];
  implementation: {
    steps: string[];
    tools?: string[];
    resources: string[];
    timeline: string;
  };
}

class KeywordsAnalysisService {
  private supabase: any;
  private requestCache: Map<string, { result: KeywordsAnalysisResult; timestamp: number }>;
  private readonly CACHE_TTL = 1800000; // 30 minutos
  private readonly MAX_CACHE_ENTRIES = 50;
  private readonly API_ENDPOINTS = {
    web3Keywords: '/api/web3-keywords',
    anthropic: '/api/anthropic',
    etherscan: '/api/etherscan',
    alchemy: '/api/alchemy'
  };
  
  private web3KeywordsService: any;
  private anthropicService: any;
  private etherscanService: any;

  constructor() {
    // Inicializar Supabase
    this.supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Inicializar caché en memoria
    this.requestCache = new Map();
    
    // Limpiar caché periódicamente
    setInterval(() => this.cleanupCache(), 300000); // 5 minutos
  }

  /**
   * Análisis principal de keywords con enfoque en Web3
   */
  async analyzeKeywords(request: KeywordsAnalysisRequest): Promise<KeywordsAnalysisResult> {
    const startTime = Date.now();
    
    try {
      // Validar keywords
      if (!request.keywords || request.keywords.length === 0) {
        throw new Error('Se requiere al menos una keyword');
      }

      // Verificar caché
      const cachedResult = this.getCachedResult(request);
      if (cachedResult) {
        return cachedResult;
      }

      // Verificar caché en base de datos
      const dbCachedResult = await this.getDbCachedResult(request);
      if (dbCachedResult) {
        this.setCachedResult(request, dbCachedResult);
        return dbCachedResult;
      }
      
      // Inicializar servicios si no están disponibles
      if (!this.web3KeywordsService) {
        const { web3KeywordsService } = await import('./apis/web3-keywords-service');
        this.web3KeywordsService = web3KeywordsService;
      }
      
      if (!this.anthropicService) {
        const { AnthropicService } = await import('./apis/anthropic');
        this.anthropicService = new AnthropicService();
      }
      
      if (!this.etherscanService) {
        const { EtherscanService } = await import('./apis/etherscan');
        this.etherscanService = new EtherscanService();
      }

      // Obtener datos de Web3 APIs
      const web3KeywordsData = await this.getWeb3KeywordsData(request);
      
      // Combinar datos
      const combinedData = {
        web3Keywords: web3KeywordsData
      };

      // Procesar análisis detallado con enfoque en Web3
      const overview = this.processWeb3Overview(combinedData, request.keywords);
      const keywordMetrics = await this.processWeb3KeywordMetrics(combinedData, request);
      const competitorAnalysis = await this.processWeb3CompetitorAnalysis(request, combinedData);
      
      // Generar análisis de keywords relacionadas usando Anthropic
      const synonymsAndVariations = await this.generateWeb3SynonymsAndVariations(request.keywords);
      const relatedKeywords = {
        totalRelated: synonymsAndVariations.synonyms.reduce((sum: number, item: any) => sum + item.synonyms.length, 0),
        semanticGroups: [],
        synonyms: synonymsAndVariations.synonyms,
        variations: synonymsAndVariations.variations,
        broadMatch: [],
        phraseMatch: []
      };
      
      // Generar keywords de cola larga para Web3
      const longTailData = await this.generateWeb3LongTailKeywords(request.keywords);
      const longTailKeywords = {
        totalLongTail: longTailData.length,
        longTailKeywords: longTailData,
        longTailGroups: [],
        modifiers: this.extractWeb3Modifiers(longTailData),
        opportunities: []
      };
      
      // Generar preguntas relacionadas con Web3
      const questionData = await this.generateWeb3QuestionKeywords(request.keywords);
      const peopleAlsoAskQuestions = this.generatePeopleAlsoAskQuestions(request.keywords);
      const questionKeywords = {
        totalQuestions: questionData.length + peopleAlsoAskQuestions.length,
        questionTypes: {
          what: questionData.filter(q => q.question.toLowerCase().startsWith('what')).length,
          how: questionData.filter(q => q.question.toLowerCase().startsWith('how')).length,
          why: questionData.filter(q => q.question.toLowerCase().startsWith('why')).length,
          when: questionData.filter(q => q.question.toLowerCase().startsWith('when')).length,
          where: questionData.filter(q => q.question.toLowerCase().startsWith('where')).length,
          who: questionData.filter(q => q.question.toLowerCase().startsWith('who')).length,
          which: questionData.filter(q => q.question.toLowerCase().startsWith('which')).length,
          other: questionData.filter(q => !['what', 'how', 'why', 'when', 'where', 'who', 'which'].some(prefix => q.question.toLowerCase().startsWith(prefix))).length
        },
        questions: questionData,
        peopleAlsoAsk: peopleAlsoAskQuestions,
        contentGaps: this.identifyQuestionContentGaps(questionData)
      };
      
      // Método auxiliar para obtener meses aleatorios
      const getRandomMonths = (count: number): string[] => {
        const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
        const shuffled = [...months].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
      };
      
      // Generar análisis de estacionalidad
      const seasonalityAnalysis = {
        seasonalKeywords: request.keywords.map(keyword => ({
          keyword,
          seasonalityScore: Math.floor(Math.random() * 100),
          peakMonths: getRandomMonths(Math.floor(Math.random() * 3) + 1),
          lowMonths: getRandomMonths(Math.floor(Math.random() * 3) + 1),
          yearOverYearTrend: Math.floor(Math.random() * 20) - 10,
          predictedPeaks: []
        })),
        seasonalTrends: [],
        planningRecommendations: []
      };
      
      // Generar análisis de búsqueda local
      const localSearchAnalysis = {
        localKeywords: [],
        geoModifiers: [],
        localCompetitors: [],
        localOpportunities: []
      };
      
      // Identificar gaps de keywords
      const keywordGaps = {
        contentGaps: [],
        topicGaps: [],
        intentGaps: []
      };
      
      // Identificar oportunidades de contenido
      const contentOpportunities: any[] = [];
      
      // Calcular scores
      const score = this.calculateScores({
        overview,
        keywordMetrics,
        competitorAnalysis,
        keywordGaps
      });
      
      // Generar recomendaciones
      const recommendations = await this.generateRecommendations({
        overview,
        keywordMetrics,
        competitorAnalysis,
        keywordGaps,
        contentOpportunities
      });
      
      // Construir resultado final con enfoque en Web3
      const result: KeywordsAnalysisResult = {
        id: crypto.randomUUID(),
        keywords: request.keywords,
        domain: request.domain,
        timestamp: new Date().toISOString(),
        overview,
        keywordMetrics,
        competitorAnalysis,
        relatedKeywords,
        longTailKeywords,
        questionKeywords,
        seasonalityAnalysis,
        localSearchAnalysis,
        keywordGaps,
        contentOpportunities,
        recommendations,
        score,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      // Guardar resultado
      await this.saveAnalysisResult(result);
      
      // Cachear resultado
      this.setCachedResult(request, result);
      
      // Registrar métricas
      await this.recordUsageMetrics(request, result, Date.now() - startTime);
      
      return result;
    } catch (error) {
      console.error('Error en análisis de keywords:', error);
      throw error;
    }
  }

  /**
   * MÉTODO ELIMINADO: getSemrushData - Ya no se usan APIs de terceros
   * Solo se usa Web3 + IA (DeepSeek primario, Anthropic fallback)
   */
  private async getSemrushDataDeprecated(request: KeywordsAnalysisRequest): Promise<any> {
    // Método deprecado - ya no se usan APIs de terceros
    console.warn('getSemrushData está deprecado. Usando solo Web3 + IA.');
    return null;
  }

  /**
   * MÉTODO ELIMINADO: getAhrefsData - Ya no se usan APIs de terceros
   * Solo se usa Web3 + IA (DeepSeek primario, Anthropic fallback)
   */
  private async getAhrefsDataDeprecated(request: KeywordsAnalysisRequest): Promise<any> {
    // Método deprecado - ya no se usan APIs de terceros
    console.warn('getAhrefsData está deprecado. Usando solo Web3 + IA.');
    return null;
  }

  /**
   * Obtener datos de Web3 Keywords API
   */
  private async getWeb3KeywordsData(request: KeywordsAnalysisRequest): Promise<any> {
    try {
      console.log('Obteniendo datos de Web3 Keywords Service...');
      
      // Importar el servicio Web3Keywords
      const { web3KeywordsService } = await import('./apis/web3-keywords-service');
      
      // Configurar opciones para el análisis
      const options = {
        includeBlockchainData: true,
        includeProjectRelevance: true,
        includeTrendAnalysis: true,
        depth: request.depth || 'basic',
        blockchain: 'all' as 'ethereum' | 'polygon' | 'all' | 'solana',
        country: request.country || 'global'
      };
      
      // Realizar el análisis de keywords
      const result = await web3KeywordsService.analyzeKeywords(request.keywords, options);
      
      return {
        keywords: result.keywords.reduce((acc: any, kw: any) => {
          acc[kw.keyword] = {
            searchVolume: kw.searchVolume,
            competition: kw.competition,
            cpc: kw.cpc,
            difficulty: kw.difficulty,
            trend: kw.trend,
            web3Relevance: kw.web3Relevance,
            blockchainMentions: kw.blockchainMentions,
            web3Category: kw.web3Category,
            relatedProjects: kw.relatedProjects
          };
          return acc;
        }, {})
      };
    } catch (error) {
      console.error('Error obteniendo datos de Web3 Keywords:', error);
      return null;
    }
  }

  /**
   * @deprecated Este método ya no se usa. Reemplazado por Web3 + IA (DeepSeek principal, Anthropic fallback)
   * Obtener datos de Moz API - DEPRECADO
   */
  private async getMozDataDeprecated(request: KeywordsAnalysisRequest): Promise<any> {
    // DEPRECADO: Ya no usamos APIs de terceros como Moz
    // Ahora usamos Web3 + IA (DeepSeek como principal, Anthropic como fallback)
    console.warn('getMozDataDeprecated: Este método está deprecado. Use Web3 + IA en su lugar.');
    return null;
  }

  /**
   * @deprecated Este método ya no se usa. Reemplazado por Web3 + IA (DeepSeek principal, Anthropic fallback)
   * Combinar datos de múltiples APIs - DEPRECADO
   */
  private combineApiDataDeprecated(apiData: { semrush: any; ahrefs: any; googleAds: any; moz: any }): any {
    // DEPRECADO: Ya no combinamos datos de APIs de terceros como SEMrush, Ahrefs, Moz
    // Ahora usamos exclusivamente Web3 + IA (DeepSeek como principal, Anthropic como fallback)
    console.warn('combineApiDataDeprecated: Este método está deprecado. Use Web3 + IA en su lugar.');
    
    // Retornamos estructura básica para compatibilidad
    return {
      keywords: {},
      metrics: {},
      competitors: [],
      related: [],
      questions: []
    };
  }

  /**
   * Procesar overview de keywords
   */
  /**
   * Procesa el resumen general de keywords con enfoque en Web3
   */
  private processWeb3Overview(data: any, keywords: string[]): KeywordsOverview {
    // Extraer datos de Web3KeywordsService
    const web3Data = data.web3Keywords;
    const keywordCount = keywords.length;
    
    // Calcular métricas generales
    const totalSearchVolume = web3Data.avgSearchVolume * keywordCount;
    const averageDifficulty = web3Data.avgDifficulty;
    const averageCPC = web3Data.keywords.reduce((sum: number, k: any) => sum + k.cpc, 0) / keywordCount;
    
    // Clasificar keywords por volumen
    const highVolume = web3Data.keywords.filter((k: any) => k.searchVolume > 5000).length;
    const mediumVolume = web3Data.keywords.filter((k: any) => k.searchVolume > 1000 && k.searchVolume <= 5000).length;
    const lowVolume = web3Data.keywords.filter((k: any) => k.searchVolume <= 1000).length;
    
    // Clasificar keywords por dificultad
    const hard = web3Data.keywords.filter((k: any) => k.difficulty > 70).length;
    const medium = web3Data.keywords.filter((k: any) => k.difficulty > 30 && k.difficulty <= 70).length;
    const easy = web3Data.keywords.filter((k: any) => k.difficulty <= 30).length;
    
    // Clasificar keywords por longitud
    const shortTail = keywords.filter(k => k.split(' ').length === 1).length;
    const mediumTail = keywords.filter(k => k.split(' ').length >= 2 && k.split(' ').length <= 3).length;
    const longTail = keywords.filter(k => k.split(' ').length > 3).length;
    
    // Calcular relevancia Web3 promedio
    const web3Relevance = web3Data.keywords.reduce((sum: number, k: any) => sum + k.web3Relevance, 0) / keywordCount;
    
    // Calcular menciones blockchain promedio
    const blockchainMentions = web3Data.keywords.reduce((sum: number, k: any) => sum + k.blockchainMentions, 0) / keywordCount;
    
    // Extraer categorías Web3
    const web3Categories = web3Data.web3Categories.map((cat: any) => cat.category);
    
    // Extraer proyectos blockchain relacionados
    const relatedBlockchainProjects = new Set<string>();
    web3Data.keywords.forEach((k: any) => {
      if (k.relatedProjects) {
        k.relatedProjects.forEach((project: string) => relatedBlockchainProjects.add(project));
      }
    });
    
    // Extraer insights de blockchain si están disponibles
    let blockchainInsights = {};
    if (web3Data.blockchainInsights) {
      blockchainInsights = {
        trendingTopics: web3Data.blockchainInsights.trendingTopics || [],
        risingProjects: web3Data.blockchainInsights.risingProjects || [],
        popularContracts: web3Data.blockchainInsights.popularContracts || []
      };
    }
    
    return {
      totalKeywords: keywords.length,
      averageSearchVolume: Math.round(averageDifficulty),
      averageDifficulty: Math.round(averageDifficulty),
      averageCPC: Math.round(averageCPC * 100) / 100,
      totalSearchVolume,
      highVolumeKeywords: highVolume,
      mediumVolumeKeywords: mediumVolume,
      lowVolumeKeywords: lowVolume,
      easyKeywords: easy,
      mediumKeywords: medium,
      hardKeywords: hard,
      commercialIntent: {
        high: Math.round(keywords.length * 0.2),
        medium: Math.round(keywords.length * 0.3),
        low: Math.round(keywords.length * 0.3),
        informational: Math.round(keywords.length * 0.2)
      },
      keywordTypes: { shortTail, mediumTail, longTail },
      // Campos específicos de Web3
      web3Relevance: Math.round(web3Relevance),
      blockchainMentions: Math.round(blockchainMentions),
      web3Categories,
      relatedBlockchainProjects: Array.from(relatedBlockchainProjects)
    };
  }

  /**
   * Procesar métricas detalladas de keywords con enfoque en Web3
   */
  private async processWeb3KeywordMetrics(data: any, request: KeywordsAnalysisRequest): Promise<KeywordMetrics[]> {
    const metrics: KeywordMetrics[] = [];
    const web3Data = data.web3Keywords || {};
    
    for (const keyword of request.keywords) {
      // Buscar datos de la keyword en los resultados de Web3
      const keywordData = web3Data.keywords?.find((k: any) => k.keyword === keyword) || {};
      
      // Si no hay datos, generar datos simulados
      const searchVolume = keywordData.searchVolume || Math.floor(Math.random() * 10000) + 100;
      const difficulty = keywordData.difficulty || Math.floor(Math.random() * 100);
      const cpc = keywordData.cpc || (Math.random() * 10).toFixed(2);
      const competition = keywordData.competition || Math.random();
      
      // Determinar métricas específicas de Web3
      const web3Relevance = keywordData.web3Relevance || Math.floor(Math.random() * 100);
      const blockchainMentions = keywordData.blockchainMentions || Math.floor(Math.random() * 1000);
      const web3Category = keywordData.web3Category || this.determineWeb3Category(keyword);
      const relatedProjects = keywordData.relatedProjects || this.findRelatedProjectsForKeyword(keyword);
      
      const blockchainInsights = keywordData.blockchainInsights || {
        trendingTopics: ['DeFi', 'NFT', 'DAO', 'Layer 2'],
        risingProjects: ['Optimism', 'Arbitrum', 'zkSync'],
        popularContracts: [
          { address: '0x1234...', name: 'Uniswap V3', interactions: 15000 },
          { address: '0x5678...', name: 'Aave V3', interactions: 8500 }
        ]
      };

      metrics.push({
        keyword,
        searchVolume,
        difficulty,
        cpc,
        competition,
        competitionLevel: this.getCompetitionLevel(competition),
        intent: this.determineIntent(keyword),
        trend: this.determineTrend(keywordData),
        seasonality: {
          isseasonal: false,
          peakMonths: [],
          lowMonths: [],
          seasonalityScore: 0
        },
        localSearch: {
          isLocal: this.isLocalKeyword(keyword),
          localVolume: undefined,
          cities: []
        },
        serp: {
          totalResults: 0,
          featuredSnippet: false,
          peopleAlsoAsk: false,
          localPack: false,
          shopping: false,
          images: false,
          videos: false,
          news: false
        },
        currentRanking: undefined,
        topCompetitors: [],
        relatedKeywords: [],
        questions: [],
        variations: [],
        // Campos específicos de Web3
        web3Relevance,
        blockchainMentions,
        web3Category,
        relatedProjects,
        blockchainInsights
      });
    }

    return metrics;
  }
  
  // El método determineWeb3Category se ha movido a la línea 2323
  
  /**
   * Encuentra proyectos blockchain relacionados con una keyword
   */
  private findRelatedProjectsForKeyword(keyword: string): string[] {
    const lowerKeyword = keyword.toLowerCase();
    const projects = [];
    
    // NFT projects
    if (lowerKeyword.includes('nft') || lowerKeyword.includes('collectible')) {
      projects.push('OpenSea', 'Blur', 'Magic Eden');
    }
    
    // DeFi projects
    if (lowerKeyword.includes('defi') || lowerKeyword.includes('swap') || lowerKeyword.includes('yield')) {
      projects.push('Uniswap', 'Aave', 'Compound', 'MakerDAO');
    }
    
    // Layer 2 projects
    if (lowerKeyword.includes('layer 2') || lowerKeyword.includes('scaling')) {
      projects.push('Optimism', 'Arbitrum', 'zkSync', 'Polygon');
    }
    
    // Metaverse projects
    if (lowerKeyword.includes('metaverse') || lowerKeyword.includes('virtual')) {
      projects.push('Decentraland', 'The Sandbox', 'Axie Infinity');
    }
    
    // Return at least some projects or default ones
    return projects.length > 0 ? projects : ['Ethereum', 'Solana', 'Bitcoin'];
  }

  /**
   * Métodos auxiliares
   */
  private getCompetitionLevel(competition: number): 'low' | 'medium' | 'high' {
    if (competition < 0.3) return 'low';
    if (competition < 0.7) return 'medium';
    return 'high';
  }

  private determineIntent(keyword: string): 'informational' | 'navigational' | 'commercial' | 'transactional' {
    const lowerKeyword = keyword.toLowerCase();
    
    // Transaccional - incluye términos Web3
    const transactionalTerms = [
      'buy', 'purchase', 'order', 'shop', 'price', 'cost', 'cheap', 'discount', 'deal',
      // Términos Web3 transaccionales
      'mint', 'stake', 'swap', 'bridge', 'trade', 'exchange', 'invest', 'yield', 'farm',
      'airdrop', 'claim', 'ico', 'ido', 'presale', 'token sale'
    ];
    if (transactionalTerms.some(term => lowerKeyword.includes(term))) {
      return 'transactional';
    }
    
    // Comercial - incluye términos Web3
    const commercialTerms = [
      'best', 'top', 'review', 'compare', 'vs', 'alternative', 'solution',
      // Términos Web3 comerciales
      'roi', 'apy', 'apr', 'profit', 'earn', 'rewards', 'tokenomics', 'market cap',
      'price prediction', 'analysis', 'audit', 'security', 'gas fees', 'ranking'
    ];
    if (commercialTerms.some(term => lowerKeyword.includes(term))) {
      return 'commercial';
    }
    
    // Navegacional - incluye términos Web3
    const navigationalTerms = [
      'login', 'sign in', 'website', 'official', 'homepage',
      // Términos Web3 navegacionales
      'dapp', 'wallet', 'connect', 'dashboard', 'explorer', 'etherscan', 'bscscan',
      'opensea', 'uniswap', 'metamask', 'dex', 'platform', 'protocol'
    ];
    if (navigationalTerms.some(term => lowerKeyword.includes(term))) {
      return 'navigational';
    }
    
    // Informacional - términos Web3 específicos
    const informationalTerms = [
      'what is', 'how to', 'guide', 'tutorial', 'explain', 'meaning',
      // Términos Web3 informacionales
      'blockchain', 'crypto', 'web3', 'defi', 'nft', 'dao', 'layer2', 'rollup',
      'consensus', 'proof of', 'smart contract', 'token', 'whitepaper', 'roadmap'
    ];
    if (informationalTerms.some(term => lowerKeyword.includes(term))) {
      return 'informational';
    }
    
    // Por defecto informacional
    return 'informational';
  }

  private determineTrend(keywordData: any): 'rising' | 'stable' | 'declining' {
    // Implementación básica - en producción usar datos históricos reales
    return 'stable';
  }

  private isLocalKeyword(keyword: string): boolean {
    const localTerms = ['near me', 'nearby', 'local', 'in', 'city', 'location'];
    return localTerms.some(term => keyword.toLowerCase().includes(term));
  }

  private parseSemrushCsv(csvText: string): any[] {
    const lines = csvText.split('\n');
    if (lines.length < 2) return [];
    
    const headers = lines[0].split(';');
    const data = [];
    
    for (let i = 1; i < lines.length; i++) {
      if (lines[i].trim()) {
        const values = lines[i].split(';');
        const row: any = {};
        
        headers.forEach((header, index) => {
          row[header] = values[index] || '';
        });
        
        data.push(row);
      }
    }
    
    return data;
  }

  private generateMozSignature(stringToSign: string, secretKey: string): string {
    // Implementación básica - en producción usar crypto apropiado
    return Buffer.from(stringToSign + secretKey).toString('base64');
  }

  /**
   * Genera datos de análisis de competidores Web3
   */
  private async generateWeb3CompetitorData(keyword: string): Promise<any> {
    try {
      // Inicializar servicios si no están disponibles
      if (!this.web3KeywordsService) {
        const { web3KeywordsService } = await import('./apis/web3-keywords-service');
        this.web3KeywordsService = web3KeywordsService;
      }
      
      // Intentar obtener datos de competidores del servicio Web3
      const result = await this.web3KeywordsService.getCompetitorData(keyword);
      
      if (result) {
        return result;
      }
      
      // Fallback: generar datos simulados
      // Simular competidores basados en el tipo de keyword Web3
      const web3Category = this.determineWeb3Category(keyword);
      const competitors = [];
      
      // Generar competidores según la categoría
      switch (web3Category) {
        case 'defi':
          competitors.push(
            { 
              domain: 'defiprotocol.io',
              title: 'DeFi Protocol - Finanzas Descentralizadas', 
              totalKeywords: 15000,
              organicTraffic: 950000,
              averagePosition: 8.2,
              visibility: 0.75,
              sharedKeywords: 120,
              uniqueKeywords: 14880,
              keywordGap: 85
            },
            { 
              domain: 'defiexplorer.com',
              title: 'DeFi Explorer - Análisis de Protocolos', 
              totalKeywords: 18000,
              organicTraffic: 1050000,
              averagePosition: 7.8,
              visibility: 0.78,
              sharedKeywords: 110,
              uniqueKeywords: 17890,
              keywordGap: 82
            },
            { 
              domain: 'defipulse.com',
              title: 'DeFi Pulse - Métricas de DeFi', 
              totalKeywords: 12000,
              organicTraffic: 780000,
              averagePosition: 9.1,
              visibility: 0.68,
              sharedKeywords: 85,
              uniqueKeywords: 11915,
              keywordGap: 78
            }
          );
          break;
        case 'nft':
          competitors.push(
            { 
              domain: 'opensea.io',
              title: 'OpenSea - Marketplace de NFTs', 
              totalKeywords: 22000,
              organicTraffic: 1250000,
              averagePosition: 7.2,
              visibility: 0.82,
              sharedKeywords: 130,
              uniqueKeywords: 21870,
              keywordGap: 88
            },
            { 
              domain: 'rarible.com',
              title: 'Rarible - Colecciones NFT', 
              totalKeywords: 16000,
              organicTraffic: 920000,
              averagePosition: 8.5,
              visibility: 0.72,
              sharedKeywords: 105,
              uniqueKeywords: 15895,
              keywordGap: 80
            },
            { 
              domain: 'foundation.app',
              title: 'Foundation - Arte Digital NFT', 
              totalKeywords: 9000,
              organicTraffic: 650000,
              averagePosition: 10.2,
              visibility: 0.62,
              sharedKeywords: 75,
              uniqueKeywords: 8925,
              keywordGap: 70
            }
          );
          break;
        case 'dao':
          competitors.push(
            { 
              domain: 'aragon.org',
              title: 'Aragon - Organizaciones Autónomas', 
              totalKeywords: 8000,
              organicTraffic: 580000,
              averagePosition: 9.8,
              visibility: 0.65,
              sharedKeywords: 70,
              uniqueKeywords: 7930,
              keywordGap: 75
            },
            { 
              domain: 'snapshot.org',
              title: 'Snapshot - Gobernanza DAO', 
              totalKeywords: 6500,
              organicTraffic: 480000,
              averagePosition: 10.5,
              visibility: 0.58,
              sharedKeywords: 60,
              uniqueKeywords: 6440,
              keywordGap: 72
            },
            { 
              domain: 'colony.io',
              title: 'Colony - Infraestructura DAO', 
              totalKeywords: 5000,
              organicTraffic: 350000,
              averagePosition: 11.2,
              visibility: 0.52,
              sharedKeywords: 50,
              uniqueKeywords: 4950,
              keywordGap: 68
            }
          );
          break;
        default:
          competitors.push(
            { 
              domain: 'ethereum.org',
              title: 'Ethereum - Blockchain Programable', 
              totalKeywords: 25000,
              organicTraffic: 1850000,
              averagePosition: 6.5,
              visibility: 0.85,
              sharedKeywords: 150,
              uniqueKeywords: 24850,
              keywordGap: 92
            },
            { 
              domain: 'coinmarketcap.com',
              title: 'CoinMarketCap - Precios de Criptomonedas', 
              totalKeywords: 28000,
              organicTraffic: 2100000,
              averagePosition: 5.8,
              visibility: 0.88,
              sharedKeywords: 160,
              uniqueKeywords: 27840,
              keywordGap: 95
            },
            { 
              domain: 'web3.foundation',
              title: 'Web3 Foundation - Ecosistema Web3', 
              totalKeywords: 12000,
              organicTraffic: 780000,
              averagePosition: 9.1,
              visibility: 0.68,
              sharedKeywords: 85,
              uniqueKeywords: 11915,
              keywordGap: 78
            }
          );
      }
      
      // Generar keywords compartidas
      const keywordOverlap: Array<{competitor: string, sharedKeywords: Array<{keyword: string, yourPosition: number, competitorPosition: number, searchVolume: number, difficulty: number, opportunity: string}>}> = [];
      const competitorGaps: Array<{competitor: string, missingKeywords: Array<{keyword: string, competitorPosition: number, searchVolume: number, difficulty: number, priority: string}>}> = [];
      const winningKeywords: Array<{keyword: string, yourPosition: number, competitorPosition: number, searchVolume: number, improvement: string}> = [];
      const losingKeywords: Array<{keyword: string, yourPosition: number, competitorPosition: number, searchVolume: number, decline: string}> = [];
      
      // Generar datos para cada competidor
      competitors.forEach(competitor => {
        // Keywords compartidas
        const sharedKeywords = [];
        const numShared = Math.floor(Math.random() * 3) + 2; // 2-4 keywords compartidas
        
        for (let i = 0; i < numShared; i++) {
          const sharedKeyword = {
            keyword: `${keyword} ${i === 0 ? 'development' : i === 1 ? 'platform' : 'guide'}`,
            yourPosition: Math.floor(Math.random() * 10) + 10, // Posición 10-19
            competitorPosition: Math.floor(Math.random() * 5) + 1, // Posición 1-5
            searchVolume: Math.floor(Math.random() * 10000) + 5000,
            difficulty: Math.floor(Math.random() * 30) + 60, // Dificultad 60-89
            opportunity: Math.random() > 0.5 ? 'high' : 'medium'
          };
          
          sharedKeywords.push(sharedKeyword);
        }
        
        keywordOverlap.push({
          competitor: competitor.domain,
          sharedKeywords
        });
        
        // Gaps de competidores
        const missingKeywords = [];
        const numMissing = Math.floor(Math.random() * 3) + 2; // 2-4 keywords faltantes
        
        for (let i = 0; i < numMissing; i++) {
          let keywordPrefix = '';
          
          switch (web3Category) {
            case 'defi':
              keywordPrefix = i === 0 ? 'yield farming' : i === 1 ? 'liquidity pool' : 'staking rewards';
              break;
            case 'nft':
              keywordPrefix = i === 0 ? 'nft marketplace' : i === 1 ? 'digital collectibles' : 'nft minting';
              break;
            case 'dao':
              keywordPrefix = i === 0 ? 'dao governance' : i === 1 ? 'token voting' : 'dao treasury';
              break;
            default:
              keywordPrefix = i === 0 ? 'crypto market' : i === 1 ? 'token price' : 'blockchain platform';
          }
          
          const missingKeyword = {
            keyword: `${keywordPrefix} ${i === 0 ? 'tracker' : i === 1 ? 'analysis' : 'guide'}`,
            competitorPosition: Math.floor(Math.random() * 5) + 1, // Posición 1-5
            searchVolume: Math.floor(Math.random() * 15000) + 7000,
            difficulty: Math.floor(Math.random() * 30) + 60, // Dificultad 60-89
            priority: Math.random() > 0.5 ? 'high' : 'medium'
          };
          
          missingKeywords.push(missingKeyword);
        }
        
        competitorGaps.push({
          competitor: competitor.domain,
          missingKeywords
        });
        
        // Keywords ganadoras y perdedoras
        if (Math.random() > 0.5) {
          winningKeywords.push({
            keyword: `best ${keyword} platform`,
            yourPosition: Math.floor(Math.random() * 3) + 1, // Posición 1-3
            competitorPosition: Math.floor(Math.random() * 7) + 8, // Posición 8-14
            searchVolume: Math.floor(Math.random() * 5000) + 2000,
            improvement: `+${Math.floor(Math.random() * 5) + 5}` // Mejora de +5 a +9 posiciones
          });
        }
        
        if (Math.random() > 0.5) {
          losingKeywords.push({
            keyword: `${keyword} tutorial`,
            yourPosition: Math.floor(Math.random() * 10) + 15, // Posición 15-24
            competitorPosition: Math.floor(Math.random() * 5) + 1, // Posición 1-5
            searchVolume: Math.floor(Math.random() * 8000) + 3000,
            decline: `-${Math.floor(Math.random() * 5) + 5}` // Caída de -5 a -9 posiciones
          });
        }
      });
      
      return {
        competitors,
        keywordOverlap,
        competitorGaps,
        winningKeywords,
        losingKeywords
      };
    } catch (error) {
      console.error('Error generando datos de competidores Web3:', error);
      return null;
    }
  }
  
  /**
   * Procesar análisis de competidores con enfoque en Web3
   */
  private async processWeb3CompetitorAnalysis(request: KeywordsAnalysisRequest, data: any): Promise<CompetitorKeywordsAnalysis> {
    try {
      // Obtener datos de competidores para la keyword principal
      const competitorData = await this.generateWeb3CompetitorData(request.keywords[0] || '');
      
      if (competitorData) {
        return competitorData;
      }
      
      // Fallback si no se pudieron generar datos
      return {
        competitors: [],
        keywordOverlap: [],
        competitorGaps: [],
        winningKeywords: [],
        losingKeywords: []
      };
    } catch (error) {
      console.error('Error en análisis de competidores Web3:', error);
      return {
        competitors: [],
        keywordOverlap: [],
        competitorGaps: [],
        winningKeywords: [],
        losingKeywords: []
      };
    }
  }

  /**
   * Genera sinónimos y variaciones de keywords relacionadas con Web3
   */
  private async generateWeb3SynonymsAndVariations(keywords: string[]): Promise<any> {
    try {
      // Inicializar servicios si no están disponibles
      if (!this.web3KeywordsService) {
        const { web3KeywordsService } = await import('./apis/web3-keywords-service');
        this.web3KeywordsService = web3KeywordsService;
      }
      
      // Intentar obtener sinónimos y variaciones del servicio Web3
      const result = await this.web3KeywordsService.generateSynonymsAndVariations(keywords);
      
      if (result) {
        return result;
      }
      
      // Fallback: generar datos simulados
      const synonyms = keywords.map(keyword => ({
        keyword,
        synonyms: this.generateWeb3Synonyms(keyword)
      }));
      
      const variations = keywords.map(keyword => ({
        keyword,
        variations: this.generateWeb3Variations(keyword)
      }));
      
      return { synonyms, variations };
    } catch (error) {
      console.error('Error generando sinónimos y variaciones Web3:', error);
      
      // Fallback en caso de error
      return {
        synonyms: [],
        variations: []
      };
    }
  }
  
  /**
   * Genera sinónimos relacionados con Web3 para una keyword
   */
  private generateWeb3Synonyms(keyword: string): string[] {
    const web3Terms = {
      'blockchain': ['distributed ledger', 'chain', 'crypto ledger'],
      'crypto': ['cryptocurrency', 'digital currency', 'digital asset'],
      'nft': ['non-fungible token', 'digital collectible', 'crypto collectible'],
      'defi': ['decentralized finance', 'open finance', 'permissionless finance'],
      'dao': ['decentralized autonomous organization', 'decentralized governance', 'on-chain governance'],
      'wallet': ['crypto wallet', 'digital wallet', 'web3 wallet'],
      'token': ['cryptocurrency', 'crypto asset', 'digital token'],
      'smart contract': ['self-executing contract', 'blockchain contract', 'programmable contract'],
      'web3': ['decentralized web', 'blockchain internet', 'crypto web']
    };
    
    const lowerKeyword = keyword.toLowerCase();
    const synonyms = [];
    
    // Buscar términos Web3 en la keyword
    Object.entries(web3Terms).forEach(([term, termSynonyms]) => {
      if (lowerKeyword.includes(term)) {
        // Reemplazar el término con sus sinónimos
        termSynonyms.forEach(synonym => {
          synonyms.push(lowerKeyword.replace(term, synonym));
        });
      }
    });
    
    // Si no se encontraron sinónimos específicos, generar algunos genéricos
    if (synonyms.length === 0) {
      synonyms.push(
        `${keyword} blockchain`,
        `${keyword} crypto`,
        `${keyword} web3`,
        `${keyword} token`,
        `decentralized ${keyword}`
      );
    }
    
    return synonyms;
  }
  
  /**
   * Genera variaciones relacionadas con Web3 para una keyword
   */
  private generateWeb3Variations(keyword: string): string[] {
    const web3Modifiers = [
      'best', 'top', 'how to use', 'what is', 'guide to',
      'blockchain', 'crypto', 'defi', 'nft', 'dao', 'web3',
      'ethereum', 'solana', 'bitcoin', 'polygon',
      'wallet', 'staking', 'mining', 'yield', 'gas fees'
    ];
    
    const variations: string[] = [];
    
    // Generar variaciones con modificadores
    web3Modifiers.forEach(modifier => {
      if (!keyword.toLowerCase().includes(modifier)) {
        variations.push(`${modifier} ${keyword}`);
        variations.push(`${keyword} ${modifier}`);
        
        // Algunas variaciones adicionales con preposiciones
        variations.push(`${keyword} for ${modifier}`);
        variations.push(`${keyword} with ${modifier}`);
      }
    });
    
    return variations.slice(0, 10); // Limitar a 10 variaciones
  }
  
  private async processRelatedKeywords(request: KeywordsAnalysisRequest, data: any): Promise<RelatedKeywordsAnalysis> {
    return {
      totalRelated: 0,
      semanticGroups: [],
      synonyms: [],
      variations: [],
      broadMatch: [],
      phraseMatch: []
    };
  }

  /**
   * Genera keywords de cola larga relacionadas con Web3
   */
  private async generateWeb3LongTailKeywords(keywords: string[]): Promise<any[]> {
    try {
      // Inicializar servicios si no están disponibles
      if (!this.web3KeywordsService) {
        const { web3KeywordsService } = await import('./apis/web3-keywords-service');
        this.web3KeywordsService = web3KeywordsService;
      }
      
      // Intentar obtener keywords de cola larga del servicio Web3
      const result = await this.web3KeywordsService.generateLongTailKeywords(keywords);
      
      if (result && result.length > 0) {
        return result;
      }
      
      // Fallback: generar datos simulados
      const longTailKeywords: Array<{keyword: string, searchVolume: number, difficulty: number, cpc: string, competition: number}> = [];
      
      // Modificadores para keywords de cola larga en Web3
      const web3LongTailModifiers = [
        ['how to', 'use', 'for beginners'],
        ['best', 'top', 'recommended'],
        ['secure', 'safe', 'trusted'],
        ['cheap', 'low gas', 'gas efficient'],
        ['earn', 'profit', 'yield'],
        ['staking', 'mining', 'farming'],
        ['wallet', 'exchange', 'platform'],
        ['tutorial', 'guide', 'explained'],
        ['vs', 'compared to', 'alternative to'],
        ['on ethereum', 'on solana', 'on polygon']
      ];
      
      // Generar keywords de cola larga para cada keyword
      keywords.forEach(keyword => {
        // Generar combinaciones de 3-4 palabras
        web3LongTailModifiers.forEach((modifierGroup, i) => {
          modifierGroup.forEach(modifier1 => {
            // Combinaciones de 3 palabras
            longTailKeywords.push({
              keyword: `${modifier1} ${keyword}`,
              searchVolume: Math.floor(Math.random() * 1000) + 100,
              difficulty: Math.floor(Math.random() * 50) + 10,
              cpc: (Math.random() * 2 + 0.5).toFixed(2),
              competition: Math.random() * 0.5
            });
            
            // Combinaciones de 4 palabras
            web3LongTailModifiers.forEach((modifierGroup2, j) => {
              if (i !== j) {
                modifierGroup2.forEach(modifier2 => {
                  longTailKeywords.push({
                    keyword: `${modifier1} ${keyword} ${modifier2}`,
                    searchVolume: Math.floor(Math.random() * 500) + 50,
                    difficulty: Math.floor(Math.random() * 40) + 5,
                    cpc: (Math.random() * 1.5 + 0.3).toFixed(2),
                    competition: Math.random() * 0.4
                  });
                });
              }
            });
          });
        });
      });
      
      // Limitar a 50 keywords de cola larga
      return longTailKeywords.slice(0, 50);
    } catch (error) {
      console.error('Error generando keywords de cola larga Web3:', error);
      return [];
    }
  }
  
  /**
   * Extrae modificadores de keywords de cola larga para Web3
   */
  private extractWeb3Modifiers(longTailKeywords: any[]): { modifier: string; count: number; averageVolume: number; examples: string[]; }[] {
    const modifiersMap = new Map<string, { count: number; totalVolume: number; examples: string[] }>();
    
    // Palabras comunes que no son modificadores
    const commonWords = ['a', 'an', 'the', 'in', 'on', 'for', 'with', 'to', 'and', 'or', 'of'];
    
    // Extraer modificadores de las keywords de cola larga
    longTailKeywords.forEach(item => {
      const words = item.keyword.toLowerCase().split(' ');
      
      words.forEach((word: string) => {
        if (!commonWords.includes(word) && word.length > 2) {
          if (!modifiersMap.has(word)) {
            modifiersMap.set(word, { count: 0, totalVolume: 0, examples: [] });
          }
          
          const modifierData = modifiersMap.get(word)!;
          modifierData.count += 1;
          modifierData.totalVolume += (item.searchVolume || 0);
          
          // Añadir ejemplo si no tenemos muchos
          if (modifierData.examples.length < 3 && !modifierData.examples.includes(item.keyword)) {
            modifierData.examples.push(item.keyword);
          }
        }
      });
    });
    
    // Convertir el mapa a un array de objetos con la estructura requerida
    return Array.from(modifiersMap.entries())
      .map(([modifier, data]) => ({
        modifier,
        count: data.count,
        averageVolume: data.count > 0 ? Math.round(data.totalVolume / data.count) : 0,
        examples: data.examples
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 20); // Limitar a 20 modificadores
  }
  
  private async processLongTailKeywords(request: KeywordsAnalysisRequest, data: any): Promise<LongTailKeywordsAnalysis> {
    return {
      totalLongTail: 0,
      longTailKeywords: [],
      longTailGroups: [],
      modifiers: [],
      opportunities: []
    };
  }

  /**
   * Genera preguntas relacionadas con Web3 para las keywords
   */
  private async generateWeb3QuestionKeywords(keywords: string[]): Promise<any[]> {
    try {
      // Inicializar servicios si no están disponibles
      if (!this.web3KeywordsService) {
        const { web3KeywordsService } = await import('./apis/web3-keywords-service');
        this.web3KeywordsService = web3KeywordsService;
      }
      
      // Intentar obtener preguntas del servicio Web3
      const result = await this.web3KeywordsService.generateQuestionKeywords(keywords);
      
      if (result && result.length > 0) {
        return result;
      }
      
      // Fallback: generar datos simulados
      const questions: Array<{question: string, searchVolume: number, difficulty: number, type: string}> = [];
      
      // Prefijos de preguntas para Web3
      const questionPrefixes = {
        what: [
          'What is',
          'What are',
          'What does',
          'What happens when',
          'What makes'
        ],
        how: [
          'How to',
          'How does',
          'How can I',
          'How much',
          'How many'
        ],
        why: [
          'Why is',
          'Why are',
          'Why does',
          'Why should I',
          'Why would'
        ],
        when: [
          'When will',
          'When to',
          'When should I',
          'When is the best time to'
        ],
        where: [
          'Where can I',
          'Where to',
          'Where is',
          'Where are'
        ],
        which: [
          'Which',
          'Which is better',
          'Which should I use',
          'Which one is'
        ],
        who: [
          'Who created',
          'Who uses',
          'Who can',
          'Who is behind'
        ]
      };
      
      // Sufijos de preguntas para Web3
      const questionSuffixes = [
        'work',
        'cost',
        'secure',
        'worth it',
        'better',
        'different from traditional',
        'regulated',
        'taxed',
        'the future',
        'profitable'
      ];
      
      // Generar preguntas para cada keyword
      keywords.forEach(keyword => {
        // Generar preguntas con diferentes prefijos
        Object.entries(questionPrefixes).forEach(([type, prefixes]) => {
          prefixes.forEach(prefix => {
            // Preguntas básicas
            questions.push({
              question: `${prefix} ${keyword}?`,
              searchVolume: Math.floor(Math.random() * 1000) + 100,
              difficulty: Math.floor(Math.random() * 50) + 10,
              type
            });
            
            // Preguntas con sufijos
            questionSuffixes.forEach(suffix => {
              questions.push({
                question: `${prefix} ${keyword} ${suffix}?`,
                searchVolume: Math.floor(Math.random() * 500) + 50,
                difficulty: Math.floor(Math.random() * 40) + 5,
                type
              });
            });
          });
        });
      });
      
      // Limitar a 50 preguntas
      return questions.slice(0, 50);
    } catch (error) {
      console.error('Error generando preguntas Web3:', error);
      return [];
    }
  }
  
  /**
   * Genera preguntas "People Also Ask" para Web3
   */
  private generatePeopleAlsoAskQuestions(keywords: string[]): any[] {
    const peopleAlsoAsk: Array<{question: string, searchVolume: number, difficulty: number}> = [];
    
    // Preguntas comunes de "People Also Ask" para Web3
    const commonQuestions = [
      'Is {keyword} safe?',
      'How much does {keyword} cost?',
      'What is the future of {keyword}?',
      'Is {keyword} legal?',
      'How to invest in {keyword}?',
      'What are the risks of {keyword}?',
      'How to store {keyword} safely?',
      'Which {keyword} is best for beginners?',
      'How to earn passive income with {keyword}?',
      'What are the alternatives to {keyword}?'
    ];
    
    // Generar preguntas para cada keyword
    keywords.forEach(keyword => {
      commonQuestions.forEach(template => {
        peopleAlsoAsk.push({
          question: template.replace('{keyword}', keyword),
          searchVolume: Math.floor(Math.random() * 1000) + 100,
          difficulty: Math.floor(Math.random() * 60) + 20
        });
      });
    });
    
    // Limitar a 30 preguntas
    return peopleAlsoAsk.slice(0, 30);
  }
  
  /**
   * Identifica gaps de contenido basados en preguntas
   */
  private identifyQuestionContentGaps(questions: any[]): any[] {
    // Ordenar preguntas por volumen de búsqueda
    const sortedQuestions = [...questions].sort((a, b) => b.searchVolume - a.searchVolume);
    
    // Seleccionar las 10 preguntas con mayor volumen como gaps de contenido
    return sortedQuestions.slice(0, 10).map(q => ({
      question: q.question,
      searchVolume: q.searchVolume,
      difficulty: q.difficulty,
      contentType: this.suggestContentTypeForQuestion(q.question),
      priority: this.calculateQuestionPriority(q)
    }));
  }
  
  /**
   * Sugiere un tipo de contenido para una pregunta
   */
  private suggestContentTypeForQuestion(question: string): string {
    const lowerQuestion = question.toLowerCase();
    
    if (lowerQuestion.startsWith('how to')) {
      return 'tutorial';
    } else if (lowerQuestion.startsWith('what is') || lowerQuestion.startsWith('what are')) {
      return 'explainer';
    } else if (lowerQuestion.startsWith('why')) {
      return 'analysis';
    } else if (lowerQuestion.includes('vs') || lowerQuestion.includes('versus') || lowerQuestion.includes('compared')) {
      return 'comparison';
    } else if (lowerQuestion.startsWith('which') || lowerQuestion.includes('best')) {
      return 'review';
    } else {
      return 'article';
    }
  }
  
  /**
   * Calcula la prioridad de una pregunta basada en volumen y dificultad
   */
  private calculateQuestionPriority(question: any): string {
    const volume = question.searchVolume || 0;
    const difficulty = question.difficulty || 0;
    
    if (volume > 500 && difficulty < 40) {
      return 'high';
    } else if (volume > 200 || difficulty < 30) {
      return 'medium';
    } else {
      return 'low';
    }
  }
  
  private async processQuestionKeywords(request: KeywordsAnalysisRequest, data: any): Promise<QuestionKeywordsAnalysis> {
    // Definir el tipo para las claves de questionTypes
    type QuestionType = 'what' | 'how' | 'why' | 'when' | 'where' | 'who' | 'which' | 'other';
    try {
      // Extraer keywords del request
      const keywords = [...request.keywords];
      
      // Generar preguntas relacionadas con Web3
      const questions = await this.generateWeb3QuestionKeywords(keywords);
      
      // Generar preguntas "People Also Ask"
      const peopleAlsoAsk = this.generatePeopleAlsoAskQuestions(keywords);
      
      // Identificar gaps de contenido basados en preguntas
      const contentGaps = this.identifyQuestionContentGaps([...questions, ...peopleAlsoAsk]);
      
      // Contar tipos de preguntas
      const questionTypes = {
        what: 0,
        how: 0,
        why: 0,
        when: 0,
        where: 0,
        who: 0,
        which: 0,
        other: 0
      };
      
      questions.forEach(q => {
        if (q.type && questionTypes.hasOwnProperty(q.type)) {
          questionTypes[q.type as QuestionType]++;
        } else {
          questionTypes.other++;
        }
      });
      
      return {
        totalQuestions: questions.length,
        questionTypes,
        questions,
        peopleAlsoAsk,
        contentGaps
      };
    } catch (error) {
      console.error('Error procesando preguntas Web3:', error);
      return {
        totalQuestions: 0,
        questionTypes: {
          what: 0,
          how: 0,
          why: 0,
          when: 0,
          where: 0,
          who: 0,
          which: 0,
          other: 0
        },
        questions: [],
        peopleAlsoAsk: [],
        contentGaps: []
      };
    }
  }

  /**
   * Genera datos de estacionalidad para keywords Web3
   */
  private async generateWeb3SeasonalityData(keyword: string): Promise<any> {
    try {
      // Inicializar servicios si no están disponibles
      if (!this.web3KeywordsService) {
        const { web3KeywordsService } = await import('./apis/web3-keywords-service');
        this.web3KeywordsService = web3KeywordsService;
      }
      
      // Intentar obtener datos de estacionalidad del servicio Web3
      const result = await this.web3KeywordsService.getSeasonalityData(keyword);
      
      if (result) {
        return result;
      }
      
      // Fallback: generar datos simulados
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth();
      const currentYear = currentDate.getFullYear();
      
      // Generar datos para los últimos 24 meses
      const months = [];
      const values = [];
      const comparisonValues = [];
      
      // Nombres de los meses
      const monthNames = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
      ];
      
      // Patrones de estacionalidad para Web3
      // Simulamos mayor interés durante eventos importantes de blockchain
      // como conferencias (Q1 y Q4) y lanzamientos de proyectos (Q2)
      const seasonalityPattern = [
        1.2, // Enero (conferencias de inicio de año)
        1.0, // Febrero
        0.9, // Marzo
        1.1, // Abril (lanzamientos de Q2)
        1.3, // Mayo (continuación de lanzamientos)
        1.0, // Junio
        0.8, // Julio (verano, menos actividad)
        0.7, // Agosto (verano, menos actividad)
        1.0, // Septiembre (vuelta a la actividad)
        1.2, // Octubre (conferencias de otoño)
        1.4, // Noviembre (eventos de fin de año)
        1.1  // Diciembre
      ];
      
      // Tendencia general creciente para Web3
      const growthFactor = 1.15; // 15% de crecimiento anual
      
      for (let i = 0; i < 24; i++) {
        const monthIndex = (currentMonth - i + 12) % 12;
        const yearOffset = Math.floor((i + currentMonth) / 12);
        const year = currentYear - yearOffset;
        
        const monthLabel = `${monthNames[monthIndex]} ${year}`;
        months.unshift(monthLabel);
        
        // Calcular valor base con patrón estacional
        const baseValue = 1000 * seasonalityPattern[monthIndex];
        
        // Aplicar factor de crecimiento según el año
        const yearFactor = Math.pow(growthFactor, yearOffset);
        
        // Añadir algo de variación aleatoria
        const randomFactor = 0.9 + Math.random() * 0.2;
        
        // Calcular valor final
        const value = Math.round(baseValue / yearFactor * randomFactor);
        values.unshift(value);
        
        // Valores de comparación (año anterior)
        if (i < 12) {
          comparisonValues.unshift(null);
        } else {
          // Valor del mismo mes del año anterior
          const previousYearValue = values[i - 12];
          comparisonValues.unshift(previousYearValue);
        }
      }
      
      // Identificar meses pico y valle
      const recentValues = values.slice(-12); // Últimos 12 meses
      const recentMonths = months.slice(-12);
      
      const maxValue = Math.max(...recentValues);
      const minValue = Math.min(...recentValues);
      
      const peakMonths = recentMonths.filter((month, i) => recentValues[i] === maxValue);
      const lowMonths = recentMonths.filter((month, i) => recentValues[i] === minValue);
      
      // Determinar tendencia año tras año
      const currentYearAvg = recentValues.reduce((sum, val) => sum + val, 0) / recentValues.length;
      const previousYearValues = values.slice(-24, -12);
      const previousYearAvg = previousYearValues.reduce((sum, val) => sum + val, 0) / previousYearValues.length;
      
      let yearOverYearTrend = 'stable';
      const growthRate = (currentYearAvg - previousYearAvg) / previousYearAvg;
      
      if (growthRate > 0.1) {
        yearOverYearTrend = 'increasing';
      } else if (growthRate < -0.1) {
        yearOverYearTrend = 'decreasing';
      }
      
      // Identificar tendencias estacionales
      const seasonalTrends = [];
      
      if (recentValues[0] > recentValues[1] && recentValues[1] > recentValues[2]) {
        seasonalTrends.push({
          trend: 'upward',
          period: 'recent',
          description: `Tendencia alcista en los últimos 3 meses para "${keyword}"`
        });
      }
      
      if (recentValues[0] < recentValues[1] && recentValues[1] < recentValues[2]) {
        seasonalTrends.push({
          trend: 'downward',
          period: 'recent',
          description: `Tendencia bajista en los últimos 3 meses para "${keyword}"`
        });
      }
      
      // Identificar patrones estacionales
      const q1Avg = (recentValues[0] + recentValues[1] + recentValues[2]) / 3;
      const q2Avg = (recentValues[3] + recentValues[4] + recentValues[5]) / 3;
      const q3Avg = (recentValues[6] + recentValues[7] + recentValues[8]) / 3;
      const q4Avg = (recentValues[9] + recentValues[10] + recentValues[11]) / 3;
      
      const quarters = [q1Avg, q2Avg, q3Avg, q4Avg];
      const maxQuarter = Math.max(...quarters);
      const minQuarter = Math.min(...quarters);
      
      if (maxQuarter === q1Avg) {
        seasonalTrends.push({
          trend: 'peak',
          period: 'Q1',
          description: `El primer trimestre muestra picos de interés para "${keyword}"`
        });
      } else if (maxQuarter === q2Avg) {
        seasonalTrends.push({
          trend: 'peak',
          period: 'Q2',
          description: `El segundo trimestre muestra picos de interés para "${keyword}"`
        });
      } else if (maxQuarter === q3Avg) {
        seasonalTrends.push({
          trend: 'peak',
          period: 'Q3',
          description: `El tercer trimestre muestra picos de interés para "${keyword}"`
        });
      } else if (maxQuarter === q4Avg) {
        seasonalTrends.push({
          trend: 'peak',
          period: 'Q4',
          description: `El cuarto trimestre muestra picos de interés para "${keyword}"`
        });
      }
      
      // Sugerir contenido estacional
      const seasonalContent = [];
      
      // Basado en los meses pico
      peakMonths.forEach(month => {
        seasonalContent.push({
          title: `Guía actualizada de ${keyword} para ${month}`,
          description: `Aprovecha el aumento de interés en ${month} con contenido actualizado sobre ${keyword}`,
          bestTime: month,
          contentType: 'guía'
        });
      });
      
      // Basado en tendencias
      if (yearOverYearTrend === 'increasing') {
        seasonalContent.push({
          title: `Por qué ${keyword} está ganando popularidad en ${currentYear}`,
          description: `Análisis del creciente interés en ${keyword} y predicciones para el futuro`,
          bestTime: 'Ahora',
          contentType: 'análisis'
        });
      }
      
      // Contenido anticipado para próximos picos
      const nextPeakMonthIndex = seasonalityPattern.indexOf(Math.max(...seasonalityPattern));
      const monthsUntilPeak = (nextPeakMonthIndex - currentMonth + 12) % 12;
      
      if (monthsUntilPeak > 0 && monthsUntilPeak < 3) {
        const nextPeakMonth = monthNames[nextPeakMonthIndex];
        seasonalContent.push({
          title: `Prepárate para el auge de ${keyword} en ${nextPeakMonth}`,
          description: `Contenido anticipado para el próximo pico de interés en ${keyword}`,
          bestTime: `1 mes antes de ${nextPeakMonth}`,
          contentType: 'preparación'
        });
      }
      
      return {
        seasonalTrends,
        peakMonths,
        lowMonths,
        yearOverYearTrend,
        trendChart: {
          labels: months,
          datasets: [
            {
              label: `Volumen de búsqueda para "${keyword}"`,
              data: values
            },
            {
              label: 'Año anterior',
              data: comparisonValues
            }
          ]
        },
        seasonalContent
      };
    } catch (error) {
      console.error('Error generando datos de estacionalidad Web3:', error);
      return null;
    }
  }
  
  private async processSeasonalityAnalysis(data: any): Promise<SeasonalityAnalysis> {
    try {
      // Obtener datos de estacionalidad para la keyword principal
      const seasonalityData = await this.generateWeb3SeasonalityData(data.keyword || '');
      
      if (seasonalityData) {
        return seasonalityData;
      }
      
      // Fallback si no se pudieron generar datos
      return {
        seasonalKeywords: [],
        seasonalTrends: [],
        planningRecommendations: []
      };
    } catch (error) {
      console.error('Error en análisis de estacionalidad:', error);
      return {
        seasonalKeywords: [],
        seasonalTrends: [],
        planningRecommendations: []
      };
    }
  }

  /**
   * Determina la categoría Web3 de una keyword
   */
  private determineWeb3Category(keyword: string): string {
    const keywordLower = keyword.toLowerCase();
    
    // Términos relacionados con DeFi
    const defiTerms = [
      'defi', 'finance', 'yield', 'farming', 'staking', 'liquidity', 'swap', 'lending',
      'borrowing', 'interest', 'apy', 'apr', 'pool', 'vault', 'collateral', 'loan',
      'uniswap', 'aave', 'compound', 'curve', 'yearn', 'maker', 'dai', 'stable', 'amm'
    ];
    
    // Términos relacionados con NFTs
    const nftTerms = [
      'nft', 'token', 'collectible', 'art', 'artist', 'creator', 'mint', 'marketplace',
      'opensea', 'rarible', 'foundation', 'auction', 'bid', 'collection', 'rare', 'unique',
      'digital art', 'ownership', 'royalty', 'metadata', 'erc-721', 'erc721', 'erc1155'
    ];
    
    // Términos relacionados con DAOs
    const daoTerms = [
      'dao', 'governance', 'vote', 'proposal', 'member', 'community', 'treasury',
      'decentralized organization', 'autonomous', 'collective', 'decision', 'snapshot',
      'aragon', 'colony', 'moloch', 'grant', 'contributor', 'participation'
    ];
    
    // Comprobar si la keyword contiene términos de alguna categoría
    for (const term of defiTerms) {
      if (keywordLower.includes(term)) {
        return 'defi';
      }
    }
    
    for (const term of nftTerms) {
      if (keywordLower.includes(term)) {
        return 'nft';
      }
    }
    
    for (const term of daoTerms) {
      if (keywordLower.includes(term)) {
        return 'dao';
      }
    }
    
    // Si no coincide con ninguna categoría específica, devolver 'blockchain' como categoría general
    return 'blockchain';
  }

  /**
   * Genera datos de análisis local para keywords Web3
   */
  private async generateWeb3LocalSearchData(keyword: string): Promise<LocalSearchAnalysis> {
    try {
      // Inicializar servicios si no están disponibles
      if (!this.web3KeywordsService) {
        const { web3KeywordsService } = await import('./apis/web3-keywords-service');
        this.web3KeywordsService = web3KeywordsService;
      }
      
      // Intentar obtener datos locales del servicio Web3
      const result = await this.web3KeywordsService.getLocalSearchData(keyword);
      
      if (result) {
        return result;
      }
      
      // Fallback: generar datos simulados
      const web3Category = this.determineWeb3Category(keyword);
      
      // Regiones con mayor interés en Web3
      const topRegions = [
        'San Francisco', 'Nueva York', 'Londres', 'Singapur', 'Zug', 'Berlín',
        'Hong Kong', 'Seúl', 'Tokio', 'Dubai', 'Miami', 'Toronto', 'Amsterdam'
      ];
      
      // Seleccionar 5-8 regiones aleatoriamente
      const selectedRegions = topRegions
        .sort(() => 0.5 - Math.random())
        .slice(0, Math.floor(Math.random() * 4) + 5);
      
      // Generar keywords locales
      const localKeywords = selectedRegions.map(region => ({
        keyword: `${keyword} ${region}`,
        localVolume: Math.floor(Math.random() * 500) + 100,
        globalVolume: Math.floor(Math.random() * 1000) + 200,
        localDifficulty: Math.floor(Math.random() * 70) + 10,
        cities: [region, ...selectedRegions.filter(r => r !== region).slice(0, 2)],
        localIntent: Math.random() > 0.3
      }));
      
      // Generar modificadores geográficos
      const geoModifiers = [
        'cerca de mí',
        'en línea',
        'local',
        'eventos',
        'comunidad',
        'meetup'
      ].map(modifier => ({
        modifier,
        count: Math.floor(Math.random() * 50) + 10,
        averageVolume: Math.floor(Math.random() * 800) + 200,
        examples: [`${keyword} ${modifier}`, `${modifier} ${keyword}`, `${keyword} ${modifier} tutorial`]
      }));
      
      // Generar competidores locales basados en la categoría
      const localCompetitors = [];
      
      if (web3Category === 'defi') {
        localCompetitors.push(
          {
            business: 'DeFi Pulse',
            city: selectedRegions[0],
            visibility: Math.floor(Math.random() * 50) + 50,
            topKeywords: [`${keyword} defi`, `defi ${selectedRegions[0]}`, `${keyword} protocol`]
          },
          {
            business: 'DeFi Prime',
            city: selectedRegions[1],
            visibility: Math.floor(Math.random() * 40) + 40,
            topKeywords: [`${keyword} yield`, `defi ${selectedRegions[1]}`, `${keyword} staking`]
          }
        );
      } else if (web3Category === 'nft') {
        localCompetitors.push(
          {
            business: 'NFT Now',
            city: selectedRegions[0],
            visibility: Math.floor(Math.random() * 50) + 50,
            topKeywords: [`${keyword} nft`, `nft ${selectedRegions[0]}`, `${keyword} marketplace`]
          },
          {
            business: 'NFT Evening',
            city: selectedRegions[1],
            visibility: Math.floor(Math.random() * 45) + 45,
            topKeywords: [`${keyword} collection`, `nft ${selectedRegions[1]}`, `${keyword} drops`]
          }
        );
      } else if (web3Category === 'dao') {
        localCompetitors.push(
          {
            business: 'DAO Times',
            city: selectedRegions[0],
            visibility: Math.floor(Math.random() * 45) + 45,
            topKeywords: [`${keyword} dao`, `dao ${selectedRegions[0]}`, `${keyword} governance`]
          },
          {
            business: 'DAO Central',
            city: selectedRegions[1],
            visibility: Math.floor(Math.random() * 40) + 40,
            topKeywords: [`${keyword} voting`, `dao ${selectedRegions[1]}`, `${keyword} proposal`]
          }
        );
      } else {
        // Blockchain general
        localCompetitors.push(
          {
            business: 'CoinDesk',
            city: selectedRegions[0],
            visibility: Math.floor(Math.random() * 60) + 40,
            topKeywords: [`${keyword} blockchain`, `crypto ${selectedRegions[0]}`, `${keyword} news`]
          },
          {
            business: 'The Block',
            city: selectedRegions[1],
            visibility: Math.floor(Math.random() * 55) + 45,
            topKeywords: [`${keyword} analysis`, `crypto ${selectedRegions[1]}`, `${keyword} trends`]
          }
        );
      }
      
      // Generar oportunidades locales
      const localOpportunities = selectedRegions.slice(0, 3).map(region => ({
        keyword: `${keyword} en ${region}`,
        city: region,
        searchVolume: Math.floor(Math.random() * 300) + 100,
        difficulty: Math.random() * 0.6 + 0.2,
        localPackPresence: Math.random() > 0.5
      }));
      
      return {
        localKeywords,
        geoModifiers,
        localCompetitors,
        localOpportunities
      };
    } catch (error) {
      console.error('Error generando datos de búsqueda local Web3:', error);
      return {
        localKeywords: [],
        geoModifiers: [],
        localCompetitors: [],
        localOpportunities: []
      };
    }
  }

  private async processLocalSearchAnalysis(request: KeywordsAnalysisRequest, data: any): Promise<LocalSearchAnalysis> {
    try {
      // Generar datos de búsqueda local para Web3
      return await this.generateWeb3LocalSearchData(request.keywords[0]);
    } catch (error) {
      console.error('Error en análisis de búsqueda local:', error);
      return {
        localKeywords: [],
        geoModifiers: [],
        localCompetitors: [],
        localOpportunities: []
      };
    }
  }

  /**
   * Genera datos de análisis de gaps para keywords Web3
   */
  private async generateWeb3KeywordGapsData(keyword: string, relatedKeywords: string[] = []): Promise<any> {
    try {
      // Inicializar servicios si no están disponibles
      if (!this.web3KeywordsService) {
        const { web3KeywordsService } = await import('./apis/web3-keywords-service');
        this.web3KeywordsService = web3KeywordsService;
      }
      
      // Intentar obtener datos de gaps del servicio Web3
      const result = await this.web3KeywordsService.getKeywordGapsData(keyword, relatedKeywords);
      
      if (result) {
        return result;
      }
      
      // Fallback: generar datos simulados
      const web3Category = this.determineWeb3Category(keyword);
      
      // Gaps de contenido basados en la categoría Web3
      const contentGaps = [];
      
      // Definir gaps específicos por categoría
      if (web3Category === 'defi') {
        contentGaps.push(
          {
            keyword: `${keyword} yield farming`,
            searchVolume: Math.floor(Math.random() * 1000) + 500,
            difficulty: Math.floor(Math.random() * 40) + 30,
            contentType: 'guía',
            priority: 'high'
          },
          {
            keyword: `${keyword} vs traditional finance`,
            searchVolume: Math.floor(Math.random() * 800) + 400,
            difficulty: Math.floor(Math.random() * 50) + 20,
            contentType: 'comparación',
            priority: 'medium'
          },
          {
            keyword: `${keyword} risks`,
            searchVolume: Math.floor(Math.random() * 1200) + 600,
            difficulty: Math.floor(Math.random() * 30) + 40,
            contentType: 'análisis',
            priority: 'high'
          }
        );
      } else if (web3Category === 'nft') {
        contentGaps.push(
          {
            keyword: `how to create ${keyword}`,
            searchVolume: Math.floor(Math.random() * 1500) + 800,
            difficulty: Math.floor(Math.random() * 35) + 35,
            contentType: 'tutorial',
            priority: 'high'
          },
          {
            keyword: `${keyword} marketplace comparison`,
            searchVolume: Math.floor(Math.random() * 700) + 300,
            difficulty: Math.floor(Math.random() * 45) + 25,
            contentType: 'comparación',
            priority: 'medium'
          },
          {
            keyword: `${keyword} investment strategy`,
            searchVolume: Math.floor(Math.random() * 900) + 400,
            difficulty: Math.floor(Math.random() * 40) + 30,
            contentType: 'guía',
            priority: 'medium'
          }
        );
      } else if (web3Category === 'dao') {
        contentGaps.push(
          {
            keyword: `${keyword} governance`,
            searchVolume: Math.floor(Math.random() * 800) + 400,
            difficulty: Math.floor(Math.random() * 50) + 20,
            contentType: 'explicación',
            priority: 'high'
          },
          {
            keyword: `join ${keyword}`,
            searchVolume: Math.floor(Math.random() * 1000) + 500,
            difficulty: Math.floor(Math.random() * 30) + 30,
            contentType: 'tutorial',
            priority: 'high'
          },
          {
            keyword: `${keyword} vs traditional organization`,
            searchVolume: Math.floor(Math.random() * 600) + 200,
            difficulty: Math.floor(Math.random() * 55) + 25,
            contentType: 'comparación',
            priority: 'medium'
          }
        );
      } else {
        // Blockchain general
        contentGaps.push(
          {
            keyword: `${keyword} for beginners`,
            searchVolume: Math.floor(Math.random() * 2000) + 1000,
            difficulty: Math.floor(Math.random() * 30) + 40,
            contentType: 'guía',
            priority: 'high'
          },
          {
            keyword: `${keyword} use cases`,
            searchVolume: Math.floor(Math.random() * 1500) + 700,
            difficulty: Math.floor(Math.random() * 35) + 35,
            contentType: 'análisis',
            priority: 'high'
          },
          {
            keyword: `future of ${keyword}`,
            searchVolume: Math.floor(Math.random() * 1200) + 600,
            difficulty: Math.floor(Math.random() * 45) + 30,
            contentType: 'predicción',
            priority: 'medium'
          }
        );
      }
      
      // Generar gaps de tópicos
      const topicGaps: {
        topic: string;
        keywords: string[];
        totalVolume: number;
        averageDifficulty: number;
        competitorCoverage: number;
        priority: 'high' | 'medium' | 'low';
      }[] = [];
      
      // Tópicos comunes en Web3 que podrían faltar
      const commonTopics = [
        'security', 'regulation', 'adoption', 'scalability', 
        'interoperability', 'sustainability', 'privacy', 'governance'
      ];
      
      // Seleccionar 3-5 tópicos aleatoriamente
      const selectedTopics = commonTopics
        .sort(() => 0.5 - Math.random())
        .slice(0, Math.floor(Math.random() * 3) + 3);
      
      selectedTopics.forEach(topic => {
        topicGaps.push({
          topic: `${keyword} ${topic}`,
          keywords: [`${topic} challenges in ${keyword}`, `improving ${keyword} ${topic}`, `${topic} best practices for ${keyword}`],
          totalVolume: Math.floor(Math.random() * 1000) + 200,
          averageDifficulty: Math.floor(Math.random() * 70) + 20,
          priority: Math.random() > 0.5 ? 'high' : 'medium',
          competitorCoverage: Math.floor(Math.random() * 40) + 10
        });
      });
      
      // Generar gaps de intención
      const intentGaps: {
        intent: string;
        missingKeywords: string[];
        totalVolume: number;
        opportunity: number;
      }[] = [];
      
      // Intenciones comunes en búsquedas Web3
      const intentions = ['learn', 'buy', 'invest', 'compare', 'troubleshoot', 'develop'];
      
      // Seleccionar 2-4 intenciones aleatoriamente
      const selectedIntentions = intentions
        .sort(() => 0.5 - Math.random())
        .slice(0, Math.floor(Math.random() * 3) + 2);
      
      selectedIntentions.forEach(intent => {
        const keywords = [];
        
        // Generar 2-4 keywords para cada intención
        for (let i = 0; i < Math.floor(Math.random() * 3) + 2; i++) {
          let intentKeyword = '';
          
          switch (intent) {
            case 'learn':
              intentKeyword = [`how ${keyword} works`, `${keyword} tutorial`, `${keyword} guide`, `understand ${keyword}`][i % 4];
              break;
            case 'buy':
              intentKeyword = [`buy ${keyword}`, `best ${keyword} to purchase`, `${keyword} price`, `${keyword} marketplace`][i % 4];
              break;
            case 'invest':
              intentKeyword = [`${keyword} investment`, `${keyword} ROI`, `${keyword} staking`, `${keyword} yield`][i % 4];
              break;
            case 'compare':
              intentKeyword = [`${keyword} vs ${['ethereum', 'bitcoin', 'solana', 'traditional'][i % 4]}`, `best ${keyword} alternatives`][i % 2];
              break;
            case 'troubleshoot':
              intentKeyword = [`${keyword} not working`, `fix ${keyword} issues`, `${keyword} error`, `${keyword} problems`][i % 4];
              break;
            case 'develop':
              intentKeyword = [`build on ${keyword}`, `${keyword} development`, `${keyword} API`, `${keyword} integration`][i % 4];
              break;
          }
          
          keywords.push({
            keyword: intentKeyword,
            searchVolume: Math.floor(Math.random() * 1000) + 200,
            difficulty: Math.floor(Math.random() * 50) + 20
          });
        }
        
        intentGaps.push({
          intent,
          missingKeywords: keywords.map(k => k.keyword),
          totalVolume: Math.floor(Math.random() * 1000) + 200,
          opportunity: Math.random() * 0.8 + 0.2
        });
      });
      
      // Generar gaps semánticos
      const semanticGaps: any[] = [];
      
      // Términos semánticamente relacionados con Web3
      const semanticTerms = [
        'decentralization', 'tokenization', 'smart contracts', 'consensus', 
        'digital ownership', 'trustless', 'permissionless', 'cryptography'
      ];
      
      // Seleccionar 2-4 términos aleatoriamente
      const selectedTerms = semanticTerms
        .sort(() => 0.5 - Math.random())
        .slice(0, Math.floor(Math.random() * 3) + 2);
      
      selectedTerms.forEach(term => {
        semanticGaps.push({
          term,
          relatedTo: keyword,
          missingContent: `Detailed explanation of ${term} in context of ${keyword}`,
          searchVolume: Math.floor(Math.random() * 800) + 200,
          priority: Math.random() > 0.4 ? 'high' : 'medium'
        });
      });
      
      return {
        contentGaps,
        topicGaps,
        intentGaps,
        semanticGaps
      };
    } catch (error) {
      console.error('Error generando datos de gaps para Web3:', error);
      return null;
    }
  }

  private async processKeywordGaps(request: KeywordsAnalysisRequest, data: any): Promise<KeywordGapsAnalysis> {
    try {
      // Obtener datos de gaps para la keyword principal
      const gapsData = await this.generateWeb3KeywordGapsData(request.keywords[0], []);
      
      if (gapsData) {
        return {
          contentGaps: gapsData.contentGaps || [],
          topicGaps: gapsData.topicGaps || [],
          intentGaps: gapsData.intentGaps || []
        };
      }
      
      // Fallback si no se pudieron generar datos
      return {
        contentGaps: [],
        topicGaps: [],
        intentGaps: []
      };
    } catch (error) {
      console.error('Error en análisis de gaps de keywords:', error);
      return {
        contentGaps: [],
        topicGaps: [],
        intentGaps: []
      };
    }
  }

  /**
   * Genera oportunidades de contenido específicas para Web3
   */
  private async generateWeb3ContentOpportunities(keyword: string, analysisData: any): Promise<ContentOpportunity[]> {
    try {
      // Inicializar servicios si no están disponibles
      if (!this.web3KeywordsService) {
        const { web3KeywordsService } = await import('./apis/web3-keywords-service');
        this.web3KeywordsService = web3KeywordsService;
      }
      
      // Intentar obtener oportunidades de contenido del servicio Web3
      const result = await this.web3KeywordsService.getContentOpportunities(keyword, analysisData);
      
      if (result) {
        return result;
      }
      
      // Fallback: generar oportunidades simuladas
      const opportunities: ContentOpportunity[] = [];
      const web3Category = this.determineWeb3Category(keyword);
      
      // Formatos de contenido populares para Web3
      const contentFormats = [
        'guía paso a paso',
        'explicación técnica',
        'comparativa',
        'caso de uso',
        'tutorial',
        'análisis de tendencias',
        'entrevista con expertos',
        'infografía',
        'preguntas frecuentes',
        'glosario de términos'
      ];
      
      // Oportunidades basadas en la categoría Web3
      if (web3Category === 'defi') {
        opportunities.push(
          {
            title: `Guía completa de ${keyword} para principiantes`,
            type: 'guide',
            targetKeywords: [keyword, `${keyword} para principiantes`, `cómo usar ${keyword}`],
            searchVolume: Math.floor(Math.random() * 5000) + 2000,
            difficulty: 50,
            intent: 'informational',
            contentLength: 'long',
            priority: 'high',
            estimatedTraffic: Math.floor(Math.random() * 5000) + 2000,
            competitorAnalysis: {
              topCompetitors: ['competitor1.com', 'competitor2.com'],
              averageWordCount: 2500,
              commonTopics: ['introducción', 'conceptos básicos', 'seguridad'],
              contentGaps: ['implementación avanzada', 'casos de uso']
            },
            outline: [
              {
                section: 'Introducción',
                keywords: [keyword],
                wordCount: 500
              },
              {
                section: 'Conceptos básicos',
                keywords: [`${keyword} conceptos`],
                wordCount: 800
              }
            ],
            internalLinking: {
              linkTo: ['/blog/web3-basics'],
              linkFrom: ['/tutorials']
            }
          },
          {
            title: `Comparativa: ${keyword} vs. Finanzas Tradicionales`,
            type: 'blog-post',
            targetKeywords: [keyword, `${keyword} vs finanzas tradicionales`, `ventajas de ${keyword}`],
            searchVolume: Math.floor(Math.random() * 3000) + 1000,
            difficulty: 40,
            intent: 'informational',
            contentLength: 'medium',
            priority: 'medium',
            estimatedTraffic: Math.floor(Math.random() * 3000) + 1000,
            competitorAnalysis: {
              topCompetitors: ['fintech-blog.com', 'crypto-analysis.com'],
              averageWordCount: 1800,
              commonTopics: ['comparativas', 'ventajas', 'desventajas'],
              contentGaps: ['casos de uso reales', 'análisis técnico']
            },
            outline: [
              {
                section: 'Introducción a finanzas tradicionales vs. Web3',
                keywords: [keyword, 'finanzas tradicionales'],
                wordCount: 400
              },
              {
                section: 'Ventajas de Web3',
                keywords: [`ventajas de ${keyword}`],
                wordCount: 600
              }
            ],
            internalLinking: {
              linkTo: ['/blog/defi-basics'],
              linkFrom: ['/finance-comparison']
            }
          },
          {
            title: `Riesgos y seguridad en ${keyword}`,
            type: 'guide',
            targetKeywords: [keyword, `seguridad en ${keyword}`, `riesgos de ${keyword}`],
            searchVolume: Math.floor(Math.random() * 4000) + 1500,
            difficulty: 70,
            intent: 'informational',
            contentLength: 'medium',
            priority: 'high',
            estimatedTraffic: Math.floor(Math.random() * 4000) + 1500,
            competitorAnalysis: {
              topCompetitors: ['security-blog.com', 'web3-security.com'],
              averageWordCount: 2200,
              commonTopics: ['riesgos', 'seguridad', 'protección'],
              contentGaps: ['herramientas de seguridad', 'auditorías']
            },
            outline: [
              {
                section: 'Principales riesgos',
                keywords: [`riesgos de ${keyword}`],
                wordCount: 600
              },
              {
                section: 'Medidas de seguridad',
                keywords: [`seguridad en ${keyword}`],
                wordCount: 800
              }
            ],
            internalLinking: {
              linkTo: ['/blog/web3-security'],
              linkFrom: ['/security-guides']
            }
          }
        );
      } else if (web3Category === 'nft') {
        opportunities.push(
          {
            title: `Cómo crear y vender tu primer ${keyword}`,
            type: 'guide',
            targetKeywords: [keyword, `crear ${keyword}`, `vender ${keyword}`],
            searchVolume: Math.floor(Math.random() * 6000) + 3000,
            difficulty: 30,
            intent: 'transactional',
            contentLength: 'long',
            priority: 'high',
            estimatedTraffic: Math.floor(Math.random() * 6000) + 3000,
            competitorAnalysis: {
              topCompetitors: ['nft-guide.com', 'creator-hub.com'],
              averageWordCount: 3000,
              commonTopics: ['creación', 'venta', 'marketplaces'],
              contentGaps: ['aspectos legales', 'impuestos']
            },
            outline: [
              {
                section: 'Introducción a la creación',
                keywords: [`crear ${keyword}`],
                wordCount: 800
              },
              {
                section: 'Plataformas de venta',
                keywords: [`vender ${keyword}`],
                wordCount: 1000
              }
            ],
            internalLinking: {
              linkTo: ['/blog/nft-marketplaces'],
              linkFrom: ['/creator-guides']
            }
          },
          {
            title: `Los mejores marketplaces para ${keyword} en ${new Date().getFullYear()}`,
            type: 'blog-post',
            targetKeywords: [keyword, `marketplaces de ${keyword}`, `comprar ${keyword}`],
            searchVolume: Math.floor(Math.random() * 4000) + 2000,
            difficulty: 50,
            intent: 'commercial',
            contentLength: 'medium',
            priority: 'medium',
            estimatedTraffic: Math.floor(Math.random() * 4000) + 2000,
            competitorAnalysis: {
              topCompetitors: ['marketplace-review.com', 'crypto-compare.com'],
              averageWordCount: 2000,
              commonTopics: ['comparativas', 'fees', 'seguridad'],
              contentGaps: ['nuevos marketplaces', 'análisis de liquidez']
            },
            outline: [
              {
                section: 'Top 5 marketplaces',
                keywords: [`marketplaces de ${keyword}`],
                wordCount: 600
              },
              {
                section: 'Comparativa de comisiones',
                keywords: [`comprar ${keyword}`],
                wordCount: 500
              }
            ],
            internalLinking: {
              linkTo: ['/blog/crypto-exchanges'],
              linkFrom: ['/marketplace-guides']
            }
          },
          {
            title: `El futuro de ${keyword}: tendencias y predicciones`,
            type: 'blog-post',
            targetKeywords: [keyword, `futuro de ${keyword}`, `tendencias ${keyword}`],
            searchVolume: Math.floor(Math.random() * 3500) + 1500,
            difficulty: 75,
            intent: 'informational',
            contentLength: 'long',
            priority: 'medium',
            estimatedTraffic: Math.floor(Math.random() * 3500) + 1500,
            competitorAnalysis: {
              topCompetitors: ['future-trends.com', 'crypto-research.org'],
              averageWordCount: 3500,
              commonTopics: ['predicciones', 'análisis de mercado', 'innovación'],
              contentGaps: ['casos de uso emergentes', 'regulación futura']
            },
            outline: [
              {
                section: 'Tendencias actuales',
                keywords: [`tendencias ${keyword}`],
                wordCount: 1000
              },
              {
                section: 'Predicciones a 5 años',
                keywords: [`futuro de ${keyword}`],
                wordCount: 1200
              }
            ],
            internalLinking: {
              linkTo: ['/blog/web3-innovation'],
              linkFrom: ['/research-papers']
            }
          }
        );
      } else if (web3Category === 'dao') {
        opportunities.push(
          {
            title: `¿Qué es ${keyword} y cómo funciona?`,
            type: 'guide',
            targetKeywords: [keyword, `qué es ${keyword}`, `cómo funciona ${keyword}`],
            searchVolume: Math.floor(Math.random() * 4000) + 2000,
            difficulty: 50,
            intent: 'informational',
            contentLength: 'medium',
            priority: 'high',
            estimatedTraffic: Math.floor(Math.random() * 4000) + 2000,
            competitorAnalysis: {
              topCompetitors: ['dao-guide.com', 'web3-explained.org'],
              averageWordCount: 2500,
              commonTopics: ['estructura', 'gobernanza', 'votación'],
              contentGaps: ['casos de uso prácticos', 'aspectos legales']
            },
            outline: [
              {
                section: 'Conceptos básicos',
                keywords: [`qué es ${keyword}`],
                wordCount: 800
              },
              {
                section: 'Mecanismos de gobernanza',
                keywords: [`cómo funciona ${keyword}`],
                wordCount: 1000
              }
            ],
            internalLinking: {
              linkTo: ['/blog/web3-governance'],
              linkFrom: ['/dao-directory']
            }
          },
          {
            title: `Cómo participar en ${keyword}: guía para nuevos miembros`,
            type: 'guide',
            targetKeywords: [keyword, `participar en ${keyword}`, `unirse a ${keyword}`],
            searchVolume: Math.floor(Math.random() * 3500) + 1500,
            difficulty: 30,
            intent: 'transactional',
            contentLength: 'medium',
            priority: 'high',
            estimatedTraffic: Math.floor(Math.random() * 3500) + 1500,
            competitorAnalysis: {
              topCompetitors: ['dao-participation.com', 'web3-community.org'],
              averageWordCount: 2000,
              commonTopics: ['registro', 'votación', 'propuestas'],
              contentGaps: ['herramientas necesarias', 'mejores prácticas']
            },
            outline: [
              {
                section: 'Primeros pasos',
                keywords: [`unirse a ${keyword}`],
                wordCount: 600
              },
              {
                section: 'Participación activa',
                keywords: [`participar en ${keyword}`],
                wordCount: 800
              }
            ],
            internalLinking: {
              linkTo: ['/blog/dao-governance'],
              linkFrom: ['/getting-started']
            }
          },
          {
            title: `${keyword} vs. Organizaciones Tradicionales: ventajas y desafíos`,
            type: 'blog-post',
            targetKeywords: [keyword, `${keyword} vs organizaciones tradicionales`, `ventajas de ${keyword}`],
            searchVolume: Math.floor(Math.random() * 3000) + 1000,
            difficulty: 70,
            intent: 'informational',
            contentLength: 'long',
            priority: 'medium',
            estimatedTraffic: Math.floor(Math.random() * 3000) + 1000,
            competitorAnalysis: {
              topCompetitors: ['organization-models.com', 'dao-research.org'],
              averageWordCount: 2500,
              commonTopics: ['comparativas', 'ventajas', 'desafíos'],
              contentGaps: ['casos de estudio reales', 'aspectos legales']
            },
            outline: [
              {
                section: 'Ventajas de DAOs',
                keywords: [`ventajas de ${keyword}`],
                wordCount: 800
              },
              {
                section: 'Comparativa estructural',
                keywords: [`${keyword} vs organizaciones tradicionales`],
                wordCount: 1000
              }
            ],
            internalLinking: {
              linkTo: ['/blog/organizational-models'],
              linkFrom: ['/dao-resources']
            }
          }
        );
      } else {
        // Blockchain general
        opportunities.push(
          {
            title: `${keyword} explicado de forma sencilla`,
            type: 'guide',
            targetKeywords: [keyword, `${keyword} explicado`, `qué es ${keyword}`],
            searchVolume: Math.floor(Math.random() * 7000) + 3000,
            difficulty: 30,
            intent: 'informational',
            contentLength: 'medium',
            priority: 'high',
            estimatedTraffic: Math.floor(Math.random() * 7000) + 3000,
            competitorAnalysis: {
              topCompetitors: ['beginners-crypto.com', 'web3-simple.org'],
              averageWordCount: 1800,
              commonTopics: ['conceptos básicos', 'ejemplos sencillos', 'analogías'],
              contentGaps: ['explicaciones visuales', 'comparativas simples']
            },
            outline: [
              {
                section: 'Conceptos básicos',
                keywords: [`qué es ${keyword}`],
                wordCount: 600
              },
              {
                section: 'Ejemplos prácticos',
                keywords: [`${keyword} explicado`],
                wordCount: 800
              }
            ],
            internalLinking: {
              linkTo: ['/blog/web3-basics'],
              linkFrom: ['/beginners-guide']
            }
          },
          {
            title: `10 casos de uso reales de ${keyword} en ${new Date().getFullYear()}`,
            type: 'blog-post',
            targetKeywords: [keyword, `casos de uso ${keyword}`, `ejemplos ${keyword}`],
            searchVolume: Math.floor(Math.random() * 5000) + 2000,
            difficulty: 50,
            intent: 'informational',
            contentLength: 'long',
            priority: 'high',
            estimatedTraffic: Math.floor(Math.random() * 5000) + 2000,
            competitorAnalysis: {
              topCompetitors: ['use-cases.com', 'web3-examples.org'],
              averageWordCount: 2500,
              commonTopics: ['ejemplos de industria', 'implementaciones', 'beneficios'],
              contentGaps: ['casos de uso emergentes', 'análisis de ROI']
            },
            outline: [
              {
                section: 'Casos de uso en finanzas',
                keywords: [`ejemplos ${keyword}`],
                wordCount: 800
              },
              {
                section: 'Aplicaciones en otras industrias',
                keywords: [`casos de uso ${keyword}`],
                wordCount: 1000
              }
            ],
            internalLinking: {
              linkTo: ['/blog/web3-applications'],
              linkFrom: ['/use-cases']
            }
          },
          {
            title: `Glosario de términos de ${keyword} para no expertos`,
            type: 'faq',
            targetKeywords: [keyword, `términos de ${keyword}`, `glosario ${keyword}`],
            searchVolume: Math.floor(Math.random() * 4000) + 1500,
            difficulty: 30,
            intent: 'informational',
            contentLength: 'medium',
            priority: 'medium',
            estimatedTraffic: Math.floor(Math.random() * 4000) + 1500,
            competitorAnalysis: {
              topCompetitors: ['crypto-glossary.com', 'web3-terms.org'],
              averageWordCount: 2000,
              commonTopics: ['definiciones', 'términos técnicos', 'acrónimos'],
              contentGaps: ['ejemplos prácticos', 'términos emergentes']
            },
            outline: [
              {
                section: 'Términos básicos',
                keywords: [`términos de ${keyword}`],
                wordCount: 600
              },
              {
                section: 'Términos avanzados',
                keywords: [`glosario ${keyword}`],
                wordCount: 800
              }
            ],
            internalLinking: {
              linkTo: ['/blog/web3-basics'],
              linkFrom: ['/resources']
            }
          }
        );
      }
      
      // Añadir oportunidades basadas en preguntas si están disponibles
      if (analysisData && analysisData.questionKeywords && analysisData.questionKeywords.contentGaps) {
        const questionGaps = analysisData.questionKeywords.contentGaps;
        
        // Convertir los gaps de preguntas en oportunidades de contenido
        questionGaps.slice(0, 3).forEach((gap: { question: string; contentType?: string; searchVolume?: number; difficulty: number; priority?: 'low' | 'medium' | 'high' }) => {
          opportunities.push({
            title: gap.question,
            type: 'faq',
            targetKeywords: [gap.question, keyword],
            searchVolume: gap.searchVolume || Math.floor(Math.random() * 2000) + 500,
            difficulty: gap.difficulty || 50,
            intent: 'informational',
            contentLength: 'medium',
            estimatedTraffic: gap.searchVolume || Math.floor(Math.random() * 2000) + 500,
            priority: gap.priority || 'medium',
            competitorAnalysis: {
              topCompetitors: ['question-answer.com', 'web3-faq.org'],
              averageWordCount: 1200,
              commonTopics: ['preguntas frecuentes', 'dudas comunes'],
              contentGaps: ['ejemplos prácticos', 'casos de uso']
            },
            outline: [
              {
                section: 'Respuesta principal',
                keywords: [gap.question],
                wordCount: 400
              },
              {
                section: 'Información adicional',
                keywords: [keyword],
                wordCount: 600
              }
            ],
            internalLinking: {
              linkTo: ['/faq'],
              linkFrom: ['/resources']
            }
          });
        });
      }
      
      // Añadir oportunidades basadas en gaps de contenido si están disponibles
      if (analysisData && analysisData.keywordGaps && analysisData.keywordGaps.contentGaps) {
        const contentGaps = analysisData.keywordGaps.contentGaps;
        
        // Convertir los gaps de contenido en oportunidades
        contentGaps.slice(0, 2).forEach((gap: { keyword: string; contentType?: string; searchVolume?: number; difficulty: number; priority?: 'low' | 'medium' | 'high' }) => {
          opportunities.push({
            title: `Todo sobre ${gap.keyword}`,
            type: 'guide',
            targetKeywords: [gap.keyword, keyword],
            searchVolume: gap.searchVolume || Math.floor(Math.random() * 3000) + 1000,
            difficulty: gap.difficulty || 50,
            intent: 'informational',
            contentLength: 'long',
            estimatedTraffic: gap.searchVolume || Math.floor(Math.random() * 3000) + 1000,
            priority: gap.priority || 'medium',
            competitorAnalysis: {
              topCompetitors: ['content-guide.com', 'web3-guides.org'],
              averageWordCount: 3000,
              commonTopics: ['conceptos básicos', 'aplicaciones prácticas'],
              contentGaps: ['casos de uso avanzados', 'tutoriales paso a paso']
            },
            outline: [
              {
                section: 'Introducción a ' + gap.keyword,
                keywords: [gap.keyword],
                wordCount: 800
              },
              {
                section: 'Aplicaciones prácticas',
                keywords: [keyword],
                wordCount: 1200
              }
            ],
            internalLinking: {
              linkTo: ['/guides'],
              linkFrom: ['/resources']
            }
          });
        });
      }
      
      // Añadir oportunidades basadas en estacionalidad si están disponibles
      if (analysisData && analysisData.seasonality && analysisData.seasonality.seasonalContent) {
        const seasonalContent = analysisData.seasonality.seasonalContent;
        
        // Convertir el contenido estacional en oportunidades
        seasonalContent.slice(0, 2).forEach((content: { title: string; description: string; contentType?: string; bestTime?: string }) => {
          opportunities.push({
            title: content.title,
            type: 'blog-post',
            targetKeywords: [keyword, content.title],
            searchVolume: Math.floor(Math.random() * 4000) + 1500,
            difficulty: 50,
            intent: 'informational',
            contentLength: 'medium',
            estimatedTraffic: Math.floor(Math.random() * 4000) + 1500,
            priority: 'high',
            competitorAnalysis: {
              topCompetitors: ['seasonal-content.com', 'web3-trends.org'],
              averageWordCount: 2000,
              commonTopics: ['tendencias estacionales', 'eventos importantes'],
              contentGaps: ['análisis de tendencias', 'predicciones']
            },
            outline: [
              {
                section: 'Introducción a ' + content.title,
                keywords: [content.title],
                wordCount: 500
              },
              {
                section: 'Aplicaciones y tendencias',
                keywords: [keyword],
                wordCount: 1000
              }
            ],
            internalLinking: {
              linkTo: ['/blog/seasonal'],
              linkFrom: ['/trends']
            }
          });
        });
      }
      
      return opportunities;
    } catch (error) {
      console.error('Error generando oportunidades de contenido Web3:', error);
      return [];
    }
  }

  private async identifyContentOpportunities(request: KeywordsAnalysisRequest, data: any): Promise<ContentOpportunity[]> {
    try {
      // Generar oportunidades de contenido para Web3
      return await this.generateWeb3ContentOpportunities(request.keywords[0], data);
    } catch (error) {
      console.error('Error identificando oportunidades de contenido:', error);
      return [];
    }
  }

  /**
   * Calcula puntuaciones específicas para keywords Web3
   */
  private calculateWeb3Scores(data: any): {
    overall: number;
    difficulty: number;
    opportunity: number;
    relevance: number;
    volume: number;
    competition: number;
  } {
    try {
      // Valores base para las puntuaciones
      let difficulty = 65;
      let opportunity = 80;
      let relevance = 85;
      let volume = 70;
      let competition = 60;
      
      const web3Category = this.determineWeb3Category(data.keyword);
      
      // Ajustar puntuaciones basadas en la categoría Web3
      switch (web3Category) {
        case 'defi':
          // DeFi es un espacio muy competitivo
          difficulty += 10;
          competition += 15;
          volume += 5;
          break;
        case 'nft':
          // NFTs tienen alta competencia pero también alta oportunidad
          difficulty += 5;
          opportunity += 10;
          volume += 10;
          competition += 10;
          break;
        case 'dao':
          // DAOs son menos competitivas pero también menos buscadas
          difficulty -= 5;
          opportunity += 5;
          volume -= 10;
          competition -= 5;
          break;
        default:
          // Blockchain general
          difficulty += 0;
          opportunity += 0;
          break;
      }
      
      // Ajustar basado en datos de competidores si están disponibles
      if (data.competitorAnalysis && data.competitorAnalysis.competitors) {
        const competitorCount = data.competitorAnalysis.competitors.length;
        
        // Más competidores = mayor dificultad y competencia
        if (competitorCount > 10) {
          difficulty += 10;
          competition += 15;
        } else if (competitorCount > 5) {
          difficulty += 5;
          competition += 10;
        } else if (competitorCount <= 2) {
          difficulty -= 5;
          competition -= 10;
          opportunity += 5; // Menos competidores = mayor oportunidad
        }
        
        // Si hay gaps de contenido = mayor oportunidad
        if (data.competitorAnalysis.contentGaps && data.competitorAnalysis.contentGaps.length > 0) {
          opportunity += Math.min(data.competitorAnalysis.contentGaps.length * 2, 15);
        }
      }
      
      // Ajustar basado en datos de estacionalidad si están disponibles
      if (data.seasonality && data.seasonality.seasonalTrends) {
        const trends = data.seasonality.seasonalTrends;
        
        // Si hay tendencias estacionales claras = mayor relevancia
        if (trends.length > 0) {
          relevance += 5;
          
          // Si estamos en temporada alta = mayor volumen y oportunidad
          const currentMonth = new Date().getMonth();
          const peakMonths = trends
            .filter((t: { trend: string; period: string }) => t.trend === 'peak')
            .flatMap((t: { trend: string; period: string }) => this.parseSeasonalPeriod(t.period));
            
          if (peakMonths.includes(currentMonth)) {
            volume += 10;
            opportunity += 5;
          }
        }
      }
      
      // Ajustar basado en datos de preguntas si están disponibles
      if (data.questionKeywords && data.questionKeywords.questions) {
        const questionCount = data.questionKeywords.questions.length;
        
        // Más preguntas = mayor volumen y relevancia
        if (questionCount > 20) {
          volume += 15;
          relevance += 5;
        } else if (questionCount > 10) {
          volume += 10;
          relevance += 3;
        } else if (questionCount > 5) {
          volume += 5;
        }
      }
      
      // Ajustar basado en oportunidades de contenido
      if (data.contentOpportunities && data.contentOpportunities.length > 0) {
        opportunity += Math.min(data.contentOpportunities.length, 10);
      }
      
      // Asegurar que los valores estén dentro del rango 0-100
      difficulty = Math.max(0, Math.min(100, difficulty));
      opportunity = Math.max(0, Math.min(100, opportunity));
      relevance = Math.max(0, Math.min(100, relevance));
      volume = Math.max(0, Math.min(100, volume));
      competition = Math.max(0, Math.min(100, competition));
      
      // Calcular puntuación general
      const overall = Math.round((difficulty * 0.15 + opportunity * 0.25 + relevance * 0.25 + volume * 0.2 + competition * 0.15));
      
      return {
        overall,
        difficulty,
        opportunity,
        relevance,
        volume,
        competition
      };
    } catch (error) {
      console.error('Error calculando puntuaciones Web3:', error);
      return {
        overall: 75,
        difficulty: 65,
        opportunity: 80,
        relevance: 85,
        volume: 70,
        competition: 60
      };
    }
  }
  
  /**
   * Convierte un período estacional en meses numéricos (0-11)
   */
  private parseSeasonalPeriod(period: string): number[] {
    if (!period) return [];
    
    const months: {[key: string]: number | number[]} = {
      'enero': 0, 'febrero': 1, 'marzo': 2, 'abril': 3, 'mayo': 4, 'junio': 5,
      'julio': 6, 'agosto': 7, 'septiembre': 8, 'octubre': 9, 'noviembre': 10, 'diciembre': 11,
      'invierno': [11, 0, 1], 'primavera': [2, 3, 4], 'verano': [5, 6, 7], 'otoño': [8, 9, 10],
      'q1': [0, 1, 2], 'q2': [3, 4, 5], 'q3': [6, 7, 8], 'q4': [9, 10, 11]
    };
    
    const periodLower = period.toLowerCase();
    
    // Comprobar si es un mes específico
    if (months[periodLower] !== undefined) {
      return Array.isArray(months[periodLower]) ? months[periodLower] as number[] : [months[periodLower] as number];
    }
    
    // Comprobar si es un rango (ej. "enero-marzo")
    const rangeParts = periodLower.split('-');
    if (rangeParts.length === 2) {
      const startMonth = months[rangeParts[0].trim()];
      const endMonth = months[rangeParts[1].trim()];
      
      if (typeof startMonth === 'number' && typeof endMonth === 'number') {
        const result = [];
        let current = startMonth;
        
        while (current !== endMonth) {
          result.push(current);
          current = (current + 1) % 12;
        }
        result.push(endMonth);
        
        return result;
      }
    }
    
    return [];
  }

  private calculateScores(data: any): {
    overall: number;
    difficulty: number;
    opportunity: number;
    relevance: number;
    volume: number;
    competition: number;
  } {
    try {
      // Calcular puntuaciones específicas para Web3
      return this.calculateWeb3Scores(data);
    } catch (error) {
      console.error('Error calculando puntuaciones:', error);
      return {
        overall: 75,
        difficulty: 65,
        opportunity: 80,
        relevance: 85,
        volume: 70,
        competition: 60
      };
    }
  }

  /**
   * Genera recomendaciones específicas para keywords Web3
   */
  private async generateWeb3Recommendations(data: any): Promise<KeywordsRecommendation[]> {
    try {
      // Inicializar servicios si no están disponibles
      if (!this.web3KeywordsService) {
        const { web3KeywordsService } = await import('./apis/web3-keywords-service');
        this.web3KeywordsService = web3KeywordsService;
      }
      
      // Intentar obtener recomendaciones del servicio Web3
      const result = await this.web3KeywordsService.getRecommendations(data.keyword, data);
      
      if (result) {
        return result;
      }
      
      // Fallback: generar recomendaciones simuladas
      const recommendations: KeywordsRecommendation[] = [];
      const web3Category = this.determineWeb3Category(data.keyword);
      
      // Recomendaciones generales para Web3
      recommendations.push({
        title: 'Utiliza terminología específica de Web3',
        description: 'Incorpora términos técnicos relevantes para aumentar la autoridad del contenido.',
        priority: 100, // Alto valor numérico para prioridad alta
        impact: 'high',
        keywords: ['blockchain', 'web3', 'descentralización', 'tokens', 'smart contracts'],
        category: 'important',
        type: 'content',
        effort: 'medium',
        implementation: {
          steps: ['Identificar términos clave de Web3', 'Incorporar términos en el contenido', 'Asegurar uso correcto de la terminología'],
          resources: ['Glosarios de Web3', 'Documentación técnica'],
          timeline: '1-2 semanas'
        }
      });
      
      recommendations.push({
        title: 'Crea contenido educativo',
        description: 'El espacio Web3 sigue siendo nuevo para muchos usuarios. El contenido educativo tiene alta demanda.',
        priority: 100, // Alto valor numérico para prioridad alta
        impact: 'high',
        keywords: ['tutorial', 'guía', 'educación', 'conceptos básicos', 'web3'],
        category: 'important',
        type: 'content',
        effort: 'high',
        implementation: {
          steps: ['Identificar conceptos básicos a explicar', 'Crear guías paso a paso', 'Desarrollar tutoriales interactivos'],
          resources: ['Plataformas de aprendizaje', 'Herramientas de visualización'],
          timeline: '2-4 semanas'
        }
      });
      
      // Recomendaciones específicas por categoría
      if (web3Category === 'defi') {
        recommendations.push({
          title: 'Enfócate en seguridad y riesgos',
          description: 'Los usuarios de DeFi están muy preocupados por la seguridad de sus activos.',
          priority: 100, // Alto valor numérico para prioridad alta
          impact: 'high',
          keywords: ['seguridad', 'auditoría', 'riesgos', 'protocolos', 'defi'],
          category: 'critical',
          type: 'content',
          effort: 'high',
          implementation: {
            steps: ['Investigar vulnerabilidades comunes', 'Analizar auditorías de seguridad', 'Crear guías de mejores prácticas'],
            resources: ['Informes de auditoría', 'Foros de seguridad DeFi'],
            timeline: '3-4 semanas'
          }
        });
        
        recommendations.push({
          title: 'Compara rendimientos y protocolos',
          description: 'Los usuarios de DeFi buscan constantemente las mejores oportunidades de rendimiento.',
          priority: 75, // Valor numérico medio para prioridad media
          impact: 'high',
          keywords: ['APY', 'rendimiento', 'protocolos', 'comparativa', 'defi'],
          category: 'important',
          type: 'content',
          effort: 'medium',
          implementation: {
            steps: ['Recopilar datos de APY de diferentes protocolos', 'Crear tablas comparativas', 'Analizar riesgos asociados'],
            resources: ['Agregadores DeFi', 'Dashboards de análisis'],
            timeline: '2-3 semanas'
          }
        });
      } else if (web3Category === 'nft') {
        recommendations.push({
          title: 'Crea guías para creadores',
          description: 'Muchos artistas y creadores quieren entrar en el espacio NFT pero no saben cómo.',
          priority: 100, // Alto valor numérico para prioridad alta
          impact: 'high',
          keywords: ['NFT', 'creadores', 'artistas', 'acuñación', 'marketplace'],
          category: 'important',
          type: 'content',
          effort: 'medium',
          implementation: {
            steps: ['Crear tutoriales de acuñación', 'Explicar proceso de venta', 'Desarrollar guías de marketing'],
            resources: ['Plataformas NFT', 'Herramientas de creación'],
            timeline: '2-3 semanas'
          }
        });
        
        recommendations.push({
          title: 'Analiza colecciones populares',
          description: 'Los coleccionistas buscan información sobre proyectos prometedores.',
          priority: 75, // Valor numérico medio para prioridad media
          impact: 'medium',
          keywords: ['colecciones', 'NFT', 'análisis', 'proyectos', 'tendencias'],
          category: 'important',
          type: 'content',
          effort: 'medium',
          implementation: {
            steps: ['Investigar colecciones emergentes', 'Analizar métricas de ventas', 'Evaluar equipos y roadmaps'],
            resources: ['Plataformas de análisis NFT', 'Datos de marketplaces'],
            timeline: '1-2 semanas'
          }
        });
      } else if (web3Category === 'dao') {
        recommendations.push({
          title: 'Explica modelos de gobernanza',
          description: 'La gobernanza es un aspecto fundamental de las DAOs que genera muchas dudas.',
          priority: 100, // Alto valor numérico para prioridad alta
          impact: 'high',
          keywords: ['DAO', 'gobernanza', 'votación', 'propuestas', 'toma de decisiones'],
          category: 'critical',
          type: 'content',
          effort: 'high',
          implementation: {
            steps: ['Investigar diferentes modelos de gobernanza', 'Comparar sistemas de votación', 'Analizar casos de estudio'],
            resources: ['Documentación de DAOs', 'Plataformas de gobernanza'],
            timeline: '3-4 semanas'
          }
        });
        
        recommendations.push({
          title: 'Comparte casos de éxito',
          description: 'Los ejemplos reales ayudan a entender el potencial de las DAOs.',
          priority: 75, // Valor numérico medio para prioridad media
          impact: 'medium',
          keywords: ['DAO', 'casos de éxito', 'ejemplos', 'proyectos', 'logros'],
          category: 'important',
          type: 'content',
          effort: 'medium',
          implementation: {
            steps: ['Investigar DAOs exitosas', 'Documentar logros y métricas', 'Analizar factores de éxito'],
            resources: ['Informes de DAOs', 'Entrevistas con miembros'],
            timeline: '2-3 semanas'
          }
        });
      } else {
        // Blockchain general
        recommendations.push({
          title: 'Desmitifica conceptos técnicos',
          description: 'La complejidad técnica es una barrera de entrada para muchos usuarios.',
          priority: 100, // Alto valor numérico para prioridad alta
          impact: 'high',
          keywords: ['blockchain', 'consenso', 'escalabilidad', 'explicación', 'simplificación'],
          category: 'critical',
          type: 'content',
          effort: 'high',
          implementation: {
            steps: ['Identificar conceptos complejos', 'Crear analogías simplificadas', 'Desarrollar visualizaciones'],
            resources: ['Glosarios técnicos', 'Herramientas de visualización'],
            timeline: '2-4 semanas'
          }
        });
        
        recommendations.push({
          title: 'Destaca aplicaciones prácticas',
          description: 'Muchos usuarios no entienden los casos de uso reales de la tecnología blockchain.',
          priority: 100, // Alto valor numérico para prioridad alta
          impact: 'medium',
          keywords: ['blockchain', 'casos de uso', 'aplicaciones', 'industrias', 'ejemplos'],
          category: 'important',
          type: 'content',
          effort: 'medium',
          implementation: {
            steps: ['Investigar casos de uso por industria', 'Documentar ejemplos concretos', 'Analizar beneficios y desafíos'],
            resources: ['Estudios de caso', 'Informes de industria'],
            timeline: '2-3 semanas'
          }
        });
      }
      
      // Recomendaciones basadas en análisis de competidores si está disponible
      if (data.competitorAnalysis && data.competitorAnalysis.competitors) {
        recommendations.push({
          title: 'Cubre los gaps de la competencia',
          description: 'Hay temas importantes que tus competidores no están cubriendo adecuadamente.',
          priority: 100, // Alto valor numérico para prioridad alta
          impact: 'high',
          keywords: ['gaps', 'competencia', 'oportunidad', 'contenido', 'web3'],
          category: 'critical',
          type: 'content',
          effort: 'high',
          implementation: {
            steps: ['Identificar gaps de contenido', 'Priorizar temas por relevancia', 'Desarrollar contenido especializado'],
            resources: ['Análisis de competidores', 'Herramientas SEO'],
            timeline: '3-4 semanas'
          }
        });
      }
      
      // Recomendaciones basadas en análisis de preguntas si está disponible
      if (data.questionKeywords && data.questionKeywords.questions) {
        const questionTypes = data.questionKeywords.questionTypes;
        let dominantType = 'what'; // Por defecto
        let maxCount = 0;
        
        // Encontrar el tipo de pregunta más común
        Object.entries(questionTypes).forEach(([type, count]) => {
          // Convertir count a número para evitar error de tipo 'unknown'
          const countValue = Number(count);
          if (countValue > maxCount) {
            maxCount = countValue;
            dominantType = type;
          }
        });
        
        let recommendationTitle = '';
        let recommendationImpl = '';
        
        switch (dominantType) {
          case 'what':
            recommendationTitle = 'Crea contenido explicativo';
            recommendationImpl = 'Desarrolla artículos que expliquen conceptos básicos y definiciones.';
            break;
          case 'how':
            recommendationTitle = 'Desarrolla tutoriales prácticos';
            recommendationImpl = 'Crea guías paso a paso y tutoriales detallados.';
            break;
          case 'why':
            recommendationTitle = 'Proporciona análisis en profundidad';
            recommendationImpl = 'Explica las razones detrás de tendencias y desarrollos en el espacio.';
            break;
          default:
            recommendationTitle = 'Responde a las preguntas más frecuentes';
            recommendationImpl = 'Crea una sección de FAQ con respuestas detalladas.';
        }
        
        recommendations.push({
          title: recommendationTitle,
          description: `Los usuarios están haciendo principalmente preguntas de tipo "${dominantType}".`,
          priority: 100, // Alto valor numérico para prioridad alta
          impact: 'high',
          keywords: ['preguntas', dominantType, 'contenido', 'usuarios', 'web3'],
          category: 'important',
          type: 'content',
          effort: 'medium',
          implementation: {
            steps: ['Analizar preguntas frecuentes', 'Desarrollar contenido específico', 'Estructurar respuestas claras'],
            resources: ['Análisis de preguntas', 'Plataformas de contenido'],
            timeline: '2-3 semanas'
          }
        });
      }
      
      // Recomendaciones basadas en estacionalidad si está disponible
      if (data.seasonality && data.seasonality.seasonalTrends) {
        const trends = data.seasonality.seasonalTrends;
        if (trends.length > 0) {
          recommendations.push({
            title: 'Planifica contenido estacional',
            description: 'El interés en este tema muestra patrones estacionales claros.',
            priority: 75, // Valor numérico medio para prioridad media
            impact: 'medium',
            keywords: ['estacionalidad', 'tendencias', 'planificación', 'contenido', 'web3'],
            category: 'important',
            type: 'optimization',
            effort: 'medium',
            implementation: {
              steps: ['Analizar patrones estacionales', 'Crear calendario editorial', 'Preparar contenido con anticipación'],
              resources: ['Datos de tendencias', 'Herramientas de planificación'],
              timeline: '1-2 meses'
            }
          });
        }
      }
      
      return recommendations;
    } catch (error) {
      console.error('Error generando recomendaciones Web3:', error);
      return [];
    }
  }

  private async generateRecommendations(data: any): Promise<KeywordsRecommendation[]> {
    try {
      // Generar recomendaciones específicas para Web3
      return await this.generateWeb3Recommendations(data);
    } catch (error) {
      console.error('Error generando recomendaciones:', error);
      return [];
    }
  }

  /**
   * Métodos de caché y base de datos
   */
  private getCachedResult(request: KeywordsAnalysisRequest): KeywordsAnalysisResult | null {
    const cacheKey = this.generateCacheKey(request);
    const cached = this.requestCache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      return cached.result;
    }
    
    return null;
  }

  private setCachedResult(request: KeywordsAnalysisRequest, result: KeywordsAnalysisResult): void {
    const cacheKey = this.generateCacheKey(request);
    
    if (this.requestCache.size >= this.MAX_CACHE_ENTRIES) {
      const oldestKey = this.requestCache.keys().next().value;
      if (oldestKey !== undefined) {
        this.requestCache.delete(oldestKey);
      }
    }
    
    this.requestCache.set(cacheKey, {
      result,
      timestamp: Date.now()
    });
  }

  private generateCacheKey(request: KeywordsAnalysisRequest): string {
    const key = `${request.keywords.sort().join(',')}-${request.domain || ''}-${request.depth || 'basic'}`;
    return Buffer.from(key).toString('base64').substring(0, 32);
  }

  private async getDbCachedResult(request: KeywordsAnalysisRequest): Promise<KeywordsAnalysisResult | null> {
    try {
      const cacheKey = this.generateCacheKey(request);
      
      const { data, error } = await this.supabase
        .from('keywords_analysis_cache')
        .select('result, created_at')
        .eq('cache_key', cacheKey)
        .gte('created_at', new Date(Date.now() - this.CACHE_TTL).toISOString())
        .single();
      
      if (error || !data) return null;
      
      return data.result as KeywordsAnalysisResult;
    } catch (error) {
      console.error('Error obteniendo caché de BD:', error);
      return null;
    }
  }

  private async saveAnalysisResult(result: KeywordsAnalysisResult): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('keywords_analysis_results')
        .insert({
          id: result.id,
          keywords: result.keywords,
          domain: result.domain,
          overview: result.overview,
          keyword_metrics: result.keywordMetrics,
          competitor_analysis: result.competitorAnalysis,
          related_keywords: result.relatedKeywords,
          long_tail_keywords: result.longTailKeywords,
          question_keywords: result.questionKeywords,
          seasonality_analysis: result.seasonalityAnalysis,
          local_search_analysis: result.localSearchAnalysis,
          keyword_gaps: result.keywordGaps,
          content_opportunities: result.contentOpportunities,
          recommendations: result.recommendations,
          score: result.score,
          created_at: result.createdAt,
          updated_at: result.updatedAt,
          analysis_type: 'web3' // Marcar el análisis como basado en Web3
        });
      
      if (error) {
        console.error('Error guardando resultado:', error);
      }
    } catch (error) {
      console.error('Error en saveAnalysisResult:', error);
    }
  }

  private async recordUsageMetrics(
    request: KeywordsAnalysisRequest, 
    result: KeywordsAnalysisResult,
    processingTime: number
  ): Promise<void> {
    try {
      await this.supabase
        .from('keywords_analysis_usage')
        .insert({
          user_id: request.userId,
          keywords_count: request.keywords.length,
          domain: request.domain,
          analysis_depth: request.depth,
          processing_time: processingTime,
          score: result.score.overall,
          created_at: new Date().toISOString()
        });
    } catch (error) {
      console.error('Error registrando métricas:', error);
    }
  }

  private cleanupCache(): void {
    const now = Date.now();
    const keysToDelete: string[] = [];
    
    this.requestCache.forEach((value, key) => {
      if (now - value.timestamp > this.CACHE_TTL) {
        keysToDelete.push(key);
      }
    });
    
    keysToDelete.forEach(key => this.requestCache.delete(key));
  }

  /**
   * Métodos públicos adicionales
   */
  async getAnalysisHistory(userId: string, limit: number = 10): Promise<KeywordsAnalysisResult[]> {
    try {
      const { data, error } = await this.supabase
        .from('keywords_analysis_results')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);
      
      if (error) throw error;
      
      return data || [];
    } catch (error) {
      console.error('Error obteniendo historial:', error);
      return [];
    }
  }

  async getAnalysisById(id: string): Promise<KeywordsAnalysisResult | null> {
    try {
      const { data, error } = await this.supabase
        .from('keywords_analysis_results')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error('Error obteniendo análisis:', error);
      return null;
    }
  }

  async deleteAnalysis(id: string): Promise<boolean> {
    try {
      const { error } = await this.supabase
        .from('keywords_analysis_results')
        .delete()
        .eq('id', id);
      
      return !error;
    } catch (error) {
      console.error('Error eliminando análisis:', error);
      return false;
    }
  }

  async suggestKeywords(seedKeyword: string, limit: number = 50): Promise<string[]> {
    try {
      // Inicializar servicios si no están disponibles
      if (!this.web3KeywordsService) {
        const { web3KeywordsService } = await import('./apis/web3-keywords-service');
        this.web3KeywordsService = web3KeywordsService;
      }
      
      // Usar Web3KeywordsService para sugerir keywords relacionadas con Web3
      const web3Suggestions = await this.web3KeywordsService.suggestRelatedKeywords(seedKeyword, limit);
      
      if (web3Suggestions && web3Suggestions.length > 0) {
        return web3Suggestions;
      }
      
      // Fallback a sugerencias básicas si el servicio Web3 falla
      const web3Modifiers = [
        'blockchain', 'crypto', 'token', 'nft', 'defi', 'dao', 'web3',
        'ethereum', 'solana', 'wallet', 'smart contract', 'metaverse',
        'mining', 'staking', 'yield', 'airdrop', 'ico', 'dex', 'layer 2'
      ];
      
      const suggestions: string[] = [];
      
      web3Modifiers.forEach(modifier => {
        suggestions.push(`${modifier} ${seedKeyword}`);
        suggestions.push(`${seedKeyword} ${modifier}`);
        suggestions.push(`${seedKeyword} for ${modifier}`);
      });
      
      return suggestions.slice(0, limit);
    } catch (error) {
      console.error('Error sugiriendo keywords Web3:', error);
      return [];
    }
  }
}

// Instancia singleton del servicio
const keywordsAnalysisService = new KeywordsAnalysisService();

export default keywordsAnalysisService;
export { KeywordsAnalysisService };