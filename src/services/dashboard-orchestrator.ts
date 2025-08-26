/**
 * Dashboard Orchestrator Service
 * Servicio central para coordinar análisis de múltiples herramientas
 */

import { AnthropicService } from './apis/anthropic';
import { EtherscanService } from './apis/etherscan';
import { AlchemyService } from './apis/alchemy';
import { GoogleAPIsService } from './apis/google-apis';
import { PerformanceAPIsService } from './apis/performance-apis';
import { SecurityAPIsService } from './apis/security-apis';
import { SocialWeb3APIsService } from './apis/social-web3-apis';
import { AuthorityTrackingAPIsService } from './apis/authority-tracking-apis';
import { ContentAuthenticityAPIsService } from './apis/content-authenticity-apis';
import { MetaverseOptimizerAPIsService } from './apis/metaverse-optimizer-apis';
import { EcosystemInteractionsAPIsService } from './apis/ecosystem-interactions-apis';
import { MetadataAPIsService } from './apis/metadata-apis';
import { ContentAPIsService } from './apis/content-apis';
import { LinksAPIsService } from './apis/links-apis';
import { CompetitionAPIsService } from './apis/competition-apis';
import { SmartContractAPIsService } from './apis/smart-contract-apis';
import { HistoricalAPIsService } from './apis/historical-apis';
import { NFTTrackingAPIsService } from './apis/nft-tracking-apis';
import { apiCall, ApiRetryHandler } from '../utils/api-retry-handler';

export interface AnalysisRequest {
  address: string;
  tools: string[];
  isCompleteAudit: boolean;
  options?: {
    timeframe?: string;
    includeAdvanced?: boolean;
    priority?: 'speed' | 'accuracy' | 'comprehensive';
  };
}

export interface AnalysisProgress {
  toolId: string;
  toolName: string;
  status: 'pending' | 'running' | 'completed' | 'error';
  progress: number;
  estimatedTime?: number;
  error?: string;
}

export interface AnalysisResult {
  toolId: string;
  toolName: string;
  status: 'success' | 'error';
  data?: any;
  error?: string;
  executionTime: number;
  insights?: string[];
  recommendations?: string[];
}

export interface DashboardAnalysisResponse {
  requestId: string;
  status: 'running' | 'completed' | 'error';
  progress: AnalysisProgress[];
  results: AnalysisResult[];
  overallScore?: number;
  summary?: {
    totalTools: number;
    completedTools: number;
    successfulTools: number;
    failedTools: number;
    totalExecutionTime: number;
    keyInsights: string[];
    criticalIssues: string[];
    recommendations: string[];
  };
  metadata: {
    address: string;
    timestamp: string;
    isCompleteAudit: boolean;
    toolsRequested: string[];
  };
}

class DashboardOrchestratorService {
  private services: Map<string, any> = new Map();
  private activeAnalyses: Map<string, DashboardAnalysisResponse> = new Map();

  constructor() {
    this.initializeServices();
  }

  private initializeServices() {
    // Inicializar todos los servicios de herramientas
    this.services.set('ai-assistant', new AnthropicService());
    this.services.set('blockchain', new EtherscanService());
    this.services.set('nft-tracking', new NFTTrackingAPIsService());
    this.services.set('keywords', new GoogleAPIsService());
    this.services.set('backlinks', new GoogleAPIsService());
    this.services.set('performance', new PerformanceAPIsService());
    this.services.set('security', new SecurityAPIsService());
    this.services.set('social-web3', new SocialWeb3APIsService());
    this.services.set('authority-tracking', new AuthorityTrackingAPIsService());
    this.services.set('content-authenticity', new ContentAuthenticityAPIsService());
    this.services.set('metaverse-optimizer', new MetaverseOptimizerAPIsService());
    this.services.set('ecosystem-interactions', new EcosystemInteractionsAPIsService());
    
    // Nuevos servicios implementados
    this.services.set('metadata', new MetadataAPIsService());
    this.services.set('content', new ContentAPIsService());
    this.services.set('links', new LinksAPIsService());
    this.services.set('competition', new CompetitionAPIsService());
    this.services.set('smart-contract', new SmartContractAPIsService());
    this.services.set('historical', new HistoricalAPIsService());
    
    // Servicios adicionales para unified results
    this.services.set('security-scan', new SecurityAPIsService());
    this.services.set('social-media', new SocialWeb3APIsService());
    this.services.set('competitor-analysis', new GoogleAPIsService());
  }

