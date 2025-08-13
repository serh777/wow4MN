'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Info,
  Lock,
  Unlock,
  Eye,
  TrendingUp,
  TrendingDown
} from 'lucide-react';

export interface SecurityAnalysisResults {
  overallScore: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  vulnerabilities: SecurityVulnerability[];
  recommendations: SecurityRecommendation[];
  contractAnalysis?: ContractSecurityAnalysis;
  walletAnalysis?: WalletSecurityAnalysis;
  websiteAnalysis?: WebsiteSecurityAnalysis;
  timestamp: string;
}

export interface SecurityVulnerability {
  id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: string;
  impact: string;
  remediation: string;
}

export interface SecurityRecommendation {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  category: string;
  implementation: string;
}

export interface ContractSecurityAnalysis {
  accessControl: {
    score: number;
    issues: string[];
  };
  reentrancy: {
    score: number;
    vulnerabilities: string[];
  };
  overflowProtection: {
    score: number;
    status: string;
  };
  gasOptimization: {
    score: number;
    suggestions: string[];
  };
}

export interface WalletSecurityAnalysis {
  transactionPatterns: {
    score: number;
    suspiciousActivity: string[];
  };
  balanceRisk: {
    score: number;
    riskFactors: string[];
  };
  interactionHistory: {
    score: number;
    riskyContracts: string[];
  };
}

export interface WebsiteSecurityAnalysis {
  sslSecurity: {
    score: number;
    issues: string[];
  };
  contentSecurity: {
    score: number;
    vulnerabilities: string[];
  };
  privacyCompliance: {
    score: number;
    gaps: string[];
  };
}

interface SecurityAnalysisResultsProps {
  results: SecurityAnalysisResults;
}

const getRiskColor = (level: string) => {
  switch (level) {
    case 'low': return 'text-green-600 bg-green-100';
    case 'medium': return 'text-yellow-600 bg-yellow-100';
    case 'high': return 'text-orange-600 bg-orange-100';
    case 'critical': return 'text-red-600 bg-red-100';
    default: return 'text-gray-600 bg-gray-100';
  }
};

const getSeverityIcon = (severity: string) => {
  switch (severity) {
    case 'low': return <Info className="h-4 w-4" />;
    case 'medium': return <AlertTriangle className="h-4 w-4" />;
    case 'high': return <AlertTriangle className="h-4 w-4" />;
    case 'critical': return <XCircle className="h-4 w-4" />;
    default: return <Info className="h-4 w-4" />;
  }
};

