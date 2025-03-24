
import { useState, useEffect, useRef } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { Timer, Play, Pause, RotateCcw, Square, Clock, AlertTriangle, CheckCircle, ArrowRightCircle } from 'lucide-react';
import PomodoroTaskIntegration from '@/components/focus/PomodoroTaskIntegration';
import { useTasks } from '@/hooks/useTasks';
import { useNavigate } from 'react-router-dom';

// Sample tasks for Eisenhower Matrix
const sampleTasks = {
  urgentImportant: [
    { id: 1, title: 'Complete project proposal', description: 'Deadline tomorrow' },
    { id: 2, title: 'Fix major app bug', description: 'Affecting user experience' }
  ],
  notUrgentImportant: [
    { id: 3, title: 'Plan weekly schedule', description: 'For next week' },
    { id: 4, title: 'Learn new productivity technique', description: 'For personal development' }
  ],
  urgentNotImportant: [
    { id: 5, title: 'Reply to emails', description: '5 unread messages' },
    { id: 6, title: 'Team meeting', description: 'Daily standup' }
  ],
  notUrgentNotImportant: [
    { id: 7, title: 'Social media check', description: 'Quick browse' },
    { id: 8, title: 'Review news articles', description: 'Industry updates' }
  ]
};

const Focus = () => {
  // Timer state
  const [timerMode, setTimerMode] = useState('pomodoro');
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isActive, setIsActive] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentRound, setCurrentRound] = useState(1);
  const [totalRounds, setTotalRounds] = useState(4);
  const [showNotifications, setShowNotifications] = useState(true);
  const [activeTaskId, setActiveTaskId] = useState<string | undefined>(undefined);
  
  // Eisenhower Matrix state
  const [matrix, setMatrix] = useState(sampleTasks);
  const [draggingTask, setDraggingTask] = useState(null);
  const navigate = useNavigate();
  const { logTimeSpent } = useTasks();

  // Timer intervals
  const timerRef = useRef(null);
  const initialTime = useRef(25 * 60);
  
  // Get the session length in minutes based on timer mode
  const getSessionLength = () => {
    if (timerMode === 'pomodoro') return 25;
    if (timerMode === 'shortBreak') return 5;
    if (timerMode === 'longBreak') return 15;
    return 0;
  };
  
  // Handle timer mode change
  const handleModeChange = (mode) => {
    setIsActive(false);
    setTimerMode(mode);
    
    if (mode === 'pomodoro') {
      initialTime.current = 25 * 60;
      setTimeLeft(25 * 60);
    } else if (mode === 'shortBreak') {
      initialTime.current = 5 * 60;
      setTimeLeft(5 * 60);
    } else if (mode === 'longBreak') {
      initialTime.current = 15 * 60;
      setTimeLeft(15 * 60);
    } else if (mode === 'stopwatch') {
      initialTime.current = 0;
      setTimeLeft(0);
    }
    
    setProgress(0);
  };
  
  // Start/pause timer
  const toggleTimer = () => {
    setIsActive(!isActive);
  };
  
  // Reset timer
  const resetTimer = () => {
    setIsActive(false);
    if (timerMode === 'stopwatch') {
      setTimeLeft(0);
    } else {
      setTimeLeft(initialTime.current);
    }
    setProgress(0);
  };
  
  // Format time
  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };
  
  // Handle task selection for focus
  const handleSelectTask = (taskId: string) => {
    setActiveTaskId(taskId);
  };
  
  // Handle session completion
  const handleSessionComplete = (taskId: string, minutes: number) => {
    // Log the time spent on the task
    logTimeSpent(taskId, minutes);
    
    // Reset the timer
    resetTimer();
    if (timerMode === 'pomodoro') {
      handleModeChange('shortBreak');
    }
  };
  
  // Navigate to Eisenhower Matrix
  const goToEisenhowerMatrix = () => {
    navigate('/eisenhower');
  };
  
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  // Timer effect
  useEffect(() => {
    if (isActive) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (timerMode === 'stopwatch') {
            // Stopwatch counts up
            const newTime = prev + 1;
            setProgress(0); // No progress bar for stopwatch
            return newTime;
          } else {
            // Pomodoro and breaks count down
            if (prev <= 1) {
              // Timer completed
              clearInterval(timerRef.current);
              setIsActive(false);
              
              // Calculate new progress
              setProgress(100);
              
              // Show notification
              if (showNotifications) {
                // This would be a browser notification in a real app
                console.log(`${timerMode === 'pomodoro' ? 'Work session' : 'Break'} completed!`);
              }
              
              // Log time if in pomodoro mode and a task is selected
              if (timerMode === 'pomodoro' && activeTaskId) {
                logTimeSpent(activeTaskId, 25); // Log 25 minutes
              }
              
              // Move to next session
              if (timerMode === 'pomodoro') {
                if (currentRound < totalRounds) {
                  setCurrentRound(currentRound + 1);
                  handleModeChange('shortBreak');
                } else {
                  handleModeChange('longBreak');
                  setCurrentRound(1);
                }
              } else {
                handleModeChange('pomodoro');
              }
              
              return 0;
            }
            
            // Update progress
            const newProgress = ((initialTime.current - prev + 1) / initialTime.current) * 100;
            setProgress(newProgress);
            
            return prev - 1;
          }
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, timerMode, currentRound, totalRounds, showNotifications, activeTaskId, logTimeSpent]);
  
  // Handle drag and drop for Eisenhower Matrix
  const handleDragStart = (quadrant, task) => {
    setDraggingTask({ quadrant, task });
  };
  
  const handleDragOver = (e) => {
    e.preventDefault();
  };
  
  const handleDrop = (targetQuadrant) => {
    if (draggingTask) {
      const { quadrant: sourceQuadrant, task } = draggingTask;
      
      if (sourceQuadrant !== targetQuadrant) {
        // Remove from source quadrant
        const updatedMatrix = { ...matrix };
        updatedMatrix[sourceQuadrant] = updatedMatrix[sourceQuadrant].filter(t => t.id !== task.id);
        
        // Add to target quadrant
        updatedMatrix[targetQuadrant] = [...updatedMatrix[targetQuadrant], task];
        
        setMatrix(updatedMatrix);
      }
      
      setDraggingTask(null);
    }
  };
  
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="pt-28 pb-20">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-2">Focus Mode</h1>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Enhance your productivity and concentration with our focused work sessions and task prioritization tools.
          </p>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Timer Section */}
            <div>
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center">
                    <Timer className="mr-2 h-5 w-5 text-flex-green" />
                    Focus Timer
                  </CardTitle>
                  <CardDescription>
                    Use the Pomodoro technique (25 min work, 5 min break) or a stopwatch for your focus sessions.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="pomodoro" className="w-full" onValueChange={handleModeChange}>
                    <TabsList className="grid grid-cols-3 mb-6">
                      <TabsTrigger value="pomodoro">Pomodoro</TabsTrigger>
                      <TabsTrigger value="shortBreak">Short Break</TabsTrigger>
                      <TabsTrigger value="stopwatch">Stopwatch</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="pomodoro" className="space-y-4">
                      <div className="flex flex-col items-center">
                        <div className="text-6xl font-bold text-flex-text mb-6">
                          {formatTime(timeLeft)}
                        </div>
                        
                        <Progress value={progress} className="w-full h-2 mb-8" />
                        
                        <div className="flex space-x-4">
                          <Button
                            onClick={toggleTimer}
                            className={isActive ? "bg-flex-orange" : "bg-flex-green"}
                          >
                            {isActive ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
                            {isActive ? "Pause" : "Start"}
                          </Button>
                          <Button variant="outline" onClick={resetTimer}>
                            <RotateCcw className="mr-2 h-4 w-4" />
                            Reset
                          </Button>
                        </div>
                        
                        <div className="mt-6 text-sm text-gray-500">
                          Round {currentRound} of {totalRounds}
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="shortBreak" className="space-y-4">
                      <div className="flex flex-col items-center">
                        <div className="text-6xl font-bold text-flex-yellow mb-6">
                          {formatTime(timeLeft)}
                        </div>
                        
                        <Progress value={progress} className="w-full h-2 mb-8 bg-gray-100">
                          <div 
                            className="h-full bg-flex-yellow" 
                            style={{ width: `${progress}%` }}
                          />
                        </Progress>
                        
                        <div className="flex space-x-4">
                          <Button
                            onClick={toggleTimer}
                            className={isActive ? "bg-flex-orange" : "bg-flex-yellow"}
                          >
                            {isActive ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
                            {isActive ? "Pause" : "Start"}
                          </Button>
                          <Button variant="outline" onClick={resetTimer}>
                            <RotateCcw className="mr-2 h-4 w-4" />
                            Reset
                          </Button>
                        </div>
                        
                        <div className="mt-6 text-sm text-gray-500">
                          Take a short break and relax
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="stopwatch" className="space-y-4">
                      <div className="flex flex-col items-center">
                        <div className="text-6xl font-bold text-flex-text mb-8">
                          {formatTime(timeLeft)}
                        </div>
                        
                        <div className="flex space-x-4">
                          <Button
                            onClick={toggleTimer}
                            className={isActive ? "bg-flex-orange" : "bg-flex-green"}
                          >
                            {isActive ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
                            {isActive ? "Pause" : "Start"}
                          </Button>
                          <Button variant="outline" onClick={resetTimer}>
                            <Square className="mr-2 h-4 w-4" />
                            Reset
                          </Button>
                        </div>
                        
                        <div className="mt-6 text-sm text-gray-500">
                          Stopwatch mode for custom timing
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <div className="flex items-center">
                    <div className="mr-2 text-sm">Notifications</div>
                    <Switch
                      checked={showNotifications}
                      onCheckedChange={setShowNotifications}
                    />
                  </div>
                  <Button variant="ghost" className="text-sm">
                    <Clock className="mr-2 h-4 w-4" />
                    Session History
                  </Button>
                </CardFooter>
              </Card>
              
              {/* Task Integration for Pomodoro */}
              <PomodoroTaskIntegration 
                onSelectTask={handleSelectTask}
                onSessionComplete={handleSessionComplete}
                activeTaskId={activeTaskId}
                sessionLength={getSessionLength()}
              />
              
              {/* Productivity Tips */}
              <Card className="mt-6 bg-gradient-to-r from-flex-green/5 to-flex-yellow/5 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg">Focus Tips</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 mr-2 text-flex-green mt-0.5" />
                      <span>Work in focused 25-minute sessions with short breaks in between.</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 mr-2 text-flex-green mt-0.5" />
                      <span>Eliminate distractions by silencing notifications and closing unnecessary tabs.</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 mr-2 text-flex-green mt-0.5" />
                      <span>Set clear goals for each focus session to maintain direction.</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
            
            {/* Eisenhower Matrix */}
            <div>
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="text-xl">Eisenhower Matrix</CardTitle>
                  <CardDescription>
                    Prioritize your tasks based on urgency and importance to maximize productivity.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    {/* Urgent & Important */}
                    <div 
                      className="border border-red-200 rounded-lg p-4 bg-red-50"
                      onDragOver={handleDragOver}
                      onDrop={() => handleDrop('urgentImportant')}
                    >
                      <div className="flex items-center mb-3">
                        <AlertTriangle className="h-4 w-4 text-red-500 mr-2" />
                        <h3 className="font-semibold text-red-700">Urgent & Important</h3>
                      </div>
                      <div className="space-y-2">
                        {matrix.urgentImportant.map(task => (
                          <div 
                            key={task.id}
                            className="bg-white p-3 rounded shadow-sm cursor-move"
                            draggable
                            onDragStart={() => handleDragStart('urgentImportant', task)}
                          >
                            <div className="font-medium text-sm">{task.title}</div>
                            <div className="text-xs text-gray-500">{task.description}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Not Urgent but Important */}
                    <div 
                      className="border border-blue-200 rounded-lg p-4 bg-blue-50"
                      onDragOver={handleDragOver}
                      onDrop={() => handleDrop('notUrgentImportant')}
                    >
                      <div className="flex items-center mb-3">
                        <ArrowRightCircle className="h-4 w-4 text-blue-500 mr-2" />
                        <h3 className="font-semibold text-blue-700">Important, Not Urgent</h3>
                      </div>
                      <div className="space-y-2">
                        {matrix.notUrgentImportant.map(task => (
                          <div 
                            key={task.id}
                            className="bg-white p-3 rounded shadow-sm cursor-move"
                            draggable
                            onDragStart={() => handleDragStart('notUrgentImportant', task)}
                          >
                            <div className="font-medium text-sm">{task.title}</div>
                            <div className="text-xs text-gray-500">{task.description}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Urgent but Not Important */}
                    <div 
                      className="border border-yellow-200 rounded-lg p-4 bg-yellow-50"
                      onDragOver={handleDragOver}
                      onDrop={() => handleDrop('urgentNotImportant')}
                    >
                      <div className="flex items-center mb-3">
                        <Clock className="h-4 w-4 text-yellow-500 mr-2" />
                        <h3 className="font-semibold text-yellow-700">Urgent, Not Important</h3>
                      </div>
                      <div className="space-y-2">
                        {matrix.urgentNotImportant.map(task => (
                          <div 
                            key={task.id}
                            className="bg-white p-3 rounded shadow-sm cursor-move"
                            draggable
                            onDragStart={() => handleDragStart('urgentNotImportant', task)}
                          >
                            <div className="font-medium text-sm">{task.title}</div>
                            <div className="text-xs text-gray-500">{task.description}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Not Urgent & Not Important */}
                    <div 
                      className="border border-gray-200 rounded-lg p-4 bg-gray-50"
                      onDragOver={handleDragOver}
                      onDrop={() => handleDrop('notUrgentNotImportant')}
                    >
                      <div className="flex items-center mb-3">
                        <Square className="h-4 w-4 text-gray-500 mr-2" />
                        <h3 className="font-semibold text-gray-700">Not Urgent, Not Important</h3>
                      </div>
                      <div className="space-y-2">
                        {matrix.notUrgentNotImportant.map(task => (
                          <div 
                            key={task.id}
                            className="bg-white p-3 rounded shadow-sm cursor-move"
                            draggable
                            onDragStart={() => handleDragStart('notUrgentNotImportant', task)}
                          >
                            <div className="font-medium text-sm">{task.title}</div>
                            <div className="text-xs text-gray-500">{task.description}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    variant="outline" 
                    className="w-full text-sm"
                    onClick={goToEisenhowerMatrix}
                  >
                    Go to Full Eisenhower Matrix
                  </Button>
                </CardFooter>
              </Card>
              
              {/* Help Section */}
              <Card className="mt-6 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg">How to Use the Eisenhower Matrix</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-start">
                      <div className="bg-red-100 text-red-700 w-6 h-6 rounded-full flex items-center justify-center mr-2 mt-0.5">1</div>
                      <span><strong>Do First:</strong> Important and urgent tasks require immediate attention.</span>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-blue-100 text-blue-700 w-6 h-6 rounded-full flex items-center justify-center mr-2 mt-0.5">2</div>
                      <span><strong>Schedule:</strong> Important but not urgent tasks need dedicated time blocks.</span>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-yellow-100 text-yellow-700 w-6 h-6 rounded-full flex items-center justify-center mr-2 mt-0.5">3</div>
                      <span><strong>Delegate:</strong> Urgent but not important tasks can be delegated when possible.</span>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-gray-100 text-gray-700 w-6 h-6 rounded-full flex items-center justify-center mr-2 mt-0.5">4</div>
                      <span><strong>Eliminate:</strong> Tasks that are neither important nor urgent should be minimized.</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Focus;
