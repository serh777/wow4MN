'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, Shield, AlertTriangle, Lock } from 'lucide-react';

interface SecurityAnalysisFormProps {
  onSubmit: (data: SecurityAnalysisData) => void;
  loading: boolean;
}

export interface SecurityAnalysisData {
  contractAddress?: string;
  walletAddress?: string;
  websiteUrl?: string;
  analysisType: 'contract' | 'wallet' | 'website' | 'comprehensive';
  securityChecks: string[];
  additionalNotes?: string;
}

const SECURITY_CHECKS = [
  { id: 'smart_contract_audit', label: 'Auditoría de Contrato Inteligente', description: 'Revisa vulnerabilidades en el código del contrato' },
  { id: 'access_control', label: 'Control de Acceso', description: 'Verifica permisos y roles del contrato' },
  { id: 'reentrancy_check', label: 'Verificación de Reentrancy', description: 'Detecta vulnerabilidades de reentrancy' },
  { id: 'overflow_underflow', label: 'Overflow/Underflow', description: 'Verifica protecciones contra desbordamiento' },
  { id: 'wallet_security', label: 'Seguridad de Wallet', description: 'Analiza la seguridad de la wallet conectada' },
  { id: 'transaction_analysis', label: 'Análisis de Transacciones', description: 'Revisa patrones de transacciones sospechosas' },
  { id: 'liquidity_risks', label: 'Riesgos de Liquidez', description: 'Evalúa riesgos relacionados con liquidez' },
  { id: 'governance_security', label: 'Seguridad de Gobernanza', description: 'Analiza mecanismos de gobernanza' },
  { id: 'oracle_security', label: 'Seguridad de Oráculos', description: 'Verifica la seguridad de oráculos externos' },
  { id: 'frontend_security', label: 'Seguridad Frontend', description: 'Analiza la seguridad del sitio web' }
];

export function SecurityAnalysisForm({ onSubmit, loading }: SecurityAnalysisFormProps) {
  const [formData, setFormData] = React.useState<SecurityAnalysisData>({
    analysisType: 'comprehensive',
    securityChecks: []
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleCheckChange = (checkId: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      securityChecks: checked 
        ? [...prev.securityChecks, checkId]
        : prev.securityChecks.filter(id => id !== checkId)
    }));
  };

  const selectAllChecks = () => {
    setFormData(prev => ({
      ...prev,
      securityChecks: SECURITY_CHECKS.map(check => check.id)
    }));
  };

  const clearAllChecks = () => {
    setFormData(prev => ({
      ...prev,
      securityChecks: []
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Tabs value={formData.analysisType} onValueChange={(value) => 
        setFormData(prev => ({ ...prev, analysisType: value as SecurityAnalysisData['analysisType'] }))
      }>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="contract" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Contrato
          </TabsTrigger>
          <TabsTrigger value="wallet" className="flex items-center gap-2">
            <Lock className="h-4 w-4" />
            Wallet
          </TabsTrigger>
          <TabsTrigger value="website" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Website
          </TabsTrigger>
          <TabsTrigger value="comprehensive" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Completo
          </TabsTrigger>
        </TabsList>

        <TabsContent value="contract" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="contractAddress">Dirección del Contrato</Label>
            <Input
              id="contractAddress"
              placeholder="0x..."
              value={formData.contractAddress || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, contractAddress: e.target.value }))}
            />
          </div>
        </TabsContent>

        <TabsContent value="wallet" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="walletAddress">Dirección de la Wallet</Label>
            <Input
              id="walletAddress"
              placeholder="0x..."
              value={formData.walletAddress || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, walletAddress: e.target.value }))}
            />
          </div>
        </TabsContent>

        <TabsContent value="website" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="websiteUrl">URL del Sitio Web</Label>
            <Input
              id="websiteUrl"
              placeholder="https://..."
              value={formData.websiteUrl || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, websiteUrl: e.target.value }))}
            />
          </div>
        </TabsContent>

        <TabsContent value="comprehensive" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contractAddressComp">Dirección del Contrato (Opcional)</Label>
              <Input
                id="contractAddressComp"
                placeholder="0x..."
                value={formData.contractAddress || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, contractAddress: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="walletAddressComp">Dirección de la Wallet (Opcional)</Label>
              <Input
                id="walletAddressComp"
                placeholder="0x..."
                value={formData.walletAddress || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, walletAddress: e.target.value }))}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="websiteUrlComp">URL del Sitio Web (Opcional)</Label>
            <Input
              id="websiteUrlComp"
              placeholder="https://..."
              value={formData.websiteUrl || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, websiteUrl: e.target.value }))}
            />
          </div>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Verificaciones de Seguridad</CardTitle>
              <CardDescription>
                Selecciona las verificaciones de seguridad que deseas realizar
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button type="button" variant="outline" size="sm" onClick={selectAllChecks}>
                Seleccionar Todo
              </Button>
              <Button type="button" variant="outline" size="sm" onClick={clearAllChecks}>
                Limpiar
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {SECURITY_CHECKS.map((check) => (
              <div key={check.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                <Checkbox
                  id={check.id}
                  checked={formData.securityChecks.includes(check.id)}
                  onCheckedChange={(checked) => handleCheckChange(check.id, checked as boolean)}
                />
                <div className="space-y-1">
                  <Label htmlFor={check.id} className="text-sm font-medium cursor-pointer">
                    {check.label}
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    {check.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="space-y-2">
        <Label htmlFor="additionalNotes">Notas Adicionales (Opcional)</Label>
        <Textarea
          id="additionalNotes"
          placeholder="Describe cualquier preocupación específica de seguridad o contexto adicional..."
          value={formData.additionalNotes || ''}
          onChange={(e) => setFormData(prev => ({ ...prev, additionalNotes: e.target.value }))}
          rows={3}
        />
      </div>

      <Button 
        type="submit" 
        disabled={loading || formData.securityChecks.length === 0}
        className="w-full"
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Analizando Seguridad...
          </>
        ) : (
          <>
            <Shield className="mr-2 h-4 w-4" />
            Iniciar Auditoría de Seguridad
          </>
        )}
      </Button>
    </form>
  );
}