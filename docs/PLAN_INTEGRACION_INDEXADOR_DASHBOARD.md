# Plan de Integración del Indexador en el Dashboard

## Resumen Ejecutivo

Este documento describe el plan para integrar el indexador como componente central del flujo de análisis en el dashboard, estableciendo un proceso secuencial: **Conexión Wallet → Activación Indexador → Selección Herramientas → Pago → Análisis con Datos Reales**.

## Arquitectura Propuesta

### Flujo de Usuario Mejorado

```
1. Usuario se conecta con wallet
2. Sistema verifica/crea indexadores necesarios
3. Usuario selecciona herramientas de análisis
4. Sistema calcula precio y muestra preview de datos disponibles
5. Usuario realiza pago
6. Sistema activa indexadores específicos
7. Indexadores recopilan datos en tiempo real
8. Herramientas ejecutan análisis con datos reales
9. Resultados se muestran en dashboard unificado
```

### Componentes Clave

#### 1. IndexerOrchestrator (Nuevo)
```typescript
interface IndexerOrchestrator {
  // Gestión de indexadores por herramienta
  getRequiredIndexers(tools: string[]): IndexerRequirement[];
  
  // Verificación de disponibilidad de datos
  checkDataAvailability(address: string, tools: string[]): DataAvailability;
  
  // Activación automática de indexadores
  activateIndexersForAnalysis(tools: string[], address: string): Promise<void>;
  
  // Monitoreo de progreso
  getIndexingProgress(indexerIds: string[]): IndexingProgress[];
}
```

#### 2. Enhanced Dashboard State
```typescript
interface DashboardState {
  // Estado actual
  walletConnected: boolean;
  selectedTools: string[];
  targetAddress: string;
  
  // Nuevo: Estado del indexador
  indexerStatus: {
    required: IndexerRequirement[];
    active: string[];
    progress: Record<string, number>;
    dataReady: boolean;
  };
  
  // Análisis
  analysisResults: AnalysisResults;
  paymentStatus: PaymentStatus;
}
```

## Implementación por Fases

### Fase 1: Integración Base del Indexador

#### 1.1 Modificar Dashboard Principal
**Archivo**: `src/app/dashboard/page.tsx`

```typescript
// Nuevos imports
import { useIndexerOrchestrator } from '@/hooks/useIndexerOrchestrator';
import { IndexerStatusCard } from '@/components/dashboard/indexer-status-card';

// Nuevo estado
const [indexerState, setIndexerState] = useState({
  required: [],
  active: [],
  progress: {},
  dataReady: false
});

// Hook del orquestador
const { 
  getRequiredIndexers,
  checkDataAvailability,
  activateIndexers,
  getProgress
} = useIndexerOrchestrator();

// Función mejorada de selección de herramientas
const handleToolSelection = async (tool: string) => {
  const newSelectedTools = selectedTools.includes(tool) 
    ? selectedTools.filter(t => t !== tool)
    : [...selectedTools, tool];
  
  setSelectedTools(newSelectedTools);
  
  // Verificar indexadores requeridos
  if (address && newSelectedTools.length > 0) {
    const required = await getRequiredIndexers(newSelectedTools);
    const availability = await checkDataAvailability(address, newSelectedTools);
    
    setIndexerState({
      required,
      active: availability.activeIndexers,
      progress: availability.progress,
      dataReady: availability.dataReady
    });
  }
};
```

#### 1.2 Crear Hook Orquestador
**Archivo**: `src/hooks/useIndexerOrchestrator.ts`

