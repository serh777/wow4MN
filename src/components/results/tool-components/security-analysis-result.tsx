'use client';

import React, { memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  Shield, ShieldAlert, ShieldCheck, AlertTriangle, 
  Lock, Unlock, Eye, EyeOff, Bug, CheckCircle2
} from 'lucide-react';
import { ToolResult } from '../dynamic-results-renderer';
import GenericAnalysisResult from './generic-analysis-result';

export interface SecurityAnalysisResultProps {
  result: ToolResult;
  onRetry?: () => void;
  variant?: 'card' | 'compact';
}

const SecurityAnalysisResult = memo<SecurityAnalysisResultProps>(function SecurityAnalysisResult({
  result,
  onRetry,
  variant = 'card'
}) {
  // Si no es un análisis de seguridad completado, usar el componente genérico
  if (result.status !== 'completed' || !result.data) {
    return (
      <GenericAnalysisResult 
        result={result} 
        onRetry={onRetry} 
        variant={variant} 
      />
    );
  }

  const securityData = result.data;
  const vulnerabilities = securityData.vulnerabilities || [];
  const securityScore = result.score || 0;
  
  // Clasificar vulnerabilidades por severidad
  const criticalVulns = vulnerabilities.filter((v: any) => v.severity === 'critical');
  const highVulns = vulnerabilities.filter((v: any) => v.severity === 'high');
  const mediumVulns = vulnerabilities.filter((v: any) => v.severity === 'medium');
  const lowVulns = vulnerabilities.filter((v: any) => v.severity === 'low');

  const getSecurityLevel = (score: number) => {
    if (score >= 90) return { level: 'Excelente', color: 'text-green-600', icon: ShieldCheck };
    if (score >= 70) return { level: 'Bueno', color: 'text-blue-600', icon: Shield };
    if (score >= 50) return { level: 'Moderado', color: 'text-yellow-600', icon: ShieldAlert };
    return { level: 'Crítico', color: 'text-red-600', icon: ShieldAlert };
  };

  const securityLevel = getSecurityLevel(securityScore);
  const SecurityIcon = securityLevel.icon;

  if (variant === 'compact') {
    return (
      <Card className="border-red-200 bg-red-50 transition-all hover:shadow-md">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <SecurityIcon className={`h-5 w-5 ${securityLevel.color}`} />
              <div>
                <h3 className="font-medium text-gray-900">Análisis de Seguridad</h3>
                <p className="text-sm text-gray-600">
                  {criticalVulns.length + highVulns.length} vulnerabilidades críticas/altas
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Badge variant="outline" className={securityLevel.color}>
                {Math.round(securityScore)}/100
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-red-200 bg-red-50 transition-all hover:shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-white shadow-sm">
              <SecurityIcon className={`h-6 w-6 ${securityLevel.color}`} />
            </div>
            <div>
              <CardTitle className="text-lg">Análisis de Seguridad</CardTitle>
              <p className="text-sm text-gray-600">
                Ejecutado el {new Date(result.timestamp).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={securityLevel.color}>
              {securityLevel.level}
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Puntuación de seguridad */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Puntuación de Seguridad</span>
            <span className={`text-lg font-bold ${securityLevel.color}`}>
              {Math.round(securityScore)}/100
            </span>
          </div>
          <Progress 
            value={securityScore} 
            className="h-2" 
            // @ts-ignore
            indicatorClassName={securityScore >= 70 ? 'bg-green-500' : securityScore >= 50 ? 'bg-yellow-500' : 'bg-red-500'}
          />
        </div>
        
        <Separator />
        
        {/* Resumen de vulnerabilidades */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
            <Bug className="h-4 w-4" />
            Resumen de Vulnerabilidades
          </h4>
          
          <div className="grid grid-cols-2 gap-3">
            <VulnerabilityCard 
              label="Críticas" 
              count={criticalVulns.length} 
              color="bg-red-100 text-red-800 border-red-200"
              icon={AlertTriangle}
            />
            <VulnerabilityCard 
              label="Altas" 
              count={highVulns.length} 
              color="bg-orange-100 text-orange-800 border-orange-200"
              icon={ShieldAlert}
            />
            <VulnerabilityCard 
              label="Medias" 
              count={mediumVulns.length} 
              color="bg-yellow-100 text-yellow-800 border-yellow-200"
              icon={Shield}
            />
            <VulnerabilityCard 
              label="Bajas" 
              count={lowVulns.length} 
              color="bg-blue-100 text-blue-800 border-blue-200"
              icon={ShieldCheck}
            />
          </div>
        </div>
        
        {/* Vulnerabilidades críticas y altas */}
        {(criticalVulns.length > 0 || highVulns.length > 0) && (
          <>
            <Separator />
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                Vulnerabilidades Prioritarias
              </h4>
              
              <div className="space-y-2">
                {[...criticalVulns, ...highVulns].slice(0, 5).map((vuln: any, index: number) => (
                  <VulnerabilityItem key={index} vulnerability={vuln} />
                ))}
                
                {(criticalVulns.length + highVulns.length) > 5 && (
                  <p className="text-xs text-gray-500 mt-2">
                    +{(criticalVulns.length + highVulns.length) - 5} vulnerabilidades adicionales
                  </p>
                )}
              </div>
            </div>
          </>
        )}
        
        {/* Características de seguridad */}
        {securityData.securityFeatures && (
          <>
            <Separator />
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
                <Lock className="h-4 w-4" />
                Características de Seguridad
              </h4>
              
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(securityData.securityFeatures).map(([feature, enabled]: [string, any]) => (
                  <SecurityFeature key={feature} feature={feature} enabled={enabled} />
                ))}
              </div>
            </div>
          </>
        )}
        
        {/* Recomendaciones de seguridad */}
        {result.recommendations && result.recommendations.length > 0 && (
          <>
            <Separator />
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                Recomendaciones de Seguridad
              </h4>
              
              <ul className="space-y-2">
                {result.recommendations.slice(0, 4).map((recommendation, index) => (
                  <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                    {recommendation}
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
});

// Componente para mostrar tarjetas de vulnerabilidades
const VulnerabilityCard = memo<{
  label: string;
  count: number;
  color: string;
  icon: React.ComponentType<any>;
}>(function VulnerabilityCard({ label, count, color, icon: Icon }) {
  return (
    <div className={`p-3 rounded-lg border ${color}`}>
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4" />
        <span className="text-xs font-medium uppercase tracking-wide">{label}</span>
      </div>
      <div className="text-lg font-bold mt-1">{count}</div>
    </div>
  );
});

// Componente para mostrar vulnerabilidades individuales
const VulnerabilityItem = memo<{
  vulnerability: any;
}>(function VulnerabilityItem({ vulnerability }) {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="p-3 bg-white rounded-lg border border-gray-200">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Badge className={`text-xs ${getSeverityColor(vulnerability.severity)}`}>
              {vulnerability.severity?.toUpperCase()}
            </Badge>
            <span className="text-sm font-medium text-gray-900">
              {vulnerability.title || vulnerability.name}
            </span>
          </div>
          <p className="text-xs text-gray-600">
            {vulnerability.description || 'Sin descripción disponible'}
          </p>
        </div>
      </div>
    </div>
  );
});

// Componente para mostrar características de seguridad
const SecurityFeature = memo<{
  feature: string;
  enabled: boolean;
}>(function SecurityFeature({ feature, enabled }) {
  const formatFeatureName = (name: string) => {
    return name
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim();
  };

  return (
    <div className="flex items-center gap-2 p-2 bg-white rounded border border-gray-100">
      {enabled ? (
        <Lock className="h-3 w-3 text-green-600" />
      ) : (
        <Unlock className="h-3 w-3 text-red-600" />
      )}
      <span className={`text-xs ${enabled ? 'text-green-700' : 'text-red-700'}`}>
        {formatFeatureName(feature)}
      </span>
    </div>
  );
});

export default SecurityAnalysisResult;