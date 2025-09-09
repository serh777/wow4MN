/**
 * Servicio de análisis de performance optimizado para Supabase/Netlify
 * Basado en análisis externo de mejoras para implementación
 * Integra Google PageSpeed Insights, Lighthouse y Core Web Vitals
 */

import { createClient } from '@supabase/supabase-js';

// Tipos para análisis de performance
export interface PerformanceAnalysisRequest {
  url: string;
  strategy: 'mobile' | 'desktop';
  categories?: ('performance' | 'accessibility' | 'best-practices' | 'seo' | 'pwa')[];
  includeScreenshot?: boolean;
  includeAudits?: boolean;
  locale?: string;
  userId?: string;
}

export interface PerformanceAnalysisResult {
  id: string;
  url: string;
  strategy: string;
  timestamp: string;
  scores: {
    performance: number;
    accessibility: number;
    bestPractices: number;
    seo: number;
    pwa?: number;
  };
  metrics: CoreWebVitals;
  audits: PerformanceAudit[];
  opportunities: PerformanceOpportunity[];
  diagnostics: PerformanceDiagnostic[];
  screenshot?: string;
  metadata: {
    lighthouseVersion: string;
    userAgent: string;
    fetchTime: string;
    environment: EnvironmentInfo;
  };
  recommendations: PerformanceRecommendation[];
  createdAt: string;
  updatedAt: string;
}

export interface CoreWebVitals {
  // Core Web Vitals principales
  lcp: MetricValue; // Largest Contentful Paint
  fid: MetricValue; // First Input Delay
  cls: MetricValue; // Cumulative Layout Shift
  
  // Métricas adicionales importantes
  fcp: MetricValue; // First Contentful Paint
  ttfb: MetricValue; // Time to First Byte
  si: MetricValue; // Speed Index
  tti: MetricValue; // Time to Interactive
  tbt: MetricValue; // Total Blocking Time
  
  // Métricas de red
  networkRequests: number;
  totalByteWeight: number;
  domSize: number;
}

export interface MetricValue {
  value: number;
  displayValue: string;
  score: number;
  scoreDisplayMode: 'numeric' | 'binary';
  description: string;
}

export interface PerformanceAudit {
  id: string;
  title: string;
  description: string;
  score: number | null;
  scoreDisplayMode: string;
  displayValue?: string;
  details?: any;
  errorMessage?: string;
  warnings?: string[];
}

export interface PerformanceOpportunity {
  id: string;
  title: string;
  description: string;
  score: number;
  displayValue: string;
  details: {
    type: string;
    headings: any[];
    items: any[];
  };
  numericValue: number;
  numericUnit: string;
}

export interface PerformanceDiagnostic {
  id: string;
  title: string;
  description: string;
  score: number | null;
  displayValue?: string;
  details?: any;
}

export interface EnvironmentInfo {
  networkUserAgent: string;
  hostUserAgent: string;
  benchmarkIndex: number;
  credits: Record<string, string>;
}

export interface PerformanceRecommendation {
  category: 'critical' | 'important' | 'minor';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  effort: 'low' | 'medium' | 'high';
  savings: {
    bytes?: number;
    ms?: number;
    score?: number;
  };
  implementation: {
    steps: string[];
    resources: string[];
    difficulty: 'easy' | 'medium' | 'hard';
  };
}

// Configuración del servicio
interface PerformanceConfig {
  pageSpeedApiKey: string;
  lighthouseConfig: {
    extends: string;
    settings: {
      onlyCategories: string[];
      skipAudits: string[];
      throttling: {
        rttMs: number;
        throughputKbps: number;
        cpuSlowdownMultiplier: number;
      };
    };
  };
  cacheSettings: {
    ttl: number;
    maxEntries: number;
  };
}

class PerformanceAnalysisService {
  private supabase: any;
  private config: PerformanceConfig;
  private requestCache: Map<string, { result: PerformanceAnalysisResult; timestamp: number }>;

