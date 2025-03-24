
import { ZapIcon, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

interface AIModelSelectorProps {
  currentModel: string;
  onModelChange: (modelId: string) => void;
}

const AIModelSelector = ({ currentModel, onModelChange }: AIModelSelectorProps) => {
  const handleChangeModel = (modelName: string) => {
    onModelChange(modelName);
    toast({
      title: "AI Model Changed",
      description: `Now using ${modelName === 'default' ? 'Default Assistant' : modelName === 'rag' ? 'RAG-enhanced' : 'Advanced AI'} model`,
    });
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">AI Model</label>
      <div className="grid grid-cols-1 gap-2">
        <Button
          variant={currentModel === 'default' ? 'default' : 'outline'}
          className={currentModel === 'default' ? 'bg-flex-green text-white' : ''}
          onClick={() => handleChangeModel('default')}
          size="sm"
        >
          <Bot className="mr-2 h-4 w-4" />
          Standard Assistant
        </Button>
        <Button
          variant={currentModel === 'rag' ? 'default' : 'outline'}
          className={currentModel === 'rag' ? 'bg-flex-yellow text-white' : ''}
          onClick={() => handleChangeModel('rag')}
          size="sm"
        >
          <Bot className="mr-2 h-4 w-4" />
          RAG-enhanced
        </Button>
        <Button
          variant={currentModel === 'advanced' ? 'default' : 'outline'}
          className={currentModel === 'advanced' ? 'bg-flex-orange text-white' : ''}
          onClick={() => handleChangeModel('advanced')}
          size="sm"
        >
          <ZapIcon className="mr-2 h-4 w-4" />
          Advanced AI
        </Button>
      </div>
    </div>
  );
};

export default AIModelSelector;
