'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Download, Share2, TrendingUp, TrendingDown, Calendar, BarChart3, Clock, Target } from 'lucide-react';
import { ToolLayout } from '@/app/dashboard/content/analysis-results/components/tool-components';

interface HistoricalResults {
  overallScore: number;
  analysisType: string;
  url: string;
  riskLevel: 'low' | 'medium' | 'high';
  indexerStatus: 'active' | 'inactive' | 'error';
  historicalMetrics: {
    totalDataPoints: number;
    timeRange: string;
    averagePerformance: number;
    volatilityIndex: number;
    trendDirection: 'up' | 'down' | 'stable';
    seasonalPatterns: string[];
  };
  performanceAnalysis: {
    bestPeriod: string;
    worstPeriod: string;
    consistencyScore: number;
    growthRate: number;
    correlationFactors: string[];
  };
  timeSeriesData: {
    period: string;
    value: number;
    trend: 'up' | 'down' | 'stable';
    significance: number;
  }[];
  forecasting: {
    nextPeriodPrediction: number;
    confidenceLevel: number;
    forecastRange: string;
    keyFactors: string[];
  };
  opportunities: string[];
  diagnostics: {
    dataQuality: number;
    completeness: number;
    accuracy: number;
    reliability: number;
  };
}

function generateMockResults(url: string, analysisType: string): HistoricalResults {
  return {
    overallScore: Math.floor(Math.random() * 40) + 60,
    analysisType,
    url,
    riskLevel: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as 'low' | 'medium' | 'high',
    indexerStatus: 'active',
    historicalMetrics: {
      totalDataPoints: Math.floor(Math.random() * 1000) + 500,
      timeRange: '24 months',
      averagePerformance: Math.floor(Math.random() * 30) + 70,
      volatilityIndex: Math.floor(Math.random() * 50) + 25,
      trendDirection: ['up', 'down', 'stable'][Math.floor(Math.random() * 3)] as 'up' | 'down' | 'stable',
      seasonalPatterns: ['Q4 Peak', 'Summer Dip', 'Holiday Surge']
    },
    performanceAnalysis: {
      bestPeriod: 'Q3 2023',
      worstPeriod: 'Q1 2023',
      consistencyScore: Math.floor(Math.random() * 30) + 70,
      growthRate: Math.floor(Math.random() * 20) + 5,
      correlationFactors: ['Market Trends', 'Seasonal Demand', 'Economic Indicators']
    },
    timeSeriesData: [
      { period: 'Jan 2023', value: 85, trend: 'up', significance: 0.8 },
      { period: 'Feb 2023', value: 78, trend: 'down', significance: 0.6 },
      { period: 'Mar 2023', value: 92, trend: 'up', significance: 0.9 },
      { period: 'Apr 2023', value: 88, trend: 'stable', significance: 0.7 }
    ],
    forecasting: {
      nextPeriodPrediction: Math.floor(Math.random() * 20) + 80,
      confidenceLevel: Math.floor(Math.random() * 20) + 75,
      forecastRange: 'Next 6 months',
      keyFactors: ['Historical Trends', 'Market Conditions', 'Seasonal Patterns']
    },
    opportunities: [
      'Optimize performance during peak periods',
      'Implement predictive analytics',
      'Enhance data collection methods',
      'Develop seasonal strategies'
    ],
    diagnostics: {
      dataQuality: Math.floor(Math.random() * 20) + 80,
      completeness: Math.floor(Math.random() * 15) + 85,
      accuracy: Math.floor(Math.random() * 25) + 75,
      reliability: Math.floor(Math.random() * 20) + 80
    }
  };
}

