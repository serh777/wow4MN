# Configuración de Resend para Formulario de Contacto

## Problema Identificado
Los emails del formulario de contacto no se enviaban porque:
1. El dominio `wowseoweb3.com` no estaba verificado en Resend
2. La API key estaba configurada pero usaba un dominio no verificado

## Solución Implementada

### 1. Cambio de Dominio
- **Antes**: `noreply@wowseoweb3.com` (no verificado)
- **Ahora**: `onboarding@resend.dev` (dominio verificado por defecto de Resend)

### 2. Configuración en Desarrollo Local
El archivo `.env.local` ya tiene la configuración correcta:
```env
RESEND_API_KEY="re_6MYhm814_PduTFu9Hgw1SEY8hz2JAeaXF"
```

### 3. Configuración en Netlify (PASOS EXACTOS)

#### Paso 1: Acceder al Dashboard de Netlify
1. Ve a [netlify.com](https://netlify.com)
2. Inicia sesión en tu cuenta
3. Selecciona tu proyecto `wowseoweb3`

#### Paso 2: Configurar Variables de Entorno
1. Ve a **Site settings** → **Build & deploy** → **Environment variables**
2. Agrega/verifica estas variables:

```env
RESEND_API_KEY=re_6MYhm814_PduTFu9Hgw1SEY8hz2JAeaXF
RESEND_FROM_EMAIL=WowSeoWeb3 <onboarding@resend.dev>
```

#### Paso 3: Redesplegar el Sitio
1. Ve a **Deploys**
2. Haz clic en **Trigger deploy** → **Deploy site**
3. Espera a que termine el despliegue

### 4. Verificación

#### Prueba Local
```bash
# Ejecutar script de prueba
node test-resend.js
```

#### Prueba en Producción
1. Ve a tu sitio en Netlify: `https://wowseoweb3.netlify.app/contact`
2. Completa el formulario de contacto
3. Verifica que llegue el email a `srhskl@proton.me`

### 5. Opciones Futuras

#### Opción A: Verificar tu Propio Dominio
1. Ve a [resend.com/domains](https://resend.com/domains)
2. Agrega `wowseoweb3.com`
3. Configura los registros DNS requeridos
4. Una vez verificado, cambia el `from` en el código:
   ```typescript
   from: 'WowSeoWeb3 <noreply@wowseoweb3.com>'
   ```

#### Opción B: Mantener Dominio por Defecto
- Funciona perfectamente con `onboarding@resend.dev`
- No requiere configuración adicional
- Recomendado para desarrollo y pruebas

### 6. Monitoreo

#### Logs en Desarrollo
```bash
# Ver logs del servidor
npm run dev
# Buscar mensajes como:
# ✅ Email enviado exitosamente: [ID]
```

#### Logs en Netlify
1. Ve a **Functions** → **contact**
2. Revisa los logs de ejecución
3. Busca errores o confirmaciones de envío

### 7. Troubleshooting

#### Error: "Domain not verified"
- **Causa**: Usando dominio no verificado
- **Solución**: Usar `onboarding@resend.dev` o verificar tu dominio

#### Error: "Invalid API key"
- **Causa**: API key incorrecta o no configurada
- **Solución**: Verificar la variable `RESEND_API_KEY` en Netlify

#### Error: "Rate limit exceeded"
- **Causa**: Demasiados emails enviados
- **Solución**: Esperar o actualizar plan de Resend

### 8. Archivos Modificados

- `src/app/api/contact/route.ts` - Cambio de dominio
- `.env.netlify` - Variables de entorno actualizadas
- `test-resend.js` - Script de prueba creado

### 9. Estado Actual

✅ **Funcionando**: Emails se envían correctamente en desarrollo
⏳ **Pendiente**: Configurar variables en Netlify dashboard
⏳ **Pendiente**: Probar en producción después del despliegue

---

**Nota**: La API key actual tiene límites del plan gratuito de Resend. Para uso en producción, considera actualizar el plan si es necesario.