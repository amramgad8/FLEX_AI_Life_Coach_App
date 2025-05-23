
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
    <div className="w-full max-w-2xl mx-auto space-y-4 font-sans">
      {/* Goal Section */}
      <AnimatePresence>
        {showGoal && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-blue-100 rounded-full">
                  <Target className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="text-lg font-bold text-blue-800">Your Goal</h3>
              </div>
              <div className="text-blue-700 text-base leading-relaxed">
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
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-green-100 rounded-full">
                  <Sparkles className="h-5 w-5 text-green-600" />
                </div>
                <h3 className="text-lg font-bold text-green-800">Strategy & Tips</h3>
              </div>
              <div className="text-green-700 text-base leading-relaxed">
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
            className="space-y-3"
          >
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
                    <Card className="overflow-hidden border-l-4 border-l-purple-400 bg-gradient-to-r from-purple-50 to-pink-50">
                      <div className="p-5">
                        {/* Phase Header */}
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-100 rounded-full">
                              <Calendar className="h-4 w-4 text-purple-600" />
                            </div>
                            <div>
                              <span className="text-sm text-purple-600 font-medium">
                                Week {phase.week}
                              </span>
                              <h4 className="text-lg font-bold text-purple-800">
                                {phase.milestone}
                              </h4>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onAddAllTasks(phase)}
                            className="text-purple-600 hover:text-purple-700 hover:bg-purple-100"
                          >
                            <PlusCircle className="h-4 w-4 mr-1" />
                            Add All
                          </Button>
                        </div>

                        {/* Tasks */}
                        <div className="space-y-2">
                          {phase.tasks.map((task, taskIndex) => (
                            <motion.div
                              key={taskIndex}
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ 
                                delay: 0.8 + (taskIndex * 0.1),
                                duration: 0.4 
                              }}
                              className="flex items-center justify-between p-3 bg-white rounded-lg border border-purple-100 hover:border-purple-200 transition-colors"
                            >
                              <span className="text-gray-700 flex-1">
                                {task.title}
                              </span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onAddTask(task)}
                                className="text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                              >
                                <PlusCircle className="h-4 w-4" />
                              </Button>
                            </motion.div>
                          ))}
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
            className="flex justify-center gap-3 pt-4"
          >
            <Button
              onClick={onModifyPlan}
              variant="outline"
              className="border-purple-300 text-purple-700 hover:bg-purple-50"
            >
              Modify Plan
            </Button>
            <Button
              onClick={() => onSavePlan?.(plan)}
              className="bg-purple-600 hover:bg-purple-700 text-white"
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
