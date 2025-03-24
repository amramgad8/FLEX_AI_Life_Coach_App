
import ProductivityTips from './ProductivityTips';
import TaskInsights from './TaskInsights';

interface InsightsTabProps {
  onApplySuggestion: (suggestion: string) => void;
}

const InsightsTab = ({ onApplySuggestion }: InsightsTabProps) => {
  return (
    <div className="h-80 overflow-y-auto">
      <ProductivityTips onApplySuggestion={onApplySuggestion} />
      <TaskInsights />
    </div>
  );
};

export default InsightsTab;
