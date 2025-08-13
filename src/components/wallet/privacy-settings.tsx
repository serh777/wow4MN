'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { IconWrapper } from '@/components/ui/icon-wrapper';
import { usePrivacy } from '@/hooks/use-privacy';

export function PrivacySettings() {
  const {
    settings,
    usageStats,
    loading,
    saving,
    saveSettings,
    deleteAllData,
    exportUserData,
    updateSetting,
    isAuthenticated
  } = usePrivacy();

  const handleSaveSettings = async () => {
    await saveSettings(settings);
  };

  if (!isAuthenticated) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">
            Conecta tu wallet para acceder a la configuración de privacidad
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <IconWrapper icon="shield" className="h-5 w-5 text-blue-600" />
          <CardTitle>Configuración de Privacidad</CardTitle>
        </div>
        <CardDescription>
          Controla qué datos guardamos para personalizar tu experiencia
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Configuraciones de datos */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-sm font-medium">Historial de Análisis</Label>
              <p className="text-xs text-muted-foreground">
                Guardar tus análisis anteriores para acceso rápido y comparaciones
              </p>
            </div>
            <Switch
              checked={settings.saveAnalysisHistory}
              onCheckedChange={(checked) => updateSetting('saveAnalysisHistory', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-sm font-medium">Consultas de Búsqueda</Label>
              <p className="text-xs text-muted-foreground">
                Guardar tus búsquedas para sugerencias personalizadas
              </p>
            </div>
            <Switch
              checked={settings.saveSearchQueries}
              onCheckedChange={(checked) => updateSetting('saveSearchQueries', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-sm font-medium">Métricas de Uso</Label>
              <p className="text-xs text-muted-foreground">
                Datos anónimos para mejorar la plataforma (recomendado)
              </p>
            </div>
            <Switch
              checked={settings.saveUsageMetrics}
              onCheckedChange={(checked) => updateSetting('saveUsageMetrics', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-sm font-medium">Personalización</Label>
              <p className="text-xs text-muted-foreground">
                Permitir recomendaciones basadas en tu actividad
              </p>
            </div>
            <Switch
              checked={settings.allowPersonalization}
              onCheckedChange={(checked) => updateSetting('allowPersonalization', checked)}
            />
          </div>
        </div>

        {/* Retención de datos */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Retención de Datos</Label>
          <div className="flex gap-2">
            {[30, 90, 180, 365].map((days) => (
              <Button
                key={days}
                variant={settings.dataRetentionDays === days ? "secondary" : "outline"}
                size="sm"
                onClick={() => updateSetting('dataRetentionDays', days)}
              >
                {days} días
              </Button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            Los datos se eliminarán automáticamente después de este período
          </p>
        </div>

        {/* Estadísticas de uso */}
        {usageStats && (
          <div className="p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <IconWrapper icon="bar-chart" className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium">Estadísticas de Uso</span>
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Análisis realizados:</span>
                <Badge variant="outline">{usageStats.totalAnalyses}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Búsquedas:</span>
                <Badge variant="outline">{usageStats.totalSearches}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Conexiones:</span>
                <Badge variant="outline">{usageStats.connectionCount}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Días activo:</span>
                <Badge variant="outline">{usageStats.accountAge}</Badge>
              </div>
            </div>
            {usageStats.lastActivity && (
              <div className="mt-2 pt-2 border-t border-border">
                <span className="text-xs text-muted-foreground">
                  Última actividad: {new Date(usageStats.lastActivity).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Estado actual */}
        <div className="p-3 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <IconWrapper icon="info" className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium">Estado Actual</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-2">
              <Badge variant={settings.saveAnalysisHistory ? "default" : "secondary"} className="h-4 text-xs">
                {settings.saveAnalysisHistory ? "ON" : "OFF"}
              </Badge>
              <span>Análisis</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={settings.saveSearchQueries ? "default" : "secondary"} className="h-4 text-xs">
                {settings.saveSearchQueries ? "ON" : "OFF"}
              </Badge>
              <span>Búsquedas</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={settings.saveUsageMetrics ? "default" : "secondary"} className="h-4 text-xs">
                {settings.saveUsageMetrics ? "ON" : "OFF"}
              </Badge>
              <span>Métricas</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={settings.allowPersonalization ? "default" : "secondary"} className="h-4 text-xs">
                {settings.allowPersonalization ? "ON" : "OFF"}
              </Badge>
              <span>Personalización</span>
            </div>
          </div>
        </div>

        {/* Acciones */}
        <div className="space-y-3">
          <div className="flex gap-3">
            <Button 
              onClick={handleSaveSettings}
              disabled={saving || loading}
              className="flex-1"
            >
              {saving ? (
                <>
                  <IconWrapper icon="spinner" className="mr-2 h-4 w-4" />
                  Guardando...
                </>
              ) : (
                'Guardar Configuración'
              )}
            </Button>
            
            <Button 
              variant="outline"
              onClick={exportUserData}
              disabled={saving || loading}
            >
              <IconWrapper icon="download" className="mr-2 h-4 w-4" />
              Exportar
            </Button>
          </div>
          
          <Button 
            variant="destructive"
            onClick={deleteAllData}
            disabled={saving || loading}
            className="w-full"
          >
            <IconWrapper icon="trash" className="mr-2 h-4 w-4" />
            Eliminar Todos los Datos
          </Button>
        </div>

        {/* Información adicional */}
        <div className="text-xs text-muted-foreground space-y-1">
          <p>🔒 Tu dirección de wallet se almacena hasheada para mayor seguridad</p>
          <p>📊 Los datos se usan únicamente para mejorar tu experiencia</p>
          <p>🗑️ Puedes eliminar todos tus datos en cualquier momento</p>
        </div>
      </CardContent>
    </Card>
  );
}