  /**
   * Iniciar análisis completo del dashboard
   */
  async startAnalysis(request: AnalysisRequest): Promise<string> {
    const requestId = this.generateRequestId();
    
    // Crear respuesta inicial
    const response: DashboardAnalysisResponse = {
      requestId,
      status: 'running',
      progress: request.tools.map(toolId => ({
        toolId,
        toolName: this.getToolName(toolId),
        status: 'pending',
        progress: 0
      })),
      results: [],
      metadata: {
        address: request.address,
        timestamp: new Date().toISOString(),
        isCompleteAudit: request.isCompleteAudit,
        toolsRequested: request.tools
      }
    };

    this.activeAnalyses.set(requestId, response);

    // Ejecutar análisis en paralelo
    this.executeAnalysisInParallel(requestId, request);

    return requestId;
  }

  /**
   * Obtener estado del análisis
   */
  getAnalysisStatus(requestId: string): DashboardAnalysisResponse | null {
    return this.activeAnalyses.get(requestId) || null;
  }

  /**
   * Ejecutar análisis en paralelo
   */
  private async executeAnalysisInParallel(requestId: string, request: AnalysisRequest) {
    const response = this.activeAnalyses.get(requestId)!;
    
    try {
      // Ejecutar todas las herramientas en paralelo
      const analysisPromises = request.tools.map(toolId => 
        this.executeToolAnalysis(requestId, toolId, request.address, request.options)
      );

      // Esperar a que todas terminen
      const results = await Promise.allSettled(analysisPromises);

      // Procesar resultados
      results.forEach((result, index) => {
        const toolId = request.tools[index];
        if (result.status === 'fulfilled') {
          response.results.push(result.value);
        } else {
          response.results.push({
            toolId,
            toolName: this.getToolName(toolId),
            status: 'error',
            error: result.reason?.message || 'Error desconocido',
            executionTime: 0
          });
        }
      });

      // Generar resumen final
      response.summary = this.generateSummary(response);
      response.overallScore = this.calculateOverallScore(response.results);
      response.status = 'completed';

    } catch (error) {
      console.error('Error en análisis del dashboard:', error);
      response.status = 'error';
    }

    this.activeAnalyses.set(requestId, response);
  }

