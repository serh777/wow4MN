import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Icons } from '@/components/icons';
import { Badge } from '@/components/ui/badge';

interface ExampleQueriesProps {
  onSelectQuery: (query: string) => void;
}

export function ExampleQueries({ onSelectQuery }: ExampleQueriesProps) {
  const examples = [
    {
      id: 'metadata',
      title: 'Análisis de Metadatos',
      description: 'Optimiza los metadatos de tu smart contract',
      query: 'Analiza cómo puedo optimizar los metadatos de mi smart contract para mejorar su visibilidad en exploradores de bloques',
      exampleUrl: '/dashboard/tools/ai-assistant/examples/metadata',
      icon: 'metadata',
      gradient: 'from-blue-500 to-cyan-500',
      badge: 'SEO',
      badgeColor: 'bg-blue-100 text-blue-700'
    },
    {
      id: 'keywords',
      title: 'Estrategia de Keywords',
      description: 'Encuentra las mejores palabras clave para tu proyecto',
      query: 'Sugiere palabras clave relevantes para un marketplace de NFTs enfocado en arte digital',
      exampleUrl: '/dashboard/tools/ai-assistant/examples/keywords',
      icon: 'keywords',
      gradient: 'from-green-500 to-emerald-500',
      badge: 'Marketing',
      badgeColor: 'bg-green-100 text-green-700'
    },
    {
      id: 'social',
      title: 'Optimización Web3 Social',
      description: 'Mejora tu presencia en plataformas sociales Web3',
      query: 'Recomienda estrategias para mejorar mi presencia en plataformas sociales Web3 como Lens Protocol',
      exampleUrl: '/dashboard/tools/ai-assistant/examples/social',
      icon: 'social',
      gradient: 'from-purple-500 to-pink-500',
      badge: 'Social',
      badgeColor: 'bg-purple-100 text-purple-700'
    },
    {
      id: 'technical',
      title: 'Análisis Técnico',
      description: 'Evalúa aspectos técnicos de tu proyecto blockchain',
      query: 'Analiza las mejores prácticas para optimizar el consumo de gas en mi contrato ERC-721',
      exampleUrl: '/dashboard/tools/ai-assistant/examples/technical',
      icon: 'code',
      gradient: 'from-orange-500 to-red-500',
      badge: 'Técnico',
      badgeColor: 'bg-orange-100 text-orange-700'
    }
  ];

  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'metadata':
        return <Icons.metadata className="h-6 w-6 text-white" />;
      case 'keywords':
        return <Icons.keywords className="h-6 w-6 text-white" />;
      case 'social':
        return <Icons.social className="h-6 w-6 text-white" />;
      case 'code':
        return <Icons.code className="h-6 w-6 text-white" />;
      default:
        return <Icons.placeholder className="h-6 w-6 text-white" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Consultas de Ejemplo</CardTitle>
        <CardDescription>
          Selecciona una consulta de ejemplo o haz clic en &quot;Ver Ejemplo&quot; para ver un análisis completo
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {examples.map((example) => (
            <div key={example.id} className="group relative overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 backdrop-blur-sm">
              {/* Gradient Background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${example.gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-300`} />
              
              {/* Content */}
              <div className="relative p-6 space-y-4">
                {/* Header with Icon and Badge */}
                <div className="flex items-start justify-between">
                  <div className={`p-3 rounded-lg bg-gradient-to-br ${example.gradient} shadow-lg`}>
                    {renderIcon(example.icon)}
                  </div>
                  <Badge className={`${example.badgeColor} dark:bg-gray-700 dark:text-gray-200 border-0 font-medium`}>
                    {example.badge}
                  </Badge>
                </div>
                
                {/* Title and Description */}
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg leading-tight text-gray-900 dark:text-gray-100 group-hover:text-primary transition-colors">
                    {example.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                    {example.description}
                  </p>
                </div>
                
                {/* Action Buttons */}
                <div className="flex flex-col gap-3 pt-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => onSelectQuery(example.query)}
                    className="w-full justify-start border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 group-hover:border-primary/50 hover:bg-primary hover:text-primary-foreground transition-all duration-200"
                  >
                    <Icons.arrowRight className="mr-2 h-4 w-4" />
                    Usar Consulta
                  </Button>
                  <Link href={example.exampleUrl}>
                    <Button 
                      variant="secondary" 
                      size="sm" 
                      className="w-full justify-start bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200"
                    >
                      <Icons.externalLink className="mr-2 h-4 w-4" />
                      Ver Ejemplo
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}