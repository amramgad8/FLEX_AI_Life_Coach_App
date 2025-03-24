
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Plus, 
  Calendar as CalendarIcon, 
  X, 
  ClipboardList, 
  Repeat, 
  AlertCircle 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FloatingActionButtonProps {
  onCreateTask: () => void;
  onCreateRecurring?: () => void;
  onCreateReminder?: () => void;
  onCreateNote?: () => void;
}

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({ 
  onCreateTask,
  onCreateRecurring,
  onCreateReminder,
  onCreateNote
}) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const toggleMenu = () => setIsOpen(!isOpen);
  
  const handleAction = (action: () => void) => {
    action();
    setIsOpen(false);
  };
  
  return (
    <div className="fixed bottom-24 md:bottom-8 right-8 z-40">
      <AnimatePresence>
        {isOpen && (
          <div className="flex flex-col-reverse items-center gap-2 mb-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.2, delay: 0 }}
            >
              <Button
                onClick={() => handleAction(onCreateTask)}
                variant="default"
                className="rounded-full bg-green-500 hover:bg-green-600 flex items-center gap-1 px-3 shadow-lg"
              >
                <CalendarIcon className="h-4 w-4" />
                <span>Task</span>
              </Button>
            </motion.div>
            
            {onCreateRecurring && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.2, delay: 0.05 }}
              >
                <Button
                  onClick={() => handleAction(onCreateRecurring)}
                  variant="default"
                  className="rounded-full bg-blue-500 hover:bg-blue-600 flex items-center gap-1 px-3 shadow-lg"
                >
                  <Repeat className="h-4 w-4" />
                  <span>Recurring</span>
                </Button>
              </motion.div>
            )}
            
            {onCreateReminder && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.2, delay: 0.1 }}
              >
                <Button
                  onClick={() => handleAction(onCreateReminder)}
                  variant="default"
                  className="rounded-full bg-orange-500 hover:bg-orange-600 flex items-center gap-1 px-3 shadow-lg"
                >
                  <AlertCircle className="h-4 w-4" />
                  <span>Reminder</span>
                </Button>
              </motion.div>
            )}
            
            {onCreateNote && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.2, delay: 0.15 }}
              >
                <Button
                  onClick={() => handleAction(onCreateNote)}
                  variant="default"
                  className="rounded-full bg-purple-500 hover:bg-purple-600 flex items-center gap-1 px-3 shadow-lg"
                >
                  <ClipboardList className="h-4 w-4" />
                  <span>Note</span>
                </Button>
              </motion.div>
            )}
          </div>
        )}
      </AnimatePresence>
      
      <Button
        onClick={toggleMenu}
        className={`rounded-full h-14 w-14 shadow-lg transition-all ${
          isOpen ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'
        }`}
      >
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.2 }}
        >
          {isOpen ? <X className="h-6 w-6" /> : <Plus className="h-6 w-6" />}
        </motion.div>
      </Button>
    </div>
  );
};

export default FloatingActionButton;
