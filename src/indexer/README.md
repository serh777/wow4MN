# WowSEOWeb3 Blockchain Indexer

Un sistema completo de indexación de blockchain para el análisis de datos Web3 en tiempo real.

## 🚀 Características

- **Indexación en Tiempo Real**: Procesa bloques, transacciones y eventos de blockchain
- **Multi-Red**: Soporte para Ethereum, Polygon y otras redes EVM
- **Escalable**: Procesamiento en lotes con control de concurrencia
- **Monitoreo**: Métricas detalladas y estado de salud del sistema
- **Recuperación**: Manejo robusto de errores y reintentos automáticos
- **API RESTful**: Endpoints para gestión y consulta de datos

## 📋 Requisitos Previos

- Node.js >= 18.17.0
- PostgreSQL >= 13
- Variables de entorno configuradas (ver `.env.example`)

## ⚙️ Configuración Inicial

### 1. Instalar Dependencias
```bash
npm install
```

### 2. Configurar Base de Datos
```bash
# Generar cliente Prisma
npm run db:generate

# Ejecutar migraciones
npm run db:migrate

# Configurar indexer (crear índices y datos iniciales)
npm run indexer:setup
```

### 3. Variables de Entorno

Configura las siguientes variables en tu archivo `.env`:

```env
# Base de datos (requerido)
DATABASE_URL="postgresql://usuario:password@localhost:5432/wowseoweb3"

# Proveedores de blockchain (al menos uno requerido)
INFURA_PROJECT_ID="tu_infura_project_id"
ALCHEMY_API_KEY="tu_alchemy_api_key"
ETHERSCAN_API_KEY="tu_etherscan_api_key"

# Configuración opcional
START_BLOCK="18000000"
BATCH_SIZE="10"
CONCURRENCY="1"
RETRY_ATTEMPTS="3"
```

## 🏃‍♂️ Uso

### Iniciar el Servidor de Desarrollo
```bash
npm run dev
```

### Acceder al Dashboard
Navega a `http://localhost:3000/dashboard/indexers` para:

- Ver todos los indexers configurados
- Crear nuevos indexers
- Iniciar/detener indexers
- Monitorear métricas en tiempo real
- Consultar datos indexados

### Scripts Disponibles

```bash
# Configuración inicial del indexer
npm run indexer:setup

# Resetear y reconfigurar
npm run indexer:reset

# Gestión de base de datos
npm run db:migrate    # Aplicar migraciones
npm run db:generate   # Generar cliente Prisma
npm run db:studio     # Abrir Prisma Studio
```

## 📊 API Endpoints

### Gestión de Indexers

```http
# Listar indexers
GET /api/indexers

# Crear indexer
POST /api/indexers
Content-Type: application/json
{
  "name": "Mi Indexer",
  "description": "Descripción del indexer",
  "network": "ethereum",
  "startBlock": 18000000
}

# Iniciar indexer
POST /api/indexers/{id}/start

# Eliminar indexer
DELETE /api/indexers/{id}
```

### Consulta de Datos

```http
# Consultar datos indexados
GET /api/indexed-data?network=ethereum&dataType=blocks&limit=50&page=1

# Filtros disponibles:
# - network: ethereum, polygon
# - dataType: blocks, transactions, events
# - address: dirección específica
# - blockNumber: número de bloque
# - fromBlock, toBlock: rango de bloques
# - limit, page: paginación
```

### Métricas y Monitoreo

```http
# Métricas del sistema
GET /api/indexers/metrics?type=system

# Métricas de indexer específico
GET /api/indexers/metrics?type=indexer&indexerId={id}

# Estado de salud
GET /api/indexers/metrics?type=health

# Limpiar cache de métricas
DELETE /api/indexers/metrics
```

## 🏗️ Arquitectura

### Componentes Principales

```
src/indexer/
├── config.ts              # Configuración de redes y parámetros
├── types.ts               # Tipos TypeScript
├── scheduler.ts           # Programador de tareas
├── indexer.ts            # Lógica principal de indexación
├── services/
│   └── indexerService.ts # Servicio de gestión de indexers
├── monitoring.ts         # Sistema de monitoreo y métricas
└── best-practices.md     # Guía de mejores prácticas
```

### Base de Datos

```
Modelos principales:
├── Indexer              # Configuración de indexers
├── IndexerJob           # Trabajos de indexación
├── IndexerConfig        # Configuraciones específicas
├── Block                # Datos de bloques
├── Transaction          # Datos de transacciones
└── Event                # Eventos/logs de contratos
```

### Frontend

```
src/app/dashboard/indexers/
├── page.tsx                    # Página principal
├── components/
│   └── indexer-management-tool.tsx
src/components/indexer/
└── IndexerMetrics.tsx          # Componente de métricas
src/hooks/
└── useIndexerService.ts        # Hook para API calls
```

## 📈 Monitoreo y Métricas

### Métricas del Sistema
- Total de indexers activos
- Bloques procesados por minuto
- Transacciones y eventos indexados
- Uptime del sistema
- Estado de salud general

### Métricas por Indexer
- Progreso de sincronización
- Lag respecto al bloque actual
- Tasa de procesamiento
- Tasa de errores
- Uptime individual

### Alertas y Notificaciones
- Indexers con errores
- Lag excesivo (>1000 bloques)
- Fallos de conectividad
- Performance degradado

## 🔧 Configuración Avanzada

### Optimización de Performance

```typescript
// config.ts
indexing: {
  batchSize: 10,        // Bloques por lote
  concurrency: 1,       // Procesos concurrentes
  retryAttempts: 3,     // Reintentos en caso de error
  retryDelay: 1000,     // Delay entre reintentos (ms)
}
```

### Configuración de Red

```typescript
// Agregar nueva red
networks: {
  arbitrum: {
    name: 'Arbitrum One',
    chainId: 42161,
    rpcUrl: process.env.ARBITRUM_RPC_URL,
    startBlock: 100000000,
    contracts: {
      // Contratos específicos a monitorear
    }
  }
}
```

## 🚨 Solución de Problemas

### Problemas Comunes

1. **Error de conexión a RPC**
   - Verificar API keys en `.env`
   - Comprobar límites de rate
   - Usar múltiples proveedores

2. **Lag excesivo**
   - Reducir `batchSize`
   - Aumentar `concurrency` (con cuidado)
   - Optimizar consultas de base de datos

3. **Errores de base de datos**
   - Verificar conexión PostgreSQL
   - Ejecutar `npm run db:migrate`
   - Revisar índices con `npm run db:studio`

### Logs y Debugging

```bash
# Ver logs en tiempo real
npm run dev

# Logs específicos del indexer
console.log('Procesando bloque:', blockNumber);
```

## 🔐 Seguridad

- **API Keys**: Nunca commitear claves en el código
- **Rate Limiting**: Implementado para evitar abuse
- **Validación**: Todos los inputs son validados
- **Autenticación**: JWT tokens para APIs protegidas

## 📚 Recursos Adicionales

- [Mejores Prácticas](./best-practices.md)
- [Documentación de Prisma](https://www.prisma.io/docs/)
- [Ethers.js Documentation](https://docs.ethers.org/)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)

## 🤝 Contribuir

1. Fork el proyecto
2. Crear una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Abrir un Pull Request

## 📄 Licencia

ISC License - ver archivo LICENSE para detalles.