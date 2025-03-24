
import React from 'react';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Timer, Coffee } from 'lucide-react';

interface PomodoroSettingsProps {
  focusMinutes: number;
  breakMinutes: number;
  onFocusMinutesChange: (value: number) => void;
  onBreakMinutesChange: (value: number) => void;
}

const PomodoroSettings: React.FC<PomodoroSettingsProps> = ({
  focusMinutes,
  breakMinutes,
  onFocusMinutesChange,
  onBreakMinutesChange
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-lg">
          Timer Settings
        </CardTitle>
        <CardDescription>
          Customize your focus and break durations
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="flex items-center">
              <Timer className="h-4 w-4 mr-2 text-red-500" />
              Focus Duration: {focusMinutes} minutes
            </Label>
            <span className="text-sm text-gray-500">{focusMinutes} min</span>
          </div>
          <Slider
            value={[focusMinutes]}
            min={5}
            max={60}
            step={5}
            onValueChange={(value) => onFocusMinutesChange(value[0])}
            className="py-2"
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="flex items-center">
              <Coffee className="h-4 w-4 mr-2 text-yellow-500" />
              Break Duration: {breakMinutes} minutes
            </Label>
            <span className="text-sm text-gray-500">{breakMinutes} min</span>
          </div>
          <Slider
            value={[breakMinutes]}
            min={1}
            max={30}
            step={1}
            onValueChange={(value) => onBreakMinutesChange(value[0])}
            className="py-2"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default PomodoroSettings;
