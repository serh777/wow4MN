# Análisis general, mejoras y pasos de implementación

Este documento resume el estado actual del dashboard, la consistencia de rutas y herramientas, y propone mejoras concretas con pasos de implementación. Incluye además cómo poner cada herramienta en “modo real”.

## 1) Estado general del sitio
- Arquitectura App Router (Next.js) con cada herramienta bajo `/dashboard/{tool}` y, en la mayoría de los casos, una pantalla de resultados en `/dashboard/{tool}/analysis-results`.
- Página principal del dashboard con selección de herramientas, validación Web3 y orquestación de indexadores.
- Existe una página unificada de resultados en `/dashboard/unified-results` para consolidar salidas multi-herramienta.
- Hook de orquestación de indexadores central: `useIndexerOrchestrator`, y hooks por herramienta para el análisis.

## 2) Mapa de rutas y consistencia
Patrón recomendado:
- Entrada: `/dashboard/{tool}/page.tsx`
- Resultados: `/dashboard/{tool}/analysis-results/page.tsx`
- Alias opcional en `/dashboard/tools/{tool}/page.tsx` para accesos directos.

Hallazgos relevantes:
- metadata: usa `/dashboard/metadata/results/page.tsx` (singular "results"), distinta a la convención `analysis-results`.
- competition: contiene un archivo de respaldo `page.tsx.backup` en `analysis-results` que debería limpiarse.
- El directorio `/dashboard/tools` sólo incluye accesos directos para un subconjunto de herramientas (ai-assistant, backlinks, content, keywords, links, metadata, performance, social-web3, wallet). Faltan accesos directos para otras herramientas existentes (blockchain, competition, security, smart-contract, authority-tracking, metaverse-optimizer, content-authenticity, nft-tracking, ecosystem-interactions, historical, indexers, reports, settings, unified-results, links ya está).

Acciones de estandarización propuestas:
1) Renombrar `metadata/results` a `metadata/analysis-results`.
2) Eliminar archivos de respaldo sueltos (`*.backup`).
3) Crear accesos directos coherentes en `/dashboard/tools/{tool}` para TODAS las herramientas visibles en el dashboard principal.
4) Alinear nombres e iconos entre `AVAILABLE_TOOLS` y las rutas efectivas.

## 3) Recomendaciones globales
- Unificar el layout de resultados (usar siempre un `ToolLayout`/componentes comunes) y el esquema de métricas/estados de carga.
- Normalizar navegación: siempre mandar a `analysis-results` con `searchParams` consistentes (address/url, selectedTools, jobId cuando aplique).
- Estandarizar tipados de resultados por herramienta para facilitar `unified-results`.
- Telemetría y estados: publicar progreso en tiempo real vía SSE/WebSocket cuando el análisis sea asíncrono.
- Limpieza técnica: suprimir duplicados y backups, y agregar tests de verificación de rutas.

## 4) Pasos de implementación (sugerencia por sprints)
Sprint 1 – Consistencia de rutas y UX
- Renombrar `metadata/results` -> `metadata/analysis-results`.
- Crear accesos directos en `/dashboard/tools` para herramientas faltantes.
- Eliminar `competition/analysis-results/page.tsx.backup`.
- Revisar `AVAILABLE_TOOLS` y mapear 1:1 a rutas existentes.

Sprint 2 – Unificación de layout y navegación
- Centralizar `ToolLayout` y secciones comunes (score, métricas, oportunidades, diagnósticos) y aplicarlo a todas las herramientas.
- Estándar para `searchParams`: `address`, `url`, `tool`, `jobId`.

Sprint 3 – “Modo real” (backend/indexers/APIs)
- Definir variables de entorno y endpoints por herramienta.
- Adaptar hooks de análisis para consumir APIs reales.
- Orquestación con `useIndexerOrchestrator` cuando aplique (blockchain/web3).

Sprint 4 – Progreso en tiempo real y consolidación
- Añadir SSE/WebSocket para progreso.
- Homogeneizar tipos de resultados y conectar `unified-results`.

