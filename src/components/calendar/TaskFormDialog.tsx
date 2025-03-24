
import React, { useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { CalendarIcon, Clock } from 'lucide-react';
import { EnhancedTodo, TaskPriority, TaskCategory, PRIORITY_CONFIG, CATEGORY_CONFIG } from '@/models/Todo';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';

interface TaskFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Partial<EnhancedTodo>) => void;
  task?: EnhancedTodo;
  selectedDate?: Date;
}

const DURATION_OPTIONS = [15, 30, 45, 60, 90, 120, 180];
const TIME_OPTIONS = Array.from({ length: 24 * 4 }, (_, i) => {
  const hour = Math.floor(i / 4);
  const minute = (i % 4) * 15;
  return {
    value: `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`,
    label: `${hour === 0 ? 12 : hour > 12 ? hour - 12 : hour}:${minute.toString().padStart(2, '0')} ${hour >= 12 ? 'PM' : 'AM'}`
  };
});

const TaskFormDialog: React.FC<TaskFormDialogProps> = ({
  isOpen,
  onClose,
  onSave,
  task,
  selectedDate
}) => {
  const [title, setTitle] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [priority, setPriority] = React.useState<TaskPriority>('medium');
  const [category, setCategory] = React.useState<TaskCategory>('other');
  const [dueDate, setDueDate] = React.useState<Date | undefined>(undefined);
  const [duration, setDuration] = React.useState(30);
  const [startTime, setStartTime] = React.useState('09:00');
  const [location, setLocation] = React.useState('');

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || '');
      setPriority(task.priority);
      setCategory(task.category || 'other');
      setDueDate(task.dueDate);
      setDuration(task.duration);
      setLocation(task.location || '');
      
      if (task.startTime) {
        const hours = new Date(task.startTime).getHours().toString().padStart(2, '0');
        const minutes = new Date(task.startTime).getMinutes().toString().padStart(2, '0');
        setStartTime(`${hours}:${minutes}`);
      }
    } else {
      // Reset form for new task
      setTitle('');
      setDescription('');
      setPriority('medium');
      setCategory('other');
      setDueDate(selectedDate);
      setDuration(30);
      setStartTime('09:00');
      setLocation('');
    }
  }, [task, selectedDate, isOpen]);

  const handleSave = () => {
    if (!title.trim()) return;
    
    // Parse time to create Date object
    let startTimeDate: Date | undefined;
    if (dueDate && startTime) {
      const [hours, minutes] = startTime.split(':').map(Number);
      startTimeDate = new Date(dueDate);
      startTimeDate.setHours(hours, minutes);
    }
    
    // Calculate end time based on duration
    let endTimeDate: Date | undefined;
    if (startTimeDate) {
      endTimeDate = new Date(startTimeDate);
      endTimeDate.setMinutes(endTimeDate.getMinutes() + duration);
    }
    
    onSave({
      id: task?.id,
      title,
      description: description || undefined,
      priority,
      category,
      dueDate,
      duration,
      startTime: startTimeDate,
      endTime: endTimeDate,
      location: location || undefined,
      completed: task?.completed || false
    });
    
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{task ? 'Edit Task' : 'Create Task'}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Task Name*</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task name"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Priority</Label>
              <div className="flex flex-wrap gap-2">
                {(Object.keys(PRIORITY_CONFIG) as TaskPriority[]).map((p) => (
                  <Button
                    key={p}
                    type="button"
                    variant={priority === p ? 'default' : 'outline'}
                    className={priority === p ? PRIORITY_CONFIG[p].color : ''}
                    onClick={() => setPriority(p)}
                  >
                    {PRIORITY_CONFIG[p].label}
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Category</Label>
              <div className="grid grid-cols-2 gap-2">
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={category}
                  onChange={(e) => setCategory(e.target.value as TaskCategory)}
                >
                  {(Object.keys(CATEGORY_CONFIG) as TaskCategory[]).map((c) => (
                    <option key={c} value={c}>
                      {CATEGORY_CONFIG[c].label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add details about this task..."
              className="min-h-[100px]"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Add location (optional)"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Due Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !dueDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dueDate ? format(dueDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dueDate}
                    onSelect={setDueDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <Label>Start Time</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <Clock className="mr-2 h-4 w-4" />
                    {startTime ? (
                      TIME_OPTIONS.find(t => t.value === startTime)?.label || startTime
                    ) : (
                      <span>Select time</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-48 p-0" align="start">
                  <div className="h-60 overflow-y-auto p-2">
                    {TIME_OPTIONS.map(time => (
                      <Button
                        key={time.value}
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={() => {
                          setStartTime(time.value);
                        }}
                      >
                        {time.label}
                      </Button>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Duration</Label>
            <div className="flex flex-wrap gap-2">
              {DURATION_OPTIONS.map((d) => (
                <Button
                  key={d}
                  type="button"
                  variant={duration === d ? 'default' : 'outline'}
                  onClick={() => setDuration(d)}
                >
                  {d} min
                </Button>
              ))}
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!title.trim()}>
            {task ? 'Update' : 'Create'} Task
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TaskFormDialog;
