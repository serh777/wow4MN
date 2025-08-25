'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  AreaChart, Area
} from 'recharts';
import { 
  ShieldCheck, FileText, Image, Lock, Fingerprint, Clock, 
  Download, Share2, ArrowUp, ArrowDown, Minus,
  CheckCircle, AlertTriangle, Info, Target, Hash, Scan, Eye, Database,
  Activity
} from 'lucide-react';

// Función para generar datos mock realistas
const generateMockResults = () => {
  const baseScore = Math.floor(Math.random() * 30) + 70; // 70-100
  
  return {
    overallScore: baseScore,
    contentUrl: 'https://ipfs.io/ipfs/QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG',
    contentType: 'NFT',
    analysisDate: new Date().toISOString(),
    
    // Métricas principales
    metrics: {
      integrity: Math.floor(Math.random() * 20) + 80,
      provenance: Math.floor(Math.random() * 25) + 75,
      ownership: Math.floor(Math.random() * 30) + 70,
      authenticity: Math.floor(Math.random() * 20) + 85,
      metadata: Math.floor(Math.random() * 25) + 75,
      blockchain: Math.floor(Math.random() * 15) + 85
    },
    
    // Verificaciones realizadas
    verifications: [
      {
        type: 'Hash Verification',
        status: 'verified',
        confidence: 98,
        details: 'SHA-256 hash matches original content',
        timestamp: new Date(Date.now() - Math.random() * 86400000).toISOString()
      },
      {
        type: 'Blockchain Record',
        status: 'verified',
        confidence: 95,
        details: 'Transaction confirmed on Ethereum mainnet',
        timestamp: new Date(Date.now() - Math.random() * 86400000).toISOString()
      },
      {
        type: 'Digital Signature',
        status: 'verified',
        confidence: 92,
        details: 'Valid signature from creator wallet',
        timestamp: new Date(Date.now() - Math.random() * 86400000).toISOString()
      },
      {
        type: 'Metadata Integrity',
        status: 'verified',
        confidence: 89,
        details: 'Metadata unchanged since creation',
        timestamp: new Date(Date.now() - Math.random() * 86400000).toISOString()
      },
      {
        type: 'IPFS Pinning',
        status: 'warning',
        confidence: 75,
        details: 'Content pinned but limited nodes',
        timestamp: new Date(Date.now() - Math.random() * 86400000).toISOString()
      }
    ],
    
    // Historial de procedencia
    provenanceHistory: [
      {
        event: 'Content Created',
        timestamp: '2023-01-15T10:30:00Z',
        actor: '0x742d35Cc6634C0532925a3b8D4C2C4e0C8b4f8e9',
        action: 'Original creation and upload to IPFS',
        verified: true
      },
      {
        event: 'NFT Minted',
        timestamp: '2023-01-15T11:45:00Z',
        actor: '0x742d35Cc6634C0532925a3b8D4C2C4e0C8b4f8e9',
        action: 'Minted as NFT on Ethereum',
        verified: true
      },
      {
        event: 'First Transfer',
        timestamp: '2023-02-20T14:20:00Z',
        actor: '0x8ba1f109551bD432803012645Hac136c22C501e5',
        action: 'Transferred to new owner',
        verified: true
      },
      {
        event: 'Marketplace Listing',
        timestamp: '2023-03-10T09:15:00Z',
        actor: '0x8ba1f109551bD432803012645Hac136c22C501e5',
        action: 'Listed on OpenSea marketplace',
        verified: true
      }
    ],
    
    // Análisis de riesgos
    riskAnalysis: [
      {
        category: 'Falsificación',
        risk: 'low',
        score: 15,
        description: 'Baja probabilidad de ser contenido falsificado'
      },
      {
        category: 'Manipulación',
        risk: 'low',
        score: 12,
        description: 'No se detectaron signos de manipulación'
      },
      {
        category: 'Plagio',
        risk: 'medium',
        score: 35,
        description: 'Elementos similares encontrados en otros contenidos'
      },
      {
        category: 'Disponibilidad',
        risk: 'medium',
        score: 40,
        description: 'Dependencia de servicios IPFS externos'
      }
    ],
    
    // Datos técnicos
    technicalData: {
      fileHash: '0x1234567890abcdef1234567890abcdef12345678',
      fileSize: '2.4 MB',
      format: 'PNG',
      dimensions: '1024x1024',
      colorDepth: '24-bit',
      compression: 'Lossless',
      ipfsHash: 'QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG',
      blockchainNetwork: 'Ethereum',
      contractAddress: '0x495f947276749Ce646f68AC8c248420045cb7b5e',
      tokenId: '12345'
    },
    
    // Distribución de confianza
    trustDistribution: [
      { name: 'Verificado', value: 75, color: '#10B981' },
      { name: 'Probable', value: 15, color: '#F59E0B' },
      { name: 'Incierto', value: 8, color: '#EF4444' },
      { name: 'No Verificable', value: 2, color: '#6B7280' }
    ],
    
    // Comparación con estándares
    standardsComparison: {
      erc721: { compliance: 98, issues: 1 },
      erc1155: { compliance: 85, issues: 3 },
      ipfs: { compliance: 92, issues: 2 },
      metadata: { compliance: 89, issues: 2 }
    }
  };
};

