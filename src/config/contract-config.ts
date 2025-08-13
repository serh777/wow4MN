import { ethers } from 'ethers';
import { SUPPORTED_CHAINS } from './constants';

// Direcciones del contrato por red
export const CONTRACT_ADDRESSES: Record<number, string> = {
  [SUPPORTED_CHAINS.ETHEREUM]: '0x22A8CaCaD8d3C88EBf76B6AC378448F7197A0364', // Reemplazar con la dirección real en mainnet
  [SUPPORTED_CHAINS.POLYGON]: '0x22A8CaCaD8d3C88EBf76B6AC378448F7197A0364', // Reemplazar con la dirección real en Polygon
  [SUPPORTED_CHAINS.BSC]: '0x22A8CaCaD8d3C88EBf76B6AC378448F7197A0364', // Reemplazar con la dirección real en BSC
  [SUPPORTED_CHAINS.AVALANCHE]: '0x22A8CaCaD8d3C88EBf76B6AC378448F7197A0364', // Reemplazar con la dirección real en Avalanche
};

// Tokens aceptados por red
export const ACCEPTED_TOKENS: Record<number, Record<string, string>> = {
  [SUPPORTED_CHAINS.ETHEREUM]: {
    'USDT': '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    'USDC': '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    'DAI': '0x6B175474E89094C44Da98b954EedeAC495271d0F'
  },
  [SUPPORTED_CHAINS.POLYGON]: {
    'USDT': '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
    'USDC': '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
    'DAI': '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063'
  },
  // Añadir tokens para otras redes según sea necesario
};

// IDs de herramientas disponibles según la nueva lógica del contrato (11 herramientas)
export const TOOL_IDS = {
  METADATA_ANALYSIS: ethers.keccak256(ethers.toUtf8Bytes('METADATA_ANALYSIS')),
  CONTENT_AUDIT: ethers.keccak256(ethers.toUtf8Bytes('CONTENT_AUDIT')),
  KEYWORD_ANALYSIS: ethers.keccak256(ethers.toUtf8Bytes('KEYWORD_ANALYSIS')),
  LINK_VERIFICATION: ethers.keccak256(ethers.toUtf8Bytes('LINK_VERIFICATION')),
  PERFORMANCE_ANALYSIS: ethers.keccak256(ethers.toUtf8Bytes('PERFORMANCE_ANALYSIS')),
  BACKLINKS_ANALYSIS: ethers.keccak256(ethers.toUtf8Bytes('BACKLINKS_ANALYSIS')),
  SECURITY_AUDIT: ethers.keccak256(ethers.toUtf8Bytes('SECURITY_AUDIT')),
  WALLET_ANALYSIS: ethers.keccak256(ethers.toUtf8Bytes('WALLET_ANALYSIS')),
  BLOCKCHAIN_ANALYSIS: ethers.keccak256(ethers.toUtf8Bytes('BLOCKCHAIN_ANALYSIS')),
  AI_ASSISTANT_DASHBOARD: ethers.keccak256(ethers.toUtf8Bytes('AI_ASSISTANT_DASHBOARD')),
  SOCIAL_WEB3_ANALYSIS: ethers.keccak256(ethers.toUtf8Bytes('SOCIAL_WEB3_ANALYSIS')),
};

// Precios de las herramientas (en unidades mínimas del token, ej: wei para USDC)
export const TOOL_PRICES = {
  [TOOL_IDS.METADATA_ANALYSIS]: ethers.parseUnits('5', 18).toString(), // 5 USDC
  [TOOL_IDS.CONTENT_AUDIT]: ethers.parseUnits('5', 18).toString(), // 5 USDC
  [TOOL_IDS.KEYWORD_ANALYSIS]: ethers.parseUnits('5', 18).toString(), // 5 USDC
  [TOOL_IDS.LINK_VERIFICATION]: ethers.parseUnits('5', 18).toString(), // 5 USDC
  [TOOL_IDS.PERFORMANCE_ANALYSIS]: ethers.parseUnits('5', 18).toString(), // 5 USDC
  [TOOL_IDS.BACKLINKS_ANALYSIS]: ethers.parseUnits('5', 18).toString(), // 5 USDC
  [TOOL_IDS.SECURITY_AUDIT]: ethers.parseUnits('5', 18).toString(), // 5 USDC
  [TOOL_IDS.WALLET_ANALYSIS]: ethers.parseUnits('5', 18).toString(), // 5 USDC
  [TOOL_IDS.BLOCKCHAIN_ANALYSIS]: ethers.parseUnits('5', 18).toString(), // 5 USDC
  [TOOL_IDS.AI_ASSISTANT_DASHBOARD]: ethers.parseUnits('7', 18).toString(), // 7 USDC
  [TOOL_IDS.SOCIAL_WEB3_ANALYSIS]: ethers.parseUnits('5', 18).toString(), // 5 USDC
};

