import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import ProductivityTips from './ProductivityTips';
import TaskInsights from './TaskInsights';

interface InsightsTabProps {
  onApplySuggestion: (suggestion: string) => void;
}

const InsightsTab: React.FC<InsightsTabProps> = ({ onApplySuggestion }) => {
  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-6">
        <ProductivityTips onApplySuggestion={onApplySuggestion} />
        <TaskInsights />
      </div>
    </ScrollArea>
  );
};

export default InsightsTab;
