import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { GoalNode } from '@/models/Goal';
import { useGoals } from '@/hooks/useGoals';
import { useTasks } from '@/hooks/useTasks';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit2, Trash2, Plus, Target, CheckSquare } from 'lucide-react';
import { format } from 'date-fns';
import { Checkbox } from '@/components/ui/checkbox';

interface GoalBoardProps {
  onEdit: (goal: GoalNode) => void;
  onDelete: (goalId: string) => void;
  onAddSubgoal: (parentId: string) => void;
}

const GoalBoard: React.FC<GoalBoardProps> = ({ onEdit, onDelete, onAddSubgoal }) => {
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {rootGoals.map(id => {
        const goal = getGoalById(id);
        if (!goal) return null;

        const progress = getGoalProgress(id);
        const status = goal.status || 'not-started';

        return (
          <motion.div
            key={goal.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="h-full">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  {goal.title}
                </CardTitle>
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
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {goal.description && (
                    <p className="text-sm text-gray-600">{goal.description}</p>
                  )}
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Progress</span>
                      <span className="text-sm font-medium">{progress?.percentComplete || 0}%</span>
                    </div>
                    <Progress value={progress?.percentComplete || 0} className="h-2" />
                  </div>

                  <div className="flex items-center gap-2">
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
                    <div className="pt-2 border-t">
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

                  {goal.children && goal.children.length > 0 && (
                    <div className="pt-2 border-t">
                      <p className="text-sm text-gray-500">
                        {progress?.completedSubtasks || 0} of {progress?.totalSubtasks || 0} subtasks completed
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
};

export default GoalBoard; 