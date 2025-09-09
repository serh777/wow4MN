/**
 * Orquestador de servicios de análisis optimizado para Supabase/Netlify
 * Basado en análisis externo de mejoras para implementación
 * Integra todos los servicios de análisis en una interfaz unificada
 */

import { getAIAnalysisService } from './ai-analysis-service';
import { getBlockchainAnalysisService } from './blockchain-analysis-service';
import { getPerformanceAnalysisService } from './performance-analysis-service';
import { getMetadataAnalysisService } from './metadata-analysis-service';
import contentAnalysisService from './content-analysis-service';
import backlinksAnalysisService from './backlinks-analysis-service';
import keywordsAnalysisService from './keywords-analysis-service';
import linksAnalysisService from './links-analysis-service';
import { web3AnalysisService } from './web3-analysis-service';
import { createClient } from '@supabase/supabase-js';

// Tipos para el orquestador
export interface UnifiedAnalysisRequest {
  url: string;
  analysisTypes: AnalysisType[];
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  userId?: string;
  options?: {
    depth?: 'basic' | 'detailed' | 'comprehensive';
    includeAI?: boolean;
    includeBlockchain?: boolean;
    includePerformance?: boolean;
    includeMetadata?: boolean;
    includeContent?: boolean;
    includeBacklinks?: boolean;
    includeKeywords?: boolean;
    includeLinks?: boolean;
    includeWeb3?: boolean;
    customPrompt?: string;
    targetKeywords?: string[];
    competitorUrls?: string[];
    blockchainAddress?: string;
    network?: string;
  };
}

export type AnalysisType = 
  | 'ai-assistant'
  | 'blockchain'
  | 'performance'
  | 'metadata'
  | 'content'
  | 'backlinks'
  | 'keywords'
  | 'links'
  | 'web3'
  | 'comprehensive';

export interface UnifiedAnalysisResult {
  id: string;
  url: string;
  analysisTypes: AnalysisType[];
  timestamp: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'partial';
  progress: {
    total: number;
    completed: number;
    failed: number;
    current?: string;
  };
  results: {
    aiAnalysis?: any;
    blockchainAnalysis?: any;
    performanceAnalysis?: any;
    metadataAnalysis?: any;
    contentAnalysis?: any;
    backlinksAnalysis?: any;
    keywordsAnalysis?: any;
    linksAnalysis?: any;
    web3Analysis?: any;
  };
  summary: AnalysisSummary;
  recommendations: UnifiedRecommendation[];
  score: {
    overall: number;
    seo: number;
    performance: number;
    security: number;
    content: number;
    technical: number;
  };
  processingTime: number;
  createdAt: string;
  updatedAt: string;
  userId?: string;
}

export interface AnalysisSummary {
  overview: string;
  keyFindings: string[];
  criticalIssues: string[];
  opportunities: string[];
  strengths: string[];
  weaknesses: string[];
  nextSteps: string[];
}

export interface UnifiedRecommendation {
  id: string;
  category: 'seo' | 'performance' | 'security' | 'content' | 'technical' | 'web3';
  priority: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  impact: {
    seo: number;
    performance: number;
    security: number;
    userExperience: number;
    conversion: number;
  };
  implementation: {
    difficulty: 'easy' | 'medium' | 'hard';
    timeEstimate: string;
    resources: string[];
    steps: string[];
    cost: 'free' | 'low' | 'medium' | 'high';
  };
  metrics: {
    before: any;
    expectedAfter: any;
    measurementMethod: string;
  };
  source: AnalysisType;
}

export interface AnalysisProgress {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  currentStep: string;
  estimatedTimeRemaining: number;
  results?: Partial<UnifiedAnalysisResult>;
}

class AnalysisOrchestrator {
  private supabase: any;
  private activeAnalyses: Map<string, AnalysisProgress>;
  private readonly MAX_CONCURRENT_ANALYSES = 5;
  private readonly ANALYSIS_TIMEOUT = 300000; // 5 minutos
  
  constructor() {
    // Inicializar Supabase
    this.supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    
    // Inicializar mapa de análisis activos
    this.activeAnalyses = new Map();
    
    // Limpiar análisis antiguos periódicamente
    setInterval(() => this.cleanupStaleAnalyses(), 60000); // 1 minuto
  }

