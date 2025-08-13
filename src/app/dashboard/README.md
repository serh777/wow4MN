# Integración de Herramientas Dashboard con Indexador Modular

## Descripción General

Este documento explica cómo las diferentes herramientas del dashboard (blockchain, smart-contract, wallet, social-web3) se integran con el componente `IndexerManagementTool` a través de hooks personalizados unificados y un hook base abstracto.

## Arquitectura de Integración

```
┌─────────────────────────────────┐      ┌───────────────────────────┐
│     Herramientas Dashboard      │      │    Indexador Modular      │
├─────────────────────────────────┤      ├───────────────────────────┤
│ ┌─────────┐ ┌────────────────┐ │      │ ┌─────────────────────┐  │
│ │Blockchain│ │ Smart Contract │ │      │ │IndexerManagementTool│  │
│ └────┬────┘ └────────┬───────┘ │      │ └──────────┬──────────┘  │
│      │               │          │      │            │             │
│ ┌────┴────┐ ┌────────┴───────┐ │      │ ┌──────────┴──────────┐  │
│ │  Wallet  │ │   Social-Web3  │ │      │ │   Servicio Indexer   │  │
│ └─────────┘ └────────────────┘ │      │ └─────────────────────┘  │
└──────────────┬──────────────────┘      └───────────┬───────────────┘
               │                                     │
               │         ┌─────────────────┐        │
               └─────────┤  Hooks de API   ├────────┘
                         └─────────────────┘
```

## Hooks Personalizados

### Hook Base Abstracto

Se ha creado un hook base abstracto que maneja la lógica común de todos los hooks de análisis:

- **useAnalysisWithIndexer**: Hook base que proporciona funcionalidad común para todos los hooks de análisis.

### Hooks Específicos Unificados

Se han unificado los hooks duplicados y se han creado los siguientes hooks específicos:

1. **useIndexerService**: Hook central que proporciona acceso al servicio de indexadores.
2. **useBlockchainAnalysis**: Para análisis de datos blockchain.
3. **useSmartContractAnalysis**: Hook unificado para análisis de contratos inteligentes (con o sin indexador).
4. **useWalletAnalysis**: Hook unificado para análisis de carteras (con o sin indexador).
5. **useSocialWeb3Analysis**: Hook unificado para análisis de datos sociales Web3 (con o sin indexador).

## Cómo Utilizar los Hooks

### Ejemplo de uso en un componente de análisis blockchain

```tsx
import { useBlockchainAnalysis } from './components/use-blockchain-analysis';

export function BlockchainAnalysisTool() {
  const { loading, results, handleSubmit } = useBlockchainAnalysis();
  
  // Resto del componente...
}
```

### Ejemplo de uso en un componente de análisis de smart contracts

```tsx
import { useSmartContractAnalysis } from './components/use-smart-contract-analysis-unified';

export function SmartContractAnalysisTool() {
  const { loading, results, handleSubmit } = useSmartContractAnalysis();
  
  // Para usar con indexador
  const handleFormSubmit = (data) => {
    handleSubmit({ ...data, useIndexer: true });
  };
  
  // Para usar sin indexador (datos simulados)
  const handleMockSubmit = (data) => {
    handleSubmit({ ...data, useIndexer: false });
  };
  
  // Resto del componente...
}
```

## Configuración de Proveedores Web3

Para pruebas con datos reales, se utilizan las claves de API configuradas en el archivo `.env`:

```
ALCHEMY_API_KEY=tu_clave_de_alchemy
INFURA_API_KEY=tu_clave_de_infura
```

Estas claves son accesibles a través del módulo de configuración `web3-providers.ts`.

## Arquitectura de Hooks Unificados

```
┌─────────────────────────────────────────────────────────────────┐
│                    useAnalysisWithIndexer                       │
│  (Hook base abstracto con lógica común para todos los análisis) │
└───────────────────────────────┬─────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Hooks Específicos                          │
├─────────────┬─────────────────┬────────────────┬───────────────┤
│useBlockchain│useSmartContract │  useWallet     │useSocialWeb3  │
│  Analysis   │   Analysis      │   Analysis     │  Analysis     │
└──────┬──────┴────────┬────────┴───────┬────────┴───────┬───────┘
        │               │                │                │
        │               │                │                │
        ▼               ▼                ▼                ▼
┌──────────────────────────────────────────────────────────────┐
│                      useIndexerService                        │
│  (Proporciona acceso al servicio de indexadores)             │
└──────────────────────────────────────────────────────────────┘
```

## Flujo de Datos

1. El usuario interactúa con una herramienta del dashboard (ej: análisis de wallet)
2. La herramienta utiliza el hook unificado correspondiente (ej: useWalletAnalysis)
3. El usuario puede elegir si usar el indexador o datos simulados (parámetro useIndexer)
4. Si se usa el indexador:
   a. El hook base consulta al servicio de indexadores a través de useIndexerService
   b. El servicio verifica si hay indexadores disponibles para el tipo de datos solicitado
   c. Si es necesario, inicia un indexador inactivo para obtener los datos
   d. Consulta los datos indexados y los procesa para el análisis
5. Si no se usa el indexador:
   a. El hook genera datos simulados utilizando la función generateMockData
6. Devuelve los resultados formateados a la herramienta para su visualización

## Extensibilidad

Para añadir soporte para nuevos tipos de análisis:

1. Extender la interfaz BaseAnalysisParams con los parámetros específicos del nuevo tipo de análisis
2. Crear un nuevo hook que utilice useAnalysisWithIndexer
3. Implementar las funciones específicas:
   - validateParams: Para validar los parámetros específicos
   - processResults: Para procesar los resultados del indexador
   - generateMockData: Para generar datos simulados cuando no se usa el indexador
4. Integrar el hook en el componente de la herramienta correspondiente

## Consideraciones de Rendimiento

- Los indexadores deben configurarse para los tipos de datos más utilizados
- Considerar implementar caché para consultas frecuentes
- Monitorear el uso de recursos de los indexadores activos
- Optimizar el uso de datos simulados cuando no se requiera precisión absoluta

## Sistema de Notificaciones Mejorado

El sistema de notificaciones ha sido mejorado para proporcionar más contexto sobre los análisis:

- Notificaciones de inicio de análisis con detalles específicos
- Notificaciones de finalización con puntuación y resumen
- Notificaciones de error con mensajes descriptivos
- Seguimiento para análisis de larga duración