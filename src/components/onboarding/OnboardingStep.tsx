
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ExternalLink } from 'lucide-react';

interface Option {
  icon?: string;
  label: string;
  value: string;
}

interface Subfield {
  id: string;
  label: string;
  icon: string;
  options?: string[];
}

interface OnboardingStepProps {
  step: {
    question: string;
    field: string;
    type?: string;
    options?: Option[];
    helpText?: string;
    helpLink?: string;
    subfields?: Subfield[];
  };
  value: any;
  onChange: (value: any) => void;
}

const OnboardingStep: React.FC<OnboardingStepProps> = ({ step, value, onChange }) => {
  const { question, options, helpText, helpLink, type, subfields } = step;

  // Render standard multiple choice options
  if (options && !type) {
    return (
      <Card className="shadow-lg border-0">
        <CardHeader className="text-center pb-4 border-b">
          <CardTitle className="text-2xl font-bold">{question}</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {options.map((option) => (
              <motion.div
                key={option.value}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <Button
                  variant={value === option.value ? "default" : "outline"}
                  className={`w-full h-24 flex flex-col items-center justify-center gap-2 p-4 ${
                    value === option.value ? "bg-green-100 border-green-500 text-green-800" : ""
                  }`}
                  onClick={() => onChange(option.value)}
                >
                  <span className="text-2xl">{option.icon}</span>
                  <span className="font-medium">{option.label}</span>
                </Button>
              </motion.div>
            ))}
          </div>
          
          {helpText && helpLink && (
            <div className="mt-6 text-center text-sm">
              <p className="text-gray-600">{helpText}</p>
              <a
                href={helpLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline flex items-center justify-center mt-1"
              >
                Take the test here <ExternalLink className="h-3 w-3 ml-1" />
              </a>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  // Render MBTI selection
  if (type === 'mbti') {
    return (
      <Card className="shadow-lg border-0">
        <CardHeader className="text-center pb-4 border-b">
          <CardTitle className="text-2xl font-bold">{question}</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4">
            {options?.map((option) => (
              <motion.div
                key={option.value}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant={value === option.value ? "default" : "outline"}
                  className={`w-full ${
                    value === option.value ? "bg-green-100 border-green-500 text-green-800" : ""
                  }`}
                  onClick={() => onChange(option.value)}
                >
                  {option.label}
                </Button>
              </motion.div>
            ))}
          </div>
          
          {helpText && helpLink && (
            <div className="mt-6 text-center text-sm">
              <p className="text-gray-600">{helpText}</p>
              <a
                href={helpLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline flex items-center justify-center mt-1"
              >
                Take the test here <ExternalLink className="h-3 w-3 ml-1" />
              </a>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  // Render personal details form
  if (type === 'personal-details') {
    const handleChange = (subfield: string, subValue: string) => {
      const newValue = { ...value, [subfield]: subValue };
      onChange(newValue);
    };

    return (
      <Card className="shadow-lg border-0">
        <CardHeader className="text-center pb-4 border-b">
          <CardTitle className="text-2xl font-bold">{question}</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4 mt-4">
            {subfields?.map((subfield) => (
              <div key={subfield.id} className="space-y-2">
                <Label htmlFor={subfield.id} className="flex items-center">
                  <span className="mr-2">{subfield.icon}</span>
                  {subfield.label}
                </Label>
                
                {subfield.options ? (
                  <Select 
                    value={value[subfield.id] || ''}
                    onValueChange={(val) => handleChange(subfield.id, val)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={`Select ${subfield.label.toLowerCase()}`} />
                    </SelectTrigger>
                    <SelectContent>
                      {subfield.options.map(option => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    id={subfield.id}
                    type={subfield.id === 'age' ? 'number' : 'text'}
                    value={value[subfield.id] || ''}
                    onChange={(e) => handleChange(subfield.id, e.target.value)}
                    placeholder={`Enter your ${subfield.label.toLowerCase()}`}
                  />
                )}
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-4 text-center">
            This information is optional and helps us personalize your experience.
          </p>
        </CardContent>
      </Card>
    );
  }

  return null;
};

export default OnboardingStep;
