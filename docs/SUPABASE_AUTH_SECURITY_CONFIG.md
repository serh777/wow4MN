# 🔐 Supabase Auth Security Configuration Guide

## Overview

This guide addresses the remaining security warnings that require manual configuration in the Supabase Dashboard. These settings cannot be fixed via SQL scripts and must be configured through the web interface.

## RLS Performance Issues (Resolved)

### Issue Types Addressed

#### 1. `auth_rls_initplan` Warnings
**Problem**: RLS policies were re-evaluating `auth.uid()` and `auth.role()` functions for each row, causing significant performance degradation on large datasets.

**Example Warning**:
```
auth_rls_initplan on table "public.users" for "anon" role and "SELECT" action
Replace auth.uid() with (select auth.uid()) in RLS policies to improve performance
```

**Solution**: Wrapped auth function calls with `(select auth.<function>())` to prevent re-evaluation:
```sql
-- Before (inefficient)
CREATE POLICY "Users can view own data" ON public.users
    FOR SELECT USING (auth.uid() = id);

-- After (optimized)
CREATE POLICY "Users can view own data" ON public.users
    FOR SELECT USING (id = (SELECT auth.uid()));
```

**Tables Affected**: users, metadata_analysis, content_audit, tool_data, keyword_analysis, link_verification, performance_analysis, competition_analysis, blockchain_analysis, ai_assistant_dashboard, social_web3_analysis, indexers, indexer_jobs, indexer_configs, user_settings, tool_action_history, analysis_summary, tool_payments, blocks, transactions, events

#### 2. `multiple_permissive_policies` Warnings
**Problem**: Multiple permissive RLS policies on the same table for the same action caused unnecessary policy evaluation overhead.

**Example Warning**:
```
multiple_permissive_policies on table "public.blocks" for "anon" role and "SELECT" action
Consider consolidating multiple permissive policies for better performance
```

**Solution**: Consolidated redundant policies into single, comprehensive policies:
```sql
-- Before (multiple policies)
CREATE POLICY "Anyone can view blocks" ON public.blocks FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage blocks" ON public.blocks FOR ALL USING (auth.role() = 'authenticated');

-- After (consolidated)
CREATE POLICY "Authenticated users can manage blocks" ON public.blocks
    FOR ALL USING ((SELECT auth.role()) = 'authenticated' OR (SELECT auth.role()) = 'anon');
```

**Tables Affected**: blocks, events, transactions

### Performance Benefits
- **Reduced CPU usage**: Auth functions evaluated once per query instead of per row
- **Improved scalability**: Better performance on large datasets
- **Lower latency**: Faster query execution times
- **Reduced policy overhead**: Fewer policies to evaluate per request

### Scripts Applied
1. **`fix-rls-performance-issues.sql`**: Comprehensive optimization of all affected RLS policies
2. **`verify-rls-performance-fixes.sql`**: Verification script to ensure optimizations were applied correctly

---

## Manual Configuration Required in Supabase Dashboard

The following security settings must be configured manually in your Supabase Dashboard:

