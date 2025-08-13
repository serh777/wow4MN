'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import {
  Shield,
  Zap,
  Eye,
  Network,
  Code,
  Fuel,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  Users,
  BarChart3,
  Target,
  Lightbulb,
  AlertCircle
} from 'lucide-react';

interface BlockchainResultsProps {
  results: {
    contractAddress: string;
    networkName: string;
    score: number;
    metrics: {
      security: number;
      efficiency: number;
      transparency: number;
      interoperability: number;
      gasOptimization: number;
      codeQuality: number;
    };
    transactions: {
      total: number;
      successful: number;
      failed: number;
      avgGasUsed: number;
      avgGasPrice: number;
      totalVolume: string;
      uniqueAddresses: number;
    };
    contractDetails: {
      verified: boolean;
      creationDate: string;
      lastActivity: string;
      balance: string;
      compiler: string;
      optimization: boolean;
      runs: number;
      sourceCode: boolean;
    };
    securityAnalysis: {
      vulnerabilities: Array<{
        severity: 'high' | 'medium' | 'low';
        type: string;
        description: string;
        recommendation: string;
      }>;
      overallRisk: 'low' | 'medium' | 'high';
      auditStatus: 'audited' | 'unaudited' | 'self-audited';
    };
    gasAnalysis: {
      averageCost: number;
      optimizationScore: number;
      expensiveFunctions: Array<{
        name: string;
        avgGas: number;
        callCount: number;
      }>;
      recommendations: string[];
    };
    complianceCheck: {
      standards: Array<{
        name: string;
        compliant: boolean;
        details: string;
      }>;
      overallCompliance: number;
    };
    tokenomics?: {
      totalSupply: string;
      holders: number;
      topHolders: Array<{
        address: string;
        balance: string;
        percentage: number;
      }>;
      distribution: {
        concentrated: number;
        distributed: number;
      };
    };
    recommendations: string[];
    insights: {
      strengths: string[];
      weaknesses: string[];
      opportunities: string[];
      threats: string[];
    };
  };
}

