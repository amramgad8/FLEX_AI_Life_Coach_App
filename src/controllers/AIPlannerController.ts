
import { AIGeneratedPlan, UserPreferences, ScheduleItem } from "../models/AIPlanner";
import { ApiService } from "../services/ApiService";

export class AIPlannerController {
  private static ENDPOINT = '/ai-planner';
  private static useApi = false; // Set to true when your FastAPI backend is ready

  static async generatePlan(preferences: UserPreferences): Promise<AIGeneratedPlan> {
    try {
      if (this.useApi) {
        // Use the API service
        return await ApiService.post<AIGeneratedPlan>(this.ENDPOINT, preferences);
      } else {
        // Fallback to mock data
        console.log("Generating plan based on preferences:", preferences);
        
        // Create a mock daily schedule based on preferences
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
          // Add more activities based on user preferences
        ];

        // Return a complete plan with resources
        return {
          dailySchedule,
          weeklyFocus: [
            "Complete project milestones",
            "Learn new development skills",
            "Balance work with self-care"
          ],
          suggestedHabits: [
            "Daily coding practice",
            "10-minute meditation",
            "Regular stretching breaks"
          ],
          resources: [
            "Deep Work by Cal Newport - book recommendation",
            "Pomodoro Technique - productivity method",
            "Mindfulness practices for better focus",
            "Task batching to improve efficiency",
            "The importance of regular breaks for productivity"
          ]
        };
      }
    } catch (error) {
      console.error('Failed to generate AI plan:', error);
      throw error;
    }
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