## 5) Modo real por herramienta (resumen)
Nota: “modo real” = conectar cada hook a su API/servicio/indexer real, definiendo `.env` y manejo de estados/errores.

- ai-assistant
  - Hook: `ai-assistant/components/use-ai-analysis.ts`
  - Acción: Implementar llamada a API de IA (backend propio o servicio externo), manejar `jobId` y polling/streaming.
  - Env: API base y token.

- backlinks
  - Hook: `backlinks/components/use-backlinks-analysis.ts`
  - Acción: Integrar con proveedor de backlinks (API), normalizar métricas (dominio, autoridad, spam score) y paginación.
  - Env: API base, key.

- blockchain
  - Hook: `blockchain/components/use-blockchain-analysis.ts` (o `use-blockchain-analysis-unified.ts`)
  - Acción: Conectar con indexadores (The Graph/Alchemy/QuickNode) vía `useIndexerOrchestrator`, activar indexadores requeridos, y consultar balances/tx/contracts.
  - Env: URLs RPC/Indexers, chainId, keys.

- competition
  - Hook: `competition/components/use-competition-analysis.ts`
  - Acción: API de benchmarking (SERP/competidores), normalizar KPIs y posiciones.
  - Env: API base, key.

- content
  - Hook: `content/analysis-results/components/*` (lógica de carga y tipos)
  - Acción: Conectar con analizador de contenido (lectura de HTML, densidad, legibilidad) y/o LLM para calidad semántica.
  - Env: API de crawler/LLM.

- content-authenticity
  - Hook: `social-web3`/`content-authenticity` (crear si falta)
  - Acción: Verificación de firmas, timestamping y/o integridad (p. ej., OpenTimestamps, EAS) usando Web3.
  - Env: RPC/contract address/keys.

- ecosystem-interactions
  - Hook: crear `use-ecosystem-analysis.ts` si no existe.
  - Acción: Mapear interacciones entre contratos/cuentas mediante indexadores.
  - Env: Indexer endpoints y chain config.

- historical
  - Hook: `historical/components/use-historical-analysis.tsx`
  - Acción: API/servicio que devuelva series temporales de métricas SEO/Web3 históricas.
  - Env: API base.

- keywords
  - Hook: `keywords/components/use-keywords-analysis.tsx`
  - Acción: Conectar con proveedor de keywords (volumen, dificultad, CPC), soportar localización e idioma.
  - Env: API base, key.

- links
  - Hook: `links/components/use-links-analysis.tsx`
  - Acción: API para auditoría interna/externa de enlaces (rotos, redirecciones, anchor text).
  - Env: API base.

- metadata
  - Hook: `use-metadata-analysis.ts` (global en `src/hooks`)
  - Acción: Crawler/renderer que obtenga metadatos (title, description, canonicals, schema) y los valide.
  - Env: API base.

- metaverse-optimizer
  - Hook: crear `use-metaverse-optimizer.ts` si no existe.
  - Acción: Integrar con datasets del metaverso/NFT para recomendaciones.
  - Env: API base.

- nft-tracking
  - Hook: crear `use-nft-tracking.ts` o unificar con Web3 hooks.
  - Acción: Indexar colecciones/owners/transfers; usar moralis/alchemy NFT APIs.
  - Env: API key, chain.

- performance
  - Hook: `performance/components/use-performance-analysis.ts`
  - Acción: Ejecutar Lighthouse/PSI o motor propio; soportar dispositivo y throttling.
  - Env: PSI/LH endpoints y tokens.

- security
  - Hook: `security/components/use-security-analysis.ts`
  - Acción: Escaneo de cabeceras, CSP, vulnerabilidades conocidas y auditoría de dependencias.
  - Env: API base.

- smart-contract
  - Hook: `smart-contract/components/use-smart-contract-analysis*.ts`
  - Acción: Integrar análisis de bytecode/ABI, verificación de contrato, estático/dinámico (Slither, MythX, Sourcify/Etherscan).
  - Env: RPC, APIs de explorador, keys.

