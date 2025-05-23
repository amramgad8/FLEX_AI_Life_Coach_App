import { ChatMessage } from '../types/chat';

// TODO: Implement real extraction logic from chat messages
export function extractUserProfileFromChat(messages: ChatMessage[]) {
  // This should parse the chat messages to extract real user preferences
  // For now, return mock data for testing
  return {
    goal: 'Learn SQL for Data Engineering',
    wake_time: '07:00',
    sleep_time: '23:00',
    focus_periods: 4,
    break_duration: 5,
    work_style: 'structured',
    habits: '',
    rest_days: ''
  };
} 