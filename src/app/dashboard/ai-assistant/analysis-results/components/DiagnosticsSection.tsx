'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { IconWrapper } from '@/components/ui/icon-wrapper';
import { AnalysisResults } from '../types';

interface DiagnosticsSectionProps {
  results: AnalysisResults;
}

export default function DiagnosticsSection({ results }: DiagnosticsSectionProps) {
  const { diagnostics } = results;
  return (
    <div className="space-y-6">
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <IconWrapper icon="search" className="h-5 w-5 text-primary" />
          </div>
          Diagnósticos Web3
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Problemas detectados y soluciones recomendadas para optimizar tu DApp
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            <span>Resumen de Diagnósticos</span>
          </CardTitle>
        </CardHeader>
      </Card>
      
      <div className="grid grid-cols-1 gap-6">
        {diagnostics.map((diagnostic, index) => (
          <Card key={index} className={`border-l-4 transition-all hover:shadow-md ${
            diagnostic.severity === 'critical' ? 'border-red-500 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30' :
            diagnostic.severity === 'warning' ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20 hover:bg-yellow-100 dark:hover:bg-yellow-900/30' :
            'border-blue-500 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30'
          }`}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-full ${
                    diagnostic.severity === 'critical' ? 'bg-red-100 dark:bg-red-800' :
                    diagnostic.severity === 'warning' ? 'bg-yellow-100 dark:bg-yellow-800' :
                    'bg-blue-100 dark:bg-blue-800'
                  }`}>
                    {diagnostic.severity === 'critical' ? 
                      <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" /> :
                    diagnostic.severity === 'warning' ? 
                      <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" /> :
                      <CheckCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    }
                  </div>
                  <div>
                    <CardTitle className="text-lg">{diagnostic.title}</CardTitle>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant={diagnostic.severity === 'critical' ? 'destructive' : diagnostic.severity === 'warning' ? 'secondary' : 'default'} className="text-xs">
                        {diagnostic.severity === 'critical' ? 'CRÍTICO' : diagnostic.severity === 'warning' ? 'ADVERTENCIA' : 'INFO'}
                      </Badge>
                      <Badge variant="outline" className="text-xs capitalize">
                        {diagnostic.category ? diagnostic.category.replace('-', ' ') : 'general'}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2 text-red-700 dark:text-red-400">🚨 Problema Detectado</h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300">{diagnostic.description}</p>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2 text-green-700 dark:text-green-400">✅ Solución Recomendada</h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300">{diagnostic.solution}</p>
                </div>
                
                {diagnostic.codeExample && (
                  <div>
                    <h4 className="font-semibold mb-2 text-blue-700 dark:text-blue-400">💻 Ejemplo de Código</h4>
                    <pre className="text-xs bg-gray-900 dark:bg-gray-950 text-green-400 p-4 rounded-md overflow-x-auto border">
                      <code>{diagnostic.codeExample}</code>
                    </pre>
                  </div>
                )}
                
                <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
                  <span className="text-sm text-gray-600 dark:text-gray-400">⏱️ Tiempo estimado de implementación: {diagnostic.severity === 'critical' ? '2-4 horas' : diagnostic.severity === 'warning' ? '1-2 horas' : '30-60 min'}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}