'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Trophy, Settings, Target, Clock, Zap, RefreshCw, Eye, EyeOff, Volume2, VolumeX, Play, Award, Users, Moon, Sun } from 'lucide-react';
import { DifficultySelector } from '@/components/difficulty-selector';
import { CountdownTimer } from '@/components/countdown-timer';
import { EnhancedTypingTest } from '@/components/enhanced-typing-test';
import { AdPlaceholder } from '@/components/ad-placeholder';
import { ThemeToggle } from '@/components/theme-toggle';
import { getRandomText, getDifficultyLevel } from '@/lib/typing-texts';
import { soundManager } from '@/lib/sound-manager';

interface TestResult {
  id: string;
  wpm: number;
  accuracy: number;
  difficulty: string;
  timestamp: string; 
}

interface TestStats {
  wpm: number;
  accuracy: number;
  timeElapsed: number;
  correctChars: number;
  incorrectChars: number;
  totalChars: number;
}


export default function Home() {
  const [gameState, setGameState] = useState<'setup' | 'playing' | 'completed'>('setup');
  const [difficulty, setDifficulty] = useState('medium');
  const [currentText, setCurrentText] = useState('');
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [stats, setStats] = useState<TestStats>({
    wpm: 0,
    accuracy: 0,
    timeElapsed: 0,
    correctChars: 0,
    incorrectChars: 0,
    totalChars: 0
  });
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showAd, setShowAd] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showErrors, setShowErrors] = useState(true);
  const { toast } = useToast();

  const difficultyLevel = getDifficultyLevel(difficulty);
 
  const fetchTestResults = useCallback(async () => {
    try {
      const response = await fetch('/api/test-results');  // Updated endpoint
      if (response.ok) {
        const data = await response.json();
        setTestResults(data);
      }
    } catch (error) {
      console.error('Error fetching test results:', error);
    }
  }, []);

  const saveTestResult = async (result: Omit<TestResult, 'id' | 'timestamp'>) => {
    try {
      console.log('Sending test result to API:', result);
      const response = await fetch('/api/test-results', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          wpm: result.wpm,
          accuracy: result.accuracy,
          difficulty: result.difficulty
        }),
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server responded with:', response.status, errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const responseData = await response.json();
      console.log('Test result saved successfully:', responseData);
      
      await fetchTestResults();
    } catch (error) {
      console.error('Error in saveTestResult:', error);
    }
  };

// Add this effect to load results on mount
useEffect(() => {
  fetchTestResults();
}, [fetchTestResults]);


