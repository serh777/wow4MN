/**
 * Servicio de análisis de contenido optimizado para Supabase/Netlify
 * Basado en análisis externo de mejoras para implementación
 * Integra análisis de texto, SEO semántico, sentimientos y extracción de entidades
 */

import { createClient } from '@supabase/supabase-js';
import * as cheerio from 'cheerio';

// Tipos para análisis de contenido
export interface ContentAnalysisRequest {
  url?: string;
  content?: string;
  type: 'url' | 'text';
  language?: string;
  includeKeywords?: boolean;
  includeSentiment?: boolean;
  includeEntities?: boolean;
  includeReadability?: boolean;
  includeSEO?: boolean;
  includeTopics?: boolean;
  depth?: 'basic' | 'detailed' | 'comprehensive';
  userId?: string;
}

export interface ContentAnalysisResult {
  id: string;
  source: string;
  timestamp: string;
  basicAnalysis: BasicContentAnalysis;
  keywordAnalysis: KeywordAnalysis;
  sentimentAnalysis: SentimentAnalysis;
  entityAnalysis: EntityAnalysis;
  readabilityAnalysis: ReadabilityAnalysis;
  seoAnalysis: SEOContentAnalysis;
  topicAnalysis: TopicAnalysis;
  structureAnalysis: ContentStructureAnalysis;
  qualityMetrics: ContentQualityMetrics;
  recommendations: ContentRecommendation[];
  score: {
    overall: number;
    readability: number;
    seo: number;
    engagement: number;
    quality: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface BasicContentAnalysis {
  wordCount: number;
  characterCount: number;
  paragraphCount: number;
  sentenceCount: number;
  averageWordsPerSentence: number;
  averageSentencesPerParagraph: number;
  language: string;
  encoding: string;
  contentType: 'article' | 'blog' | 'product' | 'landing' | 'other';
  estimatedReadingTime: number;
}

export interface KeywordAnalysis {
  primaryKeywords: {
    keyword: string;
    frequency: number;
    density: number;
    prominence: number;
    positions: number[];
  }[];
  secondaryKeywords: {
    keyword: string;
    frequency: number;
    density: number;
    relevance: number;
  }[];
  longTailKeywords: {
    phrase: string;
    frequency: number;
    words: number;
    relevance: number;
  }[];
  keywordDensity: {
    total: number;
    optimal: boolean;
    overOptimized: string[];
    underOptimized: string[];
  };
  semanticKeywords: {
    keyword: string;
    relation: string;
    strength: number;
  }[];
  competitorKeywords: {
    keyword: string;
    difficulty: number;
    opportunity: number;
  }[];
}

export interface SentimentAnalysis {
  overall: {
    polarity: number; // -1 a 1
    subjectivity: number; // 0 a 1
    confidence: number;
    label: 'positive' | 'negative' | 'neutral';
  };
  sentences: {
    text: string;
    polarity: number;
    subjectivity: number;
    emotions: {
      joy: number;
      anger: number;
      fear: number;
      sadness: number;
      surprise: number;
      disgust: number;
    };
  }[];
  emotionalTone: {
    dominant: string;
    distribution: Record<string, number>;
    intensity: number;
  };
  brandSentiment: {
    mentions: {
      text: string;
      sentiment: number;
      context: string;
    }[];
    averageSentiment: number;
  };
}

export interface EntityAnalysis {
  namedEntities: {
    text: string;
    label: string; // PERSON, ORG, GPE, etc.
    confidence: number;
    startChar: number;
    endChar: number;
    description?: string;
  }[];
  brands: {
    name: string;
    mentions: number;
    sentiment: number;
    context: string[];
  }[];
  locations: {
    name: string;
    type: string;
    mentions: number;
    coordinates?: { lat: number; lng: number };
  }[];
  organizations: {
    name: string;
    type: string;
    mentions: number;
    industry?: string;
  }[];
  products: {
    name: string;
    category: string;
    mentions: number;
    sentiment: number;
  }[];
  concepts: {
    concept: string;
    relevance: number;
    category: string;
    dbpediaResource?: string;
  }[];
}

export interface ReadabilityAnalysis {
  fleschKincaid: {
    gradeLevel: number;
    readingEase: number;
    interpretation: string;
  };
  gunningFog: {
    index: number;
    interpretation: string;
  };
  smog: {
    index: number;
    interpretation: string;
  };
  automatedReadability: {
    index: number;
    gradeLevel: number;
  };
  colemanLiau: {
    index: number;
    gradeLevel: number;
  };
  textStatistics: {
    complexWords: number;
    complexWordsPercentage: number;
    syllableCount: number;
    avgSyllablesPerWord: number;
    longSentences: number;
    longSentencesPercentage: number;
  };
  recommendations: {
    targetAudience: string;
    improvements: string[];
    simplificationSuggestions: string[];
  };
}

export interface SEOContentAnalysis {
  keywordOptimization: {
    titleOptimization: {
      keywordPresent: boolean;
      position: number;
      density: number;
      recommendations: string[];
    };
    headingOptimization: {
      h1Keywords: string[];
      h2Keywords: string[];
      h3Keywords: string[];
      keywordDistribution: Record<string, number>;
      recommendations: string[];
    };
    contentOptimization: {
      keywordDensity: number;
      keywordVariations: string[];
      semanticKeywords: string[];
      recommendations: string[];
    };
  };
  contentStructure: {
    hasIntroduction: boolean;
    hasConclusion: boolean;
    hasClearSections: boolean;
    hasCallToAction: boolean;
    internalLinkingOpportunities: string[];
    recommendations: string[];
  };
  contentFreshness: {
    lastUpdated?: string;
    contentAge: number;
    freshnessScore: number;
    updateRecommendations: string[];
  };
  competitiveAnalysis: {
    contentGaps: string[];
    opportunityKeywords: string[];
    contentLength: {
      current: number;
      recommended: number;
      competitorAverage: number;
    };
  };
}

export interface TopicAnalysis {
  mainTopics: {
    topic: string;
    relevance: number;
    keywords: string[];
    coverage: number;
  }[];
  topicClusters: {
    cluster: string;
    topics: string[];
    coherence: number;
    completeness: number;
  }[];
  contentPillars: {
    pillar: string;
    subtopics: string[];
    coverage: number;
    authority: number;
  }[];
  semanticRelations: {
    from: string;
    to: string;
    relation: string;
    strength: number;
  }[];
  topicalAuthority: {
    score: number;
    strengths: string[];
    gaps: string[];
    recommendations: string[];
  };
}

export interface ContentStructureAnalysis {
  hierarchy: {
    level: number;
    heading: string;
    wordCount: number;
    subsections: number;
  }[];
  flow: {
    coherence: number;
    transitions: {
      from: string;
      to: string;
      quality: number;
    }[];
    logicalProgression: boolean;
  };
  formatting: {
    listsCount: number;
    bulletPoints: number;
    numberedLists: number;
    boldText: number;
    italicText: number;
    quotes: number;
    codeBlocks: number;
  };
  multimedia: {
    images: number;
    videos: number;
    infographics: number;
    charts: number;
    embedsCount: number;
  };
}

export interface ContentQualityMetrics {
  uniqueness: {
    score: number;
    duplicatePercentage: number;
    similarContent: {
      url: string;
      similarity: number;
    }[];
  };
  expertise: {
    score: number;
    authorCredibility: number;
    factualAccuracy: number;
    sourceQuality: number;
    citations: number;
  };
  engagement: {
    score: number;
    readabilityScore: number;
    emotionalAppeal: number;
    callToActionStrength: number;
    interactiveElements: number;
  };
  trustworthiness: {
    score: number;
    factChecking: number;
    sourceCredibility: number;
    transparency: number;
    biasDetection: number;
  };
}

export interface ContentRecommendation {
  category: 'critical' | 'important' | 'minor';
  type: 'seo' | 'readability' | 'engagement' | 'structure' | 'quality';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  effort: 'low' | 'medium' | 'high';
  priority: number;
  implementation: {
    steps: string[];
    examples?: string[];
    tools?: string[];
    resources: string[];
  };
}

class ContentAnalysisService {
  private supabase: any;
  private requestCache: Map<string, { result: ContentAnalysisResult; timestamp: number }>;
  private readonly CACHE_TTL = 600000; // 10 minutos
  private readonly MAX_CACHE_ENTRIES = 30;

  constructor() {
    // Inicializar Supabase
    this.supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Inicializar caché en memoria
    this.requestCache = new Map();
    
    // Limpiar caché periódicamente
    setInterval(() => this.cleanupCache(), 120000);
  }

  /**
   * Análisis principal de contenido
   */
  async analyzeContent(request: ContentAnalysisRequest): Promise<ContentAnalysisResult> {
    const startTime = Date.now();
    
    try {
      // Validar entrada
      if (request.type === 'url' && !request.url) {
        throw new Error('URL requerida para análisis de URL');
      }
      if (request.type === 'text' && !request.content) {
        throw new Error('Contenido requerido para análisis de texto');
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

      // Obtener contenido
      let content: string;
      let source: string;
      
      if (request.type === 'url') {
        const crawlResult = await this.extractContentFromUrl(request.url!);
        content = crawlResult.content;
        source = request.url!;
      } else {
        content = request.content!;
        source = 'text-input';
      }

      // Detectar idioma si no se especifica
      const language = request.language || await this.detectLanguage(content);
      
      // Realizar análisis
      const basicAnalysis = this.performBasicAnalysis(content, language);
      const keywordAnalysis = await this.performKeywordAnalysis(content, language);
      const sentimentAnalysis = await this.performSentimentAnalysis(content, language);
      const entityAnalysis = await this.performEntityAnalysis(content, language);
      const readabilityAnalysis = this.performReadabilityAnalysis(content, language);
      const seoAnalysis = await this.performSEOAnalysis(content, source, keywordAnalysis);
      const topicAnalysis = await this.performTopicAnalysis(content, language);
      const structureAnalysis = this.performStructureAnalysis(content);
      const qualityMetrics = await this.calculateQualityMetrics(content, {
        basicAnalysis,
        sentimentAnalysis,
        entityAnalysis,
        readabilityAnalysis
      });
      
      // Calcular scores
      const score = this.calculateScores({
        basicAnalysis,
        keywordAnalysis,
        sentimentAnalysis,
        readabilityAnalysis,
        seoAnalysis,
        qualityMetrics
      });
      
      // Generar recomendaciones
      const recommendations = await this.generateRecommendations({
        basicAnalysis,
        keywordAnalysis,
        sentimentAnalysis,
        readabilityAnalysis,
        seoAnalysis,
        topicAnalysis,
        structureAnalysis,
        qualityMetrics
      });
      
      // Construir resultado final
      const result: ContentAnalysisResult = {
        id: crypto.randomUUID(),
        source,
        timestamp: new Date().toISOString(),
        basicAnalysis,
        keywordAnalysis,
        sentimentAnalysis,
        entityAnalysis,
        readabilityAnalysis,
        seoAnalysis,
        topicAnalysis,
        structureAnalysis,
        qualityMetrics,
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
      await this.recordUsageMetrics(request, result);
      
      return result;
    } catch (error) {
      console.error('Error en análisis de contenido:', error);
      throw error;
    }
  }

  /**
   * Extraer contenido de URL
   */
  private async extractContentFromUrl(url: string): Promise<{ content: string; title: string }> {
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; Web3Dashboard-ContentAnalyzer/1.0)'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const html = await response.text();
      const $ = cheerio.load(html);
      
      // Remover elementos no deseados
      $('script, style, nav, header, footer, aside, .sidebar, .menu, .navigation').remove();
      
      // Extraer contenido principal
      let content = '';
      const title = $('title').text().trim();
      
      // Intentar encontrar el contenido principal
      const mainSelectors = [
        'main',
        'article',
        '.content',
        '.post-content',
        '.entry-content',
        '.article-content',
        '#content',
        '.main-content'
      ];
      
      for (const selector of mainSelectors) {
        const mainContent = $(selector);
        if (mainContent.length > 0) {
          content = mainContent.text().trim();
          break;
        }
      }
      
      // Si no se encuentra contenido principal, usar el body
      if (!content) {
        content = $('body').text().trim();
      }
      
      // Limpiar contenido
      content = content
        .replace(/\s+/g, ' ')
        .replace(/\n\s*\n/g, '\n')
        .trim();
      
      return { content, title };
    } catch (error) {
      throw new Error(`Error extrayendo contenido de URL: ${error}`);
    }
  }

  /**
   * Detectar idioma del contenido
   */
  private async detectLanguage(content: string): Promise<string> {
    // Implementación básica de detección de idioma
    // En producción, usar una API como Google Translate API
    
    const sample = content.substring(0, 1000).toLowerCase();
    
    // Palabras comunes en diferentes idiomas
    const languagePatterns = {
      'es': ['el', 'la', 'de', 'que', 'y', 'en', 'un', 'es', 'se', 'no', 'te', 'lo', 'le', 'da', 'su', 'por', 'son', 'con', 'para', 'una'],
      'en': ['the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'i', 'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at'],
      'fr': ['le', 'de', 'et', 'à', 'un', 'il', 'être', 'et', 'en', 'avoir', 'que', 'pour', 'dans', 'ce', 'son', 'une', 'sur', 'avec', 'ne', 'se'],
      'pt': ['o', 'de', 'e', 'do', 'da', 'em', 'um', 'para', 'é', 'com', 'não', 'uma', 'os', 'no', 'se', 'na', 'por', 'mais', 'as', 'dos']
    };
    
    let maxMatches = 0;
    let detectedLanguage = 'en';
    
    for (const [lang, words] of Object.entries(languagePatterns)) {
      let matches = 0;
      for (const word of words) {
        const regex = new RegExp(`\\b${word}\\b`, 'gi');
        const wordMatches = (sample.match(regex) || []).length;
        matches += wordMatches;
      }
      
      if (matches > maxMatches) {
        maxMatches = matches;
        detectedLanguage = lang;
      }
    }
    
    return detectedLanguage;
  }

  /**
   * Análisis básico del contenido
   */
  private performBasicAnalysis(content: string, language: string): BasicContentAnalysis {
    const words = content.split(/\s+/).filter(word => word.length > 0);
    const sentences = content.split(/[.!?]+/).filter(sentence => sentence.trim().length > 0);
    const paragraphs = content.split(/\n\s*\n/).filter(paragraph => paragraph.trim().length > 0);
    
    const wordCount = words.length;
    const characterCount = content.length;
    const paragraphCount = paragraphs.length;
    const sentenceCount = sentences.length;
    
    const averageWordsPerSentence = sentenceCount > 0 ? wordCount / sentenceCount : 0;
    const averageSentencesPerParagraph = paragraphCount > 0 ? sentenceCount / paragraphCount : 0;
    
    // Estimar tiempo de lectura (promedio 200-250 palabras por minuto)
    const estimatedReadingTime = Math.ceil(wordCount / 225);
    
    // Detectar tipo de contenido
    let contentType: 'article' | 'blog' | 'product' | 'landing' | 'other' = 'other';
    
    if (wordCount > 800 && paragraphCount > 5) {
      contentType = 'article';
    } else if (wordCount > 300 && wordCount < 1500) {
      contentType = 'blog';
    } else if (content.toLowerCase().includes('precio') || content.toLowerCase().includes('comprar')) {
      contentType = 'product';
    } else if (content.toLowerCase().includes('contacto') || content.toLowerCase().includes('suscrib')) {
      contentType = 'landing';
    }
    
    return {
      wordCount,
      characterCount,
      paragraphCount,
      sentenceCount,
      averageWordsPerSentence,
      averageSentencesPerParagraph,
      language,
      encoding: 'UTF-8',
      contentType,
      estimatedReadingTime
    };
  }

  /**
   * Análisis de palabras clave
   */
  private async performKeywordAnalysis(content: string, language: string): Promise<KeywordAnalysis> {
    const words = content.toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 2);
    
    // Palabras vacías por idioma
    const stopWords = this.getStopWords(language);
    const filteredWords = words.filter(word => !stopWords.includes(word));
    
    // Contar frecuencias
    const wordFreq: Record<string, number> = {};
    filteredWords.forEach(word => {
      wordFreq[word] = (wordFreq[word] || 0) + 1;
    });
    
    // Palabras clave primarias (más frecuentes)
    const primaryKeywords = Object.entries(wordFreq)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([keyword, frequency]) => {
        const density = (frequency / words.length) * 100;
        const positions = this.findWordPositions(content.toLowerCase(), keyword);
        const prominence = this.calculateKeywordProminence(content, keyword, positions);
        
        return {
          keyword,
          frequency,
          density,
          prominence,
          positions
        };
      });
    
    // Frases de cola larga (2-4 palabras)
    const longTailKeywords = this.extractLongTailKeywords(content, language)
      .slice(0, 15);
    
    // Palabras clave secundarias
    const secondaryKeywords = Object.entries(wordFreq)
      .sort(([,a], [,b]) => b - a)
      .slice(10, 25)
      .map(([keyword, frequency]) => ({
        keyword,
        frequency,
        density: (frequency / words.length) * 100,
        relevance: this.calculateKeywordRelevance(keyword, content)
      }));
    
    // Densidad de palabras clave
    const totalKeywordDensity = primaryKeywords.reduce((sum, kw) => sum + kw.density, 0);
    const keywordDensity = {
      total: totalKeywordDensity,
      optimal: totalKeywordDensity >= 1 && totalKeywordDensity <= 3,
      overOptimized: primaryKeywords.filter(kw => kw.density > 2).map(kw => kw.keyword),
      underOptimized: primaryKeywords.filter(kw => kw.density < 0.5).map(kw => kw.keyword)
    };
    
    return {
      primaryKeywords,
      secondaryKeywords,
      longTailKeywords,
      keywordDensity,
      semanticKeywords: [], // Se implementaría con NLP avanzado
      competitorKeywords: [] // Se implementaría con APIs de SEO
    };
  }

  /**
   * Análisis de sentimientos
   */
  private async performSentimentAnalysis(content: string, language: string): Promise<SentimentAnalysis> {
    // Implementación básica de análisis de sentimientos
    // En producción, usar APIs como Google Cloud Natural Language o Azure Text Analytics
    
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
    
    // Palabras positivas y negativas básicas
    const positiveWords = this.getPositiveWords(language);
    const negativeWords = this.getNegativeWords(language);
    
    let totalPolarity = 0;
    let totalSubjectivity = 0;
    
    const sentenceAnalysis = sentences.map(sentence => {
      const words = sentence.toLowerCase().split(/\s+/);
      let positiveCount = 0;
      let negativeCount = 0;
      
      words.forEach(word => {
        if (positiveWords.includes(word)) positiveCount++;
        if (negativeWords.includes(word)) negativeCount++;
      });
      
      const polarity = (positiveCount - negativeCount) / Math.max(words.length, 1);
      const subjectivity = (positiveCount + negativeCount) / Math.max(words.length, 1);
      
      totalPolarity += polarity;
      totalSubjectivity += subjectivity;
      
      return {
        text: sentence.trim(),
        polarity,
        subjectivity,
        emotions: {
          joy: positiveCount * 0.3,
          anger: negativeCount * 0.2,
          fear: negativeCount * 0.1,
          sadness: negativeCount * 0.2,
          surprise: positiveCount * 0.1,
          disgust: negativeCount * 0.1
        }
      };
    });
    
    const avgPolarity = totalPolarity / sentences.length;
    const avgSubjectivity = totalSubjectivity / sentences.length;
    
    let label: 'positive' | 'negative' | 'neutral' = 'neutral';
    if (avgPolarity > 0.1) label = 'positive';
    else if (avgPolarity < -0.1) label = 'negative';
    
    return {
      overall: {
        polarity: avgPolarity,
        subjectivity: avgSubjectivity,
        confidence: Math.min(Math.abs(avgPolarity) * 2, 1),
        label
      },
      sentences: sentenceAnalysis,
      emotionalTone: {
        dominant: label === 'positive' ? 'joy' : label === 'negative' ? 'sadness' : 'neutral',
        distribution: {
          positive: Math.max(0, avgPolarity),
          negative: Math.max(0, -avgPolarity),
          neutral: 1 - Math.abs(avgPolarity)
        },
        intensity: Math.abs(avgPolarity)
      },
      brandSentiment: {
        mentions: [],
        averageSentiment: avgPolarity
      }
    };
  }

  /**
   * Análisis de entidades
   */
  private async performEntityAnalysis(content: string, language: string): Promise<EntityAnalysis> {
    // Implementación básica de reconocimiento de entidades
    // En producción, usar APIs como spaCy, Google Cloud Natural Language, etc.
    
    const namedEntities: EntityAnalysis['namedEntities'] = [];
    
    // Patrones básicos para detectar entidades
    const patterns = {
      email: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
      url: /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g,
      phone: /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g,
      currency: /\$\d+(?:,\d{3})*(?:\.\d{2})?/g,
      percentage: /\d+(?:\.\d+)?%/g,
      date: /\b\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}\b/g
    };
    
    Object.entries(patterns).forEach(([type, pattern]) => {
      let match;
      while ((match = pattern.exec(content)) !== null) {
        namedEntities.push({
          text: match[0],
          label: type.toUpperCase(),
          confidence: 0.8,
          startChar: match.index,
          endChar: match.index + match[0].length
        });
      }
    });
    
    return {
      namedEntities,
      brands: [],
      locations: [],
      organizations: [],
      products: [],
      concepts: []
    };
  }

