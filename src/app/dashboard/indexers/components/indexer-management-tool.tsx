"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

import { IconWrapper } from '@/components/ui/icon-wrapper';
import { CreateIndexerDialog, IndexerFormData } from './create-indexer-dialog';
import { 
  Indexer, 
  mockIndexers, 
  getNetworkLabel, 
  getStatusColor
} from '@/utils/indexer-utils';

export function IndexerManagementTool({ filter = 'todos' }: { filter?: 'todos' | 'active' | 'inactive' | 'error' }) {
  const [indexers, setIndexers] = useState<Indexer[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);


  useEffect(() => {
    // Simular la carga de datos
    // TODO: Reemplazar con una llamada real a la API para obtener los indexers del usuario
    // Ejemplo: const fetchedIndexers = await api.indexers.getAllForUser();
    
    // Filtrar los indexadores según el filtro seleccionado
    const filteredIndexers = mockIndexers.filter(indexer => {
      if (filter === 'todos') return true;
      if (filter === 'active' && indexer.status === 'active') return true;
      if (filter === 'inactive' && indexer.status === 'inactive') return true;
      if (filter === 'error' && indexer.status === 'error') return true;
      return false;
    });
    
    setIndexers(filteredIndexers);
    setLoading(false);
  }, [filter]);

  const handleCreateIndexer = () => {
    setShowCreateDialog(true);
  };

  const handleSaveIndexer = (indexerData: IndexerFormData) => {
    // En una implementación real, aquí enviarías los datos a tu API
    // Por ahora, simulamos la creación añadiendo a la lista local
    const newIndexer: Indexer = {
      id: Date.now().toString(), // En una implementación real, el ID vendría del backend
      name: indexerData.name,
      description: indexerData.description,
      status: 'pending', // Nuevo indexador comienza en estado pendiente
      network: indexerData.network,
      dataType: indexerData.dataType,
      createdAt: new Date()
    };
    
    setIndexers(prev => [newIndexer, ...prev]);
  };

  // Las funciones getStatusColor y getNetworkLabel ahora se importan desde utils

  const handleStartIndexer = (id: string) => {
    // En una implementación real, aquí enviarías una solicitud a tu API
    // Por ahora, simulamos el cambio de estado
    setIndexers(prev => 
      prev.map(indexer => 
        indexer.id === id 
          ? { ...indexer, status: 'active', lastRun: new Date() } 
          : indexer
      )
    );
  };

  const handleConfigureIndexer = (id: string) => {
    // TODO: Implementar la lógica para mostrar un diálogo de configuración
    alert(`Configuración del indexador ${id} - Funcionalidad en desarrollo`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <IconWrapper icon="loader-2" className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-2">Cargando indexadores...</p>
      </div>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle>Mis Indexadores</CardTitle>
              <CardDescription>
                Visualiza y administra tus indexadores configurados.
              </CardDescription>
            </div>
            <Button onClick={handleCreateIndexer}>
              <IconWrapper icon="plus" className="mr-2 h-4 w-4" />
              Crear Indexador
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {indexers.length === 0 ? (
            <div className="text-center py-12">
              <IconWrapper icon="server-off" className="mx-auto h-16 w-16 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium text-muted-foreground">No hay indexadores</h3>
              <p className="mt-1 text-sm text-muted-foreground">Empieza creando tu primer indexador para recolectar datos.</p>
              <Button className="mt-6" onClick={handleCreateIndexer}>
                <IconWrapper icon="plus" className="mr-2 h-4 w-4" />
                Crear Primer Indexador
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              {/* Tabla de indexadores */}
              <div className="min-w-full">
                {/* Encabezado de la tabla */}
                <div className="border-b">
                  <div className="flex w-full py-3">
                    <div className="min-w-[200px] px-4 font-medium">Nombre</div>
                    <div className="px-4 font-medium">Estado</div>
                    <div className="min-w-[120px] px-4 font-medium">Red</div>
                    <div className="min-w-[150px] px-4 font-medium">Última Ejecución</div>
                    <div className="min-w-[120px] px-4 font-medium">Creado</div>
                    <div className="min-w-[200px] px-4 text-right font-medium">Acciones</div>
                  </div>
                </div>
                {/* Cuerpo de la tabla */}
                <div>
                  {indexers.map((indexer) => (
                    <div key={indexer.id} className="flex w-full border-b py-4 hover:bg-muted/50">
                      <div className="min-w-[200px] px-4">
                        <div className="font-medium">{indexer.name}</div>
                        {indexer.description && <p className="text-xs text-muted-foreground mt-1">{indexer.description}</p>}
                        <div className="flex flex-wrap gap-1 mt-1">
                          {indexer.dataType.map(type => (
                            <span key={type} className="text-xs px-1.5 py-0.5 bg-primary/10 text-primary rounded-full">
                              {type}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="px-4">
                        {/* Estado del indexador */}
                        <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(indexer.status)}`}>
                          {indexer.status.charAt(0).toUpperCase() + indexer.status.slice(1)}
                        </span>
                      </div>
                      <div className="min-w-[120px] px-4">
                        <span className="text-sm">{getNetworkLabel(indexer.network)}</span>
                      </div>
                      <div className="min-w-[150px] px-4">{indexer.lastRun ? indexer.lastRun.toLocaleString() : 'N/A'}</div>
                      <div className="min-w-[120px] px-4">{indexer.createdAt.toLocaleDateString()}</div>
                      <div className="min-w-[200px] px-4 text-right">
                        <div className="space-x-2 flex justify-end">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleConfigureIndexer(indexer.id)}
                          >
                            <IconWrapper icon="settings-2" className="mr-1 h-3 w-3" />
                            Configurar
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleStartIndexer(indexer.id)}
                            disabled={indexer.status === 'active'}
                          >
                            <IconWrapper icon="play" className="mr-1 h-3 w-3" />
                            Iniciar
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </CardContent>
        {indexers.length > 0 && (
          <CardFooter>
            <p className="text-xs text-muted-foreground">
              Total de indexadores: {indexers.length}
            </p>
          </CardFooter>
        )}
      </Card>
      
      {/* Diálogo de creación de indexadores */}
      <CreateIndexerDialog 
        isOpen={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
        onSave={handleSaveIndexer}
      />
    </>
  );
}