export default function ContentAuthenticityResults() {
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular carga de datos
    const timer = setTimeout(() => {
      setResults(generateMockResults());
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const exportResults = () => {
    const dataStr = JSON.stringify(results, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `authenticity-verification-${Date.now()}.json`;
    link.click();
  };

  const shareResults = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Verificación de Autenticidad',
          text: `Puntuación de autenticidad: ${results?.overallScore}/100`,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'error': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'error': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default: return <Info className="h-4 w-4 text-gray-600" />;
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Activity className="h-8 w-8 animate-spin mx-auto mb-4 text-green-500" />
            <p className="text-lg font-medium">Verificando autenticidad del contenido...</p>
            <p className="text-muted-foreground">Analizando blockchain, hashes y metadatos</p>
          </div>
        </div>
      </div>
    );
  }

  if (!results) return null;

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg">
            <ShieldCheck className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Verificación de Autenticidad
            </h1>
            <p className="text-muted-foreground">
              Resultados para {results.contentType} • {results.contentUrl.split('/').pop()?.slice(0, 20)}...
            </p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportResults}>
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
          <Button variant="outline" onClick={shareResults}>
            <Share2 className="h-4 w-4 mr-2" />
            Compartir
          </Button>
        </div>
      </div>

      {/* Puntuación General */}
      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Puntuación de Autenticidad</h2>
              <p className="text-muted-foreground">Evaluación general de la autenticidad del contenido</p>
            </div>
            <div className="text-center">
              <div className="relative w-32 h-32">
                <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
                  <circle
                    cx="60"
                    cy="60"
                    r="50"
                    stroke="#e5e7eb"
                    strokeWidth="8"
                    fill="none"
                  />
                  <circle
                    cx="60"
                    cy="60"
                    r="50"
                    stroke="url(#gradientGreen)"
                    strokeWidth="8"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={`${(results.overallScore / 100) * 314} 314`}
                  />
                  <defs>
                    <linearGradient id="gradientGreen" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#10B981" />
                      <stop offset="100%" stopColor="#059669" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-900">{results.overallScore}</div>
                    <div className="text-sm text-muted-foreground">/ 100</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Métricas Principales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Fingerprint className="h-5 w-5 text-blue-500" />
              Integridad
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl font-bold">{results.metrics.integrity}</span>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </div>
            <Progress value={results.metrics.integrity} className="mb-2" />
            <p className="text-sm text-muted-foreground">
              Verificación de hashes y firmas digitales
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Clock className="h-5 w-5 text-purple-500" />
              Procedencia
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl font-bold">{results.metrics.provenance}</span>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </div>
            <Progress value={results.metrics.provenance} className="mb-2" />
            <p className="text-sm text-muted-foreground">
              Historial completo desde la creación
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Lock className="h-5 w-5 text-green-500" />
              Propiedad
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl font-bold">{results.metrics.ownership}</span>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </div>
            <Progress value={results.metrics.ownership} className="mb-2" />
            <p className="text-sm text-muted-foreground">
              Verificación de propiedad legítima
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Verificaciones Realizadas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Scan className="h-5 w-5 text-blue-500" />
            Verificaciones Realizadas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {results.verifications.map((verification: any, index: number) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  {getStatusIcon(verification.status)}
                  <div>
                    <h4 className="font-medium">{verification.type}</h4>
                    <p className="text-sm text-muted-foreground">{verification.details}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold">{verification.confidence}%</div>
                  <p className="text-xs text-muted-foreground">
                    {new Date(verification.timestamp).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Historial de Procedencia */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-purple-500" />
            Historial de Procedencia
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {results.provenanceHistory.map((event: any, index: number) => (
              <div key={index} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className={`w-3 h-3 rounded-full ${event.verified ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                  {index < results.provenanceHistory.length - 1 && (
                    <div className="w-px h-12 bg-gray-300 mt-2"></div>
                  )}
                </div>
                <div className="flex-1 pb-4">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium">{event.event}</h4>
                    {event.verified && <CheckCircle className="h-4 w-4 text-green-500" />}
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">{event.action}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>{new Date(event.timestamp).toLocaleString()}</span>
                    <span>{event.actor.slice(0, 6)}...{event.actor.slice(-4)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Análisis de Riesgos y Datos Técnicos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              Análisis de Riesgos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {results.riskAnalysis.map((risk: any, index: number) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{risk.category}</span>
                      <Badge className={getRiskColor(risk.risk)}>
                        {risk.risk === 'low' ? 'Bajo' : risk.risk === 'medium' ? 'Medio' : 'Alto'}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{risk.description}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold">{risk.score}%</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5 text-blue-500" />
              Datos Técnicos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Hash del Archivo</span>
                <span className="font-mono text-sm">{results.technicalData.fileHash.slice(0, 10)}...</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Tamaño</span>
                <span className="font-bold">{results.technicalData.fileSize}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Formato</span>
                <span className="font-bold">{results.technicalData.format}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Dimensiones</span>
                <span className="font-bold">{results.technicalData.dimensions}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Red Blockchain</span>
                <span className="font-bold">{results.technicalData.blockchainNetwork}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Token ID</span>
                <span className="font-bold">{results.technicalData.tokenId}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Distribución de Confianza */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-green-500" />
            Distribución de Confianza
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={results.trustDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {results.trustDistribution.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {results.trustDistribution.map((item: any, index: number) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                <span className="text-sm">{item.name}: {item.value}%</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Cumplimiento de Estándares */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            Cumplimiento de Estándares
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(results.standardsComparison).map(([standard, data]: [string, any]) => (
              <div key={standard} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium uppercase">{standard}</span>
                  <span className="text-sm text-muted-foreground">{data.issues} problemas</span>
                </div>
                <Progress value={data.compliance} className="h-2" />
                <div className="text-right">
                  <span className="text-sm font-bold">{data.compliance}%</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

