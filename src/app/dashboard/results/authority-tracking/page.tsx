'use client';

import React, { useState, useEffect, Suspense } from 'react';
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
  Shield, Users, TrendingUp, Award, Star, Network, Activity, 
  Download, Share2, ArrowUp, ArrowDown, Minus,
  CheckCircle, AlertTriangle, Info, Target, Zap, Globe, Clock
} from 'lucide-react';
import { useAuthorityAnalysis } from '../components/use-authority-analysis';
import { processAuthorityData, formatAuthorityMetrics, validateIdentifier } from '../components/real-authority-helpers';

// Componente principal con Suspense
function AuthorityTrackingResultsContent() {
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [identifier, setIdentifier] = useState<string>('');
  const [analysisOptions, setAnalysisOptions] = useState<any>({});

  // Hook para análisis real
  const { data: analysisData, isLoading: analysisLoading, error: analysisError } = useAuthorityAnalysis(identifier, analysisOptions);

  useEffect(() => {
    const loadAnalysisResults = async () => {
      try {
        // Obtener parámetros de la URL
        const urlParams = new URLSearchParams(window.location.search);
        const urlIdentifier = urlParams.get('identifier') || '';
        const analysisType = urlParams.get('type') || 'comprehensive';
        const timeframe = urlParams.get('timeframe') || '30d';

        setIdentifier(urlIdentifier);
        setAnalysisOptions({ type: analysisType, timeframe });

        // Obtener datos del análisis desde sessionStorage
        const savedAnalysis = sessionStorage.getItem('authorityTrackingAnalysis');
        let analysisData = null;
        
        if (savedAnalysis) {
          analysisData = JSON.parse(savedAnalysis);
        }

        if (analysisData) {
          const processedData = processAuthorityData(analysisData);
          setResults(processedData);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error loading analysis results:', err);
        setError('Error al cargar los resultados del análisis');
        setLoading(false);
      }
    };

    loadAnalysisResults();
  }, []);

  // Procesar datos cuando el análisis esté completo
  useEffect(() => {
    if (analysisData && !analysisLoading) {
      try {
        const processedData = processAuthorityData(analysisData);
        setResults(processedData);
        setLoading(false);
      } catch (err) {
        console.error('Error processing analysis data:', err);
        setError('Error al procesar los datos del análisis');
        setLoading(false);
      }
    }
  }, [analysisData, analysisLoading]);

  if (loading || analysisLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-600/20 rounded-full mb-6">
              <div className="w-8 h-8 border-2 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Analizando Autoridad</h2>
            <p className="text-gray-400">Procesando datos de blockchain y redes sociales...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || analysisError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-600/20 rounded-full mb-6">
              <AlertTriangle className="w-8 h-8 text-red-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Error en el Análisis</h2>
            <p className="text-gray-400">{error || analysisError}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-white mb-2">No se encontraron resultados</h2>
            <p className="text-gray-400">No hay datos disponibles para mostrar.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">
            Resultados del Análisis de Autoridad
          </h1>
          <p className="text-xl text-gray-300">
            Análisis completo de tu influencia y autoridad en el ecosistema
          </p>
        </div>

        {/* Mostrar resultados reales */}
        {results && (
          <div className="space-y-6">
            {/* Overall Score */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-8">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full mb-6">
                    <span className="text-4xl font-bold text-white">
                      {results.overallScore || 0}
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">Puntuación General</h2>
                  <p className="text-gray-400">Tu nivel de autoridad en el ecosistema</p>
                </div>
              </CardContent>
            </Card>

            {/* Detailed Scores */}
            {results.scores && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-white">Gobernanza</h3>
                      <div className="text-2xl font-bold text-purple-400">
                        {results.scores.governance || 0}
                      </div>
                    </div>
                    <Progress value={results.scores.governance || 0} className="h-2" />
                  </CardContent>
                </Card>

                <Card className="bg-slate-800/50 border-slate-700">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-white">Social</h3>
                      <div className="text-2xl font-bold text-blue-400">
                        {results.scores.social || 0}
                      </div>
                    </div>
                    <Progress value={results.scores.social || 0} className="h-2" />
                  </CardContent>
                </Card>

                <Card className="bg-slate-800/50 border-slate-700">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-white">Técnico</h3>
                      <div className="text-2xl font-bold text-green-400">
                        {results.scores.technical || 0}
                      </div>
                    </div>
                    <Progress value={results.scores.technical || 0} className="h-2" />
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Protocol Participation */}
            {results.protocolParticipation && results.protocolParticipation.length > 0 && (
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-white mb-6">Participación en Protocolos</h3>
                  <div className="space-y-4">
                    {results.protocolParticipation.map((protocol: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                        <div>
                          <h4 className="font-semibold text-white">{protocol.protocol}</h4>
                          <p className="text-sm text-gray-400">Tokens: {protocol.tokens?.toLocaleString() || 'N/A'}</p>
                        </div>
                        <div className="flex space-x-4">
                          <div className="text-center">
                            <div className="text-lg font-bold text-purple-400">{protocol.participation || 0}%</div>
                            <div className="text-xs text-gray-400">Participación</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold text-blue-400">{protocol.influence || 0}%</div>
                            <div className="text-xs text-gray-400">Influencia</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Network Analysis */}
            {results.networkAnalysis && (
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-white mb-6">Análisis de Red</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-slate-700/50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-400">{results.networkAnalysis.connections || 0}</div>
                      <div className="text-sm text-gray-400">Conexiones</div>
                    </div>
                    <div className="text-center p-4 bg-slate-700/50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-400">{results.networkAnalysis.influentialConnections || 0}</div>
                      <div className="text-sm text-gray-400">Influyentes</div>
                    </div>
                    <div className="text-center p-4 bg-slate-700/50 rounded-lg">
                      <div className="text-2xl font-bold text-green-400">{results.networkAnalysis.networkCentrality || 0}</div>
                      <div className="text-sm text-gray-400">Centralidad</div>
                    </div>
                    <div className="text-center p-4 bg-slate-700/50 rounded-lg">
                      <div className="text-2xl font-bold text-yellow-400">{results.networkAnalysis.clusteringCoefficient || 0}</div>
                      <div className="text-sm text-gray-400">Clustering</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Recommendations */}
            {results.recommendations && results.recommendations.length > 0 && (
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-white mb-6">Recomendaciones</h3>
                  <div className="space-y-4">
                    {results.recommendations.map((rec: any, index: number) => (
                      <div key={index} className={`p-4 rounded-lg border-l-4 ${
                        rec.type === 'opportunity' 
                          ? 'bg-yellow-900/20 border-yellow-400' 
                          : 'bg-green-900/20 border-green-400'
                      }`}>
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-semibold text-white mb-1">{rec.title}</h4>
                            <p className="text-gray-300 text-sm">{rec.description}</p>
                          </div>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            rec.priority === 'high' 
                              ? 'bg-red-900/50 text-red-300' 
                              : 'bg-yellow-900/50 text-yellow-300'
                          }`}>
                            {rec.priority}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Componente principal exportado
export default function AuthorityTrackingResultsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-600/20 rounded-full mb-6">
              <div className="w-8 h-8 border-2 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Cargando...</h2>
            <p className="text-gray-400">Preparando análisis de autoridad...</p>
          </div>
        </div>
      </div>
    }>
      <AuthorityTrackingResultsContent />
    </Suspense>
  );
}