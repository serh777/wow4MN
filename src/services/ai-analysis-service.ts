/**
 * Servicio de análisis con IA optimizado para Supabase/Netlify
 * Basado en análisis externo de mejoras para implementación
 * Integra Anthropic Claude, OpenAI y DeepSeek con fallbacks automáticos
 */

import { createClient } from '@supabase/supabase-js';

// Tipos para el análisis con IA
export interface AIAnalysisRequest {
  address: string;
  analysisType: 'comprehensive' | 'seo' | 'security' | 'performance' | 'web3';
  tools: string[];
  userId?: string;
  options?: {
    includeRecommendations?: boolean;
    detailLevel?: 'basic' | 'detailed' | 'expert';
    language?: string;
  };
}

export interface AIAnalysisResult {
  id: string;
  address: string;
  analysisType: string;
  results: {
    summary: string;
    score: number;
    insights: AIInsight[];
    recommendations: AIRecommendation[];
    technicalDetails: Record<string, any>;
  };
  metadata: {
    provider: 'anthropic' | 'openai' | 'deepseek';
    model: string;
    processingTime: number;
    tokensUsed: number;
    confidence: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface AIInsight {
  category: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  impact: string;
  evidence: string[];
}

export interface AIRecommendation {
  priority: 'low' | 'medium' | 'high';
  category: string;
  title: string;
  description: string;
  implementation: {
    difficulty: 'easy' | 'medium' | 'hard';
    estimatedTime: string;
    steps: string[];
  };
  expectedImpact: string;
}

// Configuración de proveedores de IA
interface AIProvider {
  name: string;
  apiKey: string;
  baseUrl: string;
  models: {
    fast: string;
    balanced: string;
    advanced: string;
  };
  rateLimit: {
    requestsPerMinute: number;
    tokensPerMinute: number;
  };
}

class AIAnalysisService {
  private supabase: any;
  private providers: Map<string, AIProvider>;
  private currentProvider: string;
  private requestCounts: Map<string, { count: number; resetTime: number }>;

  constructor() {
    // Inicializar Supabase
    this.supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Configurar proveedores
    this.providers = new Map();
    this.setupProviders();
    
    // Inicializar contadores de rate limiting
    this.requestCounts = new Map();
    this.currentProvider = 'anthropic'; // Proveedor por defecto
  }

  private setupProviders() {
    // Anthropic Claude (prioridad alta)
    if (process.env.ANTHROPIC_API_KEY) {
      this.providers.set('anthropic', {
        name: 'Anthropic Claude',
        apiKey: process.env.ANTHROPIC_API_KEY,
        baseUrl: 'https://api.anthropic.com/v1',
        models: {
          fast: 'claude-3-haiku-20240307',
          balanced: 'claude-3-sonnet-20240229',
          advanced: 'claude-3-opus-20240229'
        },
        rateLimit: {
          requestsPerMinute: 50,
          tokensPerMinute: 40000
        }
      });
    }

    // OpenAI (fallback)
    if (process.env.OPENAI_API_KEY) {
      this.providers.set('openai', {
        name: 'OpenAI GPT',
        apiKey: process.env.OPENAI_API_KEY,
        baseUrl: 'https://api.openai.com/v1',
        models: {
          fast: 'gpt-3.5-turbo',
          balanced: 'gpt-4',
          advanced: 'gpt-4-turbo-preview'
        },
        rateLimit: {
          requestsPerMinute: 60,
          tokensPerMinute: 90000
        }
      });
    }

    // DeepSeek (alternativa económica)
    if (process.env.DEEPSEEK_API_KEY) {
      this.providers.set('deepseek', {
        name: 'DeepSeek',
        apiKey: process.env.DEEPSEEK_API_KEY,
        baseUrl: 'https://api.deepseek.com/v1',
        models: {
          fast: 'deepseek-chat',
          balanced: 'deepseek-coder',
          advanced: 'deepseek-coder'
        },
        rateLimit: {
          requestsPerMinute: 100,
          tokensPerMinute: 200000
        }
      });
    }
  }

  /**
   * Análisis principal con IA
   */
  async analyzeWithAI(request: AIAnalysisRequest): Promise<AIAnalysisResult> {
    const startTime = Date.now();
    
    try {
      // Verificar caché primero
      const cachedResult = await this.getCachedAnalysis(request);
      if (cachedResult) {
        return cachedResult;
      }

      // Seleccionar proveedor disponible
      const provider = await this.selectAvailableProvider();
      if (!provider) {
        throw new Error('No hay proveedores de IA disponibles');
      }

      // Preparar contexto para el análisis
      const analysisContext = await this.prepareAnalysisContext(request);
      
      // Ejecutar análisis con el proveedor seleccionado
      const aiResponse = await this.executeAIAnalysis(provider, analysisContext, request);
      
      // Procesar y estructurar la respuesta
      const result = await this.processAIResponse(aiResponse, request, provider, startTime);
      
      // Guardar en caché y base de datos
      await this.saveAnalysisResult(result);
      
      // Registrar métricas de uso
      await this.recordUsageMetrics(request, result, provider);
      
      return result;
    } catch (error) {
      console.error('Error en análisis con IA:', error);
      
      // Intentar con proveedor alternativo
      if (this.providers.size > 1) {
        return this.retryWithFallbackProvider(request, error);
      }
      
      throw error;
    }
  }

  /**
   * Preparar contexto para el análisis
   */
  private async prepareAnalysisContext(request: AIAnalysisRequest): Promise<string> {
    const { address, analysisType, tools, options } = request;
    
    // Obtener datos existentes del sitio
    const siteData = await this.gatherSiteData(address, tools);
    
    // Construir prompt contextual
    const context = {
      task: `Analizar el sitio web ${address} con enfoque en ${analysisType}`,
      tools: tools.join(', '),
      detailLevel: options?.detailLevel || 'detailed',
      language: options?.language || 'es',
      includeRecommendations: options?.includeRecommendations !== false,
      siteData
    };

    return this.buildAnalysisPrompt(context);
  }

  /**
   * Recopilar datos del sitio
   */
  private async gatherSiteData(address: string, tools: string[]): Promise<Record<string, any>> {
    const siteData: Record<string, any> = {};
    
    try {
      // Obtener análisis previos de la base de datos
      const { data: previousAnalyses } = await this.supabase
        .from('analysis_results')
        .select('tool_type, analysis_data')
        .eq('address', address)
        .order('created_at', { ascending: false })
        .limit(10);

      if (previousAnalyses) {
        siteData.previousAnalyses = previousAnalyses;
      }

      // Datos básicos del sitio (si están disponibles)
      if (tools.includes('metadata')) {
        siteData.metadata = await this.getBasicMetadata(address);
      }

      if (tools.includes('performance')) {
        siteData.performance = await this.getPerformanceData(address);
      }

      if (tools.includes('security')) {
        siteData.security = await this.getSecurityData(address);
      }

    } catch (error) {
      console.warn('Error recopilando datos del sitio:', error);
    }

    return siteData;
  }

  /**
   * Construir prompt para el análisis
   */
  private buildAnalysisPrompt(context: any): string {
    const { task, tools, detailLevel, language, includeRecommendations, siteData } = context;
    
    return `
Eres un experto analista web especializado en SEO, performance, seguridad y Web3.

Tarea: ${task}
Herramientas utilizadas: ${tools}
Nivel de detalle: ${detailLevel}
Idioma de respuesta: ${language}

${siteData.previousAnalyses ? `Análisis previos disponibles: ${JSON.stringify(siteData.previousAnalyses, null, 2)}` : ''}

${siteData.metadata ? `Metadata actual: ${JSON.stringify(siteData.metadata, null, 2)}` : ''}

${siteData.performance ? `Datos de performance: ${JSON.stringify(siteData.performance, null, 2)}` : ''}

Por favor, proporciona un análisis estructurado que incluya:

1. **Resumen ejecutivo** (2-3 párrafos)
2. **Puntuación general** (0-100)
3. **Insights clave** (3-5 puntos importantes con evidencia)
4. **Problemas identificados** (categorizados por severidad)
${includeRecommendations ? '5. **Recomendaciones específicas** (priorizadas con pasos de implementación)' : ''}
6. **Detalles técnicos** (datos específicos y métricas)

Formato de respuesta: JSON estructurado con las siguientes claves:
- summary: string
- score: number (0-100)
- insights: array de objetos con {category, title, description, severity, impact, evidence}
- problems: array de problemas identificados
${includeRecommendations ? '- recommendations: array de recomendaciones con {priority, category, title, description, implementation, expectedImpact}' : ''}
- technicalDetails: objeto con datos específicos
- confidence: number (0-1) - tu nivel de confianza en el análisis

Asegúrate de que el análisis sea:
- Específico y accionable
- Basado en mejores prácticas actuales
- Contextualizado para el tipo de sitio
- Priorizado por impacto
`;
  }

  /**
   * Ejecutar análisis con proveedor de IA
   */
  private async executeAIAnalysis(
    provider: AIProvider, 
    prompt: string, 
    request: AIAnalysisRequest
  ): Promise<any> {
    const model = this.selectModelForRequest(provider, request);
    
    // Incrementar contador de rate limiting
    this.incrementRequestCount(provider.name);
    
    switch (provider.name) {
      case 'Anthropic Claude':
        return this.callAnthropicAPI(provider, model, prompt);
      case 'OpenAI GPT':
        return this.callOpenAIAPI(provider, model, prompt);
      case 'DeepSeek':
        return this.callDeepSeekAPI(provider, model, prompt);
      default:
        throw new Error(`Proveedor no soportado: ${provider.name}`);
    }
  }

  /**
   * Llamada a Anthropic Claude
   */
  private async callAnthropicAPI(provider: AIProvider, model: string, prompt: string): Promise<any> {
    const response = await fetch(`${provider.baseUrl}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': provider.apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model,
        max_tokens: 4000,
        temperature: 0.1,
        messages: [{
          role: 'user',
          content: prompt
        }]
      })
    });

    if (!response.ok) {
      throw new Error(`Anthropic API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return {
      content: data.content[0].text,
      usage: data.usage,
      model: data.model
    };
  }

  /**
   * Llamada a OpenAI
   */
  private async callOpenAIAPI(provider: AIProvider, model: string, prompt: string): Promise<any> {
    const response = await fetch(`${provider.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${provider.apiKey}`
      },
      body: JSON.stringify({
        model,
        messages: [{
          role: 'user',
          content: prompt
        }],
        max_tokens: 4000,
        temperature: 0.1,
        response_format: { type: 'json_object' }
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return {
      content: data.choices[0].message.content,
      usage: data.usage,
      model: data.model
    };
  }

  /**
   * Llamada a DeepSeek
   */
  private async callDeepSeekAPI(provider: AIProvider, model: string, prompt: string): Promise<any> {
    const response = await fetch(`${provider.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${provider.apiKey}`
      },
      body: JSON.stringify({
        model,
        messages: [{
          role: 'user',
          content: prompt
        }],
        max_tokens: 4000,
        temperature: 0.1
      })
    });

    if (!response.ok) {
      throw new Error(`DeepSeek API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return {
      content: data.choices[0].message.content,
      usage: data.usage,
      model: data.model
    };
  }

  /**
   * Procesar respuesta de IA
   */
  private async processAIResponse(
    aiResponse: any, 
    request: AIAnalysisRequest, 
    provider: AIProvider,
    startTime: number
  ): Promise<AIAnalysisResult> {
    const processingTime = Date.now() - startTime;
    
    try {
      // Parsear respuesta JSON
      const parsedContent = JSON.parse(aiResponse.content);
      
      return {
        id: crypto.randomUUID(),
        address: request.address,
        analysisType: request.analysisType,
        results: {
          summary: parsedContent.summary || '',
          score: parsedContent.score || 0,
          insights: parsedContent.insights || [],
          recommendations: parsedContent.recommendations || [],
          technicalDetails: parsedContent.technicalDetails || {}
        },
        metadata: {
          provider: provider.name.toLowerCase().split(' ')[0] as any,
          model: aiResponse.model,
          processingTime,
          tokensUsed: aiResponse.usage?.total_tokens || 0,
          confidence: parsedContent.confidence || 0.8
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    } catch (parseError) {
      console.error('Error parseando respuesta de IA:', parseError);
      
      // Fallback: crear resultado básico
      return {
        id: crypto.randomUUID(),
        address: request.address,
        analysisType: request.analysisType,
        results: {
          summary: aiResponse.content.substring(0, 500) + '...',
          score: 50,
          insights: [],
          recommendations: [],
          technicalDetails: { rawResponse: aiResponse.content }
        },
        metadata: {
          provider: provider.name.toLowerCase().split(' ')[0] as any,
          model: aiResponse.model,
          processingTime,
          tokensUsed: aiResponse.usage?.total_tokens || 0,
          confidence: 0.5
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    }
  }

  /**
   * Seleccionar proveedor disponible
   */
  private async selectAvailableProvider(): Promise<AIProvider | null> {
    const providerNames = ['anthropic', 'openai', 'deepseek'];
    
    for (const name of providerNames) {
      const provider = this.providers.get(name);
      if (provider && this.isProviderAvailable(name)) {
        this.currentProvider = name;
        return provider;
      }
    }
    
    return null;
  }

  /**
   * Verificar disponibilidad del proveedor
   */
  private isProviderAvailable(providerName: string): boolean {
    const count = this.requestCounts.get(providerName);
    if (!count) return true;
    
    const now = Date.now();
    if (now > count.resetTime) {
      this.requestCounts.delete(providerName);
      return true;
    }
    
    const provider = this.providers.get(providerName);
    return count.count < (provider?.rateLimit.requestsPerMinute || 50);
  }

  /**
   * Incrementar contador de requests
   */
  private incrementRequestCount(providerName: string): void {
    const now = Date.now();
    const resetTime = now + 60000; // 1 minuto
    
    const current = this.requestCounts.get(providerName);
    if (!current || now > current.resetTime) {
      this.requestCounts.set(providerName, { count: 1, resetTime });
    } else {
      current.count++;
    }
  }

  /**
   * Seleccionar modelo según el request
   */
  private selectModelForRequest(provider: AIProvider, request: AIAnalysisRequest): string {
    const { options } = request;
    const detailLevel = options?.detailLevel || 'detailed';
    
    switch (detailLevel) {
      case 'basic':
        return provider.models.fast;
      case 'expert':
        return provider.models.advanced;
      default:
        return provider.models.balanced;
    }
  }

  /**
   * Obtener análisis desde caché
   */
  private async getCachedAnalysis(request: AIAnalysisRequest): Promise<AIAnalysisResult | null> {
    try {
      const cacheKey = this.generateCacheKey(request);
      
      const { data, error } = await this.supabase
        .from('api_cache')
        .select('cache_data')
        .eq('cache_key', cacheKey)
        .gt('expires_at', new Date().toISOString())
        .single();

      if (error || !data) return null;
      
      return data.cache_data as AIAnalysisResult;
    } catch (error) {
      console.warn('Error obteniendo caché:', error);
      return null;
    }
  }

  /**
   * Guardar resultado del análisis
   */
  private async saveAnalysisResult(result: AIAnalysisResult): Promise<void> {
    try {
      // Guardar en base de datos
      await this.supabase
        .from('analysis_results')
        .upsert({
          address: result.address,
          tool_type: 'ai-analysis',
          analysis_data: result,
          user_id: result.metadata.provider // Temporal
        });

      // Guardar en caché
      const cacheKey = this.generateCacheKey({
        address: result.address,
        analysisType: result.analysisType as any,
        tools: ['ai-analysis']
      });
      
      await this.supabase
        .from('api_cache')
        .upsert({
          cache_key: cacheKey,
          cache_data: result,
          expires_at: new Date(Date.now() + 3600000).toISOString() // 1 hora
        });
    } catch (error) {
      console.error('Error guardando resultado:', error);
    }
  }

  /**
   * Registrar métricas de uso
   */
  private async recordUsageMetrics(
    request: AIAnalysisRequest, 
    result: AIAnalysisResult, 
    provider: AIProvider
  ): Promise<void> {
    try {
      await this.supabase
        .from('usage_analytics')
        .insert({
          tool_type: 'ai-analysis',
          action_type: 'analysis_completed',
          metadata: {
            provider: provider.name,
            model: result.metadata.model,
            processingTime: result.metadata.processingTime,
            tokensUsed: result.metadata.tokensUsed,
            confidence: result.metadata.confidence,
            analysisType: request.analysisType
          }
        });
    } catch (error) {
      console.warn('Error registrando métricas:', error);
    }
  }

  /**
   * Generar clave de caché
   */
  private generateCacheKey(request: Partial<AIAnalysisRequest>): string {
    const { address, analysisType, tools } = request;
    return `ai-analysis:${address}:${analysisType}:${tools?.sort().join(',')}`;
  }

  /**
   * Reintentar con proveedor alternativo
   */
  private async retryWithFallbackProvider(
    request: AIAnalysisRequest, 
    originalError: any
  ): Promise<AIAnalysisResult> {
    console.warn('Reintentando con proveedor alternativo:', originalError.message);
    
    // Marcar proveedor actual como no disponible temporalmente
    const currentCount = this.requestCounts.get(this.currentProvider);
    if (currentCount) {
      currentCount.count = 999; // Forzar límite
    }
    
    // Intentar con siguiente proveedor
    return this.analyzeWithAI(request);
  }

  /**
   * Métodos auxiliares para obtener datos del sitio
   */
  private async getBasicMetadata(address: string): Promise<any> {
    // Implementar obtención de metadata básica
    return { title: '', description: '', keywords: [] };
  }

  private async getPerformanceData(address: string): Promise<any> {
    // Implementar obtención de datos de performance
    return { score: 0, metrics: {} };
  }

  private async getSecurityData(address: string): Promise<any> {
    // Implementar obtención de datos de seguridad
    return { score: 0, issues: [] };
  }
}

// Instancia singleton
let aiAnalysisService: AIAnalysisService;

export function getAIAnalysisService(): AIAnalysisService {
  if (!aiAnalysisService) {
    aiAnalysisService = new AIAnalysisService();
  }
  return aiAnalysisService;
}

export default AIAnalysisService;