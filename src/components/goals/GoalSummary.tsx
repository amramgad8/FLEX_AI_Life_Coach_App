
import { useGoals } from '@/hooks/useGoals';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Bell, CalendarClock, Check, Clock, Target } from 'lucide-react';
import { format, isAfter } from 'date-fns';

const GoalSummary = () => {
  const { goals, rootGoals, getGoalById, getGoalProgress } = useGoals();
  
  // Calculate overall progress across all goals
  const calculateOverallProgress = () => {
    const allGoals = Object.values(goals);
    if (allGoals.length === 0) return 0;
    
    const totalProgress = allGoals.reduce((sum, goal) => sum + goal.progress, 0);
    return Math.round(totalProgress / allGoals.length);
  };
  
  // Get upcoming deadlines
  const getUpcomingDeadlines = () => {
    return Object.values(goals)
      .filter(goal => 
        goal.deadline && 
        !goal.completed && 
        isAfter(new Date(goal.deadline), new Date())
      )
      .sort((a, b) => 
        (a.deadline && b.deadline) 
          ? new Date(a.deadline).getTime() - new Date(b.deadline).getTime() 
          : 0
      )
      .slice(0, 3);
  };
  
  // Get recent achievements (completed goals)
  const getRecentAchievements = () => {
    return Object.values(goals)
      .filter(goal => goal.completed)
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 3);
  };
  
  const overallProgress = calculateOverallProgress();
  const upcomingDeadlines = getUpcomingDeadlines();
  const recentAchievements = getRecentAchievements();
  
  // Get main goals (root goals)
  const mainGoals = rootGoals.map(id => getGoalById(id)).filter(Boolean);
  
  return (
    <div className="space-y-6">
      {/* Overall Progress */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <Target className="mr-2 h-5 w-5 text-primary" />
            Overall Goal Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center mb-2">
            <span className="text-3xl font-bold">{overallProgress}%</span>
          </div>
          <Progress value={overallProgress} className="h-2.5" />
        </CardContent>
      </Card>
      
      {/* Main Goals Progress */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Main Goals</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mainGoals.length > 0 ? (
              mainGoals.map(goal => {
                const progress = getGoalProgress(goal.id);
                
                return (
                  <div key={goal.id} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <span className="text-lg mr-2">{goal.icon}</span>
                        <span className="font-medium">{goal.title}</span>
                      </div>
                      <span className="text-sm font-semibold">{goal.progress}%</span>
                    </div>
                    
                    <Progress value={goal.progress} className="h-2" />
                    
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>
                        {progress?.completedSubtasks || 0}/{progress?.totalSubtasks || 0} subtasks complete
                      </span>
                      {goal.deadline && (
                        <span className="flex items-center">
                          <Clock size={12} className="mr-1" />
                          {format(new Date(goal.deadline), 'MMM d, yyyy')}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-4 text-gray-500">
                <p>No main goals created yet</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Upcoming Deadlines */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <CalendarClock className="mr-2 h-5 w-5 text-yellow-500" />
            Upcoming Deadlines
          </CardTitle>
        </CardHeader>
        <CardContent>
          {upcomingDeadlines.length > 0 ? (
            <div className="space-y-2">
              {upcomingDeadlines.map(goal => (
                <div key={goal.id} className="flex items-center justify-between bg-yellow-50 p-2 rounded-md">
                  <div className="flex items-center">
                    <span className="text-lg mr-2">{goal.icon}</span>
                    <span>{goal.title}</span>
                  </div>
                  {goal.deadline && (
                    <span className="text-sm text-yellow-700 font-medium">
                      {format(new Date(goal.deadline), 'MMM d, yyyy')}
                    </span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500">
              <p>No upcoming deadlines</p>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Recent Achievements */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <Check className="mr-2 h-5 w-5 text-green-500" />
            Recent Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recentAchievements.length > 0 ? (
            <div className="space-y-2">
              {recentAchievements.map(goal => (
                <div key={goal.id} className="flex items-center justify-between bg-green-50 p-2 rounded-md">
                  <div className="flex items-center">
                    <span className="text-lg mr-2">{goal.icon}</span>
                    <span>{goal.title}</span>
                  </div>
                  <span className="text-sm text-green-700">Completed</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500">
              <p>No completed goals yet</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default GoalSummary;