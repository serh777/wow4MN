import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';

// Solo validar en runtime, no durante el build
if (typeof window !== 'undefined' && (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)) {
  console.warn('Warning: Supabase environment variables not configured. Using placeholder values.');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Tipos de base de datos
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
export type Inserts<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert'];
export type Updates<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update'];

// Tipos específicos para las tablas
export type User = Tables<'users'>;
export type ToolData = Tables<'tool_data'>;
export type MetadataAnalysis = Tables<'metadata_analysis'>;
export type ContentAudit = Tables<'content_audit'>;
export type KeywordAnalysis = Tables<'keyword_analysis'>;
export type LinkVerification = Tables<'link_verification'>;
export type PerformanceAnalysis = Tables<'performance_analysis'>;
export type CompetitionAnalysis = Tables<'competition_analysis'>;
export type BlockchainAnalysis = Tables<'blockchain_analysis'>;
export type AIAssistantDashboard = Tables<'ai_assistant_dashboard'>;
export type SocialWeb3Analysis = Tables<'social_web3_analysis'>;
export type Indexer = Tables<'indexers'>;
export type IndexerJob = Tables<'indexer_jobs'>;
export type IndexerConfig = Tables<'indexer_configs'>;
export type Block = Tables<'blocks'>;
export type Transaction = Tables<'transactions'>;
export type Event = Tables<'events'>;
export type ToolPayment = Tables<'tool_payments'>;
export type UserSettings = Tables<'user_settings'>;
export type ToolActionHistory = Tables<'tool_action_history'>;
export type AnalysisSummary = Tables<'analysis_summary'>;

// Funciones de utilidad para operaciones comunes
export class SupabaseService {
  // Obtener usuario actual
  static async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  }

  // Obtener perfil de usuario
  static async getUserProfile(userId: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) throw error;
    return data;
  }

  // Crear datos de herramienta
  static async createToolData(data: Inserts<'tool_data'>) {
    const { data: result, error } = await supabase
      .from('tool_data')
      .insert(data)
      .select()
      .single();
    
    if (error) throw error;
    return result;
  }

  // Obtener datos de herramienta por usuario
  static async getToolDataByUser(userId: string, toolId?: string) {
    let query = supabase
      .from('tool_data')
      .select('*')
      .eq('user_id', userId);
    
    if (toolId) {
      query = query.eq('tool_id', toolId);
    }
    
    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  // Actualizar datos de herramienta
  static async updateToolData(id: string, updates: Updates<'tool_data'>) {
    const { data, error } = await supabase
      .from('tool_data')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // Crear análisis de metadatos
  static async createMetadataAnalysis(data: Inserts<'metadata_analysis'>) {
    const { data: result, error } = await supabase
      .from('metadata_analysis')
      .insert(data)
      .select()
      .single();
    
    if (error) throw error;
    return result;
  }

  // Obtener análisis de metadatos por usuario
  static async getMetadataAnalysisByUser(userId: string) {
    const { data, error } = await supabase
      .from('metadata_analysis')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  // Crear auditoría de contenido
  static async createContentAudit(data: Inserts<'content_audit'>) {
    const { data: result, error } = await supabase
      .from('content_audit')
      .insert(data)
      .select()
      .single();
    
    if (error) throw error;
    return result;
  }

  // Obtener auditoría de contenido por usuario
  static async getContentAuditByUser(userId: string) {
    const { data, error } = await supabase
      .from('content_audit')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  // Crear análisis de palabras clave
  static async createKeywordAnalysis(data: Inserts<'keyword_analysis'>) {
    const { data: result, error } = await supabase
      .from('keyword_analysis')
      .insert(data)
      .select()
      .single();
    
    if (error) throw error;
    return result;
  }

  // Obtener análisis de palabras clave por usuario
  static async getKeywordAnalysisByUser(userId: string) {
    const { data, error } = await supabase
      .from('keyword_analysis')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  // Crear verificación de enlaces
  static async createLinkVerification(data: Inserts<'link_verification'>) {
    const { data: result, error } = await supabase
      .from('link_verification')
      .insert(data)
      .select()
      .single();
    
    if (error) throw error;
    return result;
  }

  // Obtener verificación de enlaces por usuario
  static async getLinkVerificationByUser(userId: string) {
    const { data, error } = await supabase
      .from('link_verification')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  // Crear análisis de rendimiento
  static async createPerformanceAnalysis(data: Inserts<'performance_analysis'>) {
    const { data: result, error } = await supabase
      .from('performance_analysis')
      .insert(data)
      .select()
      .single();
    
    if (error) throw error;
    return result;
  }

  // Obtener análisis de rendimiento por usuario
  static async getPerformanceAnalysisByUser(userId: string) {
    const { data, error } = await supabase
      .from('performance_analysis')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  // Crear análisis de competencia
  static async createCompetitionAnalysis(data: Inserts<'competition_analysis'>) {
    const { data: result, error } = await supabase
      .from('competition_analysis')
      .insert(data)
      .select()
      .single();
    
    if (error) throw error;
    return result;
  }

  // Obtener análisis de competencia por usuario
  static async getCompetitionAnalysisByUser(userId: string) {
    const { data, error } = await supabase
      .from('competition_analysis')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  // Crear análisis blockchain
  static async createBlockchainAnalysis(data: Inserts<'blockchain_analysis'>) {
    const { data: result, error } = await supabase
      .from('blockchain_analysis')
      .insert(data)
      .select()
      .single();
    
    if (error) throw error;
    return result;
  }

  // Obtener análisis blockchain por usuario
  static async getBlockchainAnalysisByUser(userId: string) {
    const { data, error } = await supabase
      .from('blockchain_analysis')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  // Crear dashboard de asistente AI
  static async createAIAssistantDashboard(data: Inserts<'ai_assistant_dashboard'>) {
    const { data: result, error } = await supabase
      .from('ai_assistant_dashboard')
      .insert(data)
      .select()
      .single();
    
    if (error) throw error;
    return result;
  }

  // Obtener dashboard de asistente AI por usuario
  static async getAIAssistantDashboardByUser(userId: string) {
    const { data, error } = await supabase
      .from('ai_assistant_dashboard')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  // Crear análisis social web3
  static async createSocialWeb3Analysis(data: Inserts<'social_web3_analysis'>) {
    const { data: result, error } = await supabase
      .from('social_web3_analysis')
      .insert(data)
      .select()
      .single();
    
    if (error) throw error;
    return result;
  }

  // Obtener análisis social web3 por usuario
  static async getSocialWeb3AnalysisByUser(userId: string) {
    const { data, error } = await supabase
      .from('social_web3_analysis')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  // Crear indexer
  static async createIndexer(data: Inserts<'indexers'>) {
    const { data: result, error } = await supabase
      .from('indexers')
      .insert(data)
      .select()
      .single();
    
    if (error) throw error;
    return result;
  }

  // Obtener indexers por usuario
  static async getIndexersByUser(userId: string) {
    const { data, error } = await supabase
      .from('indexers')
      .select(`
        *,
        indexer_jobs(*),
        indexer_configs(*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  // Actualizar indexer
  static async updateIndexer(id: string, updates: Updates<'indexers'>) {
    const { data, error } = await supabase
      .from('indexers')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // Crear trabajo de indexer
  static async createIndexerJob(data: Inserts<'indexer_jobs'>) {
    const { data: result, error } = await supabase
      .from('indexer_jobs')
      .insert(data)
      .select()
      .single();
    
    if (error) throw error;
    return result;
  }

  // Actualizar trabajo de indexer
  static async updateIndexerJob(id: string, updates: Updates<'indexer_jobs'>) {
    const { data, error } = await supabase
      .from('indexer_jobs')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // Crear configuración de indexer
  static async createIndexerConfig(data: Inserts<'indexer_configs'>) {
    const { data: result, error } = await supabase
      .from('indexer_configs')
      .insert(data)
      .select()
      .single();
    
    if (error) throw error;
    return result;
  }

  // Crear pago de herramienta
  static async createToolPayment(data: Inserts<'tool_payments'>) {
    const { data: result, error } = await supabase
      .from('tool_payments')
      .insert(data)
      .select()
      .single();
    
    if (error) throw error;
    return result;
  }

  // Obtener pagos de herramientas por usuario
  static async getToolPaymentsByUser(userId: string) {
    const { data, error } = await supabase
      .from('tool_payments')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  // Actualizar pago de herramienta
  static async updateToolPayment(id: string, updates: Updates<'tool_payments'>) {
    const { data, error } = await supabase
      .from('tool_payments')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // Obtener o crear configuraciones de usuario
  static async getUserSettings(userId: string) {
    const { data, error } = await supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error && error.code === 'PGRST116') {
      // No existe, crear configuraciones por defecto
      return this.createUserSettings({ user_id: userId });
    }
    
    if (error) throw error;
    return data;
  }

  // Crear configuraciones de usuario
  static async createUserSettings(data: Inserts<'user_settings'>) {
    const { data: result, error } = await supabase
      .from('user_settings')
      .insert(data)
      .select()
      .single();
    
    if (error) throw error;
    return result;
  }

  // Actualizar configuraciones de usuario
  static async updateUserSettings(userId: string, updates: Updates<'user_settings'>) {
    const { data, error } = await supabase
      .from('user_settings')
      .update(updates)
      .eq('user_id', userId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // Crear historial de acciones
  static async createToolActionHistory(data: Inserts<'tool_action_history'>) {
    const { data: result, error } = await supabase
      .from('tool_action_history')
      .insert(data)
      .select()
      .single();
    
    if (error) throw error;
    return result;
  }

  // Obtener historial de acciones por usuario
  static async getToolActionHistoryByUser(userId: string, limit = 50) {
    const { data, error } = await supabase
      .from('tool_action_history')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    return data;
  }

  // Crear resumen de análisis
  static async createAnalysisSummary(data: Inserts<'analysis_summary'>) {
    const { data: result, error } = await supabase
      .from('analysis_summary')
      .insert(data)
      .select()
      .single();
    
    if (error) throw error;
    return result;
  }

  // Obtener resúmenes de análisis por usuario
  static async getAnalysisSummaryByUser(userId: string) {
    const { data, error } = await supabase
      .from('analysis_summary')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  // Actualizar resumen de análisis
  static async updateAnalysisSummary(id: string, updates: Updates<'analysis_summary'>) {
    const { data, error } = await supabase
      .from('analysis_summary')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // Obtener datos de blockchain (públicos)
  static async getBlocks(limit = 10) {
    const { data, error } = await supabase
      .from('blocks')
      .select('*')
      .order('block_number', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    return data;
  }

  static async getTransactionsByBlock(blockId: string) {
    const { data, error } = await supabase
      .from('transactions')
      .select(`
        *,
        events(*)
      `)
      .eq('block_id', blockId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  static async getTransactionByHash(txHash: string) {
    const { data, error } = await supabase
      .from('transactions')
      .select(`
        *,
        block:blocks(*),
        events(*)
      `)
      .eq('tx_hash', txHash)
      .single();
    
    if (error) throw error;
    return data;
  }
}