// Mapeo de nombres de herramientas a IDs
export const TOOL_NAMES_TO_IDS: Record<string, string> = {
  'metadata': TOOL_IDS.METADATA_ANALYSIS,
  'content': TOOL_IDS.CONTENT_AUDIT,
  'keywords': TOOL_IDS.KEYWORD_ANALYSIS,
  'links': TOOL_IDS.LINK_VERIFICATION,
  'performance': TOOL_IDS.PERFORMANCE_ANALYSIS,
  'backlinks': TOOL_IDS.BACKLINKS_ANALYSIS,
  'security': TOOL_IDS.SECURITY_AUDIT,
  'wallet': TOOL_IDS.WALLET_ANALYSIS,
  'onchain': TOOL_IDS.BLOCKCHAIN_ANALYSIS,
  'social': TOOL_IDS.SOCIAL_WEB3_ANALYSIS,

};

// Planes de precios según la nueva lógica del contrato - Modelo de pago por uso
export const PRICING_PLANS = {
  INDIVIDUAL_TOOLS: {
    id: 1,
    name: 'Pago por Uso',
    price: 'Desde $5',
    priceInWei: ethers.parseUnits('5', 18).toString(), // Precio base por herramienta
    tools: [], // Se seleccionan individualmente
    discount: 0, // Sin descuento para herramientas individuales
    features: [
      'Paga solo por las herramientas que necesites',
      'Precios desde $5 por herramienta',
      'Acceso inmediato tras el pago',
      'Sin compromisos mensuales',
      'Soporte por email'
    ],
    recommended: true,
    ctaText: 'Seleccionar Herramientas'
  },
  COMPLETE_AUDIT: {
    id: 2,
    name: 'Auditoría Completa',
    price: '$49.5',
    priceInWei: ethers.parseUnits('49.5', 18).toString(), // 55 - 10% descuento
    tools: ['metadata', 'content', 'keywords', 'links', 'performance', 'backlinks', 'security', 'wallet', 'onchain', 'social'],
    discount: 10, // 10% de descuento para auditoría completa
    features: [
      'Acceso a todas las 11 herramientas',
      'Análisis completo de tu proyecto',
      'Descuento del 10% sobre el precio total',
      'Soporte prioritario',
      'Recomendaciones personalizadas',
      'Informe detallado de resultados'
    ],
    recommended: false,
    ctaText: 'Obtener Auditoría Completa'
  },
  AI_SPECIAL_TOOL: {
    id: 3,
    name: 'Herramienta IA Especial',
    price: '$7',
    priceInWei: ethers.parseUnits('7', 18).toString(), // 7 USDC por uso
    tools: ['ai-assistant'], // Solo la herramienta de IA especial
    discount: 0, // Sin descuento
    features: [
      'Análisis profundo con IA especializada',
      'Recomendaciones personalizadas avanzadas',
      'Predicciones y análisis predictivo',
      'Detección de anomalías y riesgos',
      'Identificación de oportunidades',
      'Soporte premium especializado'
    ],
    recommended: false,
    ctaText: 'Usar Herramienta IA Especial'
  }
};

/**
 * Calcula el precio con descuento basado en el ID numérico del plan
 * @param planId ID del plan (1: INDIVIDUAL_TOOLS, 2: COMPLETE_AUDIT)
 * @param originalPrice Precio original en wei
 * @returns Precio con descuento en wei
 */
export function calculateDiscountedPriceByNumericId(planId: number, originalPrice: bigint): bigint {
  // Aplicar descuentos según el plan
  switch (planId) {
    case 1: // INDIVIDUAL_TOOLS - sin descuento
      return originalPrice;
    case 2: // COMPLETE_AUDIT - 10% de descuento para auditoría completa
      return originalPrice * BigInt(90) / BigInt(100);
    case 3: // AI_SPECIAL_TOOL - sin descuento
      return originalPrice;
    default:
      return originalPrice;
  }
}

// Función para calcular el precio con descuento basado en el ID de string del plan
export function calculateDiscountedPrice(planId: string): { originalPrice: string, discountedPrice: string } {
  const plan = Object.values(PRICING_PLANS).find(p => p.id === parseInt(planId));
  
  if (!plan) {
    throw new Error(`Plan con ID ${planId} no encontrado`);
  }
  
  // Usar parseUnits en lugar de BigNumber.from
  const originalPriceWei = ethers.parseUnits(plan.priceInWei, 0);
  const discountMultiplier = (100 - plan.discount) / 100;
  
  // Convertir a bigint para hacer los cálculos
  const originalPriceBigInt = BigInt(plan.priceInWei);
  const discountedPriceBigInt = originalPriceBigInt * BigInt(Math.floor(discountMultiplier * 100)) / BigInt(100);
  
  return {
    originalPrice: originalPriceBigInt.toString(),
    discountedPrice: discountedPriceBigInt.toString()
  };
}

// Importar ABI generado automáticamente
import contractABI from './contract-abi.json';

// Reemplazar el ABI manual con el generado
export const CONTRACT_ABI = contractABI;