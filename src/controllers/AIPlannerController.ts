import { AIGeneratedPlan, UserPreferences, ScheduleItem } from "../models/AIPlanner";
import { OnboardingData } from "../pages/Onboarding";
import { ApiService } from "../services/ApiService";

export class AIPlannerController {
  private static ENDPOINT = '/ai-planner';
  private static useApi = false; // Set to true when your FastAPI backend is ready

  static async generatePlan(preferences: UserPreferences, onboardingData?: OnboardingData | null): Promise<AIGeneratedPlan> {
    try {
      if (this.useApi) {
        // Use the API service - pass both preferences and onboarding data
        return await ApiService.post<AIGeneratedPlan>(this.ENDPOINT, { preferences, onboardingData });
      } else {
        // Fallback to mock data
        console.log("Generating plan based on preferences:", preferences);
        console.log("Using onboarding data for personalization:", onboardingData);
        
        // Create a personalized plan based on preferences and onboarding data
        let primaryGoal = preferences.primaryGoal;
        let mainChallenge = "productivity";
        let personalizedApproach = "general";
        
        // Use onboarding data to personalize if available
        if (onboardingData) {
          // Adjust primary goal based on onboarding data if not already set
          if (!primaryGoal && onboardingData.goal) {
            primaryGoal = this.mapGoalFromOnboarding(onboardingData.goal);
          }
          
          // Get the main challenge
          if (onboardingData.challenge) {
            mainChallenge = onboardingData.challenge;
          }
          
          // Get personalized approach based on MBTI
          if (onboardingData.mbtiType && onboardingData.mbtiType !== "unknown") {
            personalizedApproach = this.getApproachByMBTI(onboardingData.mbtiType);
          }
        }
        
        // Create daily schedule items with personalization
        const dailySchedule: ScheduleItem[] = this.generatePersonalizedSchedule(
          preferences, 
          mainChallenge, 
          personalizedApproach
        );

        // Generate personalized weekly focus
        const weeklyFocus = this.generatePersonalizedWeeklyFocus(primaryGoal, mainChallenge);
        
        // Generate personalized habits
        const suggestedHabits = this.generatePersonalizedHabits(mainChallenge, personalizedApproach);

        // Return a complete personalized plan with resources
        return {
          dailySchedule,
          weeklyFocus,
          suggestedHabits,
          resources: [
            "Deep Work by Cal Newport - book recommendation",
            "Pomodoro Technique - productivity method",
            "Mindfulness practices for better focus",
            "Task batching to improve efficiency",
            `Strategies for overcoming ${mainChallenge}`,
            `${personalizedApproach} productivity approach - tailored to your style`
          ]
        };
      }
    } catch (error) {
      console.error('Failed to generate AI plan:', error);
      throw error;
    }
  }

  private static mapGoalFromOnboarding(goal: string): string {
    switch (goal) {
      case 'productivity': return "Increase Daily Productivity";
      case 'focus': return "Develop Better Focus Habits";
      case 'task-management': return "Master Task Management";
      case 'big-goals': return "Achieve Major Goals";
      default: return "Improve Productivity";
    }
  }

  private static getApproachByMBTI(mbtiType: string): string {
    // First letter: Energy orientation (Extraversion vs Introversion)
    const isIntrovert = mbtiType.startsWith('I');
    
    // Second letter: Information gathering (Sensing vs Intuition)
    const isSensing = mbtiType[1] === 'S';
    
    // Third letter: Decision-making (Thinking vs Feeling)
    const isThinking = mbtiType[2] === 'T';
    
    // Fourth letter: Lifestyle (Judging vs Perceiving)
    const isJudging = mbtiType[3] === 'J';
    
    if (isIntrovert && isSensing && isThinking && isJudging) {
      // ISTJ - Detail-oriented and structured approach
      return "structured and detailed";
    } else if (isIntrovert && isSensing && !isThinking && isJudging) {
      // ISFJ - Supportive and organized approach
      return "supportive and systematic";
    } else if (isIntrovert && !isSensing && isThinking && !isJudging) {
      // INTP - Analytical and conceptual approach
      return "analytical and theoretical";
    } else if (isIntrovert && !isSensing && !isThinking && !isJudging) {
      // INFP - Value-driven and creative approach
      return "value-driven and idealistic";
    } else if (!isIntrovert && isJudging) {
      // Extroverted and structured (ESTJ, ENTJ, ESFJ, ENFJ)
      return "action-oriented and organized";
    } else {
      // Other types
      return "flexible and adaptive";
    }
  }

