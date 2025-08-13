# Configuración de WalletConnect/Reown

## Problemas Comunes y Soluciones

### Error 403: Failed to fetch remote project configuration

**Síntomas:**
- `api.web3modal.org/appkit/v1/config?projectId=...` devuelve 403
- `Failed to fetch remote project configuration. Using local/default values`
- `Failed to load resource: the server responded with a status of 403`

**Causa:**
El Project ID de WalletConnect/Reown no es válido o no está configurado correctamente.

**Solución:**

1. **Obtener un Project ID válido:**
   - Ve a [WalletConnect Cloud](https://cloud.walletconnect.com/)
   - Crea una cuenta o inicia sesión
   - Crea un nuevo proyecto
   - Copia el Project ID

2. **Configurar variables de entorno:**
   ```bash
   # En tu archivo .env.local
   NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID="tu-project-id-aqui"
   # O alternativamente:
   NEXT_PUBLIC_REOWN_API_KEY="tu-project-id-aqui"
   ```

3. **Para Netlify:**
   - Ve a tu dashboard de Netlify
   - Site settings > Environment variables
   - Añade: `NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID` con tu Project ID

### Warning: Metadata URL mismatch

**Síntomas:**
- `The configured WalletConnect 'metadata.url':https://wowseoweb3.com differs from the actual page url:http://localhost:3000`

**Causa:**
La URL de metadata está hardcodeada para producción pero estás ejecutando en localhost.

**Solución:**

1. **Para desarrollo local:**
   ```bash
   # En tu archivo .env.local
   NEXT_PUBLIC_SITE_URL="http://localhost:3000"
   ```

2. **Para producción:**
   ```bash
   # En Netlify o tu archivo .env.production
   NEXT_PUBLIC_SITE_URL="https://tu-dominio.netlify.app"
   ```

### Configuración del Project ID en WalletConnect Cloud

1. **Configurar dominio permitido:**
   - En tu proyecto de WalletConnect Cloud
   - Ve a "Settings" > "Allowed Origins"
   - Añade:
     - `http://localhost:3000` (para desarrollo)
     - `https://tu-dominio.netlify.app` (para producción)

2. **Configurar metadata:**
   - Name: `WowSEOWeb3`
   - Description: `Herramientas SEO para Web3`
   - URL: Tu dominio de producción
   - Icon: URL de tu logo

## Configuración Completa

### Archivo .env.local (desarrollo)
```bash
# WalletConnect/Reown Configuration
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID="tu-project-id-real"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

### Variables de Netlify (producción)
```bash
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID="tu-project-id-real"
NEXT_PUBLIC_SITE_URL="https://tu-dominio.netlify.app"
```

## Verificación

Después de configurar correctamente:

1. **No deberías ver estos errores:**
   - ❌ `Failed to fetch remote project configuration`
   - ❌ `HTTP status code: 403`
   - ❌ `metadata.url differs from actual page url`

2. **Deberías ver:**
   - ✅ `AppKit: Inicializado correctamente`
   - ✅ Sin errores 403 en la consola
   - ✅ Wallets conectándose correctamente

## Notas Importantes

- El Project ID actual (`717c912a-af06-42ea-817e-06d64c964a69`) es solo para desarrollo
- Para producción, **DEBES** usar tu propio Project ID
- La configuración de analytics está deshabilitada por defecto para evitar errores
- Los dominios deben estar registrados en WalletConnect Cloud

## Troubleshooting

Si sigues teniendo problemas:

1. Verifica que el Project ID sea correcto
2. Asegúrate de que el dominio esté en "Allowed Origins"
3. Revisa que las variables de entorno estén configuradas
4. Reinicia el servidor de desarrollo después de cambiar variables
5. Para Netlify, redeploya después de cambiar variables de entorno