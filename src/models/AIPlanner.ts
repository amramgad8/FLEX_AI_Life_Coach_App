export interface UserPreferences {
  wakeUpTime: string;
  sleepTime: string;
  focusPeriods: number;
  breakDuration: number;
  primaryGoal: string;
}

export interface ScheduleItem {
  id: string;
  time: string;
  activity: string;
  duration?: number;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  description?: string;
  resources?: string[];
}

export interface AIGeneratedPlan {
  dailySchedule: ScheduleItem[];
  weeklyFocus: string[];
  suggestedHabits: string[];
  resources?: string[];
}

export interface AIModelDefinition {
  id: string;
  name: string;
  description: string;
  capabilities: string[];
  icon: string;
  className: string;
}

export const AI_MODELS: AIModelDefinition[] = [
  {
    id: 'basic',
    name: 'Basic Assistant',
    description: 'Simple chatbot for general conversations and task management',
    capabilities: ['Task management', 'Calendar scheduling', 'Basic reminders'],
    icon: 'Bot',
    className: 'bg-flex-green text-white'
  },
  {
    id: 'rag',
    name: 'RAG-enhanced',
    description: 'Uses Retrieval Augmented Generation to personalize responses based on your data',
    capabilities: ['Data-aware responses', 'Personalized suggestions', 'Context-aware planning'],
    icon: 'Database',
    className: 'bg-flex-yellow text-white'
  },
  {
    id: 'advanced',
    name: 'Advanced AI',
    description: 'Advanced AI with deep reasoning and high-level problem-solving, rivaling top-tier models.',
    capabilities: ['Deep reasoning', 'Complex problem solving', 'Advanced insights', 'Multi-step planning'],
    icon: 'Sparkles',
    className: 'bg-flex-orange text-white'
  }
];