  constructor() {
    // Inicializar Supabase
    this.supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Configuración del servicio
    this.config = {
      pageSpeedApiKey: process.env.GOOGLE_PAGESPEED_API_KEY || '',
      lighthouseConfig: {
        extends: 'lighthouse:default',
        settings: {
          onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
          skipAudits: [],
          throttling: {
            rttMs: 150,
            throughputKbps: 1638.4,
            cpuSlowdownMultiplier: 4
          }
        }
      },
      cacheSettings: {
        ttl: 300000, // 5 minutos
        maxEntries: 100
      }
    };

    // Inicializar caché en memoria
    this.requestCache = new Map();
    
    // Limpiar caché periódicamente
    setInterval(() => this.cleanupCache(), 60000); // Cada minuto
  }

  /**
   * Análisis principal de performance
   */
  async analyzePerformance(request: PerformanceAnalysisRequest): Promise<PerformanceAnalysisResult> {
    const startTime = Date.now();
    
    try {
      // Validar URL
      if (!this.isValidUrl(request.url)) {
        throw new Error('URL inválida para análisis de performance');
      }

      // Verificar caché primero
      const cachedResult = this.getCachedResult(request);
      if (cachedResult) {
        return cachedResult;
      }

      // Verificar caché en Supabase
      const dbCachedResult = await this.getDbCachedResult(request);
      if (dbCachedResult) {
        this.setCachedResult(request, dbCachedResult);
        return dbCachedResult;
      }

      // Ejecutar análisis con PageSpeed Insights
      const pageSpeedResult = await this.runPageSpeedAnalysis(request);
      
      // Procesar y estructurar resultados
      const analysisResult = await this.processPageSpeedResult(pageSpeedResult, request, startTime);
      
      // Generar recomendaciones personalizadas
      analysisResult.recommendations = await this.generateRecommendations(analysisResult);
      
      // Guardar resultado
      await this.saveAnalysisResult(analysisResult);
      
      // Cachear resultado
      this.setCachedResult(request, analysisResult);
      
      // Registrar métricas de uso
      await this.recordUsageMetrics(request, analysisResult);
      
      return analysisResult;
    } catch (error) {
      console.error('Error en análisis de performance:', error);
      throw error;
    }
  }

