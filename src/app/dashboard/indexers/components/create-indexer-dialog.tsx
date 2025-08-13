"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { IconWrapper } from '@/components/ui/icon-wrapper';

interface CreateIndexerDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (indexerData: IndexerFormData) => void;
}

export interface IndexerFormData {
  name: string;
  description: string;
  network: string;
  dataType: string[];
  filters?: string;
}

export function CreateIndexerDialog({ isOpen, onClose, onSave }: CreateIndexerDialogProps) {
  const [formData, setFormData] = useState<IndexerFormData>({
    name: '',
    description: '',
    network: 'ethereum',
    dataType: ['blocks'],
    filters: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar error cuando el usuario corrige el campo
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    
    setFormData(prev => {
      const currentDataTypes = [...prev.dataType];
      
      if (checked && !currentDataTypes.includes(value)) {
        currentDataTypes.push(value);
      } else if (!checked && currentDataTypes.includes(value)) {
        const index = currentDataTypes.indexOf(value);
        currentDataTypes.splice(index, 1);
      }
      
      return {
        ...prev,
        dataType: currentDataTypes
      };
    });
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es obligatorio';
    }
    
    if (formData.dataType.length === 0) {
      newErrors.dataType = 'Selecciona al menos un tipo de datos';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSave(formData);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-background rounded-lg shadow-lg w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Crear Nuevo Indexador</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <IconWrapper icon="x" className="h-4 w-4" />
          </Button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium">
              Nombre del Indexador*
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md ${errors.name ? 'border-red-500' : 'border-input'}`}
              placeholder="Ej: Indexador de Tokens ERC20"
            />
            {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}
          </div>
          
          <div className="space-y-2">
            <label htmlFor="description" className="block text-sm font-medium">
              Descripción
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-input rounded-md"
              placeholder="Describe el propósito de este indexador..."
            />
          </div>
          
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
              <option value="bsc">Binance Smart Chain</option>
            </select>
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium">
              Tipo de Datos a Indexar*
            </label>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="blocks"
                  value="blocks"
                  checked={formData.dataType.includes('blocks')}
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
                  checked={formData.dataType.includes('transactions')}
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
                  checked={formData.dataType.includes('events')}
                  onChange={handleCheckboxChange}
                  className="h-4 w-4 mr-2"
                />
                <label htmlFor="events" className="text-sm">Eventos</label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="logs"
                  value="logs"
                  checked={formData.dataType.includes('logs')}
                  onChange={handleCheckboxChange}
                  className="h-4 w-4 mr-2"
                />
                <label htmlFor="logs" className="text-sm">Logs</label>
              </div>
            </div>
            {errors.dataType && <p className="text-red-500 text-xs">{errors.dataType}</p>}
          </div>
          
          <div className="space-y-2">
            <label htmlFor="filters" className="block text-sm font-medium">
              Filtros (Opcional)
            </label>
            <textarea
              id="filters"
              name="filters"
              value={formData.filters || ''}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-input rounded-md font-mono text-sm"
              placeholder='Ej: {"address":"0x1234...","event":"Transfer"}'
            />
            <p className="text-xs text-muted-foreground">
              Introduce filtros en formato JSON para limitar los datos indexados
            </p>
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              <IconWrapper icon="save" className="mr-2 h-4 w-4" />
              Guardar Indexador
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}