### 🔐 1. OTP Expiry Settings
**Issue**: `auth_otp_long_expiry` - OTP expiry exceeds recommended threshold
**Location**: Authentication > Settings > Email
**Current Status**: ⚠️ OTP expiry set to more than 1 hour
**Action**: Set OTP expiry to less than 1 hour (recommended: 15-30 minutes)
**Impact**: Reduces window for OTP interception attacks
**Documentation**: [Supabase Security Guide](https://supabase.com/docs/guides/platform/going-into-prod#security)

### 🛡️ 2. Leaked Password Protection
**Issue**: `auth_leaked_password_protection` - Leaked password protection is currently disabled
**Location**: Authentication > Settings > Password
**Current Status**: ❌ Disabled
**Action**: Enable "Check for leaked passwords" option
**Impact**: Prevents users from using compromised passwords from HaveIBeenPwned.org database
**Documentation**: [Password Security Guide](https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection)

### 🔑 3. Multi-Factor Authentication (MFA)
**Issue**: `auth_insufficient_mfa_options` - Too few MFA options enabled
**Location**: Authentication > Settings > Multi-Factor Authentication
**Current Status**: ⚠️ Insufficient MFA methods enabled
**Action**: Enable additional MFA methods:
  - TOTP (Time-based One-Time Password)
  - SMS verification
  - Phone verification
  - WebAuthn/FIDO2
**Impact**: Strengthens account security with multiple authentication factors
**Documentation**: [MFA Configuration Guide](https://supabase.com/docs/guides/auth/auth-mfa)

## Detailed Configuration Steps

### 1. 🕐 Fix OTP Long Expiry (`auth_otp_long_expiry`)

**Current Issue**: OTP expiry set to more than 1 hour
**Target**: Reduce to less than 1 hour for better security

**Steps to Fix**:
1. Go to your Supabase Dashboard
2. Navigate to **Authentication** > **Settings**
3. Click on **Email** tab
4. Find **"OTP expiry"** setting
5. Change the value from current setting to **1800 seconds (30 minutes)** or **900 seconds (15 minutes)**
6. Click **Save**

**✅ Security Benefit**: Reduces the time window for potential OTP interception attacks.

---

### 2. 🛡️ Enable Leaked Password Protection (`auth_leaked_password_protection`)

**Current Issue**: Leaked password protection is disabled
**Target**: Enable protection against compromised passwords

**Steps to Fix**:
1. Go to your Supabase Dashboard
2. Navigate to **Authentication** > **Settings**
3. Click on **Password** tab
4. Find **"Password strength"** section
5. Enable **"Check for leaked passwords"** toggle
6. Click **Save**

**✅ Security Benefit**: Prevents users from using passwords compromised in data breaches (checked against HaveIBeenPwned.org).

---

### 3. 🔑 Enable More MFA Options (`auth_insufficient_mfa_options`)

**Current Issue**: Too few MFA methods enabled
**Target**: Enable multiple MFA options for stronger security

**Steps to Fix**:
1. Go to your Supabase Dashboard
2. Navigate to **Authentication** > **Settings**
3. Click on **Multi-Factor Authentication** tab
4. Enable the following MFA methods:
   - ✅ **TOTP (Time-based One-Time Password)**: For authenticator apps like Google Authenticator, Authy
   - ✅ **Phone**: For SMS verification
   - ✅ **WebAuthn**: For hardware security keys (YubiKey, etc.)
5. Configure enrollment settings for each method
6. Set MFA enforcement policies if needed
7. Click **Save**

**✅ Security Benefit**: Provides multiple authentication factors, significantly reducing account takeover risks.

## Database Security Fixes (Already Applied)

The following security issues have been automatically fixed via SQL scripts:

### 1. Function Security (`fix-security-warnings.sql`)
- ✅ **Insecure search_path in functions**: Fixed by setting `search_path = public` and `SECURITY DEFINER` for:
  - `update_updated_at_column()` function
  - `user_owns_indexer()` function
- ✅ **Safe application**: Functions are only modified if they exist and need fixing
- ✅ **Non-destructive**: Existing function logic is preserved

### 2. Extension Security
- ✅ **pg_trgm extension in public schema**: Safely moved to dedicated `extensions` schema
- ✅ **Created secure extensions schema** with proper permissions
- ✅ **Smart migration**: Only moves extension if it exists in public schema
- ✅ **Rollback available**: `rollback-security-fixes.sql` provided for emergency reversion

### 3. RLS Performance Optimization
- ✅ **auth_rls_initplan warnings**: Fixed auth function re-evaluation in RLS policies
- ✅ **multiple_permissive_policies warnings**: Consolidated redundant permissive policies
- ✅ **Query performance**: Optimized RLS policies for better scalability

### 4. Safety Measures
- ✅ **Non-destructive operations**: All changes check existing state before applying
- ✅ **Detailed logging**: Each operation provides clear status messages
- ✅ **Rollback script**: Complete reversion capability if needed
- ✅ **Verification script**: `verify-security-fixes.sql` confirms all changes

### 4. Row Level Security
- ✅ **RLS Policies**: All tables have proper Row Level Security enabled

## Configuration Checklist

### Auth Settings to Configure:

- [ ] **OTP Expiry**: Set to ≤ 1 hour (recommended: 30 minutes)
- [ ] **Leaked Password Protection**: Enable
- [ ] **MFA Options**: Enable TOTP at minimum
- [ ] **Password Strength**: Verify minimum requirements are set
- [ ] **Session Timeout**: Configure appropriate session duration

### Verification Steps:

1. **Run Database Verification**:
   ```sql
   -- Execute verify-security-fixes.sql in Supabase SQL Editor
   ```

2. **Test Auth Settings**:
   - Try registering with a weak/leaked password (should be blocked)
   - Test OTP expiry timing
   - Verify MFA enrollment works

3. **Monitor Security**:
   - Check auth logs for suspicious activity
   - Review failed login attempts
   - Monitor MFA usage

## Recommended Security Settings

### Password Policy:
```
Minimum Length: 8 characters
Require: Uppercase, lowercase, numbers, special characters
Leaked Password Protection: Enabled
```

### Session Management:
```
Session Timeout: 24 hours (adjust based on your needs)
Refresh Token Rotation: Enabled
Reuse Interval: 10 seconds
```

### MFA Configuration:
```
TOTP: Enabled (primary recommendation)
Phone/SMS: Optional (based on user base)
WebAuthn: Enabled (for advanced users)
```

### OTP Settings:
```
Email OTP Expiry: 1800 seconds (30 minutes)
Phone OTP Expiry: 300 seconds (5 minutes)
```

## Security Best Practices

### 1. Regular Security Reviews
- Run Supabase linter monthly
- Review auth logs weekly
- Update security settings as needed

### 2. User Education
- Inform users about MFA benefits
- Provide clear instructions for setup
- Communicate security policy changes

### 3. Monitoring
- Set up alerts for failed login attempts
- Monitor unusual authentication patterns
- Track MFA adoption rates

### 4. Backup and Recovery
- Document all security configurations
- Test auth recovery procedures
- Maintain emergency access procedures

## Troubleshooting

### Common Issues:

1. **Users can't receive OTP emails**:
   - Check email provider configuration
   - Verify SMTP settings
   - Check spam folders

2. **MFA enrollment fails**:
   - Verify TOTP app compatibility
   - Check time synchronization
   - Test with different authenticator apps

3. **Password validation too strict**:
   - Review password policy settings
   - Adjust requirements if needed
   - Provide clear password guidelines

## Support Resources

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [MFA Setup Guide](https://supabase.com/docs/guides/auth/auth-mfa)
- [Password Security](https://supabase.com/docs/guides/auth/password-security)
- [Database Linter](https://supabase.com/docs/guides/database/database-linter)

---

## Summary

**Database Security**: ✅ **COMPLETE** (via SQL scripts)
**Auth Security**: ⚠️ **REQUIRES MANUAL CONFIGURATION**

**Next Steps**:
1. Apply database fixes: `fix-security-warnings.sql`
2. Apply RLS performance fixes: `fix-rls-performance-issues.sql`
3. Verify database fixes: `verify-security-fixes.sql`
4. Verify RLS performance fixes: `verify-rls-performance-fixes.sql`
5. Configure auth settings in Supabase Dashboard (this guide)
6. Test all security features
7. Monitor and maintain security settings

**Goal**: Achieve comprehensive security coverage for your Supabase project! 🎯