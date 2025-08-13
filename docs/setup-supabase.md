# Guía de Migración a Supabase

Esta guía te ayudará a migrar completamente de Prisma a Supabase para tu proyecto.

## Paso 1: Configurar Supabase

### 1.1 Crear proyecto en Supabase
1. Ve a [supabase.com](https://supabase.com)
2. Crea una nueva cuenta o inicia sesión
3. Crea un nuevo proyecto
4. Anota la URL del proyecto y la clave anónima

### 1.2 Ejecutar el script SQL
1. Ve a la sección "SQL Editor" en tu dashboard de Supabase
2. Copia y pega el contenido de `migration/supabase-migration.sql`
3. Ejecuta el script para crear todas las tablas y políticas RLS

## Paso 2: Configurar Variables de Entorno

### 2.1 Actualizar .env.local
Crea o actualiza tu archivo `.env.local` con las siguientes variables:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anonima_de_supabase
SUPABASE_SERVICE_ROLE_KEY=tu_clave_de_servicio_de_supabase

# NextAuth (opcional si usas Supabase Auth)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=tu_secreto_nextauth

# Blockchain (mantener si es necesario)
ETH_RPC_URL=tu_url_rpc_ethereum
POLYGON_RPC_URL=tu_url_rpc_polygon
BSC_RPC_URL=tu_url_rpc_bsc
ARBITRUM_RPC_URL=tu_url_rpc_arbitrum

# Indexer (mantener si es necesario)
INDEXER_ENABLED=true
INDEXER_INTERVAL=60000

# API Keys (mantener si es necesario)
OPENAI_API_KEY=tu_clave_openai
ANTHROPIC_API_KEY=tu_clave_anthropic

# Prisma (temporal durante la migración)
DATABASE_URL=tu_url_base_datos_prisma
```

### 2.2 Configurar variables en Netlify
En tu dashboard de Netlify, ve a Site settings > Environment variables y agrega:

```
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anonima_de_supabase
SUPABASE_SERVICE_ROLE_KEY=tu_clave_de_servicio_de_supabase
NETLIFY_NEXT_PLUGIN_SKIP=true
```

## Paso 3: Migrar Datos (Opcional)

Si tienes datos existentes en Prisma que quieres migrar:

### 3.1 Instalar dependencias temporales
```bash
npm install @prisma/client
```

### 3.2 Ejecutar migración de datos
```bash
npx ts-node migration/migrate-data.ts
```

### 3.3 Verificar migración
1. Ve a tu dashboard de Supabase
2. Revisa la sección "Table Editor"
3. Verifica que los datos se hayan migrado correctamente

## Paso 4: Actualizar el Código

### 4.1 Archivos ya actualizados
- ✅ `src/lib/supabase-client.ts` - Cliente de Supabase
- ✅ `src/lib/database.types.ts` - Tipos de TypeScript
- ✅ `src/contexts/AuthContext.tsx` - Contexto de autenticación

### 4.2 Archivos que necesitan actualización
Busca en tu código todas las referencias a:
- `import { prisma }` → Reemplazar con `import { supabase, SupabaseService }`
- `prisma.model.method()` → Reemplazar con `SupabaseService.method()`

### 4.3 Ejemplos de migración de código

#### Antes (Prisma):
```typescript
// Obtener usuario
const user = await prisma.user.findUnique({
  where: { id: userId }
});

// Crear análisis
const analysis = await prisma.metadataAnalysis.create({
  data: {
    userId,
    projectName,
    projectUrl,
    title,
    description,
    // ...
  }
});
```

#### Después (Supabase):
```typescript
// Obtener usuario
const user = await SupabaseService.getUser(userId);

// Crear análisis
const analysis = await SupabaseService.createMetadataAnalysis({
  user_id: userId,
  project_name: projectName,
  project_url: projectUrl,
  title,
  description,
  // ...
});
```

## Paso 5: Configurar Autenticación

### 5.1 Configurar proveedores de autenticación
En tu dashboard de Supabase:
1. Ve a Authentication > Providers
2. Configura los proveedores que necesites (Google, GitHub, etc.)
3. Configura las URLs de redirección

### 5.2 Configurar políticas RLS
Las políticas ya están incluidas en el script SQL, pero puedes personalizarlas:
1. Ve a Authentication > Policies
2. Revisa y ajusta las políticas según tus necesidades

## Paso 6: Probar la Aplicación

### 6.1 Desarrollo local
```bash
npm run dev
```

### 6.2 Verificar funcionalidades
- [ ] Registro de usuarios
- [ ] Inicio de sesión
- [ ] Creación de análisis
- [ ] Lectura de datos
- [ ] Actualización de datos
- [ ] Eliminación de datos

### 6.3 Despliegue en Netlify
```bash
npm run build
```

## Paso 7: Limpieza (Después de verificar que todo funciona)

### 7.1 Remover Prisma
```bash
npm uninstall prisma @prisma/client
rm -rf prisma/
```

### 7.2 Actualizar package.json
Remover scripts relacionados con Prisma:
- `db:generate`
- `db:push`
- `db:migrate`
- etc.

### 7.3 Limpiar variables de entorno
Remover `DATABASE_URL` de tus archivos de entorno.

## Solución de Problemas

### Error: "Failed to fetch"
- Verifica que `NEXT_PUBLIC_SUPABASE_URL` esté configurado correctamente
- Asegúrate de que `NETLIFY_NEXT_PLUGIN_SKIP=true` esté configurado en Netlify

### Error: "Invalid API key"
- Verifica que `NEXT_PUBLIC_SUPABASE_ANON_KEY` esté configurado correctamente
- Asegúrate de usar la clave anónima, no la clave de servicio para el cliente

### Error: "Row Level Security"
- Verifica que las políticas RLS estén configuradas correctamente
- Asegúrate de que el usuario esté autenticado antes de acceder a los datos

### Error de tipos TypeScript
- Asegúrate de que `src/lib/database.types.ts` esté importado correctamente
- Verifica que los tipos coincidan con tu esquema de Supabase

## Recursos Adicionales

- [Documentación de Supabase](https://supabase.com/docs)
- [Guía de migración de Prisma a Supabase](https://supabase.com/docs/guides/migrations/prisma)
- [Autenticación con Supabase](https://supabase.com/docs/guides/auth)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)