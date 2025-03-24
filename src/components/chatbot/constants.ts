
// Sample AI responses for demo
export const ASSISTANT_RESPONSES = [
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
export const PRODUCTIVITY_TIPS = [
  "Try the Pomodoro Technique: 25 minutes of focused work, then a 5-minute break.",
  "Group similar tasks together to reduce context switching.",
  "Schedule your most challenging tasks during your peak energy hours.",
  "Use the 2-minute rule: If a task takes less than 2 minutes, do it immediately.",
  "Block distractions during your focused work periods.",
  "Plan your day the night before to hit the ground running."
];
