
import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GoalNode as GoalNodeType } from '@/models/Goal';
import { useGoals } from '@/hooks/useGoals';
import GoalNode from './GoalNode';
import GoalForm from './GoalForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, ZoomIn, ZoomOut, Target } from 'lucide-react';
import LinkTaskDialog from './LinkTaskDialog';      

interface GoalMindMapProps {}

const GoalMindMap = ({}: GoalMindMapProps) => {
  const { 
    goals, 
    rootGoals, 
    isLoading,
    createGoal,
    updateGoal,
    deleteGoal
  } = useGoals();
  
  const [expandedGoals, setExpandedGoals] = useState<Record<string, boolean>>({});
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<GoalNodeType | null>(null);
  const [parentGoal, setParentGoal] = useState<GoalNodeType | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isLinkingTask, setIsLinkingTask] = useState(false);
  const [selectedGoalForTask, setSelectedGoalForTask] = useState<string | null>(null);
  
  // Handle toggling expansion of a goal node
  const toggleExpand = useCallback((goalId: string) => {
    setExpandedGoals(prev => ({
      ...prev,
      [goalId]: !prev[goalId]
    }));
  }, []);
  
  // Open the form to create a new goal
  const handleAddGoal = useCallback(() => {
    setEditingGoal(null);
    setParentGoal(null);
    setIsFormOpen(true);
  }, []);
  
  // Open the form to add a subgoal
  const handleAddSubgoal = useCallback((parentId: string) => {
    setEditingGoal(null);
    setParentGoal(goals[parentId]);
    setIsFormOpen(true);
    // Auto-expand the parent when adding a subgoal
    setExpandedGoals(prev => ({
      ...prev,
      [parentId]: true
    }));
  }, [goals]);
  
  // Open the form to edit a goal
  const handleEditGoal = useCallback((goalId: string) => {
    setEditingGoal(goals[goalId]);
    setParentGoal(null);
    setIsFormOpen(true);
  }, [goals]);
  
  // Handle goal deletion
  const handleDeleteGoal = useCallback((goalId: string) => {
    if (window.confirm('Are you sure you want to delete this goal? This will also delete all subgoals.')) {
      deleteGoal(goalId);
    }
  }, [deleteGoal]);
  
  // Handle saving a goal (create or update)
  const handleSaveGoal = useCallback((goalData: Partial<GoalNodeType>) => {
    if (editingGoal) {
      updateGoal(editingGoal.id, goalData);
    } else if (parentGoal) {
      createGoal(goalData, parentGoal.id);
    } else {
      createGoal(goalData);
    }
  }, [editingGoal, parentGoal, createGoal, updateGoal]);
  
  // Handle zooming in and out
  const handleZoomIn = useCallback(() => {
    setZoomLevel(prev => Math.min(prev + 0.1, 1.5));
  }, []);
  
  const handleZoomOut = useCallback(() => {
    setZoomLevel(prev => Math.max(prev - 0.1, 0.5));
  }, []);
  
  // Open the dialog to link a task to a goal
  const handleLinkTask = useCallback((goalId: string) => {
    setSelectedGoalForTask(goalId);
    setIsLinkingTask(true);
  }, []);
  
  // Recursive function to render goal tree
  const renderGoalTree = useCallback((goalId: string, depth = 0) => {
    const goal = goals[goalId];
    if (!goal) return null;
    
    const isExpanded = expandedGoals[goalId];
    
    return (
      <div key={goalId}>
        <GoalNode
          goal={goal}
          onToggle={toggleExpand}
          onEdit={handleEditGoal}
          onDelete={handleDeleteGoal}
          onAddSubgoal={handleAddSubgoal}
          expanded={isExpanded}
          depth={depth}
        />
        
        {isExpanded && goal.children.length > 0 && (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="ml-6 pl-6 border-l border-dashed border-gray-200"
            >
              {goal.children.map(childId => renderGoalTree(childId, depth + 1))}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    );
  }, [goals, expandedGoals, toggleExpand, handleEditGoal, handleDeleteGoal, handleAddSubgoal]);
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  return (
    <div className="relative">
      {/* Header with controls */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Target className="mr-2 text-primary" />
          <h2 className="text-2xl font-bold">Goal Mind Map</h2>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="icon"
            onClick={handleZoomOut}
            disabled={zoomLevel <= 0.5}
          >
            <ZoomOut size={16} />
          </Button>
          <span className="mx-1 text-sm">{Math.round(zoomLevel * 100)}%</span>
          <Button 
            variant="outline" 
            size="icon"
            onClick={handleZoomIn}
            disabled={zoomLevel >= 1.5}
          >
            <ZoomIn size={16} />
          </Button>
          <Button onClick={handleAddGoal} className="ml-2">
            <Plus size={16} className="mr-1" />
            Add Goal
          </Button>
        </div>
      </div>
      
      {/* Goal tree visualization */}
      <motion.div 
        className="space-y-4"
        style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'top left' }}
      >
        {rootGoals.length > 0 ? (
          rootGoals.map(goalId => renderGoalTree(goalId))
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Target size={48} className="text-gray-300 mb-4" />
              <p className="text-lg text-gray-500 mb-4">You haven't created any goals yet.</p>
              <Button onClick={handleAddGoal}>
                <Plus size={16} className="mr-1" />
                Create Your First Goal
              </Button>
            </CardContent>
          </Card>
        )}
      </motion.div>
      
      {/* Goal form dialog */}
      <GoalForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSaveGoal}
        editGoal={editingGoal}
        parentGoal={parentGoal}
      />
      
      {/* Task linking dialog */}
      {selectedGoalForTask && (
        <LinkTaskDialog
          isOpen={isLinkingTask}
          onClose={() => setIsLinkingTask(false)}
          goalId={selectedGoalForTask}
        />
      )}
    </div>
  );
};

export default GoalMindMap;