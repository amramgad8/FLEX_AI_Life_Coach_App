
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
export function extractPlanData(response: any): any {
  console.log('Extracting plan data from response:', response);
  
  // If response is null or undefined
  if (!response) {
    console.log('Response is null or undefined');
    return null;
  }
  
  // Try to parse if it's a string that looks like JSON
  if (typeof response === 'string') {
    console.log('Response is string, attempting to parse:', response.substring(0, 200) + '...');
    
    // Try direct JSON parse
    try {
      const parsed = JSON.parse(response);
      if (isValidPlan(parsed)) {
        console.log('Found valid plan in string response:', parsed);
        return parsed;
      }
    } catch (e) {
      console.log('Direct JSON parse failed:', e);
    }
    
    // Try to extract JSON from markdown code blocks
    const jsonMatch = response.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
    if (jsonMatch) {
      try {
        const parsed = JSON.parse(jsonMatch[1]);
        if (isValidPlan(parsed)) {
          console.log('Found valid plan in markdown block:', parsed);
          return parsed;
        }
      } catch (e) {
        console.log('Markdown JSON parse failed:', e);
      }
    }
    
    // If string contains plan-like keywords, try to extract
    if (response.includes('goal') && response.includes('tasks')) {
      console.log('String contains plan keywords but not valid JSON');
    }
    
    return null;
  }
  
  // Check if response.plan exists and contains a valid plan structure
  if (response && typeof response === 'object' && response.plan) {
    console.log('Checking response.plan:', response.plan);
    if (isValidPlan(response.plan)) {
      console.log('Found valid plan in response.plan:', response.plan);
      return response.plan;
    }
  }
  
  // If response itself is a valid plan object
  if (response && typeof response === 'object') {
    console.log('Checking if response itself is a plan:', response);
    if (isValidPlan(response)) {
      console.log('Found valid plan in response root:', response);
      return response;
    }
    
    // Check for milestones (old format) and convert to weekly_phases
    if (response.header_note && response.goal && response.milestones) {
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
  }
  
  console.log('No valid plan found in response');
  return null;
}

// Helper function to validate if an object is a valid plan
function isValidPlan(obj: any): boolean {
  if (!obj || typeof obj !== 'object') {
    return false;
  }
  
  // Check for required fields
  const hasRequiredFields = obj.header_note && obj.goal && 
    (obj.weekly_phases || obj.milestones);
  
  if (!hasRequiredFields) {
    console.log('Plan missing required fields:', {
      has_header_note: !!obj.header_note,
      has_goal: !!obj.goal,
      has_weekly_phases: !!obj.weekly_phases,
      has_milestones: !!obj.milestones
    });
    return false;
  }
  
  // Check if weekly_phases is an array
  if (obj.weekly_phases && !Array.isArray(obj.weekly_phases)) {
    console.log('weekly_phases is not an array');
    return false;
  }
  
  // Check if milestones is an array (for old format)
  if (obj.milestones && !Array.isArray(obj.milestones)) {
    console.log('milestones is not an array');
    return false;
  }
  
  return true;
}
