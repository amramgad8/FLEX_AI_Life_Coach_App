import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

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
    learning_duration: 4, // Default 4 weeks
    fixed_commitments: '',
    intensity_level: 'Balanced',
    peak_focus_time: '',
    habits: '',
    rest_days: '',
    additional_notes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting form data:', formData);
    onSubmit(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
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
          <Label htmlFor="learning_duration">Learning Duration (weeks)</Label>
          <Input
            id="learning_duration"
            name="learning_duration"
            type="number"
            min="1"
            max="52"
            value={formData.learning_duration}
            onChange={handleChange}
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
          <Label htmlFor="fixed_commitments">Fixed Time Commitments (optional)</Label>
          <Input
            id="fixed_commitments"
            name="fixed_commitments"
            value={formData.fixed_commitments}
            onChange={handleChange}
            placeholder="e.g., 9:00 AM–5:00 PM work, 6:00 PM–7:00 PM gym"
          />
        </div>

        <div>
          <Label htmlFor="intensity_level">Preferred Intensity Level</Label>
          <Select
            value={formData.intensity_level}
            onValueChange={(value) => handleSelectChange('intensity_level', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select intensity level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Relaxed">Relaxed</SelectItem>
              <SelectItem value="Balanced">Balanced</SelectItem>
              <SelectItem value="Intensive">Intensive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="peak_focus_time">Peak Focus Time (optional)</Label>
          <Select
            value={formData.peak_focus_time}
            onValueChange={(value) => handleSelectChange('peak_focus_time', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select peak focus time" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Morning">Morning</SelectItem>
              <SelectItem value="Afternoon">Afternoon</SelectItem>
              <SelectItem value="Evening">Evening</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="habits">Habits to Include (optional)</Label>
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

        <div>
          <Label htmlFor="additional_notes">Additional Notes (optional)</Label>
          <Textarea
            id="additional_notes"
            name="additional_notes"
            value={formData.additional_notes}
            onChange={handleChange}
            placeholder="Add any additional considerations for your plan"
            rows={3}
          />
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