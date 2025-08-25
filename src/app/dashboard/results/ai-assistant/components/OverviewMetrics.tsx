'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Brain, TrendingUp, Users, Zap } from 'lucide-react';

interface OverviewMetricsProps {
  metrics: {
    totalAnalyses?: number;
    successRate?: number;
    averageScore?: number;
    improvementAreas?: number;
    recommendations?: number;
    insights?: number;
  };
}

const MetricItem = ({ 
  icon: Icon, 
  label, 
  value, 
  color = 'blue' 
}: { 
  icon: any; 
  label: string; 
  value: string | number; 
  color?: string; 
}) => (
  <div className="flex items-center space-x-3">
    <div className={`p-2 rounded-lg bg-${color}-100`}>
      <Icon className={`w-4 h-4 text-${color}-600`} />
    </div>
    <div>
      <p className="text-sm text-gray-600">{label}</p>
      <p className="text-lg font-semibold">{value}</p>
    </div>
  </div>
);

export default function OverviewMetrics({ metrics }: OverviewMetricsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-purple-600" />
          Analysis Overview
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <MetricItem
            icon={Brain}
            label="Total Analyses"
            value={metrics.totalAnalyses || 0}
            color="purple"
          />
          <MetricItem
            icon={TrendingUp}
            label="Success Rate"
            value={`${metrics.successRate || 0}%`}
            color="green"
          />
          <MetricItem
            icon={Zap}
            label="Average Score"
            value={`${metrics.averageScore || 0}/100`}
            color="blue"
          />
        </div>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Analysis Completion</span>
            <span className="text-sm text-gray-600">{metrics.successRate || 0}%</span>
          </div>
          <Progress value={metrics.successRate || 0} className="h-2" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
          <div className="text-center">
            <p className="text-2xl font-bold text-orange-600">{metrics.recommendations || 0}</p>
            <p className="text-sm text-gray-600">Recommendations</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">{metrics.insights || 0}</p>
            <p className="text-sm text-gray-600">Key Insights</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}