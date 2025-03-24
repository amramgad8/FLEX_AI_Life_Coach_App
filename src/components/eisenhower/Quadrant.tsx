
import React from 'react';
import { EnhancedTodo, EisenhowerQuadrant } from '@/models/Todo';
import TaskItem from '@/components/calendar/TaskItem';
import { useDrop } from 'react-dnd';

interface QuadrantProps {
  title: string;
  description: string;
  action: string;
  quadrant: EisenhowerQuadrant;
  tasks: EnhancedTodo[];
  className: string;
  onTaskDrop: (taskId: string, quadrant: EisenhowerQuadrant) => void;
  onEditTask: (task: EnhancedTodo) => void;
  onCompleteTask: (task: EnhancedTodo, completed: boolean) => void;
  onDeleteTask: (task: EnhancedTodo) => void;
}

const Quadrant: React.FC<QuadrantProps> = ({
  title,
  description,
  action,
  quadrant,
  tasks,
  className,
  onTaskDrop,
  onEditTask,
  onCompleteTask,
  onDeleteTask
}) => {
  // Set up drop target
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'task',
    drop: (item: { id: string }) => onTaskDrop(item.id, quadrant),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  return (
    <div 
      ref={drop} 
      className={`${className} p-4 rounded-md transition-colors ${isOver ? 'bg-slate-100' : ''}`}
    >
      <h3 className="text-lg font-semibold mb-1">{title}</h3>
      <p className="text-sm text-gray-600 mb-2">{description}</p>
      <p className="text-xs italic mb-4 text-gray-500">{action}</p>
      
      <div className="space-y-2 min-h-32">
        {tasks.length === 0 ? (
          <div className="text-sm text-gray-400 text-center py-6">
            Drop tasks here
          </div>
        ) : (
          tasks.map(task => (
            <TaskItem
              key={task.id}
              task={task}
              onClick={onEditTask}
              onComplete={onCompleteTask}
              onDelete={onDeleteTask}
              compact
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Quadrant;
