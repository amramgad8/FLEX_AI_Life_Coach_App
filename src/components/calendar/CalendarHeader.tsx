
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon,
  CalendarDays,
  CalendarRange
} from 'lucide-react';
import { format, addDays, addMonths, addWeeks, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

type ViewMode = 'day' | 'week' | 'month' | 'year';

interface CalendarHeaderProps {
  currentDate: Date;
  viewMode: ViewMode;
  onPrevious: () => void;
  onNext: () => void;
  onToday: () => void;
  onViewModeChange: (mode: ViewMode) => void;
}

const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  currentDate,
  viewMode,
  onPrevious,
  onNext,
  onToday,
  onViewModeChange
}) => {
  const getHeaderTitle = () => {
    switch (viewMode) {
      case 'day':
        return format(currentDate, 'EEEE, MMMM d, yyyy');
      case 'week': {
        const start = startOfWeek(currentDate, { weekStartsOn: 1 });
        const end = endOfWeek(currentDate, { weekStartsOn: 1 });
        return `${format(start, 'MMM d')} - ${format(end, 'MMM d, yyyy')}`;
      }
      case 'month':
        return format(currentDate, 'MMMM yyyy');
      case 'year':
        return format(currentDate, 'yyyy');
      default:
        return format(currentDate, 'MMMM d, yyyy');
    }
  };

  return (
    <header className="flex items-center justify-between py-4 px-2 border-b">
      <div className="flex items-center space-x-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="icon"
                onClick={onPrevious}
                className="h-8 w-8"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Previous {viewMode}</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="icon"
                onClick={onNext}
                className="h-8 w-8"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Next {viewMode}</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <Button 
          variant="outline" 
          size="sm"
          onClick={onToday}
          className="ml-2"
        >
          Today
        </Button>
      </div>

      <h2 className="text-lg font-semibold text-center">
        {getHeaderTitle()}
      </h2>

      <div className="flex items-center space-x-1 border rounded-md p-1">
        <Button 
          variant={viewMode === 'day' ? 'default' : 'ghost'} 
          size="sm"
          onClick={() => onViewModeChange('day')}
          className="h-8"
        >
          Day
        </Button>
        <Button 
          variant={viewMode === 'week' ? 'default' : 'ghost'} 
          size="sm"
          onClick={() => onViewModeChange('week')}
          className="h-8"
        >
          Week
        </Button>
        <Button 
          variant={viewMode === 'month' ? 'default' : 'ghost'} 
          size="sm"
          onClick={() => onViewModeChange('month')}
          className="h-8"
        >
          Month
        </Button>
        <Button 
          variant={viewMode === 'year' ? 'default' : 'ghost'} 
          size="sm"
          onClick={() => onViewModeChange('year')}
          className="h-8"
        >
          Year
        </Button>
      </div>
    </header>
  );
};

export default CalendarHeader;
