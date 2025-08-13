'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';

interface FormData {
  projectName: string;
  projectUrl: string;
  competitors: string;
  niche: string;
  analysisType: string;
}

interface InputFormProps {
  onSubmit: (data: FormData) => void;
  isLoading: boolean;
}

export function InputForm({ onSubmit, isLoading }: InputFormProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const data: FormData = {
      projectName: formData.get('projectName') as string || '',
      projectUrl: formData.get('projectUrl') as string || '',
      competitors: formData.get('competitors') as string || '',
      niche: formData.get('niche') as string || 'nft',
      analysisType: formData.get('analysisType') as string || 'complete'
    };
    
    onSubmit(data);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configuración del Análisis</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="projectName">Nombre del Proyecto</Label>
              <Input
                id="projectName"
                name="projectName"
                placeholder="Mi Proyecto Web3"
                disabled={isLoading}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="projectUrl">URL del Proyecto *</Label>
              <Input
                id="projectUrl"
                name="projectUrl"
                placeholder="https://miproyecto.eth"
                required
                disabled={isLoading}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="competitors">Competidores</Label>
              <Textarea
                id="competitors"
                name="competitors"
                placeholder="URLs de competidores separadas por comas"
                className="min-h-[100px]"
                disabled={isLoading}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="niche">Nicho</Label>
              <Select name="niche" defaultValue="nft" disabled={isLoading}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un nicho" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="nft">NFT</SelectItem>
                  <SelectItem value="defi">DeFi</SelectItem>
                  <SelectItem value="gaming">Gaming</SelectItem>
                  <SelectItem value="dao">DAO</SelectItem>
                  <SelectItem value="dapp">dApp</SelectItem>
                  <SelectItem value="infrastructure">Infraestructura</SelectItem>
                  <SelectItem value="other">Otro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="analysisType">Tipo de Análisis</Label>
              <Select name="analysisType" defaultValue="complete" disabled={isLoading}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona el tipo de análisis" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="complete">Análisis Completo</SelectItem>
                  <SelectItem value="seo">SEO Web3</SelectItem>
                  <SelectItem value="technical">Técnico</SelectItem>
                  <SelectItem value="social">Social</SelectItem>
                  <SelectItem value="onchain">On-chain</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analizando...
              </>
            ) : (
              'Iniciar Análisis de Competencia'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}