  /**
   * Análisis de legibilidad
   */
  private performReadabilityAnalysis(content: string, language: string): ReadabilityAnalysis {
    const words = content.split(/\s+/).filter(word => word.length > 0);
    const sentences = content.split(/[.!?]+/).filter(sentence => sentence.trim().length > 0);
    const syllables = this.countSyllables(content);
    
    const wordCount = words.length;
    const sentenceCount = sentences.length;
    const syllableCount = syllables;
    
    // Flesch-Kincaid
    const avgSentenceLength = wordCount / sentenceCount;
    const avgSyllablesPerWord = syllableCount / wordCount;
    
    const fleschReadingEase = 206.835 - (1.015 * avgSentenceLength) - (84.6 * avgSyllablesPerWord);
    const fleschKincaidGrade = (0.39 * avgSentenceLength) + (11.8 * avgSyllablesPerWord) - 15.59;
    
    // Gunning Fog Index
    const complexWords = words.filter(word => this.countWordSyllables(word) >= 3).length;
    const complexWordsPercentage = (complexWords / wordCount) * 100;
    const gunningFog = 0.4 * (avgSentenceLength + complexWordsPercentage);
    
    // SMOG Index
    const smogIndex = 1.0430 * Math.sqrt(complexWords * (30 / sentenceCount)) + 3.1291;
    
    // Automated Readability Index
    const characters = content.replace(/\s/g, '').length;
    const ariIndex = (4.71 * (characters / wordCount)) + (0.5 * (wordCount / sentenceCount)) - 21.43;
    
    // Coleman-Liau Index
    const avgCharsPerWord = characters / wordCount;
    const avgSentencesPer100Words = (sentenceCount / wordCount) * 100;
    const colemanLiau = (0.0588 * avgCharsPerWord * 100 / wordCount) - (0.296 * avgSentencesPer100Words) - 15.8;
    
    // Interpretaciones
    const getFleschInterpretation = (score: number): string => {
      if (score >= 90) return 'Muy fácil de leer';
      if (score >= 80) return 'Fácil de leer';
      if (score >= 70) return 'Bastante fácil de leer';
      if (score >= 60) return 'Estándar';
      if (score >= 50) return 'Bastante difícil de leer';
      if (score >= 30) return 'Difícil de leer';
      return 'Muy difícil de leer';
    };
    
    const getGradeInterpretation = (grade: number): string => {
      if (grade <= 6) return 'Escuela primaria';
      if (grade <= 8) return 'Escuela media';
      if (grade <= 12) return 'Escuela secundaria';
      if (grade <= 16) return 'Universidad';
      return 'Posgrado';
    };
    
    // Estadísticas de texto
    const longSentences = sentences.filter(s => s.split(/\s+/).length > 20).length;
    const longSentencesPercentage = (longSentences / sentenceCount) * 100;
    
    return {
      fleschKincaid: {
        gradeLevel: Math.max(0, fleschKincaidGrade),
        readingEase: Math.max(0, Math.min(100, fleschReadingEase)),
        interpretation: getFleschInterpretation(fleschReadingEase)
      },
      gunningFog: {
        index: Math.max(0, gunningFog),
        interpretation: getGradeInterpretation(gunningFog)
      },
      smog: {
        index: Math.max(0, smogIndex),
        interpretation: getGradeInterpretation(smogIndex)
      },
      automatedReadability: {
        index: Math.max(0, ariIndex),
        gradeLevel: Math.max(0, ariIndex)
      },
      colemanLiau: {
        index: Math.max(0, colemanLiau),
        gradeLevel: Math.max(0, colemanLiau)
      },
      textStatistics: {
        complexWords,
        complexWordsPercentage,
        syllableCount,
        avgSyllablesPerWord,
        longSentences,
        longSentencesPercentage
      },
      recommendations: {
        targetAudience: getGradeInterpretation(fleschKincaidGrade),
        improvements: this.generateReadabilityImprovements({
          fleschKincaidGrade,
          gunningFog,
          complexWordsPercentage,
          avgSentenceLength,
          longSentencesPercentage
        }),
        simplificationSuggestions: this.generateSimplificationSuggestions({
          complexWords,
          avgSentenceLength,
          longSentences
        })
      }
    };
  }