  /**
   * Ejecutar análisis de una herramienta específica
   */
  private async executeToolAnalysis(
    requestId: string, 
    toolId: string, 
    address: string, 
    options?: any
  ): Promise<AnalysisResult> {
    const startTime = Date.now();
    const response = this.activeAnalyses.get(requestId)!;
    
    // Actualizar progreso
    this.updateProgress(requestId, toolId, 'running', 10);

    try {
      const service = this.services.get(toolId);
      if (!service) {
        throw new Error(`Servicio no encontrado para herramienta: ${toolId}`);
      }

      let data;
      
      // Ejecutar análisis según el tipo de herramienta
      switch (toolId) {
        case 'ai-assistant':
          this.updateProgress(requestId, toolId, 'running', 30);
          data = await service.analyzeWithAI(address, {
            includeBlockchainData: true,
            includeMarketData: true,
            includeSecurityAnalysis: true
          });
          break;

        case 'blockchain':
          this.updateProgress(requestId, toolId, 'running', 40);
          data = await service.getAddressAnalysis(address);
          break;

        case 'nft-tracking':
          this.updateProgress(requestId, toolId, 'running', 35);
          data = await service.analyzeNFT({
            collectionAddress: address,
            blockchain: 'ethereum',
            includePrice: true,
            includeRarity: true,
            includeHistory: true,
            includeMarketplace: true,
            timeframe: '30d'
          });
          break;

        case 'keywords':
          this.updateProgress(requestId, toolId, 'running', 50);
          data = await service.analyzeKeywords(address, {
            includeCompetitors: true,
            includeSearchVolume: true
          });
          break;

        case 'backlinks':
          this.updateProgress(requestId, toolId, 'running', 45);
          data = await apiCall(
            () => service.analyzeBacklinks(address, {
              includeQualityMetrics: true,
              includeCompetitorAnalysis: true
            }),
            'backlinks-service'
          );
          break;

        case 'performance':
          this.updateProgress(requestId, toolId, 'running', 60);
          data = await apiCall(
            () => service.analyzePerformance(address, {
              includeWebVitals: true,
              includeBlockchainMetrics: true
            }),
            'performance-service'
          );
          break;

        case 'security':
          this.updateProgress(requestId, toolId, 'running', 70);
          data = await apiCall(
            () => service.analyzeSecurity(address, {
              includeContractAudit: true,
              includeVulnerabilityCheck: true
            }),
            'security-service'
          );
          break;

        case 'social-web3':
          this.updateProgress(requestId, toolId, 'running', 55);
          data = await apiCall(
            () => service.analyzeSocialWeb3(address, {
              platforms: ['lens', 'farcaster', 'mastodon'],
              includeInfluenceMetrics: true
            }),
            'social-web3-service'
          );
          break;

        case 'authority-tracking':
          this.updateProgress(requestId, toolId, 'running', 65);
          data = await apiCall(
            () => service.analyzeAuthority(address, {
              includeGovernance: true,
              includeSocialMetrics: true
            }),
            'authority-tracking-service'
          );
          break;

        case 'content-authenticity':
          this.updateProgress(requestId, toolId, 'running', 40);
          data = await apiCall(
            () => service.verifyAuthenticity(address, {
              includeBlockchainVerification: true,
              includeIPFSCheck: true
            }),
            'content-authenticity-service'
          );
          break;

        case 'metaverse-optimizer':
          this.updateProgress(requestId, toolId, 'running', 50);
          data = await service.optimizeMetaverse(address, {
            platforms: ['decentraland', 'sandbox', 'vrchat'],
            includePerformanceMetrics: true
          });
          break;

        case 'ecosystem-interactions':
          this.updateProgress(requestId, toolId, 'running', 75);
          data = await service.analyzeEcosystemInteractions(address, {
            includeNetworks: ['ethereum', 'polygon', 'bsc'],
            includeCrossChain: true
          });
          break;

        case 'security-scan':
          this.updateProgress(requestId, toolId, 'running', 70);
          data = await service.analyzeSecurity(address, {
            includeContractAudit: true,
            includeVulnerabilityCheck: true,
            includeSecurityHeaders: true
          });
          break;

        case 'social-media':
          this.updateProgress(requestId, toolId, 'running', 55);
          data = await service.analyzeSocialWeb3(address, {
            platforms: ['lens', 'farcaster', 'mastodon', 'twitter'],
            includeInfluenceMetrics: true,
            includeSocialSentiment: true
          });
          break;

        case 'competitor-analysis':
          this.updateProgress(requestId, toolId, 'running', 60);
          data = await service.analyzeKeywords(address, {
            includeCompetitors: true,
            includeMarketShare: true,
            includeCompetitorBacklinks: true
          });
          break;

        case 'metadata':
          this.updateProgress(requestId, toolId, 'running', 30);
          data = await service.analyzeMetadata(address, {
            includeWebsite: true,
            includeContract: true,
            includeNFT: true
          });
          break;

        case 'content':
          this.updateProgress(requestId, toolId, 'running', 40);
          data = await service.analyzeContent(address, {
            includeMetrics: true,
            includeSEO: true,
            includeAccessibility: true
          });
          break;

        case 'links':
          this.updateProgress(requestId, toolId, 'running', 45);
          data = await service.analyzeLinks(address, {
            includeInternal: true,
            includeExternal: true,
            includeBacklinks: true
          });
          break;

        case 'competition':
          this.updateProgress(requestId, toolId, 'running', 55);
          data = await service.analyzeCompetition(address, {
            includeKeywordGaps: true,
            includeContentGaps: true,
            includeBacklinkGaps: true
          });
          break;

        case 'smart-contract':
          this.updateProgress(requestId, toolId, 'running', 65);
          data = await service.analyzeSmartContract(address, {
            includeSecurity: true,
            includeGasOptimization: true,
            includeCompliance: true
          });
          break;

        case 'historical':
          this.updateProgress(requestId, toolId, 'running', 50);
          data = await service.analyzeHistorical(address, {
            includeTraffic: true,
            includeRanking: true,
            includePerformance: true,
            includeBlockchain: true
          });
          break;

        default:
          throw new Error(`Herramienta no soportada: ${toolId}`);
      }

      // Generar insights con IA
      this.updateProgress(requestId, toolId, 'running', 90);
      const insights = await this.generateInsights(toolId, data, address);
      const recommendations = await this.generateRecommendations(toolId, data, address);

      this.updateProgress(requestId, toolId, 'completed', 100);

      return {
        toolId,
        toolName: this.getToolName(toolId),
        status: 'success',
        data,
        insights,
        recommendations,
        executionTime: Date.now() - startTime
      };

    } catch (error) {
      console.error(`Error en análisis de ${toolId}:`, error);
      
      this.updateProgress(requestId, toolId, 'error', 0);

      return {
        toolId,
        toolName: this.getToolName(toolId),
        status: 'error',
        error: error instanceof Error ? error.message : 'Error desconocido',
        executionTime: Date.now() - startTime
      };
    }
  }

  /**
   * Actualizar progreso de una herramienta
   */
  private updateProgress(
    requestId: string, 
    toolId: string, 
    status: AnalysisProgress['status'], 
    progress: number
  ) {
    const response = this.activeAnalyses.get(requestId);
    if (!response) return;

    const toolProgressIndex = response.progress.findIndex(p => p.toolId === toolId);
    if (toolProgressIndex !== -1) {
      // Crear un nuevo objeto en lugar de modificar propiedades de solo lectura
      response.progress[toolProgressIndex] = {
        ...response.progress[toolProgressIndex],
        status,
        progress
      };
    }

    this.activeAnalyses.set(requestId, response);
  }