export function SecurityAnalysisResults({ results }: SecurityAnalysisResultsProps) {
  const criticalVulns = results.vulnerabilities.filter(v => v.severity === 'critical');
  const highVulns = results.vulnerabilities.filter(v => v.severity === 'high');
  const mediumVulns = results.vulnerabilities.filter(v => v.severity === 'medium');
  const lowVulns = results.vulnerabilities.filter(v => v.severity === 'low');

  return (
    <div className="space-y-6">
      {/* Resumen General */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Resumen de Seguridad
              </CardTitle>
              <CardDescription>
                Análisis completado el {new Date(results.timestamp).toLocaleString()}
              </CardDescription>
            </div>
            <Badge className={getRiskColor(results.riskLevel)}>
              Riesgo {results.riskLevel.toUpperCase()}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Puntuación de Seguridad</span>
                <span className="text-2xl font-bold">{results.overallScore}/100</span>
              </div>
              <Progress value={results.overallScore} className="h-3" />
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 border rounded-lg">
                <div className="text-2xl font-bold text-red-600">{criticalVulns.length}</div>
                <div className="text-sm text-muted-foreground">Críticas</div>
              </div>
              <div className="text-center p-3 border rounded-lg">
                <div className="text-2xl font-bold text-orange-600">{highVulns.length}</div>
                <div className="text-sm text-muted-foreground">Altas</div>
              </div>
              <div className="text-center p-3 border rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">{mediumVulns.length}</div>
                <div className="text-sm text-muted-foreground">Medias</div>
              </div>
              <div className="text-center p-3 border rounded-lg">
                <div className="text-2xl font-bold text-green-600">{lowVulns.length}</div>
                <div className="text-sm text-muted-foreground">Bajas</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Vulnerabilidades Críticas */}
      {criticalVulns.length > 0 && (
        <Alert className="border-red-200 bg-red-50">
          <XCircle className="h-4 w-4 text-red-600" />
          <AlertTitle className="text-red-800">Vulnerabilidades Críticas Detectadas</AlertTitle>
          <AlertDescription className="text-red-700">
            Se han encontrado {criticalVulns.length} vulnerabilidades críticas que requieren atención inmediata.
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="vulnerabilities" className="space-y-4">
        <TabsList>
          <TabsTrigger value="vulnerabilities">Vulnerabilidades</TabsTrigger>
          <TabsTrigger value="recommendations">Recomendaciones</TabsTrigger>
          {results.contractAnalysis && <TabsTrigger value="contract">Contrato</TabsTrigger>}
          {results.walletAnalysis && <TabsTrigger value="wallet">Wallet</TabsTrigger>}
          {results.websiteAnalysis && <TabsTrigger value="website">Website</TabsTrigger>}
        </TabsList>

        <TabsContent value="vulnerabilities" className="space-y-4">
          {results.vulnerabilities.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-green-800">¡Excelente!</h3>
                  <p className="text-green-600">No se encontraron vulnerabilidades de seguridad.</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {results.vulnerabilities.map((vuln) => (
                <Card key={vuln.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        {getSeverityIcon(vuln.severity)}
                        <CardTitle className="text-lg">{vuln.title}</CardTitle>
                      </div>
                      <Badge className={getRiskColor(vuln.severity)}>
                        {vuln.severity.toUpperCase()}
                      </Badge>
                    </div>
                    <CardDescription>{vuln.category}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Descripción</h4>
                      <p className="text-sm text-muted-foreground">{vuln.description}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Impacto</h4>
                      <p className="text-sm text-muted-foreground">{vuln.impact}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Solución Recomendada</h4>
                      <p className="text-sm text-muted-foreground">{vuln.remediation}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-4">
          {results.recommendations.map((rec) => (
            <Card key={rec.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg">{rec.title}</CardTitle>
                  <Badge variant={rec.priority === 'high' ? 'destructive' : rec.priority === 'medium' ? 'default' : 'secondary'}>
                    {rec.priority.toUpperCase()}
                  </Badge>
                </div>
                <CardDescription>{rec.category}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Descripción</h4>
                  <p className="text-sm text-muted-foreground">{rec.description}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Implementación</h4>
                  <p className="text-sm text-muted-foreground">{rec.implementation}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {results.contractAnalysis && (
          <TabsContent value="contract" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    Control de Acceso
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Puntuación</span>
                      <span className="font-bold">{results.contractAnalysis.accessControl.score}/100</span>
                    </div>
                    <Progress value={results.contractAnalysis.accessControl.score} />
                    {results.contractAnalysis.accessControl.issues.length > 0 && (
                      <div className="mt-4">
                        <h4 className="font-semibold mb-2">Problemas Detectados:</h4>
                        <ul className="text-sm space-y-1">
                          {results.contractAnalysis.accessControl.issues.map((issue, index) => (
                            <li key={index} className="flex items-center gap-2">
                              <AlertTriangle className="h-3 w-3 text-yellow-500" />
                              {issue}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Protección Reentrancy
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Puntuación</span>
                      <span className="font-bold">{results.contractAnalysis.reentrancy.score}/100</span>
                    </div>
                    <Progress value={results.contractAnalysis.reentrancy.score} />
                    {results.contractAnalysis.reentrancy.vulnerabilities.length > 0 && (
                      <div className="mt-4">
                        <h4 className="font-semibold mb-2">Vulnerabilidades:</h4>
                        <ul className="text-sm space-y-1">
                          {results.contractAnalysis.reentrancy.vulnerabilities.map((vuln, index) => (
                            <li key={index} className="flex items-center gap-2">
                              <XCircle className="h-3 w-3 text-red-500" />
                              {vuln}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        )}

        {results.walletAnalysis && (
          <TabsContent value="wallet" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Patrones de Transacción
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Puntuación</span>
                      <span className="font-bold">{results.walletAnalysis.transactionPatterns.score}/100</span>
                    </div>
                    <Progress value={results.walletAnalysis.transactionPatterns.score} />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    Historial de Interacciones
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Puntuación</span>
                      <span className="font-bold">{results.walletAnalysis.interactionHistory.score}/100</span>
                    </div>
                    <Progress value={results.walletAnalysis.interactionHistory.score} />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        )}

        {results.websiteAnalysis && (
          <TabsContent value="website" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    Seguridad SSL
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Puntuación</span>
                      <span className="font-bold">{results.websiteAnalysis.sslSecurity.score}/100</span>
                    </div>
                    <Progress value={results.websiteAnalysis.sslSecurity.score} />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Seguridad de Contenido
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Puntuación</span>
                      <span className="font-bold">{results.websiteAnalysis.contentSecurity.score}/100</span>
                    </div>
                    <Progress value={results.websiteAnalysis.contentSecurity.score} />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    Cumplimiento de Privacidad
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Puntuación</span>
                      <span className="font-bold">{results.websiteAnalysis.privacyCompliance.score}/100</span>
                    </div>
                    <Progress value={results.websiteAnalysis.privacyCompliance.score} />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}