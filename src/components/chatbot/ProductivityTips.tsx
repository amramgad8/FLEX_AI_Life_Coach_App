
import { Button } from '@/components/ui/button';
import { ArrowUpRight } from 'lucide-react';
import { PRODUCTIVITY_TIPS } from './constants';

interface ProductivityTipsProps {
  onApplySuggestion: (suggestion: string) => void;
}

const ProductivityTips = ({ onApplySuggestion }: ProductivityTipsProps) => {
  return (
    <div className="p-4 border-b">
      <h3 className="text-sm font-medium mb-2">Productivity Tips</h3>
      <div className="space-y-2">
        {PRODUCTIVITY_TIPS.map((tip, index) => (
          <div key={index} className="bg-gray-50 rounded-lg p-3 text-sm relative group">
            <p>{tip}</p>
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6 text-flex-green hover:bg-flex-green/10"
                onClick={() => onApplySuggestion(tip)}
              >
                <ArrowUpRight className="h-3 w-3" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductivityTips;
