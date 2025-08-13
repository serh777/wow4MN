'use client';

import * as React from 'react';

interface SmartContractIssuesProps {
  issues: Array<{
    type: string;
    severity: 'high' | 'medium' | 'low';
    description: string;
    recommendation: string;
  }>;
}

export function SmartContractIssues({ issues }: SmartContractIssuesProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Problemas Detectados</h3>
      <div className="space-y-3">
        {issues.map((issue, index) => (
          <div key={index} className="rounded-lg border p-4">
            <div className="flex items-start gap-3">
              <div className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-medium ${
                issue.severity === 'high' ? 'bg-red-100 text-red-800' :
                issue.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-blue-100 text-blue-800'
              }`}>
                {issue.severity === 'high' ? 'A' :
                 issue.severity === 'medium' ? 'B' : 'C'}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{issue.description}</h4>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    issue.type === 'naming' ? 'bg-purple-100 text-purple-800' :
                    issue.type === 'documentation' ? 'bg-blue-100 text-blue-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {issue.type}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{issue.recommendation}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}