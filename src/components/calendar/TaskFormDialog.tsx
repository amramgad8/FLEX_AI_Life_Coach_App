import React, { useState, useEffect } from 'react';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Switch } from '@/components/ui/switch';
import { format } from 'date-fns';
import { CalendarIcon, Clock } from 'lucide-react';
import {
  EnhancedTodo,
  TaskPriority,
  TaskCategory,
  PRIORITY_CONFIG,
  CATEGORY_CONFIG,
  EisenhowerQuadrant,
  EISENHOWER_CONFIG
} from '@/models/Todo';

interface TaskFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Partial<EnhancedTodo>) => void;
  task?: EnhancedTodo;
  selectedDate: Date;
}

const TaskFormDialog: React.FC<TaskFormDialogProps> = ({ 
  isOpen, 
  onClose, 
  onSave, 
  task, 
  selectedDate 
}) => {
  const [formData, setFormData] = useState<Partial<EnhancedTodo>>({
    title: '',
    description: '',
    priority: 'medium',
    category: 'other',
    duration: 30,
    dueDate: selectedDate,
    location: '',
    eisenhowerQuadrant: undefined
  });

  // Time selection states
  const [startHour, setStartHour] = useState<string>("09");
  const [startMinute, setStartMinute] = useState<string>("00");
  const [startAmPm, setStartAmPm] = useState<string>("AM");

  // Update form when task or selectedDate changes
  useEffect(() => {
    if (formData.dueDate) {
      const dueDate = new Date(formData.dueDate);
      let hours = parseInt(startHour, 10);
  
      if (startAmPm === "PM" && hours < 12) {
        hours += 12;
      } else if (startAmPm === "AM" && hours === 12) {
        hours = 0;
      }
  
      const minutes = parseInt(startMinute, 10);
      const startTime = new Date(dueDate);
      startTime.setHours(hours, minutes, 0, 0);
  
      const duration = formData.duration || 30;
      const endTime = new Date(startTime.getTime() + duration * 60000);
  
      setFormData(prev => ({
        ...prev,
        startTime,
        endTime
      }));
    }
  }, [startHour, startMinute, startAmPm, formData.dueDate, formData.duration]);
  

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: parseInt(value, 10)
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDateChange = (date: Date | undefined) => {
    setFormData(prev => ({
      ...prev,
      dueDate: date
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!formData.title || !formData.dueDate) {
      alert("Please fill in all required fields");
      return;
    }
  
    // حساب startTime من dueDate + الوقت اللي حدده اليوزر
    const dueDate = new Date(formData.dueDate);
    let hours = parseInt(startHour, 10);
    if (startAmPm === "PM" && hours < 12) {
      hours += 12;
    } else if (startAmPm === "AM" && hours === 12) {
      hours = 0;
    }
    const minutes = parseInt(startMinute, 10);
    const startTime = new Date(dueDate);
    startTime.setHours(hours, minutes, 0, 0);
  
    // حساب endTime من startTime + المدة
    const duration = formData.duration || 30;
    const endTime = new Date(startTime.getTime() + duration * 60000);
  
    // تخزين المهمة
    onSave({
      ...formData,
      startTime,
      endTime
    });
  
    // غلق الفورم
    onClose();
  };  
    

  // Generate hours for select
  const hours = Array.from({ length: 12 }, (_, i) => {
    const hour = i + 1;
    return {
      value: hour.toString().padStart(2, "0"),
      label: hour.toString()
    };
  });

  // Generate minutes for select (in 5-minute increments)
  const minutes = Array.from({ length: 12 }, (_, i) => {
    const minute = i * 5;
    return {
      value: minute.toString().padStart(2, "0"),
      label: minute.toString().padStart(2, "0")
    };
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{task ? 'Edit Task' : 'Create New Task'}</DialogTitle>
            <DialogDescription>
              {task ? 'Edit the details of your task' : 'Add a new task to your schedule'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                placeholder="Task title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Task description (optional)"
                value={formData.description || ''}
                onChange={handleChange}
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Priority</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value) => handleSelectChange('priority', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(PRIORITY_CONFIG).map(([value, { label }]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => handleSelectChange('category', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(CATEGORY_CONFIG).map(([value, { label }]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <Label>Eisenhower Matrix</Label>
              <Select
                value={formData.eisenhowerQuadrant || 'not-categorized'}
                onValueChange={(value) => handleSelectChange('eisenhowerQuadrant', value === 'not-categorized' ? undefined : value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Categorize in Eisenhower Matrix" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="not-categorized">Not categorized</SelectItem>
                  {Object.entries(EISENHOWER_CONFIG).map(([value, { label, description }]) => (
                    <SelectItem key={value} value={value}>
                      {label} - {description}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Input
                  id="duration"
                  name="duration"
                  type="number"
                  value={formData.duration}
                  onChange={handleNumberChange}
                  min={1}
                />
              </div>
              
              <div>
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
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.dueDate}
                      onSelect={handleDateChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            
            {/* Time Selection */}
            <div>
              <Label>Start Time</Label>
              <div className="flex gap-2 items-center mt-1.5">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <Select value={startHour} onValueChange={setStartHour}>
                  <SelectTrigger className="w-20">
                    <SelectValue placeholder="Hour" />
                  </SelectTrigger>
                  <SelectContent>
                    {hours.map(hour => (
                      <SelectItem key={hour.value} value={hour.value}>
                        {hour.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <span>:</span>
                
                <Select value={startMinute} onValueChange={setStartMinute}>
                  <SelectTrigger className="w-20">
                    <SelectValue placeholder="Min" />
                  </SelectTrigger>
                  <SelectContent>
                    {minutes.map(minute => (
                      <SelectItem key={minute.value} value={minute.value}>
                        {minute.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select value={startAmPm} onValueChange={setStartAmPm}>
                  <SelectTrigger className="w-20">
                    <SelectValue placeholder="AM/PM" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AM">AM</SelectItem>
                    <SelectItem value="PM">PM</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {formData.startTime && formData.endTime && (
                <p className="text-xs text-muted-foreground mt-1">
                  Scheduled: {format(new Date(formData.startTime), 'h:mm a')} - {format(new Date(formData.endTime), 'h:mm a')}
                </p>
              )}
            </div>
            
            <div>
              <Label htmlFor="location">Location (optional)</Label>
              <Input
                id="location"
                name="location"
                placeholder="Task location"
                value={formData.location || ''}
                onChange={handleChange}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {task ? 'Update Task' : 'Create Task'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TaskFormDialog;
