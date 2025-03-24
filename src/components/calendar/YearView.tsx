
import React from 'react';
import { EnhancedTodo } from '@/models/Todo';
import { 
  format, 
  addMonths, 
  startOfYear,
  isSameMonth
} from 'date-fns';
import { useNavigate } from 'react-router-dom';

interface YearViewProps {
  date: Date;
  tasks: EnhancedTodo[];
  onMonthClick: (date: Date) => void;
}

const YearView: React.FC<YearViewProps> = ({
  date,
  tasks,
  onMonthClick
}) => {
  const yearStart = startOfYear(date);
  const months = Array.from({ length: 12 }, (_, i) => addMonths(yearStart, i));

  // Count tasks per month
  const tasksPerMonth = months.map(month => {
    return {
      date: month,
      count: tasks.filter(task => 
        task.dueDate && isSameMonth(new Date(task.dueDate), month)
      ).length
    };
  });
  
  return (
    <div className="grid grid-cols-3 md:grid-cols-4 gap-4 p-4">
      {tasksPerMonth.map(({ date: month, count }) => (
        <div 
          key={month.toISOString()}
          className="border rounded-lg p-4 hover:shadow-md cursor-pointer"
          onClick={() => onMonthClick(month)}
        >
          <h3 className="text-lg font-semibold text-center mb-2">
            {format(month, 'MMMM')}
          </h3>
          <div className="text-center text-gray-500">
            {count} {count === 1 ? 'task' : 'tasks'}
          </div>
          
          {/* Mini task indicator */}
          {count > 0 && (
            <div className="mt-2 h-1 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-500"
                style={{ width: `${Math.min(100, count * 5)}%` }}
              ></div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default YearView;