  /**
   * Ejecutar análisis con Google PageSpeed Insights
   */
  private async runPageSpeedAnalysis(request: PerformanceAnalysisRequest): Promise<any> {
    if (!this.config.pageSpeedApiKey) {
      throw new Error('Google PageSpeed Insights API key no configurada');
    }

    const categories = request.categories || ['performance', 'accessibility', 'best-practices', 'seo'];
    const categoryParams = categories.map(cat => `category=${cat.toUpperCase()}`).join('&');
    
    const apiUrl = new URL('https://www.googleapis.com/pagespeedonline/v5/runPagespeed');
    apiUrl.searchParams.set('url', request.url);
    apiUrl.searchParams.set('key', this.config.pageSpeedApiKey);
    apiUrl.searchParams.set('strategy', request.strategy);
    
    if (request.locale) {
      apiUrl.searchParams.set('locale', request.locale);
    }
    
    if (request.includeScreenshot) {
      apiUrl.searchParams.set('screenshot', 'true');
    }
    
    // Agregar categorías
    categories.forEach(category => {
      apiUrl.searchParams.append('category', category.toUpperCase());
    });

    const response = await fetch(apiUrl.toString(), {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Web3Dashboard-PerformanceAnalyzer/1.0'
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`PageSpeed API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
    }

    return await response.json();
  }

  /**
   * Procesar resultados de PageSpeed Insights
   */
  private async processPageSpeedResult(
    pageSpeedData: any,
    request: PerformanceAnalysisRequest,
    startTime: number
  ): Promise<PerformanceAnalysisResult> {
    const lighthouseResult = pageSpeedData.lighthouseResult;
    const loadingExperience = pageSpeedData.loadingExperience;
    
    // Extraer scores de categorías
    const scores = {
      performance: Math.round((lighthouseResult.categories.performance?.score || 0) * 100),
      accessibility: Math.round((lighthouseResult.categories.accessibility?.score || 0) * 100),
      bestPractices: Math.round((lighthouseResult.categories['best-practices']?.score || 0) * 100),
      seo: Math.round((lighthouseResult.categories.seo?.score || 0) * 100),
      pwa: lighthouseResult.categories.pwa ? Math.round(lighthouseResult.categories.pwa.score * 100) : undefined
    };

    // Extraer Core Web Vitals
    const metrics = this.extractCoreWebVitals(lighthouseResult.audits);
    
    // Extraer auditorías
    const audits = this.extractAudits(lighthouseResult.audits);
    
    // Extraer oportunidades de mejora
    const opportunities = this.extractOpportunities(lighthouseResult.audits);
    
    // Extraer diagnósticos
    const diagnostics = this.extractDiagnostics(lighthouseResult.audits);
    
    // Extraer screenshot si está disponible
    const screenshot = request.includeScreenshot && lighthouseResult.audits['final-screenshot'] 
      ? lighthouseResult.audits['final-screenshot'].details?.data 
      : undefined;

    return {
      id: crypto.randomUUID(),
      url: request.url,
      strategy: request.strategy,
      timestamp: new Date().toISOString(),
      scores,
      metrics,
      audits,
      opportunities,
      diagnostics,
      screenshot,
      metadata: {
        lighthouseVersion: lighthouseResult.lighthouseVersion,
        userAgent: lighthouseResult.userAgent,
        fetchTime: lighthouseResult.fetchTime,
        environment: lighthouseResult.environment
      },
      recommendations: [], // Se llenarán después
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  /**
   * Extraer Core Web Vitals de las auditorías
   */
  private extractCoreWebVitals(audits: any): CoreWebVitals {
    const getMetricValue = (auditId: string): MetricValue => {
      const audit = audits[auditId];
      if (!audit) {
        return {
          value: 0,
          displayValue: 'N/A',
          score: 0,
          scoreDisplayMode: 'numeric',
          description: 'Métrica no disponible'
        };
      }
      
      return {
        value: audit.numericValue || 0,
        displayValue: audit.displayValue || 'N/A',
        score: audit.score || 0,
        scoreDisplayMode: audit.scoreDisplayMode || 'numeric',
        description: audit.description || ''
      };
    };

    return {
      lcp: getMetricValue('largest-contentful-paint'),
      fid: getMetricValue('max-potential-fid'),
      cls: getMetricValue('cumulative-layout-shift'),
      fcp: getMetricValue('first-contentful-paint'),
      ttfb: getMetricValue('server-response-time'),
      si: getMetricValue('speed-index'),
      tti: getMetricValue('interactive'),
      tbt: getMetricValue('total-blocking-time'),
      networkRequests: audits['network-requests']?.details?.items?.length || 0,
      totalByteWeight: audits['total-byte-weight']?.numericValue || 0,
      domSize: audits['dom-size']?.numericValue || 0
    };
  }

  /**
   * Extraer auditorías relevantes
   */
  private extractAudits(audits: any): PerformanceAudit[] {
    const relevantAudits = [
      'first-contentful-paint',
      'largest-contentful-paint',
      'speed-index',
      'interactive',
      'total-blocking-time',
      'cumulative-layout-shift',
      'server-response-time',
      'render-blocking-resources',
      'unused-css-rules',
      'unused-javascript',
      'modern-image-formats',
      'offscreen-images',
      'minify-css',
      'minify-javascript',
      'efficient-animated-content',
      'duplicated-javascript'
    ];

    return relevantAudits
      .filter(auditId => audits[auditId])
      .map(auditId => {
        const audit = audits[auditId];
        return {
          id: auditId,
          title: audit.title,
          description: audit.description,
          score: audit.score,
          scoreDisplayMode: audit.scoreDisplayMode,
          displayValue: audit.displayValue,
          details: audit.details,
          errorMessage: audit.errorMessage,
          warnings: audit.warnings
        };
      });
  }

  /**
   * Extraer oportunidades de mejora
   */
  private extractOpportunities(audits: any): PerformanceOpportunity[] {
    const opportunityAudits = [
      'render-blocking-resources',
      'unused-css-rules',
      'unused-javascript',
      'modern-image-formats',
      'offscreen-images',
      'minify-css',
      'minify-javascript',
      'efficient-animated-content',
      'uses-text-compression',
      'uses-responsive-images',
      'uses-optimized-images',
      'uses-webp-images',
      'uses-rel-preconnect',
      'uses-rel-preload',
      'font-display',
      'third-party-summary'
    ];

    return opportunityAudits
      .filter(auditId => audits[auditId] && audits[auditId].details)
      .map(auditId => {
        const audit = audits[auditId];
        return {
          id: auditId,
          title: audit.title,
          description: audit.description,
          score: audit.score || 0,
          displayValue: audit.displayValue || '',
          details: audit.details,
          numericValue: audit.numericValue || 0,
          numericUnit: audit.numericUnit || 'ms'
        };
      })
      .filter(opportunity => opportunity.numericValue > 0)
      .sort((a, b) => b.numericValue - a.numericValue); // Ordenar por impacto
  }

  /**
   * Extraer diagnósticos
   */
  private extractDiagnostics(audits: any): PerformanceDiagnostic[] {
    const diagnosticAudits = [
      'mainthread-work-breakdown',
      'bootup-time',
      'uses-passive-event-listeners',
      'font-display',
      'third-party-summary',
      'third-party-facades',
      'largest-contentful-paint-element',
      'layout-shift-elements',
      'long-tasks',
      'non-composited-animations',
      'unsized-images'
    ];

    return diagnosticAudits
      .filter(auditId => audits[auditId])
      .map(auditId => {
        const audit = audits[auditId];
        return {
          id: auditId,
          title: audit.title,
          description: audit.description,
          score: audit.score,
          displayValue: audit.displayValue,
          details: audit.details
        };
      });
  }

  /**
   * Generar recomendaciones personalizadas
   */
  private async generateRecommendations(result: PerformanceAnalysisResult): Promise<PerformanceRecommendation[]> {
    const recommendations: PerformanceRecommendation[] = [];
    
    // Recomendaciones basadas en Core Web Vitals
    if (result.metrics.lcp.score < 0.9) {
      recommendations.push({
        category: 'critical',
        title: 'Optimizar Largest Contentful Paint (LCP)',
        description: `Tu LCP es de ${result.metrics.lcp.displayValue}, que está por encima del umbral recomendado de 2.5s.`,
        impact: 'high',
        effort: 'medium',
        savings: {
          ms: Math.max(0, result.metrics.lcp.value - 2500),
          score: 15
        },
        implementation: {
          steps: [
            'Optimizar imágenes y usar formatos modernos (WebP, AVIF)',
            'Implementar lazy loading para imágenes below-the-fold',
            'Usar preload para recursos críticos',
            'Optimizar servidor y CDN para reducir TTFB',
            'Eliminar recursos que bloquean el renderizado'
          ],
          resources: [
            'https://web.dev/lcp/',
            'https://web.dev/optimize-lcp/'
          ],
          difficulty: 'medium'
        }
      });
    }

    if (result.metrics.cls.score < 0.9) {
      recommendations.push({
        category: 'critical',
        title: 'Reducir Cumulative Layout Shift (CLS)',
        description: `Tu CLS es de ${result.metrics.cls.displayValue}, causando cambios inesperados en el layout.`,
        impact: 'high',
        effort: 'low',
        savings: {
          score: 10
        },
        implementation: {
          steps: [
            'Especificar dimensiones para imágenes y videos',
            'Reservar espacio para anuncios y embeds',
            'Evitar insertar contenido dinámico above-the-fold',
            'Usar transform y opacity para animaciones',
            'Precargar fuentes web con font-display: swap'
          ],
          resources: [
            'https://web.dev/cls/',
            'https://web.dev/optimize-cls/'
          ],
          difficulty: 'easy'
        }
      });
    }

    if (result.metrics.tbt.score < 0.9) {
      recommendations.push({
        category: 'important',
        title: 'Reducir Total Blocking Time (TBT)',
        description: `Tu TBT es de ${result.metrics.tbt.displayValue}, bloqueando la interactividad.`,
        impact: 'medium',
        effort: 'high',
        savings: {
          ms: Math.max(0, result.metrics.tbt.value - 200),
          score: 12
        },
        implementation: {
          steps: [
            'Dividir JavaScript en chunks más pequeños',
            'Implementar code splitting',
            'Usar Web Workers para tareas pesadas',
            'Optimizar third-party scripts',
            'Implementar lazy loading para JavaScript no crítico'
          ],
          resources: [
            'https://web.dev/tbt/',
            'https://web.dev/reduce-javascript-payloads-with-code-splitting/'
          ],
          difficulty: 'hard'
        }
      });
    }

    // Recomendaciones basadas en oportunidades
    const topOpportunities = result.opportunities
      .filter(opp => opp.numericValue > 500) // Más de 500ms de ahorro
      .slice(0, 3); // Top 3 oportunidades

    for (const opportunity of topOpportunities) {
      recommendations.push(this.createRecommendationFromOpportunity(opportunity));
    }

    // Recomendaciones específicas para Netlify
    if (this.isNetlifyDeployment(result.url)) {
      recommendations.push(...this.getNetlifySpecificRecommendations(result));
    }

    return recommendations.slice(0, 10); // Limitar a 10 recomendaciones
  }

  /**
   * Crear recomendación desde oportunidad
   */
  private createRecommendationFromOpportunity(opportunity: PerformanceOpportunity): PerformanceRecommendation {
    const recommendationMap: Record<string, Partial<PerformanceRecommendation>> = {
      'unused-css-rules': {
        title: 'Eliminar CSS no utilizado',
        description: 'Reduce el tamaño de las hojas de estilo eliminando reglas no utilizadas.',
        impact: 'medium',
        effort: 'medium',
        implementation: {
          steps: [
            'Usar herramientas como PurgeCSS o UnCSS',
            'Implementar CSS crítico inline',
            'Cargar CSS no crítico de forma asíncrona',
            'Usar CSS-in-JS para componentes específicos'
          ],
          resources: ['https://web.dev/unused-css-rules/'],
          difficulty: 'medium'
        }
      },
      'unused-javascript': {
        title: 'Eliminar JavaScript no utilizado',
        description: 'Reduce el bundle size eliminando código JavaScript no utilizado.',
        impact: 'high',
        effort: 'high',
        implementation: {
          steps: [
            'Implementar tree shaking',
            'Usar dynamic imports para code splitting',
            'Eliminar dependencias no utilizadas',
            'Usar bundler analysis tools'
          ],
          resources: ['https://web.dev/unused-javascript/'],
          difficulty: 'hard'
        }
      },
      'render-blocking-resources': {
        title: 'Eliminar recursos que bloquean el renderizado',
        description: 'Optimiza la carga de CSS y JavaScript críticos.',
        impact: 'high',
        effort: 'medium',
        implementation: {
          steps: [
            'Inline CSS crítico',
            'Usar async/defer para JavaScript no crítico',
            'Implementar resource hints (preload, prefetch)',
            'Optimizar orden de carga de recursos'
          ],
          resources: ['https://web.dev/render-blocking-resources/'],
          difficulty: 'medium'
        }
      }
    };

    const baseRecommendation = recommendationMap[opportunity.id] || {
      title: opportunity.title,
      description: opportunity.description,
      impact: 'medium' as const,
      effort: 'medium' as const,
      implementation: {
        steps: ['Revisar documentación específica'],
        resources: [],
        difficulty: 'medium' as const
      }
    };

    return {
      category: opportunity.numericValue > 1000 ? 'critical' : 'important',
      ...baseRecommendation,
      savings: {
        ms: opportunity.numericValue,
        bytes: opportunity.details?.items?.reduce((sum: number, item: any) => sum + (item.wastedBytes || 0), 0)
      }
    } as PerformanceRecommendation;
  }

  /**
   * Obtener recomendaciones específicas para Netlify
   */
  private getNetlifySpecificRecommendations(result: PerformanceAnalysisResult): PerformanceRecommendation[] {
    const recommendations: PerformanceRecommendation[] = [];

    // Recomendación para Edge Functions
    if (result.metrics.ttfb.value > 200) {
      recommendations.push({
        category: 'important',
        title: 'Optimizar con Netlify Edge Functions',
        description: 'Usa Edge Functions para reducir latencia y mejorar TTFB.',
        impact: 'medium',
        effort: 'medium',
        savings: {
          ms: Math.max(0, result.metrics.ttfb.value - 100)
        },
        implementation: {
          steps: [
            'Implementar Edge Functions para API calls',
            'Usar edge-side includes (ESI)',
            'Cachear respuestas en el edge',
            'Implementar geolocation-based routing'
          ],
          resources: [
            'https://docs.netlify.com/edge-functions/overview/',
            'https://docs.netlify.com/edge-functions/api/'
          ],
          difficulty: 'medium'
        }
      });
    }

    // Recomendación para optimización de imágenes
    recommendations.push({
      category: 'important',
      title: 'Usar Netlify Image CDN',
      description: 'Optimiza automáticamente imágenes con el CDN de Netlify.',
      impact: 'medium',
      effort: 'low',
      savings: {
        bytes: result.metrics.totalByteWeight * 0.3 // Estimación 30% reducción
      },
      implementation: {
        steps: [
          'Configurar Netlify Image CDN',
          'Usar parámetros de transformación automática',
          'Implementar responsive images',
          'Configurar formatos modernos (WebP, AVIF)'
        ],
        resources: [
          'https://docs.netlify.com/image-cdn/overview/'
        ],
        difficulty: 'easy'
      }
    });

    return recommendations;
  }

  /**
   * Métodos auxiliares
   */
  private isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  private isNetlifyDeployment(url: string): boolean {
    return url.includes('.netlify.app') || url.includes('.netlify.com');
  }

  private getCachedResult(request: PerformanceAnalysisRequest): PerformanceAnalysisResult | null {
    const cacheKey = this.generateCacheKey(request);
    const cached = this.requestCache.get(cacheKey);
    
    if (cached && (Date.now() - cached.timestamp) < this.config.cacheSettings.ttl) {
      return cached.result;
    }
    
    return null;
  }

  private setCachedResult(request: PerformanceAnalysisRequest, result: PerformanceAnalysisResult): void {
    const cacheKey = this.generateCacheKey(request);
    this.requestCache.set(cacheKey, {
      result,
      timestamp: Date.now()
    });
    
    // Limpiar caché si excede el límite
    if (this.requestCache.size > this.config.cacheSettings.maxEntries) {
      const oldestKey = this.requestCache.keys().next().value;
      if (oldestKey !== undefined) {
        this.requestCache.delete(oldestKey);
      }
    }
  }

  private async getDbCachedResult(request: PerformanceAnalysisRequest): Promise<PerformanceAnalysisResult | null> {
    try {
      const cacheKey = this.generateCacheKey(request);
      
      const { data, error } = await this.supabase
        .from('api_cache')
        .select('cache_data')
        .eq('cache_key', cacheKey)
        .gt('expires_at', new Date().toISOString())
        .single();

      if (error || !data) return null;
      
      return data.cache_data as PerformanceAnalysisResult;
    } catch (error) {
      console.warn('Error obteniendo caché de performance:', error);
      return null;
    }
  }

  private async saveAnalysisResult(result: PerformanceAnalysisResult): Promise<void> {
    try {
      // Guardar en base de datos
      await this.supabase
        .from('analysis_results')
        .upsert({
          url: result.url,
          tool_type: 'performance-analysis',
          analysis_data: result,
          user_id: null // Temporal
        });

      // Guardar en caché de base de datos
      const cacheKey = this.generateCacheKey({
        url: result.url,
        strategy: result.strategy as any
      });
      
      await this.supabase
        .from('api_cache')
        .upsert({
          cache_key: cacheKey,
          cache_data: result,
          expires_at: new Date(Date.now() + this.config.cacheSettings.ttl).toISOString()
        });
    } catch (error) {
      console.error('Error guardando resultado de performance:', error);
    }
  }

  private async recordUsageMetrics(request: PerformanceAnalysisRequest, result: PerformanceAnalysisResult): Promise<void> {
    try {
      await this.supabase
        .from('usage_analytics')
        .insert({
          tool_type: 'performance-analysis',
          action_type: 'analysis_completed',
          metadata: {
            url: request.url,
            strategy: request.strategy,
            performanceScore: result.scores.performance,
            lcpValue: result.metrics.lcp.value,
            clsValue: result.metrics.cls.value,
            tbtValue: result.metrics.tbt.value,
            recommendationsCount: result.recommendations.length
          }
        });
    } catch (error) {
      console.warn('Error registrando métricas de performance:', error);
    }
  }

  private generateCacheKey(request: Partial<PerformanceAnalysisRequest>): string {
    const { url, strategy, categories } = request;
    const categoriesStr = categories?.sort().join(',') || 'default';
    return `performance-analysis:${url}:${strategy}:${categoriesStr}`;
  }

  private cleanupCache(): void {
    const now = Date.now();
    const ttl = this.config.cacheSettings.ttl;
    
    for (const [key, cached] of this.requestCache.entries()) {
      if (now - cached.timestamp > ttl) {
        this.requestCache.delete(key);
      }
    }
  }

  /**
   * Análisis comparativo de performance
   */
  async comparePerformance(urls: string[], strategy: 'mobile' | 'desktop' = 'mobile'): Promise<{
    comparison: PerformanceAnalysisResult[];
    summary: {
      best: string;
      worst: string;
      averageScore: number;
      recommendations: string[];
    };
  }> {
    const results = await Promise.all(
      urls.map(url => this.analyzePerformance({ url, strategy }))
    );

    const scores = results.map(r => r.scores.performance);
    const bestIndex = scores.indexOf(Math.max(...scores));
    const worstIndex = scores.indexOf(Math.min(...scores));
    const averageScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;

    return {
      comparison: results,
      summary: {
        best: results[bestIndex].url,
        worst: results[worstIndex].url,
        averageScore: Math.round(averageScore),
        recommendations: [
          'Implementar las mejores prácticas del sitio con mejor performance',
          'Priorizar optimizaciones que beneficien a todos los sitios',
          'Establecer benchmarks basados en el mejor resultado'
        ]
      }
    };
  }
}

// Instancia singleton
let performanceAnalysisService: PerformanceAnalysisService;

export function getPerformanceAnalysisService(): PerformanceAnalysisService {
  if (!performanceAnalysisService) {
    performanceAnalysisService = new PerformanceAnalysisService();
  }
  return performanceAnalysisService;
}

export default PerformanceAnalysisService;