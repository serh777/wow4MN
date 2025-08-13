import { supabase, SupabaseService } from '../lib/supabase-client';
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
    return await SupabaseService.getMetadataAnalysisByUser(userId);
  }

  async getMetadataAnalysisById(id: string) {
    const { data, error } = await supabase.from('metadata_analysis').select('*').eq('id', id).single();
    if (error) throw error;
    return data;
  }

  async updateMetadataAnalysis(id: string, updates: Database['public']['Tables']['metadata_analysis']['Update']) {
    const { data, error } = await supabase.from('metadata_analysis').update(updates).eq('id', id).select().single();
    if (error) throw error;
    return data;
  }

  async deleteMetadataAnalysis(id: string) {
    const { error } = await supabase.from('metadata_analysis').delete().eq('id', id);
    if (error) throw error;
    return true;
  }

  // ==================== AUDITORÍA DE CONTENIDO ====================
  async createContentAudit(data: Database['public']['Tables']['content_audit']['Insert']) {
    return await SupabaseService.createContentAudit(data);
  }

  async getContentAuditsByUser(userId: string) {
    return await SupabaseService.getContentAuditByUser(userId);
  }

  async getContentAuditById(id: string) {
    const { data, error } = await supabase.from('content_audit').select('*').eq('id', id).single();
    if (error) throw error;
    return data;
  }

  async updateContentAudit(id: string, updates: Database['public']['Tables']['content_audit']['Update']) {
    const { data, error } = await supabase.from('content_audit').update(updates).eq('id', id).select().single();
    if (error) throw error;
    return data;
  }

  async deleteContentAudit(id: string) {
    const { error } = await supabase.from('content_audit').delete().eq('id', id);
    if (error) throw error;
    return true;
  }

  // ==================== ANÁLISIS DE PALABRAS CLAVE ====================
  async createKeywordAnalysis(data: Database['public']['Tables']['keyword_analysis']['Insert']) {
    return await SupabaseService.createKeywordAnalysis(data);
  }

  async getKeywordAnalysisByUser(userId: string) {
    return await SupabaseService.getKeywordAnalysisByUser(userId);
  }

  async getKeywordAnalysisById(id: string) {
    const { data, error } = await supabase.from('keyword_analysis').select('*').eq('id', id).single();
    if (error) throw error;
    return data;
  }

  async updateKeywordAnalysis(id: string, updates: Database['public']['Tables']['keyword_analysis']['Update']) {
    const { data, error } = await supabase.from('keyword_analysis').update(updates).eq('id', id).select().single();
    if (error) throw error;
    return data;
  }

  async deleteKeywordAnalysis(id: string) {
    const { error } = await supabase.from('keyword_analysis').delete().eq('id', id);
    if (error) throw error;
    return true;
  }

  // ==================== VERIFICACIÓN DE ENLACES ====================
  async createLinkVerification(data: Database['public']['Tables']['link_verification']['Insert']) {
    return await SupabaseService.createLinkVerification(data);
  }

  async getLinkVerificationsByUser(userId: string) {
    return await SupabaseService.getLinkVerificationByUser(userId);
  }

  async getLinkVerificationById(id: string) {
    const { data, error } = await supabase.from('link_verification').select('*').eq('id', id).single();
    if (error) throw error;
    return data;
  }

  async updateLinkVerification(id: string, updates: Database['public']['Tables']['link_verification']['Update']) {
    const { data, error } = await supabase.from('link_verification').update(updates).eq('id', id).select().single();
    if (error) throw error;
    return data;
  }

  async deleteLinkVerification(id: string) {
    const { error } = await supabase.from('link_verification').delete().eq('id', id);
    if (error) throw error;
    return true;
  }

  // ==================== ANÁLISIS DE RENDIMIENTO ====================
  async createPerformanceAnalysis(data: Database['public']['Tables']['performance_analysis']['Insert']) {
    return await SupabaseService.createPerformanceAnalysis(data);
  }

  async getPerformanceAnalysisByUser(userId: string) {
    return await SupabaseService.getPerformanceAnalysisByUser(userId);
  }

  async getPerformanceAnalysisById(id: string) {
    const { data, error } = await supabase.from('performance_analysis').select('*').eq('id', id).single();
    if (error) throw error;
    return data;
  }

  async updatePerformanceAnalysis(id: string, updates: Database['public']['Tables']['performance_analysis']['Update']) {
    const { data, error } = await supabase.from('performance_analysis').update(updates).eq('id', id).select().single();
    if (error) throw error;
    return data;
  }

  async deletePerformanceAnalysis(id: string) {
    const { error } = await supabase.from('performance_analysis').delete().eq('id', id);
    if (error) throw error;
    return true;
  }

  // ==================== ANÁLISIS DE COMPETENCIA ====================
  async createCompetitionAnalysis(data: Database['public']['Tables']['competition_analysis']['Insert']) {
    return await SupabaseService.createCompetitionAnalysis(data);
  }

  async getCompetitionAnalysisByUser(userId: string) {
    return await SupabaseService.getCompetitionAnalysisByUser(userId);
  }

  async getCompetitionAnalysisById(id: string) {
    const { data, error } = await supabase.from('competition_analysis').select('*').eq('id', id).single();
    if (error) throw error;
    return data;
  }

  async updateCompetitionAnalysis(id: string, updates: Database['public']['Tables']['competition_analysis']['Update']) {
    const { data, error } = await supabase.from('competition_analysis').update(updates).eq('id', id).select().single();
    if (error) throw error;
    return data;
  }

  async deleteCompetitionAnalysis(id: string) {
    const { error } = await supabase.from('competition_analysis').delete().eq('id', id);
    if (error) throw error;
    return true;
  }

  // ==================== ANÁLISIS BLOCKCHAIN ====================
  async createBlockchainAnalysis(data: Database['public']['Tables']['blockchain_analysis']['Insert']) {
    return await SupabaseService.createBlockchainAnalysis(data);
  }

  async getBlockchainAnalysisByUser(userId: string) {
    return await SupabaseService.getBlockchainAnalysisByUser(userId);
  }

  async getBlockchainAnalysisByNetwork(network: string) {
    const { data, error } = await supabase.from('blockchain_analysis').select('*').eq('network', network).order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  }

  async getBlockchainAnalysisById(id: string) {
    const { data, error } = await supabase.from('blockchain_analysis').select('*').eq('id', id).single();
    if (error) throw error;
    return data;
  }

  async updateBlockchainAnalysis(id: string, updates: Database['public']['Tables']['blockchain_analysis']['Update']) {
    const { data, error } = await supabase.from('blockchain_analysis').update(updates).eq('id', id).select().single();
    if (error) throw error;
    return data;
  }

  async deleteBlockchainAnalysis(id: string) {
    const { error } = await supabase.from('blockchain_analysis').delete().eq('id', id);
    if (error) throw error;
    return true;
  }

  // ==================== DASHBOARD ASISTENTE AI ====================
  async createAIAssistantDashboard(data: Database['public']['Tables']['ai_assistant_dashboard']['Insert']) {
    return await SupabaseService.createAIAssistantDashboard(data);
  }

  async getAIAssistantDashboardsByUser(userId: string) {
    return await SupabaseService.getAIAssistantDashboardByUser(userId);
  }

  async getAIAssistantDashboardById(id: string) {
    const { data, error } = await supabase.from('ai_assistant_dashboard').select('*').eq('id', id).single();
    if (error) throw error;
    return data;
  }

  async updateAIAssistantDashboard(id: string, updates: Database['public']['Tables']['ai_assistant_dashboard']['Update']) {
    const { data, error } = await supabase.from('ai_assistant_dashboard').update(updates).eq('id', id).select().single();
    if (error) throw error;
    return data;
  }

  async deleteAIAssistantDashboard(id: string) {
    const { error } = await supabase.from('ai_assistant_dashboard').delete().eq('id', id);
    if (error) throw error;
    return true;
  }

  // ==================== ANÁLISIS SOCIAL WEB3 ====================
  async createSocialWeb3Analysis(data: Database['public']['Tables']['social_web3_analysis']['Insert']) {
    return await SupabaseService.createSocialWeb3Analysis(data);
  }

  async getSocialWeb3AnalysisByUser(userId: string) {
    return await SupabaseService.getSocialWeb3AnalysisByUser(userId);
  }

  async getSocialWeb3AnalysisByAddress(address: string) {
    const { data, error } = await supabase.from('social_web3_analysis').select('*').eq('address', address).order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  }

  async getSocialWeb3AnalysisById(id: string) {
    const { data, error } = await supabase.from('social_web3_analysis').select('*').eq('id', id).single();
    if (error) throw error;
    return data;
  }

  async updateSocialWeb3Analysis(id: string, updates: Database['public']['Tables']['social_web3_analysis']['Update']) {
    const { data, error } = await supabase.from('social_web3_analysis').update(updates).eq('id', id).select().single();
    if (error) throw error;
    return data;
  }

  async deleteSocialWeb3Analysis(id: string) {
    const { error } = await supabase.from('social_web3_analysis').delete().eq('id', id);
    if (error) throw error;
    return true;
  }

  // ==================== PAGOS DE HERRAMIENTAS ====================
  async createToolPayment(data: Database['public']['Tables']['tool_payments']['Insert']) {
    return await SupabaseService.createToolPayment(data);
  }

  async getToolPaymentsByUser(userId: string) {
    return await SupabaseService.getToolPaymentsByUser(userId);
  }

  async getToolPaymentByTxHash(txHash: string) {
    const { data, error } = await supabase.from('tool_payments').select('*').eq('tx_hash', txHash).single();
    if (error) throw error;
    return data;
  }

  async updateToolPaymentStatus(id: string, status: string) {
    return await SupabaseService.updateToolPayment(id, { status });
  }

  async getPaymentsByStatus(status: string) {
    const { data, error } = await supabase.from('tool_payments').select('*').eq('status', status).order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  }

  // ==================== CONFIGURACIONES DE USUARIO ====================
  async getUserDashboardData(userId: string) {
    // Obtener resúmenes de análisis
    const { data: summaries, error: summariesError } = await supabase
      .from('analysis_summary')
      .select('*')
      .eq('user_id', userId);

    if (summariesError) throw summariesError;

    // Obtener pagos
    const { data: payments, error: paymentsError } = await supabase
      .from('tool_payments')
      .select('*')
      .eq('user_id', userId);

    if (paymentsError) throw paymentsError;

    // Obtener acciones recientes
    const { data: recentActions, error: actionsError } = await supabase
      .from('tool_action_history')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(20);

    if (actionsError) throw actionsError;

    return {
      summaries: summaries || [],
      payments: payments || [],
      recentActions: recentActions || []
    };
  }

  async createOrUpdateUserSettings(userId: string, data: Database['public']['Tables']['user_settings']['Insert']) {
    const { data: existing } = await supabase.from('user_settings').select('*').eq('user_id', userId).single();
    
    if (existing) {
      return await SupabaseService.updateUserSettings(userId, data);
    } else {
      return await SupabaseService.createUserSettings({ ...data, user_id: userId });
    }
  }

  async getUserSettings(userId: string) {
    return await SupabaseService.getUserSettings(userId);
  }

  // ==================== HISTORIAL DE ACCIONES ====================
  async createToolActionHistory(data: Database['public']['Tables']['tool_action_history']['Insert']) {
    return await SupabaseService.createToolActionHistory(data);
  }

  async getToolActionHistoryByUser(userId: string) {
    return await SupabaseService.getToolActionHistoryByUser(userId);
  }

  async getToolActionHistoryByTool(userId: string, toolId: string) {
    const { data, error } = await supabase.from('tool_action_history').select('*').eq('user_id', userId).eq('tool_id', toolId).order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  }

  // ==================== RESUMEN DE ANÁLISIS ====================
  async createOrUpdateAnalysisSummary(userId: string, data: Database['public']['Tables']['analysis_summary']['Insert']) {
    const { data: existing } = await supabase.from('analysis_summary').select('*').eq('user_id', userId).eq('project_name', data.project_name).single();
    
    if (existing) {
      return await SupabaseService.updateAnalysisSummary(existing.id, data);
    } else {
      return await SupabaseService.createAnalysisSummary({ ...data, user_id: userId });
    }
  }

  async getAnalysisSummariesByUser(userId: string) {
    return await SupabaseService.getAnalysisSummaryByUser(userId);
  }

  async getAnalysisSummaryByProject(userId: string, projectName: string) {
    const { data, error } = await supabase.from('analysis_summary').select('*').eq('user_id', userId).eq('project_name', projectName).single();
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  // ==================== GESTIÓN DE USUARIOS ====================
  async createUser(data: Database['public']['Tables']['users']['Insert']) {
    const { data: result, error } = await supabase.from('users').insert(data).select().single();
    if (error) throw error;
    return result;
  }

  async getUserById(id: string) {
    const { data, error } = await supabase.from('users').select('*').eq('id', id).single();
    if (error) throw error;
    return data;
  }

  async getUserByEmail(email: string) {
    const { data, error } = await supabase.from('users').select('*').eq('email', email).single();
    if (error) throw error;
    return data;
  }

  // ==================== ANÁLISIS COMPLETO POR PROYECTO ====================
  async getCompleteProjectAnalysis(userId: string, projectName: string) {
    try {
      const [metadata, content, keywords, links, performance, competition, blockchain, ai, social] = await Promise.all([
        this.getMetadataAnalysisByUser(userId),
        this.getContentAuditsByUser(userId),
        this.getKeywordAnalysisByUser(userId),
        this.getLinkVerificationsByUser(userId),
        this.getPerformanceAnalysisByUser(userId),
        this.getCompetitionAnalysisByUser(userId),
        this.getBlockchainAnalysisByUser(userId),
        this.getAIAssistantDashboardsByUser(userId),
        this.getSocialWeb3AnalysisByUser(userId)
      ]);

      return {
        metadata: metadata.filter(m => m.project_name === projectName),
        content: content.filter(c => c.project_name === projectName),
        keywords: keywords.filter(k => k.project_name === projectName),
        links: links.filter(l => l.project_name === projectName),
        performance: performance.filter(p => p.project_name === projectName),
        competition: competition.filter(c => c.project_name === projectName),
        blockchain: blockchain.filter(b => b.project_name === projectName),
        ai: ai.filter(a => a.project_name === projectName),
        social: social.filter(s => s.address === projectName || s.network === projectName)
      };
    } catch (error) {
      console.error('Error obteniendo análisis completo del proyecto:', error);
      throw error;
    }
  }

  // ==================== INDEXERS ====================
  async getIndexers(userId: string) {
    return await SupabaseService.getIndexersByUser(userId);
  }

  async getIndexerById(indexerId: string) {
    const { data, error } = await supabase.from('indexers').select('*').eq('id', indexerId).single();
    if (error) throw error;
    return data;
  }

  async getLastIndexerJob(indexerId: string) {
    const { data, error } = await supabase
      .from('indexer_jobs')
      .select('*')
      .eq('indexer_id', indexerId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
    if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows returned
    return data;
  }

  async getIndexerConfigs(indexerId: string) {
    const { data, error } = await supabase
      .from('indexer_configs')
      .select('*')
      .eq('indexer_id', indexerId);
    if (error) throw error;
    return data || [];
  }

  async healthCheck() {
    const { data, error } = await supabase.from('users').select('id').limit(1);
    if (error) throw error;
    return true;
  }

  async createBlock(data: Database['public']['Tables']['blocks']['Insert']) {
    const { data: result, error } = await supabase.from('blocks').insert(data).select().single();
    if (error) throw error;
    return result;
  }

  async createTransaction(data: Database['public']['Tables']['transactions']['Insert']) {
    const { data: result, error } = await supabase.from('transactions').insert(data).select().single();
    if (error) throw error;
    return result;
  }

  async createEvent(data: Database['public']['Tables']['events']['Insert']) {
    const { data: result, error } = await supabase.from('events').insert(data).select().single();
    if (error) throw error;
    return result;
  }

  async createIndexerJob(data: Database['public']['Tables']['indexer_jobs']['Insert']) {
    const { data: result, error } = await supabase.from('indexer_jobs').insert(data).select().single();
    if (error) throw error;
    return result;
  }

  async updateIndexerJob(id: string, updates: Database['public']['Tables']['indexer_jobs']['Update']) {
    const { data, error } = await supabase.from('indexer_jobs').update(updates).eq('id', id).select().single();
    if (error) throw error;
    return data;
  }

  async getIndexerJobs(indexerId: string, limit: number = 10) {
    const { data, error } = await supabase
      .from('indexer_jobs')
      .select('*')
      .eq('indexer_id', indexerId)
      .order('created_at', { ascending: false })
      .limit(limit);
    if (error) throw error;
    return data || [];
  }

  async upsertIndexerConfig(data: Database['public']['Tables']['indexer_configs']['Insert']) {
    const { data: result, error } = await supabase
      .from('indexer_configs')
      .upsert(data, { onConflict: 'indexer_id,key' })
      .select()
      .single();
    if (error) throw error;
    return result;
  }

  async updateIndexer(id: string, updates: Database['public']['Tables']['indexers']['Update']) {
    const { data, error } = await supabase.from('indexers').update(updates).eq('id', id).select().single();
    if (error) throw error;
    return data;
  }

  async deleteIndexer(id: string, userId?: string) {
    let query = supabase.from('indexers').delete().eq('id', id);
    if (userId) {
      query = query.eq('user_id', userId);
    }
    const { error } = await query;
    if (error) throw error;
    return true;
  }

  async createIndexer(data: Database['public']['Tables']['indexers']['Insert']) {
    return await SupabaseService.createIndexer(data);
  }

  // ==================== BLOCKCHAIN DATA ====================
  async getBlocks(options: { limit?: number; offset?: number; blockNumber?: number; blockHash?: string } = {}) {
    let query = supabase.from('blocks').select('*');
    
    if (options.blockNumber !== undefined) {
      query = query.eq('block_number', options.blockNumber);
    }
    if (options.blockHash) {
      query = query.eq('block_hash', options.blockHash);
    }
    
    if (options.limit) query = query.limit(options.limit);
    if (options.offset) query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
    
    const { data, error } = await query.order('block_number', { ascending: false });
    if (error) throw error;
    return data;
  }

  async countBlocks(options: { blockNumber?: number; blockHash?: string } = {}) {
    let query = supabase.from('blocks').select('*', { count: 'exact', head: true });
    
    if (options.blockNumber !== undefined) {
      query = query.eq('block_number', options.blockNumber);
    }
    if (options.blockHash) {
      query = query.eq('block_hash', options.blockHash);
    }
    
    const { count, error } = await query;
    if (error) throw error;
    return count || 0;
  }

  async getTransactions(options: { limit?: number; offset?: number; txHash?: string; blockId?: string; fromAddress?: string; toAddress?: string } = {}) {
    let query = supabase.from('transactions').select('*');
    
    if (options.txHash) {
      query = query.eq('tx_hash', options.txHash);
    }
    if (options.blockId) {
      query = query.eq('block_id', options.blockId);
    }
    if (options.fromAddress) {
      query = query.eq('from_address', options.fromAddress);
    }
    if (options.toAddress) {
      query = query.eq('to_address', options.toAddress);
    }
    
    if (options.limit) query = query.limit(options.limit);
    if (options.offset) query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
    
    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  }

  async countTransactions(options: { txHash?: string; blockId?: string; fromAddress?: string; toAddress?: string } = {}) {
    let query = supabase.from('transactions').select('*', { count: 'exact', head: true });
    
    if (options.txHash) {
      query = query.eq('tx_hash', options.txHash);
    }
    if (options.blockId) {
      query = query.eq('block_id', options.blockId);
    }
    if (options.fromAddress) {
      query = query.eq('from_address', options.fromAddress);
    }
    if (options.toAddress) {
      query = query.eq('to_address', options.toAddress);
    }
    
    const { count, error } = await query;
    if (error) throw error;
    return count || 0;
  }

  async getEvents(options: { limit?: number; offset?: number; transactionId?: string; address?: string; eventName?: string } = {}) {
    let query = supabase.from('events').select('*');
    
    if (options.transactionId) {
      query = query.eq('transaction_id', options.transactionId);
    }
    if (options.address) {
      query = query.eq('address', options.address);
    }
    if (options.eventName) {
      query = query.eq('event_name', options.eventName);
    }
    
    if (options.limit) query = query.limit(options.limit);
    if (options.offset) query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
    
    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  }

  async countEvents(options: { transactionId?: string; address?: string; eventName?: string } = {}) {
    let query = supabase.from('events').select('*', { count: 'exact', head: true });
    
    if (options.transactionId) {
      query = query.eq('transaction_id', options.transactionId);
    }
    if (options.address) {
      query = query.eq('address', options.address);
    }
    if (options.eventName) {
      query = query.eq('event_name', options.eventName);
    }
    
    const { count, error } = await query;
    if (error) throw error;
    return count || 0;
  }

  async getAIAssistantDashboardByUser(userId: string) {
    const { data, error } = await supabase
      .from('ai_assistant_dashboard')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  }

  // ==================== UTILIDADES ====================
  async disconnect() {
    // Ya no necesitamos desconectar Prisma
    console.log('Supabase client no requiere desconexión manual');
  }
}

export default DatabaseService;
export { DatabaseService };