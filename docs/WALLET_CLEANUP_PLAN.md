# Plan de Limpieza y Reorganización de Archivos Wallet

## Problemas Identificados

### 1. Duplicación de Componentes de Conexión
- **`wallet-connect.tsx`** y **`unified-wallet-connect.tsx`** tienen funcionalidades superpuestas
- Ambos manejan conexión de wallet pero con diferentes interfaces
- `unified-wallet-connect.tsx` es más moderno y completo

### 2. Múltiples Componentes de Diagnóstico
- **`wallet-diagnostics.tsx`** - Diagnóstico general
- **`mobile-wallet-diagnostic.tsx`** - Diagnóstico específico móvil
- **`mobile-wallet-troubleshooting.tsx`** - Solución de problemas móvil
- Funcionalidades superpuestas y confusas para el usuario

### 3. Separación Inadecuada de Funcionalidades
- **`/app/login/page.tsx`** - Solo email/password
- **`/app/register/page.tsx`** - Solo email/password
- **`/app/wallet-login/page.tsx`** - Solo wallet
- **`/app/wallet-register/page.tsx`** - Solo wallet
- Buena separación pero nombres confusos

### 4. Hooks y Configuraciones Redundantes
- **`useWeb3Safe.ts`** y contexto Web3 pueden tener funcionalidades superpuestas
- **`useMobileWallet.ts`** específico para móvil
- **`walletconnect-config.ts`** muy extenso con múltiples responsabilidades

## Plan de Reorganización

### Fase 1: Consolidación de Componentes de Conexión

#### Eliminar Duplicados
1. **ELIMINAR**: `wallet-connect.tsx` (reemplazado por `unified-wallet-connect.tsx`)
2. **MANTENER**: `unified-wallet-connect.tsx` como componente principal
3. **ACTUALIZAR**: Todas las referencias para usar `unified-wallet-connect.tsx`

### Fase 2: Simplificación de Diagnósticos

#### Consolidar en un Solo Componente
1. **CREAR**: `wallet-diagnostic-hub.tsx` que combine:
   - Diagnósticos generales
   - Diagnósticos móviles
   - Solución de problemas
2. **ELIMINAR**: 
   - `wallet-diagnostics.tsx`
   - `mobile-wallet-diagnostic.tsx` 
   - `mobile-wallet-troubleshooting.tsx`
3. **MANTENER**: `mobile-wallet-info.tsx` (información, no diagnóstico)

### Fase 3: Clarificación de Rutas de Autenticación

#### Renombrar para Mayor Claridad
1. **RENOMBRAR**:
   - `/app/login/` → `/app/auth/email-login/`
   - `/app/register/` → `/app/auth/email-register/`
   - `/app/wallet-login/` → `/app/auth/wallet-login/`
   - `/app/wallet-register/` → `/app/auth/wallet-register/`

2. **CREAR**: `/app/auth/page.tsx` como página principal de autenticación con opciones

### Fase 4: Optimización de Configuración

#### Separar Responsabilidades
1. **DIVIDIR** `walletconnect-config.ts` en:
   - `config/wallet-networks.ts` - Configuración de redes
   - `config/wallet-providers.ts` - Configuración de proveedores
   - `config/wallet-mobile.ts` - Configuración específica móvil
   - `config/wallet-errors.ts` - Manejo de errores (mover desde utils)

### Fase 5: Estructura Final Propuesta

```
src/
├── app/
│   ├── auth/
│   │   ├── page.tsx                    # Página principal de auth
│   │   ├── email-login/
│   │   │   └── page.tsx               # Solo email/password login
│   │   ├── email-register/
│   │   │   └── page.tsx               # Solo email/password register
│   │   ├── wallet-login/
│   │   │   └── page.tsx               # Solo wallet login
│   │   └── wallet-register/
│   │       └── page.tsx               # Solo wallet register
│   └── dashboard/
│       └── wallet/
│           ├── page.tsx               # Dashboard wallet
│           └── components/
│               └── wallet-hub.tsx     # Hub de herramientas
├── components/
│   └── wallet/
│       ├── unified-wallet-connect.tsx  # Componente principal conexión
│       ├── wallet-diagnostic-hub.tsx   # Diagnósticos consolidados
│       ├── mobile-wallet-info.tsx      # Info específica móvil
│       └── privacy-settings.tsx        # Configuración privacidad
├── config/
│   ├── wallet-networks.ts             # Configuración redes
│   ├── wallet-providers.ts            # Configuración proveedores
│   ├── wallet-mobile.ts               # Configuración móvil
│   └── wallet-errors.ts               # Manejo errores
├── hooks/
│   ├── useWeb3Safe.ts                 # Hook principal Web3
│   └── useMobileWallet.ts             # Hook específico móvil
└── utils/
    └── wallet-helpers.ts              # Utilidades generales
```

