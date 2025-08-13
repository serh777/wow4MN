-- =====================================================
-- Fix RLS Performance Issues
-- =====================================================
-- This script addresses auth_rls_initplan warnings by optimizing
-- RLS policies to prevent re-evaluation of auth functions per row.
--
-- Issue: auth.uid() and auth.role() are being re-evaluated for each row
-- Solution: Wrap auth functions with (select auth.<function>())
-- =====================================================

-- Drop existing policies that have performance issues
DROP POLICY IF EXISTS "Users can view own privacy settings" ON public.user_privacy_settings;
DROP POLICY IF EXISTS "Users can update own privacy settings" ON public.user_privacy_settings;
DROP POLICY IF EXISTS "Users can view own wallet sessions" ON public.user_wallet_sessions;
DROP POLICY IF EXISTS "Users can update own wallet sessions" ON public.user_wallet_sessions;
DROP POLICY IF EXISTS "Users can view own analysis history" ON public.user_analysis_history;
DROP POLICY IF EXISTS "Users can manage own analysis history" ON public.user_analysis_history;
DROP POLICY IF EXISTS "Users can view own search queries" ON public.user_search_queries;
DROP POLICY IF EXISTS "Users can manage own search queries" ON public.user_search_queries;
DROP POLICY IF EXISTS "Users can view own usage metrics" ON public.user_usage_metrics;
DROP POLICY IF EXISTS "Users can manage own usage metrics" ON public.user_usage_metrics;
DROP POLICY IF EXISTS "Users can view own payments" ON public.tool_payments;
DROP POLICY IF EXISTS "Users can manage own tool payments" ON public.tool_payments;
DROP POLICY IF EXISTS "Users can manage own settings" ON public.user_settings;
DROP POLICY IF EXISTS "Users can view own action history" ON public.tool_action_history;
DROP POLICY IF EXISTS "Users can manage own action history" ON public.tool_action_history;
DROP POLICY IF EXISTS "Users can manage own analysis summary" ON public.analysis_summary;

-- =====================================================
-- OPTIMIZED RLS POLICIES
-- =====================================================
-- Consolidating multiple permissive policies into single policies
-- for better performance and reduced policy evaluation overhead

-- User Privacy Settings (consolidated policy)
CREATE POLICY "Users can manage own privacy settings" ON public.user_privacy_settings
  FOR ALL USING (user_id = (SELECT auth.uid()));

-- User Wallet Sessions (consolidated policy)
CREATE POLICY "Users can manage own wallet sessions" ON public.user_wallet_sessions
  FOR ALL USING (user_id = (SELECT auth.uid()));

-- User Analysis History (consolidated policy)
CREATE POLICY "Users can manage own analysis history" ON public.user_analysis_history
  FOR ALL USING (user_id = (SELECT auth.uid()));

-- User Search Queries (consolidated policy)
CREATE POLICY "Users can manage own search queries" ON public.user_search_queries
  FOR ALL USING (user_id = (SELECT auth.uid()));

-- User Usage Metrics (consolidated policy)
CREATE POLICY "Users can manage own usage metrics" ON public.user_usage_metrics
  FOR ALL USING (user_id = (SELECT auth.uid()));

-- Tool Payments (consolidated policy)
CREATE POLICY "Users can manage own tool payments" ON public.tool_payments
  FOR ALL USING (user_id = (SELECT auth.uid()::text));

-- User Settings
CREATE POLICY "Users can manage own settings" ON public.user_settings
  FOR ALL USING (user_id = (SELECT auth.uid()::text));

-- Tool Action History (consolidated policy)
CREATE POLICY "Users can manage own action history" ON public.tool_action_history
  FOR ALL USING (user_id = (SELECT auth.uid()::text));

-- Analysis Summary
CREATE POLICY "Users can manage own analysis summary" ON public.analysis_summary
  FOR ALL USING (user_id = (SELECT auth.uid()::text));

-- =====================================================
-- VERIFICATION QUERY
-- =====================================================
-- Run this query to verify all policies are correctly applied
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies 
WHERE schemaname = 'public' 
  AND tablename IN (
    'user_privacy_settings',
    'user_wallet_sessions', 
    'user_analysis_history',
    'user_search_queries',
    'user_usage_metrics',
    'tool_payments',
    'user_settings',
    'tool_action_history',
    'analysis_summary'
  )
ORDER BY tablename, policyname;

-- =====================================================
-- PERFORMANCE NOTES
-- =====================================================
-- After applying these changes:
-- 1. auth.uid() will be evaluated once per query instead of per row
-- 2. Query performance should improve significantly on large datasets
-- 3. CPU usage should decrease for RLS policy evaluation
-- 4. The auth_rls_initplan warnings should be resolved
--
-- To monitor performance:
-- - Check query execution plans with EXPLAIN ANALYZE
-- - Monitor auth function call frequency in logs
-- - Run Supabase linter to verify warnings are resolved
-- =====================================================