  /**
   * Análisis SEO del contenido
   */
  private async performSEOAnalysis(
    content: string, 
    source: string, 
    keywordAnalysis: KeywordAnalysis
  ): Promise<SEOContentAnalysis> {
    const primaryKeyword = keywordAnalysis.primaryKeywords[0]?.keyword || '';
    
    // Análisis de optimización de palabras clave
    const titleOptimization = {
      keywordPresent: false,
      position: -1,
      density: 0,
      recommendations: [] as string[]
    };
    
    // Análisis de estructura de contenido
    const hasIntroduction = this.detectIntroduction(content);
    const hasConclusion = this.detectConclusion(content);
    const hasClearSections = this.detectSections(content);
    const hasCallToAction = this.detectCallToAction(content);
    
    const contentStructure = {
      hasIntroduction,
      hasConclusion,
      hasClearSections,
      hasCallToAction,
      internalLinkingOpportunities: this.findInternalLinkingOpportunities(content),
      recommendations: this.generateStructureRecommendations({
        hasIntroduction,
        hasConclusion,
        hasClearSections,
        hasCallToAction
      })
    };
    
    return {
      keywordOptimization: {
        titleOptimization,
        headingOptimization: {
          h1Keywords: [],
          h2Keywords: [],
          h3Keywords: [],
          keywordDistribution: {},
          recommendations: []
        },
        contentOptimization: {
          keywordDensity: keywordAnalysis.keywordDensity.total,
          keywordVariations: [],
          semanticKeywords: [],
          recommendations: []
        }
      },
      contentStructure,
      contentFreshness: {
        contentAge: 0,
        freshnessScore: 100,
        updateRecommendations: []
      },
      competitiveAnalysis: {
        contentGaps: [],
        opportunityKeywords: [],
        contentLength: {
          current: content.split(/\s+/).length,
          recommended: 1500,
          competitorAverage: 1200
        }
      }
    };
  }

