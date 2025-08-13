'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase-client';
import { toast } from 'react-hot-toast';
import { Database } from '@/lib/database.types';

interface PrivacySettings {
  saveAnalysisHistory: boolean;
  saveSearchQueries: boolean;
  saveUsageMetrics: boolean;
  allowPersonalization: boolean;
  dataRetentionDays: number;
}

interface UsageStats {
  totalAnalyses: number;
  totalSearches: number;
  lastActivity: string | null;
  accountAge: number; // días desde creación
  connectionCount: number;
}

const DEFAULT_SETTINGS: PrivacySettings = {
  saveAnalysisHistory: true,
  saveSearchQueries: false,
  saveUsageMetrics: true,
  allowPersonalization: true,
  dataRetentionDays: 90
};

export function usePrivacy() {
  const { user, trackUserActivity, getPrivacySettings } = useAuth();
  const [settings, setSettings] = useState<PrivacySettings>(DEFAULT_SETTINGS);
  const [usageStats, setUsageStats] = useState<UsageStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Cargar configuración de privacidad
  const loadSettings = useCallback(async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const data = await getPrivacySettings();
      if (data) {
        setSettings({
          saveAnalysisHistory: data.save_analysis_history ?? true,
          saveSearchQueries: data.save_search_queries ?? false,
          saveUsageMetrics: data.save_usage_metrics ?? true,
          allowPersonalization: data.allow_personalization ?? true,
          dataRetentionDays: data.data_retention_days ?? 90
        });
      }
    } catch (error) {
      console.error('Error loading privacy settings:', error);
    } finally {
      setLoading(false);
    }
  }, [user, getPrivacySettings]);

  // Cargar estadísticas de uso
  const loadUsageStats = useCallback(async () => {
    if (!user) return;
    
    try {
      // Obtener estadísticas de análisis
      const { data: analysisData } = await supabase
        .from('analysis_history')
        .select('id')
        .eq('user_id', user.id);

      // Obtener estadísticas de búsquedas
      const { data: searchData } = await supabase
        .from('search_queries')
        .select('id')
        .eq('user_id', user.id);

      // Obtener información de sesión de wallet
      const { data: sessionData } = await supabase
        .from('wallet_sessions')
        .select('session_start, session_end, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      // Obtener última actividad
      const { data: lastActivityData } = await supabase
        .from('usage_metrics')
        .select('created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      // Calcular edad de la cuenta
      const accountCreated = new Date(user.created_at);
      const accountAge = Math.floor((Date.now() - accountCreated.getTime()) / (1000 * 60 * 60 * 24));

      setUsageStats({
        totalAnalyses: analysisData?.length || 0,
        totalSearches: searchData?.length || 0,
        lastActivity: lastActivityData?.created_at || sessionData?.session_end || null,
        accountAge,
        connectionCount: 1
      });
    } catch (error) {
      console.error('Error loading usage stats:', error);
    }
  }, [user]);

  // Guardar configuración de privacidad
  const saveSettings = useCallback(async (newSettings: PrivacySettings) => {
    if (!user) return false;
    
    setSaving(true);
    try {
      const { error } = await supabase
        .from('user_privacy_settings')
        .upsert({
          user_id: user.id,
          save_analysis_history: newSettings.saveAnalysisHistory,
          save_search_queries: newSettings.saveSearchQueries,
          save_usage_metrics: newSettings.saveUsageMetrics,
          allow_personalization: newSettings.allowPersonalization,
          data_retention_days: newSettings.dataRetentionDays,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
      
      setSettings(newSettings);
      toast.success('Configuración de privacidad guardada');
      
      // Rastrear cambio de configuración
      await trackUserActivity('privacy_settings_updated', {
        changes: newSettings
      });
      
      return true;
    } catch (error) {
      console.error('Error saving privacy settings:', error);
      toast.error('Error al guardar la configuración');
      return false;
    } finally {
      setSaving(false);
    }
  }, [user, trackUserActivity]);

  // Eliminar todos los datos del usuario
  const deleteAllData = useCallback(async () => {
    if (!user) return false;
    
    const confirmed = window.confirm(
      '¿Estás seguro de que quieres eliminar todos tus datos? Esta acción no se puede deshacer.'
    );
    
    if (!confirmed) return false;
    
    setSaving(true);
    try {
      // Eliminar configuraciones de privacidad
      await supabase
        .from('user_privacy_settings')
        .delete()
        .eq('user_id', user.id);

      // Eliminar historial de análisis
      await supabase
        .from('analysis_history')
        .delete()
        .eq('user_id', user.id);

      // Eliminar consultas de búsqueda
      await supabase
        .from('search_queries')
        .delete()
        .eq('user_id', user.id);

      // Eliminar métricas de uso
      await supabase
        .from('usage_metrics')
        .delete()
        .eq('user_id', user.id);

      // Eliminar sesiones de wallet
      await supabase
        .from('wallet_sessions')
        .delete()
        .eq('user_id', user.id);
      
      // Actualizar estadísticas
      await loadUsageStats();
      
      toast.success('Todos tus datos han sido eliminados');
      return true;
    } catch (error) {
      console.error('Error deleting user data:', error);
      toast.error('Error al eliminar los datos');
      return false;
    } finally {
      setSaving(false);
    }
  }, [user, loadUsageStats]);

  // Exportar datos del usuario
  const exportUserData = useCallback(async () => {
    if (!user) return null;
    
    try {
      const exportData: any = {
        user_info: {
          id: user.id,
          email: user.email,
          created_at: user.created_at,
          auth_method: user.user_metadata?.auth_method
        },
        privacy_settings: settings,
        usage_stats: usageStats
      };

      // Obtener datos si el usuario permite
      if (settings.saveAnalysisHistory) {
        const { data: analysisData } = await supabase
          .from('analysis_history')
          .select('*')
          .eq('user_id', user.id);
        exportData.analysis_history = analysisData;
      }

      if (settings.saveSearchQueries) {
        const { data: searchData } = await supabase
          .from('search_queries')
          .select('*')
          .eq('user_id', user.id);
        exportData.search_queries = searchData;
      }

      if (settings.saveUsageMetrics) {
        const { data: metricsData } = await supabase
          .from('usage_metrics')
          .select('*')
          .eq('user_id', user.id);
        exportData.usage_metrics = metricsData;
      }

      // Crear y descargar archivo JSON
      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: 'application/json'
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `wowseo-data-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success('Datos exportados exitosamente');
      
      // Rastrear exportación
      await trackUserActivity('data_exported', {
        export_date: new Date().toISOString(),
        data_types: Object.keys(exportData)
      });
      
      return exportData;
    } catch (error) {
      console.error('Error exporting user data:', error);
      toast.error('Error al exportar los datos');
      return null;
    }
  }, [user, settings, usageStats, trackUserActivity]);

  // Actualizar configuración específica
  const updateSetting = useCallback((key: keyof PrivacySettings, value: boolean | number) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  }, []);

  // Verificar si se puede rastrear actividad
  const canTrackActivity = useCallback((activityType: 'analysis' | 'search' | 'metrics') => {
    switch (activityType) {
      case 'analysis':
        return settings.saveAnalysisHistory;
      case 'search':
        return settings.saveSearchQueries;
      case 'metrics':
        return settings.saveUsageMetrics;
      default:
        return false;
    }
  }, [settings]);

  // Cargar datos al montar el componente
  useEffect(() => {
    if (user) {
      loadSettings();
      loadUsageStats();
    }
  }, [user, loadSettings, loadUsageStats]);

  return {
    // Estado
    settings,
    usageStats,
    loading,
    saving,
    
    // Acciones
    saveSettings,
    deleteAllData,
    exportUserData,
    updateSetting,
    loadSettings,
    loadUsageStats,
    
    // Utilidades
    canTrackActivity,
    
    // Estado de usuario
    isAuthenticated: !!user
  };
}