
import React from 'react';
import { EnhancedTodo } from '@/models/Todo';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import TaskItem from '@/components/calendar/TaskItem';

interface UncategorizedTasksCardProps {
  tasks: EnhancedTodo[];
  onEditTask: (task: EnhancedTodo) => void;
  onCompleteTask: (task: EnhancedTodo, completed: boolean) => void;
  onDeleteTask: (task: EnhancedTodo) => void;
}

const UncategorizedTasksCard: React.FC<UncategorizedTasksCardProps> = ({
  tasks,
  onEditTask,
  onCompleteTask,
  onDeleteTask
}) => {
  if (tasks.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Uncategorized Tasks</CardTitle>
        <CardDescription>
          Drag these tasks to the appropriate quadrant in the matrix
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
          {tasks.map(task => (
            <TaskItem
              key={task.id}
              task={task}
              onClick={onEditTask}
              onComplete={onCompleteTask}
              onDelete={onDeleteTask}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default UncategorizedTasksCard;
