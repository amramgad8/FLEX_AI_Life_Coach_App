
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { OnboardingData } from '@/pages/Onboarding';
import { useNavigate } from 'react-router-dom';

interface OnboardingSummaryProps {
  data: OnboardingData;
  onEdit: (stepIndex: number) => void;
  onFinish: () => void;
}

const OnboardingSummary = ({ data, onEdit, onFinish }: OnboardingSummaryProps) => {
  const navigate = useNavigate();

  // Format data for summary display
  const getSummaryItem = (label: string, value: string | undefined, editIndex?: number) => {
    return (
      <div className="flex justify-between items-start mb-3 pb-3 border-b last:border-0">
        <div>
          <h4 className="font-medium text-gray-700">{label}</h4>
          <p className="text-muted-foreground">{value || 'Not specified'}</p>
        </div>
        
        {editIndex !== undefined && (
          <Button variant="ghost" size="sm" onClick={() => onEdit(editIndex)}>
            Edit
          </Button>
        )}
      </div>
    );
  };

  // Get the readable value for each step
  const getReadableValue = (key: string, value: any) => {
    if (!value) return 'Not specified';
    
    // Some basic transformations
    switch (key) {
      case 'goal':
        switch(value) {
          case 'productivity': return 'Boost Productivity';
          case 'focus': return 'Improve Focus';
          case 'task-management': return 'Better Task Management';
          case 'big-goals': return 'Achieve Big Goals';
          default: return value;
        }
      case 'taskManagement':
        switch(value) {
          case 'lists': return 'Lists & To-Dos';
          case 'time-blocking': return 'Time Blocking';
          case 'goal-oriented': return 'Goal-Oriented Plans';
          case 'unsure': return 'Not Sure Yet';
          default: return value;
        }
      case 'timeCommitment':
        switch(value) {
          case 'less-than-30': return 'Less than 30 min';
          case '30-to-60': return '30 min - 1 hour';
          case '60-to-120': return '1-2 hours';
          case 'unlimited': return 'As much as needed!';
          default: return value;
        }
      case 'challenge':
        switch(value) {
          case 'consistency': return 'Staying consistent';
          case 'time-management': return 'Time management';
          case 'tracking-progress': return 'Tracking progress';
          case 'procrastination': return 'Procrastination';
          default: return value;
        }
      case 'motivation':
        switch(value) {
          case 'goals': return 'Reaching Goals';
          case 'rewards': return 'Winning Rewards';
          case 'streaks': return 'Maintaining Streaks';
          case 'progress': return 'Seeing Progress';
          default: return value;
        }
      case 'personalDetails':
        if (typeof value === 'object') {
          return Object.entries(value)
            .filter(([_, val]) => val)
            .map(([key, val]) => `${key.charAt(0).toUpperCase() + key.slice(1)}: ${val}`)
            .join(', ');
        }
        return 'Not specified';
      default:
        return value;
    }
  };

  const goToAIPlanner = () => {
    // Transfer onboarding data to localStorage for AI Planner to use
    localStorage.setItem('onboardingData', JSON.stringify(data));
    // Navigate to the AI Planner page
    navigate('/ai-planner');
  };

  return (
    <Card className="max-w-xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Your Personalized Profile</CardTitle>
        <CardDescription>Here's a summary of your preferences</CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-1">
        {getSummaryItem('Your Goal', getReadableValue('goal', data.goal), 0)}
        {getSummaryItem('Task Management', getReadableValue('taskManagement', data.taskManagement), 1)}
        {getSummaryItem('Time Commitment', getReadableValue('timeCommitment', data.timeCommitment), 2)}
        {getSummaryItem('Personal Details', getReadableValue('personalDetails', data.personalDetails), 3)}
        {getSummaryItem('MBTI Personality Type', data.mbtiType || 'Not specified', 4)}
        {getSummaryItem('Biggest Challenge', getReadableValue('challenge', data.challenge), 5)}
        {getSummaryItem('Motivation', getReadableValue('motivation', data.motivation), 6)}
      </CardContent>
      
      <CardFooter className="flex flex-col gap-3">
        <Button onClick={onFinish} className="w-full">
          Complete & Go to Dashboard
        </Button>
        
        <Button 
          onClick={goToAIPlanner} 
          variant="default" 
          className="w-full bg-green-600 hover:bg-green-700"
        >
          Get My Personalized Plan with AI
        </Button>
      </CardFooter>
    </Card>
  );
};

export default OnboardingSummary;
