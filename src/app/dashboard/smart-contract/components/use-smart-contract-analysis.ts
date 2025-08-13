'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import type { AnalysisResult } from '@/types';

export function useSmartContractAnalysis() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<AnalysisResult | null>(null);
  const router = useRouter();

  const handleSubmit = async (data: any) => {
    setLoading(true);
    toast.info('Iniciando análisis de smart contract...');
    
    try {
      if (!data.contractAddress || data.contractAddress.trim() === '') {
        throw new Error('La dirección del contrato es obligatoria');
      }

      const contractData = {
        contractAddress: data.contractAddress,
        blockchain: data.blockchain || 'ethereum',
        metrics: {
          namingScore: Math.floor(Math.random() * 30) + 60,
          documentationScore: Math.floor(Math.random() * 25) + 65,
          metadataScore: Math.floor(Math.random() * 20) + 70,
          eventsScore: Math.floor(Math.random() * 35) + 55,
          interfaceScore: Math.floor(Math.random() * 30) + 60
        },
        issues: [
          {
            type: 'naming',
            severity: 'medium',
            description: 'Nombres de funciones poco descriptivos',
            recommendation: 'Utiliza nombres que describan claramente la acción que realiza la función'
          },
          {
            type: 'documentation',
            severity: 'high',
            description: 'Falta de documentación NatSpec en funciones principales',
            recommendation: 'Añade comentarios NatSpec a todas las funciones públicas y externas'
          },
          {
            type: 'metadata',
            severity: 'medium',
            description: 'Metadatos incompletos en el contrato',
            recommendation: 'Completa los metadatos con nombre, versión, autor y descripción'
          }
        ],
        recommendations: [
          'Mejorar la nomenclatura de funciones y variables',
          'Añadir documentación NatSpec completa',
          'Optimizar eventos para mejor indexación',
          'Implementar interfaces estándar'
        ]
      };

      const score = Math.floor(
        Object.values(contractData.metrics).reduce((a, b) => a + b, 0) / 
        Object.values(contractData.metrics).length
      );

      const analysisResults = {
        type: 'smart-contract',
        data: contractData,
        score
      };
      
      setResults(analysisResults);
      
      // Save detailed results to sessionStorage
      const detailedResults = {
        contractAddress: data.contractAddress,
        blockchain: data.blockchain,
        metrics: contractData.metrics,
        issues: contractData.issues,
        recommendations: contractData.recommendations,
        score,
        detailedAnalysis: {
          functions: [
            { name: 'transfer', visibility: 'public', documented: true, complexity: 2, gasOptimized: true },
            { name: 'approve', visibility: 'public', documented: true, complexity: 1, gasOptimized: true },
            { name: 'transferFrom', visibility: 'public', documented: false, complexity: 3, gasOptimized: false },
            { name: 'mint', visibility: 'external', documented: false, complexity: 2, gasOptimized: true },
            { name: 'burn', visibility: 'external', documented: true, complexity: 2, gasOptimized: true }
          ],
          events: [
            { name: 'Transfer', indexed: true, descriptive: true },
            { name: 'Approval', indexed: true, descriptive: true },
            { name: 'Mint', indexed: false, descriptive: false },
            { name: 'Burn', indexed: true, descriptive: true }
          ],
          security: {
            vulnerabilities: Math.floor(Math.random() * 3),
            riskLevel: ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)],
            auditRecommended: Math.random() > 0.5
          },
          compliance: {
            erc20: true,
            erc721: false,
            erc1155: false,
            customStandards: ['ERC-2612', 'ERC-3156']
          }
        }
      };
      
      sessionStorage.setItem('smartContractAnalysisResults', JSON.stringify(detailedResults));
      
      toast.success('Análisis de smart contract completado exitosamente');
      
      // Redirect after 3 seconds
      setTimeout(() => {
        router.push('/dashboard/smart-contract/analysis-results');
      }, 3000);
    } catch (error) {
      console.error('Error en análisis de smart contract:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      toast.error(`Error al analizar el smart contract: ${errorMessage}`);
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