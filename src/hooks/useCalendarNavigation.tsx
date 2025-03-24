
import { useState } from 'react';
import { addDays, addMonths, addWeeks } from 'date-fns';

export type ViewMode = 'day' | 'week' | 'month' | 'year';

export const useCalendarNavigation = (initialViewMode: ViewMode = 'week') => {
  const [viewMode, setViewMode] = useState<ViewMode>(initialViewMode);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());

  const navigatePrevious = () => {
    switch (viewMode) {
      case 'day':
        setCurrentDate(addDays(currentDate, -1));
        break;
      case 'week':
        setCurrentDate(addWeeks(currentDate, -1));
        break;
      case 'month':
        setCurrentDate(addMonths(currentDate, -1));
        break;
      case 'year':
        setCurrentDate(addMonths(currentDate, -12));
        break;
    }
  };
  
  const navigateNext = () => {
    switch (viewMode) {
      case 'day':
        setCurrentDate(addDays(currentDate, 1));
        break;
      case 'week':
        setCurrentDate(addWeeks(currentDate, 1));
        break;
      case 'month':
        setCurrentDate(addMonths(currentDate, 1));
        break;
      case 'year':
        setCurrentDate(addMonths(currentDate, 12));
        break;
    }
  };
  
  const navigateToday = () => {
    setCurrentDate(new Date());
  };

  return {
    viewMode,
    setViewMode,
    currentDate,
    setCurrentDate,
    navigatePrevious,
    navigateNext,
    navigateToday
  };
};
