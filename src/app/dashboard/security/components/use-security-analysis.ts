'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAnalysisNotifications } from '@/components/notifications/use-analysis-notifications';
import { SecurityAPIsService } from '@/services/apis/security-apis';
import { EtherscanService } from '@/services/apis/etherscan';
import { AnthropicService } from '@/services/apis/anthropic';
import { extractDomainFromUrl } from '@/app/dashboard/keywords/components/real-keywords-helpers';
import { SecurityAnalysisData } from './security-analysis-form';
import { generateContractSecurityResults, generateWebSecurityResults } from './real-security-helpers';

export function useSecurityAnalysis() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const router = useRouter();
  const { notifyAnalysisStarted, notifyAnalysisCompleted, notifyAnalysisError } = useAnalysisNotifications();

  const handleSubmit = async (data: SecurityAnalysisData) => {
    setLoading(true);
    notifyAnalysisStarted('Auditoría de Seguridad');
    
    try {
      if (!data.contractAddress || data.contractAddress.trim() === '') {
        throw new Error('La dirección del contrato o URL es obligatoria');
      }

      // Determinar si es una URL o dirección de contrato
      const isUrl = data.contractAddress.startsWith('http');
      let securityResults;

      if (isUrl) {
        // Análisis de seguridad web
        const url = data.contractAddress;
        const domain = extractDomainFromUrl(url);
        
        // Obtener análisis de seguridad web
        const webSecurityData = await SecurityAPIsService.analyzeWebSecurity(url);
        
        securityResults = generateWebSecurityResults(
          url,
          webSecurityData,
          data.analysisType,
          data.securityChecks
        );
      } else {
        // Análisis de seguridad de contrato blockchain
        const contractAddress = data.contractAddress;
        
        // Obtener información del contrato desde Etherscan
        const contractInfo = await EtherscanService.getContractInfo(contractAddress);
        const sourceCode = contractInfo?.sourceCode || '';
        
        // Realizar análisis de seguridad del contrato
        const [securityAudit, knownVulns, complianceData] = await Promise.all([
          SecurityAPIsService.analyzeContractSecurity(contractAddress, sourceCode),
          SecurityAPIsService.checkKnownVulnerabilities(contractAddress),
          SecurityAPIsService.analyzeCompliance(contractAddress, sourceCode)
        ]);

        // Análisis adicional con IA si está habilitado
        let aiAnalysis = null;
        if (data.securityChecks.includes('ai_analysis') && sourceCode) {
          aiAnalysis = await AnthropicService.analyzeContractSecurity(contractAddress, sourceCode);
        }

        securityResults = generateContractSecurityResults(
          contractAddress,
          contractInfo,
          securityAudit,
          knownVulns,
          complianceData,
          aiAnalysis,
          data.analysisType,
          data.securityChecks
        );
      }

      setResults(securityResults);
      
      // Guardar en sessionStorage para la página de resultados
      sessionStorage.setItem('securityAnalysisResults', JSON.stringify(securityResults));
      
      notifyAnalysisCompleted('Auditoría de Seguridad');
      
      // Redirigir a resultados después de 3 segundos
      setTimeout(() => {
        const targetValue = isUrl ? extractDomainFromUrl(data.contractAddress || '') : (data.contractAddress || '');
        const params = new URLSearchParams({
          type: isUrl ? 'web' : 'contract',
          target: targetValue,
          analysisType: data.analysisType,
          checks: data.securityChecks.join(',')
        });
        router.push(`/dashboard/results/security?${params.toString()}`);
      }, 3000);
      
    } catch (error) {
      console.error('Error en análisis de seguridad:', error);
      notifyAnalysisError('Auditoría de Seguridad', 'Error en el análisis de seguridad');
      setResults(null);
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

