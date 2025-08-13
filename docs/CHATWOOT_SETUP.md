# Configuración de Chatwoot Live Chat

## Problema Identificado

El widget de Chatwoot aparece como "conectado" pero los mensajes no llegan a la aplicación de Chatwoot. Esto generalmente indica un problema de configuración del token o de la configuración del inbox.

## Pasos para Configurar Chatwoot Correctamente

### 1. Verificar el Token del Website

1. **Accede a tu panel de Chatwoot**: https://app.chatwoot.com
2. **Ve a Settings > Inboxes**
3. **Selecciona tu inbox de Website**
4. **Copia el Website Token** (debe ser diferente al hardcodeado actualmente)

### 2. Configurar Variables de Entorno

#### En Desarrollo Local:
```bash
# Crea o edita .env.local
NEXT_PUBLIC_CHATWOOT_TOKEN="tu-token-real-de-chatwoot"
```

#### En Netlify:
1. Ve a tu dashboard de Netlify
2. Site settings > Environment variables
3. Añade:
   - **Key**: `NEXT_PUBLIC_CHATWOOT_TOKEN`
   - **Value**: Tu token real de Chatwoot

### 3. Verificar Configuración del Inbox

En tu panel de Chatwoot:

1. **Settings > Inboxes > [Tu Website Inbox]**
2. **Verifica que el dominio esté configurado correctamente**:
   - Para producción: `https://tu-dominio-netlify.netlify.app`
   - Para desarrollo: `http://localhost:3000`
3. **Asegúrate de que el inbox esté activo**

### 4. Configuración de Dominio

**Importante**: Chatwoot puede restringir el funcionamiento por dominio. Asegúrate de:

1. **Añadir tu dominio de Netlify** en la configuración del inbox
2. **Verificar que no hay restricciones de CORS**
3. **Confirmar que el inbox está asignado a agentes activos**

### 5. Debugging

Con la nueva configuración, puedes verificar en la consola del navegador:

```javascript
// Verificar si Chatwoot está cargado
console.log('Chatwoot SDK:', window.chatwootSDK);
console.log('Chatwoot Widget:', window.$chatwoot);

// Verificar configuración
if (window.$chatwoot) {
  console.log('Chatwoot está funcionando correctamente');
} else {
  console.log('Chatwoot no está disponible');
}
```

### 6. Problemas Comunes y Soluciones

#### Error ERR_BLOCKED_BY_RESPONSE
- **Síntoma**: `net::ERR_BLOCKED_BY_RESPONSE https://app.chatwoot.com/widget?website_token=...`
- **Causa**: Chatwoot está bloqueando la respuesta por configuración de dominio
- **Solución**: 
  1. Verificar que el dominio esté configurado en el inbox de Chatwoot
  2. Asegurarse de que el token sea correcto
  3. Probar en el dominio de producción (Netlify) en lugar de localhost

#### Limitaciones de Localhost
- **Síntoma**: Widget no funciona en desarrollo local
- **Causa**: Chatwoot puede bloquear localhost por políticas de CORS
- **Solución**: 
  1. Probar en el sitio desplegado en Netlify
  2. Configurar HTTPS local si es necesario
  3. Añadir `localhost:3000` en la configuración del inbox (si Chatwoot lo permite)

#### Token Incorrecto
- **Síntoma**: Widget aparece pero mensajes no llegan
- **Solución**: Verificar y actualizar el token desde el panel de Chatwoot

#### Dominio No Configurado
- **Síntoma**: Widget no aparece o da errores de CORS
- **Solución**: Añadir el dominio en la configuración del inbox

#### Inbox Inactivo
- **Síntoma**: Mensajes no llegan a los agentes
- **Solución**: Verificar que el inbox esté activo y asignado a agentes

#### Agentes No Disponibles
- **Síntoma**: Mensajes llegan pero no hay respuesta
- **Solución**: Verificar que hay agentes online y disponibles

### 7. Verificación Final

Después de configurar:

1. **Despliega los cambios** en Netlify
2. **Abre la consola del navegador** en tu sitio
3. **Busca los logs de Chatwoot** que ahora incluyen más información
4. **Envía un mensaje de prueba** desde el widget
5. **Verifica en tu panel de Chatwoot** que el mensaje llegó

### 8. Configuración de Prueba

Para probar localmente con HTTPS (recomendado para Chatwoot):

```bash
# Instalar mkcert para certificados locales
npm install -g mkcert
mkcert create-ca
mkcert create-cert

# Ejecutar con HTTPS
npm run dev -- --experimental-https
```

## Testing en Desarrollo vs Producción

### Desarrollo Local (localhost:3000)
- **Limitación**: Chatwoot puede bloquear localhost por políticas de seguridad
- **Error común**: `ERR_BLOCKED_BY_RESPONSE`
- **Recomendación**: Usar principalmente para desarrollo de UI, no para testing de Chatwoot

### Producción (Netlify)
- **Recomendado**: Siempre probar Chatwoot en el dominio de producción
- **Configuración**: Asegurar que el dominio de Netlify esté en la configuración del inbox
- **Testing**: Los mensajes deberían funcionar correctamente aquí

## Notas Importantes

- **El token actual `EyAMAThTcx2fT3DfR79HJcxy` puede ser un token de prueba**
- **Debes usar tu token real de Chatwoot para que funcione en producción**
- **Los mensajes solo llegarán si el token y dominio están configurados correctamente**
- **Chatwoot puede tardar unos segundos en sincronizar después de cambios de configuración**
- **Para testing completo, siempre usar el sitio desplegado en Netlify**

## Contacto de Soporte

Si después de seguir estos pasos el problema persiste:
1. Verifica los logs de la consola del navegador
2. Revisa la configuración del inbox en Chatwoot
3. Contacta al soporte de Chatwoot si es necesario