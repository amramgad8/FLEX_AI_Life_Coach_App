
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserPreferences } from '@/models/AIPlanner';
import { Progress } from '@/components/ui/progress';
import ChatMessage from './ChatMessage';
import ChatOptions from './ChatOptions';
import { Loader2 } from 'lucide-react';

export type QuestionState = {
  id: string;
  question: string;
  options?: { value: string; label: string; icon?: React.ReactNode }[];
  field: keyof UserPreferences | 'custom';
  inputType: 'text' | 'time' | 'number' | 'select' | 'multi-select' | 'slider';
  completed: boolean;
  sliderOptions?: { min: number; max: number; step: number; defaultValue: number };
  placeholder?: string;
};

interface ChatPlannerFlowProps {
  preferences: UserPreferences;
  onUpdatePreferences: (preferences: Partial<UserPreferences>) => void;
  onComplete: () => void;
  isGenerating: boolean;
}

const ChatPlannerFlow = ({ 
  preferences, 
  onUpdatePreferences,
  onComplete,
  isGenerating
}: ChatPlannerFlowProps) => {
  const [activeQuestion, setActiveQuestion] = useState(0);
  const [showNextQuestion, setShowNextQuestion] = useState(false);
  const [questions, setQuestions] = useState<QuestionState[]>([]);
  const [conversation, setConversation] = useState<{type: 'question' | 'answer', content: string}[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Define all the questions in the conversation flow
  useEffect(() => {
    setQuestions([
      {
        id: 'wakeUpTime',
        question: "What time do you usually wake up?",
        field: 'wakeUpTime',
        inputType: 'time',
        completed: !!preferences.wakeUpTime,
        placeholder: "06:00"
      },
      {
        id: 'sleepTime',
        question: "What time do you usually go to sleep?",
        field: 'sleepTime',
        inputType: 'time',
        completed: !!preferences.sleepTime,
        placeholder: "22:00"
      },
      {
        id: 'focusPeriods',
        question: "How many focus sessions do you prefer daily?",
        field: 'focusPeriods',
        inputType: 'slider',
        sliderOptions: { min: 1, max: 6, step: 1, defaultValue: preferences.focusPeriods || 3 },
        completed: !!preferences.focusPeriods,
      },
      {
        id: 'focusLength',
        question: "How long should each focus session be?",
        field: 'focusLength',
        inputType: 'select',
        options: [
          { value: '25', label: '25 minutes' },
          { value: '50', label: '50 minutes' },
          { value: 'custom', label: 'Custom' }
        ],
        completed: !!preferences.focusLength,
      },
      {
        id: 'breakDuration',
        question: "How long should your breaks be?",
        field: 'breakDuration',
        inputType: 'select',
        options: [
          { value: '5', label: '5 minutes' },
          { value: '10', label: '10 minutes' },
          { value: '15', label: '15 minutes' },
          { value: 'custom', label: 'Custom' },
        ],
        completed: !!preferences.breakDuration,
      },
      {
        id: 'scheduleType',
        question: "Do you prefer a structured or flexible schedule?",
        field: 'scheduleType',
        inputType: 'select',
        options: [
          { value: 'structured', label: 'Structured' },
          { value: 'flexible', label: 'Flexible' }
        ],
        completed: !!preferences.scheduleType,
      },
      {
        id: 'productivePeriod',
        question: "When do you feel most productive?",
        field: 'productivePeriod',
        inputType: 'select',
        options: [
          { value: 'morning', label: 'Morning' },
          { value: 'afternoon', label: 'Afternoon' },
          { value: 'night', label: 'Night' },
          { value: 'varies', label: 'Varies Daily' }
        ],
        completed: !!preferences.productivePeriod,
      },
      {
        id: 'primaryGoal',
        question: "What is your primary goal?",
        field: 'primaryGoal',
        inputType: 'text',
        completed: !!preferences.primaryGoal,
        placeholder: "e.g. Boost productivity, Learn a new skill, Stay fit..."
      },
      {
        id: 'motivationFactors',
        question: "How do you stay motivated? (Select all that apply)",
        field: 'motivationFactors',
        inputType: 'multi-select',
        options: [
          { value: 'deadlines', label: 'Deadlines' },
          { value: 'rewards', label: 'Rewards' },
          { value: 'public', label: 'Public Commitment' },
          { value: 'tracking', label: 'Self-tracking' },
          { value: 'ai-reminders', label: 'AI reminders' }
        ],
        completed: !!preferences.motivationFactors,
      },
      {
        id: 'insightsEnabled',
        question: "Would you like AI-generated insights on your productivity trends?",
        field: 'insightsEnabled',
        inputType: 'select',
        options: [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' }
        ],
        completed: !!preferences.insightsEnabled,
      },
      {
        id: 'taskManagementStyle',
        question: "How do you prefer organizing tasks?",
        field: 'taskManagementStyle',
        inputType: 'select',
        options: [
          { value: 'todo', label: 'To-Do Lists' },
          { value: 'kanban', label: 'Kanban Boards' },
          { value: 'pomodoro', label: 'Pomodoro Sessions' },
          { value: 'calendar', label: 'Calendar Scheduling' }
        ],
        completed: !!preferences.taskManagementStyle,
      },
      {
        id: 'autoTaskDuration',
        question: "Should AI auto-assign task durations based on your past focus sessions?",
        field: 'autoTaskDuration',
        inputType: 'select',
        options: [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' }
        ],
        completed: !!preferences.autoTaskDuration,
      },
      {
        id: 'weeklyReviewEnabled',
        question: "Would you like a weekly review to track progress?",
        field: 'weeklyReviewEnabled',
        inputType: 'select',
        options: [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' }
        ],
        completed: !!preferences.weeklyReviewEnabled,
      }
    ]);
  }, [preferences]);

  // Calculate progress percentage
  const getProgressPercentage = () => {
    const completedCount = questions.filter(q => q.completed).length;
    return (completedCount / questions.length) * 100;
  };

  // Auto-scroll to the bottom of the messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation]);

  // Add initial greeting message on first load
  useEffect(() => {
    if (conversation.length === 0) {
      setConversation([{
        type: 'question',
        content: "Hi there! I'm your AI Planner assistant. I'll help you create a personalized schedule that matches your style and goals. Let's get started with a few questions."
      }]);
      
      // Show first question after a delay
      setTimeout(() => {
        if (questions.length > 0) {
          addQuestionToConversation(questions[0]);
          setShowNextQuestion(true);
        }
      }, 1000);
    }
  }, [questions]);

  const addQuestionToConversation = (question: QuestionState) => {
    setConversation(prev => [...prev, {
      type: 'question',
      content: question.question
    }]);
  };

  const addAnswerToConversation = (answer: string) => {
    setConversation(prev => [...prev, {
      type: 'answer',
      content: answer
    }]);
  };

  const handleAnswer = (value: string | number | string[]) => {
    if (activeQuestion >= questions.length) {
      return;
    }
    
    const currentQuestion = questions[activeQuestion];

    // Format the answer for display in conversation
    let displayAnswer = String(value);
    if (Array.isArray(value)) {
      displayAnswer = value.join(', ');
    } else if (currentQuestion.options && !Array.isArray(value)) {
      const option = currentQuestion.options.find(opt => opt.value === String(value));
      if (option) displayAnswer = option.label;
    }

    // Add the answer to the conversation
    addAnswerToConversation(displayAnswer);

    // Update the preferences
    if (currentQuestion.field !== 'custom') {
      onUpdatePreferences({ [currentQuestion.field]: value });
    }

    // Mark current question as completed
    setQuestions(prevQuestions => 
      prevQuestions.map((q, index) => 
        index === activeQuestion ? { ...q, completed: true } : q
      )
    );

    // Move to next question after a delay
    setTimeout(() => {
      if (activeQuestion < questions.length - 1) {
        setActiveQuestion(prev => prev + 1);
        setShowNextQuestion(false);
        
        // Show next question after a short delay
        setTimeout(() => {
          if (activeQuestion + 1 < questions.length) {
            addQuestionToConversation(questions[activeQuestion + 1]);
            setShowNextQuestion(true);
          }
        }, 600);
      } else {
        // All questions have been answered
        setConversation(prev => [...prev, {
          type: 'question',
          content: "Great! I have all the information I need. Let me generate your personalized plan now."
        }]);
        
        setTimeout(() => {
          onComplete();
        }, 1500);
      }
    }, 500);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-4 flex flex-col h-[600px] max-h-[80vh]">
      <div className="mb-4">
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-medium">Profile Completion</span>
          <span className="text-sm font-medium">{Math.round(getProgressPercentage())}%</span>
        </div>
        <Progress value={getProgressPercentage()} className="h-2" />
      </div>
      
      <div className="flex-1 overflow-y-auto mb-4 scroll-smooth">
        <div className="space-y-4">
          <AnimatePresence initial={false}>
            {conversation.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <ChatMessage 
                  content={message.content} 
                  type={message.type} 
                />
              </motion.div>
            ))}
          </AnimatePresence>
          
          {isGenerating && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center text-sm text-gray-500 p-3 bg-gray-50 rounded-lg"
            >
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating your personalized plan...
            </motion.div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      {showNextQuestion && activeQuestion < questions.length && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2"
        >
          <ChatOptions 
            question={questions[activeQuestion]} 
            onAnswer={handleAnswer} 
            preferences={preferences}
          />
        </motion.div>
      )}
    </div>
  );
};

export default ChatPlannerFlow;