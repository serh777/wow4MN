'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CircularProgress } from '@/components/ui/circular-progress';
import { Brain, TrendingUp, AlertTriangle } from 'lucide-react';

interface OverallScoreCardProps {
  score: number;
  status: 'excellent' | 'good' | 'needs-improvement' | 'poor';
  insights?: string[];
  recommendations?: string[];
}

const getScoreColor = (score: number): 'green' | 'yellow' | 'red' => {
  if (score >= 80) return 'green';
  if (score >= 60) return 'yellow';
  return 'red';
};

const getStatusBadge = (status: string) => {
  const statusConfig = {
    'excellent': { color: 'bg-green-100 text-green-800', icon: TrendingUp },
    'good': { color: 'bg-blue-100 text-blue-800', icon: TrendingUp },
    'needs-improvement': { color: 'bg-yellow-100 text-yellow-800', icon: AlertTriangle },
    'poor': { color: 'bg-red-100 text-red-800', icon: AlertTriangle }
  };
  
  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig['needs-improvement'];
  const Icon = config.icon;
  
  return (
    <Badge className={config.color}>
      <Icon className="w-3 h-3 mr-1" />
      {status.replace('-', ' ').toUpperCase()}
    </Badge>
  );
};

export default function OverallScoreCard({ 
  score, 
  status, 
  insights = [], 
  recommendations = [] 
}: OverallScoreCardProps) {
  return (
    <Card className="border-2">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-600" />
            <CardTitle className="text-lg">AI Assistant Analysis</CardTitle>
          </div>
          {getStatusBadge(status)}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-center">
          <CircularProgress
            value={score}
            size={120}
            strokeWidth={8}
            color={getScoreColor(score)}
            label="Overall Score"
            showValue={true}
          />
        </div>
        
        {insights.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-semibold text-sm text-gray-700">Key Insights</h4>
            <ul className="space-y-1">
              {insights.slice(0, 3).map((insight, index) => (
                <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0" />
                  {insight}
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {recommendations.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-semibold text-sm text-gray-700">Recommendations</h4>
            <ul className="space-y-1">
              {recommendations.slice(0, 2).map((recommendation, index) => (
                <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                  {recommendation}
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}