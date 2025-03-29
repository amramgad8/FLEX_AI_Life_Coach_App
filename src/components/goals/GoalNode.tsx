
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { GoalNode as GoalNodeType } from '@/models/Goal';
import { Edit, Trash2, Plus, Link2 } from 'lucide-react';
import { format } from 'date-fns';
import GoalForm from './GoalForm';
import LinkTaskDialog from './LinkTaskDialog';
import LinkedTasks from './LinkedTasks';
import { useGoals } from '@/hooks/useGoals';

interface GoalNodeProps {
  goal: GoalNodeType;
  onEdit: (goal: GoalNodeType) => void;
  onDelete: (goalId: string) => void;
  onAddSubgoal: (parentId: string) => void;
}

const GoalNode = ({ goal, onEdit, onDelete, onAddSubgoal }: GoalNodeProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLinkingTask, setIsLinkingTask] = useState(false);
  const { updateGoal } = useGoals();
  
  const handleEdit = () => {
    setIsEditing(true);
  };
  
  const handleLinkTask = () => {
    setIsLinkingTask(true);
  };
  
  const handleTaskComplete = (taskId: string, completed: boolean) => {
    // This would need to be implemented in your tasks controller
    // For now, we'll focus on the UI components
  };
  
  const handleTaskRemove = (taskId: string) => {
    // Remove task link from goal
    if (goal.taskIds) {
      const updatedTaskIds = goal.taskIds.filter(id => id !== taskId);
      updateGoal(goal.id, { taskIds: updatedTaskIds });
    }
  };
  
  const goalColor = goal.color || '#3b82f6'; // Default to blue if no color provided
  
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="mb-4 overflow-hidden">
          <div 
            className="h-2" 
            style={{ backgroundColor: goalColor }}
          />
          <CardContent className="pt-4">
            <div className="flex justify-between mb-2">
              <h3 className="font-semibold text-lg">{goal.title}</h3>
              <div className="flex space-x-1">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={handleEdit}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => onDelete(goal.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {goal.description && (
              <p className="text-sm text-gray-600 mb-3">{goal.description}</p>
            )}
            
            {goal.deadline && (
              <div className="text-sm text-gray-600 mb-3">
                Deadline: {format(new Date(goal.deadline), 'PPP')}
              </div>
            )}
            
            <div className="mb-3">
              <div className="flex justify-between text-sm mb-1">
                <span>Progress</span>
                <span>{goal.progress}%</span>
              </div>
              <Progress value={goal.progress} className="h-2" />
            </div>
            
            {/* Task integration */}
            {goal.taskIds && goal.taskIds.length > 0 && (
              <LinkedTasks 
                taskIds={goal.taskIds} 
                onTaskComplete={handleTaskComplete}
                onTaskRemove={handleTaskRemove}
              />
            )}
            
            <div className="mt-4 flex space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => onAddSubgoal(goal.id)}
                className="text-xs"
              >
                <Plus className="h-3 w-3 mr-1" /> Add Subgoal
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleLinkTask}
                className="text-xs"
              >
                <Link2 className="h-3 w-3 mr-1" /> Link Task
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
      
      {isEditing && (
        <GoalForm
          isOpen={isEditing}
          onClose={() => setIsEditing(false)}
          onSave={(updatedGoal) => {
            onEdit({ ...goal, ...updatedGoal });
            setIsEditing(false);
          }}
          goal={goal}
        />
      )}
      
      {isLinkingTask && (
        <LinkTaskDialog
          isOpen={isLinkingTask}
          onClose={() => setIsLinkingTask(false)}
          goalId={goal.id}
        />
      )}
    </>
  );
};

export default GoalNode;