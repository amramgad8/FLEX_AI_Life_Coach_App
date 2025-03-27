
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { UserPreferences } from '@/models/AIPlanner';
import PreferenceFormField from './PreferenceFormField';
import { Clock, Timer, Target } from 'lucide-react';
import { Form } from '@/components/ui/form';

interface ModifyPlanDialogProps {
  isOpen: boolean;
  onClose: () => void;
  preferences: UserPreferences;
  onSave: (updatedPreferences: UserPreferences) => void;
}

const ModifyPlanDialog = ({ isOpen, onClose, preferences, onSave }: ModifyPlanDialogProps) => {
  const [formValues, setFormValues] = React.useState<UserPreferences>({ ...preferences });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues(prev => ({
      ...prev,
      [name]: parseInt(value, 10)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formValues);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Modify Your Plan</DialogTitle>
          <DialogDescription>
            Update your preferences to regenerate your personalized plan
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <PreferenceFormField
              id="wakeUpTime"
              name="wakeUpTime"
              label="Wake Up Time"
              value={formValues.wakeUpTime}
              type="time"
              onChange={handleInputChange}
              icon={Clock}
            />
            
            <PreferenceFormField
              id="sleepTime"
              name="sleepTime"
              label="Sleep Time"
              value={formValues.sleepTime}
              type="time"
              onChange={handleInputChange}
              icon={Clock}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <PreferenceFormField
              id="focusPeriods"
              name="focusPeriods"
              label="Focus Periods"
              value={formValues.focusPeriods}
              type="number"
              min="1"
              max="10"
              onChange={handleNumberChange}
              icon={Target}
            />
            
            <PreferenceFormField
              id="breakDuration"
              name="breakDuration"
              label="Break Duration (min)"
              value={formValues.breakDuration}
              type="number"
              min="5"
              max="60"
              step="5"
              onChange={handleNumberChange}
              icon={Timer}
            />
          </div>

          <PreferenceFormField
            id="primaryGoal"
            name="primaryGoal"
            label="Primary Goal"
            value={formValues.primaryGoal}
            onChange={handleInputChange}
            placeholder="What's your main focus right now?"
            icon={Target}
          />

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-flex-green text-white hover:bg-flex-green-dark">
              Update Plan
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ModifyPlanDialog;