import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Send, Bot, Loader2, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ChatMessage from './ChatMessage';
import ChatPlanCard from './ChatPlanCard';
import { UserPreferences } from '@/models/AIPlanner';
import { toast } from 'sonner';

interface AIPlannerChatProps {
  onUpdatePreferences: (message: string, history: any[], context: any) => Promise<{ message: string; plan?: any; context?: any; history?: any[]; plan_confirmed?: boolean }>;
  onComplete: () => void;
  onAddTask: (task: any) => void;
  onAddAllTasks: (milestone: any) => void;
  onModifyPlan: () => void;
}

// Helper to robustly parse plan string
function parsePlanString(planString: string) {
  if (!planString) return null;
  let cleaned = planString.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json/, '').replace(/```$/, '').trim();
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```/, '').replace(/```$/, '').trim();
  }
  try {
    return JSON.parse(cleaned);
  } catch {
    return null;
  }
}

const INITIAL_QUESTIONS = [
  "Hi, I'm Flexy, your productivity assistant! What would you like to achieve today?",
  "Can you describe your main goal in a sentence or two?",
  "How much time can you dedicate to this goal each day?",
  "Do you prefer working in short bursts or longer sessions?",
  "Are there any habits or routines you'd like to include in your plan?"
];

const AIPlannerChat = ({ 
  onUpdatePreferences, 
  onComplete, 
  onAddTask, 
  onAddAllTasks, 
  onModifyPlan 
}: AIPlannerChatProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ 
    content: string; 
    type: 'question' | 'answer' | 'plan';
    plan?: any;
  }>>([]);
  const [input, setInput] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showGenerateButton, setShowGenerateButton] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [plan, setPlan] = useState<any>(null); // Store the latest plan
  const [editingKey, setEditingKey] = useState(0); // To reset editing on new plan

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSavePlan = (updatedPlan: any) => {
    setPlan(updatedPlan);
    setMessages(prev => {
      // Update the plan card in the chat
      return prev.map(m => m.type === 'plan' ? { ...m, plan: updatedPlan } : m);
    });
    toast.success('Plan saved!');
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    // Add user's response
    const userMessage = { content: input, type: 'answer' as const };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // If we've gone through all questions, show the generate button
      if (currentQuestion >= INITIAL_QUESTIONS.length - 1) {
        setShowGenerateButton(true);
        setMessages(prev => [...prev, { 
          content: "I have all the information I need to create your personalized plan. Click 'Generate Plan' when you're ready!", 
          type: 'question' 
        }]);
        setIsLoading(false);
        return;
      }
      // Otherwise, get AI response (if needed for intermediate steps)
      let response = await onUpdatePreferences(input);
      // Try to parse if it's a string that looks like JSON
      if (typeof response === 'string') {
        try {
          const parsed = JSON.parse(response);
          if (parsed && parsed.header_note && parsed.goal && parsed.milestones) {
            response = parsed;
          }
        } catch {
          // Not JSON, leave as is
        }
      }
      // If response is wrapped as { plan: ... }, extract the plan object
      if (response && typeof response === 'object' && 'plan' in response && response.plan.header_note) {
        response = response.plan;
      }
      // If response is a plan object, show as plan
      if (response && typeof response === 'object' && response.header_note && response.goal && response.milestones) {
        setPlan(response);
        setEditingKey(prev => prev + 1); // Reset editing
        setMessages(prev => {
          // Remove any previous plan card
          const filtered = prev.filter(m => m.type !== 'plan');
          return [...filtered, { content: "Here's your personalized plan:", type: 'plan', plan: response }];
        });
        setShowGenerateButton(false);
      } else {
        setMessages(prev => [...prev, { content: response, type: 'question' }]);
      }
      setCurrentQuestion(prev => prev + 1);
    } catch (error) {
      setMessages(prev => [...prev, { 
        content: "I apologize, but I encountered an error. Please try again.", 
        type: 'question' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handler for generating the plan after all questions
  const handleGeneratePlan = async () => {
    setIsLoading(true);
    try {
      // Send the last answer or a signal to generate the plan
      let response = await onUpdatePreferences(input);
      if (typeof response === 'string') {
        try {
          const parsed = JSON.parse(response);
          if (parsed && parsed.header_note && parsed.goal && parsed.milestones) {
            response = parsed;
          }
        } catch {
          // Not JSON, leave as is
        }
      }
      if (response && typeof response === 'object' && 'plan' in response && response.plan.header_note) {
        response = response.plan;
      }
      if (response && typeof response === 'object' && response.header_note && response.goal && response.milestones) {
        setPlan(response);
        setEditingKey(prev => prev + 1);
        setMessages(prev => {
          const filtered = prev.filter(m => m.type !== 'plan');
          return [...filtered, { content: "Here's your personalized plan:", type: 'plan', plan: response }];
        });
        setShowGenerateButton(false);
      } else {
        setMessages(prev => [...prev, { content: response, type: 'question' }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { 
        content: "I apologize, but I encountered an error. Please try again.", 
        type: 'question' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleChat = () => {
    if (!isOpen) {
      setMessages([{ content: INITIAL_QUESTIONS[0], type: 'question' }]);
      setCurrentQuestion(0);
      setShowGenerateButton(false);
      setInput('');
    }
    setIsOpen(!isOpen);
  };

  const renderMessage = (message: any, index: number) => {
    if (message.type === 'plan' && message.plan) {
      return (
        <div key={index} className="mb-4 font-sans">
          <ChatMessage content={message.content} type="question" />
          <ChatPlanCard
            key={editingKey}
            plan={message.plan}
            onAddTask={onAddTask}
            onAddAllTasks={onAddAllTasks}
            onModifyPlan={onModifyPlan}
            onSavePlan={handleSavePlan}
            expandable
          />
        </div>
      );
    }
    return <ChatMessage key={index} content={message.content} type={message.type} />;
  };

  return (
    <div className="relative">
      <Button 
        onClick={toggleChat} 
        className="w-full bg-flex-green hover:bg-flex-green-dark"
      >
        <Bot className="mr-2 h-5 w-5" />
        {isOpen ? "Close Chat" : "Start Planning Chat"}
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: 10, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-4"
          >
            <Card className="border shadow-sm overflow-hidden">
              <div className="h-[600px] overflow-y-auto p-4 bg-white" style={{ scrollBehavior: 'smooth' }}>
                {messages.map((message, index) => renderMessage(message, index))}
                <div ref={messagesEndRef} />
              </div>
              <div className="p-3 border-t bg-gray-50">
                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your response..."
                    className="flex-1"
                    disabled={showGenerateButton || isLoading}
                  />
                  <Button 
                    type="submit" 
                    size="icon"
                    className="bg-flex-green text-white hover:bg-flex-green-dark"
                    disabled={showGenerateButton || isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
                </form>
              </div>
              {showGenerateButton && (
                <div className="p-3 border-t bg-gray-50">
                  <Button
                    onClick={handleGeneratePlan}
                    className="w-full bg-flex-green hover:bg-flex-green-dark"
                    disabled={isLoading}
                  >
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Generate Plan'}
                  </Button>
                </div>
              )}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AIPlannerChat;