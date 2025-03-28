import React from 'react';
import { useGoals } from '@/hooks/useGoals';
import { GoalNode } from '@/models/Goal';
import { motion } from 'framer-motion';
import { format, isAfter, isBefore, isToday } from 'date-fns';

const GoalTimeline = () => {
  const { goals, rootGoals } = useGoals();
  
  // Get all goals that have deadlines
  const goalsWithDeadlines = Object.values(goals)
    .filter(goal => goal.deadline)
    .sort((a, b) => {
      if (!a.deadline || !b.deadline) return 0;
      return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
    });
  
  // Group goals by month/year
  const groupedGoals: Record<string, GoalNode[]> = {};
  
  goalsWithDeadlines.forEach(goal => {
    if (!goal.deadline) return;
    
    const date = new Date(goal.deadline);
    const key = format(date, 'MMM yyyy');
    
    if (!groupedGoals[key]) {
      groupedGoals[key] = [];
    }
    
    groupedGoals[key].push(goal);
  });

  // Get the status for a deadline
  const getDeadlineStatus = (deadline: Date) => {
    if (isToday(deadline)) return 'today';
    if (isBefore(deadline, new Date())) return 'overdue';
    return 'upcoming';
  };

  // Get color for a deadline status
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'today': return 'bg-yellow-500';
      case 'overdue': return 'bg-red-500';
      case 'upcoming': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="p-6">
      <div className="relative">
        <div className="absolute left-9 top-0 bottom-0 w-0.5 bg-gray-200" />
        
        {Object.entries(groupedGoals).map(([monthYear, goals], index) => (
          <div key={monthYear} className="mb-8">
            <motion.h3 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="text-lg font-semibold mb-4"
            >
              {monthYear}
            </motion.h3>
            
            {goals.map((goal, goalIndex) => {
              if (!goal.deadline) return null;
              
              const date = new Date(goal.deadline);
              const status = getDeadlineStatus(date);
              
              return (
                <motion.div 
                  key={goal.id} 
                  className="flex mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + goalIndex * 0.05 }}
                >
                  <div className="relative mr-4">
                    <div className={`w-4 h-4 rounded-full ${getStatusColor(status)} mt-1.5 z-10`} />
                  </div>
                  
                  <div className="bg-card rounded-lg p-4 flex-1 shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center">
                        <span className="mr-2">{goal.icon}</span>
                        <h4 className="font-medium">{goal.title}</h4>
                      </div>
                      <div className={`text-sm px-2 py-1 rounded-full ${
                        status === 'today' ? 'bg-yellow-100 text-yellow-800' :
                        status === 'overdue' ? 'bg-red-100 text-red-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {format(date, 'MMM d, yyyy')}
                      </div>
                    </div>
                    
                    {goal.description && (
                      <p className="text-sm text-muted-foreground mb-2">{goal.description}</p>
                    )}
                    
                    <div className="flex items-center">
                      <div className="bg-gray-200 h-2 flex-grow rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full bg-green-500" 
                          style={{ width: `${goal.progress}%` }}
                        />
                      </div>
                      <span className="text-sm ml-2">{goal.progress}%</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ))}
        
        {Object.keys(groupedGoals).length === 0 && (
          <div className="flex items-center justify-center h-40 text-muted-foreground">
            No goals with deadlines found. Add deadlines to your goals to see them on the timeline.
          </div>
        )}
      </div>
    </div>
  );
};

export default GoalTimeline;
