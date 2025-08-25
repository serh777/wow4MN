'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/components/ui/use-toast';
import { 
  FolderPlus, Save, Trash2, Copy, Download, Upload, 
  Star, Clock, Settings, Play, Pause, MoreVertical,
  FileText, Target, Zap, Eye, Edit3, Share2, Archive, X
} from 'lucide-react';

// Tipos para proyectos y plantillas
interface AnalysisProject {
  id: string;
  name: string;
  description: string;
  address: string;
  tools: string[];
  createdAt: Date;
  updatedAt: Date;
  lastAnalysis?: Date;
  status: 'active' | 'paused' | 'completed' | 'archived';
  tags: string[];
  isFavorite: boolean;
  results?: any;
}

interface AnalysisTemplate {
  id: string;
  name: string;
  description: string;
  tools: string[];
  category: string;
  isPublic: boolean;
  usageCount: number;
  createdAt: Date;
  author: string;
}

// Plantillas predefinidas
const DEFAULT_TEMPLATES: AnalysisTemplate[] = [
  {
    id: 'comprehensive-audit',
    name: 'Auditoría Completa Web3',
    description: 'Análisis completo con todas las herramientas disponibles',
    tools: ['ai-assistant', 'security', 'performance', 'blockchain', 'smart-contract', 'content', 'metadata'],
    category: 'Completo',
    isPublic: true,
    usageCount: 245,
    createdAt: new Date('2024-01-15'),
    author: 'WowSeoWeb3'
  },
  {
    id: 'security-focus',
    name: 'Enfoque en Seguridad',
    description: 'Análisis centrado en aspectos de seguridad y vulnerabilidades',
    tools: ['security', 'smart-contract', 'content-authenticity', 'blockchain'],
    category: 'Seguridad',
    isPublic: true,
    usageCount: 189,
    createdAt: new Date('2024-01-20'),
    author: 'WowSeoWeb3'
  },
  {
    id: 'performance-seo',
    name: 'Rendimiento y SEO',
    description: 'Optimización de rendimiento y posicionamiento SEO',
    tools: ['performance', 'content', 'metadata', 'keywords', 'links', 'backlinks'],
    category: 'SEO',
    isPublic: true,
    usageCount: 156,
    createdAt: new Date('2024-01-25'),
    author: 'WowSeoWeb3'
  },
  {
    id: 'web3-analysis',
    name: 'Análisis Web3 Especializado',
    description: 'Herramientas específicas para proyectos Web3 y blockchain',
    tools: ['blockchain', 'smart-contract', 'nft-tracking', 'authority-tracking', 'ecosystem-interactions'],
    category: 'Web3',
    isPublic: true,
    usageCount: 134,
    createdAt: new Date('2024-02-01'),
    author: 'WowSeoWeb3'
  },
  {
    id: 'social-media',
    name: 'Análisis de Redes Sociales',
    description: 'Evaluación de presencia y rendimiento en redes sociales Web3',
    tools: ['social-web3', 'content', 'authority-tracking', 'ecosystem-interactions'],
    category: 'Social',
    isPublic: true,
    usageCount: 98,
    createdAt: new Date('2024-02-05'),
    author: 'WowSeoWeb3'
  }
];

interface ProjectManagerProps {
  onProjectSelect?: (project: AnalysisProject) => void;
  onTemplateApply?: (template: AnalysisTemplate) => void;
  className?: string;
  onClose?: () => void;
}

