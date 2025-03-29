import React, { useState } from 'react';
import { useGoals } from '@/hooks/useGoals';
import { GoalNode } from '@/models/Goal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { PlusCircle, Edit2, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';

const BOARD_COLUMNS = ['Not Started', 'In Progress', 'Completed'];

const GoalBoard = () => {
  const { 
    goals, 
    rootGoals, 
    getGoalById, 
    updateGoal, 
    deleteGoal,
    getStatusColor
  } = useGoals();
  
  const [expandedGoals, setExpandedGoals] = useState<string[]>([]);
  
  // Local implementation of missing functions
  const getChildrenGoals = (parentId: string) => {
    const parent = goals[parentId];
    if (!parent) return [];
    return parent.children.map(childId => goals[childId]).filter(Boolean);
  };
  
  const getGoalStatus = (goalId: string) => {
    const goal = goals[goalId];
    if (!goal) return 'not-started';
    if (goal.completed) return 'completed';
    if (goal.progress > 0) return 'in-progress';
    return 'not-started';
  };
  
  const toggleGoalExpansion = (id: string) => {
    if (expandedGoals.includes(id)) {
      setExpandedGoals(expandedGoals.filter(goalId => goalId !== id));
    } else {
      setExpandedGoals([...expandedGoals, id]);
    }
  };
  
  const renderGoalCard = (goal: GoalNode, isSubgoal: boolean = false) => {
    const status = getGoalStatus(goal.id);
    const isExpanded = expandedGoals.includes(goal.id);
    const childGoals = getChildrenGoals(goal.id);
    
    return (
      <motion.div
        key={goal.id}
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className={`mb-4 ${isSubgoal ? 'ml-6' : ''}`}
      >
        <Card className="border-l-4" style={{ borderLeftColor: getStatusColor(status) }}>
          <CardHeader className="pb-2 flex flex-row items-start justify-between">
            <div>
              <CardTitle className="flex items-center">
                <span className="mr-2">{goal.icon}</span>
                {goal.title}
              </CardTitle>
              {goal.deadline && (
                <div className="text-sm text-muted-foreground">
                  Due: {format(new Date(goal.deadline), 'MMM d, yyyy')}
                </div>
              )}
            </div>
            <div className="flex space-x-2">
              <Button variant="ghost" size="icon" onClick={() => {}}>
                <Edit2 className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => deleteGoal(goal.id)}
                className="text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {goal.description && (
              <p className="text-muted-foreground text-sm mb-3">{goal.description}</p>
            )}
            
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm">Progress</span>
              <span className="text-sm font-medium">{goal.progress}%</span>
            </div>
            <Progress value={goal.progress} className="mb-4" />
            
            {goal.children.length > 0 && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => toggleGoalExpansion(goal.id)}
                className="mt-2"
              >
                {isExpanded ? "Hide Subgoals" : `Show Subgoals (${goal.children.length})`}
              </Button>
            )}
          </CardContent>
        </Card>
        
        {isExpanded && childGoals.map(childGoal => renderGoalCard(childGoal, true))}
      </motion.div>
    );
  };

  const getGoalsByStatus = (status: string) => {
    return Object.values(goals).filter(goal => {
      const goalStatus = getGoalStatus(goal.id);
      
      if (status === 'Not Started' && goalStatus === 'not-started') return true;
      if (status === 'In Progress' && goalStatus === 'in-progress') return true;
      if (status === 'Completed' && goalStatus === 'completed') return true;
      
      return false;
    });
  };

  return (
    <div className="p-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {BOARD_COLUMNS.map(column => (
          <div key={column} className="bg-card p-4 rounded-lg">
            <h3 className="font-semibold mb-4">{column}</h3>
            {getGoalsByStatus(column).map(goal => renderGoalCard(goal))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default GoalBoard;