# Corrección de Error de Tipos en RLS Policies

## Problema Identificado

**Error:** `ERROR: 42883: operator does not exist: text = uuid`

### Causa del Error

El error se produce debido a una inconsistencia en los tipos de datos entre las tablas:

1. **Tablas con `user_id` como UUID:**
   - `user_privacy_settings`
   - `user_wallet_sessions`
   - `user_analysis_history`
   - `user_search_queries`
   - `user_usage_metrics`

2. **Tablas con `user_id` como TEXT:**
   - `tool_payments`
   - `user_settings`
   - `tool_action_history`
   - `analysis_summary`

### Función `auth.uid()`

La función `auth.uid()` de Supabase devuelve un tipo `UUID`, pero algunas tablas tienen la columna `user_id` definida como `TEXT`, causando el conflicto de tipos.

## Solución Aplicada

### Archivo de Corrección

**Archivo:** `migration/fix-rls-performance-issues.sql`

### Cambios Realizados

1. **Para tablas con `user_id` UUID:** Se mantiene `(SELECT auth.uid())`
2. **Para tablas con `user_id` TEXT:** Se convierte a `(SELECT auth.uid()::text)`

### Políticas Corregidas

```sql
-- Tablas con user_id como UUID (sin cambios)
CREATE POLICY "Users can manage own privacy settings" ON public.user_privacy_settings
  FOR ALL USING (user_id = (SELECT auth.uid()));

-- Tablas con user_id como TEXT (con conversión)
CREATE POLICY "Users can manage own tool payments" ON public.tool_payments
  FOR ALL USING (user_id = (SELECT auth.uid()::text));
```

## Instrucciones de Aplicación

### 1. Verificar el Estado Actual

```sql
-- Verificar tipos de columnas
SELECT 
  table_name,
  column_name,
  data_type
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND column_name = 'user_id'
  AND table_name IN (
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
ORDER BY table_name;
```

### 2. Aplicar la Corrección

```bash
# En Supabase SQL Editor
psql -f migration/fix-rls-performance-issues.sql
```

### 3. Verificar la Corrección

```sql
-- Verificar que las políticas se aplicaron correctamente
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

## Beneficios de la Corrección

1. **Elimina el error de tipos:** Resuelve el conflicto `text = uuid`
2. **Mejora el rendimiento:** Optimiza las políticas RLS
3. **Consolida políticas:** Reduce la cantidad de políticas múltiples
4. **Mantiene la seguridad:** Preserva el acceso restringido por usuario

## Notas Importantes

- **Backup recomendado:** Realizar backup antes de aplicar los cambios
- **Pruebas:** Verificar el funcionamiento después de la aplicación
- **Monitoreo:** Revisar logs para confirmar que no hay más errores de tipos

## Archivos Relacionados

- `migration/fix-rls-performance-issues.sql` - Script de corrección principal
- `migration/verify-rls-performance-fixes.sql` - Script de verificación
- `migration/fix-function-security.sql` - Correcciones de funciones de seguridad

## Contacto

Si encuentras problemas adicionales relacionados con tipos de datos, revisa:

1. La definición de las tablas en `migration/supabase-migration.sql`
2. La definición alternativa en `migration/prisma-to-supabase.sql`
3. Los tipos en `src/lib/database.types.ts`