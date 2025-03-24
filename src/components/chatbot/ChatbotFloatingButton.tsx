
import { motion, AnimatePresence, useDragControls } from 'framer-motion';
import { MessageCircle, X, Move } from 'lucide-react';

interface ChatbotFloatingButtonProps {
  isOpen: boolean;
  onToggle: () => void;
  startDrag: (event: React.PointerEvent<HTMLDivElement>) => void;
}

const ChatbotFloatingButton = ({ isOpen, onToggle, startDrag }: ChatbotFloatingButtonProps) => {
  return (
    <>
      {/* Drag handle appears when hovering over button */}
      <div 
        className={`absolute top-0 right-0 -translate-y-full p-2 mb-1 bg-gray-800 text-white rounded-md opacity-0 transition-opacity ${isOpen ? 'pointer-events-none' : 'group-hover:opacity-80'}`}
        onPointerDown={startDrag}
      >
        <Move className="h-4 w-4" />
      </div>

      {/* Floating button */}
      <motion.div className="group relative">
        <motion.button
          className={`flex items-center justify-center w-14 h-14 rounded-full shadow-lg ${
            isOpen ? 'bg-gray-700' : 'bg-flex-gradient'
          } relative z-10`}
          onClick={onToggle}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {isOpen ? (
            <X className="text-white h-6 w-6" />
          ) : (
            <MessageCircle className="text-white h-6 w-6" />
          )}
        </motion.button>
        
        <div 
          className="absolute inset-0 rounded-full cursor-move opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
          onPointerDown={startDrag}
        >
          <Move className="h-4 w-4 text-white bg-gray-700/80 rounded-full p-0.5" />
        </div>
      </motion.div>

      {/* Glow effect when active */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute inset-0 bg-flex-green/20 rounded-full blur-xl"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1.5 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatbotFloatingButton;
