'use client';

import React, { useEffect, useState } from 'react';
import { ToolLayout, AnalysisResults, Visualization, ScoreCard } from '@/app/dashboard/results/content/components/tool-components';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Download, Share2, RefreshCw, ExternalLink } from 'lucide-react';
import Link from 'next/link';

interface LinkResults {
  score: number;
  totalLinks: number;
  workingLinks: number;
  brokenLinks: number;
  redirectLinks: number;
  internalLinks: number;
  externalLinks: number;
  linkHealth: {
    score: number;
    recommendations: string[];
  };
  seoValue: {
    score: number;
    recommendations: string[];
  };
  userExperience: {
    score: number;
    recommendations: string[];
  };
  security: {
    score: number;
    recommendations: string[];
  };
  performance: {
    score: number;
    recommendations: string[];
  };
  detailedMetrics: {
    averageResponseTime: number;
    httpsPercentage: number;
    noFollowLinks: number;
    anchorTextOptimization: number;
    linkDepthDistribution: { [key: string]: number };
    topDomains: { domain: string; count: number; score: number }[];
    brokenLinkDetails: { url: string; status: number; error: string }[];
    redirectChains: { url: string; redirects: number; finalUrl: string }[];
  };
  recommendations: {
    priority: 'high' | 'medium' | 'low';
    category: string;
    title: string;
    description: string;
    impact: string;
  }[];
  analysisDate: string;
  websiteUrl: string;
  scanDepth: number;
}

function generateMockResults(): LinkResults {
  return {
    score: 78,
    totalLinks: 247,
    workingLinks: 198,
    brokenLinks: 12,
    redirectLinks: 37,
    internalLinks: 156,
    externalLinks: 91,
    linkHealth: {
      score: 82,
      recommendations: ['Reparar 12 enlaces rotos', 'Optimizar 8 redirecciones innecesarias']
    },
    seoValue: {
      score: 75,
      recommendations: ['Mejorar texto ancla', 'Balancear enlaces internos/externos']
    },
    userExperience: {
      score: 80,
      recommendations: ['Reducir tiempo de carga', 'Añadir atributos alt a imágenes']
    },
    security: {
      score: 88,
      recommendations: ['Migrar 15 enlaces HTTP a HTTPS', 'Revisar enlaces externos']
    },
    performance: {
      score: 72,
      recommendations: ['Optimizar imágenes enlazadas', 'Implementar lazy loading']
    },
    detailedMetrics: {
      averageResponseTime: 1.2,
      httpsPercentage: 94,
      noFollowLinks: 23,
      anchorTextOptimization: 67,
      linkDepthDistribution: {
        'Nivel 1': 45,
        'Nivel 2': 89,
        'Nivel 3': 67,
        'Nivel 4+': 46
      },
      topDomains: [
        { domain: 'example.com', count: 156, score: 95 },
        { domain: 'partner1.com', count: 23, score: 88 },
        { domain: 'social-media.com', count: 18, score: 82 },
        { domain: 'external-resource.org', count: 15, score: 76 }
      ],
      brokenLinkDetails: [
        { url: '/old-page', status: 404, error: 'Página no encontrada' },
        { url: '/removed-content', status: 410, error: 'Contenido eliminado' },
        { url: 'https://external-broken.com', status: 500, error: 'Error del servidor' }
      ],
      redirectChains: [
        { url: '/old-url', redirects: 3, finalUrl: '/new-final-url' },
        { url: '/legacy-page', redirects: 2, finalUrl: '/current-page' }
      ]
    },
    recommendations: [
      {
        priority: 'high',
        category: 'Enlaces Rotos',
        title: 'Reparar enlaces críticos',
        description: 'Se encontraron 12 enlaces rotos que afectan la experiencia del usuario',
        impact: 'Mejora inmediata en UX y SEO'
      },
      {
        priority: 'medium',
        category: 'Seguridad',
        title: 'Migrar a HTTPS',
        description: '15 enlaces aún usan HTTP en lugar de HTTPS',
        impact: 'Mejor seguridad y ranking SEO'
      },
      {
        priority: 'medium',
        category: 'Rendimiento',
        title: 'Optimizar redirecciones',
        description: 'Reducir cadenas de redirección para mejorar velocidad',
        impact: 'Tiempo de carga más rápido'
      },
      {
        priority: 'low',
        category: 'SEO',
        title: 'Mejorar texto ancla',
        description: 'Optimizar el texto ancla para mejor relevancia SEO',
        impact: 'Mejor posicionamiento en buscadores'
      }
    ],
    analysisDate: new Date().toISOString(),
    websiteUrl: 'https://mi-sitio-web3.com',
    scanDepth: 3
  };
}

