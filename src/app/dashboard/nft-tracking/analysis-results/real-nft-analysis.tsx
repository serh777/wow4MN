import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { AlchemyService } from '@/services/apis/alchemy';
import { AnthropicService } from '@/services/apis/anthropic';
import { 
  Gem, DollarSign, Star, BarChart3, TrendingUp, 
  Download, Share2, Loader2, AlertTriangle 
} from 'lucide-react';

interface NFTAnalysisData {
  nft: any;
  collection: any;
  floorPrice: number;
  sales: any[];
  analysis: any;
  overallScore: number;
}

export function RealNFTAnalysis() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [analysisData, setAnalysisData] = useState<NFTAnalysisData | null>(null);

  const address = searchParams.get('address');
  const tokenId = searchParams.get('tokenId');
  const blockchain = searchParams.get('blockchain') || 'ethereum';
  const trackingType = searchParams.get('trackingType') || 'comprehensive';

  useEffect(() => {
    if (address) {
      performRealAnalysis();
    }
  }, [address, tokenId]);

  const performRealAnalysis = async () => {
    try {
      setLoading(true);
      setError(null);

      // Obtener metadatos del NFT
      const nftMetadata = tokenId ? 
        await AlchemyService.getNFTMetadata(address!, tokenId) : 
        null;

      // Obtener información de la colección
      const collectionMetadata = await AlchemyService.getContractMetadata(address!);

      // Obtener floor price
      const floorPrice = await AlchemyService.getFloorPrice(address!);

      // Obtener historial de ventas
      const sales = await AlchemyService.getNFTSales(address!, tokenId || undefined);

      // Análisis con IA si es necesario
      let aiAnalysis = null;
      if (trackingType === 'comprehensive' && nftMetadata) {
        try {
          aiAnalysis = await AnthropicService.analyzeNFTCollection({
            contractAddress: address!,
            collectionName: collectionMetadata?.name || 'Unknown',
            nftData: nftMetadata,
            marketData: { floorPrice, sales: sales.slice(0, 10) }
          });
        } catch (error) {
          console.warn('Error en análisis IA:', error);
        }
      }

      // Calcular puntuación general
      const overallScore = calculateOverallScore(
        nftMetadata,
        collectionMetadata,
        floorPrice,
        sales,
        aiAnalysis
      );

      setAnalysisData({
        nft: nftMetadata,
        collection: collectionMetadata,
        floorPrice,
        sales,
        analysis: aiAnalysis,
        overallScore
      });

    } catch (error) {
      console.error('Error en análisis NFT:', error);
      setError(error instanceof Error ? error.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  const calculateOverallScore = (nft: any, collection: any, floorPrice: number, sales: any[], analysis: any): number => {
    let score = 50; // Base score

    // Puntuación por metadatos completos
    if (nft?.title && nft?.description) score += 10;
    if (nft?.media && nft.media.length > 0) score += 10;
    if (nft?.attributes && nft.attributes.length > 0) score += 15;

    // Puntuación por colección verificada
    if (collection?.openSeaMetadata?.safelistRequestStatus === 'verified') score += 15;

    // Puntuación por actividad de mercado
    if (floorPrice > 0) score += 10;
    if (sales.length > 0) score += 10;

    // Puntuación por análisis IA
    if (analysis?.rarityScore) score += Math.floor(analysis.rarityScore * 0.2);

    return Math.min(score, 100);
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="p-8 text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Analizando NFT...</h3>
            <p className="text-muted-foreground">
              Obteniendo datos reales de blockchain y mercados NFT
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="p-8 text-center">
            <AlertTriangle className="h-8 w-8 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Error en el Análisis</h3>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={performRealAnalysis}>
              Reintentar Análisis
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!analysisData) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">No se encontraron datos para analizar</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { nft, collection, floorPrice, sales, analysis, overallScore } = analysisData;

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header con puntuación general */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <div className="p-3 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full">
            <Gem className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
              Análisis NFT Completo
            </h1>
            <p className="text-muted-foreground">
              {collection?.name || 'Colección Desconocida'} #{tokenId || 'N/A'}
            </p>
          </div>
        </div>

        {/* Círculo de puntuación */}
        <div className="flex justify-center">
          <div className="relative w-32 h-32">
            <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
              <circle
                cx="60"
                cy="60"
                r="50"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                className="text-muted-foreground/20"
              />
              <circle
                cx="60"
                cy="60"
                r="50"
                stroke="url(#gradient)"
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 50}`}
                strokeDashoffset={`${2 * Math.PI * 50 * (1 - overallScore / 100)}`}
                className="transition-all duration-1000 ease-out"
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#ec4899" />
                  <stop offset="100%" stopColor="#f43f5e" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl font-bold text-pink-600">{overallScore}</div>
                <div className="text-xs text-muted-foreground">Puntuación</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Información básica del NFT */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <DollarSign className="h-5 w-5 text-green-500" />
              Floor Price
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {floorPrice > 0 ? `${floorPrice} ETH` : 'N/A'}
            </div>
            <p className="text-sm text-muted-foreground">Precio mínimo de la colección</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <BarChart3 className="h-5 w-5 text-blue-500" />
              Ventas Recientes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {sales.length}
            </div>
            <p className="text-sm text-muted-foreground">Transacciones encontradas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Star className="h-5 w-5 text-yellow-500" />
              Atributos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {nft?.attributes?.length || 0}
            </div>
            <p className="text-sm text-muted-foreground">Traits únicos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <TrendingUp className="h-5 w-5 text-purple-500" />
              Estado
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant={collection?.openSeaMetadata?.safelistRequestStatus === 'verified' ? 'default' : 'secondary'}>
              {collection?.openSeaMetadata?.safelistRequestStatus === 'verified' ? 'Verificado' : 'No Verificado'}
            </Badge>
            <p className="text-sm text-muted-foreground mt-1">Estado de verificación</p>
          </CardContent>
        </Card>
      </div>

      {/* Detalles del NFT */}
      {nft && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gem className="h-5 w-5 text-pink-500" />
              Detalles del NFT
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">Información Básica</h4>
                <div className="space-y-2 text-sm">
                  <div><strong>Título:</strong> {nft.title || 'Sin título'}</div>
                  <div><strong>Descripción:</strong> {nft.description || 'Sin descripción'}</div>
                  <div><strong>Token ID:</strong> {nft.tokenId}</div>
                  <div><strong>Tipo:</strong> {nft.tokenType}</div>
                </div>
              </div>
              
              {nft.attributes && nft.attributes.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">Atributos</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {nft.attributes.slice(0, 6).map((attr: any, index: number) => (
                      <Badge key={index} variant="outline" className="justify-between">
                        <span className="text-xs">{attr.trait_type}</span>
                        <span className="text-xs font-semibold">{attr.value}</span>
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Análisis IA */}
      {analysis && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500" />
              Análisis con IA
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">{analysis.rarityScore || 'N/A'}</div>
                  <p className="text-sm text-muted-foreground">Puntuación de Rareza</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{analysis.marketScore || 'N/A'}</div>
                  <p className="text-sm text-muted-foreground">Puntuación de Mercado</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{analysis.utilityScore || 'N/A'}</div>
                  <p className="text-sm text-muted-foreground">Puntuación de Utilidad</p>
                </div>
              </div>
              
              {analysis.recommendations && (
                <div>
                  <h4 className="font-semibold mb-2">Recomendaciones</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    {analysis.recommendations.map((rec: string, index: number) => (
                      <li key={index}>{rec}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Historial de ventas */}
      {sales.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-500" />
              Historial de Ventas Recientes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {sales.slice(0, 5).map((sale: any, index: number) => (
                <div key={index} className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                  <div>
                    <div className="font-semibold">{sale.marketplace || 'Marketplace'}</div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(sale.blockTimestamp).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{sale.sellerFee?.amount || 'N/A'} ETH</div>
                    <div className="text-sm text-muted-foreground">Precio de venta</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Acciones */}
      <div className="flex justify-center gap-4">
        <Button variant="outline" className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Exportar Análisis
        </Button>
        <Button variant="outline" className="flex items-center gap-2">
          <Share2 className="h-4 w-4" />
          Compartir Resultados
        </Button>
      </div>
    </div>
  );
}