  /**
   * Ejecutar análisis unificado
   */
  async executeAnalysis(request: UnifiedAnalysisRequest): Promise<string> {
    const analysisId = crypto.randomUUID();
    const startTime = Date.now();
    
    try {
      // Validar request
      this.validateRequest(request);
      
      // Verificar límite de análisis concurrentes
      if (this.activeAnalyses.size >= this.MAX_CONCURRENT_ANALYSES) {
        throw new Error('Límite de análisis concurrentes alcanzado. Intenta más tarde.');
      }
      
      // Inicializar progreso
      const progress: AnalysisProgress = {
        id: analysisId,
        status: 'pending',
        progress: 0,
        currentStep: 'Inicializando análisis',
        estimatedTimeRemaining: this.estimateAnalysisTime(request)
      };
      
      this.activeAnalyses.set(analysisId, progress);
      
      // Ejecutar análisis en background
      this.performAnalysisAsync(analysisId, request, startTime);
      
      return analysisId;
    } catch (error) {
      console.error('Error iniciando análisis:', error);
      throw error;
    }
  }

  /**
   * Obtener progreso de análisis
   */
  getAnalysisProgress(analysisId: string): AnalysisProgress | null {
    return this.activeAnalyses.get(analysisId) || null;
  }

  /**
   * Obtener resultado de análisis
   */
  async getAnalysisResult(analysisId: string): Promise<UnifiedAnalysisResult | null> {
    try {
      const { data, error } = await this.supabase
        .from('unified_analysis_results')
        .select('*')
        .eq('id', analysisId)
        .single();
      
      if (error || !data) {
        return null;
      }
      
      return data as UnifiedAnalysisResult;
    } catch (error) {
      console.error('Error obteniendo resultado:', error);
      return null;
    }
  }

  /**
   * Cancelar análisis
   */
  async cancelAnalysis(analysisId: string): Promise<boolean> {
    try {
      const progress = this.activeAnalyses.get(analysisId);
      if (!progress) {
        return false;
      }
      
      // Marcar como cancelado
      progress.status = 'failed';
      progress.currentStep = 'Análisis cancelado';
      
      // Remover de análisis activos
      this.activeAnalyses.delete(analysisId);
      
      return true;
    } catch (error) {
      console.error('Error cancelando análisis:', error);
      return false;
    }
  }

