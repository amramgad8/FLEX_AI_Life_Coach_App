
import { AIGeneratedPlan, UserPreferences, ScheduleItem } from "../models/AIPlanner";
import { ApiService } from "../services/ApiService";
import { OnboardingData } from "../pages/Onboarding";

export class AIPlannerController {
  private static ENDPOINT = '/ai-planner';
  private static useApi = false; // Set to true when your FastAPI backend is ready

  static async generatePlan(
    preferences: UserPreferences, 
    onboardingData?: OnboardingData | null
  ): Promise<AIGeneratedPlan> {
    try {
      if (this.useApi) {
        // Use the API service
        return await ApiService.post<AIGeneratedPlan>(this.ENDPOINT, {
          preferences,
          onboardingData
        });
      } else {
        // Fallback to mock data
        console.log("Generating plan based on preferences:", preferences);
        console.log("Onboarding data for personalization:", onboardingData);
        
        // Create a more personalized mock daily schedule based on preferences and onboarding data
        const dailySchedule: ScheduleItem[] = [
          {
            id: "1",
            time: preferences.wakeUpTime,
            activity: "Morning Routine & Breakfast",
            duration: 30,
            priority: "medium",
            resources: ["5-minute morning stretch routine", "Quick healthy breakfast ideas"]
          },
          {
            id: "2",
            time: this.addMinutesToTime(preferences.wakeUpTime, 30),
            activity: `Focus Session: ${preferences.primaryGoal}`,
            duration: 90,
            priority: "high",
            resources: ["Deep work techniques", "How to maintain focus"]
          },
          {
            id: "3",
            time: this.addMinutesToTime(preferences.wakeUpTime, 120),
            activity: "Short Break",
            duration: preferences.breakDuration,
            priority: "low",
            resources: ["Effective microbreak activities"]
          },
        ];
        
        // Add personalized activities based on onboarding data
        if (onboardingData) {
          const personalizedActivities = this.generatePersonalizedActivities(onboardingData, preferences);
          dailySchedule.push(...personalizedActivities);
        }

        // Generate personalized habits based on onboarding data
        const suggestedHabits = onboardingData 
          ? this.generatePersonalizedHabits(onboardingData)
          : [
              "Daily coding practice",
              "10-minute meditation",
              "Regular stretching breaks"
            ];
            
        // Generate personalized weekly focus based on onboarding data
        const weeklyFocus = onboardingData
          ? this.generatePersonalizedWeeklyFocus(onboardingData)
          : [
              "Complete project milestones",
              "Learn new development skills",
              "Balance work with self-care"
            ];
            
        // Generate personalized resources based on onboarding data and MBTI
        const resources = onboardingData?.mbtiType
          ? this.generatePersonalizedResources(onboardingData)
          : [
              "Deep Work by Cal Newport - book recommendation",
              "Pomodoro Technique - productivity method",
              "Mindfulness practices for better focus",
              "Task batching to improve efficiency",
              "The importance of regular breaks for productivity"
            ];

        // Return a complete plan with resources
        return {
          dailySchedule,
          weeklyFocus,
          suggestedHabits,
          resources
        };
      }
    } catch (error) {
      console.error('Failed to generate AI plan:', error);
      throw error;
    }
  }

