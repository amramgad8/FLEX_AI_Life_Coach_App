
export interface UserPreferences {
  wakeUpTime: string;
  sleepTime: string;
  focusPeriods: number;
  breakDuration: number;
  primaryGoal: string;
  // New fields for enhanced planner
  focusLength?: string | number;
  scheduleType?: 'structured' | 'flexible';
  productivePeriod?: 'morning' | 'afternoon' | 'night' | 'varies';
  motivationFactors?: string[];
  insightsEnabled?: string;
  taskManagementStyle?: 'todo' | 'kanban' | 'pomodoro' | 'calendar';
  autoTaskDuration?: string;
  weeklyReviewEnabled?: string;
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
