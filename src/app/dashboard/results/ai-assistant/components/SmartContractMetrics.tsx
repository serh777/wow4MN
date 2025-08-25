'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Code, Shield, Zap, AlertTriangle } from 'lucide-react';

interface SmartContractMetricsProps {
  metrics: {
    contractsAnalyzed?: number;
    securityScore?: number;
    gasOptimization?: number;
    codeQuality?: number;
    vulnerabilities?: number;
    recommendations?: string[];
  };
}

export default function SmartContractMetrics({ metrics }: SmartContractMetricsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Code className="w-5 h-5 text-blue-600" />
          Smart Contract Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="p-2 rounded-lg bg-blue-100">
              <Code className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Contracts Analyzed</p>
              <p className="text-lg font-semibold">{metrics.contractsAnalyzed || 0}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="p-2 rounded-lg bg-red-100">
              <AlertTriangle className="w-4 h-4 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Vulnerabilities</p>
              <p className="text-lg font-semibold">{metrics.vulnerabilities || 0}</p>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Security Score</span>
              <span className="text-sm font-semibold">{metrics.securityScore || 0}/100</span>
            </div>
            <Progress value={metrics.securityScore || 0} className="h-2" />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Gas Optimization</span>
              <span className="text-sm font-semibold">{metrics.gasOptimization || 0}/100</span>
            </div>
            <Progress value={metrics.gasOptimization || 0} className="h-2" />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Code Quality</span>
              <span className="text-sm font-semibold">{metrics.codeQuality || 0}/100</span>
            </div>
            <Progress value={metrics.codeQuality || 0} className="h-2" />
          </div>
        </div>
        
        {metrics.recommendations && metrics.recommendations.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-semibold text-sm text-gray-700">Recommendations</h4>
            <ul className="space-y-1">
              {metrics.recommendations.slice(0, 3).map((rec, index) => (
                <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                  {rec}
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}