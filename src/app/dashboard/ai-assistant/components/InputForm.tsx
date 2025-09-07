'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Globe, Brain } from 'lucide-react';
import { 
  detectInputType,
  isValidWeb3Input,
  getWeb3URLSuggestions, 
  detectWeb3SiteType, 
  validateAnalysisViability
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

export default function InputForm({ onSubmit, loading, onReset }: InputFormProps) {
  const [formData, setFormData] = useState<FormData>({
    url: '',
    analysisType: 'completo',
    network: 'ethereum',
    contractAddress: '',
    includeMetadata: true,
    includeEvents: true,
    includeTransactions: true,
    selectedIndexer: 'moralis',
    prompt: ''
  });

  const [inputValidation, setInputValidation] = useState({
    isValid: false,
    inputType: '',
    suggestions: [] as string[],
    siteType: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === 'url') {
      const inputType = detectInputType(value);
      const isValid = isValidWeb3Input(value);
      const suggestions = getWeb3URLSuggestions(value);
      const siteType = detectWeb3SiteType(value);
      
      setInputValidation({
        isValid,
        inputType,
        suggestions,
        siteType
      });

      if (inputType === 'contract') {
        setFormData(prev => ({
          ...prev,
          contractAddress: value
        }));
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputValidation.isValid) {
      return;
    }

    const analysisViability = validateAnalysisViability({
      url: formData.url,
      network: 'ethereum',
      selectedIndexer: 'moralis'
    });

    if (!analysisViability.isValid) {
       console.warn('Analysis not valid:', analysisViability.errors);
       return;
     }

    onSubmit(formData);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="w-5 h-5" />
          Análisis Web3 Omnipotente
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="url" className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              URL, Wallet o Contrato Web3
            </Label>
            <Input
              id="url"
              name="url"
              type="text"
              value={formData.url}
              onChange={handleInputChange}
              placeholder="Ingresa URL, dirección wallet o contrato..."
              className="w-full"
            />
            
            {inputValidation.inputType && (
              <div className="flex flex-wrap gap-2 mt-2">
                <Badge variant="secondary">
                  Tipo: {inputValidation.inputType}
                </Badge>
                {inputValidation.siteType && (
                  <Badge variant="outline">
                    Sitio: {inputValidation.siteType}
                  </Badge>
                )}
              </div>
            )}
            
            {inputValidation.suggestions.length > 0 && (
              <div className="text-sm text-muted-foreground">
                <p>Sugerencias:</p>
                <ul className="list-disc list-inside ml-2">
                  {inputValidation.suggestions.map((suggestion, index) => (
                    <li key={index}>{suggestion}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <input type="hidden" name="analysisType" value="completo" />
          <input type="hidden" name="network" value="ethereum" />
          <input type="hidden" name="selectedIndexer" value="moralis" />
          <input type="hidden" name="includeMetadata" value="true" />
          <input type="hidden" name="includeEvents" value="true" />
          <input type="hidden" name="includeTransactions" value="true" />
          
          {formData.url && (
            <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-green-800 dark:text-green-200">
                  Sistema listo para análisis omnipotente
                </span>
              </div>
              <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                Configuración automática optimizada • Análisis completo activado • Todas las métricas incluidas
              </p>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={loading || !formData.url || !inputValidation.isValid}
              className="flex-1"
            >
              {loading ? (
                'Analizando...'
              ) : !inputValidation.isValid ? (
                'Entrada Web3 Válida Requerida'
              ) : (
                'Iniciar Análisis Omnipotente'
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
        </form>
      </CardContent>
    </Card>
  );
}