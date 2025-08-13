-- =====================================================
-- Verify RLS Performance Fixes
-- =====================================================
-- This script verifies that all RLS performance optimizations
-- have been applied correctly and checks for remaining issues.
-- =====================================================

-- Check if RLS is enabled on all required tables
SELECT 
  schemaname,
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables 
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
ORDER BY tablename;

-- =====================================================
-- Check current RLS policies
-- =====================================================
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
-- Count policies per table to detect multiple permissive policies
-- =====================================================
SELECT 
  tablename,
  cmd as action,
  COUNT(*) as policy_count,
  CASE 
    WHEN COUNT(*) > 1 THEN '⚠️  Multiple policies detected'
    ELSE '✅ Single policy'
  END as status
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
GROUP BY tablename, cmd
HAVING COUNT(*) > 1
ORDER BY tablename, cmd;

-- =====================================================
-- Check for auth.uid() usage in policies (should be optimized)
-- =====================================================
SELECT 
  schemaname,
  tablename,
  policyname,
  qual,
  CASE 
    WHEN qual LIKE '%auth.uid()%' AND qual NOT LIKE '%(SELECT auth.uid())%' THEN '⚠️  Needs optimization'
    WHEN qual LIKE '%(SELECT auth.uid())%' THEN '✅ Optimized'
    ELSE '❓ Check manually'
  END as optimization_status
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
  AND qual IS NOT NULL
ORDER BY tablename, policyname;

-- =====================================================
-- Summary Report
-- =====================================================
WITH policy_summary AS (
  SELECT 
    COUNT(DISTINCT tablename) as tables_with_rls,
    COUNT(*) as total_policies,
    COUNT(CASE WHEN qual LIKE '%(SELECT auth.uid())%' THEN 1 END) as optimized_policies,
    COUNT(CASE WHEN qual LIKE '%auth.uid()%' AND qual NOT LIKE '%(SELECT auth.uid())%' THEN 1 END) as unoptimized_policies
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
)
SELECT 
  '📊 RLS Performance Fix Summary' as report_section,
  tables_with_rls || ' tables with RLS enabled' as tables_status,
  total_policies || ' total policies' as policies_count,
  optimized_policies || ' optimized policies' as optimized_count,
  unoptimized_policies || ' policies need optimization' as needs_work,
  CASE 
    WHEN unoptimized_policies = 0 THEN '✅ All policies optimized!'
    ELSE '⚠️  Some policies need optimization'
  END as overall_status
FROM policy_summary;

-- =====================================================
-- Expected Results After Fix
-- =====================================================
/*
After running fix-rls-performance-issues.sql, you should see:

1. ✅ All tables have RLS enabled
2. ✅ Each table has only ONE policy per action type
3. ✅ All policies use (SELECT auth.uid()) instead of auth.uid()
4. ✅ No multiple permissive policies warnings
5. ✅ No auth_rls_initplan warnings

If any issues remain:
- Re-run the fix script
- Check for typos in policy names
- Verify the policies were dropped before recreation
- Run Supabase linter to confirm warnings are resolved
*/