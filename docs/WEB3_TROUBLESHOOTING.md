# Guía de Solución de Problemas Web3

## Problemas Identificados y Soluciones

### 1. Error: "Operación solicitar cuentas falló después de 3 intentos"

**Causa:** MetaMask no está disponible, no está conectado, o hay problemas de red.

**Soluciones:**
- Asegúrate de que MetaMask esté instalado y desbloqueado
- Verifica que estés en una red soportada (Ethereum, Polygon, BSC, Avalanche)
- Actualiza MetaMask a la última versión
- Reinicia el navegador si es necesario

### 2. Error: "Operación obtener precio de herramientas falló después de 3 intentos"

**Causa:** Problemas de conectividad con el contrato inteligente o red no soportada.

**Soluciones:**
- Verifica que estés conectado a una red soportada
- Asegúrate de que el contrato esté desplegado en la red actual
- Verifica que tengas fondos suficientes para las transacciones

## Mejoras Implementadas

### 1. Utilidades Web3 (`src/utils/web3-utils.ts`)
- Detección mejorada de MetaMask
- Manejo robusto de errores de conexión
- Funciones de diagnóstico y estado
- Manejo de timeouts y reintentos

### 2. Servicio de Contrato Mejorado (`src/services/contract-service.ts`)
- Inicialización más robusta con verificaciones de estado
- Mejor manejo de errores con mensajes descriptivos
- Logging detallado para diagnóstico
- Verificación de redes soportadas
- Manejo automático de tokens por defecto

### 3. Componente de Diagnóstico (`src/components/web3/web3-diagnostics.tsx`)
- Verificación del estado de MetaMask
- Pruebas de conectividad
- Información sobre redes soportadas
- Recomendaciones automáticas

### 4. Interfaz de Usuario Mejorada
- Alertas informativas sobre errores Web3
- Botón de diagnóstico en la página de precios
- Estados de carga más claros
- Mensajes de error más descriptivos

## Cómo Usar el Diagnóstico

1. Ve a la página de precios (`/pricing`)
2. Si hay errores de Web3, aparecerá una alerta roja
3. Haz clic en "Diagnóstico" para abrir la herramienta
4. Ejecuta el diagnóstico para identificar problemas
5. Sigue las recomendaciones mostradas

## Configuración de Redes

### Redes Soportadas:
- **Ethereum Mainnet** (Chain ID: 1)
- **Polygon** (Chain ID: 137)
- **BSC** (Chain ID: 56)
- **Avalanche** (Chain ID: 43114)

### Tokens Aceptados:
- **USDC** (preferido)
- **USDT**
- **DAI**

## Solución de Problemas Comunes

### MetaMask no detectado
```
Error: MetaMask no está instalado o no está disponible
```
**Solución:**
1. Instala MetaMask desde https://metamask.io/
2. Asegúrate de que esté habilitado en tu navegador
3. Recarga la página

### Red no soportada
```
Error: Red actual (X) no está soportada
```
**Solución:**
1. Abre MetaMask
2. Cambia a una red soportada (Ethereum, Polygon, BSC, Avalanche)
3. Recarga la página

### Usuario rechazó la conexión
```
Error: Usuario rechazó la conexión a MetaMask
```
**Solución:**
1. Haz clic en "Conectar" en MetaMask cuando aparezca
2. Si no aparece, haz clic en el icono de MetaMask
3. Selecciona "Conectar" manualmente

### Fondos insuficientes
```
Error: Fondos insuficientes para completar la transacción
```
**Solución:**
1. Asegúrate de tener suficientes tokens (USDC/USDT/DAI)
2. Verifica que tengas ETH/MATIC/BNB/AVAX para gas
3. Reduce la cantidad si es necesario

## Logs de Desarrollo

Para desarrolladores, los logs detallados están disponibles en:
- Console del navegador (F12)
- Network tab para ver llamadas fallidas
- MetaMask logs (Configuración > Avanzado > Descargar logs)

## Contacto de Soporte

Si los problemas persisten después de seguir esta guía:
1. Abre las herramientas de desarrollador (F12)
2. Ve a la pestaña Console
3. Reproduce el error
4. Copia los logs de error
5. Contacta al equipo de soporte con los detalles

---

**Nota:** Esta aplicación requiere MetaMask y una conexión a blockchain para funcionar correctamente. Asegúrate de tener ambos configurados antes de usar las funciones de pago.