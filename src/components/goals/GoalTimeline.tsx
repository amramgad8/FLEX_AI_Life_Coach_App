import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { GoalNode } from '@/models/Goal';
import { useGoals } from '@/hooks/useGoals';
import { useTasks } from '@/hooks/useTasks';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit2, Trash2, Plus, Target, CheckSquare } from 'lucide-react';
import { format } from 'date-fns';
import { Checkbox } from '@/components/ui/checkbox';

interface GoalTimelineProps {
  onEdit: (goal: GoalNode) => void;
  onDelete: (goalId: string) => void;
  onAddSubgoal: (parentId: string) => void;
}

const GoalTimeline: React.FC<GoalTimelineProps> = ({ onEdit, onDelete, onAddSubgoal }) => {
  const navigate = useNavigate();
  const { rootGoals, getGoalById, getGoalProgress } = useGoals();
  const { getTaskById, updateTaskStatus } = useTasks();

  const handleTaskClick = (taskId: string) => {
    navigate(`/tasks?task=${taskId}`);
  };

  const handleTaskStatusChange = async (taskId: string, checked: boolean) => {
    try {
      await updateTaskStatus(taskId, checked ? 'completed' : 'not-started');
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  const renderSubgoals = (goalId: string, depth: number = 0) => {
    const goal = getGoalById(goalId);
    if (!goal) return null;

    const progress = getGoalProgress(goalId);
    const status = goal.status || 'not-started';

    return (
      <div key={goalId} className="relative">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="relative"
        >
          <Card className="mb-4">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <Target className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-grow">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">{goal.title}</h3>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onAddSubgoal(goal.id)}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(goal)}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(goal.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  {goal.description && (
                    <p className="text-sm text-gray-600 mb-3">{goal.description}</p>
                  )}
                  
                  <div className="space-y-2 mb-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Progress</span>
                      <span className="text-sm font-medium">{progress?.percentComplete || 0}%</span>
                    </div>
                    <Progress value={progress?.percentComplete || 0} className="h-2" />
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="outline" className="capitalize">
                      {status.replace('-', ' ')}
                    </Badge>
                    {goal.deadline && (
                      <Badge variant="outline">
                        Due {format(new Date(goal.deadline), 'MMM d')}
                      </Badge>
                    )}
                  </div>

                  {goal.taskIds && goal.taskIds.length > 0 && (
                    <div className="mb-3">
                      <h4 className="text-sm font-medium mb-2">Linked Tasks</h4>
                      <div className="space-y-2">
                        {goal.taskIds.map(taskId => {
                          const task = getTaskById(taskId);
                          if (!task) return null;
                          return (
                            <div
                              key={taskId}
                              className="flex items-center gap-2 p-2 text-sm hover:bg-gray-50 rounded-md transition-colors"
                            >
                              <Checkbox
                                checked={task.status === 'completed'}
                                onCheckedChange={(checked) => handleTaskStatusChange(taskId, checked as boolean)}
                                className="h-4 w-4"
                              />
                              <button
                                onClick={() => handleTaskClick(taskId)}
                                className="flex-1 text-left truncate"
                              >
                                <span className={task.status === 'completed' ? 'line-through text-gray-500' : ''}>
                                  {task.title}
                                </span>
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {goal.children && goal.children.length > 0 && (
            <div className="ml-8 pl-4 border-l-2 border-gray-200">
              {goal.children.map(childId => renderSubgoals(childId, depth + 1))}
            </div>
          )}
        </motion.div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {rootGoals.map(id => renderSubgoals(id))}
    </div>
  );
};

export default GoalTimeline; 