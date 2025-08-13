'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Globe, Zap, Shield, TrendingUp, Brain, Info } from 'lucide-react';
import { getActiveIndexersForDropdown, getNetworkLabel } from '@/utils/indexer-utils';
import { 
  isWeb3URL, 
  isContractAddress, 
  getWeb3URLSuggestions, 
  detectWeb3SiteType, 
  validateAnalysisViability,
  isNetworkIndexerCompatible 
} from '@/utils/web3-validation';

interface FormData {
  url: string;
  analysisType: string;
  network: string;
  contractAddress: string;
  includeMetadata: boolean;
  includeEvents: boolean;
  includeTransactions: boolean;
  selectedIndexer: string;
  prompt: string;
}

interface InputFormProps {
  onSubmit: (data: FormData) => void;
  loading: boolean;
  onReset: () => void;
}

const analysisTypes = [
  { value: 'integral', label: 'Análisis Integral', icon: Globe, description: 'Evaluación general del sitio Web3: UI/UX, funcionalidad, rendimiento y aspectos básicos de usabilidad' },
  { value: 'predictivo', label: 'Análisis Predictivo', icon: TrendingUp, description: 'Predicciones basadas en datos históricos y tendencias del mercado' },
  { value: 'anomalias', label: 'Detección de Anomalías', icon: Shield, description: 'Identificación de patrones inusuales y riesgos de seguridad' },
  { value: 'oportunidades', label: 'Identificación de Oportunidades', icon: Zap, description: 'Descubrimiento de oportunidades de crecimiento y optimización' },
  { value: 'ai', label: 'Análisis Avanzado IA Web3', icon: Brain, description: 'Análisis técnico profundo con IA: datos blockchain en tiempo real, auditoría de contratos inteligentes, métricas avanzadas y análisis de código' }
];

// Obtener indexadores activos desde las utilidades
const userIndexers = getActiveIndexersForDropdown().map(indexer => ({
  value: indexer.value,
  label: indexer.label,
  description: indexer.description,
  active: true, // Solo indexadores activos
  network: indexer.network,
  dataType: indexer.dataType
}));

const promptExamples = [
  {
    title: "Análisis de Rendimiento DeFi",
    prompt: "Analiza el rendimiento de este protocolo DeFi, incluyendo TVL, volumen de transacciones, y comparación con competidores principales."
  },
  {
    title: "Evaluación de Seguridad de Contrato",
    prompt: "Evalúa la seguridad del contrato inteligente, identifica vulnerabilidades potenciales y sugiere mejoras en el código."
  },
  {
    title: "Análisis de Tokenomics",
    prompt: "Examina la estructura tokenómica del proyecto, distribución de tokens, mecanismos de inflación/deflación y sostenibilidad económica."
  },
  {
    title: "Estudio de Adopción y Comunidad",
    prompt: "Analiza el crecimiento de la comunidad, adopción del protocolo, actividad en redes sociales y engagement de usuarios."
  }
];

const networks = [
  { value: 'ethereum', label: 'Ethereum' },
  { value: 'polygon', label: 'Polygon' },
  { value: 'bsc', label: 'BSC' },
  { value: 'arbitrum', label: 'Arbitrum' },
  { value: 'optimism', label: 'Optimism' },
  { value: 'avalanche', label: 'Avalanche' }
];

const indexers = [
  { value: 'thegraph', label: 'The Graph', description: 'Protocolo descentralizado para indexar datos blockchain' },
  { value: 'moralis', label: 'Moralis', description: 'Plataforma completa de desarrollo Web3' },
  { value: 'alchemy', label: 'Alchemy', description: 'Infraestructura blockchain de nivel empresarial' },
  { value: 'infura', label: 'Infura', description: 'API confiable para aplicaciones Ethereum' },
  { value: 'quicknode', label: 'QuickNode', description: 'Nodos blockchain rápidos y confiables' },
  { value: 'ankr', label: 'Ankr', description: 'Infraestructura Web3 distribuida' }
];

