
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserProgressController } from '../controllers/UserProgressController';
import { Goal } from '../models/UserProgress';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ChartContainer } from '@/components/ui/chart';
import Navbar from '../components/Navbar';
import { PlusCircle, ListTodo, Sparkles, Trophy, Target, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const navigate = useNavigate();
  const userProgress = UserProgressController.getUserProgress();
  const goals = UserProgressController.getGoals();
  const completionRate = UserProgressController.getCompletionRate();
  
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [newGoal, setNewGoal] = useState<Partial<Goal>>({
    title: '',
    description: '',
    progress: 0
  });

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would save to the backend
    console.log('New goal:', newGoal);
    setShowGoalForm(false);
    setNewGoal({ title: '', description: '', progress: 0 });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-orange-50">
      <Navbar />
      <div className="container mx-auto py-28 px-4">
        <div className="flex flex-col gap-8">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Your Progress Dashboard</h1>
              <p className="text-muted-foreground">Track your goals and daily achievements</p>
            </div>
            <div className="flex gap-2">
              <Button 
                className="gap-2" 
                onClick={() => navigate('/Goals')}
              >
                <PlusCircle className="h-4 w-4" />
                Add New Goal
              </Button>
              <Button 
                variant="outline" 
                className="gap-2"
                onClick={() => navigate('/todo')}
              >
                <ListTodo className="h-4 w-4" />
                View Task List
              </Button>
              <Button 
                variant="secondary" 
                className="gap-2"
                onClick={() => navigate('/ai-planner')}
              >
                <Sparkles className="h-4 w-4" />
                AI Recommendations
              </Button>
            </div>
          </div>

          {/* Progress Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-white/80 backdrop-blur-sm border-green-100">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-chameleon-green" />
                  Current Streak
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-chameleon-green-dark">
                  {userProgress.streak} days
                </div>
                <p className="text-sm text-muted-foreground mt-1">Keep it up!</p>
              </CardContent>
            </Card>
            
            <Card className="bg-white/80 backdrop-blur-sm border-orange-100">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Target className="h-5 w-5 text-chameleon-orange" />
                  Completion Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-chameleon-orange-dark">
                  {completionRate}%
                </div>
                <Progress value={completionRate} className="mt-2" />
              </CardContent>
            </Card>
            
            <Card className="bg-white/80 backdrop-blur-sm border-yellow-100">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-chameleon-yellow" />
                  Tasks Completed
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-chameleon-yellow-dark">
                  {userProgress.completedTasks}/{userProgress.totalTasks}
                </div>
                <p className="text-sm text-muted-foreground mt-1">This week</p>
              </CardContent>
            </Card>
          </div>

          {/* Weekly Progress Chart */}
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Weekly Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={userProgress.weeklyProgress}>
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Bar 
                      dataKey="completed" 
                      fill="#4CAF50" 
                      radius={[4, 4, 0, 0]} 
                      name="Completed"
                    />
                    <Bar 
                      dataKey="total" 
                      fill="#8BC34A" 
                      radius={[4, 4, 0, 0]} 
                      name="Total"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Goals Section */}
          <div>
            <h2 className="text-2xl font-bold mb-4">Current Goals</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {goals.map((goal) => (
                <Card key={goal.id} className="bg-white/80 backdrop-blur-sm">
                  <CardHeader className="pb-2">
                    <CardTitle>{goal.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-2">{goal.description}</p>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm">Progress</span>
                      <span className="text-sm font-medium">{goal.progress}%</span>
                    </div>
                    <Progress value={goal.progress} />
                    <div className="mt-4 text-sm text-muted-foreground">
                      Deadline: {goal.deadline.toLocaleDateString()}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Add Goal Form (conditionally rendered) */}
          {showGoalForm && (
            <Card className="bg-white/90 backdrop-blur-md mt-4">
              <CardHeader>
                <CardTitle>Add New Goal</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddGoal} className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="title" className="block text-sm font-medium">
                      Goal Title
                    </label>
                    <input
                      id="title"
                      className="w-full p-2 border rounded-md"
                      value={newGoal.title}
                      onChange={(e) => setNewGoal({...newGoal, title: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="description" className="block text-sm font-medium">
                      Description
                    </label>
                    <textarea
                      id="description"
                      className="w-full p-2 border rounded-md"
                      value={newGoal.description}
                      onChange={(e) => setNewGoal({...newGoal, description: e.target.value})}
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="deadline" className="block text-sm font-medium">
                      Deadline
                    </label>
                    <input
                      id="deadline"
                      type="date"
                      className="w-full p-2 border rounded-md"
                      onChange={(e) => setNewGoal({
                        ...newGoal, 
                        deadline: e.target.value ? new Date(e.target.value) : undefined
                      })}
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => setShowGoalForm(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">Save Goal</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
