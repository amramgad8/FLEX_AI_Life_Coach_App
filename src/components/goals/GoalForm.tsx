import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { format } from 'date-fns';
import { GoalNode } from '@/models/Goal';
import { CalendarIcon } from 'lucide-react';

interface GoalFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (goal: Partial<GoalNode>) => void;
  editGoal?: GoalNode | null;
  parentGoal?: GoalNode | null;
  goal?: GoalNode;
}

const GoalForm = ({ isOpen, onClose, onSave, editGoal, parentGoal }: GoalFormProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState<Date | undefined>(undefined);
  const [icon, setIcon] = useState('🎯');
  const [note, setNote] = useState('');
  const [notes, setNotes] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  
  // Common icons for goals
  const icons = ['🎯', '📌', '⭐', '📝', '📊', '🚀', '🔍', '⏳', '📈', '🏆', '💪', '🧠', '📚', '💡', '🌱'];
  
  // Initialize form with existing goal data when editing
  useEffect(() => {
    if (editGoal) {
      setTitle(editGoal.title);
      setDescription(editGoal.description || '');
      setDeadline(editGoal.deadline ? new Date(editGoal.deadline) : undefined);
      setIcon(editGoal.icon || '🎯');
      setNotes(editGoal.notes || []);
      setProgress(editGoal.progress);
    } else {
      // Default values for a new goal
      setTitle('');
      setDescription('');
      setDeadline(undefined);
      setIcon('🎯');
      setNotes([]);
      setProgress(0);
    }
  }, [editGoal, isOpen]);
  
  const handleSave = () => {
    const goalData: Partial<GoalNode> = {
      title,
      description: description || undefined,
      deadline: deadline ? deadline.toISOString() : undefined,
      icon,
      notes,
      progress
    };
    
    onSave(goalData);
    onClose();
  };
  
  const addNote = () => {
    if (note.trim()) {
      setNotes([...notes, note.trim()]);
      setNote('');
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>
            {editGoal ? 'Edit Goal' : parentGoal ? `Add Subgoal to "${parentGoal.title}"` : 'Create New Goal'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="icon" className="text-right">
              Icon
            </Label>
            <div className="col-span-3 flex flex-wrap gap-2">
              {icons.map((i) => (
                <button
                  key={i}
                  type="button"
                  className={`w-8 h-8 text-lg flex items-center justify-center rounded ${
                    icon === i ? 'bg-primary/20 border border-primary' : 'hover:bg-primary/10'
                  }`}
                  onClick={() => setIcon(i)}
                >
                  {i}
                </button>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Title
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="col-span-3"
              placeholder="Enter goal title"
            />
          </div>
          
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="col-span-3"
              placeholder="Enter a detailed description of this goal"
              rows={3}
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="deadline" className="text-right">
              Deadline
            </Label>
            <div className="col-span-3">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left h-10"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {deadline ? format(deadline, 'PPP') : 'Select a date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={deadline}
                    onSelect={setDeadline}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          {editGoal && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="progress" className="text-right">
                Progress
              </Label>
              <div className="col-span-3 flex items-center gap-2">
                <Input
                  id="progress"
                  type="number"
                  min="0"
                  max="100"
                  value={progress}
                  onChange={(e) => setProgress(Math.min(100, Math.max(0, parseInt(e.target.value))))}
                  className="w-20"
                />
                <span>%</span>
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-4 items-start gap-4">
            <Label className="text-right">
              Notes
            </Label>
            <div className="col-span-3 space-y-2">
              <div className="flex gap-2">
                <Input
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Add a note"
                  className="flex-1"
                />
                <Button type="button" onClick={addNote} size="sm">
                  Add
                </Button>
              </div>
              {notes.length > 0 && (
                <ul className="space-y-1 mt-2">
                  {notes.map((n, i) => (
                    <li key={i} className="text-sm bg-gray-50 p-2 rounded">
                      • {n}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!title.trim()}>
            {editGoal ? 'Update Goal' : 'Save Goal'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default GoalForm;