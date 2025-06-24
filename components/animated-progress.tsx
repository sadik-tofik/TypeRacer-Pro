'use client';

import { motion } from 'framer-motion';
import { Progress } from '@/components/ui/progress';

interface AnimatedProgressProps {
  value: number;
  className?: string;
  showPercentage?: boolean;
  color?: 'default' | 'success' | 'warning' | 'error';
}

export function AnimatedProgress({ 
  value, 
  className = '', 
  showPercentage = false,
  color = 'default'
}: AnimatedProgressProps) {
  const getColorClasses = () => {
    switch (color) {
      case 'success':
        return 'bg-green-500';
      case 'warning':
        return 'bg-yellow-500';
      case 'error':
        return 'bg-red-500';
      default:
        return 'bg-blue-500';
    }
  };

  return (
    <div className={`relative ${className}`}>
      <Progress value={value} className="h-3" />
      <motion.div
        className={`absolute top-0 left-0 h-full rounded-full ${getColorClasses()}`}
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ 
          duration: 0.5, 
          ease: "easeOut",
          type: "spring",
          stiffness: 100,
          damping: 15
        }}
      />
      {showPercentage && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: value > 10 ? 1 : 0 }}
          transition={{ delay: 0.2 }}
        >
          {Math.round(value)}%
        </motion.div>
      )}
      
      {/* Animated glow effect */}
      <motion.div
        className={`absolute top-0 left-0 h-full rounded-full ${getColorClasses()} opacity-50 blur-sm`}
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ 
          duration: 0.5, 
          ease: "easeOut",
          delay: 0.1
        }}
      />
    </div>
  );
}