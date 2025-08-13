# Apply RLS Performance Fixes

## Current Status
Your verification report shows that **all 11 RLS policies need optimization**. None are currently using the optimized `(SELECT auth.uid())` format.

## Required Action
You need to apply the RLS performance fixes through the Supabase Dashboard SQL Editor.

## Steps to Fix

### 1. Access Supabase Dashboard
1. Go to [supabase.com/dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to **SQL Editor**

### 2. Apply the Performance Fix
1. Copy the entire content from `migration/fix-rls-performance-issues.sql`
2. Paste it into the SQL Editor
3. Click **Run** to execute the script

### 3. Verify the Fix
After applying the fix, run the verification script:

```sql
-- Verification Query
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
```

### 4. Expected Results
After applying the fix, you should see:
- **9 tables with RLS enabled**
- **9 total policies** (consolidated from 11)
- **9 optimized policies** (all using `(SELECT auth.uid())` format)
- **0 policies need optimization**
- **✅ All policies optimized** status

## What This Fix Does

### Performance Improvements
1. **Eliminates auth_rls_initplan warnings** - `auth.uid()` evaluated once per query instead of per row
2. **Reduces CPU usage** - Significant decrease in RLS policy evaluation overhead
3. **Improves query performance** - Especially on large datasets
4. **Consolidates policies** - Reduces from 11 to 9 policies by combining view/update permissions

### Technical Changes
- Wraps `auth.uid()` with `(SELECT auth.uid())` for UUID columns
- Wraps `auth.uid()` with `(SELECT auth.uid()::text)` for TEXT columns
- Consolidates multiple permissive policies into single `FOR ALL` policies
- Maintains the same security level while improving performance

## Tables Affected
1. `user_privacy_settings` - UUID user_id
2. `user_wallet_sessions` - UUID user_id  
3. `user_analysis_history` - UUID user_id
4. `user_search_queries` - UUID user_id
5. `user_usage_metrics` - UUID user_id
6. `tool_payments` - TEXT user_id (requires ::text cast)
7. `user_settings` - TEXT user_id (requires ::text cast)
8. `tool_action_history` - TEXT user_id (requires ::text cast)
9. `analysis_summary` - TEXT user_id (requires ::text cast)

## Alternative: Command Line (if available)
If you have `psql` or Supabase CLI installed:

```bash
# Using psql (if available)
psql $DATABASE_URL -f migration/fix-rls-performance-issues.sql

# Using Supabase CLI (if available)
supabase db reset
# Then apply your migrations
```

## Troubleshooting

If you encounter errors:

1. **Policy already exists**: The script includes `DROP POLICY IF EXISTS` statements
2. **Permission denied**: Ensure you're using a service role key with sufficient permissions
3. **Type mismatch**: The script handles both UUID and TEXT user_id columns appropriately

## Next Steps

After applying the fix:
1. Run the verification query to confirm all policies are optimized
2. Monitor query performance in your application
3. Check Supabase logs for any remaining warnings
4. Run your application tests to ensure functionality is preserved

---

**Note**: This fix maintains the same security model while significantly improving performance. All user data remains properly isolated and secure.