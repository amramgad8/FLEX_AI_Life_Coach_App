
import React from 'react';
import { motion } from 'framer-motion';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Navbar from '@/components/Navbar';
import EisenhowerMatrix from '@/components/eisenhower/EisenhowerMatrix';
import { useTasks } from '@/hooks/useTasks';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';


const EisenhowerMatrixView = () => {
  const { tasks, isLoading } = useTasks();
  const navigate = useNavigate();

  const handleAddNewTask = () => {
    navigate('/tasks'); // Navigate to the tasks page to add a new task
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="container mx-auto py-20 px-4 max-w-6xl">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
            Eisenhower Matrix
          </h1>
          <p className="text-center text-gray-600 mb-4">
            Prioritize your tasks based on urgency and importance
          </p>
          <Link to="/todo">
          <Button onClick={handleAddNewTask} className="mx-auto">
            <Plus className="h-4 w-4 mr-1" />
            Create New Task
          </Button>
          </Link>
        </motion.div>
        
        <DndProvider backend={HTML5Backend}>
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <EisenhowerMatrix tasks={tasks} />
          )}
        </DndProvider>
      </div>
    </div>
  );
};

export default EisenhowerMatrixView;
