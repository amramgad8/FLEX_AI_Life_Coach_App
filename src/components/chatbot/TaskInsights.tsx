
import { Badge } from '@/components/ui/badge';

const TaskInsights = () => {
  return (
    <div className="p-4">
      <h3 className="text-sm font-medium mb-2">Task Insights</h3>
      <div className="space-y-3">
        <div className="bg-flex-green-light border border-flex-green/30 rounded-lg p-3">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-medium text-flex-green">Task Completion</span>
            <Badge variant="outline" className="text-xs bg-white border-flex-green text-flex-green">Today</Badge>
          </div>
          <p className="text-sm">You've completed 3 of 5 tasks today (60%)</p>
        </div>
        
        <div className="bg-flex-yellow-light border border-flex-yellow/30 rounded-lg p-3">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-medium text-flex-yellow">Productivity Peak</span>
            <Badge variant="outline" className="text-xs bg-white border-flex-yellow text-flex-yellow">This Week</Badge>
          </div>
          <p className="text-sm">Your most productive day is Wednesday</p>
        </div>
      </div>
    </div>
  );
};

export default TaskInsights;