export function ProjectManager({ onProjectSelect, onTemplateApply, className = "", onClose }: ProjectManagerProps) {
  const [projects, setProjects] = useState<AnalysisProject[]>([]);
  const [templates, setTemplates] = useState<AnalysisTemplate[]>(DEFAULT_TEMPLATES);
  const [activeTab, setActiveTab] = useState<'projects' | 'templates'>('projects');
  const [isCreating, setIsCreating] = useState(false);
  const [editingProject, setEditingProject] = useState<AnalysisProject | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();

  // Estados para nuevo proyecto
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    address: '',
    tools: [] as string[],
    tags: [] as string[]
  });

  // Cargar proyectos del localStorage
  useEffect(() => {
    const savedProjects = localStorage.getItem('analysis_projects');
    if (savedProjects) {
      try {
        const parsed = JSON.parse(savedProjects);
        setProjects(parsed.map((p: any) => ({
          ...p,
          createdAt: new Date(p.createdAt),
          updatedAt: new Date(p.updatedAt),
          lastAnalysis: p.lastAnalysis ? new Date(p.lastAnalysis) : undefined
        })));
      } catch (error) {
        console.error('Error loading projects:', error);
      }
    }
  }, []);

  // Guardar proyectos en localStorage
  const saveProjects = (updatedProjects: AnalysisProject[]) => {
    setProjects(updatedProjects);
    localStorage.setItem('analysis_projects', JSON.stringify(updatedProjects));
  };

  // Crear nuevo proyecto
  const handleCreateProject = () => {
    if (!newProject.name.trim() || !newProject.address.trim()) {
      toast({
        title: 'Error',
        description: 'El nombre y la dirección son requeridos',
        variant: 'destructive'
      });
      return;
    }

    const project: AnalysisProject = {
      id: `project_${Date.now()}`,
      name: newProject.name,
      description: newProject.description,
      address: newProject.address,
      tools: newProject.tools,
      tags: newProject.tags,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'active',
      isFavorite: false
    };

    saveProjects([...projects, project]);
    setNewProject({ name: '', description: '', address: '', tools: [], tags: [] });
    setIsCreating(false);

    toast({
      title: 'Proyecto creado',
      description: `El proyecto "${project.name}" ha sido creado exitosamente`,
      variant: 'default'
    });
  };

  // Eliminar proyecto
  const handleDeleteProject = (projectId: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este proyecto?')) {
      const updatedProjects = projects.filter(p => p.id !== projectId);
      saveProjects(updatedProjects);
      
      toast({
        title: 'Proyecto eliminado',
        description: 'El proyecto ha sido eliminado exitosamente',
        variant: 'default'
      });
    }
  };

  // Toggle favorito
  const toggleFavorite = (projectId: string) => {
    const updatedProjects = projects.map(p => 
      p.id === projectId ? { ...p, isFavorite: !p.isFavorite } : p
    );
    saveProjects(updatedProjects);
  };

  // Aplicar plantilla
  const handleApplyTemplate = (template: AnalysisTemplate) => {
    if (onTemplateApply) {
      onTemplateApply(template);
    }
    
    // Incrementar contador de uso
    const updatedTemplates = templates.map(t => 
      t.id === template.id ? { ...t, usageCount: t.usageCount + 1 } : t
    );
    setTemplates(updatedTemplates);

    toast({
      title: 'Plantilla aplicada',
      description: `Se ha aplicado la plantilla "${template.name}"`,
      variant: 'default'
    });
  };

  // Exportar proyecto
  const handleExportProject = (project: AnalysisProject) => {
    const dataStr = JSON.stringify(project, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${project.name.replace(/\s+/g, '_')}_project.json`;
    link.click();
    
    toast({
      title: 'Proyecto exportado',
      description: 'El proyecto ha sido descargado',
      variant: 'default'
    });
  };

  // Filtrar proyectos
  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Filtrar plantillas
  const filteredTemplates = templates.filter(template =>
    template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    template.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Obtener color del estado
  const getStatusColor = (status: AnalysisProject['status']) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700 border-green-200';
      case 'paused': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'completed': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'archived': return 'bg-gray-100 text-gray-700 border-gray-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestión de Proyectos</h2>
          <p className="text-gray-600">Administra tus proyectos de análisis y plantillas</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => setIsCreating(true)}
            className="flex items-center gap-2"
          >
            <FolderPlus className="h-4 w-4" />
            Nuevo Proyecto
          </Button>
          {onClose && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="flex items-center gap-2"
            >
              <X className="h-4 w-4" />
              Cerrar
            </Button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-4 border-b">
        <Button
          variant={activeTab === 'projects' ? 'primary' : 'ghost'}
          onClick={() => setActiveTab('projects')}
          className="flex items-center gap-2"
        >
          <FileText className="h-4 w-4" />
          Proyectos ({projects.length})
        </Button>
        <Button
          variant={activeTab === 'templates' ? 'primary' : 'ghost'}
          onClick={() => setActiveTab('templates')}
          className="flex items-center gap-2"
        >
          <Target className="h-4 w-4" />
          Plantillas ({templates.length})
        </Button>
      </div>

      {/* Búsqueda */}
      <div className="max-w-md">
        <Input
          placeholder={`Buscar ${activeTab === 'projects' ? 'proyectos' : 'plantillas'}...`}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full"
        />
      </div>

      {/* Modal de Crear Proyecto */}
      {isCreating && (
        <Card className="border-2 border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FolderPlus className="h-5 w-5 text-blue-500" />
              Crear Nuevo Proyecto
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Nombre del Proyecto</label>
                <Input
                  value={newProject.name}
                  onChange={(e) => setNewProject(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Mi Proyecto Web3"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Dirección/Dominio</label>
                <Input
                  value={newProject.address}
                  onChange={(e) => setNewProject(prev => ({ ...prev, address: e.target.value }))}
                  placeholder="vitalik.eth o 0x..."
                />
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-700">Descripción</label>
              <Textarea
                value={newProject.description}
                onChange={(e) => setNewProject(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Descripción del proyecto..."
                rows={3}
              />
            </div>

            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsCreating(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCreateProject}>
                <Save className="h-4 w-4 mr-2" />
                Crear Proyecto
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Contenido de Proyectos */}
      {activeTab === 'projects' && (
        <div className="space-y-4">
          {filteredProjects.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {projects.length === 0 ? 'No hay proyectos' : 'No se encontraron proyectos'}
                </h3>
                <p className="text-gray-500 mb-4">
                  {projects.length === 0 
                    ? 'Crea tu primer proyecto para comenzar a organizar tus análisis'
                    : 'Intenta con otros términos de búsqueda'
                  }
                </p>
                {projects.length === 0 && (
                  <Button onClick={() => setIsCreating(true)}>
                    <FolderPlus className="h-4 w-4 mr-2" />
                    Crear Primer Proyecto
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProjects.map((project) => (
                <Card key={project.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg truncate">{project.name}</CardTitle>
                        <p className="text-sm text-gray-500 truncate">{project.address}</p>
                      </div>
                      <div className="flex items-center gap-1 ml-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleFavorite(project.id)}
                          className="h-8 w-8 p-0"
                        >
                          <Star className={`h-4 w-4 ${project.isFavorite ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}`} />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-3">
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {project.description || 'Sin descripción'}
                    </p>
                    
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={getStatusColor(project.status)}>
                        {project.status === 'active' ? 'Activo' :
                         project.status === 'paused' ? 'Pausado' :
                         project.status === 'completed' ? 'Completado' : 'Archivado'}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {project.tools.length} herramientas
                      </Badge>
                    </div>
                    
                    {project.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {project.tags.slice(0, 3).map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {project.tags.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{project.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}
                    
                    <div className="text-xs text-gray-500">
                      <div>Creado: {project.createdAt.toLocaleDateString()}</div>
                      {project.lastAnalysis && (
                        <div>Último análisis: {project.lastAnalysis.toLocaleDateString()}</div>
                      )}
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onProjectSelect && onProjectSelect(project)}
                          className="h-8 px-2"
                        >
                          <Play className="h-3 w-3 mr-1" />
                          Ejecutar
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingProject(project)}
                          className="h-8 px-2"
                        >
                          <Edit3 className="h-3 w-3" />
                        </Button>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleExportProject(project)}
                          className="h-8 px-2"
                        >
                          <Download className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteProject(project.id)}
                          className="h-8 px-2 text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Contenido de Plantillas */}
      {activeTab === 'templates' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTemplates.map((template) => (
              <Card key={template.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg truncate">{template.name}</CardTitle>
                      <p className="text-sm text-gray-500">{template.category}</p>
                    </div>
                    <Badge variant="outline" className="ml-2">
                      {template.usageCount} usos
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-3">
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {template.description}
                  </p>
                  
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {template.tools.length} herramientas
                    </Badge>
                    {template.isPublic && (
                      <Badge variant="outline" className="text-xs text-green-600">
                        Pública
                      </Badge>
                    )}
                  </div>
                  
                  <div className="text-xs text-gray-500">
                    <div>Por: {template.author}</div>
                    <div>Creada: {template.createdAt.toLocaleDateString()}</div>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleApplyTemplate(template)}
                      className="flex items-center gap-2"
                    >
                      <Zap className="h-3 w-3" />
                      Aplicar
                    </Button>
                    
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-2"
                      >
                        <Eye className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-2"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