export function BlockchainResults({ results }: BlockchainResultsProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadgeVariant = (score: number) => {
    if (score >= 80) return 'default';
    if (score >= 60) return 'secondary';
    return 'destructive';
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'high': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Resumen General */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Network className="h-5 w-5" />
                Análisis de Contrato Blockchain
              </CardTitle>
              <CardDescription>
                {results.contractAddress} en {results.networkName}
              </CardDescription>
            </div>
            <Badge variant={getScoreBadgeVariant(results.score)} className="text-lg px-3 py-1">
              {results.score}/100
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                <span className="text-sm font-medium">Seguridad</span>
              </div>
              <Progress value={results.metrics.security} className="h-2" />
              <span className={`text-sm ${getScoreColor(results.metrics.security)}`}>
                {results.metrics.security}%
              </span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4" />
                <span className="text-sm font-medium">Eficiencia</span>
              </div>
              <Progress value={results.metrics.efficiency} className="h-2" />
              <span className={`text-sm ${getScoreColor(results.metrics.efficiency)}`}>
                {results.metrics.efficiency}%
              </span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                <span className="text-sm font-medium">Transparencia</span>
              </div>
              <Progress value={results.metrics.transparency} className="h-2" />
              <span className={`text-sm ${getScoreColor(results.metrics.transparency)}`}>
                {results.metrics.transparency}%
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs de Análisis Detallado */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Resumen</TabsTrigger>
          <TabsTrigger value="security">Seguridad</TabsTrigger>
          <TabsTrigger value="gas">Gas</TabsTrigger>
          <TabsTrigger value="compliance">Cumplimiento</TabsTrigger>
          <TabsTrigger value="tokenomics">Tokenomics</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        {/* Tab Resumen */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Detalles del Contrato */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-4 w-4" />
                  Detalles del Contrato
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Verificado:</span>
                  <div className="flex items-center gap-1">
                    {results.contractDetails.verified ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-600" />
                    )}
                    <span className="text-sm">
                      {results.contractDetails.verified ? 'Sí' : 'No'}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Creación:</span>
                  <span className="text-sm">{results.contractDetails.creationDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Última actividad:</span>
                  <span className="text-sm">{results.contractDetails.lastActivity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Balance:</span>
                  <span className="text-sm">{results.contractDetails.balance} ETH</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Compilador:</span>
                  <span className="text-sm">{results.contractDetails.compiler}</span>
                </div>
              </CardContent>
            </Card>

            {/* Estadísticas de Transacciones */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Estadísticas de Transacciones
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Total:</span>
                  <span className="text-sm font-medium">{results.transactions.total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Exitosas:</span>
                  <span className="text-sm text-green-600">{results.transactions.successful.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Fallidas:</span>
                  <span className="text-sm text-red-600">{results.transactions.failed.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Gas promedio:</span>
                  <span className="text-sm">{results.transactions.avgGasUsed.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Volumen total:</span>
                  <span className="text-sm font-medium">${results.transactions.totalVolume}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Métricas Adicionales */}
          <Card>
            <CardHeader>
              <CardTitle>Métricas de Rendimiento</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Network className="h-4 w-4" />
                    <span className="text-sm font-medium">Interoperabilidad</span>
                  </div>
                  <Progress value={results.metrics.interoperability} className="h-2" />
                  <span className={`text-sm ${getScoreColor(results.metrics.interoperability)}`}>
                    {results.metrics.interoperability}%
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Fuel className="h-4 w-4" />
                    <span className="text-sm font-medium">Optimización de Gas</span>
                  </div>
                  <Progress value={results.metrics.gasOptimization} className="h-2" />
                  <span className={`text-sm ${getScoreColor(results.metrics.gasOptimization)}`}>
                    {results.metrics.gasOptimization}%
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Code className="h-4 w-4" />
                    <span className="text-sm font-medium">Calidad del Código</span>
                  </div>
                  <Progress value={results.metrics.codeQuality} className="h-2" />
                  <span className={`text-sm ${getScoreColor(results.metrics.codeQuality)}`}>
                    {results.metrics.codeQuality}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab Seguridad */}
        <TabsContent value="security" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Análisis de Seguridad
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Riesgo General:</span>
                  <Badge className={getRiskColor(results.securityAnalysis.overallRisk)}>
                    {results.securityAnalysis.overallRisk.toUpperCase()}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Estado de Auditoría:</span>
                  <Badge variant="outline">
                    {results.securityAnalysis.auditStatus}
                  </Badge>
                </div>
                <Separator />
                <div>
                  <h4 className="text-sm font-medium mb-2">Vulnerabilidades Detectadas:</h4>
                  <div className="space-y-2">
                    {results.securityAnalysis.vulnerabilities.map((vuln, index) => (
                      <Alert key={index}>
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                          <div className="flex items-center gap-2 mb-1">
                            <Badge className={getSeverityColor(vuln.severity)}>
                              {vuln.severity}
                            </Badge>
                            <span className="font-medium">{vuln.type}</span>
                          </div>
                          <p className="text-sm text-muted-foreground mb-1">{vuln.description}</p>
                          <p className="text-sm font-medium">Recomendación: {vuln.recommendation}</p>
                        </AlertDescription>
                      </Alert>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recomendaciones de Seguridad</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {results.recommendations.slice(0, 5).map((rec, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <Lightbulb className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{rec}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab Gas */}
        <TabsContent value="gas" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Fuel className="h-4 w-4" />
                  Análisis de Gas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Costo Promedio:</span>
                  <span className="text-sm font-medium">${results.gasAnalysis.averageCost}</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Puntuación de Optimización:</span>
                    <span className={`text-sm font-medium ${getScoreColor(results.gasAnalysis.optimizationScore)}`}>
                      {results.gasAnalysis.optimizationScore}%
                    </span>
                  </div>
                  <Progress value={results.gasAnalysis.optimizationScore} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Funciones Más Costosas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {results.gasAnalysis.expensiveFunctions.map((func, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <div>
                        <span className="text-sm font-medium">{func.name}</span>
                        <p className="text-xs text-muted-foreground">{func.callCount} llamadas</p>
                      </div>
                      <span className="text-sm">{func.avgGas.toLocaleString()} gas</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recomendaciones de Optimización</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {results.gasAnalysis.recommendations.map((rec, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <Target className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{rec}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab Cumplimiento */}
        <TabsContent value="compliance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Verificación de Estándares
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Cumplimiento General:</span>
                  <div className="flex items-center gap-2">
                    <Progress value={results.complianceCheck.overallCompliance} className="h-2 w-20" />
                    <span className={`text-sm font-medium ${getScoreColor(results.complianceCheck.overallCompliance)}`}>
                      {results.complianceCheck.overallCompliance}%
                    </span>
                  </div>
                </div>
                <Separator />
                <div className="space-y-3">
                  {results.complianceCheck.standards.map((standard, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {standard.compliant ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-600" />
                        )}
                        <span className="text-sm font-medium">{standard.name}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">{standard.details}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab Tokenomics */}
        <TabsContent value="tokenomics" className="space-y-4">
          {results.tokenomics ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Información del Token
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Suministro Total:</span>
                    <span className="text-sm font-medium">{results.tokenomics.totalSupply}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Holders:</span>
                    <span className="text-sm font-medium">{results.tokenomics.holders.toLocaleString()}</span>
                  </div>
                  <Separator />
                  <div>
                    <h4 className="text-sm font-medium mb-2">Distribución:</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-xs text-muted-foreground">Concentrado:</span>
                        <span className="text-xs">{results.tokenomics.distribution.concentrated}%</span>
                      </div>
                      <Progress value={results.tokenomics.distribution.concentrated} className="h-1" />
                      <div className="flex justify-between">
                        <span className="text-xs text-muted-foreground">Distribuido:</span>
                        <span className="text-xs">{results.tokenomics.distribution.distributed}%</span>
                      </div>
                      <Progress value={results.tokenomics.distribution.distributed} className="h-1" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Top Holders
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {results.tokenomics.topHolders.map((holder, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span className="text-xs font-mono">
                          {holder.address.slice(0, 6)}...{holder.address.slice(-4)}
                        </span>
                        <span className="text-sm font-medium">{holder.balance}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">No hay información de tokenomics disponible para este contrato.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Tab Insights */}
        <TabsContent value="insights" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-600">
                  <TrendingUp className="h-4 w-4" />
                  Fortalezas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {results.insights.strengths.map((strength, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{strength}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-600">
                  <TrendingDown className="h-4 w-4" />
                  Debilidades
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {results.insights.weaknesses.map((weakness, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{weakness}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-600">
                  <Target className="h-4 w-4" />
                  Oportunidades
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {results.insights.opportunities.map((opportunity, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <Lightbulb className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{opportunity}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-600">
                  <AlertTriangle className="h-4 w-4" />
                  Amenazas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {results.insights.threats.map((threat, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <AlertCircle className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{threat}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}