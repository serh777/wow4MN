'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Link, 
  TrendingUp, 
  Shield, 
  Target, 
  Users, 
  ExternalLink,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye
} from 'lucide-react';

interface BacklinksResults {
  score: number;
  totalBacklinks: number;
  qualityDistribution: {
    high: number;
    medium: number;
    low: number;
  };
  domainAuthority: {
    score: number;
    recommendations: string[];
  };
  anchorText: {
    score: number;
    distribution: {
      branded: number;
      exact: number;
      partial: number;
      generic: number;
    };
    recommendations: string[];
  };
  linkVelocity: {
    score: number;
    monthlyGrowth: number[];
    recommendations: string[];
  };
  toxicLinks: {
    score: number;
    count: number;
    severity: {
      high: number;
      medium: number;
      low: number;
    };
    recommendations: string[];
  };
  competitorAnalysis?: {
    score: number;
    competitors: Array<{
      domain: string;
      backlinks: number;
      domainAuthority: number;
      commonBacklinks: number;
    }>;
    opportunities: string[];
    recommendations: string[];
  };
  topBacklinks: Array<{
    domain: string;
    url: string;
    domainAuthority: number;
    anchorText: string;
    linkType: 'dofollow' | 'nofollow';
    firstSeen: string;
  }>;
  insights: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  };
}

interface BacklinksResultsProps {
  results: BacklinksResults;
}

