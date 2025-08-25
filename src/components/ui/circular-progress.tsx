'use client';

import React, { useState, useEffect } from 'react';

interface CircularProgressProps {
  value: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
  label?: string;
  showValue?: boolean;
  color?: 'green' | 'yellow' | 'red' | 'blue' | 'purple';
}

export const CircularProgress: React.FC<CircularProgressProps> = ({
  value,
  size = 120,
  strokeWidth = 8,
  className = '',
  label = 'Score',
  showValue = true,
  color = 'blue'
}) => {
  const [animatedValue, setAnimatedValue] = useState(0);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = `${circumference} ${circumference}`;
  const strokeDashoffset = circumference - (animatedValue / 100) * circumference;

  useEffect(() => {
    const timer = setTimeout(() => {
      const duration = 2000; // 2 segundos de animación
      const steps = 60; // 60 pasos para animación suave
      const stepValue = value / steps;
      const stepDuration = duration / steps;
      
      let currentStep = 0;
      const interval = setInterval(() => {
        currentStep++;
        const newValue = Math.min(stepValue * currentStep, value);
        setAnimatedValue(newValue);
        
        if (currentStep >= steps) {
          clearInterval(interval);
        }
      }, stepDuration);
      
      return () => clearInterval(interval);
    }, 300); // Delay inicial de 300ms
    
    return () => clearTimeout(timer);
  }, [value]);

  const getProgressClass = (score: number) => {
    if (color === 'green') return 'stroke-green-500';
    if (color === 'yellow') return 'stroke-yellow-500';
    if (color === 'red') return 'stroke-red-500';
    if (color === 'purple') return 'stroke-purple-500';
    return 'stroke-blue-500';
  };

  const getTextColor = (score: number) => {
    if (color === 'green') return 'text-green-600';
    if (color === 'yellow') return 'text-yellow-600';
    if (color === 'red') return 'text-red-600';
    if (color === 'purple') return 'text-purple-600';
    return 'text-blue-600';
  };

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg
        width={size}
        height={size}
        className="transform -rotate-90 transition-all duration-300"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          className="fill-none stroke-gray-200 dark:stroke-gray-700"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          className={`fill-none stroke-linecap-round transition-all duration-1000 ease-out ${getProgressClass(animatedValue)}`}
        />
      </svg>
      
      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {showValue && (
          <div className={`text-2xl font-bold ${getTextColor(animatedValue)}`}>
            {Math.round(animatedValue)}
          </div>
        )}
        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {label}
        </div>
      </div>
    </div>
  );
};

export default CircularProgress;