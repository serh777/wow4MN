'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  AreaChart, Area
} from 'recharts';
import { 
  Target, TrendingUp, Eye, BarChart3, Star, Shield, Zap, 
  Download, Share2, ArrowUp, ArrowDown, Minus, RefreshCw,
  CheckCircle, AlertTriangle, Info, Globe, Link, Users, Clock,
  Activity, Award, Cpu, Database, Search, Palette, Crown,
  TrendingDown, Brain, Gamepad2, ExternalLink, Layers, Settings,
  ArrowLeft
} from 'lucide-react';
import { useSearchParams, useRouter } from 'next/navigation';
import { DynamicResultsRenderer } from '@/components/results/dynamic-results-renderer';
import { useDynamicResults } from '@/hooks/use-dynamic-results';
import { dashboardOrchestrator, DashboardAnalysisResponse } from '@/services/dashboard-orchestrator';

// Función para obtener resultados reales de análisis unificado
const fetchUnifiedResults = async (tools: string[], address: string) => {
  try {
    const response = await fetch('/api/unified-analysis', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ tools, address })
    });
    
    if (!response.ok) {
      throw new Error('Error en la respuesta del servidor');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching unified results:', error);
    return null;
  }
};

export default function UnifiedResultsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const tools = useMemo(() => searchParams.get('tools')?.split(',') || [], [searchParams]);
  const address = searchParams.get('address') || '';

  useEffect(() => {
    if (tools.length > 0 && address) {
      fetchUnifiedResults(tools, address)
        .then(data => {
          setResults(data);
          setIsLoading(false);
        })
        .catch(err => {
          setError(err.message);
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, [tools, address]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Cargando resultados unificados...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <Button 
          variant="outline" 
          onClick={() => router.back()}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver
        </Button>
        <h1 className="text-3xl font-bold mb-2">Resultados Unificados</h1>
        <p className="text-muted-foreground">
          Análisis combinado de {tools.length} herramientas para {address}
        </p>
      </div>

      {results && (
        <DynamicResultsRenderer
          results={results}
          selectedTools={tools}
          address={address}
        />
      )}
    </div>
  );
}