'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PageSpeedScore } from './pagespeed-score';
import { 
  Globe, 
  Shield, 
  Zap, 
  Search, 
  Users, 
  BarChart3, 
  TrendingUp,
  Clock,
  Target,
  Award
} from 'lucide-react';

interface DashboardScore {
  id: string;
  title: string;
  score: number;
  description: string;
  icon: React.ComponentType<any>;
  category: 'performance' | 'seo' | 'security' | 'content' | 'social' | 'competition';
  metrics?: {
    name: string;
    value: number;
    unit: string;
    status: 'good' | 'needs-improvement' | 'poor';
    description: string;
  }[];
  opportunities?: {
    title: string;
    description: string;
    impact: 'high' | 'medium' | 'low';
    savings?: string;
  }[];
}

interface PageSpeedDashboardProps {
  scores: DashboardScore[];
  overallScore?: number;
  title?: string;
  subtitle?: string;
  className?: string;
}

export const PageSpeedDashboard: React.FC<PageSpeedDashboardProps> = ({
  scores,
  overallScore,
  title = "Análisis Completo del Sitio Web",
  subtitle = "Resultados detallados de rendimiento, SEO y optimización",
  className = ''
}) => {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'performance': return 'bg-blue-50 border-blue-200 text-blue-900';
      case 'seo': return 'bg-green-50 border-green-200 text-green-900';
      case 'security': return 'bg-red-50 border-red-200 text-red-900';
      case 'content': return 'bg-purple-50 border-purple-200 text-purple-900';
      case 'social': return 'bg-pink-50 border-pink-200 text-pink-900';
      case 'competition': return 'bg-orange-50 border-orange-200 text-orange-900';
      default: return 'bg-gray-50 border-gray-200 text-gray-900';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'performance': return Zap;
      case 'seo': return Search;
      case 'security': return Shield;
      case 'content': return BarChart3;
      case 'social': return Users;
      case 'competition': return TrendingUp;
      default: return Target;
    }
  };

  const getOverallScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 70) return 'text-blue-600 bg-blue-50 border-blue-200';
    if (score >= 50) return 'text-orange-600 bg-orange-50 border-orange-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const calculateOverallScore = () => {
    if (overallScore !== undefined) return overallScore;
    if (scores.length === 0) return 0;
    return Math.round(scores.reduce((sum, score) => sum + score.score, 0) / scores.length);
  };

  const finalOverallScore = calculateOverallScore();

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Header with Overall Score */}
      <div className="text-center space-y-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            {title}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            {subtitle}
          </p>
        </div>
        
        {/* Overall Score Card */}
        <Card className={`inline-block ${getOverallScoreColor(finalOverallScore)} border-2 shadow-lg`}>
          <CardContent className="p-6">
            <div className="flex items-center justify-center space-x-4">
              <Award className="h-8 w-8" />
              <div className="text-center">
                <div className="text-4xl font-bold">
                  {finalOverallScore}
                </div>
                <div className="text-sm font-medium opacity-80">
                  Puntuación General
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Scores Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
        {scores.map((scoreData) => {
          const IconComponent = scoreData.icon;
          const CategoryIcon = getCategoryIcon(scoreData.category);
          
          return (
            <div key={scoreData.id} className="space-y-4">
              {/* Category Header */}
              <Card className={`${getCategoryColor(scoreData.category)} border-2`}>
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-white bg-opacity-80 rounded-lg">
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-semibold">
                        {scoreData.title}
                      </CardTitle>
                      <div className="flex items-center space-x-2 mt-1">
                        <CategoryIcon className="h-4 w-4 opacity-70" />
                        <span className="text-sm opacity-80 capitalize">
                          {scoreData.category}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
              </Card>
              
              {/* Score Component */}
              <PageSpeedScore
                score={scoreData.score}
                title={scoreData.title}
                description={scoreData.description}
                metrics={scoreData.metrics}
                opportunities={scoreData.opportunities}
                size="md"
              />
            </div>
          );
        })}
      </div>

      {/* Summary Stats */}
      <Card className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border-2 border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center">
            <BarChart3 className="h-6 w-6 mr-2 text-blue-600" />
            Resumen del Análisis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center space-y-2">
              <div className="text-2xl font-bold text-green-600">
                {scores.filter(s => s.score >= 90).length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Excelentes
              </div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-2xl font-bold text-blue-600">
                {scores.filter(s => s.score >= 70 && s.score < 90).length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Buenos
              </div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-2xl font-bold text-orange-600">
                {scores.filter(s => s.score >= 50 && s.score < 70).length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Necesitan mejoras
              </div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-2xl font-bold text-red-600">
                {scores.filter(s => s.score < 50).length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Deficientes
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Items */}
      <Card className="bg-white dark:bg-gray-900 shadow-lg border-0 ring-1 ring-gray-200 dark:ring-gray-800">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center">
            <Target className="h-6 w-6 mr-2 text-purple-600" />
            Próximos Pasos Recomendados
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {scores
              .filter(s => s.score < 80)
              .sort((a, b) => a.score - b.score)
              .slice(0, 3)
              .map((score, index) => {
                const IconComponent = score.icon;
                return (
                  <div key={score.id} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-white dark:bg-gray-700 rounded-full flex items-center justify-center text-sm font-bold text-gray-600 dark:text-gray-300">
                        {index + 1}
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      <IconComponent className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 dark:text-gray-100">
                        Mejorar {score.title}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Puntuación actual: {score.score}/100
                      </div>
                    </div>
                    <Badge 
                      variant="outline" 
                      className={score.score < 50 ? 'border-red-300 text-red-700' : 'border-orange-300 text-orange-700'}
                    >
                      {score.score < 50 ? 'Crítico' : 'Importante'}
                    </Badge>
                  </div>
                );
              })
            }
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PageSpeedDashboard;