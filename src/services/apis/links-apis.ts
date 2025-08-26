// Links Analysis APIs Service
import { AnthropicService } from './anthropic';
import { GoogleAPIsService } from './google-apis';

export interface LinksAnalysisOptions {
  includeInternalLinks?: boolean;
  includeExternalLinks?: boolean;
  includeBacklinks?: boolean;
  includeBrokenLinks?: boolean;
  depth?: 'basic' | 'detailed' | 'comprehensive';
}

export interface LinkData {
  url: string;
  anchorText: string;
  type: 'internal' | 'external' | 'backlink';
  status: 'active' | 'broken' | 'redirect' | 'unknown';
  authority: number;
  relevance: number;
  nofollow: boolean;
}

export interface LinksAnalysisResult {
  domain: string;
  totalLinks: number;
  internalLinks: LinkData[];
  externalLinks: LinkData[];
  backlinks: LinkData[];
  brokenLinks: LinkData[];
  linkMetrics: {
    internalLinkCount: number;
    externalLinkCount: number;
    backlinkCount: number;
    brokenLinkCount: number;
    averageAuthority: number;
    nofollowRatio: number;
    linkDiversity: number;
  };
  linkQuality: {
    highQualityLinks: number;
    mediumQualityLinks: number;
    lowQualityLinks: number;
    spamLinks: number;
  };
  opportunities: Array<{
    type: 'internal' | 'external' | 'backlink';
    description: string;
    priority: 'low' | 'medium' | 'high' | 'critical';
    impact: string;
    action: string;
  }>;
  recommendations: string[];
  score: number;
}

export class LinksAPIsService {
  private static googleService = new GoogleAPIsService();
  private static anthropicService = new AnthropicService();

  // Método de instancia para compatibilidad con orchestrator
  async analyzeLinks(domain: string, options: LinksAnalysisOptions = {}): Promise<LinksAnalysisResult> {
    return LinksAPIsService.analyzeLinks(domain, options);
  }

  static async analyzeLinks(domain: string, options: LinksAnalysisOptions = {}): Promise<LinksAnalysisResult> {
    try {
      // Simular análisis de enlaces
      await this.delay(1500 + Math.random() * 2000);

      const internalLinks = this.generateInternalLinks(domain);
      const externalLinks = this.generateExternalLinks();
      const backlinks = this.generateBacklinks(domain);
      const brokenLinks = this.generateBrokenLinks();

      const linkMetrics = this.calculateLinkMetrics(internalLinks, externalLinks, backlinks, brokenLinks);
      const linkQuality = this.assessLinkQuality([...internalLinks, ...externalLinks, ...backlinks]);
      const opportunities = this.identifyOpportunities(linkMetrics, linkQuality);
      const recommendations = this.generateLinksRecommendations(opportunities);

      // Calcular puntuación general
      const score = this.calculateLinkScore(linkMetrics, linkQuality);

      return {
        domain,
        totalLinks: internalLinks.length + externalLinks.length + backlinks.length,
        internalLinks,
        externalLinks,
        backlinks,
        brokenLinks,
        linkMetrics,
        linkQuality,
        opportunities,
        recommendations,
        score
      };
    } catch (error) {
      console.error('Error en análisis de enlaces:', error);
      throw new Error(`Error analizando enlaces: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  private static generateInternalLinks(domain: string): LinkData[] {
    const links: LinkData[] = [];
    const pages = ['/', '/about', '/services', '/contact', '/blog', '/products', '/portfolio'];
    
    for (let i = 0; i < Math.floor(Math.random() * 15) + 10; i++) {
      const page = pages[Math.floor(Math.random() * pages.length)];
      links.push({
        url: `https://${domain}${page}`,
        anchorText: this.generateAnchorText(),
        type: 'internal',
        status: Math.random() > 0.1 ? 'active' : 'broken',
        authority: Math.floor(Math.random() * 30) + 70,
        relevance: Math.floor(Math.random() * 25) + 75,
        nofollow: Math.random() > 0.9
      });
    }
    
