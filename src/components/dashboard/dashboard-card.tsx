'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { IconWrapper } from '@/components/ui/icon-wrapper';
import { Icons } from '@/components/icons';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface DashboardCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: keyof typeof Icons;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
}

export function DashboardCard({ title, value, description, icon, trend, trendValue }: DashboardCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [animatedValue, setAnimatedValue] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  // Animar el valor numérico
  useEffect(() => {
    setIsVisible(true);
    const numericValue = typeof value === 'number' ? value : parseFloat(value.toString().replace(/[^0-9.-]/g, '')) || 0;
    
    if (numericValue > 0) {
      let start = 0;
      const duration = 1500;
      const increment = numericValue / (duration / 16);
      
      const timer = setInterval(() => {
        start += increment;
        if (start >= numericValue) {
          setAnimatedValue(numericValue);
          clearInterval(timer);
        } else {
          setAnimatedValue(Math.floor(start));
        }
      }, 16);
      
      return () => clearInterval(timer);
    } else {
      setAnimatedValue(numericValue);
    }
  }, [value]);

  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return TrendingUp;
      case 'down':
        return TrendingDown;
      default:
        return Minus;
    }
  };

  const TrendIcon = getTrendIcon();
  const displayValue = typeof value === 'number' ? animatedValue : value;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ 
        opacity: isVisible ? 1 : 0, 
        y: isVisible ? 0 : 20, 
        scale: isVisible ? 1 : 0.95 
      }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      whileHover={{ 
        scale: 1.02, 
        y: -4,
        transition: { duration: 0.2 } 
      }}
      whileTap={{ scale: 0.98 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="rounded-xl border bg-gradient-to-br from-white to-gray-50/50 text-card-foreground shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden relative group"
    >
      {/* Efecto de brillo en hover */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full"
        animate={{
          translateX: isHovered ? '200%' : '-100%'
        }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      />
      
      <div className="p-6 flex flex-col space-y-3 relative z-10">
        <div className="flex items-center justify-between">
          <motion.span 
            className="text-sm font-medium text-muted-foreground"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            {title}
          </motion.span>
          <motion.div 
            className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center text-primary shadow-sm"
            initial={{ opacity: 0, scale: 0, rotate: -180 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ delay: 0.3, duration: 0.5, type: "spring", stiffness: 200 }}
            whileHover={{ 
              scale: 1.1, 
              rotate: 5,
              boxShadow: "0 8px 25px rgba(0,0,0,0.15)"
            }}
          >
            <IconWrapper icon={icon} className="h-5 w-5" />
          </motion.div>
        </div>
        
        <motion.div 
          className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.6, type: "spring", stiffness: 150 }}
        >
          {displayValue}
        </motion.div>
        <motion.div 
          className="text-sm text-muted-foreground leading-relaxed"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
        >
          {description}
        </motion.div>
        
        {trend && (
          <motion.div 
            className={`flex items-center justify-between p-3 rounded-lg border transition-all duration-300 ${
              trend === 'up' 
                ? 'bg-green-50 border-green-200 text-green-700' 
                : trend === 'down' 
                ? 'bg-red-50 border-red-200 text-red-700' 
                : 'bg-gray-50 border-gray-200 text-gray-700'
            }`}
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5, type: "spring", stiffness: 200 }}
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center space-x-2">
              <motion.div
                initial={{ rotate: 0 }}
                animate={{ rotate: isHovered ? 360 : 0 }}
                transition={{ duration: 0.5 }}
              >
                <TrendIcon className="h-4 w-4" />
              </motion.div>
              <span className="text-sm font-medium">
                {trend === 'up' ? 'Incremento' : trend === 'down' ? 'Decremento' : 'Estable'}
              </span>
            </div>
            <motion.span 
              className="text-sm font-bold"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7, duration: 0.3 }}
            >
              {trendValue}
            </motion.span>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}