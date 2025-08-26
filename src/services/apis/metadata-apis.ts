// Metadata Analysis APIs Service
import { AnthropicService } from './anthropic';
import { EtherscanService } from './etherscan';
import { AlchemyService } from './alchemy';
import { apiCall } from '../../utils/api-retry-handler';

export interface MetadataAnalysisOptions {
  includeNFTMetadata?: boolean;
  includeContractMetadata?: boolean;
  includeSEOAnalysis?: boolean;
  includeOptimizationSuggestions?: boolean;
}

export interface MetadataAnalysisResult {
  address: string;
  type: 'contract' | 'nft' | 'website';
  metadata: {
    title?: string;
    description?: string;
    image?: string;
    attributes?: Array<{ trait_type: string; value: any }>;
    external_url?: string;
    animation_url?: string;
  };
  seoMetrics: {
    titleOptimization: number;
    descriptionOptimization: number;
    imageOptimization: number;
    structuredDataScore: number;
  };
  contractMetadata?: {
    name?: string;
    symbol?: string;
    decimals?: number;
    totalSupply?: string;
    verified: boolean;
  };
  issues: Array<{
    type: 'missing' | 'incomplete' | 'invalid' | 'optimization';
    severity: 'low' | 'medium' | 'high';
    field: string;
    description: string;
    recommendation: string;
  }>;
  recommendations: string[];
  score: number;
}

export class MetadataAPIsService {
  private static anthropicService = new AnthropicService();
  private static etherscanService = new EtherscanService();
  private static alchemyService = new AlchemyService();

  // Método de instancia para compatibilidad con orchestrator
  async analyzeMetadata(address: string, options: MetadataAnalysisOptions = {}): Promise<MetadataAnalysisResult> {
    return MetadataAPIsService.analyzeMetadata(address, options);
  }

