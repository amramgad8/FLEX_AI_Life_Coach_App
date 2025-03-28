
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Send, Bot } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ChatMessage from './ChatMessage';
import { UserPreferences } from '@/models/AIPlanner';

interface AIPlannerChatProps {
  onUpdatePreferences: (newPrefs: Partial<UserPreferences>) => void;
  onComplete: () => void;
}

const INITIAL_QUESTIONS = [
  "Hi there! I'm your AI Planner assistant. What are you working on today?",
  "What's your main goal with this task?",
  "How much time do you have available for this task?",
  "Do you prefer working in short focused periods or longer sessions?"
];

const AIPlannerChat = ({ onUpdatePreferences, onComplete }: AIPlannerChatProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ content: string; type: 'question' | 'answer' }[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [input, setInput] = useState('');
  const [showGenerateButton, setShowGenerateButton] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Add initial greeting when chat first opens
      setMessages([{ content: INITIAL_QUESTIONS[0], type: 'question' }]);
    }
  }, [isOpen]);

  useEffect(() => {
    // Scroll to bottom whenever messages change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user's response
    const userMessage = { content: input, type: 'answer' as const };
    setMessages(prev => [...prev, userMessage]);
    setInput('');

    // Process the user's response (in a real app, this would be sent to an API)
    // For this demo, we'll just update preferences based on question number
    switch (currentQuestion) {
      case 0:
        // First question about what they're working on
        break;
      case 1:
        // Update primary goal
        onUpdatePreferences({ primaryGoal: input });
        break;
      case 2:
        // Time available could affect focus periods
        const hours = parseInt(input) || 2;
        const focusPeriods = Math.max(1, Math.min(6, Math.floor(hours / 0.5)));
        onUpdatePreferences({ focusPeriods });
        break;
      case 3:
        // Preference for session types
        if (input.toLowerCase().includes('short')) {
          onUpdatePreferences({ focusLength: '25', breakDuration: 5 });
        } else {
          onUpdatePreferences({ focusLength: '50', breakDuration: 10 });
        }
        break;
    }

    // After a short delay, send the next question or finish conversation
    setTimeout(() => {
      if (currentQuestion < INITIAL_QUESTIONS.length - 1) {
        const nextQuestion = INITIAL_QUESTIONS[currentQuestion + 1];
        setMessages(prev => [...prev, { content: nextQuestion, type: 'question' }]);
        setCurrentQuestion(prev => prev + 1);
      } else {
        // End of conversation
        setMessages(prev => [...prev, { 
          content: "Thanks! I have enough information to help create your plan. Click 'Generate Plan' when you're ready.", 
          type: 'question' 
        }]);
        setShowGenerateButton(true);
      }
    }, 500);
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
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
              <div className="h-80 overflow-y-auto p-4 bg-white" style={{ scrollBehavior: 'smooth' }}>
                {messages.map((message, index) => (
                  <ChatMessage 
                    key={index} 
                    content={message.content} 
                    type={message.type} 
                  />
                ))}
                <div ref={messagesEndRef} />
              </div>
              
              <div className="p-3 border-t bg-gray-50">
                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your response..."
                    className="flex-1"
                    disabled={showGenerateButton}
                  />
                  <Button 
                    type="submit" 
                    size="icon"
                    className="bg-flex-green text-white hover:bg-flex-green-dark"
                    disabled={showGenerateButton}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </div>
              
              {showGenerateButton && (
                <div className="p-3 border-t bg-gray-50 flex justify-center">
                  <Button 
                    onClick={onComplete}
                    className="bg-flex-gradient text-white hover:opacity-90"
                  >
                    Generate Plan
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