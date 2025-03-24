
import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import EisenhowerMatrix from '@/components/eisenhower/EisenhowerMatrix';
import { useTasks } from '@/hooks/useTasks';

const EisenhowerMatrixView = () => {
  const { tasks, isLoading } = useTasks();

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
          <p className="text-center text-gray-600">
            Prioritize your tasks based on urgency and importance
          </p>
        </motion.div>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <EisenhowerMatrix tasks={tasks} />
        )}
      </div>
    </div>
  );
};

export default EisenhowerMatrixView;
