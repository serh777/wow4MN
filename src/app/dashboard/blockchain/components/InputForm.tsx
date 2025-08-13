'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Zap } from 'lucide-react';

interface FormData {
  contractAddress: string;
  network: string;
  analysisType: string;
  includeTransactionHistory: boolean;
  checkSecurity: boolean;
  analyzeGasOptimization: boolean;
  verifyCompliance: boolean;
  customRPC?: string;
  notes?: string;
}

interface InputFormProps {
  onSubmit: (data: FormData) => void;
  isLoading?: boolean;
}

export function InputForm({ onSubmit, isLoading = false }: InputFormProps) {
  const [formData, setFormData] = React.useState<FormData>({
    contractAddress: '',
    network: 'ethereum',
    analysisType: 'basic',
    includeTransactionHistory: true,
    checkSecurity: true,
    analyzeGasOptimization: false,
    verifyCompliance: false,
    customRPC: '',
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5" />
          Configuración del Análisis Blockchain
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Información básica */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="contractAddress">Dirección del Contrato *</Label>
              <Input
                id="contractAddress"
                type="text"
                placeholder="0x742d35Cc6634C0532925a3b8D4C9db96C4b4Db45"
                value={formData.contractAddress}
                onChange={(e) => handleInputChange('contractAddress', e.target.value)}
                required
                className="font-mono"
              />
              <p className="text-sm text-muted-foreground">
                Dirección del contrato inteligente a analizar
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="network">Red Blockchain</Label>
              <Select
                value={formData.network}
                onValueChange={(value) => handleInputChange('network', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una red" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ethereum">Ethereum Mainnet</SelectItem>
                  <SelectItem value="polygon">Polygon</SelectItem>
                  <SelectItem value="bsc">Binance Smart Chain</SelectItem>
                  <SelectItem value="arbitrum">Arbitrum One</SelectItem>
                  <SelectItem value="optimism">Optimism</SelectItem>
                  <SelectItem value="avalanche">Avalanche C-Chain</SelectItem>
                  <SelectItem value="fantom">Fantom Opera</SelectItem>
                  <SelectItem value="goerli">Ethereum Goerli (Testnet)</SelectItem>
                  <SelectItem value="sepolia">Ethereum Sepolia (Testnet)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">
                Red donde está desplegado el contrato
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="analysisType">Tipo de Análisis</Label>
              <Select
                value={formData.analysisType}
                onValueChange={(value) => handleInputChange('analysisType', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona el tipo de análisis" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="basic">Básico - Información general</SelectItem>
                  <SelectItem value="security">Seguridad - Análisis de vulnerabilidades</SelectItem>
                  <SelectItem value="performance">Rendimiento - Optimización de gas</SelectItem>
                  <SelectItem value="comprehensive">Completo - Análisis exhaustivo</SelectItem>
                  <SelectItem value="compliance">Cumplimiento - Estándares y regulaciones</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">
                Nivel de profundidad del análisis
              </p>
            </div>
          </div>

          {/* Opciones avanzadas */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Opciones de Análisis</h3>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="includeTransactionHistory"
                  checked={formData.includeTransactionHistory}
                  onCheckedChange={(checked) => handleInputChange('includeTransactionHistory', checked)}
                />
                <Label htmlFor="includeTransactionHistory" className="text-sm">
                  Incluir historial de transacciones
                </Label>
              </div>
              <p className="text-xs text-muted-foreground ml-6">
                Analizar las últimas 1000 transacciones del contrato
              </p>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="checkSecurity"
                  checked={formData.checkSecurity}
                  onCheckedChange={(checked) => handleInputChange('checkSecurity', checked)}
                />
                <Label htmlFor="checkSecurity" className="text-sm">
                  Verificación de seguridad
                </Label>
              </div>
              <p className="text-xs text-muted-foreground ml-6">
                Detectar vulnerabilidades conocidas y patrones de riesgo
              </p>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="analyzeGasOptimization"
                  checked={formData.analyzeGasOptimization}
                  onCheckedChange={(checked) => handleInputChange('analyzeGasOptimization', checked)}
                />
                <Label htmlFor="analyzeGasOptimization" className="text-sm">
                  Análisis de optimización de gas
                </Label>
              </div>
              <p className="text-xs text-muted-foreground ml-6">
                Identificar oportunidades para reducir costos de gas
              </p>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="verifyCompliance"
                  checked={formData.verifyCompliance}
                  onCheckedChange={(checked) => handleInputChange('verifyCompliance', checked)}
                />
                <Label htmlFor="verifyCompliance" className="text-sm">
                  Verificar cumplimiento de estándares
                </Label>
              </div>
              <p className="text-xs text-muted-foreground ml-6">
                Comprobar adherencia a ERC-20, ERC-721, ERC-1155, etc.
              </p>
            </div>
          </div>

          {/* Configuración avanzada */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Configuración Avanzada</h3>
            
            <div className="space-y-2">
              <Label htmlFor="customRPC">RPC Personalizado (Opcional)</Label>
              <Input
                id="customRPC"
                type="url"
                placeholder="https://mainnet.infura.io/v3/YOUR-PROJECT-ID"
                value={formData.customRPC}
                onChange={(e) => handleInputChange('customRPC', e.target.value)}
              />
              <p className="text-sm text-muted-foreground">
                URL de RPC personalizada para conectar a la blockchain
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notas Adicionales</Label>
              <Textarea
                id="notes"
                placeholder="Información adicional sobre el contrato o aspectos específicos a analizar..."
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                rows={3}
              />
              <p className="text-sm text-muted-foreground">
                Contexto adicional que pueda ayudar en el análisis
              </p>
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading || !formData.contractAddress.trim()}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analizando Contrato...
              </>
            ) : (
              <>
                <Zap className="mr-2 h-4 w-4" />
                Iniciar Análisis Blockchain
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}