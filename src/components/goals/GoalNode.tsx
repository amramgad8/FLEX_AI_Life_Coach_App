import { useState } from 'react';
import { motion } from 'framer-motion';
import { GoalNode as GoalNodeType } from '@/models/Goal';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { 
  CalendarClock,
  Check,
  ChevronDown,
  ChevronRight,
  Edit,
  Plus,
  Trash2
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface GoalNodeProps {
  goal: GoalNodeType;
  onToggle: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onAddSubgoal: (parentId: string) => void;
  expanded: boolean;
  depth: number;
}

const GoalNode = ({
  goal,
  onToggle,
  onEdit,
  onDelete,
  onAddSubgoal,
  expanded,
  depth = 0
}: GoalNodeProps) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // Determine the status color
  const getStatusColor = () => {
    if (goal.completed) return '#4CAF50'; // Green
    if (goal.progress > 0) return '#FFC107'; // Yellow
    return '#F44336'; // Red
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.3 }}
      className="relative mb-2"
      style={{ marginLeft: `${depth * 20}px` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card 
        className="w-full overflow-hidden border-l-4 hover:shadow-md transition-shadow duration-200"
        style={{ borderLeftColor: goal.color || getStatusColor() }}
      >
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {goal.children.length > 0 && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="mr-1 h-7 w-7"
                  onClick={() => onToggle(goal.id)}
                >
                  {expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </Button>
              )}
              <span className="text-lg mr-2">{goal.icon}</span>
              <div className="flex flex-col">
                <div className="flex items-center">
                  <h3 className="font-semibold text-gray-800 flex items-center">
                    {goal.title}
                    {goal.completed && (
                      <Check className="ml-2 text-green-500" size={16} />
                    )}
                  </h3>
                </div>
                {goal.description && (
                  <p className="text-sm text-gray-500 line-clamp-1">{goal.description}</p>
                )}
              </div>
            </div>
            
            <div className="flex items-center">
              {goal.deadline && (
                <div className="flex items-center mr-3 text-sm text-gray-500">
                  <CalendarClock size={14} className="mr-1" />
                  {formatDistanceToNow(new Date(goal.deadline), { addSuffix: true })}
                </div>
              )}
              
              {/* Control buttons shown on hover */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: isHovered ? 1 : 0 }}
                className="flex items-center space-x-1"
              >
                <Button 
                  size="icon" 
                  variant="ghost" 
                  className="h-7 w-7"
                  onClick={() => onEdit(goal.id)}
                >
                  <Edit size={14} />
                </Button>
                <Button 
                  size="icon" 
                  variant="ghost" 
                  className="h-7 w-7"
                  onClick={() => onAddSubgoal(goal.id)}
                >
                  <Plus size={14} />
                </Button>
                <Button 
                  size="icon" 
                  variant="ghost" 
                  className="h-7 w-7 text-red-500 hover:text-red-700 hover:bg-red-50"
                  onClick={() => onDelete(goal.id)}
                >
                  <Trash2 size={14} />
                </Button>
              </motion.div>
            </div>
          </div>
          
          <div className="mt-3">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-gray-500">Progress</span>
              <span className="text-xs font-medium">{goal.progress}%</span>
            </div>
            <Progress value={goal.progress} className="h-2" />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default GoalNode;