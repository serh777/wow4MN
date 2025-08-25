'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { 
  Image, TrendingUp, DollarSign, Users, Activity, 
  Download, Share2, ArrowUp, ArrowDown, Minus,
  CheckCircle, AlertTriangle, Info, Target, Zap, Globe, Clock
} from 'lucide-react';

interface NFTCollection {
  id: string;
  name: string;
  floorPrice: number;
  volume24h: number;
  owners: number;
  totalSupply: number;
  marketCap: number;
  change24h: number;
}

interface NFTAnalysisData {
  collections: NFTCollection[];
  totalVolume: number;
  totalCollections: number;
  averagePrice: number;
  topTraders: Array<{
    address: string;
    volume: number;
    transactions: number;
  }>;
  priceHistory: Array<{
    date: string;
    price: number;
    volume: number;
  }>;
  marketTrends: {
    bullish: number;
    bearish: number;
    neutral: number;
  };
}

export function RealNFTAnalysis() {
  const [data, setData] = useState<NFTAnalysisData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTimeframe, setSelectedTimeframe] = useState('7d');

  useEffect(() => {
    const fetchNFTData = async () => {
      try {
        setLoading(true);
        
        // Simulate API call - replace with actual NFT data fetching
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Mock NFT data - replace with actual API response
        const mockData: NFTAnalysisData = {
          collections: [
            {
              id: '1',
              name: 'Bored Ape Yacht Club',
              floorPrice: 15.5,
              volume24h: 234.7,
              owners: 5847,
              totalSupply: 10000,
              marketCap: 155000,
              change24h: 5.2
            },
            {
              id: '2',
              name: 'CryptoPunks',
              floorPrice: 45.8,
              volume24h: 189.3,
              owners: 3423,
              totalSupply: 10000,
              marketCap: 458000,
              change24h: -2.1
            },
            {
              id: '3',
              name: 'Azuki',
              floorPrice: 8.2,
              volume24h: 156.4,
              owners: 4521,
              totalSupply: 10000,
              marketCap: 82000,
              change24h: 12.3
            }
          ],
          totalVolume: 1234567,
          totalCollections: 15420,
          averagePrice: 2.34,
          topTraders: [
            { address: '0x1234...5678', volume: 1234.5, transactions: 45 },
            { address: '0x9876...4321', volume: 987.3, transactions: 32 },
            { address: '0xabcd...efgh', volume: 756.8, transactions: 28 }
          ],
          priceHistory: [
            { date: '2024-01-01', price: 2.1, volume: 45000 },
            { date: '2024-01-02', price: 2.3, volume: 52000 },
            { date: '2024-01-03', price: 2.2, volume: 48000 },
            { date: '2024-01-04', price: 2.5, volume: 61000 },
            { date: '2024-01-05', price: 2.4, volume: 55000 },
            { date: '2024-01-06', price: 2.6, volume: 67000 },
            { date: '2024-01-07', price: 2.34, volume: 58000 }
          ],
          marketTrends: {
            bullish: 45,
            bearish: 25,
            neutral: 30
          }
        };
        
        setData(mockData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch NFT data');
      } finally {
        setLoading(false);
      }
    };

    fetchNFTData();
  }, [selectedTimeframe]);

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold mb-2">Analizando datos NFT...</h3>
            <p className="text-gray-600">Obteniendo información de blockchain en tiempo real</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Card className="border-red-200">
          <CardContent className="p-8 text-center">
            <AlertTriangle className="h-12 w-12 text-red-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2 text-red-900">Error en el análisis</h3>
            <p className="text-red-700 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>Reintentar</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!data) return null;

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Análisis NFT</h1>
          <p className="text-gray-600 mt-2">Seguimiento en tiempo real del mercado NFT</p>
        </div>
        <div className="flex gap-2">
          {['24h', '7d', '30d', '90d'].map((timeframe) => (
            <Button
              key={timeframe}
              variant={selectedTimeframe === timeframe ? 'secondary' : 'outline'}
              size="sm"
              onClick={() => setSelectedTimeframe(timeframe)}
            >
              {timeframe}
            </Button>
          ))}
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Volumen Total</p>
                <p className="text-2xl font-bold">{data.totalVolume.toLocaleString()} ETH</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Colecciones</p>
                <p className="text-2xl font-bold">{data.totalCollections.toLocaleString()}</p>
              </div>
              <Image className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Precio Promedio</p>
                <p className="text-2xl font-bold">{data.averagePrice} ETH</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tendencia del Mercado</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge className="bg-green-100 text-green-800">Alcista {data.marketTrends.bullish}%</Badge>
                </div>
              </div>
              <Activity className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Price History Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Historial de Precios</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={data.priceHistory}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="price" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Top Collections */}
      <Card>
        <CardHeader>
          <CardTitle>Principales Colecciones</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.collections.map((collection) => (
              <div key={collection.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                    <Image className="w-6 h-6 text-gray-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold">{collection.name}</h4>
                    <p className="text-sm text-gray-600">{collection.owners.toLocaleString()} propietarios</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{collection.floorPrice} ETH</p>
                  <div className="flex items-center gap-1">
                    {collection.change24h > 0 ? (
                      <ArrowUp className="w-4 h-4 text-green-600" />
                    ) : collection.change24h < 0 ? (
                      <ArrowDown className="w-4 h-4 text-red-600" />
                    ) : (
                      <Minus className="w-4 h-4 text-gray-600" />
                    )}
                    <span className={`text-sm ${
                      collection.change24h > 0 ? 'text-green-600' : 
                      collection.change24h < 0 ? 'text-red-600' : 'text-gray-600'
                    }`}>
                      {Math.abs(collection.change24h)}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Market Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Tendencias del Mercado</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={[
                    { name: 'Alcista', value: data.marketTrends.bullish },
                    { name: 'Bajista', value: data.marketTrends.bearish },
                    { name: 'Neutral', value: data.marketTrends.neutral }
                  ]}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label
                >
                  {[data.marketTrends.bullish, data.marketTrends.bearish, data.marketTrends.neutral].map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Traders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.topTraders.map((trader, index) => (
                <div key={trader.address} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-mono text-sm">{trader.address}</p>
                      <p className="text-xs text-gray-600">{trader.transactions} transacciones</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{trader.volume} ETH</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex justify-center gap-4">
        <Button className="flex items-center gap-2">
          <Download className="w-4 h-4" />
          Exportar Datos
        </Button>
        <Button variant="outline" className="flex items-center gap-2">
          <Share2 className="w-4 h-4" />
          Compartir Análisis
        </Button>
      </div>
    </div>
  );
}