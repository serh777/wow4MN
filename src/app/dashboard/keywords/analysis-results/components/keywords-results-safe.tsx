'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Download, Share2, TrendingUp, Search, Target, Eye, MousePointer, Brain, Copy } from 'lucide-react';
import Link from 'next/link';
import OverallScoreCard from './OverallScoreCard';
import KeywordMetricsCard from './KeywordMetricsCard';
import RecommendationsCard from './RecommendationsCard';

interface SafeKeywordResults {
  totalKeywords: number;
  avgSearchVolume: number;
  avgDifficulty: number;
  avgCpc: number;
  opportunityScore: number;
  recommendations: string[];
  analysisConfig?: {
    projectName: string;
    projectUrl: string;
    niche: string;
    keywordType: string;
    keywords: string;
  };
  timestamp?: string;
}

function generateSafeResults(config?: any): SafeKeywordResults {
  return {
    totalKeywords: 150,
    avgSearchVolume: 2500,
    avgDifficulty: 45,
    avgCpc: 1.25,
    opportunityScore: 78,
    recommendations: [
      'Enfócate en keywords de cola larga con menor competencia en Web3',
      'Optimiza para búsquedas de intención comercial en blockchain',
      'Aprovecha las tendencias estacionales del mercado crypto',
      'Considera expandir a keywords de DeFi y NFT relacionados',
      'Mejora el CTR en keywords con alta impresión en el ecosistema Web3'
    ],
    analysisConfig: config || {
      projectName: 'Proyecto Web3 Demo',
      projectUrl: 'https://ejemplo-web3.com',
      niche: 'Web3 General',
      keywordType: 'general',
      keywords: 'blockchain, web3, crypto, DeFi'
    },
    timestamp: new Date().toISOString()
  };
}

