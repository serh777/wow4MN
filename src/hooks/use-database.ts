import { useState, useEffect, useCallback } from 'react';
import { DatabaseService } from '../services/database-service';
import { Database } from '../lib/database.types';

// Tipos para compatibilidad
type MetadataAnalysis = Database['public']['Tables']['metadata_analysis']['Row'];
type ContentAudit = Database['public']['Tables']['content_audit']['Row'];
type KeywordAnalysis = Database['public']['Tables']['keyword_analysis']['Row'];
type LinkVerification = Database['public']['Tables']['link_verification']['Row'];
type PerformanceAnalysis = Database['public']['Tables']['performance_analysis']['Row'];
type CompetitionAnalysis = Database['public']['Tables']['competition_analysis']['Row'];
type BlockchainAnalysis = Database['public']['Tables']['blockchain_analysis']['Row'];
type AIAssistantDashboard = Database['public']['Tables']['ai_assistant_dashboard']['Row'];
type SocialWeb3Analysis = Database['public']['Tables']['social_web3_analysis']['Row'];
type ToolPayment = Database['public']['Tables']['tool_payments']['Row'];
type UserSettings = Database['public']['Tables']['user_settings']['Row'];
type ToolActionHistory = Database['public']['Tables']['tool_action_history']['Row'];
type AnalysisSummary = Database['public']['Tables']['analysis_summary']['Row'];
type User = Database['public']['Tables']['users']['Row'];

interface UseDatabaseState {
  loading: boolean;
  error: string | null;
}

// Instancia del servicio de base de datos
const databaseService = new DatabaseService();

