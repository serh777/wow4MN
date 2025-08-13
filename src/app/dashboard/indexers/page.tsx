'use client';

import { useState } from 'react';
import { IndexerManagementTool } from './components/indexer-management-tool';
import { IconWrapper } from '@/components/ui/icon-wrapper';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import IndexerMetrics from '@/components/indexer/IndexerMetrics';

export default function IndexerManagementPage() {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [activeTab, setActiveTab] = useState("todos");

  const handleDeleteAllIndexers = () => {
    // Aquí implementarías la lógica para eliminar todos los indexadores
    // Por ejemplo, llamar a una API o utilizar un método del componente IndexerManagementTool
    console.log("Eliminando todos los indexadores...");
    
    // Cerrar el diálogo después de la acción
    setShowDeleteDialog(false);
    
    // Aquí podrías mostrar una notificación de éxito
    // Por ejemplo: toast.success("Todos los indexadores han sido eliminados");
  };

  return (
    <div className="container py-6 space-y-6">
      <div className="flex flex-col space-y-2">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <IconWrapper icon="database" className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Administración de Indexadores</h1>
              <p className="text-muted-foreground">
                Gestiona y monitorea tus indexadores de blockchain para recolectar datos eficientemente.
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => window.location.reload()}>
              <IconWrapper icon="refresh-cw" className="h-4 w-4 mr-2" />
              Actualizar
            </Button>
            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
              <DialogTrigger asChild>
                <Button variant="destructive">
                  <IconWrapper icon="trash-2" className="h-4 w-4 mr-2" />
                  Limpiar Indexadores
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>¿Eliminar todos los indexadores?</DialogTitle>
                  <DialogDescription>
                    Esta acción no se puede deshacer. Se eliminarán todos los indexadores y sus datos asociados.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                    Cancelar
                  </Button>
                  <Button variant="destructive" onClick={handleDeleteAllIndexers}>
                    Eliminar todos
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Resumen de Indexadores</CardTitle>
          <CardDescription>
            Visualiza el estado general de tus indexadores y su rendimiento
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-background border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Indexadores Activos</p>
                  <h3 className="text-2xl font-bold">3</h3>
                </div>
                <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center">
                  <IconWrapper icon="activity" className="h-5 w-5 text-green-500" />
                </div>
              </div>
            </div>
            <div className="bg-background border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Datos Indexados</p>
                  <h3 className="text-2xl font-bold">1.2M</h3>
                </div>
                <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                  <IconWrapper icon="database" className="h-5 w-5 text-blue-500" />
                </div>
              </div>
            </div>
            <div className="bg-background border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Última Actualización</p>
                  <h3 className="text-2xl font-bold">Hace 5m</h3>
                </div>
                <div className="h-10 w-10 rounded-full bg-amber-500/10 flex items-center justify-center">
                  <IconWrapper icon="clock" className="h-5 w-5 text-amber-500" />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="grid w-full grid-cols-5 md:w-auto md:inline-flex">
          <TabsTrigger value="todos">Todos</TabsTrigger>
          <TabsTrigger value="activos">Activos</TabsTrigger>
          <TabsTrigger value="inactivos">Inactivos</TabsTrigger>
          <TabsTrigger value="error">Con Errores</TabsTrigger>
          <TabsTrigger value="metricas">Métricas</TabsTrigger>
        </TabsList>
        <TabsContent value="todos">
          <IndexerManagementTool filter="todos" />
        </TabsContent>
        <TabsContent value="activos">
          <IndexerManagementTool filter="active" />
        </TabsContent>
        <TabsContent value="inactivos">
          <IndexerManagementTool filter="inactive" />
        </TabsContent>
        <TabsContent value="error">
          <IndexerManagementTool filter="error" />
        </TabsContent>
        <TabsContent value="metricas">
          <IndexerMetrics />
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Métricas de Rendimiento</CardTitle>
          <CardDescription>
            Visualiza el rendimiento de tus indexadores a lo largo del tiempo
          </CardDescription>
        </CardHeader>
        <CardContent className="h-80 flex items-center justify-center">
          <div className="text-center">
            <IconWrapper icon="bar-chart" className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Las métricas detalladas estarán disponibles próximamente</p>
            <p className="text-xs text-muted-foreground mt-2">
              Activa tus indexadores para comenzar a recopilar datos de rendimiento
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}