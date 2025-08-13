# RLS Security Fix Documentation

## Problem Description

The Supabase database linter detected that Row Level Security (RLS) is disabled on several public tables that are exposed to PostgREST. This creates a security vulnerability where unauthorized users could potentially access or modify data they shouldn't have access to.

### Affected Tables

The following tables were identified as having RLS disabled:

1. **`public.tool_data`** - Contains user-specific tool analysis data
2. **`public.indexers`** - Contains user-created blockchain indexers
3. **`public.indexer_jobs`** - Contains indexer job execution data
4. **`public.indexer_configs`** - Contains indexer configuration settings
5. **`public.blocks`** - Contains blockchain block data
6. **`public.transactions`** - Contains blockchain transaction data
7. **`public.events`** - Contains blockchain event data

## Security Implications

Without RLS enabled:
- Users could access other users' private tool data
- Users could modify or delete indexers they don't own
- Unauthorized access to sensitive configuration data
- Potential data breaches and privacy violations

## Solution Overview

The fix implements a comprehensive RLS strategy with different security models for different types of data:

### 1. User-Owned Data (Private)
- **Tables**: `tool_data`, `indexers`
- **Policy**: Users can only access their own data
- **Implementation**: Policies check `auth.uid() = user_id`

### 2. User-Related Data (Derived Access)
- **Tables**: `indexer_jobs`, `indexer_configs`
- **Policy**: Users can only access data related to their own indexers
- **Implementation**: Policies check ownership through indexer relationship

### 3. Public Blockchain Data (Read-Only Public)
- **Tables**: `blocks`, `transactions`, `events`
- **Policy**: Public read access, authenticated write access
- **Implementation**: Anyone can read, only authenticated users can write

## Implementation Details

### Security Policies Created

#### Tool Data Policies
```sql
-- Users can only access their own tool analysis data
CREATE POLICY "Users can view their own tool data" ON public.tool_data
  FOR SELECT USING (auth.uid() = user_id);
```

#### Indexer Policies
```sql
-- Users can only access indexers they created
CREATE POLICY "Users can view their own indexers" ON public.indexers
  FOR SELECT USING (auth.uid() = user_id);
```

#### Indexer Jobs/Configs Policies
```sql
-- Users can only access jobs/configs for their own indexers
CREATE POLICY "Users can view their indexer jobs" ON public.indexer_jobs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.indexers 
      WHERE indexers.id = indexer_jobs.indexer_id 
      AND indexers.user_id = auth.uid()
    )
  );
```

#### Blockchain Data Policies
```sql
-- Blockchain data is public for reading
CREATE POLICY "Anyone can view blocks" ON public.blocks
  FOR SELECT USING (true);

-- Only authenticated users can manage blockchain data
CREATE POLICY "Authenticated users can manage blocks" ON public.blocks
  FOR ALL USING (auth.role() = 'authenticated');
```

## How to Apply the Fix

### Step 1: Execute the SQL Script

1. Open your Supabase dashboard
2. Navigate to the SQL Editor
3. Copy and paste the contents of `fix-rls-security.sql`
4. Execute the script

### Step 2: Verify the Fix

Run the following query to check RLS status:

```sql
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN (
  'tool_data', 'indexers', 'indexer_jobs', 
  'indexer_configs', 'blocks', 'transactions', 'events'
)
ORDER BY tablename;
```

All tables should show `rowsecurity = true`.

### Step 3: Test the Policies

Test with different user contexts to ensure:
- Users can only see their own data
- Anonymous users can read public blockchain data
- Unauthorized access is properly blocked

## Additional Security Considerations

### 1. Database Permissions
- Granted appropriate permissions to `authenticated` role
- Limited `anon` role to read-only access for public data

### 2. Helper Functions
- Created `user_owns_indexer()` function for reusable ownership checks
- Function is marked as `SECURITY DEFINER` for proper execution context

### 3. Documentation
- Added comments to all policies for maintainability
- Clear naming convention for easy identification

## Monitoring and Maintenance

### Regular Checks
1. Run Supabase linter periodically to catch new RLS issues
2. Review policies when adding new tables
3. Test policies after schema changes

### Best Practices
1. Always enable RLS on new public tables
2. Create policies before inserting data
3. Test policies with different user roles
4. Document policy logic for team understanding

## Troubleshooting

### Common Issues

1. **Policy conflicts**: Ensure policies don't contradict each other
2. **Permission errors**: Check role permissions and policy logic
3. **Performance issues**: Add indexes for policy conditions if needed

### Testing Commands

```sql
-- Check if RLS is enabled
SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public';

-- List all policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies WHERE schemaname = 'public';

-- Test policy as specific user
SET ROLE authenticated;
SET request.jwt.claims TO '{"sub": "user-uuid-here"}';
SELECT * FROM tool_data; -- Should only show user's data
```

## Conclusion

This RLS implementation provides:
- ✅ Secure user data isolation
- ✅ Proper access control for related data
- ✅ Public access to blockchain data
- ✅ Comprehensive security coverage
- ✅ Maintainable and documented policies

The fix addresses all security vulnerabilities identified in the linter report while maintaining the functionality required by the application.