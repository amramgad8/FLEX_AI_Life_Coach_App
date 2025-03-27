import React from 'react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Trash2, Sparkles, Bot, Zap } from 'lucide-react';

interface SettingsTabProps {
  aiModel: string;
  onAIModelChange: (model: string) => void;
  onClearChat?: () => void;
}

const SettingsTab: React.FC<SettingsTabProps> = ({ 
  aiModel, 
  onAIModelChange,
  onClearChat 
}) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-sm font-medium">AI Model</h3>
        <RadioGroup 
          value={aiModel} 
          onValueChange={onAIModelChange}
          className="space-y-2"
        >
          <div className="flex items-center space-x-2 rounded-md border p-2 hover:bg-muted/50">
            <RadioGroupItem value="gpt-3.5" id="gpt-3.5" />
            <Label htmlFor="gpt-3.5" className="flex flex-1 items-center gap-2 cursor-pointer">
              <Bot className="h-4 w-4 text-green-500" />
              <div>
                <p className="text-sm font-medium">GPT-3.5</p>
                <p className="text-xs text-muted-foreground">Fast responses, good for simple tasks</p>
              </div>
            </Label>
          </div>
          
          <div className="flex items-center space-x-2 rounded-md border p-2 hover:bg-muted/50">
            <RadioGroupItem value="gpt-4" id="gpt-4" />
            <Label htmlFor="gpt-4" className="flex flex-1 items-center gap-2 cursor-pointer">
              <Sparkles className="h-4 w-4 text-blue-500" />
              <div>
                <p className="text-sm font-medium">GPT-4</p>
                <p className="text-xs text-muted-foreground">More capable, better for complex tasks</p>
              </div>
            </Label>
          </div>
          
          <div className="flex items-center space-x-2 rounded-md border p-2 hover:bg-muted/50">
            <RadioGroupItem value="claude-3" id="claude-3" />
            <Label htmlFor="claude-3" className="flex flex-1 items-center gap-2 cursor-pointer">
              <Zap className="h-4 w-4 text-purple-500" />
              <div>
                <p className="text-sm font-medium">Claude 3</p>
                <p className="text-xs text-muted-foreground">Anthropic's alternative to GPT models</p>
              </div>
            </Label>
          </div>
        </RadioGroup>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between">
          <Label htmlFor="temperature" className="text-sm font-medium">AI Creativity</Label>
          <span className="text-xs text-muted-foreground">0.7</span>
        </div>
        <Slider
          id="temperature"
          defaultValue={[0.7]}
          max={1}
          step={0.1}
          className="py-2"
        />
        <p className="text-xs text-muted-foreground">Higher values make responses more creative but less predictable</p>
      </div>
      
      <div className="flex items-center justify-between space-x-2 py-2">
        <Label htmlFor="memory" className="text-sm font-medium">Context Memory</Label>
        <Switch id="memory" defaultChecked />
      </div>
      
      <div className="flex items-center justify-between space-x-2 py-2">
        <Label htmlFor="suggestions" className="text-sm font-medium">Show Suggestions</Label>
        <Switch id="suggestions" defaultChecked />
      </div>
      
      {onClearChat && (
        <Button 
          variant="destructive" 
          size="sm"
          className="w-full text-sm flex items-center gap-2"
          onClick={onClearChat}
        >
          <Trash2 className="h-4 w-4" />
          Clear Chat History
        </Button>
      )}
    </div>
  );
};

export default SettingsTab;
