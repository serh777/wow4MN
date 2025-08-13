# Esquema de Base de Datos - WowSEO Web3

Este documento describe la estructura completa de la base de datos para todas las herramientas de análisis Web3.

## Tablas Principales

### 1. Tablas de Análisis por Herramienta

#### MetadataAnalysis
Almacena resultados de análisis de metadatos SEO.

```sql
- id: UUID único
- userId: Referencia al usuario
- projectName: Nombre del proyecto
- projectUrl: URL del proyecto
- title: JSON con {value, score, recommendations}
- description: JSON con análisis de descripción
- keywords: JSON con análisis de palabras clave
- ogTags: JSON con análisis de Open Graph
- twitterTags: JSON con análisis de Twitter Cards
- overallScore: Puntuación general (0-100)
- status: Estado del análisis (pending, completed, failed)
```

#### ContentAudit
Resultados de auditoría de contenido.

```sql
- contentQuality: JSON con {score, issues, recommendations}
- readability: JSON con métricas de legibilidad
- structure: JSON con análisis de estructura
- multimedia: JSON con optimización de medios
- accessibility: JSON con análisis de accesibilidad
```

#### KeywordAnalysis
Análisis de palabras clave y SEO.

```sql
- targetKeywords: JSON array de keywords objetivo
- keywordData: JSON con datos detallados de cada keyword
- competition: JSON con análisis de competencia
- opportunities: JSON con oportunidades identificadas
```

#### LinkVerification
Verificación y análisis de enlaces.

```sql
- internalLinks: JSON con {total, working, broken, redirects}
- externalLinks: JSON con análisis de enlaces externos
- backlinks: JSON con {total, quality_distribution, sources}
- linkHealth: JSON con {score, issues, recommendations}
```

#### PerformanceAnalysis
Análisis de rendimiento web.

```sql
- loadTime: JSON con {desktop, mobile, metrics}
- coreWebVitals: JSON con {LCP, FID, CLS, scores}
- optimization: JSON con recomendaciones de optimización
- mobile: JSON con análisis de responsividad
- security: JSON con análisis de seguridad
```

#### CompetitionAnalysis
Análisis de competencia.

```sql
- competitors: JSON array de competidores identificados
- marketShare: JSON con análisis de cuota de mercado
- strengths: JSON con fortalezas identificadas
- weaknesses: JSON con debilidades encontradas
- opportunities: JSON con oportunidades de mejora
- threats: JSON con amenazas del mercado
```

#### BlockchainAnalysis
Análisis específico de blockchain.

```sql
- network: Red blockchain (ethereum, polygon, bsc, etc.)
- address: Dirección del contrato/wallet (opcional)
- transactions: JSON con datos de transacciones
- events: JSON con eventos del contrato
- tokenMetrics: JSON con métricas de tokens
- security: JSON con análisis de seguridad
- performance: JSON con rendimiento de la red
```

#### AIAssistantDashboard
Dashboard del asistente IA.

```sql
- recommendations: JSON con recomendaciones generadas por IA
- insights: JSON con insights y análisis
- actionItems: JSON con elementos de acción sugeridos
- priorities: JSON con prioridades identificadas
- roadmap: JSON con hoja de ruta sugerida
```

#### SocialWeb3Analysis
Análisis de presencia social Web3.

```sql
- address: Dirección Web3
- network: Red blockchain
- platforms: JSON con plataformas analizadas
- activity: JSON con actividad social
- followers: JSON con datos de seguidores
- content: JSON con análisis de contenido
- engagement: JSON con métricas de engagement
- influence: JSON con métricas de influencia
```

### 2. Tablas de Gestión

#### ToolPayment
Gestión de pagos por herramientas.

```sql
- toolId: ID de la herramienta según TOOL_IDS
- toolName: Nombre legible de la herramienta
- amount: Cantidad pagada en wei
- tokenAddress: Dirección del token usado
- tokenSymbol: Símbolo del token (USDT, USDC, DAI)
- txHash: Hash de la transacción (único)
- blockNumber: Número de bloque
- network: Red blockchain
- status: Estado del pago (pending, confirmed, failed)
- planId: ID del plan (1: individual, 2: completo)
- discount: Porcentaje de descuento aplicado
```

#### UserSettings
Configuraciones personalizadas del usuario.

```sql
- preferredNetwork: Red blockchain preferida
- preferredToken: Token preferido para pagos
- notifications: JSON con configuraciones de notificaciones
- theme: Tema de la interfaz (light, dark, system)
- language: Idioma preferido
- timezone: Zona horaria
```

#### ToolActionHistory
Historial de acciones realizadas con herramientas.

```sql
- toolId: ID de la herramienta
- toolName: Nombre de la herramienta
- action: Tipo de acción (analysis_started, analysis_completed, payment_made)
- description: Descripción de la acción
- resourceId: ID del recurso relacionado
- metadata: JSON con metadatos adicionales
- txHash: Hash de transacción si aplica
- network: Red blockchain si aplica
```

#### AnalysisSummary
Resúmenes agregados de análisis por proyecto.

```sql
- projectName: Nombre del proyecto (único por usuario)
- projectUrl: URL del proyecto
- totalAnalyses: Número total de análisis realizados
- averageScore: Puntuación promedio
- lastAnalysis: Fecha del último análisis
- toolsUsed: JSON array de herramientas utilizadas
- improvements: JSON array de mejoras sugeridas
- status: Estado del proyecto (active, archived)
```

### 3. Tablas del Sistema

#### User
Usuarios del sistema con todas las relaciones.

#### ToolData
Tabla genérica para compatibilidad (mantener datos existentes).

#### Indexer, IndexerJob, IndexerConfig
Sistema de indexación blockchain.

#### Block, Transaction, Event
Datos de blockchain indexados.

## Índices Importantes

```sql
-- Índices para optimizar consultas frecuentes
ToolPayment: [userId], [toolId], [status]
ToolActionHistory: [userId], [toolId], [action]
AnalysisSummary: [userId], [projectUrl]
```

## Restricciones Únicas

```sql
-- Evitar duplicados
ToolPayment.txHash: UNIQUE
AnalysisSummary: UNIQUE [userId, projectName]
UserSettings.userId: UNIQUE
```

## Uso Recomendado

### Para Crear un Nuevo Análisis
1. Insertar registro en la tabla específica de la herramienta
2. Crear entrada en `ToolActionHistory` con action='analysis_started'
3. Al completar, actualizar status y crear otra entrada con action='analysis_completed'
4. Actualizar o crear `AnalysisSummary` para el proyecto

### Para Procesar Pagos
1. Crear registro en `ToolPayment` con status='pending'
2. Al confirmar transacción, actualizar status='confirmed'
3. Crear entrada en `ToolActionHistory` con action='payment_made'

### Para Consultas de Dashboard
- Usar `AnalysisSummary` para vistas generales
- Usar tablas específicas para detalles de análisis
- Usar `ToolActionHistory` para líneas de tiempo

## Migración Aplicada

La migración `20250715002323_add_all_tools_tables` ha sido aplicada exitosamente.
Todas las tablas están listas para usar.

## Cliente Prisma

El cliente Prisma ha sido generado en `src/generated/prisma`.
Puede ser importado con:

```typescript
import { PrismaClient } from '../generated/prisma';
```