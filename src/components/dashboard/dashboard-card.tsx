'use client';

import React from 'react';
import { IconWrapper } from '@/components/ui/icon-wrapper';
import { Icons } from '@/components/icons';

interface DashboardCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: keyof typeof Icons;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
}

export function DashboardCard({ title, value, description, icon, trend, trendValue }: DashboardCardProps) {
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="p-6 flex flex-col space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-muted-foreground">{title}</span>
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <IconWrapper icon={icon} className="h-4 w-4" />
          </div>
        </div>
        <div className="text-2xl font-bold">{value}</div>
        <div className="text-xs text-muted-foreground">{description}</div>
        {trend && (
          <div className={`flex items-center text-xs ${
            trend === 'up' ? 'text-green-500' : 
            trend === 'down' ? 'text-red-500' : 
            'text-gray-500'
          }`}>
            {trend === 'up' ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m18 15-6-6-6 6"/>
              </svg>
            ) : trend === 'down' ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m6 9 6 6 6-6"/>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M8 12h8"/>
              </svg>
            )}
            <span className="ml-1">{trendValue}</span>
          </div>
        )}
      </div>
    </div>
  );
}