function ScoreCard({ title, score, icon: Icon, description }: {
  title: string;
  score: number;
  icon: React.ElementType;
  description: string;
}) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-green-50 border-green-200';
    if (score >= 60) return 'bg-yellow-50 border-yellow-200';
    return 'bg-red-50 border-red-200';
  };

  return (
    <Card className={`${getScoreBg(score)} border`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Icon className="h-4 w-4" />
            <span className="font-medium text-sm">{title}</span>
          </div>
          <span className={`text-2xl font-bold ${getScoreColor(score)}`}>
            {score}
          </span>
        </div>
        <Progress value={score} className="h-2 mb-2" />
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

export function BacklinksResults({ results }: BacklinksResultsProps) {
  const getQualityPercentage = (count: number) => {
    return ((count / results.totalBacklinks) * 100).toFixed(1);
  };

  return (
    <div className="space-y-6">
      {/* Puntuación general */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Link className="h-5 w-5" />
            Puntuación General de Backlinks
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center mb-4">
            <div className="text-4xl font-bold text-primary mb-2">{results.score}/100</div>
            <Progress value={results.score} className="h-3 mb-2" />
            <p className="text-muted-foreground">
              Tu perfil de backlinks tiene una puntuación de <strong>{results.score}/100</strong> con{' '}
              <strong>{results.totalBacklinks}</strong> enlaces entrantes detectados.
            </p>
          </div>

          {/* Distribución de calidad */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-green-800">Alta Calidad</span>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-green-600 mb-1">
                {results.qualityDistribution.high}
              </div>
              <div className="text-sm text-green-700">
                {getQualityPercentage(results.qualityDistribution.high)}% del total
              </div>
            </div>
            
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-yellow-800">Calidad Media</span>
                <Eye className="h-4 w-4 text-yellow-600" />
              </div>
              <div className="text-2xl font-bold text-yellow-600 mb-1">
                {results.qualityDistribution.medium}
              </div>
              <div className="text-sm text-yellow-700">
                {getQualityPercentage(results.qualityDistribution.medium)}% del total
              </div>
            </div>
            
            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-red-800">Baja Calidad</span>
                <XCircle className="h-4 w-4 text-red-600" />
              </div>
              <div className="text-2xl font-bold text-red-600 mb-1">
                {results.qualityDistribution.low}
              </div>
              <div className="text-sm text-red-700">
                {getQualityPercentage(results.qualityDistribution.low)}% del total
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Métricas detalladas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <ScoreCard
          title="Autoridad de Dominio"
          score={results.domainAuthority.score}
          icon={Shield}
          description="Calidad promedio de dominios que te enlazan"
        />
        <ScoreCard
          title="Texto de Anclaje"
          score={results.anchorText.score}
          icon={Target}
          description="Diversidad y optimización del anchor text"
        />
        <ScoreCard
          title="Velocidad de Enlaces"
          score={results.linkVelocity.score}
          icon={TrendingUp}
          description="Crecimiento natural y sostenible"
        />
        <ScoreCard
          title="Enlaces Tóxicos"
          score={results.toxicLinks.score}
          icon={AlertTriangle}
          description={`${results.toxicLinks.count} enlaces problemáticos detectados`}
        />
      </div>

      {/* Análisis detallado con tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Resumen</TabsTrigger>
          <TabsTrigger value="quality">Calidad</TabsTrigger>
          <TabsTrigger value="anchors">Anchor Text</TabsTrigger>
          <TabsTrigger value="toxic">Enlaces Tóxicos</TabsTrigger>
          {results.competitorAnalysis && (
            <TabsTrigger value="competitors">Competidores</TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Backlinks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {results.topBacklinks.map((backlink, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">{backlink.domain}</span>
                        <Badge variant={backlink.linkType === 'dofollow' ? 'default' : 'secondary'}>
                          {backlink.linkType}
                        </Badge>
                        <span className="text-sm text-muted-foreground">DA: {backlink.domainAuthority}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">
                        Anchor: &quot;{backlink.anchorText}&quot;
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Detectado: {new Date(backlink.firstSeen).toLocaleDateString()}
                      </p>
                    </div>
                    <ExternalLink className="h-4 w-4 text-muted-foreground" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* SWOT Analysis */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-green-600">Fortalezas</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {results.insights.strengths.map((strength, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      {strength}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-red-600">Debilidades</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {results.insights.weaknesses.map((weakness, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <XCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                      {weakness}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-blue-600">Oportunidades</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {results.insights.opportunities.map((opportunity, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <TrendingUp className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                      {opportunity}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-orange-600">Amenazas</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {results.insights.threats.map((threat, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <AlertTriangle className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                      {threat}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="quality" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Autoridad de Dominio</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">
                    {results.domainAuthority.score}/100
                  </div>
                  <Progress value={results.domainAuthority.score} className="h-3" />
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Recomendaciones:</h4>
                  <ul className="space-y-1">
                    {results.domainAuthority.recommendations.map((rec, index) => (
                      <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="text-primary">•</span>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="anchors" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Distribución de Anchor Text</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{results.anchorText.distribution.branded}%</div>
                    <div className="text-sm text-muted-foreground">Marca</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{results.anchorText.distribution.exact}%</div>
                    <div className="text-sm text-muted-foreground">Exacto</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-600">{results.anchorText.distribution.partial}%</div>
                    <div className="text-sm text-muted-foreground">Parcial</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-600">{results.anchorText.distribution.generic}%</div>
                    <div className="text-sm text-muted-foreground">Genérico</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Recomendaciones:</h4>
                  <ul className="space-y-1">
                    {results.anchorText.recommendations.map((rec, index) => (
                      <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="text-primary">•</span>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="toxic" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                Enlaces Tóxicos Detectados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-600 mb-2">
                    {results.toxicLinks.count}
                  </div>
                  <p className="text-muted-foreground">Enlaces problemáticos encontrados</p>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-red-50 rounded-lg">
                    <div className="text-xl font-bold text-red-600">{results.toxicLinks.severity.high}</div>
                    <div className="text-sm text-red-700">Alta Severidad</div>
                  </div>
                  <div className="text-center p-3 bg-orange-50 rounded-lg">
                    <div className="text-xl font-bold text-orange-600">{results.toxicLinks.severity.medium}</div>
                    <div className="text-sm text-orange-700">Media Severidad</div>
                  </div>
                  <div className="text-center p-3 bg-yellow-50 rounded-lg">
                    <div className="text-xl font-bold text-yellow-600">{results.toxicLinks.severity.low}</div>
                    <div className="text-sm text-yellow-700">Baja Severidad</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">Acciones Recomendadas:</h4>
                  <ul className="space-y-1">
                    {results.toxicLinks.recommendations.map((rec, index) => (
                      <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="text-red-500">•</span>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {results.competitorAnalysis && (
          <TabsContent value="competitors" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Análisis Competitivo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {results.competitorAnalysis.competitors.map((competitor, index) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <div className="font-medium mb-2">{competitor.domain}</div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="text-muted-foreground">Backlinks:</span>
                            <div className="font-medium">{competitor.backlinks.toLocaleString()}</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">DA:</span>
                            <div className="font-medium">{competitor.domainAuthority}</div>
                          </div>
                          <div className="col-span-2">
                            <span className="text-muted-foreground">Enlaces comunes:</span>
                            <div className="font-medium">{competitor.commonBacklinks}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium">Oportunidades Identificadas:</h4>
                    <ul className="space-y-1">
                      {results.competitorAnalysis.opportunities.map((opp, index) => (
                        <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="text-blue-500">•</span>
                          {opp}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}