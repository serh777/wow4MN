'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Componente IconWrapper
const IconWrapper = ({ icon, className }: { icon: keyof typeof Icons, className?: string }) => {
  const Icon = Icons[icon] || Icons.settings;
  return <Icon className={className} />;
};

interface DiagnosticItem {
  id: string;
  title: string;
  description: string;
  severity: 'error' | 'warning' | 'info' | 'success';
  category: 'metadata' | 'structure' | 'compliance' | 'performance';
  location?: string;
  suggestion?: string;
  codeSnippet?: string;
  affectedElements: number;
}

interface DiagnosticsSectionProps {
  diagnostics: DiagnosticItem[];
}

export default function DiagnosticsSection({ diagnostics }: DiagnosticsSectionProps) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'error': return 'bg-red-500 text-white';
      case 'warning': return 'bg-yellow-500 text-white';
      case 'info': return 'bg-blue-500 text-white';
      case 'success': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'error': return 'xCircle';
      case 'warning': return 'alertTriangle';
      case 'info': return 'info';
      case 'success': return 'checkCircle';
      default: return 'help';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'metadata': return 'database';
      case 'structure': return 'layers';
      case 'compliance': return 'shield';
      case 'performance': return 'zap';
      default: return 'settings';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'metadata': return 'text-blue-600';
      case 'structure': return 'text-purple-600';
      case 'compliance': return 'text-green-600';
      case 'performance': return 'text-orange-600';
      default: return 'text-gray-600';
    }
  };

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const groupedDiagnostics = diagnostics.reduce((acc, diagnostic) => {
    if (!acc[diagnostic.severity]) {
      acc[diagnostic.severity] = [];
    }
    acc[diagnostic.severity].push(diagnostic);
    return acc;
  }, {} as Record<string, DiagnosticItem[]>);

  const DiagnosticCard = ({ diagnostic }: { diagnostic: DiagnosticItem }) => {
    const isExpanded = expandedItems.has(diagnostic.id);
    
    return (
      <Card className="border-l-4" style={{
        borderLeftColor: diagnostic.severity === 'error' ? '#ef4444' :
                        diagnostic.severity === 'warning' ? '#f59e0b' :
                        diagnostic.severity === 'info' ? '#3b82f6' : '#10b981'
      }}>
        <Collapsible>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <IconWrapper 
                    icon={getSeverityIcon(diagnostic.severity) as keyof typeof Icons} 
                    className={`h-5 w-5 ${
                      diagnostic.severity === 'error' ? 'text-red-600' :
                      diagnostic.severity === 'warning' ? 'text-yellow-600' :
                      diagnostic.severity === 'info' ? 'text-blue-600' : 'text-green-600'
                    }`} 
                  />
                  <div className="flex-1">
                    <CardTitle className="text-base flex items-center gap-2">
                      {diagnostic.title}
                      <IconWrapper 
                        icon={getCategoryIcon(diagnostic.category) as keyof typeof Icons} 
                        className={`h-4 w-4 ${getCategoryColor(diagnostic.category)}`} 
                      />
                    </CardTitle>
                    <CardDescription className="text-sm mt-1">
                      {diagnostic.description}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getSeverityColor(diagnostic.severity)}>
                    {diagnostic.severity}
                  </Badge>
                  <Badge variant="outline">
                    {diagnostic.affectedElements} elementos
                  </Badge>
                  <IconWrapper 
                    icon={isExpanded ? "chevronUp" : "chevronDown"} 
                    className="h-4 w-4 text-muted-foreground" 
                  />
                </div>
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          
          <CollapsibleContent>
            <CardContent className="pt-0 space-y-4">
              {diagnostic.location && (
                <div className="space-y-2">
                  <div className="text-sm font-medium">Ubicación:</div>
                  <div className="text-sm bg-muted p-2 rounded font-mono">
                    {diagnostic.location}
                  </div>
                </div>
              )}
              
              {diagnostic.suggestion && (
                <Alert>
                  <IconWrapper icon="lightbulb" className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Sugerencia:</strong> {diagnostic.suggestion}
                  </AlertDescription>
                </Alert>
              )}
              
              {diagnostic.codeSnippet && (
                <div className="space-y-2">
                  <div className="text-sm font-medium">Código relacionado:</div>
                  <pre className="text-xs bg-muted p-3 rounded-md overflow-x-auto border">
                    <code>{diagnostic.codeSnippet}</code>
                  </pre>
                </div>
              )}
              
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <IconWrapper icon="copy" className="mr-2 h-4 w-4" />
                  Copiar Detalles
                </Button>
                <Button variant="outline" size="sm">
                  <IconWrapper icon="externalLink" className="mr-2 h-4 w-4" />
                  Ver Documentación
                </Button>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>
    );
  };

  const severityCounts = {
    error: groupedDiagnostics.error?.length || 0,
    warning: groupedDiagnostics.warning?.length || 0,
    info: groupedDiagnostics.info?.length || 0,
    success: groupedDiagnostics.success?.length || 0
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <IconWrapper icon="stethoscope" className="h-5 w-5" />
              Diagnósticos Detallados
            </CardTitle>
            <CardDescription>
              {diagnostics.length} elementos analizados con diagnósticos específicos
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setExpandedItems(new Set(diagnostics.map(d => d.id)))}
            >
              Expandir Todo
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setExpandedItems(new Set())}
            >
              Contraer Todo
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Resumen de Severidades */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center p-3 rounded-lg bg-red-50 dark:bg-red-900/20">
            <div className="text-2xl font-bold text-red-600">{severityCounts.error}</div>
            <div className="text-sm text-red-600">Errores</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/20">
            <div className="text-2xl font-bold text-yellow-600">{severityCounts.warning}</div>
            <div className="text-sm text-yellow-600">Advertencias</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
            <div className="text-2xl font-bold text-blue-600">{severityCounts.info}</div>
            <div className="text-sm text-blue-600">Información</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-green-50 dark:bg-green-900/20">
            <div className="text-2xl font-bold text-green-600">{severityCounts.success}</div>
            <div className="text-sm text-green-600">Exitosos</div>
          </div>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all" className="text-xs">
              Todos ({diagnostics.length})
            </TabsTrigger>
            <TabsTrigger value="error" className="text-xs">
              <IconWrapper icon="xCircle" className="w-3 h-3 mr-1 text-red-600" />
              Errores ({severityCounts.error})
            </TabsTrigger>
            <TabsTrigger value="warning" className="text-xs">
              <IconWrapper icon="alertTriangle" className="w-3 h-3 mr-1 text-yellow-600" />
              Advertencias ({severityCounts.warning})
            </TabsTrigger>
            <TabsTrigger value="info" className="text-xs">
              <IconWrapper icon="info" className="w-3 h-3 mr-1 text-blue-600" />
              Info ({severityCounts.info})
            </TabsTrigger>
            <TabsTrigger value="success" className="text-xs">
              <IconWrapper icon="checkCircle" className="w-3 h-3 mr-1 text-green-600" />
              Exitosos ({severityCounts.success})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-6">
            <div className="space-y-4">
              {diagnostics.map((diagnostic) => (
                <DiagnosticCard key={diagnostic.id} diagnostic={diagnostic} />
              ))}
            </div>
          </TabsContent>
          
          {Object.entries(groupedDiagnostics).map(([severity, severityDiagnostics]) => (
            <TabsContent key={severity} value={severity} className="mt-6">
              <div className="space-y-4">
                {severityDiagnostics.map((diagnostic) => (
                  <DiagnosticCard key={diagnostic.id} diagnostic={diagnostic} />
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}