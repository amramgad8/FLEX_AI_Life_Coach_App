
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useDragControls } from 'framer-motion';
import { 
  MessageCircle, 
  X, 
  Send, 
  Clock, 
  Calendar, 
  CheckCircle, 
  Bot, 
  AlertCircle,
  PencilRuler,
  ZapIcon,
  Brain,
  ArrowUpRight,
  Move
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';

interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  type?: 'text' | 'suggestion' | 'alert' | 'insight';
}

// Sample AI responses for demo
const ASSISTANT_RESPONSES = [
  {
    type: 'text' as const,
    content: "I've added 'Team meeting' to your Flow Tasks for tomorrow at 10 AM."
  },
  {
    type: 'insight' as const,
    content: "Your high priority tasks for today are 'Finish project proposal' and 'Call client'."
  },
  {
    type: 'suggestion' as const,
    content: "Based on your schedule, the best time to work on deep focus tasks would be between 9 AM and 11 AM tomorrow."
  },
  {
    type: 'text' as const,
    content: "You've completed 80% of your tasks this week! Great progress!"
  },
  {
    type: 'text' as const,
    content: "I've set a reminder for your 'Doctor appointment' task."
  },
  {
    type: 'alert' as const,
    content: "I notice you have several overlapping tasks this afternoon. Would you like me to suggest a better schedule?"
  },
  {
    type: 'suggestion' as const,
    content: "Would you like me to break down your 'Quarterly report' task into smaller, more manageable steps?"
  },
  {
    type: 'suggestion' as const,
    content: "I've found some free time in your schedule at 2 PM. Would you like to schedule your 'Review documentation' task then?"
  },
  {
    type: 'insight' as const,
    content: "Your most productive time appears to be mornings. Would you like me to schedule your high-priority tasks during this time?"
  },
];

// AI enhancement suggestions
const PRODUCTIVITY_TIPS = [
  "Try the Pomodoro Technique: 25 minutes of focused work, then a 5-minute break.",
  "Group similar tasks together to reduce context switching.",
  "Schedule your most challenging tasks during your peak energy hours.",
  "Use the 2-minute rule: If a task takes less than 2 minutes, do it immediately.",
  "Block distractions during your focused work periods.",
  "Plan your day the night before to hit the ground running."
];

const ChatbotAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      content: "Hi there! I'm Flex Assistant. How can I help with your tasks today?",
      sender: 'assistant',
      timestamp: new Date(),
      type: 'text'
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("chat");
  const [aiModel, setAiModel] = useState<string>("default");
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const dragControls = useDragControls();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Start drag using controls
  function startDrag(event: React.PointerEvent<HTMLDivElement>) {
    dragControls.start(event);
  }

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
      type: 'text'
    };
    
    setMessages((prev) => [...prev, newUserMessage]);
    setInputMessage('');
    setIsTyping(true);
    
    // Simulate assistant response with typing indicator
    setTimeout(() => {
      const randomResponse = ASSISTANT_RESPONSES[Math.floor(Math.random() * ASSISTANT_RESPONSES.length)];
      const newAssistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: randomResponse.content,
        sender: 'assistant',
        timestamp: new Date(),
        type: randomResponse.type
      };
      setMessages((prev) => [...prev, newAssistantMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleApplySuggestion = (suggestion: string) => {
    const newUserMessage: ChatMessage = {
      id: Date.now().toString(),
      content: suggestion,
      sender: 'user',
      timestamp: new Date(),
      type: 'suggestion'
    };
    
    setMessages((prev) => [...prev, newUserMessage]);
    
    toast({
      title: "Suggestion Applied",
      description: "We'll implement this productivity tip for you.",
    });
    
    // Simulate assistant confirmation
    setIsTyping(true);
    setTimeout(() => {
      const confirmationMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: `I've noted your interest in: "${suggestion}". Would you like me to provide more details?`,
        sender: 'assistant',
        timestamp: new Date(),
        type: 'text'
      };
      setMessages((prev) => [...prev, confirmationMessage]);
      setIsTyping(false);
    }, 1000);
  };

  const handleChangeModel = (modelName: string) => {
    setAiModel(modelName);
    toast({
      title: "AI Model Changed",
      description: `Now using ${modelName === 'default' ? 'Default Assistant' : modelName === 'rag' ? 'RAG-enhanced' : 'Advanced AI'} model`,
    });
  };

  return (
    <motion.div 
      className="fixed z-50"
      initial={{ bottom: 20, right: 20 }}
      drag
      dragControls={dragControls}
      dragMomentum={false}
      dragElastic={0}
      dragTransition={{ bounceStiffness: 600, bounceDamping: 20 }}
      onDragEnd={(e, info) => {
        setPosition({ x: info.point.x, y: info.point.y });
      }}
    >
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
          onClick={toggleChatbot}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          onPointerDown={!isOpen ? startDrag : undefined}
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
                    <Bot className="text-white h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Flex Assistant</h3>
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-white/70">
                        {aiModel === 'default' ? 'Standard' : aiModel === 'rag' ? 'RAG-enhanced' : 'Advanced AI'}
                      </span>
                      <div className="h-1.5 w-1.5 rounded-full bg-green-300 animate-pulse"></div>
                    </div>
                  </div>
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
              
              <div>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid grid-cols-3 w-full rounded-none">
                    <TabsTrigger value="chat" className="text-xs">Chat</TabsTrigger>
                    <TabsTrigger value="insights" className="text-xs">Insights</TabsTrigger>
                    <TabsTrigger value="settings" className="text-xs">Settings</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="chat">
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
                            className={cn(
                              "max-w-[80%] rounded-lg p-3",
                              message.sender === 'user'
                                ? 'bg-flex-green text-white rounded-tr-none'
                                : 'bg-gray-100 text-gray-800 rounded-tl-none',
                              message.type === 'suggestion' && message.sender === 'assistant' && 'bg-flex-green-light border border-flex-green text-gray-800',
                              message.type === 'alert' && message.sender === 'assistant' && 'bg-flex-orange-light border border-flex-orange text-gray-800',
                              message.type === 'insight' && message.sender === 'assistant' && 'bg-flex-yellow-light border border-flex-yellow text-gray-800'
                            )}
                          >
                            {message.type === 'suggestion' && message.sender === 'assistant' && (
                              <div className="flex items-center gap-1 mb-1 text-xs text-flex-green font-medium">
                                <PencilRuler className="h-3 w-3" /> Suggestion
                              </div>
                            )}
                            {message.type === 'alert' && message.sender === 'assistant' && (
                              <div className="flex items-center gap-1 mb-1 text-xs text-flex-orange font-medium">
                                <AlertCircle className="h-3 w-3" /> Alert
                              </div>
                            )}
                            {message.type === 'insight' && message.sender === 'assistant' && (
                              <div className="flex items-center gap-1 mb-1 text-xs text-flex-yellow font-medium">
                                <Brain className="h-3 w-3" /> Insight
                              </div>
                            )}
                            {message.content}
                          </div>
                        </div>
                      ))}
                      
                      {/* Typing indicator */}
                      {isTyping && (
                        <div className="flex justify-start">
                          <div className="bg-gray-100 text-gray-800 rounded-lg rounded-tl-none p-3 max-w-[80%]">
                            <div className="flex gap-1">
                              <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }}></span>
                              <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }}></span>
                              <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }}></span>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      <div ref={messagesEndRef} />
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
                  </TabsContent>
                  
                  <TabsContent value="insights" className="p-0">
                    <div className="h-80 overflow-y-auto">
                      <div className="p-4 border-b">
                        <h3 className="text-sm font-medium mb-2">Productivity Tips</h3>
                        <div className="space-y-2">
                          {PRODUCTIVITY_TIPS.map((tip, index) => (
                            <div key={index} className="bg-gray-50 rounded-lg p-3 text-sm relative group">
                              <p>{tip}</p>
                              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-6 w-6 text-flex-green hover:bg-flex-green/10"
                                  onClick={() => handleApplySuggestion(tip)}
                                >
                                  <ArrowUpRight className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="p-4">
                        <h3 className="text-sm font-medium mb-2">Task Insights</h3>
                        <div className="space-y-3">
                          <div className="bg-flex-green-light border border-flex-green/30 rounded-lg p-3">
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-xs font-medium text-flex-green">Task Completion</span>
                              <Badge variant="outline" className="text-xs bg-white border-flex-green text-flex-green">Today</Badge>
                            </div>
                            <p className="text-sm">You've completed 3 of 5 tasks today (60%)</p>
                          </div>
                          
                          <div className="bg-flex-yellow-light border border-flex-yellow/30 rounded-lg p-3">
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-xs font-medium text-flex-yellow">Productivity Peak</span>
                              <Badge variant="outline" className="text-xs bg-white border-flex-yellow text-flex-yellow">This Week</Badge>
                            </div>
                            <p className="text-sm">Your most productive day is Wednesday</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="settings" className="p-4">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">AI Model</label>
                        <div className="grid grid-cols-1 gap-2">
                          <Button
                            variant={aiModel === 'default' ? 'default' : 'outline'}
                            className={aiModel === 'default' ? 'bg-flex-green text-white' : ''}
                            onClick={() => handleChangeModel('default')}
                            size="sm"
                          >
                            <Bot className="mr-2 h-4 w-4" />
                            Standard Assistant
                          </Button>
                          <Button
                            variant={aiModel === 'rag' ? 'default' : 'outline'}
                            className={aiModel === 'rag' ? 'bg-flex-yellow text-white' : ''}
                            onClick={() => handleChangeModel('rag')}
                            size="sm"
                          >
                            <Bot className="mr-2 h-4 w-4" />
                            RAG-enhanced
                          </Button>
                          <Button
                            variant={aiModel === 'advanced' ? 'default' : 'outline'}
                            className={aiModel === 'advanced' ? 'bg-flex-orange text-white' : ''}
                            onClick={() => handleChangeModel('advanced')}
                            size="sm"
                          >
                            <ZapIcon className="mr-2 h-4 w-4" />
                            Advanced AI
                          </Button>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Custom Instructions</label>
                        <Textarea 
                          placeholder="Add custom instructions for the AI assistant"
                          className="resize-none"
                          rows={3}
                        />
                        <p className="text-xs text-gray-500">
                          These instructions will guide how the AI assistant interacts with you and your tasks.
                        </p>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ChatbotAssistant;
