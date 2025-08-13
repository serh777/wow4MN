# Guía Paso a Paso: Configurar Variables de Entorno en Netlify

## 🚨 Problema Identificado

Tu login no funciona en Netlify porque faltan estas variables críticas:
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` (tienes valor de ejemplo)
- `SUPABASE_SERVICE_ROLE_KEY` (tienes valor de ejemplo)
- `NEXTAUTH_SECRET` (faltante)
- `NEXTAUTH_URL` (faltante)

## 📋 Paso 1: Obtener Claves Reales de Supabase

### 1.1 Acceder a Supabase Dashboard
1. Ve a: https://supabase.com/dashboard/project/anbwbrqzffijhcznouwt
2. Si no tienes acceso, verifica que estés logueado con la cuenta correcta

### 1.2 Obtener las Claves
1. En el dashboard de tu proyecto, ve a **Settings** (⚙️)
2. Click en **API** en el menú lateral
3. Encontrarás estas claves:

```
📋 COPIA ESTAS CLAVES:

Project URL: https://anbwbrqzffijhcznouwt.supabase.co

anon public key: eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...
(Esta es la que necesitas para NEXT_PUBLIC_SUPABASE_ANON_KEY)

service_role key: eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...
(Esta es la que necesitas para SUPABASE_SERVICE_ROLE_KEY)
⚠️ MANTÉN ESTA CLAVE SECRETA
```

## 📋 Paso 2: Generar NEXTAUTH_SECRET

### Opción A: Usando OpenSSL (si tienes Git Bash o WSL)
```bash
openssl rand -base64 32
```

### Opción B: Generador Online
1. Ve a: https://generate-secret.vercel.app/32
2. Copia la clave generada

### Opción C: Usando Node.js
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## 📋 Paso 3: Configurar Variables en Netlify

### 3.1 Acceder a Netlify Dashboard
1. Ve a: https://app.netlify.com/
2. Busca tu proyecto (probablemente se llama algo como "wowseoweb3" o similar)
3. Click en el proyecto

### 3.2 Navegar a Variables de Entorno
1. En el dashboard del proyecto, click en **Site settings**
2. En el menú lateral, click en **Build & deploy**
3. Scroll down hasta **Environment variables**
4. Click en **Edit variables**

### 3.3 Agregar/Actualizar Variables

Agrega o actualiza estas variables una por una:

```bash
# 🔑 VARIABLES CRÍTICAS (SIN ESTAS NO FUNCIONA EL LOGIN)
NEXT_PUBLIC_SUPABASE_URL
Valor: https://anbwbrqzffijhcznouwt.supabase.co

NEXT_PUBLIC_SUPABASE_ANON_KEY
Valor: [LA_CLAVE_ANON_QUE_COPIASTE_DE_SUPABASE]

SUPABASE_SERVICE_ROLE_KEY
Valor: [LA_CLAVE_SERVICE_ROLE_QUE_COPIASTE_DE_SUPABASE]

NEXTAUTH_SECRET
Valor: [LA_CLAVE_SECRETA_QUE_GENERASTE]

NEXTAUTH_URL
Valor: https://[TU-SITIO].netlify.app
(Reemplaza [TU-SITIO] con el nombre real de tu sitio)
```

```bash
# 📧 EMAIL (YA TIENES ESTA)
RESEND_API_KEY
Valor: re_6MYhm814_PduTFu9Hgw1SEY8hz2JAeaXF
```

```bash
# 🌐 WEB3 (OPCIONALES PERO RECOMENDADAS)
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID
Valor: your_wallet_connect_project_id

NEXT_PUBLIC_ALCHEMY_API_KEY
Valor: your_alchemy_api_key

NEXT_PUBLIC_INFURA_API_KEY
Valor: your_infura_api_key
```

## 📋 Paso 4: Configurar Supabase para Netlify

### 4.1 Configurar URLs de Redirección
1. En Supabase Dashboard: **Authentication** > **Settings**
2. En **Site URL**, pon: `https://[TU-SITIO].netlify.app`
3. En **Redirect URLs**, agrega:
   ```
   https://[TU-SITIO].netlify.app/**
   https://[TU-SITIO].netlify.app/auth/callback
   ```

### 4.2 Verificar Configuración de Email
1. En **Authentication** > **Settings**
2. Asegúrate de que **Enable email confirmations** esté configurado según tus necesidades
3. Si usas confirmación por email, configura las plantillas en **Email Templates**

## 📋 Paso 5: Redeploy y Verificar

### 5.1 Forzar Redeploy
1. En Netlify Dashboard, ve a **Deploys**
2. Click en **Trigger deploy** > **Deploy site**
3. Espera a que termine el deploy

### 5.2 Verificar el Deploy
1. Ve a tu sitio: `https://[TU-SITIO].netlify.app`
2. Intenta hacer login
3. Abre las herramientas de desarrollador (F12)
4. Ve a la consola para ver si hay errores

## 🔍 Verificación y Troubleshooting

### ✅ Checklist de Verificación
- [ ] Claves de Supabase copiadas correctamente (sin espacios extra)
- [ ] NEXTAUTH_SECRET generado y agregado
- [ ] NEXTAUTH_URL apunta a tu dominio de Netlify
- [ ] URLs de redirección configuradas en Supabase
- [ ] Deploy completado sin errores
- [ ] No hay errores en la consola del navegador

### 🚨 Errores Comunes

**Error: "Invalid login credentials"**
- Verifica que las claves de Supabase sean correctas
- Asegúrate de que no haya espacios al inicio o final

**Error: "NEXTAUTH_URL is not defined"**
- Verifica que agregaste NEXTAUTH_URL en Netlify
- Asegúrate de que apunte a tu dominio correcto

**Error: "Failed to fetch"**
- Verifica la URL de Supabase
- Revisa las políticas CORS en Supabase
- Verifica las URLs de redirección

**Redirección infinita**
- Verifica que NEXTAUTH_URL sea exactamente tu dominio de Netlify
- Revisa que las URLs de redirección en Supabase incluyan tu dominio

### 🔧 Comandos de Verificación Local

Antes de hacer deploy, verifica localmente:

```bash
# Verificar variables
node scripts/verificar-env.js

# Probar localmente
npm run dev
```

## 📞 Si Sigues Teniendo Problemas

1. **Revisa los logs de Netlify:**
   - Ve a **Functions** tab en tu dashboard
   - Busca errores en los logs

2. **Revisa los logs de Supabase:**
   - En Supabase Dashboard: **Logs**
   - Filtra por errores de autenticación

3. **Verifica en la consola del navegador:**
   - Abre F12 en tu sitio
   - Ve a Console y Network tabs
   - Intenta hacer login y observa los errores

## 🎯 Resultado Esperado

Después de seguir estos pasos:
- ✅ El login con email/password funcionará
- ✅ El login con wallet funcionará
- ✅ Las redirecciones funcionarán correctamente
- ✅ No habrá errores en la consola

¡Tu aplicación debería funcionar perfectamente en Netlify!