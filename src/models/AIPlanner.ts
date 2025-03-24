
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
