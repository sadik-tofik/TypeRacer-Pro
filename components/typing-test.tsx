'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

interface TypingTestProps {
  text: string;
  onComplete: (stats: any) => void;
  onStatsUpdate: (stats: any) => void;
  showErrors?: boolean;
}

export function TypingTest({ text, onComplete, onStatsUpdate, showErrors = true }: TypingTestProps) {
  const [userInput, setUserInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [stats, setStats] = useState({
    wpm: 0,
    accuracy: 0,
    timeElapsed: 0,
    correctChars: 0,
    incorrectChars: 0
  });
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const calculateStats = useCallback(() => {
    if (!startTime) return;

    const timeElapsed = (Date.now() - startTime.getTime()) / 1000 / 60; // in minutes
    const wordsTyped = userInput.trim().split(/\s+/).length;
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
      incorrectChars
    };

    setStats(newStats);
    onStatsUpdate(newStats);

    return newStats;
  }, [userInput, text, startTime, onStatsUpdate]);

  useEffect(() => {
    if (isTyping && startTime) {
      const interval = setInterval(calculateStats, 1000);
      return () => clearInterval(interval);
    }
  }, [isTyping, startTime, calculateStats]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    
    // Don't allow typing beyond the text length
    if (value.length > text.length) return;
    
    if (!isTyping && value.length > 0) {
      setIsTyping(true);
      setStartTime(new Date());
    }

    setUserInput(value);

    if (value.length === text.length) {
      setIsTyping(false);
      const finalStats = calculateStats();
      if (finalStats) {
        onComplete(finalStats);
      }
    }
  };

  const renderText = () => {
    return text.split('').map((char, index) => {
      let className = 'text-gray-500';
      
      if (index < userInput.length) {
        if (userInput[index] === char) {
          className = 'text-green-600 bg-green-100';
        } else if (showErrors) {
          className = 'text-red-600 bg-red-100';
        }
      } else if (index === userInput.length) {
        className = 'text-gray-900 bg-blue-200 animate-pulse';
      }

      return (
        <span key={index} className={`${className} transition-colors duration-150 px-0.5 rounded`}>
          {char}
        </span>
      );
    });
  };

  return (
    <Card className="w-full">
      <CardContent className="p-6 space-y-6">
        <div className="p-6 bg-gray-50 rounded-lg border min-h-[120px]">
          <div className="text-lg leading-relaxed font-mono whitespace-pre-wrap">
            {renderText()}
          </div>
        </div>

        <div className="space-y-4">
          <textarea
            ref={inputRef}
            value={userInput}
            onChange={handleInputChange}
            className="w-full p-4 text-lg border rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none resize-none font-mono"
            rows={3}
            placeholder="Start typing here..."
            autoFocus
          />
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Badge variant="secondary">
                Progress: {Math.round((userInput.length / text.length) * 100)}%
              </Badge>
              <Badge variant={stats.accuracy > 95 ? "default" : stats.accuracy > 90 ? "secondary" : "destructive"}>
                Accuracy: {stats.accuracy}%
              </Badge>
              <Badge variant="outline">
                WPM: {stats.wpm}
              </Badge>
            </div>
            <Progress value={(userInput.length / text.length) * 100} className="w-48" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}