export default function LinksAnalysisResults() {
  const [results, setResults] = useState<LinkResults | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Intentar cargar resultados desde sessionStorage
    const savedResults = sessionStorage.getItem('linksAnalysisResults');
    if (savedResults) {
      try {
        setResults(JSON.parse(savedResults));
      } catch (error) {
        console.error('Error parsing saved results:', error);
        setResults(generateMockResults());
      }
    } else {
      // Generar resultados mock si no hay datos guardados
      setResults(generateMockResults());
    }
    setLoading(false);
  }, []);

  const handleExport = () => {
    if (!results) return;
    
    const dataStr = JSON.stringify(results, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `analisis-enlaces-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleShare = async () => {
    if (navigator.share && results) {
      try {
        await navigator.share({
          title: 'Análisis de Enlaces - Resultados',
          text: `Análisis completo de enlaces: ${results.score}/100 puntos. ${results.totalLinks} enlaces analizados.`,
          url: window.location.href
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  if (loading) {
    return (
      <ToolLayout 
        title="Análisis de Enlaces" 
        description="Cargando resultados del análisis..."
      >
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="h-8 w-8 animate-spin" />
        </div>
      </ToolLayout>
    );
  }

  if (!results) {
    return (
      <ToolLayout 
        title="Análisis de Enlaces" 
        description="No se encontraron resultados"
      >
        <Card className="p-6 text-center">
          <p className="text-muted-foreground mb-4">No hay resultados de análisis disponibles.</p>
          <Link href="/dashboard/links">
            <Button>Realizar Nuevo Análisis</Button>
          </Link>
        </Card>
      </ToolLayout>
    );
  }

  return (
    <ToolLayout 
      title="Resultados del Análisis de Enlaces" 
      description={`Análisis completo de ${results.totalLinks} enlaces en ${results.websiteUrl}`}
    >
      {/* Header con acciones */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Puntuación General: {results.score}/100</h2>
          <p className="text-muted-foreground">
            Análisis realizado el {new Date(results.analysisDate).toLocaleDateString('es-ES')}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
          <Button variant="outline" onClick={handleShare}>
            <Share2 className="h-4 w-4 mr-2" />
            Compartir
          </Button>
          <Link href="/dashboard/links">
            <Button>
              <RefreshCw className="h-4 w-4 mr-2" />
              Nuevo Análisis
            </Button>
          </Link>
        </div>
      </div>

      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-green-50 p-4 rounded-lg">
          <h4 className="font-medium text-green-800">Enlaces Funcionando</h4>
          <p className="text-2xl font-bold text-green-600">{results.workingLinks}</p>
          <p className="text-sm text-green-600">{((results.workingLinks / results.totalLinks) * 100).toFixed(1)}%</p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg">
          <h4 className="font-medium text-red-800">Enlaces Rotos</h4>
          <p className="text-2xl font-bold text-red-600">{results.brokenLinks}</p>
          <p className="text-sm text-red-600">{((results.brokenLinks / results.totalLinks) * 100).toFixed(1)}%</p>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-medium text-blue-800">Enlaces Internos</h4>
          <p className="text-2xl font-bold text-blue-600">{results.internalLinks}</p>
          <p className="text-sm text-blue-600">{((results.internalLinks / results.totalLinks) * 100).toFixed(1)}%</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <h4 className="font-medium text-purple-800">Enlaces Externos</h4>
          <p className="text-2xl font-bold text-purple-600">{results.externalLinks}</p>
          <p className="text-sm text-purple-600">{((results.externalLinks / results.totalLinks) * 100).toFixed(1)}%</p>
        </div>
      </div>

      {/* Análisis por categorías */}
      <AnalysisResults 
        results={
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4">
              <ScoreCard 
                title="Salud de Enlaces" 
                score={results.linkHealth.score} 
                description={results.linkHealth.recommendations.join(', ')}
              />
              <ScoreCard 
                title="Valor SEO" 
                score={results.seoValue.score} 
                description={results.seoValue.recommendations.join(', ')}
              />
              <ScoreCard 
                title="Experiencia de Usuario" 
                score={results.userExperience.score} 
                description={results.userExperience.recommendations.join(', ')}
              />
              <ScoreCard 
                title="Seguridad" 
                score={results.security.score} 
                description={results.security.recommendations.join(', ')}
              />
              <ScoreCard 
                title="Rendimiento" 
                score={results.performance.score} 
                description={results.performance.recommendations.join(', ')}
              />
            </div>
          </div>
        }
      />

      {/* Métricas detalladas */}
      <Card className="p-6 mb-6">
        <h3 className="text-lg font-medium mb-4">Métricas Detalladas</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">{results.detailedMetrics.averageResponseTime}s</p>
            <p className="text-sm text-muted-foreground">Tiempo de respuesta promedio</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">{results.detailedMetrics.httpsPercentage}%</p>
            <p className="text-sm text-muted-foreground">Enlaces HTTPS</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">{results.detailedMetrics.noFollowLinks}</p>
            <p className="text-sm text-muted-foreground">Enlaces NoFollow</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-orange-600">{results.detailedMetrics.anchorTextOptimization}%</p>
            <p className="text-sm text-muted-foreground">Optimización de texto ancla</p>
          </div>
        </div>
      </Card>

      {/* Dominios principales */}
      <Card className="p-6 mb-6">
        <h3 className="text-lg font-medium mb-4">Dominios Principales</h3>
        <div className="space-y-3">
          {results.detailedMetrics.topDomains.map((domain, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <ExternalLink className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{domain.domain}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">{domain.count} enlaces</span>
                <div className="flex items-center gap-2">
                  <Progress value={domain.score} className="w-20" />
                  <span className="text-sm font-medium">{domain.score}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Recomendaciones */}
      <Card className="p-6 mb-6">
        <h3 className="text-lg font-medium mb-4">Recomendaciones Estratégicas</h3>
        <div className="space-y-4">
          {results.recommendations.map((rec, index) => (
            <div key={index} className="border rounded-lg p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(rec.priority)}`}>
                    {rec.priority === 'high' ? 'Alta' : rec.priority === 'medium' ? 'Media' : 'Baja'}
                  </span>
                  <span className="text-sm text-muted-foreground">{rec.category}</span>
                </div>
              </div>
              <h4 className="font-medium mb-1">{rec.title}</h4>
              <p className="text-sm text-muted-foreground mb-2">{rec.description}</p>
              <p className="text-sm text-green-600 font-medium">💡 {rec.impact}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Visualización */}
      <Visualization 
        title="Estado de Enlaces" 
        description="Distribución visual del estado y tipos de enlaces en tu sitio"
      >
        <div className="h-full flex flex-col justify-between">
          <div className="flex-1">
            <h4 className="text-sm font-medium mb-4">Estado de Enlaces</h4>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span>Funcionando</span>
                  <span>{results.workingLinks} enlaces</span>
                </div>
                <Progress value={(results.workingLinks / results.totalLinks) * 100} className="w-full h-2" />
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span>Rotos</span>
                  <span>{results.brokenLinks} enlaces</span>
                </div>
                <Progress value={(results.brokenLinks / results.totalLinks) * 100} className="w-full h-2" />
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span>Redirecciones</span>
                  <span>{results.redirectLinks} enlaces</span>
                </div>
                <Progress value={(results.redirectLinks / results.totalLinks) * 100} className="w-full h-2" />
              </div>
            </div>
            
            <h4 className="text-sm font-medium mb-4 mt-6">Distribución por Profundidad</h4>
            <div className="space-y-4">
              {Object.entries(results.detailedMetrics.linkDepthDistribution).map(([level, count]) => (
                <div key={level}>
                  <div className="flex justify-between text-xs mb-1">
                    <span>{level}</span>
                    <span>{count} enlaces</span>
                  </div>
                  <Progress value={(count / results.totalLinks) * 100} className="w-full h-2" />
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-6 pt-4 border-t">
            <h4 className="text-sm font-medium mb-2">Acciones Recomendadas</h4>
            <ul className="text-xs space-y-1 text-muted-foreground">
              <li>• Reparar {results.brokenLinks} enlaces rotos identificados</li>
              <li>• Optimizar {results.redirectLinks} redirecciones</li>
              <li>• Migrar enlaces HTTP a HTTPS</li>
              <li>• Mejorar texto ancla para SEO</li>
            </ul>
          </div>
        </div>
      </Visualization>
    </ToolLayout>
  );
}