// Script para actualizar DatabaseService de Prisma a Supabase
// Este script reemplaza completamente el archivo database-service.ts

const newDatabaseServiceContent = `import { supabase, SupabaseService } from '../lib/supabase-client';
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
type User = Database['public']['Tables']['users']['Row'];
type ToolPayment = Database['public']['Tables']['tool_payments']['Row'];
type UserSettings = Database['public']['Tables']['user_settings']['Row'];
type ToolActionHistory = Database['public']['Tables']['tool_action_history']['Row'];
type AnalysisSummary = Database['public']['Tables']['analysis_summary']['Row'];

class DatabaseService {
  constructor() {
    // Ya no necesitamos inicializar Prisma
  }

  // ==================== ANÁLISIS DE METADATOS ====================
  async createMetadataAnalysis(data: Database['public']['Tables']['metadata_analysis']['Insert']) {
    return await SupabaseService.createMetadataAnalysis(data);
  }

  async getMetadataAnalysisByUser(userId: string) {
    return await SupabaseService.getMetadataAnalyses(userId);
  }

  async getMetadataAnalysisById(id: string) {
    return await SupabaseService.getMetadataAnalysis(id);
  }

  async updateMetadataAnalysis(id: string, data: Database['public']['Tables']['metadata_analysis']['Update']) {
    return await SupabaseService.updateMetadataAnalysis(id, data);
  }

  async deleteMetadataAnalysis(id: string) {
    return await SupabaseService.deleteMetadataAnalysis(id);
  }

  // ==================== AUDITORÍA DE CONTENIDO ====================
  async createContentAudit(data: Database['public']['Tables']['content_audit']['Insert']) {
    return await SupabaseService.createContentAudit(data);
  }

  async getContentAuditsByUser(userId: string) {
    return await SupabaseService.getContentAudits(userId);
  }

  async getContentAuditById(id: string) {
    return await SupabaseService.getContentAudit(id);
  }

  async updateContentAudit(id: string, data: Database['public']['Tables']['content_audit']['Update']) {
    return await SupabaseService.updateContentAudit(id, data);
  }

  async deleteContentAudit(id: string) {
    return await SupabaseService.deleteContentAudit(id);
  }

  // ==================== ANÁLISIS DE PALABRAS CLAVE ====================
  async createKeywordAnalysis(data: Database['public']['Tables']['keyword_analysis']['Insert']) {
    return await SupabaseService.createKeywordAnalysis(data);
  }

  async getKeywordAnalysisByUser(userId: string) {
    return await SupabaseService.getKeywordAnalyses(userId);
  }

  async getKeywordAnalysisById(id: string) {
    return await SupabaseService.getKeywordAnalysis(id);
  }

  async updateKeywordAnalysis(id: string, data: Database['public']['Tables']['keyword_analysis']['Update']) {
    return await SupabaseService.updateKeywordAnalysis(id, data);
  }

  async deleteKeywordAnalysis(id: string) {
    return await SupabaseService.deleteKeywordAnalysis(id);
  }

  // ==================== VERIFICACIÓN DE ENLACES ====================
  async createLinkVerification(data: Database['public']['Tables']['link_verification']['Insert']) {
    return await SupabaseService.createLinkVerification(data);
  }

  async getLinkVerificationsByUser(userId: string) {
    return await SupabaseService.getLinkVerifications(userId);
  }

  async getLinkVerificationById(id: string) {
    return await SupabaseService.getLinkVerification(id);
  }

  async updateLinkVerification(id: string, data: Database['public']['Tables']['link_verification']['Update']) {
    return await SupabaseService.updateLinkVerification(id, data);
  }

  async deleteLinkVerification(id: string) {
    return await SupabaseService.deleteLinkVerification(id);
  }

  // ==================== ANÁLISIS DE RENDIMIENTO ====================
  async createPerformanceAnalysis(data: Database['public']['Tables']['performance_analysis']['Insert']) {
    return await SupabaseService.createPerformanceAnalysis(data);
  }

  async getPerformanceAnalysisByUser(userId: string) {
    return await SupabaseService.getPerformanceAnalyses(userId);
  }

  async getPerformanceAnalysisById(id: string) {
    return await SupabaseService.getPerformanceAnalysis(id);
  }

  async updatePerformanceAnalysis(id: string, data: Database['public']['Tables']['performance_analysis']['Update']) {
    return await SupabaseService.updatePerformanceAnalysis(id, data);
  }

  async deletePerformanceAnalysis(id: string) {
    return await SupabaseService.deletePerformanceAnalysis(id);
  }

  // ==================== ANÁLISIS DE COMPETENCIA ====================
  async createCompetitionAnalysis(data: Database['public']['Tables']['competition_analysis']['Insert']) {
    return await SupabaseService.createCompetitionAnalysis(data);
  }

  async getCompetitionAnalysisByUser(userId: string) {
    return await SupabaseService.getCompetitionAnalyses(userId);
  }

  async getCompetitionAnalysisById(id: string) {
    return await SupabaseService.getCompetitionAnalysis(id);
  }

  async updateCompetitionAnalysis(id: string, data: Database['public']['Tables']['competition_analysis']['Update']) {
    return await SupabaseService.updateCompetitionAnalysis(id, data);
  }

  async deleteCompetitionAnalysis(id: string) {
    return await SupabaseService.deleteCompetitionAnalysis(id);
  }

  // ==================== ANÁLISIS BLOCKCHAIN ====================
  async createBlockchainAnalysis(data: Database['public']['Tables']['blockchain_analysis']['Insert']) {
    return await SupabaseService.createBlockchainAnalysis(data);
  }

  async getBlockchainAnalysisByUser(userId: string) {
    return await SupabaseService.getBlockchainAnalyses(userId);
  }

  async getBlockchainAnalysisByNetwork(network: string) {
    return await SupabaseService.getBlockchainAnalysesByNetwork(network);
  }

  async getBlockchainAnalysisById(id: string) {
    return await SupabaseService.getBlockchainAnalysis(id);
  }

  async updateBlockchainAnalysis(id: string, data: Database['public']['Tables']['blockchain_analysis']['Update']) {
    return await SupabaseService.updateBlockchainAnalysis(id, data);
  }

  async deleteBlockchainAnalysis(id: string) {
    return await SupabaseService.deleteBlockchainAnalysis(id);
  }

  // ==================== DASHBOARD ASISTENTE AI ====================
  async createAIAssistantDashboard(data: Database['public']['Tables']['ai_assistant_dashboard']['Insert']) {
    return await SupabaseService.createAIAssistantDashboard(data);
  }

  async getAIAssistantDashboardsByUser(userId: string) {
    return await SupabaseService.getAIAssistantDashboards(userId);
  }

  async getAIAssistantDashboardById(id: string) {
    return await SupabaseService.getAIAssistantDashboard(id);
  }

  async updateAIAssistantDashboard(id: string, data: Database['public']['Tables']['ai_assistant_dashboard']['Update']) {
    return await SupabaseService.updateAIAssistantDashboard(id, data);
  }

  async deleteAIAssistantDashboard(id: string) {
    return await SupabaseService.deleteAIAssistantDashboard(id);
  }

  // ==================== ANÁLISIS SOCIAL WEB3 ====================
  async createSocialWeb3Analysis(data: Database['public']['Tables']['social_web3_analysis']['Insert']) {
    return await SupabaseService.createSocialWeb3Analysis(data);
  }

  async getSocialWeb3AnalysisByUser(userId: string) {
    return await SupabaseService.getSocialWeb3Analyses(userId);
  }

  async getSocialWeb3AnalysisByAddress(address: string) {
    return await SupabaseService.getSocialWeb3AnalysesByAddress(address);
  }

  async getSocialWeb3AnalysisById(id: string) {
    return await SupabaseService.getSocialWeb3Analysis(id);
  }

  async updateSocialWeb3Analysis(id: string, data: Database['public']['Tables']['social_web3_analysis']['Update']) {
    return await SupabaseService.updateSocialWeb3Analysis(id, data);
  }

  async deleteSocialWeb3Analysis(id: string) {
    return await SupabaseService.deleteSocialWeb3Analysis(id);
  }

  // ==================== PAGOS DE HERRAMIENTAS ====================
  async createToolPayment(data: Database['public']['Tables']['tool_payments']['Insert']) {
    return await SupabaseService.createToolPayment(data);
  }

  async getToolPaymentsByUser(userId: string) {
    return await SupabaseService.getToolPayments(userId);
  }

  async getToolPaymentByTxHash(txHash: string) {
    return await SupabaseService.getToolPaymentByTxHash(txHash);
  }

  async updateToolPaymentStatus(id: string, status: string) {
    return await SupabaseService.updateToolPayment(id, { status });
  }

  async getPaymentsByStatus(status: string) {
    return await SupabaseService.getToolPaymentsByStatus(status);
  }

  // ==================== CONFIGURACIONES DE USUARIO ====================
  async createOrUpdateUserSettings(userId: string, data: Database['public']['Tables']['user_settings']['Insert']) {
    return await SupabaseService.createOrUpdateUserSettings(userId, data);
  }

  async getUserSettings(userId: string) {
    return await SupabaseService.getUserSettings(userId);
  }

  // ==================== HISTORIAL DE ACCIONES ====================
  async createToolActionHistory(data: Database['public']['Tables']['tool_action_history']['Insert']) {
    return await SupabaseService.createToolActionHistory(data);
  }

  async getToolActionHistoryByUser(userId: string) {
    return await SupabaseService.getToolActionHistory(userId);
  }

  async getToolActionHistoryByTool(userId: string, toolId: string) {
    return await SupabaseService.getToolActionHistoryByTool(userId, toolId);
  }

  // ==================== RESUMEN DE ANÁLISIS ====================
  async createOrUpdateAnalysisSummary(userId: string, data: Database['public']['Tables']['analysis_summary']['Insert']) {
    return await SupabaseService.createOrUpdateAnalysisSummary(userId, data);
  }

  async getAnalysisSummariesByUser(userId: string) {
    return await SupabaseService.getAnalysisSummaries(userId);
  }

  async getAnalysisSummaryByProject(userId: string, projectName: string) {
    return await SupabaseService.getAnalysisSummaryByProject(userId, projectName);
  }

  // ==================== GESTIÓN DE USUARIOS ====================
  async createUser(data: Database['public']['Tables']['users']['Insert']) {
    return await SupabaseService.createUser(data);
  }

  async getUserById(id: string) {
    return await SupabaseService.getUser(id);
  }

  async getUserByEmail(email: string) {
    return await SupabaseService.getUserByEmail(email);
  }

  // ==================== ANÁLISIS COMPLETO POR PROYECTO ====================
  async getCompleteProjectAnalysis(userId: string, projectName: string) {
    try {
      const [metadata, content, keywords, links, performance, competition, blockchain, ai, social] = await Promise.all([
        SupabaseService.getMetadataAnalyses(userId, projectName),
        SupabaseService.getContentAudits(userId, projectName),
        SupabaseService.getKeywordAnalyses(userId, projectName),
        SupabaseService.getLinkVerifications(userId, projectName),
        SupabaseService.getPerformanceAnalyses(userId, projectName),
        SupabaseService.getCompetitionAnalyses(userId, projectName),
        SupabaseService.getBlockchainAnalyses(userId, projectName),
        SupabaseService.getAIAssistantDashboards(userId, projectName),
        SupabaseService.getSocialWeb3Analyses(userId)
      ]);

      return {
        metadata,
        content,
        keywords,
        links,
        performance,
        competition,
        blockchain,
        ai,
        social: social.filter(s => s.project_name === projectName)
      };
    } catch (error) {
      console.error('Error obteniendo análisis completo del proyecto:', error);
      throw error;
    }
  }

  // ==================== UTILIDADES ====================
  async disconnect() {
    // Ya no necesitamos desconectar Prisma
    console.log('Supabase client no requiere desconexión manual');
  }

  async healthCheck() {
    try {
      const { data, error } = await supabase.from('users').select('count').limit(1);
      if (error) throw error;
      return { status: 'healthy', timestamp: new Date().toISOString() };
    } catch (error) {
      console.error('Health check failed:', error);
      throw error;
    }
  }
}

export default DatabaseService;
export { DatabaseService };
`;

export { newDatabaseServiceContent };