  // Generate personalized activities based on onboarding data
  private static generatePersonalizedActivities(
    onboardingData: OnboardingData,
    preferences: UserPreferences
  ): ScheduleItem[] {
    const activities: ScheduleItem[] = [];
    const baseTime = this.addMinutesToTime(preferences.wakeUpTime, 180); // Start 3 hours after wake-up
    
    // Add activities based on user's goal
    if (onboardingData.goal) {
      switch (onboardingData.goal) {
        case 'productivity':
          activities.push({
            id: "goal-1",
            time: baseTime,
            activity: "Productivity Session: Task Batching",
            duration: 60,
            priority: "high",
            resources: ["Task batching techniques", "How to organize similar tasks"]
          });
          break;
        case 'focus':
          activities.push({
            id: "goal-1",
            time: baseTime,
            activity: "Deep Focus: Distraction-Free Work",
            duration: 90,
            priority: "high",
            resources: ["Creating a distraction-free environment", "Deep work techniques"]
          });
          break;
        case 'task-management':
          activities.push({
            id: "goal-1",
            time: baseTime,
            activity: "Task Organization & Planning",
            duration: 45,
            priority: "high",
            resources: ["Task prioritization methods", "Weekly planning template"]
          });
          break;
        case 'big-goals':
          activities.push({
            id: "goal-1",
            time: baseTime,
            activity: "Goal Breakdown Session",
            duration: 60,
            priority: "high",
            resources: ["Breaking down large goals into actionable steps", "Milestone planning"]
          });
          break;
      }
    }
    
    // Add activity based on user's challenge
    if (onboardingData.challenge) {
      const challengeTime = this.addMinutesToTime(baseTime, 120); // 2 hours after the goal activity
      
      switch (onboardingData.challenge) {
        case 'consistency':
          activities.push({
            id: "challenge-1",
            time: challengeTime,
            activity: "Habit Building Session",
            duration: 30,
            priority: "medium",
            resources: ["Habit stacking techniques", "Creating habit triggers"]
          });
          break;
        case 'time-management':
          activities.push({
            id: "challenge-1",
            time: challengeTime,
            activity: "Time Audit & Planning",
            duration: 30,
            priority: "medium",
            resources: ["Time blocking method", "Identifying time wasters"]
          });
          break;
        case 'tracking-progress':
          activities.push({
            id: "challenge-1",
            time: challengeTime,
            activity: "Progress Review & Reflection",
            duration: 30,
            priority: "medium",
            resources: ["Setting measurable goals", "Progress tracking templates"]
          });
          break;
        case 'procrastination':
          activities.push({
            id: "challenge-1",
            time: challengeTime,
            activity: "Anti-Procrastination Techniques",
            duration: 30,
            priority: "high",
            resources: ["5-minute rule for starting tasks", "Breaking tasks into smaller steps"]
          });
          break;
      }
    }
    
    return activities;
  }
  
  // Generate personalized habits based on onboarding data
  private static generatePersonalizedHabits(onboardingData: OnboardingData): string[] {
    const habits: string[] = [];
    
    // Base habits everyone gets
    habits.push("Drink water regularly throughout the day");
    
    // Goal-based habits
    if (onboardingData.goal) {
      switch (onboardingData.goal) {
        case 'productivity':
          habits.push("Daily planning session (10 minutes)");
          habits.push("Single-tasking focus sessions");
          break;
        case 'focus':
          habits.push("Meditation practice (5-10 minutes daily)");
          habits.push("Regular tech breaks to reset attention");
          break;
        case 'task-management':
          habits.push("End-of-day task review");
          habits.push("Weekly planning session (Sundays)");
          break;
        case 'big-goals':
          habits.push("Daily progress check on top goals");
          habits.push("Weekly milestone review");
          break;
      }
    }
    
    // Challenge-based habits
    if (onboardingData.challenge) {
      switch (onboardingData.challenge) {
        case 'consistency':
          habits.push("Same wake-up time every day");
          habits.push("Activity tracking");
          break;
        case 'time-management':
          habits.push("Set 3 MITs (Most Important Tasks) daily");
          habits.push("Use time boxing for activities");
          break;
        case 'tracking-progress':
          habits.push("Daily journal entry");
          habits.push("Weekly review and reflection");
          break;
        case 'procrastination':
          habits.push("'Just 5 minutes' rule for difficult tasks");
          habits.push("Reward system for task completion");
          break;
      }
    }
    
    // MBTI-based habits
    if (onboardingData.mbtiType) {
      if (onboardingData.mbtiType.startsWith('I')) { // Introverts
        habits.push("Schedule alone time for recharging");
      } else if (onboardingData.mbtiType.startsWith('E')) { // Extroverts
        habits.push("Plan social activities for motivation");
      }
      
      if (onboardingData.mbtiType.includes('N')) { // Intuitive
        habits.push("Brainstorming sessions for big-picture thinking");
      } else if (onboardingData.mbtiType.includes('S')) { // Sensing
        habits.push("Break complex projects into concrete steps");
      }
    }
    
    // Return 4-6 habits maximum
    return habits.slice(0, Math.min(6, habits.length));
  }
  
