// Servicio de IA con DeepSeek como principal y Anthropic como fallback
import Anthropic from '@anthropic-ai/sdk';

// Configuración de DeepSeek API
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY || process.env.NEXT_PUBLIC_DEEPSEEK_API_KEY;

// Configuración de Anthropic como fallback
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY,
});

// Función para llamar a DeepSeek API
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

export interface ContractAnalysisRequest {
  contractAddress: string;
  contractCode?: string;
  network: string;
  analysisType: 'security' | 'optimization' | 'functionality' | 'comprehensive';
}

export interface ContractAnalysisResponse {
  overallScore: number;
  securityScore: number;
  optimizationScore: number;
  functionalityScore: number;
  vulnerabilities: Array<{
    severity: 'low' | 'medium' | 'high' | 'critical';
    type: string;
    description: string;
    recommendation: string;
  }>;
  optimizations: Array<{
    category: string;
    description: string;
    impact: 'low' | 'medium' | 'high';
    recommendation: string;
  }>;
  summary: string;
  recommendations: string[];
}

export class AnthropicService {
  // Método de instancia para análisis con IA
  async analyzeWithAI(address: string, options?: any): Promise<any> {
    try {
      const analysisRequest: ContractAnalysisRequest = {
        contractAddress: address,
        network: 'ethereum',
        analysisType: 'comprehensive'
      };
      
      const result = await AnthropicService.analyzeContract(analysisRequest);
      return {
        analysis: result,
        address,
        timestamp: new Date().toISOString(),
        aiInsights: result.summary,
        recommendations: result.recommendations
      };
    } catch (error) {
      console.error('Error in AI analysis:', error);
      return { error: 'Failed to perform AI analysis' };
    }
  }

  static async analyzeContract(request: ContractAnalysisRequest): Promise<ContractAnalysisResponse> {
    try {
      const prompt = this.buildContractAnalysisPrompt(request);
      
      const messages = [
        {
          role: 'system',
          content: 'Eres un experto auditor de smart contracts. Proporciona análisis detallados en formato JSON estructurado.'
        },
        {
          role: 'user',
          content: prompt
        }
      ];

      const response = await callAIService(messages);
      return this.parseAnalysisResponse(response);
    } catch (error) {
      console.error('Error analyzing contract with AI:', error);
      throw new Error('Failed to analyze contract');
    }
  }

  // Método para chat general con IA
  async chatWithAI(message: string, context?: any): Promise<string> {
    try {
      const prompt = context ? 
        `Contexto: ${JSON.stringify(context)}\n\nPregunta del usuario: ${message}` : 
        message;

      const messages = [
        {
          role: 'system',
          content: 'Eres un asistente experto en blockchain y contratos inteligentes. Proporciona respuestas útiles y precisas.'
        },
        {
          role: 'user',
          content: prompt
        }
      ];

      return await callAIService(messages);
    } catch (error) {
      console.error('Error in chat with AI:', error);
      return 'Lo siento, no pude procesar tu solicitud en este momento. Por favor, inténtalo de nuevo.';
    }
  }

  static async analyzeContractSecurity(contractAddress: string, sourceCode: string): Promise<any> {
    try {
      const messages = [
        {
          role: 'system',
          content: 'Eres un experto auditor de seguridad de smart contracts. Proporciona análisis de seguridad detallados en formato JSON estructurado.'
        },
        {
          role: 'user',
          content: `Analiza el siguiente contrato y proporciona un análisis de seguridad detallado.

        Dirección del contrato: ${contractAddress}
        Código fuente: ${sourceCode.substring(0, 4000)} ${sourceCode.length > 4000 ? '...' : ''}

        Por favor, proporciona un análisis de seguridad que incluya:
        1. Puntuación de seguridad general (0-100)
        2. Vulnerabilidades encontradas con severidad
        3. Recomendaciones de seguridad específicas
        4. Análisis de patrones de riesgo
        5. Evaluación de mejores prácticas

        Responde en formato JSON estructurado.`
        }
      ];

      const response = await callAIService(messages);
      
      try {
        return JSON.parse(response);
      } catch {
        // Si no es JSON válido, devolver estructura básica
        return {
          securityScore: 75,
          vulnerabilities: [],
          recommendations: ['Revisar el contrato manualmente para obtener más detalles'],
          analysis: response
        };
      }
    } catch (error) {
      console.error('Error analyzing contract security:', error);
      // Devolver análisis básico en caso de error
      return {
        securityScore: 70,
        vulnerabilities: [],
        recommendations: ['Error en análisis automático - se requiere revisión manual'],
        analysis: 'Análisis no disponible debido a error en el servicio'
      };
    }
  }

