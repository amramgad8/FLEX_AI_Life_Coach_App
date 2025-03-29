
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { toast } from "@/components/ui/use-toast";

const NotificationsTab = () => {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [soundEffects, setSoundEffects] = useState(true);
  
  const saveNotificationSettings = () => {
    // In a real app, this would save to localStorage or an API
    const settings = {
      emailNotifications,
      pushNotifications,
      soundEffects
    };
    
    localStorage.setItem('notificationSettings', JSON.stringify(settings));
    
    toast({
      title: "Notification preferences saved",
      description: "Your notification settings have been updated successfully.",
      duration: 2000,
    });
  };
  
  // Load settings from localStorage on component mount
  React.useEffect(() => {
    const savedSettings = JSON.parse(localStorage.getItem('notificationSettings') || '{}');
    if (savedSettings) {
      setEmailNotifications(savedSettings.emailNotifications ?? true);
      setPushNotifications(savedSettings.pushNotifications ?? true);
      setSoundEffects(savedSettings.soundEffects ?? true);
    }
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Preferences</CardTitle>
        <CardDescription>
          Decide how and when you want to be notified about activity on Flex.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Email Notifications</h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="text-sm font-medium">Task Reminders</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Get reminders about upcoming and due tasks</div>
              </div>
              <Switch 
                checked={emailNotifications} 
                onCheckedChange={setEmailNotifications} 
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="text-sm font-medium">Weekly Digests</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Receive a summary of your weekly progress</div>
              </div>
              <Switch checked={true} />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="text-sm font-medium">Product Updates</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Learn about new features and improvements</div>
              </div>
              <Switch checked={true} />
            </div>
          </div>
        </div>
        
        <Separator />
        
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Push Notifications</h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="text-sm font-medium">Enable Push Notifications</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Receive notifications directly to your device</div>
              </div>
              <Switch 
                checked={pushNotifications} 
                onCheckedChange={setPushNotifications}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="text-sm font-medium">Daily Reminders</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Get daily reminders for important tasks</div>
              </div>
              <Switch checked={true} />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="text-sm font-medium">Goal Achievements</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Be notified when you reach your goals</div>
              </div>
              <Switch checked={true} />
            </div>
          </div>
        </div>
        
        <Separator />
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="text-sm font-medium">Sound Effects</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Play sounds for notifications and actions</div>
            </div>
            <Switch 
              checked={soundEffects} 
              onCheckedChange={setSoundEffects}
            />
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={saveNotificationSettings}>Save Changes</Button>
      </CardFooter>
    </Card>
  );
};

export default NotificationsTab;