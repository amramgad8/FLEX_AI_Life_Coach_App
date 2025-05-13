import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

interface AIPlannerFormProps {
  onSubmit: (formData: any) => void;
  isLoading: boolean;
}

const AIPlannerForm: React.FC<AIPlannerFormProps> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    goal: '',
    wake_time: '07:00',
    sleep_time: '23:00',
    focus_periods: 4,
    break_duration: 5,
    work_style: '',
    habits: '',
    rest_days: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting form data:', formData);
    onSubmit(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="goal">What's your specific goal?</Label>
            <Input
              id="goal"
              name="goal"
              value={formData.goal}
              onChange={handleChange}
              placeholder="e.g., Learn Python"
              required
            />
          </div>

          <div>
            <Label htmlFor="wake_time">Wake Up Time</Label>
            <Input
              id="wake_time"
              name="wake_time"
              type="time"
              value={formData.wake_time}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="sleep_time">Sleep Time</Label>
            <Input
              id="sleep_time"
              name="sleep_time"
              type="time"
              value={formData.sleep_time}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="focus_periods">Number of focus periods</Label>
            <Input
              id="focus_periods"
              name="focus_periods"
              type="number"
              min="1"
              max="8"
              value={formData.focus_periods}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="break_duration">Break duration (minutes)</Label>
            <Input
              id="break_duration"
              name="break_duration"
              type="number"
              min="5"
              max="30"
              value={formData.break_duration}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="work_style">Work Style (optional)</Label>
            <Input
              id="work_style"
              name="work_style"
              value={formData.work_style}
              onChange={handleChange}
              placeholder="e.g., structured, flexible"
            />
          </div>

          <div>
            <Label htmlFor="habits">Habits (optional)</Label>
            <Input
              id="habits"
              name="habits"
              value={formData.habits}
              onChange={handleChange}
              placeholder="e.g., daily journaling, exercise"
            />
          </div>

          <div>
            <Label htmlFor="rest_days">Rest Days (optional)</Label>
            <Input
              id="rest_days"
              name="rest_days"
              value={formData.rest_days}
              onChange={handleChange}
              placeholder="e.g., Saturday, Sunday"
            />
          </div>
        </div>

        <Button
          type="submit"
          className="w-full bg-flex-green hover:bg-flex-green-dark"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating Plan...
            </>
          ) : (
            'Generate Plan'
          )}
        </Button>
      </form>
    </Card>
  );
};

export default AIPlannerForm; 