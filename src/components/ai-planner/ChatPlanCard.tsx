import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, PlusCircle, Edit2, ChevronDown, ChevronUp } from 'lucide-react';
import { motion } from 'framer-motion';

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

function normalizePlan(plan: any): Plan {
  if (!plan || !plan.weekly_phases) return plan;
  return {
    ...plan,
    weekly_phases: plan.weekly_phases.map((phase: any) => ({
      ...phase,
      tasks: (phase.tasks || []).map((t: any) =>
        typeof t === 'string' ? { title: t } : t
      ),
    })),
  };
}

interface ChatPlanCardProps {
  plan: Plan;
  onAddTask: (task: Task) => void;
  onAddAllTasks: (phase: WeeklyPhase) => void;
  onModifyPlan: () => void;
  onSavePlan?: (plan: Plan) => void;
  expandable?: boolean;
}

const ChatPlanCard: React.FC<ChatPlanCardProps> = ({
  plan,
  onAddTask,
  onAddAllTasks,
  onModifyPlan,
  onSavePlan,
  expandable = false,
}) => {
  const normalizedPlan = normalizePlan(plan);
  const [expanded, setExpanded] = useState(!expandable);
  const [showHeader, setShowHeader] = useState(false);
  const [showPhases, setShowPhases] = useState(false);
  const [showTasks, setShowTasks] = useState<number>(-1); // index of phase whose tasks are shown
  const [editing, setEditing] = useState(false);
  const [editPlan, setEditPlan] = useState<Plan>(normalizedPlan);
  // Per-phase expand/collapse state
  const [phaseExpanded, setPhaseExpanded] = useState<{[idx: number]: boolean}>(() => {
    // Only the first phase expanded by default
    const state: {[idx: number]: boolean} = {};
    (normalizedPlan.weekly_phases || []).forEach((_, idx) => { state[idx] = idx === 0; });
    return state;
  });

  // Streaming effect: reveal header, then phases, then tasks
  React.useEffect(() => {
    if (expanded) {
      setShowHeader(false);
      setShowPhases(false);
      setShowTasks(-1);
      setTimeout(() => setShowHeader(true), 300);
      setTimeout(() => setShowPhases(true), 700);
      setTimeout(() => setShowTasks(0), 1100);
    }
  }, [expanded, plan]);

  // Inline editing handlers
  const handleHeaderChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditPlan({ ...editPlan, header_note: e.target.value });
  };
  const handlePhaseMilestoneChange = (idx: number, value: string) => {
    const newPhases = editPlan.weekly_phases.map((p, i) => i === idx ? { ...p, milestone: value } : p);
    setEditPlan({ ...editPlan, weekly_phases: newPhases });
  };
  const handleTaskChange = (pIdx: number, tIdx: number, value: string) => {
    const newPhases = editPlan.weekly_phases.map((p, i) =>
      i === pIdx ? { ...p, tasks: p.tasks.map((t, j) => j === tIdx ? { ...t, title: value } : t) } : p
    );
    setEditPlan({ ...editPlan, weekly_phases: newPhases });
  };
  const handleSave = () => {
    setEditing(false);
    if (onSavePlan) onSavePlan(editPlan);
  };
  const handleEdit = () => {
    setEditing(true);
    setEditPlan(normalizedPlan);
  };

  const togglePhase = (idx: number) => {
    setPhaseExpanded(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-2xl mx-auto font-sans"
    >
      <Card className="p-6 bg-white shadow-lg">
        {/* Goal and Expand/Collapse Button */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Goal</h2>
            <p className="text-gray-600">{normalizedPlan.goal}</p>
          </div>
          {expandable && (
            <button
              className="ml-2 p-2 rounded hover:bg-gray-100"
              onClick={() => setExpanded((prev) => !prev)}
              aria-label={expanded ? 'Collapse plan' : 'Expand plan'}
            >
              {expanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
            </button>
          )}
        </div>
        {/* Collapsed: Only show goal */}
        {!expanded ? null : (
          <>
            {/* Header Note */}
            {showHeader && (
              <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100 animate-fade-in">
                <h3 className="text-lg font-semibold text-blue-800 mb-2">Strategy & Tips</h3>
                {editing ? (
                  <textarea
                    className="w-full p-2 rounded border text-blue-700 font-sans"
                    value={editPlan.header_note}
                    onChange={handleHeaderChange}
                  />
                ) : (
                  <p className="text-blue-700 font-sans">{normalizedPlan.header_note}</p>
                )}
              </div>
            )}
            {/* Weekly Phases */}
            {showPhases && (normalizedPlan.weekly_phases || []).map((phase, pIdx) => (
              <motion.div
                key={pIdx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 * pIdx }}
                className="border rounded-lg p-4 bg-gray-50 mb-4 animate-fade-in"
              >
                <div className="flex items-center gap-2">
                  <button
                    className="p-1 rounded hover:bg-gray-200"
                    onClick={() => togglePhase(pIdx)}
                    aria-label={phaseExpanded[pIdx] ? 'Collapse week' : 'Expand week'}
                  >
                    {phaseExpanded[pIdx] ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                  </button>
                  <span className="text-sm text-gray-500">Week {phase.week}</span>
                  {editing ? (
                    <input
                      className="text-lg font-semibold text-gray-800 bg-white border rounded p-1 font-sans"
                      value={editPlan.weekly_phases[pIdx].milestone}
                      onChange={e => handlePhaseMilestoneChange(pIdx, e.target.value)}
                    />
                  ) : (
                    <h3 className="text-lg font-semibold text-gray-800 font-sans">{phase.milestone}</h3>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onAddAllTasks(phase)}
                  className="text-flex-green hover:text-flex-green-dark"
                >
                  <PlusCircle className="h-4 w-4 mr-1" />
                  Add All Tasks
                </Button>
                <div className="space-y-2">
                  {(phase.tasks || []).map((task, tIdx) => (
                    <motion.div
                      key={tIdx}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * tIdx }}
                      className="flex items-center justify-between p-2 bg-white rounded border animate-fade-in"
                    >
                      {editing ? (
                        <input
                          className="text-gray-700 bg-white border rounded p-1 font-sans"
                          value={editPlan.weekly_phases[pIdx].tasks[tIdx].title}
                          onChange={e => handleTaskChange(pIdx, tIdx, e.target.value)}
                        />
                      ) : (
                        <span className="text-gray-700 font-sans">{task.title}</span>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onAddTask(task)}
                        className="text-flex-green hover:text-flex-green-dark"
                      >
                        <PlusCircle className="h-4 w-4" />
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
            {/* Modify/Save Plan Buttons */}
            <div className="mt-6 flex justify-end gap-2">
              {editing ? (
                <Button
                  onClick={handleSave}
                  className="bg-flex-green text-white hover:bg-flex-green-dark font-sans"
                >
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Save Plan
                </Button>
              ) : (
                <>
                  <Button
                    onClick={handleEdit}
                    variant="outline"
                    className="text-flex-green border-flex-green hover:bg-flex-green hover:text-white font-sans"
                  >
                    <Edit2 className="h-4 w-4 mr-2" />
                    Modify Plan
                  </Button>
                  <Button
                    onClick={() => onSavePlan && onSavePlan(normalizedPlan)}
                    className="bg-flex-green text-white hover:bg-flex-green-dark font-sans"
                  >
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Save Plan
                  </Button>
                </>
              )}
            </div>
          </>
        )}
      </Card>
    </motion.div>
  );
};

export default ChatPlanCard; 