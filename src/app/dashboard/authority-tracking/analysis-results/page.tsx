'use client';

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

        // Obtener datos del análisis desde sessionStorage
        const savedAnalysis = sessionStorage.getItem('authorityTrackingAnalysis');
        let analysisData = null;
        
        if (savedAnalysis) {
          analysisData = JSON.parse(savedAnalysis);
        }

        const finalIdentifier = urlIdentifier || analysisData?.identifier || '0x742d35Cc6634C0532925a3b8D8C9C4e8b4e8b4e8';
        
        // Validar identificador
        const validation = validateIdentifier(finalIdentifier);
        if (!validation.isValid) {
          throw new Error(validation.error || 'Identificador inválido');
        }

        // Configurar opciones de análisis
        const options = {
          analysisType,
          timeframe,
          includeGovernance: analysisData?.includeGovernance !== false,
          includeReputation: analysisData?.includeReputation !== false,
          includeInfluence: analysisData?.includeInfluence !== false
        };

        setIdentifier(finalIdentifier);
        setAnalysisOptions(options);

        setLoading(false);

      } catch (err) {
        console.error('Error cargando resultados:', err);
        setError('Error al cargar los resultados del análisis');
        setLoading(false);
      }
    };

    loadAnalysisResults();
  }, []);

  // Efecto para procesar datos cuando el análisis esté completo
  useEffect(() => {
    const processData = async () => {
      if (analysisData && identifier && !analysisLoading && !analysisError) {
        try {
          const processedData = await processAuthorityData(identifier, analysisOptions);
          setResults({
            ...analysisData,
            processed: processedData
          });
          setLoading(false);
        } catch (err) {
          console.error('Error procesando datos:', err);
          setError('Error al procesar los datos del análisis');
          setLoading(false);
        }
      }
    };

    processData();
  }, [analysisData, identifier, analysisLoading, analysisError, analysisOptions]);

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p className="text-muted-foreground">Cargando análisis de autoridad...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !results) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto" />
            <p className="text-red-600">{error || 'No se pudieron cargar los resultados'}</p>
          </div>
        </div>
      </div>
    );
  }

  const handleExport = () => {
    const dataStr = JSON.stringify(results, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `authority-analysis-${results.address}.json`;
    link.click();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Análisis de Autoridad Descentralizada',
          text: `Análisis de autoridad para ${results.ensName || results.address}`,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('URL copiada al portapapeles');
    }
  };

  // Preparar datos para gráficos usando datos reales
  const governance = results?.governanceMetrics || {};
  const social = results?.socialReputationMetrics || {};
  const technical = results?.technicalInfluenceMetrics || {};
  const network = results?.networkAnalysis || {};
  const protocols = results?.protocolParticipation || [];

  const radarData = [
    { subject: 'Gobernanza', score: governance.participationRate || 0 },
    { subject: 'Social', score: social.socialScore || 0 },
    { subject: 'Técnico', score: technical.technicalScore || 0 },
    { subject: 'Red', score: (network.networkCentrality || 0) * 100 },
    { subject: 'Confianza', score: social.trustScore || 0 },
    { subject: 'Influencia', score: social.networkInfluence || 0 }
  ];

  const protocolData = protocols.slice(0, 8).map((p: any) => ({
    name: p.protocol,
    participation: p.contributions || 0,
    reputation: p.reputation || 0,
    level: p.participationLevel === 'core' ? 100 : 
           p.participationLevel === 'high' ? 80 : 
           p.participationLevel === 'medium' ? 60 : 40
  }));

  // Datos de evolución histórica
  const evolutionData = (results?.authorityEvolution || []).map((item: any) => ({
    date: new Date(item.date).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' }),
    governance: item.governanceScore || 0,
    social: item.socialScore || 0,
    technical: item.technicalScore || 0,
    overall: item.overallScore || 0
  }));

  // Formatear métricas para visualización
  const formattedMetrics = formatAuthorityMetrics({
    overallScore: results?.overallAuthorityScore || 0,
    governanceScore: governance.participationRate || 0,
    socialScore: social.socialScore || 0,
    technicalScore: technical.technicalScore || 0,
    participationRate: governance.participationRate || 0,
    networkInfluence: social.networkInfluence || 0
  });

  const COLORS = ['#8b5cf6', '#a855f7', '#c084fc', '#d8b4fe', '#e9d5ff'];

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Análisis de Autoridad Descentralizada
            </h1>
            <p className="text-muted-foreground">
              {results.ensName || results.address}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Exportar
          </Button>
          <Button variant="outline" onClick={handleShare} className="flex items-center gap-2">
            <Share2 className="h-4 w-4" />
            Compartir
          </Button>
        </div>
      </div>

      {/* Puntuación General */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-purple-900">Puntuación General de Autoridad</h2>
              <p className="text-purple-700">Evaluación comprensiva de autoridad descentralizada</p>
              <div className="text-sm text-purple-600">
                {formattedMetrics.overallScore.description}
              </div>
            </div>
            <div className="relative">
              <div className="flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                <div className="text-center">
                  <div className="text-3xl font-bold">{formattedMetrics.overallScore.value}</div>
                  <div className="text-sm opacity-90">/ 100</div>
                </div>
              </div>
              <div className="absolute inset-0 rounded-full border-4 border-purple-200 animate-pulse"></div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Métricas Principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Participación en Gobernanza</p>
                <p className={`text-2xl font-bold ${formattedMetrics.participationRate.color}`}>
                  {formattedMetrics.participationRate.label}
                </p>
                <div className="mt-1">
                  <Progress value={formattedMetrics.participationRate.value} className="h-2" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Star className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Reputación Social</p>
                <p className={`text-2xl font-bold ${formattedMetrics.socialScore.color}`}>
                  {formattedMetrics.socialScore.label}
                </p>
                <div className="mt-1">
                  <Progress value={formattedMetrics.socialScore.value} className="h-2" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Zap className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Influencia Técnica</p>
                <p className={`text-2xl font-bold ${formattedMetrics.technicalScore.color}`}>
                  {formattedMetrics.technicalScore.label}
                </p>
                <div className="mt-1">
                  <Progress value={formattedMetrics.technicalScore.value} className="h-2" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Network className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Conexiones de Red</p>
                <p className="text-2xl font-bold">{network.connections || 0}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {network.influentialConnections || 0} influyentes
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Análisis Radar */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Análisis Multidimensional
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis angle={90} domain={[0, 100]} />
                <Radar
                  name="Autoridad"
                  dataKey="score"
                  stroke="#8b5cf6"
                  fill="#8b5cf6"
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Evolución Histórica */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Evolución de Autoridad
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={results.authorityEvolution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="overallScore" stroke="#8b5cf6" strokeWidth={3} />
                <Line type="monotone" dataKey="governanceScore" stroke="#06b6d4" strokeWidth={2} />
                <Line type="monotone" dataKey="socialScore" stroke="#10b981" strokeWidth={2} />
                <Line type="monotone" dataKey="technicalScore" stroke="#f59e0b" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Participación en Protocolos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Participación en Protocolos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {results.protocolParticipation.map((protocol, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                    {protocol.protocol.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold">{protocol.protocol}</p>
                    <p className="text-sm text-muted-foreground">{protocol.role}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Badge variant={
                    protocol.participationLevel === 'core' ? 'default' :
                    protocol.participationLevel === 'high' ? 'secondary' : 'outline'
                  }>
                    {protocol.participationLevel}
                  </Badge>
                  <div className="text-right">
                    <p className="font-semibold">{protocol.contributions} contribuciones</p>
                    <p className="text-sm text-muted-foreground">Reputación: {protocol.reputation}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recomendaciones */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Recomendaciones para Mejorar Autoridad
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {results.recommendations.map((rec, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-semibold text-lg">{rec.title}</h4>
                    <p className="text-sm text-muted-foreground mb-2">{rec.description}</p>
                  </div>
                  <Badge variant={
                    rec.priority === 'high' ? 'destructive' :
                    rec.priority === 'medium' ? 'default' : 'secondary'
                  }>
                    {rec.priority}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-green-600">Impacto esperado: {rec.impact}</p>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Acciones recomendadas:</p>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {rec.actionItems.map((action, actionIndex) => (
                        <li key={actionIndex} className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          {action}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Componente principal con Suspense
export default function AuthorityTrackingResultsPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p className="text-muted-foreground">Cargando análisis de autoridad...</p>
          </div>
        </div>
      </div>
    }>
      <AuthorityTrackingResultsContent />
    </Suspense>
  );
}
      { protocol: 'Aave', participation: 76, influence: 79, tokens: 500000 },
      { protocol: 'MakerDAO', participation: 89, influence: 85, tokens: 300000 }
    ],
    networkAnalysis: {
      connections: 156,
      influentialConnections: 23,
      networkCentrality: 0.78,
      clusteringCoefficient: 0.65
    },
    recommendations: [
      {
        type: 'opportunity',
        title: 'Aumentar Participación en Aave',
        description: 'Tu influencia en Aave está por debajo del promedio. Considera aumentar tu participación.',
        priority: 'high'
      },
      {
        type: 'strength',
        title: 'Mantener Liderazgo en Uniswap',
        description: 'Tu posición en Uniswap es excelente. Continúa con tu estrategia actual.',
        priority: 'medium'
      }
    ]
  };
};

export default function AuthorityTrackingResults() {
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [animatedScores, setAnimatedScores] = useState({
    overall: 0,
    governance: 0,
    social: 0,
    technical: 0
  });

  useEffect(() => {
    const loadResults = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1500));
      const data = generateMockResults();
      setResults(data);
      
      // Animate scores
      const duration = 2000;
      const steps = 60;
      const stepDuration = duration / steps;
      
      let currentStep = 0;
      const interval = setInterval(() => {
        currentStep++;
        const progress = currentStep / steps;
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        
        setAnimatedScores({
          overall: Math.round(data.summary.overallScore * easeOutQuart),
          governance: Math.round(data.summary.governanceAuthority * easeOutQuart),
          social: Math.round(data.summary.socialReputation * easeOutQuart),
          technical: Math.round(data.summary.technicalInfluence * easeOutQuart)
        });
        
        if (currentStep >= steps) {
          clearInterval(interval);
        }
      }, stepDuration);
      
      setLoading(false);
    };

    loadResults();
  }, []);

  const exportResults = () => {
    const dataStr = JSON.stringify(results, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `authority-tracking-${new Date().toISOString().split('T')[0]}.json`;
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const shareResults = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Análisis de Autoridad Web3 - Resultados',
        text: `Puntuación general de autoridad: ${results?.summary?.overallScore}%`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Enlace copiado al portapapeles');
    }
  };

  const getScoreColor = (score: number): string => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-green-500';
    if (score >= 70) return 'text-yellow-500';
    if (score >= 50) return 'text-orange-500';
    return 'text-red-500';
  };

  const getScoreGradient = (score: number): string => {
    if (score >= 90) return 'from-green-500 to-green-600';
    if (score >= 80) return 'from-green-400 to-green-500';
    if (score >= 70) return 'from-yellow-400 to-yellow-500';
    if (score >= 50) return 'from-orange-400 to-orange-500';
    return 'from-red-400 to-red-500';
  };

  const getProgressColor = (score: number): string => {
    if (score >= 90) return 'bg-gradient-to-r from-green-500 to-green-600';
    if (score >= 80) return 'bg-gradient-to-r from-green-400 to-green-500';
    if (score >= 70) return 'bg-gradient-to-r from-yellow-400 to-yellow-500';
    if (score >= 50) return 'bg-gradient-to-r from-orange-400 to-orange-500';
    return 'bg-gradient-to-r from-red-400 to-red-500';
  };

  const CircularProgress = ({ value, size = 120, strokeWidth = 8, children }: any) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const strokeDasharray = `${circumference} ${circumference}`;
    const strokeDashoffset = circumference - (value / 100) * circumference;
    
    return (
      <div className="relative inline-flex items-center justify-center">
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#e5e7eb"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={value >= 90 ? '#10b981' : value >= 80 ? '#22c55e' : value >= 70 ? '#eab308' : value >= 50 ? '#f97316' : '#ef4444'}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          {children}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-20">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-6"></div>
              <div className="absolute inset-0 rounded-full h-16 w-16 border-4 border-transparent border-t-blue-400 mx-auto animate-ping"></div>
            </div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">Analizando tu Autoridad Web3</h2>
            <p className="text-gray-600">Procesando datos de gobernanza, reputación social y contribuciones técnicas...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Análisis de Autoridad Web3</h1>
          <p className="text-xl text-gray-600 mb-6">Evaluación completa de tu influencia en el ecosistema descentralizado</p>
          <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>Actualizado: {new Date(results.summary.lastUpdated).toLocaleString()}</span>
            </div>
            <Separator orientation="vertical" className="h-4" />
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              <CheckCircle className="h-3 w-3 mr-1" />
              Análisis Completado
            </Badge>
          </div>
        </div>

        {/* Main Score - PageSpeed Style */}
        <Card className="bg-white shadow-lg border-0 overflow-hidden">
          <CardContent className="p-8">
            <div className="text-center">
              <div className="mb-6">
                <CircularProgress value={animatedScores.overall} size={160} strokeWidth={12}>
                  <div className="text-center">
                    <div className={`text-5xl font-bold ${getScoreColor(animatedScores.overall)}`}>
                      {animatedScores.overall}
                    </div>
                    <div className="text-gray-500 text-sm font-medium">AUTORIDAD</div>
                  </div>
                </CircularProgress>
              </div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">Puntuación General de Autoridad</h2>
              <p className="text-gray-600">Tu nivel de influencia y credibilidad en el ecosistema Web3</p>
            </div>
          </CardContent>
        </Card>

        {/* Core Metrics - PageSpeed Style */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Governance Authority */}
          <Card className="bg-white shadow-lg border-0 hover:shadow-xl transition-shadow duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-full bg-gradient-to-r ${getScoreGradient(animatedScores.governance)}`}>
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Autoridad de Gobernanza</h3>
                    <p className="text-sm text-gray-500">Participación en decisiones</p>
                  </div>
                </div>
                <div className={`text-3xl font-bold ${getScoreColor(animatedScores.governance)}`}>
                  {animatedScores.governance}
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="relative">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Progreso</span>
                    <span className="font-medium">{animatedScores.governance}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div 
                      className={`h-full ${getProgressColor(animatedScores.governance)} transition-all duration-1000 ease-out rounded-full`}
                      style={{ width: `${animatedScores.governance}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="text-center p-2 bg-gray-50 rounded-lg">
                    <div className="text-lg font-semibold text-gray-800">{results.metrics.governanceParticipation}%</div>
                    <div className="text-xs text-gray-500">Participación</div>
                  </div>
                  <div className="text-center p-2 bg-gray-50 rounded-lg">
                    <div className="text-lg font-semibold text-gray-800">{results.metrics.proposalSuccess}%</div>
                    <div className="text-xs text-gray-500">Éxito</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Social Reputation */}
          <Card className="bg-white shadow-lg border-0 hover:shadow-xl transition-shadow duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-full bg-gradient-to-r ${getScoreGradient(animatedScores.social)}`}>
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Reputación Social</h3>
                    <p className="text-sm text-gray-500">Confianza de la comunidad</p>
                  </div>
                </div>
                <div className={`text-3xl font-bold ${getScoreColor(animatedScores.social)}`}>
                  {animatedScores.social}
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="relative">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Progreso</span>
                    <span className="font-medium">{animatedScores.social}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div 
                      className={`h-full ${getProgressColor(animatedScores.social)} transition-all duration-1000 ease-out rounded-full`}
                      style={{ width: `${animatedScores.social}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="text-center p-2 bg-gray-50 rounded-lg">
                    <div className="text-lg font-semibold text-gray-800">{results.metrics.socialEngagement}%</div>
                    <div className="text-xs text-gray-500">Engagement</div>
                  </div>
                  <div className="text-center p-2 bg-gray-50 rounded-lg">
                    <div className="text-lg font-semibold text-gray-800">{results.metrics.communityTrust}%</div>
                    <div className="text-xs text-gray-500">Confianza</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Technical Influence */}
          <Card className="bg-white shadow-lg border-0 hover:shadow-xl transition-shadow duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-full bg-gradient-to-r ${getScoreGradient(animatedScores.technical)}`}>
                    <TrendingUp className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Influencia Técnica</h3>
                    <p className="text-sm text-gray-500">Contribuciones al código</p>
                  </div>
                </div>
                <div className={`text-3xl font-bold ${getScoreColor(animatedScores.technical)}`}>
                  {animatedScores.technical}
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="relative">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Progreso</span>
                    <span className="font-medium">{animatedScores.technical}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div 
                      className={`h-full ${getProgressColor(animatedScores.technical)} transition-all duration-1000 ease-out rounded-full`}
                      style={{ width: `${animatedScores.technical}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="text-center p-2 bg-gray-50 rounded-lg">
                    <div className="text-lg font-semibold text-gray-800">{results.metrics.codeCommits}</div>
                    <div className="text-xs text-gray-500">Commits</div>
                  </div>
                  <div className="text-center p-2 bg-gray-50 rounded-lg">
                    <div className="text-lg font-semibold text-gray-800">{results.metrics.protocolsInfluenced}</div>
                    <div className="text-xs text-gray-500">Protocolos</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Protocol Participation */}
          <Card className="bg-white shadow-lg border-0">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-xl">
                <Network className="h-6 w-6 text-blue-600" />
                Participación en Protocolos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {results.protocolParticipation.map((protocol: any, index: number) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-lg text-gray-800">{protocol.protocol}</h4>
                      <Badge variant="outline" className="bg-blue-50 text-blue-700">
                        {(protocol.tokens / 1000000).toFixed(1)}M tokens
                      </Badge>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600">Participación</span>
                          <span className="font-medium">{protocol.participation}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full transition-all duration-1000"
                            style={{ width: `${protocol.participation}%` }}
                          ></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600">Influencia</span>
                          <span className="font-medium">{protocol.influence}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="h-full bg-gradient-to-r from-purple-400 to-purple-600 rounded-full transition-all duration-1000"
                            style={{ width: `${protocol.influence}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Network Analysis */}
          <Card className="bg-white shadow-lg border-0">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-xl">
                <Globe className="h-6 w-6 text-purple-600" />
                Análisis de Red
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-blue-800">{results.networkAnalysis.connections}</div>
                      <div className="text-blue-600 font-medium">Conexiones Totales</div>
                    </div>
                    <Network className="h-8 w-8 text-blue-600" />
                  </div>
                </div>
                
                <div className="p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-purple-800">{results.networkAnalysis.influentialConnections}</div>
                      <div className="text-purple-600 font-medium">Conexiones Influyentes</div>
                    </div>
                    <Star className="h-8 w-8 text-purple-600" />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-gray-50 rounded-lg text-center">
                    <div className="text-xl font-bold text-gray-800">{(results.networkAnalysis.networkCentrality * 100).toFixed(0)}%</div>
                    <div className="text-xs text-gray-500">Centralidad</div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg text-center">
                    <div className="text-xl font-bold text-gray-800">{(results.networkAnalysis.clusteringCoefficient * 100).toFixed(0)}%</div>
                    <div className="text-xs text-gray-500">Clustering</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Historical Evolution */}
        <Card className="bg-white shadow-lg border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Activity className="h-6 w-6 text-indigo-600" />
              Evolución Histórica de la Autoridad
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={results.historicalData}>
                  <defs>
                    <linearGradient id="authorityGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="governanceGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="socialGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="technicalGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#6b7280"
                    fontSize={12}
                    tickFormatter={(value) => new Date(value).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })}
                  />
                  <YAxis stroke="#6b7280" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e5e7eb', 
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                    labelFormatter={(value) => new Date(value).toLocaleDateString('es-ES')}
                  />
                  <Area type="monotone" dataKey="authority" stroke="#6366f1" strokeWidth={3} fill="url(#authorityGradient)" name="Autoridad General" />
                  <Area type="monotone" dataKey="governance" stroke="#3b82f6" strokeWidth={2} fill="url(#governanceGradient)" name="Gobernanza" />
                  <Area type="monotone" dataKey="social" stroke="#10b981" strokeWidth={2} fill="url(#socialGradient)" name="Social" />
                  <Area type="monotone" dataKey="technical" stroke="#8b5cf6" strokeWidth={2} fill="url(#technicalGradient)" name="Técnica" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Recommendations */}
        <Card className="bg-white shadow-lg border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Target className="h-6 w-6 text-orange-600" />
              Recomendaciones Estratégicas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {results.recommendations.map((rec: any, index: number) => (
                <div key={index} className={`p-4 rounded-xl border-l-4 ${
                  rec.type === 'opportunity' 
                    ? 'bg-yellow-50 border-yellow-400' 
                    : 'bg-green-50 border-green-400'
                }`}>
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1">
                      {rec.type === 'opportunity' ? (
                        <Zap className="h-5 w-5 text-yellow-600" />
                      ) : (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold text-gray-800">{rec.title}</h4>
                        <Badge variant={rec.priority === 'high' ? 'destructive' : 'secondary'}>
                          {rec.priority === 'high' ? 'Alta' : 'Media'} Prioridad
                        </Badge>
                      </div>
                      <p className="text-gray-600">{rec.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <Card className="bg-white shadow-lg border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-center gap-4">
              <Button onClick={exportResults} className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2">
                <Download className="h-4 w-4" />
                Exportar Resultados
              </Button>
              <Button onClick={shareResults} variant="outline" className="border-2 border-gray-300 hover:border-gray-400 px-6 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2">
                <Share2 className="h-4 w-4" />
                Compartir Análisis
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}