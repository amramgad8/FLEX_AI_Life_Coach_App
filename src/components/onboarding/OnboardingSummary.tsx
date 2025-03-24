
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, ArrowRight } from 'lucide-react';
import { OnboardingData } from '@/pages/Onboarding';

interface OnboardingSummaryProps {
  data: OnboardingData;
  onEdit: (stepIndex: number) => void;
  onFinish: () => void;
}

const OnboardingSummary: React.FC<OnboardingSummaryProps> = ({ data, onEdit, onFinish }) => {
  // Helper to get readable values for summaries
  const getReadableValue = (field: string, value: string) => {
    // Map of step indices
    const stepIndices = {
      goal: 0,
      taskManagement: 1,
      timeCommitment: 2,
      personalDetails: 3,
      mbtiType: 4,
      challenge: 5,
      motivation: 6
    };
    
    // Maps for human-readable values
    const goalMap: Record<string, string> = {
      'productivity': 'Boost Productivity',
      'focus': 'Improve Focus',
      'task-management': 'Better Task Management',
      'big-goals': 'Achieve Big Goals'
    };
    
    const taskManagementMap: Record<string, string> = {
      'lists': 'Lists & To-Dos',
      'time-blocking': 'Time Blocking',
      'goal-oriented': 'Goal-Oriented Plans',
      'unsure': 'Not Sure Yet'
    };
    
    const timeCommitmentMap: Record<string, string> = {
      'less-than-30': 'Less than 30 min',
      '30-to-60': '30 min - 1 hour',
      '60-to-120': '1-2 hours',
      'unlimited': 'As much as needed!'
    };
    
    const challengeMap: Record<string, string> = {
      'consistency': 'Staying consistent',
      'time-management': 'Time management',
      'tracking-progress': 'Tracking progress',
      'procrastination': 'Procrastination'
    };
    
    const motivationMap: Record<string, string> = {
      'goals': 'Reaching Goals',
      'rewards': 'Winning Rewards',
      'streaks': 'Maintaining Streaks',
      'progress': 'Seeing Progress'
    };

    // Return the appropriate readable value
    switch (field) {
      case 'goal':
        return goalMap[value] || value;
      case 'taskManagement':
        return taskManagementMap[value] || value;
      case 'timeCommitment':
        return timeCommitmentMap[value] || value;
      case 'mbtiType':
        return value;
      case 'challenge':
        return challengeMap[value] || value;
      case 'motivation':
        return motivationMap[value] || value;
      default:
        return value;
    }
  };

  // Get emoji for field
  const getFieldEmoji = (field: string) => {
    switch (field) {
      case 'goal': return '🎯';
      case 'taskManagement': return '📋';
      case 'timeCommitment': return '⏰';
      case 'personalDetails': return '📊';
      case 'mbtiType': return '🧠';
      case 'challenge': return '🚧';
      case 'motivation': return '✨';
      default: return '📝';
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="shadow-lg border-0 mb-8">
          <CardHeader className="text-center pb-6 border-b">
            <CardTitle className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-500 to-blue-500">
              Your Profile Summary
            </CardTitle>
            <CardDescription className="text-base mt-2">
              Review your preferences before we create your personalized experience
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              {/* Goal */}
              <div className="flex justify-between items-start p-4 rounded-lg bg-green-50">
                <div>
                  <h3 className="font-medium text-lg flex items-center">
                    {getFieldEmoji('goal')} Your Goal
                  </h3>
                  <p className="text-gray-700 mt-1">
                    {getReadableValue('goal', data.goal)}
                  </p>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => onEdit(0)}
                  className="text-blue-600"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
              </div>

              {/* Task Management */}
              <div className="flex justify-between items-start p-4 rounded-lg bg-blue-50">
                <div>
                  <h3 className="font-medium text-lg flex items-center">
                    {getFieldEmoji('taskManagement')} Task Management
                  </h3>
                  <p className="text-gray-700 mt-1">
                    {getReadableValue('taskManagement', data.taskManagement)}
                  </p>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => onEdit(1)}
                  className="text-blue-600"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
              </div>

              {/* Time Commitment */}
              <div className="flex justify-between items-start p-4 rounded-lg bg-purple-50">
                <div>
                  <h3 className="font-medium text-lg flex items-center">
                    {getFieldEmoji('timeCommitment')} Time Commitment
                  </h3>
                  <p className="text-gray-700 mt-1">
                    {getReadableValue('timeCommitment', data.timeCommitment)}
                  </p>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => onEdit(2)}
                  className="text-blue-600"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
              </div>

              {/* Personal Details */}
              {Object.keys(data.personalDetails).length > 0 && (
                <div className="flex justify-between items-start p-4 rounded-lg bg-orange-50">
                  <div>
                    <h3 className="font-medium text-lg flex items-center">
                      {getFieldEmoji('personalDetails')} Personal Details
                    </h3>
                    <div className="text-gray-700 mt-1 space-y-1">
                      {data.personalDetails.height && (
                        <p>Height: {data.personalDetails.height} cm</p>
                      )}
                      {data.personalDetails.weight && (
                        <p>Weight: {data.personalDetails.weight} kg</p>
                      )}
                      {data.personalDetails.age && (
                        <p>Age: {data.personalDetails.age}</p>
                      )}
                      {data.personalDetails.gender && (
                        <p>Gender: {data.personalDetails.gender}</p>
                      )}
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => onEdit(3)}
                    className="text-blue-600"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                </div>
              )}

              {/* MBTI Type */}
              {data.mbtiType && (
                <div className="flex justify-between items-start p-4 rounded-lg bg-yellow-50">
                  <div>
                    <h3 className="font-medium text-lg flex items-center">
                      {getFieldEmoji('mbtiType')} MBTI Personality Type
                    </h3>
                    <p className="text-gray-700 mt-1">
                      {data.mbtiType === 'unknown' ? 'Not specified' : data.mbtiType}
                    </p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => onEdit(4)}
                    className="text-blue-600"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                </div>
              )}

              {/* Challenge */}
              <div className="flex justify-between items-start p-4 rounded-lg bg-red-50">
                <div>
                  <h3 className="font-medium text-lg flex items-center">
                    {getFieldEmoji('challenge')} Biggest Challenge
                  </h3>
                  <p className="text-gray-700 mt-1">
                    {getReadableValue('challenge', data.challenge)}
                  </p>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => onEdit(5)}
                  className="text-blue-600"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
              </div>

              {/* Motivation */}
              <div className="flex justify-between items-start p-4 rounded-lg bg-green-50">
                <div>
                  <h3 className="font-medium text-lg flex items-center">
                    {getFieldEmoji('motivation')} Motivation
                  </h3>
                  <p className="text-gray-700 mt-1">
                    {getReadableValue('motivation', data.motivation)}
                  </p>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => onEdit(6)}
                  className="text-blue-600"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Completion Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <Card className="shadow-lg border-0 bg-gradient-to-r from-green-50 to-blue-50">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">Ready to start your productivity journey?</h2>
              <p className="text-gray-700 mb-6">
                We'll use your preferences to customize your experience and help you achieve your goals.
              </p>
              <Button 
                onClick={onFinish}
                size="lg" 
                className="bg-flex-gradient text-white px-8"
              >
                Let's Get Started <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default OnboardingSummary;
