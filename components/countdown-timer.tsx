'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Clock, AlertTriangle } from 'lucide-react';

interface CountdownTimerProps {
  timeLimit: number; // in seconds
  isActive: boolean;
  onTimeUp: () => void;
  onTick?: (timeRemaining: number) => void;
}

export function CountdownTimer({ timeLimit, isActive, onTimeUp, onTick }: CountdownTimerProps) {
  const [timeRemaining, setTimeRemaining] = useState(timeLimit);

  useEffect(() => {
    setTimeRemaining(timeLimit);
  }, [timeLimit]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => {
          const newTime = prev - 1;
          onTick?.(newTime);
          
          if (newTime <= 0) {
            onTimeUp();
            return 0;
          }
          
          return newTime;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isActive, timeRemaining, onTimeUp, onTick]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgressColor = () => {
    const percentage = (timeRemaining / timeLimit) * 100;
    if (percentage > 50) return 'bg-green-500';
    if (percentage > 25) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getTextColor = () => {
    const percentage = (timeRemaining / timeLimit) * 100;
    if (percentage > 25) return 'text-gray-700';
    return 'text-red-600';
  };

  const isWarning = timeRemaining <= 10 && timeRemaining > 0;
  const isCritical = timeRemaining <= 5 && timeRemaining > 0;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={`border-2 transition-all duration-300 ${
        isCritical ? 'border-red-300 bg-red-50' : 
        isWarning ? 'border-yellow-300 bg-yellow-50' : 
        'border-gray-200 bg-white'
      }`}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <motion.div
                animate={isCritical ? { 
                  rotate: [0, -10, 10, -10, 10, 0],
                  scale: [1, 1.1, 1]
                } : {}}
                transition={{ 
                  duration: 0.5,
                  repeat: isCritical ? Infinity : 0,
                  repeatDelay: 0.5
                }}
              >
                {isCritical ? (
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                ) : (
                  <Clock className="h-5 w-5 text-gray-600" />
                )}
              </motion.div>
              <span className="text-sm font-medium text-gray-600">Time Remaining</span>
            </div>
            
            <AnimatePresence mode="wait">
              <motion.div
                key={timeRemaining}
                initial={{ scale: 1.2, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className={`text-2xl font-bold ${getTextColor()}`}
              >
                {formatTime(timeRemaining)}
              </motion.div>
            </AnimatePresence>
          </div>
          
          <div className="space-y-2">
            <Progress 
              value={(timeRemaining / timeLimit) * 100} 
              className="h-2"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>0:00</span>
              <span>{formatTime(timeLimit)}</span>
            </div>
          </div>
          
          {isWarning && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3 text-center"
            >
              <span className={`text-xs font-medium ${
                isCritical ? 'text-red-600' : 'text-yellow-600'
              }`}>
                {isCritical ? 'Time almost up!' : 'Hurry up!'}
              </span>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}