    return links;
  }

  private static generateExternalLinks(): LinkData[] {
    const links: LinkData[] = [];
    const domains = ['wikipedia.org', 'github.com', 'stackoverflow.com', 'medium.com', 'linkedin.com'];
    
    for (let i = 0; i < Math.floor(Math.random() * 8) + 5; i++) {
      const domain = domains[Math.floor(Math.random() * domains.length)];
      links.push({
        url: `https://${domain}/example-page`,
        anchorText: this.generateAnchorText(),
        type: 'external',
        status: Math.random() > 0.05 ? 'active' : 'broken',
        authority: Math.floor(Math.random() * 40) + 60,
        relevance: Math.floor(Math.random() * 30) + 65,
        nofollow: Math.random() > 0.7
      });
    }
    
    return links;
  }

  private static generateBacklinks(domain: string): LinkData[] {
    const links: LinkData[] = [];
    const referringDomains = ['techcrunch.com', 'forbes.com', 'blog.example.com', 'news.site.com', 'industry.blog'];
    
    for (let i = 0; i < Math.floor(Math.random() * 12) + 8; i++) {
      const referringDomain = referringDomains[Math.floor(Math.random() * referringDomains.length)];
      links.push({
        url: `https://${referringDomain}/article-mentioning-${domain}`,
        anchorText: this.generateAnchorText(),
        type: 'backlink',
        status: 'active',
        authority: Math.floor(Math.random() * 50) + 50,
        relevance: Math.floor(Math.random() * 35) + 60,
        nofollow: Math.random() > 0.6
      });
    }
    
    return links;
  }

  private static generateBrokenLinks(): LinkData[] {
    const links: LinkData[] = [];
    
    for (let i = 0; i < Math.floor(Math.random() * 3) + 1; i++) {
      links.push({
        url: `https://broken-site-${i}.com/404-page`,
        anchorText: this.generateAnchorText(),
        type: Math.random() > 0.5 ? 'external' : 'internal',
        status: 'broken',
        authority: 0,
        relevance: 0,
        nofollow: false
      });
    }
    
    return links;
  }

  private static generateAnchorText(): string {
    const anchors = [
      'Leer más', 'Ver detalles', 'Contactar', 'Servicios', 'Productos',
      'Acerca de', 'Blog', 'Noticias', 'Recursos', 'Documentación',
      'Soporte', 'FAQ', 'Términos', 'Privacidad', 'Inicio'
    ];
    return anchors[Math.floor(Math.random() * anchors.length)];
  }

  private static calculateLinkMetrics(
    internalLinks: LinkData[],
    externalLinks: LinkData[],
    backlinks: LinkData[],
    brokenLinks: LinkData[]
  ) {
    const allLinks = [...internalLinks, ...externalLinks, ...backlinks];
    const activeLinks = allLinks.filter(link => link.status === 'active');
    const nofollowLinks = allLinks.filter(link => link.nofollow);
    
    return {
      internalLinkCount: internalLinks.length,
      externalLinkCount: externalLinks.length,
      backlinkCount: backlinks.length,
      brokenLinkCount: brokenLinks.length,
      averageAuthority: activeLinks.length > 0 
        ? Math.floor(activeLinks.reduce((sum, link) => sum + link.authority, 0) / activeLinks.length)
        : 0,
      nofollowRatio: allLinks.length > 0 
        ? Math.floor((nofollowLinks.length / allLinks.length) * 100)
        : 0,
      linkDiversity: this.calculateLinkDiversity(allLinks)
    };
  }

  private static calculateLinkDiversity(links: LinkData[]): number {
    const domains = new Set(links.map(link => new URL(link.url).hostname));
    return Math.min(Math.floor((domains.size / links.length) * 100), 100);
  }

  private static assessLinkQuality(links: LinkData[]) {
    let highQuality = 0;
    let mediumQuality = 0;
    let lowQuality = 0;
    let spam = 0;

    links.forEach(link => {
      if (link.authority >= 80 && link.relevance >= 80) {
        highQuality++;
      } else if (link.authority >= 60 && link.relevance >= 60) {
        mediumQuality++;
      } else if (link.authority >= 30 && link.relevance >= 30) {
        lowQuality++;
      } else {
        spam++;
      }
    });

    return {
      highQualityLinks: highQuality,
      mediumQualityLinks: mediumQuality,
      lowQualityLinks: lowQuality,
      spamLinks: spam
    };
  }

  private static identifyOpportunities(linkMetrics: any, linkQuality: any) {
    const opportunities = [];

    if (linkMetrics.internalLinkCount < 10) {
      opportunities.push({
        type: 'internal' as const,
        description: 'Insuficientes enlaces internos',
        priority: 'high' as const,
        impact: 'Mejora la navegación y distribución de autoridad',
        action: 'Añadir más enlaces internos estratégicos entre páginas relacionadas'
      });
    }

    if (linkMetrics.backlinkCount < 15) {
      opportunities.push({
        type: 'backlink' as const,
        description: 'Perfil de backlinks limitado',
        priority: 'high' as const,
        impact: 'Incrementa la autoridad del dominio y ranking SEO',
        action: 'Desarrollar estrategia de link building y outreach'
      });
    }

    if (linkMetrics.brokenLinkCount > 0) {
      opportunities.push({
        type: 'internal' as const,
        description: 'Enlaces rotos detectados',
        priority: 'critical' as const,
        impact: 'Mejora la experiencia del usuario y SEO técnico',
        action: 'Reparar o eliminar todos los enlaces rotos'
      });
    }

    if (linkQuality.spamLinks > 0) {
      opportunities.push({
        type: 'external' as const,
        description: 'Enlaces de baja calidad detectados',
        priority: 'medium' as const,
        impact: 'Protege la reputación del sitio',
        action: 'Revisar y desautorizar enlaces spam o de baja calidad'
      });
    }

    if (linkMetrics.linkDiversity < 50) {
      opportunities.push({
        type: 'backlink' as const,
        description: 'Baja diversidad de dominios referentes',
        priority: 'medium' as const,
        impact: 'Fortalece el perfil de enlaces naturales',
        action: 'Buscar backlinks de dominios diversos y relevantes'
      });
    }

    return opportunities;
  }

  private static generateLinksRecommendations(opportunities: any[]) {
    const recommendations = [
      'Implementar estrategia de enlaces internos coherente',
      'Desarrollar programa de link building ético',
      'Auditar y reparar enlaces rotos regularmente',
      'Diversificar el perfil de backlinks',
      'Optimizar texto ancla de enlaces',
      'Monitorear la calidad de enlaces entrantes',
      'Crear contenido linkeable de alta calidad',
      'Establecer relaciones con sitios de autoridad'
    ];

    // Priorizar recomendaciones basadas en oportunidades críticas
    const criticalOpportunities = opportunities.filter(opp => opp.priority === 'critical');
    if (criticalOpportunities.length > 0) {
      recommendations.unshift('Corregir inmediatamente problemas críticos de enlaces');
    }

    return recommendations.slice(0, 8);
  }

  private static calculateLinkScore(linkMetrics: any, linkQuality: any): number {
    let score = 0;
    
    // Puntuación por cantidad de enlaces
    score += Math.min(linkMetrics.internalLinkCount * 2, 30);
    score += Math.min(linkMetrics.backlinkCount * 1.5, 25);
    
    // Puntuación por calidad
    score += linkQuality.highQualityLinks * 3;
    score += linkQuality.mediumQualityLinks * 2;
    score -= linkQuality.spamLinks * 5;
    
    // Penalización por enlaces rotos
    score -= linkMetrics.brokenLinkCount * 10;
    
    // Bonificación por diversidad
    score += Math.min(linkMetrics.linkDiversity / 2, 15);
    
    return Math.max(Math.min(Math.floor(score), 100), 0);
  }

  private static delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export default LinksAPIsService;