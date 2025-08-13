'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Icons } from '@/components/icons';
import { ProgressOverlay } from '@/components/ui/progress-overlay';

// Componente IconWrapper
const IconWrapper = ({ icon, className }: { icon: keyof typeof Icons, className?: string }) => {
  const Icon = Icons[icon] || Icons.settings;
  return <Icon className={className} />;
};

interface OverallScoreCardProps {
  score: number;
  previousScore?: number;
  category: string;
  description: string;
}

export default function OverallScoreCard({ 
  score, 
  previousScore, 
  category, 
  description 
}: OverallScoreCardProps) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setAnimatedScore(prev => {
        const increment = Math.ceil((score - prev) / 10);
        const newScore = prev + increment;
        
        if (newScore >= score) {
          setIsAnimating(false);
          clearInterval(timer);
          return score;
        }
        return newScore;
      });
    }, 50);

    return () => clearInterval(timer);
  }, [score]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 dark:text-green-400';
    if (score >= 60) return 'text-yellow-600 dark:text-yellow-400';
    if (score >= 40) return 'text-orange-600 dark:text-orange-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getScoreGrade = (score: number) => {
    if (score >= 90) return { grade: 'A+', color: 'bg-green-500' };
    if (score >= 80) return { grade: 'A', color: 'bg-green-500' };
    if (score >= 70) return { grade: 'B+', color: 'bg-blue-500' };
    if (score >= 60) return { grade: 'B', color: 'bg-blue-500' };
    if (score >= 50) return { grade: 'C+', color: 'bg-yellow-500' };
    if (score >= 40) return { grade: 'C', color: 'bg-yellow-500' };
    if (score >= 30) return { grade: 'D', color: 'bg-orange-500' };
    return { grade: 'F', color: 'bg-red-500' };
  };

  const getProgressColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    if (score >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const scoreGrade = getScoreGrade(score);
  const improvement = previousScore ? score - previousScore : 0;

  return (
    <Card className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-indigo-100/50 dark:from-blue-950/20 dark:to-indigo-950/20" />
      <CardHeader className="relative">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Puntuación General</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          <Badge 
            className={`${scoreGrade.color} text-white font-bold text-lg px-3 py-1`}
          >
            {scoreGrade.grade}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="relative space-y-6">
        <div className="text-center">
          <div className={`text-6xl font-bold ${getScoreColor(score)} ${isAnimating ? 'animate-pulse' : ''}`}>
            {animatedScore}
            <span className="text-2xl text-muted-foreground">/100</span>
          </div>
          <div className="text-sm text-muted-foreground mt-1">
            Categoría: {category}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progreso</span>
            <span className="font-medium">{animatedScore}%</span>
          </div>
          <div className="relative">
            <Progress value={animatedScore} className="h-3" />
            <ProgressOverlay 
              width={animatedScore}
              colorClass={getProgressColor(score)}
              size="large"
            />
          </div>
        </div>

        {previousScore && (
          <div className="flex items-center justify-center gap-2 p-3 rounded-lg bg-muted/50">
            <IconWrapper 
              icon={improvement >= 0 ? "trendingUp" : "trendingDown"} 
              className={`h-4 w-4 ${
                improvement >= 0 ? 'text-green-600' : 'text-red-600'
              }`} 
            />
            <span className="text-sm">
              {improvement >= 0 ? '+' : ''}{improvement} puntos desde el último análisis
            </span>
          </div>
        )}

        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="space-y-1">
            <div className="text-2xl font-bold text-green-600">
              {Math.floor(score * 0.8)}
            </div>
            <div className="text-xs text-muted-foreground">Metadatos</div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold text-blue-600">
              {Math.floor(score * 0.9)}
            </div>
            <div className="text-xs text-muted-foreground">Estructura</div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold text-purple-600">
              {Math.floor(score * 0.7)}
            </div>
            <div className="text-xs text-muted-foreground">SEO Web3</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}