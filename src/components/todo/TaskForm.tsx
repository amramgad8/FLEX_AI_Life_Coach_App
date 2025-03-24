
import { useState, useEffect } from 'react';
import { EnhancedTodo } from '@/models/Todo';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { TimePicker } from '@/components/ui/time-picker';
import { 
  CalendarIcon, 
  Clock, 
  CheckCircle2, 
  Flag, 
  X 
} from 'lucide-react';
import { format } from 'date-fns';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface TaskFormProps {
  task?: EnhancedTodo;
  onSubmit: (task: Partial<EnhancedTodo>) => void;
  onCancel: () => void;
  isCreating?: boolean;
}

const PRIORITIES = [
  { value: 'low', label: 'Low', color: 'bg-flex-green' },
  { value: 'medium', label: 'Medium', color: 'bg-flex-yellow' },
  { value: 'high', label: 'High', color: 'bg-flex-orange' }
];

const DURATIONS = [15, 30, 45, 60, 90, 120];

const TaskForm = ({ task, onSubmit, onCancel, isCreating = false }: TaskFormProps) => {
  const [formData, setFormData] = useState<Partial<EnhancedTodo>>({
    title: '',
    description: '',
    priority: 'medium',
    duration: 30,
    dueDate: new Date(),
    startTime: new Date(),
    endTime: new Date(Date.now() + 30 * 60 * 1000),
    completed: false
  });

  useEffect(() => {
    if (task) {
      setFormData({
        ...task,
        startTime: task.startTime || new Date(),
        endTime: task.endTime || new Date(Date.now() + (task.duration || 30) * 60 * 1000),
        description: task.description || ''
      });
    }
  }, [task]);

  const handleChange = (field: keyof typeof formData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const calculateEndTime = (startTime: Date, durationMinutes: number): Date => {
    const end = new Date(startTime);
    end.setMinutes(end.getMinutes() + durationMinutes);
    return end;
  };

  const handleDurationChange = (duration: number) => {
    const startTime = formData.startTime || new Date();
    const endTime = calculateEndTime(startTime, duration);
    
    setFormData(prev => ({
      ...prev,
      duration,
      endTime
    }));
  };

  const handleStartTimeChange = (time: Date) => {
    const endTime = calculateEndTime(time, formData.duration || 30);
    
    setFormData(prev => ({
      ...prev,
      startTime: time,
      endTime
    }));
  };

  return (
    <Card className={cn("w-full max-w-md mx-auto")}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{isCreating ? 'Create New Task' : 'Edit Task'}</span>
          <Button variant="ghost" size="icon" onClick={onCancel}>
            <X className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Task Name</Label>
            <Input
              id="title"
              placeholder="Enter task name"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Task details (optional)"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={3}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Priority</Label>
              <Select
                value={formData.priority?.toString()}
                onValueChange={(value) => handleChange('priority', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  {PRIORITIES.map((priority) => (
                    <SelectItem key={priority.value} value={priority.value}>
                      <div className="flex items-center">
                        <div className={`w-3 h-3 rounded-full ${priority.color} mr-2`}></div>
                        {priority.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Due Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.dueDate ? (
                      format(formData.dueDate, 'PPP')
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.dueDate}
                    onSelect={(date) => handleChange('dueDate', date)}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Duration</Label>
            <div className="flex flex-wrap gap-2">
              {DURATIONS.map((duration) => (
                <Button
                  key={duration}
                  type="button"
                  variant={formData.duration === duration ? 'default' : 'outline'}
                  onClick={() => handleDurationChange(duration)}
                  className={formData.duration === duration ? 'bg-flex-green text-white' : ''}
                  size="sm"
                >
                  {duration} min
                </Button>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Start Time</Label>
              <TimePicker
                value={formData.startTime}
                onChange={handleStartTimeChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label>End Time</Label>
              <TimePicker
                value={formData.endTime}
                onChange={(time) => handleChange('endTime', time)}
                disabled
              />
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between border-t p-4">
          <Button variant="outline" type="button" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" className="bg-flex-gradient text-white">
            {isCreating ? (
              <>
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Create Task
              </>
            ) : (
              <>
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default TaskForm;