  private static generatePersonalizedSchedule(
    preferences: UserPreferences, 
    mainChallenge: string,
    personalizedApproach: string
  ): ScheduleItem[] {
    const dailySchedule: ScheduleItem[] = [];
    
    // Morning routine
    dailySchedule.push({
      id: "1",
      time: preferences.wakeUpTime,
      activity: "Morning Routine & Breakfast",
      duration: 30,
      priority: "medium",
      resources: ["5-minute morning stretch routine", "Quick healthy breakfast ideas"]
    });
    
    // First focus session - always high priority
    dailySchedule.push({
      id: "2",
      time: this.addMinutesToTime(preferences.wakeUpTime, 30),
      activity: `Focus Session: ${preferences.primaryGoal || "Primary Goal"}`,
      duration: 90,
      priority: "high",
      resources: ["Deep work techniques", "How to maintain focus"]
    });
    
    // Break
    dailySchedule.push({
      id: "3",
      time: this.addMinutesToTime(preferences.wakeUpTime, 120),
      activity: "Short Break",
      duration: preferences.breakDuration,
      priority: "low",
      resources: ["Effective microbreak activities"]
    });
    
    // Add personalized activities based on challenge
    if (mainChallenge === "procrastination") {
      dailySchedule.push({
        id: "4",
        time: this.addMinutesToTime(preferences.wakeUpTime, 130),
        activity: "Anti-Procrastination Session",
        duration: 45,
        priority: "high",
        resources: ["Pomodoro technique", "Breaking tasks into smaller steps"]
      });
    } else if (mainChallenge === "time-management") {
      dailySchedule.push({
        id: "4",
        time: this.addMinutesToTime(preferences.wakeUpTime, 130),
        activity: "Time Audit & Planning",
        duration: 30,
        priority: "high",
        resources: ["Time blocking techniques", "Prioritization methods"]
      });
    } else if (mainChallenge === "consistency") {
      dailySchedule.push({
        id: "4",
        time: this.addMinutesToTime(preferences.wakeUpTime, 130),
        activity: "Habit Reinforcement",
        duration: 20,
        priority: "high",
        resources: ["Habit stacking", "Implementation intentions"]
      });
    }
    
    return dailySchedule;
  }

  private static generatePersonalizedWeeklyFocus(primaryGoal: string, mainChallenge: string): string[] {
    // Base focus points
    const weeklyFocus = [
      "Complete project milestones",
      "Learn new development skills",
      "Balance work with self-care"
    ];
    
    // Add personalized focus points based on goal and challenge
    if (primaryGoal?.includes("Focus")) {
      weeklyFocus.push("Practice mindfulness for 10 minutes daily");
      weeklyFocus.push("Reduce distractions in working environment");
    }
    
    if (mainChallenge === "procrastination") {
      weeklyFocus.push("Start tasks immediately, even if only for 5 minutes");
      weeklyFocus.push("Identify and address procrastination triggers");
    } else if (mainChallenge === "consistency") {
      weeklyFocus.push("Maintain daily habit streaks");
      weeklyFocus.push("Track progress visually");
    }
    
    return weeklyFocus;
  }

  private static generatePersonalizedHabits(mainChallenge: string, personalizedApproach: string): string[] {
    // Base habits
    const habits = [
      "Daily coding practice",
      "10-minute meditation",
      "Regular stretching breaks"
    ];
    
    // Add personalized habits based on challenge
    if (mainChallenge === "time-management") {
      habits.push("End-of-day planning session");
      habits.push("Time blocking your calendar");
    } else if (mainChallenge === "tracking-progress") {
      habits.push("Daily progress journaling");
      habits.push("Weekly review and reflection");
    }
    
    // Add personalized habits based on approach
    if (personalizedApproach.includes("structured")) {
      habits.push("Create detailed to-do lists");
      habits.push("Regular environment organization");
    } else if (personalizedApproach.includes("creative")) {
      habits.push("Mind mapping ideas");
      habits.push("Inspirational reading");
    }
    
    return habits;
  }

  static getSamplePreferences(): UserPreferences {
    return {
      wakeUpTime: "07:00",
      sleepTime: "23:00",
      focusPeriods: 4,
      breakDuration: 15,
      primaryGoal: "Complete React Project"
    };
  }

  // Helper function to add minutes to a time string
  private static addMinutesToTime(time: string, minutesToAdd: number): string {
    const [hours, minutes] = time.split(":").map(Number);
    const totalMinutes = hours * 60 + minutes + minutesToAdd;
    const newHours = Math.floor(totalMinutes / 60) % 24;
    const newMinutes = totalMinutes % 60;
    return `${newHours.toString().padStart(2, "0")}:${newMinutes.toString().padStart(2, "0")}`;
  }
}
