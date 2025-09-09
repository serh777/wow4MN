/**
 * Servicio de análisis de backlinks optimizado para Supabase/Netlify
 * Basado en análisis externo de mejoras para implementación
 * Integra múltiples APIs de SEO: Ahrefs, Moz, SEMrush, Majestic
 */

import { createClient } from '@supabase/supabase-js';

// Tipos para análisis de backlinks
export interface BacklinksAnalysisRequest {
  domain: string;
  includeCompetitors?: boolean;
  includeAnchorText?: boolean;
  includeLostBacklinks?: boolean;
  includeNewBacklinks?: boolean;
  includeTopPages?: boolean;
  includeReferringDomains?: boolean;
  depth?: 'basic' | 'detailed' | 'comprehensive';
  timeframe?: '7d' | '30d' | '90d' | '1y';
  userId?: string;
}

export interface BacklinksAnalysisResult {
  id: string;
  domain: string;
  timestamp: string;
  overview: BacklinksOverview;
  backlinksProfile: BacklinksProfile;
  anchorTextAnalysis: AnchorTextAnalysis;
  referringDomains: ReferringDomainsAnalysis;
  topPages: TopPagesAnalysis;
  competitorAnalysis: CompetitorBacklinksAnalysis;
  lostBacklinks: LostBacklinksAnalysis;
  newBacklinks: NewBacklinksAnalysis;
  toxicBacklinks: ToxicBacklinksAnalysis;
  linkBuildingOpportunities: LinkBuildingOpportunity[];
  recommendations: BacklinksRecommendation[];
  score: {
    overall: number;
    authority: number;
    diversity: number;
    quality: number;
    growth: number;
    toxicity: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface BacklinksOverview {
  totalBacklinks: number;
  totalReferringDomains: number;
  totalReferringIPs: number;
  domainRating: number;
  urlRating: number;
  organicTraffic: number;
  organicKeywords: number;
  ahrefsRank: number;
  backlinksGrowth: {
    last7Days: number;
    last30Days: number;
    last90Days: number;
    last1Year: number;
  };
  domainsGrowth: {
    last7Days: number;
    last30Days: number;
    last90Days: number;
    last1Year: number;
  };
  linkVelocity: {
    daily: number;
    weekly: number;
    monthly: number;
  };
}

export interface BacklinksProfile {
  followVsNofollow: {
    follow: number;
    nofollow: number;
    followPercentage: number;
    nofollowPercentage: number;
  };
  linkTypes: {
    text: number;
    image: number;
    redirect: number;
    form: number;
    frame: number;
  };
  platforms: {
    platform: string;
    count: number;
    percentage: number;
    quality: 'high' | 'medium' | 'low';
  }[];
  languages: {
    language: string;
    count: number;
    percentage: number;
  }[];
  countries: {
    country: string;
    count: number;
    percentage: number;
  }[];
  linkAttributes: {
    sponsored: number;
    ugc: number;
    nofollow: number;
    follow: number;
  };
}

export interface AnchorTextAnalysis {
  totalAnchors: number;
  uniqueAnchors: number;
  anchorDistribution: {
    exact: number;
    partial: number;
    branded: number;
    naked: number;
    generic: number;
    other: number;
  };
  topAnchors: {
    anchor: string;
    count: number;
    percentage: number;
    type: 'exact' | 'partial' | 'branded' | 'naked' | 'generic' | 'other';
    firstSeen: string;
    lastSeen: string;
    domains: number;
  }[];
  anchorTrends: {
    anchor: string;
    trend: 'growing' | 'stable' | 'declining';
    change: number;
    timeframe: string;
  }[];
  riskAnalysis: {
    overOptimized: string[];
    suspicious: string[];
    recommendations: string[];
  };
}

export interface ReferringDomainsAnalysis {
  totalDomains: number;
  newDomains: number;
  lostDomains: number;
  domainsByAuthority: {
    high: number; // DR 70+
    medium: number; // DR 30-69
    low: number; // DR 0-29
  };
  topReferringDomains: {
    domain: string;
    domainRating: number;
    backlinks: number;
    firstSeen: string;
    lastSeen: string;
    traffic: number;
    linkType: 'follow' | 'nofollow';
    anchorText: string;
    targetUrl: string;
  }[];
  domainTypes: {
    news: number;
    blogs: number;
    forums: number;
    social: number;
    directories: number;
    government: number;
    education: number;
    other: number;
  };
  industryRelevance: {
    relevant: number;
    partiallyRelevant: number;
    irrelevant: number;
  };
}

export interface TopPagesAnalysis {
  totalPages: number;
  topPages: {
    url: string;
    backlinks: number;
    referringDomains: number;
    organicTraffic: number;
    organicKeywords: number;
    urlRating: number;
    title: string;
    firstSeen: string;
    lastSeen: string;
  }[];
  pageTypes: {
    homepage: number;
    productPages: number;
    blogPosts: number;
    categoryPages: number;
    other: number;
  };
  contentAnalysis: {
    averageWordCount: number;
    averageBacklinks: number;
    topPerformingContentTypes: string[];
  };
}

export interface CompetitorBacklinksAnalysis {
  competitors: {
    domain: string;
    domainRating: number;
    backlinks: number;
    referringDomains: number;
    organicTraffic: number;
    commonBacklinks: number;
    uniqueBacklinks: number;
    linkGap: number;
  }[];
  linkIntersection: {
    domain: string;
    sharedDomains: number;
    opportunityScore: number;
    topSharedDomains: {
      domain: string;
      linksToCompetitor: number;
      linksToYou: number;
      opportunity: 'high' | 'medium' | 'low';
    }[];
  }[];
  competitorGaps: {
    domain: string;
    missingLinks: number;
    topOpportunities: {
      referringDomain: string;
      domainRating: number;
      relevance: number;
      difficulty: 'easy' | 'medium' | 'hard';
    }[];
  }[];
}

export interface LostBacklinksAnalysis {
  totalLost: number;
  lostInTimeframe: {
    last7Days: number;
    last30Days: number;
    last90Days: number;
  };
  lostBacklinks: {
    url: string;
    referringDomain: string;
    domainRating: number;
    anchorText: string;
    lostDate: string;
    reason: 'removed' | 'nofollow' | 'redirect' | 'other';
    recoverability: 'high' | 'medium' | 'low';
    impact: number;
  }[];
  lostByCategory: {
    highAuthority: number;
    mediumAuthority: number;
    lowAuthority: number;
  };
  recoveryOpportunities: {
    domain: string;
    priority: 'high' | 'medium' | 'low';
    contactInfo?: string;
    strategy: string;
  }[];
}

export interface NewBacklinksAnalysis {
  totalNew: number;
  newInTimeframe: {
    last7Days: number;
    last30Days: number;
    last90Days: number;
  };
  newBacklinks: {
    url: string;
    referringDomain: string;
    domainRating: number;
    anchorText: string;
    foundDate: string;
    linkType: 'follow' | 'nofollow';
    quality: 'high' | 'medium' | 'low';
    relevance: number;
  }[];
  acquisitionSources: {
    organic: number;
    outreach: number;
    partnerships: number;
    content: number;
    other: number;
  };
  qualityDistribution: {
    high: number;
    medium: number;
    low: number;
    toxic: number;
  };
}

export interface ToxicBacklinksAnalysis {
  totalToxic: number;
  toxicityScore: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  toxicBacklinks: {
    url: string;
    referringDomain: string;
    toxicityScore: number;
    reasons: string[];
    impact: 'high' | 'medium' | 'low';
    action: 'disavow' | 'monitor' | 'contact';
    priority: number;
  }[];
  toxicityFactors: {
    spamScore: number;
    lowQualityContent: number;
    suspiciousPatterns: number;
    penalizedDomains: number;
    irrelevantSites: number;
  };
  disavowRecommendations: {
    domains: string[];
    urls: string[];
    reasoning: string[];
  };
}

export interface LinkBuildingOpportunity {
  type: 'competitor-gap' | 'broken-link' | 'resource-page' | 'guest-post' | 'mention' | 'directory';
  domain: string;
  url?: string;
  domainRating: number;
  relevance: number;
  difficulty: 'easy' | 'medium' | 'hard';
  priority: 'high' | 'medium' | 'low';
  estimatedValue: number;
  contactInfo?: {
    email?: string;
    social?: string[];
    contactPage?: string;
  };
  strategy: string;
  notes: string;
  status: 'identified' | 'contacted' | 'in-progress' | 'acquired' | 'rejected';
}

export interface BacklinksRecommendation {
  category: 'critical' | 'important' | 'minor';
  type: 'acquisition' | 'cleanup' | 'optimization' | 'monitoring';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  effort: 'low' | 'medium' | 'high';
  priority: number;
  implementation: {
    steps: string[];
    tools?: string[];
    resources: string[];
    timeline: string;
  };
}

class BacklinksAnalysisService {
  private supabase: any;
  private requestCache: Map<string, { result: BacklinksAnalysisResult; timestamp: number }>;
  private readonly CACHE_TTL = 1800000; // 30 minutos
  private readonly MAX_CACHE_ENTRIES = 20;
  private readonly API_ENDPOINTS = {
    ahrefs: 'https://apiv2.ahrefs.com',
    moz: 'https://lsapi.seomoz.com/v2',
    semrush: 'https://api.semrush.com',
    majestic: 'https://api.majestic.com/api/json'
  };

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
   * Análisis principal de backlinks
   */
  async analyzeBacklinks(request: BacklinksAnalysisRequest): Promise<BacklinksAnalysisResult> {
    const startTime = Date.now();
    
    try {
      // Validar dominio
      if (!this.isValidDomain(request.domain)) {
        throw new Error('Dominio inválido');
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

      // Realizar análisis con múltiples APIs
      const [ahrefsData, mozData, semrushData] = await Promise.allSettled([
        this.getAhrefsData(request),
        this.getMozData(request),
        this.getSemrushData(request)
      ]);

      // Combinar datos de múltiples fuentes
      const combinedData = this.combineApiData({
        ahrefs: ahrefsData.status === 'fulfilled' ? ahrefsData.value : null,
        moz: mozData.status === 'fulfilled' ? mozData.value : null,
        semrush: semrushData.status === 'fulfilled' ? semrushData.value : null
      });

      // Procesar análisis detallado
      const overview = this.processOverview(combinedData);
      const backlinksProfile = this.processBacklinksProfile(combinedData);
      const anchorTextAnalysis = await this.processAnchorTextAnalysis(combinedData);
      const referringDomains = this.processReferringDomains(combinedData);
      const topPages = this.processTopPages(combinedData);
      const competitorAnalysis = await this.processCompetitorAnalysis(request, combinedData);
      const lostBacklinks = this.processLostBacklinks(combinedData);
      const newBacklinks = this.processNewBacklinks(combinedData);
      const toxicBacklinks = await this.processToxicBacklinks(combinedData);
      const linkBuildingOpportunities = await this.identifyLinkBuildingOpportunities(request, combinedData);
      
      // Calcular scores
      const score = this.calculateScores({
        overview,
        backlinksProfile,
        anchorTextAnalysis,
        referringDomains,
        toxicBacklinks
      });
      
      // Generar recomendaciones
      const recommendations = await this.generateRecommendations({
        overview,
        backlinksProfile,
        anchorTextAnalysis,
        referringDomains,
        toxicBacklinks,
        linkBuildingOpportunities
      });
      
      // Construir resultado final
      const result: BacklinksAnalysisResult = {
        id: crypto.randomUUID(),
        domain: request.domain,
        timestamp: new Date().toISOString(),
        overview,
        backlinksProfile,
        anchorTextAnalysis,
        referringDomains,
        topPages,
        competitorAnalysis,
        lostBacklinks,
        newBacklinks,
        toxicBacklinks,
        linkBuildingOpportunities,
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
      console.error('Error en análisis de backlinks:', error);
      throw error;
    }
  }

  /**
   * Obtener datos de Ahrefs API
   */
  private async getAhrefsData(request: BacklinksAnalysisRequest): Promise<any> {
    try {
      const apiKey = process.env.AHREFS_API_KEY;
      if (!apiKey) {
        throw new Error('Ahrefs API key no configurada');
      }

      const endpoints = [
        'domain-rating',
        'backlinks',
        'referring-domains',
        'anchors',
        'pages'
      ];

      const requests = endpoints.map(endpoint => 
        fetch(`${this.API_ENDPOINTS.ahrefs}/${endpoint}?target=${request.domain}&token=${apiKey}&mode=domain`, {
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'Web3Dashboard-BacklinksAnalyzer/1.0'
          }
        })
      );

      const responses = await Promise.allSettled(requests);
      const data: any = {};

      for (let i = 0; i < endpoints.length; i++) {
        if (responses[i].status === 'fulfilled') {
          const response = responses[i] as PromiseFulfilledResult<Response>;
          if (response.value.ok) {
            data[endpoints[i]] = await response.value.json();
          }
        }
      }

      return data;
    } catch (error) {
      console.error('Error obteniendo datos de Ahrefs:', error);
      return null;
    }
  }

  /**
   * Obtener datos de Moz API
   */
  private async getMozData(request: BacklinksAnalysisRequest): Promise<any> {
    try {
      const accessId = process.env.MOZ_ACCESS_ID;
      const secretKey = process.env.MOZ_SECRET_KEY;
      
      if (!accessId || !secretKey) {
        throw new Error('Moz API credentials no configuradas');
      }

      // Generar autenticación Moz
      const expires = Math.floor(Date.now() / 1000) + 300;
      const stringToSign = `${accessId}\n${expires}`;
      const signature = this.generateMozSignature(stringToSign, secretKey);

      const response = await fetch(`${this.API_ENDPOINTS.moz}/link_metrics`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${Buffer.from(`${accessId}:${signature}`).toString('base64')}`
        },
        body: JSON.stringify({
          targets: [request.domain],
          metrics: ['domain_authority', 'page_authority', 'spam_score', 'linking_root_domains']
        })
      });

      if (!response.ok) {
        throw new Error(`Moz API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error obteniendo datos de Moz:', error);
      return null;
    }
  }

  /**
   * Obtener datos de SEMrush API
   */
  private async getSemrushData(request: BacklinksAnalysisRequest): Promise<any> {
    try {
      const apiKey = process.env.SEMRUSH_API_KEY;
      if (!apiKey) {
        throw new Error('SEMrush API key no configurada');
      }

      const reports = [
        'backlinks_overview',
        'backlinks',
        'backlinks_anchors',
        'backlinks_refdomains'
      ];

      const requests = reports.map(report => 
        fetch(`${this.API_ENDPOINTS.semrush}/?type=${report}&key=${apiKey}&target=${request.domain}&target_type=root_domain&export_columns=*`)
      );

      const responses = await Promise.allSettled(requests);
      const data: any = {};

      for (let i = 0; i < reports.length; i++) {
        if (responses[i].status === 'fulfilled') {
          const response = responses[i] as PromiseFulfilledResult<Response>;
          if (response.value.ok) {
            const text = await response.value.text();
            data[reports[i]] = this.parseSemrushCsv(text);
          }
        }
      }

      return data;
    } catch (error) {
      console.error('Error obteniendo datos de SEMrush:', error);
      return null;
    }
  }

  /**
   * Combinar datos de múltiples APIs
   */
  private combineApiData(apiData: { ahrefs: any; moz: any; semrush: any }): any {
    const combined: any = {
      backlinks: [],
      referringDomains: [],
      anchors: [],
      metrics: {}
    };

    // Combinar métricas de dominio
    if (apiData.ahrefs?.['domain-rating']) {
      combined.metrics.domainRating = apiData.ahrefs['domain-rating'].domain_rating;
      combined.metrics.backlinks = apiData.ahrefs['domain-rating'].backlinks;
      combined.metrics.referringDomains = apiData.ahrefs['domain-rating'].referring_domains;
    }

    if (apiData.moz) {
      combined.metrics.domainAuthority = apiData.moz.domain_authority;
      combined.metrics.spamScore = apiData.moz.spam_score;
    }

    if (apiData.semrush?.backlinks_overview) {
      combined.metrics.semrushBacklinks = apiData.semrush.backlinks_overview[0]?.backlinks_num;
    }

    // Combinar backlinks
    if (apiData.ahrefs?.backlinks?.backlinks) {
      combined.backlinks = [...combined.backlinks, ...apiData.ahrefs.backlinks.backlinks];
    }

    if (apiData.semrush?.backlinks) {
      combined.backlinks = [...combined.backlinks, ...apiData.semrush.backlinks];
    }

    // Combinar dominios de referencia
    if (apiData.ahrefs?.['referring-domains']?.referring_domains) {
      combined.referringDomains = [...combined.referringDomains, ...apiData.ahrefs['referring-domains'].referring_domains];
    }

    // Combinar anchors
    if (apiData.ahrefs?.anchors?.anchors) {
      combined.anchors = [...combined.anchors, ...apiData.ahrefs.anchors.anchors];
    }

    if (apiData.semrush?.backlinks_anchors) {
      combined.anchors = [...combined.anchors, ...apiData.semrush.backlinks_anchors];
    }

    return combined;
  }

  /**
   * Procesar overview de backlinks
   */
  private processOverview(data: any): BacklinksOverview {
    const metrics = data.metrics || {};
    
    return {
      totalBacklinks: metrics.backlinks || 0,
      totalReferringDomains: metrics.referringDomains || 0,
      totalReferringIPs: metrics.referringIPs || 0,
      domainRating: metrics.domainRating || 0,
      urlRating: metrics.urlRating || 0,
      organicTraffic: metrics.organicTraffic || 0,
      organicKeywords: metrics.organicKeywords || 0,
      ahrefsRank: metrics.ahrefsRank || 0,
      backlinksGrowth: {
        last7Days: this.calculateGrowth(data.backlinks, '7d'),
        last30Days: this.calculateGrowth(data.backlinks, '30d'),
        last90Days: this.calculateGrowth(data.backlinks, '90d'),
        last1Year: this.calculateGrowth(data.backlinks, '1y')
      },
      domainsGrowth: {
        last7Days: this.calculateGrowth(data.referringDomains, '7d'),
        last30Days: this.calculateGrowth(data.referringDomains, '30d'),
        last90Days: this.calculateGrowth(data.referringDomains, '90d'),
        last1Year: this.calculateGrowth(data.referringDomains, '1y')
      },
      linkVelocity: {
        daily: this.calculateVelocity(data.backlinks, 'daily'),
        weekly: this.calculateVelocity(data.backlinks, 'weekly'),
        monthly: this.calculateVelocity(data.backlinks, 'monthly')
      }
    };
  }

  /**
   * Procesar perfil de backlinks
   */
  private processBacklinksProfile(data: any): BacklinksProfile {
    const backlinks = data.backlinks || [];
    
    let followCount = 0;
    let nofollowCount = 0;
    const linkTypes = { text: 0, image: 0, redirect: 0, form: 0, frame: 0 };
    const platforms: Record<string, number> = {};
    const languages: Record<string, number> = {};
    const countries: Record<string, number> = {};
    const linkAttributes = { sponsored: 0, ugc: 0, nofollow: 0, follow: 0 };

    backlinks.forEach((link: any) => {
      // Follow vs Nofollow
      if (link.is_dofollow) {
        followCount++;
        linkAttributes.follow++;
      } else {
        nofollowCount++;
        linkAttributes.nofollow++;
      }

      // Tipos de enlace
      if (link.link_type) {
        linkTypes[link.link_type as keyof typeof linkTypes]++;
      }

      // Plataformas
      if (link.platform) {
        platforms[link.platform] = (platforms[link.platform] || 0) + 1;
      }

      // Idiomas
      if (link.language) {
        languages[link.language] = (languages[link.language] || 0) + 1;
      }

      // Países
      if (link.country) {
        countries[link.country] = (countries[link.country] || 0) + 1;
      }

      // Atributos de enlace
      if (link.is_sponsored) linkAttributes.sponsored++;
      if (link.is_ugc) linkAttributes.ugc++;
    });

    const total = followCount + nofollowCount;

    return {
      followVsNofollow: {
        follow: followCount,
        nofollow: nofollowCount,
        followPercentage: total > 0 ? (followCount / total) * 100 : 0,
        nofollowPercentage: total > 0 ? (nofollowCount / total) * 100 : 0
      },
      linkTypes,
      platforms: Object.entries(platforms)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 10)
        .map(([platform, count]) => ({
          platform,
          count,
          percentage: (count / total) * 100,
          quality: this.assessPlatformQuality(platform)
        })),
      languages: Object.entries(languages)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 10)
        .map(([language, count]) => ({
          language,
          count,
          percentage: (count / total) * 100
        })),
      countries: Object.entries(countries)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 10)
        .map(([country, count]) => ({
          country,
          count,
          percentage: (count / total) * 100
        })),
      linkAttributes
    };
  }

  /**
   * Procesar análisis de anchor text
   */
  private async processAnchorTextAnalysis(data: any): Promise<AnchorTextAnalysis> {
    const anchors = data.anchors || [];
    const anchorCounts: Record<string, any> = {};
    
    // Procesar anchors
    anchors.forEach((anchor: any) => {
      const text = anchor.anchor_text || anchor.anchor || '';
      if (!anchorCounts[text]) {
        anchorCounts[text] = {
          count: 0,
          domains: new Set(),
          firstSeen: anchor.first_seen,
          lastSeen: anchor.last_seen
        };
      }
      anchorCounts[text].count += anchor.backlinks || 1;
      if (anchor.referring_domain) {
        anchorCounts[text].domains.add(anchor.referring_domain);
      }
    });

    const totalAnchors = Object.values(anchorCounts).reduce((sum: number, anchor: any) => sum + anchor.count, 0);
    const uniqueAnchors = Object.keys(anchorCounts).length;

    // Clasificar anchors
    const distribution = { exact: 0, partial: 0, branded: 0, naked: 0, generic: 0, other: 0 };
    const topAnchors = Object.entries(anchorCounts)
      .sort(([,a], [,b]) => (b as any).count - (a as any).count)
      .slice(0, 50)
      .map(([anchor, data]: [string, any]) => {
        const type = this.classifyAnchorText(anchor);
        distribution[type]++;
        
        return {
          anchor,
          count: data.count,
          percentage: (data.count / totalAnchors) * 100,
          type,
          firstSeen: data.firstSeen || '',
          lastSeen: data.lastSeen || '',
          domains: data.domains.size
        };
      });

    // Análisis de riesgo
    const overOptimized = topAnchors
      .filter(anchor => anchor.type === 'exact' && anchor.percentage > 5)
      .map(anchor => anchor.anchor);
    
    const suspicious = topAnchors
      .filter(anchor => anchor.percentage > 15 && anchor.type !== 'branded')
      .map(anchor => anchor.anchor);

    return {
      totalAnchors,
      uniqueAnchors,
      anchorDistribution: {
        exact: (distribution.exact / topAnchors.length) * 100,
        partial: (distribution.partial / topAnchors.length) * 100,
        branded: (distribution.branded / topAnchors.length) * 100,
        naked: (distribution.naked / topAnchors.length) * 100,
        generic: (distribution.generic / topAnchors.length) * 100,
        other: (distribution.other / topAnchors.length) * 100
      },
      topAnchors,
      anchorTrends: [], // Se implementaría con datos históricos
      riskAnalysis: {
        overOptimized,
        suspicious,
        recommendations: this.generateAnchorRecommendations(distribution, overOptimized, suspicious)
      }
    };
  }

  /**
   * Métodos auxiliares
   */
  private isValidDomain(domain: string): boolean {
    const domainRegex = /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+(com|org|net|edu|gov|mil|int|[a-z]{2})$/i;
    return domainRegex.test(domain.replace(/^https?:\/\//, '').replace(/\/.*$/, ''));
  }

  private calculateGrowth(data: any[], timeframe: string): number {
    // Implementación básica - en producción usar datos históricos reales
    const now = new Date();
    let cutoffDate: Date;
    
    switch (timeframe) {
      case '7d':
        cutoffDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        cutoffDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        cutoffDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case '1y':
        cutoffDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        return 0;
    }
    
    return data.filter(item => 
      item.first_seen && new Date(item.first_seen) >= cutoffDate
    ).length;
  }

  private calculateVelocity(data: any[], period: string): number {
    const growth = {
      daily: this.calculateGrowth(data, '7d') / 7,
      weekly: this.calculateGrowth(data, '30d') / 4,
      monthly: this.calculateGrowth(data, '90d') / 3
    };
    
    return Math.round(growth[period as keyof typeof growth] || 0);
  }

  private assessPlatformQuality(platform: string): 'high' | 'medium' | 'low' {
    const highQuality = ['wordpress', 'medium', 'linkedin', 'github', 'stackoverflow'];
    const mediumQuality = ['blogger', 'tumblr', 'reddit', 'quora'];
    
    if (highQuality.includes(platform.toLowerCase())) return 'high';
    if (mediumQuality.includes(platform.toLowerCase())) return 'medium';
    return 'low';
  }

  private classifyAnchorText(anchor: string): 'exact' | 'partial' | 'branded' | 'naked' | 'generic' | 'other' {
    const lowerAnchor = anchor.toLowerCase();
    
    // URLs desnudas
    if (lowerAnchor.includes('http') || lowerAnchor.includes('www.')) {
      return 'naked';
    }
    
    // Anchors genéricos
    const genericTerms = ['click here', 'read more', 'learn more', 'here', 'this', 'link', 'website', 'page'];
    if (genericTerms.some(term => lowerAnchor.includes(term))) {
      return 'generic';
    }
    
    // Anchors de marca (se implementaría con la marca específica)
    // Por ahora, clasificar como 'other'
    return 'other';
  }

  private generateAnchorRecommendations(
    distribution: any, 
    overOptimized: string[], 
    suspicious: string[]
  ): string[] {
    const recommendations: string[] = [];
    
    if (overOptimized.length > 0) {
      recommendations.push('Reducir el uso de anchors exactos sobre-optimizados');
      recommendations.push('Diversificar el perfil de anchor text');
    }
    
    if (suspicious.length > 0) {
      recommendations.push('Revisar anchors con alta concentración');
      recommendations.push('Implementar estrategia de anchor text más natural');
    }
    
    if (distribution.branded < 20) {
      recommendations.push('Aumentar el uso de anchors de marca');
    }
    
    if (distribution.generic < 10) {
      recommendations.push('Incluir más anchors genéricos para naturalidad');
    }
    
    return recommendations;
  }

  private generateMozSignature(stringToSign: string, secretKey: string): string {
    // Implementación básica - en producción usar crypto apropiado
    return Buffer.from(stringToSign + secretKey).toString('base64');
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

  // Continúa en la siguiente parte...
  private processReferringDomains(data: any): ReferringDomainsAnalysis {
    // Implementación placeholder
    return {
      totalDomains: 0,
      newDomains: 0,
      lostDomains: 0,
      domainsByAuthority: { high: 0, medium: 0, low: 0 },
      topReferringDomains: [],
      domainTypes: {
        news: 0, blogs: 0, forums: 0, social: 0,
        directories: 0, government: 0, education: 0, other: 0
      },
      industryRelevance: { relevant: 0, partiallyRelevant: 0, irrelevant: 0 }
    };
  }

  private processTopPages(data: any): TopPagesAnalysis {
    // Implementación placeholder
    return {
      totalPages: 0,
      topPages: [],
      pageTypes: {
        homepage: 0, productPages: 0, blogPosts: 0,
        categoryPages: 0, other: 0
      },
      contentAnalysis: {
        averageWordCount: 0,
        averageBacklinks: 0,
        topPerformingContentTypes: []
      }
    };
  }

  private async processCompetitorAnalysis(request: BacklinksAnalysisRequest, data: any): Promise<CompetitorBacklinksAnalysis> {
    // Implementación placeholder
    return {
      competitors: [],
      linkIntersection: [],
      competitorGaps: []
    };
  }

  private processLostBacklinks(data: any): LostBacklinksAnalysis {
    // Implementación placeholder
    return {
      totalLost: 0,
      lostInTimeframe: { last7Days: 0, last30Days: 0, last90Days: 0 },
      lostBacklinks: [],
      lostByCategory: { highAuthority: 0, mediumAuthority: 0, lowAuthority: 0 },
      recoveryOpportunities: []
    };
  }

  private processNewBacklinks(data: any): NewBacklinksAnalysis {
    // Implementación placeholder
    return {
      totalNew: 0,
      newInTimeframe: { last7Days: 0, last30Days: 0, last90Days: 0 },
      newBacklinks: [],
      acquisitionSources: {
        organic: 0, outreach: 0, partnerships: 0, content: 0, other: 0
      },
      qualityDistribution: { high: 0, medium: 0, low: 0, toxic: 0 }
    };
  }

  private async processToxicBacklinks(data: any): Promise<ToxicBacklinksAnalysis> {
    // Implementación placeholder
    return {
      totalToxic: 0,
      toxicityScore: 0,
      riskLevel: 'low',
      toxicBacklinks: [],
      toxicityFactors: {
        spamScore: 0, lowQualityContent: 0, suspiciousPatterns: 0,
        penalizedDomains: 0, irrelevantSites: 0
      },
      disavowRecommendations: { domains: [], urls: [], reasoning: [] }
    };
  }

  private async identifyLinkBuildingOpportunities(request: BacklinksAnalysisRequest, data: any): Promise<LinkBuildingOpportunity[]> {
    // Implementación placeholder
    return [];
  }

  private calculateScores(data: any): {
    overall: number;
    authority: number;
    diversity: number;
    quality: number;
    growth: number;
    toxicity: number;
  } {
    // Implementación placeholder
    return {
      overall: 75,
      authority: 70,
      diversity: 80,
      quality: 75,
      growth: 70,
      toxicity: 85
    };
  }

  private async generateRecommendations(data: any): Promise<BacklinksRecommendation[]> {
    // Implementación placeholder
    return [];
  }

  /**
   * Métodos de caché y base de datos
   */
  private getCachedResult(request: BacklinksAnalysisRequest): BacklinksAnalysisResult | null {
    const cacheKey = this.generateCacheKey(request);
    const cached = this.requestCache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      return cached.result;
    }
    
    return null;
  }

  private setCachedResult(request: BacklinksAnalysisRequest, result: BacklinksAnalysisResult): void {
    const cacheKey = this.generateCacheKey(request);
    
    if (this.requestCache.size >= this.MAX_CACHE_ENTRIES) {
      const oldestKey = this.requestCache.keys().next().value;
      if (oldestKey) {
        this.requestCache.delete(oldestKey);
      }
    }
    
    this.requestCache.set(cacheKey, {
      result,
      timestamp: Date.now()
    });
  }

  private generateCacheKey(request: BacklinksAnalysisRequest): string {
    const key = `${request.domain}-${request.depth || 'basic'}-${request.timeframe || '30d'}`;
    return Buffer.from(key).toString('base64').substring(0, 32);
  }

  private async getDbCachedResult(request: BacklinksAnalysisRequest): Promise<BacklinksAnalysisResult | null> {
    try {
      const cacheKey = this.generateCacheKey(request);
      
      const { data, error } = await this.supabase
        .from('backlinks_analysis_cache')
        .select('result, created_at')
        .eq('cache_key', cacheKey)
        .gte('created_at', new Date(Date.now() - this.CACHE_TTL).toISOString())
        .single();
      
      if (error || !data) return null;
      
      return data.result as BacklinksAnalysisResult;
    } catch (error) {
      console.error('Error obteniendo caché de BD:', error);
      return null;
    }
  }

  private async saveAnalysisResult(result: BacklinksAnalysisResult): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('backlinks_analysis_results')
        .insert({
          id: result.id,
          domain: result.domain,
          overview: result.overview,
          backlinks_profile: result.backlinksProfile,
          anchor_text_analysis: result.anchorTextAnalysis,
          referring_domains: result.referringDomains,
          top_pages: result.topPages,
          competitor_analysis: result.competitorAnalysis,
          lost_backlinks: result.lostBacklinks,
          new_backlinks: result.newBacklinks,
          toxic_backlinks: result.toxicBacklinks,
          link_building_opportunities: result.linkBuildingOpportunities,
          recommendations: result.recommendations,
          score: result.score,
          created_at: result.createdAt,
          updated_at: result.updatedAt
        });
      
      if (error) {
        console.error('Error guardando resultado:', error);
      }
    } catch (error) {
      console.error('Error en saveAnalysisResult:', error);
    }
  }

  private async recordUsageMetrics(
    request: BacklinksAnalysisRequest, 
    result: BacklinksAnalysisResult,
    processingTime: number
  ): Promise<void> {
    try {
      await this.supabase
        .from('backlinks_analysis_usage')
        .insert({
          user_id: request.userId,
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
  async getAnalysisHistory(userId: string, limit: number = 10): Promise<BacklinksAnalysisResult[]> {
    try {
      const { data, error } = await this.supabase
        .from('backlinks_analysis_results')
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

  async getAnalysisById(id: string): Promise<BacklinksAnalysisResult | null> {
    try {
      const { data, error } = await this.supabase
        .from('backlinks_analysis_results')
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
        .from('backlinks_analysis_results')
        .delete()
        .eq('id', id);
      
      return !error;
    } catch (error) {
      console.error('Error eliminando análisis:', error);
      return false;
    }
  }
}

// Instancia singleton del servicio
const backlinksAnalysisService = new BacklinksAnalysisService();

export default backlinksAnalysisService;
export { BacklinksAnalysisService };