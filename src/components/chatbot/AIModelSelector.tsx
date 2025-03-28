
import { Bot, Database, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { Badge } from '@/components/ui/badge';
import { AI_MODELS } from '@/models/AIPlanner';

interface AIModelSelectorProps {
  currentModel: string;
  onModelChange: (modelId: string) => void;
}

const AIModelSelector = ({ currentModel, onModelChange }: AIModelSelectorProps) => {
  const handleChangeModel = (modelId: string) => {
    onModelChange(modelId);
    
    const selectedModel = AI_MODELS.find(model => model.id === modelId);
    
    toast({
      title: "AI Model Changed",
      description: `Now using ${selectedModel?.name || 'Default'} model`,
    });
  };

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'Bot':
        return <Bot className="mr-2 h-4 w-4" />;
      case 'Database':
        return <Database className="mr-2 h-4 w-4" />;
      case 'Sparkles':
        return <Sparkles className="mr-2 h-4 w-4" />;
      default:
        return <Bot className="mr-2 h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium">AI Model</label>
      <div className="grid grid-cols-1 gap-3">
        {AI_MODELS.map((model) => (
          <div 
            key={model.id}
            className={`border rounded-lg p-3 cursor-pointer transition-all hover:border-flex-green ${
              currentModel === model.id ? 'border-2 border-flex-green bg-flex-green/5' : 'border-gray-200'
            }`}
            onClick={() => handleChangeModel(model.id)}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center ${model.className}`}>
                  {getIconComponent(model.icon)}
                </div>
                <span className="ml-2 font-medium">{model.name}</span>
              </div>
              {currentModel === model.id && (
                <Badge variant="outline" className="bg-flex-green/10 text-flex-green border-flex-green text-xs">
                  Active
                </Badge>
              )}
            </div>
            <p className="text-xs text-gray-600 mb-2">{model.description}</p>
            <div className="flex flex-wrap gap-1 mt-1">
              {model.capabilities.map((capability, index) => (
                <Badge 
                  key={index} 
                  variant="outline" 
                  className="text-xs bg-gray-50"
                >
                  {capability}
                </Badge>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AIModelSelector;