const handleTestComplete = (finalStats: TestStats) => {
  setGameState('completed');
  setIsTimerActive(false);
  
  const result = {
    id : Date.now().toString(),
    wpm: finalStats.wpm,
    accuracy: finalStats.accuracy,
    difficulty,  
    timestamp: new Date().toISOString()
  };

  setTestResults(prev => [result, ...prev.slice(0, 9)]);
  saveTestResult(result);  // Save to the database
  setShowResults(true);
  
  // Play success sound
  soundManager.playSound('success');
  
  // Show ad after test completion
  setTimeout(() => setShowAd(true), 2000);
  
  toast({
    title: "Test Complete! 🎉",
    description: `${finalStats.wpm} WPM with ${finalStats.accuracy}% accuracy`,
  });
};

  const initializeTest = useCallback(() => {
    const text = getRandomText(difficulty);
    setCurrentText(text);
    setGameState('setup');
    setIsTimerActive(false);
    setStats({
      wpm: 0,
      accuracy: 0,
      timeElapsed: 0,
      correctChars: 0,
      incorrectChars: 0,
      totalChars: 0
    });
  }, [difficulty]);

  useEffect(() => {
    initializeTest();
  }, [initializeTest]);

  useEffect(() => {
    soundManager.setEnabled(soundEnabled);
  }, [soundEnabled]);

  const handleDifficultyChange = (newDifficulty: string) => {
    setDifficulty(newDifficulty);
    setGameState('setup');
    setIsTimerActive(false);
  };

  const handleStartTest = () => {
    setGameState('playing');
    setIsTimerActive(false); // Timer will start when user begins typing
  };

  const handleTimerStart = () => {
    setIsTimerActive(true);
  };


  const handleTimeUp = () => {
    setGameState('completed');
    setIsTimerActive(false);
    toast({
      title: "Time's Up! ⏰",
      description: "Your typing test has ended",
      variant: "destructive"
    });
  };

  const handleStatsUpdate = (newStats: TestStats) => {
    setStats(newStats);
  };

  const handleNewTest = () => {
    initializeTest();
    setShowResults(false);
  };

  const getBestStats = () => {
    if (testResults.length === 0) return { bestWpm: 0, bestAccuracy: 0 };
    return {
      bestWpm: Math.max(...testResults.map(r => r.wpm)),
      bestAccuracy: Math.max(...testResults.map(r => r.accuracy))
    };
  };

  const { bestWpm, bestAccuracy } = getBestStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-sm border-b sticky top-0 z-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <motion.div 
              className="flex items-center space-x-3"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  TypeRacer Pro
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">Advanced Typing Speed Test</p>
              </div>
            </motion.div>
            
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              
              <Dialog open={showSettings} onOpenChange={setShowSettings}>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowSettings(true)}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Button>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Test Settings</DialogTitle>
                    <DialogDescription>
                      Customize your typing test experience
                    </DialogDescription>
                  </DialogHeader>
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <Label htmlFor="sound" className="flex items-center space-x-2">
                        {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                        <span>Sound Effects</span>
                      </Label>
                      <Switch
                        id="sound"
                        checked={soundEnabled}
                        onCheckedChange={setSoundEnabled}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="errors" className="flex items-center space-x-2">
                        {showErrors ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                        <span>Show Errors</span>
                      </Label>
                      <Switch
                        id="errors"
                        checked={showErrors}
                        onCheckedChange={setShowErrors}
                      />
                    </div>
                    <AdPlaceholder type="Settings" className="mt-4" />
                  </motion.div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
        <AdPlaceholder type="Leaderboard Banner" className="mx-4 mb-4" />
      </motion.header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Stats Cards */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="grid grid-cols-1 md:grid-cols-4 gap-4"
            >
              <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
                <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-blue-600 dark:text-blue-400">WPM</p>
                        <motion.p 
                          key={stats.wpm}
                          initial={{ scale: 1.2, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ duration: 0.3 }}
                          className="text-3xl font-bold text-blue-700 dark:text-blue-300"
                        >
                          {stats.wpm}
                        </motion.p>
                      </div>
                      <Target className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
                <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-green-600 dark:text-green-400">Accuracy</p>
                        <motion.p 
                          key={stats.accuracy}
                          initial={{ scale: 1.2, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ duration: 0.3 }}
                          className="text-3xl font-bold text-green-700 dark:text-green-300"
                        >
                          {stats.accuracy}%
                        </motion.p>
                      </div>
                      <Eye className="h-8 w-8 text-green-600 dark:text-green-400" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
                <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200 dark:border-purple-800">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Time</p>
                        <motion.p 
                          key={Math.round(stats.timeElapsed)}
                          initial={{ scale: 1.2, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ duration: 0.3 }}
                          className="text-3xl font-bold text-purple-700 dark:text-purple-300"
                        >
                          {Math.round(stats.timeElapsed)}s
                        </motion.p>
                      </div>
                      <Clock className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
                <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-950 dark:to-yellow-900 border-yellow-200 dark:border-yellow-800">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-yellow-600 dark:text-yellow-400">Level</p>
                        <p className="text-2xl font-bold text-yellow-700 dark:text-yellow-300 capitalize">
                          {difficulty}
                        </p>
                      </div>
                      <Award className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>

            {/* Game State Content */}
            <AnimatePresence mode="wait">
              {gameState === 'setup' && (
                <motion.div
                  key="setup"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-6"
                >
                  <DifficultySelector
                    selectedDifficulty={difficulty}
                    onDifficultyChange={handleDifficultyChange}
                  />
                  
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="text-center"
                  >
                    <Button 
                      onClick={handleStartTest}
                      size="lg"
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <Play className="h-5 w-5 mr-2" />
                      Start Typing Test
                    </Button>
                  </motion.div>
                </motion.div>
              )}

              {gameState === 'playing' && (
                <motion.div
                  key="playing"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                      <EnhancedTypingTest
                        text={currentText}
                        timeLimit={difficultyLevel.timeLimit}
                        onComplete={handleTestComplete}
                        onStatsUpdate={handleStatsUpdate}
                        onTimeUp={handleTimeUp}
                        showErrors={showErrors}
                        isTimerActive={isTimerActive}
                        onTimerStart={handleTimerStart}
                        soundEnabled={soundEnabled}
                      />
                    </div>
                    <div>
                      <CountdownTimer
                        timeLimit={difficultyLevel.timeLimit}
                        isActive={isTimerActive}
                        onTimeUp={handleTimeUp}
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {gameState === 'completed' && (
                <motion.div
                  key="completed"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                  className="text-center space-y-6"
                >
                  <Card className="bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-950 dark:to-blue-950 border-2 border-green-200 dark:border-green-800">
                    <CardHeader>
                      <CardTitle className="text-2xl text-green-700 dark:text-green-300 flex items-center justify-center space-x-2">
                        <Trophy className="h-6 w-6" />
                        <span>Test Completed!</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
                          <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{stats.wpm}</div>
                          <div className="text-sm text-blue-600 dark:text-blue-400">Words Per Minute</div>
                        </div>
                        <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
                          <div className="text-3xl font-bold text-green-600 dark:text-green-400">{stats.accuracy}%</div>
                          <div className="text-sm text-green-600 dark:text-green-400">Accuracy</div>
                        </div>
                      </div>
                      <Button 
                        onClick={handleNewTest}
                        size="lg"
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                      >
                        <RefreshCw className="h-5 w-5 mr-2" />
                        Start New Test
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Sidebar Ad */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <AdPlaceholder type="Sidebar" className="sticky top-32" />
            </motion.div>

            {/* Recent Results */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card className="dark:bg-gray-800">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Trophy className="h-5 w-5 mr-2 text-yellow-600" />
                    Recent Results
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <AnimatePresence>
                    {testResults.length > 0 ? (
                      <div className="space-y-3">
                        {testResults.slice(0, 5).map((result, index) => (
                          <motion.div
                            key={result.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                            className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                          >
                            <div>
                              <div className="font-semibold">{result.wpm} WPM</div>
                              <div className="text-sm text-gray-600 dark:text-gray-400">
                                {result.accuracy}% • {result.difficulty}
                              </div>
                            </div>
                            <Badge variant={index === 0 ? "default" : "secondary"}>
                              #{index + 1}
                            </Badge>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 dark:text-gray-400 text-center py-4">No test results yet</p>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card className="dark:bg-gray-800">
                <CardHeader>
                  <CardTitle>Personal Best</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Tests Completed</span>
                    <span className="font-semibold">{testResults.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Best WPM</span>
                    <motion.span
                      key={bestWpm}
                      initial={{ scale: 1.2, color: '#10b981' }}
                      animate={{ 
                        scale: 1, 
                        color: '#000000'  // or any other hex color
                      }}
                      transition={{ 
                        duration: 0.5,
                        color: { duration: 0.5 }  // Optional: separate timing for color
                      }}
                      className="font-semibold"
                    >
                      {bestWpm}%
                    </motion.span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Best Accuracy</span>
                    <motion.span
                      key={bestAccuracy}
                      initial={{ scale: 1.2, color: '#10b981' }}
                      animate={{ 
                        scale: 1, 
                        color: '#000000'  // or any other hex color
                      }}
                        transition={{ 
                        duration: 0.5,
                       color: { duration: 0.5 }  // Optional: separate timing for color
                      }}
                      className="font-semibold"
                    >
                   {bestAccuracy}%
                   </motion.span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </main>

      {/* Results Dialog */}
      <Dialog open={showResults} onOpenChange={setShowResults}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Trophy className="h-5 w-5 mr-2 text-yellow-600" />
              Excellent Work!
            </DialogTitle>
            <DialogDescription>
              Here are your detailed results for this typing test
            </DialogDescription>
          </DialogHeader>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <div className="grid grid-cols-2 gap-4">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="text-center p-4 bg-blue-50 dark:bg-blue-950 rounded-lg"
              >
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.wpm}</div>
                <div className="text-sm text-blue-600 dark:text-blue-400">WPM</div>
              </motion.div>
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="text-center p-4 bg-green-50 dark:bg-green-950 rounded-lg"
              >
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.accuracy}%</div>
                <div className="text-sm text-green-600 dark:text-green-400">Accuracy</div>
              </motion.div>
            </div>
            <Separator />
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Difficulty</span>
                <Badge className="capitalize">{difficulty}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Time Elapsed</span>
                <span className="font-semibold">{Math.round(stats.timeElapsed)}s</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Correct Characters</span>
                <span className="font-semibold text-green-600 dark:text-green-400">{stats.correctChars}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Incorrect Characters</span>
                <span className="font-semibold text-red-600 dark:text-red-400">{stats.incorrectChars}</span>
              </div>
            </div>
            <Button onClick={handleNewTest} className="w-full">
              Start New Test
            </Button>
          </motion.div>
        </DialogContent>
      </Dialog>

      {/* Ad Popup */}
      <Dialog open={showAd} onOpenChange={setShowAd}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Thanks for using TypeRacer Pro!</DialogTitle>
            <DialogDescription>
              Support us by checking out our sponsors
            </DialogDescription>
          </DialogHeader>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <AdPlaceholder type="Post-Test Popup" className="my-4" />
          </motion.div>
          <Button onClick={() => setShowAd(false)} className="w-full">
            Continue
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}