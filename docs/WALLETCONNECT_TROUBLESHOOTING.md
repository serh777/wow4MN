# Solución de Problemas de WalletConnect

## Errores Comunes y Soluciones

### 1. Error: `read ECONNRESET`

**Descripción:** Error de conexión de red que ocurre cuando la conexión WebSocket se cierra inesperadamente.

**Causas comunes:**
- Problemas de conectividad de red
- Firewall bloqueando conexiones WebSocket
- Proxy o VPN interfiriendo con la conexión
- Servidor relay de WalletConnect temporalmente no disponible

**Soluciones:**
```typescript
// 1. Verificar conectividad de red
const isOnline = await checkNetworkConnectivity();
if (!isOnline) {
  throw new Error('Sin conexión a internet');
}

// 2. Implementar reintentos con backoff exponencial
const result = await retryConnection(connectFunction, {
  maxRetries: 3,
  retryDelay: 1000,
  backoffMultiplier: 2
});
```

### 2. Error: `socket hang up`

**Descripción:** La conexión se cierra antes de completarse.

**Soluciones:**
- Verificar que el Project ID de WalletConnect sea válido
- Asegurar que no hay múltiples instancias de Web3Modal
- Limpiar listeners de eventos antes de reconectar

```typescript
// Limpiar listeners antes de reconectar
cleanupEventListeners();

// Reinicializar conexión
const newConnection = await connect();
```

### 3. Error: `MaxListenersExceededWarning`

**Descripción:** Demasiados event listeners registrados, indica un memory leak.

**Soluciones:**
```typescript
// Limpiar listeners al desconectar
const disconnect = () => {
  cleanupEventListeners();
  // ... resto de la lógica de desconexión
};

// Configurar límite de listeners
if (window.ethereum) {
  window.ethereum.setMaxListeners(15);
}
```

### 4. Error: `closeTransport called before connection was established`

**Descripción:** Se intenta cerrar la conexión antes de que se establezca completamente.

**Soluciones:**
- Esperar a que la conexión se establezca antes de realizar operaciones
- Implementar estados de conexión apropiados
- Usar timeouts para evitar conexiones colgadas

```typescript
// Verificar estado antes de operar
if (isConnected && provider) {
  // Realizar operación
} else {
  // Esperar o reconectar
}
```

## Configuración Recomendada

### Variables de Entorno

```env
# WalletConnect Project ID (REQUERIDO)
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=tu-project-id

# RPC URLs de respaldo
NEXT_PUBLIC_INFURA_PROJECT_ID=tu-infura-id
NEXT_PUBLIC_ALCHEMY_API_KEY=tu-alchemy-key
```

### Configuración de Web3Modal

```typescript
const web3ModalConfig = {
  ethersConfig,
  chains: [mainnet, polygon],
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID,
  enableAnalytics: false, // Deshabilitar para evitar errores
  enableOnramp: false,
  allowUnsupportedChain: true,
  themeMode: 'light',
  // Configuraciones de estabilidad
  featuredWalletIds: [
    'c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96', // MetaMask
    '4622a2b2d6af1c9844944291e5e7351a6aa24cd7b23099efac1b2fd875da31a0', // Trust Wallet
  ]
};
```

## Mejores Prácticas

### 1. Manejo de Errores

```typescript
try {
  await connect();
} catch (error) {
  const errorMessage = handleWalletConnectError(error);
  // Mostrar mensaje de error al usuario
  toast.error(errorMessage);
}
```

### 2. Limpieza de Recursos

```typescript
// Al desmontar componentes
useEffect(() => {
  return () => {
    cleanupEventListeners();
  };
}, []);
```

### 3. Verificación de Estado

```typescript
// Verificar estado antes de operaciones
const isReady = isConnected && provider && address;
if (!isReady) {
  throw new Error('Wallet no está lista');
}
```

### 4. Timeouts y Reintentos

```typescript
// Configurar timeouts apropiados
const connectWithTimeout = async () => {
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => reject(new Error('Timeout')), 30000);
  });
  
  return Promise.race([connect(), timeoutPromise]);
};
```

## Diagnóstico de Problemas

### Herramienta de Diagnóstico

Usa el componente `WalletDiagnostics` para identificar problemas:

```tsx
import { WalletDiagnostics } from '@/components/wallet/wallet-diagnostics';

// En tu componente
<WalletDiagnostics />
```

### Verificaciones Manuales

1. **Conectividad de red:**
   ```bash
   curl -I https://cloudflare.com/cdn-cgi/trace
   ```

2. **Variables de entorno:**
   ```javascript
   console.log('Project ID:', process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID);
   ```

3. **Estado de la wallet:**
   ```javascript
   console.log('Ethereum provider:', window.ethereum);
   console.log('Connected:', window.ethereum?.isConnected());
   ```

## Soluciones Específicas por Entorno

### Desarrollo Local

- Usar `localhost` en lugar de `127.0.0.1`
- Verificar que no hay conflictos de puertos
- Deshabilitar extensiones del navegador que puedan interferir

### Producción

- Configurar CORS apropiadamente
- Usar HTTPS para todas las conexiones
- Verificar que el dominio esté registrado en WalletConnect

### Redes Corporativas

- Verificar que WebSockets no estén bloqueados
- Configurar proxy si es necesario
- Usar RPC URLs internas si están disponibles

## Monitoreo y Logging

### Configuración de Logs

```typescript
// Habilitar logs detallados en desarrollo
if (process.env.NODE_ENV === 'development') {
  window.localStorage.setItem('debug', 'walletconnect:*');
}
```

### Métricas Importantes

- Tiempo de conexión
- Tasa de errores de conexión
- Número de reconexiones
- Tipos de errores más comunes

## Recursos Adicionales

- [Documentación oficial de WalletConnect](https://docs.walletconnect.com/)
- [Web3Modal Documentation](https://docs.walletconnect.com/web3modal/about)
- [Ethers.js Documentation](https://docs.ethers.org/)
- [Troubleshooting Guide](https://github.com/WalletConnect/walletconnect-monorepo/issues)

## Contacto y Soporte

Si los problemas persisten después de seguir esta guía:

1. Ejecuta el diagnóstico completo
2. Revisa los logs del navegador
3. Verifica la configuración de red
4. Consulta los issues conocidos en GitHub

---

*Última actualización: Diciembre 2024*