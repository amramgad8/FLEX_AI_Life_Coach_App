
import { X, Bot, Database, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AI_MODELS } from '@/models/AIPlanner';

interface ChatbotHeaderProps {
  aiModel: string;
  onClose: () => void;
}

const ChatbotHeader = ({ aiModel, onClose }: ChatbotHeaderProps) => {
  const currentModel = AI_MODELS.find(model => model.id === aiModel) || AI_MODELS[0];
  
  const getIconComponent = () => {
    switch (currentModel.icon) {
      case 'Bot':
        return <Bot className="text-white h-5 w-5" />;
      case 'Database':
        return <Database className="text-white h-5 w-5" />;
      case 'Sparkles':
        return <Sparkles className="text-white h-5 w-5" />;
      default:
        return <Bot className="text-white h-5 w-5" />;
    }
  };

  return (
    <div className="bg-flex-gradient p-3 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className={`w-8 h-8 rounded-full bg-white/20 flex items-center justify-center`}>
          {getIconComponent()}
        </div>
        <div>
          <h3 className="font-semibold text-white">Flex Assistant</h3>
          <div className="flex items-center gap-1">
            <span className="text-xs text-white/70">
              {currentModel.name}
            </span>
            <div className="h-1.5 w-1.5 rounded-full bg-green-300 animate-pulse"></div>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-1">
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-7 w-7 text-white hover:bg-white/20 rounded-full"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default ChatbotHeader;