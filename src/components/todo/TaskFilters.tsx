
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Card,
  CardContent
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Label } from '@/components/ui/label';
import { 
  Search, 
  SlidersHorizontal,
  CalendarDays,
  Clock,
  Flag,
  Check,
  X
} from 'lucide-react';

export interface TaskFilters {
  searchQuery: string;
  priority: string[] | null;
  deadlineFilter: string | null;
  durationFilter: string | null;
  showCompleted: boolean;
}

interface TaskFiltersProps {
  filters: TaskFilters;
  onFiltersChange: (filters: TaskFilters) => void;
}

const TaskFilters = ({ filters, onFiltersChange }: TaskFiltersProps) => {
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({
      ...filters,
      searchQuery: e.target.value
    });
  };
  
  const handlePriorityToggle = (priority: string) => {
    const currentPriorities = filters.priority || [];
    let newPriorities;
    
    if (currentPriorities.includes(priority)) {
      newPriorities = currentPriorities.filter(p => p !== priority);
    } else {
      newPriorities = [...currentPriorities, priority];
    }
    
    onFiltersChange({
      ...filters,
      priority: newPriorities.length > 0 ? newPriorities : null
    });
  };
  
  const handleDeadlineFilter = (deadline: string | null) => {
    onFiltersChange({
      ...filters,
      deadlineFilter: deadline
    });
  };
  
  const handleDurationFilter = (duration: string | null) => {
    onFiltersChange({
      ...filters,
      durationFilter: duration
    });
  };
  
  const toggleCompletedVisibility = () => {
    onFiltersChange({
      ...filters,
      showCompleted: !filters.showCompleted
    });
  };
  
  const resetFilters = () => {
    onFiltersChange({
      searchQuery: '',
      priority: null,
      deadlineFilter: null,
      durationFilter: null,
      showCompleted: true
    });
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.priority && filters.priority.length > 0) count++;
    if (filters.deadlineFilter) count++;
    if (filters.durationFilter) count++;
    if (!filters.showCompleted) count++;
    return count;
  };
  
  return (
    <Card className="shadow-sm mb-6">
      <CardContent className="p-4">
        <div className="flex items-center justify-between gap-4">
          <div className={`relative flex-1 transition-all duration-300 ${isSearchExpanded ? 'flex-grow' : ''}`}>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tasks..."
                value={filters.searchQuery}
                onChange={handleSearchChange}
                className="pl-9 pr-4 h-10"
                onFocus={() => setIsSearchExpanded(true)}
                onBlur={() => setIsSearchExpanded(filters.searchQuery.length > 0)}
              />
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-10">
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Filters
                {getActiveFiltersCount() > 0 && (
                  <span className="ml-2 bg-primary text-primary-foreground rounded-full w-5 h-5 text-xs flex items-center justify-center">
                    {getActiveFiltersCount()}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Filter Tasks</DropdownMenuLabel>
              <DropdownMenuSeparator />
              
              <DropdownMenuGroup>
                <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
                  Priority
                </DropdownMenuLabel>
                <DropdownMenuItem 
                  onClick={() => handlePriorityToggle('high')}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-flex-orange rounded-full mr-2"></div>
                    High
                  </div>
                  {filters.priority?.includes('high') && <Check className="h-4 w-4" />}
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => handlePriorityToggle('medium')}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-flex-yellow rounded-full mr-2"></div>
                    Medium
                  </div>
                  {filters.priority?.includes('medium') && <Check className="h-4 w-4" />}
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => handlePriorityToggle('low')}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-flex-green rounded-full mr-2"></div>
                    Low
                  </div>
                  {filters.priority?.includes('low') && <Check className="h-4 w-4" />}
                </DropdownMenuItem>
              </DropdownMenuGroup>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuGroup>
                <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
                  Deadline
                </DropdownMenuLabel>
                <DropdownMenuItem 
                  onClick={() => handleDeadlineFilter('today')}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center">
                    <CalendarDays className="h-4 w-4 mr-2" />
                    Today
                  </div>
                  {filters.deadlineFilter === 'today' && <Check className="h-4 w-4" />}
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => handleDeadlineFilter('upcoming')}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center">
                    <CalendarDays className="h-4 w-4 mr-2" />
                    Upcoming (7 days)
                  </div>
                  {filters.deadlineFilter === 'upcoming' && <Check className="h-4 w-4" />}
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => handleDeadlineFilter('overdue')}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center">
                    <CalendarDays className="h-4 w-4 mr-2" />
                    Overdue
                  </div>
                  {filters.deadlineFilter === 'overdue' && <Check className="h-4 w-4" />}
                </DropdownMenuItem>
              </DropdownMenuGroup>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuGroup>
                <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
                  Duration
                </DropdownMenuLabel>
                <DropdownMenuItem 
                  onClick={() => handleDurationFilter('short')}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    Short (&lt; 30 min)
                  </div>
                  {filters.durationFilter === 'short' && <Check className="h-4 w-4" />}
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => handleDurationFilter('medium')}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    Medium (30-60 min)
                  </div>
                  {filters.durationFilter === 'medium' && <Check className="h-4 w-4" />}
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => handleDurationFilter('long')}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    Long (&gt; 60 min)
                  </div>
                  {filters.durationFilter === 'long' && <Check className="h-4 w-4" />}
                </DropdownMenuItem>
              </DropdownMenuGroup>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuItem 
                onClick={toggleCompletedVisibility}
                className="flex items-center justify-between"
              >
                <div className="flex items-center">
                  <Flag className="h-4 w-4 mr-2" />
                  Show Completed Tasks
                </div>
                {filters.showCompleted ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              
              <Button 
                variant="ghost" 
                className="w-full justify-center text-sm h-8 mt-1" 
                onClick={resetFilters}
              >
                Reset All Filters
              </Button>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskFilters;
