
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTasks } from '@/hooks/useTasks';
import { Play, Pause, RotateCcw, Clock, Check } from 'lucide-react';
import PomodoroTaskIntegration from '@/components/focus/PomodoroTaskIntegration';

const PomodoroFocus = () => {
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [currentTaskId, setCurrentTaskId] = useState<string | undefined>(undefined);
  const { logTimeSpent } = useTasks();

  // Session configuration
  const focusTime = 25 * 60; // 25 minutes in seconds
  const shortBreakTime = 5 * 60; // 5 minutes in seconds
  const longBreakTime = 15 * 60; // 15 minutes in seconds
  
  useEffect(() => {
    let interval: number | undefined;
    
    if (isActive && !isPaused) {
      interval = window.setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(interval);
            setIsActive(false);
            
            // If a task is selected, log the time spent
            if (currentTaskId) {
              logTimeSpent(currentTaskId, 25); // Log 25 minutes
            }
            
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    } else {
      clearInterval(interval);
    }
    
    return () => clearInterval(interval);
  }, [isActive, isPaused, currentTaskId, logTimeSpent]);

  const handleStart = () => {
    setIsActive(true);
    setIsPaused(false);
  };

  const handlePause = () => {
    setIsPaused(true);
  };

  const handleResume = () => {
    setIsPaused(false);
  };

  const handleReset = () => {
    setIsActive(false);
    setIsPaused(false);
    setTimeLeft(focusTime);
  };

  const handleTaskSelect = (taskId: string) => {
    setCurrentTaskId(taskId);
  };

  const handleCompleteSession = (taskId: string, minutes: number) => {
    logTimeSpent(taskId, minutes);
    setCurrentTaskId(undefined);
    handleReset();
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="container mx-auto py-20 px-4 max-w-4xl">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-orange-600">
            Pomodoro Focus
          </h1>
          <p className="text-center text-gray-600">
            Focus on your tasks using the Pomodoro Technique
          </p>
        </motion.div>
        
        <PomodoroTaskIntegration 
          onSelectTask={handleTaskSelect}
          onSessionComplete={handleCompleteSession}
          activeTaskId={currentTaskId}
          sessionLength={25}
        />
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-center">
              <Clock className="h-5 w-5 mr-2 text-red-500" />
              Pomodoro Timer
            </CardTitle>
            <CardDescription className="text-center">
              {!isActive ? "Start a 25-minute focus session" : 
                (isPaused ? "Timer paused" : "Focus session in progress")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center space-y-6">
              <div className="text-7xl font-bold text-gray-800">
                {formatTime(timeLeft)}
              </div>
              
              <div className="flex space-x-3">
                {!isActive ? (
                  <Button 
                    onClick={handleStart}
                    className="gap-2 bg-red-500 hover:bg-red-600"
                    disabled={!currentTaskId}
                  >
                    <Play className="h-4 w-4" />
                    Start
                  </Button>
                ) : isPaused ? (
                  <Button 
                    onClick={handleResume}
                    className="gap-2 bg-green-500 hover:bg-green-600"
                  >
                    <Play className="h-4 w-4" />
                    Resume
                  </Button>
                ) : (
                  <Button 
                    onClick={handlePause}
                    className="gap-2 bg-yellow-500 hover:bg-yellow-600"
                  >
                    <Pause className="h-4 w-4" />
                    Pause
                  </Button>
                )}
                
                <Button 
                  onClick={handleReset}
                  variant="outline"
                  className="gap-2"
                >
                  <RotateCcw className="h-4 w-4" />
                  Reset
                </Button>
                
                {isActive && !isPaused && currentTaskId && (
                  <Button 
                    onClick={() => handleCompleteSession(currentTaskId, 25)}
                    className="gap-2 bg-green-500 hover:bg-green-600"
                  >
                    <Check className="h-4 w-4" />
                    Complete
                  </Button>
                )}
              </div>
              
              {!currentTaskId && !isActive && (
                <p className="text-sm text-gray-500 text-center">
                  Select a task above to begin a focused work session
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PomodoroFocus;
