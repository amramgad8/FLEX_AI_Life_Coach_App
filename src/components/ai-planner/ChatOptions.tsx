
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, CheckCircle2, ChevronRight, Check } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { UserPreferences } from '@/models/AIPlanner';
import { QuestionState } from './ChatPlannerFlow';

interface ChatOptionsProps {
  question: QuestionState;
  onAnswer: (value: string | number | string[]) => void;
  preferences: UserPreferences;
}

const ChatOptions = ({ question, onAnswer, preferences }: ChatOptionsProps) => {
  const [value, setValue] = useState<string | number | string[]>('');
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [customValue, setCustomValue] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };
  
  const handleSliderChange = (newValue: number[]) => {
    setValue(newValue[0]);
  };

  const handleOptionClick = (optionValue: string) => {
    if (optionValue === 'custom') {
      setShowCustomInput(true);
      return;
    }
    
    setValue(optionValue);
    onAnswer(optionValue);
  };

  const handleCustomSubmit = () => {
    if (customValue) {
      onAnswer(customValue);
    }
  };

  const handleCheckboxChange = (checked: boolean, optionValue: string) => {
    if (checked) {
      const newSelected = [...selectedOptions, optionValue];
      setSelectedOptions(newSelected);
      setValue(newSelected);
    } else {
      const newSelected = selectedOptions.filter(v => v !== optionValue);
      setSelectedOptions(newSelected);
      setValue(newSelected);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value || (Array.isArray(value) && value.length > 0)) {
      onAnswer(value);
    }
  };

  const renderInputByType = () => {
    switch (question.inputType) {
      case 'time':
        return (
          <form onSubmit={handleSubmit} className="mt-3 flex gap-2">
            <div className="relative flex-1">
              <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                type="time"
                value={value as string}
                onChange={handleTimeChange}
                className="pl-9"
                required
              />
            </div>
            <Button type="submit" className="bg-flex-green hover:bg-flex-green-dark">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </form>
        );

      case 'text':
        return (
          <form onSubmit={handleSubmit} className="mt-3 flex gap-2">
            <Input
              type="text"
              value={value as string}
              onChange={handleTextChange}
              placeholder={question.placeholder}
              className="flex-1"
              required
            />
            <Button type="submit" className="bg-flex-green hover:bg-flex-green-dark">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </form>
        );

      case 'slider':
        const sliderOptions = question.sliderOptions || { min: 0, max: 10, step: 1, defaultValue: 3 };
        return (
          <div className="mt-4 space-y-5">
            <div className="px-2">
              <Slider
                defaultValue={[sliderOptions.defaultValue]}
                min={sliderOptions.min}
                max={sliderOptions.max}
                step={sliderOptions.step}
                onValueChange={handleSliderChange}
                className="w-full"
              />
            </div>
            <div className="flex justify-between px-2 text-xs text-gray-600">
              {Array.from({ length: sliderOptions.max - sliderOptions.min + 1 }, (_, i) => i + sliderOptions.min).map((num) => (
                <span key={num}>{num}</span>
              ))}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Selected: {value || sliderOptions.defaultValue}</span>
              <Button 
                onClick={() => onAnswer(value || sliderOptions.defaultValue)} 
                className="bg-flex-green hover:bg-flex-green-dark"
              >
                Confirm
              </Button>
            </div>
          </div>
        );

      case 'select':
        return (
          <div className="mt-3 grid grid-cols-2 gap-2">
            {question.options?.map((option) => (
              <Button
                key={option.value}
                variant="outline"
                className={`flex justify-center items-center h-11 ${
                  value === option.value ? 'border-flex-green bg-flex-green/10 text-flex-green' : ''
                }`}
                onClick={() => handleOptionClick(option.value)}
              >
                {value === option.value && <Check className="mr-1 h-4 w-4" />}
                {option.label}
              </Button>
            ))}
          </div>
        );

      case 'multi-select':
        return (
          <div className="mt-3 space-y-4">
            <div className="space-y-2">
              {question.options?.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={option.value}
                    checked={selectedOptions.includes(option.value)}
                    onCheckedChange={(checked) => 
                      handleCheckboxChange(checked as boolean, option.value)
                    }
                  />
                  <label
                    htmlFor={option.value}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {option.label}
                  </label>
                </div>
              ))}
            </div>
            <Button 
              onClick={() => onAnswer(selectedOptions)}
              className="w-full bg-flex-green hover:bg-flex-green-dark"
              disabled={selectedOptions.length === 0}
            >
              Confirm Selection
            </Button>
          </div>
        );

      default:
        return null;
    }
  };

  if (showCustomInput) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-3 space-y-2"
      >
        <div className="flex gap-2">
          <Input
            type="text"
            value={customValue}
            onChange={(e) => setCustomValue(e.target.value)}
            placeholder="Enter custom value..."
            className="flex-1"
          />
          <Button 
            onClick={handleCustomSubmit} 
            className="bg-flex-green hover:bg-flex-green-dark"
            disabled={!customValue}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="text-xs"
          onClick={() => setShowCustomInput(false)}
        >
          Back to options
        </Button>
      </motion.div>
    );
  }

  return (
    <div className="p-2">
      {renderInputByType()}
    </div>
  );
};

export default ChatOptions;