  static async analyzeMetadata(address: string, options: MetadataAnalysisOptions = {}): Promise<MetadataAnalysisResult> {
    try {
      // Determinar el tipo de análisis
      const isContract = await this.isContractAddress(address);
      const isURL = this.isURL(address);
      
      if (isURL) {
        return await this.analyzeWebsiteMetadata(address, options);
      } else if (isContract) {
        return await this.analyzeContractMetadata(address, options);
      } else {
        return await this.analyzeNFTMetadata(address, options);
      }
    } catch (error) {
      console.error('Error en análisis de metadata:', error);
      throw new Error(`Error analizando metadata: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  private static async analyzeWebsiteMetadata(url: string, options: MetadataAnalysisOptions): Promise<MetadataAnalysisResult> {
    // Simular análisis de metadata web
    await this.delay(1000 + Math.random() * 1500);

    const metadata = {
      title: 'Web3 DApp - Blockchain Analytics',
      description: 'Advanced blockchain analytics and Web3 tools for smart contract analysis',
      image: 'https://example.com/og-image.jpg',
      external_url: url
    };

    const seoMetrics = {
      titleOptimization: Math.floor(Math.random() * 30) + 70,
      descriptionOptimization: Math.floor(Math.random() * 25) + 65,
      imageOptimization: Math.floor(Math.random() * 20) + 75,
      structuredDataScore: Math.floor(Math.random() * 35) + 60
    };

    const issues = [
      {
        type: 'optimization' as const,
        severity: 'medium' as const,
        field: 'title',
        description: 'El título podría ser más descriptivo',
        recommendation: 'Incluye palabras clave específicas del sector Web3'
      },
      {
        type: 'missing' as const,
        severity: 'low' as const,
        field: 'structured_data',
        description: 'Faltan datos estructurados Schema.org',
        recommendation: 'Añade markup JSON-LD para mejor indexación'
      }
    ];

    const recommendations = [
      'Optimizar meta title con palabras clave Web3',
      'Mejorar meta description con call-to-action',
      'Implementar Open Graph tags completos',
      'Añadir datos estructurados Schema.org'
    ];

    const score = Math.floor(
      Object.values(seoMetrics).reduce((a, b) => a + b, 0) / Object.values(seoMetrics).length
    );

    return {
      address: url,
      type: 'website',
      metadata,
      seoMetrics,
      issues,
      recommendations,
      score
    };
  }

  private static async analyzeContractMetadata(address: string, options: MetadataAnalysisOptions): Promise<MetadataAnalysisResult> {
    // Obtener información del contrato
    const contractInfo: any = await apiCall(
      () => EtherscanService.getContractInfo(address),
      'etherscan-contract-info'
    );
    
    await this.delay(800 + Math.random() * 1200);

    const contractMetadata = {
      name: contractInfo.ContractName || 'Unknown Contract',
      symbol: 'UNK',
      decimals: 18,
      totalSupply: '1000000000000000000000000',
      verified: contractInfo.SourceCode !== ''
    };

    const metadata = {
      title: contractMetadata.name,
      description: `Smart contract ${contractMetadata.name} on Ethereum blockchain`,
      external_url: `https://etherscan.io/address/${address}`
    };

    const seoMetrics = {
      titleOptimization: contractMetadata.verified ? 85 : 45,
      descriptionOptimization: contractMetadata.verified ? 80 : 40,
      imageOptimization: 60,
      structuredDataScore: contractMetadata.verified ? 90 : 30
    };

    const issues = [];
    if (!contractMetadata.verified) {
      issues.push({
        type: 'missing' as const,
        severity: 'high' as const,
        field: 'verification',
        description: 'Contrato no verificado en Etherscan',
        recommendation: 'Verificar el código fuente del contrato para mayor transparencia'
      });
    }

    if (!contractMetadata.name || contractMetadata.name === 'Unknown Contract') {
      issues.push({
        type: 'missing' as const,
        severity: 'medium' as const,
        field: 'name',
        description: 'Nombre del contrato no disponible',
        recommendation: 'Asegurar que el contrato tenga un nombre descriptivo'
      });
    }

    const recommendations = [
      'Verificar el código fuente en Etherscan',
      'Implementar metadatos estándar ERC-721/ERC-1155',
      'Añadir documentación NatSpec',
      'Optimizar nombres de funciones y eventos'
    ];

    const score = Math.floor(
      Object.values(seoMetrics).reduce((a, b) => a + b, 0) / Object.values(seoMetrics).length
    );

    return {
      address,
      type: 'contract',
      metadata,
      seoMetrics,
      contractMetadata,
      issues,
      recommendations,
      score
    };
  }

  private static async analyzeNFTMetadata(tokenId: string, options: MetadataAnalysisOptions): Promise<MetadataAnalysisResult> {
    await this.delay(600 + Math.random() * 1000);

    const metadata = {
      title: `NFT Token #${tokenId}`,
      description: 'Unique digital collectible with blockchain verification',
      image: 'https://example.com/nft-image.jpg',
      attributes: [
        { trait_type: 'Rarity', value: 'Rare' },
        { trait_type: 'Background', value: 'Blue' },
        { trait_type: 'Eyes', value: 'Laser' }
      ],
      external_url: `https://opensea.io/assets/${tokenId}`
    };

    const seoMetrics = {
      titleOptimization: Math.floor(Math.random() * 25) + 70,
      descriptionOptimization: Math.floor(Math.random() * 30) + 65,
      imageOptimization: Math.floor(Math.random() * 20) + 75,
      structuredDataScore: Math.floor(Math.random() * 35) + 60
    };

    const issues = [
      {
        type: 'optimization' as const,
        severity: 'low' as const,
        field: 'description',
        description: 'La descripción podría ser más detallada',
        recommendation: 'Incluir información sobre la utilidad y rareza del NFT'
      }
    ];

    const recommendations = [
      'Optimizar metadatos según estándar ERC-721',
      'Mejorar descripción con detalles únicos',
      'Asegurar que la imagen sea de alta calidad',
      'Implementar atributos descriptivos completos'
    ];

    const score = Math.floor(
      Object.values(seoMetrics).reduce((a, b) => a + b, 0) / Object.values(seoMetrics).length
    );

    return {
      address: tokenId,
      type: 'nft',
      metadata,
      seoMetrics,
      issues,
      recommendations,
      score
    };
  }

  private static async isContractAddress(address: string): Promise<boolean> {
    try {
      if (!address.startsWith('0x') || address.length !== 42) {
        return false;
      }
      const contractInfo: any = await apiCall(
        () => EtherscanService.getContractInfo(address),
        'etherscan-contract-validation'
      );
      return contractInfo.ContractName !== '';
    } catch {
      return false;
    }
  }

  private static isURL(address: string): boolean {
    try {
      new URL(address);
      return true;
    } catch {
      return false;
    }
  }

  private static delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export default MetadataAPIsService;