'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Componente IconWrapper
const IconWrapper = ({ icon, className }: { icon: keyof typeof Icons, className?: string }) => {
  const Icon = Icons[icon] || Icons.settings;
  return <Icon className={className} />;
};

interface Opportunity {
  id: string;
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  effort: 'high' | 'medium' | 'low';
  category: 'metadata' | 'structure' | 'seo' | 'performance';
  recommendation: string;
  codeExample?: string;
  estimatedImprovement: number;
}

interface OpportunitiesSectionProps {
  opportunities: Opportunity[];
}

export default function OpportunitiesSection({ opportunities }: OpportunitiesSectionProps) {
  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-500 text-white';
      case 'medium': return 'bg-yellow-500 text-white';
      case 'low': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getEffortColor = (effort: string) => {
    switch (effort) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'metadata': return 'database';
      case 'structure': return 'layers';
      case 'seo': return 'search';
      case 'performance': return 'zap';
      default: return 'settings';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'metadata': return 'text-blue-600';
      case 'structure': return 'text-purple-600';
      case 'seo': return 'text-green-600';
      case 'performance': return 'text-orange-600';
      default: return 'text-gray-600';
    }
  };

  const groupedOpportunities = opportunities.reduce((acc, opportunity) => {
    if (!acc[opportunity.category]) {
      acc[opportunity.category] = [];
    }
    acc[opportunity.category].push(opportunity);
    return acc;
  }, {} as Record<string, Opportunity[]>);

  const OpportunityCard = ({ opportunity }: { opportunity: Opportunity }) => (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <IconWrapper 
              icon={getCategoryIcon(opportunity.category) as keyof typeof Icons} 
              className={`h-5 w-5 ${getCategoryColor(opportunity.category)}`} 
            />
            <CardTitle className="text-base">{opportunity.title}</CardTitle>
          </div>
          <div className="flex gap-1">
            <Badge className={getImpactColor(opportunity.impact)}>
              {opportunity.impact}
            </Badge>
          </div>
        </div>
        <CardDescription className="text-sm">
          {opportunity.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Esfuerzo:</span>
            <Badge variant="outline" className={getEffortColor(opportunity.effort)}>
              {opportunity.effort}
            </Badge>
          </div>
          <div className="flex items-center gap-1">
            <IconWrapper icon="trendingUp" className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium text-green-600">
              +{opportunity.estimatedImprovement}%
            </span>
          </div>
        </div>
        
        <Alert>
          <IconWrapper icon="lightbulb" className="h-4 w-4" />
          <AlertDescription className="text-sm">
            <strong>Recomendación:</strong> {opportunity.recommendation}
          </AlertDescription>
        </Alert>
        
        {opportunity.codeExample && (
          <div className="space-y-2">
            <div className="text-sm font-medium">Ejemplo de implementación:</div>
            <pre className="text-xs bg-muted p-3 rounded-md overflow-x-auto">
              <code>{opportunity.codeExample}</code>
            </pre>
          </div>
        )}
        
        <Button variant="outline" size="sm" className="w-full">
          <IconWrapper icon="externalLink" className="mr-2 h-4 w-4" />
          Ver Guía Detallada
        </Button>
      </CardContent>
    </Card>
  );

  const totalImprovementPotential = opportunities.reduce(
    (sum, opp) => sum + opp.estimatedImprovement, 
    0
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <IconWrapper icon="target" className="h-5 w-5" />
              Oportunidades de Mejora
            </CardTitle>
            <CardDescription>
              {opportunities.length} oportunidades identificadas con potencial de mejora del {totalImprovementPotential}%
            </CardDescription>
          </div>
          <Badge variant="outline" className="bg-blue-50 text-blue-700 dark:bg-blue-900/20">
            {opportunities.length} oportunidades
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all" className="text-xs">
              Todas ({opportunities.length})
            </TabsTrigger>
            <TabsTrigger value="metadata" className="text-xs">
              <IconWrapper icon="database" className="w-3 h-3 mr-1" />
              Metadatos ({groupedOpportunities.metadata?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="structure" className="text-xs">
              <IconWrapper icon="layers" className="w-3 h-3 mr-1" />
              Estructura ({groupedOpportunities.structure?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="seo" className="text-xs">
              <IconWrapper icon="search" className="w-3 h-3 mr-1" />
              SEO ({groupedOpportunities.seo?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="performance" className="text-xs">
              <IconWrapper icon="zap" className="w-3 h-3 mr-1" />
              Rendimiento ({groupedOpportunities.performance?.length || 0})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {opportunities.map((opportunity) => (
                <OpportunityCard key={opportunity.id} opportunity={opportunity} />
              ))}
            </div>
          </TabsContent>
          
          {Object.entries(groupedOpportunities).map(([category, categoryOpportunities]) => (
            <TabsContent key={category} value={category} className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categoryOpportunities.map((opportunity) => (
                  <OpportunityCard key={opportunity.id} opportunity={opportunity} />
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}