
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
  // Try to parse if it's a string that looks like JSON
  if (typeof response === 'string') {
    try {
      const parsed = JSON.parse(response);
      if (parsed && parsed.header_note && parsed.goal && parsed.milestones) {
        return parsed;
      }
    } catch {
      // Not JSON, leave as is
    }
  }
  
  // Check if response.plan exists and contains a valid plan structure
  if (response && typeof response === 'object' && response.plan && 
      typeof response.plan === 'object' && 
      response.plan.header_note && response.plan.goal && response.plan.milestones) {
    return response.plan;
  }
  
  // If response itself is a valid plan object
  if (response && typeof response === 'object' && 
      response.header_note && response.goal && response.milestones) {
    return response;
  }
  
  return null;
}
