# Configuración del Sistema de Contacto

## Problema Actual
El formulario de contacto actual no envía emails reales, solo registra los mensajes en la consola. Esto no es una buena práctica para producción.

## Solución Implementada
Hemos integrado **Resend**, uno de los servicios de email más modernos y confiables para desarrolladores.

### ¿Por qué Resend?
- **Gratuito**: 3,000 emails/mes en el plan gratuito
- **Excelente deliverabilidad**: 87% promedio según tests independientes
- **Fácil configuración**: API simple y bien documentada
- **Moderno**: Diseñado específicamente para desarrolladores
- **Confiable**: Usado por miles de aplicaciones en producción

## Configuración Paso a Paso

### 1. Crear cuenta en Resend
1. Ve a [resend.com](https://resend.com)
2. Crea una cuenta gratuita
3. Verifica tu email

### 2. Obtener API Key
1. En el dashboard de Resend, ve a "API Keys"
2. Crea una nueva API key
3. Copia la key (empieza con `re_`)

### 3. Configurar dominio (Opcional pero recomendado)
1. En Resend, ve a "Domains"
2. Agrega tu dominio (ej: `wowseoweb3.com`)
3. Configura los registros DNS según las instrucciones
4. Una vez verificado, actualiza el `from` en `/src/app/api/contact/route.ts`

### 4. Variables de entorno
Agrega a tu archivo `.env.local`:
```bash
RESEND_API_KEY="re_tu_api_key_aqui"
```

### 5. Probar el formulario
1. Reinicia el servidor de desarrollo
2. Ve a `/contact`
3. Envía un mensaje de prueba
4. Verifica que llegue a tu email

## Alternativas Gratuitas

Si prefieres otras opciones, aquí están las mejores alternativas:

### 1. SMTP2GO (Recomendado)
- **Gratuito**: 1,000 emails/mes
- **Deliverabilidad**: 96% (la mejor)
- **Configuración**: Más compleja (SMTP)

### 2. SendPulse
- **Gratuito**: 12,000 emails/mes
- **Deliverabilidad**: 74%
- **Configuración**: Media

### 3. Brevo (ex-Sendinblue)
- **Gratuito**: 300 emails/día
- **Deliverabilidad**: 80%
- **Configuración**: Media

### 4. Gmail SMTP (No recomendado para producción)
- **Gratuito**: 500 emails/día
- **Problemas**: Puede ser bloqueado, no profesional
- **Solo para**: Desarrollo/testing

## Mejores Prácticas Implementadas

### ✅ Validación de datos
- Campos requeridos
- Formato de email válido
- Sanitización de contenido

### ✅ Seguridad
- No exposición de API keys
- Validación server-side
- Rate limiting implícito

### ✅ UX/UI
- Estados de carga
- Mensajes de éxito/error
- Formulario responsive

### ✅ Fallback
- Si no hay API key, registra en consola
- Modo desarrollo vs producción
- Manejo de errores robusto

### ✅ Email profesional
- HTML bien formateado
- Información completa del remitente
- Reply-to configurado
- Timestamp incluido

## Monitoreo

### En Resend Dashboard
- Ve estadísticas de entrega
- Revisa emails enviados
- Monitorea la reputación del dominio

### En tu aplicación
- Logs detallados en consola
- IDs de email para tracking
- Manejo de errores específicos

## Costos

### Plan Gratuito de Resend
- 3,000 emails/mes
- 1 dominio verificado
- Soporte por email
- **Suficiente para la mayoría de sitios web**

### Si necesitas más
- Plan Pro: $20/mes por 50,000 emails
- Escalable según necesidades
- Soporte prioritario

## Troubleshooting

### Email no llega
1. Verifica la API key en `.env.local`
2. Revisa la consola del servidor
3. Confirma que el dominio esté verificado
4. Revisa la carpeta de spam

### Error 500
1. Verifica que Resend esté instalado: `npm list resend`
2. Revisa los logs del servidor
3. Confirma el formato de la API key

### Emails van a spam
1. Configura SPF, DKIM, DMARC
2. Usa un dominio verificado
3. Evita palabras spam en el contenido
4. Mantén una buena reputación de envío

## Conclusión

Con esta implementación tienes:
- ✅ Sistema de contacto funcional
- ✅ Emails que llegan al destinatario
- ✅ Configuración profesional
- ✅ Escalable y mantenible
- ✅ Gratuito para empezar

**¡Tu formulario de contacto ahora funciona correctamente!**