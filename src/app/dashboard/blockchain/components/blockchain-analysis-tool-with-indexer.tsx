"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { IconWrapper } from '@/components/ui/icon-wrapper';
import { useBlockchainAnalysis } from './use-blockchain-analysis';
import { useIndexerService } from '@/hooks/useIndexerService';

export function BlockchainAnalysisToolWithIndexer() {
  const { isLoading, results, handleSubmit } = useBlockchainAnalysis();
  const { indexers, filterIndexers } = useIndexerService();
  
  const [formData, setFormData] = useState({
    network: 'ethereum',
    address: '',
    fromBlock: '',
    toBlock: '',
    dataTypes: ['blocks', 'transactions']
  });

  // Verificar si hay indexadores disponibles para la red seleccionada
  const availableIndexers = filterIndexers({
    network: formData.network,
    dataType: formData.dataTypes
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    
    setFormData(prev => {
      const currentDataTypes = [...prev.dataTypes];
      
      if (checked && !currentDataTypes.includes(value)) {
        currentDataTypes.push(value);
      } else if (!checked && currentDataTypes.includes(value)) {
        const index = currentDataTypes.indexOf(value);
        currentDataTypes.splice(index, 1);
      }
      
      return {
        ...prev,
        dataTypes: currentDataTypes
      };
    });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Convertir los valores de bloque a números si están presentes
    const fromBlock = formData.fromBlock ? parseInt(formData.fromBlock) : undefined;
    const toBlock = formData.toBlock ? parseInt(formData.toBlock) : undefined;
    
    handleSubmit({
      contractAddress: formData.address,
      network: formData.network,
      analysisType: 'basic',
      includeTransactionHistory: true,
      checkSecurity: true,
      analyzeGasOptimization: false,
      verifyCompliance: false,
      customRPC: '',
      notes: `Analysis from block ${fromBlock} to ${toBlock}. Data types: ${formData.dataTypes.join(', ')}`
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Análisis de Blockchain</CardTitle>
        <CardDescription>
          Analiza datos de blockchain utilizando indexadores configurados
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="network" className="block text-sm font-medium">
              Red Blockchain
            </label>
            <select
              id="network"
              name="network"
              value={formData.network}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-input rounded-md"
            >
              <option value="ethereum">Ethereum Mainnet</option>
              <option value="goerli">Goerli (Testnet)</option>
              <option value="sepolia">Sepolia (Testnet)</option>
              <option value="polygon">Polygon</option>
              <option value="arbitrum">Arbitrum</option>
              <option value="optimism">Optimism</option>
            </select>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="address" className="block text-sm font-medium">
              Dirección (opcional)
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-input rounded-md"
              placeholder="0x..."
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="fromBlock" className="block text-sm font-medium">
                Desde Bloque (opcional)
              </label>
              <input
                type="number"
                id="fromBlock"
                name="fromBlock"
                value={formData.fromBlock}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-input rounded-md"
                placeholder="Ej: 12000000"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="toBlock" className="block text-sm font-medium">
                Hasta Bloque (opcional)
              </label>
              <input
                type="number"
                id="toBlock"
                name="toBlock"
                value={formData.toBlock}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-input rounded-md"
                placeholder="Ej: 12001000"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium">
              Tipos de Datos a Analizar
            </label>
            <div className="grid grid-cols-3 gap-2">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="blocks"
                  value="blocks"
                  checked={formData.dataTypes.includes('blocks')}
                  onChange={handleCheckboxChange}
                  className="h-4 w-4 mr-2"
                />
                <label htmlFor="blocks" className="text-sm">Bloques</label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="transactions"
                  value="transactions"
                  checked={formData.dataTypes.includes('transactions')}
                  onChange={handleCheckboxChange}
                  className="h-4 w-4 mr-2"
                />
                <label htmlFor="transactions" className="text-sm">Transacciones</label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="events"
                  value="events"
                  checked={formData.dataTypes.includes('events')}
                  onChange={handleCheckboxChange}
                  className="h-4 w-4 mr-2"
                />
                <label htmlFor="events" className="text-sm">Eventos</label>
              </div>
            </div>
          </div>
          
          {availableIndexers.length === 0 && (
            <div className="p-3 bg-yellow-100 text-yellow-800 rounded-md">
              <p className="text-sm">
                <IconWrapper icon="alert-triangle" className="h-4 w-4 inline mr-1" />
                No hay indexadores activos para la red {formData.network} con los tipos de datos seleccionados.
                Se intentará iniciar un indexador compatible si está disponible.
              </p>
            </div>
          )}
          
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading || formData.dataTypes.length === 0}
          >
            {isLoading ? (
              <>
                <IconWrapper icon="loader-2" className="mr-2 h-4 w-4 animate-spin" />
                Analizando...
              </>
            ) : (
              <>Analizar Datos Blockchain</>
            )}
          </Button>
        </form>
        
        {results && (
          <div className="mt-6 border-t pt-4">
            <h3 className="text-lg font-medium mb-2">Resultados del Análisis</h3>
            
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="bg-background border rounded-lg p-3">
                <p className="text-xs text-muted-foreground">Bloques Analizados</p>
                <p className="text-xl font-bold">{results.transactions.total}</p>
              </div>
              <div className="bg-background border rounded-lg p-3">
                <p className="text-xs text-muted-foreground">Transacciones</p>
                <p className="text-xl font-bold">{results.transactions.total}</p>
              </div>
              <div className="bg-background border rounded-lg p-3">
                <p className="text-xs text-muted-foreground">Eventos</p>
                <p className="text-xl font-bold">{results.transactions.successful}</p>
              </div>
            </div>
            
            {/* Aquí se pueden mostrar más detalles de los resultados */}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <p className="text-xs text-muted-foreground">
          Datos proporcionados por indexadores configurados
        </p>
        {results && (
          <div className="flex items-center">
            <span className="text-sm mr-2">Puntuación:</span>
            <span className="text-sm font-bold">{results.score}/100</span>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}