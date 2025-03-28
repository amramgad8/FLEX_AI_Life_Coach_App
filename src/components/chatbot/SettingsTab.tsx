
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import AIModelSelector from './AIModelSelector';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface SettingsTabProps {
  aiModel: string;
  onAIModelChange: (modelId: string) => void;
}

const SettingsTab = ({ aiModel, onAIModelChange }: SettingsTabProps) => {
  return (
    <div className="p-4 space-y-6 h-80 overflow-y-auto">
      <AIModelSelector currentModel={aiModel} onModelChange={onAIModelChange} />
      
      <Separator />
      
      <div className="space-y-3">
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
      
      <Separator />
      
      <div className="space-y-3">
        <h3 className="text-sm font-medium">Preferences</h3>
        
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="ai-suggestions">AI Suggestions</Label>
            <p className="text-xs text-gray-500">Allow the assistant to provide proactive suggestions</p>
          </div>
          <Switch id="ai-suggestions" defaultChecked />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="learn-patterns">Learn from Usage</Label>
            <p className="text-xs text-gray-500">Allow the assistant to learn from your interactions</p>
          </div>
          <Switch id="learn-patterns" defaultChecked />
        </div>
      </div>
    </div>
  );
};

export default SettingsTab;