'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { RefreshCw, Play, Pause } from 'lucide-react';
import { AnimatedProgress } from '@/components/animated-progress';
import { soundManager } from '@/lib/sound-manager';

interface TypingTestStats {
  wpm: number;
  accuracy: number;
  timeElapsed: number;
  correctChars: number;
  incorrectChars: number;
  totalChars: number;
}

interface EnhancedTypingTestProps {
  text: string;
  timeLimit: number;
  onComplete: (stats: TypingTestStats) => void;
  onStatsUpdate: (stats: TypingTestStats) => void;
  onTimeUp: () => void;
  showErrors?: boolean;
  isTimerActive: boolean;
  onTimerStart: () => void;
  soundEnabled?: boolean;
}

export function EnhancedTypingTest({ 
  text, 
  timeLimit,
  onComplete, 
  onStatsUpdate, 
  onTimeUp,
  showErrors = true,
  isTimerActive,
  onTimerStart,
  soundEnabled = true
}: EnhancedTypingTestProps) {
  const [userInput, setUserInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [lastInputLength, setLastInputLength] = useState(0);
  const [stats, setStats] = useState<TypingTestStats>({
    wpm: 0,
    accuracy: 0,
    timeElapsed: 0,
    correctChars: 0,
    incorrectChars: 0,
    totalChars: 0
  });
  
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  const calculateStats = useCallback(() => {
    if (!startTime) return;

    const timeElapsed = (Date.now() - startTime.getTime()) / 1000 / 60; // in minutes
    const wordsTyped = userInput.trim().split(/\s+/).filter(word => word.length > 0).length;
    const wpm = Math.round(wordsTyped / timeElapsed) || 0;
    
    const correctChars = userInput.split('').filter((char, index) => 
      char === text[index]
    ).length;
    const incorrectChars = userInput.length - correctChars;
    const accuracy = userInput.length > 0 ? Math.round((correctChars / userInput.length) * 100) : 0;

    const newStats = {
      wpm,
      accuracy,
      timeElapsed: timeElapsed * 60, // in seconds
      correctChars,
      incorrectChars,
      totalChars: userInput.length
    };

    setStats(newStats);
    onStatsUpdate(newStats);

    return newStats;
  }, [userInput, text, startTime, onStatsUpdate]);

  useEffect(() => {
    if (isTyping && startTime && !isComplete) {
      const interval = setInterval(calculateStats, 1000);
      return () => clearInterval(interval);
    }
  }, [isTyping, startTime, isComplete, calculateStats]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    
    // Don't allow typing beyond the text length
    if (value.length > text.length) return;
    
    if (!isTyping && value.length > 0) {
      setIsTyping(true);
      setStartTime(new Date());
      onTimerStart();
    }

    // Play sound effects
    if (soundEnabled && value.length > lastInputLength) {
      const lastChar = value[value.length - 1];
      const expectedChar = text[value.length - 1];
      
      if (lastChar === expectedChar) {
        soundManager.playSound('keypress');
      } else {
        soundManager.playSound('error');
      }
    }

    setUserInput(value);
    setLastInputLength(value.length);

    // Update current word index
    const words = text.split(' ');
    let charCount = 0;
    let wordIndex = 0;
    
    for (let i = 0; i < words.length; i++) {
      if (charCount + words[i].length >= value.length) {
        wordIndex = i;
        break;
      }
      charCount += words[i].length + 1; // +1 for space
    }
    
    setCurrentWordIndex(wordIndex);

    if (value.length === text.length) {
      setIsComplete(true);
      setIsTyping(false);
      const finalStats = calculateStats();
      if (finalStats) {
        onComplete(finalStats);
      }
    }
  };

  const resetTest = () => {
    setUserInput('');
    setIsTyping(false);
    setStartTime(null);
    setIsComplete(false);
    setCurrentWordIndex(0);
    setLastInputLength(0);
    setStats({
      wpm: 0,
      accuracy: 0,
      timeElapsed: 0,
      correctChars: 0,
      incorrectChars: 0,
      totalChars: 0
    });
    inputRef.current?.focus();
  };

  const renderText = () => {
    const words = text.split(' ');
    
    return words.map((word, wordIndex) => {
      const wordStart = words.slice(0, wordIndex).join(' ').length + (wordIndex > 0 ? 1 : 0);
      const wordEnd = wordStart + word.length;
      
      const isCurrentWord = wordIndex === currentWordIndex;
      const isCompletedWord = wordEnd <= userInput.length;
      
      return (
        <motion.span
          key={wordIndex}
          className={`inline-block mr-1 px-1 rounded transition-all duration-200 ${
            isCurrentWord ? 'bg-blue-100 dark:bg-blue-900 border border-blue-300 dark:border-blue-700' : ''
          } ${isCompletedWord ? 'bg-green-50 dark:bg-green-900' : ''}`}
          initial={{ opacity: 0.7 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {word.split('').map((char, charIndex) => {
            const globalIndex = wordStart + charIndex;
            let className = 'text-gray-500 dark:text-gray-400';
            
            if (globalIndex < userInput.length) {
              if (userInput[globalIndex] === char) {
                className = 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900';
              } else if (showErrors) {
                className = 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900';
              }
            } else if (globalIndex === userInput.length) {
              className = 'text-gray-900 dark:text-gray-100 bg-blue-300 dark:bg-blue-700 animate-pulse';
            }

            return (
              <motion.span
                key={`${wordIndex}-${charIndex}`}
                className={`${className} transition-colors duration-150 rounded px-0.5`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.1, delay: charIndex * 0.01 }}
              >
                {char}
              </motion.span>
            );
          })}
        </motion.span>
      );
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <Card className="border-2 border-blue-100 dark:border-blue-800 shadow-lg">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl flex items-center space-x-2">
              <motion.div
                animate={isTyping ? { rotate: 360 } : {}}
                transition={{ duration: 2, repeat: isTyping ? Infinity : 0, ease: "linear" }}
              >
                {isTyping ? <Play className="h-5 w-5 text-green-600" /> : <Pause className="h-5 w-5 text-gray-600" />}
              </motion.div>
              <span>Typing Challenge</span>
            </CardTitle>
            <Button onClick={resetTest} variant="outline" size="sm" disabled={isComplete}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Reset
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <motion.div
            ref={textRef}
            className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-lg border-2 border-dashed border-gray-200 dark:border-gray-600 min-h-[150px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="text-lg leading-relaxed font-mono whitespace-pre-wrap">
              {renderText()}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="space-y-4"
          >
            <Textarea
              ref={inputRef}
              value={userInput}
              onChange={handleInputChange}
              className="text-lg border-2 border-gray-200 dark:border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 outline-none resize-none font-mono transition-all duration-200"
              rows={4}
              placeholder={isComplete ? "Test completed!" : "Start typing here..."}
              disabled={isComplete}
              autoFocus
            />
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`progress-${Math.round((userInput.length / text.length) * 100)}`}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 1.2, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Badge variant="secondary" className="text-sm">
                      Progress: {Math.round((userInput.length / text.length) * 100)}%
                    </Badge>
                  </motion.div>
                </AnimatePresence>
                
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`accuracy-${stats.accuracy}`}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 1.2, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Badge 
                      variant={stats.accuracy > 95 ? "default" : stats.accuracy > 90 ? "secondary" : "destructive"}
                      className="text-sm"
                    >
                      Accuracy: {stats.accuracy}%
                    </Badge>
                  </motion.div>
                </AnimatePresence>
                
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`wpm-${stats.wpm}`}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 1.2, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Badge variant="outline" className="text-sm">
                      WPM: {stats.wpm}
                    </Badge>
                  </motion.div>
                </AnimatePresence>
              </div>
              
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: 'auto' }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <AnimatedProgress 
                  value={(userInput.length / text.length) * 100}
                  className="w-48"
                  showPercentage={false}
                  color={stats.accuracy > 95 ? 'success' : stats.accuracy > 90 ? 'default' : 'warning'}
                />
              </motion.div>
            </div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}