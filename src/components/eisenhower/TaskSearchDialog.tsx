
import React from 'react';
import { EnhancedTodo, EisenhowerQuadrant, EISENHOWER_CONFIG } from '@/models/Todo';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

interface TaskSearchDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedQuadrant: EisenhowerQuadrant | null;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filteredTasks: EnhancedTodo[];
  onTaskSelect: (taskId: string) => void;
}

const TaskSearchDialog: React.FC<TaskSearchDialogProps> = ({
  isOpen,
  onOpenChange,
  selectedQuadrant,
  searchQuery,
  onSearchChange,
  filteredTasks,
  onTaskSelect
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Task to {selectedQuadrant && EISENHOWER_CONFIG[selectedQuadrant].label}</DialogTitle>
          <DialogDescription>
            Search for a task to add to this quadrant
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex items-center space-x-2 py-4">
          <div className="grid flex-1 gap-2">
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search tasks by name..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="flex-1"
              />
            </div>
          </div>
        </div>
        
        <div className="max-h-[300px] overflow-y-auto space-y-2">
          {filteredTasks.length > 0 ? (
            filteredTasks.map(task => (
              <div
                key={task.id}
                className="p-2 border rounded hover:bg-slate-50 cursor-pointer flex justify-between items-center"
                onClick={() => onTaskSelect(task.id)}
              >
                <span className="font-medium">{task.title}</span>
                <Button size="sm" variant="ghost">
                  Add
                </Button>
              </div>
            ))
          ) : (
            <div className="text-center py-4 text-gray-500">
              {searchQuery ? "No tasks found" : "No uncategorized tasks available"}
            </div>
          )}
        </div>
        
        <DialogFooter className="sm:justify-end">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TaskSearchDialog;
