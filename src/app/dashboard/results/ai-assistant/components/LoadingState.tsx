'use client';

import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Loader2, Brain, Zap } from 'lucide-react';

interface LoadingStateProps {
  progress?: number;
  currentStep?: string;
  onCancel?: () => void;
}

export default function LoadingState({ 
  progress = 0, 
  currentStep = 'Initializing analysis...', 
  onCancel 
}: LoadingStateProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <Brain className="w-12 h-12 text-purple-600" />
              <Loader2 className="w-6 h-6 text-purple-600 animate-spin absolute -top-1 -right-1" />
            </div>
          </div>
          <h2 className="text-xl font-semibold text-gray-900">AI Analysis in Progress</h2>
          <p className="text-gray-600">Please wait while we analyze your data...</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">Progress</span>
              <span className="text-sm text-gray-600">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
          
          <div className="text-center">
            <p className="text-sm text-gray-600">{currentStep}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <Zap className="w-6 h-6 text-blue-600 mx-auto mb-2" />
              <p className="text-xs text-gray-600">Processing Data</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <Brain className="w-6 h-6 text-purple-600 mx-auto mb-2" />
              <p className="text-xs text-gray-600">AI Analysis</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <Loader2 className="w-6 h-6 text-green-600 mx-auto mb-2 animate-spin" />
              <p className="text-xs text-gray-600">Generating Report</p>
            </div>
          </div>
          
          {onCancel && (
            <div className="text-center">
              <Button variant="outline" onClick={onCancel}>
                Cancel Analysis
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Skeleton cards for loading state */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="h-3 bg-gray-200 rounded"></div>
              <div className="h-3 bg-gray-200 rounded w-5/6"></div>
              <div className="h-3 bg-gray-200 rounded w-4/6"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}