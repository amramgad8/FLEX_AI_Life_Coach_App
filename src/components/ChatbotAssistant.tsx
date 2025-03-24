
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Clock, Calendar, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

const ASSISTANT_RESPONSES = [
  "I've added 'Team meeting' to your Flow Tasks for tomorrow at 10 AM.",
  "Your high priority tasks for today are 'Finish project proposal' and 'Call client'.",
  "Based on your schedule, the best time to work on deep focus tasks would be between 9 AM and 11 AM tomorrow.",
  "You've completed 80% of your tasks this week! Great progress!",
  "I've set a reminder for your 'Doctor appointment' task.",
  "I notice you have several overlapping tasks this afternoon. Would you like me to suggest a better schedule?",
  "Would you like me to break down your 'Quarterly report' task into smaller, more manageable steps?",
  "I've found some free time in your schedule at 2 PM. Would you like to schedule your 'Review documentation' task then?",
  "Your most productive time appears to be mornings. Would you like me to schedule your high-priority tasks during this time?",
];

const ChatbotAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      content: "Hi there! I'm Flex Assistant. How can I help with your tasks today?",
      sender: 'assistant',
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
  };

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!inputMessage.trim()) return;
    
    const newUserMessage: ChatMessage = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, newUserMessage]);
    setInputMessage('');
    
    // Simulate assistant response
    setTimeout(() => {
      const randomResponse = ASSISTANT_RESPONSES[Math.floor(Math.random() * ASSISTANT_RESPONSES.length)];
      const newAssistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: randomResponse,
        sender: 'assistant',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, newAssistantMessage]);
    }, 1000);
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {/* Floating button */}
      <motion.button
        className={`flex items-center justify-center w-14 h-14 rounded-full shadow-lg ${
          isOpen ? 'bg-gray-700' : 'bg-flex-gradient'
        }`}
        onClick={toggleChatbot}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {isOpen ? (
          <X className="text-white h-6 w-6" />
        ) : (
          <MessageCircle className="text-white h-6 w-6" />
        )}
      </motion.button>

      {/* Chatbot dialog */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute bottom-16 right-0 w-80 md:w-96"
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="shadow-xl border border-gray-200 overflow-hidden">
              <div className="bg-flex-gradient p-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                    <MessageCircle className="text-white h-5 w-5" />
                  </div>
                  <h3 className="font-semibold text-white">Flex Assistant</h3>
                </div>
                <div className="flex items-center gap-1">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-7 w-7 text-white hover:bg-white/20 rounded-full"
                    onClick={toggleChatbot}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <CardContent className="p-0">
                {/* Chat messages */}
                <div className="h-80 overflow-y-auto p-4 flex flex-col gap-3">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.sender === 'user' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          message.sender === 'user'
                            ? 'bg-flex-green text-white rounded-tr-none'
                            : 'bg-gray-100 text-gray-800 rounded-tl-none'
                        }`}
                      >
                        {message.content}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Input area */}
                <div className="p-3 border-t">
                  <form onSubmit={handleSendMessage} className="flex gap-2">
                    <Input
                      placeholder="Ask about your tasks..."
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      className="flex-1"
                    />
                    <Button 
                      type="submit" 
                      size="icon"
                      className="bg-flex-green text-white hover:bg-flex-green-dark"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </form>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatbotAssistant;
