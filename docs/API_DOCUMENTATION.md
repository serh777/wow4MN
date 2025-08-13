# API Documentation - Web3 Analysis Tools

Esta documentación describe todos los endpoints API disponibles para las herramientas de análisis Web3.

## Endpoints Principales

### Dashboard General
- **GET** `/api/dashboard` - Obtener datos del dashboard del usuario
- **POST** `/api/dashboard` - Actualizar configuraciones del dashboard

### Pagos
- **GET** `/api/payments` - Obtener historial de pagos
- **POST** `/api/payments` - Crear nuevo pago
- **PUT** `/api/payments` - Actualizar estado de pago
- **DELETE** `/api/payments` - Eliminar pago (solo pendientes/fallidos)

### Análisis de Metadatos
- **GET** `/api/analysis/metadata` - Obtener análisis de metadatos
- **POST** `/api/analysis/metadata` - Crear nuevo análisis de metadatos
- **PUT** `/api/analysis/metadata` - Actualizar análisis
- **DELETE** `/api/analysis/metadata` - Eliminar análisis

### Auditoría de Contenido
- **GET** `/api/analysis/content` - Obtener auditorías de contenido
- **POST** `/api/analysis/content` - Crear nueva auditoría
- **PUT** `/api/analysis/content` - Actualizar auditoría
- **DELETE** `/api/analysis/content` - Eliminar auditoría

### Análisis de Palabras Clave
- **GET** `/api/analysis/keywords` - Obtener análisis de keywords
- **POST** `/api/analysis/keywords` - Crear nuevo análisis
- **PUT** `/api/analysis/keywords` - Actualizar análisis
- **DELETE** `/api/analysis/keywords` - Eliminar análisis

### Verificación de Enlaces
- **GET** `/api/analysis/links` - Obtener verificaciones de enlaces
- **POST** `/api/analysis/links` - Crear nueva verificación
- **PUT** `/api/analysis/links` - Actualizar verificación
- **DELETE** `/api/analysis/links` - Eliminar verificación

### Análisis de Rendimiento
- **GET** `/api/analysis/performance` - Obtener análisis de rendimiento
- **POST** `/api/analysis/performance` - Crear nuevo análisis
- **PUT** `/api/analysis/performance` - Actualizar análisis
- **DELETE** `/api/analysis/performance` - Eliminar análisis

### Análisis de Competencia
- **GET** `/api/analysis/competition` - Obtener análisis de competencia
- **POST** `/api/analysis/competition` - Crear nuevo análisis
- **PUT** `/api/analysis/competition` - Actualizar análisis
- **DELETE** `/api/analysis/competition` - Eliminar análisis

### Análisis de Blockchain
- **GET** `/api/analysis/blockchain` - Obtener análisis de blockchain
- **POST** `/api/analysis/blockchain` - Crear nuevo análisis
- **PUT** `/api/analysis/blockchain` - Actualizar análisis
- **DELETE** `/api/analysis/blockchain` - Eliminar análisis

### Dashboard de IA
- **GET** `/api/analysis/ai-dashboard` - Obtener dashboards de IA
- **POST** `/api/analysis/ai-dashboard` - Crear nuevo dashboard
- **PUT** `/api/analysis/ai-dashboard` - Actualizar dashboard
- **DELETE** `/api/analysis/ai-dashboard` - Eliminar dashboard

### Análisis Social Web3
- **GET** `/api/analysis/social` - Obtener análisis social Web3
- **POST** `/api/analysis/social` - Crear nuevo análisis
- **PUT** `/api/analysis/social` - Actualizar análisis
- **DELETE** `/api/analysis/social` - Eliminar análisis

## Parámetros Comunes

### Parámetros de Query (GET)
- `userId` - ID del usuario (requerido para la mayoría de endpoints)
- `id` - ID específico del recurso
- `projectUrl` - Filtrar por URL del proyecto
- `limit` - Límite de resultados (default: sin límite)
- `offset` - Offset para paginación (default: 0)

### Respuestas Estándar

#### Éxito
```json
{
  "success": true,
  "data": {...},
  "message": "Operación completada exitosamente"
}
```