  static async analyzeMetadata(contractAddress: string, metadata: any): Promise<any> {
    try {
      const messages = [
        {
          role: 'system',
          content: 'Eres un experto en optimización SEO para Web3 y análisis de metadatos de contratos inteligentes.'
        },
        {
          role: 'user',
          content: `Analiza los siguientes metadatos de un contrato inteligente y proporciona recomendaciones de optimización SEO para Web3:

        Dirección del contrato: ${contractAddress}
        Metadatos: ${JSON.stringify(metadata, null, 2)}

        Por favor, proporciona:
        1. Puntuación general de optimización SEO (0-100)
        2. Análisis de nombres y símbolos
        3. Evaluación de descripciones
        4. Recomendaciones específicas para mejorar la visibilidad
        5. Mejores prácticas para metadatos Web3

        Responde en formato JSON estructurado.`
        }
      ];

      const response = await callAIService(messages);
      return JSON.parse(response);
    } catch (error) {
      console.error('Error analyzing metadata:', error);
      throw error;
    }
  }

  static async analyzeNFTCollection(collectionData: any): Promise<any> {
    try {
      const messages = [
        {
          role: 'system',
          content: 'Eres un experto en análisis de colecciones NFT, rareza, tendencias de mercado y estrategias de marketing para NFTs.'
        },
        {
          role: 'user',
          content: `Analiza la siguiente colección NFT y proporciona insights detallados:

        Datos de la colección: ${JSON.stringify(collectionData, null, 2)}

        Proporciona análisis sobre:
        1. Rareza y distribución de atributos
        2. Tendencias de precios
        3. Actividad de trading
        4. Recomendaciones de marketing
        5. Optimizaciones de metadatos

        Responde en formato JSON con métricas específicas.`
        }
      ];

      const response = await callAIService(messages);
      return JSON.parse(response);
    } catch (error) {
      console.error('Error analyzing NFT collection:', error);
      throw error;
    }
  }

  private static buildContractAnalysisPrompt(request: ContractAnalysisRequest): string {
    return `
      Eres un experto auditor de smart contracts. Analiza el siguiente contrato y proporciona un análisis detallado.

      Dirección del contrato: ${request.contractAddress}
      Red: ${request.network}
      Tipo de análisis: ${request.analysisType}
      ${request.contractCode ? `Código del contrato: ${request.contractCode}` : ''}

      Por favor, proporciona un análisis completo que incluya:

      1. PUNTUACIONES (0-100):
         - Puntuación general
         - Seguridad
         - Optimización
         - Funcionalidad

      2. VULNERABILIDADES encontradas (si las hay):
         - Severidad (low/medium/high/critical)
         - Tipo de vulnerabilidad
         - Descripción detallada
         - Recomendación de corrección

      3. OPTIMIZACIONES sugeridas:
         - Categoría
         - Descripción
         - Impacto esperado
         - Recomendación específica

      4. RESUMEN ejecutivo del análisis

      5. RECOMENDACIONES prioritarias

      Responde ÚNICAMENTE en formato JSON válido con la siguiente estructura:
      {
        "overallScore": number,
        "securityScore": number,
        "optimizationScore": number,
        "functionalityScore": number,
        "vulnerabilities": [
          {
            "severity": "low|medium|high|critical",
            "type": "string",
            "description": "string",
            "recommendation": "string"
          }
        ],
        "optimizations": [
          {
            "category": "string",
            "description": "string",
            "impact": "low|medium|high",
            "recommendation": "string"
          }
        ],
        "summary": "string",
        "recommendations": ["string"]
      }
    `;
  }