```typescript
export function useIndexerOrchestrator() {
  const { indexers, createIndexer, queryIndexedData } = useIndexerService();
  
  const getRequiredIndexers = async (tools: string[]): Promise<IndexerRequirement[]> => {
    const requirements: IndexerRequirement[] = [];
    
    for (const tool of tools) {
      switch (tool) {
        case 'onchain':
        case 'wallet':
          requirements.push({
            tool,
            network: 'ethereum',
            dataTypes: ['transactions', 'blocks'],
            priority: 'high'
          });
          break;
        case 'social':
          requirements.push({
            tool,
            network: 'ethereum',
            dataTypes: ['events', 'logs'],
            priority: 'medium'
          });
          break;
        // ... más casos
      }
    }
    
    return requirements;
  };
  
  const checkDataAvailability = async (address: string, tools: string[]) => {
    // Verificar qué indexadores están activos y qué datos están disponibles
    const required = await getRequiredIndexers(tools);
    const activeIndexers = indexers.filter(i => i.status === 'active');
    
    // Calcular disponibilidad de datos
    const dataAvailability = await Promise.all(
      required.map(async (req) => {
        const hasActiveIndexer = activeIndexers.some(i => 
          i.network === req.network && 
          req.dataTypes.every(dt => i.dataType.includes(dt))
        );
        
        if (hasActiveIndexer) {
          // Verificar si hay datos para la dirección específica
          const data = await queryIndexedData({
            network: req.network,
            address,
            dataType: req.dataTypes
          });
          
          return {
            tool: req.tool,
            hasData: data.data.length > 0,
            dataCount: data.data.length,
            lastUpdate: data.data[0]?.timestamp
          };
        }
        
        return {
          tool: req.tool,
          hasData: false,
          dataCount: 0,
          needsIndexer: true
        };
      })
    );
    
    return {
      activeIndexers: activeIndexers.map(i => i.id),
      progress: {}, // Implementar lógica de progreso
      dataReady: dataAvailability.every(da => da.hasData),
      details: dataAvailability
    };
  };
  
  return {
    getRequiredIndexers,
    checkDataAvailability,
    activateIndexers: async (tools: string[], address: string) => {
      // Implementar activación automática
    },
    getProgress: () => {
      // Implementar monitoreo de progreso
    }
  };
}
```

#### 1.3 Componente de Estado del Indexador
**Archivo**: `src/components/dashboard/indexer-status-card.tsx`

```typescript
export function IndexerStatusCard({ indexerState, onActivate }: {
  indexerState: IndexerState;
  onActivate: () => void;
}) {
  return (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <IconWrapper icon="server" className="h-5 w-5" />
          Estado del Indexador
        </CardTitle>
      </CardHeader>
      <CardContent>
        {indexerState.required.length === 0 ? (
          <p className="text-muted-foreground">Selecciona herramientas para ver requisitos</p>
        ) : (
          <div className="space-y-3">
            {indexerState.required.map((req) => (
              <div key={req.tool} className="flex items-center justify-between p-2 border rounded">
                <div>
                  <p className="font-medium">{getToolDisplayName(req.tool)}</p>
                  <p className="text-sm text-muted-foreground">
                    Red: {req.network} | Datos: {req.dataTypes.join(', ')}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {indexerState.active.includes(req.tool) ? (
                    <Badge variant="success">Activo</Badge>
                  ) : (
                    <Badge variant="secondary">Inactivo</Badge>
                  )}
                </div>
              </div>
            ))}
            
            {!indexerState.dataReady && (
              <Button onClick={onActivate} className="w-full">
                <IconWrapper icon="play" className="mr-2 h-4 w-4" />
                Activar Indexadores Requeridos
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
```

### Fase 2: Integración con Herramientas de Análisis

#### 2.1 Modificar Función de Análisis
```typescript
const handleAnalysis = async () => {
  if (!indexerState.dataReady) {
    toast({
      title: 'Datos no disponibles',
      description: 'Activa los indexadores necesarios antes de continuar',
      variant: 'destructive'
    });
    return;
  }
  
  setIsAnalyzing(true);
  
  try {
    // Ejecutar análisis con datos reales del indexador
    const analysisPromises = selectedTools.map(async (tool) => {
      const indexedData = await queryIndexedData({
        network: 'ethereum',
        address,
        dataType: getDataTypesForTool(tool)
      });
      
      return executeToolAnalysis(tool, indexedData.data);
    });
    
    const results = await Promise.all(analysisPromises);
    
    // Procesar y mostrar resultados reales
    setResults(processAnalysisResults(results));
    
  } catch (error) {
    console.error('Error en análisis:', error);
  } finally {
    setIsAnalyzing(false);
  }
};
```

