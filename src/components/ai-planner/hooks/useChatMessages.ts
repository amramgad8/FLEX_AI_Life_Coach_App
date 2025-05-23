
import { useState, useRef, useEffect } from 'react';
import { toast } from 'sonner';
import { extractPlanData } from '../utils/planParser';

interface Message {
  content: string;
  type: 'question' | 'answer' | 'plan';
  plan?: any;
}

export const useChatMessages = (
  onUpdatePreferences: (message: string, history: any[], context: any) => Promise<any>
) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [plan, setPlan] = useState<any>(null);
  const [editingKey, setEditingKey] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSavePlan = (updatedPlan: any) => {
    console.log('Saving plan:', updatedPlan);
    setPlan(updatedPlan);
    setMessages(prev => {
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
      console.log('Sending message:', input);
      const response = await onUpdatePreferences(input, [], {});
      console.log('Received response:', response);
      
      const planData = extractPlanData(response);
      
      if (planData) {
        console.log('Plan data found, creating plan message:', planData);
        setPlan(planData);
        setEditingKey(prev => prev + 1);
        setMessages(prev => {
          const filtered = prev.filter(m => m.type !== 'plan');
          return [...filtered, { 
            content: "Here's your personalized plan:", 
            type: 'plan', 
            plan: planData 
          }];
        });
      } else {
        // Regular text response
        const responseText = typeof response === 'string' ? response : response?.message || 'I understand. Please continue sharing your preferences.';
        console.log('No plan found, adding text response:', responseText);
        setMessages(prev => [...prev, { content: responseText, type: 'question' }]);
      }
    } catch (error) {
      console.error('Error in handleSendMessage:', error);
      setMessages(prev => [...prev, { 
        content: "I apologize, but I encountered an error. Please try again.", 
        type: 'question' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const initializeChat = () => {
    console.log('Initializing chat');
    setMessages([{ 
      content: "Hi, I'm Flexy, your productivity assistant! What would you like to achieve today? Please describe your main goal and I'll help you create a personalized plan.", 
      type: 'question' 
    }]);
    setInput('');
  };

  return {
    messages,
    input,
    setInput,
    isLoading,
    plan,
    editingKey,
    messagesEndRef,
    handleSavePlan,
    handleSendMessage,
    initializeChat
  };
};
