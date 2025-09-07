'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

interface MetadataAnalysisFormProps {
  onSubmit: (data: any) => void;
  loading?: boolean;
}

export function MetadataAnalysisForm({ onSubmit, loading = false }: MetadataAnalysisFormProps) {
  const [formData, setFormData] = React.useState({
    url: '',
    analysisType: 'comprehensive',
    includeOpenGraph: true,
    includeTwitterCards: true,
    includeStructuredData: true,
    includeMetaTags: true,
    selectedIndexer: 'default'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Análisis de Metadatos</CardTitle>
        <CardDescription>
          Analiza los metadatos de tu sitio web para optimizar SEO y redes sociales
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="url">URL del sitio web</Label>
            <Input
              id="url"
              type="url"
              placeholder="https://ejemplo.com"
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              required
            />
          </div>

          <Tabs value={formData.analysisType} onValueChange={(value) => setFormData({ ...formData, analysisType: value })}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="comprehensive">Completo</TabsTrigger>
              <TabsTrigger value="seo">SEO</TabsTrigger>
              <TabsTrigger value="social">Redes Sociales</TabsTrigger>
            </TabsList>

            <TabsContent value="comprehensive" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="openGraph"
                    checked={formData.includeOpenGraph}
                    onCheckedChange={(checked) => setFormData({ ...formData, includeOpenGraph: !!checked })}
                  />
                  <Label htmlFor="openGraph">Open Graph</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="twitterCards"
                    checked={formData.includeTwitterCards}
                    onCheckedChange={(checked) => setFormData({ ...formData, includeTwitterCards: !!checked })}
                  />
                  <Label htmlFor="twitterCards">Twitter Cards</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="structuredData"
                    checked={formData.includeStructuredData}
                    onCheckedChange={(checked) => setFormData({ ...formData, includeStructuredData: !!checked })}
                  />
                  <Label htmlFor="structuredData">Datos Estructurados</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="metaTags"
                    checked={formData.includeMetaTags}
                    onCheckedChange={(checked) => setFormData({ ...formData, includeMetaTags: !!checked })}
                  />
                  <Label htmlFor="metaTags">Meta Tags</Label>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="seo" className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Análisis enfocado en metadatos para optimización de motores de búsqueda
              </p>
            </TabsContent>

            <TabsContent value="social" className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Análisis enfocado en metadatos para redes sociales (Open Graph, Twitter Cards)
              </p>
            </TabsContent>
          </Tabs>

          <div className="space-y-2">
            <Label htmlFor="indexer">Indexador</Label>
            <Select value={formData.selectedIndexer} onValueChange={(value) => setFormData({ ...formData, selectedIndexer: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un indexador" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Indexador por defecto</SelectItem>
                <SelectItem value="advanced">Indexador avanzado</SelectItem>
                <SelectItem value="fast">Indexador rápido</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Analizando...' : 'Iniciar Análisis'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}