  // Generate personalized weekly focus areas
  private static generatePersonalizedWeeklyFocus(onboardingData: OnboardingData): string[] {
    const focusAreas: string[] = [];
    
    // Add focus area based on primary goal
    if (onboardingData.goal) {
      switch (onboardingData.goal) {
        case 'productivity':
          focusAreas.push("Optimize your daily workflow");
          focusAreas.push("Identify and eliminate productivity blockers");
          break;
        case 'focus':
          focusAreas.push("Create distraction-free work environments");
          focusAreas.push("Practice sustained attention through daily focus blocks");
          break;
        case 'task-management':
          focusAreas.push("Refine your task organization system");
          focusAreas.push("Master prioritization techniques");
          break;
        case 'big-goals':
          focusAreas.push("Break down your main goal into weekly milestones");
          focusAreas.push("Develop accountability mechanisms for your goals");
          break;
      }
    }
    
    // Add focus area based on challenge
    if (onboardingData.challenge) {
      switch (onboardingData.challenge) {
        case 'consistency':
          focusAreas.push("Build streak-based habits to maintain consistency");
          break;
        case 'time-management':
          focusAreas.push("Master time blocking and calendar management");
          break;
        case 'tracking-progress':
          focusAreas.push("Implement effective progress tracking metrics");
          break;
        case 'procrastination':
          focusAreas.push("Develop strategies to overcome task resistance");
          break;
      }
    }
    
    // Add MBTI-specific focus areas
    if (onboardingData.mbtiType) {
      if (onboardingData.mbtiType.includes('J')) { // Judging types
        focusAreas.push("Balance structured planning with adaptability");
      } else if (onboardingData.mbtiType.includes('P')) { // Perceiving types
        focusAreas.push("Create flexible structures that support spontaneity");
      }
    }
    
    // Add general focus area based on time commitment
    if (onboardingData.timeCommitment) {
      switch (onboardingData.timeCommitment) {
        case 'less-than-30':
          focusAreas.push("Maximize impact of short productivity sessions");
          break;
        case '30-to-60':
          focusAreas.push("Optimize your daily hour for peak productivity");
          break;
        case '60-to-120':
          focusAreas.push("Balance focus work with essential breaks");
          break;
        case 'unlimited':
          focusAreas.push("Structure your extended productivity time for sustainability");
          break;
      }
    }
    
    // Return 3-4 focus areas
    return focusAreas.slice(0, Math.min(4, focusAreas.length));
  }
  
  // Generate personalized resources based on onboarding data
  private static generatePersonalizedResources(onboardingData: OnboardingData): string[] {
    const resources: string[] = [];
    
    // Add resources based on goal
    if (onboardingData.goal) {
      switch (onboardingData.goal) {
        case 'productivity':
          resources.push("'Atomic Habits' by James Clear - productivity through small changes");
          resources.push("Time blocking technique guide");
          break;
        case 'focus':
          resources.push("'Deep Work' by Cal Newport - focus in a distracted world");
          resources.push("Guided meditation for improved concentration");
          break;
        case 'task-management':
          resources.push("'Getting Things Done' by David Allen - task management system");
          resources.push("Task prioritization matrix template");
          break;
        case 'big-goals':
          resources.push("'The 12 Week Year' by Brian Moran - achieving more in less time");
          resources.push("Goal breakdown worksheet");
          break;
      }
    }
    
    // Add MBTI-specific resources
    if (onboardingData.mbtiType) {
      // Introverts vs Extroverts
      if (onboardingData.mbtiType.startsWith('I')) {
        resources.push("Productivity techniques for introverts");
      } else if (onboardingData.mbtiType.startsWith('E')) {
        resources.push("Collaboration and social accountability methods");
      }
      
      // Specific MBTI types with well-known challenges
      switch (onboardingData.mbtiType) {
        case 'INTJ':
        case 'ENTJ':
          resources.push("Balancing perfectionism with progress");
          break;
        case 'INFP':
        case 'ENFP':
          resources.push("Structure and routine for creative minds");
          break;
        case 'ISTJ':
        case 'ESTJ':
          resources.push("Adapting to change while maintaining productivity");
          break;
      }
    }
    
    // Add resources based on challenge
    if (onboardingData.challenge) {
      switch (onboardingData.challenge) {
        case 'consistency':
          resources.push("Habit tracker template");
          resources.push("'Tiny Habits' by BJ Fogg - small changes for consistency");
          break;
        case 'time-management':
          resources.push("Eisenhower Matrix for time management");
          resources.push("'168 Hours' by Laura Vanderkam - time management strategies");
          break;
        case 'tracking-progress':
          resources.push("Progress journal template");
          resources.push("OKR (Objectives and Key Results) framework guide");
          break;
        case 'procrastination':
          resources.push("Pomodoro technique guide");
          resources.push("'Eat That Frog' by Brian Tracy - overcoming procrastination");
          break;
      }
    }
    
    // Return a reasonable number of resources
    return resources.slice(0, Math.min(7, resources.length));
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
