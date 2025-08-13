# Instrucciones para Migración de Prisma a Supabase

## Pasos para completar la migración

### 1. Acceder al SQL Editor de Supabase

1. Ve a tu proyecto en [Supabase Dashboard](https://app.supabase.com)
2. En el menú lateral, selecciona **SQL Editor**
3. Haz clic en **New Query** para crear una nueva consulta

### 2. Ejecutar el script de migración

1. Abre el archivo `prisma-to-supabase.sql` que se encuentra en la carpeta `migration/`
2. Copia todo el contenido del archivo
3. Pégalo en el SQL Editor de Supabase
4. Haz clic en **Run** para ejecutar el script

### 3. Verificar la migración

Después de ejecutar el script, verifica que todas las tablas se hayan creado correctamente:

```sql
-- Verificar que todas las tablas existen
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

Deberías ver las siguientes tablas:
- `users`
- `tool_data`
- `metadata_analysis`
- `content_audit`
- `keyword_analysis`
- `link_verification`
- `performance_analysis`
- `competition_analysis`
- `blockchain_analysis`
- `ai_assistant_dashboard`
- `social_web3_analysis`
- `indexers`
- `indexer_jobs`
- `indexer_configs`
- `blocks`
- `transactions`
- `events`
- `tool_payments`
- `user_settings`
- `tool_action_history`
- `analysis_summary`

### 4. Configurar Row Level Security (RLS)

Para mayor seguridad, habilita RLS en las tablas principales:

```sql
-- Habilitar RLS en tablas de usuarios
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE tool_action_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE analysis_summary ENABLE ROW LEVEL SECURITY;

-- Habilitar RLS en tablas de análisis
ALTER TABLE metadata_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_audit ENABLE ROW LEVEL SECURITY;
ALTER TABLE keyword_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE link_verification ENABLE ROW LEVEL SECURITY;
ALTER TABLE performance_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE competition_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE blockchain_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_assistant_dashboard ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_web3_analysis ENABLE ROW LEVEL SECURITY;

-- Habilitar RLS en tablas de pagos
ALTER TABLE tool_payments ENABLE ROW LEVEL SECURITY;
```

### 5. Crear políticas de seguridad básicas

```sql
-- Política para que los usuarios solo vean sus propios datos
CREATE POLICY "Users can view own data" ON users
    FOR ALL USING (auth.uid()::text = id);

CREATE POLICY "Users can view own analysis" ON metadata_analysis
    FOR ALL USING (auth.uid()::text = user_id);

CREATE POLICY "Users can view own content audit" ON content_audit
    FOR ALL USING (auth.uid()::text = user_id);

CREATE POLICY "Users can view own keyword analysis" ON keyword_analysis
    FOR ALL USING (auth.uid()::text = user_id);

CREATE POLICY "Users can view own link verification" ON link_verification
    FOR ALL USING (auth.uid()::text = user_id);

CREATE POLICY "Users can view own performance analysis" ON performance_analysis
    FOR ALL USING (auth.uid()::text = user_id);

CREATE POLICY "Users can view own competition analysis" ON competition_analysis
    FOR ALL USING (auth.uid()::text = user_id);

CREATE POLICY "Users can view own blockchain analysis" ON blockchain_analysis
    FOR ALL USING (auth.uid()::text = user_id);

CREATE POLICY "Users can view own AI dashboard" ON ai_assistant_dashboard
    FOR ALL USING (auth.uid()::text = user_id);

CREATE POLICY "Users can view own social analysis" ON social_web3_analysis
    FOR ALL USING (auth.uid()::text = user_id);

CREATE POLICY "Users can view own payments" ON tool_payments
    FOR ALL USING (auth.uid()::text = user_id);

CREATE POLICY "Users can view own settings" ON user_settings
    FOR ALL USING (auth.uid()::text = user_id);

CREATE POLICY "Users can view own action history" ON tool_action_history
    FOR ALL USING (auth.uid()::text = user_id);

CREATE POLICY "Users can view own analysis summary" ON analysis_summary
    FOR ALL USING (auth.uid()::text = user_id);
```

### 6. Actualizar variables de entorno

Asegúrate de que tu archivo `.env` tenga las variables correctas de Supabase:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=tu_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key
DATABASE_URL=postgresql://postgres:[password]@[host]:[port]/[database]
```

### 7. Probar la conexión

Después de completar la migración, ejecuta:

```bash
npm run dev
```

Y verifica que la aplicación se conecte correctamente a Supabase.

## Notas importantes

### Diferencias entre Prisma y Supabase

1. **Nombres de campos**: Prisma usa camelCase, Supabase usa snake_case
2. **Tipos de datos**: 
   - `Json` en Prisma → `JSONB` en PostgreSQL
   - `DateTime` en Prisma → `TIMESTAMP WITH TIME ZONE` en PostgreSQL
   - `BigInt` en Prisma → `BIGINT` en PostgreSQL

### Funcionalidades añadidas

1. **Triggers automáticos**: Para actualizar `updated_at` automáticamente
2. **Índices**: Para mejorar el rendimiento de consultas
3. **Extensiones**: UUID y pg_trgm para búsquedas avanzadas
4. **Comentarios**: Documentación de cada tabla

### Próximos pasos

1. Migrar datos existentes si los hay
2. Actualizar el código de la aplicación para usar snake_case
3. Configurar backups automáticos en Supabase
4. Configurar monitoreo y alertas

## Solución de problemas

### Error: "relation already exists"
Si ves este error, significa que algunas tablas ya existen. Puedes:
1. Eliminar las tablas existentes primero
2. O modificar el script para usar `CREATE TABLE IF NOT EXISTS`

### Error de permisos
Asegúrate de estar usando una cuenta con permisos de administrador en Supabase.

### Error de conexión
Verifica que las variables de entorno estén correctamente configuradas.

---

**¡La migración está lista para ejecutarse!** 🚀

Si encuentras algún problema, revisa los logs de Supabase y verifica que todas las dependencias estén correctamente configuradas.