'use client';

import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { SecurityAnalysisData } from './security-analysis-form';
import { SecurityAnalysisResults, SecurityVulnerability, SecurityRecommendation } from './security-analysis-results';

export function useSecurityAnalysis() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SecurityAnalysisResults | null>(null);
  const { toast } = useToast();

  const generateMockVulnerabilities = (analysisType: string, securityChecks: string[]): SecurityVulnerability[] => {
    const vulnerabilities: SecurityVulnerability[] = [];
    
    // Generar vulnerabilidades basadas en las verificaciones seleccionadas
    if (securityChecks.includes('smart_contract_audit')) {
      if (Math.random() > 0.7) {
        vulnerabilities.push({
          id: 'contract_001',
          title: 'Función sin modificador de acceso',
          description: 'Se detectó una función crítica sin restricciones de acceso apropiadas.',
          severity: 'high',
          category: 'Control de Acceso',
          impact: 'Usuarios no autorizados podrían ejecutar funciones administrativas.',
          remediation: 'Agregar modificadores onlyOwner o roles específicos a las funciones críticas.'
        });
      }
    }

    if (securityChecks.includes('reentrancy_check')) {
      if (Math.random() > 0.8) {
        vulnerabilities.push({
          id: 'reentrancy_001',
          title: 'Vulnerabilidad de Reentrancy detectada',
          description: 'Patrón de reentrancy encontrado en función de retiro.',
          severity: 'critical',
          category: 'Reentrancy',
          impact: 'Atacantes podrían drenar fondos del contrato.',
          remediation: 'Implementar patrón checks-effects-interactions y usar ReentrancyGuard.'
        });
      }
    }

    if (securityChecks.includes('overflow_underflow')) {
      if (Math.random() > 0.9) {
        vulnerabilities.push({
          id: 'overflow_001',
          title: 'Posible overflow en cálculos',
          description: 'Operaciones aritméticas sin protección SafeMath.',
          severity: 'medium',
          category: 'Overflow/Underflow',
          impact: 'Cálculos incorrectos que podrían afectar la lógica del contrato.',
          remediation: 'Usar SafeMath o Solidity 0.8+ con verificaciones automáticas.'
        });
      }
    }

    if (securityChecks.includes('wallet_security')) {
      if (Math.random() > 0.6) {
        vulnerabilities.push({
          id: 'wallet_001',
          title: 'Interacciones con contratos de riesgo',
          description: 'La wallet ha interactuado con contratos marcados como riesgosos.',
          severity: 'medium',
          category: 'Seguridad de Wallet',
          impact: 'Posible exposición a contratos maliciosos.',
          remediation: 'Revisar y evitar interacciones con contratos no verificados.'
        });
      }
    }

    if (securityChecks.includes('frontend_security')) {
      if (Math.random() > 0.5) {
        vulnerabilities.push({
          id: 'frontend_001',
          title: 'Falta de Content Security Policy',
          description: 'El sitio web no implementa CSP adecuadas.',
          severity: 'low',
          category: 'Seguridad Frontend',
          impact: 'Vulnerabilidad a ataques XSS.',
          remediation: 'Implementar Content Security Policy restrictivas.'
        });
      }
    }

    return vulnerabilities;
  };

  const generateMockRecommendations = (analysisType: string): SecurityRecommendation[] => {
    const recommendations: SecurityRecommendation[] = [
      {
        id: 'rec_001',
        title: 'Implementar Auditorías Regulares',
        description: 'Realizar auditorías de seguridad periódicas del código.',
        priority: 'high',
        category: 'Mejores Prácticas',
        implementation: 'Programar auditorías trimestrales con firmas especializadas.'
      },
      {
        id: 'rec_002',
        title: 'Configurar Monitoreo de Transacciones',
        description: 'Implementar alertas para transacciones sospechosas.',
        priority: 'medium',
        category: 'Monitoreo',
        implementation: 'Usar servicios como Forta o desarrollar sistema propio.'
      },
      {
        id: 'rec_003',
        title: 'Documentación de Seguridad',
        description: 'Mantener documentación actualizada de medidas de seguridad.',
        priority: 'low',
        category: 'Documentación',
        implementation: 'Crear y mantener un manual de seguridad interno.'
      }
    ];

    if (analysisType === 'contract' || analysisType === 'comprehensive') {
      recommendations.push({
        id: 'rec_004',
        title: 'Implementar Timelock para Cambios Críticos',
        description: 'Agregar delays para cambios administrativos importantes.',
        priority: 'high',
        category: 'Gobernanza',
        implementation: 'Usar OpenZeppelin TimelockController con delay de 24-48 horas.'
      });
    }

    return recommendations;
  };

  const calculateOverallScore = (vulnerabilities: SecurityVulnerability[]): number => {
    let score = 100;
    
    vulnerabilities.forEach(vuln => {
      switch (vuln.severity) {
        case 'critical':
          score -= 25;
          break;
        case 'high':
          score -= 15;
          break;
        case 'medium':
          score -= 8;
          break;
        case 'low':
          score -= 3;
          break;
      }
    });

    return Math.max(0, score);
  };

  const determineRiskLevel = (score: number): 'low' | 'medium' | 'high' | 'critical' => {
    if (score >= 80) return 'low';
    if (score >= 60) return 'medium';
    if (score >= 40) return 'high';
    return 'critical';
  };

  const handleSubmit = async (data: SecurityAnalysisData) => {
    setLoading(true);
    
    try {
      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const vulnerabilities = generateMockVulnerabilities(data.analysisType, data.securityChecks);
      const recommendations = generateMockRecommendations(data.analysisType);
      const overallScore = calculateOverallScore(vulnerabilities);
      const riskLevel = determineRiskLevel(overallScore);

      const mockResults: SecurityAnalysisResults = {
        overallScore,
        riskLevel,
        vulnerabilities,
        recommendations,
        timestamp: new Date().toISOString(),
        // Generar análisis específicos basados en el tipo
        ...(data.analysisType === 'contract' || data.analysisType === 'comprehensive') && {
          contractAnalysis: {
            accessControl: {
              score: Math.floor(Math.random() * 30) + 70,
              issues: vulnerabilities.some(v => v.category === 'Control de Acceso') 
                ? ['Función administrativa sin restricciones', 'Roles no implementados correctamente']
                : []
            },
            reentrancy: {
              score: vulnerabilities.some(v => v.category === 'Reentrancy') ? 45 : 95,
              vulnerabilities: vulnerabilities.some(v => v.category === 'Reentrancy')
                ? ['Función withdraw vulnerable', 'Patrón CEI no implementado']
                : []
            },
            overflowProtection: {
              score: Math.floor(Math.random() * 20) + 80,
              status: 'SafeMath implementado correctamente'
            },
            gasOptimization: {
              score: Math.floor(Math.random() * 25) + 75,
              suggestions: ['Optimizar loops', 'Usar packed structs', 'Reducir storage reads']
            }
          }
        },
        ...(data.analysisType === 'wallet' || data.analysisType === 'comprehensive') && {
          walletAnalysis: {
            transactionPatterns: {
              score: Math.floor(Math.random() * 30) + 70,
              suspiciousActivity: []
            },
            balanceRisk: {
              score: Math.floor(Math.random() * 20) + 80,
              riskFactors: ['Concentración en pocos tokens']
            },
            interactionHistory: {
              score: vulnerabilities.some(v => v.category === 'Seguridad de Wallet') ? 65 : 85,
              riskyContracts: vulnerabilities.some(v => v.category === 'Seguridad de Wallet')
                ? ['0x1234...abcd (No verificado)', '0x5678...efgh (Reportado como riesgoso)']
                : []
            }
          }
        },
        ...(data.analysisType === 'website' || data.analysisType === 'comprehensive') && {
          websiteAnalysis: {
            sslSecurity: {
              score: Math.floor(Math.random() * 15) + 85,
              issues: []
            },
            contentSecurity: {
              score: vulnerabilities.some(v => v.category === 'Seguridad Frontend') ? 70 : 90,
              vulnerabilities: vulnerabilities.some(v => v.category === 'Seguridad Frontend')
                ? ['CSP no configurado', 'Headers de seguridad faltantes']
                : []
            },
            privacyCompliance: {
              score: Math.floor(Math.random() * 20) + 80,
              gaps: ['Política de privacidad desactualizada']
            }
          }
        }
      };

      setResults(mockResults);
      
      toast({
        title: 'Análisis de seguridad completado',
        description: `Se encontraron ${vulnerabilities.length} vulnerabilidades. Puntuación: ${overallScore}/100`,
        variant: riskLevel === 'critical' || riskLevel === 'high' ? 'destructive' : 'default'
      });
      
    } catch (error) {
      console.error('Error en análisis de seguridad:', error);
      toast({
        title: 'Error en el análisis',
        description: 'No se pudo completar el análisis de seguridad. Inténtalo de nuevo.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    results,
    handleSubmit
  };
}