'use client';

import React, { memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  Image, TrendingUp, TrendingDown, DollarSign, 
  Users, Calendar, Star, Eye, Activity, Coins
} from 'lucide-react';
import { ToolResult } from '../dynamic-results-renderer';
import GenericAnalysisResult from './generic-analysis-result';

export interface NFTAnalysisResultProps {
  result: ToolResult;
  onRetry?: () => void;
  variant?: 'card' | 'compact';
}

const NFTAnalysisResult = memo<NFTAnalysisResultProps>(function NFTAnalysisResult({
  result,
  onRetry,
  variant = 'card'
}) {
  // Si no es un análisis de NFT completado, usar el componente genérico
  if (result.status !== 'completed' || !result.data) {
    return (
      <GenericAnalysisResult 
        result={result} 
        onRetry={onRetry} 
        variant={variant} 
      />
    );
  }

  const nftData = result.data;
  const nftScore = result.score || 0;
  
  // Métricas principales de NFT
  const nftMetrics = {
    floorPrice: nftData.floorPrice || nftData.floor_price,
    volume24h: nftData.volume24h || nftData.volume_24h,
    totalSupply: nftData.totalSupply || nftData.total_supply,
    owners: nftData.owners || nftData.unique_owners,
    marketCap: nftData.marketCap || nftData.market_cap,
    averagePrice: nftData.averagePrice || nftData.average_price
  };

  const getNFTLevel = (score: number) => {
    if (score >= 80) return { level: 'Premium', color: 'text-purple-600', bgColor: 'bg-purple-50' };
    if (score >= 60) return { level: 'Sólido', color: 'text-blue-600', bgColor: 'bg-blue-50' };
    if (score >= 40) return { level: 'Emergente', color: 'text-yellow-600', bgColor: 'bg-yellow-50' };
    return { level: 'Especulativo', color: 'text-red-600', bgColor: 'bg-red-50' };
  };

  const nftLevel = getNFTLevel(nftScore);

  if (variant === 'compact') {
    return (
      <Card className={`border-purple-200 ${nftLevel.bgColor} transition-all hover:shadow-md`}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Image className={`h-5 w-5 ${nftLevel.color}`} />
              <div>
                <h3 className="font-medium text-gray-900">Análisis NFT</h3>
                <p className="text-sm text-gray-600">
                  {nftMetrics.floorPrice ? `${formatPrice(nftMetrics.floorPrice)} ETH` : 'Floor price'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Badge variant="outline" className={nftLevel.color}>
                {Math.round(nftScore)}/100
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`border-purple-200 ${nftLevel.bgColor} transition-all hover:shadow-lg`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-white shadow-sm">
              <Image className={`h-6 w-6 ${nftLevel.color}`} />
            </div>
            <div>
              <CardTitle className="text-lg">Análisis NFT</CardTitle>
              <p className="text-sm text-gray-600">
                {nftData.collectionName && (
                  <span className="font-medium">{nftData.collectionName} • </span>
                )}
                Ejecutado el {new Date(result.timestamp).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={nftLevel.color}>
              {nftLevel.level}
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Puntuación NFT */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Puntuación NFT</span>
            <span className={`text-lg font-bold ${nftLevel.color}`}>
              {Math.round(nftScore)}/100
            </span>
          </div>
          <Progress 
            value={nftScore} 
            className="h-2" 
            // @ts-ignore
            indicatorClassName={nftScore >= 60 ? 'bg-purple-500' : nftScore >= 40 ? 'bg-yellow-500' : 'bg-red-500'}
          />
        </div>
        
        <Separator />
        
        {/* Métricas principales */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Métricas de Mercado
          </h4>
          
          <div className="grid grid-cols-2 gap-3">
            {nftMetrics.floorPrice && (
              <NFTMetricCard 
                label="Floor Price" 
                value={nftMetrics.floorPrice}
                unit="ETH"
                icon={DollarSign}
                trend={nftData.floorPriceTrend}
              />
            )}
            
            {nftMetrics.volume24h && (
              <NFTMetricCard 
                label="Volumen 24h" 
                value={nftMetrics.volume24h}
                unit="ETH"
                icon={Activity}
                trend={nftData.volumeTrend}
              />
            )}
            
            {nftMetrics.totalSupply && (
              <NFTMetricCard 
                label="Supply Total" 
                value={nftMetrics.totalSupply}
                unit=""
                icon={Image}
              />
            )}
            
            {nftMetrics.owners && (
              <NFTMetricCard 
                label="Propietarios" 
                value={nftMetrics.owners}
                unit=""
                icon={Users}
              />
            )}
          </div>
        </div>
        
        {/* Estadísticas adicionales */}
        {(nftMetrics.marketCap || nftMetrics.averagePrice) && (
          <>
            <Separator />
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
                <Coins className="h-4 w-4" />
                Estadísticas Adicionales
              </h4>
              
              <div className="grid grid-cols-2 gap-3">
                {nftMetrics.marketCap && (
                  <StatCard 
                    label="Market Cap" 
                    value={formatPrice(nftMetrics.marketCap)} 
                    unit="ETH"
                  />
                )}
                
                {nftMetrics.averagePrice && (
                  <StatCard 
                    label="Precio Promedio" 
                    value={formatPrice(nftMetrics.averagePrice)} 
                    unit="ETH"
                  />
                )}
                
                {nftData.salesCount && (
                  <StatCard 
                    label="Ventas Totales" 
                    value={nftData.salesCount.toLocaleString()} 
                    unit=""
                  />
                )}
                
                {nftData.uniqueTraders && (
                  <StatCard 
                    label="Traders Únicos" 
                    value={nftData.uniqueTraders.toLocaleString()} 
                    unit=""
                  />
                )}
              </div>
            </div>
          </>
        )}
        
        {/* Análisis de rareza */}
        {nftData.rarityAnalysis && (
          <>
            <Separator />
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
                <Star className="h-4 w-4" />
                Análisis de Rareza
              </h4>
              
              <div className="space-y-2">
                {nftData.rarityAnalysis.traits && (
                  <div className="p-3 bg-white rounded-lg border border-gray-200">
                    <div className="text-sm font-medium text-gray-900 mb-2">Traits Más Raros</div>
                    <div className="flex flex-wrap gap-1">
                      {nftData.rarityAnalysis.traits.slice(0, 6).map((trait: any, index: number) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {trait.name}: {trait.rarity}%
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                {nftData.rarityAnalysis.score && (
                  <div className="p-3 bg-white rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900">Puntuación de Rareza</span>
                      <span className="text-sm font-bold text-purple-600">
                        {nftData.rarityAnalysis.score}/100
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
        
        {/* Actividad reciente */}
        {nftData.recentActivity && nftData.recentActivity.length > 0 && (
          <>
            <Separator />
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Actividad Reciente
              </h4>
              
              <div className="space-y-2">
                {nftData.recentActivity.slice(0, 3).map((activity: any, index: number) => (
                  <ActivityItem key={index} activity={activity} />
                ))}
                
                {nftData.recentActivity.length > 3 && (
                  <p className="text-xs text-gray-500 mt-2">
                    +{nftData.recentActivity.length - 3} actividades adicionales
                  </p>
                )}
              </div>
            </div>
          </>
        )}
        
        {/* Insights y recomendaciones */}
        {result.insights && result.insights.length > 0 && (
          <>
            <Separator />
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
                <Eye className="h-4 w-4" />
                Insights del Mercado
              </h4>
              
              <ul className="space-y-2">
                {result.insights.slice(0, 3).map((insight, index) => (
                  <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2 flex-shrink-0" />
                    {insight}
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
        
        {/* Recomendaciones */}
        {result.recommendations && result.recommendations.length > 0 && (
          <>
            <Separator />
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Recomendaciones de Trading
              </h4>
              
              <ul className="space-y-2">
                {result.recommendations.slice(0, 4).map((recommendation, index) => (
                  <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                    {recommendation}
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
});

// Componente para métricas NFT con tendencias
const NFTMetricCard = memo<{
  label: string;
  value: number;
  unit: string;
  icon: React.ComponentType<any>;
  trend?: 'up' | 'down' | 'stable';
}>(function NFTMetricCard({ label, value, unit, icon: Icon, trend }) {
  const getTrendIcon = () => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-3 w-3 text-green-600" />;
      case 'down': return <TrendingDown className="h-3 w-3 text-red-600" />;
      default: return null;
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case 'up': return 'border-green-200 bg-green-50';
      case 'down': return 'border-red-200 bg-red-50';
      default: return 'border-gray-200 bg-white';
    }
  };

  return (
    <div className={`p-3 rounded-lg border ${getTrendColor()}`}>
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4 text-gray-500" />
          <span className="text-xs text-gray-500 uppercase tracking-wide">{label}</span>
        </div>
        {getTrendIcon()}
      </div>
      <div className="text-lg font-bold text-gray-900">
        {formatPrice(value)}{unit && ` ${unit}`}
      </div>
    </div>
  );
});

// Componente para estadísticas simples
const StatCard = memo<{
  label: string;
  value: string;
  unit: string;
}>(function StatCard({ label, value, unit }) {
  return (
    <div className="p-3 bg-white rounded-lg border border-gray-100">
      <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">{label}</div>
      <div className="text-sm font-semibold text-gray-900">
        {value}{unit && ` ${unit}`}
      </div>
    </div>
  );
});

// Componente para actividades
const ActivityItem = memo<{
  activity: any;
}>(function ActivityItem({ activity }) {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'sale': return <DollarSign className="h-3 w-3 text-green-600" />;
      case 'transfer': return <Users className="h-3 w-3 text-blue-600" />;
      case 'mint': return <Star className="h-3 w-3 text-purple-600" />;
      default: return <Activity className="h-3 w-3 text-gray-600" />;
    }
  };

  const getActivityText = (type: string) => {
    switch (type) {
      case 'sale': return 'Venta';
      case 'transfer': return 'Transferencia';
      case 'mint': return 'Mint';
      default: return 'Actividad';
    }
  };

  return (
    <div className="p-3 bg-white rounded-lg border border-gray-200">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-2">
          {getActivityIcon(activity.type)}
          <div>
            <div className="text-sm font-medium text-gray-900">
              {getActivityText(activity.type)}
              {activity.price && (
                <span className="ml-2 text-purple-600 font-bold">
                  {formatPrice(activity.price)} ETH
                </span>
              )}
            </div>
            <div className="text-xs text-gray-600">
              {activity.from && activity.to && (
                <span>{activity.from.slice(0, 6)}...{activity.from.slice(-4)} → {activity.to.slice(0, 6)}...{activity.to.slice(-4)}</span>
              )}
            </div>
          </div>
        </div>
        
        {activity.timestamp && (
          <div className="text-xs text-gray-500">
            {new Date(activity.timestamp).toLocaleDateString('es-ES', {
              month: 'short',
              day: 'numeric'
            })}
          </div>
        )}
      </div>
    </div>
  );
});

// Función auxiliar para formatear precios
function formatPrice(price: number): string {
  if (price >= 1000) {
    return `${(price / 1000).toFixed(1)}K`;
  }
  if (price >= 1) {
    return price.toFixed(2);
  }
  return price.toFixed(4);
}

export default NFTAnalysisResult;