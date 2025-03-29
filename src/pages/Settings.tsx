
import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Bell, Sun, Shield } from 'lucide-react';
import AccountTab from '@/components/settings/AccountTab';
import NotificationsTab from '@/components/settings/NotificationsTab';
import AppearanceTab from '@/components/settings/AppearanceTab';
import PrivacyTab from '@/components/settings/PrivacyTab';

const Settings = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background dark:bg-gray-900">
      <Navbar />
      
      <div className="pt-28 pb-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 text-foreground dark:text-white">Settings</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Customize your Flex experience and manage your account preferences.
          </p>
          
          <Tabs defaultValue="account" className="w-full">
            <TabsList className="grid grid-cols-4 mb-8">
              <TabsTrigger value="account">
                <User className="mr-2 h-4 w-4" />
                Account
              </TabsTrigger>
              <TabsTrigger value="notifications">
                <Bell className="mr-2 h-4 w-4" />
                Notifications
              </TabsTrigger>
              <TabsTrigger value="appearance">
                <Sun className="mr-2 h-4 w-4" />
                Appearance
              </TabsTrigger>
              <TabsTrigger value="privacy">
                <Shield className="mr-2 h-4 w-4" />
                Privacy
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="account">
              <AccountTab />
            </TabsContent>
            
            <TabsContent value="notifications">
              <NotificationsTab />
            </TabsContent>
            
            <TabsContent value="appearance">
              <AppearanceTab />
            </TabsContent>
            
            <TabsContent value="privacy">
              <PrivacyTab />
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Settings;