  /**
   * Análisis de temas
   */
  private async performTopicAnalysis(content: string, language: string): Promise<TopicAnalysis> {
    // Implementación básica de análisis de temas
    // En producción, usar algoritmos como LDA o modelos de transformers
    
    const words = content.toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 3);
    
    const stopWords = this.getStopWords(language);
    const filteredWords = words.filter(word => !stopWords.includes(word));
    
    // Agrupar palabras por frecuencia para identificar temas
    const wordFreq: Record<string, number> = {};
    filteredWords.forEach(word => {
      wordFreq[word] = (wordFreq[word] || 0) + 1;
    });
    
    const topWords = Object.entries(wordFreq)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 20);
    
    // Crear temas principales basados en palabras frecuentes
    const mainTopics = topWords.slice(0, 5).map(([word, freq], index) => ({
      topic: word,
      relevance: freq / filteredWords.length,
      keywords: [word],
      coverage: (freq / filteredWords.length) * 100
    }));
    
    return {
      mainTopics,
      topicClusters: [],
      contentPillars: [],
      semanticRelations: [],
      topicalAuthority: {
        score: 70,
        strengths: mainTopics.slice(0, 3).map(t => t.topic),
        gaps: [],
        recommendations: [
          'Expandir contenido sobre temas principales',
          'Agregar subtemas relacionados',
          'Mejorar la profundidad del análisis'
        ]
      }
    };
  }

  /**
   * Análisis de estructura del contenido
   */
  private performStructureAnalysis(content: string): ContentStructureAnalysis {
    // Detectar jerarquía de encabezados
    const headingRegex = /^(#{1,6})\s+(.+)$/gm;
    const hierarchy: ContentStructureAnalysis['hierarchy'] = [];
    
    let match;
    while ((match = headingRegex.exec(content)) !== null) {
      const level = match[1].length;
      const heading = match[2].trim();
      const wordCount = heading.split(/\s+/).length;
      
      hierarchy.push({
        level,
        heading,
        wordCount,
        subsections: 0 // Se calcularía analizando la estructura completa
      });
    }
    
    // Análisis de formato
    const formatting = {
      listsCount: (content.match(/^\s*[-*+]\s+/gm) || []).length,
      bulletPoints: (content.match(/^\s*[-*+]\s+/gm) || []).length,
      numberedLists: (content.match(/^\s*\d+\.\s+/gm) || []).length,
      boldText: (content.match(/\*\*[^*]+\*\*/g) || []).length,
      italicText: (content.match(/\*[^*]+\*/g) || []).length,
      quotes: (content.match(/^\s*>/gm) || []).length,
      codeBlocks: (content.match(/```[\s\S]*?```/g) || []).length
    };
    
    return {
      hierarchy,
      flow: {
        coherence: 0.8, // Se calcularía con análisis semántico
        transitions: [],
        logicalProgression: hierarchy.length > 0
      },
      formatting,
      multimedia: {
        images: (content.match(/!\[[^\]]*\]\([^)]+\)/g) || []).length,
        videos: 0,
        infographics: 0,
        charts: 0,
        embedsCount: 0
      }
    };
  }

  /**
   * Calcular métricas de calidad
   */
  private async calculateQualityMetrics(
    content: string, 
    analyses: any
  ): Promise<ContentQualityMetrics> {
    const wordCount = content.split(/\s+/).length;
    
    return {
      uniqueness: {
        score: 85, // Se calcularía con detección de plagio
        duplicatePercentage: 15,
        similarContent: []
      },
      expertise: {
        score: 75,
        authorCredibility: 70,
        factualAccuracy: 80,
        sourceQuality: 70,
        citations: (content.match(/\[[0-9]+\]/g) || []).length
      },
      engagement: {
        score: analyses.sentimentAnalysis.overall.polarity > 0 ? 80 : 60,
        readabilityScore: analyses.readabilityAnalysis.fleschKincaid.readingEase,
        emotionalAppeal: Math.abs(analyses.sentimentAnalysis.overall.polarity) * 100,
        callToActionStrength: this.detectCallToAction(content) ? 80 : 40,
        interactiveElements: 0
      },
      trustworthiness: {
        score: 75,
        factChecking: 70,
        sourceCredibility: 75,
        transparency: 80,
        biasDetection: 70
      }
    };
  }

  /**
   * Calcular scores generales
   */
  private calculateScores(data: any): {
    overall: number;
    readability: number;
    seo: number;
    engagement: number;
    quality: number;
  } {
    const readabilityScore = Math.min(100, data.readabilityAnalysis.fleschKincaid.readingEase);
    const seoScore = this.calculateSEOScore(data);
    const engagementScore = data.qualityMetrics.engagement.score;
    const qualityScore = (data.qualityMetrics.uniqueness.score + 
                         data.qualityMetrics.expertise.score + 
                         data.qualityMetrics.trustworthiness.score) / 3;
    
    const overallScore = (readabilityScore + seoScore + engagementScore + qualityScore) / 4;
    
    return {
      overall: Math.round(overallScore),
      readability: Math.round(readabilityScore),
      seo: Math.round(seoScore),
      engagement: Math.round(engagementScore),
      quality: Math.round(qualityScore)
    };
  }

  private calculateSEOScore(data: any): number {
    let score = 100;
    
    // Penalizar por densidad de palabras clave
    if (!data.keywordAnalysis.keywordDensity.optimal) {
      score -= 15;
    }
    
    // Penalizar por falta de estructura
    if (!data.seoAnalysis.contentStructure.hasIntroduction) score -= 10;
    if (!data.seoAnalysis.contentStructure.hasConclusion) score -= 10;
    if (!data.seoAnalysis.contentStructure.hasClearSections) score -= 15;
    if (!data.seoAnalysis.contentStructure.hasCallToAction) score -= 10;
    
    // Bonificar por longitud adecuada
    const wordCount = data.basicAnalysis.wordCount;
    if (wordCount < 300) score -= 20;
    else if (wordCount > 2000) score -= 10;
    
    return Math.max(0, score);
  }

  /**
   * Generar recomendaciones
   */
  private async generateRecommendations(data: any): Promise<ContentRecommendation[]> {
    const recommendations: ContentRecommendation[] = [];
    
    // Recomendaciones de legibilidad
    if (data.readabilityAnalysis.fleschKincaid.readingEase < 60) {
      recommendations.push({
        category: 'important',
        type: 'readability',
        title: 'Mejorar legibilidad del contenido',
        description: 'El contenido es difícil de leer. Simplifica las oraciones y usa palabras más comunes.',
        impact: 'high',
        effort: 'medium',
        priority: 85,
        implementation: {
          steps: [
            'Acortar oraciones largas (menos de 20 palabras)',
            'Usar palabras más simples y comunes',
            'Dividir párrafos largos',
            'Agregar subtítulos para organizar el contenido'
          ],
          examples: [
            'En lugar de: "La implementación de esta metodología revolucionaria"',
            'Usar: "Este nuevo método"'
          ],
          resources: [
            'https://www.hemingwayapp.com/',
            'https://readable.com/'
          ]
        }
      });
    }
    
    // Recomendaciones SEO
    if (!data.keywordAnalysis.keywordDensity.optimal) {
      recommendations.push({
        category: 'critical',
        type: 'seo',
        title: 'Optimizar densidad de palabras clave',
        description: 'La densidad de palabras clave no está en el rango óptimo (1-3%).',
        impact: 'high',
        effort: 'low',
        priority: 90,
        implementation: {
          steps: [
            'Identificar palabra clave principal',
            'Usar la palabra clave 1-3% del total de palabras',
            'Incluir variaciones y sinónimos',
            'Distribuir naturalmente en el contenido'
          ],
          tools: [
            'Google Keyword Planner',
            'SEMrush',
            'Ahrefs'
          ],
          resources: [
            'https://moz.com/learn/seo/keyword-density',
            'https://backlinko.com/keyword-density'
          ]
        }
      });
    }
    
    // Recomendaciones de estructura
    if (!data.seoAnalysis.contentStructure.hasIntroduction) {
      recommendations.push({
        category: 'important',
        type: 'structure',
        title: 'Agregar introducción clara',
        description: 'El contenido necesita una introducción que presente el tema y enganche al lector.',
        impact: 'medium',
        effort: 'low',
        priority: 75,
        implementation: {
          steps: [
            'Escribir 1-2 párrafos introductorios',
            'Presentar el problema o tema principal',
            'Mencionar qué aprenderá el lector',
            'Incluir la palabra clave principal'
          ],
          examples: [
            'En este artículo aprenderás...',
            '¿Te has preguntado alguna vez...?',
            'Descubre cómo...'
          ],
          resources: [
            'https://copyblogger.com/how-to-write-an-introduction/',
            'https://blog.hubspot.com/marketing/how-to-write-an-introduction'
          ]
        }
      });
    }
    
    if (!data.seoAnalysis.contentStructure.hasCallToAction) {
      recommendations.push({
        category: 'important',
        type: 'engagement',
        title: 'Incluir llamada a la acción',
        description: 'El contenido necesita una llamada a la acción clara para guiar al lector.',
        impact: 'medium',
        effort: 'low',
        priority: 70,
        implementation: {
          steps: [
            'Definir el objetivo del contenido',
            'Crear una CTA específica y clara',
            'Usar verbos de acción',
            'Colocar la CTA al final del contenido'
          ],
          examples: [
            '"Descarga nuestra guía gratuita"',
            '"Comienza tu prueba gratuita hoy"',
            '"Suscríbete para más consejos"'
          ],
          resources: [
            'https://blog.hubspot.com/marketing/call-to-action-examples',
            'https://optinmonster.com/call-to-action-examples/'
          ]
        }
      });
    }
    
    // Recomendaciones de calidad
    if (data.basicAnalysis.wordCount < 300) {
      recommendations.push({
        category: 'critical',
        type: 'quality',
        title: 'Expandir contenido',
        description: 'El contenido es muy corto. Los artículos más largos tienden a posicionarse mejor.',
        impact: 'high',
        effort: 'high',
        priority: 80,
        implementation: {
          steps: [
            'Agregar más detalles y ejemplos',
            'Incluir subtemas relacionados',
            'Añadir casos de estudio o testimonios',
            'Expandir con información útil y relevante'
          ],
          resources: [
            'https://backlinko.com/longer-content-higher-rankings',
            'https://neilpatel.com/blog/why-you-need-to-create-evergreen-long-form-content/'
          ]
        }
      });
    }
    
    return recommendations
      .sort((a, b) => b.priority - a.priority)
      .slice(0, 12);
  }

  /**
   * Métodos auxiliares
   */
  private getStopWords(language: string): string[] {
    const stopWords: Record<string, string[]> = {
      'es': ['el', 'la', 'de', 'que', 'y', 'a', 'en', 'un', 'es', 'se', 'no', 'te', 'lo', 'le', 'da', 'su', 'por', 'son', 'con', 'para', 'una', 'del', 'al', 'las', 'los', 'pero', 'sus', 'fue', 'como', 'muy', 'sin', 'sobre', 'ser', 'tiene', 'todo', 'esta', 'hasta', 'hay', 'donde', 'han', 'quien', 'están', 'estado', 'desde', 'más', 'este', 'había', 'si', 'durante', 'puede', 'hace', 'cada', 'fin', 'incluso', 'también', 'aquí', 'sólo', 'dijo', 'poco', 'bajo', 'tanto', 'ahora', 'lugar'],
      'en': ['the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'i', 'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at', 'this', 'but', 'his', 'by', 'from', 'they', 'she', 'or', 'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their', 'what', 'so', 'up', 'out', 'if', 'about', 'who', 'get', 'which', 'go', 'me', 'when', 'make', 'can', 'like', 'time', 'no', 'just', 'him', 'know', 'take', 'people', 'into', 'year', 'your', 'good', 'some', 'could', 'them', 'see', 'other', 'than', 'then', 'now', 'look', 'only', 'come', 'its', 'over', 'think', 'also', 'back', 'after', 'use', 'two', 'how', 'our', 'work', 'first', 'well', 'way', 'even', 'new', 'want', 'because', 'any', 'these', 'give', 'day', 'most', 'us']
    };
    
    return stopWords[language] || stopWords['en'];
  }

  private getPositiveWords(language: string): string[] {
    const positiveWords: Record<string, string[]> = {
      'es': ['bueno', 'excelente', 'fantástico', 'genial', 'increíble', 'maravilloso', 'perfecto', 'estupendo', 'magnífico', 'extraordinario', 'fabuloso', 'espectacular', 'brillante', 'impresionante', 'asombroso', 'hermoso', 'alegre', 'feliz', 'contento', 'satisfecho', 'encantado', 'emocionado', 'entusiasmado', 'optimista', 'positivo', 'exitoso', 'triunfante', 'victorioso', 'ganador', 'líder'],
      'en': ['good', 'excellent', 'fantastic', 'great', 'incredible', 'wonderful', 'perfect', 'amazing', 'magnificent', 'extraordinary', 'fabulous', 'spectacular', 'brilliant', 'impressive', 'awesome', 'beautiful', 'happy', 'joyful', 'pleased', 'satisfied', 'delighted', 'excited', 'enthusiastic', 'optimistic', 'positive', 'successful', 'triumphant', 'victorious', 'winner', 'leader']
    };
    
    return positiveWords[language] || positiveWords['en'];
  }

  private getNegativeWords(language: string): string[] {
    const negativeWords: Record<string, string[]> = {
      'es': ['malo', 'terrible', 'horrible', 'pésimo', 'desastroso', 'awful', 'espantoso', 'deplorable', 'lamentable', 'triste', 'deprimido', 'molesto', 'enojado', 'furioso', 'irritado', 'frustrado', 'decepcionado', 'preocupado', 'ansioso', 'nervioso', 'estresado', 'cansado', 'agotado', 'aburrido', 'confundido', 'perdido', 'fracaso', 'error', 'problema', 'dificultad'],
      'en': ['bad', 'terrible', 'horrible', 'awful', 'disastrous', 'dreadful', 'appalling', 'deplorable', 'sad', 'depressed', 'upset', 'angry', 'furious', 'irritated', 'frustrated', 'disappointed', 'worried', 'anxious', 'nervous', 'stressed', 'tired', 'exhausted', 'bored', 'confused', 'lost', 'failure', 'error', 'problem', 'difficulty']
    };
    
    return negativeWords[language] || negativeWords['en'];
  }

  private findWordPositions(text: string, word: string): number[] {
    const positions: number[] = [];
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    let match;
    
    while ((match = regex.exec(text)) !== null) {
      positions.push(match.index);
    }
    
    return positions;
  }

  private calculateKeywordProminence(content: string, keyword: string, positions: number[]): number {
    if (positions.length === 0) return 0;
    
    const contentLength = content.length;
    let prominence = 0;
    
    positions.forEach(pos => {
      // Dar más peso a palabras al inicio del contenido
      const positionWeight = 1 - (pos / contentLength);
      prominence += positionWeight;
    });
    
    return prominence / positions.length;
  }

  private extractLongTailKeywords(content: string, language: string): {
    phrase: string;
    frequency: number;
    words: number;
    relevance: number;
  }[] {
    const sentences = content.toLowerCase().split(/[.!?]+/);
    const phrases: Record<string, number> = {};
    const stopWords = this.getStopWords(language);
    
    sentences.forEach(sentence => {
      const words = sentence.split(/\s+/).filter(word => 
        word.length > 2 && !stopWords.includes(word)
      );
      
      // Extraer frases de 2-4 palabras
      for (let i = 0; i < words.length - 1; i++) {
        for (let len = 2; len <= Math.min(4, words.length - i); len++) {
          const phrase = words.slice(i, i + len).join(' ');
          if (phrase.length > 6) {
            phrases[phrase] = (phrases[phrase] || 0) + 1;
          }
        }
      }
    });
    
    return Object.entries(phrases)
      .filter(([phrase, freq]) => freq > 1)
      .sort(([,a], [,b]) => b - a)
      .map(([phrase, frequency]) => ({
        phrase,
        frequency,
        words: phrase.split(' ').length,
        relevance: this.calculatePhraseRelevance(phrase, content)
      }));
  }

  private calculateKeywordRelevance(keyword: string, content: string): number {
    // Implementación básica de relevancia
    const keywordLength = keyword.length;
    const contentLength = content.length;
    const frequency = (content.toLowerCase().match(new RegExp(keyword, 'g')) || []).length;
    
    return (frequency * keywordLength) / contentLength * 1000;
  }

  private calculatePhraseRelevance(phrase: string, content: string): number {
    const phraseWords = phrase.split(' ');
    const contentWords = content.toLowerCase().split(/\s+/);
    
    let relevance = 0;
    phraseWords.forEach(word => {
      const wordFreq = contentWords.filter(w => w === word).length;
      relevance += wordFreq / contentWords.length;
    });
    
    return relevance / phraseWords.length;
  }

  private countSyllables(text: string): number {
    const words = text.split(/\s+/);
    return words.reduce((total, word) => total + this.countWordSyllables(word), 0);
  }

  private countWordSyllables(word: string): number {
    word = word.toLowerCase();
    if (word.length <= 3) return 1;
    
    word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
    word = word.replace(/^y/, '');
    const matches = word.match(/[aeiouy]{1,2}/g);
    
    return matches ? matches.length : 1;
  }

  private generateReadabilityImprovements(data: {
    fleschKincaidGrade: number;
    gunningFog: number;
    complexWordsPercentage: number;
    avgSentenceLength: number;
    longSentencesPercentage: number;
  }): string[] {
    const improvements: string[] = [];
    
    if (data.avgSentenceLength > 20) {
      improvements.push('Acortar oraciones (objetivo: menos de 20 palabras por oración)');
    }
    
    if (data.complexWordsPercentage > 15) {
      improvements.push('Usar palabras más simples y comunes');
    }
    
    if (data.longSentencesPercentage > 25) {
      improvements.push('Dividir oraciones largas en oraciones más cortas');
    }
    
    if (data.fleschKincaidGrade > 12) {
      improvements.push('Simplificar el vocabulario para un público más amplio');
    }
    
    improvements.push('Agregar más subtítulos para organizar el contenido');
    improvements.push('Usar listas con viñetas para información compleja');
    
    return improvements;
  }

  private generateSimplificationSuggestions(data: {
    complexWords: number;
    avgSentenceLength: number;
    longSentences: number;
  }): string[] {
    const suggestions: string[] = [];
    
    if (data.complexWords > 20) {
      suggestions.push('Reemplazar palabras técnicas con sinónimos más simples');
      suggestions.push('Definir términos técnicos cuando sea necesario');
    }
    
    if (data.avgSentenceLength > 18) {
      suggestions.push('Dividir oraciones compuestas en oraciones simples');
      suggestions.push('Usar conectores simples como "y", "pero", "porque"');
    }
    
    if (data.longSentences > 5) {
      suggestions.push('Identificar y acortar las oraciones más largas');
      suggestions.push('Usar puntos en lugar de comas para separar ideas');
    }
    
    suggestions.push('Escribir en voz activa en lugar de voz pasiva');
    suggestions.push('Usar ejemplos concretos para explicar conceptos abstractos');
    
    return suggestions;
  }

  private detectIntroduction(content: string): boolean {
    const firstParagraph = content.split('\n\n')[0] || '';
    const introductionKeywords = [
      'introducción', 'introduction', 'en este artículo', 'in this article',
      'aprenderás', 'you will learn', 'descubre', 'discover',
      'te preguntado', 'wondered', 'vamos a ver', "let's see"
    ];
    
    return introductionKeywords.some(keyword => 
      firstParagraph.toLowerCase().includes(keyword)
    );
  }

  private detectConclusion(content: string): boolean {
    const lastParagraph = content.split('\n\n').pop() || '';
    const conclusionKeywords = [
      'conclusión', 'conclusion', 'en resumen', 'in summary',
      'para concluir', 'to conclude', 'finalmente', 'finally',
      'en definitiva', 'ultimately', 'resumiendo', 'summarizing'
    ];
    
    return conclusionKeywords.some(keyword => 
      lastParagraph.toLowerCase().includes(keyword)
    );
  }

  private detectSections(content: string): boolean {
    // Detectar encabezados markdown o HTML
    const headingPatterns = [
      /^#{1,6}\s+/gm, // Markdown headings
      /<h[1-6][^>]*>/gi, // HTML headings
      /^\d+\.\s+[A-Z]/gm // Numbered sections
    ];
    
    return headingPatterns.some(pattern => pattern.test(content));
  }

  private detectCallToAction(content: string): boolean {
    const ctaKeywords = [
      'descarga', 'download', 'suscríbete', 'subscribe',
      'regístrate', 'register', 'compra', 'buy',
      'contacta', 'contact', 'solicita', 'request',
      'prueba gratis', 'free trial', 'más información', 'more info',
      'haz clic', 'click here', 'comienza', 'get started'
    ];
    
    return ctaKeywords.some(keyword => 
      content.toLowerCase().includes(keyword)
    );
  }

  private findInternalLinkingOpportunities(content: string): string[] {
    // Buscar temas que podrían enlazarse internamente
    const opportunities: string[] = [];
    
    const linkableTopics = [
      'seo', 'marketing digital', 'contenido', 'palabras clave',
      'analytics', 'conversiones', 'redes sociales', 'email marketing',
      'optimización', 'estrategia', 'herramientas', 'métricas'
    ];
    
    linkableTopics.forEach(topic => {
      if (content.toLowerCase().includes(topic)) {
        opportunities.push(`Enlazar a artículo sobre "${topic}"`);
      }
    });
    
    return opportunities.slice(0, 5);
  }

  private generateStructureRecommendations(data: {
    hasIntroduction: boolean;
    hasConclusion: boolean;
    hasClearSections: boolean;
    hasCallToAction: boolean;
  }): string[] {
    const recommendations: string[] = [];
    
    if (!data.hasIntroduction) {
      recommendations.push('Agregar una introducción clara que presente el tema');
    }
    
    if (!data.hasConclusion) {
      recommendations.push('Incluir una conclusión que resuma los puntos principales');
    }
    
    if (!data.hasClearSections) {
      recommendations.push('Organizar el contenido con subtítulos claros');
    }
    
    if (!data.hasCallToAction) {
      recommendations.push('Incluir una llamada a la acción al final del contenido');
    }
    
    recommendations.push('Usar listas con viñetas para mejorar la legibilidad');
    recommendations.push('Agregar enlaces internos a contenido relacionado');
    
    return recommendations;
  }

  /**
   * Métodos de caché y base de datos
   */
  private getCachedResult(request: ContentAnalysisRequest): ContentAnalysisResult | null {
    const cacheKey = this.generateCacheKey(request);
    const cached = this.requestCache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      return cached.result;
    }
    
    return null;
  }

  private setCachedResult(request: ContentAnalysisRequest, result: ContentAnalysisResult): void {
    const cacheKey = this.generateCacheKey(request);
    
    // Limpiar caché si está lleno
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

  private generateCacheKey(request: ContentAnalysisRequest): string {
    const key = `${request.type}-${request.url || 'text'}-${request.depth || 'basic'}`;
    return Buffer.from(key).toString('base64').substring(0, 32);
  }

  private async getDbCachedResult(request: ContentAnalysisRequest): Promise<ContentAnalysisResult | null> {
    try {
      const cacheKey = this.generateCacheKey(request);
      
      const { data, error } = await this.supabase
        .from('content_analysis_cache')
        .select('result, created_at')
        .eq('cache_key', cacheKey)
        .gte('created_at', new Date(Date.now() - this.CACHE_TTL).toISOString())
        .single();
      
      if (error || !data) return null;
      
      return data.result as ContentAnalysisResult;
    } catch (error) {
      console.error('Error obteniendo caché de BD:', error);
      return null;
    }
  }

  private async saveAnalysisResult(result: ContentAnalysisResult): Promise<void> {
    try {
      // Guardar resultado principal
      const { error: resultError } = await this.supabase
        .from('content_analysis_results')
        .insert({
          id: result.id,
          source: result.source,
          basic_analysis: result.basicAnalysis,
          keyword_analysis: result.keywordAnalysis,
          sentiment_analysis: result.sentimentAnalysis,
          entity_analysis: result.entityAnalysis,
          readability_analysis: result.readabilityAnalysis,
          seo_analysis: result.seoAnalysis,
          topic_analysis: result.topicAnalysis,
          structure_analysis: result.structureAnalysis,
          quality_metrics: result.qualityMetrics,
          recommendations: result.recommendations,
          score: result.score,
          created_at: result.createdAt,
          updated_at: result.updatedAt
        });
      
      if (resultError) {
        console.error('Error guardando resultado:', resultError);
      }
      
      // Guardar en caché de BD
      const cacheKey = this.generateCacheKey({
        type: result.source.startsWith('http') ? 'url' : 'text',
        url: result.source.startsWith('http') ? result.source : undefined,
        content: !result.source.startsWith('http') ? result.source : undefined
      } as ContentAnalysisRequest);
      
      const { error: cacheError } = await this.supabase
        .from('content_analysis_cache')
        .upsert({
          cache_key: cacheKey,
          result: result,
          created_at: new Date().toISOString()
        });
      
      if (cacheError) {
        console.error('Error guardando caché:', cacheError);
      }
    } catch (error) {
      console.error('Error en saveAnalysisResult:', error);
    }
  }

  private async recordUsageMetrics(
    request: ContentAnalysisRequest, 
    result: ContentAnalysisResult
  ): Promise<void> {
    try {
      await this.supabase
        .from('content_analysis_usage')
        .insert({
          user_id: request.userId,
          analysis_type: request.type,
          content_length: result.basicAnalysis.wordCount,
          processing_time: 0, // Se calcularía en la implementación real
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
  async getAnalysisHistory(userId: string, limit: number = 10): Promise<ContentAnalysisResult[]> {
    try {
      const { data, error } = await this.supabase
        .from('content_analysis_results')
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

  async getAnalysisById(id: string): Promise<ContentAnalysisResult | null> {
    try {
      const { data, error } = await this.supabase
        .from('content_analysis_results')
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
        .from('content_analysis_results')
        .delete()
        .eq('id', id);
      
      return !error;
    } catch (error) {
      console.error('Error eliminando análisis:', error);
      return false;
    }
  }

  async getUsageStats(userId: string): Promise<{
    totalAnalyses: number;
    averageScore: number;
    mostUsedType: string;
    recentActivity: any[];
  }> {
    try {
      const { data, error } = await this.supabase
        .from('content_analysis_usage')
        .select('*')
        .eq('user_id', userId);
      
      if (error) throw error;
      
      const totalAnalyses = data?.length || 0;
      const averageScore = data?.reduce((sum: number, item: any) => sum + item.score, 0) / totalAnalyses || 0;
      
      // Calcular tipo más usado
      const typeCounts: Record<string, number> = {};
      data?.forEach((item: any) => {
        typeCounts[item.analysis_type] = (typeCounts[item.analysis_type] || 0) + 1;
      });
      
      const mostUsedType = Object.entries(typeCounts)
        .sort(([,a], [,b]) => b - a)[0]?.[0] || 'url';
      
      return {
        totalAnalyses,
        averageScore: Math.round(averageScore),
        mostUsedType,
        recentActivity: data?.slice(-10) || []
      };
    } catch (error) {
      console.error('Error obteniendo estadísticas:', error);
      return {
        totalAnalyses: 0,
        averageScore: 0,
        mostUsedType: 'url',
        recentActivity: []
      };
    }
  }
}

// Instancia singleton del servicio
const contentAnalysisService = new ContentAnalysisService();

export default contentAnalysisService;
export { ContentAnalysisService };