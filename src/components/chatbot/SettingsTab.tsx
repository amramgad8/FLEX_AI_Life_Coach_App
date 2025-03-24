
import { Textarea } from '@/components/ui/textarea';
import AIModelSelector from './AIModelSelector';

interface SettingsTabProps {
  aiModel: string;
  onAIModelChange: (modelId: string) => void;
}

const SettingsTab = ({ aiModel, onAIModelChange }: SettingsTabProps) => {
  return (
    <div className="p-4">
      <div className="space-y-4">
        <AIModelSelector currentModel={aiModel} onModelChange={onAIModelChange} />
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Custom Instructions</label>
          <Textarea 
            placeholder="Add custom instructions for the AI assistant"
            className="resize-none"
            rows={3}
          />
          <p className="text-xs text-gray-500">
            These instructions will guide how the AI assistant interacts with you and your tasks.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SettingsTab;
