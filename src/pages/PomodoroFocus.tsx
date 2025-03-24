
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTasks } from '@/hooks/useTasks';
import { Play, Pause, RotateCcw, Clock, Check, Settings as SettingsIcon, Coffee } from 'lucide-react';
import PomodoroTaskIntegration from '@/components/focus/PomodoroTaskIntegration';
import PomodoroSettings from '@/components/focus/PomodoroSettings';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const PomodoroFocus = () => {
  // State for timer settings
  const [focusMinutes, setFocusMinutes] = useState(25);
  const [breakMinutes, setBreakMinutes] = useState(5);
  
  // Timer states
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [timeLeft, setTimeLeft] = useState(focusMinutes * 60); // convert to seconds
  const [isBreakTime, setIsBreakTime] = useState(false);
  const [currentTaskId, setCurrentTaskId] = useState<string | undefined>(undefined);
  const { logTimeSpent } = useTasks();
  const [activeTab, setActiveTab] = useState<string>("timer");
  
  // Reset timer when focus or break minutes change
  useEffect(() => {
    if (!isActive) {
      setTimeLeft(isBreakTime ? breakMinutes * 60 : focusMinutes * 60);
    }
  }, [focusMinutes, breakMinutes, isBreakTime, isActive]);

  // Timer logic
  useEffect(() => {
    let interval: number | undefined;
    
    if (isActive && !isPaused) {
      interval = window.setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(interval);
            
            // If focus time ended, switch to break time or vice versa
            if (!isBreakTime) {
              // Focus time ended, switch to break
              setIsBreakTime(true);
              
              // If a task is selected, log the time spent
              if (currentTaskId) {
                logTimeSpent(currentTaskId, focusMinutes);
              }
              
              return breakMinutes * 60; // Set break time
            } else {
              // Break time ended, switch back to focus time
              setIsBreakTime(false);
              setIsActive(false); // Stop timer after break
              return focusMinutes * 60; // Reset to focus time for next session
            }
          }
          return prevTime - 1;
        });
      }, 1000);
    } else {
      clearInterval(interval);
    }
    
    return () => clearInterval(interval);
  }, [isActive, isPaused, isBreakTime, currentTaskId, focusMinutes, breakMinutes, logTimeSpent]);

  const handleStart = () => {
    setIsActive(true);
    setIsPaused(false);
    // Make sure the timer is set correctly based on the current mode
    if (!isActive) {
      setTimeLeft(isBreakTime ? breakMinutes * 60 : focusMinutes * 60);
    }
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
    setIsBreakTime(false);
    setTimeLeft(focusMinutes * 60);
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

  const getTimerStatusClass = () => {
    if (!isActive) return "";
    return isBreakTime ? "border-yellow-400 bg-yellow-50" : "border-green-400 bg-green-50";
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
          sessionLength={focusMinutes}
        />
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="timer" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Timer
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <SettingsIcon className="h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="timer">
            <Card className={`border-2 transition-colors duration-300 ${getTimerStatusClass()}`}>
              <CardHeader>
                <CardTitle className="flex items-center justify-center">
                  {isBreakTime ? (
                    <>
                      <Coffee className="h-5 w-5 mr-2 text-yellow-500" />
                      Break Time
                    </>
                  ) : (
                    <>
                      <Clock className="h-5 w-5 mr-2 text-red-500" />
                      {isActive ? "Focus Session" : "Pomodoro Timer"}
                    </>
                  )}
                </CardTitle>
                <CardDescription className="text-center">
                  {!isActive ? "Start a focus session" : 
                    (isPaused ? "Timer paused" : (isBreakTime ? "Take a break!" : "Focus session in progress"))}
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
                        disabled={!currentTaskId && !isBreakTime}
                      >
                        <Play className="h-4 w-4" />
                        Start {isBreakTime ? "Break" : "Focus"}
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
                    
                    {isActive && !isPaused && !isBreakTime && currentTaskId && (
                      <Button 
                        onClick={() => handleCompleteSession(currentTaskId, focusMinutes)}
                        className="gap-2 bg-green-500 hover:bg-green-600"
                      >
                        <Check className="h-4 w-4" />
                        Complete
                      </Button>
                    )}
                  </div>
                  
                  {!currentTaskId && !isActive && !isBreakTime && (
                    <p className="text-sm text-gray-500 text-center">
                      Select a task above to begin a focused work session
                    </p>
                  )}
                  
                  {isBreakTime && (
                    <p className="text-sm text-yellow-600 text-center font-medium">
                      Time to take a break! Resume when you're ready.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="settings">
            <PomodoroSettings 
              focusMinutes={focusMinutes}
              breakMinutes={breakMinutes}
              onFocusMinutesChange={setFocusMinutes}
              onBreakMinutesChange={setBreakMinutes}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PomodoroFocus;