export function useDatabase() {
  const [state, setState] = useState<UseDatabaseState>({
    loading: false,
    error: null
  });

  const setLoading = useCallback((loading: boolean) => {
    setState(prev => ({ ...prev, loading }));
  }, []);

  const setError = useCallback((error: string | null) => {
    setState(prev => ({ ...prev, error }));
  }, []);

  const handleAsync = useCallback(async <T>(operation: () => Promise<T>): Promise<T | null> => {
    try {
      setLoading(true);
      setError(null);
      const result = await operation();
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      setError(errorMessage);
      console.error('Database operation error:', error);
      return null;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError]);

  // ==================== ANÁLISIS DE METADATOS ====================
  const createMetadataAnalysis = useCallback(async (data: Database['public']['Tables']['metadata_analysis']['Insert']) => {
    return handleAsync(() => databaseService.createMetadataAnalysis(data));
  }, [handleAsync]);

  const getMetadataAnalysisByUser = useCallback(async (userId: string) => {
    return handleAsync(() => databaseService.getMetadataAnalysisByUser(userId));
  }, [handleAsync]);

  const getMetadataAnalysisById = useCallback(async (id: string) => {
    return handleAsync(() => databaseService.getMetadataAnalysisById(id));
  }, [handleAsync]);

  const updateMetadataAnalysis = useCallback(async (id: string, data: Database['public']['Tables']['metadata_analysis']['Update']) => {
    return handleAsync(() => databaseService.updateMetadataAnalysis(id, data));
  }, [handleAsync]);

  const deleteMetadataAnalysis = useCallback(async (id: string) => {
    return handleAsync(() => databaseService.deleteMetadataAnalysis(id));
  }, [handleAsync]);

  // ==================== AUDITORÍA DE CONTENIDO ====================
  const createContentAudit = useCallback(async (data: Database['public']['Tables']['content_audit']['Insert']) => {
    return handleAsync(() => databaseService.createContentAudit(data));
  }, [handleAsync]);

  const getContentAuditsByUser = useCallback(async (userId: string) => {
    return handleAsync(() => databaseService.getContentAuditsByUser(userId));
  }, [handleAsync]);

  const getContentAuditById = useCallback(async (id: string) => {
    return handleAsync(() => databaseService.getContentAuditById(id));
  }, [handleAsync]);

  const updateContentAudit = useCallback(async (id: string, data: Database['public']['Tables']['content_audit']['Update']) => {
    return handleAsync(() => databaseService.updateContentAudit(id, data));
  }, [handleAsync]);

  const deleteContentAudit = useCallback(async (id: string) => {
    return handleAsync(() => databaseService.deleteContentAudit(id));
  }, [handleAsync]);

  // ==================== ANÁLISIS DE PALABRAS CLAVE ====================
  const createKeywordAnalysis = useCallback(async (data: Database['public']['Tables']['keyword_analysis']['Insert']) => {
    return handleAsync(() => databaseService.createKeywordAnalysis(data));
  }, [handleAsync]);

  const getKeywordAnalysisByUser = useCallback(async (userId: string) => {
    return handleAsync(() => databaseService.getKeywordAnalysisByUser(userId));
  }, [handleAsync]);

  const getKeywordAnalysisById = useCallback(async (id: string) => {
    return handleAsync(() => databaseService.getKeywordAnalysisById(id));
  }, [handleAsync]);

  const updateKeywordAnalysis = useCallback(async (id: string, data: Database['public']['Tables']['keyword_analysis']['Update']) => {
    return handleAsync(() => databaseService.updateKeywordAnalysis(id, data));
  }, [handleAsync]);

  const deleteKeywordAnalysis = useCallback(async (id: string) => {
    return handleAsync(() => databaseService.deleteKeywordAnalysis(id));
  }, [handleAsync]);

  // ==================== VERIFICACIÓN DE ENLACES ====================
  const createLinkVerification = useCallback(async (data: Database['public']['Tables']['link_verification']['Insert']) => {
    return handleAsync(() => databaseService.createLinkVerification(data));
  }, [handleAsync]);

  const getLinkVerificationsByUser = useCallback(async (userId: string) => {
    return handleAsync(() => databaseService.getLinkVerificationsByUser(userId));
  }, [handleAsync]);

  const getLinkVerificationById = useCallback(async (id: string) => {
    return handleAsync(() => databaseService.getLinkVerificationById(id));
  }, [handleAsync]);

  const updateLinkVerification = useCallback(async (id: string, data: Database['public']['Tables']['link_verification']['Update']) => {
    return handleAsync(() => databaseService.updateLinkVerification(id, data));
  }, [handleAsync]);

  const deleteLinkVerification = useCallback(async (id: string) => {
    return handleAsync(() => databaseService.deleteLinkVerification(id));
  }, [handleAsync]);

  // ==================== ANÁLISIS DE RENDIMIENTO ====================
  const createPerformanceAnalysis = useCallback(async (data: Database['public']['Tables']['performance_analysis']['Insert']) => {
    return handleAsync(() => databaseService.createPerformanceAnalysis(data));
  }, [handleAsync]);

  const getPerformanceAnalysisByUser = useCallback(async (userId: string) => {
    return handleAsync(() => databaseService.getPerformanceAnalysisByUser(userId));
  }, [handleAsync]);

  const getPerformanceAnalysisById = useCallback(async (id: string) => {
    return handleAsync(() => databaseService.getPerformanceAnalysisById(id));
  }, [handleAsync]);

  const updatePerformanceAnalysis = useCallback(async (id: string, data: Database['public']['Tables']['performance_analysis']['Update']) => {
    return handleAsync(() => databaseService.updatePerformanceAnalysis(id, data));
  }, [handleAsync]);

  const deletePerformanceAnalysis = useCallback(async (id: string) => {
    return handleAsync(() => databaseService.deletePerformanceAnalysis(id));
  }, [handleAsync]);

  // ==================== ANÁLISIS DE COMPETENCIA ====================
  const createCompetitionAnalysis = useCallback(async (data: Database['public']['Tables']['competition_analysis']['Insert']) => {
    return handleAsync(() => databaseService.createCompetitionAnalysis(data));
  }, [handleAsync]);

  const getCompetitionAnalysisByUser = useCallback(async (userId: string) => {
    return handleAsync(() => databaseService.getCompetitionAnalysisByUser(userId));
  }, [handleAsync]);

  const getCompetitionAnalysisById = useCallback(async (id: string) => {
    return handleAsync(() => databaseService.getCompetitionAnalysisById(id));
  }, [handleAsync]);

  const updateCompetitionAnalysis = useCallback(async (id: string, data: Database['public']['Tables']['competition_analysis']['Update']) => {
    return handleAsync(() => databaseService.updateCompetitionAnalysis(id, data));
  }, [handleAsync]);

  const deleteCompetitionAnalysis = useCallback(async (id: string) => {
    return handleAsync(() => databaseService.deleteCompetitionAnalysis(id));
  }, [handleAsync]);

  // ==================== ANÁLISIS BLOCKCHAIN ====================
  const createBlockchainAnalysis = useCallback(async (data: Database['public']['Tables']['blockchain_analysis']['Insert']) => {
    return handleAsync(() => databaseService.createBlockchainAnalysis(data));
  }, [handleAsync]);

  const getBlockchainAnalysisByUser = useCallback(async (userId: string) => {
    return handleAsync(() => databaseService.getBlockchainAnalysisByUser(userId));
  }, [handleAsync]);

  const getBlockchainAnalysisByNetwork = useCallback(async (network: string) => {
    return handleAsync(() => databaseService.getBlockchainAnalysisByNetwork(network));
  }, [handleAsync]);

  const getBlockchainAnalysisById = useCallback(async (id: string) => {
    return handleAsync(() => databaseService.getBlockchainAnalysisById(id));
  }, [handleAsync]);

  const updateBlockchainAnalysis = useCallback(async (id: string, data: Database['public']['Tables']['blockchain_analysis']['Update']) => {
    return handleAsync(() => databaseService.updateBlockchainAnalysis(id, data));
  }, [handleAsync]);

  const deleteBlockchainAnalysis = useCallback(async (id: string) => {
    return handleAsync(() => databaseService.deleteBlockchainAnalysis(id));
  }, [handleAsync]);

  // ==================== ASISTENTE IA ====================
  const createAIAssistantDashboard = useCallback(async (data: Database['public']['Tables']['ai_assistant_dashboard']['Insert']) => {
    return handleAsync(() => databaseService.createAIAssistantDashboard(data));
  }, [handleAsync]);

  const getAIAssistantDashboardsByUser = useCallback(async (userId: string) => {
    return handleAsync(() => databaseService.getAIAssistantDashboardsByUser(userId));
  }, [handleAsync]);

  const getAIAssistantDashboardById = useCallback(async (id: string) => {
    return handleAsync(() => databaseService.getAIAssistantDashboardById(id));
  }, [handleAsync]);

  const updateAIAssistantDashboard = useCallback(async (id: string, data: Database['public']['Tables']['ai_assistant_dashboard']['Update']) => {
    return handleAsync(() => databaseService.updateAIAssistantDashboard(id, data));
  }, [handleAsync]);

  const deleteAIAssistantDashboard = useCallback(async (id: string) => {
    return handleAsync(() => databaseService.deleteAIAssistantDashboard(id));
  }, [handleAsync]);

  // ==================== ANÁLISIS SOCIAL WEB3 ====================
  const createSocialWeb3Analysis = useCallback(async (data: Database['public']['Tables']['social_web3_analysis']['Insert']) => {
    return handleAsync(() => databaseService.createSocialWeb3Analysis(data));
  }, [handleAsync]);

  const getSocialWeb3AnalysisByUser = useCallback(async (userId: string) => {
    return handleAsync(() => databaseService.getSocialWeb3AnalysisByUser(userId));
  }, [handleAsync]);

  const getSocialWeb3AnalysisByAddress = useCallback(async (address: string) => {
    return handleAsync(() => databaseService.getSocialWeb3AnalysisByAddress(address));
  }, [handleAsync]);

  const getSocialWeb3AnalysisById = useCallback(async (id: string) => {
    return handleAsync(() => databaseService.getSocialWeb3AnalysisById(id));
  }, [handleAsync]);

  const updateSocialWeb3Analysis = useCallback(async (id: string, data: Database['public']['Tables']['social_web3_analysis']['Update']) => {
    return handleAsync(() => databaseService.updateSocialWeb3Analysis(id, data));
  }, [handleAsync]);

  const deleteSocialWeb3Analysis = useCallback(async (id: string) => {
    return handleAsync(() => databaseService.deleteSocialWeb3Analysis(id));
  }, [handleAsync]);

  // ==================== PAGOS DE HERRAMIENTAS ====================
  const createToolPayment = useCallback(async (data: Database['public']['Tables']['tool_payments']['Insert']) => {
    return handleAsync(() => databaseService.createToolPayment(data));
  }, [handleAsync]);

  const getToolPaymentsByUser = useCallback(async (userId: string) => {
    return handleAsync(() => databaseService.getToolPaymentsByUser(userId));
  }, [handleAsync]);

  const getToolPaymentByTxHash = useCallback(async (txHash: string) => {
    return handleAsync(() => databaseService.getToolPaymentByTxHash(txHash));
  }, [handleAsync]);

  const updateToolPaymentStatus = useCallback(async (id: string, status: string) => {
    return handleAsync(() => databaseService.updateToolPaymentStatus(id, status));
  }, [handleAsync]);

  const getPaymentsByStatus = useCallback(async (status: string) => {
    return handleAsync(() => databaseService.getPaymentsByStatus(status));
  }, [handleAsync]);

  // ==================== CONFIGURACIONES DE USUARIO ====================
  const createOrUpdateUserSettings = useCallback(async (userId: string, data: Database['public']['Tables']['user_settings']['Insert']) => {
    return handleAsync(() => databaseService.createOrUpdateUserSettings(userId, data));
  }, [handleAsync]);

  const getUserSettings = useCallback(async (userId: string) => {
    return handleAsync(() => databaseService.getUserSettings(userId));
  }, [handleAsync]);

  // ==================== HISTORIAL DE ACCIONES ====================
  const createToolActionHistory = useCallback(async (data: Database['public']['Tables']['tool_action_history']['Insert']) => {
    return handleAsync(() => databaseService.createToolActionHistory(data));
  }, [handleAsync]);

  const getToolActionHistoryByUser = useCallback(async (userId: string) => {
    return handleAsync(() => databaseService.getToolActionHistoryByUser(userId));
  }, [handleAsync]);

  const getToolActionHistoryByTool = useCallback(async (userId: string, toolId: string) => {
    return handleAsync(() => databaseService.getToolActionHistoryByTool(userId, toolId));
  }, [handleAsync]);

  // ==================== RESÚMENES DE ANÁLISIS ====================
  const createOrUpdateAnalysisSummary = useCallback(async (userId: string, data: Database['public']['Tables']['analysis_summary']['Insert']) => {
    return handleAsync(() => databaseService.createOrUpdateAnalysisSummary(userId, data));
  }, [handleAsync]);

  const getAnalysisSummariesByUser = useCallback(async (userId: string) => {
    return handleAsync(() => databaseService.getAnalysisSummariesByUser(userId));
  }, [handleAsync]);

  const getAnalysisSummaryByProject = useCallback(async (userId: string, projectName: string) => {
    return handleAsync(() => databaseService.getAnalysisSummaryByProject(userId, projectName));
  }, [handleAsync]);

  // ==================== USUARIOS ====================
  const createUser = useCallback(async (data: Database['public']['Tables']['users']['Insert']) => {
    return handleAsync(() => databaseService.createUser(data));
  }, [handleAsync]);

  const getUserById = useCallback(async (id: string) => {
    return handleAsync(() => databaseService.getUserById(id));
  }, [handleAsync]);

  const getUserByEmail = useCallback(async (email: string) => {
    return handleAsync(() => databaseService.getUserByEmail(email));
  }, [handleAsync]);

  // ==================== CONSULTAS AGREGADAS ====================
  const getCompleteProjectAnalysis = useCallback(async (userId: string, projectName: string) => {
    return handleAsync(() => databaseService.getCompleteProjectAnalysis(userId, projectName));
  }, [handleAsync]);

  // ==================== UTILIDADES ====================
  const healthCheck = useCallback(async () => {
    return handleAsync(() => databaseService.healthCheck());
  }, [handleAsync]);

  return {
    // Estado
    loading: state.loading,
    error: state.error,
    
    // Análisis de Metadatos
    createMetadataAnalysis,
    getMetadataAnalysisByUser,
    getMetadataAnalysisById,
    updateMetadataAnalysis,
    deleteMetadataAnalysis,
    
    // Auditoría de Contenido
    createContentAudit,
    getContentAuditsByUser,
    getContentAuditById,
    updateContentAudit,
    deleteContentAudit,
    
    // Análisis de Palabras Clave
    createKeywordAnalysis,
    getKeywordAnalysisByUser,
    getKeywordAnalysisById,
    updateKeywordAnalysis,
    deleteKeywordAnalysis,
    
    // Verificación de Enlaces
    createLinkVerification,
    getLinkVerificationsByUser,
    getLinkVerificationById,
    updateLinkVerification,
    deleteLinkVerification,
    
    // Análisis de Rendimiento
    createPerformanceAnalysis,
    getPerformanceAnalysisByUser,
    getPerformanceAnalysisById,
    updatePerformanceAnalysis,
    deletePerformanceAnalysis,
    
    // Análisis de Competencia
    createCompetitionAnalysis,
    getCompetitionAnalysisByUser,
    getCompetitionAnalysisById,
    updateCompetitionAnalysis,
    deleteCompetitionAnalysis,
    
    // Análisis Blockchain
    createBlockchainAnalysis,
    getBlockchainAnalysisByUser,
    getBlockchainAnalysisByNetwork,
    getBlockchainAnalysisById,
    updateBlockchainAnalysis,
    deleteBlockchainAnalysis,
    
    // Asistente IA
    createAIAssistantDashboard,
    getAIAssistantDashboardsByUser,
    getAIAssistantDashboardById,
    updateAIAssistantDashboard,
    deleteAIAssistantDashboard,
    
    // Análisis Social Web3
    createSocialWeb3Analysis,
    getSocialWeb3AnalysisByUser,
    getSocialWeb3AnalysisByAddress,
    getSocialWeb3AnalysisById,
    updateSocialWeb3Analysis,
    deleteSocialWeb3Analysis,
    
    // Pagos de Herramientas
    createToolPayment,
    getToolPaymentsByUser,
    getToolPaymentByTxHash,
    updateToolPaymentStatus,
    getPaymentsByStatus,
    
    // Configuraciones de Usuario
    createOrUpdateUserSettings,
    getUserSettings,
    
    // Historial de Acciones
    createToolActionHistory,
    getToolActionHistoryByUser,
    getToolActionHistoryByTool,
    
    // Resúmenes de Análisis
    createOrUpdateAnalysisSummary,
    getAnalysisSummariesByUser,
    getAnalysisSummaryByProject,
    
    // Usuarios
    createUser,
    getUserById,
    getUserByEmail,
    
    // Consultas Agregadas
    getCompleteProjectAnalysis,
    
    // Utilidades
    healthCheck
  };
}

// Hook especializado para el dashboard del usuario
export function useUserDashboard(userId: string) {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const { getAnalysisSummariesByUser, getToolActionHistoryByUser, getToolPaymentsByUser, getUserSettings, loading, error } = useDatabase();

  const loadDashboardData = useCallback(async () => {
    if (!userId) return;
    
    try {
      const [summaries, recentActions, payments, settings] = await Promise.all([
        getAnalysisSummariesByUser(userId),
        getToolActionHistoryByUser(userId),
        getToolPaymentsByUser(userId),
        getUserSettings(userId)
      ]);

      setDashboardData({
        summaries,
        recentActions,
        payments,
        settings
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  }, [userId, getAnalysisSummariesByUser, getToolActionHistoryByUser, getToolPaymentsByUser, getUserSettings]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  return {
    dashboardData,
    loading,
    error,
    refreshDashboard: loadDashboardData
  };
}

// Hook especializado para análisis de proyecto
export function useProjectAnalysis(userId: string, projectName: string) {
  const [projectData, setProjectData] = useState<any>(null);
  const { getCompleteProjectAnalysis, loading, error } = useDatabase();

  const loadProjectData = useCallback(async () => {
    if (!userId || !projectName) return;
    
    const data = await getCompleteProjectAnalysis(userId, projectName);
    if (data) {
      setProjectData(data);
    }
  }, [userId, projectName, getCompleteProjectAnalysis]);

  useEffect(() => {
    loadProjectData();
  }, [loadProjectData]);

  return {
    projectData,
    loading,
    error,
    refreshProject: loadProjectData
  };
}

// Exportar tipos para conveniencia
export type {
  MetadataAnalysis,
  ContentAudit,
  KeywordAnalysis,
  LinkVerification,
  PerformanceAnalysis,
  CompetitionAnalysis,
  BlockchainAnalysis,
  AIAssistantDashboard,
  SocialWeb3Analysis,
  ToolPayment,
  UserSettings,
  ToolActionHistory,
  AnalysisSummary,
  User
};