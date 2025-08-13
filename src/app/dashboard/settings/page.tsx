"use client"

import React, { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Select } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useTheme } from 'next-themes';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Settings, User, Bell, Shield, Palette, Globe, Wallet, Database, Download, Trash2, Save, RefreshCw } from 'lucide-react';

interface UserSettings {
  // General
  theme: string;
  language: string;
  timezone: string;
  currency: string;
  analytics: boolean;
  autoSave: boolean;
  
  // Account
  name: string;
  email: string;
  bio: string;
  avatar: string;
  twoFactorEnabled: boolean;
  
  // Notifications
  emailNotifications: boolean;
  pushNotifications: boolean;
  marketingEmails: boolean;
  securityAlerts: boolean;
  weeklyReports: boolean;
  doNotDisturb: boolean;
  doNotDisturbStart: string;
  doNotDisturbEnd: string;
  notificationDays: string[];
  
  // Privacy
  dataCollection: boolean;
  thirdPartyCookies: boolean;
  profileVisibility: string;
  activityTracking: boolean;
}

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  
  const [settings, setSettings] = useState<UserSettings>({
    // General
    theme: 'system',
    language: 'es',
    timezone: 'America/Mexico_City',
    currency: 'MXN',
    analytics: true,
    autoSave: true,
    
    // Account
    name: user?.user_metadata?.full_name || '',
    email: user?.email || '',
    bio: '',
    avatar: '',
    twoFactorEnabled: false,
    
    // Notifications
    emailNotifications: true,
    pushNotifications: true,
    marketingEmails: false,
    securityAlerts: true,
    weeklyReports: false,
    doNotDisturb: false,
    doNotDisturbStart: '22:00',
    doNotDisturbEnd: '08:00',
    notificationDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
    
    // Privacy
    dataCollection: true,
    thirdPartyCookies: false,
    profileVisibility: 'friends',
    activityTracking: true,
  });
  
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  const loadUserSettings = useCallback(async () => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/user/settings?userId=${user.id}`);
      if (response.ok) {
        const data = await response.json();
        setSettings(prev => ({ ...prev, ...data }));
      }
    } catch (error) {
      console.error('Error loading settings:', error);
      toast.error('Error al cargar la configuración');
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  // Evitar problemas de hidratación
  useEffect(() => {
    setMounted(true);
    loadUserSettings();
  }, [loadUserSettings]);
  
  const saveSettings = useCallback(async () => {
    if (!user?.id) return;
    
    setSaving(true);
    try {
      const response = await fetch('/api/user/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          settings
        }),
      });
      
      if (response.ok) {
        toast.success('Configuración guardada exitosamente');
      } else {
        throw new Error('Error al guardar');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Error al guardar la configuración');
    } finally {
      setSaving(false);
    }
  }, [user?.id, settings]);
  
  const updatePassword = useCallback(async () => {
    if (!passwords.current || !passwords.new || !passwords.confirm) {
      toast.error('Todos los campos de contraseña son requeridos');
      return;
    }
    
    if (passwords.new !== passwords.confirm) {
      toast.error('Las contraseñas no coinciden');
      return;
    }
    
    if (passwords.new.length < 8) {
      toast.error('La contraseña debe tener al menos 8 caracteres');
      return;
    }
    
    try {
      const response = await fetch('/api/user/password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user?.id,
          currentPassword: passwords.current,
          newPassword: passwords.new
        }),
      });
      
      if (response.ok) {
        toast.success('Contraseña actualizada exitosamente');
        setPasswords({ current: '', new: '', confirm: '' });
      } else {
        const error = await response.json();
        toast.error(error.message || 'Error al actualizar la contraseña');
      }
    } catch (error) {
      console.error('Error updating password:', error);
      toast.error('Error al actualizar la contraseña');
    }
  }, [passwords, user?.id]);
  
  const exportData = useCallback(async () => {
    try {
      const response = await fetch(`/api/user/export?userId=${user?.id}`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `user-data-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        toast.success('Datos exportados exitosamente');
      }
    } catch (error) {
      console.error('Error exporting data:', error);
      toast.error('Error al exportar los datos');
    }
  }, [user?.id]);
  
  const deleteAccount = useCallback(async () => {
    if (!confirm('¿Estás seguro de que quieres eliminar tu cuenta? Esta acción no se puede deshacer.')) {
      return;
    }
    
    try {
      const response = await fetch('/api/user/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: user?.id }),
      });
      
      if (response.ok) {
        toast.success('Cuenta eliminada exitosamente');
        // Redirect to login or home
        window.location.href = '/';
      }
    } catch (error) {
      console.error('Error deleting account:', error);
      toast.error('Error al eliminar la cuenta');
    }
  }, [user?.id]);

  if (!mounted) {
    return null;
  }

  return (
    <div className="container mx-auto py-8 max-w-6xl">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <Settings className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Configuración</h1>
            <p className="text-muted-foreground">Personaliza tu experiencia en la plataforma</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button 
            onClick={saveSettings} 
            disabled={saving || loading}
            className="flex items-center space-x-2"
          >
            {saving ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            <span>{saving ? 'Guardando...' : 'Guardar Todo'}</span>
          </Button>
        </div>
      </div>
      
      {loading && (
        <Alert className="mb-6">
          <RefreshCw className="h-4 w-4 animate-spin" />
          <AlertDescription>Cargando configuración...</AlertDescription>
        </Alert>
      )}
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-8">
          <TabsTrigger value="general" className="flex items-center space-x-2">
            <Palette className="h-4 w-4" />
            <span>General</span>
          </TabsTrigger>
          <TabsTrigger value="cuenta" className="flex items-center space-x-2">
            <User className="h-4 w-4" />
            <span>Cuenta</span>
          </TabsTrigger>
          <TabsTrigger value="notificaciones" className="flex items-center space-x-2">
            <Bell className="h-4 w-4" />
            <span>Notificaciones</span>
          </TabsTrigger>
          <TabsTrigger value="privacidad" className="flex items-center space-x-2">
            <Shield className="h-4 w-4" />
            <span>Privacidad</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Palette className="h-5 w-5" />
                  <span>Apariencia</span>
                </CardTitle>
                <CardDescription>
                  Personaliza la apariencia de la interfaz
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Tema</Label>
                  <Select 
                    value={settings.theme} 
                    onValueChange={(value) => {
                      setSettings(prev => ({ ...prev, theme: value }));
                      setTheme(value);
                    }}
                    aria-label="Seleccionar tema"
                  >
                    <option value="light">Claro</option>
                    <option value="dark">Oscuro</option>
                    <option value="system">Sistema</option>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="auto-save">Guardado Automático</Label>
                    <Switch 
                      id="auto-save"
                      checked={settings.autoSave}
                      onCheckedChange={(checked) => 
                        setSettings(prev => ({ ...prev, autoSave: checked }))
                      }
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Guarda automáticamente los cambios cada 30 segundos.
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Globe className="h-5 w-5" />
                  <span>Localización</span>
                </CardTitle>
                <CardDescription>
                  Configura tu región y preferencias locales
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                   <Label>Idioma</Label>
                   <Select 
                     value={settings.language} 
                     onValueChange={(value) => 
                       setSettings(prev => ({ ...prev, language: value }))
                     }
                     aria-label="Seleccionar idioma"
                   >
                     <option value="es">🇪🇸 Español</option>
                     <option value="en">🇺🇸 English</option>
                     <option value="fr">🇫🇷 Français</option>
                     <option value="de">🇩🇪 Deutsch</option>
                   </Select>
                 </div>
                
                <div className="space-y-2">
                  <Label>Zona Horaria</Label>
                  <Select 
                    value={settings.timezone} 
                    onValueChange={(value) => 
                      setSettings(prev => ({ ...prev, timezone: value }))
                    }
                    aria-label="Seleccionar zona horaria"
                  >
                    <option value="America/Mexico_City">🇲🇽 Ciudad de México (GMT-6)</option>
                    <option value="America/New_York">🇺🇸 Nueva York (GMT-5)</option>
                    <option value="Europe/London">🇬🇧 Londres (GMT+0)</option>
                    <option value="Europe/Madrid">🇪🇸 Madrid (GMT+1)</option>
                    <option value="Asia/Tokyo">🇯🇵 Tokio (GMT+9)</option>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Moneda</Label>
                  <Select 
                    value={settings.currency} 
                    onValueChange={(value) => 
                      setSettings(prev => ({ ...prev, currency: value }))
                    }
                    aria-label="Seleccionar moneda"
                  >
                    <option value="USD">💵 USD - Dólar Americano</option>
                    <option value="EUR">💶 EUR - Euro</option>
                    <option value="MXN">🇲🇽 MXN - Peso Mexicano</option>
                    <option value="GBP">💷 GBP - Libra Esterlina</option>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Database className="h-5 w-5" />
                <span>Análisis y Rendimiento</span>
              </CardTitle>
              <CardDescription>
                Configura cómo recopilamos datos para mejorar tu experiencia
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="analytics">Análisis de Uso</Label>
                    <Switch 
                      id="analytics"
                      checked={settings.analytics}
                      onCheckedChange={(checked) => 
                        setSettings(prev => ({ ...prev, analytics: checked }))
                      }
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Ayúdanos a mejorar con datos anónimos de uso.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Estado del Sistema</Label>
                    <Badge variant="default" className="bg-green-500">
                      Operativo
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Todos los servicios funcionan correctamente.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="cuenta" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>Información Personal</span>
                </CardTitle>
                <CardDescription>
                  Actualiza tu información de perfil
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="h-20 w-20 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                    {settings.name ? settings.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div className="flex-1">
                    <Button variant="outline" size="sm">
                      Cambiar Avatar
                    </Button>
                    <p className="text-sm text-muted-foreground mt-1">
                      JPG, PNG o GIF. Máximo 2MB.
                    </p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre Completo</Label>
                  <Input 
                    id="name" 
                    value={settings.name}
                    onChange={(e) => setSettings(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Tu nombre completo" 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Correo Electrónico</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={settings.email}
                    onChange={(e) => setSettings(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="tu@email.com" 
                  />
                  <p className="text-sm text-muted-foreground">
                    Se enviará un email de verificación si cambias tu correo.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="bio">Biografía</Label>
                  <Textarea 
                    id="bio" 
                    value={settings.bio}
                    onChange={(e) => setSettings(prev => ({ ...prev, bio: e.target.value }))}
                    placeholder="Cuéntanos sobre ti..."
                    rows={3}
                  />
                  <p className="text-sm text-muted-foreground">
                    {settings.bio.length}/500 caracteres
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-5 w-5" />
                  <span>Seguridad</span>
                </CardTitle>
                <CardDescription>
                  Protege tu cuenta con medidas de seguridad adicionales
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Autenticación de Dos Factores</Label>
                      <p className="text-sm text-muted-foreground">
                        Añade una capa extra de seguridad
                      </p>
                    </div>
                    <Switch 
                      checked={settings.twoFactorEnabled}
                      onCheckedChange={(checked) => 
                        setSettings(prev => ({ ...prev, twoFactorEnabled: checked }))
                      }
                    />
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <Label>Última Actividad</Label>
                  <div className="text-sm text-muted-foreground">
                    <p>Último acceso: Hoy a las 14:30</p>
                    <p>Dispositivo: Chrome en Windows</p>
                    <p>IP: 192.168.1.100</p>
                  </div>
                </div>
                
                <Button variant="outline" className="w-full">
                  Ver Historial de Sesiones
                </Button>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Cambiar Contraseña</CardTitle>
              <CardDescription>
                Actualiza tu contraseña para mantener tu cuenta segura
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Contraseña Actual</Label>
                  <Input 
                    id="current-password" 
                    type="password"
                    value={passwords.current}
                    onChange={(e) => setPasswords(prev => ({ ...prev, current: e.target.value }))}
                    placeholder="Contraseña actual"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="new-password">Nueva Contraseña</Label>
                  <Input 
                    id="new-password" 
                    type="password"
                    value={passwords.new}
                    onChange={(e) => setPasswords(prev => ({ ...prev, new: e.target.value }))}
                    placeholder="Nueva contraseña"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirmar Contraseña</Label>
                  <Input 
                    id="confirm-password" 
                    type="password"
                    value={passwords.confirm}
                    onChange={(e) => setPasswords(prev => ({ ...prev, confirm: e.target.value }))}
                    placeholder="Confirmar contraseña"
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button onClick={updatePassword} disabled={!passwords.current || !passwords.new || !passwords.confirm}>
                  Actualizar Contraseña
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setPasswords({ current: '', new: '', confirm: '' })}
                >
                  Cancelar
                </Button>
              </div>
              
              <Alert>
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  Tu contraseña debe tener al menos 8 caracteres e incluir mayúsculas, minúsculas y números.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notificaciones" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Bell className="h-5 w-5" />
                  <span>Notificaciones en Tiempo Real</span>
                </CardTitle>
                <CardDescription>
                  Configura las notificaciones instantáneas
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="push-notifications">Notificaciones Push</Label>
                      <p className="text-sm text-muted-foreground">
                        Alertas en tiempo real en tu navegador
                      </p>
                    </div>
                    <Switch 
                      id="push-notifications" 
                      checked={settings.pushNotifications}
                      onCheckedChange={(checked) => 
                        setSettings(prev => ({ ...prev, pushNotifications: checked }))
                      }
                    />
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="security-alerts">Alertas de Seguridad</Label>
                      <p className="text-sm text-muted-foreground">
                        Notificaciones de actividad sospechosa
                      </p>
                    </div>
                    <Switch 
                      id="security-alerts" 
                      checked={settings.securityAlerts}
                      onCheckedChange={(checked) => 
                        setSettings(prev => ({ ...prev, securityAlerts: checked }))
                      }
                    />
                  </div>
                </div>
                
                <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    💡 Las alertas de seguridad siempre están activas para proteger tu cuenta.
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Wallet className="h-5 w-5" />
                  <span>Notificaciones por Email</span>
                </CardTitle>
                <CardDescription>
                  Gestiona las comunicaciones por correo
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="email-notifications">Emails Importantes</Label>
                      <p className="text-sm text-muted-foreground">
                        Actualizaciones críticas y cambios de cuenta
                      </p>
                    </div>
                    <Switch 
                      id="email-notifications" 
                      checked={settings.emailNotifications}
                      onCheckedChange={(checked) => 
                        setSettings(prev => ({ ...prev, emailNotifications: checked }))
                      }
                    />
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="weekly-reports">Reportes Semanales</Label>
                      <p className="text-sm text-muted-foreground">
                        Resumen de actividad y estadísticas
                      </p>
                    </div>
                    <Switch 
                      id="weekly-reports" 
                      checked={settings.weeklyReports}
                      onCheckedChange={(checked) => 
                        setSettings(prev => ({ ...prev, weeklyReports: checked }))
                      }
                    />
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="marketing-emails">Marketing y Promociones</Label>
                      <p className="text-sm text-muted-foreground">
                        Ofertas especiales y novedades
                      </p>
                    </div>
                    <Switch 
                      id="marketing-emails" 
                      checked={settings.marketingEmails}
                      onCheckedChange={(checked) => 
                        setSettings(prev => ({ ...prev, marketingEmails: checked }))
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Horarios de Notificación</CardTitle>
              <CardDescription>
                Configura cuándo quieres recibir notificaciones para no ser molestado
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Horario de No Molestar</Label>
                  <div className="flex items-center space-x-2">
                    <Input type="time" defaultValue="22:00" className="w-32" />
                    <span className="text-muted-foreground">a</span>
                    <Input type="time" defaultValue="08:00" className="w-32" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    No recibirás notificaciones durante este horario.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label>Días de la Semana</Label>
                  <div className="flex flex-wrap gap-2">
                    {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((day, index) => (
                      <Button 
                        key={day} 
                        variant={index < 5 ? "primary" : "outline"} 
                        size="sm" 
                        className="w-10 h-10 p-0"
                      >
                        {day}
                      </Button>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Selecciona los días para recibir notificaciones.
                  </p>
                </div>
              </div>
              
              <Alert>
                <Bell className="h-4 w-4" />
                <AlertDescription>
                  Las notificaciones de seguridad críticas siempre se enviarán independientemente de estos ajustes.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="privacidad" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-5 w-5" />
                  <span>Control de Datos</span>
                </CardTitle>
                <CardDescription>
                  Gestiona cómo recopilamos y usamos tus datos
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="data-collection">Recopilación de Datos</Label>
                      <p className="text-sm text-muted-foreground">
                        Análisis de uso para mejorar la plataforma
                      </p>
                    </div>
                    <Switch 
                      id="data-collection" 
                      checked={settings.dataCollection}
                      onCheckedChange={(checked) => 
                        setSettings(prev => ({ ...prev, dataCollection: checked }))
                      }
                    />
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="activity-tracking">Seguimiento de Actividad</Label>
                      <p className="text-sm text-muted-foreground">
                        Rastrea tu actividad para personalizar la experiencia
                      </p>
                    </div>
                    <Switch 
                      id="activity-tracking" 
                      checked={settings.activityTracking}
                      onCheckedChange={(checked) => 
                        setSettings(prev => ({ ...prev, activityTracking: checked }))
                      }
                    />
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="cookies">Cookies de Terceros</Label>
                      <p className="text-sm text-muted-foreground">
                        Permite cookies para funciones avanzadas
                      </p>
                    </div>
                    <Switch 
                      id="cookies" 
                      checked={settings.thirdPartyCookies}
                      onCheckedChange={(checked) => 
                        setSettings(prev => ({ ...prev, thirdPartyCookies: checked }))
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>Visibilidad del Perfil</span>
                </CardTitle>
                <CardDescription>
                  Controla quién puede ver tu información
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                   <Label>Visibilidad del Perfil</Label>
                   <Select 
                     value={settings.profileVisibility} 
                     onValueChange={(value) => 
                       setSettings(prev => ({ ...prev, profileVisibility: value }))
                     }
                     aria-label="Seleccionar visibilidad del perfil"
                   >
                     <option value="public">🌍 Público - Visible para todos</option>
                     <option value="friends">👥 Amigos - Solo contactos</option>
                     <option value="private">🔒 Privado - Solo yo</option>
                   </Select>
                 </div>
                
                <div className="p-3 bg-amber-50 dark:bg-amber-950 rounded-lg">
                  <p className="text-sm text-amber-700 dark:text-amber-300">
                    ⚠️ Cambiar a público hará visible tu perfil en motores de búsqueda.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label>Información Visible</Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="show-email" defaultChecked={false} />
                      <Label htmlFor="show-email" className="text-sm">Mostrar email</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="show-activity" defaultChecked={true} />
                      <Label htmlFor="show-activity" className="text-sm">Mostrar última actividad</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="show-stats" defaultChecked={true} />
                      <Label htmlFor="show-stats" className="text-sm">Mostrar estadísticas</Label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Database className="h-5 w-5" />
                <span>Gestión de Datos</span>
              </CardTitle>
              <CardDescription>
                Exporta, descarga o elimina permanentemente tus datos
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <h4 className="font-medium flex items-center space-x-2">
                    <Download className="h-4 w-4" />
                    <span>Exportar Datos</span>
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Descarga una copia completa de todos tus datos en formato JSON.
                  </p>
                  <Button variant="outline" onClick={exportData} className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Exportar
                  </Button>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium flex items-center space-x-2">
                    <RefreshCw className="h-4 w-4" />
                    <span>Limpiar Caché</span>
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Elimina datos temporales y cookies almacenadas localmente.
                  </p>
                  <Button variant="outline" className="w-full">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Limpiar
                  </Button>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium flex items-center space-x-2 text-destructive">
                    <Trash2 className="h-4 w-4" />
                    <span>Eliminar Cuenta</span>
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Elimina permanentemente tu cuenta y todos los datos asociados.
                  </p>
                  <Button variant="destructive" onClick={deleteAccount} className="w-full">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Eliminar
                  </Button>
                </div>
              </div>
              
              <Alert>
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  <strong>Importante:</strong> La eliminación de la cuenta es irreversible. Todos tus datos, configuraciones y contenido se perderán permanentemente.
                </AlertDescription>
              </Alert>
              
              <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <h4 className="font-medium mb-2">Política de Retención de Datos</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Los datos de cuenta se conservan mientras la cuenta esté activa</li>
                  <li>• Los logs de actividad se eliminan automáticamente después de 90 días</li>
                  <li>• Los datos de análisis se anonimizan después de 12 meses</li>
                  <li>• Puedes solicitar la eliminación completa en cualquier momento</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}