export function InputForm({ onSubmit, loading, onReset }: InputFormProps) {
  const [formData, setFormData] = useState<FormData>({
    url: '',
    analysisType: 'integral',
    network: 'ethereum',
    contractAddress: '',
    includeMetadata: true,
    includeEvents: true,
    includeTransactions: false,
    selectedIndexer: userIndexers.length > 0 ? userIndexers[0].value : '',
    prompt: ''
  });
  
  const [urlValidation, setUrlValidation] = useState<{
    isValid: boolean;
    isWeb3: boolean;
    siteType: string;
    suggestions: string[];
  }>({ isValid: true, isWeb3: true, siteType: '', suggestions: [] });
  
  const [analysisValidation, setAnalysisValidation] = useState<{
    isValid: boolean;
    errors: string[];
    warnings: string[];
  }>({ isValid: true, errors: [], warnings: [] });

  const [showInfoDialog, setShowInfoDialog] = useState(false);

  // Validación en tiempo real de URL
  const validateURL = (url: string) => {
    if (!url) {
      setUrlValidation({ isValid: true, isWeb3: true, siteType: '', suggestions: [] });
      return;
    }
    
    const isWeb3 = isWeb3URL(url);
    const siteType = isWeb3 ? detectWeb3SiteType(url) : '';
    const suggestions = isWeb3 ? [] : getWeb3URLSuggestions(url);
    
    setUrlValidation({
      isValid: isWeb3,
      isWeb3,
      siteType,
      suggestions
    });
  };
  
  // Validación completa del análisis
  const validateAnalysis = () => {
    const selectedIndexer = userIndexers.find(indexer => indexer.value === formData.selectedIndexer);
    
    const validation = validateAnalysisViability({
      url: formData.url,
      network: formData.network,
      selectedIndexer: formData.selectedIndexer,
      indexerNetwork: selectedIndexer?.network
    });
    
    setAnalysisValidation(validation);
    return validation;
  };

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Validar URL en tiempo real
    if (field === 'url') {
      validateURL(value);
    }
    
    // Validar análisis cuando cambian campos críticos
    if (['url', 'network', 'selectedIndexer'].includes(field)) {
      setTimeout(() => validateAnalysis(), 100);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar antes de enviar
    const validation = validateAnalysis();
    if (!validation.isValid) {
      return; // No enviar si hay errores
    }
    
    onSubmit(formData);
  };

  const selectedAnalysisType = analysisTypes.find(type => type.value === formData.analysisType);
  const selectedIndexer = userIndexers.find(indexer => indexer.value === formData.selectedIndexer);

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-6 w-6 text-blue-600" />
            Análisis IA Web3
          </CardTitle>
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 dark:hover:bg-blue-950"
              onMouseEnter={() => setShowInfoDialog(true)}
              onMouseLeave={() => setShowInfoDialog(false)}
            >
              <Info className="h-4 w-4 mr-1" />
              Guía de Uso
            </Button>
            
            {showInfoDialog && (
              <div className="absolute top-full right-0 mt-2 w-96 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-50 transition-all duration-200 transform scale-100">
                <h3 className="font-semibold text-lg mb-3 text-gray-900 dark:text-white">Guía de Uso - Análisis IA Web3</h3>
                
                <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
                  <div>
                    <h4 className="font-medium text-blue-600 dark:text-blue-400 mb-1">Pasos para el Análisis Web3:</h4>
                    <ol className="list-decimal list-inside space-y-1 ml-2">
                      <li>Ingresa una URL de sitio Web3 válida (DApp, protocolo DeFi, marketplace NFT, etc.) o dirección de contrato</li>
                      <li>El sistema validará automáticamente que sea un sitio Web3 y detectará su tipo</li>
                      <li>Selecciona el tipo de análisis según tus necesidades</li>
                      <li>Elige la red blockchain correspondiente al sitio/contrato</li>
                      <li>Selecciona un indexador compatible con la red elegida</li>
                      <li>Configura las opciones de análisis blockchain</li>
                      <li>Revisa las validaciones y advertencias antes de continuar</li>
                      <li>Haz clic en &quot;Iniciar Análisis IA Web3&quot;</li>
                    </ol>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-green-600 dark:text-green-400 mb-1">Sitios Web3 Compatibles:</h4>
                    <ul className="list-disc list-inside space-y-1 ml-2">
                      <li><strong>Protocolos DeFi:</strong> Uniswap, Aave, Compound, Curve, etc.</li>
                      <li><strong>Marketplaces NFT:</strong> OpenSea, Rarible, Foundation, etc.</li>
                      <li><strong>Gaming/Metaverse:</strong> Decentraland, Sandbox, Axie Infinity, etc.</li>
                      <li><strong>Exploradores:</strong> Etherscan, Polygonscan, BSCScan, etc.</li>
                      <li><strong>Plataformas DAO:</strong> Snapshot, Aragon, DAOhaus, etc.</li>
                      <li><strong>Dominios Web3 Descentralizados:</strong> .dream, .crypto, .nft, .dao, .web3, .eth, etc.</li>
                      <li><strong>Unstoppable Domains:</strong> .crypto, .nft, .blockchain, .bitcoin, .wallet, etc.</li>
                      <li><strong>Handshake Domains:</strong> .dream, .web3, .dapp, .metaverse, .gamefi, etc.</li>
                      <li><strong>Direcciones de Contratos:</strong> 0x1234...abcd</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-purple-600 dark:text-purple-400 mb-1">Compatibilidad Red-Indexador:</h4>
                    <ul className="list-disc list-inside space-y-1 ml-2">
                      <li><strong>Validación Automática:</strong> El sistema verifica compatibilidad entre red e indexador</li>
                      <li><strong>Indexadores Filtrados:</strong> Solo se muestran indexadores compatibles con la red seleccionada</li>
                      <li><strong>Advertencias:</strong> Se notifican posibles conflictos de configuración</li>
                      <li><strong>Mejores Resultados:</strong> La compatibilidad asegura datos precisos y completos</li>
                    </ul>
                  </div>
                  
                  <div className="bg-blue-50 dark:bg-blue-950 p-2 rounded border-l-4 border-blue-400">
                    <p className="text-xs"><strong>🔒 Importante:</strong> Esta herramienta está diseñada exclusivamente para análisis Web3. Solo acepta URLs de sitios Web3 verificados o direcciones de contratos válidas. Los indexadores deben ser compatibles con la red seleccionada para garantizar análisis precisos.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* URL/Contract Input */}
          <div className="space-y-2">
            <Label htmlFor="url">URL del Sitio Web Web3, DApp o Dirección de Contrato *</Label>
            <Input
              id="url"
              placeholder="https://app.uniswap.org, https://opensea.io o 0x1234..."
              value={formData.url}
              onChange={(e) => handleInputChange('url', e.target.value)}
              required
              className={`w-full ${
                formData.url && !urlValidation.isValid 
                  ? 'border-red-500 focus:border-red-500' 
                  : formData.url && urlValidation.isValid 
                  ? 'border-green-500 focus:border-green-500' 
                  : ''
              }`}
            />
            
            {/* Validación y sugerencias de URL */}
            {formData.url && (
              <div className="space-y-2">
                {urlValidation.isValid ? (
                  <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-xs font-medium">
                      ✓ Sitio Web3 detectado: {urlValidation.siteType}
                    </span>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span className="text-xs font-medium">
                        ⚠ Esta URL no parece ser de un sitio Web3
                      </span>
                    </div>
                    {urlValidation.suggestions.length > 0 && (
                      <div className="bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
                        <div className="text-xs text-yellow-800 dark:text-yellow-200">
                          {urlValidation.suggestions.map((suggestion, index) => (
                            <div key={index} className="mb-1">{suggestion}</div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
            
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Solo se pueden analizar sitios Web3, DApps o direcciones de contratos inteligentes
            </p>
          </div>

          {/* Analysis Type */}
          <div className="space-y-2">
            <Label htmlFor="analysisType">Tipo de Análisis *</Label>
            <Select value={formData.analysisType} onValueChange={(value) => handleInputChange('analysisType', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona el tipo de análisis" />
              </SelectTrigger>
              <SelectContent>
                {analysisTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    <div className="flex items-center gap-2">
                      <type.icon className="h-4 w-4" />
                      <span>{type.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {formData.analysisType && (
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {analysisTypes.find(type => type.value === formData.analysisType)?.description}
              </p>
            )}
          </div>

          {/* Network Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="network">Red Blockchain</Label>
              <Select value={formData.network} onValueChange={(value) => handleInputChange('network', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una red" />
                </SelectTrigger>
                <SelectContent>
                  {networks.map((network) => (
                    <SelectItem key={network.value} value={network.value}>
                      {network.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="contractAddress">Dirección del Contrato (Opcional)</Label>
              <Input
                id="contractAddress"
                placeholder="0x..."
                value={formData.contractAddress}
                onChange={(e) => handleInputChange('contractAddress', e.target.value)}
              />
            </div>
          </div>

          {/* User Indexer Selection */}
          <div className="space-y-2">
            <Label htmlFor="selectedIndexer">Mis Indexadores Creados *</Label>
            <Select value={formData.selectedIndexer} onValueChange={(value) => handleInputChange('selectedIndexer', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un indexador" />
              </SelectTrigger>
              <SelectContent>
                {userIndexers.filter(indexer => indexer.active).map((indexer) => {
                  const isCompatible = isNetworkIndexerCompatible(formData.network, indexer.network);
                  return (
                    <SelectItem key={indexer.value} value={indexer.value} disabled={!isCompatible}>
                      <div className="flex items-center justify-between w-full">
                        <div>
                          <div className={`font-medium ${!isCompatible ? 'text-gray-400' : ''}`}>
                            {indexer.label}
                          </div>
                          <div className={`text-xs ${!isCompatible ? 'text-gray-400' : 'text-muted-foreground'}`}>
                            {indexer.description}
                          </div>
                        </div>
                        <div className="flex gap-1 ml-2">
                          <Badge 
                            variant={isCompatible ? "outline" : "secondary"} 
                            className={`text-xs ${!isCompatible ? 'opacity-50' : ''}`}
                          >
                            {getNetworkLabel(indexer.network)}
                          </Badge>
                          {isCompatible ? (
                            <Badge variant="default" className="text-xs bg-green-500">
                              Compatible
                            </Badge>
                          ) : (
                            <Badge variant="destructive" className="text-xs">
                              Incompatible
                            </Badge>
                          )}
                        </div>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>

            <p className="text-xs text-gray-500 dark:text-gray-400">
              Solo se muestran indexadores activos y compatibles con la red seleccionada. Gestiona tus indexadores desde la herramienta de Indexador Blockchain.
            </p>
          </div>
          
          {/* Validaciones y Advertencias del Análisis */}
          {(analysisValidation.errors.length > 0 || analysisValidation.warnings.length > 0) && (
            <div className="space-y-3">
              {analysisValidation.errors.length > 0 && (
                <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="text-sm font-medium text-red-800 dark:text-red-200">
                      Errores que impiden el análisis:
                    </span>
                  </div>
                  <ul className="text-xs text-red-700 dark:text-red-300 space-y-1">
                    {analysisValidation.errors.map((error, index) => (
                      <li key={index}>• {error}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {analysisValidation.warnings.length > 0 && (
                <div className="bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                      Advertencias:
                    </span>
                  </div>
                  <ul className="text-xs text-yellow-700 dark:text-yellow-300 space-y-1">
                    {analysisValidation.warnings.map((warning, index) => (
                      <li key={index}>• {warning}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Analysis Options */}
          <div className="space-y-3">
            <Label>Opciones de Análisis</Label>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="includeMetadata"
                  checked={formData.includeMetadata}
                  onCheckedChange={(checked) => handleInputChange('includeMetadata', checked)}
                />
                <Label htmlFor="includeMetadata" className="text-sm font-normal">
                  Incluir análisis de metadatos
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="includeEvents"
                  checked={formData.includeEvents}
                  onCheckedChange={(checked) => handleInputChange('includeEvents', checked)}
                />
                <Label htmlFor="includeEvents" className="text-sm font-normal">
                  Incluir eventos de contratos inteligentes
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="includeTransactions"
                  checked={formData.includeTransactions}
                  onCheckedChange={(checked) => handleInputChange('includeTransactions', checked)}
                />
                <Label htmlFor="includeTransactions" className="text-sm font-normal">
                  Incluir análisis de transacciones
                </Label>
              </div>
            </div>
          </div>

          {/* Custom Prompt */}
          <div className="space-y-3">
            <Label htmlFor="prompt">Prompt Personalizado (Opcional)</Label>
            <Textarea
              id="prompt"
              placeholder="Describe aspectos específicos que quieres que la IA analice..."
              value={formData.prompt}
              onChange={(e) => handleInputChange('prompt', e.target.value)}
              rows={3}
            />
            
            {/* Prompt Examples */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Ejemplos de Prompts Personalizados</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {promptExamples.map((example, index) => (
                  <div
                    key={index}
                    className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:border-blue-300 dark:hover:border-blue-600 transition-colors"
                    onClick={() => handleInputChange('prompt', example.prompt)}
                  >
                    <div className="font-medium text-sm text-blue-600 dark:text-blue-400 mb-1">
                      {example.title}
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                      {example.prompt}
                    </p>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Haz clic en cualquier ejemplo para usarlo como prompt personalizado
              </p>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={loading || !formData.url || !formData.selectedIndexer || !analysisValidation.isValid || !urlValidation.isValid}
              className="flex-1"
            >
              {loading ? (
                'Analizando...'
              ) : !urlValidation.isValid ? (
                'URL Web3 Requerida'
              ) : !formData.selectedIndexer ? (
                'Selecciona un Indexador'
              ) : !analysisValidation.isValid ? (
                'Corrige los Errores'
              ) : (
                'Iniciar Análisis IA Web3'
              )}
            </Button>
            
            <Button
              type="button"
              variant="outline"
              onClick={onReset}
              disabled={loading}
            >
              Limpiar
            </Button>
          </div>

          {/* Selected Analysis Info */}
          {selectedAnalysisType && (
            <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <selectedAnalysisType.icon className="h-4 w-4 text-blue-600" />
                <span className="font-medium text-sm">Análisis Seleccionado: {selectedAnalysisType.label}</span>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">{selectedAnalysisType.description}</p>
              {selectedIndexer && (
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  Indexador: {selectedIndexer.label} - {selectedIndexer.description}
                </p>
              )}
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}