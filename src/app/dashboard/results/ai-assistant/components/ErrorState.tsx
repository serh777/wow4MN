'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react';

interface ErrorStateProps {
  error?: Error | string;
  onRetry?: () => void;
  onGoHome?: () => void;
  title?: string;
  description?: string;
}

export default function ErrorState({ 
  error, 
  onRetry, 
  onGoHome,
  title = 'Analysis Failed',
  description = 'An error occurred while processing your request.'
}: ErrorStateProps) {
  const errorMessage = error instanceof Error ? error.message : error || 'Unknown error occurred';
  
  return (
    <div className="space-y-6">
      <Card className="border-red-200">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-red-100 rounded-full">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
          </div>
          <CardTitle className="text-red-900">{title}</CardTitle>
          <p className="text-red-700">{description}</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert className="border-red-200 bg-red-50">
            <Bug className="w-4 h-4 text-red-600" />
            <AlertDescription className="text-red-800">
              <strong>Error Details:</strong> {errorMessage}
            </AlertDescription>
          </Alert>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {onRetry && (
              <Button onClick={onRetry} className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4" />
                Try Again
              </Button>
            )}
            {onGoHome && (
              <Button variant="outline" onClick={onGoHome} className="flex items-center gap-2">
                <Home className="w-4 h-4" />
                Go to Dashboard
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-gray-900">Troubleshooting Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
              Check your internet connection and try again
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
              Ensure your input data is valid and properly formatted
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
              If the problem persists, please contact support
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
              Try refreshing the page or clearing your browser cache
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}