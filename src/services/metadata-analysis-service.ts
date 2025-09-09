/**
 * Servicio de análisis de metadata optimizado para Supabase/Netlify
 * Basado en análisis externo de mejoras para implementación
 * Integra crawlers reales, extracción de datos estructurados y análisis SEO
 */

import { createClient } from '@supabase/supabase-js';
import * as cheerio from 'cheerio';

// Tipos para análisis de metadata
export interface MetadataAnalysisRequest {
  url: string;
  includeImages?: boolean;
  includeLinks?: boolean;
  includeStructuredData?: boolean;
  includeSocialMedia?: boolean;
  includePerformance?: boolean;
  depth?: 'basic' | 'detailed' | 'comprehensive';
  userId?: string;
}

export interface MetadataAnalysisResult {
  id: string;
  url: string;
  timestamp: string;
  basicMetadata: BasicMetadata;
  seoMetadata: SEOMetadata;
  socialMediaMetadata: SocialMediaMetadata;
  structuredData: StructuredDataAnalysis;
  technicalMetadata: TechnicalMetadata;
  imageAnalysis: ImageAnalysis;
  linkAnalysis: LinkAnalysis;
  performanceMetadata: PerformanceMetadata;
  recommendations: MetadataRecommendation[];
  score: {
    overall: number;
    seo: number;
    social: number;
    technical: number;
    accessibility: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface BasicMetadata {
  title: string;
  description: string;
  keywords: string[];
  author: string;
  language: string;
  charset: string;
  viewport: string;
  robots: string;
  canonical: string;
  favicon: string;
}

export interface SEOMetadata {
  titleLength: number;
  descriptionLength: number;
  h1Tags: string[];
  h2Tags: string[];
  h3Tags: string[];
  metaKeywords: string[];
  altTexts: {
    total: number;
    missing: number;
    present: number;
    images: { src: string; alt: string | null }[];
  };
  internalLinks: number;
  externalLinks: number;
  noFollowLinks: number;
  brokenLinks: string[];
  duplicateContent: {
    titles: string[];
    descriptions: string[];
    h1s: string[];
  };
}

export interface SocialMediaMetadata {
  openGraph: {
    title: string;
    description: string;
    image: string;
    url: string;
    type: string;
    siteName: string;
    locale: string;
  };
  twitter: {
    card: string;
    title: string;
    description: string;
    image: string;
    site: string;
    creator: string;
  };
  facebook: {
    appId: string;
    admins: string[];
  };
  linkedin: {
    title: string;
    description: string;
    image: string;
  };
}

export interface StructuredDataAnalysis {
  jsonLd: any[];
  microdata: any[];
  rdfa: any[];
  schemas: {
    type: string;
    count: number;
    valid: boolean;
    errors: string[];
  }[];
  breadcrumbs: {
    present: boolean;
    items: { name: string; url: string }[];
  };
  richSnippets: {
    type: string;
    data: any;
  }[];
}

export interface TechnicalMetadata {
  doctype: string;
  htmlVersion: string;
  responseTime: number;
  statusCode: number;
  redirects: {
    count: number;
    chain: string[];
  };
  headers: {
    contentType: string;
    cacheControl: string;
    lastModified: string;
    etag: string;
    server: string;
    xFrameOptions: string;
    contentSecurityPolicy: string;
  };
  ssl: {
    enabled: boolean;
    certificate: {
      issuer: string;
      validFrom: string;
      validTo: string;
      daysUntilExpiry: number;
    };
  };
  compression: {
    enabled: boolean;
    type: string;
    ratio: number;
  };
}

export interface ImageAnalysis {
  totalImages: number;
  optimizedImages: number;
  unoptimizedImages: number;
  missingAltText: number;
  largeImages: {
    src: string;
    size: number;
    dimensions: { width: number; height: number };
  }[];
  formats: Record<string, number>;
  lazyLoading: {
    implemented: boolean;
    count: number;
  };
}

export interface LinkAnalysis {
  totalLinks: number;
  internalLinks: {
    count: number;
    unique: number;
    links: { href: string; text: string; title?: string }[];
  };
  externalLinks: {
    count: number;
    unique: number;
    domains: Record<string, number>;
    links: { href: string; text: string; rel?: string }[];
  };
  brokenLinks: {
    count: number;
    links: { href: string; status: number; error: string }[];
  };
  redirectLinks: {
    count: number;
    links: { href: string; finalUrl: string; redirectCount: number }[];
  };
}

export interface PerformanceMetadata {
  loadTime: number;
  domContentLoaded: number;
  firstContentfulPaint: number;
  resourcesCount: {
    scripts: number;
    stylesheets: number;
    images: number;
    fonts: number;
    other: number;
  };
  totalSize: {
    html: number;
    css: number;
    js: number;
    images: number;
    fonts: number;
    total: number;
  };
}

export interface MetadataRecommendation {
  category: 'critical' | 'important' | 'minor';
  type: 'seo' | 'social' | 'technical' | 'accessibility' | 'performance';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  effort: 'low' | 'medium' | 'high';
  priority: number;
  implementation: {
    steps: string[];
    code?: string;
    resources: string[];
  };
}

class MetadataAnalysisService {
  private supabase: any;
  private requestCache: Map<string, { result: MetadataAnalysisResult; timestamp: number }>;
  private readonly CACHE_TTL = 300000; // 5 minutos
  private readonly MAX_CACHE_ENTRIES = 50;

  constructor() {
    // Inicializar Supabase
    this.supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Inicializar caché en memoria
    this.requestCache = new Map();
    
    // Limpiar caché periódicamente
    setInterval(() => this.cleanupCache(), 60000);
  }

  /**
   * Análisis principal de metadata
   */
  async analyzeMetadata(request: MetadataAnalysisRequest): Promise<MetadataAnalysisResult> {
    const startTime = Date.now();
    
    try {
      // Validar URL
      if (!this.isValidUrl(request.url)) {
        throw new Error('URL inválida para análisis de metadata');
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

      // Realizar crawling de la página
      const crawlResult = await this.crawlPage(request.url);
      
      // Analizar contenido HTML
      const $ = cheerio.load(crawlResult.html);
      
      // Extraer todos los tipos de metadata
      const basicMetadata = this.extractBasicMetadata($);
      const seoMetadata = await this.extractSEOMetadata($, request.url);
      const socialMediaMetadata = this.extractSocialMediaMetadata($);
      const structuredData = await this.extractStructuredData($);
      const technicalMetadata = this.extractTechnicalMetadata(crawlResult);
      const imageAnalysis = await this.analyzeImages($, request.url);
      const linkAnalysis = await this.analyzeLinks($, request.url);
      const performanceMetadata = this.extractPerformanceMetadata(crawlResult);
      
      // Calcular scores
      const score = this.calculateScores({
        basicMetadata,
        seoMetadata,
        socialMediaMetadata,
        structuredData,
        technicalMetadata,
        imageAnalysis,
        linkAnalysis
      });
      
      // Generar recomendaciones
      const recommendations = await this.generateRecommendations({
        basicMetadata,
        seoMetadata,
        socialMediaMetadata,
        structuredData,
        technicalMetadata,
        imageAnalysis,
        linkAnalysis
      });
      
      // Construir resultado final
      const result: MetadataAnalysisResult = {
        id: crypto.randomUUID(),
        url: request.url,
        timestamp: new Date().toISOString(),
        basicMetadata,
        seoMetadata,
        socialMediaMetadata,
        structuredData,
        technicalMetadata,
        imageAnalysis,
        linkAnalysis,
        performanceMetadata,
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
      console.error('Error en análisis de metadata:', error);
      throw error;
    }
  }

  /**
   * Crawlear página web
   */
  private async crawlPage(url: string): Promise<{
    html: string;
    headers: Record<string, string>;
    statusCode: number;
    responseTime: number;
    redirects: string[];
  }> {
    const startTime = Date.now();
    const redirects: string[] = [];
    let currentUrl = url;
    let redirectCount = 0;
    const maxRedirects = 5;

    while (redirectCount < maxRedirects) {
      try {
        const response = await fetch(currentUrl, {
          method: 'GET',
          headers: {
            'User-Agent': 'Mozilla/5.0 (compatible; Web3Dashboard-MetadataAnalyzer/1.0)',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Accept-Encoding': 'gzip, deflate, br',
            'DNT': '1',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1'
          },
          redirect: 'manual'
        });

        const responseTime = Date.now() - startTime;
        
        // Manejar redirecciones
        if (response.status >= 300 && response.status < 400) {
          const location = response.headers.get('location');
          if (location) {
            redirects.push(currentUrl);
            currentUrl = new URL(location, currentUrl).href;
            redirectCount++;
            continue;
          }
        }

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const html = await response.text();
        const headers: Record<string, string> = {};
        
        response.headers.forEach((value, key) => {
          headers[key.toLowerCase()] = value;
        });

        return {
          html,
          headers,
          statusCode: response.status,
          responseTime,
          redirects
        };
      } catch (error) {
        if (redirectCount === 0) {
          throw error;
        }
        break;
      }
    }

    throw new Error(`Demasiadas redirecciones (${maxRedirects})`);
  }

  /**
   * Extraer metadata básica
   */
  private extractBasicMetadata($: cheerio.CheerioAPI): BasicMetadata {
    return {
      title: $('title').text().trim() || '',
      description: $('meta[name="description"]').attr('content') || '',
      keywords: ($('meta[name="keywords"]').attr('content') || '').split(',').map(k => k.trim()).filter(Boolean),
      author: $('meta[name="author"]').attr('content') || '',
      language: $('html').attr('lang') || $('meta[http-equiv="content-language"]').attr('content') || '',
      charset: $('meta[charset]').attr('charset') || $('meta[http-equiv="content-type"]').attr('content')?.match(/charset=([^;]+)/)?.[1] || '',
      viewport: $('meta[name="viewport"]').attr('content') || '',
      robots: $('meta[name="robots"]').attr('content') || '',
      canonical: $('link[rel="canonical"]').attr('href') || '',
      favicon: $('link[rel="icon"], link[rel="shortcut icon"]').attr('href') || ''
    };
  }

  /**
   * Extraer metadata SEO
   */
  private async extractSEOMetadata($: cheerio.CheerioAPI, baseUrl: string): Promise<SEOMetadata> {
    const title = $('title').text().trim();
    const description = $('meta[name="description"]').attr('content') || '';
    
    // Extraer tags de encabezado
    const h1Tags = $('h1').map((_, el) => $(el).text().trim()).get();
    const h2Tags = $('h2').map((_, el) => $(el).text().trim()).get();
    const h3Tags = $('h3').map((_, el) => $(el).text().trim()).get();
    
    // Analizar imágenes y alt text
    const images = $('img');
    const altTexts = {
      total: images.length,
      missing: 0,
      present: 0,
      images: [] as { src: string; alt: string | null }[]
    };
    
    images.each((_, img) => {
      const $img = $(img);
      const src = $img.attr('src') || '';
      const alt = $img.attr('alt') || null;
      
      altTexts.images.push({ src, alt });
      
      if (alt) {
        altTexts.present++;
      } else {
        altTexts.missing++;
      }
    });
    
    // Analizar enlaces
    const allLinks = $('a[href]');
    let internalLinks = 0;
    let externalLinks = 0;
    let noFollowLinks = 0;
    
    allLinks.each((_, link) => {
      const $link = $(link);
      const href = $link.attr('href') || '';
      const rel = $link.attr('rel') || '';
      
      if (rel.includes('nofollow')) {
        noFollowLinks++;
      }
      
      try {
        const linkUrl = new URL(href, baseUrl);
        const baseUrlObj = new URL(baseUrl);
        
        if (linkUrl.hostname === baseUrlObj.hostname) {
          internalLinks++;
        } else {
          externalLinks++;
        }
      } catch {
        // Enlaces relativos o inválidos se consideran internos
        if (!href.startsWith('http') && !href.startsWith('//')) {
          internalLinks++;
        }
      }
    });
    
    return {
      titleLength: title.length,
      descriptionLength: description.length,
      h1Tags,
      h2Tags,
      h3Tags,
      metaKeywords: ($('meta[name="keywords"]').attr('content') || '').split(',').map(k => k.trim()).filter(Boolean),
      altTexts,
      internalLinks,
      externalLinks,
      noFollowLinks,
      brokenLinks: [], // Se llenarán en análisis de enlaces
      duplicateContent: {
        titles: h1Tags.length > 1 ? h1Tags.filter((title, index) => h1Tags.indexOf(title) !== index) : [],
        descriptions: [],
        h1s: h1Tags.length > 1 ? ['Múltiples H1 encontrados'] : []
      }
    };
  }

  /**
   * Extraer metadata de redes sociales
   */
  private extractSocialMediaMetadata($: cheerio.CheerioAPI): SocialMediaMetadata {
    return {
      openGraph: {
        title: $('meta[property="og:title"]').attr('content') || '',
        description: $('meta[property="og:description"]').attr('content') || '',
        image: $('meta[property="og:image"]').attr('content') || '',
        url: $('meta[property="og:url"]').attr('content') || '',
        type: $('meta[property="og:type"]').attr('content') || '',
        siteName: $('meta[property="og:site_name"]').attr('content') || '',
        locale: $('meta[property="og:locale"]').attr('content') || ''
      },
      twitter: {
        card: $('meta[name="twitter:card"]').attr('content') || '',
        title: $('meta[name="twitter:title"]').attr('content') || '',
        description: $('meta[name="twitter:description"]').attr('content') || '',
        image: $('meta[name="twitter:image"]').attr('content') || '',
        site: $('meta[name="twitter:site"]').attr('content') || '',
        creator: $('meta[name="twitter:creator"]').attr('content') || ''
      },
      facebook: {
        appId: $('meta[property="fb:app_id"]').attr('content') || '',
        admins: ($('meta[property="fb:admins"]').attr('content') || '').split(',').filter(Boolean)
      },
      linkedin: {
        title: $('meta[property="linkedin:title"]').attr('content') || '',
        description: $('meta[property="linkedin:description"]').attr('content') || '',
        image: $('meta[property="linkedin:image"]').attr('content') || ''
      }
    };
  }

  /**
   * Extraer datos estructurados
   */
  private async extractStructuredData($: cheerio.CheerioAPI): Promise<StructuredDataAnalysis> {
    const jsonLd: any[] = [];
    const microdata: any[] = [];
    const rdfa: any[] = [];
    const schemas: { type: string; count: number; valid: boolean; errors: string[] }[] = [];
    
    // Extraer JSON-LD
    $('script[type="application/ld+json"]').each((_, script) => {
      try {
        const content = $(script).html();
        if (content) {
          const data = JSON.parse(content);
          jsonLd.push(data);
          
          // Analizar esquemas
          const schemaType = data['@type'] || 'Unknown';
          const existingSchema = schemas.find(s => s.type === schemaType);
          if (existingSchema) {
            existingSchema.count++;
          } else {
            schemas.push({
              type: schemaType,
              count: 1,
              valid: true,
              errors: []
            });
          }
        }
      } catch (error) {
        console.warn('Error parsing JSON-LD:', error);
      }
    });
    
    // Extraer Microdata
    $('[itemscope]').each((_, element) => {
      const $element = $(element);
      const itemType = $element.attr('itemtype') || '';
      const itemProps: Record<string, string> = {};
      
      $element.find('[itemprop]').each((_, prop) => {
        const $prop = $(prop);
        const propName = $prop.attr('itemprop') || '';
        const propValue = $prop.attr('content') || $prop.text().trim();
        itemProps[propName] = propValue;
      });
      
      microdata.push({
        type: itemType,
        properties: itemProps
      });
    });
    
    // Extraer breadcrumbs
    const breadcrumbs = {
      present: false,
      items: [] as { name: string; url: string }[]
    };
    
    // Buscar breadcrumbs en JSON-LD
    const breadcrumbSchema = jsonLd.find(item => 
      item['@type'] === 'BreadcrumbList' || 
      (Array.isArray(item['@type']) && item['@type'].includes('BreadcrumbList'))
    );
    
    if (breadcrumbSchema && breadcrumbSchema.itemListElement) {
      breadcrumbs.present = true;
      breadcrumbs.items = breadcrumbSchema.itemListElement.map((item: any) => ({
        name: item.name || '',
        url: item.item || ''
      }));
    }
    
    // Rich snippets
    const richSnippets = jsonLd.map(item => ({
      type: item['@type'] || 'Unknown',
      data: item
    }));
    
    return {
      jsonLd,
      microdata,
      rdfa,
      schemas,
      breadcrumbs,
      richSnippets
    };
  }

  /**
   * Extraer metadata técnica
   */
  private extractTechnicalMetadata(crawlResult: any): TechnicalMetadata {
    const headers = crawlResult.headers;
    
    return {
      doctype: '', // Se extraería del HTML parseado
      htmlVersion: '5', // Asumir HTML5 por defecto
      responseTime: crawlResult.responseTime,
      statusCode: crawlResult.statusCode,
      redirects: {
        count: crawlResult.redirects.length,
        chain: crawlResult.redirects
      },
      headers: {
        contentType: headers['content-type'] || '',
        cacheControl: headers['cache-control'] || '',
        lastModified: headers['last-modified'] || '',
        etag: headers['etag'] || '',
        server: headers['server'] || '',
        xFrameOptions: headers['x-frame-options'] || '',
        contentSecurityPolicy: headers['content-security-policy'] || ''
      },
      ssl: {
        enabled: crawlResult.url?.startsWith('https://') || false,
        certificate: {
          issuer: '',
          validFrom: '',
          validTo: '',
          daysUntilExpiry: 0
        }
      },
      compression: {
        enabled: headers['content-encoding'] ? true : false,
        type: headers['content-encoding'] || '',
        ratio: 0
      }
    };
  }

  /**
   * Analizar imágenes
   */
  private async analyzeImages($: cheerio.CheerioAPI, baseUrl: string): Promise<ImageAnalysis> {
    const images = $('img');
    const formats: Record<string, number> = {};
    const largeImages: { src: string; size: number; dimensions: { width: number; height: number } }[] = [];
    
    let optimizedImages = 0;
    let unoptimizedImages = 0;
    let missingAltText = 0;
    
    const lazyLoading = {
      implemented: false,
      count: 0
    };
    
    images.each((_, img) => {
      const $img = $(img);
      const src = $img.attr('src') || '';
      const alt = $img.attr('alt');
      const loading = $img.attr('loading');
      
      // Contar alt text faltante
      if (!alt) {
        missingAltText++;
      }
      
      // Detectar lazy loading
      if (loading === 'lazy' || $img.attr('data-src')) {
        lazyLoading.count++;
        lazyLoading.implemented = true;
      }
      
      // Analizar formato de imagen
      if (src) {
        try {
          const url = new URL(src, baseUrl);
          const extension = url.pathname.split('.').pop()?.toLowerCase() || 'unknown';
          formats[extension] = (formats[extension] || 0) + 1;
          
          // Considerar optimizadas las imágenes modernas
          if (['webp', 'avif', 'svg'].includes(extension)) {
            optimizedImages++;
          } else if (['jpg', 'jpeg', 'png', 'gif'].includes(extension)) {
            unoptimizedImages++;
          }
        } catch {
          formats['unknown'] = (formats['unknown'] || 0) + 1;
          unoptimizedImages++;
        }
      }
    });
    
    return {
      totalImages: images.length,
      optimizedImages,
      unoptimizedImages,
      missingAltText,
      largeImages,
      formats,
      lazyLoading
    };
  }

  /**
   * Analizar enlaces
   */
  private async analyzeLinks($: cheerio.CheerioAPI, baseUrl: string): Promise<LinkAnalysis> {
    const allLinks = $('a[href]');
    const internalLinks: { href: string; text: string; title?: string }[] = [];
    const externalLinks: { href: string; text: string; rel?: string }[] = [];
    const externalDomains: Record<string, number> = {};
    
    allLinks.each((_, link) => {
      const $link = $(link);
      const href = $link.attr('href') || '';
      const text = $link.text().trim();
      const title = $link.attr('title');
      const rel = $link.attr('rel');
      
      try {
        const linkUrl = new URL(href, baseUrl);
        const baseUrlObj = new URL(baseUrl);
        
        if (linkUrl.hostname === baseUrlObj.hostname) {
          internalLinks.push({ href, text, title });
        } else {
          externalLinks.push({ href, text, rel });
          externalDomains[linkUrl.hostname] = (externalDomains[linkUrl.hostname] || 0) + 1;
        }
      } catch {
        // Enlaces relativos o inválidos se consideran internos
        if (!href.startsWith('http') && !href.startsWith('//')) {
          internalLinks.push({ href, text, title });
        }
      }
    });
    
    // Obtener enlaces únicos
    const uniqueInternalLinks = Array.from(new Set(internalLinks.map(l => l.href))).length;
    const uniqueExternalLinks = Array.from(new Set(externalLinks.map(l => l.href))).length;
    
    return {
      totalLinks: allLinks.length,
      internalLinks: {
        count: internalLinks.length,
        unique: uniqueInternalLinks,
        links: internalLinks
      },
      externalLinks: {
        count: externalLinks.length,
        unique: uniqueExternalLinks,
        domains: externalDomains,
        links: externalLinks
      },
      brokenLinks: {
        count: 0,
        links: []
      },
      redirectLinks: {
        count: 0,
        links: []
      }
    };
  }

  /**
   * Extraer metadata de performance
   */
  private extractPerformanceMetadata(crawlResult: any): PerformanceMetadata {
    return {
      loadTime: crawlResult.responseTime,
      domContentLoaded: 0, // Requeriría navegador real
      firstContentfulPaint: 0, // Requeriría navegador real
      resourcesCount: {
        scripts: 0,
        stylesheets: 0,
        images: 0,
        fonts: 0,
        other: 0
      },
      totalSize: {
        html: crawlResult.html?.length || 0,
        css: 0,
        js: 0,
        images: 0,
        fonts: 0,
        total: crawlResult.html?.length || 0
      }
    };
  }

  /**
   * Calcular scores
   */
  private calculateScores(data: any): {
    overall: number;
    seo: number;
    social: number;
    technical: number;
    accessibility: number;
  } {
    // Calcular score SEO
    let seoScore = 100;
    
    // Penalizar título faltante o muy corto/largo
    if (!data.basicMetadata.title) {
      seoScore -= 20;
    } else if (data.basicMetadata.title.length < 30 || data.basicMetadata.title.length > 60) {
      seoScore -= 10;
    }
    
    // Penalizar descripción faltante o muy corta/larga
    if (!data.basicMetadata.description) {
      seoScore -= 15;
    } else if (data.basicMetadata.description.length < 120 || data.basicMetadata.description.length > 160) {
      seoScore -= 8;
    }
    
    // Penalizar H1 faltante o múltiple
    if (data.seoMetadata.h1Tags.length === 0) {
      seoScore -= 15;
    } else if (data.seoMetadata.h1Tags.length > 1) {
      seoScore -= 10;
    }
    
    // Penalizar alt text faltante
    if (data.imageAnalysis.missingAltText > 0) {
      seoScore -= Math.min(20, data.imageAnalysis.missingAltText * 2);
    }
    
    // Calcular score social
    let socialScore = 100;
    
    if (!data.socialMediaMetadata.openGraph.title) socialScore -= 25;
    if (!data.socialMediaMetadata.openGraph.description) socialScore -= 20;
    if (!data.socialMediaMetadata.openGraph.image) socialScore -= 20;
    if (!data.socialMediaMetadata.twitter.card) socialScore -= 15;
    if (!data.socialMediaMetadata.twitter.title) socialScore -= 10;
    if (!data.socialMediaMetadata.twitter.description) socialScore -= 10;
    
    // Calcular score técnico
    let technicalScore = 100;
    
    if (!data.technicalMetadata.ssl.enabled) technicalScore -= 20;
    if (data.technicalMetadata.redirects.count > 2) technicalScore -= 15;
    if (data.technicalMetadata.responseTime > 2000) technicalScore -= 10;
    if (!data.basicMetadata.canonical) technicalScore -= 10;
    
    // Calcular score accesibilidad
    let accessibilityScore = 100;
    
    if (data.imageAnalysis.missingAltText > 0) {
      accessibilityScore -= Math.min(30, data.imageAnalysis.missingAltText * 3);
    }
    if (!data.basicMetadata.language) accessibilityScore -= 10;
    if (data.seoMetadata.h1Tags.length === 0) accessibilityScore -= 15;
    
    // Score general
    const overallScore = Math.round((seoScore + socialScore + technicalScore + accessibilityScore) / 4);
    
    return {
      overall: Math.max(0, overallScore),
      seo: Math.max(0, seoScore),
      social: Math.max(0, socialScore),
      technical: Math.max(0, technicalScore),
      accessibility: Math.max(0, accessibilityScore)
    };
  }

  /**
   * Generar recomendaciones
   */
  private async generateRecommendations(data: any): Promise<MetadataRecommendation[]> {
    const recommendations: MetadataRecommendation[] = [];
    
    // Recomendaciones SEO críticas
    if (!data.basicMetadata.title) {
      recommendations.push({
        category: 'critical',
        type: 'seo',
        title: 'Agregar título de página',
        description: 'La página no tiene un elemento <title>. Es fundamental para SEO.',
        impact: 'high',
        effort: 'low',
        priority: 100,
        implementation: {
          steps: [
            'Agregar elemento <title> en el <head>',
            'Usar 50-60 caracteres',
            'Incluir palabras clave principales',
            'Hacer único para cada página'
          ],
          code: '<title>Tu Título Optimizado Aquí</title>',
          resources: [
            'https://developers.google.com/search/docs/appearance/title-link',
            'https://moz.com/learn/seo/title-tag'
          ]
        }
      });
    }
    
    if (!data.basicMetadata.description) {
      recommendations.push({
        category: 'critical',
        type: 'seo',
        title: 'Agregar meta descripción',
        description: 'La página no tiene meta descripción. Importante para CTR en resultados de búsqueda.',
        impact: 'high',
        effort: 'low',
        priority: 95,
        implementation: {
          steps: [
            'Agregar meta descripción en el <head>',
            'Usar 150-160 caracteres',
            'Incluir call-to-action',
            'Hacer única para cada página'
          ],
          code: '<meta name="description" content="Tu descripción optimizada aquí">',
          resources: [
            'https://developers.google.com/search/docs/appearance/snippet',
            'https://moz.com/learn/seo/meta-description'
          ]
        }
      });
    }
    
    if (data.seoMetadata.h1Tags.length === 0) {
      recommendations.push({
        category: 'critical',
        type: 'seo',
        title: 'Agregar encabezado H1',
        description: 'La página no tiene un encabezado H1. Es importante para la estructura y SEO.',
        impact: 'high',
        effort: 'low',
        priority: 90,
        implementation: {
          steps: [
            'Agregar un único H1 por página',
            'Incluir palabras clave principales',
            'Hacer descriptivo del contenido',
            'Usar jerarquía H1 > H2 > H3'
          ],
          code: '<h1>Tu Encabezado Principal</h1>',
          resources: [
            'https://developers.google.com/search/docs/appearance/structured-data',
            'https://web.dev/headings-and-landmarks/'
          ]
        }
      });
    }
    
    // Recomendaciones de redes sociales
    if (!data.socialMediaMetadata.openGraph.title) {
      recommendations.push({
        category: 'important',
        type: 'social',
        title: 'Agregar Open Graph title',
        description: 'Mejora cómo se ve tu página cuando se comparte en redes sociales.',
        impact: 'medium',
        effort: 'low',
        priority: 80,
        implementation: {
          steps: [
            'Agregar meta property og:title',
            'Puede ser diferente al title principal',
            'Optimizar para redes sociales',
            'Usar 40-60 caracteres'
          ],
          code: '<meta property="og:title" content="Título para redes sociales">',
          resources: [
            'https://ogp.me/',
            'https://developers.facebook.com/docs/sharing/webmasters/'
          ]
        }
      });
    }
    
    if (!data.socialMediaMetadata.openGraph.image) {
      recommendations.push({
        category: 'important',
        type: 'social',
        title: 'Agregar imagen Open Graph',
        description: 'Una imagen atractiva mejora significativamente el engagement en redes sociales.',
        impact: 'medium',
        effort: 'medium',
        priority: 75,
        implementation: {
          steps: [
            'Crear imagen de 1200x630 píxeles',
            'Usar formato JPG o PNG',
            'Incluir texto legible',
            'Agregar meta property og:image'
          ],
          code: '<meta property="og:image" content="https://ejemplo.com/imagen.jpg">',
          resources: [
            'https://developers.facebook.com/docs/sharing/best-practices',
            'https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/summary-card-with-large-image'
          ]
        }
      });
    }
    
    // Recomendaciones técnicas
    if (!data.technicalMetadata.ssl.enabled) {
      recommendations.push({
        category: 'critical',
        type: 'technical',
        title: 'Implementar HTTPS',
        description: 'HTTPS es un factor de ranking y mejora la seguridad y confianza.',
        impact: 'high',
        effort: 'medium',
        priority: 85,
        implementation: {
          steps: [
            'Obtener certificado SSL',
            'Configurar servidor para HTTPS',
            'Redirigir HTTP a HTTPS',
            'Actualizar enlaces internos'
          ],
          resources: [
            'https://developers.google.com/web/fundamentals/security/encrypt-in-transit/why-https',
            'https://letsencrypt.org/'
          ]
        }
      });
    }
    
    // Recomendaciones de accesibilidad
    if (data.imageAnalysis.missingAltText > 0) {
      recommendations.push({
        category: 'important',
        type: 'accessibility',
        title: 'Agregar texto alternativo a imágenes',
        description: `${data.imageAnalysis.missingAltText} imágenes no tienen texto alternativo.`,
        impact: 'medium',
        effort: 'low',
        priority: 70,
        implementation: {
          steps: [
            'Agregar atributo alt a todas las imágenes',
            'Describir el contenido de la imagen',
            'Usar alt="" para imágenes decorativas',
            'Ser conciso pero descriptivo'
          ],
          code: '<img src="imagen.jpg" alt="Descripción de la imagen">',
          resources: [
            'https://www.w3.org/WAI/tutorials/images/',
            'https://webaim.org/techniques/alttext/'
          ]
        }
      });
    }
    
    // Recomendaciones específicas para Netlify
    if (this.isNetlifyDeployment(data.url)) {
      recommendations.push(...this.getNetlifySpecificRecommendations(data));
    }
    
    return recommendations
      .sort((a, b) => b.priority - a.priority)
      .slice(0, 15); // Limitar a 15 recomendaciones
  }

  /**
   * Obtener recomendaciones específicas para Netlify
   */
  private getNetlifySpecificRecommendations(data: any): MetadataRecommendation[] {
    const recommendations: MetadataRecommendation[] = [];
    
    recommendations.push({
      category: 'minor',
      type: 'technical',
      title: 'Optimizar con Netlify Headers',
      description: 'Configura headers personalizados para mejorar SEO y performance.',
      impact: 'low',
      effort: 'low',
      priority: 60,
      implementation: {
        steps: [
          'Crear archivo _headers en public/',
          'Configurar cache headers',
          'Agregar security headers',
          'Configurar CORS si es necesario'
        ],
        code: `/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin`,
        resources: [
          'https://docs.netlify.com/routing/headers/',
          'https://docs.netlify.com/routing/headers/#syntax-for-the-headers-file'
        ]
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

  private getCachedResult(request: MetadataAnalysisRequest): MetadataAnalysisResult | null {
    const cacheKey = this.generateCacheKey(request);
    const cached = this.requestCache.get(cacheKey);
    
    if (cached && (Date.now() - cached.timestamp) < this.CACHE_TTL) {
      return cached.result;
    }
    
    return null;
  }

  private setCachedResult(request: MetadataAnalysisRequest, result: MetadataAnalysisResult): void {
    const cacheKey = this.generateCacheKey(request);
    this.requestCache.set(cacheKey, {
      result,
      timestamp: Date.now()
    });
    
    // Limpiar caché si excede el límite
    if (this.requestCache.size > this.MAX_CACHE_ENTRIES) {
      const oldestKey = this.requestCache.keys().next().value;
      if (oldestKey !== undefined) {
        this.requestCache.delete(oldestKey);
      }
    }
  }

  private async getDbCachedResult(request: MetadataAnalysisRequest): Promise<MetadataAnalysisResult | null> {
    try {
      const cacheKey = this.generateCacheKey(request);
      
      const { data, error } = await this.supabase
        .from('api_cache')
        .select('cache_data')
        .eq('cache_key', cacheKey)
        .gt('expires_at', new Date().toISOString())
        .single();

      if (error || !data) return null;
      
      return data.cache_data as MetadataAnalysisResult;
    } catch (error) {
      console.warn('Error obteniendo caché de metadata:', error);
      return null;
    }
  }

  private async saveAnalysisResult(result: MetadataAnalysisResult): Promise<void> {
    try {
      // Guardar en base de datos
      await this.supabase
        .from('analysis_results')
        .upsert({
          url: result.url,
          tool_type: 'metadata-analysis',
          analysis_data: result,
          user_id: null // Temporal
        });

      // Guardar en caché de base de datos
      const cacheKey = this.generateCacheKey({ url: result.url });
      
      await this.supabase
        .from('api_cache')
        .upsert({
          cache_key: cacheKey,
          cache_data: result,
          expires_at: new Date(Date.now() + this.CACHE_TTL).toISOString()
        });
    } catch (error) {
      console.error('Error guardando resultado de metadata:', error);
    }
  }

  private async recordUsageMetrics(request: MetadataAnalysisRequest, result: MetadataAnalysisResult): Promise<void> {
    try {
      await this.supabase
        .from('usage_analytics')
        .insert({
          tool_type: 'metadata-analysis',
          action_type: 'analysis_completed',
          metadata: {
            url: request.url,
            depth: request.depth,
            overallScore: result.score.overall,
            seoScore: result.score.seo,
            socialScore: result.score.social,
            technicalScore: result.score.technical,
            accessibilityScore: result.score.accessibility,
            recommendationsCount: result.recommendations.length
          }
        });
    } catch (error) {
      console.warn('Error registrando métricas de metadata:', error);
    }
  }

  private generateCacheKey(request: Partial<MetadataAnalysisRequest>): string {
    const { url, depth, includeImages, includeLinks, includeStructuredData } = request;
    return `metadata-analysis:${url}:${depth}:${includeImages}:${includeLinks}:${includeStructuredData}`;
  }

  private cleanupCache(): void {
    const now = Date.now();
    
    for (const [key, cached] of this.requestCache.entries()) {
      if (now - cached.timestamp > this.CACHE_TTL) {
        this.requestCache.delete(key);
      }
    }
  }
}

// Instancia singleton
let metadataAnalysisService: MetadataAnalysisService;

export function getMetadataAnalysisService(): MetadataAnalysisService {
  if (!metadataAnalysisService) {
    metadataAnalysisService = new MetadataAnalysisService();
  }
  return metadataAnalysisService;
}

export default MetadataAnalysisService;