
import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronRight, MoreVertical, Plus, Edit, Trash2, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Progress } from '@/components/ui/progress';
import { GoalNode as GoalNodeType } from '@/models/Goal';
import { cn } from '@/lib/utils';

interface GoalNodeProps {
  goal: GoalNodeType;
  onToggle: (goalId: string) => void;
  onEdit: (goalId: string) => void;
  onDelete: (goalId: string) => void;
  onAddSubgoal: (goalId: string) => void;
  expanded: boolean;
  depth: number;
}

const GoalNode: React.FC<GoalNodeProps> = ({
  goal,
  onToggle,
  onEdit,
  onDelete,
  onAddSubgoal,
  expanded,
  depth
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'in-progress': return 'bg-yellow-500';
      default: return 'bg-red-500';
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'completed': return 'default';
      case 'in-progress': return 'secondary';
      default: return 'outline';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: depth * 0.1 }}
      className={cn(
        'relative',
        depth > 0 && 'ml-6 mt-2'
      )}
    >
      <Card className={cn(
        'transition-all duration-200 hover:shadow-md',
        goal.completed && 'opacity-75',
        depth === 0 && 'border-2 border-primary/20'
      )}>
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3 flex-1">
              {/* Expand/Collapse Button */}
              {goal.children.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onToggle(goal.id)}
                  className="p-1 h-6 w-6"
                >
                  {expanded ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </Button>
              )}
              
              {/* Goal Icon */}
              <div className={cn(
                'p-2 rounded-full text-white',
                goal.color || 'bg-primary'
              )}>
                <Target className="h-4 w-4" />
              </div>
              
              {/* Goal Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-2">
                  <h3 className={cn(
                    'font-semibold',
                    goal.completed && 'line-through'
                  )}>
                    {goal.title}
                  </h3>
                  {goal.status && (
                    <Badge variant={getStatusBadgeVariant(goal.status)}>
                      {goal.status}
                    </Badge>
                  )}
                </div>
                
                {goal.description && (
                  <p className="text-sm text-gray-600 mb-2">{goal.description}</p>
                )}
                
                {/* Progress Bar */}
                <div className="mb-2">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-gray-500">Progress</span>
                    <span className="text-xs font-medium">{goal.progress}%</span>
                  </div>
                  <Progress value={goal.progress} className="h-2" />
                </div>
                
                {/* Deadline */}
                {goal.deadline && (
                  <p className="text-xs text-gray-500">
                    Due: {new Date(goal.deadline).toLocaleDateString()}
                  </p>
                )}
                
                {/* Children count */}
                {goal.children.length > 0 && (
                  <p className="text-xs text-gray-500 mt-1">
                    {goal.children.length} subgoal{goal.children.length !== 1 ? 's' : ''}
                  </p>
                )}
              </div>
            </div>
            
            {/* Actions Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="p-1 h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit(goal.id)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Goal
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onAddSubgoal(goal.id)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Subgoal
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => onDelete(goal.id)}
                  className="text-red-600"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Goal
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default GoalNode;
