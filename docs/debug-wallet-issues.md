# Debug: Problemas con Wallet Login

## Problemas Identificados:

### 1. Trust Wallet - Imagen Rota
- **Ubicación**: Web3Modal
- **Causa**: Las imágenes de wallets son manejadas por Web3Modal automáticamente
- **ID de Trust Wallet**: `4622a2b2d6af1c9844944291e5e7351a6aa24cd7b23099efac1b2fd875da31a0`
- **Estado**: Configurado correctamente en `walletconnect-config.ts`

### 2. Falta de Redirección al Dashboard
- **Ubicación**: AuthContext.tsx
- **Lógica**: 
  - `signInWithWallet()` llama a `router.push('/dashboard')` directamente
  - `onAuthStateChange` también maneja `SIGNED_IN` event con redirección
- **Posible causa**: Conflicto entre redirecciones múltiples

### 3. API Key de Web3Modal
- **Variable**: `NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID`
- **Fuente**: cloud.reown.com (anteriormente cloud.walletconnect.com)
- **Estado**: Configurada en .env

## Soluciones Propuestas:

### Para Trust Wallet imagen:
- Las imágenes son manejadas por Web3Modal CDN
- Verificar si el Project ID es válido

### Para redirección:
- Eliminar redirección duplicada en `signInWithWallet`
- Dejar que `onAuthStateChange` maneje todas las redirecciones

### Para API Key:
- Verificar validez del Project ID en cloud.reown.com
- Comprobar si hay límites de uso