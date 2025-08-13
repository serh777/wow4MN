# Configuración de Supabase en Netlify

## Extensión de Supabase para Netlify

Para una integración óptima con Supabase en Netlify, sigue estos pasos:

### 1. Instalar la Extensión de Supabase

1. Ve a [Netlify Extensions - Supabase](https://app.netlify.com/extensions/supabase)
2. Instala la extensión en tu sitio de Netlify
3. La extensión configurará automáticamente las variables de entorno necesarias

### 2. Variables de Entorno Requeridas

Asegúrate de que estas variables estén configuradas en Netlify:

```bash
# Variables públicas (accesibles desde el cliente)
NEXT_PUBLIC_SUPABASE_URL="https://anbwbrqzffijhcznouwt.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFuYndicnF6ZmZpamhjem5vdXd0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI1MzY3NzQsImV4cCI6MjA2ODExMjc3NH0.zBoamZAaBm81lCdeBZ_j7lwJadhkGikKDnzEBHKngdo"

# Variables privadas (solo para funciones del servidor)
SUPABASE_SERVICE_ROLE_KEY="tu_service_role_key_aqui"
```

### 3. Configuración de Seguridad

El archivo `netlify.toml` ya incluye las cabeceras de seguridad necesarias:

- **Content-Security-Policy**: Permite conexiones a dominios de Supabase
- **Preconnect**: Optimiza la conexión inicial a Supabase
- **CORS**: Configurado para permitir requests desde tu dominio

### 4. Función de Diagnóstico

Se ha creado una función de Netlify en `/netlify/functions/supabase-config.js` que:

- Verifica la configuración de Supabase
- Valida que las variables de entorno estén presentes
- Proporciona información de diagnóstico

Puedes acceder a esta función en: `https://tu-sitio.netlify.app/.netlify/functions/supabase-config`

### 5. Pasos para Resolver el Error "Failed to Fetch"

1. **Verificar Variables de Entorno**:
   - Ve a Site Settings → Environment Variables en Netlify
   - Asegúrate de que `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY` estén configuradas
   - **IMPORTANTE**: Selecciona "Redeploy" después de cambiar variables

2. **Verificar Configuración de Seguridad**:
   - Las cabeceras CSP en `netlify.toml` deben incluir `*.supabase.co`
   - Verifica que no haya conflictos con otras políticas de seguridad

3. **Usar la Página de Debug**:
   - Visita `/debug` en tu sitio para ejecutar diagnósticos
   - Revisa los resultados de conectividad y autenticación

### 6. Comandos Útiles

```bash
# Verificar variables localmente
npm run dev
# Verificar la conexión en la aplicación principal

# Desplegar cambios
git add .
git commit -m "Update Supabase configuration"
git push origin main
```

### 7. Troubleshooting

**Error: "Failed to fetch"**
- Verifica que las variables de entorno tengan el prefijo `NEXT_PUBLIC_`
- Asegúrate de haber redeployado después de cambiar variables
- Revisa la consola del navegador para errores específicos

**Error: "Invalid API key"**
- Verifica que la `ANON_KEY` sea correcta
- Asegúrate de que el proyecto de Supabase esté activo

**Error de CORS**
- Verifica la configuración de CORS en Supabase Dashboard
- Asegúrate de que tu dominio de Netlify esté en la lista de orígenes permitidos

### 8. Enlaces Útiles

- [Extensión de Supabase para Netlify](https://app.netlify.com/extensions/supabase)
- [Documentación de Supabase](https://supabase.com/docs)
- [Configuración de Variables en Netlify](https://docs.netlify.com/environment-variables/overview/)