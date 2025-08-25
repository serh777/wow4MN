'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Target, TrendingUp } from 'lucide-react';
import { ContentAnalysisResults } from '../types';
import { CircularProgress } from '@/components/ui/circular-progress';



interface OverallScoreCardProps {
  results: ContentAnalysisResults;
  getAnalysisTypeLabel: (type: string) => string;
}

export default function OverallScoreCard({
  results,
  getAnalysisTypeLabel
}: OverallScoreCardProps) {
  const getQualityColor = (quality: string) => {
    switch (quality) {
      case 'excellent': return 'bg-green-100 text-green-800 border-green-200';
      case 'good': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'fair': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'poor': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getQualityIcon = (quality: string) => {
    switch (quality) {
      case 'excellent': return <TrendingUp className="h-4 w-4" />;
      case 'good': return <Target className="h-4 w-4" />;
      case 'fair': return <FileText className="h-4 w-4" />;
      case 'poor': return <FileText className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getQualityLabel = (quality: string) => {
    switch (quality) {
      case 'excellent': return 'Excelente';
      case 'good': return 'Bueno';
      case 'fair': return 'Regular';
      case 'poor': return 'Deficiente';
      default: return 'Sin evaluar';
    }
  };

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800">
      <CardHeader className="text-center pb-2">
        <div className="flex items-center justify-center space-x-2 mb-2">
          <FileText className="h-6 w-6 text-blue-600" />
          <CardTitle className="text-xl font-bold text-blue-900 dark:text-blue-100">
            Puntuación General de Contenido
          </CardTitle>
        </div>
        <CardContent className="pt-0">
          <div className="flex flex-col items-center space-y-4">
            <CircularProgress 
              value={results.overallScore} 
              size={140}
              color={results.overallScore >= 80 ? 'green' : results.overallScore >= 60 ? 'yellow' : 'red'}
              label="Contenido"
              className="mb-4"
            />
            
            <div className="text-center space-y-2">
              <Badge 
                variant="outline" 
                className={`${getQualityColor(results.contentQuality)} font-medium px-3 py-1`}
              >
                <span className="flex items-center space-x-1">
                  {getQualityIcon(results.contentQuality)}
                  <span>{getQualityLabel(results.contentQuality)}</span>
                </span>
              </Badge>
              
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {getAnalysisTypeLabel(results.analysisType)}
              </div>
              
              <div className="text-xs text-gray-500 dark:text-gray-500">
                Análisis de: {results.url}
              </div>
            </div>
          </div>
        </CardContent>
      </CardHeader>
    </Card>
  );
}