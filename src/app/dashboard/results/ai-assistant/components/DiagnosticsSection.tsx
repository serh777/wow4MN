'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle, XCircle, Info } from 'lucide-react';

interface Diagnostic {
  id: string;
  title: string;
  description: string;
  status: 'passed' | 'failed' | 'warning' | 'info';
  category: string;
  recommendation?: string;
}

interface DiagnosticsSectionProps {
  diagnostics: Diagnostic[];
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'passed': return <CheckCircle className="w-4 h-4 text-green-600" />;
    case 'failed': return <XCircle className="w-4 h-4 text-red-600" />;
    case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
    case 'info': return <Info className="w-4 h-4 text-blue-600" />;
    default: return <Info className="w-4 h-4 text-gray-600" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'passed': return 'bg-green-100 text-green-800';
    case 'failed': return 'bg-red-100 text-red-800';
    case 'warning': return 'bg-yellow-100 text-yellow-800';
    case 'info': return 'bg-blue-100 text-blue-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export default function DiagnosticsSection({ diagnostics }: DiagnosticsSectionProps) {
  if (!diagnostics || diagnostics.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
            Diagnostics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 text-center py-8">No diagnostic information available.</p>
        </CardContent>
      </Card>
    );
  }

  const groupedDiagnostics = diagnostics.reduce((acc, diagnostic) => {
    if (!acc[diagnostic.category]) {
      acc[diagnostic.category] = [];
    }
    acc[diagnostic.category].push(diagnostic);
    return acc;
  }, {} as Record<string, Diagnostic[]>);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-orange-600" />
          Diagnostics
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {Object.entries(groupedDiagnostics).map(([category, items]) => (
          <div key={category} className="space-y-3">
            <h4 className="font-semibold text-gray-900 border-b pb-2">{category}</h4>
            <div className="space-y-3">
              {items.map((diagnostic) => (
                <div key={diagnostic.id} className="border rounded-lg p-4 space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      {getStatusIcon(diagnostic.status)}
                      <div className="flex-1">
                        <h5 className="font-medium text-gray-900">{diagnostic.title}</h5>
                        <p className="text-sm text-gray-600 mt-1">{diagnostic.description}</p>
                        {diagnostic.recommendation && (
                          <div className="mt-2 p-2 bg-blue-50 rounded text-sm text-blue-800">
                            <strong>Recommendation:</strong> {diagnostic.recommendation}
                          </div>
                        )}
                      </div>
                    </div>
                    <Badge className={getStatusColor(diagnostic.status)}>
                      {diagnostic.status.toUpperCase()}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}