- social-web3
  - Hook: `social-web3/components/use-social-web3-analysis*.ts`
  - Acción: Integrar con Farcaster/Lens/Twitter APIs; correlacionar con wallets.
  - Env: API keys.

- authority-tracking
  - Acción: Definir hook de tracking (autoridad de dominio/autor/contrato) y fuente (p. ej., Moz/Ahrefs + on-chain signals).
  - Env: API base y keys.

- wallet
  - Componentes: `wallet/components/wallet-hub.tsx`, `UnifiedWalletConnect`.
  - Acción: Asegurar conexión de wallet y gating de herramientas premium; exponer balance y red.
  - Env: RPC/chain y Project IDs.

## 6) Checklist de verificación automática (recomendado)
- Script que valide que por cada carpeta `/dashboard/{tool}` existe `page.tsx` y opcional `analysis-results/page.tsx` y que `AVAILABLE_TOOLS` los incluye.
- Test que verifique que cada alias en `/dashboard/tools/{tool}` resuelve a una herramienta real.
- Test de navegación que valide `searchParams` requeridos y renders básicos de resultados.

## 7) Variables de entorno sugeridas (ejemplo)
- BACKEND_API_BASE_URL
- INDEXERS_RPC_URLS (por red)
- ANALYSIS_API_KEYS (por proveedor: SERP, backlinks, keywords, LLM, PSI, etc.)
- WALLET_PROJECT_ID / CHAIN_ID

Con estas acciones se obtiene una base consistente y escalable, con herramientas en modo real y experiencia uniforme de análisis y visualización:


Pasos para Implementar las Herramientas de SEO Web3
Configuración del Entorno de Desarrollo:

Crearé un archivo de configuración de entorno (.env) a partir del ejemplo existente.
Lo llenaré con valores temporales. Te solicitaré las claves de API reales a medida que las necesite para cada herramienta.
Desarrollaré un módulo centralizado para gestionar las configuraciones, facilitando el cambio entre diferentes proveedores de datos (por ejemplo, Alchemy o Infura).
Implementación de la Herramienta "Análisis IA" (ai-assistant):

Crearé un nuevo servicio para comunicarme con la API de Anthropic.
Modificaré el hook use-ai-analysis.ts para eliminar los datos simulados.
Implementaré la lógica para obtener datos reales de la blockchain a través del servicio de indexación.
Realizaré la llamada al servicio de Anthropic con los datos obtenidos y tu consulta.
Actualizaré la página de resultados para que muestre los datos reales del análisis.
Implementación de las Herramientas Basadas en Blockchain (metadata, performance):

Para cada herramienta, modificaré su hook correspondiente para eliminar los datos simulados.
Utilizaré un proveedor de blockchain (configurado en el paso 1) para obtener datos reales, como metadatos de contratos, consumo de gas, y datos de transacciones.
Implementaré la lógica de análisis basada en los datos reales obtenidos.
Implementación de la Herramienta social-web3:

Aprovecharé que esta herramienta ya tiene una estructura de lógica real.
Me centraré en conectar su hook (use-social-web3-analysis-unified.ts) al servicio de indexación para consultar y procesar datos sociales en tiempo real.
Implementación de Herramientas de SEO Tradicional (backlinks, content, keywords, links):

Estas herramientas dependen de servicios de terceros (por ejemplo, Ahrefs, Google Keyword Planner) o de un rastreador web personalizado.
Para cada una, te consultaré sobre el servicio que prefieres utilizar y solicitaré la clave de API correspondiente.
Desarrollaré los módulos necesarios para integrarme con estas APIs, eliminaré los datos simulados y procesaré los resultados reales.
Pruebas y Verificación:

Después de implementar cada herramienta, realizaré pruebas para asegurar su correcto funcionamiento.
Te pediré ejemplos reales (direcciones de contratos, URLs, etc.) para validar los resultados.
Informe Final y Despliegue:

Una vez que todas las herramientas estén funcionales y probadas, te entregaré un informe final resumiendo el trabajo realizado.
Prepararé una guía detallada para el despliegue a producción, incluyendo la configuración de las claves de API en tu entorno de Netlify.