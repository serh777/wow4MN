'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, TrendingUp, Target, Zap } from 'lucide-react';

interface Opportunity {
  id: string;
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  effort: 'high' | 'medium' | 'low';
  category: string;
}

interface OpportunitiesSectionProps {
  opportunities: Opportunity[];
}

const getImpactColor = (impact: string) => {
  switch (impact) {
    case 'high': return 'bg-green-100 text-green-800';
    case 'medium': return 'bg-yellow-100 text-yellow-800';
    case 'low': return 'bg-gray-100 text-gray-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getEffortColor = (effort: string) => {
  switch (effort) {
    case 'high': return 'bg-red-100 text-red-800';
    case 'medium': return 'bg-orange-100 text-orange-800';
    case 'low': return 'bg-green-100 text-green-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export default function OpportunitiesSection({ opportunities }: OpportunitiesSectionProps) {
  if (!opportunities || opportunities.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-yellow-600" />
            Growth Opportunities
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 text-center py-8">No opportunities identified at this time.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-yellow-600" />
          Growth Opportunities
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {opportunities.map((opportunity) => (
          <div key={opportunity.id} className="border rounded-lg p-4 space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900">{opportunity.title}</h4>
                <p className="text-sm text-gray-600 mt-1">{opportunity.description}</p>
              </div>
              <div className="flex flex-col gap-2 ml-4">
                <Badge className={getImpactColor(opportunity.impact)}>
                  Impact: {opportunity.impact}
                </Badge>
                <Badge className={getEffortColor(opportunity.effort)}>
                  Effort: {opportunity.effort}
                </Badge>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-600">{opportunity.category}</span>
            </div>
          </div>
        ))}
        
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-blue-600" />
            <span className="font-semibold text-blue-900">Quick Wins</span>
          </div>
          <p className="text-sm text-blue-800">
            Focus on high-impact, low-effort opportunities first for maximum ROI.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}