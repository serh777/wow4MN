# Guía de Despliegue en Netlify

## Variables de Entorno Requeridas

Para que el proyecto funcione correctamente en Netlify, debes configurar las siguientes variables de entorno en el dashboard de Netlify:

### Base de Datos
```
DATABASE_URL=postgresql://username:password@host:5432/database?schema=public
```

### Supabase (OPCIONAL - solo si necesitas autenticación)
```
# Estas variables son opcionales - el build funciona sin ellas
# Solo configúralas si necesitas funcionalidad de autenticación
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
```

### NextAuth
```
NEXTAUTH_SECRET=your-nextauth-secret
NEXTAUTH_URL=https://your-netlify-domain.netlify.app
```

### Blockchain RPC URLs
```
ETHEREUM_RPC_URL=https://eth-mainnet.g.alchemy.com/v2/your-api-key
GOERLI_RPC_URL=https://eth-goerli.g.alchemy.com/v2/your-api-key
```

### Configuración del Indexer
```
START_BLOCK=0
BATCH_SIZE=100
CONCURRENCY=1
RETRY_ATTEMPTS=3
RETRY_DELAY=1000
```

### API Keys
```
ANTHROPIC_API_KEY=your-anthropic-api-key
```

## Configuración de Netlify

### Configuración del Sitio
- **Base directory**: (dejar vacío)
- **Build command**: `npm run build`
- **Publish directory**: `out`
- **Functions directory**: (dejar vacío - Next.js API routes se manejan automáticamente)

### Configuración de Node.js
Asegúrate de que Netlify use Node.js 18 o superior:
- En el dashboard de Netlify, ve a Site settings > Environment variables
- Agrega: `NODE_VERSION` = `18.17.0`

## Archivos Modificados para el Despliegue

### 1. `package.json`
Se modificó el script de build para incluir la generación optimizada de Prisma:
```json
"build": "prisma generate --no-engine && next build"
```

**Nota**: El flag `--no-engine` optimiza el build para producción eliminando advertencias y reduciendo el tamaño del bundle.

### 2. `next.config.js`
Se agregó configuración para exportación estática:
```javascript
output: 'export',
trailingSlash: true,
distDir: 'out'
```

### 3. `prisma-test.ts`
Se corrigió la importación de PrismaClient:
```typescript
import { PrismaClient } from './src/generated/prisma'
```

## Solución de Problemas

### Error: "Command failed with exit code 1"
Este error generalmente se debe a:
1. Variables de entorno faltantes
2. Problemas con la generación del cliente Prisma
3. Errores de TypeScript

### Verificación Local
Antes de desplegar, siempre ejecuta:
```bash
npm run build
```

Si el build local funciona, el problema está en la configuración de Netlify.

## Notas Importantes

1. **Base de Datos**: Asegúrate de que tu base de datos PostgreSQL sea accesible desde Netlify
2. **Variables de Entorno**: Todas las variables deben estar configuradas en Netlify
3. **Prisma**: El cliente se genera automáticamente durante el build
4. **API Routes**: Se convierten automáticamente en Netlify Functions

## Comandos Útiles

```bash
# Limpiar y reconstruir
npm run clean
npm install
npm run build

# Generar cliente Prisma manualmente
npx prisma generate

# Verificar configuración
npm run lint
```