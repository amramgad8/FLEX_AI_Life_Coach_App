
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { toast } from "@/components/ui/use-toast";

const PrivacyTab = () => {
  const [privacyMode, setPrivacyMode] = useState(false);
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  
  // Load settings from localStorage on component mount
  useEffect(() => {
    const savedSettings = JSON.parse(localStorage.getItem('userSettings') || '{}');
    if (savedSettings) {
      setPrivacyMode(savedSettings.privacyMode ?? false);
      setTwoFactorAuth(savedSettings.twoFactorAuth ?? false);
    }
  }, []);
  
  const handleToggleTwoFactor = () => {
    const newValue = !twoFactorAuth;
    setTwoFactorAuth(newValue);
    
    if (newValue) {
      toast({
        title: "Two-factor authentication",
        description: "In a real app, this would guide you through setting up 2FA.",
        duration: 3000,
      });
    } else {
      toast({
        title: "Two-factor authentication disabled",
        description: "2FA has been turned off for your account.",
        duration: 2000,
      });
    }
  };
  
  const savePrivacySettings = () => {
    // Save all settings to localStorage
    const savedSettings = JSON.parse(localStorage.getItem('userSettings') || '{}');
    const updatedSettings = { 
      ...savedSettings, 
      privacyMode,
      twoFactorAuth
    };
    localStorage.setItem('userSettings', JSON.stringify(updatedSettings));
    
    toast({
      title: "Privacy settings saved",
      description: "Your privacy settings have been updated successfully.",
      duration: 2000,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Privacy & Security</CardTitle>
        <CardDescription>
          Manage your privacy settings and secure your account.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Privacy</h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="text-sm font-medium">Privacy Mode</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Hide sensitive task information from others</div>
              </div>
              <Switch 
                checked={privacyMode} 
                onCheckedChange={setPrivacyMode}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="text-sm font-medium">Activity Status</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Show when you're actively using Flex</div>
              </div>
              <Switch checked={true} />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="text-sm font-medium">Data Collection</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Allow anonymous usage data to improve our service</div>
              </div>
              <Switch checked={true} />
            </div>
          </div>
        </div>
        
        <Separator />
        
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Security</h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="text-sm font-medium">Two-Factor Authentication</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Add an extra layer of security to your account</div>
              </div>
              <Switch 
                checked={twoFactorAuth} 
                onCheckedChange={handleToggleTwoFactor}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="text-sm font-medium">Login Alerts</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Get notified of new logins to your account</div>
              </div>
              <Switch checked={true} />
            </div>
          </div>
        </div>
        
        <Separator />
        
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Data Management</h3>
          
          <div className="flex flex-col gap-3">
            <Button variant="outline" className="justify-start">
              Export Your Data
            </Button>
            <Button variant="outline" className="justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20">
              Delete All Data
            </Button>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={savePrivacySettings}>Save Privacy Settings</Button>
      </CardFooter>
    </Card>
  );
};

export default PrivacyTab;