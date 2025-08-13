'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
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
  TrendingDown,
  Download,
  Share2,
  ArrowLeft
} from 'lucide-react';
import Link from 'next/link';

interface SecurityAnalysisResults {
  overallScore: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  analysisType: string;
  target: string;
  vulnerabilities: SecurityVulnerability[];
  recommendations: SecurityRecommendation[];
  contractAnalysis?: ContractSecurityAnalysis;
  walletAnalysis?: WalletSecurityAnalysis;
  websiteAnalysis?: WebsiteSecurityAnalysis;
  timestamp: string;
}

interface SecurityVulnerability {
  id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: string;
  impact: string;
  remediation: string;
}

interface SecurityRecommendation {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  category: string;
  implementation: string;
}

interface ContractSecurityAnalysis {
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

interface WalletSecurityAnalysis {
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

interface WebsiteSecurityAnalysis {
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

const generateMockResults = (): SecurityAnalysisResults => {
  return {
    overallScore: Math.floor(Math.random() * 40) + 60,
    riskLevel: ['low', 'medium', 'high', 'critical'][Math.floor(Math.random() * 4)] as 'low' | 'medium' | 'high' | 'critical',
    analysisType: 'comprehensive',
    target: '0x742d35Cc6634C0532925a3b8D4C9db4C8b4b8b8b',
    vulnerabilities: [
      {
        id: '1',
        title: 'Reentrancy Vulnerability',
        description: 'Función vulnerable a ataques de reentrancy en el contrato principal',
        severity: 'high',
        category: 'Smart Contract',
        impact: 'Pérdida potencial de fondos',
        remediation: 'Implementar patrón checks-effects-interactions y usar ReentrancyGuard'
      },
      {
        id: '2',
        title: 'Access Control Issue',
        description: 'Funciones administrativas sin protección adecuada',
        severity: 'medium',
        category: 'Access Control',
        impact: 'Acceso no autorizado a funciones críticas',
        remediation: 'Implementar modificadores de acceso y roles apropiados'
      },
      {
        id: '3',
        title: 'Weak Random Number Generation',
        description: 'Uso de block.timestamp para generación de números aleatorios',
        severity: 'medium',
        category: 'Randomness',
        impact: 'Predictibilidad en funciones que requieren aleatoriedad',
        remediation: 'Usar oráculos externos o commit-reveal schemes'
      }
    ],
    recommendations: [
      {
        id: '1',
        title: 'Implementar Auditoría Externa',
        description: 'Contratar una firma de auditoría reconocida para revisión completa',
        priority: 'high',
        category: 'Auditoría',
        implementation: 'Contactar con CertiK, ConsenSys Diligence, o Trail of Bits'
      },
      {
        id: '2',
        title: 'Configurar Monitoreo Continuo',
        description: 'Implementar sistema de monitoreo para detectar actividad sospechosa',
        priority: 'medium',
        category: 'Monitoreo',
        implementation: 'Usar Forta Network o desarrollar sistema personalizado'
      },
      {
        id: '3',
        title: 'Actualizar Dependencias',
        description: 'Mantener todas las librerías y dependencias actualizadas',
        priority: 'medium',
        category: 'Mantenimiento',
        implementation: 'Configurar dependabot y revisiones regulares'
      }
    ],
    contractAnalysis: {
      accessControl: {
        score: 75,
        issues: ['Funciones admin sin timelock', 'Roles no implementados correctamente']
      },
      reentrancy: {
        score: 60,
        vulnerabilities: ['Función withdraw vulnerable', 'Estado no actualizado antes de llamadas externas']
      },
      overflowProtection: {
        score: 90,
        status: 'SafeMath implementado correctamente'
      },
      gasOptimization: {
        score: 70,
        suggestions: ['Optimizar bucles', 'Usar packed structs', 'Eliminar variables no utilizadas']
      }
    },
    walletAnalysis: {
      transactionPatterns: {
        score: 85,
        suspiciousActivity: ['Transacciones a altas horas', 'Patrones de MEV']
      },
      balanceRisk: {
        score: 80,
        riskFactors: ['Alta concentración en un token', 'Exposición a contratos no auditados']
      },
      interactionHistory: {
        score: 75,
        riskyContracts: ['0x123...abc (no auditado)', '0x456...def (vulnerabilidades conocidas)']
      }
    },
    websiteAnalysis: {
      sslSecurity: {
        score: 95,
        issues: ['Certificado válido', 'HSTS habilitado']
      },
      contentSecurity: {
        score: 70,
        vulnerabilities: ['CSP no configurado', 'Inputs no sanitizados']
      },
      privacyCompliance: {
        score: 65,
        gaps: ['Política de privacidad incompleta', 'Cookies sin consentimiento']
      }
    },
    timestamp: new Date().toLocaleString()
  };
};

export default function SecurityAnalysisResults() {
  const [results, setResults] = useState<SecurityAnalysisResults | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      const savedResults = sessionStorage.getItem('securityAnalysisResults');
      if (savedResults) {
        setResults(JSON.parse(savedResults));
      } else {
        setResults(generateMockResults());
      }
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const handleExport = () => {
    if (results) {
      const dataStr = JSON.stringify(results, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      const exportFileDefaultName = `security-audit-${results.target}-${new Date().toISOString().split('T')[0]}.json`;
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
    }
  };

  const handleShare = async () => {
    if (navigator.share && results) {
      try {
        await navigator.share({
          title: 'Auditoría de Seguridad Web3',
          text: `Auditoría de seguridad para ${results.target}. Puntuación: ${results.overallScore}/100`,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'critical': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'low': return <Info className="h-4 w-4 text-blue-500" />;
      case 'medium': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'high': return <XCircle className="h-4 w-4 text-orange-500" />;
      case 'critical': return <XCircle className="h-4 w-4 text-red-500" />;
      default: return <Info className="h-4 w-4 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'text-blue-600 bg-blue-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Cargando resultados de auditoría...</h1>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-6">
        <div className="max-w-6xl mx-auto">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              No se encontraron resultados de auditoría. Por favor, ejecuta un nuevo análisis.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <Link href="/dashboard/security" className="flex items-center text-sm text-muted-foreground hover:text-foreground mb-2">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Volver al análisis
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Resultados de Auditoría de Seguridad</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              Objetivo: {results.target} • Análisis: {results.analysisType}
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleExport} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
            <Button onClick={handleShare} variant="outline">
              <Share2 className="h-4 w-4 mr-2" />
              Compartir
            </Button>
          </div>
        </div>

        {/* Puntuación General */}
        <div className="flex justify-center mb-8">
          <div className="w-full max-w-md">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 justify-center">
                  <Shield className="h-5 w-5" />
                  Puntuación General de Seguridad
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="relative w-32 h-32 mx-auto mb-4">
                    <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#e5e7eb"
                        strokeWidth="2"
                      />
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#3b82f6"
                        strokeWidth="2"
                        strokeDasharray={`${results.overallScore}, 100`}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-2xl font-bold">{results.overallScore}</span>
                    </div>
                  </div>
                  <Badge className={getRiskColor(results.riskLevel)}>
                    Riesgo {results.riskLevel === 'low' ? 'Bajo' : 
                            results.riskLevel === 'medium' ? 'Medio' : 
                            results.riskLevel === 'high' ? 'Alto' : 'Crítico'}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Vulnerabilidades Detectadas */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Vulnerabilidades Detectadas</h2>
          <div className="grid gap-4">
            {results.vulnerabilities.map((vulnerability) => (
              <Card key={vulnerability.id}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    {getSeverityIcon(vulnerability.severity)}
                    <div className="flex-1 space-y-2">
                      <div className="flex justify-between items-start">
                        <h3 className="font-medium">{vulnerability.title}</h3>
                        <Badge className={getRiskColor(vulnerability.severity)}>
                          {vulnerability.severity === 'low' ? 'Bajo' : 
                           vulnerability.severity === 'medium' ? 'Medio' : 
                           vulnerability.severity === 'high' ? 'Alto' : 'Crítico'}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{vulnerability.description}</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium text-red-600 mb-1">Impacto</h4>
                          <p className="text-sm">{vulnerability.impact}</p>
                        </div>
                        <div>
                          <h4 className="font-medium text-blue-600 mb-1">Remediación</h4>
                          <p className="text-sm">{vulnerability.remediation}</p>
                        </div>
                      </div>
                      <Badge variant="outline">{vulnerability.category}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Análisis Detallado por Categoría */}
        {results.contractAnalysis && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Análisis de Contrato Inteligente</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="h-5 w-5" />
                    Control de Acceso
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span>Puntuación</span>
                      <span className="font-bold">{results.contractAnalysis.accessControl.score}/100</span>
                    </div>
                    <Progress value={results.contractAnalysis.accessControl.score} />
                    <div>
                      <h4 className="font-medium mb-2">Problemas Detectados:</h4>
                      <ul className="text-sm space-y-1">
                        {results.contractAnalysis.accessControl.issues.map((issue, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <AlertTriangle className="h-3 w-3 text-yellow-500" />
                            {issue}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Protección Reentrancy
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span>Puntuación</span>
                      <span className="font-bold">{results.contractAnalysis.reentrancy.score}/100</span>
                    </div>
                    <Progress value={results.contractAnalysis.reentrancy.score} />
                    <div>
                      <h4 className="font-medium mb-2">Vulnerabilidades:</h4>
                      <ul className="text-sm space-y-1">
                        {results.contractAnalysis.reentrancy.vulnerabilities.map((vuln, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <XCircle className="h-3 w-3 text-red-500" />
                            {vuln}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5" />
                    Protección Overflow
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span>Puntuación</span>
                      <span className="font-bold">{results.contractAnalysis.overflowProtection.score}/100</span>
                    </div>
                    <Progress value={results.contractAnalysis.overflowProtection.score} />
                    <p className="text-sm text-green-600">{results.contractAnalysis.overflowProtection.status}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Optimización de Gas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span>Puntuación</span>
                      <span className="font-bold">{results.contractAnalysis.gasOptimization.score}/100</span>
                    </div>
                    <Progress value={results.contractAnalysis.gasOptimization.score} />
                    <div>
                      <h4 className="font-medium mb-2">Sugerencias:</h4>
                      <ul className="text-sm space-y-1">
                        {results.contractAnalysis.gasOptimization.suggestions.map((suggestion, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <Info className="h-3 w-3 text-blue-500" />
                            {suggestion}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Recomendaciones */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Recomendaciones de Seguridad</h2>
          <div className="grid gap-4">
            {results.recommendations.map((recommendation) => (
              <Card key={recommendation.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{recommendation.title}</CardTitle>
                    <Badge className={getPriorityColor(recommendation.priority)}>
                      Prioridad {recommendation.priority === 'low' ? 'Baja' : 
                                recommendation.priority === 'medium' ? 'Media' : 'Alta'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-muted-foreground">{recommendation.description}</p>
                  <div>
                    <h4 className="font-medium mb-2">Implementación:</h4>
                    <p className="text-sm bg-blue-50 p-3 rounded-lg">{recommendation.implementation}</p>
                  </div>
                  <Badge variant="outline">{recommendation.category}</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Botones de Acción */}
        <div className="flex justify-center gap-4">
          <Link href="/dashboard/security">
            <Button variant="outline">
              Realizar Nueva Auditoría
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button>
              Volver al Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

