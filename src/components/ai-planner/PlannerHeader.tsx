
import React from 'react';
import { Brain, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';

interface PlannerHeaderProps {
  personalizedGreeting?: string;
}

const PlannerHeader: React.FC<PlannerHeaderProps> = ({ personalizedGreeting }) => {
  return (
    <Card className="overflow-hidden bg-flex-light border-0">
      <CardContent className="p-0">
        <div className="relative p-8 overflow-hidden bg-flex-gradient">
          {/* Animated sparkles background */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-0 left-1/4 w-12 h-12 bg-white/10 rounded-full filter blur-xl animate-float" />
            <div className="absolute bottom-0 right-1/4 w-16 h-16 bg-white/10 rounded-full filter blur-xl animate-float" style={{ animationDelay: '1s' }} />
          </div>
          
          <div className="relative z-10 text-center text-white">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex justify-center mb-4"
            >
              <div className="rounded-full bg-white/15 p-3">
                <Brain className="h-8 w-8 text-white" />
              </div>
            </motion.div>
            
            <motion.h1 
              className="text-3xl font-bold mb-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              AI Productivity Planner
            </motion.h1>
            
            <motion.p
              className="text-white/90 max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Let AI create a personalized productivity routine tailored to your preferences
            </motion.p>
            
            {personalizedGreeting && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-sm"
              >
                <Sparkles className="h-4 w-4 text-yellow-200" />
                {personalizedGreeting}
              </motion.div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PlannerHeader;
