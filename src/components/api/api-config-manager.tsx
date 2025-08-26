'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Plus,
  Settings,
  Eye,
  EyeOff,
  Save,
  Trash2,
  Key,
  Globe,
  Clock,
  AlertTriangle,
  CheckCircle,
  Copy,
  ExternalLink
} from 'lucide-react';
import { useAPIValidator } from '@/hooks/use-api-validator';
import { APIConfig } from '@/utils/api-validator';
import { useToast } from '@/components/ui/use-toast';

interface APIConfigManagerProps {
  className?: string;
}

const APIConfigManager: React.FC<APIConfigManagerProps> = ({ className = '' }) => {
  const {
    getConfigs,
    addAPI,
    removeAPI,
    updateAPI,
    validateSingle,
    getAPIStatus
  } = useAPIValidator();
  
  const { toast } = useToast();
  const [configs, setConfigs] = useState<APIConfig[]>([]);
  const [selectedConfig, setSelectedConfig] = useState<APIConfig | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});
  
  // Formulario para nueva API
  const [newAPIForm, setNewAPIForm] = useState<Partial<APIConfig>>({
    name: '',
    key: '',
    baseUrl: '',
    testEndpoint: '',
    timeout: 10000,
    required: false,
    description: '',
    headers: {}
  });

  // Cargar configuraciones al montar
  useEffect(() => {
    setConfigs(getConfigs());
  }, [getConfigs]);

  // Función para alternar visibilidad de contraseña
  const togglePasswordVisibility = (apiName: string) => {
    setShowPasswords(prev => ({
      ...prev,
      [apiName]: !prev[apiName]
    }));
  };

  // Función para copiar al portapapeles
  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copiado",
        description: `${label} copiado al portapapeles`,
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "No se pudo copiar al portapapeles",
        variant: "destructive"
      });
    }
  };

  // Función para guardar nueva API
  const handleSaveNewAPI = () => {
    if (!newAPIForm.name || !newAPIForm.key || !newAPIForm.baseUrl) {
      toast({
        title: "Error",
        description: "Nombre, clave API y URL base son requeridos",
        variant: "destructive"
      });
      return;
    }

    const newConfig: APIConfig = {
      name: newAPIForm.name!,
      key: newAPIForm.key!,
      baseUrl: newAPIForm.baseUrl!,
      testEndpoint: newAPIForm.testEndpoint || '',
      timeout: newAPIForm.timeout || 10000,
      required: newAPIForm.required || false,
      description: newAPIForm.description || '',
      headers: newAPIForm.headers || {}
    };

    addAPI(newConfig);
    setConfigs(getConfigs());
    setShowAddDialog(false);
    setNewAPIForm({
      name: '',
      key: '',
      baseUrl: '',
      testEndpoint: '',
      timeout: 10000,
      required: false,
      description: '',
      headers: {}
    });

    toast({
      title: "API Agregada",
      description: `${newConfig.name} ha sido agregada exitosamente`,
    });
  };

  // Función para actualizar API existente
  const handleUpdateAPI = (apiName: string, updates: Partial<APIConfig>) => {
    updateAPI(apiName, updates);
    setConfigs(getConfigs());
    toast({
      title: "API Actualizada",
      description: `${apiName} ha sido actualizada exitosamente`,
    });
  };

  // Función para eliminar API
  const handleRemoveAPI = (apiName: string) => {
    removeAPI(apiName);
    setConfigs(getConfigs());
    toast({
      title: "API Eliminada",
      description: `${apiName} ha sido eliminada`,
    });
  };

  // Función para validar API
  const handleValidateAPI = async (apiName: string) => {
    const result = await validateSingle(apiName);
    if (result) {
      toast({
        title: result.isValid ? "API Válida" : "API Inválida",
        description: result.error || `${apiName} ${result.isValid ? 'funciona correctamente' : 'tiene problemas'}`,
        variant: result.isValid ? "default" : "destructive"
      });
    }
  };

  // Plantillas de APIs comunes
  const apiTemplates = [
    {
      name: 'OpenAI',
      baseUrl: 'https://api.openai.com/v1',
      testEndpoint: '/models',
      headers: { 'Authorization': 'Bearer {key}', 'Content-Type': 'application/json' },
      description: 'API de OpenAI para análisis con IA'
    },
    {
      name: 'Etherscan',
      baseUrl: 'https://api.etherscan.io/api',
      testEndpoint: '?module=stats&action=ethsupply&apikey={key}',
      headers: {},
      description: 'API de Etherscan para datos de blockchain'
    },
    {
      name: 'CoinGecko',
      baseUrl: 'https://api.coingecko.com/api/v3',
      testEndpoint: '/ping',
      headers: { 'x-cg-demo-api-key': '{key}' },
      description: 'API de CoinGecko para precios de criptomonedas'
    }
  ];

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Configuración de APIs</h2>
          <p className="text-muted-foreground">
            Gestiona las claves de API y configuraciones de conectividad
          </p>
        </div>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Agregar API
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Agregar Nueva API</DialogTitle>
              <DialogDescription>
                Configura una nueva conexión de API para la aplicación
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              {/* Plantillas */}
              <div>
                <Label>Plantilla (Opcional)</Label>
                <Select onValueChange={(value) => {
                  const template = apiTemplates.find(t => t.name === value);
                  if (template) {
                    setNewAPIForm(prev => ({
                      ...prev,
                      name: template.name,
                      baseUrl: template.baseUrl,
                      testEndpoint: template.testEndpoint,
                      headers: template.headers as Record<string, string>,
                      description: template.description
                    }));
                  }
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar plantilla" />
                  </SelectTrigger>
                  <SelectContent>
                    {apiTemplates.map(template => (
                      <SelectItem key={template.name} value={template.name}>
                        {template.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nombre *</Label>
                  <Input
                    id="name"
                    value={newAPIForm.name}
                    onChange={(e) => setNewAPIForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Ej: OpenAI"
                  />
                </div>
                <div>
                  <Label htmlFor="key">Clave API *</Label>
                  <Input
                    id="key"
                    type="password"
                    value={newAPIForm.key}
                    onChange={(e) => setNewAPIForm(prev => ({ ...prev, key: e.target.value }))}
                    placeholder="sk-..."
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="baseUrl">URL Base *</Label>
                <Input
                  id="baseUrl"
                  value={newAPIForm.baseUrl}
                  onChange={(e) => setNewAPIForm(prev => ({ ...prev, baseUrl: e.target.value }))}
                  placeholder="https://api.example.com/v1"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="testEndpoint">Endpoint de Prueba</Label>
                  <Input
                    id="testEndpoint"
                    value={newAPIForm.testEndpoint}
                    onChange={(e) => setNewAPIForm(prev => ({ ...prev, testEndpoint: e.target.value }))}
                    placeholder="/health"
                  />
                </div>
                <div>
                  <Label htmlFor="timeout">Timeout (ms)</Label>
                  <Input
                    id="timeout"
                    type="number"
                    value={newAPIForm.timeout}
                    onChange={(e) => setNewAPIForm(prev => ({ ...prev, timeout: parseInt(e.target.value) }))}
                    placeholder="10000"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  value={newAPIForm.description}
                  onChange={(e) => setNewAPIForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Descripción de la API..."
                  rows={2}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="required"
                  checked={newAPIForm.required}
                  onCheckedChange={(checked) => setNewAPIForm(prev => ({ ...prev, required: checked }))}
                />
                <Label htmlFor="required">API Requerida</Label>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSaveNewAPI}>
                <Save className="h-4 w-4 mr-2" />
                Guardar API
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Lista de APIs */}
      <div className="grid gap-4">
        {configs.map((config) => {
          const status = getAPIStatus(config.name);
          return (
            <Card key={config.name}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-100">
                      <Key className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {config.name}
                        {config.required && (
                          <Badge variant="secondary" className="text-xs">
                            Requerida
                          </Badge>
                        )}
                        {status && (
                          <Badge className={status.isValid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                            {status.isValid ? 'Válida' : 'Inválida'}
                          </Badge>
                        )}
                      </CardTitle>
                      <CardDescription>{config.description}</CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleValidateAPI(config.name)}
                    >
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Validar
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleRemoveAPI(config.name)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-xs font-medium text-muted-foreground">URL Base</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <code className="text-xs bg-gray-100 px-2 py-1 rounded flex-1 truncate">
                          {config.baseUrl}
                        </code>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyToClipboard(config.baseUrl, 'URL Base')}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs font-medium text-muted-foreground">Clave API</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <code className="text-xs bg-gray-100 px-2 py-1 rounded flex-1">
                          {showPasswords[config.name] ? config.key : '••••••••••••••••'}
                        </code>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => togglePasswordVisibility(config.name)}
                        >
                          {showPasswords[config.name] ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyToClipboard(config.key, 'Clave API')}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {config.testEndpoint && (
                    <div>
                      <Label className="text-xs font-medium text-muted-foreground">Endpoint de Prueba</Label>
                      <code className="text-xs bg-gray-100 px-2 py-1 rounded block mt-1">
                        {config.testEndpoint}
                      </code>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground">
                    <div>
                      <Clock className="h-3 w-3 inline mr-1" />
                      Timeout: {config.timeout}ms
                    </div>
                    {status && (
                      <div>
                        <Globe className="h-3 w-3 inline mr-1" />
                        Última verificación: {new Intl.DateTimeFormat('es-ES', {
                          hour: '2-digit',
                          minute: '2-digit'
                        }).format(status.lastChecked)}
                      </div>
                    )}
                  </div>

                  {status?.error && (
                    <Alert className="border-red-200 bg-red-50">
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                      <AlertDescription className="text-red-700 text-xs">
                        {status.error}
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {configs.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Key className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No hay APIs configuradas</h3>
            <p className="text-muted-foreground mb-4">
              Agrega tu primera API para comenzar a usar las funcionalidades de análisis
            </p>
            <Button onClick={() => setShowAddDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Agregar Primera API
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default APIConfigManager;