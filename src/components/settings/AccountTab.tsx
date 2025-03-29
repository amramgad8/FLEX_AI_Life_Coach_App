
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Shield, LogOut } from 'lucide-react';
import { toast } from "@/components/ui/use-toast";
import { useForm } from 'react-hook-form';

const AccountTab = () => {
  // State for dialogs
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  const [subscriptionDialogOpen, setSubscriptionDialogOpen] = useState(false);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);
  
  // Form for profile edit
  const profileForm = useForm({
    defaultValues: {
      name: "Alex Morgan",
      email: "alex.morgan@example.com",
      timeZone: "Pacific Standard Time (UTC-8)"
    }
  });
  
  // Form for password change
  const passwordForm = useForm({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    }
  });
  
  const handleSaveProfile = (data) => {
    // In a real app, this would call an API to update the user profile
    toast({
      title: "Profile updated",
      description: "Your profile information has been saved successfully.",
      duration: 2000,
    });
    setProfileDialogOpen(false);
  };
  
  const handleSavePassword = (data) => {
    // Validate password
    if (data.newPassword !== data.confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }
    
    // In a real app, this would call an API to update the password
    toast({
      title: "Password changed",
      description: "Your password has been updated successfully.",
      duration: 2000,
    });
    passwordForm.reset();
    setPasswordDialogOpen(false);
  };
  
  const handleLogout = () => {
    // In a real app, this would call an authentication service to log out
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
      duration: 2000,
    });
    setLogoutConfirmOpen(false);
    // In a real app, redirect to login page
    // window.location.href = "/login";
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
          <CardDescription>
            Manage your personal information and account details.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-medium">Profile Information</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Update your name and contact information.</p>
              </div>
              <Button variant="outline" onClick={() => setProfileDialogOpen(true)}>Edit Profile</Button>
            </div>
            
            <div className="grid gap-4 py-4 px-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4">
                <div className="text-sm font-medium">Name</div>
                <div className="md:col-span-2 text-sm">{profileForm.getValues().name}</div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4">
                <div className="text-sm font-medium">Email</div>
                <div className="md:col-span-2 text-sm">{profileForm.getValues().email}</div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4">
                <div className="text-sm font-medium">Time Zone</div>
                <div className="md:col-span-2 text-sm">{profileForm.getValues().timeZone}</div>
              </div>
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-medium">Subscription</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Manage your subscription plan and billing details.</p>
              </div>
              <Button variant="outline" onClick={() => setSubscriptionDialogOpen(true)}>Manage Subscription</Button>
            </div>
            
            <div className="grid gap-4 py-4 px-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4">
                <div className="text-sm font-medium">Current Plan</div>
                <div className="md:col-span-2 text-sm">
                  <span className="font-medium text-green-600 dark:text-green-400">Pro Plan</span> - $9.99/month
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4">
                <div className="text-sm font-medium">Billing Cycle</div>
                <div className="md:col-span-2 text-sm">Monthly (Next payment: Jun 15, 2023)</div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4">
                <div className="text-sm font-medium">Payment Method</div>
                <div className="md:col-span-2 text-sm">Visa ending in 4242</div>
              </div>
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Account Actions</h3>
            
            <div className="flex flex-col gap-3">
              <Button 
                variant="outline" 
                className="justify-start"
                onClick={() => setPasswordDialogOpen(true)}
              >
                <Shield className="mr-2 h-4 w-4" />
                Change Password
              </Button>
              <Button 
                variant="outline" 
                className="justify-start text-orange-600 hover:text-orange-700 hover:bg-orange-50 dark:hover:bg-orange-900/20"
                onClick={() => setLogoutConfirmOpen(true)}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Log Out
              </Button>
              <Button variant="outline" className="justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20">
                Delete Account
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Edit Profile Dialog */}
      <Dialog open={profileDialogOpen} onOpenChange={setProfileDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>
              Update your personal information below.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={profileForm.handleSubmit(handleSaveProfile)}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <FormLabel>Name</FormLabel>
                <Input
                  {...profileForm.register('name')}
                  placeholder="Your full name"
                />
              </div>
              <div className="space-y-2">
                <FormLabel>Email</FormLabel>
                <Input
                  {...profileForm.register('email')}
                  type="email"
                  placeholder="Your email address"
                />
              </div>
              <div className="space-y-2">
                <FormLabel>Time Zone</FormLabel>
                <select 
                  {...profileForm.register('timeZone')}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md text-sm dark:bg-gray-800"
                >
                  <option value="Pacific Standard Time (UTC-8)">Pacific Standard Time (UTC-8)</option>
                  <option value="Mountain Standard Time (UTC-7)">Mountain Standard Time (UTC-7)</option>
                  <option value="Central Standard Time (UTC-6)">Central Standard Time (UTC-6)</option>
                  <option value="Eastern Standard Time (UTC-5)">Eastern Standard Time (UTC-5)</option>
                </select>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Subscription Dialog */}
      <Dialog open={subscriptionDialogOpen} onOpenChange={setSubscriptionDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Manage Subscription</DialogTitle>
            <DialogDescription>
              View and update your subscription details.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Current Plan</h4>
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                <div>
                  <p className="font-medium text-green-600 dark:text-green-400">Pro Plan</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">$9.99/month</p>
                </div>
                <span className="text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 px-2 py-1 rounded-full">
                  Active
                </span>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Available Plans</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-md">
                  <div>
                    <p className="font-medium">Basic Plan</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">$4.99/month</p>
                  </div>
                  <Button variant="outline" size="sm">Downgrade</Button>
                </div>
                <div className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-md">
                  <div>
                    <p className="font-medium">Pro Plan</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">$9.99/month</p>
                  </div>
                  <Button variant="outline" size="sm" disabled>Current</Button>
                </div>
                <div className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-md">
                  <div>
                    <p className="font-medium">Team Plan</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">$19.99/month</p>
                  </div>
                  <Button variant="outline" size="sm">Upgrade</Button>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSubscriptionDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Change Password Dialog */}
      <Dialog open={passwordDialogOpen} onOpenChange={setPasswordDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
            <DialogDescription>
              Enter your current password and a new password.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={passwordForm.handleSubmit(handleSavePassword)}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <FormLabel>Current Password</FormLabel>
                <Input
                  {...passwordForm.register('currentPassword')}
                  type="password"
                  placeholder="Your current password"
                  required
                />
              </div>
              <div className="space-y-2">
                <FormLabel>New Password</FormLabel>
                <Input
                  {...passwordForm.register('newPassword')}
                  type="password"
                  placeholder="Your new password"
                  required
                />
              </div>
              <div className="space-y-2">
                <FormLabel>Confirm New Password</FormLabel>
                <Input
                  {...passwordForm.register('confirmPassword')}
                  type="password"
                  placeholder="Confirm your new password"
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Update Password</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Logout Confirmation Dialog */}
      <Dialog open={logoutConfirmOpen} onOpenChange={setLogoutConfirmOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Log Out</DialogTitle>
            <DialogDescription>
              Are you sure you want to log out of your account?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-between">
            <Button variant="outline" onClick={() => setLogoutConfirmOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleLogout}>Log Out</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AccountTab;