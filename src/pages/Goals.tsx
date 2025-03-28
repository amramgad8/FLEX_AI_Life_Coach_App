import { useState } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Plus, Map, LayoutGrid, Calendar } from 'lucide-react';
import { useGoals } from '@/hooks/useGoals';
import { GoalNode } from '@/models/Goal';
import GoalForm from '@/components/goals/GoalForm';
import GoalMindMap from '@/components/goals/GoalMindMap';
import GoalSummary from '@/components/goals/GoalSummary';
import GoalBoard from '@/components/goals/GoalBoard';
import GoalTimeline from '@/components/goals/GoalTimeline';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import Navbar from '@/components/Navbar';
import ChatbotAssistant from '@/components/chatbot/ChatbotAssistant';

const Goals = () => {
  const [activeTab, setActiveTab] = useState('mindmap');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<GoalNode | null>(null);
  const [parentGoalId, setParentGoalId] = useState<string | null>(null);
  const { createGoal, updateGoal, deleteGoal, getGoalById } = useGoals();
  const { toast } = useToast();

  const handleCreateGoal = async (data: any) => {
    try {
      await createGoal(data, parentGoalId);
      setIsFormOpen(false);
      setParentGoalId(null);
      toast({
        title: 'Goal created',
        description: 'Your new goal has been created successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create goal. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleEditGoal = async (data: any) => {
    if (!editingGoal) return;
    
    try {
      await updateGoal(editingGoal.id, data);
      setEditingGoal(null);
      toast({
        title: 'Goal updated',
        description: 'Your goal has been updated successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update goal. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteGoal = async (goalId: string) => {
    try {
      await deleteGoal(goalId);
      toast({
        title: 'Goal deleted',
        description: 'Your goal has been deleted successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete goal. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleAddSubgoal = (parentId: string) => {
    setParentGoalId(parentId);
    setIsFormOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-blue-50">
      <Navbar />
      <div className="container mx-auto py-28 px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6 flex justify-between items-center"
        >
          <div>
            <h1 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
              Goals Dashboard
            </h1>
            <p className="text-gray-600">
              Set your main goals, break them down into achievable tasks, and track your progress
            </p>
          </div>
          <Button onClick={() => setIsFormOpen(true)} className="bg-gradient-to-r from-blue-500 to-purple-600">
            <Plus className="w-4 h-4 mr-2" />
            New Goal
          </Button>
        </motion.div>
        
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:w-3/4">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Tabs 
                defaultValue="mindmap" 
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="mb-6">
                  <TabsTrigger value="mindmap">
                    <Map className="w-4 h-4 mr-2" />
                    Mind Map
                  </TabsTrigger>
                  <TabsTrigger value="board">
                    <LayoutGrid className="w-4 h-4 mr-2" />
                    Goal Board
                  </TabsTrigger>
                  <TabsTrigger value="timeline">
                    <Calendar className="w-4 h-4 mr-2" />
                    Timeline
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="mindmap" className="mt-0">
                  <div className="bg-white rounded-lg shadow-sm h-[600px]">
                    <GoalMindMap />
                  </div>
                </TabsContent>
                
                <TabsContent value="board" className="mt-0">
                  <GoalBoard
                    onEdit={setEditingGoal}
                    onDelete={handleDeleteGoal}
                    onAddSubgoal={handleAddSubgoal}
                  />
                </TabsContent>
                
                <TabsContent value="timeline" className="mt-0">
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <GoalTimeline
                      onEdit={setEditingGoal}
                      onDelete={handleDeleteGoal}
                      onAddSubgoal={handleAddSubgoal}
                    />
                  </div>
                </TabsContent>
              </Tabs>
            </motion.div>
          </div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:w-1/4"
          >
            <GoalSummary />
          </motion.div>
        </div>
      </div>
      
      <ChatbotAssistant />

      {/* Goal Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {editingGoal ? 'Edit Goal' : parentGoalId ? 'Add Subgoal' : 'Create New Goal'}
            </DialogTitle>
          </DialogHeader>
          <GoalForm
            isOpen={isFormOpen}
            onClose={() => {
              setIsFormOpen(false);
              setParentGoalId(null);
            }}
            onSave={editingGoal ? handleEditGoal : handleCreateGoal}
            editGoal={editingGoal}
            parentGoal={parentGoalId ? getGoalById(parentGoalId) : null}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Goals;