export function KeywordsResultsSafe() {
  const [results, setResults] = useState<SafeKeywordResults | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadResults = () => {
      try {
        // Intentar cargar desde sessionStorage de forma segura
        const savedResults = sessionStorage.getItem('keywordsAnalysisResults');
        const savedConfig = sessionStorage.getItem('keywordsAnalysisConfig');
        
        if (savedResults) {
          // Parsear solo los datos necesarios para evitar referencias circulares
          const parsedData = JSON.parse(savedResults);
          const configData = savedConfig ? JSON.parse(savedConfig) : null;
          
          // Safely extract analysisConfig to avoid circular references
          let safeAnalysisConfig = null;
          if (configData) {
            safeAnalysisConfig = {
              projectName: configData.projectName || 'Proyecto Web3 Demo',
              projectUrl: configData.projectUrl || 'https://ejemplo-web3.com',
              niche: configData.niche || 'Web3 General',
              keywordType: configData.keywordType || 'general',
              keywords: configData.keywords || 'blockchain, web3, crypto, DeFi'
            };
          } else if (parsedData.analysisConfig) {
            safeAnalysisConfig = {
              projectName: parsedData.analysisConfig.projectName || 'Proyecto Web3 Demo',
              projectUrl: parsedData.analysisConfig.projectUrl || 'https://ejemplo-web3.com',
              niche: parsedData.analysisConfig.niche || 'Web3 General',
              keywordType: parsedData.analysisConfig.keywordType || 'general',
              keywords: parsedData.analysisConfig.keywords || 'blockchain, web3, crypto, DeFi'
            };
          }

          const safeResults: SafeKeywordResults = {
            totalKeywords: parsedData.totalKeywords || 150,
            avgSearchVolume: parsedData.avgSearchVolume || 2500,
            avgDifficulty: parsedData.avgDifficulty || 45,
            avgCpc: parsedData.avgCpc || 1.25,
            opportunityScore: parsedData.opportunityScore || 78,
            recommendations: parsedData.recommendations || generateSafeResults().recommendations,
            analysisConfig: safeAnalysisConfig || undefined,
            timestamp: parsedData.timestamp || new Date().toISOString()
          };
          setResults(safeResults);
        } else {
          setResults(generateSafeResults());
        }
      } catch (err) {
        console.error('Error loading results:', err);
        setError('Error al cargar los resultados');
        setResults(generateSafeResults());
      } finally {
        setLoading(false);
      }
    };

    // Simular tiempo de carga
    const timer = setTimeout(loadResults, 2000);
    return () => clearTimeout(timer);
  }, []);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const downloadReport = (content: string, filename: string) => {
    const dataBlob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  const generateMarkdownReport = () => {
    if (!results) return '';
    
    return `# Reporte de Análisis de Keywords\n\n## Resumen Ejecutivo\n\n- **Total de Keywords Analizadas:** ${results.totalKeywords}\n- **Volumen de Búsqueda Promedio:** ${results.avgSearchVolume.toLocaleString()}\n- **Dificultad Promedio:** ${results.avgDifficulty}%\n- **CPC Promedio:** $${results.avgCpc.toFixed(2)}\n- **Puntuación de Oportunidad:** ${results.opportunityScore}%\n\n## Configuración del Análisis\n\n${results.analysisConfig ? `- **Proyecto:** ${results.analysisConfig.projectName}\n- **URL:** ${results.analysisConfig.projectUrl}\n- **Nicho:** ${results.analysisConfig.niche}\n- **Tipo de Keywords:** ${results.analysisConfig.keywordType}\n- **Keywords:** ${results.analysisConfig.keywords}` : 'No disponible'}\n\n## Recomendaciones Estratégicas\n\n${results.recommendations.map((rec, index) => `${index + 1}. ${rec}`).join('\n')}\n\n## Métricas Clave\n\n- **Potencial de Tráfico:** Alto\n- **Nivel de Competencia:** ${results.avgDifficulty >= 70 ? 'Alto' : results.avgDifficulty >= 40 ? 'Medio' : 'Bajo'}\n- **Eficiencia de Costos:** ${Math.max(0, 100 - (results.avgCpc * 20)).toFixed(0)}%\n\n---\n\n*Reporte generado el ${new Date().toLocaleString('es-ES')}*`;
  };

  const handleExport = () => {
    if (results) {
      try {
        // Create a safe copy for export to avoid circular references
        const exportData = {
          totalKeywords: results.totalKeywords,
          avgSearchVolume: results.avgSearchVolume,
          avgDifficulty: results.avgDifficulty,
          avgCpc: results.avgCpc,
          opportunityScore: results.opportunityScore,
          recommendations: results.recommendations,
          analysisConfig: results.analysisConfig ? {
            projectName: results.analysisConfig.projectName,
            projectUrl: results.analysisConfig.projectUrl,
            niche: results.analysisConfig.niche,
            keywordType: results.analysisConfig.keywordType,
            keywords: results.analysisConfig.keywords
          } : null,
          timestamp: results.timestamp,
          exportedAt: new Date().toISOString()
        };
        
        const dataStr = JSON.stringify(exportData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'keywords-analysis-results.json';
        link.click();
        URL.revokeObjectURL(url);
      } catch (err) {
        console.error('Error exporting:', err);
        // Fallback: try to export minimal data
        try {
          const minimalData = {
            totalKeywords: results.totalKeywords,
            avgSearchVolume: results.avgSearchVolume,
            opportunityScore: results.opportunityScore,
            exportedAt: new Date().toISOString()
          };
          const dataStr = JSON.stringify(minimalData, null, 2);
          const dataBlob = new Blob([dataStr], { type: 'application/json' });
          const url = URL.createObjectURL(dataBlob);
          const link = document.createElement('a');
          link.href = url;
          link.download = 'keywords-analysis-results-minimal.json';
          link.click();
          URL.revokeObjectURL(url);
        } catch (fallbackErr) {
          console.error('Fallback export also failed:', fallbackErr);
        }
      }
    }
  };

  const handleShare = async () => {
    if (navigator.share && results) {
      try {
        await navigator.share({
          title: 'Resultados de Análisis de Keywords',
          text: `Análisis completo de ${results.totalKeywords} keywords con score de oportunidad del ${results.opportunityScore}%`,
          url: window.location.href
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg font-medium mb-2">Cargando resultados del análisis...</p>
          <p className="text-sm text-gray-600">Generando resultados detallados</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Link href="/dashboard/keywords">
            <Button>Volver al Análisis de Keywords</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600 mb-4">No se encontraron resultados del análisis.</p>
          <Link href="/dashboard/keywords">
            <Button>Volver al Análisis de Keywords</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Resultados del Análisis de Keywords
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Análisis completo de {results.totalKeywords} keywords identificadas
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(generateMarkdownReport())}
              >
                <Copy className="h-4 w-4 mr-2" />
                Copiar
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => downloadReport(generateMarkdownReport(), `analisis-keywords-${Date.now()}.md`)}
              >
                <Download className="h-4 w-4 mr-2" />
                Descargar
              </Button>
              <Button onClick={handleExport} variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                JSON
              </Button>
              <Button onClick={handleShare} variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Compartir
              </Button>
            </div>
          </div>
          
          {/* Información del análisis */}
          {results.analysisConfig && (
            <Card className="mb-6 bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  Configuración del Análisis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Proyecto</p>
                    <p className="font-semibold">{results.analysisConfig.projectName}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">URL</p>
                    <p className="font-semibold text-blue-600 truncate">{results.analysisConfig.projectUrl}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Nicho</p>
                    <Badge variant="secondary">{results.analysisConfig.niche}</Badge>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Tipo de Keywords</p>
                    <Badge variant="outline">{results.analysisConfig.keywordType}</Badge>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-sm font-medium text-muted-foreground mb-2">Keywords Analizadas</p>
                  <p className="text-sm bg-muted p-2 rounded border">{results.analysisConfig.keywords}</p>
                </div>
                {results.timestamp && (
                  <div className="mt-4 text-xs text-muted-foreground">
                    Análisis realizado: {new Date(results.timestamp).toLocaleString('es-ES')}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Círculo de Puntuación General */}
        <OverallScoreCard results={results} />

        {/* Resumen Ejecutivo */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-blue-600" />
                Resumen Ejecutivo
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">
                    {results.opportunityScore}%
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Puntuación de Oportunidad</div>
                </div>
              </div>
              
              <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                <div className="text-center">
                  <Badge className={results.avgDifficulty >= 70 ? 'bg-red-100 text-red-800' : results.avgDifficulty >= 40 ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}>
                    {results.avgDifficulty >= 70 ? 'Alta Competencia' : results.avgDifficulty >= 40 ? 'Competencia Media' : 'Baja Competencia'}
                  </Badge>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">Nivel de Dificultad</div>
                </div>
              </div>
              
              <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">
                    {Math.round((results.avgSearchVolume * results.totalKeywords) / 1000)}K
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Potencial de Tráfico</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Métricas Detalladas */}
        <KeywordMetricsCard results={results} />

        {/* Recomendaciones Estratégicas */}
        <RecommendationsCard results={results} />

        {/* Botón para volver */}
        <div className="text-center">
          <Link href="/dashboard/keywords">
            <Button variant="outline">
              Realizar Nuevo Análisis
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}