#### Error
```json
{
  "error": "Descripción del error",
  "details": [...] // Solo para errores de validación
}
```

## Ejemplos de Uso

### 1. Crear Análisis de Metadatos
```javascript
const response = await fetch('/api/analysis/metadata', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    userId: 'user123',
    projectName: 'Mi Proyecto Web3',
    projectUrl: 'https://miproyecto.com',
    titleTag: 'Mi Proyecto - Web3 DeFi',
    metaDescription: 'Plataforma DeFi innovadora...',
    titleLength: 25,
    descriptionLength: 150,
    hasOpenGraph: true,
    hasTwitterCard: true,
    hasCanonical: true,
    seoScore: 85,
    recommendations: [
      'Optimizar meta description',
      'Añadir más palabras clave'
    ]
  })
});

const result = await response.json();
```

### 2. Obtener Dashboard del Usuario
```javascript
const response = await fetch('/api/dashboard?userId=user123');
const dashboardData = await response.json();

console.log('Total de proyectos:', dashboardData.data.stats.totalProjects);
console.log('Análisis recientes:', dashboardData.data.stats.recentActivity);
```

### 3. Crear Pago
```javascript
const response = await fetch('/api/payments', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    userId: 'user123',
    toolId: 'METADATA_ANALYSIS',
    amount: '1000000000000000000', // 1 token en wei
    tokenAddress: '0x...',
    chainId: 1,
    transactionHash: '0x...',
    status: 'pending'
  })
});
```

### 4. Obtener Análisis con Filtros
```javascript
// Obtener análisis de rendimiento con score mínimo
const response = await fetch('/api/analysis/performance?userId=user123&minScore=70&limit=10');

// Obtener verificaciones de enlaces con problemas
const response2 = await fetch('/api/analysis/links?userId=user123&hasIssues=true');

// Obtener análisis de blockchain por contrato
const response3 = await fetch('/api/analysis/blockchain?userId=user123&contractAddress=0x...');
```

## Códigos de Estado HTTP

- **200** - Éxito
- **201** - Creado exitosamente
- **400** - Datos inválidos o parámetros faltantes
- **404** - Recurso no encontrado
- **409** - Conflicto (ej: pago duplicado)
- **500** - Error interno del servidor

## Validación de Datos

Todos los endpoints utilizan validación con Zod. Los errores de validación incluyen:
- Campo requerido faltante
- Tipo de dato incorrecto
- Valor fuera del rango permitido
- Formato inválido (ej: URL, email)

## Características Especiales

### Registro Automático de Acciones
Cada análisis creado automáticamente:
1. Registra una acción en `ToolActionHistory`
2. Actualiza o crea un `AnalysisSummary`
3. Calcula scores promedio

### Estadísticas Agregadas
Los endpoints GET incluyen estadísticas calculadas:
- Promedios de scores
- Conteos de elementos
- Tendencias temporales
- Rankings y comparaciones

### Filtros Avanzados
Cada herramienta soporta filtros específicos:
- **Keywords**: Buscar por palabra clave específica
- **Links**: Filtrar por enlaces rotos
- **Performance**: Filtrar por rango de scores
- **Competition**: Filtrar por competidores
- **Blockchain**: Filtrar por contrato/red
- **AI Dashboard**: Filtrar por modelo/confianza

## Integración con Frontend

Para usar estas APIs en el frontend, utiliza el hook personalizado:

```javascript
import { useDatabase } from '@/hooks/use-database';

function MyComponent() {
  const { 
    createMetadataAnalysis,
    getMetadataAnalyses,
    getUserDashboard,
    createPayment 
  } = useDatabase();

  // Usar las funciones...
}
```

## Seguridad

- Todas las operaciones requieren `userId`
- Validación estricta de entrada
- Sanitización de datos
- Manejo seguro de errores
- No exposición de información sensible

## Rendimiento

- Paginación en todos los listados
- Índices de base de datos optimizados
- Caching de consultas frecuentes
- Límites de resultados configurables

---

**Nota**: Esta documentación cubre todas las APIs creadas para el sistema de herramientas de análisis Web3. Para más detalles sobre campos específicos, consulta los esquemas de validación Zod en cada endpoint.