  /**
   * Generar insights con IA
   */
  private async generateInsights(toolId: string, data: any, address: string): Promise<string[]> {
    try {
      const aiService = this.services.get('ai-assistant');
      if (!aiService) return [];

      return await aiService.generateInsights(toolId, data, address);
    } catch (error) {
      console.error('Error generando insights:', error);
      return [];
    }
  }

  /**
   * Generar recomendaciones con IA
   */
  private async generateRecommendations(toolId: string, data: any, address: string): Promise<string[]> {
    try {
      const aiService = this.services.get('ai-assistant');
      if (!aiService) return [];

      return await aiService.generateRecommendations(toolId, data, address);
    } catch (error) {
      console.error('Error generando recomendaciones:', error);
      return [];
    }
  }

  /**
   * Generar resumen del análisis
   */
  private generateSummary(response: DashboardAnalysisResponse) {
    const totalTools = response.results.length;
    const completedTools = response.results.filter(r => r.status === 'success').length;
    const successfulTools = completedTools;
    const failedTools = totalTools - completedTools;
    const totalExecutionTime = response.results.reduce((sum, r) => sum + r.executionTime, 0);

    // Recopilar insights y recomendaciones
    const allInsights = response.results.flatMap(r => r.insights || []);
    const allRecommendations = response.results.flatMap(r => r.recommendations || []);
    
    // Identificar issues críticos
    const criticalIssues = response.results
      .filter(r => r.status === 'error')
      .map(r => `Error en ${r.toolName}: ${r.error}`);

    return {
      totalTools,
      completedTools,
      successfulTools,
      failedTools,
      totalExecutionTime,
      keyInsights: allInsights.slice(0, 10), // Top 10 insights
      criticalIssues,
      recommendations: allRecommendations.slice(0, 10) // Top 10 recomendaciones
    };
  }

  /**
   * Calcular puntuación general
   */
  private calculateOverallScore(results: AnalysisResult[]): number {
    const successfulResults = results.filter(r => r.status === 'success');
    if (successfulResults.length === 0) return 0;

    // Calcular puntuación basada en éxito de herramientas y calidad de datos
    const successRate = successfulResults.length / results.length;
    const avgExecutionTime = successfulResults.reduce((sum, r) => sum + r.executionTime, 0) / successfulResults.length;
    
    // Puntuación base por tasa de éxito
    let score = successRate * 70;
    
    // Bonus por velocidad (menos tiempo = mejor puntuación)
    const speedBonus = Math.max(0, 30 - (avgExecutionTime / 1000)); // Bonus hasta 30 puntos
    score += Math.min(speedBonus, 30);

    return Math.round(Math.min(score, 100));
  }

  /**
   * Obtener nombre de herramienta
   */
  private getToolName(toolId: string): string {
    const toolNames: Record<string, string> = {
      'ai-assistant': 'IA Análisis',
      'blockchain': 'Análisis Blockchain',
      'nft-tracking': 'Seguimiento NFT',
      'keywords': 'Análisis de Keywords',
      'backlinks': 'Análisis de Backlinks',
      'performance': 'Análisis de Rendimiento',
      'security': 'Auditoría de Seguridad',
      'social-web3': 'Social Web3',
      'authority-tracking': 'Seguimiento de Autoridad',
      'content-authenticity': 'Autenticidad de Contenido',
      'metaverse-optimizer': 'Optimizador de Metaverso',
      'ecosystem-interactions': 'Interacciones del Ecosistema',
      'metadata': 'Análisis de Metadatos',
      'content': 'Análisis de Contenido',
      'links': 'Análisis de Enlaces',
      'competition': 'Análisis de Competencia',
      'smart-contract': 'Análisis de Smart Contract',
      'historical': 'Análisis Histórico',
      'security-scan': 'Escaneo de Seguridad',
      'social-media': 'Análisis Social Media',
      'competitor-analysis': 'Análisis de Competencia'
    };

    return toolNames[toolId] || toolId;
  }

  /**
   * Generar ID único para la solicitud
   */
  private generateRequestId(): string {
    return `analysis_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Limpiar análisis completados (llamar periódicamente)
   */
  cleanupCompletedAnalyses(maxAge: number = 3600000) { // 1 hora por defecto
    const now = Date.now();
    for (const [requestId, response] of this.activeAnalyses.entries()) {
      const analysisAge = now - new Date(response.metadata.timestamp).getTime();
      if (analysisAge > maxAge && response.status !== 'running') {
        this.activeAnalyses.delete(requestId);
      }
    }
  }
}

export const dashboardOrchestrator = new DashboardOrchestratorService();

