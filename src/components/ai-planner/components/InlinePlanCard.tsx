import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, PlusCircle, Sparkles, Target, Calendar, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import TypewriterText from '../TypewriterText';

interface Task {
  title: string;
  completed?: boolean;
}

interface WeeklyPhase {
  week: number;
  milestone: string;
  tasks: Task[];
}

interface Plan {
  header_note: string;
  goal: string;
  weekly_phases: WeeklyPhase[];
}

interface InlinePlanCardProps {
  plan: Plan;
  onAddTask: (task: Task) => void;
  onAddAllTasks: (phase: WeeklyPhase) => void;
  onModifyPlan: () => void;
  onSavePlan?: (plan: Plan) => void;
}

const InlinePlanCard: React.FC<InlinePlanCardProps> = ({
  plan,
  onAddTask,
  onAddAllTasks,
  onModifyPlan,
  onSavePlan
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showGoal, setShowGoal] = useState(false);
  const [showStrategy, setShowStrategy] = useState(false);
  const [showPhases, setShowPhases] = useState(false);
  const [currentPhase, setCurrentPhase] = useState(0);
  const [expandedPhases, setExpandedPhases] = useState<{[key: number]: boolean}>({});

  // Step-by-step reveal animation
  useEffect(() => {
    const timer1 = setTimeout(() => setShowGoal(true), 500);
    const timer2 = setTimeout(() => setShowStrategy(true), 1500);
    const timer3 = setTimeout(() => setShowPhases(true), 2500);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  // Reveal phases one by one
  useEffect(() => {
    if (showPhases && currentPhase < plan.weekly_phases.length) {
      const timer = setTimeout(() => {
        setExpandedPhases(prev => ({ ...prev, [currentPhase]: true }));
        setCurrentPhase(prev => prev + 1);
      }, 800 * currentPhase + 1000);
      
      return () => clearTimeout(timer);
    }
  }, [showPhases, currentPhase, plan.weekly_phases.length]);

  const togglePhase = (index: number) => {
    setExpandedPhases(prev => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6 font-sans">
      {/* Goal Section */}
      <AnimatePresence>
        {showGoal && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-100 rounded-full">
                  <Target className="h-5 w-5 text-blue-600" />
                </div>
                <h2 className="text-xl font-bold text-blue-800">🎯 Your Goal</h2>
              </div>
              <div className="text-blue-700 text-lg leading-relaxed font-medium pl-2">
                <TypewriterText text={plan.goal} speed={30} />
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Strategy Section */}
      <AnimatePresence>
        {showStrategy && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <Card className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-green-100 rounded-full">
                  <Sparkles className="h-5 w-5 text-green-600" />
                </div>
                <h2 className="text-xl font-bold text-green-800">💡 Strategy & Tips</h2>
              </div>
              <div className="text-green-700 text-base leading-relaxed pl-2">
                <TypewriterText text={plan.header_note} speed={25} />
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Weekly Phases */}
      <AnimatePresence>
        {showPhases && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-5"
          >
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">📅 Weekly Action Plan</h2>
              <div className="w-16 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
            </div>
            
            {plan.weekly_phases.map((phase, index) => (
              <AnimatePresence key={index}>
                {expandedPhases[index] && (
                  <motion.div
                    initial={{ opacity: 0, y: 30, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ 
                      duration: 0.6, 
                      ease: "easeOut",
                      delay: 0.1 * index 
                    }}
                  >
                    <Card className="overflow-hidden border-l-4 border-l-purple-400 bg-gradient-to-r from-purple-50 to-pink-50 shadow-md">
                      <div className="p-6">
                        {/* Phase Header - Enhanced with larger, bold text */}
                        <div className="flex items-center justify-between mb-6">
                          <div className="flex items-start gap-4">
                            <div className="p-3 bg-purple-100 rounded-full">
                              <Calendar className="h-5 w-5 text-purple-600" />
                            </div>
                            <div>
                              <span className="text-sm text-purple-600 font-semibold uppercase tracking-wide">
                                Week {phase.week}
                              </span>
                              <h3 className="text-2xl font-bold text-purple-800 mt-1 leading-tight">
                                {phase.milestone}
                              </h3>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onAddAllTasks(phase)}
                            className="text-purple-600 hover:text-purple-700 hover:bg-purple-100 border border-purple-200"
                          >
                            <PlusCircle className="h-4 w-4 mr-1" />
                            Add All
                          </Button>
                        </div>

                        {/* Tasks with enhanced bullet points and spacing */}
                        <div className="pl-4">
                          <h4 className="text-lg font-semibold text-purple-700 mb-4 flex items-center gap-2">
                            <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                            Tasks to Complete:
                          </h4>
                          <div className="space-y-3">
                            {phase.tasks.map((task, taskIndex) => (
                              <motion.div
                                key={taskIndex}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ 
                                  delay: 0.8 + (taskIndex * 0.1),
                                  duration: 0.4 
                                }}
                                className="flex items-start gap-3 p-4 bg-white rounded-lg border border-purple-100 hover:border-purple-200 transition-all duration-200 hover:shadow-sm"
                              >
                                {/* Bullet point */}
                                <div className="flex-shrink-0 mt-2">
                                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                                </div>
                                <span className="text-gray-700 flex-1 text-base leading-relaxed">
                                  {task.title}
                                </span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => onAddTask(task)}
                                  className="text-purple-600 hover:text-purple-700 hover:bg-purple-50 opacity-70 hover:opacity-100 transition-opacity"
                                >
                                  <PlusCircle className="h-4 w-4" />
                                </Button>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action Buttons */}
      <AnimatePresence>
        {showPhases && currentPhase >= plan.weekly_phases.length && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="flex justify-center gap-4 pt-6 border-t border-gray-200"
          >
            <Button
              onClick={onModifyPlan}
              variant="outline"
              className="border-purple-300 text-purple-700 hover:bg-purple-50 px-6 py-2 font-medium"
            >
              Modify Plan
            </Button>
            <Button
              onClick={() => onSavePlan?.(plan)}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 font-medium shadow-md hover:shadow-lg transition-shadow"
            >
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Save Plan
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default InlinePlanCard;
