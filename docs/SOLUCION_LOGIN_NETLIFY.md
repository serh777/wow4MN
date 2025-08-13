# Solución para Problemas de Login en Netlify

## Diagnóstico del Problema

Después de analizar tu código, he identificado varios problemas que pueden estar causando que el login no funcione en Netlify:

### 1. Variables de Entorno Faltantes

Comparando tu `.env.local` con `.env.example` y `.env.netlify`, faltan estas variables críticas:

**Variables faltantes en .env.local:**
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`
- `DATABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY` (tienes una clave de ejemplo)

### 2. Configuración de Supabase

Tu configuración actual tiene:
- URL de Supabase: `https://anbwbrqzffijhcznouwt.supabase.co`
- Clave ANON con valor de ejemplo (no real)
- Service Role Key con valor de ejemplo

### 3. Problemas de Middleware

El middleware está buscando tokens en cookies con nombres específicos que pueden no coincidir con los que usa Supabase.

## Soluciones

### Paso 1: Actualizar Variables de Entorno en Netlify

1. **Accede a tu dashboard de Netlify:**
   - Ve a tu proyecto en Netlify
   - Settings > Build & Deploy > Environment variables

2. **Agrega/actualiza estas variables:**

```bash
# Supabase (CRÍTICO)
NEXT_PUBLIC_SUPABASE_URL=https://anbwbrqzffijhcznouwt.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[TU_CLAVE_REAL_DE_SUPABASE]
SUPABASE_SERVICE_ROLE_KEY=[TU_SERVICE_ROLE_KEY_REAL]

# NextAuth (REQUERIDO)
NEXTAUTH_SECRET=[GENERA_UNA_CLAVE_SECRETA_FUERTE]
NEXTAUTH_URL=https://tu-dominio.netlify.app

# Base de datos
DATABASE_URL=[TU_URL_DE_BASE_DE_DATOS]

# Email (ya tienes esto)
RESEND_API_KEY=re_6MYhm814_PduTFu9Hgw1SEY8hz2JAeaXF
```

### Paso 2: Obtener las Claves Reales de Supabase

1. **Ve a tu proyecto en Supabase:**
   - https://supabase.com/dashboard/project/anbwbrqzffijhcznouwt

2. **Obtén las claves reales:**
   - Settings > API
   - Copia `anon public` key
   - Copia `service_role` key (¡MANTÉN ESTA SECRETA!)

### Paso 3: Generar NEXTAUTH_SECRET

Ejecuta este comando para generar una clave secreta:

```bash
openssl rand -base64 32
```

O usa este generador online: https://generate-secret.vercel.app/32

### Paso 4: Verificar Configuración de Supabase

1. **En tu proyecto de Supabase:**
   - Authentication > Settings
   - Site URL: `https://tu-dominio.netlify.app`
   - Redirect URLs: `https://tu-dominio.netlify.app/**`

### Paso 5: Actualizar tu .env.local

Actualiza tu archivo `.env.local` con las mismas claves reales:

```bash
# Supabase (USAR CLAVES REALES)
NEXT_PUBLIC_SUPABASE_URL="https://anbwbrqzffijhcznouwt.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="[TU_CLAVE_REAL_ANON]"
SUPABASE_SERVICE_ROLE_KEY="[TU_CLAVE_REAL_SERVICE_ROLE]"

# NextAuth
NEXTAUTH_SECRET="[TU_CLAVE_SECRETA_GENERADA]"
NEXTAUTH_URL="http://localhost:3000"

# El resto de tus variables...
```

### Paso 6: Verificar Middleware

El middleware actual busca tokens en cookies específicas. Supabase usa nombres diferentes. Actualiza el middleware:

```typescript
// En middleware.ts, línea 15-17
const token = request.cookies.get('sb-access-token')?.value ||
              request.cookies.get('sb-refresh-token')?.value ||
              request.cookies.get('supabase.auth.token')?.value
```

## Pasos para Agregar Variables en Netlify

### Método 1: Durante el Deploy Inicial
1. Cuando conectes el repositorio de GitHub
2. Netlify detectará que es un proyecto Next.js
3. Te pedirá las variables de entorno
4. Agrega todas las variables listadas arriba

### Método 2: Después del Deploy
1. Ve a tu sitio en Netlify Dashboard
2. Site settings > Build & Deploy > Environment variables
3. Click "Add variable"
4. Agrega una por una todas las variables
5. Redeploy el sitio

## Verificación

1. **Prueba local primero:**
   ```bash
   npm run dev
   ```
   Verifica que el login funcione localmente

2. **Deploy a Netlify:**
   ```bash
   git add .
   git commit -m "Fix: Actualizar configuración de autenticación"
   git push origin main
   ```

3. **Verifica en producción:**
   - Abre las herramientas de desarrollador
   - Ve a la consola para errores
   - Prueba el login

## Errores Comunes y Soluciones

### Error: "Invalid login credentials"
- Verifica que las claves de Supabase sean correctas
- Asegúrate de que el usuario existe en Supabase

### Error: "NEXTAUTH_URL is not defined"
- Agrega `NEXTAUTH_URL` en las variables de Netlify

### Error: "Failed to fetch"
- Verifica la URL de Supabase
- Revisa las políticas CORS en Supabase

### Error de redirección infinita
- Verifica que las URLs de redirección estén configuradas en Supabase
- Revisa el middleware

## Contacto

Si sigues teniendo problemas después de estos pasos, revisa:
1. Los logs de Netlify (Functions tab)
2. La consola del navegador
3. Los logs de Supabase (Dashboard > Logs)

¡Con estos cambios tu login debería funcionar perfectamente en Netlify!