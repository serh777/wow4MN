'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { IconWrapper } from '@/components/ui/icon-wrapper';
import { SaveAnalysisButton } from '@/components/notifications/notification-system';
import { CompetitionResults as CompetitionResultsType } from './use-competition-analysis';

interface CompetitionResultsProps {
  results: CompetitionResultsType;
}

export function CompetitionResults({ results }: CompetitionResultsProps) {
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

  return (
    <div className="space-y-6">
      {/* Puntuación General */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Análisis Competitivo - {results.projectName}</span>
            <Badge variant={getScoreBadgeVariant(results.score)} className="text-lg px-3 py-1">
              {results.score}/100
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <h3 className="font-medium">Métricas Principales</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Visibilidad</span>
                  <div className="flex items-center gap-2">
                    <Progress value={results.metrics.visibility} className="w-20" />
                    <span className={`text-sm font-medium ${getScoreColor(results.metrics.visibility)}`}>
                      {results.metrics.visibility}/100
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Contenido</span>
                  <div className="flex items-center gap-2">
                    <Progress value={results.metrics.content} className="w-20" />
                    <span className={`text-sm font-medium ${getScoreColor(results.metrics.content)}`}>
                      {results.metrics.content}/100
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Técnico</span>
                  <div className="flex items-center gap-2">
                    <Progress value={results.metrics.technical} className="w-20" />
                    <span className={`text-sm font-medium ${getScoreColor(results.metrics.technical)}`}>
                      {results.metrics.technical}/100
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Social</span>
                  <div className="flex items-center gap-2">
                    <Progress value={results.metrics.social} className="w-20" />
                    <span className={`text-sm font-medium ${getScoreColor(results.metrics.social)}`}>
                      {results.metrics.social}/100
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">On-chain</span>
                  <div className="flex items-center gap-2">
                    <Progress value={results.metrics.onchain} className="w-20" />
                    <span className={`text-sm font-medium ${getScoreColor(results.metrics.onchain)}`}>
                      {results.metrics.onchain}/100
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-medium">Resumen Ejecutivo</h3>
              <p className="text-sm text-muted-foreground">
                El análisis competitivo muestra que tu proyecto <strong>{results.projectName}</strong> tiene una puntuación de <strong>{results.score}/100</strong> en comparación con los principales competidores del sector.
              </p>
              <p className="text-sm text-muted-foreground">
                Las áreas con mayor potencial de mejora son <strong>Social</strong> ({results.metrics.social}/100) y <strong>On-chain</strong> ({results.metrics.onchain}/100).
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="competitors" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="competitors">Competidores</TabsTrigger>
          <TabsTrigger value="recommendations">Recomendaciones</TabsTrigger>
          <TabsTrigger value="opportunities">Oportunidades</TabsTrigger>
          <TabsTrigger value="analysis">Análisis SWOT</TabsTrigger>
        </TabsList>
        
        <TabsContent value="competitors" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Análisis de Competidores</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {results.competitors.map((competitor, index) => (
                  <div key={index} className="rounded-lg border p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium">{competitor.name}</h4>
                      <Badge variant={getScoreBadgeVariant(competitor.score)}>
                        {competitor.score}/100
                      </Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-2">Fortalezas</p>
                        <ul className="space-y-1">
                          {competitor.strengths.map((strength, i) => (
                            <li key={i} className="text-sm text-green-600 flex items-center gap-2">
                              <IconWrapper icon="check" className="h-3 w-3" />
                              {strength}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-2">Debilidades</p>
                        <ul className="space-y-1">
                          {competitor.weaknesses.map((weakness, i) => (
                            <li key={i} className="text-sm text-red-600 flex items-center gap-2">
                              <IconWrapper icon="x" className="h-3 w-3" />
                              {weakness}
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
        </TabsContent>
        
        <TabsContent value="recommendations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recomendaciones para Mejorar</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {results.recommendations.map((recommendation, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="bg-primary/10 rounded-full h-6 w-6 flex items-center justify-center text-primary shrink-0 mt-0.5">
                      <span className="text-xs font-medium">{index + 1}</span>
                    </div>
                    <span className="text-sm">{recommendation}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="opportunities" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Oportunidades de Mercado</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Nichos y áreas donde tu proyecto puede destacarse frente a la competencia:
              </p>
              <ul className="space-y-3">
                {results.opportunityGaps.map((gap, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <IconWrapper icon="analytics" className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <span className="text-sm font-medium">{gap}</span>
                      <p className="text-xs text-muted-foreground mt-1">
                        Área con potencial de crecimiento y menor competencia
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="analysis" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-green-600">Fortalezas</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="text-sm flex items-center gap-2">
                    <IconWrapper icon="check" className="h-4 w-4 text-green-600" />
                    Puntuación técnica sólida ({results.metrics.technical}/100)
                  </li>
                  <li className="text-sm flex items-center gap-2">
                    <IconWrapper icon="check" className="h-4 w-4 text-green-600" />
                    Buena calidad de contenido ({results.metrics.content}/100)
                  </li>
                  <li className="text-sm flex items-center gap-2">
                    <IconWrapper icon="check" className="h-4 w-4 text-green-600" />
                    Proyecto bien estructurado
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-red-600">Debilidades</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="text-sm flex items-center gap-2">
                    <IconWrapper icon="x" className="h-4 w-4 text-red-600" />
                    Presencia social limitada ({results.metrics.social}/100)
                  </li>
                  <li className="text-sm flex items-center gap-2">
                    <IconWrapper icon="x" className="h-4 w-4 text-red-600" />
                    Actividad on-chain mejorable ({results.metrics.onchain}/100)
                  </li>
                  <li className="text-sm flex items-center gap-2">
                    <IconWrapper icon="x" className="h-4 w-4 text-red-600" />
                    Visibilidad en buscadores ({results.metrics.visibility}/100)
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-blue-600">Oportunidades</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {results.opportunityGaps.slice(0, 3).map((gap, index) => (
                    <li key={index} className="text-sm flex items-center gap-2">
                      <IconWrapper icon="analytics" className="h-4 w-4 text-blue-600" />
                      {gap}
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
                  <li className="text-sm flex items-center gap-2">
                    <IconWrapper icon="alert" className="h-4 w-4 text-orange-600" />
                    Competidores con mejor presencia social
                  </li>
                  <li className="text-sm flex items-center gap-2">
                    <IconWrapper icon="alert" className="h-4 w-4 text-orange-600" />
                    Mercado altamente competitivo
                  </li>
                  <li className="text-sm flex items-center gap-2">
                    <IconWrapper icon="alert" className="h-4 w-4 text-orange-600" />
                    Rápida evolución tecnológica
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Acciones */}
      <div className="flex justify-between">
        <Button variant="outline">
          <IconWrapper icon="fileText" className="mr-2 h-4 w-4" />
          Exportar Informe
        </Button>
        <SaveAnalysisButton analysisData={{ type: 'competition', data: results, score: results.score }} />
      </div>
    </div>
  );
}