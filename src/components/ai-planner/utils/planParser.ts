
// Helper to robustly parse plan string
export function parsePlanString(planString: string) {
  if (!planString) return null;
  let cleaned = planString.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json/, '').replace(/```$/, '').trim();
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```/, '').replace(/```$/, '').trim();
  }
  try {
    return JSON.parse(cleaned);
  } catch {
    return null;
  }
}

// Helper to extract plan data from response
export function extractPlanData(response: any) {
  console.log('Extracting plan data from response:', response);
  
  // Try to parse if it's a string that looks like JSON
  if (typeof response === 'string') {
    try {
      const parsed = JSON.parse(response);
      if (parsed && parsed.header_note && parsed.goal && parsed.weekly_phases) {
        console.log('Found valid plan in string response:', parsed);
        return parsed;
      }
    } catch {
      // Not JSON, leave as is
    }
  }
  
  // Check if response.plan exists and contains a valid plan structure
  if (response && typeof response === 'object' && response.plan && 
      typeof response.plan === 'object' && 
      response.plan.header_note && response.plan.goal && response.plan.weekly_phases) {
    console.log('Found valid plan in response.plan:', response.plan);
    return response.plan;
  }
  
  // If response itself is a valid plan object
  if (response && typeof response === 'object' && 
      response.header_note && response.goal && response.weekly_phases) {
    console.log('Found valid plan in response root:', response);
    return response;
  }
  
  // Check for milestones (old format) and convert to weekly_phases
  if (response && typeof response === 'object' && 
      response.header_note && response.goal && response.milestones) {
    console.log('Converting milestones to weekly_phases format:', response);
    const converted = {
      header_note: response.header_note,
      goal: response.goal,
      weekly_phases: response.milestones.map((milestone: any, index: number) => ({
        week: index + 1,
        milestone: milestone.title || milestone.milestone || `Week ${index + 1}`,
        tasks: milestone.tasks || []
      }))
    };
    return converted;
  }
  
  console.log('No valid plan found in response');
  return null;
}