## Beneficios de la Reorganización

### 1. Eliminación de Duplicados
- Reduce confusión de desarrolladores
- Menor tamaño de bundle
- Mantenimiento más fácil

### 2. Separación Clara de Responsabilidades
- Email auth vs Wallet auth claramente separados
- Diagnósticos consolidados en un solo lugar
- Configuración modular y mantenible

### 3. Mejor Experiencia de Usuario
- Rutas más claras y descriptivas
- Componentes más cohesivos
- Menos opciones confusas

### 4. Mantenibilidad
- Código más organizado
- Responsabilidades bien definidas
- Fácil localización de funcionalidades

## Próximos Pasos

1. **Implementar Fase 1**: Consolidar componentes de conexión
2. **Implementar Fase 2**: Simplificar diagnósticos
3. **Implementar Fase 3**: Reorganizar rutas de auth
4. **Implementar Fase 4**: Optimizar configuración
5. **Testing**: Verificar que todo funciona correctamente
6. **Documentación**: Actualizar documentación de uso

## Estado del Plan

- [x] **Fase 1**: Consolidación de componentes de conexión ✅
- [x] **Fase 2**: Simplificación de diagnósticos ✅
- [x] **Fase 3**: Reorganización de rutas de autenticación ✅
- [x] **Fase 4**: Optimización de configuración ✅
- [ ] **Fase 5**: Pruebas y validación

## Progreso Completado

### ✅ Fase 1: Consolidación de Componentes
- Eliminado `wallet-connect.tsx` (duplicado)
- Mantenido `unified-wallet-connect.tsx` como componente principal
- Actualizado `wallet-hub.tsx` para usar el componente unificado

### ✅ Fase 2: Simplificación de Diagnósticos
- Creado `wallet-diagnostic-hub.tsx` consolidado
- Eliminados componentes duplicados:
  - `wallet-diagnostics.tsx`
  - `mobile-wallet-diagnostic.tsx`
  - `mobile-wallet-troubleshooting.tsx`
- Actualizado `mobile-wallet-info.tsx` para usar el hub unificado

### ✅ Fase 3: Reorganización de Rutas de Autenticación
- Creada estructura `/app/auth/` con subdirectorios:
  - `/auth/email-login/` (antes `/login/`)
  - `/auth/email-register/` (antes `/register/`)
  - `/auth/wallet-login/` (antes `/wallet-login/`)
  - `/auth/wallet-register/` (antes `/wallet-register/`)
- Creada página central `/auth/page.tsx`
- Actualizadas todas las referencias de rutas en:
  - Componentes de layout (header, footer)
  - Contextos de autenticación
  - Páginas del dashboard
  - Enlaces internos

### ✅ Fase 4: Optimización de Configuración
- Creada estructura modular en `/config/wallet/`:
  - `networks.ts` - Configuración de redes blockchain
  - `providers.ts` - Configuración de proveedores de wallet
  - `mobile.ts` - Configuración específica para móviles
  - `index.ts` - Punto de entrada unificado
- Actualizado `walletconnect-config.ts` como archivo de compatibilidad
- Migradas todas las importaciones a la nueva estructura modular

### 🔄 Pendiente: Fase 5 - Pruebas y Validación
- Verificar funcionamiento de todas las rutas de autenticación
- Probar conexión de wallets en dispositivos móviles y escritorio
- Validar diagnósticos consolidados
- Confirmar que no hay enlaces rotos
- Realizar pruebas de regresión

---

**Fecha**: Enero 2025
**Estado**: En Progreso - 4/5 Fases Completadas
**Prioridad**: Alta - Mejora significativa de organización