
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { 
  Search, 
  Filter, 
  X, 
  Clock, 
  CalendarIcon,
  Tag
} from 'lucide-react';
import { PRIORITY_CONFIG, CATEGORY_CONFIG, TaskPriority, TaskCategory } from '@/models/Todo';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

export interface TaskFilters {
  search: string;
  priorities: TaskPriority[];
  categories: TaskCategory[];
  dateRange: {
    from?: Date;
    to?: Date;
  };
  durationRange: {
    min?: number;
    max?: number;
  };
  showCompleted: boolean;
}

interface FilterBarProps {
  filters: TaskFilters;
  onFilterChange: (filters: TaskFilters) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ filters, onFilterChange }) => {
  const [searchExpanded, setSearchExpanded] = useState(false);

  const handleSearchChange = (value: string) => {
    onFilterChange({ ...filters, search: value });
  };

  const handlePriorityToggle = (priority: TaskPriority) => {
    const newPriorities = filters.priorities.includes(priority)
      ? filters.priorities.filter(p => p !== priority)
      : [...filters.priorities, priority];
    
    onFilterChange({ ...filters, priorities: newPriorities });
  };

  const handleCategoryToggle = (category: TaskCategory) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter(c => c !== category)
      : [...filters.categories, category];
    
    onFilterChange({ ...filters, categories: newCategories });
  };

  const handleDateRangeChange = (range: { from?: Date; to?: Date }) => {
    onFilterChange({ ...filters, dateRange: range });
  };

  const handleDurationRangeChange = (range: { min?: number; max?: number }) => {
    onFilterChange({ ...filters, durationRange: range });
  };

  const handleResetFilters = () => {
    onFilterChange({
      search: '',
      priorities: [],
      categories: [],
      dateRange: {},
      durationRange: {},
      showCompleted: false
    });
  };

  const handleToggleCompleted = (checked: boolean) => {
    onFilterChange({ ...filters, showCompleted: checked });
  };

  const activeFilterCount = 
    (filters.search ? 1 : 0) +
    filters.priorities.length + 
    filters.categories.length + 
    (filters.dateRange.from || filters.dateRange.to ? 1 : 0) +
    (filters.durationRange.min || filters.durationRange.max ? 1 : 0) +
    (filters.showCompleted ? 1 : 0);

  return (
    <div className="flex flex-wrap items-center gap-2 p-2 border-b bg-white rounded-md shadow-sm mb-4">
      <div className={`relative transition-all duration-300 ${searchExpanded ? 'w-full md:w-60' : 'w-0'}`}>
        <Input
          placeholder="Search tasks..."
          value={filters.search}
          onChange={(e) => handleSearchChange(e.target.value)}
          className={`h-9 ${searchExpanded ? 'opacity-100' : 'opacity-0'}`}
        />
        {filters.search && (
          <button
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            onClick={() => handleSearchChange('')}
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      
      <Button 
        variant="outline" 
        size="sm"
        onClick={() => setSearchExpanded(!searchExpanded)}
        className="h-9 w-9 p-0 flex items-center justify-center rounded-full"
      >
        <Search className="h-4 w-4" />
      </Button>
      
      <Popover>
        <PopoverTrigger asChild>
          <Button 
            variant="outline" 
            size="sm"
            className="h-9 flex items-center justify-center gap-1 relative"
          >
            <Filter className="h-4 w-4" />
            <span className="hidden sm:inline">Filters</span>
            {activeFilterCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-blue-500 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs">
                {activeFilterCount}
              </span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Priority</h4>
              <div className="flex flex-wrap gap-2">
                {(Object.keys(PRIORITY_CONFIG) as TaskPriority[]).map((priority) => (
                  <Button
                    key={priority}
                    variant={filters.priorities.includes(priority) ? 'default' : 'outline'}
                    size="sm"
                    className={filters.priorities.includes(priority) ? PRIORITY_CONFIG[priority].color : ''}
                    onClick={() => handlePriorityToggle(priority)}
                  >
                    {PRIORITY_CONFIG[priority].label}
                  </Button>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Category</h4>
              <div className="grid grid-cols-2 gap-2">
                {(Object.keys(CATEGORY_CONFIG) as TaskCategory[]).map((category) => (
                  <div key={category} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`category-${category}`}
                      checked={filters.categories.includes(category)}
                      onCheckedChange={() => handleCategoryToggle(category)}
                    />
                    <Label htmlFor={`category-${category}`}>
                      {CATEGORY_CONFIG[category].label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Date Range</h4>
              <div className="flex gap-2">
                <Calendar
                  mode="range"
                  selected={{
                    from: filters.dateRange.from,
                    to: filters.dateRange.to
                  }}
                  onSelect={handleDateRangeChange}
                  className="border rounded-md p-2"
                />
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Duration (minutes)</h4>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label>Min</Label>
                  <Input 
                    type="number" 
                    value={filters.durationRange.min || ''}
                    onChange={(e) => {
                      const value = e.target.value ? Number(e.target.value) : undefined;
                      handleDurationRangeChange({ ...filters.durationRange, min: value });
                    }}
                    min="0"
                    placeholder="Min"
                  />
                </div>
                <div>
                  <Label>Max</Label>
                  <Input 
                    type="number" 
                    value={filters.durationRange.max || ''}
                    onChange={(e) => {
                      const value = e.target.value ? Number(e.target.value) : undefined;
                      handleDurationRangeChange({ ...filters.durationRange, max: value });
                    }}
                    min="0"
                    placeholder="Max"
                  />
                </div>
              </div>
            </div>
            
            <div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="show-completed"
                  checked={filters.showCompleted}
                  onCheckedChange={(checked) => handleToggleCompleted(checked as boolean)}
                />
                <Label htmlFor="show-completed">Show completed tasks</Label>
              </div>
            </div>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleResetFilters}
              className="w-full"
            >
              Reset Filters
            </Button>
          </div>
        </PopoverContent>
      </Popover>
      
      {/* Active filters display */}
      <div className="flex flex-wrap gap-1 ml-1">
        {filters.priorities.map(priority => (
          <Badge key={`p-${priority}`} className={`${PRIORITY_CONFIG[priority].bgColor} ${PRIORITY_CONFIG[priority].textColor} border-none`}>
            {PRIORITY_CONFIG[priority].label}
            <X 
              className="h-3 w-3 ml-1 cursor-pointer" 
              onClick={() => handlePriorityToggle(priority)}
            />
          </Badge>
        ))}
        
        {filters.categories.map(category => (
          <Badge key={`c-${category}`} className={`${CATEGORY_CONFIG[category].bgColor} ${CATEGORY_CONFIG[category].textColor} border-none`}>
            {CATEGORY_CONFIG[category].label}
            <X 
              className="h-3 w-3 ml-1 cursor-pointer" 
              onClick={() => handleCategoryToggle(category)}
            />
          </Badge>
        ))}
        
        {(filters.dateRange.from || filters.dateRange.to) && (
          <Badge className="bg-blue-100 text-blue-800 border-none">
            <CalendarIcon className="h-3 w-3 mr-1" />
            Date Range
            <X 
              className="h-3 w-3 ml-1 cursor-pointer" 
              onClick={() => handleDateRangeChange({})}
            />
          </Badge>
        )}
        
        {(filters.durationRange.min || filters.durationRange.max) && (
          <Badge className="bg-purple-100 text-purple-800 border-none">
            <Clock className="h-3 w-3 mr-1" />
            Duration
            <X 
              className="h-3 w-3 ml-1 cursor-pointer" 
              onClick={() => handleDurationRangeChange({})}
            />
          </Badge>
        )}
        
        {filters.showCompleted && (
          <Badge className="bg-green-100 text-green-800 border-none">
            Completed
            <X 
              className="h-3 w-3 ml-1 cursor-pointer" 
              onClick={() => handleToggleCompleted(false)}
            />
          </Badge>
        )}
      </div>
    </div>
  );
};

export default FilterBar;
