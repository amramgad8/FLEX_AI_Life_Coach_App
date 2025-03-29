
import React, { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { toast } from "@/hooks/use-toast";
import { useTheme } from '@/contexts/ThemeContext';

const AppearanceTab = () => {
  const { darkMode, toggleDarkMode } = useTheme();
  
  const handleThemeToggle = () => {
    toggleDarkMode();
    
    // Show a toast notification
    toast({
      title: darkMode ? "Light mode activated" : "Dark mode activated",
      description: darkMode 
        ? "The application is now using light mode." 
        : "The application is now using dark mode.",
      duration: 2000,
    });
  };
  
  const saveAppearanceSettings = () => {
    // This is already being handled in the ThemeContext when toggleDarkMode is called
    // Just show feedback to the user
    toast({
      title: "Appearance settings saved",
      description: "Your appearance preferences have been updated.",
      duration: 2000,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Appearance</CardTitle>
        <CardDescription>
          Customize the appearance of the application.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Theme</h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="text-sm font-medium">Dark Mode</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Use dark theme across the application</div>
              </div>
              <Switch 
                checked={darkMode}
                onCheckedChange={handleThemeToggle}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="text-sm font-medium">High Contrast</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Increase color contrast of the interface</div>
              </div>
              <Switch />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="text-sm font-medium">Reduce Motion</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Limit animations and transitions</div>
              </div>
              <Switch />
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Layout</h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="text-sm font-medium">Compact View</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Reduce spacing in the UI</div>
              </div>
              <Switch />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="text-sm font-medium">Focus Mode</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Hide non-essential elements</div>
              </div>
              <Switch />
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Text</h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="text-sm font-medium">Dyslexia-friendly Font</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Use a font that's easier to read</div>
              </div>
              <Switch />
            </div>
            
            <div className="space-y-0.5">
              <div className="text-sm font-medium">Font Size</div>
              <div className="grid grid-cols-3 gap-2 pt-2">
                <Button variant="outline" size="sm">Small</Button>
                <Button variant="outline" size="sm" className="bg-primary/10">Medium</Button>
                <Button variant="outline" size="sm">Large</Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={saveAppearanceSettings}>Save Appearance Settings</Button>
      </CardFooter>
    </Card>
  );
};

export default AppearanceTab;