
import React from 'react';
import { UserPreferences } from '../../models/AIPlanner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import PreferenceFormField from './PreferenceFormField';
import { Brain, Clock, Timer, Target, Wand2 } from 'lucide-react';

interface PreferencesFormProps {
  preferences: UserPreferences;
  isEditing: boolean;
  isGenerating: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onNumberChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onGeneratePlan: () => void;
  hasGeneratedPlan: boolean;
}

const PreferencesForm = ({
  preferences,
  isEditing,
  isGenerating,
  onInputChange,
  onNumberChange,
  onGeneratePlan,
  hasGeneratedPlan
}: PreferencesFormProps) => {
  return (
    <Card className="bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-chameleon-green" />
          Your Preferences
        </CardTitle>
        <CardDescription>
          Tell us about your routine and goals to generate a personalized plan
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className={`space-y-4 ${!isEditing ? 'opacity-50 pointer-events-none' : ''}`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <PreferenceFormField
              id="wakeUpTime"
              name="wakeUpTime"
              label="Wake Up Time"
              value={preferences.wakeUpTime}
              type="time"
              onChange={onInputChange}
              icon={Clock}
            />
            
            <PreferenceFormField
              id="sleepTime"
              name="sleepTime"
              label="Sleep Time"
              value={preferences.sleepTime}
              type="time"
              onChange={onInputChange}
              icon={Clock}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <PreferenceFormField
              id="focusPeriods"
              name="focusPeriods"
              label="Focus Periods Per Day"
              value={preferences.focusPeriods}
              type="number"
              min="1"
              max="10"
              onChange={onNumberChange}
              icon={Target}
            />
            
            <PreferenceFormField
              id="breakDuration"
              name="breakDuration"
              label="Break Duration (minutes)"
              value={preferences.breakDuration}
              type="number"
              min="5"
              max="60"
              step="5"
              onChange={onNumberChange}
              icon={Timer}
            />
          </div>

          <PreferenceFormField
            id="primaryGoal"
            name="primaryGoal"
            label="Primary Goal"
            value={preferences.primaryGoal}
            onChange={onInputChange}
            placeholder="What's your main focus right now?"
            icon={Target}
          />
        </div>

        {!hasGeneratedPlan && (
  <div className="mt-6 flex justify-center">
    <Button 
      onClick={onGeneratePlan} 
      disabled={isGenerating}
      className="gap-2 bg-chameleon-gradient hover:opacity-90 text-black hover:text-white"
      size="lg"
    >
      <Wand2 className="h-5 w-5" />
      {isGenerating ? 'Generating...' : 'Generate Plan'}
    </Button>
  </div>
)}

      </CardContent>
    </Card>
  );
};

export default PreferencesForm;
