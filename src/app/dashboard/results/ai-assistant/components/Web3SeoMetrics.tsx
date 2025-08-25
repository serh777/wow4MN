'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Globe, Search, Link, TrendingUp, Users, Zap } from 'lucide-react';

interface Web3SeoMetricsProps {
  metrics: {
    domainAuthority?: number;
    pageAuthority?: number;
    backlinks?: number;
    referringDomains?: number;
    organicKeywords?: number;
    organicTraffic?: number;
    technicalScore?: number;
    contentScore?: number;
    userExperience?: number;
  };
  trends?: {
    trafficChange?: number;
    keywordChange?: number;
    backlinkChange?: number;
  };
}

const MetricCard = ({ 
  icon: Icon, 
  title, 
  value, 
  change, 
  color = 'blue' 
}: { 
  icon: any; 
  title: string; 
  value: string | number; 
  change?: number; 
  color?: string; 
}) => {
  const getChangeColor = (change: number) => {
    if (change > 0) return 'text-green-600';
    if (change < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  return (
    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
      <div className={`p-2 rounded-lg bg-${color}-100`}>
        <Icon className={`w-4 h-4 text-${color}-600`} />
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-900">{title}</p>
        <div className="flex items-center space-x-2">
          <span className="text-lg font-semibold">{value}</span>
          {change !== undefined && (
            <span className={`text-xs ${getChangeColor(change)}`}>
              {change > 0 ? '+' : ''}{change}%
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

const ScoreBar = ({ label, score, color = 'blue' }: { label: string; score: number; color?: string }) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'green';
    if (score >= 60) return 'yellow';
    return 'red';
  };

  const scoreColor = getScoreColor(score);

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className="text-sm font-semibold">{score}/100</span>
      </div>
      <Progress value={score} className="h-2" />
    </div>
  );
};

export default function Web3SeoMetrics({ metrics, trends }: Web3SeoMetricsProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-blue-600" />
            Web3 SEO Metrics
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Authority Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <MetricCard
              icon={Search}
              title="Domain Authority"
              value={metrics.domainAuthority || 0}
              change={trends?.trafficChange}
              color="blue"
            />
            <MetricCard
              icon={Link}
              title="Page Authority"
              value={metrics.pageAuthority || 0}
              color="green"
            />
          </div>

          {/* Link Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <MetricCard
              icon={Link}
              title="Total Backlinks"
              value={metrics.backlinks?.toLocaleString() || '0'}
              change={trends?.backlinkChange}
              color="purple"
            />
            <MetricCard
              icon={Globe}
              title="Referring Domains"
              value={metrics.referringDomains?.toLocaleString() || '0'}
              color="indigo"
            />
          </div>

          {/* Traffic Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <MetricCard
              icon={TrendingUp}
              title="Organic Keywords"
              value={metrics.organicKeywords?.toLocaleString() || '0'}
              change={trends?.keywordChange}
              color="yellow"
            />
            <MetricCard
              icon={Users}
              title="Organic Traffic"
              value={metrics.organicTraffic?.toLocaleString() || '0'}
              change={trends?.trafficChange}
              color="green"
            />
          </div>

          {/* Score Metrics */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900">Performance Scores</h4>
            <div className="space-y-3">
              <ScoreBar 
                label="Technical SEO" 
                score={metrics.technicalScore || 0} 
              />
              <ScoreBar 
                label="Content Quality" 
                score={metrics.contentScore || 0} 
              />
              <ScoreBar 
                label="User Experience" 
                score={metrics.userExperience || 0} 
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}