  /**
   * Obtener historial de análisis
   */
  async getAnalysisHistory(userId?: string, limit: number = 20): Promise<UnifiedAnalysisResult[]> {
    try {
      let query = this.supabase
        .from('unified_analysis_results')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);
      
      if (userId) {
        query = query.eq('user_id', userId);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Error obteniendo historial:', error);
        return [];
      }
      
      return data || [];
    } catch (error) {
      console.error('Error en getAnalysisHistory:', error);
      return [];
    }
  }

  /**
   * Comparar análisis
   */
  async compareAnalyses(analysisId1: string, analysisId2: string): Promise<any> {
    try {
      const [analysis1, analysis2] = await Promise.all([
        this.getAnalysisResult(analysisId1),
        this.getAnalysisResult(analysisId2)
      ]);
      
      if (!analysis1 || !analysis2) {
        throw new Error('Uno o ambos análisis no encontrados');
      }
      
      return {
        analysis1,
        analysis2,
        comparison: {
          scores: {
            overall: {
              analysis1: analysis1.score.overall,
              analysis2: analysis2.score.overall,
              difference: analysis2.score.overall - analysis1.score.overall,
              winner: analysis1.score.overall > analysis2.score.overall ? 'analysis1' : 'analysis2'
            },
            seo: {
              analysis1: analysis1.score.seo,
              analysis2: analysis2.score.seo,
              difference: analysis2.score.seo - analysis1.score.seo,
              winner: analysis1.score.seo > analysis2.score.seo ? 'analysis1' : 'analysis2'
            },
            performance: {
              analysis1: analysis1.score.performance,
              analysis2: analysis2.score.performance,
              difference: analysis2.score.performance - analysis1.score.performance,
              winner: analysis1.score.performance > analysis2.score.performance ? 'analysis1' : 'analysis2'
            }
          },
          recommendations: this.generateComparisonRecommendations(analysis1, analysis2),
          summary: this.generateComparisonSummary(analysis1, analysis2)
        }
      };
    } catch (error) {
      console.error('Error comparando análisis:', error);
      throw error;
    }
  }

  /**
   * Ejecutar análisis asíncrono
   */
  private async performAnalysisAsync(
    analysisId: string, 
    request: UnifiedAnalysisRequest, 
    startTime: number
  ): Promise<void> {
    const progress = this.activeAnalyses.get(analysisId)!;
    
    try {
      progress.status = 'processing';
      progress.currentStep = 'Preparando análisis';
      progress.progress = 5;
      
      // Determinar qué análisis ejecutar
      const analysesToRun = this.determineAnalysesToRun(request);
      const totalSteps = analysesToRun.length;
      let completedSteps = 0;
      
      const results: any = {};
      const errors: any = {};
      
      // Ejecutar análisis en paralelo (con límite)
      const batchSize = 3; // Máximo 3 análisis en paralelo
      
      for (let i = 0; i < analysesToRun.length; i += batchSize) {
        const batch = analysesToRun.slice(i, i + batchSize);
        
        const batchPromises = batch.map(async (analysisType) => {
          try {
            progress.currentStep = `Ejecutando ${analysisType}`;
            const result = await this.executeSpecificAnalysis(analysisType, request);
            results[this.getResultKey(analysisType)] = result;
            completedSteps++;
            progress.progress = Math.round((completedSteps / totalSteps) * 90) + 5;
          } catch (error) {
            console.error(`Error en análisis ${analysisType}:`, error);
            errors[analysisType] = error;
            completedSteps++;
            progress.progress = Math.round((completedSteps / totalSteps) * 90) + 5;
          }
        });
        
        await Promise.allSettled(batchPromises);
      }
      
      // Generar resumen y recomendaciones
      progress.currentStep = 'Generando resumen y recomendaciones';
      progress.progress = 95;
      
      const summary = await this.generateAnalysisSummary(results, request);
      const recommendations = await this.generateUnifiedRecommendations(results, request);
      const score = this.calculateUnifiedScore(results);
      
      // Construir resultado final
      const finalResult: UnifiedAnalysisResult = {
        id: analysisId,
        url: request.url,
        analysisTypes: request.analysisTypes,
        timestamp: new Date().toISOString(),
        status: Object.keys(errors).length > 0 ? 'partial' : 'completed',
        progress: {
          total: totalSteps,
          completed: completedSteps - Object.keys(errors).length,
          failed: Object.keys(errors).length
        },
        results,
        summary,
        recommendations,
        score,
        processingTime: Date.now() - startTime,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        userId: request.userId
      };
      
      // Guardar resultado
      await this.saveAnalysisResult(finalResult);
      
      // Actualizar progreso final
      progress.status = 'completed';
      progress.progress = 100;
      progress.currentStep = 'Análisis completado';
      progress.results = finalResult;
      
      // Remover de análisis activos después de un tiempo
      setTimeout(() => {
        this.activeAnalyses.delete(analysisId);
      }, 300000); // 5 minutos
      
    } catch (error) {
      console.error('Error en análisis asíncrono:', error);
      progress.status = 'failed';
      progress.currentStep = `Error: ${error instanceof Error ? error.message : 'Error desconocido'}`;
      
      // Remover de análisis activos
      setTimeout(() => {
        this.activeAnalyses.delete(analysisId);
      }, 60000); // 1 minuto
    }
  }

  /**
   * Determinar qué análisis ejecutar
   */
  private determineAnalysesToRun(request: UnifiedAnalysisRequest): AnalysisType[] {
    if (request.analysisTypes.includes('comprehensive')) {
      return ['ai-assistant', 'performance', 'metadata', 'content', 'backlinks', 'keywords', 'links'];
    }
    
    const analyses: AnalysisType[] = [];
    
    if (request.analysisTypes.includes('ai-assistant') || request.options?.includeAI) {
      analyses.push('ai-assistant');
    }
    
    if (request.analysisTypes.includes('blockchain') || request.options?.includeBlockchain) {
      analyses.push('blockchain');
    }
    
    if (request.analysisTypes.includes('performance') || request.options?.includePerformance) {
      analyses.push('performance');
    }
    
    if (request.analysisTypes.includes('metadata') || request.options?.includeMetadata) {
      analyses.push('metadata');
    }
    
    if (request.analysisTypes.includes('content') || request.options?.includeContent) {
      analyses.push('content');
    }
    
    if (request.analysisTypes.includes('backlinks') || request.options?.includeBacklinks) {
      analyses.push('backlinks');
    }
    
    if (request.analysisTypes.includes('keywords') || request.options?.includeKeywords) {
      analyses.push('keywords');
    }
    
    if (request.analysisTypes.includes('links') || request.options?.includeLinks) {
      analyses.push('links');
    }
    
    if (request.analysisTypes.includes('web3') || request.options?.includeWeb3) {
      analyses.push('web3');
    }
    
    return analyses;
  }

  /**
   * Ejecutar análisis específico
   */
  private async executeSpecificAnalysis(analysisType: AnalysisType, request: UnifiedAnalysisRequest): Promise<any> {
    const timeout = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Timeout')), this.ANALYSIS_TIMEOUT);
    });
    
    const analysisPromise = (async () => {
      switch (analysisType) {
        case 'ai-assistant':
          return await getAIAnalysisService().analyzeWithAI({
            address: request.url,
            analysisType: 'comprehensive',
            tools: ['seo', 'security', 'performance'],
            options: {
              includeRecommendations: true,
              detailLevel: 'detailed',
              language: 'es'
            },
            userId: request.userId
          });
        
        case 'blockchain':
          if (!request.options?.blockchainAddress) {
            throw new Error('Dirección blockchain requerida');
          }
          return await getBlockchainAnalysisService().analyzeBlockchain({
            address: request.options.blockchainAddress,
            network: request.options.network as any || 'ethereum',
            analysisType: 'contract',
            includeTransactions: true,
            includeTokens: true,
            includeNFTs: true,
            includeDeFi: true,
            userId: request.userId
          });
        
        case 'performance':
          return await getPerformanceAnalysisService().analyzePerformance({
            url: request.url,
            strategy: 'desktop',
            categories: ['performance', 'accessibility', 'best-practices', 'seo'],
            includeScreenshot: true,
            includeAudits: true,
            userId: request.userId
          });
        
        case 'metadata':
          return await getMetadataAnalysisService().analyzeMetadata({
            url: request.url,
            includeStructuredData: true,
            includeSocialMedia: true,
            includeLinks: true,
            includeImages: true,
            depth: request.options?.depth || 'detailed',
            userId: request.userId
          });
        
        case 'content':
          return await contentAnalysisService.analyzeContent({
            url: request.url,
            type: 'url',
            includeKeywords: true,
            includeReadability: true,
            includeSentiment: true,
            includeEntities: true,
            includeTopics: true,
            depth: request.options?.depth || 'detailed',
            userId: request.userId
          });
        
        case 'backlinks':
          return await backlinksAnalysisService.analyzeBacklinks({
            domain: request.url,
            includeCompetitors: true,
            includeAnchorText: true,
            includeReferringDomains: true,
            depth: request.options?.depth || 'detailed',
            userId: request.userId
          });
        
        case 'keywords':
          return await keywordsAnalysisService.analyzeKeywords({
            keywords: request.options?.targetKeywords || ['seo', 'analysis'],
            domain: request.url,
            includeCompetitors: true,
            includeRelatedKeywords: true,
            includeLongTail: true,
            includeQuestions: true,
            depth: request.options?.depth || 'detailed',
            userId: request.userId
          });
        
        case 'links':
          return await linksAnalysisService.analyzeLinks({
            url: request.url,
            includeInternalLinks: true,
            includeExternalLinks: true,
            includeAnchorAnalysis: true,
            includeBrokenLinks: true,
            depth: request.options?.depth || 'detailed',
            userId: request.userId
          });
        
        case 'web3':
          if (!request.options?.blockchainAddress) {
            throw new Error('Dirección Web3 requerida');
          }
          return await web3AnalysisService.analyzeWeb3({
            address: request.options.blockchainAddress,
            network: request.options.network as any || 'ethereum',
            analysisType: 'comprehensive',
            includeTransactions: true,
            includeTokens: true,
            includeNFTs: true,
            includeDeFi: true,
            includeGovernance: true,
            includeSecurity: true,
            userId: request.userId
          });
        
        default:
          throw new Error(`Tipo de análisis no soportado: ${analysisType}`);
      }
    })();
    
    return await Promise.race([analysisPromise, timeout]);
  }

  /**
   * Obtener clave de resultado
   */
  private getResultKey(analysisType: AnalysisType): string {
    const keyMap: Record<AnalysisType, string> = {
      'ai-assistant': 'aiAnalysis',
      'blockchain': 'blockchainAnalysis',
      'performance': 'performanceAnalysis',
      'metadata': 'metadataAnalysis',
      'content': 'contentAnalysis',
      'backlinks': 'backlinksAnalysis',
      'keywords': 'keywordsAnalysis',
      'links': 'linksAnalysis',
      'web3': 'web3Analysis',
      'comprehensive': 'comprehensiveAnalysis'
    };
    
    return keyMap[analysisType] || analysisType;
  }

  /**
   * Generar resumen de análisis
   */
  private async generateAnalysisSummary(results: any, request: UnifiedAnalysisRequest): Promise<AnalysisSummary> {
    const keyFindings: string[] = [];
    const criticalIssues: string[] = [];
    const opportunities: string[] = [];
    const strengths: string[] = [];
    const weaknesses: string[] = [];
    
    // Extraer insights de cada análisis
    Object.entries(results).forEach(([key, result]: [string, any]) => {
      if (result?.recommendations) {
        result.recommendations.forEach((rec: any) => {
          if (rec.priority === 'critical' || rec.priority === 'high') {
            criticalIssues.push(`${key}: ${rec.title}`);
          }
        });
      }
      
      if (result?.opportunities) {
        result.opportunities.forEach((opp: any) => {
          opportunities.push(`${key}: ${opp.title || opp.description}`);
        });
      }
      
      if (result?.score && result.score > 80) {
        strengths.push(`Excelente rendimiento en ${key}`);
      } else if (result?.score && result.score < 50) {
        weaknesses.push(`Área de mejora en ${key}`);
      }
    });
    
    return {
      overview: `Análisis completo de ${request.url} ejecutado con ${Object.keys(results).length} herramientas`,
      keyFindings: keyFindings.slice(0, 5),
      criticalIssues: criticalIssues.slice(0, 5),
      opportunities: opportunities.slice(0, 5),
      strengths: strengths.slice(0, 3),
      weaknesses: weaknesses.slice(0, 3),
      nextSteps: [
        'Revisar issues críticos identificados',
        'Implementar oportunidades de mejora',
        'Monitorear métricas clave',
        'Programar próximo análisis'
      ]
    };
  }

  /**
   * Generar recomendaciones unificadas
   */
  private async generateUnifiedRecommendations(results: any, request: UnifiedAnalysisRequest): Promise<UnifiedRecommendation[]> {
    const recommendations: UnifiedRecommendation[] = [];
    
    // Consolidar recomendaciones de todos los análisis
    Object.entries(results).forEach(([key, result]: [string, any]) => {
      if (result?.recommendations) {
        result.recommendations.forEach((rec: any, index: number) => {
          recommendations.push({
            id: `${key}-${index}`,
            category: this.mapToUnifiedCategory(rec.category || key),
            priority: rec.priority || 'medium',
            title: rec.title,
            description: rec.description,
            impact: {
              seo: rec.impact?.seo || 0,
              performance: rec.impact?.performance || 0,
              security: rec.impact?.security || 0,
              userExperience: rec.impact?.userExperience || 0,
              conversion: rec.impact?.conversion || 0
            },
            implementation: {
              difficulty: rec.implementation?.difficulty || 'medium',
              timeEstimate: rec.implementation?.timeEstimate || 'Unknown',
              resources: rec.implementation?.resources || [],
              steps: rec.implementation?.steps || [],
              cost: rec.implementation?.cost || 'medium'
            },
            metrics: {
              before: rec.metrics?.before || null,
              expectedAfter: rec.metrics?.expectedAfter || null,
              measurementMethod: rec.metrics?.measurementMethod || 'Manual review'
            },
            source: key as AnalysisType
          });
        });
      }
    });
    
    // Ordenar por prioridad e impacto
    return recommendations
      .sort((a, b) => {
        const priorityOrder = { 'critical': 4, 'high': 3, 'medium': 2, 'low': 1 };
        const aPriority = priorityOrder[a.priority] || 2;
        const bPriority = priorityOrder[b.priority] || 2;
        
        if (aPriority !== bPriority) {
          return bPriority - aPriority;
        }
        
        const aImpact = Object.values(a.impact).reduce((sum, val) => sum + val, 0);
        const bImpact = Object.values(b.impact).reduce((sum, val) => sum + val, 0);
        
        return bImpact - aImpact;
      })
      .slice(0, 20); // Limitar a 20 recomendaciones principales
  }

  /**
   * Calcular score unificado
   */
  private calculateUnifiedScore(results: any): {
    overall: number;
    seo: number;
    performance: number;
    security: number;
    content: number;
    technical: number;
  } {
    const scores = {
      overall: 0,
      seo: 0,
      performance: 0,
      security: 0,
      content: 0,
      technical: 0
    };
    
    let totalWeight = 0;
    
    // Mapear scores de cada análisis
    Object.entries(results).forEach(([key, result]: [string, any]) => {
      if (result?.score) {
        const weight = this.getAnalysisWeight(key);
        totalWeight += weight;
        
        if (typeof result.score === 'number') {
          scores.overall += result.score * weight;
          
          // Mapear a categorías específicas
          switch (key) {
            case 'performanceAnalysis':
              scores.performance += result.score * weight;
              break;
            case 'metadataAnalysis':
            case 'backlinksAnalysis':
            case 'keywordsAnalysis':
              scores.seo += result.score * weight;
              break;
            case 'contentAnalysis':
              scores.content += result.score * weight;
              break;
            case 'blockchainAnalysis':
            case 'web3Analysis':
              scores.security += result.score * weight;
              break;
            default:
              scores.technical += result.score * weight;
          }
        } else if (result.score.overall) {
          scores.overall += result.score.overall * weight;
          scores.seo += (result.score.seo || 0) * weight;
          scores.performance += (result.score.performance || 0) * weight;
          scores.security += (result.score.security || 0) * weight;
          scores.content += (result.score.content || 0) * weight;
          scores.technical += (result.score.technical || 0) * weight;
        }
      }
    });
    
    // Normalizar scores
    if (totalWeight > 0) {
      Object.keys(scores).forEach(key => {
        scores[key as keyof typeof scores] = Math.round(scores[key as keyof typeof scores] / totalWeight);
      });
    }
    
    return scores;
  }

  /**
   * Métodos auxiliares
   */
  private validateRequest(request: UnifiedAnalysisRequest): void {
    if (!request.url) {
      throw new Error('URL es requerida');
    }
    
    if (!request.analysisTypes || request.analysisTypes.length === 0) {
      throw new Error('Al menos un tipo de análisis es requerido');
    }
    
    // Validar URL
    try {
      new URL(request.url);
    } catch {
      throw new Error('URL inválida');
    }
  }

  private estimateAnalysisTime(request: UnifiedAnalysisRequest): number {
    const baseTime = 30000; // 30 segundos base
    const timePerAnalysis = {
      'ai-assistant': 45000,
      'blockchain': 30000,
      'performance': 60000,
      'metadata': 20000,
      'content': 40000,
      'backlinks': 90000,
      'keywords': 60000,
      'links': 30000,
      'web3': 45000
    };
    
    let totalTime = baseTime;
    
    request.analysisTypes.forEach(type => {
      if (type === 'comprehensive') {
        totalTime += 180000; // 3 minutos para análisis completo
      } else {
        totalTime += timePerAnalysis[type] || 30000;
      }
    });
    
    return totalTime;
  }

  private mapToUnifiedCategory(category: string): 'seo' | 'performance' | 'security' | 'content' | 'technical' | 'web3' {
    const categoryMap: Record<string, 'seo' | 'performance' | 'security' | 'content' | 'technical' | 'web3'> = {
      'seo': 'seo',
      'performance': 'performance',
      'security': 'security',
      'content': 'content',
      'technical': 'technical',
      'web3': 'web3',
      'metadata': 'seo',
      'backlinks': 'seo',
      'keywords': 'seo',
      'links': 'seo',
      'blockchain': 'web3',
      'ai': 'technical'
    };
    
    return categoryMap[category.toLowerCase()] || 'technical';
  }

  private getAnalysisWeight(analysisKey: string): number {
    const weights: Record<string, number> = {
      'aiAnalysis': 1.2,
      'performanceAnalysis': 1.5,
      'metadataAnalysis': 1.0,
      'contentAnalysis': 1.3,
      'backlinksAnalysis': 1.1,
      'keywordsAnalysis': 1.0,
      'linksAnalysis': 0.8,
      'blockchainAnalysis': 1.0,
      'web3Analysis': 1.0
    };
    
    return weights[analysisKey] || 1.0;
  }

  private generateComparisonRecommendations(analysis1: UnifiedAnalysisResult, analysis2: UnifiedAnalysisResult): UnifiedRecommendation[] {
    const recommendations: UnifiedRecommendation[] = [];
    
    // Comparar scores y generar recomendaciones
    if (analysis1.score.overall < analysis2.score.overall) {
      recommendations.push({
        id: 'comparison-overall',
        category: 'technical',
        priority: 'high',
        title: 'Mejorar score general',
        description: `${analysis1.url} tiene un score general menor (${analysis1.score.overall}) comparado con ${analysis2.url} (${analysis2.score.overall})`,
        impact: {
          seo: 15,
          performance: 15,
          security: 10,
          userExperience: 20,
          conversion: 15
        },
        implementation: {
          difficulty: 'medium',
          timeEstimate: '2-4 semanas',
          resources: ['Desarrollador', 'SEO Specialist'],
          steps: ['Identificar áreas de mejora', 'Implementar optimizaciones', 'Monitorear resultados'],
          cost: 'medium'
        },
        metrics: {
          before: analysis1.score.overall,
          expectedAfter: analysis2.score.overall,
          measurementMethod: 'Análisis comparativo'
        },
        source: 'comprehensive'
      });
    }
    
    return recommendations;
  }

  private generateComparisonSummary(analysis1: UnifiedAnalysisResult, analysis2: UnifiedAnalysisResult): string {
    const betterSite = analysis1.score.overall > analysis2.score.overall ? analysis1.url : analysis2.url;
    const scoreDiff = Math.abs(analysis1.score.overall - analysis2.score.overall);
    
    return `Comparación entre ${analysis1.url} y ${analysis2.url}: ${betterSite} tiene mejor rendimiento general con una diferencia de ${scoreDiff} puntos.`;
  }

  private async saveAnalysisResult(result: UnifiedAnalysisResult): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('unified_analysis_results')
        .insert({
          id: result.id,
          url: result.url,
          analysis_types: result.analysisTypes,
          timestamp: result.timestamp,
          status: result.status,
          progress: result.progress,
          results: result.results,
          summary: result.summary,
          recommendations: result.recommendations,
          score: result.score,
          processing_time: result.processingTime,
          created_at: result.createdAt,
          updated_at: result.updatedAt,
          user_id: result.userId
        });
      
      if (error) {
        console.error('Error guardando resultado unificado:', error);
      }
    } catch (error) {
      console.error('Error en saveAnalysisResult:', error);
    }
  }

  private cleanupStaleAnalyses(): void {
    const now = Date.now();
    const staleThreshold = 600000; // 10 minutos
    
    for (const [id, progress] of this.activeAnalyses.entries()) {
      if (now - (progress as any).startTime > staleThreshold) {
        this.activeAnalyses.delete(id);
      }
    }
  }
}

// Exportar instancia singleton
export const analysisOrchestrator = new AnalysisOrchestrator();
export default analysisOrchestrator;