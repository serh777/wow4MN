# 🔒 Quick RLS Security Fix Guide

## Problem
Your Supabase database has **7 tables** with Row Level Security (RLS) **DISABLED**, creating security vulnerabilities.

## Files Created
- `fix-rls-security.sql` - The complete fix script
- `verify-rls-status.sql` - Verification script
- `RLS_SECURITY_FIX.md` - Detailed documentation

## 🚀 Quick Fix (3 Steps)

### Step 1: Apply the Fix
1. Open **Supabase Dashboard** → **SQL Editor**
2. Copy & paste content from `fix-rls-security.sql`
3. Click **Run** ▶️

### Step 2: Verify the Fix
1. In **SQL Editor**, copy & paste content from `verify-rls-status.sql`
2. Click **Run** ▶️
3. Check the **FINAL SUMMARY** - should show: 🎉 **RLS FIX SUCCESSFULLY APPLIED!**

### Step 3: Test (Optional)
1. Uncomment test queries in `verify-rls-status.sql`
2. Run tests to ensure security is working

## ✅ What Gets Fixed

| Table | Security Model | Access Control |
|-------|----------------|----------------|
| `tool_data` | Private | Users see only their data |
| `indexers` | Private | Users see only their indexers |
| `indexer_jobs` | Related | Users see jobs for their indexers |
| `indexer_configs` | Related | Users see configs for their indexers |
| `blocks` | Public Read | Anyone can read, auth users write |
| `transactions` | Public Read | Anyone can read, auth users write |
| `events` | Public Read | Anyone can read, auth users write |

## 🛡️ Security Policies Created

- **28 RLS policies** total
- **4 policies per private table** (SELECT, INSERT, UPDATE, DELETE)
- **2 policies per public table** (Public READ, Auth WRITE)
- **Helper function** for ownership checks
- **Role permissions** properly configured

## ⚠️ Important Notes

1. **Backup First**: Always backup your database before applying security changes
2. **Test Thoroughly**: Verify your application still works after applying RLS
3. **Monitor**: Check application logs for any permission errors
4. **Team Access**: Ensure team members understand the new security model

## 🔍 Troubleshooting

### If you see permission errors:
```sql
-- Check if user is authenticated
SELECT auth.uid(); -- Should return user ID, not null

-- Check table ownership
SELECT user_id FROM indexers WHERE id = 'your-indexer-id';
```

### If policies seem too restrictive:
- Review the detailed documentation in `RLS_SECURITY_FIX.md`
- Modify policies as needed for your specific use case
- Test changes thoroughly

## 📞 Need Help?

1. **Check logs**: Look for RLS-related errors in Supabase logs
2. **Review docs**: Read `RLS_SECURITY_FIX.md` for detailed explanations
3. **Test queries**: Use `verify-rls-status.sql` to diagnose issues
4. **Supabase docs**: https://supabase.com/docs/guides/auth/row-level-security

---

**🎯 Goal**: Transform your database from vulnerable to secure in under 5 minutes!

**✨ Result**: All 7 tables will have proper RLS enabled with appropriate security policies.