function HistoricalAnalysisResultsContent() {
  const searchParams = useSearchParams();
  const [results, setResults] = useState<HistoricalResults | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const url = searchParams.get('url') || '';
    const analysisType = searchParams.get('type') || 'comprehensive';
    
    // Try to get results from sessionStorage first
    const savedResults = sessionStorage.getItem('historicalAnalysisResults');
    if (savedResults) {
      setResults(JSON.parse(savedResults));
      setLoading(false);
    } else {
      // Generate mock results if no saved data
      setTimeout(() => {
        const mockResults = generateMockResults(url, analysisType);
        setResults(mockResults);
        setLoading(false);
      }, 1000);
    }
  }, [searchParams]);

  const handleExport = () => {
    if (results) {
      const dataStr = JSON.stringify(results, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `historical-analysis-${Date.now()}.json`;
      link.click();
    }
  };

  const handleShare = async () => {
    if (navigator.share && results) {
      try {
        await navigator.share({
          title: 'Historical Analysis Results',
          text: `Historical analysis completed with score: ${results.overallScore}/100`,
          url: window.location.href
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-red-600" />;
      default: return <BarChart3 className="h-4 w-4 text-blue-600" />;
    }
  };

  if (loading) {
    return (
      <ToolLayout 
        title="Historical Analysis Results" 
        description="Comprehensive historical data analysis and insights"
      >
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading analysis results...</p>
          </div>
        </div>
      </ToolLayout>
    );
  }

  if (!results) {
    return (
      <ToolLayout 
        title="Historical Analysis Results" 
        description="Comprehensive historical data analysis and insights"
      >
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">No analysis results found.</p>
          <Button onClick={() => window.history.back()}>Go Back</Button>
        </div>
      </ToolLayout>
    );
  }

  return (
    <ToolLayout 
      title="Historical Analysis Results" 
      description="Comprehensive historical data analysis and insights"
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Analysis Complete</h1>
            <p className="text-gray-600">URL: {results.url}</p>
            <p className="text-sm text-gray-500">Analysis Type: {results.analysisType}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
        </div>

        {/* Overall Score */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Overall Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="text-4xl font-bold text-blue-600">{results.overallScore}/100</div>
              <div className="flex-1">
                <Progress value={results.overallScore} className="h-3" />
                <div className="flex justify-between mt-2">
                  <Badge className={getRiskColor(results.riskLevel)}>
                    {results.riskLevel.toUpperCase()} RISK
                  </Badge>
                  <Badge variant="outline">
                    Indexer: {results.indexerStatus}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Historical Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Historical Metrics
            </CardTitle>
            <CardDescription>Key performance indicators over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-600">Total Data Points</p>
                <p className="text-2xl font-bold">{results.historicalMetrics.totalDataPoints.toLocaleString()}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-600">Time Range</p>
                <p className="text-2xl font-bold">{results.historicalMetrics.timeRange}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-600">Average Performance</p>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold">{results.historicalMetrics.averagePerformance}%</p>
                  {getTrendIcon(results.historicalMetrics.trendDirection)}
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-600">Volatility Index</p>
                <p className="text-2xl font-bold">{results.historicalMetrics.volatilityIndex}</p>
              </div>
              <div className="space-y-2 md:col-span-2">
                <p className="text-sm font-medium text-gray-600">Seasonal Patterns</p>
                <div className="flex flex-wrap gap-2">
                  {results.historicalMetrics.seasonalPatterns.map((pattern, index) => (
                    <Badge key={index} variant="secondary">{pattern}</Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Performance Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Performance Analysis
            </CardTitle>
            <CardDescription>Detailed performance insights and trends</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Best Period</p>
                  <p className="text-lg font-semibold text-green-600">{results.performanceAnalysis.bestPeriod}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Worst Period</p>
                  <p className="text-lg font-semibold text-red-600">{results.performanceAnalysis.worstPeriod}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Consistency Score</p>
                  <div className="flex items-center gap-2">
                    <Progress value={results.performanceAnalysis.consistencyScore} className="flex-1" />
                    <span className="text-sm font-medium">{results.performanceAnalysis.consistencyScore}%</span>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Growth Rate</p>
                  <p className="text-lg font-semibold text-blue-600">+{results.performanceAnalysis.growthRate}%</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-2">Correlation Factors</p>
                  <div className="space-y-1">
                    {results.performanceAnalysis.correlationFactors.map((factor, index) => (
                      <Badge key={index} variant="outline" className="mr-2 mb-1">{factor}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Time Series Data */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Time Series Analysis
            </CardTitle>
            <CardDescription>Historical data points and trends</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {results.timeSeriesData.map((dataPoint, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    {getTrendIcon(dataPoint.trend)}
                    <div>
                      <p className="font-medium">{dataPoint.period}</p>
                      <p className="text-sm text-gray-600">Significance: {(dataPoint.significance * 100).toFixed(0)}%</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold">{dataPoint.value}</p>
                    <Badge variant={dataPoint.trend === 'up' ? 'default' : dataPoint.trend === 'down' ? 'destructive' : 'secondary'}>
                      {dataPoint.trend}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Forecasting */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Forecasting
            </CardTitle>
            <CardDescription>Predictive analysis and future trends</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Next Period Prediction</p>
                  <p className="text-2xl font-bold text-blue-600">{results.forecasting.nextPeriodPrediction}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Confidence Level</p>
                  <div className="flex items-center gap-2">
                    <Progress value={results.forecasting.confidenceLevel} className="flex-1" />
                    <span className="text-sm font-medium">{results.forecasting.confidenceLevel}%</span>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Forecast Range</p>
                  <p className="text-lg font-semibold">{results.forecasting.forecastRange}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-2">Key Factors</p>
                  <div className="space-y-1">
                    {results.forecasting.keyFactors.map((factor, index) => (
                      <Badge key={index} variant="outline" className="mr-2 mb-1">{factor}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Opportunities */}
        <Card>
          <CardHeader>
            <CardTitle>Opportunities</CardTitle>
            <CardDescription>Recommended actions based on historical analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {results.opportunities.map((opportunity, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-medium text-blue-600">{index + 1}</span>
                  </div>
                  <p className="text-sm text-gray-700">{opportunity}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Diagnostics */}
        <Card>
          <CardHeader>
            <CardTitle>Data Quality Diagnostics</CardTitle>
            <CardDescription>Analysis reliability and data quality metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-sm font-medium text-gray-600 mb-2">Data Quality</p>
                <div className="text-2xl font-bold text-blue-600 mb-1">{results.diagnostics.dataQuality}%</div>
                <Progress value={results.diagnostics.dataQuality} className="h-2" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-gray-600 mb-2">Completeness</p>
                <div className="text-2xl font-bold text-green-600 mb-1">{results.diagnostics.completeness}%</div>
                <Progress value={results.diagnostics.completeness} className="h-2" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-gray-600 mb-2">Accuracy</p>
                <div className="text-2xl font-bold text-purple-600 mb-1">{results.diagnostics.accuracy}%</div>
                <Progress value={results.diagnostics.accuracy} className="h-2" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-gray-600 mb-2">Reliability</p>
                <div className="text-2xl font-bold text-orange-600 mb-1">{results.diagnostics.reliability}%</div>
                <Progress value={results.diagnostics.reliability} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  );
}

export default function HistoricalAnalysisResults() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HistoricalAnalysisResultsContent />
    </Suspense>
  );
}