#### 2.2 Funciones de Análisis Real
```typescript
const executeToolAnalysis = async (tool: string, data: any[]) => {
  switch (tool) {
    case 'wallet':
      return analyzeWalletData(data);
    case 'onchain':
      return analyzeOnChainData(data);
    case 'social':
      return analyzeSocialData(data);
    // ... más casos
  }
};

const analyzeWalletData = (transactions: Transaction[]) => {
  // Análisis real de transacciones
  const totalVolume = transactions.reduce((sum, tx) => sum + parseFloat(tx.value), 0);
  const uniqueContracts = new Set(transactions.map(tx => tx.to)).size;
  const avgGasPrice = transactions.reduce((sum, tx) => sum + parseFloat(tx.gasPrice), 0) / transactions.length;
  
  return {
    score: calculateWalletScore(totalVolume, uniqueContracts, avgGasPrice),
    status: getStatusFromScore(score),
    details: {
      totalTransactions: transactions.length,
      totalVolume,
      uniqueContracts,
      avgGasPrice,
      riskLevel: calculateRiskLevel(transactions)
    }
  };
};
```

### Fase 3: Dashboard Unificado de Resultados

#### 3.1 Componente de Resultados Mejorado
```typescript
export function UnifiedAnalysisResults({ results, indexerData }: {
  results: AnalysisResults;
  indexerData: IndexedData;
}) {
  return (
    <div className="grid gap-6">
      {/* Resumen General */}
      <Card>
        <CardHeader>
          <CardTitle>Resumen del Análisis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {calculateOverallScore(results)}
              </div>
              <p className="text-sm text-muted-foreground">Score General</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-500">
                {indexerData.totalDataPoints}
              </div>
              <p className="text-sm text-muted-foreground">Datos Analizados</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-500">
                {results.filter(r => r.status === 'good').length}
              </div>
              <p className="text-sm text-muted-foreground">Áreas Óptimas</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-500">
                {results.filter(r => r.status === 'error').length}
              </div>
              <p className="text-sm text-muted-foreground">Requieren Atención</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Resultados por Herramienta */}
      <div className="grid gap-4 md:grid-cols-2">
        {results.map((result) => (
          <ToolResultCard key={result.tool} result={result} />
        ))}
      </div>
      
      {/* Recomendaciones Basadas en Datos Reales */}
      <RecommendationsCard results={results} indexerData={indexerData} />
    </div>
  );
}
```

## Consideraciones Técnicas

### 1. Gestión de Estado
- Usar Zustand o Context API para estado global del indexador
- Implementar persistencia local para configuraciones
- Manejar estados de carga y error de manera consistente

### 2. Optimización de Rendimiento
- Implementar cache para datos indexados frecuentemente consultados
- Usar React Query para gestión de estado del servidor
- Implementar paginación para grandes volúmenes de datos

### 3. Experiencia de Usuario
- Mostrar progreso en tiempo real de la indexación
- Implementar modo offline con datos en cache
- Proporcionar estimaciones de tiempo para completar indexación

### 4. Seguridad
- Validar todas las direcciones de wallet antes de indexar
- Implementar rate limiting para consultas al indexador
- Sanitizar datos antes de mostrar en UI

## Cronograma de Implementación

### Semana 1-2: Fase 1
- Crear hook useIndexerOrchestrator
- Modificar dashboard principal
- Implementar componente IndexerStatusCard
- Testing básico de integración

### Semana 3-4: Fase 2
- Integrar indexador con herramientas de análisis
- Implementar funciones de análisis real
- Crear mapeo de herramientas a tipos de datos
- Testing de análisis con datos reales

### Semana 5-6: Fase 3
- Crear dashboard unificado de resultados
- Implementar componentes de visualización avanzados
- Optimizar rendimiento y UX
- Testing completo y refinamiento

## Métricas de Éxito

1. **Funcionalidad**: 100% de herramientas integradas con indexador
2. **Rendimiento**: Tiempo de análisis < 30 segundos para datasets típicos
3. **Precisión**: Análisis basados en datos reales vs simulados
4. **UX**: Flujo completo sin interrupciones desde conexión hasta resultados
5. **Escalabilidad**: Soporte para múltiples redes y tipos de datos

## Próximos Pasos

1. **Revisar y aprobar** este plan de integración
2. **Configurar entorno** de desarrollo con APIs reales
3. **Implementar Fase 1** con testing básico
4. **Iterar** basado en feedback y testing
5. **Desplegar** versión beta para testing interno

---

*Este documento será actualizado conforme avance la implementación y se identifiquen nuevos requisitos o optimizaciones.*