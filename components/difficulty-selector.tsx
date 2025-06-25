'use client';

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { difficultyLevels, DifficultyLevel } from '@/lib/typing-texts';
import { Clock, Target, Zap } from 'lucide-react';

interface DifficultySelectorProps {
  selectedDifficulty: string;
  onDifficultyChange: (difficulty: string) => void;
  disabled?: boolean;
}

export function DifficultySelector({ 
  selectedDifficulty, 
  onDifficultyChange, 
  disabled = false 
}: DifficultySelectorProps) {
  const getIcon = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return <Target className="h-5 w-5" />;
      case 'medium': return <Zap className="h-5 w-5" />;
      case 'hard': return <Clock className="h-5 w-5" />;
      default: return <Target className="h-5 w-5" />;
    }
  };

  const getColorClasses = (difficulty: string, isSelected: boolean) => {
    const baseClasses = "transition-all duration-300";
    
    if (isSelected) {
      switch (difficulty) {
        case 'easy':
          return `${baseClasses} bg-green-50 border-green-300 text-green-700 shadow-green-100`;
        case 'medium':
          return `${baseClasses} bg-blue-50 border-blue-300 text-blue-700 shadow-blue-100`;
        case 'hard':
          return `${baseClasses} bg-red-50 border-red-300 text-red-700 shadow-red-100`;
        default:
          return `${baseClasses} bg-blue-50 border-blue-300 text-blue-700`;
      }
    }
    
    return `${baseClasses} bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-4"
    >
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Choose Your Challenge</h3>
        <p className="text-sm text-gray-600">Select a difficulty level to begin your typing test</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {difficultyLevels.map((level, index) => {
          const isSelected = selectedDifficulty === level.id;
          
          return (
            <motion.div
              key={level.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: disabled ? 1 : 1.02 }}
              whileTap={{ scale: disabled ? 1 : 0.98 }}
            >
              <Card 
                className={`cursor-pointer border-2 shadow-lg ${getColorClasses(level.id, isSelected)} ${
                  disabled ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                onClick={() => !disabled && onDifficultyChange(level.id)}
              >
                <CardContent className="p-6 text-center space-y-4">
                  <div className="flex items-center justify-center space-x-2">
                    <span className="text-2xl">{level.icon}</span>
                    {getIcon(level.id)}
                  </div>
                  
                  <div>
                    <h4 className="font-bold text-lg">{level.name}</h4>
                    <p className="text-sm opacity-80 mt-1">{level.description}</p>
                  </div>
                  
                  <div className="flex items-center justify-center space-x-2">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm font-medium">{level.timeLimit}s</span>
                  </div>
                  
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    >
                      <Badge className="bg-white text-current border-current">
                        Selected
                      </Badge>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}