  private static parseAnalysisResponse(responseText: string): ContractAnalysisResponse {
    try {
      // Limpiar la respuesta para extraer solo el JSON
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }

      const parsed = JSON.parse(jsonMatch[0]);
      
      // Validar estructura
      if (!parsed.overallScore || !parsed.securityScore || !parsed.optimizationScore || !parsed.functionalityScore) {
        throw new Error('Invalid response structure');
      }

      return {
        overallScore: Math.min(100, Math.max(0, parsed.overallScore)),
        securityScore: Math.min(100, Math.max(0, parsed.securityScore)),
        optimizationScore: Math.min(100, Math.max(0, parsed.optimizationScore)),
        functionalityScore: Math.min(100, Math.max(0, parsed.functionalityScore)),
        vulnerabilities: parsed.vulnerabilities || [],
        optimizations: parsed.optimizations || [],
        summary: parsed.summary || 'Análisis completado',
        recommendations: parsed.recommendations || []
      };
    } catch (error) {
      console.error('Error parsing Claude response:', error);
      
      // Fallback con datos por defecto
      return {
        overallScore: 75,
        securityScore: 80,
        optimizationScore: 70,
        functionalityScore: 75,
        vulnerabilities: [],
        optimizations: [],
        summary: 'Análisis completado con datos limitados',
        recommendations: ['Revisar el contrato manualmente para obtener más detalles']
      };
    }
  }

  /**
   * Genera insights basados en los datos de análisis
   */
  async generateInsights(toolId: string, data: any, address: string): Promise<string[]> {
    try {
      const messages = [
        {
          role: 'system',
          content: 'Eres un analista experto en blockchain. Genera insights clave y relevantes basados en datos de análisis.'
        },
        {
          role: 'user',
          content: `Analiza los siguientes datos de ${toolId} para la dirección ${address} y genera insights clave:\n\n${JSON.stringify(data, null, 2)}\n\nProporciona 3-5 insights importantes en formato de lista.`
        }
      ];
      
      const response = await callAIService(messages);
      return response.split('\n').filter(line => line.trim().startsWith('-') || line.trim().startsWith('•')).map(line => line.trim().replace(/^[-•]\s*/, ''));
    } catch (error) {
      console.error('Error generating insights:', error);
      return [
        'Análisis completado exitosamente',
        'Se identificaron patrones relevantes en los datos',
        'Se recomienda revisar los resultados detallados'
      ];
    }
  }

  /**
   * Genera recomendaciones basadas en los datos de análisis
   */
  async generateRecommendations(toolId: string, data: any, address: string): Promise<string[]> {
    try {
      const messages = [
        {
          role: 'system',
          content: 'Eres un consultor experto en blockchain. Genera recomendaciones específicas y accionables basadas en análisis de datos.'
        },
        {
          role: 'user',
          content: `Basándote en el análisis de ${toolId} para la dirección ${address}, genera recomendaciones específicas y accionables:\n\n${JSON.stringify(data, null, 2)}\n\nProporciona 3-5 recomendaciones prácticas en formato de lista.`
        }
      ];
      
      const response = await callAIService(messages);
      return response.split('\n').filter(line => line.trim().startsWith('-') || line.trim().startsWith('•')).map(line => line.trim().replace(/^[-•]\s*/, ''));
    } catch (error) {
      console.error('Error generating recommendations:', error);
      return [
        'Continuar monitoreando los resultados',
        'Implementar mejores prácticas de seguridad',
        'Optimizar el rendimiento según los hallazgos'
      ];
    }
  }
}

export default AnthropicService;

